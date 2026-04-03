'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/api/client'

export default function SignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'supplier' ? 'supplier' : 'pharmacist'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    companyName: '',
    phone: '',
    wilaya: '',
    address: '',
    role: defaultRole,
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
        skipAuth: true,
      })
      router.push('/waiting-approval')
    } catch (error: any) {
      alert(error.message || 'Erreur inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Creer un compte</h1>
        <p className="text-gray-600 mb-8">Conserve le meme design, mais avec une logique propre sur PostgreSQL direct.</p>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <input className="px-4 py-3 border rounded-lg" placeholder="Societe" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          <input className="px-4 py-3 border rounded-lg" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="px-4 py-3 border rounded-lg" placeholder="Telephone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="px-4 py-3 border rounded-lg" placeholder="Wilaya" value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} />
          <input className="md:col-span-2 px-4 py-3 border rounded-lg" placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="px-4 py-3 border rounded-lg" placeholder="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="px-4 py-3 border rounded-lg" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="pharmacist">Pharmacien</option>
            <option value="supplier">Fournisseur</option>
          </select>

          <button type="submit" disabled={loading} className="md:col-span-2 bg-[#2E7D32] text-white py-3 rounded-lg hover:bg-[#1B5E20] disabled:opacity-50">
            {loading ? 'Creation...' : 'Creer mon compte'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Deja inscrit ?{' '}
          <Link href="/auth/signin" className="text-[#2E7D32] font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
