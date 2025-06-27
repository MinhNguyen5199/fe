'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { LogIn } from 'lucide-react';

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      disabled={loading}
    >
      {loading ? (
        'Redirecting...'
      ) : (
        <>
          <LogIn className="mr-2 h-5 w-5"/>
          Sign In with Google
        </>
      )}
    </button>
  );
}