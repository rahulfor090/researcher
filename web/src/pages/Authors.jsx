import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients } from '../theme';
import Layout from '../components/Layout';

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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  // Load authors from backend
  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`${BASE_API_URL}/authors`);
      setAuthors(response.data || []);
    } catch (err) {
      console.error('Failed to load authors:', err);
      setError('Failed to load authors. Please try again.');
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  // Load articles for selected author
  const loadAuthorArticles = async (authorId) => {
    try {
      setLoadingArticles(true);
      const response = await api.get(`${BASE_API_URL}/authors/${authorId}/articles`);
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

  // Calculate pagination
  const totalItems = filteredAuthors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAuthors = filteredAuthors.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
                      onClick={() => navigate(`/library/article/${article.id}`)}
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
          </div>
        </div>

        {/* Authors List */}
        <div style={{ 
          ...cardStyle, 
          padding: '24px',
          boxShadow: shadows.medium 
        }}>
          {/* Authors List Header with Items Per Page */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: colors.primaryText, 
              margin: 0
            }}>
              Saved Authors ({filteredAuthors.length})
            </h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: colors.secondaryText, fontSize: '0.9rem' }}>
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: colors.background,
                  color: colors.primaryText,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span style={{ color: colors.secondaryText, fontSize: '0.9rem' }}>
                entries
              </span>
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fee2e2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              color: '#dc2626',
              marginBottom: '24px'
            }}>
              {error}
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
              {currentAuthors.map((author) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              {/* Info text */}
              <div style={{ color: colors.secondaryText, fontSize: '0.9rem' }}>
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
              </div>

              {/* Pagination buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: currentPage === 1 ? colors.border : colors.background,
                    color: currentPage === 1 ? colors.secondaryText : colors.primaryText,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Previous
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    style={{
                      padding: '8px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      backgroundColor: page === currentPage ? colors.primary : colors.background,
                      color: page === currentPage ? 'white' : 
                             page === '...' ? colors.secondaryText : colors.primaryText,
                      cursor: page === '...' ? 'default' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: page === currentPage ? '600' : '400',
                      transition: 'all 0.2s ease',
                      minWidth: '40px'
                    }}
                    onMouseEnter={(e) => {
                      if (page !== '...' && page !== currentPage) {
                        e.target.style.backgroundColor = colors.border;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== '...' && page !== currentPage) {
                        e.target.style.backgroundColor = colors.background;
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    backgroundColor: currentPage === totalPages ? colors.border : colors.background,
                    color: currentPage === totalPages ? colors.secondaryText : colors.primaryText,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
