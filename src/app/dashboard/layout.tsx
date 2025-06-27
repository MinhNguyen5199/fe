'use client';

import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Gem, Gamepad, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/ui/Header';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, signOut, loading } = useAuth();

  const dashboardNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Generate Summary', href: '/dashboard/summary', icon: FileText },
    { name: 'Upgrade Plan', href: '/dashboard/upgrade', icon: Gem },
    { name: 'Silly Sh!t Challenge', href: '/dashboard/challenge', icon: Gamepad },
    { name: 'Account Settings', href: '/views/account', icon: Settings },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/views/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        Loading Dashboard...
      </div>
    );
  }

  const avatarInitial = userProfile?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />
      <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 shadow-xl p-6 pt-10 rounded-r-2xl border-r dark:border-gray-800 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <img
            src={`https://placehold.co/100x100/A78BFA/FFFFFF?text=${avatarInitial}`}
            alt={userProfile.username || 'User Avatar'}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{userProfile.username || userProfile.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{userProfile.current_tier} Plan</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {dashboardNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={signOut} className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow pt-24 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;