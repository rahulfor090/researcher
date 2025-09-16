import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HelpCenter() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className={`relative min-h-screen bg-gray-50 overflow-hidden pt-24 pb-16 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50 z-0"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob z-0"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 z-0"></div>
      <div className="bg-blob bg-blob--1"></div>
      <div className="bg-blob bg-blob--2"></div>
      <div className="bg-blob bg-blob--3"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="flex-1" />
        </div>

        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700 mb-3">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">How can we help?</h1>
          <p className="text-gray-600 mt-3">Search FAQs, contact support, or explore quick links.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/faq" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-3">📚</div>
            <div className="font-semibold text-gray-900">Browse FAQs</div>
            <div className="text-sm text-gray-600 mt-1">Find answers to common questions.</div>
            <div className="mt-4 text-indigo-600 group-hover:text-indigo-500 text-sm font-medium">View FAQs →</div>
          </Link>

          <a href="mailto:support@researchlocker.com" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-3">✉️</div>
            <div className="font-semibold text-gray-900">Email Support</div>
            <div className="text-sm text-gray-600 mt-1">Get help from our team.</div>
            <div className="mt-4 text-indigo-600 group-hover:text-indigo-500 text-sm font-medium">support@researchlocker.com →</div>
          </a>

          <Link to="/upgrade" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-3">💳</div>
            <div className="font-semibold text-gray-900">Billing & Plans</div>
            <div className="text-sm text-gray-600 mt-1">Manage subscription and payments.</div>
            <div className="mt-4 text-indigo-600 group-hover:text-indigo-500 text-sm font-medium">Go to Upgrade →</div>
          </Link>
        </div>

        {/* Contact box */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Still need help?</div>
              <div className="text-gray-600 text-sm">We usually reply within 1–2 business days.</div>
            </div>
            <a href="mailto:support@researchlocker.com" className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
              Contact Support
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400 text-center">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}


