import express from "express";
import axios from "axios";
import db from "../models/index.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js"; // JWT auth middleware

const router = express.Router();
const UserPlan = db.UserPlan;

/**
 * Get PayPal API credentials from env
 */
function getPaypalConfig() {
  const { api, clientId, secret } = env.paypal;
  if (!api || !clientId || !secret) {
    throw new Error(
      `Missing PayPal config: api=${api}, clientId=${clientId}, secret=${!!secret}`
    );
  }
  return { api, clientId, secret };
}

/**
 * Fetch OAuth token from PayPal
 */
async function getAccessToken() {
  try {
    const { api, clientId, secret } = getPaypalConfig();
    const response = await axios({
      url: `${api}/v1/oauth2/token`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
      auth: { username: clientId, password: secret },
    });
    return response.data.access_token;
  } catch (err) {
    console.error(
      "❌ Failed to get PayPal access token:",
      err.response?.data || err.message || err
    );
    throw new Error("PayPal authentication failed");
  }
}

/**
 * Create an order
 */
// 1. Create order (redirect-based)
router.post('/create-order', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { api } = getPaypalConfig();

    const response = await axios.post(
      `${api}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: "10.00" }
          }
        ],
        application_context: {
          brand_name: "Research Locker",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${env.frontendBaseUrl}/paypal-success`,
          cancel_url: `${env.frontendBaseUrl}/paypal-cancel`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const order = response.data;
    const approvalUrl = order.links?.find(link => link.rel === "approve")?.href;

    if (!approvalUrl) {
      console.error("⚠️ No approval URL found:", order);
      return res.status(500).json({ error: "No approval URL from PayPal", order });
    }

    console.log("✅ Order created:", order.id, "Approval URL:", approvalUrl);

    res.json({
      id: order.id,
      approvalUrl
    });
  } catch (err) {
    console.error("❌ PayPal create-order error:", err.response?.data || err.message || err);
    res.status(500).json({
      error: "Failed to create PayPal order",
      details: err.response?.data || err.message
    });
  }
});


/**
 * Capture an order & update DB
 */
router.post("/capture-order", requireAuth, async (req, res) => {
  const { orderID } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const accessToken = await getAccessToken();
    const { api } = getPaypalConfig();

    const response = await axios.post(
      `${api}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Payment captured for user:", userId);

    // Update subscription (1 year plan)
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 365);

    await UserPlan.upsert({
      user_id: userId,
      plan_id: 2, // your premium plan ID
      start_date: now,
      end_date: end,
      active: true,
    });

    res.json({
      status: "success",
      message: "Payment captured and subscription updated",
      paypal: response.data,
    });
  } catch (err) {
    console.error(
      "❌ PayPal capture-order error:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      error: "Failed to capture PayPal order",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
