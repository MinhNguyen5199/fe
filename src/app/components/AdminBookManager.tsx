'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { fetchSimpleBookList } from '../lib/books/fetchBooks';
import BookList from './BookList';
import { AffiliateLink } from '../lib/types';

export default function AdminBookManager() {
  const { userProfile, session } = useAuth();
  const router = useRouter();
  const accessToken: string | null = session?.access_token || null;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [publicationDate, setPublicationDate] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [authors, setAuthors] = useState<string>('');
  const [genres, setGenres] = useState<string>('');
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([{ provider: '', url: '' }]);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(true);

  useEffect(() => {
    if (!userProfile) {
      router.push('/views/auth/login');
      return;
    }
    if (!userProfile.is_admin) {
      router.push('/');
    }
  }, [userProfile, router]);

  const handleAddAffiliateLink = useCallback((): void => {
    setAffiliateLinks(prevLinks => [...prevLinks, { provider: '', url: '' }]);
  }, []);

  const handleAffiliateLinkChange = useCallback((index: number, field: keyof AffiliateLink, value: string): void => {
    setAffiliateLinks(prevLinks => {
      const newLinks = [...prevLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return newLinks;
    });
  }, []);

  const handleRemoveAffiliateLink = useCallback((index: number): void => {
    setAffiliateLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
  }, []);

  const fetchBooks = useCallback(async () => {
    setIsLoadingBooks(true);
    setError('');

    const result = await fetchSimpleBookList();

    if (!result.data) {
      setError(result.message || 'Failed to fetch books');
    }

    setIsLoadingBooks(false);
  }, []);

  useEffect(() => {
    if (userProfile?.is_admin && accessToken) {
      fetchBooks();
    }
  }, [userProfile, accessToken, fetchBooks]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (!accessToken) {
      setError('Authentication token missing. Please log in.');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          description: description || null,
          publication_date: publicationDate || null,
          cover_image_url: coverImageUrl || null,
          authors: authors.split(',').map((s: string) => s.trim()).filter(Boolean),
          genres: genres.split(',').map((s: string) => s.trim()).filter(Boolean),
          affiliate_links: affiliateLinks.filter((link: AffiliateLink) => link.provider && link.url),
        }),
      });

      const data= await response.json();

      if (response.ok) {
        setMessage(data.message || 'Book created successfully!');
        setError('');
        setTitle('');
        setDescription('');
        setPublicationDate('');
        setCoverImageUrl('');
        setAuthors('');
        setGenres('');
        setAffiliateLinks([{ provider: '', url: '' }]);
        await fetchBooks();
      } else {
        setError(data.message || 'Failed to create book.');
      }
    } catch (err: unknown) {
      console.error('Error creating book:', err);
      setError('An unexpected error occurred while creating the book.');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile?.is_admin) {
    return <div className="p-4 text-center text-gray-700">Redirecting to home page...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Admin Book Management</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-200">Create New Book</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
          <div>
            <label htmlFor="book-title" className="block text-gray-700 text-sm font-semibold mb-2">Title:</label>
            <input
              id="book-title"
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="book-description" className="block text-gray-700 text-sm font-semibold mb-2">Description:</label>
            <textarea
              id="book-description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[100px]"
            ></textarea>
          </div>
          <div>
            <label htmlFor="publication-date" className="block text-gray-700 text-sm font-semibold mb-2">Publication Date:</label>
            <input
              id="publication-date"
              type="date"
              value={publicationDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPublicationDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="cover-image-url" className="block text-gray-700 text-sm font-semibold mb-2">Cover Image URL:</label>
            <input
              id="cover-image-url"
              type="text"
              value={coverImageUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverImageUrl(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="authors" className="block text-gray-700 text-sm font-semibold mb-2">Authors (comma-separated):</label>
            <input
              id="authors"
              type="text"
              value={authors}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthors(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="genres" className="block text-gray-700 text-sm font-semibold mb-2">Genres (comma-separated):</label>
            <input
              id="genres"
              type="text"
              value={genres}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGenres(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <h3 className="text-xl font-bold text-gray-700 mt-4 mb-2">Affiliate Links</h3>
          {affiliateLinks.map((link: AffiliateLink, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                placeholder="Provider (e.g., Amazon)"
                value={link.provider}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleAffiliateLinkChange(index, 'provider', e.target.value)}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleAffiliateLinkChange(index, 'url', e.target.value)}
                disabled={isSubmitting}
                className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => handleRemoveAffiliateLink(index)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAffiliateLink}
            disabled={isSubmitting}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
          >
            Add Affiliate Link
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
          >
            {isSubmitting ? 'Creating Book...' : 'Create Book'}
          </button>
        </form>
      </section>

      {message && <p className="mt-6 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md font-semibold text-center">{message}</p>}
      {error && <p className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md font-semibold text-center">{error}</p>}

      <hr className="my-10 border-t-2 border-dashed border-gray-300" />

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-200">Existing Books (Admin View)</h2>
        {isLoadingBooks ? (
          <p className="text-center text-gray-600 p-4">Loading books...</p>
        ) : (
            <div className="max-w-sm w-full mx-auto">
            <BookList />
          </div>
        )}
      </section>
    </div>
  );
}