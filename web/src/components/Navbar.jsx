import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
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

  const navItems = user ? [
    { name: 'Home', path: '/' },
    { name: 'Library', path: '/library' },
    { name: 'Upgrade', path: '/upgrade' },
  ] : [
    { name: 'Home', path: '/' },
    { name: 'Membership', path: '/upgrade' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md fixed w-full z-50 top-0 left-0 animate-fade-in-down border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <img src="/upload/brand/research-locker-logo.png" alt="Research Locker" className="h-9 w-9 rounded-xl shadow-sm ring-1 ring-gray-200 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="text-gray-800 text-2xl font-bold group-hover:text-gray-900 transition-colors">Research Locker</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="relative ml-4" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(v => !v)}
                    className="flex items-center space-x-2 group"
                  >
                    {avatarSrc ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                        {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                      </div>
                    )}
              <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                      {!isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {avatarSrc ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                                {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[12rem]">{user.email}</div>
                            </div>
                          </div>
                          <button onClick={() => setIsEditing(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-2 rounded-md">Edit Profile</button>
                          <div className="flex gap-2">
                            <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-700 text-sm py-2 rounded-md">Settings</Link>
                            <button onClick={logout} className="flex-1 text-center border border-gray-200 hover:border-gray-300 text-gray-700 text-sm py-2 rounded-md">Logout</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            {avatarSrc ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">
                                {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                              </div>
                            )}
                            <div className="text-sm font-semibold text-gray-900">Edit Profile</div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Name</label>
                            <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Profile picture</label>
                            <input type="file" accept="image/*" onChange={e => setFormImage(e.target.files?.[0] || null)} className="w-full text-sm" />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button disabled={isSaving} onClick={() => { setIsEditing(false); setFormImage(null); }} className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm py-2 rounded-md">Cancel</button>
                            <button disabled={isSaving} onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-md">{isSaving ? 'Saving...' : 'Save'}</button>
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
              className="bg-teal-50 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-50 focus:ring-teal-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:bg-teal-50 hover:text-teal-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="px-3 py-3 border-t border-gray-100 mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {avatarSrc ? (
                    <Link to="/settings" className="w-9 h-9 rounded-full overflow-hidden border border-gray-200" onClick={() => setIsOpen(false)}>
                      <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                    </Link>
                  ) : (
                    <Link to="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold" onClick={() => setIsOpen(false)}>
                      {user.name?.slice(0,1)?.toUpperCase() || 'U'}
                    </Link>
                  )}
                  <Link to="/settings" className="text-sm font-semibold text-teal-700" onClick={() => setIsOpen(false)}>{user.name}</Link>
                </div>
                <button onClick={() => { setIsOpen(false); logout(); }} className="text-gray-700 hover:text-red-600 text-sm">Logout</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
