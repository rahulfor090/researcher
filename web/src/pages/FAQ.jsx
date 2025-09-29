import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, gradients, typography, cardStyle, primaryButtonStyle, shadows } from '../theme';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [query, setQuery] = useState('');
  const nav = useNavigate();
  const faqs = [
    { q: 'What is ResearchLocker?', a: 'ResearchLocker helps you save, organize, and search academic articles and PDFs with AI summaries.' },
    { q: 'Is there a free plan?', a: 'Yes. You can save up to 10 articles on the free plan. Upgrade anytime for unlimited storage.' },
    { q: 'How do I import articles?', a: 'Use our Chrome extension or add items manually with title, DOI, and authors.' },
    { q: 'Can I upload PDFs?', a: 'Yes. Upload PDFs to generate AI-powered summaries and make articles searchable.' },
    { q: 'How do AI summaries work?', a: 'We securely process uploaded PDFs to extract text and generate concise, helpful summaries.' },
    { q: 'How do I upgrade?', a: 'Visit the Upgrade page and complete payment. Your plan updates instantly.' },
    { q: 'Can I cancel anytime?', a: 'Yes, you can manage your plan from Settings and cancel at any time.' },
    { q: 'Is my data secure?', a: 'We use HTTPS everywhere, secure storage, and never sell your data.' },
  ];

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(item =>
      item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  return (
    <div
      className={`relative min-h-screen overflow-hidden pt-24 pb-16 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{
        background: gradients.app
      }}
    >
      {/* Soft decorative accents to match site theme */}
      <div
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 z-0"
        style={{ background: colors.accent }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 z-0"
        style={{ background: colors.link }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => nav('/')}
            style={{
              ...typography.buttonSmall,
              color: 'white',
              background: colors.link,
              border: 'none',
              padding: '8px 12px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              boxShadow: shadows.soft,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.highlight; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = colors.link; }}
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="flex-1" />
        </div>
        <div className="text-center mb-10">
          <span
            className="inline-block mb-3"
            style={{
              ...typography.caption,
              padding: '6px 10px',
              borderRadius: '9999px',
              background: `${colors.link}1A`,
              color: colors.link,
              fontWeight: typography.semibold
            }}
          >
            Help Center
          </span>
          <h1
            className="leading-tight"
            style={{
              ...typography.heading1,
              color: colors.primaryText
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ ...typography.body, color: colors.secondaryText, marginTop: '12px' }}>
            Find quick answers or search for a topic below.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.secondaryText }}>🔎</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full"
              style={{
                ...typography.body,
                padding: '12px 16px 12px 40px',
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                background: colors.cardBackground,
                boxShadow: shadows.soft,
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = colors.link; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = colors.border; }}
            />
          </div>
          {query && (
            <div style={{ ...typography.caption, color: colors.secondaryText, marginTop: '8px' }}>{filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for “{query}”.</div>
          )}
        </div>

        {/* FAQ List */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredFaqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={f.q}
                className="transition overflow-hidden"
                style={{
                  ...cardStyle,
                  border: `1px solid ${colors.border}`
                }}
              >
                <button
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: '14px 18px' }}
                  onClick={() => setOpen(isOpen ? null : idx)}
                >
                  <span className="pr-4" style={{ ...typography.body, fontWeight: typography.semibold, color: colors.primaryText }}>{f.q}</span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition"
                    style={{ background: isOpen ? colors.link : colors.accent }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    className="leading-relaxed"
                    style={{ padding: '0 18px 18px 18px', color: colors.secondaryText, ...typography.body }}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still need help */}
        <div className="mt-12 text-center">
          <div
            className="inline-flex items-center gap-3"
            style={{
              ...cardStyle,
              border: `1px solid ${colors.border}`,
              padding: '16px 20px'
            }}
          >
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <div style={{ ...typography.body, fontWeight: typography.semibold, color: colors.primaryText }}>Still need help?</div>
              <div style={{ ...typography.caption, color: colors.secondaryText }}>Reach out to our team for support.</div>
            </div>
            <a
              href="mailto:support@researchlocker.co"
              className="ml-4 inline-flex items-center justify-center"
              style={{
                ...typography.buttonSmall,
                ...primaryButtonStyle,
                padding: '8px 12px',
                borderRadius: '12px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.highlight; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = colors.link; }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Minimal keyframes consistent with Home */}
      <style>
        {`
          .animate-blob { animation: blob 8s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(20px, -20px) scale(1.05); }
            66% { transform: translate(-10px, 10px) scale(0.98); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
        `}
      </style>
    </div>
  );
}


