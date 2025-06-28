'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Book, Sun, Moon, LogIn, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-lg rounded-b-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <Book className="w-8 h-8 text-indigo-600 dark:text-indigo-400 transform hover:scale-110 transition-transform duration-200" />
          <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-pulse-light cursor-pointer">
              ISummarize
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {isAuthenticated ? (
            <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
               <p className="text-white">Go to Dashboard</p>
            </Link>
          ) : (
            <Link
  href="/views/auth/login"
  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
>
  <span className="text-white">Login / Sign Up</span>
  <LogIn className="ml-2 w-4 h-4 text-white" />
</Link>
          )}
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
            aria-label="Open mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg pb-4 pt-2 border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out transform origin-top animate-fade-in-down">
          <nav className="flex flex-col items-center space-y-4 px-4">
            <Link href="/dashboard/challenge" className="w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
              Challenge
            </Link>
            <Link href="/dashboard/summary" className="w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
              Summaries
            </Link>
            <Link href="/dashboard/upgrade" className="w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
              Pricing
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
                Dashboard
              </Link>
              
            )}
            {isAuthenticated && (
              <Link href="/views/invoices" className="w-full text-center py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMobileMenu}>
                Invoice
              </Link>
              
            )}
            <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2"></div>
            {isAuthenticated ? (
              <button
              onClick={() => {
                signOut();
                toggleMobileMenu(); // Close the mobile menu on logout
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="mr-2 w-5 h-5 text-white" />
              <span>Sign Out</span>
            </button>
            ) : (
                <Link
                href="/views/auth/login"
                onClick={toggleMobileMenu}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                <p className="text-white">Login / Sign Up</p>
                <LogIn className="ml-2 w-4 h-4 text-white" />
              </Link>
            )}
          </nav>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;