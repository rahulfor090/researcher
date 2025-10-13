import { useState } from 'react';
import './Login.scss';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { gradients } from '../theme';

const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/v1';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const serverBase = import.meta.env.VITE_API_BASE;
  // Twitter login handler
  const handleTwitterLogin = () => {
    const serverBase = import.meta.env.VITE_API_BASE?.replace('/v1', '') || 'http://localhost:5000';
    window.location.href = `${serverBase}/v1/auth/twitter`;
  };

  // LinkedIn login handler
  const handleLinkedInLogin = () => {
    const serverBase = import.meta.env.VITE_API_BASE?.replace('/v1', '') || 'http://localhost:5000';
    window.location.href = `${serverBase}/v1/auth/linkedin`;
  };

  // Google login handler
  const handleGoogleLogin = () => {
    const serverBase = import.meta.env.VITE_API_BASE?.replace('/v1', '') || 'http://localhost:5000';
    window.location.href = `${serverBase}/v1/auth/google`;
  };

  // Facebook login removed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post(`${serverBase}/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root" data-bg={gradients.auth}>
      {/* Background decorative elements */}
      <div className="login-bg-1" />
      <div className="login-bg-2" />
      <div className="login-bg-3" />

      {/* Main Login Card */}
      <div className="login-card">
        
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-circle">
            <span className="logo-icon">🔐</span>
          </div>
          
          <h1 className="login-title">
            Welcome Back
          </h1>
          
          <p className="login-subtitle">
            Sign in to your Research Locker account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label">
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
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-field password-field">
            <label className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`login-submit ${isLoading ? 'is-loading' : ''}`}
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="spinner" />
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password-wrapper">
            <Link 
              to="/forgot-password" 
              className="forgot-password-link"
            >
              🔒 Forgot your password?
            </Link>
          </div>
        </form>

        {/* Social Auth Divider */}
        <div className="social-divider">
          <div className="divider-line" />
          <div className="divider-text">or</div>
          <div className="divider-line" />
        </div>

        {/* Social Auth Buttons (icons only) - match Register styling */}
        <div className="social-auth-buttons">
          <button
            type="button"
            title="Sign in with Google"
            aria-label="Sign in with Google"
            onClick={handleGoogleLogin}
            className="social-button"
          >
            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19.3-7.6 19.3-20 0-1.1-.1-2.3-.3-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.6 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16 4 9.1 8.6 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.3-5.3l-6.2-5.1C29.1 35.8 26.7 37 24 37c-5.2 0-9.6-3.4-11.1-8.1l-6.6 5.1C9.1 39.4 16 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.5 5.8-6.2 7.6l.1.1 6.2 5.1c-.4.4 7.6-5.6 7.6-16.8 0-1.1-.1-2.3-.4-3.5z"/>
            </svg>
          </button>
          <button
            type="button"
            title="Sign in with Twitter"
            aria-label="Sign in with Twitter"
            onClick={handleTwitterLogin}
            className="social-button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
              <path fill="#000" d="M17.6 3H21l-7.1 8.1L22 21h-4.9l-5.3-6.2-6 6.2H2.3l7.6-8.3L2 3h5l4.8 5.6L17.6 3zM16.7 19.6h2.2L7.4 4.2H5.1l11.6 15.4z"/>
            </svg>
          </button>
          <button
            type="button"
            title="Sign in with LinkedIn"
            aria-label="Sign in with LinkedIn"
            onClick={handleLinkedInLogin}
            className="social-button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
              <rect width="24" height="24" rx="4" fill="#0A66C2"/>
              <path fill="#fff" d="M7 17H4.5V9.5H7V17zM5.7 8.3C4.9 8.3 4.3 7.7 4.3 7s.6-1.3 1.4-1.3c.8 0 1.4.6 1.4 1.3s-.6 1.3-1.4 1.3zM19.7 17H17.2v-3.9c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1v4.6H12.1V9.5h2.5v1c.3-.5 1-1.2 2.3-1.2 1.7 0 2.8 1.1 2.8 3.3V17z"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Create one here
            </Link>
          </p>
          
          <div className="footer-features">
            <span className="feature-badge">🔒 Secure & Private</span>
            <span className="feature-badge">⚡ Fast & Reliable</span>
          </div>
        </div>
      </div>

    </div>
  );
}