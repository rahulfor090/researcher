import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, shadows, cardStyle } from '../theme';
import Layout from '../components/Layout';
import CollectionFormModal from '../components/CollectionFormModal';

export default function Collection() {
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/collections');
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort collections
  const filteredCollections = collections
    .filter(collection => {
      const matchesSearch = collection.collection_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.collection_name.localeCompare(b.collection_name);
        default:
          return 0;
      }
    });

  const handleDeleteCollection = async (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection? All article assignments will be removed.')) {
      try {
        await api.delete(`/collections/${collectionId}`);
        setCollections(collections.filter(collection => collection.id !== collectionId));
      } catch (error) {
        console.error('Failed to delete collection:', error);
        alert('Failed to delete collection');
      }
    }
  };

  const handleSaveCollection = async (collectionData) => {
    try {
      if (editingCollection) {
        // Update existing collection
        const response = await api.put(`/collections/${editingCollection.id}`, {
          name: collectionData.name
        });
        
        // Update local state
        setCollections(collections.map(c => 
          c.id === editingCollection.id 
            ? { ...c, collection_name: collectionData.name }
            : c
        ));
        
        setEditingCollection(null);
      } else {
        // Create new collection
        const response = await api.post('/collections', {
          name: collectionData.name
        });
        
        // Add to local state
        setCollections([response.data.collection, ...collections]);
      }
      
      fetchCollections(); // Refresh the list
    } catch (error) {
      console.error('Failed to save collection:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setShowCollectionModal(true);
  };

  const handleCloseModal = () => {
    setShowCollectionModal(false);
    setEditingCollection(null);
  };

  return (
    <Layout>
      <div style={{ padding: isMobile ? '16px' : '32px', maxWidth: '1400px', margin: '0 auto' }}>
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
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              color: colors.primaryText,
              margin: '0 0 8px',
              background: `linear-gradient(135deg, ${colors.primaryText}, ${colors.link})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              My Collection
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: colors.mutedText,
              margin: 0
            }}>
              Curated research articles and resources
            </p>
          </div>

          <button
            onClick={() => setShowCollectionModal(true)}
            style={{
              background: colors.link,
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
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            Add Collection
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{
          ...cardStyle,
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: '1', minWidth: isMobile ? '200px' : '300px' }}>
            <input
              type="text"
              placeholder="🔍 Search collections..."
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px 16px',
              border: `2px solid ${colors.border}`,
              borderRadius: '12px',
              fontSize: '1rem',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 0',
            color: colors.mutedText
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            Loading your collections...
          </div>
        ) : filteredCollections.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '64px 0',
            color: colors.mutedText
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📂</div>
            <h3>No collections found</h3>
            <p>Start building your research collections by creating your first collection</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                style={{
                  ...cardStyle,
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = shadows.medium;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = shadows.soft;
                }}
                onClick={() => navigate(`/collection/${collection.id}`)}
              >
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/collection/${collection.id}/assign`);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.hover}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    title="Assign Articles"
                  >
                    ➕
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCollection(collection);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.hover}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(collection.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>

                <div style={{ paddingRight: '100px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: colors.primaryText,
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📂 {collection.collection_name}
                  </h3>

                  <div style={{
                    background: colors.link,
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    display: 'inline-block'
                  }}>
                    {collection.articleCount} articles
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: colors.mutedText,
                    marginTop: '16px'
                  }}>
                    <span>📅 {new Date(collection.createdAt).toLocaleDateString()}</span>
                    <span>📂 Collection</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Form Modal */}
      {showCollectionModal && (
        <CollectionFormModal
          onClose={handleCloseModal}
          onSave={handleSaveCollection}
          initialData={editingCollection}
        />
      )}
    </Layout>
  );
}