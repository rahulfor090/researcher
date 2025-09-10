import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, gradients, shadows } from '../theme';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
          setIsLoading(false);
        }
      };

  const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/v1';
  const providers = [
    { key: 'google', label: 'Continue with Google', icon: '🟢' },
    { key: 'linkedin', label: 'Continue with LinkedIn', icon: '🔷' },
    { key: 'twitter', label: 'Continue with X (Twitter)', icon: '✖️' },
    { key: 'facebook', label: 'Continue with Facebook', icon: '🔵' }
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
      case 'facebook':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            <rect width="24" height="24" rx="4" fill="#1877F2"/>
            <path fill="#fff" d="M15.5 8H14c-1 0-1.2.5-1.2 1.1V10h2.6l-.3 2.2h-2.3V20h-2.3v-7.8H8.5V10h2V8.7C10.5 6.9 11.5 6 13.4 6c.8 0 1.5.1 2.1.2V8z"/>
          </svg>
        );
      default:
        return null;
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

      {/* Main Login Card */}
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
            <span style={{ fontSize: '2.5rem', color: 'white' }}>🔐</span>
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
            Welcome Back
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: colors.mutedText,
            margin: 0,
            fontWeight: 400
          }}>
            Sign in to your Research Locker account
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
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Twitter Login Button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                                const baseUrl = 'http://localhost:5000/v1';
                const url = `${baseUrl}/auth/twitter`;
                console.log('Base URL:', baseUrl);
                console.log('Full URL:', url);
                console.log('Redirecting to:', url);
                window.location.href = url;
              }}
              style={{
                width: '100%',
                padding: '16px 24px',
                border: '2px solid #1DA1F2',
                borderRadius: '12px',
                backgroundColor: '#1DA1F2',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a91da';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(29, 161, 242, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1DA1F2';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Continue with X (Twitter)
            </button>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0',
              gap: '16px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: colors.border }} />
              <span style={{ color: colors.secondaryText, fontSize: '0.9rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: colors.border }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
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
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: colors.primaryText
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: colors.mutedText
              }}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...primaryButtonStyle,
              width: '100%',
              padding: '18px 24px',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              background: isLoading ? colors.mutedText : colors.link,
              boxShadow: isLoading ? 'none' : `0 4px 12px rgba(13, 148, 136, 0.3)`
            }}
            onMouseEnter={e => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 6px 20px rgba(13, 148, 136, 0.4)`;
              }
            }}
            onMouseLeave={e => {
              if (!isLoading) {
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
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Social Auth Divider */}
        <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
          <div style={{ color: colors.mutedText, fontSize: '0.9rem' }}>or</div>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
        </div>

        {/* Social Auth Buttons (icons only) */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '14px' }}>
          {providers.map((p) => (
            <button
              key={p.key}
              type="button"
              title={p.label}
              aria-label={p.label}
              onClick={() => redirectToProvider(p.key)}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                color: colors.primaryText,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = shadows.soft;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ProviderIcon name={p.key} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: colors.mutedText,
            margin: '0 0 16px',
            fontSize: '0.95rem'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
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
              Create one here
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
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>🔒 Secure & Private</span>
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>⚡ Fast & Reliable</span>
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
