import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, setAuthToken } from '../api';
import { useAuth } from '../auth';
import { colors, cardStyle, primaryButtonStyle, gradients, shadows } from '../theme';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get OAuth provider from URL params
  const oauthProvider = searchParams.get('oauth') || 'Google';

  useEffect(() => {
    // Ensure token is set from localStorage or URL params
    const urlToken = searchParams.get('token');
    const localToken = localStorage.getItem('token');
    
    if (urlToken && urlToken !== localToken) {
      localStorage.setItem('token', urlToken);
      setAuthToken(urlToken);
    } else if (localToken) {
      setAuthToken(localToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Ensure token is set before making the request
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please try signing in again.');
        return;
      }
      
      setAuthToken(token);
      const response = await api.post('/auth/set-password', { password });
      
      if (response.data.success) {
        // Update user context with new password_set status
        setUser(prev => ({ ...prev, password_set: true }));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Set password error:', err);
      setError(err.response?.data?.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${gradients.primary.from} 0%, ${gradients.primary.to} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        opacity: 0.08,
        animation: 'pulse 6s ease-in-out infinite reverse'
      }} />

      {/* Main Set Password Card */}
      <div style={{
        ...cardStyle,
        width: '100%',
        maxWidth: '420px',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `${shadows.soft}, 0 25px 50px -12px rgba(0, 0, 0, 0.15)`,
        transform: 'translateY(0)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: shadows.soft
          }}>
            <span style={{ fontSize: '24px', color: 'white' }}>🔐</span>
          </div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: colors.text,
            margin: '0 0 8px',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Set Your Password
          </h1>
          
          <p style={{
            color: colors.textLight,
            fontSize: '16px',
            lineHeight: '1.5',
            margin: 0
          }}>
            Welcome! To complete your {oauthProvider} sign-in, please set a password for your account.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#DC2626',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: colors.text
            }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: colors.text
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            style={{
              ...primaryButtonStyle,
              marginTop: '8px',
              opacity: (isLoading || !password || !confirmPassword) ? 0.7 : 1,
              cursor: (isLoading || !password || !confirmPassword) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Setting Password...' : 'Set Password & Continue'}
          </button>
        </form>

        {/* Security Note */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          fontSize: '14px',
          color: colors.textLight,
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🔒</span>
          Your password will be securely encrypted and stored. You can use it to sign in directly next time.
        </div>
      </div>
    </div>
  );
}