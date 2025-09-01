import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, gradients, shadows } from '../theme';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initials = (user?.name || 'User').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();

  // Load articles for overview
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/articles');
        setArticles(data);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
    })();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: gradients.app, fontFamily: 'Inter, sans-serif' }}>
      {/* Left Navigation Sidebar */}
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
        }}>Research Locker</h1>
        
        <div 
          onClick={() => setShowProfileMenu(v => !v)} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.06)', 
            marginBottom: '16px', 
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0ea5e9, #22c55e)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 700,
            animation: 'pulse 2s infinite'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user?.email || ''}</div>
          </div>
        </div>
        
        {showProfileMenu && (
          <div style={{ 
            position: 'absolute', 
            top: '96px', 
            left: '24px', 
            right: '24px', 
            background: 'white', 
            color: colors.primaryText, 
            border: `1px solid ${colors.border}`, 
            borderRadius: '12px', 
            boxShadow: shadows.soft, 
            overflow: 'hidden', 
            zIndex: 30, 
            animation: 'dropdownIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards', 
            transformOrigin: 'top center' 
          }}>
            <button style={{ 
              display: 'block', 
              padding: '10px 14px', 
              background: 'transparent', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left', 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Settings</button>
            <button style={{ 
              display: 'block', 
              padding: '10px 14px', 
              background: 'transparent', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left', 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>About</button>
          </div>
        )}
        
        <nav style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    {[
      { label: 'Dashboard', icon: '🏠', path: '/' },
      { label: 'Library', icon: '📚', path: '/library' },
      { label: 'Collections', icon: '🗂️', path: null },
      { label: 'All insights', icon: '📈', path: null },
      { label: 'Settings', icon: '⚙️', path: '/settings' } // <-- Add this line
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
        onClick={() => { if (path) nav(path); }}
      >
        <span style={{
          width: 20,
          textAlign: 'center',
          transition: 'transform 0.3s ease'
        }}>{icon}</span>
        <span>{label}</span>
      </li>
    ))}
  </ul>
</nav>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flexGrow: 1, 
        padding: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderTopRightRadius: '16px', 
        borderBottomRightRadius: '16px',
        animation: 'fadeInRight 0.6s ease-out 0.3s both'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          animation: 'fadeInDown 0.8s ease-out 0.5s both'
        }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 700, 
            color: '#1f2937', 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Dashboard</h2>
        </div>
        
        <div style={{ 
          ...cardStyle,
          animation: `fadeInUp 0.8s ease-out ${isLoaded ? '0.7s' : '0s'} both`,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          opacity: isLoaded ? 1 : 0
        }} 
        onMouseEnter={e => { 
          e.currentTarget.style.boxShadow = shadows.medium; 
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)'; 
        }} 
        onMouseLeave={e => { 
          e.currentTarget.style.boxShadow = shadows.soft; 
          e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.primaryText }}>Overview</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { 
                count: articles.length, 
                label: 'Total Articles', 
                color: '#3b82f6', 
                bgColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                icon: '📊'
              },
              { 
                count: articles.filter(a => a.doi).length, 
                label: 'With DOI', 
                color: '#22c55e', 
                bgColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
                icon: '✅'
              },
              { 
                count: articles.filter(a => !a.doi).length, 
                label: 'Without DOI', 
                color: '#f97316', 
                bgColor: 'rgba(249, 115, 22, 0.1)',
                borderColor: 'rgba(249, 115, 22, 0.2)',
                icon: '⚠️'
              }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                style={{ 
                  padding: '24px', 
                  background: stat.bgColor, 
                  borderRadius: '16px', 
                  border: `1px solid ${stat.borderColor}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.6s ease-out ${0.9 + index * 0.1}s both`,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isLoaded ? 1 : 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  e.currentTarget.style.border = `2px solid ${stat.color}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.border = `1px solid ${stat.borderColor}`;
                }}
              >
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700, 
                  color: stat.color, 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  {stat.count}
                </div>
                <div style={{ color: colors.primaryText, fontWeight: 600, fontSize: '0.95rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar (Filters & Recent Activity) */}
      <div style={{ 
        width: '420px', 
        backgroundColor: 'transparent', 
        padding: '40px 20px 40px 20px',
        animation: 'fadeInRight 0.6s ease-out 0.5s both'
      }}>
        <div style={{ 
          ...cardStyle, 
          marginBottom: '16px',
          animation: 'fadeInUp 0.8s ease-out 0.8s both'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = shadows.medium;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = shadows.soft;
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, color: colors.primaryText }}>Filters</h4>
            <button
              style={{
                background: 'transparent',
                color: colors.link,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(13, 148, 136, 0.1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => { /* reserved for future filter reset */ }}
            >
              Clear
            </button>
          </div>

          {/* Search field with icon */}
          <div style={{ position: 'relative', marginTop: '12px', marginBottom: '16px' }}>
            <span style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: colors.mutedText,
              transition: 'transform 0.2s ease'
            }}>🔎</span>
            <input
              type="text"
              placeholder="Search articles, titles, DOI..."
              style={{
                width: '100%',
                maxWidth: '100%',
                padding: '12px 12px 12px 36px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                display: 'block',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }}
              onFocus={e => {
                e.currentTarget.style.border = `2px solid ${colors.link}`;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(13, 148, 136, 0.1)`;
                e.currentTarget.style.background = 'white';
                e.currentTarget.previousElementSibling.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.border = `1px solid ${colors.border}`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                e.currentTarget.previousElementSibling.style.transform = 'translateY(-50%) scale(1)';
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Animations keyframes */}
      <style>
        {`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeInDown {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fadeInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeInRight {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes dropdownIn {
            from { opacity: 0; transform: scaleY(0.9); }
            to { opacity: 1; transform: scaleY(1); }
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