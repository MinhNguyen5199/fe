'use client'

import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import GoogleSignInButton from '../../../components/auth/GoogleSignInButton';
import AuthForm from '../../../components/auth/AuthForm';

export default function LoginContent() {
  const { user, userProfile, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loginFormLoading, setLoginFormLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unverified') {
      setPageError('You must verify your email before signing in. Please check your inbox.');
    }
  }, [searchParams]);

  const handleEmailLogin = async (formData: { email: string; password: string }) => {
    setLoginFormLoading(true);
    setPageError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setPageError('You must verify your email before signing in. Please check your inbox.');
        } else {
          setPageError('Invalid email or password.');
        }
      }
    } catch {
      setPageError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginFormLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Sign In to ISummarize</h1>
            <p className="text-gray-500">Welcome back!</p>
          </div>

          {pageError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4">
              {pageError}
            </div>
          )}

          <AuthForm type="login" onSubmit={handleEmailLogin} loading={loginFormLoading} />

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <GoogleSignInButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <p>Logged in as: {user.email}</p>
        {/* <p>User ID: {user.id}</p>
        <div className="mt-4 p-4 border rounded-md bg-gray-50 text-left">
          <h3 className="text-lg font-semibold mb-2">User Profile from DB:</h3>
          {userProfile ? (
            <pre className="text-sm overflow-auto max-h-60 bg-gray-100 p-2 rounded">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          ) : (
            <p>Loading profile...</p>
          )}
        </div> */}
        <button
          onClick={signOut}
          className="mt-6 py-2 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
