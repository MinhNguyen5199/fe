// app/api/auth/confirm/page.tsx
'use client'

import { Suspense } from 'react'
import ConfirmPage from './ConfirmPage'

export default function ConfirmPageWrapper() {
  return (
    <Suspense fallback={<p className="text-center mt-20">🔄 Verifying your session...</p>}>
      <ConfirmPage />
    </Suspense>
  )
}
