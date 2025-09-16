import { useState, useEffect } from 'react';
import { primaryButtonStyle, secondaryButtonStyle } from '../theme';

export default function CollectionFormModal({ onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form fields if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.collection_name || '');
    } else {
      setName('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!name.trim()) {
      setError('Collection name is required.');
      return;
    }

    try {
      await onSave({ name: name.trim() });
      onClose(); // Close the modal on success
    } catch (ex) {
      setError(ex?.response?.data?.message || 'Failed to save collection.');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ 
          margin: '0 0 20px',
          color: '#333',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          📂 {initialData ? 'Edit Collection' : 'Create New Collection'}
        </h3>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            placeholder="Collection name (e.g., Research Papers, Bookmarks, Favorites)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
            maxLength={100}
            autoFocus
          />

          {/* Error message above buttons */}
          {error && <div style={errorMessageStyle}>{error}</div>}

          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={saveButtonStyle}>
              {initialData ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Basic inline styles for the modal
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
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  width: '450px',
  maxWidth: '90%',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const inputStyle = {
  padding: '12px 16px',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '1rem',
  transition: 'border-color 0.3s ease',
  outline: 'none',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '10px',
};

const cancelButtonStyle = {
  ...secondaryButtonStyle,
  padding: '10px 20px',
  borderRadius: '8px',
};

const saveButtonStyle = {
  ...primaryButtonStyle,
  padding: '10px 20px',
  borderRadius: '8px',
};

const errorMessageStyle = {
  color: '#ef4444',
  marginBottom: '10px',
  fontSize: '0.9rem',
  textAlign: 'center',
  padding: '8px',
  backgroundColor: '#fef2f2',
  borderRadius: '6px',
  border: '1px solid #fecaca',
};