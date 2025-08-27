import { useState, useEffect } from 'react';

export default function ArticleFormModal({ onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [authors, setAuthors] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form fields if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUrl(initialData.url || '');
      setDoi(initialData.doi || '');
      setPurchaseDate(initialData.purchaseDate || '');
      setAuthors(initialData.authors || '');
      setPrice(initialData.price || '');
    } else {
      setTitle('');
      setUrl('');
      setDoi('');
      setPurchaseDate('');
      setAuthors('');
      setPrice('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!title || !url) {
      setError('Title and URL are required.');
      return;
    }

    try {
      await onSave({ title, url, doi, purchaseDate, authors, price });
      onClose(); // Close the modal on success
    } catch (ex) {
      setError(ex?.response?.data?.message || 'Failed to save article.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? 'Edit Article' : 'Add New Article'}</h3>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="DOI (Optional)"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            style={inputStyle}
          />
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="date"
            placeholder="Purchase Date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
            required
          />
          
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={saveButtonStyle}>
              {initialData ? 'Save Changes' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Basic inline styles for the modal - you can replace these with CSS classes later
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  width: '400px',
  maxWidth: '90%',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginTop: '20px',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
};

const baseButtonStyle = {
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  fontSize: '1rem',
};

const cancelButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#f0f0f0',
  color: '#333',
};

const saveButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#007bff',
  color: 'white',
};