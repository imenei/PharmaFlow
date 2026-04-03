'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // ✅ AJOUT: Créer le client Supabase
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setMessage("✅ Mot de passe mis à jour. Vous pouvez maintenant vous connecter.")
      setTimeout(() => router.push('/auth/signin'), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#E8F5E9]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Réinitialiser le mot de passe
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            required
            placeholder="Nouveau mot de passe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] text-white py-3 rounded-lg hover:bg-[#1B5E20] disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </form>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </div>
  )
}