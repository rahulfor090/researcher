import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function SummaryModal({ summary, onClose, onViewDetails }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalPanelWrapStyle}>
        <div style={modalHeaderStyle}>
          <div style={badgeStyle}>✨ Insight Ready</div>
          <button aria-label="Close" onClick={onClose} style={iconCloseButtonStyle}>✖</button>
        </div>

        <div style={modalBodyStyle}>
          <h3 style={titleStyle}>Article Summary</h3>
          <div style={metaRowStyle}>
            <span style={metaPillStyle}>AI-generated</span>
            <span style={metaDotStyle}>•</span>
            <span style={metaPillStyle}>Preview</span>
          </div>
          <div style={summaryCardStyle}>
            {summary ? (
              <div style={markdownWrapStyle}>
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div style={emptyStateStyle}>No summary available yet. Try opening details to refresh.</div>
            )}
          </div>
        </div>

        <div style={buttonBarStyle}>
          {onViewDetails && (
            <button onClick={onViewDetails} style={primaryButtonStyle}>View full insights →</button>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} style={secondaryButtonStyle}>{copied ? 'Copied ✓' : 'Copy summary'}</button>
            <button onClick={onClose} style={ghostButtonStyle}>Close</button>
          </div>
        </div>

      </div>
    </div>
  );
}

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

const modalPanelWrapStyle = {
  background: 'linear-gradient(180deg, #ffffff, #f8fafc)',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  width: '760px',
  maxWidth: '92%',
  overflow: 'hidden',
  border: '1px solid #e5e7eb'
};

const modalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
  color: 'white'
};

const badgeStyle = {
  fontSize: '0.85rem',
  fontWeight: 700,
  letterSpacing: '0.02em'
};

const iconCloseButtonStyle = {
  background: 'rgba(255,255,255,0.15)',
  color: 'white',
  border: 'none',
  width: 32,
  height: 32,
  borderRadius: 8,
  cursor: 'pointer'
};

const modalBodyStyle = {
  padding: '20px 20px 0 20px'
};

const titleStyle = {
  margin: 0,
  marginBottom: 8,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#111827'
};

const metaRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#6b7280',
  marginBottom: 12
};

const metaPillStyle = {
  fontSize: '0.8rem'
};

const metaDotStyle = { opacity: 0.6 };

const summaryCardStyle = {
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 16,
  maxHeight: 420,
  overflowY: 'auto'
};

const markdownWrapStyle = {
  color: '#374151',
  fontSize: '1.02rem',
  lineHeight: 1.7
};

const emptyStateStyle = {
  color: '#6b7280',
  fontStyle: 'italic'
};

const buttonBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px 20px 20px'
};

const closeButtonStyle = {
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: 'none',
  fontSize: '1rem',
  backgroundColor: '#f3f4f6',
  color: '#4b5563',
  transition: 'background-color 0.2s',
  fontWeight: '500',
};

const primaryButtonStyle = {
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: 'none',
  fontSize: '0.95rem',
  backgroundColor: '#0ea5e9',
  color: 'white',
  fontWeight: 600,
  marginRight: '8px'
};

const secondaryButtonStyle = {
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: '1px solid #e5e7eb',
  fontSize: '0.95rem',
  backgroundColor: '#ffffff',
  color: '#111827',
  fontWeight: 600
};

const ghostButtonStyle = {
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: 'none',
  fontSize: '0.95rem',
  backgroundColor: 'transparent',
  color: '#6b7280',
  fontWeight: 600
};
