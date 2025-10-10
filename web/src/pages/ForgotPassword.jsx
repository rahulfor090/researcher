import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { primaryButtonStyle } from '../theme';
import './ForgotPassword.scss';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSuccess('Password reset link has been sent to your email address. Please check your inbox.');
      setEmail(''); // Clear the email field after success
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Email does not match for the existing user');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgotpassword-page">
      {/* Background decorative elements */}
      <div className="bg-pattern" />
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />

      {/* Main Forgot Password Card */}
      <div className="forgot-card">
        
        {/* Back Button */}
        <div className="back-section">
          <Link
            to="/login"
            className="back-link"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Header */}
        <div className="header-section">
          <div className="header-icon">
            <span className="icon-emoji">🔑</span>
          </div>
          
          <h1 className="header-title">
            Forgot Password?
          </h1>
          
          <p className="header-description">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="form-section">
          <form className="form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {success}
              </div>
            )}

            <div className="form-field">
              <label className="field-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your registered email address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="submit-button"
            >
              {isLoading ? (
                <div className="loading-content">
                  <div className="spinner" />
                  Sending Reset Link...
                </div>
              ) : success ? (
                'Email Sent Successfully!'
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <p className="footer-text">
            Remember your password?{' '}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
          
          <div className="footer-info">
            <span className="info-text">🔒 Secure Reset</span>
            <span className="info-text">📧 Email Verification</span>
          </div>
        </div>
      </div>

    </div>
  );
}