import { Book } from '../types';

interface FetchBooksResponse {
  data?: Book[];
  message?: string;
}

export async function fetchSimpleBookList(): Promise<FetchBooksResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/list-simple`);
    const data = await res.json();
    if (!res.ok) return { message: data?.message || 'Failed to load books.' };
    return { data: data.data || [] };
  } catch (err) {
    console.error('fetchSimpleBookList error:', err);
    return { message: 'Unexpected error occurred while fetching books.' };
  }
}