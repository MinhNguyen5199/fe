// src/app/context/AuthContext.tsx
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

  const fetchUserProfile = useCallback(async (currentSession: Session) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-user-profile`, {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession) {
          await fetchUserProfile(newSession);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Set initial loading state to false once we have the session
    const setInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if(session) {
        await fetchUserProfile(session);
      }
      setLoading(false);
    }

    setInitialSession();

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
    fetchUserProfile: async () => {
      if(session) {
        await fetchUserProfile(session);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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