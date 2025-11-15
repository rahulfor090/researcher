import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Upgrade() {
  const nav = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 bg-white hover:bg-green-100 border border-green-300 px-3 py-2 rounded-xl transition shadow-sm"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">

          {/* LEFT SIDE — Pitch + Features */}
          <div className="flex flex-col justify-center">

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-green-900 leading-tight">
              Upgrade to <span className="text-orange-500">Research Plus</span>
            </h1>

            <p className="text-green-800 text-lg mb-10">
              Access premium tools that help you read, organize, and manage research faster than ever.
            </p>

            <div className="space-y-7">

              {[
                { icon: 'all_inclusive', title: 'Unlimited article & PDF storage', desc: 'Store everything securely with no limits — forever.' },
                { icon: 'bolt', title: 'Advanced tagging + ultra-fast search', desc: 'Instantly find articles using keywords, tags, or smart filters.' },
                { icon: 'psychology', title: 'AI summaries & insights', desc: 'Save hours with AI-powered summaries for every PDF.' },
                { icon: 'public', title: 'Clean imports from any website', desc: 'Import research without ads, clutter, or formatting issues.' },
                { icon: 'support_agent', title: 'Priority human support', desc: 'Get fast, personal support whenever you need help.' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-xl bg-green-100 text-green-600 shrink-0 h-12 w-12 shadow-inner">
                    <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-green-900">{f.title}</h3>
                    <p className="text-green-700 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* RIGHT SIDE — Pricing Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-8 flex flex-col">

            {/* Price */}
            <div className="text-center mb-8">
              <p className="text-6xl font-extrabold tracking-tight text-green-900">
                $9<span className="text-xl font-medium text-slate-500">/year</span>
              </p>
              <p className="text-slate-600 text-sm mt-1">One small upgrade = huge time savings</p>
            </div>

            {/* Button */}
            <button
              onClick={() => nav('/premium-payment')}
              className="w-full h-12 px-5 bg-orange-500 text-white rounded-md font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-400/40"
            >
              Upgrade Now
            </button>

            {/* Secure */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="material-symbols-outlined text-green-600">lock</span>
              <span className="text-slate-600 text-sm">Secure, encrypted payment</span>
            </div>

            {/* Divider */}
            <div className="border-t my-8 border-slate-200"></div>

            {/* Payment Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-900">Payment Options</h3>

              <div className="flex items-center gap-4 rounded-md border p-4 border-slate-200 hover:border-green-300 transition">
                <img
                  alt="PayPal"
                  className="h-6 w-auto"
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                />
                <p className="text-slate-800 font-medium">PayPal</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-green-900">Trusted By</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-green-600 text-lg">flash_on</span>
                  <span>Instant Activation</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-green-600 text-lg">cancel</span>
                  <span>Cancel Anytime</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-green-600 text-lg">verified_user</span>
                  <span>Secure & Private</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-green-600 text-lg">groups</span>
                  <span>1,000+ users</span>
                </div>

              </div>
            </div>

            {/* FAQ */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-4 text-green-900">FAQ</h3>

              <div className="space-y-3">

                {[
                  { q: 'How long does my subscription last?', a: 'Your subscription lasts for one full year from the date of purchase.' },
                  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel at any moment. Your Plus access stays active until the end of the billing cycle.' },
                ].map((f, idx) => (
                  <details key={idx} className="group bg-green-50 p-3 rounded-lg border border-green-100">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-green-800 list-none">
                      {f.q}
                      <span className="material-symbols-outlined transform transition-transform group-open:rotate-180 text-green-600">
                        expand_more
                      </span>
                    </summary>
                    <p className="text-slate-600 text-sm mt-2">{f.a}</p>
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
