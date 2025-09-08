
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in-down">
          🚀 Save, Organize, and Access Your Research in One Place
        </h1>
        <p className="text-xl text-gray-700 mb-8 animate-fade-in-up">
          Research Locker helps you securely store, categorize, and manage your purchased research articles.
          Stay organized, save time, and focus on discovery.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Get Started Free
          </Link>
          <Link
            to="/membership"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transition duration-300 transform hover:scale-105"
          >
            View Membership Plans
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white shadow-lg rounded-lg p-10 mb-16 max-w-4xl w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-indigo-500 text-4xl mb-4">1️⃣</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Save Articles Easily</h3>
            <p className="text-gray-600">Save research articles directly from publishers using our Chrome Extension.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-indigo-500 text-4xl mb-4">2️⃣</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Organize Smarter</h3>
            <p className="text-gray-600">Categorize, tag, and search across all your saved papers.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-indigo-500 text-4xl mb-4">3️⃣</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Anywhere</h3>
            <p className="text-gray-600">Your library is always available, on any device.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16 max-w-4xl w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Features</h2>
        <div className="grid md:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-2xl">✅</span>
            <p className="text-gray-700">Store up to 10 free articles (upgrade anytime).</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-2xl">✅</span>
            <p className="text-gray-700">Secure cloud storage for research papers.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-2xl">✅</span>
            <p className="text-gray-700">Chrome extension for one-click saving.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-2xl">✅</span>
            <p className="text-gray-700">Advanced search & filters.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-2xl">✅</span>
            <p className="text-gray-700">Membership plans with unlimited storage.</p>
          </div>
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Membership Plans Preview</h2>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 justify-center">
          <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center max-w-sm w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Free Plan</h3>
            <p className="text-gray-600 mb-6">Save up to 10 articles.</p>
            <Link
              to="/register"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300"
            >
              Sign Up Free
            </Link>
          </div>
          <div className="bg-indigo-600 text-white shadow-lg rounded-lg p-8 flex flex-col items-center max-w-sm w-full transform scale-105">
            <h3 className="text-2xl font-semibold mb-4">Pro Plan</h3>
            <p className="mb-6">Unlimited saves, 1-year subscription, premium features.</p>
            <Link
              to="/membership"
              className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-indigo-100 transition duration-300"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Who Is It For? */}
      <section className="mb-16 max-w-4xl w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Who Is It For?</h2>
        <div className="grid md:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <span className="text-indigo-500 text-2xl">🎓</span>
            <p className="text-gray-700">Students – Keep track of assignments and references.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-indigo-500 text-2xl">🔬</span>
            <p className="text-gray-700">Researchers – Organize experiments, studies, and citations.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-indigo-500 text-2xl">📚</span>
            <p className="text-gray-700">Academics – Build a personal library of published works.</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-indigo-500 text-2xl">👩‍💻</span>
            <p className="text-gray-700">Professionals – Access research anytime for your projects.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section (Bottom) */}
      <section className="text-center bg-indigo-700 text-white p-10 rounded-lg max-w-4xl w-full animate-fade-in-up">
        <h2 className="text-4xl font-bold mb-6">“Start building your research library today.”</h2>
        <div className="space-x-4">
          <a
            href="#"
            className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-300 transform hover:scale-105"
          >
            👉 Install Chrome Extension
          </a>
          <Link
            to="/register"
            className="bg-white text-indigo-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-100 transition duration-300 transform hover:scale-105"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Research Locker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
