import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients, secondaryButtonStyle, shadows as shadowsTheme } from '../theme';
import { useAuth } from '../auth';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initials = (user?.name || 'User          ').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // reset file input
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
      setUploading(true);
      setUploadStatus('Uploading and processing...');

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
          setUploadStatus('Upload and processing successful.');

          // Update article summary (abstract) with generated summary from backend
          if (data.summary) {
            setArticle(prev => ({
              ...prev,
              summary: data.summary,
              file_name: data.filename || prev.file_name,
              hashtags: data.hashtags || prev.hashtags,
            }));
          } else {
            // If backend does not return summary, refresh article from API
            const refreshed = await api.get(`/articles/${id}`);
            setArticle(refreshed.data);
          }
        } else {
          const errorData = await response.json();
          setUploadStatus('Upload failed: ' + (errorData.error || 'Unknown error'));
        }
      } catch (error) {
        setUploadStatus('Upload error: ' + error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', color: 'red' }}>{error}</div>;
  if (!article) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Article not found.</div>;

  // Extract summary and hashtags
const summaryText = article.summary || '';
let mainSummary = summaryText.trim();
let hashtags = article.hashtags?.trim() || '';

// Fallback: extract hashtags from summary if not separately provided
if (!hashtags) {
  const lines = summaryText.split('\n');
  let hashtagStartIndex = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith('#')) {
      hashtagStartIndex = i;
    } else if (hashtagStartIndex !== lines.length) {
      break;
    }
  }
  const mainSummaryLines = lines.slice(0, hashtagStartIndex);
  const hashtagLines = lines.slice(hashtagStartIndex);
  mainSummary = mainSummaryLines.join('\n').trim();
  hashtags = hashtagLines.join(' ').trim();
}

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: 'Inter, sans-serif', 
      background: gradients.app,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ... your existing sidebar and background code unchanged ... */}

      {/* Main Content */}
      <div style={{ 
        flexGrow: 1, 
        padding: '40px', 
        maxWidth: '800px', 
        margin: 'auto',
        animation: 'fadeInRight 0.6s ease-out 0.3s both',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '24px',
          animation: 'fadeInDown 0.8s ease-out 0.5s both'
        }}>
          <button
            onClick={() => nav(-1)}
            style={{ ...primaryButtonStyle }}
          >
            ← Back
          </button>
        </div>

        <div style={{ 
          ...cardStyle, 
          padding: '24px', 
          boxShadow: shadows.medium,
          animation: 'fadeInUp 0.8s ease-out 0.7s both'
        }}>
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
            <h3>Summary</h3>
            <ReactMarkdown>{mainSummary || 'No summary available.'}</ReactMarkdown>

            {hashtags && (
              <div style={{ marginTop: 10 }}>
                <h4>Hashtags</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {hashtags.split(' ').map(tag => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: '#f0f0f0',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#333'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}


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
                ...secondaryButtonStyle,
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '10px 16px',
                opacity: uploading ? 0.6 : 1,
              }}
              type="button"
              onClick={handleButtonClick}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>

            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {uploadStatus && (
              <p style={{ marginTop: '8px', color: uploadStatus.startsWith('Upload and processing successful') ? 'green' : 'red' }}>
                {uploadStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>
        {`
          @keyframes detailsFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            20% { transform: translateY(-20px) rotate(72deg); }
            40% { transform: translateY(15px) rotate(144deg); }
            60% { transform: translateY(-10px) rotate(216deg); }
            80% { transform: translateY(25px) rotate(288deg); }
          }
          
          @keyframes detailsPulse {
            0%, 100% { transform: scale(1); opacity: 0.04; }
            50% { transform: scale(1.1); opacity: 0.08; }
          }
          
          @keyframes slideInLeft {
            from { 
              opacity: 0; 
              transform: translateX(-100px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes fadeInRight {
            from { 
              opacity: 0; 
              transform: translateX(50px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes fadeInDown {
            from { 
              opacity: 0; 
              transform: translateY(-30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(30px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
        `}
      </style>
    </div>
  );
}
