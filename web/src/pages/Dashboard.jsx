import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', authors: '', doi: '', url: '' });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Library');
  const [query, setQuery] = useState('');
  const load = async () => {
    const { data } = await api.get('/articles');
    setArticles(data);
  };
  useEffect(() => { load(); }, []);

  const submitToApi = async (e) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      await api.post('/articles', {
        title: form.title?.trim() || '',
        authors: form.authors?.trim() || '',
        doi: form.doi?.trim() || '',
        url: form.url?.trim() || window.location.href,
      });
      setMessage('Saved successfully');
      setShowForm(false);
      setForm({ title: '', authors: '', doi: '', url: '' });
      load();
    } catch (ex) {
      setMessage(ex?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const styles = {
    container: { maxWidth: 1060, margin: '30px auto', padding: '0 20px' },
    headerWrap: { position: 'sticky', top: 0, zIndex: 10 },
    headerBar: { display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', marginBottom: 18 },
    title: { margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' },
    search: { flex: 1, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e5e7eb', background: '#f8fafc', padding: '10px 12px', borderRadius: 10 },
    searchInput: { width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#111827' },
    btnRow: { display: 'flex', gap: 10 },
    btnPrimary: { padding: '10px 16px', background: '#0f172a', color: '#fff', border: '1px solid #0b1221', borderRadius: 10, cursor: 'pointer' },
    btnNeutral: { padding: '10px 12px', background: '#ffffff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer' },
    btnDanger: { padding: '10px 12px', background: '#ef4444', color: '#ffffff', border: '1px solid #dc2626', borderRadius: 10, cursor: 'pointer' },
    tabs: { display: 'flex', gap: 6, padding: 8, borderBottom: '1px solid #e5e7eb', marginBottom: 16 },
    tabBtn: (isActive) => ({ padding: '10px 14px', borderRadius: 10, border: '1px solid ' + (isActive ? '#1d4ed8' : '#e5e7eb'), background: isActive ? '#eff6ff' : '#ffffff', color: isActive ? '#1d4ed8' : '#111827', cursor: 'pointer' }),
    sectionCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 18, background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    card: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' },
    formCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', marginBottom: 20 },
    label: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
    input: { padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', width: '100%' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    listGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
    articleTitle: { fontSize: 16, fontWeight: 700, color: '#0f172a', textDecoration: 'none' },
    articleMeta: { fontSize: 13, color: '#6b7280', marginTop: 8 },
    toast: (ok) => ({ marginTop: 8, color: ok ? '#065f46' : '#991b1b', background: ok ? '#d1fae5' : '#fee2e2', border: `1px solid ${ok ? '#10b981' : '#fca5a5'}`, borderRadius: 8, padding: '6px 10px' })
  };
  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(a => [a.title, a.authors, a.doi, a.url].filter(Boolean).some(v => String(v).toLowerCase().includes(q)));
  }, [articles, query]);
  return (
    <div style={styles.container}>
      <div style={styles.headerWrap}>
        <div style={styles.headerBar}>
          <h2 style={styles.title}>My Research Locker</h2>
          <div style={styles.search}>
            <span style={{ color: '#94a3b8' }}>🔎</span>
            <input style={styles.searchInput} placeholder="Search articles..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : 'Add'}</button>
            <button style={styles.btnNeutral} onClick={() => setActiveTab('Account')}>👤</button>
            <button style={styles.btnDanger} title="Logout" onClick={logout}>⎋</button>
          </div>
        </div>
        <div style={styles.tabs}>
          <button style={styles.tabBtn(activeTab === 'Library')} onClick={() => setActiveTab('Library')}>Library</button>
          <button style={styles.tabBtn(activeTab === 'Analytics')} onClick={() => setActiveTab('Analytics')}>Analytics</button>
          <button style={styles.tabBtn(activeTab === 'Account')} onClick={() => setActiveTab('Account')}>Account</button>
        </div>
      </div>

      {showForm && activeTab === 'Library' && (
        <form onSubmit={submitToApi} style={styles.formCard}>
          <div style={styles.formGrid}>
            <div>
              <div style={styles.label}>Title</div>
              <input style={styles.input} placeholder="e.g., Attention Is All You Need" value={form.title} onChange={update('title')} />
            </div>
            <div>
              <div style={styles.label}>Authors</div>
              <input style={styles.input} placeholder="e.g., Vaswani, Shazeer, et al." value={form.authors} onChange={update('authors')} />
            </div>
            <div>
              <div style={styles.label}>DOI</div>
              <input style={styles.input} placeholder="e.g., 10.48550/arXiv.1706.03762" value={form.doi} onChange={update('doi')} />
            </div>
            <div>
              <div style={styles.label}>URL</div>
              <input style={styles.input} placeholder="https://..." value={form.url} onChange={update('url')} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button style={styles.btnPrimary} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              {message && <span style={styles.toast(message.startsWith('Saved'))}>{message}</span>}
            </div>
          </div>
        </form>
      )}
      {activeTab === 'Library' && (
        <div style={styles.listGrid}>
          {filteredArticles.map(a => (
            <div key={a.id} style={styles.card}>
              <a href={a.url} target="_blank" rel="noreferrer" style={styles.articleTitle}>{a.title}</a>
              <div style={styles.articleMeta}>
                {a.authors ? <span>{a.authors}</span> : null}
                {a.doi ? <span>{a.authors ? ' · ' : ''}DOI: {a.doi}</span> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div style={styles.sectionCard}>
          <h3 style={{ marginTop: 0 }}>Analytics</h3>
          <div style={{ color: '#6b7280' }}>Coming soon: trends, tags, and reading stats.</div>
        </div>
      )}

      {activeTab === 'Account' && (
        <div style={styles.sectionCard}>
          <h3 style={{ marginTop: 0 }}>Account</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Name:</strong> {user?.name || 'Your Name'}</div>
            <div><strong>Email:</strong> {user?.email || 'you@example.com'}</div>
            <div><strong>Plan:</strong> Free</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button style={styles.btnPrimary}>Upgrade Plan</button>
          </div>
        </div>
      )}
    </div>
  );
}
