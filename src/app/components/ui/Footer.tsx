import React from 'react';
import Link from 'next/link';
import { Book, Twitter, Github, Linkedin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 rounded-t-3xl px-4 sm:px-6 lg:px-8 shadow-inner dark:shadow-none transition-colors duration-300 border-t-2 border-indigo-100 dark:border-gray-800 w-full">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link href="/" className="flex items-center space-x-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
            <Book className="w-8 h-8 text-indigo-600 dark:text-indigo-400 transform hover:scale-110 transition-transform duration-200" />
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-pulse-light">
              ISummarize
            </span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            &copy; {new Date().getFullYear()} ISummarize. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
            Accelerating knowledge, one summary at a time.
          </p>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-50 mb-6 md:mb-0">
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Company</h4>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              About Us
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              Careers
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              Blog
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Resources</h4>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              Support
            </Link>
            <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm">
              FAQ
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:scale-125">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:scale-125">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:scale-125">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
        <Link href="https://bolt.new/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
            <Image
              src="/badge.png"
              alt="Badge"
              width={100}
              height={100}
              className="w-20 h-20 sm:w-20 sm:h-20 md:w-30 md:h-30 object-contain"
              priority
            />
          </Link>
      </div>
    </footer>
  );
};

export default Footer;