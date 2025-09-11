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
  return <AuthCtx.Provider value={{ user, setUser, login, register, logout }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);

export function Protected({ children }) {
  const { setUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    console.log('Protected component checking authentication...');
    
    // Check for token in localStorage first
    const localToken = localStorage.getItem('token');
    console.log('Local token:', localToken ? 'exists' : 'not found');
    
    if (localToken) {
      setHasToken(true);
      setIsChecking(false);
      return;
    }
    
    // Check for OAuth callback parameters (Google, Twitter, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    
    console.log('URL params - token:', token ? 'exists' : 'not found', 'name:', name, 'email:', email);
    
    if (token) {
      console.log('Processing OAuth callback...');
      // Store the token from any OAuth provider
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      // For Google OAuth, we get user info from URL params
      if (name && email) {
        setUser({ name, email, plan: 'free' });
      }
      // For other OAuth providers like Twitter, we'll fetch user info from the server
      else {
        // Fetch user info using the token
        api.get('/v1/auth/me').then(({ data }) => {
          setUser(data.user);
        }).catch(console.error);
      }
      
      setHasToken(true);
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      console.log('OAuth callback processed successfully');
    }
    
    setIsChecking(false);
  }, [setUser]);
  
  console.log('Protected component state - isChecking:', isChecking, 'hasToken:', hasToken);
  
  if (isChecking) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>Loading...</div>;
  }
  
  return hasToken ? children : <Navigate to="/login" replace />;

}
