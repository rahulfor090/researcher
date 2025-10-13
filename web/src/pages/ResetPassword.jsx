import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import { primaryButtonStyle } from '../theme';
import './ResetPassword.scss';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
      setTokenValid(false);
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', { 
        token, 
        password 
      });
      
      setSuccess('Password has been reset successfully! Redirecting to login...');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid or expired reset token');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to reset password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="resetpassword-page">
        <div className="invalid-token-card">
          <div className="invalid-icon">❌</div>
          <h1 className="invalid-title">
            Invalid Reset Link
          </h1>
          <p className="invalid-description">
            This password reset link is invalid or has expired.
          </p>
          <div className="invalid-actions">
            <Link
              to="/forgot-password"
              className="request-link primary"
              style={primaryButtonStyle}
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              className="request-link secondary"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resetpassword-page">
      {/* Background decorative elements */}
      <div className="bg-pattern" />

      {/* Main Reset Password Card */}
      <div className="reset-card">
        
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
            <span className="icon-emoji">🔐</span>
          </div>
          
          <h1 className="header-title">
            Reset Password
          </h1>
          
          <p className="header-description">
            Enter your new password below to complete the reset process.
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
                New Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your new password"
                />
              </div>
            </div>

            <div className="form-field last-field">
              <label className="field-label">
                Confirm New Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Confirm your new password"
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
                  Resetting Password...
                </div>
              ) : success ? (
                'Password Reset Successfully!'
              ) : (
                'Reset Password'
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
            <span className="info-text">🔐 Password must be 6+ characters</span>
          </div>
        </div>
      </div>

    </div>
  );
}