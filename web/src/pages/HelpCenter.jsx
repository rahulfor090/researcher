import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../theme';

export default function HelpCenter() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden pt-24 pb-16 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ background: 'linear-gradient(180deg, #fefcf3 0%, #f5f1e8 100%)' }}>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl transition"
            style={{ background: colors.cardBackground, color: colors.link, border: `1px solid ${colors.border}` }}
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="flex-1" />
        </div>

        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3" style={{ background: `${colors.link}1A`, color: colors.link }}>Help Center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: colors.primaryText }}>How can we help?</h1>
          <p className="mt-3" style={{ color: colors.secondaryText }}>Search FAQs, contact support, or explore quick links.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/faq" className="group rounded-2xl p-6 shadow-sm hover:shadow-md transition" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
            <div className="text-2xl mb-3">📚</div>
            <div className="font-semibold" style={{ color: colors.primaryText }}>Browse FAQs</div>
            <div className="text-sm mt-1" style={{ color: colors.secondaryText }}>Find answers to common questions.</div>
            <div className="mt-4 text-sm font-medium" style={{ color: colors.link }}>View FAQs →</div>
          </Link>

          <a href="mailto:support@researchlocker.com" className="group rounded-2xl p-6 shadow-sm hover:shadow-md transition" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
            <div className="text-2xl mb-3">✉️</div>
            <div className="font-semibold" style={{ color: colors.primaryText }}>Email Support</div>
            <div className="text-sm mt-1" style={{ color: colors.secondaryText }}>Get help from our team.</div>
            <div className="mt-4 text-sm font-medium" style={{ color: colors.link }}>support@researchlocker.com →</div>
          </a>

          <Link to="/upgrade" className="group rounded-2xl p-6 shadow-sm hover:shadow-md transition" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
            <div className="text-2xl mb-3">💳</div>
            <div className="font-semibold" style={{ color: colors.primaryText }}>Billing & Plans</div>
            <div className="text-sm mt-1" style={{ color: colors.secondaryText }}>Manage subscription and payments.</div>
            <div className="mt-4 text-sm font-medium" style={{ color: colors.link }}>Go to Upgrade →</div>
          </Link>
        </div>

        {/* Contact box */}
        <div className="mt-10 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold" style={{ color: colors.primaryText }}>Still need help?</div>
              <div className="text-sm" style={{ color: colors.secondaryText }}>We usually reply within 1–2 business days.</div>
            </div>
            <a href="mailto:support@researchlocker.com" className="inline-flex items-center justify-center text-white px-4 py-2 rounded-xl text-sm font-semibold transition" style={{ background: colors.link }}>
              Contact Support
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-center" style={{ color: colors.secondaryText }}>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}


