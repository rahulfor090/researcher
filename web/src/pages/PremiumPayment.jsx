import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

// Ensure plan_id is always 2
const PREMIUM_PLAN_ID = 2;

const PremiumPayment = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // "paypal" or "stripe"
  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_BASE}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // On PayPal/Stripe redirect back, capture payment if needed
  useEffect(() => {
    // /paypal-success?token=ORDER_ID (PayPal)
    // /paypal-success?session_id=SESSION_ID (Stripe)
    // /paypal-cancel
    const urlParams = new URLSearchParams(window.location.search);
    const orderID = urlParams.get("token"); // PayPal
    const sessionId = urlParams.get("session_id"); // Stripe

    // Handle PayPal success
    if (window.location.pathname.endsWith("/paypal-success") && orderID && !sessionId) {
      console.log("🔵 PayPal success detected, orderID:", orderID);
      setLoading(true);
      const token = localStorage.getItem("token");
      axios
        .post(
          `${API_BASE}/paypal/capture-order`,
          { orderID },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          console.log("✅ PayPal payment captured successfully");
          setLoading(false);
          navigate("/thank-you");
        })
        .catch((err) => {
          setLoading(false);
          console.error("❌ Error capturing PayPal order:", err);
          console.error("Error details:", err.response?.data);
          navigate("/paypal-cancel");
        });
    }
    // Handle Stripe success - use ELSE IF to prevent both from running
    else if (window.location.pathname.endsWith("/paypal-success") && sessionId) {
      console.log("🟣 Stripe success detected, sessionId:", sessionId);
      setLoading(true);
      const token = localStorage.getItem("token");
      
      console.log("Calling API:", `${API_BASE}/stripe/verify-session`);
      console.log("Token:", token ? "Present" : "Missing");
      
      axios
        .post(
          `${API_BASE}/stripe/verify-session`,
          { sessionId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("✅ Stripe payment verified successfully", response.data);
          setLoading(false);
          navigate("/thank-you");
        })
        .catch((err) => {
          setLoading(false);
          console.error("❌ Error verifying Stripe session:", err);
          console.error("Error response:", err.response?.data);
          console.error("Error status:", err.response?.status);
          navigate("/paypal-cancel");
        });
    }

    // On cancel, just redirect/can show message
    if (window.location.pathname.endsWith("/paypal-cancel")) {
      console.log("❌ Payment cancelled");
      // Optionally show message or redirect
    }
    // On thank-you, do nothing special
  }, [navigate]);

  const handlePayNow = async () => {
    try {
      const token = localStorage.getItem("token");

      if (paymentMethod === "paypal") {
        // PayPal flow
        console.log("🔵 Initiating PayPal payment...");
        const res = await axios.post(
          `${API_BASE}/paypal/create-order`,
          { planId: PREMIUM_PLAN_ID },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (res.data.approvalUrl) {
          console.log("🔵 Redirecting to PayPal:", res.data.approvalUrl);
          window.location.href = res.data.approvalUrl;
        } else {
          console.error("No approvalUrl returned from backend:", res.data);
        }
      } else if (paymentMethod === "stripe") {
        // Stripe flow
        console.log("🟣 Initiating Stripe payment...");
        const res = await axios.post(
          `${API_BASE}/stripe/create-checkout-session`,
          { planId: PREMIUM_PLAN_ID },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );

        if (res.data.url) {
          console.log("🟣 Redirecting to Stripe:", res.data.url);
          window.location.href = res.data.url;
        } else {
          console.error("No checkout URL returned from backend:", res.data);
        }
      }
    } catch (err) {
      console.error("❌ Error creating payment:", err);
      console.error("Error response:", err.response?.data);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Premium Plan</h2>
      <p>Unlock all premium features of our website!</p>

      {loading && (
        <div>
          <p>Processing payment...</p>
        </div>
      )}

      {!loading && !user ? (
        <div>Please log in to purchase premium.</div>
      ) : (
        !loading && (
          <div>
            {/* Payment method selector */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ marginRight: "20px" }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "5px" }}
                />
                PayPal
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "5px" }}
                />
                Credit/Debit Card (Stripe)
              </label>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePayNow}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: paymentMethod === "stripe" ? "#635BFF" : "#0070BA",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {paymentMethod === "paypal" ? "Pay with PayPal" : "Pay with Card"}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default PremiumPayment;