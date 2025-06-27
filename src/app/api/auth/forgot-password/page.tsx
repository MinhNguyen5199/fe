'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/confirm?next=/views/account/update-password`,
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-semibold mb-4">Reset your password</h1>

      {success ? (
        <p className="text-green-600">
          ✅ Check your email for a reset link.
        </p>
      ) : (
        <>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-black dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={handleReset}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-md"
          >
            Send reset link
          </button>
        </>
      )}
    </div>
  )
}