import { useState } from 'react';
import './Register.scss';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
// Removed unused theme imports since styles are now in SCSS

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard'); // Changed from '/' to '/dashboard'
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/v1';
  const providers = [
    { key: 'google', label: 'Sign up with Google', icon: '🟢' },
    { key: 'linkedin', label: 'Sign up with LinkedIn', icon: '🔷' },
    { key: 'twitter', label: 'Sign up with X (Twitter)', icon: '✖️' }
  ];
  const redirectToProvider = (provider) => {
    window.location.href = `${BASE_API_URL}/auth/oauth/${provider}`;
  };

  const ProviderIcon = ({ name }) => {
    const size = 20;
    switch (name) {
      case 'google':
        return (
          <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19.3-7.6 19.3-20 0-1.1-.1-2.3-.3-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.6 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16 4 9.1 8.6 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.3-5.3l-6.2-5.1C29.1 35.8 26.7 37 24 37c-5.2 0-9.6-3.4-11.1-8.1l-6.6 5.1C9.1 39.4 16 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.3-3.5 5.8-6.2 7.6l.1.1 6.2 5.1c-.4.4 7.6-5.6 7.6-16.8 0-1.1-.1-2.3-.4-3.5z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <rect width="24" height="24" rx="4" fill="#0A66C2"/>
            <path fill="#fff" d="M7 17H4.5V9.5H7V17zM5.7 8.3C4.9 8.3 4.3 7.7 4.3 7s.6-1.3 1.4-1.3c.8 0 1.4.6 1.4 1.3s-.6 1.3-1.4 1.3zM19.7 17H17.2v-3.9c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1v4.6H12.1V9.5h2.5v1c.3-.5 1-1.2 2.3-1.2 1.7 0 2.8 1.1 2.8 3.3V17z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <path fill="#000" d="M17.6 3H21l-7.1 8.1L22 21h-4.9l-5.3-6.2-6 6.2H2.3l7.6-8.3L2 3h5l4.8 5.6L17.6 3zM16.7 19.6h2.2L7.4 4.2H5.1l11.6 15.4z"/>
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="register-root">
      {/* Background decorative elements */}
      <div className="register-bg-1" />
      <div className="register-bg-2" />
      <div className="register-bg-3" />

      {/* Main Registration Card */}
      <div className="register-card">
        
        {/* Header */}
        <div className="register-header">
          <div className="register-logo-circle">
            <span className="logo-icon">🚀</span>
          </div>
          
          <h1 className="register-title">
            Join Research Locker
          </h1>
          
          <p className="register-subtitle">
            Create your account and start organizing your research
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="register-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label">
              Full Name
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
          </div>

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

          <div className="form-field">
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
                placeholder="Create a password (min. 6 characters)"
              />
            </div>
          </div>

          <div className="form-field confirm-password-field">
            <label className="form-label">
              Confirm Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">✅</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`register-submit ${isLoading ? 'is-loading' : ''}`}
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="spinner" />
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Social Auth Divider */}
        <div className="social-divider">
          <div className="divider-line" />
          <div className="divider-text">or</div>
          <div className="divider-line" />
        </div>

        {/* Social Auth Buttons (icons only) */}
        <div className="social-auth-buttons">
          {providers.map((p) => (
            <button
              key={p.key}
              type="button"
              title={p.label}
              aria-label={p.label}
              onClick={() => redirectToProvider(p.key)}
              className="social-button"
            >
              <ProviderIcon name={p.key} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="register-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
          
          <div className="footer-features">
            <span className="feature-badge">🔒 Secure & Private</span>
            <span className="feature-badge">⚡ Fast & Reliable</span>
            <span className="feature-badge">🎯 Easy to Use</span>
          </div>
        </div>
      </div>

    </div>
  );
}


