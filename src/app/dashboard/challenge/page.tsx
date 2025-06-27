import Link from 'next/link';
import React from 'react';

const ChallengePage = () => {
  return (
    <div className="py-4">
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 animate-fade-in-up">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          The Silly Sh!t Challenge
        </span>: Learn & Play!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl animate-fade-in-up [animation-delay:0.1s]">
        Dive into these quirky challenges to earn points, unlock achievements, and make learning even more fun!
      </p>
      <header className="bg-gray-800 border-b border-gray-700">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/dashboard/quests" className="text-xl font-bold text-white">BookWise Quests</Link>
                <div>
                    <Link href="/dashboard/quests" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Quests</Link>
                    <Link href="/dashboard/gremlin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Profile</Link>
                </div>
            </nav>
        </header>
    </div>
  );
};

export default ChallengePage;