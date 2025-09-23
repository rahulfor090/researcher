import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-20 mt-20 bg-[#fefcf3]/95 backdrop-blur-md border-t border-[#e8ddd4] text-[#6b5b47] py-16 px-4 w-full" style={{ 
      background: 'linear-gradient(135deg, rgba(254, 252, 243, 0.95) 0%, rgba(245, 241, 232, 0.95) 100%)',
      boxShadow: '0 -4px 20px -2px rgba(45, 27, 14, 0.1)'
    }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0D9488] via-[#F97316] to-[#8b5cf6]"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-full md:col-span-1 text-center md:text-left">
          <Link to="/" className="mb-4 block hover:text-[#0D9488] transition-colors duration-300">
            <span className="flex items-center gap-3">
              <img src="/unnamed-removebg-preview.png" alt="ResearchLocker" className="h-10 w-10 rounded-xl shadow-sm ring-1 ring-[#e8ddd4] object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="text-[#2d1b0e] text-3xl font-extrabold">ResearchLocker</span>
            </span>
          </Link>
          <p className="text-sm text-[#6b5b47] leading-relaxed mb-4">
            Your ultimate platform for securely saving, organizing, and accessing all your academic and professional research in one intuitive place.
          </p>
            <p className="text-sm text-[#8b7d6b]">&copy; {new Date().getFullYear()} ResearchLocker. All rights reserved.</p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[#2d1b0e] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/library" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">My Library</Link></li>
              <li><Link to="/upgrade" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">View Plans</Link></li>
              <li><Link to="/register" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Sign Up</Link></li>
              <li><Link to="/login" className="text-[#6b5b47] hover:text-[#0D9488] transition duration-300 hover:translate-x-1 inline-block">Login</Link></li>
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
        <div className="bg-[#f5f1e8] rounded-2xl p-8 mb-8 text-center" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 241, 232, 0.8) 0%, rgba(254, 252, 243, 0.8) 100%)',
          border: '1px solid #e8ddd4'
        }}>
          <h3 className="text-2xl font-bold text-[#2d1b0e] mb-2">Stay Updated</h3>
          <p className="text-[#6b5b47] mb-6 max-w-2xl mx-auto">Get the latest updates on new features, research tips, and platform improvements delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-lg border border-[#e8ddd4] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] transition-colors duration-300 text-[#2d1b0e] placeholder-[#8b7d6b]"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#0D9488] to-[#F97316] hover:from-[#0f766e] hover:to-[#ea580c] text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom section with social links and copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#e8ddd4]">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="text-sm text-[#8b7d6b]">Follow us:</span>
            <div className="flex space-x-4">
              <a href="#facebook" className="w-8 h-8 bg-[#f5f1e8] rounded-full flex items-center justify-center text-[#6b5b47] hover:text-[#0D9488] hover:bg-[#0D9488]/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#twitter" className="w-8 h-8 bg-[#f5f1e8] rounded-full flex items-center justify-center text-[#6b5b47] hover:text-[#0D9488] hover:bg-[#0D9488]/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#linkedin" className="w-8 h-8 bg-[#f5f1e8] rounded-full flex items-center justify-center text-[#6b5b47] hover:text-[#0D9488] hover:bg-[#0D9488]/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-[#8b7d6b] mb-2">&copy; {new Date().getFullYear()} ResearchLocker. All rights reserved.</p>
          </div>
        </div>
      </div>
      </footer>
  );
};

export default Footer;


