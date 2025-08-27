import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

function Modal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    doi: '',
    url: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <h3
          style={{
            margin: '0 0 20px 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#333',
          }}
        >
          Save Article
        </h3>
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </label>
          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            Authors
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </label>
          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            DOI
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </label>
          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            URL
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            />
          </label>
          <label
            style={{
              display: 'block',
              marginBottom: '16px',
              fontSize: '0.9rem',
              color: '#555',
            }}
          >
            Notes (optional)
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ddd')}
            ></textarea>
          </label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.background = '#0056b3')}
              onMouseOut={(e) => (e.target.style.background = '#007bff')}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: '#f1f3f5',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.background = '#e0e0e0')}
              onMouseOut={(e) => (e.target.style.background = '#f1f3f5')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
  };

  const handleSave = async (articleData) => {
    await api.post('/articles', articleData);
    load(); // Reload articles after saving
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>My Articles</h2>
      <button onClick={logout}>Logout</button>
      <button onClick={() => setIsModalOpen(true)}>Add</button>
      <ul>
        {articles.map(a => (
          <li key={a.id}>
            <a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a>
            {a.doi ? ` — DOI: ${a.doi}` : ''}
          </li>
        ))}
      </ul>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
    </div>
  );
}