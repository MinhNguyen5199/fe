'use client';

import React, { FormEvent, useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../lib/types';

interface BookReviewProps {
    bookId: string;
}

export default function BookReview({ bookId }: BookReviewProps) {
    const { user, session } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hoverRating, setHoverRating] = useState(0);

    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [editRating, setEditRating] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string|null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!bookId) return;
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/reviews`);
                if (!response.ok) {
                    throw new Error('Failed to load reviews.');
                }
                const data = await response.json();
                setReviews(data.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchReviews();
    }, [bookId]);
    

    const userHasReviewed = useMemo(() => {
        if (!user) return false;
        return reviews.some(review => review.user_id === user.id);
    }, [reviews, user]);

    const handleCreateReview = async (e: FormEvent) => {
        e.preventDefault();
        if (!newReviewText.trim() || !user) return;
        setIsSubmitting(true);
        setActionError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    book_id: bookId,
                    rating: newReviewRating,
                    review_text: newReviewText
                })
            });
            if (!response.ok) throw new Error((await response.json()).message);

            const newReviewData = await response.json();
            const serverReview = newReviewData.review;

            const uiReadyReview = {
                ...serverReview,
                users: {
                    username: user.user_metadata?.username || user.email?.split('@')[0] || 'You'
                }
            };

            setReviews([uiReadyReview, ...reviews]);
            setNewReviewText('');
            setNewReviewRating(5);
        } catch (err: any) {
            setActionError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        const originalReviews = [...reviews];
        setReviews(reviews.filter(r => r.review_id !== reviewId));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (!response.ok) {
                setReviews(originalReviews);
                throw new Error((await response.json()).message);
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleEditSave = async (reviewId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ rating: editRating, review_text: editText })
            });
            if (!response.ok) throw new Error((await response.json()).message);

            const updatedReviewData = await response.json();
            const uiReadyUpdatedReview = {
                ...updatedReviewData.review,
                users: {
                    username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'You'
                }
            };
            setReviews(reviews.map(r => r.review_id === reviewId ? uiReadyUpdatedReview : r));
            setEditingReviewId(null);
        } catch (err: any) {
            alert(`Error updating review: ${err.message}`);
        }
    };

    const handleEditStart = (review: Review) => {
        setEditingReviewId(review.review_id);
        setEditText(review.review_text);
        setEditRating(review.rating);
    };

    if (isLoading) return <div className="p-4 text-center text-gray-600 dark:text-gray-400">Loading reviews...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">Reviews</h2>

            {user && !userHasReviewed && (
                <form onSubmit={handleCreateReview} className="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <textarea
                        value={newReviewText}
                        onChange={e => setNewReviewText(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        rows={3}
                        placeholder="Share your thoughts about this book..."
                    />
                    <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">Your Rating:</span>
                            <div onMouseLeave={() => setHoverRating(0)} className="flex">
                                {[1, 2, 3, 4, 5].map((starValue) => (
                                    <span
                                        key={starValue}
                                        className="cursor-pointer text-2xl"
                                        style={{ color: (hoverRating || newReviewRating) >= starValue ? '#FFC107' : '#E0E0E0' }}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onClick={() => setNewReviewRating(starValue)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newReviewText.trim()}
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Review'}
                        </button>
                    </div>
                    {actionError && <p className="text-red-600 dark:text-red-400 text-sm mt-2 text-right">{actionError}</p>}
                </form>
            )}

            <div className="space-y-4">
                {reviews.length === 0 && <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first!</p>}
                {reviews.map((review) => (
                    <div key={review.review_id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800/50">
                        {editingReviewId === review.review_id ? (
                            <div>
                                <select value={editRating} onChange={e => setEditRating(Number(e.target.value))} className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                     {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                                </select>
                                <textarea value={editText} onChange={e => setEditText(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" rows={4} />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => setEditingReviewId(null)} className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
                                    <button onClick={() => handleEditSave(review.review_id)} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{review.users?.username || 'Anonymous'}</p>
                                    {user?.id === review.user_id && (
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEditStart(review)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(review.review_id)} className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-yellow-500 font-bold my-1">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                                <p className="text-gray-700 dark:text-gray-300">{review.review_text}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}