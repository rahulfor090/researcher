import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { gradients } from '../theme';
import { useAuth } from '../auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { htmlToText } from 'html-to-text';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import Lightbox from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import './ArticleDetails.css';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

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

  // PDF Viewer state
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  // Image state
  const [pdfImages, setPdfImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // For scroll
  const pdfRef = useRef(null);
  const imagesRef = useRef(null);

  // Quill toolbar config
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: ['#000000', '#ff0000', '#00ff00', '#0000ff'] }],
      ['clean'],
    ],
  };
  const formats = ['bold', 'italic', 'underline', 'color', 'list', 'bullet'];

  // Detect if text looks like HTML
  const looksLikeHTML = (text) => {
    if (!text) return false;
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) return true;
    return /<\/?(p|ul|ol|li|b|strong|i|em|u|h[1-6]|br|div|span|a)[^>]*>/i.test(trimmed);
  };

  // Normalize → clean HTML
  const normalizeToHtml = (input) => {
    if (!input) return '';
    let outputHtml = '';

    if (looksLikeHTML(input)) {
      outputHtml = input;
    } else {
      const trimmed = input.trim();
      const hasMdMarkers = /\*\*|__|^[-*]\s+|\n-{3,}|\n#{1,6}\s+/m.test(trimmed);
      if (hasMdMarkers) {
        outputHtml = marked.parse(trimmed);
      } else {
        const lines = trimmed.split('\n').map((l) => l.trim()).filter((l) => l !== '');
        if (lines.length === 1) {
          outputHtml = `<p>${lines[0]}</p>`;
        } else {
          const lis = lines.map((l) => `<li>${l}</li>`).join('');
          outputHtml = `<ul>${lis}</ul>`;
        }
      }
    }

    // === Custom formatting ===
    // 1. Turn "• Detailed Summary with Key Points" → <h1>
    outputHtml = outputHtml.replace(/(?:<p>)?•?\s*Detailed Summary with Key Points\s*(?:<\/p>)?/gi,
      '<h3>Detailed Summary with Key Points</h3>'
    );

    // 2. Ensure paragraph spacing
    outputHtml = outputHtml.replace(/<p>/g, '<p style="margin-bottom:16px;">');

    return DOMPurify.sanitize(outputHtml);
  };

  // Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`${BASE_API_URL}/articles/${id}`);
        const processedData = {
          ...data,
          authors: data.authors?.trim() || 'N/A',
        };
        const normalizedHtml = normalizeToHtml(processedData.summary || '');
        processedData.summary = normalizedHtml;
        setArticle(processedData);
        setEditorContent(normalizedHtml);
        setPdfProcessed(Boolean(data.file_name));
      } catch (err) {
        setError(
          err.response?.status === 404
            ? 'Article not found.'
            : 'Failed to load article details.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Fetch images for this article
  useEffect(() => {
    if (!id) return;
    async function fetchImages() {
      try {
        const token = user?.token || localStorage.getItem('token');
        const { data } = await api.get(`${BASE_API_URL}/upload/pdf_images/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(data.images)) {
          setPdfImages(data.images);
        } else {
          setPdfImages([]);
        }
      } catch (err) {
        setPdfImages([]);
      }
    }
    fetchImages();
  }, [id, article?.file_name, user?.token]);

  // Handle file uploads
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadStatus('Please select a PDF file.');
      return;
    }
    setUploading(true);
    setUploadStatus('Uploading and processing...');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const token = user?.token || localStorage.getItem('token');
      if (!token) {
        setUploadStatus('Upload error: No authentication token found. Please login.');
        setUploading(false);
        return;
      }

      const response = await fetch(`${BASE_API_URL}/upload/pdf?id=${id}`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus('Upload and processing successful.');
        setPdfProcessed(true);

        if (data.summary) {
          const normalizedHtml = normalizeToHtml(data.summary);
          setArticle((prev) => ({
            ...prev,
            summary: normalizedHtml,
            file_name: data.filename || prev.file_name,
            hashtags: data.hashtags || prev.hashtags,
          }));
          setEditorContent(normalizedHtml);
        } else {
          setArticle((prev) => ({
            ...prev,
            file_name: data.filename || prev.file_name,
          }));
        }
        // Re-fetch images after upload
        if (data.filename) {
          setTimeout(() => {
            if (id) {
              api.get(`${BASE_API_URL}/upload/pdf_images/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              }).then(({data}) => {
                if (Array.isArray(data.images)) setPdfImages(data.images);
              });
            }
          }, 1000);
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
  };

  // Save summary
  const handleSaveSummary = async () => {
    if (!editorContent || editorContent.trim() === '' || editorContent === '<p><br></p>') {
      setSaveStatus('Failed to save summary: Content cannot be empty');
      return;
    }
    try {
      const contentToSave = SEND_PLAIN_TEXT
        ? htmlToText(editorContent, { wordwrap: false })
        : editorContent;
      const updateData = {
        title: article.title,
        url: article.url,
        doi: article.doi || '',
        authors: article.authors || '',
        summary: contentToSave,
      };
      await api.put(`${BASE_API_URL}/articles/${id}`, updateData);

      const normalizedHtml = normalizeToHtml(contentToSave);
      setArticle((prev) => ({ ...prev, summary: normalizedHtml }));
      setEditorContent(normalizedHtml);
      setIsEditing(false);
      setSaveStatus('Summary saved successfully.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      const errorMessage =
        error.response?.status === 404
          ? 'Article not found. Please check if the article ID is valid.'
          : `Failed to save summary: ${error.response?.data?.error || error.message}`;
      setSaveStatus(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditorContent(article?.summary || '');
    setSaveStatus(null);
  };

  const handleShowPdf = () => {
    if (pdfRef.current) {
      pdfRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShowImages = () => {
    if (imagesRef.current) {
      imagesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLightboxOpen = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '24px 0 16px 0', color: '#2c3e50' }} {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '22px 0 12px 0', color: '#2c3e50' }} {...props} />
    ),
    p: ({ node, ...props }) => (
      <p style={{ margin: '0 0 16px 0', color: '#23272f' }} {...props} />
    ),
    li: ({ node, ...props }) => <li style={{ marginBottom: 6 }} {...props} />,
  };

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
    mainSummary = lines.slice(0, hashtagStartIndex).join('\n').trim();
    hashtags = lines.slice(hashtagStartIndex).join(' ').trim();
  }

  const noSummaryGenerated =
    (!article?.file_name || !pdfProcessed) &&
    (!mainSummary || mainSummary === '<p></p>' || mainSummary === '<p><br></p>');

  // Determine button label
  const uploadBtnLabel = uploading
    ? 'Uploading...'
    : article?.file_name && pdfProcessed
      ? 'Process New PDF'
      : 'Upload PDF';

  // The PDF URL to show
  const pdfUrl = article?.file_name
    ? `${BASE_API_URL}/uploads/${article.file_name}`
    : null;

  // PDF error handling callback
  const handlePdfError = (err) => {
    setPdfError(err?.message || String(err));
  };

  if (loading) return <div className="articledetails-loading">Loading...</div>;
  if (error) return <div className="articledetails-error">{error}</div>;
  if (!article) return <div className="articledetails-loading">Article not found.</div>;

  const imageBaseUrl = `${BASE_API_URL}/images/`;

  return (
    <div className="articledetails-app" style={{ background: gradients.app }}>
      <div className="articledetails-centerbox">
        <div className="articledetails-toprow">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={handleShowPdf} className="articledetails-navbtn">
              Show PDF
            </button>
            <button onClick={handleShowImages} className="articledetails-navbtn">
              Show Images from PDF
            </button>
          </div>
          <button onClick={() => nav(-1)} className="articledetails-backbtn">
            ← Back
          </button>
        </div>
        <div className="articledetails-card">
          <h1 className="articledetails-title">{article.title}</h1>
          <div className="articledetails-info">
            <div><span className="articledetails-label">Authors:</span> {article.authors || '-'}</div>
            <div><span className="articledetails-label">DOI:</span> {article.doi || '-'}</div>
            <div>
              <span className="articledetails-label">URL:</span>{' '}
              {article.url ? (
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="articledetails-link">
                  {article.url}
                </a>
              ) : '-'}
            </div>
          </div>

          <div className="articledetails-summarybox">
            <div className="articledetails-summaryheader">
              <h3 className="articledetails-summarytitle">Summary</h3>
              <button className="articledetails-editbtn articledetails-editbtn-right" onClick={() => setIsEditing(true)}>
                Edit Summary
              </button>
            </div>

            {isEditing ? (
              <div className="articledetails-editorbox">
                <ReactQuill value={editorContent} onChange={setEditorContent} modules={modules} formats={formats} theme="snow" />
                <div className="articledetails-editactions">
                  <button className="articledetails-savebtn" onClick={handleSaveSummary}>Save</button>
                  <button className="articledetails-cancelbtn" onClick={handleCancelEdit}>Cancel</button>
                </div>
                {saveStatus && <p className={`articledetails-savestatus ${saveStatus.startsWith('Summary saved') ? 'success' : 'error'}`}>{saveStatus}</p>}
              </div>
            ) : (
              <div className="articledetails-markdown">
                {noSummaryGenerated ? (
                  <div style={{ fontWeight: 600, padding: '20px 0', fontSize: '1.2rem' }}>No Summary Generated!</div>
                ) : looksLikeHTML(mainSummary) ? (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mainSummary) }} />
                ) : (
                  <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                    {mainSummary}
                  </ReactMarkdown>
                )}
              </div>
            )}

            {hashtags && (
              <div className="articledetails-hashtagsbox">
                <h4 className="articledetails-hashtagsheader">Hashtags</h4>
                <div className="articledetails-hashtags">
                  {hashtags.split(' ').map((tag) => (
                    <span key={tag} className="articledetails-hashtag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div ref={pdfRef} className="articledetails-pdfbox">
              <button
                className="articledetails-uploadbtn articledetails-uploadbtn-left"
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
              >
                {uploadBtnLabel}
              </button>
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

              <button
                onClick={handleShowImages}
                className="articledetails-navbtn articledetails-above-pdf-btn"
                style={{ marginBottom: 10 }}
              >
                Show Images from PDF
              </button>
              {/* PDF Viewer -- scrollable, fixed size, one page at a time */}
              <div
                  style={{
                    margin: '20px 0',
                    height: '900px',
                    maxHeight: '90vh',
                    width: '700px',
                    maxWidth: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    border: pdfUrl ? "1px solid #eee" : "none",
                    boxSizing: 'border-box',
                    background: "#fafafa",
                    scrollSnapType: 'y mandatory',
                  }}
                >
                  {pdfUrl ? (
                    <Document
                      key={pdfUrl}
                      file={pdfUrl}
                      onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setPdfError(null);
                      }}
                      loading={<div>Loading PDF...</div>}
                      error={handlePdfError}
                    >
                      {numPages &&
                        Array.from({ length: numPages }, (_, index) => (
                          <div
                            key={index}
                            style={{
                              scrollSnapAlign: 'start',
                              minHeight: '900px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderBottom: '1px solid #eee',
                              background: "#fff",
                            }}
                          >
                            <Page
                              pageNumber={index + 1}
                              width={650}
                            />
                          </div>
                        ))}
                    </Document>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '40px 0' }}>
                      No PDF uploaded yet.
                    </div>
                  )}
                  {pdfError && (
                    <div style={{ color: "#900", textAlign: "center", padding: "8px" }}>
                      Failed to load PDF: {pdfError}
                    </div>
                  )}
                </div>
            </div>

            <div ref={imagesRef} className="articledetails-images-section">
              <h3 style={{ margin: "24px 0 10px 0" }}>Extracted Images from PDF</h3>
              <div className="articledetails-images-thumbs">
                {pdfImages.length === 0 ? (
                  <div style={{ color: "#888", fontStyle: "italic", padding: "20px 0" }}>
                    No images extracted for this article.
                  </div>
                ) : (
                  pdfImages.map((img, idx) => (
                    <div
                      className="articledetails-image-thumb"
                      key={img}
                      onClick={() => handleLightboxOpen(idx)}
                      tabIndex={0}
                      style={{ outline: lightboxOpen && lightboxIndex === idx ? '2px solid #0099ff' : 'none' }}
                    >
                      <img
                        src={imageBaseUrl + img}
                        alt={`Extracted ${idx + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))
                )}
              </div>
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={pdfImages.map(img => ({
                  src: imageBaseUrl + img,
                  alt: `Extracted image ${img}`,
                }))}
                plugins={[Thumbnails]}
                index={lightboxIndex}
                on={{
                  view: ({ index }) => setLightboxIndex(index)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}