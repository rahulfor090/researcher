import { useState, useEffect } from 'react';
import { primaryButtonStyle, secondaryButtonStyle } from '../theme';

export default function ArticleFormModal({ onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [authors, setAuthors] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch article data from DOI
  const fetchArticleData = async (doi) => {
    // Show loading state
    setIsLoading(true);
    setError('');

    try {
      // Make API call to Crossref
      const response = await fetch(`https://api.crossref.org/works/${doi}`);
      const data = await response.json();

      if (data.status === 'ok' && data.message) {
        // Extract article details from the response
        const article = data.message;
        
        // Update title
        if (article.title && article.title[0]) {
          setTitle(article.title[0]);
        }

        // Update authors
        if (article.author && Array.isArray(article.author) && article.author.length > 0) {
          const authorNames = article.author
            .map(author => {
              const given = author.given || '';
              const family = author.family || '';
              return [given, family].filter(Boolean).join(' ');
            })
            .filter(name => name.trim())
            .join(', ');
          setAuthors(authorNames || 'N/A');
        } else {
          setAuthors('N/A');
        }

        // Update URL if available
        if (article.URL) {
          setUrl(article.URL);
        }
      }
    } catch (err) {
      setError('Failed to fetch article details. Please enter manually.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle DOI input and fetch data
  const handleDoiChange = async (e) => {
    const newDoi = e.target.value;
    setDoi(newDoi);
  };

  // Handle when user leaves DOI field or presses Tab
  const handleDoiBlur = async () => {
    if (doi.trim()) {
      await fetchArticleData(doi.trim());
    }
  };

  // Pre-fill form fields if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUrl(initialData.url || '');
      setDoi(initialData.doi || '');
      setAuthors(initialData.authors || '');
    } else {
      setTitle('');
      setUrl('');
      setDoi('');
      setAuthors('');
    }
  }, [initialData]);

  // Validate DOI format
  const isValidDOI = (doi) => {
    // Basic DOI format validation
    const doiRegex = /^10\.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i;
    return doiRegex.test(doi.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!title || !url || !doi) {
      setError('Title, URL, and DOI are required.');
      return;
    }

    if (!isValidDOI(doi)) {
      setError('Invalid DOI format. Example: 10.1234/abc123');
      return;
    }

    // Ensure authors field is never undefined
    const authorData = authors.trim() || 'N/A';

    try {
      await onSave({ title, url, doi, authors: authorData });
      onClose(); // Close the modal on success
    } catch (ex) {
      // Check for specific duplicate DOI error
      if (ex?.response?.status === 409 || 
          ex?.response?.data?.message?.toLowerCase().includes('duplicate') ||
          ex?.response?.data?.message?.toLowerCase().includes('already exists')) {
        setError('An article with this DOI already exists in your library.');
      } else {
        setError(ex?.response?.data?.message || 'Failed to save article.');
      }
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? 'Edit Article' : 'Add New Article'}</h3>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="https://doi.org/10.1234/abc123"
                value={doi}
                onChange={handleDoiChange}
                onBlur={handleDoiBlur}
                style={{ ...inputStyle, width: '300px' }}
                title="DOI format: 10.XXXX/XXXXX"
                required
              />
              {isLoading && (
                <div style={{
                  animation: 'spin 1s linear infinite',
                  marginLeft: '8px',
                  fontSize: '1rem'
                }}>
                  ⌛
                </div>
              )}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              width: '300px',
              justifyContent: 'center'
            }}>
              💡 Enter a DOI and press TAB to automatically fill article details
            </div>
          </div>
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
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
            required
          />

          {/* Error message above buttons */}
          {error && <div style={errorMessageStyle}>{error}</div>}

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
  marginTop: '10px',
};

const cancelButtonStyle = {
  ...secondaryButtonStyle,
};

const saveButtonStyle = {
  ...primaryButtonStyle,
};

const errorMessageStyle = {
  color: 'red',
  marginBottom: '10px',
  fontSize: '0.9rem',
  textAlign: 'center',
};

// Add spinning animation
const spinAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Add style tag for animation
const styleTag = document.createElement('style');
styleTag.innerHTML = spinAnimation;
document.head.appendChild(styleTag);