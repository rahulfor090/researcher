import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { colors, cardStyle, primaryButtonStyle, gradients, shadows } from '../theme';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const handleSocialLogin = async (provider) => {
    setError('');
    setIsLoading(true);
    
    try {
      if (provider === 'google') {
        // Use the googleLogin function from auth context
        googleLogin();
      } else {
        // For other providers, show coming soon message
        setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} signup coming soon! Please use email/password for now.`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      setError(`${provider} signup failed. Please try again.`);
      setIsLoading(false);
    }
  };

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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        background: `radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)`,
        animation: 'float 25s ease-in-out infinite reverse'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '180px',
        height: '180px',
        background: `linear-gradient(45deg, ${colors.link}, ${colors.highlight})`,
        borderRadius: '50%',
        opacity: 0.08,
        animation: 'pulse 5s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '220px',
        height: '220px',
        background: `linear-gradient(45deg, ${colors.highlight}, ${colors.link})`,
        borderRadius: '50%',
        opacity: 0.06,
        animation: 'pulse 7s ease-in-out infinite reverse'
      }} />

      {/* Main Registration Card */}
      <div style={{
        ...cardStyle,
        width: '100%',
        maxWidth: '460px',
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
        animation: 'slideUp 0.8s ease-out 0.1s both'
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
            boxShadow: `0 8px 32px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
            animation: 'bounce 2s ease-in-out infinite 0.5s',
            position: 'relative'
          }}>
            <span style={{ fontSize: '2.5rem', color: 'white' }}>🚀</span>
          </div>
          
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: colors.primaryText,
            margin: '0 0 8px',
            background: `linear-gradient(135deg, ${colors.primaryText}, ${colors.highlight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Join Research Locker
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: colors.mutedText,
            margin: 0,
            fontWeight: 400
          }}>
            Create your account and start organizing your research
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: colors.primaryText
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: colors.mutedText
              }}>👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Enter your full name"
              />
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

          <div style={{ marginBottom: '24px' }}>
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
                placeholder="Create a password (min. 6 characters)"
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
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                color: colors.mutedText
              }}>✅</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                placeholder="Confirm your password"
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Social Login Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            position: 'relative',
            textAlign: 'center',
            margin: '24px 0'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: colors.border
            }} />
            <span style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '0 16px',
              color: colors.mutedText,
              fontSize: '0.9rem',
              fontWeight: 500,
              position: 'relative',
              zIndex: 1
            }}>
              Or sign up with
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: colors.primaryText
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `2px solid #4285f4`;
                e.currentTarget.style.boxShadow = `0 0 0 4px rgba(66, 133, 244, 0.1)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `2px solid ${colors.border}`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {/* LinkedIn Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('linkedin')}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: colors.primaryText
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `2px solid #0a66c2`;
                e.currentTarget.style.boxShadow = `0 0 0 4px rgba(10, 102, 194, 0.1)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `2px solid ${colors.border}`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2">
                <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.943v5.663H9.001V9h3.111v1.561h.045c.434-.82 1.494-1.684 3.073-1.684 3.29 0 3.897 2.165 3.897 4.982v6.593zM5.337 7.433a1.806 1.806 0 1 1 0-3.612 1.806 1.806 0 0 1 0 3.612zM6.813 20.452H3.861V9h2.952v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: colors.primaryText
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `2px solid #1877f2`;
                e.currentTarget.style.boxShadow = `0 0 0 4px rgba(24, 119, 242, 0.1)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `2px solid ${colors.border}`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>

            {/* X (Twitter) Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('twitter')}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: colors.primaryText
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `2px solid #000000`;
                e.currentTarget.style.boxShadow = `0 0 0 4px rgba(0, 0, 0, 0.1)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `2px solid ${colors.border}`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: colors.mutedText,
            margin: '0 0 16px',
            fontSize: '0.95rem'
          }}>
            Already have an account?{' '}
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
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>🔒 Secure & Private</span>
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>⚡ Fast & Reliable</span>
            <span style={{ fontSize: '0.9rem', color: colors.mutedText }}>🎯 Easy to Use</span>
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
            0%, 100% { transform: scale(1); opacity: 0.08; }
            50% { transform: scale(1.15); opacity: 0.18; }
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
