import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, secondaryButtonStyle, gradients, shadows } from '../theme';
import { useAuth } from '../auth';
import ArticleFormModal from '../components/ArticleFormModal';
import SummaryModal from '../components/SummaryModal';
import Layout from '../components/Layout';

export default function Library() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [search, setSearch] = useState(''); // Add search state
  const [uploadingArticleId, setUploadingArticleId] = useState(null);
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState(new Set());
  const [onlyMissingPdf, setOnlyMissingPdf] = useState(false);
  const [showSummary, setShowSummary] = useState(null); // { id, summary }
  const initials = (user?.name || 'User ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [genState, setGenState] = useState({ articleId: null, percent: 0, stage: 0, label: '' });
  const genStages = [
    { name: 'Uploading', desc: 'Sending PDF to the server' },
    { name: 'Processing', desc: 'Validating and preparing the file' },
    { name: 'Extracting', desc: 'Reading and extracting text' },
    { name: 'Generating summary', desc: 'Creating AI-powered summary' },
    { name: 'Finalizing', desc: 'Saving results and refreshing' }
  ];

  // Load articles from backend
  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
    setTimeout(() => setIsLoaded(true), 100);
  };

  const fetchArticleById = async (id) => {
    try {
      const { data } = await api.get(`/articles/${id}`);
      return data;
    } catch {
      return null;
    }
  };

  // Upload PDF for an article and refresh
  const handleUploadPdf = async (article) => {
    try {
      setUploadingArticleId(article.id);
      const picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = 'application/pdf';
      picker.onchange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append('pdf', file);
        try {
          const { data } = await api.post(`/upload/pdf?id=${article.id}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
              if (!e.total) return;
              const pct = Math.min(60, Math.round((e.loaded / e.total) * 60));
              setGenState(prev => ({ articleId: article.id, percent: pct, stage: 0, label: genStages[0].name }));
            }
          });
          setGenState(prev => ({ articleId: article.id, percent: Math.max(prev.percent || 0, 65), stage: 1, label: genStages[1].name }));
            setGenState(prev => ({ articleId: article.id, percent: Math.max(prev.percent || 0, 65), stage: 1, label: genStages[1].name }));
          await load();
          if (data?.summary) {
            setGenState(prev => ({ articleId: article.id, percent: 100, stage: 4, label: genStages[4] }));
            setTimeout(() => setGenState({ articleId: null, percent: 0, stage: 0, label: '' }), 1200);
            setShowSummary({ id: article.id, summary: data.summary });
          } else {
            // Poll for summary a few times (background generation)
            let found = null;
            for (let i = 0; i < 5; i++) {
              await new Promise(r => setTimeout(r, 3000));
              const latest = await fetchArticleById(article.id);
              // Advance staged progress while polling
              setGenState(prev => {
                const nextPercent = Math.min(95, (prev.percent || 65) + 7);
                const nextStage = prev.stage < 3 ? prev.stage + 1 : 3;
                return { articleId: article.id, percent: nextPercent, stage: nextStage, label: genStages[nextStage].name };
              });
              if (latest && (latest.summary || latest.ai_summary || latest.summary_text)) {
                found = latest.summary || latest.ai_summary || latest.summary_text;
                break;
              }
            }
            if (found) {
              setGenState({ articleId: article.id, percent: 100, stage: 4, label: genStages[4].name });
              setTimeout(() => setGenState({ articleId: null, percent: 0, stage: 0, label: '' }), 1200);
              setShowSummary({ id: article.id, summary: found });
            } else {
              setGenState(prev => ({ articleId: article.id, percent: Math.max(prev.percent || 90, 90), stage: 3, label: genStages[3].name }));
              setShowSummary({ id: article.id, summary: 'No summary available yet. Try opening details to refresh.' });
              setTimeout(() => setGenState({ articleId: null, percent: 0, stage: 0, label: '' }), 1500);
            }
          }
          // Mark as recently updated for UX feedback
          setRecentlyUpdatedIds(prev => {
            const next = new Set(prev);
            next.add(article.id);
            return next;
          });
          setTimeout(() => {
            setRecentlyUpdatedIds(prev => {
              const next = new Set(prev);
              next.delete(article.id);
              return next;
            });
          }, 3000);
        } catch (err) {
          console.error('Upload failed', err);
          alert('Failed to upload/process PDF.');
        }
        setUploadingArticleId(null);
      };
      picker.click();
    } catch (err) {
      console.error(err);
      setUploadingArticleId(null);
    }
  };

  // Save new or edited article
  const handleSaveArticle = async (articleData) => {
    if (!editArticle && user?.plan === "free" && articles.length >= 10) {
      // Show upgrade modal before saving if limit is reached (only for free accounts)
      setShowLimitModal(true);
      setShowModal(false);
      setEditArticle(null);
      return;
    }
    try {
      if (editArticle) {
        await api.put(`/articles/${editArticle.id}`, articleData);
      } else {
        await api.post('/articles', articleData);
      }
      setEditArticle(null);
      setShowModal(false);
      load();
    } catch (err) {
      // Handle article limit error from backend
      if (
        user?.plan === "free" &&
        err?.response?.data?.message?.toLowerCase().includes("article limit")
      ) {
        setShowLimitModal(true);
        setShowModal(false);
        setEditArticle(null);
      } else {
        setShowLimitModal(true);
      }
    }
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

  // Handle row selection
  const handleRowSelection = (articleId, event) => {
    event.stopPropagation();
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(articleId)) {
      newSelectedRows.delete(articleId);
    } else {
      newSelectedRows.add(articleId);
    }
    setSelectedRows(newSelectedRows);
  };

  // Select all rows
  const handleSelectAll = () => {
    if (selectedRows.size === articles.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(articles.map(a => a.id)));
    }
  };

  useEffect(() => { load(); }, []);

  // Read URL filter (?missing=1)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setOnlyMissingPdf(params.get('missing') === '1');
  }, [location.search]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileMenu) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Filtered articles based on search
  let filteredArticles = articles.filter(a => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.doi && a.doi.toLowerCase().includes(q)) ||
      (a.authors && a.authors.toLowerCase().includes(q))
    );
  });
  if (onlyMissingPdf) {
    filteredArticles = filteredArticles.filter(a => {
      const hasPdf = !!(a.file_name || a.pdf || a.pdfUrl || a.pdf_url);
      return !hasPdf;
    });
  }

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Layout>
      <div
        style={{
          flexGrow: 1,
          padding: isMobile ? '16px' : '40px',
          display: 'flex',
          flexDirection: 'column',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          animation: 'fadeInRight 0.6s ease-out 0.3s both'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            animation: 'fadeInDown 0.8s ease-out 0.5s both'
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '2.25rem',
                fontWeight: 700,
                color: '#1f2937',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              📚 Research Library
            </h2>
            <p style={{
              color: colors.mutedText,
              fontSize: '1rem',
              margin: 0,
              fontWeight: 400
            }}>
              Manage and organize your research articles
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(13, 148, 136, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(13, 148, 136, 0.2)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              <span style={{ fontSize: '0.9rem', color: colors.primaryText, fontWeight: 600 }}>
                {articles.length} Total Articles
              </span>
            </div>
            <button
              style={{ 
                ...primaryButtonStyle,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                setEditArticle(null);
                setShowModal(true);
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(249, 115, 22, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>+</span> Add New Article
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeInDown 0.7s ease-out 0.6s both'
        }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search articles by title, DOI, or author..."
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: `1px solid ${colors.border}`,
              fontSize: '1rem',
              width: '100%',
              maxWidth: '400px',
              background: '#f8fafc',
              color: colors.primaryText,
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.currentTarget.style.border = `1.5px solid ${colors.link}`}
            onBlur={e => e.currentTarget.style.border = `1px solid ${colors.border}`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: colors.mutedText,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              title="Clear search"
            >
              ✖
            </button>
          )}
          {onlyMissingPdf && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px',
              color: '#ef4444'
            }}>
              <span>📄</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Showing articles without uploaded PDF</span>
              <button
                onClick={() => nav('/library')}
                style={{
                  marginLeft: '6px',
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  color: colors.primaryText,
                  fontSize: '0.8rem'
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Library Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
          animation: 'fadeInUp 0.8s ease-out 0.7s both'
        }}>
          {[
            {
              count: articles.length,
              label: 'Total Articles',
              icon: '📄',
              color: '#3b82f6',
              bgColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
              description: 'Articles in library'
            },
            {
              count: articles.filter(a => a.doi).length,
              label: 'With DOI',
              icon: '✅',
              color: '#22c55e',
              bgColor: 'rgba(34, 197, 94, 0.1)',
              borderColor: 'rgba(34, 197, 94, 0.2)',
              description: 'Properly referenced'
            },
            {
              count: articles.filter(a => a.url).length,
              label: 'With Links',
              icon: '🔗',
              color: '#8b5cf6',
              bgColor: 'rgba(139, 92, 246, 0.1)',
              borderColor: 'rgba(139, 92, 246, 0.2)',
              description: 'Accessible online'
            },
            {
              count: Math.round((articles.filter(a => a.file_name).length / Math.max(articles.length, 1)) * 100),
              label: 'Complete %',
              icon: '🎯',
              color: '#f59e0b',
              bgColor: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.2)',
              description: 'PDFs uploaded',
              isPercentage: true
            }
          ].map((stat, index) => (
            <div
              key={stat.label}
              style={{
                padding: '20px',
                background: stat.bgColor,
                borderRadius: '16px',
                border: `1px solid ${stat.borderColor}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animation: `fadeInUp 0.6s ease-out ${0.9 + index * 0.1}s both`,
                transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                opacity: isLoaded ? 1 : 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 12px 24px ${stat.color}20`;
                e.currentTarget.style.border = `2px solid ${stat.color}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.border = `1px solid ${stat.borderColor}`;
              }}
              onClick={() => {
                if (stat.label === 'Complete %') {
                  nav('/library?missing=1');
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '1.8rem' }}>{stat.icon}</span>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: stat.color
                }}>
                  {stat.count}{stat.isPercentage ? '%' : ''}
                </div>
              </div>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: colors.primaryText,
                marginBottom: '4px'
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: colors.mutedText
              }}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Articles Table */}
        <div
          style={{ 
            ...cardStyle,
            marginBottom: '24px',
            animation: `fadeInUp 0.8s ease-out ${isLoaded ? '1.1s' : '0s'} both`,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            opacity: isLoaded ? 1 : 0,
            background: 'rgba(255,255,255,0.95)',
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            overflow: 'hidden'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = shadows.medium;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = shadows.soft;
            e.currentTarget.style.transform = 'translateY(0)';
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
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 600, 
                color: colors.primaryText,
                margin: '0 0 4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🗃️ My Articles Collection
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37,99,235,0.2)',
                  padding: '4px 8px',
                  borderRadius: '9999px'
                }}>Theme</span>
              </h3>
              <p style={{
                color: colors.mutedText,
                fontSize: '0.9rem',
                margin: 0
              }}>
                {articles.length === 0 ? 'Your research library is empty' : `Manage your ${articles.length} research articles`}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: colors.mutedText,
                  padding: '6px 12px',
                  background: 'rgba(13, 148, 136, 0.1)',
                  borderRadius: '20px',
                  border: `1px solid rgba(13, 148, 136, 0.2)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📊</span>
                {articles.length} articles
              </div>
              {articles.length > 0 && (
                <div style={{
                  fontSize: '0.85rem',
                  color: articles.filter(a => a.doi).length > articles.length * 0.7 ? '#22c55e' : '#f59e0b',
                  padding: '6px 12px',
                  background: articles.filter(a => a.doi).length > articles.length * 0.7 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '20px',
                  border: articles.filter(a => a.doi).length > articles.length * 0.7 ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{articles.filter(a => a.doi).length > articles.length * 0.7 ? '✅' : '⚠️'}</span>
                  {Math.round((articles.filter(a => a.doi).length / articles.length) * 100)}% with DOI
                </div>
              )}
            </div>
          </div>
          
          {/* Selection Summary */}
          {selectedRows.size > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(13, 148, 136, 0.1)',
              border: `1px solid rgba(13, 148, 136, 0.2)`,
              borderRadius: '8px',
              marginBottom: '16px',
              animation: 'fadeInDown 0.3s ease-out'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: colors.primaryText
                }}>
                  ✅ {selectedRows.size} article{selectedRows.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <button
                  onClick={() => setSelectedRows(new Set())}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: colors.primaryText,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = colors.mutedText;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colors.primaryText;
                  }}
                >
                  Clear Selection
                </button>
                <button
                  style={{
                    padding: '6px 12px',
                    background: colors.link,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#0f766e';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = colors.link;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🗑️ Delete Selected
                </button>
              </div>
            </div>
          )}
          
          {articles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              color: colors.mutedText,
              background: 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              border: `1px dashed ${colors.border}`
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📚</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', color: colors.primaryText }}>
                Your Library is Empty
              </div>
              <div style={{ fontSize: '1rem', marginBottom: '24px', lineHeight: 1.5 }}>
                Start building your research collection by adding your first article.<br/>
                You can add articles with DOI, URLs, or manual entries.
              </div>
              <button
                onClick={() => {
                  setEditArticle(null);
                  setShowModal(true);
                }}
                style={{
                  background: colors.link,
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 148, 136, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>🚀</span> Add Your First Article
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: 'rgba(37,99,235,0.06)' }}>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '14px 16px',
                        borderBottom: `2px solid ${colors.border}`,
                        color: colors.primaryText,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        width: '50px'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRows.size === articles.length && articles.length > 0}
                        onChange={handleSelectAll}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: colors.highlight
                        }}
                      />
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '14px 16px',
                        borderBottom: `2px solid ${colors.border}`,
                        color: colors.primaryText,
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      🔢 No.
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderBottom: `2px solid ${colors.border}`,
                        color: colors.primaryText,
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      📄 Title
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderBottom: `2px solid ${colors.border}`,
                        color: colors.primaryText,
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      🏷️ DOI
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderBottom: `2px solid ${colors.border}`,
                        color: colors.primaryText,
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      👥 Authors
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '14px 16px',
                        borderBottom: `2px solid ${colors.border}`,
                        color: colors.primaryText,
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((a, idx) => {
                    const hasPdf = !!(a.file_name || a.pdf || a.pdfUrl || a.pdf_url);
                    const hasSummary = !!(a.summary || a.ai_summary || a.summary_text);
                    const isSelected = selectedRows.has(a.id);
                    return (
                    <tr 
                      key={a.id}
                      style={{
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`,
                        background: isSelected ? 'rgba(13, 148, 136, 0.1)' : (idx % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent'),
                        borderLeft: isSelected ? `4px solid ${colors.highlight}` : '4px solid transparent'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = idx % 2 === 1 ? 'rgba(13, 148, 136, 0.04)' : 'rgba(13, 148, 136, 0.03)';
                        }
                        e.currentTarget.style.transform = 'translateX(4px)';
                        // Animate the number badge
                        const badge = e.currentTarget.querySelector('td:nth-child(2) div div');
                        if (badge) {
                          badge.style.transform = 'scale(1.1) rotate(5deg)';
                          badge.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = idx % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent';
                        }
                        e.currentTarget.style.transform = 'translateX(0)';
                        // Reset the number badge
                        const badge = e.currentTarget.querySelector('td:nth-child(2) div div');
                        if (badge) {
                          badge.style.transform = 'scale(1) rotate(0deg)';
                          badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }
                      }}
                      onClick={() => nav(`/library/article/${a.id}`)}
                    >
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: 'center',
                          width: '50px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelection(a.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer',
                            accentColor: colors.highlight
                          }}
                        />
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: `1px solid ${colors.border}`,
                          color: colors.primaryText,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: `linear-gradient(135deg, ${colors.highlight}, #f97316)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                          }}>
                            {idx + 1}
                          </div>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        borderBottom: `1px solid ${colors.border}`,
                        maxWidth: '300px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: a.doi ? '#22c55e' : '#f59e0b',
                            flexShrink: 0
                          }} />
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: colors.link, 
                              textDecoration: 'none', 
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                            onClick={e => e.stopPropagation()}
                            onMouseEnter={e => {
                              e.currentTarget.style.textDecoration = 'underline';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.textDecoration = 'none';
                            }}
                          >
                            {a.title || 'Untitled Article'}
                          </a>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: `1px solid ${colors.border}`,
                          color: colors.primaryText,
                        }}
                      >
                        {a.doi ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 8px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '6px',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            fontSize: '0.8rem',
                            maxWidth: 'fit-content'
                          }}>
                            <span>✅</span>
                            <span style={{ 
                              fontFamily: 'monospace',
                              color: '#22c55e',
                              fontWeight: 600
                            }}>
                              {a.doi.length > 20 ? `${a.doi.substring(0, 20)}...` : a.doi}
                            </span>
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 8px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '6px',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            fontSize: '0.8rem',
                            color: '#f59e0b',
                            maxWidth: 'fit-content'
                          }}>
                            <span>⚠️</span>
                            <span>No DOI</span>
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: `1px solid ${colors.border}`,
                          color: colors.primaryText,
                          maxWidth: '200px'
                        }}
                      >
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {a.authors || (
                            <span style={{ 
                              color: colors.mutedText,
                              fontStyle: 'italic'
                            }}>
                              Unknown authors
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          borderBottom: `1px solid ${colors.border}`,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {/* Upload state and status */}
                        {uploadingArticleId === a.id && (
                          <div style={{ minWidth: 320 }} onClick={(e) => e.stopPropagation()} aria-live="polite">
                            {/* Title and % */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>
                                  {genState.stage >= 4 ? '✅' : genState.stage >= 1 ? '⚙️' : '⬆️'}
                                </span>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: colors.primaryText }}>
                                  {genState.articleId === a.id ? (genState.label || genStages[0].name) : genStages[0].name}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: colors.mutedText }}>
                                {genState.articleId === a.id ? genState.percent : 0}%
                              </div>
                            </div>

                            {/* Description */}
                            <div style={{ fontSize: '0.75rem', color: colors.mutedText, marginBottom: 6 }}>
                              {genState.articleId === a.id ? genStages[genState.stage]?.desc : genStages[0].desc}
                            </div>

                            {/* Progress Bar */}
                            <div style={{ width: '100%', height: 12, background: '#f3f4f6', borderRadius: 9999, overflow: 'hidden', border: `1px solid ${colors.border}`, position: 'relative' }}>
                              {/* animated stripes overlay */}
                              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 8px, transparent 8px, transparent 16px)', backgroundSize: '24px 24px', animation: 'rlStripe 1s linear infinite', pointerEvents: 'none' }} />
                              <div style={{ height: '100%', width: `${genState.articleId === a.id ? genState.percent : 0}%`, background: `linear-gradient(90deg, ${colors.link}, ${colors.highlight})`, transition: 'width 140ms ease', position: 'relative' }} />
                            </div>

                            {/* Timeline with icons */}
                            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                              {genStages.map((s, idx) => {
                                const isDone = genState.articleId === a.id && idx < (genState.stage || 0);
                                const isCurrent = genState.articleId === a.id && idx === (genState.stage || 0);
                                return (
                                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 18, height: 18, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? colors.link : isCurrent ? colors.highlight : '#e5e7eb', color: isDone || isCurrent ? '#fff' : '#6b7280', fontSize: '0.7rem', boxShadow: (isDone || isCurrent) ? '0 0 0 3px rgba(13,148,136,0.12)' : 'none' }}>
                                      {isDone ? '✓' : isCurrent ? '•' : ''}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: isDone || isCurrent ? colors.primaryText : colors.mutedText }}>{s.name}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {uploadingArticleId !== a.id && recentlyUpdatedIds.has(a.id) && (
                          <div style={{
                            padding: '6px 10px',
                            background: 'rgba(34,197,94,0.12)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: '8px',
                            color: '#16a34a',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span>✅</span> Updated
                          </div>
                        )}

                        {/* Upload PDF CTA when missing */}
                        {uploadingArticleId !== a.id && !recentlyUpdatedIds.has(a.id) && (!hasPdf) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUploadPdf(a); }}
                            style={{
                              background: colors.link,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <span>⬆️</span> Upload PDF 
                          </button>
                        )}

                        {/* PDF present indicator */}
                        {hasPdf && (
                          <div style={{
                            padding: '6px 10px',
                            background: 'rgba(34,197,94,0.12)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: '8px',
                            color: '#16a34a',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span>📄</span> {hasSummary ? 'PDF & Summary ready' : 'PDF ready'}
                          </div>
                        )}

                      {/* View Details Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nav(`/library/article/${a.id}`);
                          }}
                          style={{
                            ...primaryButtonStyle,
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span>👁️</span> View
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditArticle(a);
                          }}
                          style={{
                            background: colors.mutedText,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span>✏️</span> Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteArticle(a.id);
                          }}
                          style={{
                            background: colors.highlight,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                            e.currentTarget.style.background = '#dc2626';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.background = colors.highlight;
                          }}
                        >
                          <span>🔥</span> Delete
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showLimitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            color: colors.primaryText,
            borderRadius: '16px',
            boxShadow: shadows.medium,
            padding: '40px 32px',
            minWidth: '375px',
            maxWidth: '95vw',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚫</div>
              <h2 style={{ margin: '0 0 10px 0', fontWeight: 700, fontSize: '1.5rem', color: colors.highlight }}>
                Article Limit Reached
              </h2>
              <p style={{ fontSize: '1rem', marginBottom: '20px', color: colors.mutedText }}>
                Free accounts can save up to <b>10 articles</b>.<br />
                Upgrade to unlock unlimited articles and more features.
              </p>
              <button
                style={{
                  ...primaryButtonStyle,
                  fontWeight: 700,
                  fontSize: '1.09rem',
                  padding: '12px 32px',
                  borderRadius: '10px',
                  marginBottom: '6px'
                }}
                onClick={() => {
                  setShowLimitModal(false);
                  nav('/upgrade');
                }}
              >
                Upgrade for $49
              </button>
            <div>
              <button
                style={{
                  ...secondaryButtonStyle,
                  fontWeight: 600,
                  fontSize: '0.96rem',
                  marginTop: '10px'
                }}
                onClick={() => setShowLimitModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Summary modal after upload */}
      {showSummary && (
        <SummaryModal
          summary={showSummary.summary}
          onClose={() => setShowSummary(null)}
          onViewDetails={() => {
            const id = showSummary.id;
            setShowSummary(null);
            nav(`/library/article/${id}`);
          }}
        />
      )}

      {/* Enhanced Animations keyframes */}
      <style>
        {`
          @keyframes libraryFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-25px) rotate(90deg); }
            50% { transform: translateY(20px) rotate(180deg); }
            75% { transform: translateY(-15px) rotate(270deg); }
          }
          @keyframes rlStripe { from { background-position: 0 0; } to { background-position: 24px 0; } }
          
          @keyframes libraryPulse {
            0%, 100% { transform: scale(1); opacity: 0.05; }
            50% { transform: scale(1.2); opacity: 0.1; }
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
          
          @keyframes slideInRight {
            from { 
              opacity: 0; 
              transform: translateX(100px) scale(0.95); 
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
          
          @keyframes fadeInLeft {
            from { 
              opacity: 0; 
              transform: translateX(-30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes fadeInRight {
            from { 
              opacity: 0; 
              transform: translateX(30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes dropdownIn { 
            from { opacity: 0; transform: scaleY(0.9) scale(0.95); } 
            to { opacity: 1; transform: scaleY(1) scale(1); } 
          }
          
          @keyframes slideDown {
            0% { 
              opacity: 0; 
              transform: translateY(-15px) scaleY(0.95) scale(0.95); 
              maxHeight: 0;
              filter: blur(4px);
            }
            30% {
              opacity: 0.3;
              transform: translateY(-8px) scaleY(0.98) scale(0.98);
              maxHeight: 60px;
              filter: blur(2px);
            }
            70% {
              opacity: 0.8;
              transform: translateY(-2px) scaleY(0.99) scale(0.99);
              maxHeight: 160px;
              filter: blur(1px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scaleY(1) scale(1); 
              maxHeight: 200px;
              filter: blur(0px);
            }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </Layout>
  );
}