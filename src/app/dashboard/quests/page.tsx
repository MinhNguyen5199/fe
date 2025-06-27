'use client'
import { useAuth } from '@/app/context/AuthContext';
import { redirect } from 'next/navigation';
import QuestsList from '../../components/dashboard/QuestsList';

export default function QuestsPage() {
    const {session}= useAuth();

    if (!session) {
        return redirect('/views/auth/login');
    }

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Quest Board</h1>
            <QuestsList accessToken={session.access_token} />
        </div>
    );
}