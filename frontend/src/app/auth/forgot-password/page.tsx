'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // ✅ AJOUT: Créer le client Supabase
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("📧 Un email de réinitialisation a été envoyé.")
    }

    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#E8F5E9]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Mot de passe oublié
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Votre email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] text-white py-3 rounded-lg hover:bg-[#1B5E20] disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </div>
    </div>
  )
}