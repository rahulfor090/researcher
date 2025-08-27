import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="logo-name">Research Locker</h1>
        <div className="input-group">
          <input type="text" placeholder="ID" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
        </div>
        <button className="login-btn">Log In</button>
        <div className="divider">
          <span>OR</span>
        </div>
        <div className="social-login">
          <button className="social-btn google-btn">
            <i className="fab fa-google"></i> Log In with Google
          </button>
          <button className="social-btn x-btn">
            <i className="fab fa-twitter"></i> Log In with X
          </button>
        </div>
        <button className="guest-btn">Log In as a Guest</button>
        <p className="register-text">
          Don't have an account? <a href="#" className="register-link">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;