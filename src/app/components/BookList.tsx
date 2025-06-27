'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchSimpleBookList } from '../lib/books/fetchBooks';
import { Book } from '../lib/types';
import { useRouter } from 'next/navigation';

export default function BookList() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleViewSummary = useCallback((bookId: string): void => {
    router.push(`/views/books/${bookId}`);
  }, [router]);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const result = await fetchSimpleBookList();
      if (result.data) {
        setBooks(result.data);
      } else {
        setError(result.message || 'Failed to fetch books');
      }
      setLoading(false);
    };

    loadBooks();
  }, []);

  if (loading) return <p className="text-gray-600 text-center">Loading books...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (books.length === 0) return <p className="text-gray-600 text-center">No books found.</p>;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map(book => (
        <li key={book.book_id} className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
            <p className="text-gray-700 text-sm mt-1">
              <strong>Authors:</strong> {book.authors.join(', ')}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              <strong>Genres:</strong> {book.genres.join(', ')}
            </p>
          </div>
          <button
            onClick={() => handleViewSummary(book.book_id)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Details
          </button>
        </li>
      ))}
    </ul>
  );
}