'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "ISummarize transformed my reading habits. The AI summaries are incredibly accurate and save me hours!",
    author: "Jane Doe, CEO of ReadFast",
    avatar: "https://placehold.co/80x80/6366F1/FFFFFF?text=JD",
    rating: 5,
  },
  {
    quote: "The VIP tier is a game-changer. Exclusive content and deep dives make learning effortless and enjoyable.",
    author: "John Smith, Lead Developer",
    avatar: "https://placehold.co/80x80/F43F5E/FFFFFF?text=JS",
    rating: 5,
  },
  {
    quote: "Finally, a platform that truly understands the value of time. ISummarize helps me stay informed without overwhelm.",
    author: "Emily White, Marketing Director",
    avatar: "https://placehold.co/80x80/14B8A6/FFFFFF?text=EW",
    rating: 4.5,
  },
];

const TestimonialCard = ({ testimonial, animationDelay }: { testimonial: Testimonial; animationDelay: number }) => {
  const [avatarSrc, setAvatarSrc] = useState(testimonial.avatar);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer border border-gray-200 dark:border-gray-700 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex justify-center mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(testimonial.rating)
                ? 'text-amber-500 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
      <Quote className="w-8 h-8 text-indigo-400 dark:text-indigo-300 mx-auto mb-4" />
      <p className="text-gray-700 dark:text-gray-200 text-lg italic mb-6">"{testimonial.quote}"</p>
      <div className="flex items-center justify-center space-x-4">
        <div className="relative w-16 h-16">
          <Image
            src={avatarSrc}
            alt={testimonial.author}
            width={80}
            height={80}
            className="rounded-full object-cover object-center border-4 border-indigo-200 dark:border-indigo-700 shadow-md"
            onError={() => setAvatarSrc('https://placehold.co/80x80/666/EEE?text=Avatar')}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{testimonial.author.split(',')[0]}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.author.split(',')[1]}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-fade-in">
          What Our Users Say
        </h3>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in animation-delay-200">
          Hear from the thousands of learners and professionals who are accelerating their knowledge with ISummarize.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} animationDelay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
