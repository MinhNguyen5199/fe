'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../lib/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();

    if (!currentSession) {
      setUserProfile(null);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/get-user-profile', {
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
      });

      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        return;
      }

      if (!response.ok) {
        throw new Error("Could not fetch user profile");
      }

      const { data } = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        await fetchUserProfile();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (event === "SIGNED_IN") {
          await fetchUserProfile();
        } else if (event === "SIGNED_OUT") {
          setUserProfile(null);
          router.push('/views/auth/login');
        } else if (event === "TOKEN_REFRESHED") {
          await fetchUserProfile();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, fetchUserProfile]);

  const value = {
    user: session?.user ?? null,
    session,
    userProfile,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading Application...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}