
import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import VideoSection from '../components/VideoSection';
import Navbar from '../components/Navbar';

const Home = () => {
  const slides = [
    {
      image: '/upload/slider/first_slider.png',
      headline: 'Accelerate Your Research Workflow',
      subheadline: 'Organize, collaborate, and discover with ease.',
      link: '/register',
      linkText: 'Join for Free',
    },
    {
      image: '/upload/slider/second_slider.png',
      headline: 'Never Lose a Valuable Insight Again',
      subheadline: 'Securely store and access all your articles, anywhere.',
      link: '/upgrade',
      linkText: 'View Plans',
    },
    {
      image: '/upload/slider/first_slider.png',
      headline: 'Empowering Academics and Professionals',
      subheadline: 'Your ultimate tool for research management and discovery.',
      link: '#',
      linkText: 'Learn More',
    },
  ];

  return (
    <div className="home-root min-h-screen bg-gray-50 flex flex-col items-center p-4 relative overflow-hidden pt-16">
      <Navbar />
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50 z-0"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 z-10"></div>
      {/* Theme background blobs (additional, non-destructive) */}
      <div className="bg-blob bg-blob--1"></div>
      <div className="bg-blob bg-blob--2"></div>
      <div className="bg-blob bg-blob--3"></div>

      <HeroSlider slides={slides} />

      {/* How It Works Section */}
      <section className="relative z-20 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-2xl rounded-3xl p-10 mb-20 max-w-5xl w-full animate-fade-in border border-gray-100 transform translate-y-0 hover:-translate-y-2 transition-transform duration-300 ease-in-out">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 leading-tight">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="text-indigo-600 text-5xl mb-4 p-4 bg-indigo-100 rounded-full animate-bounce-slow">1️⃣</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Save Articles Easily</h3>
            <p className="text-gray-600 text-lg">Save research articles directly from publishers using our powerful Chrome Extension.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="text-indigo-600 text-5xl mb-4 p-4 bg-indigo-100 rounded-full animate-bounce-slow animation-delay-500">2️⃣</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Organize Smarter</h3>
            <p className="text-gray-600 text-lg">Categorize, tag, and search across all your saved papers with intelligent tools.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="text-indigo-600 text-5xl mb-4 p-4 bg-indigo-100 rounded-full animate-bounce-slow animation-delay-1000">3️⃣</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Access Anywhere</h3>
            <p className="text-gray-600 text-lg">Your complete research library is always available, securely stored and accessible on any device, anytime.</p>
          </div>
        </div>
      </section>

      {/* Video Section Placeholder */}
      <section className="relative z-20 mb-20 max-w-5xl w-full">
        <VideoSection
          videoUrl="https://www.youtube.com/embed/3iMbMyKEDik" // Updated YouTube video URL
        />
      </section>

      {/* Features Section */}
      <section className="relative z-20 mb-20 max-w-5xl w-full animate-fade-in">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 leading-tight">Powerful Features Designed for You</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-gray-100">
          <div className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span className="text-green-500 text-3xl">✅</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Free Article Storage</h3>
              <p className="text-gray-600">Store up to 10 articles for free, upgrade anytime for more.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span className="text-green-500 text-3xl">🔒</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Secure Cloud Storage</h3>
              <p className="text-gray-600">Your research papers are safely stored in our secure cloud.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span className="text-green-500 text-3xl">🖱️</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">One-Click Saving</h3>
              <p className="text-gray-600">Our Chrome extension makes saving articles effortless.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span className="text-green-500 text-3xl">🔎</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Advanced Search & Filters</h3>
              <p className="text-gray-600">Quickly find what you need with powerful search capabilities.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span className="text-green-500 text-3xl">∞</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Unlimited Storage Plans</h3>
              <p className="text-gray-600">Upgrade for unlimited storage and premium features.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <span className="text-green-500 text-3xl"> 📚 </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1"> Personal Research Library </h3>
              <p className="text-gray-600"> Build and manage your personal collection of academic papers. </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section className="relative z-20 text-center mb-20 animate-fade-in max-w-5xl w-full">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 leading-tight">Flexible Membership Plans</h2>
        <div className="flex flex-col md:flex-row justify-center">
          <div className="bg-indigo-600 text-white shadow-2xl rounded-3xl p-10 flex flex-col items-center max-w-sm w-full transform scale-105 border border-indigo-700 relative overflow-hidden group hover:scale-10">
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h3 className="text-3xl font-bold mb-4">Membership </h3>
            <p className="text-indigo-100 text-lg mb-6">Unlock unlimited potential for your research.</p>
            <ul className="text-indigo-100 text-left mb-8 space-y-2">
              <li>✅ Unlimited article saves</li>
              <li>✅ 1-year subscription</li>
              <li>✅ Premium features & analytics</li>
              <li>✅ Priority customer support</li>
            </ul>
            <Link
              to="/upgrade"
              className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-100 transition duration-300 transform hover:scale-105"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Who Is It For? */}
      <section className="relative z-20 mb-20 max-w-5xl w-full animate-fade-in">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 leading-tight">Who Benefits from Research Locker?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-gray-100">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <span className="text-indigo-600 text-5xl mb-4">🎓</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Students</h3>
            <p className="text-gray-600">Keep all your assignments, references, and study materials organized.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <span className="text-indigo-600 text-5xl mb-4">🔬</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Researchers</h3>
            <p className="text-gray-600">Effortlessly organize experiments, studies, and citations in one place.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <span className="text-indigo-600 text-5xl mb-4">📚</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Academics</h3>
            <p className="text-gray-600">Build and manage a comprehensive personal library of published works.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <span className="text-indigo-600 text-5xl mb-4">👩‍💻</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Professionals</h3>
            <p className="text-gray-600">Access critical research anytime, anywhere for your projects and clients.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section (Bottom) */}
      <section className="relative z-20 text-center bg-indigo-700 text-white p-16 rounded-3xl max-w-5xl w-full animate-fade-in-up shadow-2xl">
        <h2 className="text-5xl font-extrabold mb-8 leading-tight">“Start building your research library today.”</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">Join thousands of users who are streamlining their research workflow with Research Locker. It's free to get started!</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center bg-white text-indigo-700 px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-100 transition duration-300 transform hover:scale-105"
          >
            👉 Install Chrome Extension
          </a>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-transparent text-white px-10 py-4 rounded-full text-xl font-bold border-2 border-white hover:bg-white hover:text-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 mt-20 bg-gray-800 text-gray-300 py-12 px-4 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-full md:col-span-1 text-center md:text-left">
            <Link to="/" className="text-indigo-400 text-3xl font-extrabold mb-4 block">
              Research Locker 🚀
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your ultimate platform for securely saving, organizing, and accessing all your academic and professional research in one intuitive place.
            </p>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Research Locker. All rights reserved.</p>
          </div>

          {/* Quick Links */}
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

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-gray-400 hover:text-indigo-400 transition duration-300">FAQ</a></li>
              <li><a href="#help" className="text-gray-400 hover:text-indigo-400 transition duration-300">Help Center</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-indigo-400 transition duration-300">Contact Us</a></li>
              <li><a href="#extension" className="text-gray-400 hover:text-indigo-400 transition duration-300">Chrome Extension</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              <li><a href="#privacy" className="text-gray-400 hover:text-indigo-400 transition duration-300">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-indigo-400 transition duration-300">Terms of Service</a></li>
            </ul>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#facebook" className="text-gray-400 hover:text-indigo-400 transition duration-300">
                <i className="fab fa-facebook-f"></i>{/* Replace with actual SVG or component */}
                Facebook
              </a>
              <a href="#twitter" className="text-gray-400 hover:text-indigo-400 transition duration-300">
                <i className="fab fa-twitter"></i>{/* Replace with actual SVG or component */}
                Twitter
              </a>
              <a href="#linkedin" className="text-gray-400 hover:text-indigo-400 transition duration-300">
                <i className="fab fa-linkedin-in"></i>{/* Replace with actual SVG or component */}
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-500 text-sm">Crafted with ❤️ for researchers everywhere.</p>
      </footer>
    </div>
  );
};

export default Home;



