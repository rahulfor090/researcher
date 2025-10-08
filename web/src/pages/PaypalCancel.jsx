import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PaypalCancel = () => {
  const navigate = useNavigate();
  const orderIDRef = useRef(null);

  useEffect(() => {
    // Get the PayPal order ID from the URL params when landing here
    const params = new URLSearchParams(window.location.search);
    const orderID = params.get("token"); // PayPal's order ID
    orderIDRef.current = orderID;
  }, []);

  const handleRetry = async () => {
    // Debug log to confirm handler is firing and values are correct
    console.log("Try Again clicked!");
    console.log("OrderID:", orderIDRef.current);

    if (orderIDRef.current) {
      try {
        const response = await axios.post(
          `${API_BASE}/paypal/cancel-order`,
          { orderID: orderIDRef.current },
          {
            withCredentials: true
          }
        );
        console.log("Cancel order response:", response.data);
      } catch (error) {
        console.error("Cancel order error:", error?.response?.data || error.message);
      }
    } else {
      console.error("No orderID present in URL.");
    }
    navigate("/premium-payment");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Payment Cancelled</h2>
      <p style={styles.text}>
        You cancelled the PayPal payment. No charges have been made.
      </p>
      <button style={styles.button} onClick={handleRetry}>
        Try Again
      </button>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
    color: "#d9534f",
  },
  text: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0070ba",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PaypalCancel;