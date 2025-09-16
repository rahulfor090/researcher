import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, shadows, cardStyle } from '../theme';
import Layout from '../components/Layout';

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCollectionDetails();
    }
  }, [id]);

  const fetchCollectionDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/collections/${id}`);
      setCollection(response.data.collection);
    } catch (error) {
      console.error('Failed to fetch collection details:', error);
      setError(error.response?.data?.message || 'Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to remove this article from the collection?')) {
      try {
        await api.delete(`/collections/${id}/articles/${articleId}`);
        // Update local state
        setCollection(prev => ({
          ...prev,
          articles: prev.articles.filter(article => article.id !== articleId)
        }));
      } catch (error) {
        console.error('Failed to remove article:', error);
        alert('Failed to remove article from collection');
      }
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
          Loading collection...
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
              onClick={() => navigate('/collection')}
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
              ← Back to Collections
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
              📂 {collection?.collection_name}
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: colors.mutedText,
              margin: 0
            }}>
              {collection?.articles?.length || 0} articles in this collection
            </p>
          </div>

          <button
            onClick={() => navigate(`/collection/${id}/assign`)}
            style={{
              background: `linear-gradient(135deg, ${colors.link}, ${colors.highlight})`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: shadows.soft,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = shadows.medium;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shadows.soft;
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>➕</span>
            Assign Articles
          </button>
        </div>

        {/* Articles in Collection */}
        {!collection?.articles || collection.articles.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 0',
            color: colors.mutedText
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📄</div>
            <h3>No articles in this collection</h3>
            <p>Start adding articles to organize your research</p>
            <button
              onClick={() => navigate(`/collection/${id}/assign`)}
              style={{
                background: colors.link,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '16px auto 0'
              }}
            >
              ➕ Assign Your First Articles
            </button>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: shadows.soft,
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 200px 150px 120px',
              gap: '16px',
              padding: '20px 24px',
              background: colors.accent,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <div>📄 Article Title</div>
              <div>📅 Date Added</div>
              <div>📊 Status</div>
              <div>⚡ Actions</div>
            </div>

            {/* Articles List */}
            <div>
              {collection.articles.map((article, index) => (
                <div
                  key={article.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px 150px 120px',
                    gap: '16px',
                    padding: '20px 24px',
                    borderBottom: index < collection.articles.length - 1 ? `1px solid ${colors.border}` : 'none',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.hover}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  {/* Article Info */}
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: colors.primaryText,
                      margin: '0 0 4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {article.title}
                    </h4>
                    <p style={{
                      fontSize: '0.9rem',
                      color: colors.mutedText,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {article.summary}
                    </p>
                  </div>

                  {/* Date Added */}
                  <div style={{
                    fontSize: '0.9rem',
                    color: colors.mutedText,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>

                  {/* Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      background: colors.accent,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}>
                      📂 In Collection
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/article/${article.id}`);
                      }}
                      style={{
                        background: colors.link,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      title="View Article"
                    >
                      👁️
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveArticle(article.id);
                      }}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      title="Remove from Collection"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer */}
            <div style={{
              padding: '16px 24px',
              background: `${colors.accent}05`,
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.9rem',
                color: colors.mutedText
              }}>
                📊 Total: {collection.articles.length} articles in collection
              </span>
              
              <button
                onClick={() => navigate(`/collection/${id}/assign`)}
                style={{
                  background: colors.link,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                ➕ Assign More Articles
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}