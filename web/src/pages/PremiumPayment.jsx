import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

// Ensure plan_id is always 2
const PREMIUM_PLAN_ID = 2;

const PremiumPayment = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // On PayPal redirect back, capture payment if needed
  useEffect(() => {
    // /paypal-success?token=ORDER_ID
    // /paypal-cancel
    const urlParams = new URLSearchParams(window.location.search);
    const orderID = urlParams.get("token");

    if (window.location.pathname.endsWith("/paypal-success") && orderID) {
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
          setLoading(false);
          navigate("/thank-you");
        })
        .catch((err) => {
          setLoading(false);
          console.error("❌ Error capturing order:", err);
          navigate("/paypal-cancel");
        });
    }
    // On cancel, just redirect/can show message
    if (window.location.pathname.endsWith("/paypal-cancel")) {
      // Optionally show message or redirect
    }
    // On thank-you, do nothing special
  }, [navigate]);

  const handlePayNow = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/paypal/create-order`,
        { planId: PREMIUM_PLAN_ID }, // Always send planId: 2
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      if (res.data.approvalUrl) {
        window.location.href = res.data.approvalUrl;
      } else {
        console.error("No approvalUrl returned from backend:", res.data);
      }
    } catch (err) {
      console.error("❌ Error creating order:", err);
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
          <button onClick={handlePayNow} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Pay with PayPal
          </button>
        )
      )}
    </div>
  );
};

export default PremiumPayment;