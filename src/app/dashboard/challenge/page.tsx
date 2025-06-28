'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useSearchParams, redirect } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import AdoptGremlinButton from '../../components/dashboard/AdoptGremlinButton';
import GremlinProfile from '../../components/dashboard/GremlinProfile';
import NftBadgeGrid from '../../components/dashboard/NftBadgeGrid';
import QuestsList from '../../components/dashboard/QuestsList';
import { ProfileData } from '../../lib/types';

const ChallengePage = () => {
  const { user, session, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'challenge' | 'quests' | 'profile'>('quests');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error') === 'oauth_failed';

  const handleLinkReddit = async () => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not authenticated.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reddit/initiate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
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
      } else if (userData?.reddit_game_profiles) {
        setProfile({
          ...userData.reddit_game_profiles,
          user_nft_badges: userData.user_nft_badges || [],
        });
      } else {
        // No linked Reddit account yet
        setProfile(null);
      }
  
      setLoading(false);
    };
  
    fetchProfile();
  }, [user, authLoading]);
  

  if (!session) return redirect('/views/auth/login');

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">


      
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 animate-fade-in-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              The Silly Sh!t Challenge
            </span>: Learn & Play!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-10 animate-fade-in-up [animation-delay:0.1s]">
            Dive into these quirky challenges to earn points, unlock achievements, and make learning even more fun!
          </p>
        </section>

        <header className="bg-gray-800 border-b border-gray-700 mb-6 rounded-xl shadow-md">
        <nav className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {(['challenge', 'quests', 'profile'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tab === 'quests' && 'Quests'}
                {tab === 'profile' && 'My Gremlin'}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {activeTab === 'quests' && (
        <section className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white">Quest Board</h1>
          <QuestsList accessToken={session.access_token} />
        </section>
      )}

      {activeTab === 'profile' && (
        <section className="max-w-5xl mx-auto mt-4">
          {!profile ? (
            <div className="text-center p-6 sm:p-8 bg-gray-800 rounded-xl border border-gray-700 shadow">
              <h1 className="text-2xl font-bold text-white">Link Your Reddit Account</h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                To start playing the Subreddit Gremlins game, link your Reddit account.
              </p>

              {oauthError && (
                <div className="mt-4 bg-red-900/50 text-red-300 p-3 rounded-md flex items-center justify-center text-sm">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Something went wrong during the linking process. Please try again.
                </div>
              )}

              <button
                onClick={handleLinkReddit}
                className="mt-6 px-6 py-3 bg-orange-600 text-white font-bold rounded-full shadow-md hover:bg-orange-700 transition-all"
              >
                Link with Reddit
              </button>
            </div>
          ) : !profile.game_stats ? (
            <div className="text-center p-6 sm:p-8 bg-gray-800 rounded-xl shadow">
              <h1 className="text-2xl font-bold text-white">Adopt Your Gremlin!</h1>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Welcome, {profile.reddit_username}! Adopt your Gremlin to join the Quest.
              </p>
              <div className="mt-6">
                <AdoptGremlinButton />
              </div>
            </div>
          ) : (
            <div>
              <GremlinProfile stats={profile.game_stats} username={profile.reddit_username} />
              <h2 className="text-2xl sm:text-3xl font-bold mt-12 mb-6 text-white">Badges of Mayhem</h2>
              <NftBadgeGrid badges={profile.user_nft_badges || []} />
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ChallengePage;
