import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PaypalSuccess = () => {
  const [params] = useSearchParams();
  const orderID = params.get("token"); // PayPal sends ?token=ORDER_ID

  useEffect(() => {
    const captureOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${API_BASE}/paypal/capture-order`,
          { orderID },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        window.location.href = "/thank-you";
      } catch (err) {
        console.error("❌ Error capturing PayPal order:", err);
      }
    };

    if (orderID) {
      captureOrder();
    }
  }, [orderID]);

  return <h2>Processing your payment...</h2>;
};

export default PaypalSuccess;
