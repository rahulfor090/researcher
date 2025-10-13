import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PaypalSuccess = () => {
  const [params] = useSearchParams();
  const orderID = params.get("token");
  const navigate = useNavigate();
  const hasCaptured = useRef(false); // <-- Add this

  useEffect(() => {
    if (!orderID || hasCaptured.current) return; // Prevent double capture
    hasCaptured.current = true; // Mark as captured
    const captureOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${API_BASE}/paypal/capture-order`,
          { orderID },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        navigate("/thank-you");
      } catch (err) {
        console.error("❌ Error capturing PayPal order:", err);
        navigate("/paypal-cancel");
      }
    };
    captureOrder();
  }, [orderID, navigate]);

  return <h2 style={{ textAlign: "center", marginTop: "60px" }}>Processing your payment...</h2>;
};

export default PaypalSuccess;