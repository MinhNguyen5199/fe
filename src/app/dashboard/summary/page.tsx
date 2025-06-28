// src/app/summary/page.tsx
'use client';

import React from 'react';
import SummaryForm from '../../components/SummaryForm';

const SummaryPage = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8 animate-fade-in-up text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500 dark:from-teal-300 dark:to-sky-300">
          AI Summaries
        </span>: Your Knowledge Supercharger
      </h2>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up [animation-delay:0.1s] text-center">
        Paste text, a link, or upload a file to instantly get concise, AI-powered summaries tailored to your needs.
      </p>
      <SummaryForm />
    </div>
  );
};

export default SummaryPage;
