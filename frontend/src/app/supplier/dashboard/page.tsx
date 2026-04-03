'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api/client'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    apiFetch('/supplier/dashboard').then(setStats).catch(console.error)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="text-sm text-gray-500">Catalogues</div><div className="text-2xl font-bold">{stats?.totalListings ?? 0}</div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="text-sm text-gray-500">Vues</div><div className="text-2xl font-bold">{stats?.totalViews ?? 0}</div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="text-sm text-gray-500">Telechargements</div><div className="text-2xl font-bold">{stats?.totalDownloads ?? 0}</div></div>
        <div className="bg-white p-6 rounded-xl shadow-sm border"><div className="text-sm text-gray-500">Offres</div><div className="text-2xl font-bold">{stats?.totalOffers ?? 0}</div></div>
      </div>
    </div>
  )
}
