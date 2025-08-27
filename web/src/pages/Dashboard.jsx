import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', authors: '', doi: '', url: '', notes: '' });

  const load = async () => {
    try {
      const { data } = await api.get('/v1/articles'); // Updated to /v1/articles
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error.response?.data || error.message);
      setMessage('Error loading articles. Please check if you are logged in.');
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/articles', newArticle); // Updated to /v1/articles
      setMessage('Article added successfully!');
      setNewArticle({ title: '', authors: '', doi: '', url: '', notes: '' }); // Reset form
      setShowForm(false); // Hide form after success
      load(); // Refresh article list
    } catch (error) {
      console.error('Error adding article:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Error adding article. Please try again.';
      setMessage(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>My Articles</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={logout} style={{ padding: '5px 10px', marginRight: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
        <button onClick={() => setShowForm(true)} style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add
        </button>
      </div>
      {message && <p style={{ color: message.includes('Error') || message.includes('required') ? 'red' : 'green' }}>{message}</p>}
      {showForm && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <h3>Add New Article</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              placeholder="Enter Title"
              style={{ padding: '5px', width: '100%' }}
              required
            />
            <input
              type="text"
              value={newArticle.authors}
              onChange={(e) => setNewArticle({ ...newArticle, authors: e.target.value })}
              placeholder="Enter Authors"
              style={{ padding: '5px', width: '100%' }}
            />
            <input
              type="text"
              value={newArticle.doi}
              onChange={(e) => setNewArticle({ ...newArticle, doi: e.target.value })}
              placeholder="Enter DOI"
              style={{ padding: '5px', width: '100%' }}
            />
            <input
              type="url"
              value={newArticle.url}
              onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
              placeholder="Enter URL (e.g., https://example.com)"
              style={{ padding: '5px', width: '100%' }}
              required
            />
            <textarea
              value={newArticle.notes}
              onChange={(e) => setNewArticle({ ...newArticle, notes: e.target.value })}
              placeholder="Enter Notes"
              style={{ padding: '5px', width: '100%', minHeight: '60px' }}
            />
            <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
              Submit
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        </div>
      )}
      <ul style={{ marginTop: '20px' }}>
        {articles.map(a => (
          <li key={a.id}>
            <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
            {a.doi ? ` — DOI: ${a.doi}` : ''}
            {a.authors ? ` — Authors: ${a.authors}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}