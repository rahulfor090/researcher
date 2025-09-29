import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, gradients, shadows, primaryButtonStyle } from '../theme';
import Layout from '../components/Layout';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [articles, setArticles] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initials = (user?.name || 'User').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  // Load articles for overview
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/articles');
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
      {/* Main content + Right sidebar row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '24px', padding: '0 0 0 0', flexDirection: isMobile ? 'column' : 'row', width: '100%' }}>
      {/* Main Content Area (kept intact) */}
      <div style={{ 
        flexGrow: 1, 
        padding: isMobile ? '16px' : '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderTopRightRadius: '16px', 
        borderBottomRightRadius: '16px',
        animation: 'fadeInRight 0.6s ease-out 0.3s both'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          animation: 'fadeInDown 0.8s ease-out 0.5s both'
        }}>
          <h2 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 700, 
            color: '#1f2937', 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Dashboard</h2>
          <button
            onClick={() => nav('/')}
            style={{
              ...primaryButtonStyle,
              background: '#16a34a',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              boxShadow: '0 6px 18px rgba(22, 163, 74, 0.25)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(22, 163, 74, 0.35)';
              e.currentTarget.style.background = '#15803d';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(22, 163, 74, 0.25)';
              e.currentTarget.style.background = '#16a34a';
            }}
          >
            ⤶ Go to Home
          </button>
        </div>
        
        {/* Stats Overview */}
        <div style={{ 
          ...cardStyle,
          animation: `fadeInUp 0.8s ease-out ${isLoaded ? '0.7s' : '0s'} both`,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          opacity: isLoaded ? 1 : 0,
          marginBottom: '24px'
        }} 
        onMouseEnter={e => { 
          e.currentTarget.style.boxShadow = shadows.medium; 
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)'; 
        }} 
        onMouseLeave={e => { 
          e.currentTarget.style.boxShadow = shadows.soft; 
          e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.primaryText }}>📊 Research Overview</h3>
            <div style={{ 
              fontSize: '0.85rem', 
              color: colors.mutedText,
              background: 'rgba(13, 148, 136, 0.1)',
              padding: '4px 12px',
              borderRadius: '16px',
              border: '1px solid rgba(13, 148, 136, 0.2)'
            }}>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
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
            ].map((stat, index) => (
              <div 
                key={stat.label}
                style={{ 
                  padding: '24px', 
                  background: stat.bgColor, 
                  borderRadius: '16px', 
                  border: `1px solid ${stat.borderColor}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.6s ease-out ${0.9 + index * 0.1}s both`,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isLoaded ? 1 : 0,
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}20`;
                  e.currentTarget.style.border = `2px solid ${stat.color}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.border = `1px solid ${stat.borderColor}`;
                }}
              >
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 700, 
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                    {stat.count}
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ color: colors.primaryText, fontWeight: 600, fontSize: '0.95rem' }}>{stat.label}</div>
                  <div style={{ color: colors.mutedText, fontSize: '0.8rem', marginTop: '2px' }}>{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          ...cardStyle,
          animation: `fadeInUp 0.8s ease-out ${isLoaded ? '1.0s' : '0s'} both`,
          marginBottom: '24px'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = shadows.medium;
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = shadows.soft;
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.primaryText }}>📈 Recent Activity</h3>
            <button style={{
              background: 'transparent',
              border: `1px solid ${colors.border}`,
              color: colors.primaryText,
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = colors.link;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = colors.link;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.primaryText;
              e.currentTarget.style.borderColor = colors.border;
            }}>
              View All
            </button>
          </div>
          
          {articles.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: colors.mutedText,
              background: 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              border: `1px dashed ${colors.border}`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>No articles yet</div>
              <div style={{ fontSize: '0.9rem' }}>Start building your research library by adding your first article!</div>
              <button 
                onClick={() => nav('/library')}
                style={{
                  marginTop: '16px',
                  background: colors.link,
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 148, 136, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Add First Article
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {articles.slice(0, Math.min(articles.length, 20)).map((article, index) => (
                <div 
                  key={article.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(13, 148, 136, 0.05)';
                    e.currentTarget.style.borderColor = colors.link;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  onClick={() => nav(`/library/article/${article.id}`)}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: article.doi ? '#22c55e' : '#f97316',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: colors.primaryText, 
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {article.title || 'Untitled Article'}
                    </div>
                    <div style={{ 
                      color: colors.mutedText, 
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {article.authors || 'Unknown authors'} • {article.doi ? 'With DOI' : 'No DOI'}
                    </div>
                    <div style={{ 
                      color: colors.mutedText, 
                      fontSize: '0.72rem',
                      marginTop: '4px'
                    }}>
                      <span style={{marginRight: 6}}>🗓️</span>
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
                  <div style={{ 
                    color: colors.mutedText, 
                    fontSize: '0.7rem',
                    flexShrink: 0
                  }}>
                    →
                  </div>
                </div>
              ))}
              
              {articles.length > 20 && (
                <div style={{
                  textAlign: 'center',
                  padding: '12px',
                  color: colors.mutedText,
                  fontSize: '0.85rem',
                  fontStyle: 'italic'
                }}>
                  +{articles.length - 20} more articles in your library • <span style={{ color: colors.link, cursor: 'pointer', fontStyle: 'normal', fontWeight: 600 }} onClick={() => nav('/library')}>View all</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar (Filters, Insights, Quick Actions) */}
      <div style={{ 
        width: isMobile ? '100%' : '420px', 
        backgroundColor: 'transparent', 
        padding: isMobile ? '16px 0 0 0' : '40px 20px 40px 0',
        animation: 'fadeInRight 0.6s ease-out 0.5s both'
      }}>
        <div style={{ 
          ...cardStyle, 
          marginBottom: '16px',
          animation: 'fadeInUp 0.8s ease-out 0.8s both'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = shadows.medium;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = shadows.soft;
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, color: colors.primaryText }}>Filters</h4>
            <button
              style={{
                background: 'transparent',
                color: colors.link,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(13, 148, 136, 0.1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => { /* reserved for future filter reset */ }}
            >
              Clear
            </button>
          </div>

          {/* Search field with icon */}
          <div style={{ position: 'relative', marginTop: '12px', marginBottom: '16px' }}>
            <span style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: colors.mutedText,
              transition: 'transform 0.2s ease'
            }}>🔎</span>
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
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }}
              onFocus={e => {
                e.currentTarget.style.border = `2px solid ${colors.link}`;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(13, 148, 136, 0.1)`;
                e.currentTarget.style.background = 'white';
                e.currentTarget.previousElementSibling.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onBlur={e => {
                e.currentTarget.style.border = `1px solid ${colors.border}`;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                e.currentTarget.previousElementSibling.style.transform = 'translateY(-50%) scale(1)';
              }}
            />  
          </div>
        </div>

        {/* Research Insights Card */}
        <div style={{ 
          ...cardStyle, 
          marginBottom: '16px',
          animation: 'fadeInUp 0.8s ease-out 1.0s both'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = shadows.medium;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = shadows.soft;
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: colors.primaryText, display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 Research Insights
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            ].map((insight, index) => (
              <div key={insight.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                transition: 'all 0.2s ease',
                animation: `fadeInLeft 0.4s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${insight.color}10`;
                e.currentTarget.style.borderColor = insight.color;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{insight.icon}</span>
                  <span style={{ fontSize: '0.85rem', color: colors.primaryText }}>{insight.label}</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: insight.color }}>{insight.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={{ 
          ...cardStyle,
          animation: 'fadeInUp 0.8s ease-out 1.2s both'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = shadows.medium;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = shadows.soft;
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: colors.primaryText, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Quick Actions
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Add New Article', icon: '➕', path: '/library?openModal=true', color: '#22c55e' },
              { label: 'Export Data', icon: '📤', path: null, color: '#8b5cf6' },
              { label: 'Import Articles', icon: '📥', path: null, color: '#f97316' }
            ].map((action, index) => (
              <button
                key={action.label}
                onClick={() => action.path && nav(action.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  cursor: action.path ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  animation: `fadeInRight 0.4s ease-out ${index * 0.1}s both`,
                  opacity: action.path ? 1 : 0.6
                }}
                onMouseEnter={e => {
                  if (action.path) {
                    e.currentTarget.style.background = `${action.color}15`;
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}20`;
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: colors.primaryText, textAlign: 'left' }}>
                  {action.label}
                </span>
                {!action.path && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: colors.mutedText, fontStyle: 'italic' }}>
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Animations */}
      <style>
        {`
          @keyframes dashboardFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-30px) rotate(120deg); }
            66% { transform: translateY(30px) rotate(240deg); }
          }
              
          @keyframes dashboardPulse {
            0%, 100% { transform: scale(1); opacity: 0.06; }
            50% { transform: scale(1.15); opacity: 0.12; }
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
              
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
              maxHeight: 0;
              filter: blur(4px);
            }
            50% {
              opacity: 0.7;
              filter: blur(2px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              maxHeight: 200px;
              filter: blur(0);
            }
          }
              
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
      
      {/* Animations keyframes */}
      <style>
        {`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeInDown {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fadeInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeInRight {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes dropdownIn {
            from { opacity: 0; transform: scaleY(0.9); }
            to { opacity: 1; transform: scaleY(1); }
          }
          
          @keyframes slideDown {
            0% { 
              opacity: 0; 
              transform: translateY(-15px) scaleY(0.95); 
              maxHeight: 0;
              filter: blur(1px);
            }
            30% {
              opacity: 0.3;
              transform: translateY(-8px) scaleY(0.98);
              maxHeight: 60px;
              filter: blur(0.5px);
            }
            70% {
              opacity: 0.8;
              transform: translateY(-2px) scaleY(0.99);
              maxHeight: 160px;
              filter: blur(0px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scaleY(1); 
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
