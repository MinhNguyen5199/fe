'use client';

import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase/client';
import { useState } from 'react';

export default function EmailVerificationBanner() {
    const { user } = useAuth();
    const [notification, setNotification] = useState('');

    const handleResendVerification = async () => {
        if (user?.email) {
            try {
                await supabase.auth.resend({
                    type: 'signup',
                    email: user.email,
                });
                setNotification('A new verification link has been sent to your email.');
            } catch (error) {
                setNotification('Failed to send new link. Please try again shortly.');
            }
        }
    };

    if (user && !user.email_confirmed_at) {
        return (
            <div className="w-full p-4 bg-yellow-100 text-yellow-800 text-center text-sm">
                Your email is not verified. Please check your inbox for the verification link.
                <button onClick={handleResendVerification} className="ml-2 font-bold underline hover:text-yellow-900">
                    Resend Link
                </button>
                {notification && <p className="mt-2">{notification}</p>}
            </div>
        );
    }

    return null;
}