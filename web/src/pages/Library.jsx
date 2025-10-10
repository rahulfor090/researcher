import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import { primaryButtonStyle, secondaryButtonStyle } from '../theme';
import { useAuth } from '../auth';
import ArticleFormModal from '../components/ArticleFormModal';
import SummaryModal from '../components/SummaryModal';
import Layout from '../components/Layout';
import './Library.scss';

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
  const [openMenuRowId, setOpenMenuRowId] = useState(null);
  const initials = (user?.name || 'User ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/v1';

  // Load articles from backend
  const load = async () => {
    const { data } = await api.get(`${BASE_API_URL}/articles`);
    setArticles(data);
    setTimeout(() => setIsLoaded(true), 100);
  };

  const fetchArticleById = async (id) => {
    try {
      const { data } = await api.get(`${BASE_API_URL}/articles/${id}`);
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
          const { data } = await api.post(`${BASE_API_URL}/upload/pdf?id=${article.id}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          await load();
          if (data?.summary) {
            setShowSummary({ id: article.id, summary: data.summary });
          } else {
            // Poll for summary a few times (background generation)
            let found = null;
            for (let i = 0; i < 5; i++) {
              await new Promise(r => setTimeout(r, 3000));
              const latest = await fetchArticleById(article.id);
              if (latest && (latest.summary || latest.ai_summary || latest.summary_text)) {
                found = latest.summary || latest.ai_summary || latest.summary_text;
                break;
              }
            }
            if (found) {
              setShowSummary({ id: article.id, summary: found });
            } else {
              setShowSummary({ id: article.id, summary: 'No summary available yet. Try opening details to refresh.' });
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
        await api.put(`${BASE_API_URL}/articles/${editArticle.id}`, articleData);
      } else {
        await api.post(`${BASE_API_URL}/articles`, articleData);
      }
      setEditArticle(null);
      setShowModal(false);
      load();
    } catch (err) {
      // Handle article limit error from backend
      if (user?.plan === "free" && err?.response?.data?.message?.toLowerCase().includes("article limit")) {
        setShowLimitModal(true);
        setShowModal(false);
        setEditArticle(null);
      } else {
        // Let the error propagate to the ArticleFormModal
        throw err;
      }
    }
  };

  // Delete article and update UI without reload
  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`${BASE_API_URL}/articles/${id}`);
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
      <div className="library-page">
        <div className="library-header">
          <div className="header-content">
            <h2 className="header-title">
              Research Library
            </h2>
            <p className="header-subtitle">
              Manage and organize your research articles
            </p>
          </div>
          <div className="header-actions">
              <button
              className="add-article-btn"
              style={primaryButtonStyle}
                onClick={() => {
                  setEditArticle(null);
                  setShowModal(true);
                }}
              >
                <span>+</span> Add New Article
              </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-card">
            <div className="search-wrapper">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles by title, DOI, or author..."
                className="search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                  className="clear-search-btn"
                title="Clear search"
              >
                ✖
              </button>
            )}
          </div>
          {onlyMissingPdf && (
              <div className="filter-badge">
              <span>📄</span>
                <span className="filter-text">Showing articles without uploaded PDF</span>
              <button
                onClick={() => nav('/library')}
                  className="clear-filter-btn"
              >
                Clear
              </button>
            </div>
          )}
          </div>
        </div>

        {/* Library Statistics */}
        <div className="stats-section">
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
          ].map((stat, index) => {
            const statClass = stat.label === 'Total Articles' ? 'stat-total' :
                             stat.label === 'With DOI' ? 'stat-doi' :
                             stat.label === 'With Links' ? 'stat-links' :
                             'stat-complete';
            const countClass = stat.label === 'Total Articles' ? 'count-total' :
                             stat.label === 'With DOI' ? 'count-doi' :
                             stat.label === 'With Links' ? 'count-links' :
                             'count-complete';
            
            return (
            <div
              key={stat.label}
                className={`stat-item ${statClass}`}
              onClick={() => {
                if (stat.label === 'Complete %') {
                  nav('/library?missing=1');
                }
              }}
            >
                <div className="stat-header">
                  <span className="stat-icon">{stat.icon}</span>
                  <div className={`stat-count ${countClass}`}>
                  {stat.count}{stat.isPercentage ? '%' : ''}
                </div>
              </div>
                <div className="stat-label">
                {stat.label}
              </div>
                <div className="stat-description">
                {stat.description}
              </div>
            </div>
            );
          })}
        </div>

        {/* Articles Table */}
        <div className="articles-section">
          <div className="section-header">
            <div>
              <h3 className="section-title">
                🗃️ My Articles Collection
                <span className="theme-badge">Theme</span>
              </h3>
              <p className="section-subtitle">
                {articles.length === 0 ? 'Your research library is empty' : `Manage your ${articles.length} research articles`}
              </p>
            </div>
            <div className="section-actions">
              {articles.length > 0 && (
                <div className={`doi-status-badge ${articles.filter(a => a.doi).length > articles.length * 0.7 ? 'status-good' : 'status-warning'}`}>
                  <span>{articles.filter(a => a.doi).length > articles.length * 0.7 ? '✅' : '⚠️'}</span>
                  {Math.round((articles.filter(a => a.doi).length / articles.length) * 100)}% with DOI
                </div>
              )}
            </div>
          </div>
          
          {/* Selection Summary */}
          {selectedRows.size > 0 && (
            <div className="selection-summary">
              <div className="selection-info">
                <span className="selection-text">
                  ✅ {selectedRows.size} article{selectedRows.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="selection-actions">
                <button
                  onClick={() => setSelectedRows(new Set())}
                  className="clear-selection-btn"
                >
                  Clear Selection
                </button>
                <button className="delete-selected-btn">
                  🗑️ Delete Selected
                </button>
              </div>
            </div>
          )}
          
          {articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div className="empty-title">
                Your Library is Empty
              </div>
              <div className="empty-description">
                Start building your research collection by adding your first article.<br/>
                You can add articles with DOI, URLs, or manual entries.
              </div>
              <button
                onClick={() => {
                  setEditArticle(null);
                  setShowModal(true);
                }}
                className="add-first-btn"
              >
                <span>🚀</span> Add Your First Article
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === articles.length && articles.length > 0}
                        onChange={handleSelectAll}
                        className="select-all-checkbox"
                      />
                    </th>
                    <th>🔢 No.</th>
                    <th>📄 Title</th>
                    <th>🏷️ DOI</th>
                    <th>👥 Authors</th>
                    <th>⋯</th>
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
                      className={`${isSelected ? 'row-selected' : ''} ${idx % 2 === 1 ? 'row-even' : ''}`}
                      onClick={() => nav(`/library/article/${a.id}`)}
                    >
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelection(a.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="row-checkbox"
                        />
                      </td>
                      <td className="number-cell">
                        <div className="row-number-badge">
                            {idx + 1}
                        </div>
                      </td>
                      <td className="title-cell">
                        <div className="title-content">
                          <div className={`doi-indicator ${a.doi ? 'has-doi' : 'no-doi'}`} />
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="article-title-link"
                            onClick={e => e.stopPropagation()}
                          >
                            {a.title || 'Untitled Article'}
                          </a>
                        </div>
                      </td>
                      <td className="doi-cell">
                        {a.doi ? (
                          <div className="doi-badge has-doi">
                            <span>✅</span>
                            <span className="doi-text">
                              {a.doi.length > 20 ? `${a.doi.substring(0, 20)}...` : a.doi}
                            </span>
                          </div>
                        ) : (
                          <div className="doi-badge no-doi">
                            <span>⚠️</span>
                            <span>No DOI</span>
                          </div>
                        )}
                      </td>
                      <td className="authors-cell">
                        <div 
                          className={`authors-text ${!a.authors ? 'unknown-authors' : ''}`}
                          title={a.authors || 'Unknown authors'}
                        >
                          {a.authors || 'Unknown authors'}
                        </div>
                      </td>
                      <td className="actions-cell">
                        {/* Upload state and status */}
                        {uploadingArticleId === a.id && (
                          <button
                            disabled
                            onClick={(e) => e.stopPropagation()}
                            className="uploading-btn"
                          >
                            <span>⏳</span> Uploading...
                          </button>
                        )}

                        {uploadingArticleId !== a.id && recentlyUpdatedIds.has(a.id) && (
                          <div className="updated-badge">
                            <span>✅</span> Updated
                          </div>
                        )}

                        {/* PDF present indicator */}
                        {hasPdf && (
                          <div className="pdf-status-badge">
                            <span>📄</span> {hasSummary ? 'PDF & Summary ready' : 'PDF ready'}
                          </div>
                        )}

                        {/* Kebab (three-dots) menu with actions */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuRowId(prev => prev === a.id ? null : a.id); }}
                          aria-label="More actions"
                          className="kebab-menu-btn"
                          title="More actions"
                        >
                          ⋯
                        </button>
                        {openMenuRowId === a.id && (
                          <div
                            className="dropdown-menu"
                            role="menu"
                            aria-label="Row actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => { setOpenMenuRowId(null); nav(`/library/article/${a.id}`); }}
                              className="menu-item"
                              role="menuitem"
                            >👁️ View</button>
                            <button
                              onClick={() => { setOpenMenuRowId(null); handleEditArticle(a); }}
                              className="menu-item"
                              role="menuitem"
                            >✏️ Edit</button>
                            <button
                              onClick={() => { setOpenMenuRowId(null); handleUploadPdf(a); }}
                              className="menu-item"
                              role="menuitem"
                            >⬆️ Upload PDF</button>
                            <button
                              onClick={() => { setOpenMenuRowId(null); handleDeleteArticle(a.id); }}
                              className="menu-item delete-item"
                              role="menuitem"
                            >🔥 Delete</button>
                          </div>
                        )}
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
        <div className="limit-modal">
          <div className="modal-content">
            <div className="modal-icon">🚫</div>
            <h2 className="modal-title">
                Article Limit Reached
              </h2>
            <p className="modal-description">
                Free accounts can save up to <b>10 articles</b>.<br />
                Upgrade to unlock unlimited articles and more features.
              </p>
              <button
              className="upgrade-btn"
              style={primaryButtonStyle}
                onClick={() => {
                  setShowLimitModal(false);
                  nav('/upgrade');
                }}
              >
                Upgrade for $49
              </button>
            <div>
              <button
                className="cancel-btn"
                style={secondaryButtonStyle}
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

    </Layout>
  );
}