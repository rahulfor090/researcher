import { useEffect, useState } from 'react';

export default function EditArticleModal({ article, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [doi, setDoi] = useState('');
  const [url, setUrl] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(article?.title || '');
    setAuthors(article?.authors || '');
    setDoi(article?.doi || '');
    setUrl(article?.url || '');
    setPurchaseDate(article?.purchaseDate || '');
    setPrice(article?.price != null ? String(article.price) : '');
  }, [article]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !url) {
      setError('Title and URL are required.');
      return;
    }
    try {
      await onSave({ title, authors, doi, url, purchaseDate, price });
      onClose();
    } catch (ex) {
      // Display a readable error and also let the caller log if desired
      setError(ex?.response?.data?.message || 'Failed to update article.');
    }
  };

  return (
    <div style={overlay}>
      <div style={content}>
        <h3>Edit Article</h3>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={form}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
            required
          />
          <input
            type="text"
            placeholder="Authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            style={input}
            required
          />
          <input
            type="text"
            placeholder="DOI (Optional)"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            style={input}
          />
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={input}
            required
          />
          <input
            type="date"
            placeholder="Purchase Date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            style={input}
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={input}
          />
          <div style={buttons}>
            <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
            <button type="submit" style={saveBtn}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const content = {
  backgroundColor: 'white',
  padding: '28px',
  borderRadius: 8,
  width: 400,
  maxWidth: '90%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
};

const form = { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 };
const input = { padding: '10px', border: '1px solid #ddd', borderRadius: 4 };
const buttons = { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 };
const baseBtn = { padding: '8px 12px', borderRadius: 5, border: 'none', cursor: 'pointer' };
const cancelBtn = { ...baseBtn, backgroundColor: '#6b7280', color: 'white' };
const saveBtn = { ...baseBtn, backgroundColor: '#007bff', color: 'white' };


