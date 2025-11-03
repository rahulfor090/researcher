import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PaypalSuccess = () => {
  const [params] = useSearchParams();
  const orderID = params.get("token"); // PayPal order ID
  const sessionId = params.get("session_id"); // Stripe session ID
  const navigate = useNavigate();
  const hasCaptured = useRef(false); // Prevent double capture

  useEffect(() => {
    // Prevent double capture/verification
    if (hasCaptured.current) return;
    
    // Handle PayPal payment
    if (orderID && !sessionId) {
      console.log("🔵 PayPal success detected, orderID:", orderID);
      hasCaptured.current = true;
      
      const captureOrder = async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            `${API_BASE}/paypal/capture-order`,
            { orderID },
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
          );
          console.log("✅ PayPal payment captured successfully");
          navigate("/thank-you");
        } catch (err) {
          console.error("❌ Error capturing PayPal order:", err);
          console.error("Error details:", err.response?.data);
          navigate("/paypal-cancel");
        }
      };
      captureOrder();
    }
    // Handle Stripe payment
    else if (sessionId) {
      console.log("🟣 Stripe success detected, sessionId:", sessionId);
      hasCaptured.current = true;
      
      const verifySession = async () => {
        try {
          const token = localStorage.getItem("token");
          console.log("Calling API:", `${API_BASE}/stripe/verify-session`);
          console.log("Token:", token ? "Present" : "Missing");
          
          const response = await axios.post(
            `${API_BASE}/stripe/verify-session`,
            { sessionId },
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
          );
          
          console.log("✅ Stripe payment verified successfully", response.data);
          navigate("/thank-you");
        } catch (err) {
          console.error("❌ Error verifying Stripe session:", err);
          console.error("Error response:", err.response?.data);
          console.error("Error status:", err.response?.status);
          navigate("/paypal-cancel");
        }
      };
      verifySession();
    }
  }, [orderID, sessionId, navigate]);

  return <h2 style={{ textAlign: "center", marginTop: "60px" }}>Processing your payment...</h2>;
};

export default PaypalSuccess;