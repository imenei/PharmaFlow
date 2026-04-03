'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api/client'
import { setCurrentUser } from '@/lib/auth/session'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    apiFetch('/users/me').then(setProfile).catch(console.error)
  }, [])

  const save = async () => {
    setCurrentUser(profile)
    alert('Le profil pharmacien est actuellement gere localement. Relie-le a un endpoint dedie si tu veux edition serveur.');
  }

  if (!profile) return <div className="p-6">Chargement...</div>

  return (
    <div className="max-w-3xl bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-2xl font-bold mb-6">Profil Pharmacien</h1>
      <div className="grid gap-4">
        <input className="px-4 py-3 border rounded-lg" value={profile.companyName || profile.company_name || ''} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} />
        <input className="px-4 py-3 border rounded-lg" value={profile.email || ''} disabled />
        <input className="px-4 py-3 border rounded-lg" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        <input className="px-4 py-3 border rounded-lg" value={profile.wilaya || ''} onChange={(e) => setProfile({ ...profile, wilaya: e.target.value })} />
        <input className="px-4 py-3 border rounded-lg" value={profile.address || ''} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        <button onClick={save} className="bg-[#2E7D32] text-white py-3 rounded-lg">Enregistrer</button>
      </div>
    </div>
  )
}
