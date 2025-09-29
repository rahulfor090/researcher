import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { typography } from '../theme';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (user?.name) setFormName(user.name);
  }, [user?.name]);

  useEffect(() => {
    let active = true;
    async function loadAvatar() {
      const img = user?.profile_image || '';
      if (!img) { setAvatarSrc(''); return; }
      if (img.startsWith('http') || img.startsWith('data:')) { setAvatarSrc(img); return; }
      try {
        const { data } = await api.get(`/profile/image/${img}`);
        if (active && data?.data) setAvatarSrc(data.data);
      } catch (_) {
        // ignore
      }
    }
    loadAvatar();
    return () => { active = false; };
  }, [user?.profile_image]);

  useEffect(() => {
    function onDocClick(e) {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setIsEditing(false);
        setFormImage(null);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isMenuOpen]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const form = new FormData();
      if (formName && formName !== user?.name) form.append('name', formName);
      if (formImage) form.append('profile_image', formImage);
      const { data } = await api.put('/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser?.(data);
      setIsEditing(false);
      setIsMenuOpen(false);
    } catch (err) {
      // Optionally surface error
    } finally {
      setIsSaving(false);
    }
  };

  const isHome = location.pathname === '/';
  const navItems = user ? [
    ...(!isHome ? [{ name: 'Home', path: '/' }] : []),
    ...(!isHome ? [{ name: 'Library', path: '/library' }] : []),
    { name: 'Upgrade', path: '/upgrade' },
  ] : [
    ...(!isHome ? [{ name: 'Home', path: '/' }] : []),
    { name: 'Membership', path: '/upgrade' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  return (
    <nav 
      className={`backdrop-blur-md fixed w-full z-50 top-0 left-0 animate-fade-in-down border-b transition-all duration-500 group ${isScrolled ? 'shadow-xl border-[#e8ddd4]' : 'shadow-lg border-[#e8ddd4]/50'}`} 
      style={{ 
        background: isScrolled 
          ? 'linear-gradient(135deg, rgba(254, 252, 243, 0.98) 0%, rgba(245, 241, 232, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(254, 252, 243, 0.95) 0%, rgba(245, 241, 232, 0.95) 100%)',
        boxShadow: isScrolled 
          ? '0 8px 32px -8px rgba(45, 27, 14, 0.15)'
          : '0 4px 20px -2px rgba(45, 27, 14, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(254, 252, 243, 1) 0%, rgba(245, 241, 232, 1) 100%)';
        e.currentTarget.style.boxShadow = '0 12px 40px -8px rgba(45, 27, 14, 0.2)';
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.borderBottom = '2px solid rgba(13, 148, 136, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isScrolled 
          ? 'linear-gradient(135deg, rgba(254, 252, 243, 0.98) 0%, rgba(245, 241, 232, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(254, 252, 243, 0.95) 0%, rgba(245, 241, 232, 0.95) 100%)';
        e.currentTarget.style.boxShadow = isScrolled 
          ? '0 8px 32px -8px rgba(45, 27, 14, 0.15)'
          : '0 4px 20px -2px rgba(45, 27, 14, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderBottom = isScrolled ? '1px solid #e8ddd4' : '1px solid rgba(232, 221, 212, 0.5)';
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group" onMouseEnter={(e) => {
              const logo = e.currentTarget.querySelector('img');
              const text = e.currentTarget.querySelector('span');
              if (logo) {
                logo.style.transform = 'scale(1.1) rotate(5deg)';
                logo.style.boxShadow = '0 8px 25px -5px rgba(13, 148, 136, 0.3)';
              }
              if (text) {
                text.style.transform = 'translateX(2px)';
                text.style.textShadow = '0 2px 8px rgba(13, 148, 136, 0.2)';
              }
            }} onMouseLeave={(e) => {
              const logo = e.currentTarget.querySelector('img');
              const text = e.currentTarget.querySelector('span');
              if (logo) {
                logo.style.transform = 'scale(1) rotate(0deg)';
                logo.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
              if (text) {
                text.style.transform = 'translateX(0)';
                text.style.textShadow = 'none';
              }
            }}>
              <img src="/upload/brand/research-locker-logo.png" alt="Research Locker" className="h-9 w-9 rounded-xl shadow-sm ring-1 ring-[#e8ddd4] object-cover transition-all duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="text-[#2d1b0e] text-2xl font-bold group-hover:text-[#0D9488] transition-all duration-300">ResearchLocker</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-[#6b5b47] hover:bg-[#f5f1e8] hover:text-[#0D9488] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-sm relative overflow-hidden group"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(13, 148, 136, 0.2)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 241, 232, 0.8) 0%, rgba(254, 252, 243, 0.8) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D9488]/10 via-transparent to-[#F97316]/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                </Link>
              ))}
              {user ? (
                <div className="relative ml-4" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(v => !v)}
                    className="flex items-center space-x-2 group relative overflow-hidden"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(13, 148, 136, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {avatarSrc ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#e8ddd4] shadow-sm">
                        <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F97316] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                      </div>
                    )}
              <span className="text-sm font-semibold text-[#2d1b0e] group-hover:text-[#0D9488] transition-colors duration-300">{user.name}</span>
                    <svg className="w-4 h-4 text-[#6b5b47] group-hover:text-[#0D9488] transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#fefcf3] border border-[#e8ddd4] rounded-xl shadow-xl p-4 z-50" style={{ 
                      boxShadow: '0 10px 30px -5px rgba(45, 27, 14, 0.15)'
                    }}>
                      {!isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {avatarSrc ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e8ddd4] shadow-sm">
                                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F97316] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-[#2d1b0e]" style={typography.bodySmall}>{user.name}</div>
                              <div className="text-xs text-[#6b5b47] truncate max-w-[12rem]" style={typography.caption}>{user.email}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsEditing(true)} 
                            className="w-full bg-gradient-to-r from-[#0D9488] to-[#F97316] hover:from-[#0f766e] hover:to-[#ea580c] text-white py-2 rounded-lg transition-all duration-300 shadow-sm"
                            style={typography.buttonSmall}
                          >
                            Edit Profile
                          </button>
                          <div className="flex gap-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center border border-[#e8ddd4] hover:border-[#0D9488] text-[#6b5b47] hover:text-[#0D9488] text-sm py-2 rounded-lg transition-all duration-300">Back to Home</Link>
                            <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center border border-[#e8ddd4] hover:border-[#0D9488] text-[#6b5b47] hover:text-[#0D9488] text-sm py-2 rounded-lg transition-all duration-300">Settings</Link>
                            <button onClick={logout} className="flex-1 text-center border border-[#e8ddd4] hover:border-red-300 text-[#6b5b47] hover:text-red-600 text-sm py-2 rounded-lg transition-all duration-300">Logout</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {avatarSrc ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e8ddd4] shadow-sm">
                                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F97316] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                              </div>
                            )}
                            <div className="text-sm font-semibold text-[#2d1b0e]">Edit Profile</div>
                          </div>
                          <div>
                            <label className="block text-xs text-[#6b5b47] mb-1" style={typography.caption}>Name</label>
                            <input 
                              value={formName} 
                              onChange={e => setFormName(e.target.value)} 
                              className="w-full border border-[#e8ddd4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] transition-colors duration-300" 
                              style={typography.bodySmall}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#6b5b47] mb-1" style={typography.caption}>Profile picture</label>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => setFormImage(e.target.files?.[0] || null)} 
                              className="w-full text-[#6b5b47]" 
                              style={typography.bodySmall}
                            />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button 
                              disabled={isSaving} 
                              onClick={() => { setIsEditing(false); setFormImage(null); }} 
                              className="flex-1 border border-[#e8ddd4] hover:border-[#6b5b47] text-[#6b5b47] hover:text-[#2d1b0e] py-2 rounded-lg transition-all duration-300"
                              style={typography.buttonSmall}
                            >
                              Cancel
                            </button>
                            <button 
                              disabled={isSaving} 
                              onClick={handleSave} 
                              className="flex-1 bg-gradient-to-r from-[#0D9488] to-[#F97316] hover:from-[#0f766e] hover:to-[#ea580c] disabled:opacity-60 text-white py-2 rounded-lg transition-all duration-300 shadow-sm"
                              style={typography.buttonSmall}
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-[#f5f1e8] inline-flex items-center justify-center p-2 rounded-lg text-[#6b5b47] hover:text-[#0D9488] hover:bg-[#fefcf3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f5f1e8] focus:ring-[#0D9488] transition-all duration-300 relative overflow-hidden group"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(13, 148, 136, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#fefcf3] border-t border-[#e8ddd4]">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[#6b5b47] hover:bg-[#f5f1e8] hover:text-[#0D9488] block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="px-3 py-3 border-t border-[#e8ddd4] mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {avatarSrc ? (
                    <Link to="/settings" className="w-9 h-9 rounded-full overflow-hidden border border-[#e8ddd4] shadow-sm" onClick={() => setIsOpen(false)}>
                      <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                    </Link>
                  ) : (
                    <Link to="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F97316] text-white flex items-center justify-center text-sm font-bold shadow-sm" onClick={() => setIsOpen(false)}>
                      {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                    </Link>
                  )}
                  <Link to="/settings" className="text-sm font-semibold text-[#0D9488]" onClick={() => setIsOpen(false)}>{user.name}</Link>
                </div>
                <button onClick={() => { setIsOpen(false); logout(); }} className="text-[#6b5b47] hover:text-red-600 text-sm transition-colors duration-300">Logout</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
