'use client';

import React, { useState } from 'react';
import { BookOpen, Link as LinkIcon, Upload, Brain, Sparkles, FileText } from 'lucide-react';

const SummaryForm = () => {
  const [bookInput, setBookInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'link' | 'upload'>('text');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [focusArea, setFocusArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummaryResult(null);

    // Simulated delay (replace with real API)
    setTimeout(() => {
      setSummaryResult('This is a mock summary result. Replace this with actual summary.');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up max-w-4xl mx-auto w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500 dark:from-teal-300 dark:to-sky-300">
        Generate Your Next Summary
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Type Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          {[
            { label: 'Text', icon: <BookOpen className="w-5 h-5 mr-2" />, type: 'text' },
            { label: 'Link', icon: <LinkIcon className="w-5 h-5 mr-2" />, type: 'link' },
            { label: 'Upload', icon: <Upload className="w-5 h-5 mr-2" />, type: 'upload' },
          ].map(({ label, icon, type }) => (
            <button
              key={type}
              type="button"
              onClick={() => setInputType(type as any)}
              className={`flex items-center justify-center px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                inputType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="relative">
          <label htmlFor="bookInput" className="sr-only">
            {inputType === 'text' ? 'Book Text' : inputType === 'link' ? 'Book URL' : 'Upload File'}
          </label>
          {inputType === 'text' && (
            <textarea
              id="bookInput"
              rows={6}
              placeholder="Paste your book text here or type about the book you want summarized..."
              value={bookInput}
              onChange={(e) => setBookInput(e.target.value)}
              required
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base transition duration-200"
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
              className="block w-full rounded-full border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base transition duration-200"
            />
          )}
          {inputType === 'upload' && (
            <input
              type="file"
              id="bookInput"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setBookInput(e.target.files[0].name);
                }
              }}
              required
              className="block w-full text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-200 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800 cursor-pointer rounded-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-700 bg-gray-50 dark:bg-gray-700 py-3 px-4 transition duration-200"
            />
          )}
        </div>

        {/* Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="summaryLength" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Summary Length
            </label>
            <select
              id="summaryLength"
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="block w-full rounded-full border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base transition duration-200"
            >
              <option value="short">Short (≈ 200 words)</option>
              <option value="medium">Medium (≈ 500 words)</option>
              <option value="long">Long (≈ 1000 words)</option>
            </select>
          </div>
          <div>
            <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Focus Area (Optional)
            </label>
            <input
              type="text"
              id="focusArea"
              placeholder="e.g., key takeaways, character analysis"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="block w-full rounded-full border-0 py-3 px-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base transition duration-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !bookInput}
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

      {/* Output */}
      {summaryResult && (
        <div className="mt-10 p-4 sm:p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 animate-fade-in-up">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" /> Your Summary
          </h3>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            <p className="whitespace-pre-wrap">{summaryResult}</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              onClick={() => {}}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Export PDF
            </button>
            <button
              onClick={() => {}}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
