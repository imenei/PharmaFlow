'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api/client'

export default function PharmacistDashboard() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      apiFetch<{ suppliers: any[] }>('/catalog/suppliers'),
      apiFetch<any[]>('/catalog/offers'),
    ])
      .then(([supplierData, offerData]) => {
        setSuppliers(supplierData.suppliers || [])
        setOffers(offerData || [])
      })
      .catch(console.error)
  }, [])

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Pharmacien</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble des offres et fournisseurs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/pharmacist/offers" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600">Offres recentes</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{offers.length}</div>
        </Link>
        <Link href="/pharmacist/suppliers" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600">Fournisseurs actifs</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{suppliers.length}</div>
        </Link>
        <Link href="/pharmacist/listings-search" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-600">Recherche produits</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">PDF</div>
        </Link>
      </div>
    </div>
  )
}
