import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients, secondaryButtonStyle, shadows as shadowsTheme } from '../theme';
import { useAuth } from '../auth';

export default function ArticleDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const initials = (user?.name || 'User      ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data);
      } catch {
        setError('Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadStatus('Please select a PDF file.');
        return;
      }
      setUploadStatus('Uploading...');
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        // Send article id as query parameter
        const response = await fetch(`http://localhost:5000/v1/upload/pdf?id=${id}`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setUploadStatus('Upload successful: ' + data.filename);
          // Optionally, refresh article data to show updated file_name
          const refreshed = await api.get(`/articles/${id}`);
          setArticle(refreshed.data);
        } else {
          const errorData = await response.json();
          setUploadStatus('Upload failed: ' + (errorData.error || 'Unknown error'));
        }
      } catch (error) {
        setUploadStatus('Upload error: ' + error.message);
      }
    }
  };

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', color: 'red' }}>{error}</div>;
  if (!article) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Article not found.</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: gradients.app }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: '280px',
          background: gradients.sidebar,
          color: 'white',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: shadowsTheme.medium,
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
          position: 'relative',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', color: '#e5e7eb' }}>
          Research Locker
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '16px',
            cursor: 'default',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.name || 'You'}</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user?.email || ''}</div>
          </div>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Dashboard', icon: '🏠', path: '/' },
              { label: 'Library', icon: '📚', path: '/library' },
              { label: 'Collections', icon: '🗂️', path: null },
              { label: 'All insights', icon: '📈', path: null },
            ].map(({ label, icon, path }) => (
              <li
                key={label}
                style={{
                  padding: '10px 12px',
                  color: '#cbd5e1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: path ? 'pointer' : 'default',
                  transition: 'background 180ms ease, transform 180ms ease',
                }}
                onClick={() => {
                  if (path) nav(path);
                }}
                onMouseEnter={e => {
                  if (path) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = '';
                }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '40px', maxWidth: '800px', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button onClick={() => nav(-1)} style={{ ...primaryButtonStyle }}>
            ← Back
          </button>
        </div>

        <div style={{ ...cardStyle, padding: '24px', boxShadow: shadows.medium }}>
          <h1 style={{ marginTop: 0, color: colors.primaryText }}>{article.title}</h1>
          <p><strong>DOI:</strong> {article.doi || '-'}</p>
          <p><strong>Authors:</strong> {article.authors || '-'}</p>
          <p>
            <strong>URL:</strong>{' '}
            {article.url ? (
              <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.link }}>
                {article.url}
              </a>
            ) : (
              '-'
            )}
          </p>
          <div style={{ marginTop: '16px' }}>
            <h3>Abstract / Description</h3>
            <p>{article.abstract || 'No description available.'}</p>

            {/* Show current uploaded file name if exists */}
            {article.file_name && (
              <p>
                <strong>Uploaded PDF:</strong>{' '}
                <a
                  href={`http://localhost:5000/uploads/${article.file_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.file_name}
                </a>
              </p>
            )}

            <button
              style={{
                marginTop: '16px',
                ...secondaryButtonStyle,
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '10px 16px',
              }}
              type="button"
              onClick={handleButtonClick}
            >
              Upload PDF
            </button>

            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {uploadStatus && (
              <p style={{ marginTop: '8px', color: uploadStatus.startsWith('Upload successful') ? 'green' : 'red' }}>
                {uploadStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
