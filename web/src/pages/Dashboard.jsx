import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [query, setQuery] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formDoi, setFormDoi] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const submitBookmark = async (e) => {
    e.preventDefault();
    if (!formTitle || !formUrl) return;
    try {
      const payload = {
        title: formTitle,
        url: formUrl,
        abstract: formDescription,
        authors: formAuthor || undefined,
        doi: formDoi || undefined,
        tags: formNotes ? { notes: formNotes } : undefined
      };
      const { data: created } = await api.post('/articles', payload);
      setArticles(prev => [created, ...prev]);
    } catch (err) {
      // Simple fallback error handling
      // eslint-disable-next-line no-alert
      alert(err?.response?.data?.message || 'Failed to save');
      return;
    }
    setFormTitle('');
    setFormUrl('');
    setFormDescription('');
    setFormAuthor('');
    setFormDoi('');
    setFormNotes('');
    setShowForm(false);
  };
  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">My Articles</h2>
        <div className="dashboard-actions">
          <button className="inline-btn secondary" onClick={logout}>Logout</button>
          <button className="inline-btn" onClick={() => setShowForm(s => !s)}>{showForm ? 'Close' : 'Add'}</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search by title, author, DOI or notes" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {showForm && (
        <form onSubmit={submitBookmark}>
          <div className="form-grid">
            <input className="input-field" placeholder="Title" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <input className="input-field" placeholder="Author" value={formAuthor} onChange={e => setFormAuthor(e.target.value)} />
            <input className="input-field" placeholder="URL" value={formUrl} onChange={e => setFormUrl(e.target.value)} />
            <input className="input-field" placeholder="DOI" value={formDoi} onChange={e => setFormDoi(e.target.value)} />
            <input className="input-field" placeholder="Description" value={formDescription} onChange={e => setFormDescription(e.target.value)} />
            <input className="input-field" placeholder="Notes" value={formNotes} onChange={e => setFormNotes(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="submit" className="inline-btn">Save</button>
            <button type="button" className="inline-btn secondary" onClick={() => { setShowForm(false); setFormTitle(''); setFormUrl(''); setFormDescription(''); setFormAuthor(''); setFormDoi(''); setFormNotes(''); }}>Cancel</button>
          </div>
        </form>
      )}

      {articles.length === 0 && bookmarks.length === 0 ? (
        <div className="empty-state">No articles yet. Click Add to save your first one.</div>
      ) : (
        <div className="cards">
          {[...articles, ...bookmarks].
            filter(item => {
              if (!query) return true;
              const q = query.toLowerCase();
              return (
                (item.title || '').toLowerCase().includes(q) ||
                (item.authors || item.author || '').toLowerCase().includes(q) ||
                (item.doi || '').toLowerCase().includes(q) ||
                (item.tags?.notes || item.notes || '').toLowerCase().includes(q)
              );
            }).
            map((item, idx) => (
            <div key={item.id} className="card-item card-enter" style={{ animationDelay: `${(idx%12)*40}ms` }}>
              <div className="card-title">{item.title}</div>
              {(item.authors || item.author) && (
                <div className="card-meta">Author: {item.authors || item.author}</div>
              )}
              {item.doi && <span className="badge">DOI</span>}
              {(item.tags?.notes || item.notes) && <span className="badge">Notes</span>}

              <div className="card-actions">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-btn small-btn">Open</a>
                <button type="button" className="inline-btn secondary small-btn" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  {expandedId === item.id ? 'Hide details' : 'Show details'}
                </button>
              </div>

              <div className={`details ${expandedId === item.id ? 'open' : ''}`} style={{ marginTop: 10 }}>
                {item.doi && <div className="muted">DOI: {item.doi}</div>}
                <div className="card-url"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></div>
                {(item.abstract || item.description) && (
                  <div className="muted" style={{ marginTop: 6 }}>{item.abstract || item.description}</div>
                )}
                {(item.tags?.notes || item.notes) && (
                  <div className="muted" style={{ marginTop: 6 }}>Notes: {item.tags?.notes || item.notes}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
