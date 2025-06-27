// /app/views/books/[bookId]/page.tsx

'use client';

import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import { useAuth } from '../../../context/AuthContext';
import Quill from 'quill';
import BookReview from '../review/page';
import AudioSummarySection from '../voice/page';
import VideoSummaryPage from '../video/page';
import { BookDetail, Summary, AffiliateLink } from '../../../lib/types';

interface BookDetailPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

const TOOLBAR_OPTIONS = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image'],
  ['clean']
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
        const response = await fetch('http://localhost:4000/books/details', {
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
            setShowSummaryEditor(true);
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
  }, [bookId, userProfile, accessToken, router]);


  useEffect(() => {
    if (showSummaryEditor && quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });

      editorRef.current.setContents(editorRef.current.clipboard.convert({ html: summaryContent }));


      editorRef.current.on('text-change', () => {
        setSummaryContent(editorRef.current?.root.innerHTML || '');
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.off('text-change');
        editorRef.current = null;
      }
    };
  }, [showSummaryEditor, summaryContent]);


  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const currentHTML = editor.root.innerHTML;
      const sanitized = DOMPurify.sanitize(summaryContent);

      if (sanitized !== currentHTML) {
        const delta = editor.clipboard.convert({ html: sanitized });
        editor.setContents(delta, 'silent');
      }
    }
  }, [summaryContent]);


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
      const response = await fetch('http://localhost:4000/admin/summaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          book_id: bookId,
          text_content: currentEditorContent,
        }),
      });

      const data: { message?: string, summary?: Summary } = await response.json();

      if (response.ok && data.summary) {
        setSummaryMessage(data.message || 'Summary saved successfully!');
        setSummaryError('');

        const newSummary = data.summary;

        setSummaryContent(newSummary.text_content);

        setBook(prevBook => {
          if (!prevBook) return null;

          return {
            ...prevBook,
            summaries: [newSummary],
          };
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
    return <div className="p-4 text-center text-gray-600">Loading book details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-300 rounded-md mx-auto my-8 max-w-xl">Error: {error}</div>;
  }

  if (!book) {
    return <div className="p-4 text-center text-gray-600">Book not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">{book.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          {/* FIX: Changed the mapping to work with an array of strings */}
          <p className="mb-2"><strong className="font-semibold text-gray-700">Author(s):</strong> {book.authors.join(', ')}</p>
          <p className="mb-2"><strong className="font-semibold text-gray-700">Genre(s):</strong> {book.genres.join(', ')}</p>
          {book.publication_date && (
            <p className="mb-2">
              <strong className="font-semibold text-gray-700">Publication Date:</strong> {new Date(book.publication_date).toLocaleDateString()}
            </p>
          )}
        </div>
        {book.cover_image_url && (
          <div className="flex flex-col items-center md:items-end">
            <strong className="font-semibold text-gray-700 mb-2">Cover Image:</strong>
            <img src={book.cover_image_url} alt={book.title} className="max-w-[200px] h-auto rounded-md shadow-lg" />
          </div>
        )}
      </div>

      {book.description && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-100">Description</h2>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-100">Summary</h2>
        {book.summaries && book.summaries.length > 0 && !showSummaryEditor ? (
          <>
            {book.summaries.map((summary: Summary, index: number) => (
              <div key={summary.summary_id || index} className="border border-gray-200 rounded-lg p-5 mb-4 bg-gray-50 shadow-sm">
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(summary.text_content) }}
                  className="prose max-w-none text-gray-700 leading-relaxed"
                />
              </div>
            ))}
            {userProfile?.is_admin && (
              <button
                onClick={handleEditSummaryClick}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                Edit Summary
              </button>
            )}
          </>
        ) : (
          userProfile?.is_admin && showSummaryEditor && (
            <form onSubmit={handleSaveSummary} className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Write/Edit Summary for {book.title}</h3>
              <div ref={quillRef} className="h-80 bg-white border border-gray-300 rounded-md overflow-hidden quill-editor-container" />

              <button
                type="submit"
                className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg w-full"
                disabled={isSavingSummary}
              >
                {isSavingSummary ? 'Saving Summary...' : 'Save Summary'}
              </button>
              {summaryMessage && <p className="mt-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md font-semibold text-center">{summaryMessage}</p>}
              {summaryError && <p className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md font-semibold text-center">{summaryError}</p>}
            </form>
          )
        )}
        {!userProfile?.is_admin && (!book.summaries || book.summaries.length === 0) && (
          <p className="text-gray-600">No summary available for this book yet.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-100">Affiliate Links</h2>
        {book.affiliate_links && book.affiliate_links.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {book.affiliate_links.map((link: AffiliateLink, index: number) => (
              <li key={index} className="text-gray-700">
                <strong className="font-semibold">{link.provider}:</strong>{' '}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">{link.url}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No affiliate links available.</p>
        )}

        {['vip', 'pro'].some(tier =>
          !!userProfile?.current_tier?.toLowerCase().includes(tier)
        ) ? (
          <VideoSummaryPage summary={mainSummary} />
        ) : (
          <div className="my-8 rounded-2xl bg-blue-100 text-blue-900 p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-2">AI Conversational Locked</h2>
            <p>Upgrade to <span className="font-bold">VIP</span> to access video.</p>
          </div>
        )}

        {['vip', 'pro'].some(tier =>
          !!userProfile?.current_tier?.toLowerCase().includes(tier)
        ) ? (
          <AudioSummarySection summary={mainSummary} />
        ) : (
          <div className="my-8 rounded-2xl bg-blue-100 text-blue-900 p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-2">Audio Summary Locked</h2>
            <p>Upgrade to <span className="font-bold">VIP</span> or <span className="font-bold">PRO</span> to access audio summaries and listen on the go.</p>
          </div>
        )}

        <hr className="my-8" />
      </div>
        <BookReview bookId={bookId}/>
      <button
        onClick={() => router.back()}
        className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      >
        Back
      </button>
    </div>
  );
}
