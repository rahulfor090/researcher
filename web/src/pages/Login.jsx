import { useState } from 'react';
import { useAuth } from '../auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setE] = useState('');
  const [password, setP] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/');
    } catch (ex) {
      setErr(ex?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Left Branding Sidebar */}
      <div style={{
        width: '320px',
        backgroundColor: '#111827',
        color: 'white',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px', color: '#e5e7eb' }}>
          Research Locker
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: '1.5' }}>
          Securely log in to manage your research library, collections, and insights all in one place.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <form onSubmit={submit} style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px', color: '#1f2937' }}>
            Login
          </h2>

          {err && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              borderRadius: '8px'
            }}>
              {err}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <input
              placeholder="Email"
              value={email}
              onChange={e => setE(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setP(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>

          <button style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            Login
          </button>

          <p style={{ marginTop: '16px', fontSize: '0.95rem', color: '#374151' }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 500 }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
