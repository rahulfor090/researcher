import React from "react";
import { useNavigate } from "react-router-dom";

const PaypalCancel = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/premium-payment"); // 👈 redirect them back to your premium/payment page
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
