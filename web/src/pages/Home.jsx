
import React, { useEffect, useRef } from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import VideoSection from '../components/VideoSection';
import { colors, gradients } from '../theme';
// Navbar is provided by PublicLayout

const Home = () => {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);
  const parallaxRefs = useRef([]);
  const scrollProgressRef = useRef(null);

  // Enhanced scroll animations with multiple effects
  useEffect(() => {
    // Intersection Observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          // Add staggered animation for child elements
          const children = entry.target.querySelectorAll('.animate-on-scroll');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-slide-up');
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Scroll event listener for parallax and progress
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Update scroll progress
      if (scrollProgressRef.current) {
        const progress = (scrollY / (documentHeight - windowHeight)) * 100;
        scrollProgressRef.current.style.width = `${Math.min(progress, 100)}%`;
      }

      // Parallax effects for background elements
      parallaxRefs.current.forEach((element, index) => {
        if (element) {
          const speed = 0.5 + (index * 0.1); // Different speeds for different elements
          const yPos = -(scrollY * speed);
          element.style.transform = `translateY(${yPos}px)`;
        }
      });

      // Hero section parallax
      if (heroRef.current) {
        const heroOffset = scrollY * 0.5;
        heroRef.current.style.transform = `translateY(${heroOffset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add section to refs
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  // Add parallax element to refs
  const addParallaxRef = (el) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el);
    }
  };

  return (
    <div className="home-root min-h-screen flex flex-col items-center relative overflow-hidden pt-0 font-inter bg-app-gradient">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 progress-track">
        <div 
          ref={scrollProgressRef}
          className="h-full transition-all duration-300 ease-out progress-bar"
        />
      </div>

      {/* Background mesh and floating bubbles removed */}

      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center py-20 text-white w-full overflow-hidden animate-fade-in hero-section"
      >
        
        {/* Enhanced Hero animated accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full blur-2xl animate-float-slow opacity-40 radial-brand-40" />
          <div className="absolute bottom-10 right-1/5 h-72 w-72 rounded-full blur-2xl animate-float-slower opacity-35 radial-highlight-40" />
          <div className="absolute top-1/3 right-1/3 h-48 w-48 rounded-full blur-xl animate-tilt opacity-30 radial-accent-40" />
          <div className="absolute top-1/2 left-1/6 h-32 w-32 rounded-full blur-lg animate-pulse opacity-25 radial-success-40" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-slide-up">
            Accelerate Your Research Workflow
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-100 leading-relaxed animate-slide-up animation-delay-200">
            Streamline your research process with Research Locker. Save, organize, and access your research materials effortlessly, anytime, anywhere.
          </p>
          {user ? (
             <div className="mt-10 flex items-center justify-center gap-6 animate-slide-up animation-delay-400">
            <Link 
              to="/dashboard" 
              className="group relative inline-flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-8 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 btn-brand"
            >
               <span className="relative z-[1] flex items-center gap-2">
                 <span>Go to Dashboard</span>
                 <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
             </Link>
           </div>
          ) : (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
              <Link to="/register" className="group relative inline-flex min-w-[200px] max-w-[500px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-10 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 hover:-translate-y-1 btn-brand">
                <span className="relative z-[1] flex items-center gap-3">
                  <span>Get Started Free</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">🚀</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
              
              <a 
                href="https://chromewebstore.google.com/detail/research-locker/fgnfgifnggpfbmconkhcdjhdjdnnomfd?authuser=0&hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-8 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 hover:-translate-y-1 btn-outline-light"
              >
                <span className="relative z-[1] flex items-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Download Extension</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">⬇️</span>
                </span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features Section moved up */}
      <section className="py-16 sm:py-24 w-full bg-alt" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-primary-text">Powerful Features Designed for You</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary-text">
              Explore the features that make Research Locker the ultimate research management tool.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden flex gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition card-feature">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-xl group-hover:scale-125 transition bg-brand-10" />
              <span className="text-3xl mt-1 text-brand">📦</span>
            <div>
                <h3 className="text-lg font-bold text-primary-text">Free Article Storage</h3>
                <p className="mt-1 text-secondary-text">Start with a free plan that includes ample storage for your research articles.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition card-feature">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-xl group-hover:scale-125 transition bg-highlight-10" />
              <span className="text-3xl mt-1 text-highlight">☁️</span>
              <div>
                <h3 className="text-lg font-bold text-primary-text">Secure Cloud Storage</h3>
                <p className="mt-1 text-secondary-text">Your research is stored securely in the cloud, ensuring it's always safe and accessible.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition card-feature">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-xl group-hover:scale-125 transition bg-accent-10" />
              <span className="text-3xl mt-1 text-accent">🖱️</span>
              <div>
                <h3 className="text-lg font-bold text-primary-text">One-Click Saving</h3>
                <p className="mt-1 text-secondary-text">Save articles directly from your browser with our easy-to-use extension.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition card-feature">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-xl group-hover:scale-125 transition bg-brand-10" />
              <span className="text-3xl mt-1 text-brand">🔎</span>
              <div>
                <h3 className="text-lg font-bold text-primary-text">Advanced Search & Filters</h3>
                <p className="mt-1 text-secondary-text">Quickly find articles with powerful search and filtering options.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition card-feature">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-xl group-hover:scale-125 transition bg-highlight-10" />
              <span className="text-3xl mt-1 text-highlight">♾️</span>
              <div>
                <h3 className="text-lg font-bold text-primary-text">Unlimited Storage Plans</h3>
                <p className="mt-1 text-secondary-text">Upgrade to unlimited storage to save as many articles as you need.</p>
          </div>
            </div>
            <div className="group relative overflow-hidden flex gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition card-feature">
              <span className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-xl group-hover:scale-125 transition bg-accent-10" />
              <span className="text-3xl mt-1 text-accent">📚</span>
              <div>
                <h3 className="text-lg font-bold text-primary-text">Personal Research Library</h3>
                <p className="mt-1 text-secondary-text">Build a comprehensive library of your research materials, organized and accessible.</p>
          </div>
            </div>
          </div>
        </div>
      </section>
      <section ref={addToRefs} className="py-20 sm:py-28 w-full relative overflow-hidden bg-alt">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 animate-on-scroll text-earth-primary">Empowering Academics and Professionals</h2>
          <p className="mt-6 max-w-4xl mx-auto text-xl leading-relaxed animate-on-scroll text-earth-secondary">
            Join a community of researchers who are transforming their workflows with Research Locker. Whether you're a student, or professional, our platform is designed to meet your needs.
          </p>
        </div>
        {/* Decorative bubbles removed */}
      </section>

      {/* Demo Video */}
      <section ref={addToRefs} className="relative z-10 w-full py-16 sm:py-24 bg-app">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 animate-on-scroll text-earth-primary">See Research Locker in Action</h1>
            <p className="text-xl animate-on-scroll text-earth-secondary">A quick walkthrough of saving, organizing, and accessing your research.</p>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-on-scroll video-card">
            <VideoSection videoUrl="https://www.youtube.com/embed/FYUbpKlqjpA" />
            {/* Decorative corner elements */}
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full blur-sm opacity-30 bg-brand" />
            <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full blur-sm opacity-40 bg-highlight" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={addToRefs} className="py-20 sm:py-28 w-full relative overflow-hidden bg-alt" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 animate-on-scroll text-earth-primary">How It Works</h2>
            <p className="text-xl max-w-2xl mx-auto animate-on-scroll text-earth-secondary">A simple, intuitive process to revolutionize your research.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group flex flex-col items-center p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-xl animate-on-scroll howit-card">
              <div className="icon-bubble icon-bubble--save group-hover:scale-110 transition-transform duration-300">💾</div>
              <h3 className="text-2xl font-bold mb-4 text-earth-primary">Save Articles Easily</h3>
              <p className="text-center leading-relaxed text-earth-secondary">Use our browser extension to save articles with a single click. No more manual downloads or messy folders.</p>
            </div>
            <div className="group flex flex-col items-center p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-xl animate-on-scroll howit-card">
              <div className="icon-bubble icon-bubble--organize group-hover:scale-110 transition-transform duration-300">🗂️</div>
              <h3 className="text-2xl font-bold mb-4 text-earth-primary">Organize Smarter</h3>
              <p className="text-center leading-relaxed text-earth-secondary">Effortlessly organize your research with powerful tools that help you categorize, tag, and search your library.</p>
            </div>
            <div className="group flex flex-col items-center p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-xl animate-on-scroll howit-card">
              <div className="icon-bubble icon-bubble--access group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-earth-primary">Access Anywhere</h3>
              <p className="text-center leading-relaxed text-earth-secondary">Access your research library from any device, whether you're at your desk or on the go.</p>
            </div>
          </div>
        </div>
        {/* Decorative bubbles removed */}
      </section>

      {/* Chrome Extension Download Section */}
      <section ref={addToRefs} className="py-20 sm:py-28 w-full relative overflow-hidden bg-app">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 animate-on-scroll text-earth-primary">Get the Chrome Extension</h2>
            <p className="text-xl max-w-3xl mx-auto animate-on-scroll text-earth-secondary">
              Save research articles with a single click directly from any website. Our browser extension makes it effortless to capture and organize your research.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#e5e7eb] shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-earth-primary">One-Click Research Saving</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-brand">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-earth-secondary">Save articles from any website</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-brand">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-earth-secondary">Automatic metadata extraction</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-brand">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-earth-secondary">Instant sync with your library</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-brand">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-earth-secondary">Works on all major research sites</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg bg-brand">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-brand">ResearchLocker Extension</h4>
                    <p className="text-sm mb-4 text-earth-secondary">Available on Chrome Web Store</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-earth-secondary">5.0 (2 ratings)</span>
                    </div>
                  </div>
                  
                  <a 
                    href="https://chromewebstore.google.com/detail/research-locker/fgnfgifnggpfbmconkhcdjhdjdnnomfd?authuser=0&hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  className="group relative inline-flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-8 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 hover:-translate-y-1 btn-brand">
                    <span className="relative z-[1] flex items-center gap-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span>Add to Chrome</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative bubbles removed */}
      </section>

      

      {/* Pricing */}
      <section className="py-16 sm:py-24 w-full bg-card" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-text">Pro Membership</h2>
            <p className="mt-4 text-lg text-secondary-text">Unlock everything with one simple plan.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col gap-6 rounded-lg p-8 relative border-brand-2">
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full badge-brand">Most Popular</span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-text">Pro</h3>
                <p className="mt-2 text-4xl font-extrabold text-primary-text">$9<span className="text-lg font-medium text-secondary-text">/month</span></p>
                <p className="mt-2 text-sm text-secondary-text">For serious researchers</p>
              </div>
              <ul className="space-y-3 text-secondary-text">
                <li className="flex items-center gap-3">✅ Unlimited Articles</li>
                <li className="flex items-center gap-3">✅ Advanced Organization</li>
                <li className="flex items-center gap-3">✅ Priority Support</li>
            </ul>
              <Link to="/upgrade" className="w-full mt-auto inline-flex items-center justify-center rounded-md h-12 px-6 text-slate-50 font-semibold transition btn-brand">
                Upgrade Now
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="py-16 sm:py-24 w-full bg-background-alt" id="who-benefits">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-text">Who Benefits from ResearchLocker?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary-text">
              See how ResearchLocker can help you achieve your goals, no matter your field.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4 benefit-img benefit-img--students"></div>
              <h3 className="text-lg font-bold text-primary-text">Students</h3>
              <p className="mt-1 text-secondary-text">Organize your course materials and research papers efficiently.</p>
            </div>
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4 benefit-img benefit-img--researchers"></div>
              <h3 className="text-lg font-bold text-primary-text">Researchers</h3>
              <p className="mt-1 text-secondary-text">Streamline your research process and collaborate with colleagues.</p>
            </div>
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4 benefit-img benefit-img--academics"></div>
              <h3 className="text-lg font-bold text-primary-text">Academics</h3>
              <p className="mt-1 text-secondary-text">Manage your publications and teaching resources in one place.</p>
          </div>
            <div className="flex flex-col">
              <div className="w-full bg-center bg-no-repeat bg-cover rounded-lg mb-4 benefit-img benefit-img--professionals"></div>
              <h3 className="text-lg font-bold text-primary-text">Professionals</h3>
              <p className="mt-1 text-secondary-text">Keep track of industry trends and research relevant to your field.</p>
          </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-24 w-full bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-text">Ready to take control of your research?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary-text">
            Start building your research library today and experience a new level of efficiency.
          </p>
          {user ? (
            <Link to="/library" className="mt-8 inline-flex min-w-[84px] max-w-md mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors btn-brand">
              Go to your library
            </Link>
          ) : (
            <Link to="/register" className="mt-8 inline-flex min-w-[84px] max-w-md mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 text-slate-50 text-base font-bold leading-normal tracking-[0.015em] transition-colors btn-brand">
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Local keyframes are defined in Home.scss */}

      {/* Footer provided by PublicLayout */}
    </div>
  );
};

export default Home;



