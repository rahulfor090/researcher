import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients, secondaryButtonStyle, shadows as shadowsTheme } from '../theme';
import { useAuth } from '../auth';

export default function ArticleDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initials = (user?.name || 'User  ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', color: 'red' }}>{error}</div>;
  if (!article) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Article not found.</div>;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: 'Inter, sans-serif', 
      background: gradients.app,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `radial-gradient(circle at 30% 70%, rgba(13, 148, 136, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)`,
        animation: 'detailsFloat 35s ease-in-out infinite',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '12%',
        width: '180px',
        height: '180px',
        background: `linear-gradient(45deg, ${colors.link}, ${colors.highlight})`,
        borderRadius: '50%',
        opacity: 0.04,
        animation: 'detailsPulse 14s ease-in-out infinite',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '5%',
        width: '140px',
        height: '140px',
        background: `linear-gradient(45deg, ${colors.highlight}, ${colors.accent || colors.link})`,
        borderRadius: '50%',
        opacity: 0.03,
        animation: 'detailsPulse 18s ease-in-out infinite reverse',
        zIndex: 0
      }} />
      {/* Left Sidebar */}
      <div
        style={{
          width: '280px',
          background: gradients.sidebar,
          color: 'white',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: shadowsTheme.medium,
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          position: 'relative',
          animation: 'slideInLeft 0.6s ease-out'
        }}
      >
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '16px', 
          color: '#e5e7eb',
          animation: 'fadeInDown 0.8s ease-out 0.2s both'
        }}>
          Research Locker
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '16px',
            cursor: 'default',
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{user?.name || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user?.email || ''}</div>
          </div>
          <button
            onClick={() => {
              logout();
              nav('/login');
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 180ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            Logout
          </button>
        </div>
        <nav style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Dashboard', icon: '🏠', path: '/' },
              { label: 'Library', icon: '📚', path: '/library' },
              { label: 'Collections', icon: '🗂️', path: null },
              { label: 'All insights', icon: '📈', path: null },
            ].map(({ label, icon, path }) => (
              <li
                key={label}
                style={{
                  padding: '10px 12px',
                  color: '#cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: path ? 'pointer' : 'default',
                  transition: 'background 180ms ease, transform 180ms ease',
                }}
                onClick={() => {
                  if (path) nav(path);
                }}
                onMouseEnter={e => {
                  if (path) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = '';
                }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ 
        flexGrow: 1, 
        padding: '40px', 
        maxWidth: '800px', 
        margin: 'auto',
        animation: 'fadeInRight 0.6s ease-out 0.3s both',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '24px',
          animation: 'fadeInDown 0.8s ease-out 0.5s both'
        }}>
          <button
            onClick={() => nav(-1)}
            style={{ ...primaryButtonStyle }}
          >
            ← Back
          </button>
        </div>

        <div style={{ 
          ...cardStyle, 
          padding: '24px', 
          boxShadow: shadows.medium,
          animation: 'fadeInUp 0.8s ease-out 0.7s both'
        }}>
          <h1 style={{ marginTop: 0, color: colors.primaryText }}>{article.title}</h1>
          <p><strong>DOI:</strong> {article.doi || '-'}</p>
          <p><strong>Authors:</strong> {article.authors || '-'}</p>
          <p>
            <strong>URL:</strong>{' '}
            {article.url ? (
              <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.link }}>
                {article.url}
              </a>
            ) : (
              '-'
            )}
          </p>
          <div style={{ marginTop: '16px' }}>
            <h3>Abstract / Description</h3>
            <p>{article.abstract || 'No description available.'}</p>
            <button
              style={{
                marginTop: '16px',
                ...secondaryButtonStyle,
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '10px 16px',
              }}
              type="button"
            >
              Upload PDF
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>
        {`
          @keyframes detailsFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            20% { transform: translateY(-20px) rotate(72deg); }
            40% { transform: translateY(15px) rotate(144deg); }
            60% { transform: translateY(-10px) rotate(216deg); }
            80% { transform: translateY(25px) rotate(288deg); }
          }
          
          @keyframes detailsPulse {
            0%, 100% { transform: scale(1); opacity: 0.04; }
            50% { transform: scale(1.1); opacity: 0.08; }
          }
          
          @keyframes slideInLeft {
            from { 
              opacity: 0; 
              transform: translateX(-100px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes fadeInRight {
            from { 
              opacity: 0; 
              transform: translateX(50px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes fadeInDown {
            from { 
              opacity: 0; 
              transform: translateY(-30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
        `}}
      </style>
    </div>
  );
}
