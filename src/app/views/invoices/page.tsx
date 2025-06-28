'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Footer from '@/app/components/ui/Footer';
import Header from '@/app/components/ui/Header';

interface Invoice {
  id: string;
  created: number;
  total: number;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | null;
  hosted_invoice_url: string | null;
}

interface ApiResponse {
  data: Invoice[];
  has_more: boolean;
}

export default function BillingHistory(): React.ReactElement {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session } = useAuth();

  useEffect(() => {
    if (!session) return;

    const fetchInvoices = async (cursor: string | null) => {
      if (isLoading) return;

      setIsLoading(true);
      const token = session.access_token;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ starting_after: cursor }),
        });

        const data: ApiResponse = await response.json();

        if (response.ok) {
          setInvoices((prev) => (cursor ? [...prev, ...data.data] : data.data));
          setHasMore(data.has_more);
          if (data.data.length > 0) {
            setLastInvoiceId(data.data[data.data.length - 1].id);
          }
        } else {
          console.error('Failed to fetch invoices:', (data as any).message);
        }
      } catch (error) {
        console.error('An error occurred while fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices(null);
  }, [session, isLoading]);

  const handleLoadMore = () => {
    if (!session || !hasMore || isLoading) return;

    const token = session.access_token;

    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ starting_after: lastInvoiceId }),
        });

        const data: ApiResponse = await response.json();

        if (response.ok) {
          setInvoices((prev) => [...prev, ...data.data]);
          setHasMore(data.has_more);
          if (data.data.length > 0) {
            setLastInvoiceId(data.data[data.data.length - 1].id);
          }
        } else {
          console.error('Failed to fetch invoices:', (data as any).message);
        }
      } catch (error) {
        console.error('An error occurred while fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div>
      <Header />
      <div className="mt-10 max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center">Billing History</h2>

        {invoices.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 dark:text-gray-400">No invoices found.</p>
        )}

        <ul className="space-y-4">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex justify-between items-center transition hover:shadow-lg"
            >
              <div>
                <p className="text-lg font-semibold">
                  {new Date(invoice.created * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  Status: <span className="font-medium">{invoice.status}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total: <span className="font-medium">${(invoice.total / 100).toFixed(2)}</span>
                </p>
              </div>
              {invoice.hosted_invoice_url && (
                <a
                  href={invoice.hosted_invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-sm"
                >
                  View PDF
                </a>
              )}
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
