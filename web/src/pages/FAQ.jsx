import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className={`relative min-h-screen bg-gray-50 overflow-hidden pt-24 pb-16 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Decorative background to match theme */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50 z-0"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 z-0"></div>
      <div className="bg-blob bg-blob--1"></div>
      <div className="bg-blob bg-blob--2"></div>
      <div className="bg-blob bg-blob--3"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => nav('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="flex-1" />
        </div>
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700 mb-3">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-3">Find quick answers or search for a topic below.</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
          {query && (
            <div className="text-sm text-gray-500 mt-2">{filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for “{query}”.</div>
          )}
        </div>

        {/* FAQ List */}
        <div className="grid md:grid-cols-2 gap-5">
          {filteredFaqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={f.q}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between text-left px-5 py-4"
                  onClick={() => setOpen(isOpen ? null : idx)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{f.q}</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition ${isOpen ? 'bg-teal-600' : 'bg-indigo-500'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-gray-700 border-t border-gray-100 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still need help */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Still need help?</div>
              <div className="text-gray-600 text-sm">Reach out to our team for support.</div>
            </div>
            <a href="mailto:support@researchlocker.co" className="ml-4 inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Minimal keyframes used on Home as well */}
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


