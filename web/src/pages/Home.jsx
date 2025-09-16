
import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import VideoSection from '../components/VideoSection';
// Navbar is provided by PublicLayout

const Home = () => {
  const { user } = useAuth();
  // Home landing page themed layout

  return (
    <div className="home-root min-h-screen bg-slate-50 flex flex-col items-center relative overflow-hidden pt-0" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial' }}>
      {/* Animated Background Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Subtle grid shimmer */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 0' }} />
        {/* Gradient glow layer */}
        <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30 animate-blob" style={{ background: 'radial-gradient( circle at 30% 30%, #7c3aed, transparent 60%)' }} />
        <div className="absolute -bottom-48 -right-40 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-25 animate-blob animation-delay-2000" style={{ background: 'radial-gradient( circle at 70% 70%, #0ea5e9, transparent 60%)' }} />
        <div className="absolute top-1/3 -right-24 h-[18rem] w-[18rem] rounded-full blur-2xl opacity-20 animate-blob animation-delay-4000" style={{ background: 'radial-gradient( circle at 50% 50%, #10b981, transparent 60%)' }} />
        {/* Rotating soft halo */}
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 h-[44rem] w-[44rem] rounded-full bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-2xl animate-spin-slower" />
      </div>

      {/* Hero Section */}
      <section
        className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-white w-full overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsBrdbjmAspPHH9WPu_WolfZCwXkrpTVm2jxLcvAGOeIN4yIaBq5wKEFi0hP8t1wDB5Rg7wfnbs4NnpXDZzH4SgXYBZxKQ0NThM-1O7aGLO-rQ7k4EjDhg0zjwgRCv8G5lH2IfMiloKtoV-GAH5hj1uDc0IPGC--RJuWa3jInVA4kpycysEyQEswIWdcrWAVBpzbpXx5LGeJeT4p7c7rcpii6vUnkHlgPy_6Mec6ttQvs1iPgGelMlDdRB_VGK0i_d9m6BetCcg-f9")' }}
      >
        {/* Top-left logo overlay */}
        <div className="absolute top-6 left-6 hidden sm:flex items-center gap-2">
          <img src="/upload/brand/research-locker-logo.png" alt="Research Locker" className="h-10 w-10 rounded-xl ring-1 ring-white/40 shadow-md object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="text-white/90 font-bold text-lg drop-shadow">Research Locker</span>
        </div>
        {/* Hero animated accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-2xl animate-float-slow" />
          <div className="absolute bottom-10 right-1/5 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-2xl animate-float-slower" />
          <div className="absolute top-1/3 right-1/3 h-40 w-40 rounded-full bg-emerald-400/20 blur-xl animate-tilt" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-br from-white via-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]">Accelerate Your Research Workflow</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-200">
            Streamline your research process with Research Locker. Save, organize, and access your research materials effortlessly, anytime, anywhere.
          </p>
          {user ? (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/dashboard" className="relative inline-flex min-w-[128px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-emerald-600 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] hover:bg-emerald-700 hover:shadow-[0_18px_40px_-12px_rgba(16,185,129,0.9)] transition-all">
                <span className="relative z-[1]">Go to Dashboard</span>
              </Link>
              <Link to="/library" className="inline-flex items-center justify-center rounded-xl h-12 px-6 border border-white/60 text-white/90 hover:text-white hover:bg-white/10 transition">
                Open Library
              </Link>
            </div>
          ) : (
            <Link to="/register" className="relative mt-8 inline-flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-7 bg-[#1173d4] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] shadow-[0_10px_30px_-10px_rgba(17,115,212,0.8)] hover:shadow-[0_18px_40px_-12px_rgba(17,115,212,0.9)] hover:bg-blue-700 transition-all">
              <span className="relative z-[1]">Get Started Free</span>
              <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </Link>
          )}
        </div>
      </section>

      {/* Value Props Sections */}
      <section className="py-16 sm:py-24 bg-white w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Never Lose a Valuable Insight Again</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
            Research Locker ensures that your research is always at your fingertips. With secure cloud storage and powerful organization tools, you can focus on your work, not on managing your resources.
          </p>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-slate-50 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Empowering Academics and Professionals</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
            Join a community of researchers who are transforming their workflows with Research Locker. Whether you're a student, academic, or professional, our platform is designed to meet your needs.
          </p>
          </div>
      </section>

      {/* Demo Video */}
      <section className="relative z-10 w-full bg-white py-14 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">See Research Locker in Action</h2>
            <p className="mt-3 text-slate-600">A quick walkthrough of saving, organizing, and accessing your research.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100">
            <VideoSection videoUrl="https://www.youtube.com/embed/3iMbMyKEDik" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white w-full" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600">A simple, intuitive process to revolutionize your research.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#1173d4] text-white mb-6 text-4xl">💾</div>
              <h3 className="text-xl font-bold mb-2">Save Articles Easily</h3>
              <p className="text-slate-600">Use our browser extension to save articles with a single click. No more manual downloads or messy folders.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#1173d4] text-white mb-6 text-4xl">🗂️</div>
              <h3 className="text-xl font-bold mb-2">Organize Smarter</h3>
              <p className="text-slate-600">Effortlessly organize your research with powerful tools that help you categorize, tag, and search your library.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-[#1173d4] text-white mb-6 text-4xl">📱</div>
              <h3 className="text-xl font-bold mb-2">Access Anywhere</h3>
              <p className="text-slate-600">Access your research library from any device, whether you're at your desk or on the go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-slate-50 w-full" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Powerful Features Designed for You</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Explore the features that make Research Locker the ultimate research management tool.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#1173d4]/10 blur-xl group-hover:scale-125 transition" />
              <span className="text-3xl text-[#1173d4] mt-1">📦</span>
            <div>
                <h3 className="text-lg font-bold">Free Article Storage</h3>
                <p className="text-slate-600 mt-1">Start with a free plan that includes ample storage for your research articles.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#1173d4]/10 blur-xl group-hover:scale-125 transition" />
              <span className="text-3xl text-[#1173d4] mt-1">☁️</span>
              <div>
                <h3 className="text-lg font-bold">Secure Cloud Storage</h3>
                <p className="text-slate-600 mt-1">Your research is stored securely in the cloud, ensuring it's always safe and accessible.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#1173d4]/10 blur-xl group-hover:scale-125 transition" />
              <span className="text-3xl text-[#1173d4] mt-1">🖱️</span>
              <div>
                <h3 className="text-lg font-bold">One-Click Saving</h3>
                <p className="text-slate-600 mt-1">Save articles directly from your browser with our easy-to-use extension.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#1173d4]/10 blur-xl group-hover:scale-125 transition" />
              <span className="text-3xl text-[#1173d4] mt-1">🔎</span>
              <div>
                <h3 className="text-lg font-bold">Advanced Search & Filters</h3>
                <p className="text-slate-600 mt-1">Quickly find articles with powerful search and filtering options.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#1173d4]/10 blur-xl group-hover:scale-125 transition" />
              <span className="text-3xl text-[#1173d4] mt-1">♾️</span>
              <div>
                <h3 className="text-lg font-bold">Unlimited Storage Plans</h3>
                <p className="text-slate-600 mt-1">Upgrade to unlimited storage to save as many articles as you need.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#1173d4]/10 blur-xl group-hover:scale-125 transition" />
              <span className="text-3xl text-[#1173d4] mt-1">📚</span>
              <div>
                <h3 className="text-lg font-bold">Personal Research Library</h3>
                <p className="text-slate-600 mt-1">Build a comprehensive library of your research materials, organized and accessible.</p>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24 bg-white w-full" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pro Membership</h2>
            <p className="mt-4 text-lg text-slate-600">Unlock everything with one simple plan.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col gap-6 rounded-lg border-2 border-[#1173d4] p-8 relative">
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="bg-[#1173d4] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="mt-2 text-4xl font-extrabold">$9<span className="text-lg font-medium text-slate-500">/month</span></p>
                <p className="mt-2 text-sm text-slate-500">For serious researchers</p>
              </div>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3">✅ Unlimited Articles</li>
                <li className="flex items-center gap-3">✅ Advanced Organization</li>
                <li className="flex items-center gap-3">✅ Priority Support</li>
            </ul>
              <Link to="/upgrade" className="w-full mt-auto inline-flex items-center justify-center rounded-md h-12 px-6 bg-[#1173d4] text-slate-50 font-semibold hover:bg-blue-700 transition">
                Upgrade Now
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="py-16 sm:py-24 bg-slate-50 w-full" id="who-benefits">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Who Benefits from Research Locker?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              See how Research Locker can help you achieve your goals, no matter your field.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4" style={{ paddingTop: '56.25%', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAv41sD2Eq74EXCF5fbueQhs4pgUnLRC0Te8hlkf02kehM_VbYnyynugdv3StCjNp31qLLUy7kMMOctf98qxo7OE4Cy3ItNZCouMM0o3eajbNB9ftF6pGRlwErYUzFbjZPM8osV7Zy1A9-2_KQpNXs5JvEEMzTjrOPed-dwPkJRBdbWHcriD3t6CwlL_n5BVYuV-rhRhc8701iHOiTrK1niS6fWvo8rNNPDcxaXy8rEk6aLC2mO6hMnn9R408DFGQa3CyyToP6Drpqm")' }}></div>
              <h3 className="text-lg font-bold">Students</h3>
              <p className="text-slate-600 mt-1">Organize your course materials and research papers efficiently.</p>
            </div>
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4" style={{ paddingTop: '56.25%', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYrAoQoDVYOdPeaaFKdh5tjBNd944RMk9RdxWsK1P0SFBdjORuT-U0fo8Vni_IQ_DUn-uiRw1vueHCo8Ry8Orw595TEiw694kuOLVBONoXDAF0J9MJSgZZMdYxUoUGQm19otmgSqPRwIy93gXe_EIBj1Ut5wBm3ers7oHCDbfBcf6IgDNm_UA8yjc_dHgeUErS6SG8457OqRVYeB2s68VyuRTG6JVp_XlXbGNCfo1NTuoUEvafqklNuBk-OypVKMQ7KG1SohqCKs6a")' }}></div>
              <h3 className="text-lg font-bold">Researchers</h3>
              <p className="text-slate-600 mt-1">Streamline your research process and collaborate with colleagues.</p>
            </div>
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4" style={{ paddingTop: '56.25%', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZkArB80rUolDk3sJZcxbU6TQ3R1zH_0a62mgXL--rGwY7sMWT50n7_MdvYMoavM5rNtoIMBz66BxbEcWhdXHlDCEjqA23J5OPadJ9RnnMZTDCG-mnUUhkZXimY3XfrkIR4CjQsct7L1SLfheekSrBMmT4ErCExvUs-wIFrfIwqroHh2ujdynhBmMp6tqAJBizqRbya5e7E-529Mqu4tf6YdR9hQB2Ojg158H_2X4Ibk8yUsnz85Y77jWSg3-xO1gTx-ozJ1plMD4E")' }}></div>
              <h3 className="text-lg font-bold">Academics</h3>
              <p className="text-slate-600 mt-1">Manage your publications and teaching resources in one place.</p>
          </div>
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4" style={{ paddingTop: '56.25%', backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpIh67eTpYF9CpySYhFvwl_GJyx7SIl0Rl2-6XJYxN0nQBHz-olUgsHmmHP2D44PzgIPf-OyNQLIQJPEMNgh9vdeOXS3KnRZ6zURfj_ClWGNGZnpx4H5kisr4FB5cfACtr6bukOkvUj2jUD2L6uMG15OWy7443romjUZfh7cMimsz4S_9XnsckZ67KN5RvVTC9Z0qI_ByWBkI_virUM6ITAsgt0WYylsVgUhufgNaCBob56r0c6D0X6Mmok-OSO0D-jtCfuCe5Ngl_")' }}></div>
              <h3 className="text-lg font-bold">Professionals</h3>
              <p className="text-slate-600 mt-1">Keep track of industry trends and research relevant to your field.</p>
          </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-16 sm:py-24 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to take control of your research?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Start building your research library today and experience a new level of efficiency.
          </p>
          {user ? (
            <Link to="/library" className="mt-8 inline-flex min-w-[84px] max-w-md mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-emerald-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-emerald-700 transition-colors">
              Go to your library
            </Link>
          ) : (
            <Link to="/register" className="mt-8 inline-flex min-w-[84px] max-w-md mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#1173d4] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
              Start building your research library today
            </Link>
          )}
        </div>
      </section>

      {/* Local keyframes for background animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -25px) scale(1.05); }
          66% { transform: translate(-15px, 10px) scale(0.98); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-slow {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-16px) translateX(6px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes float-slower {
          0% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(14px) translateX(-6px) scale(1.03); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }
        @keyframes tilt {
          0% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(3deg) translateY(-8px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
        .animate-tilt { animation: tilt 7s ease-in-out infinite; }
        .animate-spin-slower { animation: spin 40s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Footer provided by PublicLayout */}
    </div>
  );
};

export default Home;



