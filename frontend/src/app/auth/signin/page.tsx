'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api/client'
import { setCurrentUser } from '@/lib/auth/session'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await apiFetch<{ user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      })

      setCurrentUser(data.user)

      if (data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (data.user.status !== 'approved') {
        router.push('/waiting-approval')
      } else if (data.user.role === 'supplier') {
        router.push('/supplier/dashboard')
      } else {
        router.push('/pharmacist/dashboard')
      }
    } catch (error: any) {
      alert(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#E8F5E9]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#2E7D32] rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Connectez-vous</h2>
          <p className="mt-2 text-sm text-gray-600">Accedez a votre espace professionnel</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] text-white py-3 px-4 rounded-lg hover:bg-[#1B5E20] disabled:opacity-50 font-medium"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/auth/signup" className="font-medium text-[#2E7D32] hover:text-[#1B5E20]">
                Creer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
