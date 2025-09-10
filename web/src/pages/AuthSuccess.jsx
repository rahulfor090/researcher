import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, cardStyle } from '../theme';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      // No token found, redirect to login with error
      navigate('/login?error=auth_failed');
    }
  }, [location, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background
    }}>
      <div style={{
        ...cardStyle,
        padding: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: colors.primaryText, marginBottom: '16px' }}>
          Authenticating...
        </h2>
        <p style={{ color: colors.secondaryText }}>
          Please wait while we complete your login.
        </p>
        <div style={{
          width: '40px',
          height: '40px',
          border: `4px solid ${colors.border}`,
          borderTop: `4px solid ${colors.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }} />
      </div>
    </div>
  );
}