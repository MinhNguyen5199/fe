'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdoptGremlinButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { session } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAdopt = async () => {
        setIsLoading(true);
        setError(null);

        if (!session) {
            setError("You must be logged in to adopt a Gremlin.");
            setIsLoading(false);
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gremlins/adopt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
        });

        console.log(response.ok);

        if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json();
            setError(data.message || 'An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 text-center">
            <button
                onClick={handleAdopt}
                disabled={isLoading}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
            >
                {isLoading ? 'Adopting...' : 'Adopt Your Gremlin!'}
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
    );
}