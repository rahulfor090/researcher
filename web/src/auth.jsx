import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from './api';
import { Navigate, useLocation } from 'react-router-dom';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Handle OAuth callback and token management
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setAuthToken(t);
      // Fetch user profile if we have a token but no user data
      if (!user) {
        api.get('/auth/me')
          .then(res => {
            setUser(res.data);
          })
          .catch(err => {
            console.error('Error fetching user profile:', err);
            // If token is invalid, clear it
            if (err.response?.status === 401) {
              localStorage.removeItem('token');
              setAuthToken(null);
            }
          })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [user]);
  // Handle OAuth callback from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        setAuthToken(token);
        setUser(userData);
        // Clear URL parameters
        window.history.replaceState({}, document.title, location.pathname);
        // Navigate to dashboard after successful OAuth login
        window.location.href = '/';
      } catch (error) {
        console.error('Error parsing user data from OAuth callback:', error);
      }
    }
  }, [location.search]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };
  
  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/v1/auth/google`;
  };
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };
  const logout = () => { localStorage.removeItem('token'); setAuthToken(null); setUser(null); };
  return <AuthCtx.Provider value={{ user, login, register, logout, googleLogin, loading }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

export function Protected({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
