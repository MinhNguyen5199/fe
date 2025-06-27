'use client';

import React, { useState } from 'react';
import { BookOpen, Link as LinkIcon, Upload, Brain, Sparkles, FileText } from 'lucide-react';
// import { useAI } from '../hooks/useAI'; // This will be created later

const SummaryForm = () => {
  const [bookInput, setBookInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'link' | 'upload'>('text');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [focusArea, setFocusArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  // const { generateSummary } = useAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummaryResult(null);

    // Simulate AI summary generation
    // const result = await generateSummary(bookInput, summaryLength, focusArea);
    // setSummaryResult(result);

    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500 dark:from-teal-300 dark:to-sky-300">
        Generate Your Next Summary
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setInputType('text')}
            className={`flex items-center px-6 py-3 rounded-full text-lg font-medium transition-all duration-200
              ${inputType === 'text'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <BookOpen className="w-5 h-5 mr-2" /> Text
          </button>
          <button
            type="button"
            onClick={() => setInputType('link')}
            className={`flex items-center px-6 py-3 rounded-full text-lg font-medium transition-all duration-200
              ${inputType === 'link'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <LinkIcon className="w-5 h-5 mr-2" /> Link
          </button>
          <button
            type="button"
            onClick={() => setInputType('upload')}
            className={`flex items-center px-6 py-3 rounded-full text-lg font-medium transition-all duration-200
              ${inputType === 'upload'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <Upload className="w-5 h-5 mr-2" /> Upload
          </button>
        </div>

        <div className="relative">
          <label htmlFor="bookInput" className="sr-only">
            {inputType === 'text' ? 'Book Text' : inputType === 'link' ? 'Book URL' : 'Upload File'}
          </label>
          {inputType === 'text' && (
            <textarea
              id="bookInput"
              rows={8}
              placeholder="Paste your book text here or type about the book you want summarized..."
              value={bookInput}
              onChange={(e) => setBookInput(e.target.value)}
              required
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 sm:text-sm sm:leading-6 transition-colors duration-200"
            />
          )}
          {inputType === 'link' && (
            <input
              type="url"
              id="bookInput"
              placeholder="Enter book URL (e.g., Goodreads, Project Gutenberg link)"
              value={bookInput}
              onChange={(e) => setBookInput(e.target.value)}
              required
              className="block w-full rounded-full border-0 py-3 px-4 pl-10 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 sm:text-sm sm:leading-6 transition-colors duration-200"
            />
          )}
          {inputType === 'upload' && (
            <input
              type="file"
              id="bookInput"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setBookInput(e.target.files[0].name);
                }
              }}
              required
              className="block w-full text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-200 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800 cursor-pointer rounded-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-700 bg-gray-50 dark:bg-gray-700 py-3 px-4 transition-colors duration-200"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="summaryLength" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Summary Length
            </label>
            <select
              id="summaryLength"
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="block w-full rounded-full border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 sm:text-sm sm:leading-6 transition-colors duration-200"
            >
              <option value="short">Short (approx. 200 words)</option>
              <option value="medium">Medium (approx. 500 words)</option>
              <option value="long">Long (approx. 1000 words)</option>
            </select>
          </div>
          <div>
            <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Focus Area (Optional)
            </label>
            <input
              type="text"
              id="focusArea"
              placeholder="e.g., 'key takeaways', 'character analysis'"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="block w-full rounded-full border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 sm:text-sm sm:leading-6 transition-colors duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !bookInput}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-gradient-to-r dark:from-teal-500 dark:to-sky-500 dark:hover:from-teal-600 dark:hover:to-sky-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Sparkles className="animate-spin mr-3 w-5 h-5" /> Generating...
            </span>
          ) : (
            <>
              <Brain className="mr-3 w-5 h-5" /> Generate Summary
            </>
          )}
        </button>
      </form>

      {summaryResult && (
        <div className="mt-10 p-8 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 animate-fade-in-up [animation-delay:0.3s]">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" /> Your Summary
          </h3>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="whitespace-pre-wrap">{summaryResult}</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              onClick={() => {
                // In a real app, handle export to PDF
              }}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            >
              Export PDF
            </button>
            <button
              onClick={() => {
                // In a real app, handle export to Markdown
              }}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
            >
              Export Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryForm;