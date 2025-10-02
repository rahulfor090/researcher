import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { colors } from '../theme';

export default function ReturnPolicy() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <div className={`relative min-h-screen overflow-hidden pt-24 pb-16 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ background: 'linear-gradient(180deg, #fefcf3 0%, #f5f1e8 100%)' }}>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          aria-label="Go back"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 transition"
            style={{ background: colors.cardBackground, color: colors.link, border: `1px solid ${colors.border}` }}
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>
        
        
      </div>

      <header className="rounded-2xl p-[1px] shadow" style={{ border: `1px solid ${colors.border}` }}>
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: colors.cardBackground }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1 mb-3" style={{ color: colors.link, background: `${colors.link}1A`, border: `1px solid ${colors.border}` }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors.link }}></span>
                Customer Happiness First
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.primaryText }}>Return & Refund Policy</h1>
              <p className="mt-2 max-w-2xl" style={{ color: colors.secondaryText }}>
                We want you to love Research Locker. If something isn’t right, here’s how returns and refunds work.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-semibold" style={{ color: colors.primaryText }}>Eligibility</h2>
          <p className="mt-2" style={{ color: colors.secondaryText }}>
            Refunds are available for first-time purchases of paid plans made through the platform within 14 days of the transaction,
            provided that substantial use has not occurred. Abuse, excessive downloads, or violation of our Terms may void eligibility.
          </p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold" style={{ color: colors.primaryText }}>What’s covered</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1" style={{ color: colors.secondaryText }}>
              <li>Accidental duplicate purchases</li>
              <li>Technical issues preventing access after reasonable troubleshooting</li>
              <li>Misleading or incorrect plan application due to our error</li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold" style={{ color: colors.primaryText }}>What’s not covered</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1" style={{ color: colors.secondaryText }}>
              <li>Change of mind after significant usage</li>
              <li>Policy abuse or violations of our Terms</li>
              <li>Third‑party fees outside our control</li>
            </ul>
          </div>
        </div>

        <aside className="rounded-2xl p-6" style={{ backgroundColor: `${colors.link}0D`, border: `1px solid ${colors.border}` }}>
          <h3 className="text-base font-semibold" style={{ color: colors.primaryText }}>Quick summary</h3>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: colors.secondaryText }}>
            <li>Refund window: <span className="font-medium">14 days</span></li>
            <li>Decision time: <span className="font-medium">3–5 business days</span></li>
            <li>Method: original form of payment</li>
          </ul>
        </aside>
      </section>

      <section className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-semibold" style={{ color: colors.primaryText }}>How to request a refund</h2>
          <ol className="mt-3 list-decimal pl-5 space-y-2" style={{ color: colors.secondaryText }}>
            <li>Go to Settings → Billing in your account.</li>
            <li>Select the relevant transaction and choose “Request refund”.</li>
            <li>Provide a brief description of the issue for faster review.</li>
          </ol>
          <p className="mt-3 text-sm" style={{ color: colors.secondaryText }}>If you can’t access your account, email us from your purchase email.</p>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-semibold" style={{ color: colors.primaryText }}>Processing and timelines</h2>
          <p className="mt-2" style={{ color: colors.secondaryText }}>
            We review requests within 3–5 business days. Approved refunds are issued to the original payment method.
            Your bank or provider may take additional time to post funds.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-semibold" style={{ color: colors.primaryText }}>Subscriptions and cancellations</h2>
        <p className="mt-2" style={{ color: colors.secondaryText }}>
          You can cancel at any time to stop future charges. Cancellation takes effect at the end of the current billing period.
          We generally do not offer pro‑rated refunds for partial periods unless required by law or stated otherwise.
        </p>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-semibold" style={{ color: colors.primaryText }}>Purchases via PayPal</h2>
        <p className="mt-2" style={{ color: colors.secondaryText }}>
          If you paid with PayPal, refunds are processed through PayPal’s systems. We’ll initiate the refund on approval; posting times depend on PayPal and your funding source.
        </p>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-semibold" style={{ color: colors.primaryText }}>Contact</h2>
        <p className="mt-2" style={{ color: colors.secondaryText }}>We’re here to help. Reach us at
          <a className="ml-1" style={{ color: colors.link }} href="mailto:support@researchlocker.com">support@researchlocker.com</a>.
        </p>
      </section>

      <p className="relative z-10 mt-8 text-xs" style={{ color: colors.secondaryText }}>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
    </div>
  );
}


