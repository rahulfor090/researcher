import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, cardStyle, primaryButtonStyle, shadows, gradients, secondaryButtonStyle } from '../theme';
import { useAuth } from '../auth';
import ReactMarkdown from 'react-markdown';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { htmlToText } from 'html-to-text';

// Set to true if backend expects plain text; false if it accepts HTML
const SEND_PLAIN_TEXT = false;

const BASE_API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ArticleDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editorContent, setEditorContent] = useState('');

  const initials = (user?.name || 'User').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();

  // Quill toolbar configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': ['#000000', '#ff0000', '#00ff00', '#0000ff'] }],
      ['clean'],
    ],
  };

  // Quill formats to enable
  const formats = [
    'bold',
    'italic',
    'underline',
    'color',
    'list',
    'bullet'
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log('Fetching article with ID:', id);
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data);
        let initialContent = data.summary || '';
        
        // If initial content is plain text, convert to bullet points
        if (!initialContent.startsWith('<')) {
          const lines = initialContent.split('\n').filter(line => line.trim() !== '');
          if (lines.length > 1) {
            // Convert to bullet points if multiple lines
            initialContent = '<ul>' + 
              lines.map(line => `<li>${line.trim()}</li>`).join('') + 
              '</ul>';
          } else {
            // Single line, just wrap in paragraph
            initialContent = `<p>${initialContent}</p>`;
          }
        }
        setEditorContent(initialContent);
      } catch (err) {
        console.error('Error fetching article:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(err.response?.status === 404 ? 'Article not found.' : 'Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
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
        const response = await fetch(`${BASE_API_URL}/upload/pdf?id=${id}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadStatus('Upload and processing successful.');
          if (data.summary) {
            // Convert plain summary from PDF to bullet points HTML format
            const lines = data.summary.split('\n').filter(line => line.trim() !== '');
            const bulletPointsHtml = '<ul>' + 
              lines.map(line => `<li>${line.trim()}</li>`).join('') + 
              '</ul>';
            
            setArticle(prev => ({
              ...prev,
              summary: bulletPointsHtml,
              file_name: data.filename || prev.file_name,
              hashtags: data.hashtags || prev.hashtags,
            }));
            setEditorContent(bulletPointsHtml);
          } else {
            const refreshed = await api.get(`/articles/${id}`);
            setArticle(refreshed.data);
            let newContent = refreshed.data.summary || '';
            if (!newContent.startsWith('<')) {
              const lines = newContent.split('\n').filter(line => line.trim() !== '');
              if (lines.length > 1) {
                // Convert to bullet points if multiple lines
                newContent = '<ul>' + 
                  lines.map(line => `<li>${line.trim()}</li>`).join('') + 
                  '</ul>';
              } else {
                // Single line, just wrap in paragraph
                newContent = `<p>${newContent}</p>`;
              }
            }
            setEditorContent(newContent);
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

  const handleSaveSummary = async () => {
    if (!editorContent || editorContent === '<p><br></p>' || editorContent.trim() === '') {
      setSaveStatus('Failed to save summary: Content cannot be empty');
      return;
    }
    try {
      console.log('Saving summary for ID:', id);
      console.log('Editor content (HTML):', editorContent);
      const contentToSave = SEND_PLAIN_TEXT ? htmlToText(editorContent, { wordwrap: false }) : editorContent;
      console.log('Content to save:', contentToSave);

      const updateData = {
        title: article.title,
        url: article.url,
        doi: article.doi || '',
        authors: article.authors || '',
        summary: contentToSave,
      };

      console.log('Sending PUT request to:', `/articles/${id}`);
      console.log('Request payload:', updateData);

      const response = await api.put(`/articles/${id}`, updateData);
      console.log('Save response:', {
        status: response.status,
        data: response.data,
      });

      setArticle(prev => ({ ...prev, summary: contentToSave }));
      setIsEditing(false);
      setSaveStatus('Summary saved successfully.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Save error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      const errorMessage = error.response?.status === 404
        ? 'Article not found. Please check if the article ID is valid.'
        : `Failed to save summary: ${error.response?.data?.error || error.message}`;
      setSaveStatus(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    let originalContent = article.summary || '';
    if (!originalContent.startsWith('<')) {
      const lines = originalContent.split('\n').filter(line => line.trim() !== '');
      if (lines.length > 1) {
        // Convert to bullet points if multiple lines
        originalContent = '<ul>' + 
          lines.map(line => `<li>${line.trim()}</li>`).join('') + 
          '</ul>';
      } else {
        // Single line, just wrap in paragraph
        originalContent = `<p>${originalContent}</p>`;
      }
    }
    setEditorContent(originalContent);
    setSaveStatus(null);
  };

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', color: 'red' }}>{error}</div>;
  if (!article) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Article not found.</div>;

  const summaryText = article.summary || '';
  let mainSummary = summaryText.trim();
  let hashtags = article.hashtags?.trim() || '';

  if (!hashtags) {

    // To parse from HTML, first get plain text
    const plainSummary = htmlToText(summaryText, { wordwrap: false });
    const lines = plainSummary.split('\n');
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
          <button onClick={() => nav(-1)} style={{ ...primaryButtonStyle }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0 }}>Summary</h3>
              <button
                style={{
                  ...secondaryButtonStyle,
                  cursor: 'pointer',
                  fontWeight: 600,
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit Summary
              </button>
            </div>
            {isEditing ? (
              <div style={{ marginTop: '10px' }}>
                <div style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    style={{
                      backgroundColor: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.5',
                      color: colors.primaryText,
                      minHeight: '100px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    style={{ ...primaryButtonStyle, padding: '8px 16px' }}
                    onClick={handleSaveSummary}
                  >
                    Save
                  </button>
                  <button
                    style={{ ...secondaryButtonStyle, padding: '8px 16px' }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
                {saveStatus && (
                  <p style={{ marginTop: '8px', color: saveStatus.startsWith('Summary saved') ? 'green' : 'red' }}>
                    {saveStatus}
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: colors.primaryText,
                  marginTop: '10px'
                }}
                dangerouslySetInnerHTML={{ __html: mainSummary || 'No summary available.' }}
              />
            )}

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

            {article.file_name && (
              <p>
                <strong>Uploaded PDF:</strong>{' '}
                <a
                  href={`${BASE_API_URL}/uploads/${article.file_name}`}
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
      <style>
        {`
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(50px) scale(0.95); }
            to { opacity: 1; transform: translateX(0) scale(1); }
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          /* Style Quill editor to match ReactMarkdown */
          .ql-editor {
            font-family: 'Inter', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
            color: ${colors.primaryText} !important;
            min-height: 100px !important;
            padding: 16px !important;
            background-color: #fff !important;
          }
          .ql-editor p {
            margin: 0 0 10px 0 !important;
          }
          .ql-container {
            border: none !important;
          }
          .ql-toolbar {
            background-color: #f5f5f5 !important;
            border: none !important;
            border-bottom: 1px solid #ddd !important;
            border-radius: 8px 8px 0 0 !important;
          }
        `}
      </style>
    </div>
  );
}