import React from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../theme';
import { useAuth } from '../auth';

const Footer = () => {
  const { user } = useAuth();
  
  return (
    <footer className="relative z-20 mt-20 bg-white border-t border-[#e5e7eb] text-[#6b7280] py-16 px-4 w-full" style={{ 
      boxShadow: '0 -4px 16px -6px rgba(2, 6, 23, 0.08)'
    }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] via-[#06b6d4] to-[#8b5cf6]"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-full md:col-span-1 text-center md:text-left">
          <Link to="/" className="mb-4 block hover:text-[#0D9488] transition-colors duration-300">
            <span className="text-[#2d1b0e] text-3xl font-extrabold">Research Locker</span>
          </Link>
          <p className="text-sm text-[#6b5b47] leading-relaxed mb-4">
            Your ultimate platform for securely saving, organizing, and accessing all your academic and professional research in one intuitive place.
          </p>
            <p className="text-sm text-[#8b7d6b]">&copy; {new Date().getFullYear()} ResearchLocker. All rights reserved.</p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#2d1b0e] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {/* Home removed from Quick Links on Home page */}
              <li><Link to="/upgrade" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">View Plans</Link></li>
              {!user && (
                <>
                  <li><Link to="/register" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Sign Up</Link></li>
                  <li><Link to="/login" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Login</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#2d1b0e] mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">FAQ</a></li>
              <li><Link to="/help-center" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Help Center</Link></li>
              <li><a href="#contact" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Contact Us</a></li>
              <li><a href="https://chromewebstore.google.com/detail/research-locker/fgnfgifnggpfbmconkhcdjhdjdnnomfd?authuser=0&hl=en" target="_blank" rel="noopener noreferrer" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Chrome Extension
              </a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#2d1b0e] mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/privacy" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><a href="#terms" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Terms of Service</a></li>
              <li><Link to="/return-policy" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Return Policy</Link></li>
            </ul>
            <h3 className="text-lg font-semibold text-[#2d1b0e] mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#facebook" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:scale-110 inline-block">Facebook</a>
              <a href="#twitter" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:scale-110 inline-block">Twitter</a>
              <a href="#linkedin" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:scale-110 inline-block">LinkedIn</a>
            </div>
          </div>
        </div>
        
        {/* Newsletter signup section */}
        <div className="bg-white rounded-2xl p-8 mb-8 text-center border border-[#e5e7eb] shadow-sm">
          <h3 className="text-2xl font-bold text-[#2d1b0e] mb-2">Stay Updated</h3>
          <p className="text-[#6b5b47] mb-6 max-w-2xl mx-auto">Get the latest updates on new features, research tips, and platform improvements delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-12 px-4 rounded-2xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-colors duration-300 text-[#1f2937] placeholder-[#9ca3af]"
            />
            <button className="btn-brand h-12 px-6 rounded-2xl shadow-md hover:shadow-lg">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="flex flex-col items-center pt-8 border-t border-[#2563eb      ]">
          <div className="text-center">
            <p className="text-sm text-[#8b7d6b] mb-2">&copy; {new Date().getFullYear()} ResearchLocker. All rights reserved.</p>
          </div>
        </div>
      </div>
      </footer>
  );
};

export default Footer;






