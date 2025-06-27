'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/views/auth/login'), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-semibold mb-4">Set New Password</h1>

      {success ? (
        <p className="text-green-600">✅ Password updated! Redirecting...</p>
      ) : (
        <>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            New password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-black dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={handleUpdate}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md"
          >
            Update password
          </button>
        </>
      )}
    </div>
  );
}