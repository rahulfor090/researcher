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
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import './ArticleDetails.css';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './ArticleDetails.scss';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfError, setPdfError] = useState(null);
  const [scale, setScale] = useState(1.25); // Default 125%
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfContainerRef = useRef(null);
  const pdfScrollContainerRef = useRef(null);
  const pageRefs = useRef([]);

  // Image state
  const [pdfImages, setPdfImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageRotations, setImageRotations] = useState({});

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
    outputHtml = outputHtml.replace(/(?:<p>)?•?\s*Detailed Summary with Key Points\s*(?:<\/p>)?/gi,
      '<h3>Detailed Summary with Key Points</h3>'
    );
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

  // Rotate image function
  const rotateImage = (direction) => {
    const currentImageSrc = pdfImages[lightboxIndex];
    const currentRotation = imageRotations[currentImageSrc] || 0;
    const newRotation = direction === 'right' 
      ? (currentRotation + 90) % 360 
      : (currentRotation - 90 + 360) % 360;
    
    setImageRotations(prev => ({
      ...prev,
      [currentImageSrc]: newRotation
    }));
  };

  // Scroll to specific page
  const scrollToPage = (pageNum) => {
    const pageIndex = pageNum - 1;
    if (pageRefs.current[pageIndex]) {
      pageRefs.current[pageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // === PDF Navigation Controls ===
  const goToFirstPage = () => {
    setCurrentPage(1);
    scrollToPage(1);
  };

  const goToLastPage = () => {
    const lastPage = numPages || 1;
    setCurrentPage(lastPage);
    scrollToPage(lastPage);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < (numPages || 1)) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    scrollToPage(pageNum);
  };

  // Zoom controls
  const zoomIn = () => {
    setScale((prev) => {
      const newScale = Math.min(prev + 0.25, 3.0);
      return newScale;
    });
  };

  const zoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.25, 0.5);
      return newScale;
    });
  };

  const resetZoom = () => setScale(1.25); // Reset to 125%

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (pdfContainerRef.current?.requestFullscreen) {
        pdfContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Detect which page is currently visible - DISABLED to prevent conflicts
  // This was causing the page to reset when scrolling
  /*
  useEffect(() => {
    if (!pdfScrollContainerRef.current) return;

    const handleScroll = () => {
      if (!pdfScrollContainerRef.current) return;
      
      const container = pdfScrollContainerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const middleOfViewport = scrollTop + containerHeight / 2;

      // Find which page is in the middle of viewport
      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageElement = pageRefs.current[i];
        if (pageElement) {
          const pageTop = pageElement.offsetTop;
          const pageBottom = pageTop + pageElement.clientHeight;
          
          if (middleOfViewport >= pageTop && middleOfViewport <= pageBottom) {
            setCurrentPage(i + 1);
            break;
          }
        }
      }
    };

    const container = pdfScrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [numPages]);
  */

  // --- PPT Generate Handler ---
  const [pptStatus, setPptStatus] = useState('');
  const handleGeneratePPT = async () => {
    setPptStatus('Generating...');
    const token = user?.token || localStorage.getItem('token');
    if (!token) {
      setPptStatus('No authentication token found. Please login.');
      return;
    }
    try {
      const genRes = await fetch(`${BASE_API_URL}/ppt?id=${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!genRes.ok) {
        const genErr = await genRes.json();
        setPptStatus('Failed to generate PPT: ' + (genErr.error || 'Unknown error'));
        return;
      }
      setPptStatus('PPT generated and stored successfully!');
      setTimeout(() => setPptStatus(''), 2000);
    } catch (err) {
      setPptStatus('Error generating PPT: ' + err.message);
    }
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

  const uploadBtnLabel = uploading
    ? 'Uploading...'
    : article?.file_name && pdfProcessed
      ? 'Process New PDF'
      : 'Upload PDF';

  const pdfUrl = article?.file_name
    ? `${BASE_API_URL}/uploads/${article.file_name}`
    : null;

  const handlePdfError = (err) => {
    setPdfError(err?.message || String(err));
  };

  if (loading) return <div className="articledetails-loading">Loading...</div>;
  if (error) return <div className="articledetails-error">{error}</div>;
  if (!article) return <div className="articledetails-loading">Article not found.</div>;

  const imageBaseUrl = `${BASE_API_URL}/images/`;

  // Render all PDF pages for continuous scrolling
  const renderAllPages = () => {
    if (!numPages) return null;
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      pages.push(
        <div 
          key={i} 
          ref={(el) => (pageRefs.current[i - 1] = el)}
          style={{ marginBottom: i < numPages ? '20px' : '0' }}
        >
          <Page
            pageNumber={i}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </div>
      );
    }
    return pages;
  };

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

            <div ref={pdfRef} className="articledetails-pdfbox" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
                <button
                  className="articledetails-pptbtn"
                  type="button"
                  onClick={handleGeneratePPT}
                  disabled={uploading || !pdfProcessed}
                  style={{ minWidth: 120 }}
                  title="Generate PPT summary"
                >
                  Generate PPT
                </button>
                {pptStatus && (
                  <span style={{
                    color: pptStatus.toLowerCase().includes('fail') || pptStatus.toLowerCase().includes('error') ? '#a00' : '#008800',
                    fontWeight: 600,
                    fontSize: '1rem',
                    marginLeft: 12
                  }}>
                    {pptStatus}
                  </span>
                )}
              </div>

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

              {/* PDF Viewer with Control Bar Above */}
              <div ref={pdfContainerRef} style={{ margin: '20px 0' }}>
                {/* Control Bar - Above PDF */}
                {pdfUrl && (
                  <div
                    style={{
                      height: '56px',
                      background: 'linear-gradient(to bottom, rgba(50, 54, 57, 0.95) 0%, rgba(50, 54, 57, 0.85) 100%)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      borderRadius: '8px 8px 0 0',
                      border: '1px solid #333',
                      borderBottom: 'none',
                    }}
                  >
                    {/* Left Side - Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        title="First page"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: currentPage === 1 ? '#666' : '#fff',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== 1) e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        ⟪
                      </button>
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        title="Previous page"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: currentPage === 1 ? '#666' : '#fff',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== 1) e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        ◀
                      </button>
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === numPages}
                        title="Next page"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: currentPage === numPages ? '#666' : '#fff',
                          cursor: currentPage === numPages ? 'not-allowed' : 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== numPages) e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        ▶
                      </button>
                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === numPages}
                        title="Last page"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: currentPage === numPages ? '#666' : '#fff',
                          cursor: currentPage === numPages ? 'not-allowed' : 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== numPages) e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        ⟫
                      </button>
                    </div>

                    {/* Center - Page Info with Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#ccc', fontSize: '14px', fontWeight: 500 }}>
                        Page
                      </span>
                      <select
                        value={currentPage}
                        onChange={(e) => {
                          const newPage = parseInt(e.target.value, 10);
                          handlePageChange(newPage);
                        }}
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          border: '1px solid #555',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        {Array.from({ length: numPages || 1 }, (_, i) => i + 1).map((pageNum) => (
                          <option key={pageNum} value={pageNum} style={{ background: '#2c3e50', color: '#fff' }}>
                            {pageNum}
                          </option>
                        ))}
                      </select>
                      <span style={{ color: '#ccc', fontSize: '14px', fontWeight: 500 }}>
                        of {numPages || '?'}
                      </span>
                    </div>

                    {/* Right Side - Zoom & Fullscreen Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                        title="Zoom out"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: scale <= 0.5 ? '#666' : '#fff',
                          cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (scale > 0.5) e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        −
                      </button>
                      <span style={{ color: '#ccc', fontSize: '14px', fontWeight: 500, minWidth: '50px', textAlign: 'center' }}>
                        {Math.round(scale * 100)}%
                      </span>
                      <button
                        onClick={zoomIn}
                        disabled={scale >= 3.0}
                        title="Zoom in"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: scale >= 3.0 ? '#666' : '#fff',
                          cursor: scale >= 3.0 ? 'not-allowed' : 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (scale < 3.0) e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={resetZoom}
                        title="Reset zoom (125%)"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          fontSize: '14px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                          fontWeight: 500,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        Reset
                      </button>
                      <div style={{ width: '1px', height: '24px', background: '#555', margin: '0 4px' }} />
                      <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          fontSize: '18px',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        {isFullscreen ? '⛶' : '⛶'}
                      </button>
                    </div>
                  </div>
                )}

                {/* PDF Container - Scrollable with all pages */}
                <div
                  ref={pdfScrollContainerRef}
                  style={{
                    width: '100%',
                    height: isFullscreen ? '100vh' : '800px',
                    maxHeight: isFullscreen ? '100vh' : '800px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    border: pdfUrl ? "1px solid #333" : "none",
                    borderTop: pdfUrl ? "none" : "1px solid #333",
                    boxSizing: 'border-box',
                    background: "#525659",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: pdfUrl ? '0 0 8px 8px' : '8px',
                    padding: '20px',
                  }}
                >
                  {pdfUrl ? (
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={({ numPages }) => {
                        setNumPages(numPages);
                        setPdfError(null);
                      }}
                      loading={
                        <div style={{ color: '#fff', fontSize: '16px', padding: '40px' }}>
                          Loading PDF...
                        </div>
                      }
                      error={handlePdfError}
                    >
                      {renderAllPages()}
                    </Document>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '40px 0' }}>
                      No PDF uploaded yet.
                    </div>
                  )}
                </div>
                {pdfError && (
                  <div style={{ color: "#f88", textAlign: "center", padding: "8px", marginTop: '10px' }}>
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
                      style={{ 
                        outline: lightboxOpen && lightboxIndex === idx ? '2px solid #0099ff' : 'none',
                        cursor: 'pointer'
                      }}
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
                slides={pdfImages.map((img) => ({
                  src: imageBaseUrl + img,
                  alt: `Extracted image ${img}`,
                }))}
                plugins={[Thumbnails, Zoom, Fullscreen]}
                index={lightboxIndex}
                carousel={{
                  finite: true,
                  preload: 1,
                  padding: 0,
                  spacing: 0,
                  imageFit: "contain",
                }}
                zoom={{
                  maxZoomPixelRatio: 5,
                  zoomInMultiplier: 2,
                  doubleTapDelay: 300,
                  doubleClickDelay: 300,
                  doubleClickMaxStops: 2,
                  keyboardMoveDistance: 50,
                  wheelZoomDistanceFactor: 100,
                  pinchZoomDistanceFactor: 100,
                  scrollToZoom: true
                }}
                toolbar={{
                  buttons: [
                    <div key="rotate-controls" style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateImage('left');
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: '8px 14px',
                          fontSize: '20px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        title="Rotate left"
                      >
                        ↺
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateImage('right');
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: '8px 14px',
                          fontSize: '20px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        title="Rotate right"
                      >
                        ↻
                      </button>
                    </div>,
                    "close"
                  ]
                }}
                render={{
                  slideContainer: ({ children }) => {
                    const imgName = pdfImages[lightboxIndex];
                    const rotation = imageRotations[imgName] || 0;
                    
                    return (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: `rotate(${rotation}deg)`,
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {children}
                      </div>
                    );
                  },
                }}
                styles={{
                  container: { backgroundColor: "rgba(0, 0, 0, .9)" },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}