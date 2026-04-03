// app/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    console.log('🔄 Redirecting from /login to /pharmacist/dashboard')
    // Utiliser replace pour éviter l'historique de navigation
    router.replace('/pharmacist/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la page de connexion...</p>
      </div>
    </div>
  )
}