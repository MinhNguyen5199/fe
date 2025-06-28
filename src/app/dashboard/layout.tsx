'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Gem,
  Gamepad,
  Settings,
  LogOut,
} from 'lucide-react';
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
    {
      name: 'Silly Sh!t Challenge',
      href: '/dashboard/challenge',
      icon: Gamepad,
    },
  ];

  // Compute avatarInitial safely (fallback 'U')
  const avatarInitial = userProfile?.email?.charAt(0).toUpperCase() || 'U';

  // Always call hooks at the top level
  const [avatarSrc, setAvatarSrc] = useState(
    `https://placehold.co/100x100/A78BFA/FFFFFF?text=${avatarInitial}`
  );

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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />
      <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 shadow-xl p-6 pt-10 rounded-r-2xl border-r dark:border-gray-800 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <Image
            src={avatarSrc}
            alt={userProfile.username || 'User Avatar'}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
            onError={() =>
              setAvatarSrc('https://placehold.co/100x100/666/EEE?text=User')
            }
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {userProfile.username || userProfile.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {userProfile.current_tier} Plan
            </p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {dashboardNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all group
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-yellow-400 text-white shadow-md ring-2 ring-indigo-400/60'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-yellow-300 transition-colors'
                  }          
                `}
              >
                <item.icon
                  className={`
                    w-5 h-5 mr-3
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-yellow-400'
                    }
                  `}
                />
                <span
                  className={`
                    ${
                      isActive
                        ? 'text-white'
                        : 'group-hover:text-black dark:group-hover:text-white'
                    }
                  `}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-grow pt-24 md:ml-64 px-4 sm:px-6 lg:px-8 pb-12">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
