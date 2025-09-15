import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PremiumPayment = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handlePayNow = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/paypal/create-order`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      if (res.data.approvalUrl) {
        window.location.href = res.data.approvalUrl; // ✅ redirect in same tab
      } else {
        console.error("No approvalUrl returned from backend:", res.data);
      }
    } catch (err) {
      console.error("❌ Error creating order:", err);
    }
  };


  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Premium Plan - $10</h2>
      <p>Unlock all premium features of our website!</p>

      {!user ? (
        <div>Please log in to purchase premium.</div>
      ) : (
        <button onClick={handlePayNow} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Pay with PayPal
        </button>
      )}
    </div>
  );
};

export default PremiumPayment;
