import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gradients, shadows, colors } from '../theme';
import { api } from '../api';

export default function Layout({ children }) {
  const nav = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user initials
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  // Load user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/profile')
        .then(response => setUser(response.data))
        .catch(err => console.error('Failed to load user:', err));
    }
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

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
          position: 'relative'
        }}
      >
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '16px', 
          color: '#e5e7eb'
        }}>Research Locker</h1>
        
        {/* User Profile Section */}
        <div 
          className="profile-menu"
          onClick={(e) => {
            e.stopPropagation();
            setShowProfileMenu(v => !v);
          }} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.06)', 
            marginBottom: '16px', 
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${colors.highlight}, ${colors.accent || colors.link})`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{user?.plan || 'free'} plan</div>
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            transition: 'transform 0.2s ease',
            transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▼
          </div>
        </div>
        
        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
  <div 
    className="profile-menu"
    onClick={(e) => e.stopPropagation()}
    style={{ 
      position: 'relative',
      background: 'white', 
      color: colors.primaryText, 
      border: `1px solid ${colors.border}`, 
      borderRadius: '12px', 
      boxShadow: shadows.soft, 
      overflow: 'hidden', 
      zIndex: 30, 
      marginBottom: '16px'
    }}
  >
    <div style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name || 'User'}</div>
      <div style={{ fontSize: '0.8rem', color: colors.secondaryText }}>{user?.email || ''}</div>
    </div>
    <div style={{ padding: '8px 0' }}>
      <div 
        onClick={() => nav('/settings')}
        style={{ 
          padding: '8px 12px', 
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={e => e.currentTarget.style.background = colors.hover}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span>⚙️</span> Settings
      </div>
      <div 
        onClick={() => nav('/about')}
        style={{ 
          padding: '8px 12px', 
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={e => e.currentTarget.style.background = colors.hover}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span>ℹ️</span> About
      </div>
      <div 
        onClick={() => {
          localStorage.removeItem('token');
          nav('/login');
        }}
        style={{ 
          padding: '8px 12px', 
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderTop: `1px solid ${colors.border}`
        }}
        onMouseEnter={e => e.currentTarget.style.background = colors.hover}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span>🚪</span> Logout
      </div>
    </div>
  </div>
)}
        
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li 
              style={{ 
                padding: '10px 12px', 
                color: isActive('/') ? '#ffffff' : '#cbd5e1', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                fontWeight: isActive('/') ? 'bold' : 'normal',
                background: isActive('/') ? 'rgba(255,255,255,0.12)' : 'transparent'
              }} 
              onClick={() => nav('/')}
            >
              🏠 Dashboard
            </li>
            <li 
              style={{ 
                padding: '10px 12px', 
                color: isActive('/library') ? '#ffffff' : '#cbd5e1', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                fontWeight: isActive('/library') ? 'bold' : 'normal',
                background: isActive('/library') ? 'rgba(255,255,255,0.12)' : 'transparent'
              }} 
              onClick={() => nav('/library')}
            >
              📚 Library
            </li>
            <li 
              style={{ 
                padding: '10px 12px', 
                color: isActive('/authors') ? '#ffffff' : '#cbd5e1', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                fontWeight: isActive('/authors') ? 'bold' : 'normal',
                background: isActive('/authors') ? 'rgba(255,255,255,0.12)' : 'transparent'
              }} 
              onClick={() => nav('/authors')}
            >
              👥 Authors
            </li>
            <li 
              style={{ 
                padding: '10px 12px', 
                color: '#cbd5e1', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer'
              }}
            >
              🗂️ Collections
            </li>
            <li 
              style={{ 
                padding: '10px 12px', 
                color: '#cbd5e1', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer'
              }}
            >
              📈 All insights
            </li>
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
        borderBottomRightRadius: '16px' 
      }}>
        {children}
      </div>
    </div>
  );
}
