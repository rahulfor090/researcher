import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';
import ArticleFormModal from '../components/ArticleFormModal';

export default function Dashboard() {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
  };
   // Ensure handleSaveArticle is defined here, within the Dashboard component
   const handleSaveArticle = async (articleData) => {
    await api.post('/articles', articleData); // Make POST request to create article
    load(); // Reload articles to show the new one
  };
  useEffect(() => { load(); }, []);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Left Navigation Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#334155', color: 'white', padding: '20px' }}>
        <h3>Research Locker</h3>
        {/* Navigation links will go here */}
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
              onClick={() => setShowModal(true)} // This is the crucial line to open the modal
            >
              + Add New
            </button>
          </div>
        </div>
        
        {/* The existing article list will go here for now, but will be replaced by cards */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>My Articles</h3>
          <button onClick={logout}>Logout</button>
          <ul>
            {articles.map(a => (
              <li key={a.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>{a.title}</a>
                {a.doi ? ` — DOI: ${a.doi}` : ''}
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
        {/* Recent activity items will go here */}
        <p>No recent activity yet.</p>
      </div>
      
      {/* Conditionally render the ArticleFormModal */}
      {showModal && (
        <ArticleFormModal
          onClose={() => setShowModal(false)} // Close modal function
          onSave={handleSaveArticle} // Save article function
        />
      )}


    </div>
  );
}
