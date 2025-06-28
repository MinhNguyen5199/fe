'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Zap, DollarSign, TrendingUp, ArrowRight, FileText, Gamepad, Clock } from 'lucide-react';

const DashboardHomePage = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <div>Loading user data...</div>;
  }

  const recentActivity = [
    { id: 1, type: 'summary', title: 'The Lean Startup', date: '2 hours ago' },
    { id: 2, type: 'summary', title: 'Atomic Habits', date: '1 day ago' },
  ];

  const nextBillingDate = userProfile.subscriptions?.[0]?.expires_at
    ? new Date(userProfile.subscriptions[0].expires_at * 1000).toLocaleDateString()
    : 'N/A';

  return (
    <div className="space-y-10 py-4">
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
        Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{userProfile.username || userProfile.email}</span>!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Summaries Generated</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">125</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">AI Credits</h3>
          <Zap className="w-6 h-6 text-rose-500" />
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">Unlimited</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Current Plan</h3>
          <DollarSign className="w-6 h-6 text-amber-500" />
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-50 capitalize">{userProfile.current_tier}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Next Billing Date</h3>
          <Clock className="w-6 h-6 text-cyan-500" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{nextBillingDate}</p>
        </div>
      </div>

      {userProfile.current_tier !== 'vip' && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Unlock Your Full Potential!</h3>
              <p className="text-lg opacity-90">Upgrade to unlock all features.</p>
            </div>
            <Link
  href="/dashboard/upgrade"
  className="inline-flex flex-wrap items-center px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg mt-4 sm:mt-0"
>
  Upgrade Plan <ArrowRight className="ml-2 w-5 h-5" />
</Link>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Recent Activity</h3>
        <div className="overflow-x-auto">
  <ul className="min-w-[320px] divide-y divide-gray-200 dark:divide-gray-700">
    {recentActivity.map((activity) => (
      <li key={activity.id} className="py-4 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-5 h-5 mr-3 text-indigo-500" />
          <p className="font-medium">{activity.title}</p>
        </div>
        <p className="text-sm text-gray-500">{activity.date}</p>
      </li>
    ))}
  </ul>
</div>
      </div>
    </div>
  );
};

export default DashboardHomePage;