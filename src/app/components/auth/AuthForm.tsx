'use client';

import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (formData: { email: string, password: string }) => void;
  loading: boolean;
}

export default function AuthForm({ type, onSubmit, loading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-8">{type === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
      
      <div className="mb-6 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Mail className="h-5 w-5 text-gray-400" /></div>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full rounded-full py-3 pl-10 pr-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500"/>
      </div>

      <div className="mb-6 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Lock className="h-5 w-5 text-gray-400" /></div>
        <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full rounded-full py-3 pl-10 pr-4 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500"/>
        
        {type === 'login' && (
            <div className="text-right mt-2 text-sm">
                <Link href="/api/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Forgot password?
                </Link>
            </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-6 py-3 font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400">
        {loading ? 'Processing...' : (type === 'login' ? <><LogIn className="mr-2"/>Sign In</> : <><UserPlus className="mr-2"/>Register</>)}
      </button>

      <p className="mt-8 text-center text-sm">
        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        <Link href={type === 'login' ? '/views/auth/register' : '/views/auth/login'} className="font-medium text-indigo-600 hover:underline">
          {type === 'login' ? 'Sign Up' : 'Sign In'}
        </Link>
      </p>
    </form>
  );
};