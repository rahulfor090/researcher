import express from 'express';
import axios from 'axios';
import db from '../models/index.js';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js'; // Import your JWT auth middleware

const router = express.Router();

const UserPlan = db.UserPlan;

function getPaypalConfig() {
  const { api, clientId, secret } = env.paypal;
  if (!api || !clientId || !secret) {
    throw new Error(
      `Missing PayPal config: api=${api}, clientId=${clientId}, secret=${!!secret}`
    );
  }
  return { api, clientId, secret };
}

async function getAccessToken() {
  const { api, clientId, secret } = getPaypalConfig();
  const response = await axios({
    url: `${api}/v1/oauth2/token`,
    method: "post",
    headers: { "Accept": "application/json", "Accept-Language": "en_US" },
    data: "grant_type=client_credentials",
    auth: { username: clientId, password: secret }
  });
  return response.data.access_token;
}

// 1. Create order (optionally protected)
router.post('/create-order', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const { api } = getPaypalConfig();
    const response = await axios.post(`${api}/v2/checkout/orders`, {
      intent: "CAPTURE",
      purchase_units: [{
        amount: { currency_code: "USD", value: "10.00" }
        // Removed description to simplify request; add back if needed
      }]
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ id: response.data.id });
  } catch (err) {
    console.error('PayPal create-order error:', err.response?.data || err.message || err);
    res.status(500).json({ error: err.response?.data || err.message || err.toString() });
  }
});

// 2. Capture order & update DB (must be logged in)
router.post('/capture-order', requireAuth, async (req, res) => {
  const { orderID } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const accessToken = await getAccessToken();
    const { api } = getPaypalConfig();
    const response = await axios.post(`${api}/v2/checkout/orders/${orderID}/capture`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // On success, update MySQL user_plans
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 365);

    await UserPlan.upsert({
      user_id: userId,
      plan_id: 2,
      start_date: now,
      end_date: end,
      active: true
    }, { where: { user_id: userId } });

    res.json({ status: "success", paypal: response.data });
  } catch (err) {
    console.error('PayPal capture-order error:', err.response?.data || err.message || err);
    res.status(500).json({ error: err.response?.data || err.message || err.toString() });
  }
});

export default router;
