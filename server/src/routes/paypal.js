import express from "express";
import db from "../models/index.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js"; // JWT auth middleware
import paypal from "@paypal/checkout-server-sdk";

const router = express.Router();
const UserPlan = db.UserPlan;
const User = db.User;
const Payment = db.Payment;

function debugLog(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log("\x1b[36m[PayPal Debug]\x1b[0m", ...args);
  }
}

function environment() {
  debugLog("Setting up PayPal environment with clientId:", env.paypal.clientId);
  return new paypal.core.SandboxEnvironment(env.paypal.clientId, env.paypal.secret);
}

function client() {
  debugLog("Initializing PayPal client");
  return new paypal.core.PayPalHttpClient(environment());
}

/**
 * Create an order
 */
router.post("/create-order", requireAuth, async (req, res) => {
  debugLog("Received /create-order request", { body: req.body });

  const userId = req.user.id;
  const amount = "10.00";
  const currency = "USD";
  const payment_method = "PayPal";

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: currency, value: amount } }],
    application_context: {
      brand_name: "Research Locker",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: `${env.frontendBaseUrl}/paypal-success`,
      cancel_url: `${env.frontendBaseUrl}/paypal-cancel`
    }
  });

  try {
    debugLog("Sending create order request to PayPal...");
    const order = await client().execute(request);
    debugLog("PayPal order response:", JSON.stringify(order.result, null, 2));

    const approvalUrl = order.result.links?.find(link => link.rel === "approve")?.href;

    if (!approvalUrl) {
      debugLog("No approval URL found in order result:", order.result);
      return res.status(500).json({ error: "No approval URL from PayPal", order: order.result });
    }

    debugLog("✅ Order created:", order.result.id, "Approval URL:", approvalUrl);

    await Payment.create({
      user_id: userId,
      paypal_order_id: order.result.id,
      amount: amount,
      currency: currency,
      status: 'Pending',
      payment_method: payment_method,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.json({
      id: order.result.id,
      approvalUrl
    });
  } catch (err) {
    debugLog("❌ PayPal create-order error:", err.message || err, err.stack || "");
    res.status(500).json({
      error: "Failed to create PayPal order",
      details: err.message,
      stack: err.stack
    });
  }
});

/**
 * Capture an order & update DB
 */
router.post("/capture-order", requireAuth, async (req, res) => {
  debugLog("Received /capture-order request", { body: req.body });

  const { orderID } = req.body;
  const userId = req.user.id;

  if (!userId) {
    debugLog("No user ID found, unauthorized access");
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Find the payment record for this order/user FIRST (before PayPal capture)
  const paymentRecord = await Payment.findOne({
    where: { user_id: userId, paypal_order_id: orderID }
  });

  if (!paymentRecord) {
    debugLog("No payment record found for user:", userId, "orderID:", orderID);
    return res.status(404).json({ error: "Payment record not found." });
  }

  let capture = null;
  let paypal_status = 'Pending';
  let paypal_payment_id = null;

  try {
    debugLog("Sending capture order request to PayPal for orderID:", orderID);
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    capture = await client().execute(request);

    paypal_status = capture.result.status || 'Pending';
    paypal_payment_id =
      capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

    debugLog("PayPal capture response:", JSON.stringify(capture.result, null, 2));
  } catch (paypalErr) {
    debugLog("❌ PayPal API error during capture:", paypalErr.message || paypalErr, paypalErr.stack || "");
    paypal_status = 'Cancelled';
  }

  // Normalize status to human-friendly values
  const statusMap = {
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    PENDING: "Pending",
    FAILED: "Failed"
  };
  // Use mapping, fallback to Capitalized string
  const finalStatus = statusMap[paypal_status.toUpperCase()] || (paypal_status.charAt(0).toUpperCase() + paypal_status.slice(1).toLowerCase());

  // Only mark the payment as Completed if PayPal status is COMPLETED
  if (paypal_status.toUpperCase() === 'COMPLETED') {
    await paymentRecord.update({
      status: finalStatus,
      paypal_payment_id: paypal_payment_id,
      updated_at: new Date()
    });

    debugLog("Payment record marked Completed.");

    // Find current active plan for this user (no plan_id filter)
    let userPlan = await UserPlan.findOne({
      where: { user_id: userId, active: true },
      order: [['end_date', 'DESC']]
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
        updated_at: now
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
        updated_at: now
      });

      debugLog(`Created new plan: start_date=${start_date}, end_date=${end_date}`);
    }

    await User.update(
      { plan: 'pro' },
      { where: { id: userId } }
    );
    debugLog("User table 'plan' column updated to 'pro'.");

    res.json({
      status: "success",
      message: "Payment captured and subscription updated",
      paypal: capture.result,
    });
  } else {
    await paymentRecord.update({
      status: finalStatus,
      updated_at: new Date()
    });

    debugLog(`Payment record marked as ${finalStatus} (not Completed).`);
    res.status(400).json({
      status: finalStatus,
      message: `Payment was not completed: status is ${finalStatus}`,
      paypal: capture ? capture.result : undefined
    });
  }
});

/**
 * Cancel order endpoint to mark payment as CANCELLED
 * (Make sure frontend calls this when payment is cancelled)
 * NO authentication required for this endpoint!
 */
router.post("/cancel-order", async (req, res) => {
  debugLog("Received /cancel-order request", { body: req.body });
  const { orderID } = req.body;

  if (!orderID) {
    debugLog("Missing orderID from request body");
    return res.status(400).json({ error: "Missing orderID." });
  }

  const paymentRecord = await Payment.findOne({
    where: { paypal_order_id: orderID }
  });

  if (!paymentRecord) {
    debugLog(`Payment record not found for orderID: ${orderID}`);
    return res.status(404).json({ error: "Payment record not found." });
  }

  await paymentRecord.update({
    status: "CANCELLED",
    updated_at: new Date()
  });

  debugLog(`Payment record for order ${orderID} marked as CANCELLED.`);
  res.json({ status: "CANCELLED" });
});

export default router;