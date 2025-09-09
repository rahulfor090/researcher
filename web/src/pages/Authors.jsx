import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients } from '../theme';
import Layout from '../components/Layout';

// Add debugging information to help troubleshoot the connection
console.log('🔍 Debug info:');
console.log('- Base API URL:', import.meta.env.VITE_API_BASE || 'http://localhost:5000');
console.log('- Full authors URL:', `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/articles/authors/list`);

export default function Authors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorArticles, setAuthorArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Load authors from backend
  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Attempting to load authors...');
      console.log('API URL:', `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/articles/authors/list`);
      
      // First try to check if the basic articles endpoint works
      try {
        console.log('🔍 Testing basic articles endpoint...');
        const testResponse = await api.get('/articles');
        console.log('✅ Basic articles endpoint works:', testResponse.status);
      } catch (testErr) {
        console.log('❌ Basic articles endpoint failed:', testErr);
        if (testErr.code === 'ERR_NETWORK') {
          throw new Error('ERR_CONNECTION_REFUSED');
        }
      }
      
      const response = await api.get('/articles/authors/list');
      console.log('✅ Authors loaded successfully:', response.data);
      setAuthors(response.data || []);
    } catch (err) {
      console.error('❌ Failed to load authors:', err); 
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  // Load articles for selected author
  const loadAuthorArticles = async (authorId) => {
    try {
      setLoadingArticles(true);
      const response = await api.get(`/articles/authors/${authorId}/articles`);
      setAuthorArticles(response.data || []);
    } catch (err) {
      console.error('Failed to load author articles:', err);
      setAuthorArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Handle viewing articles for an author
  const handleViewArticles = async (author) => {
    setSelectedAuthor(author);
    await loadAuthorArticles(author.id);
  };

  // Close author articles view
  const handleCloseArticles = () => {
    setSelectedAuthor(null);
    setAuthorArticles([]);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  // Filter authors based on search term
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div style={{ ...cardStyle, padding: '40px', textAlign: 'center' }}>
          Loading authors...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: colors.primaryText, 
            marginBottom: '8px' 
          }}>
            Authors
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: colors.secondaryText,
            margin: 0
          }}>
            Browse and search through your saved authors
          </p>
        </div>

        {/* Author Articles Modal */}
        {selectedAuthor && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              ...cardStyle,
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '32px',
              position: 'relative'
            }}>
              {/* Close button */}
              <button
                onClick={handleCloseArticles}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: colors.secondaryText,
                  padding: '8px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.border}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>

              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 600, 
                color: colors.primaryText, 
                marginBottom: '8px' 
              }}>
                Articles by {selectedAuthor.name}
              </h2>
              <p style={{ 
                color: colors.secondaryText, 
                marginBottom: '24px' 
              }}>
                {authorArticles.length} article{authorArticles.length !== 1 ? 's' : ''} found
              </p>

              {loadingArticles ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  Loading articles...
                </div>
              ) : authorArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: colors.secondaryText }}>
                  No articles found for this author.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {authorArticles.map((article) => (
                    <div
                      key={article.id}
                      style={{
                        padding: '20px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: colors.background,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => navigate(`/article/${article.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <h3 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '1.1rem', 
                        fontWeight: 600, 
                        color: colors.primaryText 
                      }}>
                        {article.title}
                      </h3>
                      {article.journal && (
                        <p style={{ 
                          margin: '0 0 4px 0', 
                          color: colors.secondaryText, 
                          fontSize: '0.9rem' 
                        }}>
                          📖 {article.journal}
                        </p>
                      )}
                      {article.authors && (
                        <p style={{ 
                          margin: '0 0 4px 0', 
                          color: colors.secondaryText, 
                          fontSize: '0.9rem' 
                        }}>
                          👥 {article.authors}
                        </p>
                      )}
                      {article.doi && (
                        <p style={{ 
                          margin: '0', 
                          color: colors.secondaryText, 
                          fontSize: '0.8rem' 
                        }}>
                          🔗 DOI: {article.doi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div style={{ 
          ...cardStyle, 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: shadows.soft 
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 50px 16px 20px',
                fontSize: '1rem',
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: colors.background,
                color: colors.primaryText,
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.secondaryText,
              fontSize: '1.2rem'
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Authors List */}
        <div style={{ 
          ...cardStyle, 
          padding: '24px',
          boxShadow: shadows.medium 
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: colors.primaryText, 
            marginBottom: '24px' 
          }}>
            Saved Authors ({filteredAuthors.length})
          </h2>

          {error && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fee2e2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              color: '#dc2626',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>⚠️ Connection Error</h3>
              <p style={{ margin: '0 0 12px 0' }}>{error}</p>
              {error.includes('Cannot connect to server') && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#fef3c7', 
                  border: '1px solid #fbbf24', 
                  borderRadius: '6px',
                  color: '#92400e',
                  fontSize: '0.9rem'
                }}>
                  <strong>To fix this:</strong>
                  <ol style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    <li>Open terminal in the server directory</li>
                    <li>Run: <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px' }}>npm start</code> or <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px' }}>npm run dev</code></li>
                    <li>Make sure the server is running on port 5000</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {filteredAuthors.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: colors.secondaryText 
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👥</div>
              <h3 style={{ marginBottom: '8px', color: colors.primaryText }}>
                {searchTerm ? 'No authors found' : 'No authors yet'}
              </h3>
              <p>
                {searchTerm 
                  ? `No authors match "${searchTerm}". Try a different search term.`
                  : 'Start adding articles with authors to see them listed here.'
                }
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gap: '16px' 
            }}>
              {filteredAuthors.map((author) => (
                <div
                  key={author.id}
                  style={{
                    padding: '20px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    backgroundColor: colors.background,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = shadows.soft;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '1.1rem', 
                      fontWeight: 600, 
                      color: colors.primaryText 
                    }}>
                      {author.name}
                    </h3>
                    <p style={{ 
                      margin: '4px 0 0 0', 
                      color: colors.secondaryText, 
                      fontSize: '0.9rem' 
                    }}>
                      {author.articleCount || 0} article{(author.articleCount || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewArticles(author);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: colors.primary,
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryHover}
                    onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
                  >
                    View Articles
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
