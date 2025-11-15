
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
      className={`fixed w-full z-50 top-0 left-0 animate-fade-in-down border-b transition-all duration-500 group ${isScrolled ? 'shadow-xl border-[#e5e7eb]' : 'shadow-lg border-[#e5e7eb]/60'}`} 
      style={{ 
        background: '#ffffff',
        boxShadow: isScrolled 
          ? '0 10px 28px -12px rgba(2, 6, 23, 0.18)'
          : '0 6px 18px -10px rgba(2, 6, 23, 0.12)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 30px -10px rgba(2, 6, 23, 0.2)';
        e.currentTarget.style.borderBottom = '1px solid #e5e7eb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isScrolled 
          ? '0 10px 28px -12px rgba(2, 6, 23, 0.18)'
          : '0 6px 18px -10px rgba(2, 6, 23, 0.12)';
        e.currentTarget.style.borderBottom = isScrolled ? '1px solid #e5e7eb' : '1px solid rgba(229,231,235,0.6)';
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
              <img src="/logo_research_locker.png" alt="Research Locker" className="h-9 w-9 rounded-xl shadow-sm ring-1 ring-[#e8ddd4] object-cover transition-all duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="text-[#111827] text-2xl font-bold group-hover:text-[#4F46E5] transition-all duration-300">Research Locker</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => {
                const isRegister = item.name.toLowerCase() === 'register';
                const isLogin = item.name.toLowerCase() === 'login';
                const base = 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden';
                const linkLook = 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#4F46E5] hover:shadow-sm';
                const btnPrimary = 'btn-brand h-9 px-4 text-white flex items-center';
                const btnOutline = 'btn-outline-brand h-9 px-4 flex items-center';
                const cls = isRegister ? `${btnPrimary}` : isLogin ? `${btnOutline}` : `${linkLook}`;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${base} ${cls}`}
                    onMouseEnter={(e) => {
                      if (!isRegister && !isLogin) {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(13, 148, 136, 0.2)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 241, 232, 0.8) 0%, rgba(254, 252, 243, 0.8) 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRegister && !isLogin) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {!isRegister && !isLogin && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5]/10 via-transparent to-[#06B6D4]/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    )}
                  </Link>
                );
              })}
              {user ? (
                <div className="relative ml-4" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(v => !v)}
                    aria-expanded={isMenuOpen}
                    className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 40px -8px rgba(91, 62, 228, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px -4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    {avatarSrc ? (
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/80 shadow-md">
                          <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3EE4] to-[#4F46E5] text-white flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white/80">
                          {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                    )}
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-sm font-semibold text-[#1f2937] group-hover:text-[#5B3EE4] transition-colors duration-300 truncate max-w-[140px]" title={user.name}>
                        {user.name}
                      </span>
                      {user?.plan && (
                        <span className="text-xs font-medium text-[#5B3EE4] bg-[#5B3EE4]/10 px-2 py-0.5 rounded-full">
                          {user.plan}
                        </span>
                      )}
                    </div>
                    <svg className={`w-4 h-4 text-[#6b7280] group-hover:text-[#5B3EE4] transition-all duration-300 ${isMenuOpen ? 'rotate-180 text-[#5B3EE4]' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      {/* Header */}
                      <div className="p-6 bg-gradient-to-br from-[#5B3EE4] to-[#4F46E5] text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="relative flex items-center gap-4">
                          {avatarSrc ? (
                            <div className="relative">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden ring-3 ring-white/40 shadow-lg">
                                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 text-white flex items-center justify-center text-lg font-bold ring-3 ring-white/40 shadow-lg">
                                {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-base font-bold truncate mb-1" title={user.name}>{user.name}</div>
                            <div className="text-sm opacity-90 truncate mb-2" title={user.email}>{user.email}</div>
                            {user?.plan && (
                              <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>{user.plan}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                      {!isEditing ? (
                        <div className="space-y-4">
                          <button 
                            onClick={() => setIsEditing(true)} 
                            className="w-full bg-gradient-to-r from-[#5B3EE4] to-[#4F46E5] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                          >
                            ✏️ Edit Profile
                          </button>
                          <div className="grid grid-cols-3 gap-2">
                            <Link 
                              to="/" 
                              onClick={() => setIsMenuOpen(false)} 
                              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 hover:border-[#5B3EE4] hover:bg-[#5B3EE4]/5 transition-all duration-300 group"
                            >
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-[#5B3EE4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600 group-hover:text-[#5B3EE4]">Home</span>
                            </Link>
                            <Link 
                              to="/settings" 
                              onClick={() => setIsMenuOpen(false)} 
                              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 hover:border-[#5B3EE4] hover:bg-[#5B3EE4]/5 transition-all duration-300 group"
                            >
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-[#5B3EE4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600 group-hover:text-[#5B3EE4]">Settings</span>
                            </Link>
                            <button 
                              onClick={logout} 
                              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all duration-300 group"
                            >
                              <svg className="w-4 h-4 text-gray-600 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span className="text-xs font-medium text-gray-600 group-hover:text-red-500">Logout</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-[#1f2937]">Edit Profile</div>
                          <div>
                            <label className="block text-xs text-[#6b5b47] mb-1" style={typography.caption}>Name</label>
                            <input 
                              value={formName} 
                              onChange={e => setFormName(e.target.value)} 
                              className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-colors duration-300" 
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
                              className="flex-1 btn-outline-brand py-2"
                              style={typography.buttonSmall}
                            >
                              Cancel
                            </button>
                            <button 
                              disabled={isSaving} 
                              onClick={handleSave} 
                              className="flex-1 btn-brand disabled:opacity-60 text-white py-2"
                              style={typography.buttonSmall}
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      )}
                      </div>
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
              className="bg-[#f3f4f6] inline-flex items-center justify-center p-2 rounded-lg text-[#6b7280] hover:text-[#4F46E5] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#4F46E5] transition-all duration-300 relative overflow-hidden group"
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
            {navItems.map((item) => {
              const isRegister = item.name.toLowerCase() === 'register';
              const isLogin = item.name.toLowerCase() === 'login';
              const base = 'block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300';
              const linkLook = 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#4F46E5]';
              const btnPrimary = 'btn-brand text-white text-center';
              const btnOutline = 'btn-outline-brand text-center';
              const cls = isRegister ? `${btnPrimary}` : isLogin ? `${btnOutline}` : `${linkLook}`;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${base} ${cls}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            {user ? (
              <div className="px-3 py-3 border-t border-[#e8ddd4] mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {avatarSrc ? (
                    <Link to="/settings" className="w-9 h-9 rounded-full overflow-hidden border border-[#e8ddd4] shadow-sm" onClick={() => setIsOpen(false)}>
                      <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                    </Link>
                  ) : (
                    <Link to="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white flex items-center justify-center text-sm font-bold shadow-sm" onClick={() => setIsOpen(false)}>
                      {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                    </Link>
                  )}
                  <Link to="/settings" className="text-sm font-semibold text-[#4F46E5]" onClick={() => setIsOpen(false)}>{user.name}</Link>
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
