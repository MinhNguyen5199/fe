'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Book } from '../../lib/types';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: Book;
}

const fallbackImage = 'https://placehold.co/300x450/000000/FFFFFF?text=No+Cover';

const BookCard = ({ book }: BookCardProps) => {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(book.cover_image_url);

  const handleViewSummary = (bookId: string) => {
    router.push(`/views/books/${bookId}`);
  };

  return (
    <div
      onClick={() => handleViewSummary(book.book_id)}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-gray-900 shadow-lg"
    >
      {/* Image wrapper */}
      <div className="relative w-full aspect-[2.5/3] bg-black">
        <Image
          src={imgSrc || fallbackImage}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="transition-transform duration-500 ease-in-out group-hover:scale-100"
          onError={() => setImgSrc(fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      {/* Text content */}
      <div className="relative z-10 -mt-20 px-6 pb-6 text-white">
        <h3 className="text-2xl font-extrabold shadow-black [text-shadow:0_2px_4px_var(--tw-shadow-color)]">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-gray-300 shadow-black [text-shadow:0_1px_2px_var(--tw-shadow-color)]">
          by {book.authors.join(', ')}
        </p>

        {/* Details revealed on hover */}
        <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-in-out group-hover:max-h-40 group-hover:opacity-100">
          <div className="flex flex-wrap gap-2">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
