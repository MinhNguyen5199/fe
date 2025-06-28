'use client';

import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import { useAuth } from '../../../context/AuthContext';
import Quill from 'quill';
import BookReview from '../../../components/ui/BookReview';
import AudioSummarySection from '../../../components/ui/AudioSummarySection';
import VideoSummaryPage from '../../../components/ui/VideoSummaryPage';
import { BookDetail, Summary, AffiliateLink } from '../../../lib/types';
import Header from '@/app/components/ui/Header';
import Footer from '@/app/components/ui/Footer';
import Image from 'next/image';

interface BookDetailPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image'],
  ['clean'],
];

export default function BookDetailPage({ params: paramsPromise }: BookDetailPageProps) {
  const params = React.use(paramsPromise);
  const { bookId } = params;
  const router = useRouter();
  const { userProfile, session } = useAuth();
  const accessToken: string | null = session?.access_token || null;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [showSummaryEditor, setShowSummaryEditor] = useState<boolean>(false);
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [isSavingSummary, setIsSavingSummary] = useState<boolean>(false);
  const [summaryMessage, setSummaryMessage] = useState<string>('');
  const [summaryError, setSummaryError] = useState<string>('');

  const mainSummary = book?.summaries?.[0];

  const quillRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Quill | null>(null);

  useEffect(() => {
    const fetchBookDetails = async (): Promise<void> => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/details`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId }),
        });

        const result: { data?: BookDetail; message?: string } = await response.json();

        if (response.ok) {
          setBook(result.data || null);
          if (result.data?.summaries && result.data.summaries.length > 0) {
            setSummaryContent(result.data.summaries[0].text_content);
            setShowSummaryEditor(false);
          } else {
            setSummaryContent('');
            setShowSummaryEditor(userProfile?.is_admin || false);
          }
        } else {
          setError(result.message || 'Failed to fetch book details.');
          setBook(null);
        }
      } catch (err: unknown) {
        console.error('Error fetching book details:', err);
        setError('An unexpected error occurred while fetching book details.');
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, userProfile]);

  useEffect(() => {
    if (showSummaryEditor && quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });

      if (summaryContent) {
        const delta = editorRef.current.clipboard.convert({ html: summaryContent });
        editorRef.current.setContents(delta, 'silent');
      }

      editorRef.current.on('text-change', () => {
        setSummaryContent(editorRef.current?.root.innerHTML || '');
      });
    }
  }, [showSummaryEditor, summaryContent]);

  const handleSaveSummary = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSummaryMessage('');
    setSummaryError('');
    setIsSavingSummary(true);

    const currentEditorContent = editorRef.current?.root.innerHTML || '';

    if (!bookId || !accessToken) {
      setSummaryError('Book ID or authentication token is missing. Cannot save summary.');
      setIsSavingSummary(false);
      return;
    }
    if (!currentEditorContent.trim()) {
      setSummaryError('Summary content cannot be empty.');
      setIsSavingSummary(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/summaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          book_id: bookId,
          text_content: currentEditorContent,
        }),
      });

      const data: { message?: string; summary?: Summary } = await response.json();

      if (response.ok && data.summary) {
        setSummaryMessage(data.message || 'Summary saved successfully!');
        setSummaryError('');

        setBook((prevBook) => {
          if (!prevBook) return null;
          return { ...prevBook, summaries: [data.summary!] };
        });

        setShowSummaryEditor(false);
      } else {
        setSummaryError(data.message || 'Failed to save summary.');
        setSummaryMessage('');
      }
    } catch (err: unknown) {
      console.error('Error saving summary:', err);
      setSummaryError('An unexpected error occurred while saving the summary.');
      setSummaryMessage('');
    } finally {
      setIsSavingSummary(false);
    }
  };

  const handleEditSummaryClick = () => {
    setShowSummaryEditor(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading book details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md my-8 max-w-xl">
        Error: {error}
      </div>
    );
  }

  if (!book) {
    return <div className="flex items-center justify-center h-screen">Book not found.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Header />
      <main className="pt-4">
        <div className="p-6 max-w-4xl mx-auto my-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl mt-11">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 text-center">{book.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <strong className="font-semibold text-gray-800 dark:text-gray-200">Author(s):</strong> {book.authors.join(', ')}
              </p>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                <strong className="font-semibold text-gray-800 dark:text-gray-200">Genre(s):</strong> {book.genres.join(', ')}
              </p>
              {book.publication_date && (
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  <strong className="font-semibold text-gray-800 dark:text-gray-200">Publication Date:</strong>{' '}
                  {new Date(book.publication_date).toLocaleDateString()}
                </p>
              )}
            </div>
            {book.cover_image_url && (
              <div className="flex justify-center md:justify-end relative w-[200px] h-auto">
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  width={200}
                  height={300}
                  className="rounded-md shadow-lg object-contain"
                  priority
                />
              </div>
            )}
          </div>

          {book.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Summary</h2>
            {mainSummary && !showSummaryEditor ? (
              <>
                <div
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-4 bg-gray-50 dark:bg-gray-800/50 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mainSummary.text_content) }}
                />
                {userProfile?.is_admin && (
                  <button
                    onClick={handleEditSummaryClick}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  >
                    Edit Summary
                  </button>
                )}
              </>
            ) : userProfile?.is_admin && showSummaryEditor ? (
              <form onSubmit={handleSaveSummary} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Write/Edit Summary for {book.title}</h3>
                <div ref={quillRef} className="h-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden quill-editor-container" />

                <button
                  type="submit"
                  className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 w-full"
                  disabled={isSavingSummary}
                >
                  {isSavingSummary ? 'Saving...' : 'Save Summary'}
                </button>
                {summaryMessage && (
                  <p className="mt-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-center">{summaryMessage}</p>
                )}
                {summaryError && (
                  <p className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-center">{summaryError}</p>
                )}
              </form>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No summary available for this book yet.</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Affiliate Links
            </h2>
            {book.affiliate_links && book.affiliate_links.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2">
                {book.affiliate_links.map((link: AffiliateLink, index: number) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    <strong className="font-semibold text-gray-800 dark:text-gray-200">{link.provider}:</strong>{' '}
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-words">
                      {link.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No affiliate links available.</p>
            )}
          </div>

          {userProfile && (
            <>
              {userProfile.current_tier?.toLowerCase().includes('vip') ? (
                <VideoSummaryPage summary={mainSummary} />
              ) : (
                <div className="my-8 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 p-6 text-center shadow-md">
                  <h2 className="text-xl font-semibold mb-2">AI Video Host Locked</h2>
                  <p>
                    Upgrade to <span className="font-bold">VIP</span> to access personalized video summaries.
                  </p>
                </div>
              )}

              {['vip', 'pro'].some((tier) => userProfile.current_tier?.toLowerCase().includes(tier)) ? (
                <AudioSummarySection summary={mainSummary} />
              ) : (
                <div className="my-8 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 p-6 text-center shadow-md">
                  <h2 className="text-xl font-semibold mb-2">Audio Summary Locked</h2>
                  <p>
                    Upgrade to <span className="font-bold">VIP</span> or <span className="font-bold">PRO</span> to listen on the go.
                  </p>
                </div>
              )}
            </>
          )}

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          <BookReview bookId={bookId} />

          <button
            onClick={() => router.back()}
            className="mt-8 px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
