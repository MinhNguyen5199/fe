// app/api/auth/confirm/ConfirmPage.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase/client'

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const verifyToken = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type') as 'recovery' | 'signup' | 'magiclink' | null
      const next = searchParams.get('next') ?? '/'

      if (!token_hash || !type) {
        router.replace('/auth/auth-code-error')
        return
      }

      const { error } = await supabase.auth.verifyOtp({ token_hash, type })

      if (error) {
        console.error('Verification error:', error.message)
        router.replace('/auth/auth-code-error')
      } else {
        router.replace(next)
      }
    }

    verifyToken()
  }, [searchParams, router])

  return <p className="text-center mt-20">🔄 Verifying your session...</p>
}
