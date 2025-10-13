import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Layout from '../components/Layout';
import { useAuth } from '../auth';
import './Dashboard.scss';

const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/v1';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initials = (user?.name || 'User').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  // Load articles for overview
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`${BASE_API_URL}/articles`);
        const sorted = [...data].sort((a, b) => {
          const ad = new Date(a.createdAt || a.created_at || a.updatedAt || a.updated_at || 0).getTime();
          const bd = new Date(b.createdAt || b.created_at || b.updatedAt || b.updated_at || 0).getTime();
          return bd - ad;
        });
        setArticles(sorted);
        setTimeout(() => setIsLoaded(true), 100);
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
    })();
  }, []);

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

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="main-content">
          <div className="dashboard-header">
            <div>
              <h2 className="header-title">Dashboard</h2>
              <p className="header-subtitle">Overview of your research activity and library health</p>
            </div>
          </div>
        
          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stats-header">
              <h3 className="stats-title">📊 Research Overview</h3>
              <div className="last-updated">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="stats-grid">
            {[
              { 
                count: articles.length, 
                label: 'Total Articles', 
                color: '#3b82f6', 
                bgColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                icon: '📚',
                trend: '+12%',
                description: 'Articles in your library'
              },
              { 
                count: articles.filter(a => a.doi).length, 
                label: 'With DOI', 
                color: '#22c55e', 
                bgColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
                icon: '✅',
                trend: '+8%',
                description: 'Properly referenced'
              },
              { 
                count: articles.filter(a => a.url).length, 
                label: 'With Links', 
                color: '#8b5cf6', 
                bgColor: 'rgba(139, 92, 246, 0.1)',
                borderColor: 'rgba(139, 92, 246, 0.2)',
                icon: '🔗',
                trend: '+15%',
                description: 'Accessible online'
              },
              { 
                count: articles.filter(a => !a.doi).length, 
                label: 'Need Review', 
                color: '#f97316', 
                bgColor: 'rgba(249, 115, 22, 0.1)',
                borderColor: 'rgba(249, 115, 22, 0.2)',
                icon: '⚠️',
                trend: '-5%',
                description: 'Missing information'
              }
            ].map((stat, index) => {
              const statClass = stat.label === 'Total Articles' ? 'stat-item-total' :
                               stat.label === 'With DOI' ? 'stat-item-doi' :
                               stat.label === 'With Links' ? 'stat-item-links' :
                               'stat-item-review';
              const countClass = stat.label === 'Total Articles' ? 'count-total' :
                               stat.label === 'With DOI' ? 'count-doi' :
                               stat.label === 'With Links' ? 'count-links' :
                               'count-review';
              
              return (
                <div key={stat.label} className={`stat-item ${statClass}`}>
                  <div className="stat-header">
                    <div className={`stat-count ${countClass}`}>
                      <span className="stat-icon">{stat.icon}</span>
                      {stat.count}
                    </div>
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-description">{stat.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="activity-header">
              <div>
                <h3 className="activity-title">📈 Recent Activity</h3>
                <p className="activity-subtitle">Latest articles and updates</p>
              </div>
              <button className="view-all-btn">
                View All
              </button>
            </div>
          
            {articles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <div className="empty-title">No articles yet</div>
                <div className="empty-description">Start building your research library by adding your first article!</div>
                <button 
                  onClick={() => nav('/library')}
                  className="add-first-btn"
                >
                  Add First Article
                </button>
              </div>
            ) : (
              <div className="activity-list">
              {articles
                .filter((a) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    (a.title && a.title.toLowerCase().includes(q)) ||
                    (a.doi && a.doi.toLowerCase().includes(q)) ||
                    (a.authors && a.authors.toLowerCase().includes(q))
                  );
                })
                .slice(0, 20)
                .map((article, index) => (
                <div 
                  key={article.id}
                  className="activity-item"
                  onClick={() => nav(`/library/article/${article.id}`)}
                >
                  <div className={`status-indicator ${article.doi ? 'has-doi' : 'no-doi'}`} />
                  <div className="article-info">
                    <div className="article-title">
                      {article.title || 'Untitled Article'}
                    </div>
                    <div className="article-meta">
                      {article.authors || 'Unknown authors'} • {article.doi ? 'With DOI' : 'No DOI'}
                    </div>
                    <div className="article-date">
                      <span className="date-icon">🗓️</span>
                      {(() => {
                        const created = article.createdAt || article.created_at || article.created || article.updatedAt || article.updated_at || null;
                        try {
                          return created ? new Date(created).toLocaleDateString() : '—';
                        } catch {
                          return '—';
                        }
                      })()}
                    </div>
                  </div>
                  <div className="article-arrow">→</div>
                </div>
              ))}
              
                {articles.length > 20 && (
                  <div className="more-articles">
                    +{articles.length - 20} more articles in your library • <span className="view-all-link" onClick={() => nav('/library')}>View all</span>
                  </div>
                )}
              </div>
            )}
          </div>
      </div>

        {/* Right Sidebar (Filters, Insights, Quick Actions) */}
        <div className="dashboard-sidebar">
          <div className="filters-card">
            <div className="filters-header">
              <h4 className="filters-title">Filters</h4>
              <button
                className="clear-btn"
                onClick={() => { /* reserved for future filter reset */ }}
              >
                Clear
              </button>
            </div>

            {/* Search field with icon */}
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search articles, titles, DOI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />  
            </div>
          </div>

          {/* Research Insights Card */}
          <div className="insights-card">
            <h4 className="insights-title">
              💡 Research Insights
            </h4>
            
            <div className="insights-list">
            {[
              {
                label: 'Average Publications/Year',
                value: articles.length > 0 ? `${Math.round(articles.length / 1)} articles` : '0 articles',
                icon: '📈',
                color: '#22c55e'
              },
              {
                label: 'Research Completion',
                value: `${Math.round((articles.filter(a => a.doi).length / Math.max(articles.length, 1)) * 100)}%`,
                icon: '🎯',
                color: '#8b5cf6'
              }
            ].map((insight, index) => {
              const insightClass = insight.label === 'Average Publications/Year' ? 'insight-productivity' : 'insight-completion';
              const valueClass = insight.label === 'Average Publications/Year' ? 'value-productivity' : 'value-completion';
              
              return (
                <div key={insight.label} className={`insight-item ${insightClass}`}>
                  <div className="insight-info">
                    <span className="insight-icon">{insight.icon}</span>
                    <span className="insight-label">{insight.label}</span>
                  </div>
                  <span className={`insight-value ${valueClass}`}>{insight.value}</span>
                </div>
              );
            })}
          </div>
        </div>

          {/* Quick Actions Card */}
          <div className="quick-actions-card">
            <h4 className="actions-title">
              ⚡ Quick Actions
            </h4>
            
            <div className="actions-list">
            {[
              { label: 'Add New Article', icon: '➕', path: '/library?openModal=true', color: '#22c55e' },
              { label: 'Export Data', icon: '📤', path: null, color: '#8b5cf6' },
              { label: 'Import Articles', icon: '📥', path: null, color: '#f97316' }
            ].map((action, index) => {
              const actionClass = action.path ? 'action-enabled' : 'action-disabled';
              const specificActionClass = action.label === 'Add New Article' ? 'action-add' :
                                        action.label === 'Export Data' ? 'action-export' :
                                        'action-import';
              
              return (
                <button
                  key={action.label}
                  onClick={() => action.path && nav(action.path)}
                  className={`action-item ${actionClass} ${specificActionClass}`}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">
                    {action.label}
                  </span>
                  {!action.path && (
                    <span className="coming-soon">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </div>
      
    </Layout>
  );
}
