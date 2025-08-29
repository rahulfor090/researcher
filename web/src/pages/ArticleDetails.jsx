import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients, secondaryButtonStyle, shadows as shadowsTheme } from '../theme';
import { useAuth } from '../auth';

export default function ArticleDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: gradients.app }}>
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
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', color: '#e5e7eb' }}>
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
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user?.email || ''}</div>
          </div>
        </div>
        <nav>
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
      <div style={{ flexGrow: 1, padding: '40px', maxWidth: '800px', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button
            onClick={() => nav(-1)}
            style={{ ...primaryButtonStyle }}
          >
            ← Back
          </button>
        </div>

        <div style={{ ...cardStyle, padding: '24px', boxShadow: shadows.medium }}>
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
    </div>
  );
}
