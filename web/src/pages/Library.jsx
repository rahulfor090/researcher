import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, secondaryButtonStyle, gradients, shadows } from '../theme';
import { useAuth } from '../auth';
import ArticleFormModal from '../components/ArticleFormModal';

export default function Library() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const initials = (user?.name || 'User ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  // Hover animation helpers for action buttons
  const onActionEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 6px 12px -4px rgba(0,0,0,0.15)';
  };
  const onActionLeave = (e) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '';
  };

  // Load articles from backend
  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
  };

  // Save new or edited article
  const handleSaveArticle = async (articleData) => {
    if (editArticle) {
      // Edit mode
      await api.put(`/articles/${editArticle.id}`, articleData);
    } else {
      // Add mode
      await api.post('/articles', articleData);
    }
    setEditArticle(null);
    setShowModal(false);
    load();
  };

  // Delete article and update UI without reload
  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch {
      alert('Failed to delete article.');
    }
  };

  // Open modal in edit mode
  const handleEditArticle = (article) => {
    setEditArticle(article);
    setShowModal(true);
  };

  // Filter articles based on search term
  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.doi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authors?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { load(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: gradients.app, fontFamily: 'Inter, sans-serif' }}>
      {/* Left Navigation Sidebar */}
      <div
        style={{
          width: '280px',
          background: gradients.sidebar,
          color: 'white',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: shadows.medium,
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          position: 'relative',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', color: '#e5e7eb' }}>
          Research Locker
        </h1>
        <div
          onClick={() => setShowProfileMenu(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '16px',
            cursor: 'pointer',
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
        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              top: '96px',
              left: '24px',
              right: '24px',
              background: 'white',
              color: colors.primaryText,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              boxShadow: shadows.soft,
              overflow: 'hidden',
              zIndex: 30,
              animation: 'dropdownIn 180ms ease-out forwards',
              transformOrigin: 'top center',
            }}
          >
            <button
              style={{
                display: 'block',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              Settings
            </button>
            <button
              style={{
                display: 'block',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              About
            </button>
          </div>
        )}
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
                  cursor: 'pointer',
                  transition: 'background 180ms ease, transform 180ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = '';
                }}
                onClick={() => {
                  if (path) nav(path);
                }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flexGrow: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#1f2937',
              letterSpacing: '-0.02em',
            }}
          >
            Library
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setBulkEditMode(v => !v)}
              style={{
                ...secondaryButtonStyle,
                backgroundColor: bulkEditMode ? colors.highlight : secondaryButtonStyle.backgroundColor,
              }}
            >
              {bulkEditMode ? 'Done' : 'Edit'}
            </button>
            <button
              style={{ marginLeft: '12px', ...primaryButtonStyle }}
              onClick={() => {
                setEditArticle(null);
                setShowModal(true);
              }}
            >
              + Add New
            </button>
          </div>
        </div>

        <div
          style={{ ...cardStyle }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = shadows.medium;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = shadows.soft;
            e.currentTarget.style.transform = '';
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.primaryText }}>
              My Articles
            </h3>
            <div
              style={{
                fontSize: '0.9rem',
                color: colors.mutedText,
                padding: '6px 12px',
                background: 'rgba(13, 148, 136, 0.1)',
                borderRadius: '20px',
                border: `1px solid rgba(13, 148, 136, 0.2)`,
              }}
            >
              {filteredArticles.length} of {articles.length} articles
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.primaryText,
                    }}
                  >
                    S.No
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.primaryText,
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.primaryText,
                    }}
                  >
                    DOI
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.primaryText,
                    }}
                  >
                    Authors
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '10px 12px',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.primaryText,
                    }}
                  >
                    Details
                  </th>
                  {bulkEditMode && (
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '10px 12px',
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.primaryText,
                      }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((a, idx) => (
                  <tr key={a.id}>
                    <td
                      style={{
                        padding: '12px',
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.primaryText,
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colors.link, textDecoration: 'none', fontWeight: 600 }}
                      >
                        {a.title}
                      </a>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.primaryText,
                      }}
                    >
                      {a.doi || '-'}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.primaryText,
                      }}
                    >
                      {a.authors || '-'}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        borderBottom: `1px solid ${colors.border}`,
                        textAlign: 'center',
                      }}
                    >
                      <button
                        onClick={() => nav(`/library/article/${a.id}`)}
                        style={{
                          ...primaryButtonStyle,
                          padding: '6px 12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={onActionEnter}
                        onMouseLeave={onActionLeave}
                      >
                        Article Details
                      </button>
                    </td>
                    {bulkEditMode && (
                      <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            style={{
                              background: colors.mutedText,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            }}
                            onMouseEnter={onActionEnter}
                            onMouseLeave={onActionLeave}
                            onClick={() => handleEditArticle(a)}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              background: colors.highlight,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                            }}
                            onMouseEnter={onActionEnter}
                            onMouseLeave={onActionLeave}
                            onClick={() => handleDeleteArticle(a.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Filters & Recent Activity) */}
      <div style={{ width: '420px', backgroundColor: 'transparent', padding: '40px 20px 40px 20px' }}>
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ marginTop: 0, marginBottom: '12px', color: colors.primaryText }}>Filters</h4>
            <button
              style={{
                background: 'transparent',
                color: colors.link,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              onClick={() => {
                setSearchTerm('');
              }}
            >
              Clear
            </button>
          </div>

          {/* Search field with icon */}
          <div style={{ position: 'relative', marginTop: '12px', marginBottom: '16px' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.mutedText,
              }}
            >
              🔎
            </span>
            <input
              type="text"
              placeholder="Search articles, titles, DOI..."
              style={{
                width: '100%',
                maxWidth: '100%',
                padding: '12px 12px 12px 36px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                display: 'block',
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ ...cardStyle }}>
          <h4 style={{ marginTop: 0, marginBottom: '8px', color: colors.primaryText }}>Recent Activity</h4>
          <p style={{ color: colors.mutedText }}>No recent activity yet.</p>
        </div>
      </div>

      {/* Conditionally render the ArticleFormModal */}
      {showModal && (
        <ArticleFormModal
          onClose={() => {
            setShowModal(false);
            setEditArticle(null);
          }}
          onSave={handleSaveArticle}
          initialData={editArticle}
        />
      )}

      {/* Animations keyframes */}
      <style>
        {`@keyframes dropdownIn { from { opacity: 0; transform: scaleY(0.9); } to { opacity: 1; transform: scaleY(1); } }`}
      </style>
    </div>
  );
}