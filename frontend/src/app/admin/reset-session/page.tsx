// app/admin/reset-session/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetSession() {
  const router = useRouter()
  
  // ✅ Créer le client Supabase
  const supabase = createClient()

  useEffect(() => {
    const resetSession = async () => {
      console.log('🔐 Déconnexion forcée...')
      
      // Déconnexion
      await supabase.auth.signOut()
      
      // Nettoyage des cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=')
        if (name.trim().startsWith('sb-') || name.includes('session')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        }
      })

      // Redirection vers la connexion après 1 seconde
      setTimeout(() => {
        router.push('/auth/signin?message=session_reset')
      }, 1000)
    }

    resetSession()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Réinitialisation de la session...</p>
      </div>
    </div>
  )
}