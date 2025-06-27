'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Quest } from '../../lib/types';

export default function QuestCard({ quest }: { quest: Quest }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { session } = useAuth();

    const handleCompleteQuest = async () => {
        setIsLoading(true);
        setMessage('');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quests/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ questId: quest.quest_id })
        });
        const result = await response.json();
        if (response.ok) {
            setMessage(`Success! +${result.xp_gained} XP!`);
            setTimeout(() => router.refresh(), 2000);
        } else {
            setMessage(`Error: ${result.message}`);
            setIsLoading(false);
        }
    };
    return (
        <div className={`p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center transition-all ${quest.is_completed ? 'bg-green-900/50 border-l-4 border-green-500' : 'bg-gray-800 border-l-4 border-blue-500'}`}>
            <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-white">{quest.name}</h3>
                <p className="text-gray-300 mt-1">{quest.description}</p>
                <p className="text-yellow-400 font-bold mt-2">{quest.xp_reward} XP</p>
            </div>
            <div className="w-full md:w-auto md:ml-6">
                <button onClick={handleCompleteQuest} disabled={isLoading || quest.is_completed} className="w-full md:w-auto px-6 py-2 font-bold text-white rounded-md transition-colors disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400">
                    {quest.is_completed ? 'Completed' : (isLoading ? 'Submitting...' : 'Complete Quest')}
                </button>
                {message && <p className={`text-sm mt-2 text-center md:text-right ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            </div>
        </div>
    );
}