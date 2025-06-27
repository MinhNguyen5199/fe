'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redirect } from 'next/navigation';
import AdoptGremlinButton from '../../components/dashboard/AdoptGremlinButton';
import GremlinProfile from '../../components/dashboard/GremlinProfile';
import NftBadgeGrid from '../../components/dashboard/NftBadgeGrid';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { ProfileData } from '../../lib/types';

export default function GremlinPage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const handleLinkReddit = async () => {
        if (!user) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("User is not authenticated.");
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reddit/initiate`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to initiate Reddit auth.');
            }

            const { url } = await response.json();
            window.location.href = url;

        } catch (error) {
            console.error('Error linking Reddit:', error);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            redirect('/views/auth/login');
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            const { data: userData, error } = await supabase
                .from('users')
                .select(`
                    *,
                    reddit_game_profiles ( * ),
                    user_nft_badges ( *, nft_badges ( * ) )
                `)
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.error("Error fetching full user profile:", error);
                setProfile(null);
            } else if (userData) {
                const gameProfile = userData.reddit_game_profiles;

                if (gameProfile) {
                    setProfile({
                        ...gameProfile,
                        user_nft_badges: userData.user_nft_badges || [],
                    });
                } else {
                    setProfile({ reddit_username: userData.username });
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user, authLoading]);

const oauthError = searchParams.get('error') === 'oauth_failed';

    if (!profile) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <h1 className="text-2xl font-bold text-white">Link Your Reddit Account</h1>
                <p className="mt-2 text-gray-400">To start playing the Subreddit Gremlins game, you need to securely link your Reddit account.</p>

                {oauthError && (
                    <div className="mt-4 bg-red-900/50 text-red-300 p-3 rounded-md flex items-center justify-center text-sm">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Something went wrong during the linking process. Please try again.
                    </div>
                )}

                <button
                    onClick={handleLinkReddit}
                    className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition-all"
                >
                    Link with Reddit
                </button>
            </div>
        );
    }

    if (!profile.game_stats) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg">
                <h1 className="text-2xl font-bold">Adopt Your Gremlin!</h1>
                <p className="mt-2 text-gray-400">Welcome, {profile.reddit_username}! It's time to adopt your very own Gremlin to join the Quest.</p>
                <AdoptGremlinButton />
            </div>
        );
    }

    return (
        <div>
            <GremlinProfile stats={profile.game_stats} username={profile.reddit_username} />
            <h2 className="text-3xl font-bold mt-12 mb-6">Badges of Mayhem</h2>
            <NftBadgeGrid badges={profile.user_nft_badges || []} />
        </div>
    );
}