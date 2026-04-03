'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api/client'
import { setCurrentUser } from '@/lib/auth/session'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [avatar, setAvatar] = useState<File | null>(null)

  useEffect(() => {
    apiFetch('/supplier/profile').then(setProfile).catch(console.error)
  }, [])

  const save = async () => {
    const formData = new FormData()
    formData.append('companyName', profile.company_name || '')
    formData.append('phone', profile.phone || '')
    formData.append('wilaya', profile.wilaya || '')
    formData.append('address', profile.address || '')
    formData.append('description', profile.description || '')
    if (avatar) formData.append('avatar', avatar)

    const updated = await apiFetch('/supplier/profile', { method: 'PUT', body: formData })
    setProfile(updated)
    setCurrentUser(updated)
    alert('Profil mis a jour')
  }

  if (!profile) return <div className="p-6">Chargement...</div>

  return (
    <div className="max-w-3xl bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-2xl font-bold mb-6">Profil Fournisseur</h1>
      <div className="grid gap-4">
        <input className="px-4 py-3 border rounded-lg" value={profile.company_name || ''} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} />
        <input className="px-4 py-3 border rounded-lg" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        <input className="px-4 py-3 border rounded-lg" value={profile.wilaya || ''} onChange={(e) => setProfile({ ...profile, wilaya: e.target.value })} />
        <input className="px-4 py-3 border rounded-lg" value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        <textarea className="px-4 py-3 border rounded-lg" value={profile.description || ''} onChange={(e) => setProfile({ ...profile, description: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
        <button onClick={save} className="bg-[#2E7D32] text-white py-3 rounded-lg">Enregistrer</button>
      </div>
    </div>
  )
}
