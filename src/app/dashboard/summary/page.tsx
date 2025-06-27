import React from 'react';
import SummaryForm from '../../components/SummaryForm';

const SummaryPage = () => {
  return (
    <div className="py-4">
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 animate-fade-in-up">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500 dark:from-teal-300 dark:to-sky-300">
          AI Summaries
        </span>: Your Knowledge Supercharger
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl animate-fade-in-up [animation-delay:0.1s]">
        Paste text, a link, or upload a file to instantly get concise, AI-powered summaries tailored to your needs.
      </p>
      <SummaryForm />
    </div>
  );
};

export default SummaryPage;