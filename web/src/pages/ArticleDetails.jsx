import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { colors, gradients } from '../theme';
import { useAuth } from '../auth';
import ReactMarkdown from 'react-markdown';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { htmlToText } from 'html-to-text';
import './ArticleDetails.css';

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
  const [pdfProcessed, setPdfProcessed] = useState(false);

  // Quill toolbar configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': ['#000000', '#ff0000', '#00ff00', '#0000ff'] }],
      ['clean'],
    ],
  };

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
        const { data } = await api.get(`/articles/${id}`);
        // Ensure authors is never undefined
        const processedData = {
          ...data,
          authors: data.authors?.trim() || 'N/A'
        };
        setArticle(processedData);
        let initialContent = data.summary || '';
        if (!initialContent.startsWith('<')) {
          const lines = initialContent.split('\n').filter(line => line.trim() !== '');
          if (lines.length > 1) {
            initialContent = '<ul>' +
              lines.map(line => `<li>${line.trim()}</li>`).join('') +
              '</ul>';
          } else {
            initialContent = `<p>${initialContent}</p>`;
          }
        }
        setEditorContent(initialContent);
        setPdfProcessed(Boolean(data.file_name));
      } catch (err) {
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
          setPdfProcessed(true);
          if (data.summary) {
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
                newContent = '<ul>' +
                  lines.map(line => `<li>${line.trim()}</li>`).join('') +
                  '</ul>';
              } else {
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
      const contentToSave = SEND_PLAIN_TEXT ? htmlToText(editorContent, { wordwrap: false }) : editorContent;
      const updateData = {
        title: article.title,
        url: article.url,
        doi: article.doi || '',
        authors: article.authors || '',
        summary: contentToSave,
      };
      await api.put(`/articles/${id}`, updateData);
      setArticle(prev => ({ ...prev, summary: contentToSave }));
      setIsEditing(false);
      setSaveStatus('Summary saved successfully.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
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
        originalContent = '<ul>' +
          lines.map(line => `<li>${line.trim()}</li>`).join('') +
          '</ul>';
      } else {
        originalContent = `<p>${originalContent}</p>`;
      }
    }
    setEditorContent(originalContent);
    setSaveStatus(null);
  };

  // Improved formatSummary function to clean Quill HTML
  function formatSummary(text) {
    if (!text) return '';

    // Remove all Quill UI spans
    text = text.replace(/<span class="ql-ui"[^>]*><\/span>/g, '');

    // Remove all attributes from <li> tags (like data-list)
    text = text.replace(/<li[^>]*>/g, '<li>');

    // Convert <ul>/<ol> lists to plain text
    text = text.replace(/<(ul|ol)>\s*/g, '')
               .replace(/<\/(ul|ol)>/g, '');

    // Convert <li> to new lines
    text = text.replace(/<li>/g, '')
               .replace(/<\/li>/g, '\n');

    // Remove leading bullet points (•) and stray "**"
    text = text.replace(/^•\s*/gm, '');
    text = text.replace(/^\*\*\s*$/gm, '');

    // Section headings to recognize and format
    const headings = [
      { pattern: /Detailed Summary with Key Points/i, markdown: '## Detailed Summary with Key Points' },
      { pattern: /Background & Motivation/i, markdown: '### Background & Motivation' },
      { pattern: /Key Findings/i, markdown: '### Key Findings' },
      { pattern: /Methods & Evidence/i, markdown: '### Methods & Evidence' },
      { pattern: /Therapeutic Implications/i, markdown: '### Therapeutic Implications' },
      { pattern: /Conclusion/i, markdown: '### Conclusion' },
    ];

    // Insert line breaks and markdown headings, remove remaining "**" around headings
    headings.forEach(({ pattern, markdown }) => {
      text = text.replace(new RegExp(`\\*\\*\\s*${pattern.source}\\s*\\*\\*`, 'i'), markdown);
      text = text.replace(pattern, match => `\n\n${markdown}\n\n`);
    });

    // Insert line breaks after sentences followed by a heading or at the end
    text = text.replace(/\.\s*(?=\n\n##|\n\n###|$)/g, '.\n\n');

    // Remove any remaining numbered headings
    text = text.replace(/^\d+\.\s*/gm, '');

    // Clean up excessive spaces and line breaks
    text = text.replace(/\n{3,}/g, '\n\n');

    // Trim
    return text.trim();
  }

  const markdownComponents = {
    h1: ({node, ...props}) => <div style={{fontSize: '2rem', fontWeight: 700, margin: '24px 0 16px 0', color: '#2c3e50'}} {...props} />,
    h2: ({node, ...props}) => <div style={{fontSize: '1.4rem', fontWeight: 600, margin: '22px 0 12px 0', color: '#2c3e50'}} {...props} />,
    h3: ({node, ...props}) => <div style={{fontSize: '1.1rem', fontWeight: 600, margin: '18px 0 10px 0', color: '#2c3e50'}} {...props} />,
    p: ({node, ...props}) => <p style={{margin: '0 0 10px 0', color: '#23272f'}} {...props} />,
    li: ({node, ...props}) => <li style={{marginBottom: 6}} {...props} />,
  };

  // Calculate summary and hashtags every render
  let summaryText = article?.summary || '';
  let mainSummary = summaryText.trim();
  let hashtags = article?.hashtags?.trim() || '';

  if (!hashtags) {
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

  const noSummaryGenerated = (
    (!article?.file_name || !pdfProcessed) &&
    (!mainSummary || mainSummary === "<p></p>" || mainSummary === "<p><br></p>" || mainSummary === "")
  );

  if (loading) return <div className="articledetails-loading">Loading...</div>;
  if (error) return <div className="articledetails-error">{error}</div>;
  if (!article) return <div className="articledetails-loading">Article not found.</div>;

  return (
    <div className="articledetails-app" style={{ background: gradients.app }}>
      <div className="articledetails-centerbox">
        <div className="articledetails-toprow">
          <button onClick={() => nav(-1)} className="articledetails-backbtn">
            ← Back
          </button>
        </div>
        <div className="articledetails-card">
          <h1 className="articledetails-title">{article.title}</h1>
          <div className="articledetails-info">
            <div>
              <span className="articledetails-label">Authors:</span>{' '}
              <span>{article.authors || '-'}</span>
            </div>
            <div>
              <span className="articledetails-label">DOI:</span>{' '}
              <span>{article.doi || '-'}</span>
            </div>
            <div>
              <span className="articledetails-label">URL:</span>{' '}
              {article.url ? (
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="articledetails-link">
                  {article.url}
                </a>
              ) : (
                '-'
              )}
            </div>
          </div>
          <div className="articledetails-summarybox">
            <div className="articledetails-summaryheader">
              <h3 className="articledetails-summarytitle">Summary</h3>
              <button
                className="articledetails-editbtn articledetails-editbtn-right"
                onClick={() => setIsEditing(true)}
              >
                Edit Summary
              </button>
            </div>
            {isEditing ? (
              <div className="articledetails-editorbox">
                <ReactQuill
                  value={editorContent}
                  onChange={setEditorContent}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
                <div className="articledetails-editactions">
                  <button
                    className="articledetails-savebtn"
                    onClick={handleSaveSummary}
                  >
                    Save
                  </button>
                  <button
                    className="articledetails-cancelbtn"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
                {saveStatus && (
                  <p className={`articledetails-savestatus ${saveStatus.startsWith('Summary saved') ? 'success' : 'error'}`}>
                    {saveStatus}
                  </p>
                )}
              </div>
            ) : (
              <div className="articledetails-markdown">
                {noSummaryGenerated ? (
                  <div style={{ fontWeight: 600, padding: '20px 0', fontSize: '1.2rem' }}>
                    No Summary Generated!
                  </div>
                ) : (
                  <ReactMarkdown components={markdownComponents}>
                    {formatSummary(mainSummary)}
                  </ReactMarkdown>
                )}
              </div>
            )}

            {hashtags && (
              <div className="articledetails-hashtagsbox">
                <h4 className="articledetails-hashtagsheader">Hashtags</h4>
                <div className="articledetails-hashtags">
                  {hashtags.split(' ').map(tag => (
                    <span
                      key={tag}
                      className="articledetails-hashtag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="articledetails-pdfbox">
              {article.file_name && !pdfProcessed && (
                <p className="articledetails-pdfname">
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
              {(!article.file_name || !pdfProcessed) ? (
                <button
                  className="articledetails-uploadbtn articledetails-uploadbtn-left"
                  type="button"
                  onClick={handleButtonClick}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload PDF'}
                </button>
              ) : (
                <button
                  className="articledetails-uploadbtn articledetails-uploadbtn-left"
                  type="button"
                  onClick={handleButtonClick}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Process New PDF'}
                </button>
              )}
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {uploadStatus && (
                <p className={`articledetails-uploadstatus ${uploadStatus.startsWith('Upload and processing successful') ? 'success' : 'error'}`}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}