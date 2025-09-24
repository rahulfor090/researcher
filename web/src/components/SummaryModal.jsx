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
    <div style={modalOverlayStyle} role="dialog" aria-modal="true">
      <div style={modalPanelWrapStyle} className="summary-print-container">
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
              <div style={markdownWrapStyle} className="summary-md">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 style={mdH1} {...props} />,
                    h2: ({ node, ...props }) => <h2 style={mdH2} {...props} />,
                    h3: ({ node, ...props }) => <h3 style={mdH3} {...props} />,
                    h4: ({ node, ...props }) => <h4 style={mdH4} {...props} />,
                    p: ({ node, ...props }) => <p style={mdP} {...props} />,
                    ul: ({ node, ...props }) => <ul style={mdUl} {...props} />,
                    ol: ({ node, ...props }) => <ol style={mdOl} {...props} />,
                    li: ({ node, ordered, ...props }) => <li style={mdLi} {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote style={mdBlockquote} {...props} />,
                    code: ({ inline, children, ...props }) => (
                      inline
                        ? <code style={mdCodeInline} {...props}>{children}</code>
                        : <pre style={mdPre}><code>{children}</code></pre>
                    ),
                    hr: ({ node, ...props }) => <hr style={mdHr} {...props} />,
                    table: ({ node, ...props }) => <table style={mdTable} {...props} />,
                    thead: ({ node, ...props }) => <thead style={mdThead} {...props} />,
                    th: ({ node, ...props }) => <th style={mdTh} {...props} />,
                    td: ({ node, ...props }) => <td style={mdTd} {...props} />,
                    img: ({ node, ...props }) => <img style={mdImg} {...props} />,
                    a: ({ node, ...props }) => <a style={mdLink} target="_blank" rel="noopener noreferrer" {...props} />,
                  }}
                >
                  {summary}
                </ReactMarkdown>
                {/* Print styles to improve PDF layout */}
                <style>{`
                  @media print {
                    .summary-md { font-size: 12pt; line-height: 1.6; color: #111827; }
                    .summary-md h1, .summary-md h2, .summary-md h3, .summary-md h4 { page-break-after: avoid; break-after: avoid-page; }
                    .summary-md p, .summary-md ul, .summary-md ol, .summary-md table, .summary-md blockquote { page-break-inside: avoid; }
                    .summary-md table { width: 100%; border-collapse: collapse; }
                    .summary-md th, .summary-md td { border: 1px solid #e5e7eb; padding: 6pt; }
                    @page { margin: 18mm; }
                  }
                `}</style>
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
            <button onClick={() => window.print()} style={secondaryButtonStyle}>Download PDF</button>
            <button onClick={handleCopy} style={secondaryButtonStyle}>{copied ? 'Copied ✓' : 'Copy summary'}</button>
            <button onClick={onClose} style={ghostButtonStyle}>Close</button>
          </div>
        </div>

      </div>
      {/* Print isolation to make printed summary match the popup layout */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body * { visibility: hidden; }
          .summary-print-container, .summary-print-container * { visibility: visible; }
          .summary-print-container { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border-radius: 0 !important; border: none !important; max-height: none !important; }
          .summary-print-container .summary-md { font-size: 12pt; }
          @page { margin: 18mm; }
        }
      `}</style>
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
  width: 'min(760px, 92vw)',
  maxHeight: 'calc(100vh - 10vh)',
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
  maxHeight: 'min(60vh, 520px)',
  overflowY: 'auto'
};

const markdownWrapStyle = {
  color: '#374151',
  fontSize: '1.02rem',
  lineHeight: 1.7,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  WebkitHyphens: 'auto',
  msHyphens: 'auto',
  hyphens: 'auto'
};

// Markdown element styles
const mdH1 = { fontSize: '1.6rem', fontWeight: 800, margin: '0 0 12px 0', color: '#111827' };
const mdH2 = { fontSize: '1.35rem', fontWeight: 700, margin: '20px 0 10px 0', color: '#111827' };
const mdH3 = { fontSize: '1.15rem', fontWeight: 700, margin: '16px 0 8px 0', color: '#111827' };
const mdH4 = { fontSize: '1.05rem', fontWeight: 600, margin: '12px 0 6px 0', color: '#111827' };
const mdP = { margin: '0 0 10px 0' };
const mdUl = { margin: '0 0 10px 18px', padding: 0 };
const mdOl = { margin: '0 0 10px 18px', padding: 0 };
const mdLi = { margin: '4px 0' };
const mdBlockquote = { margin: '10px 0', padding: '8px 12px', background: '#f9fafb', borderLeft: '4px solid #e5e7eb', color: '#374151' };
const mdCodeInline = { background: '#1118270d', padding: '2px 6px', borderRadius: 6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: '0.92em' };
const mdPre = { background: '#0b10201a', padding: '12px', borderRadius: 8, overflowX: 'auto' };
const mdHr = { border: 0, borderTop: '1px solid #e5e7eb', margin: '16px 0' };
const mdTable = { width: '100%', borderCollapse: 'separate', borderSpacing: 0, margin: '8px 0', border: '1px solid #e5e7eb' };
const mdThead = { background: '#f9fafb' };
const mdTh = { textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5e7eb', fontWeight: 600, color: '#111827' };
const mdTd = { padding: '8px', borderBottom: '1px solid #f3f4f6', color: '#374151' };
const mdImg = { maxWidth: '100%', height: 'auto', borderRadius: 8 };
const mdLink = { color: '#0ea5e9', textDecoration: 'underline' };

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
