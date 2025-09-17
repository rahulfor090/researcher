import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, gradients, shadows } from '../theme';

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
    <div style={{
      minHeight: '100vh',
      background: gradients.auth,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)`,
        animation: 'float 20s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: `linear-gradient(45deg, ${colors.link}, ${colors.highlight})`,
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        width: '150px',
        height: '150px',
        background: `linear-gradient(45deg, ${colors.highlight}, ${colors.link})`,
        borderRadius: '50%',
        opacity: 0.08,
        animation: 'pulse 6s ease-in-out infinite reverse'
      }} />

      {/* Main Forgot Password Card */}
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
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'slideUp 0.8s ease-out'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = `${shadows.medium}, 0 32px 64px -12px rgba(0, 0, 0, 0.2)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `${shadows.soft}, 0 25px 50px -12px rgba(0, 0, 0, 0.15)`;
      }}>
        
        {/* Back Button */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: colors.mutedText,
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = colors.link;
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = colors.mutedText;
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← Back to Login
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: colors.link,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: `0 8px 32px rgba(13, 148, 136, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
            animation: 'bounce 2s ease-in-out infinite',
            position: 'relative'
          }}>
            <span style={{ fontSize: '2.5rem', color: 'white' }}>🔑</span>
          </div>
          
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: colors.primaryText,
            margin: '0 0 8px',
            background: `linear-gradient(135deg, ${colors.primaryText}, ${colors.link})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Forgot Password?
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: colors.mutedText,
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.5
          }}>
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#dc2626',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'shake 0.5s ease-in-out'
            }}>
              <span style={{ fontSize: '1.2rem' }}>❌</span>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#059669',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'slideIn 0.5s ease-out'
            }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              {success}
            </div>
          )}

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: colors.primaryText
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: colors.mutedText
              }}>📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={e => {
                  e.currentTarget.style.border = `2px solid ${colors.link}`;
                  e.currentTarget.style.boxShadow = `0 0 0 4px rgba(13, 148, 136, 0.1)`;
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onBlur={e => {
                  e.currentTarget.style.border = `2px solid ${colors.border}`;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                placeholder="Enter your registered email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            style={{
              ...primaryButtonStyle,
              width: '100%',
              padding: '18px 24px',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              cursor: (isLoading || success) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              background: (isLoading || success) ? colors.mutedText : colors.link,
              boxShadow: (isLoading || success) ? 'none' : `0 4px 12px rgba(13, 148, 136, 0.3)`
            }}
            onMouseEnter={e => {
              if (!isLoading && !success) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 6px 20px rgba(13, 148, 136, 0.4)`;
              }
            }}
            onMouseLeave={e => {
              if (!isLoading && !success) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 12px rgba(13, 148, 136, 0.3)`;
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Sending Reset Link...
              </div>
            ) : success ? (
              'Email Sent Successfully!'
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: colors.mutedText,
            margin: '0 0 16px',
            fontSize: '0.95rem'
          }}>
            Remember your password?{' '}
            <Link to="/login" style={{
              color: colors.link,
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = colors.highlight;
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = colors.link;
              e.currentTarget.style.textDecoration = 'none';
            }}>
              Sign in here
            </Link>
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '20px 0 0',
            borderTop: `1px solid ${colors.border}`
          }}>
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>🔒 Secure Reset</span>
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>📧 Email Verification</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(40px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0; 
              transform: translateX(-20px); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-30px) rotate(120deg); }
            66% { transform: translateY(30px) rotate(240deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.15); opacity: 0.2; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-15px) scale(1.05); }
            60% { transform: translateY(-8px) scale(1.02); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}
      </style>
    </div>
  );
}