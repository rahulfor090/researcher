import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { shadows, colors } from '../theme';
import { api } from '../api';
import { useAuth } from '../auth';
import './layout.css';

export default function Layout({ children }) {
  const nav = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user initials
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  // Ensure user profile exists if token is present
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      api.get('/profile')
        .then(response => setUser(response.data))
        .catch(() => {});
    }
  }, [user, setUser]);

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
    <div className="layout">
      {/* Left Navigation Sidebar */}
      <div className={`layout-sidebar${isSidebarOpen ? ' open' : ''}`} style={{ boxShadow: shadows.medium }}>
        <h1 className="layout-title">
          <span style={{
            minWidth: 10,
            minHeight: 10,
            borderRadius: '50%',
            background: colors.link,
            boxShadow: '0 0 12px rgba(13,148,136,0.8)'
          }} />
          <span>Research Locker</span>
        </h1>
        
        {/* User Profile Section */}
        <div 
          className="profile-menu profile-menu-trigger"
          onClick={(e) => {
            e.stopPropagation();
            setShowProfileMenu(v => !v);
          }} 
          
        >
          <div className="avatar-badge" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${colors.highlight}, ${colors.accent || colors.link})`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{user?.name || 'User'}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 999 }}>
                {user?.plan || 'free'} plan
              </span>
            </div>
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
      borderRadius: '0px', 
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
          <ul className="layout-nav">
            <li 
              className={`layout-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => nav('/dashboard')}
            >
              🏠 Dashboard
            </li>
            <li 
              className={`layout-nav-item ${isActive('/library') ? 'active' : ''}`}
              onClick={() => nav('/library')}
            >
              📚 Library
            </li>
            <li 
              className={`layout-nav-item ${isActive('/hashtags') ? 'active' : ''}`}
              onClick={() => nav('/hashtags')}
            >
              🗂️ HashTags
            </li>
            <li 
              className={`layout-nav-item ${isActive('/authors') ? 'active' : ''}`}
              onClick={() => nav('/authors')}
            >
              👥 Authors
            </li>
            <li 
              className={`layout-nav-item ${isActive('/publishers') ? 'active' : ''}`}
              onClick={() => nav('/publishers')}
            >
              📚 Publishers
            </li>
            <li 
              className={`layout-nav-item ${isActive('/collection') ? 'active' : ''}`}
              onClick={() => nav('/collection')}
            >
              📂 Collection
            </li>
            <li 
              className="layout-nav-item"
            >
              📈 All insights
            </li>
            <li 
              className={`layout-nav-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => nav('/')}
            >
              Go to Home
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="layout-main" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
        {/* Mobile sidebar toggle */}
        <button 
          className="mobile-toggle"
          aria-label="Open navigation"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ Menu
        </button>
        {isSidebarOpen && (
          <div 
            className="sidebar-overlay" 
            onClick={() => { setIsSidebarOpen(false); setShowProfileMenu(false); }}
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    </div>
  );
}
