import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const PremiumPayment = () => {
  const paypalRef = useRef();
  const [user, setUser] = useState(null);

  // Fetch user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${API_BASE}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return; // Only render button if user exists

    // Clean up container before rendering button
    if (paypalRef.current) {
      paypalRef.current.innerHTML = "";
    }

    let isMounted = true;

    if (window.paypal && paypalRef.current) {
      window.paypal
        .Buttons({
          createOrder: async () => {
            const token = localStorage.getItem("token");
            const res = await axios.post(
              `${API_BASE}/paypal/create-order`,
              {},
              token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
            );
            return res.data.id;
          },
          onApprove: async (data) => {
            const token = localStorage.getItem("token");
            await axios.post(
              `${API_BASE}/paypal/capture-order`,
              { orderID: data.orderID },
              token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
            );
            window.location.href = "/thank-you";
          },
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
        })
        .render(paypalRef.current)
        .catch((err) => {
          // Prevent error if component was unmounted
          if (isMounted) {
            // Optionally handle PayPal render errors
            // console.error('PayPal Button Render Error:', err);
          }
        });
    }

    return () => {
      isMounted = false;
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, [user]);

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Premium Plan - $10</h2>
      <p>Unlock all premium features of our website!</p>
      {!user ? (
        <div>Please log in to purchase premium.</div>
      ) : (
        <div ref={paypalRef}></div>
      )}
    </div>
  );
};

export default PremiumPayment;