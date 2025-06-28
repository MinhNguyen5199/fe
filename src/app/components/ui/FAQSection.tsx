'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What makes ISummarize summaries so powerful?",
    answer: "Our summaries are generated using a proprietary AI model trained on millions of books and academic papers, ensuring high accuracy, conciseness, and retention of key concepts. We integrate advanced NLP techniques to provide unparalleled insights."
  },
  {
    question: "How do the Basic, Pro, and VIP tiers differ?",
    answer: "The Basic tier offers limited daily summaries and storage. Pro unlocks unlimited summaries, PDF/Markdown export, and extended storage. VIP includes all Pro features plus exclusive access to advanced AI tools (like audio summaries via ElevenLabs, personalized video summaries via Tavus.io) and priority support."
  },
  {
    question: "Can I try before I buy?",
    answer: "Yes! We offer a free trial period for the Basic tier. Simply sign up, and you can start summarizing books immediately to experience the power of ISummarize AI."
  },
  {
    question: "What is the 'Silly Sh!t Challenge'?",
    answer: "The 'Silly Sh!t Challenge' is our gamified feature inspired by popular online communities. It's a fun way to earn points, unlock achievements, and engage with the ISummarize community by completing quirky, creative challenges related to books and summaries. It's designed to make learning even more enjoyable!"
  },
  {
    question: "Is my data secure with ISummarize?",
    answer: "Absolutely. We prioritize your data security and privacy. All your summaries and personal information are encrypted and stored securely. We adhere to strict data protection regulations to ensure your peace of mind."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500 dark:from-teal-300 dark:to-sky-300 animate-fade-in">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index ? 'true' : 'false'}
                aria-controls={`faq-content-${index}`}
              >
                <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`faq-content-${index}`}
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;