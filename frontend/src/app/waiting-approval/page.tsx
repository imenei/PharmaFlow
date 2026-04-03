'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api/client'
import { clearAccessToken, getCurrentUser } from '@/lib/auth/session'

export default function WaitingApproval() {
  const router = useRouter()
  const [status, setStatus] = useState('pending')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const user = getCurrentUser<any>()
    if (user?.email) setEmail(user.email)

    const check = async () => {
      try {
        const me = await apiFetch<any>('/users/me')
        setStatus(me.status)
        setRole(me.role)
        setEmail(me.email)

        if (me.status === 'approved') {
          if (me.role === 'admin') router.push('/admin/dashboard')
          else if (me.role === 'supplier') router.push('/supplier/dashboard')
          else router.push('/pharmacist/dashboard')
        }
      } catch {
        router.push('/auth/signin')
      }
    }

    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">En attente d'approbation</h1>
          <p className="text-gray-600 mt-2">Email: {email || '-'}</p>
          {role && <p className="text-sm text-gray-500">Role: {role}</p>}
        </div>

        <div className="text-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 mb-2">
            Votre compte est actuellement <strong>{status}</strong>.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Verifier le statut
          </button>
          <button
            onClick={() => {
              clearAccessToken()
              router.push('/auth/signin')
            }}
            className="w-full text-gray-600 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Se deconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
