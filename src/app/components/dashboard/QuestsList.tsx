'use client';

import { useEffect, useState } from 'react';
import QuestCard from './QuestCard';
import { Quest } from '../../lib/types';

export default function QuestsList({ accessToken }: { accessToken: string }) {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuests = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quests`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch quests from the server.");
                }

                const { data } = await res.json();
                setQuests(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuests();
    }, [accessToken]);

    if (loading) {
        return <p className="text-center p-8 text-gray-400">Loading quests...</p>;
    }

    if (error) {
        return <p className="text-center p-8 text-red-400">Error: {error}</p>;
    }

    return (
        quests.length > 0 ? (
             <div className="space-y-4">
                {quests.map(quest => (
                    <QuestCard key={quest.quest_id} quest={quest} />
                ))}
            </div>
        ) : (
            <p className="text-center p-8 text-gray-400">No quests are available at the moment. Check back soon!</p>
        )
    );
}