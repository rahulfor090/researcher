import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import ArticleFormModal from '../components/ArticleFormModal';

export default function Dashboard() {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null); // NEW

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
    } catch (err) {
      alert('Failed to delete article.');
    }
  };

  // Open modal in edit mode
  const handleEditArticle = (article) => {
    setEditArticle(article);
    setShowModal(true);
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Left Navigation Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#334155', color: 'white', padding: '20px' }}>
        <h3>Research Locker</h3>
        <ul>
          <li>Dashboard</li>
          <li>Library</li>
          <li>Collections</li>
          <li>Tags</li>
          <li>All insights</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Dashboard</h2>
          <div>
            <span>Syread</span>
            <button
              style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => { setEditArticle(null); setShowModal(true); }}
            >
              + Add New
            </button>
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>My Articles</h3>
          <button onClick={logout}>Logout</button>
          <ul>
            {articles.map(a => (
              <li
                key={a.id}
                style={{
                  marginBottom: '10px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', textDecoration: 'none' }}
                  >
                    {a.title}
                  </a>
                  {a.doi ? ` — DOI: ${a.doi}` : ''}
                </span>
                <div>
                  <button
                    style={{
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                    onClick={() => handleEditArticle(a)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteArticle(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Sidebar (Filters & Recent Activity) */}
      <div style={{ width: '300px', backgroundColor: 'white', padding: '20px', borderLeft: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h4>Filters</h4>
        <input type="text" placeholder="Search..." style={{ width: '100%', padding: '8px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px' }} />

        <h4>Recent Activity</h4>
        <p>No recent activity yet.</p>
      </div>
      
      {/* Conditionally render the ArticleFormModal */}
      {showModal && (
        <ArticleFormModal
          onClose={() => { setShowModal(false); setEditArticle(null); }}
          onSave={handleSaveArticle}
          initialData={editArticle}
        />
      )}
    </div>
  );
}