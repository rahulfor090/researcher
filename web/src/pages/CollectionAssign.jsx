import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, shadows, cardStyle } from '../theme';
import Layout from '../components/Layout';

export default function CollectionAssign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [assignedArticlesCount, setAssignedArticlesCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [collectionResponse, articlesResponse] = await Promise.all([
        api.get(`/collections/${id}`),
        api.get(`/collections/${id}/available-articles`)
      ]);
      
      setCollection(collectionResponse.data.collection);
      const availableArticles = articlesResponse.data.articles;
      setAvailableArticles(availableArticles);
      
      // Pre-select articles that are already in the collection
      if (collectionResponse.data.collection.articles) {
        const alreadyAssignedArticles = collectionResponse.data.collection.articles.filter(assignedArticle =>
          availableArticles.some(available => available.id === assignedArticle.id)
        );
        setSelectedArticles(alreadyAssignedArticles);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = availableArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArticleToggle = (article) => {
    setSelectedArticles(prev => {
      const isSelected = prev.some(selected => selected.id === article.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== article.id);
      } else {
        return [...prev, article];
      }
    });
  };

  const handleSaveAssignments = async () => {
    if (selectedArticles.length === 0) {
      setError('Please select at least one article to assign');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');
      
      const articleIds = selectedArticles.map(article => article.id);
      
      const response = await api.post(`/collections/${id}/articles`, {
        articleIds
      });

      // Show success message
      setAssignedArticlesCount(response.data.assignedCount);
      setSuccessMessage(`Successfully assigned ${response.data.assignedCount} articles to "${collection?.collection_name}"!`);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate(`/collection/${id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to assign articles:', error);
      setError(error.response?.data?.message || 'Failed to assign articles');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{ 
          padding: '32px', 
          textAlign: 'center',
          color: colors.mutedText
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
          Loading available articles...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ 
          padding: '32px', 
          textAlign: 'center',
          color: colors.mutedText
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>❌</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate('/collection')}
            style={{
              background: colors.link,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Back to Collections
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <button
              onClick={() => navigate(`/collection/${id}`)}
              style={{
                background: 'none',
                border: `2px solid ${colors.border}`,
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: colors.mutedText
              }}
            >
              ← Back to {collection?.collection_name}
            </button>
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              color: colors.primaryText,
              margin: '0 0 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              ➕ Assign Articles
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: colors.mutedText,
              margin: 0
            }}>
              Select articles to add to "{collection?.collection_name}"
            </p>
          </div>

          {selectedArticles.length > 0 && (
            <button
              onClick={handleSaveAssignments}
              disabled={isSaving}
              style={{
                background: `linear-gradient(135deg, ${colors.link}, ${colors.highlight})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: shadows.soft,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isSaving ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = shadows.medium;
                }
              }}
              onMouseLeave={e => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = shadows.soft;
                }
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>💾</span>
              {isSaving ? 'Saving...' : `Save ${selectedArticles.length} Articles`}
            </button>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            ...cardStyle,
            padding: '20px 24px',
            marginBottom: '24px',
            background: `linear-gradient(135deg, #10b981, #059669)`,
            color: 'white',
            border: '2px solid #059669',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '2rem' }}>✅</span>
                <div>
                  <div style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    Success!
                  </div>
                  <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                    {successMessage}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '0.9rem',
                opacity: 0.8,
                textAlign: 'right'
              }}>
                <div>🔄 Redirecting in 3 seconds...</div>
                <div style={{ marginTop: '4px' }}>
                  <button
                    onClick={() => navigate(`/collection/${id}`)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    View Collection Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            ...cardStyle,
            padding: '16px 24px',
            marginBottom: '24px',
            background: `linear-gradient(135deg, #ef4444, #dc2626)`,
            color: 'white',
            border: '2px solid #dc2626'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>❌</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '2px' }}>Error</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedArticles.length > 0 && (
          <div style={{
            ...cardStyle,
            padding: '16px 24px',
            marginBottom: '24px',
            background: `linear-gradient(135deg, ${colors.accent}10, ${colors.highlight}10)`,
            border: `2px solid ${colors.accent}20`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <span style={{ 
                fontSize: '1rem', 
                color: colors.primaryText,
                fontWeight: 600
              }}>
                ✅ {selectedArticles.length} articles selected
              </span>
              <button
                onClick={() => setSelectedArticles([])}
                style={{
                  background: 'none',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  color: colors.mutedText
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{
          ...cardStyle,
          padding: '24px',
          marginBottom: '32px'
        }}>
          <input
            type="text"
            placeholder="🔍 Search available articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `2px solid ${colors.border}`,
              borderRadius: '12px',
              fontSize: '1rem',
              background: 'white',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={e => e.currentTarget.style.borderColor = colors.link}
            onBlur={e => e.currentTarget.style.borderColor = colors.border}
          />
        </div>

        {/* Available Articles */}
        {filteredArticles.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 0',
            color: colors.mutedText
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📄</div>
            <h3>No articles available</h3>
            <p>All your articles are already in this collection or no articles match your search</p>
            <button
              onClick={() => navigate('/library')}
              style={{
                background: colors.link,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              📚 Go to Library
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredArticles.map((article) => {
              const isSelected = selectedArticles.some(selected => selected.id === article.id);
              return (
                <div
                  key={article.id}
                  style={{
                    ...cardStyle,
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    border: isSelected ? `3px solid ${colors.accent}` : cardStyle.border,
                    background: isSelected ? `${colors.accent}05` : cardStyle.background,
                    opacity: successMessage ? 0.7 : 1
                  }}
                  onMouseEnter={e => {
                    if (!successMessage) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = shadows.medium;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!successMessage) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = shadows.soft;
                    }
                  }}
                  onClick={() => !successMessage && handleArticleToggle(article)}
                >
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isSelected ? colors.accent : 'transparent',
                    border: `2px solid ${isSelected ? colors.accent : colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                  }}>
                    {isSelected ? '✓' : ''}
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: colors.primaryText,
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    paddingRight: '50px'
                  }}>
                    {article.title}
                  </h3>

                  <p style={{
                    color: colors.mutedText,
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.summary}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: colors.mutedText
                  }}>
                    <span>📅 {new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>
                      {isSelected ? (
                        <span style={{ 
                          color: colors.accent, 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ✅ Selected
                        </span>
                      ) : (
                        '📄 Available'
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}