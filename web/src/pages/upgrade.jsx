import { useNavigate } from 'react-router-dom';
import { gradients, shadows, colors, primaryButtonStyle, secondaryButtonStyle } from '../theme';
import { useAuth } from '../auth';

export default function Upgrade() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const initials = (user?.name || 'User ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: gradients.app,
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div
        style={{
          width: '280px',
          background: gradients.sidebar,
          color: 'white',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: shadows.medium,
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          position: 'relative',
          animation: 'slideInLeft 0.6s ease-out'
        }}
      >
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '16px',
          color: '#e5e7eb',
          animation: 'fadeInDown 0.8s ease-out 0.2s both'
        }}>
          Research Locker
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              animation: 'pulse 2s infinite'
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user?.email || ''}</div>
          </div>
        </div>
        <nav style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
              { label: 'Library', icon: '📚', path: '/library' },
              { label: 'HashTags', icon: '🗂️', path: '/hashtags' },
              { label: 'All insights', icon: '📈', path: null },
            ].map(({ label, icon, path }, index) => (
              <li
                key={label}
                style={{
                  padding: '10px 12px',
                  color: '#cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: `fadeInLeft 0.6s ease-out ${0.8 + index * 0.1}s both`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  if (path) nav(path);
                }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Main Upgrade Content */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          animation: 'fadeInRight 0.6s ease-out 0.3s both'
        }}
      >
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: shadows.medium,
          padding: '48px 36px',
          minWidth: '360px',
          maxWidth: '95vw',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ fontSize: '3.1rem', marginBottom: '18px' }}>🚀</div>
          <h2 style={{
            color: colors.highlight,
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '10px'
          }}>
            Upgrade for $49
          </h2>
          <p style={{
            fontSize: '1.07rem',
            marginBottom: '26px',
            color: colors.mutedText
          }}>
            Unlock unlimited article storage and premium features, including advanced search, insights, and priority support.
          </p>
          <button
            style={{
              ...primaryButtonStyle,
              fontWeight: 700,
              fontSize: '1.09rem',
              padding: '12px 32px',
              borderRadius: '10px',
              marginBottom: '6px'
            }}
            onClick={() => alert('Upgrade flow coming soon!')}
          >
            Upgrade Now
          </button>
          <div>
            <button
              style={{
                ...secondaryButtonStyle,
                fontWeight: 600,
                fontSize: '0.96rem',
                marginTop: '10px'
              }}
              onClick={() => nav('/library')}
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
        @keyframes slideInLeft {
          from {opacity: 0; transform: translateX(-100px) scale(0.95);}
          to {opacity: 1; transform: translateX(0) scale(1);}
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px) scale(0.95);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px) scale(0.95);}
          to { opacity: 1; transform: translateX(0) scale(1);}
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px) scale(0.95);}
          to { opacity: 1; transform: translateX(0) scale(1);}
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        `}
      </style>
    </div>
  );
}