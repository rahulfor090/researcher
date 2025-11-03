import express from "express";
import db from "../models/index.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import Stripe from "stripe";

const router = express.Router();
const UserPlan = db.UserPlan;
const User = db.User;
const Payment = db.Payment;
const Plan = db.Plan;

const stripe = new Stripe(env.stripe.secretKey);

function debugLog(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log("\x1b[35m[Stripe Debug]\x1b[0m", ...args);
  }
}

/**
 * Create a checkout session
 * 1. amount from plans table (price column)
 * 2. currency hardcoded as USD
 * 3. payment_method set as "Stripe" in DB (updated in webhook below)
 */
router.post("/create-checkout-session", requireAuth, async (req, res) => {
  debugLog("Received /create-checkout-session request", { body: req.body });

  const userId = req.user.id;
  const { planId } = req.body; // frontend must send planId

  // 1. Get plan from DB
  const plan = await Plan?.findOne?.({ where: { id: planId } });
  if (!plan) {
    debugLog("Plan not found for id:", planId);
    return res.status(404).json({ error: "Plan not found." });
  }
  const amount = Math.round(parseFloat(plan.price) * 100); // Convert to cents
  
  // 2. Hardcode currency as USD
  const currency = "usd";
  const payment_method = "Stripe"; // Default, update after payment

  try {
    debugLog("Creating Stripe checkout session...");
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: plan.name || "Research Locker Premium",
              description: plan.description || "Premium subscription for Research Locker",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.frontendBaseUrl}/paypal-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.frontendBaseUrl}/paypal-cancel`,
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
    });

    debugLog("✅ Stripe session created:", session.id);

    // Create payment record
    await Payment.create({
      user_id: userId,
      paypal_order_id: session.id, // Using same column for Stripe session ID
      amount: plan.price,
      currency: currency.toUpperCase(),
      status: "Pending",
      payment_method: payment_method,
      created_at: new Date(),
      updated_at: new Date(),
      plan_id: planId,
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    debugLog("❌ Stripe create-checkout-session error:", err.message || err, err.stack || "");
    res.status(500).json({
      error: "Failed to create Stripe checkout session",
      details: err.message,
      stack: err.stack,
    });
  }
});

/**
 * Verify payment session & update DB
 * Called by frontend after redirect from Stripe
 */
router.post("/verify-session", requireAuth, async (req, res) => {
  debugLog("Received /verify-session request", { body: req.body });

  const { sessionId } = req.body;
  const userId = req.user.id;

  if (!userId) {
    debugLog("No user ID found, unauthorized access");
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Find the payment record for this session/user
  const paymentRecord = await Payment.findOne({
    where: { user_id: userId, paypal_order_id: sessionId },
  });

  if (!paymentRecord) {
    debugLog("No payment record found for user:", userId, "sessionId:", sessionId);
    return res.status(404).json({ error: "Payment record not found." });
  }

  let session = null;
  let stripe_status = "Pending";
  let payment_intent_id = null;

  try {
    debugLog("Retrieving Stripe session for sessionId:", sessionId);
    session = await stripe.checkout.sessions.retrieve(sessionId);

    stripe_status = session.payment_status || "Pending";
    payment_intent_id = session.payment_intent || null;

    debugLog("Stripe session response:", JSON.stringify(session, null, 2));
  } catch (stripeErr) {
    debugLog("❌ Stripe API error during verification:", stripeErr.message || stripeErr, stripeErr.stack || "");
    stripe_status = "Failed";
  }

  // Normalize status to human-friendly values
  const statusMap = {
    paid: "Completed",
    unpaid: "Pending",
    no_payment_required: "Completed",
  };
  const finalStatus = statusMap[stripe_status] || "Pending";

  // Only mark the payment as Completed if Stripe status is 'paid'
  if (stripe_status === "paid") {
    await paymentRecord.update({
      status: finalStatus,
      paypal_payment_id: payment_intent_id, // Reusing column for payment_intent_id
      updated_at: new Date(),
      payment_method: "Stripe",
    });

    debugLog("Payment record marked Completed.");

    // Find current active plan for this user
    let userPlan = await UserPlan.findOne({
      where: { user_id: userId, active: true },
      order: [["end_date", "DESC"]],
    });

    const now = new Date();
    let start_date, end_date;

    if (userPlan && userPlan.end_date > now) {
      // Extend existing plan's end_date by 1 year
      start_date = userPlan.start_date;
      end_date = new Date(userPlan.end_date);
      end_date.setDate(end_date.getDate() + 365);

      await userPlan.update({
        end_date: end_date,
        payment_id: paymentRecord.id,
        updated_at: now,
      });

      debugLog(`Extended existing plan to end_date=${end_date}`);
    } else {
      start_date = now;
      end_date = new Date(now);
      end_date.setDate(end_date.getDate() + 365);

      await UserPlan.create({
        user_id: userId,
        payment_id: paymentRecord.id,
        start_date: start_date,
        end_date: end_date,
        active: true,
        created_at: now,
        updated_at: now,
      });

      debugLog(`Created new plan: start_date=${start_date}, end_date=${end_date}`);
    }

    await User.update({ plan: "pro" }, { where: { id: userId } });
    debugLog("User table 'plan' column updated to 'pro'.");

    res.json({
      status: "success",
      message: "Payment verified and subscription updated",
      session: session,
    });
  } else {
    await paymentRecord.update({
      status: finalStatus,
      updated_at: new Date(),
      payment_method: "Stripe",
    });

    debugLog(`Payment record marked as ${finalStatus} (not Completed).`);
    res.status(400).json({
      status: finalStatus,
      message: `Payment was not completed: status is ${finalStatus}`,
      session: session,
    });
  }
});

/**
 * Cancel session endpoint to mark payment as CANCELLED
 * NO authentication required for this endpoint!
 */
router.post("/cancel-session", async (req, res) => {
  debugLog("Received /cancel-session request", { body: req.body });
  const { sessionId } = req.body;

  if (!sessionId) {
    debugLog("Missing sessionId from request body");
    return res.status(400).json({ error: "Missing sessionId." });
  }

  const paymentRecord = await Payment.findOne({
    where: { paypal_order_id: sessionId },
  });

  if (!paymentRecord) {
    debugLog(`Payment record not found for sessionId: ${sessionId}`);
    return res.status(404).json({ error: "Payment record not found." });
  }

  await paymentRecord.update({
    status: "Cancelled",
    updated_at: new Date(),
  });

  debugLog(`Payment record for session ${sessionId} marked as Cancelled.`);
  res.json({ status: "Cancelled" });
});

export default router;