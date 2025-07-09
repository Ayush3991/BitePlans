import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* 404 Heading and Icon */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4 animate-pulse">
            404
          </h1>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Message Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. Even the best developers hit 404s sometimes.
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go Home
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
          >
            Browse Tools
          </Link>
        </div>

        {/* Useful Links */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/products"
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-2xl mb-2">🛠️</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Developer Tools</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Explore our collection</p>
            </Link>

            <Link
              to="/pricing"
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-2xl mb-2">💳</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Pricing Plans</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Find the right plan</p>
            </Link>

            <Link
              to="/about"
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-2xl mb-2">ℹ️</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">About Us</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Learn our story</p>
            </Link>
          </div>
        </div>

        {/* Final Help Prompt */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Still can’t find what you’re looking for?
          </p>
          <a
            href="#"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
