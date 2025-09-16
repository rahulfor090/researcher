import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-20 mt-20 bg-gray-800 text-gray-300 py-12 px-4 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-full md:col-span-1 text-center md:text-left">
          <Link to="/" className="text-indigo-400 text-3xl font-extrabold mb-4 block">
            Research Locker 🚀
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Your ultimate platform for securely saving, organizing, and accessing all your academic and professional research in one intuitive place.
          </p>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Research Locker. All rights reserved.</p>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-indigo-400 transition duration-300">Home</Link></li>
            <li><Link to="/library" className="text-gray-400 hover:text-indigo-400 transition duration-300">My Library</Link></li>
            <li><Link to="/upgrade" className="text-gray-400 hover:text-indigo-400 transition duration-300">View Plans</Link></li>
            <li><Link to="/register" className="text-gray-400 hover:text-indigo-400 transition duration-300">Sign Up</Link></li>
            <li><Link to="/login" className="text-gray-400 hover:text-indigo-400 transition duration-300">Login</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="/faq" className="text-gray-400 hover:text-indigo-400 transition duration-300">FAQ</a></li>
            <li><Link to="/help-center" className="text-gray-400 hover:text-indigo-400 transition duration-300">Help Center</Link></li>
            <li><a href="#contact" className="text-gray-400 hover:text-indigo-400 transition duration-300">Contact Us</a></li>
            <li><a href="#extension" className="text-gray-400 hover:text-indigo-400 transition duration-300">Chrome Extension</a></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 mb-6">
            <li><Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition duration-300">Privacy Policy</Link></li>
            <li><a href="#terms" className="text-gray-400 hover:text-indigo-400 transition duration-300">Terms of Service</a></li>
            <li><Link to="/return-policy" className="text-gray-400 hover:text-indigo-400 transition duration-300">Return Policy</Link></li>
          
          </ul>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#facebook" className="text-gray-400 hover:text-indigo-400 transition duration-300">Facebook</a>
            <a href="#twitter" className="text-gray-400 hover:text-indigo-400 transition duration-300">Twitter</a>
            <a href="#linkedin" className="text-gray-400 hover:text-indigo-400 transition duration-300">LinkedIn</a>
          </div>
        </div>
      </div>
      </footer>
  );
};

export default Footer;


