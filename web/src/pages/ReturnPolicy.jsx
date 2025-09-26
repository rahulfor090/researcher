import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ReturnPolicy() {
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/40 bg-white px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 transition"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
        
        
      </div>

      <header className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 p-[1px] shadow">
        <div className="rounded-2xl bg-white/95 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                Customer Happiness First
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Return & Refund Policy</h1>
              <p className="mt-2 text-gray-600 max-w-2xl">
                We want you to love ResearchLocker. If something isn’t right, here’s how returns and refunds work.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Eligibility</h2>
          <p className="mt-2 text-gray-600">
            Refunds are available for first-time purchases of paid plans made through the platform within 14 days of the transaction,
            provided that substantial use has not occurred. Abuse, excessive downloads, or violation of our Terms may void eligibility.
          </p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">What’s covered</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-600 space-y-1">
              <li>Accidental duplicate purchases</li>
              <li>Technical issues preventing access after reasonable troubleshooting</li>
              <li>Misleading or incorrect plan application due to our error</li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">What’s not covered</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-600 space-y-1">
              <li>Change of mind after significant usage</li>
              <li>Policy abuse or violations of our Terms</li>
              <li>Third‑party fees outside our control</li>
            </ul>
          </div>
        </div>

        <aside className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="text-base font-semibold text-emerald-900">Quick summary</h3>
          <ul className="mt-3 space-y-2 text-emerald-800 text-sm">
            <li>Refund window: <span className="font-medium">14 days</span></li>
            <li>Decision time: <span className="font-medium">3–5 business days</span></li>
            <li>Method: original form of payment</li>
          </ul>
        </aside>
      </section>

      <section className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">How to request a refund</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>Go to Settings → Billing in your account.</li>
            <li>Select the relevant transaction and choose “Request refund”.</li>
            <li>Provide a brief description of the issue for faster review.</li>
          </ol>
          <p className="mt-3 text-gray-600 text-sm">If you can’t access your account, email us from your purchase email.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Processing and timelines</h2>
          <p className="mt-2 text-gray-600">
            We review requests within 3–5 business days. Approved refunds are issued to the original payment method.
            Your bank or provider may take additional time to post funds.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Subscriptions and cancellations</h2>
        <p className="mt-2 text-gray-600">
          You can cancel at any time to stop future charges. Cancellation takes effect at the end of the current billing period.
          We generally do not offer pro‑rated refunds for partial periods unless required by law or stated otherwise.
        </p>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Purchases via PayPal</h2>
        <p className="mt-2 text-gray-600">
          If you paid with PayPal, refunds are processed through PayPal’s systems. We’ll initiate the refund on approval; posting times depend on PayPal and your funding source.
        </p>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        <p className="mt-2 text-gray-600">We’re here to help. Reach us at
          <a className="text-indigo-600 hover:text-indigo-500 ml-1" href="mailto:support@researchlocker.com">support@researchlocker.com</a>.
        </p>
      </section>

      <p className="relative z-10 mt-8 text-xs text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
    </div>
  );
}


