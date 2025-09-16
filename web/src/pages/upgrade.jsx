import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Upgrade() {
  const nav = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative min-h-screen bg-green-50">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-6">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 bg-green-100 hover:bg-green-200 border border-green-200 px-3 py-2 rounded-xl transition"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Pitch + Features */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-green-900">Upgrade to <span className="text-orange-500">Research Plus</span></h1>
              <p className="text-green-800 text-lg">Unlock premium features to take your research to the next level.</p>
            </div>

            <div className="space-y-6">
              {[
                { icon: 'all_inclusive', title: 'Unlimited article & PDF storage', desc: 'Never worry about hitting a storage limit again.' },
                { icon: 'bolt', title: 'Advanced tagging + blazing-fast search', desc: 'Find exactly what you need in an instant.' },
                { icon: 'psychology', title: 'AI-generated summaries & insights', desc: 'Let AI do the heavy lifting of summarization.' },
                { icon: 'public', title: 'Clean imports from web', desc: 'Import articles without the clutter of ads and popups.' },
                { icon: 'support_agent', title: 'Priority human support', desc: 'Get your questions answered by a real person, fast.' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-full bg-green-200 text-green-600 shrink-0 h-10 w-10 mt-1">
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-green-900">{f.title}</h3>
                    <p className="text-green-700">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pricing + Pay + Trust + FAQ */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col">
            <div className="flex-1">
              <div className="text-center mb-6">
                <p className="text-5xl font-bold tracking-tight text-green-900">$9<span className="text-xl font-medium text-slate-500">/year</span></p>
              </div>
              <button
                onClick={() => nav('/premium-payment')}
                className="w-full h-12 px-5 bg-orange-500 text-white rounded-md font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/50"
              >
                Upgrade Now
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="material-symbols-outlined text-green-600">verified</span>
                <span className="text-slate-600 text-sm">Secure payments</span>
              </div>

              <div className="border-t my-8 border-slate-200"></div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-900">Payment Options</h3>
                <div className="flex items-center gap-4 rounded-md border p-4 border-slate-200">
                  <div className="bg-center bg-no-repeat bg-contain h-6 w-10 shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoZaXW2LZnDtEb4TU2KxUZaB7Fr4hXg-paY2daL-dIYhHZPltcCIoZZYeZHOEikimU7yus2yzrmJRPspkXcYYn-lbPuURmkzKsP39wNLlJ2rvkXoHiySpAPXorz_ZU8PlQMc3R4WENz1kcFCs0ltFJ1dgVMcsDf1UC2ZGMUkmh4UIjqFxSglePT18CgsiQdQcdSRJ-ZW5iwPA-xWJkBULqSMGmSVMEHtQcvFEy3ep0CSF8agmRcuPINecCeOlcC9pJjRaO6kVuu0QV")' }}></div>
                  <p className="text-slate-800 font-medium flex-1 truncate">PayPal</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-green-900">Trust Indicators</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="material-symbols-outlined text-lg text-green-600">bolt</span>
                    <span>Instant activation</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="material-symbols-outlined text-lg text-green-600">cancel</span>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="material-symbols-outlined text-lg text-green-600">groups</span>
                    <span>1000+ users</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 text-green-900">FAQ</h3>
              <div className="space-y-3">
                {[
                  { q: 'How long does my subscription last?', a: 'Your subscription lasts for one year from the date of purchase.' },
                  { q: 'How do I cancel my subscription?', a: 'You can cancel any time from your account settings. Your Plus access continues until the end of the billing period.' },
                ].map((f, idx) => (
                  <details key={f.q} className="group">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-700 list-none">
                      {f.q}
                      <span className="material-symbols-outlined transform transition-transform group-open:rotate-180 text-green-600">expand_more</span>
                    </summary>
                    <p className="text-slate-500 text-sm mt-2">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}