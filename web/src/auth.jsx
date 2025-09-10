import { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken, isTokenExpired } from './api';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setAuthToken(t);
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };
  const logout = () => { localStorage.removeItem('token'); setAuthToken(null); setUser(null); };
  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

export function Protected({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    const urlRefresh = params.get('refreshToken');
    if (urlToken && !isTokenExpired(urlToken)) {
      setAuthToken(urlToken, urlRefresh || undefined);
      // Strip token params from URL
      navigate({ pathname: location.pathname }, { replace: true });
    }
    setReady(true);
  }, [location.search, location.pathname, navigate]);

  if (!ready) return null;

  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
