'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, Building2, Star, RefreshCw, Phone, Mail, Eye, DownloadCloud, Gift, User } from 'lucide-react'
import { apiFetch, getApiBaseUrl } from '@/lib/api/client'

interface Supplier {
  id: string
  name: string
  address: string
  wilaya: string
  contact_email?: string
  contact_phone?: string
  description?: string
  logo_url?: string
  rating: number
  reviews_count: number
  total_views: number
  total_downloads: number
  listings_count: number
  active_offers: number
}

interface Wilaya {
  code: number
  nom: string
}

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWilaya, setSelectedWilaya] = useState('')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await apiFetch<{ suppliers: Supplier[]; wilayas?: Wilaya[] }>('/catalog/suppliers', {
        cache: 'no-cache',
      })

      setSuppliers(data.suppliers || [])
      setWilayas(data.wilayas || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedWilaya === '' || supplier.wilaya === selectedWilaya),
    )
  }, [suppliers, searchTerm, selectedWilaya])

  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  const handleViewProfile = (supplierId: string) => {
    window.location.href = `/pharmacist/suppliers/${supplierId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-green-600" />
            <p className="text-gray-600">Chargement des fournisseurs...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-bold text-red-700">Erreur de chargement</h2>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reessayer
          </button>
          <p className="mt-4 text-sm text-gray-600">API: {getApiBaseUrl()}/catalog/suppliers</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Fournisseurs</h1>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Rechercher un fournisseur</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom du fournisseur..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Wilaya</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                value={selectedWilaya}
                onChange={(event) => setSelectedWilaya(event.target.value)}
              >
                <option value="">Toutes les wilayas</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.nom}>
                    {wilaya.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchData}
                className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{filteredSuppliers.length} fournisseur(s) trouve(s)</h2>
          </div>

          <div className="space-y-6">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="rounded-xl border-2 border-gray-200 p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start space-x-4">
                    {supplier.logo_url ? (
                      <img src={supplier.logo_url} alt={supplier.name} className="h-20 w-20 rounded-xl border-2 border-gray-200 object-cover" />
                    ) : (
                      <div className="rounded-xl border-2 border-gray-200 bg-gray-100 p-4">
                        <Building2 className="h-8 w-8 text-gray-600" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{supplier.name}</h3>
                      </div>

                      <div className="mb-2 flex items-center text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="font-medium">{supplier.wilaya}</span> • {supplier.address}
                      </div>

                      {supplier.description && <p className="mb-4 line-clamp-2 text-gray-700">{supplier.description}</p>}

                      <div className="mb-3 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="mr-1 h-4 w-4" />
                          {formatNumber(supplier.total_views)} vues
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DownloadCloud className="mr-1 h-4 w-4" />
                          {formatNumber(supplier.total_downloads)} telech.
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="mr-1 h-4 w-4" />
                          {supplier.listings_count} catalogues
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Gift className="mr-1 h-4 w-4" />
                          {supplier.active_offers} offres
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {supplier.contact_phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-4 w-4" />
                              {supplier.contact_phone}
                            </div>
                          )}
                          {supplier.contact_email && (
                            <div className="flex items-center">
                              <Mail className="mr-1 h-4 w-4" />
                              {supplier.contact_email}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-600">
                            {supplier.rating > 0 ? supplier.rating.toFixed(1) : 'N/A'}
                            <span className="ml-1 text-gray-400">({supplier.reviews_count})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => handleViewProfile(supplier.id)}
                      className="flex items-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-700 hover:shadow-md"
                    >
                      <User className="mr-2 h-5 w-5" />
                      Voir le Profil
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSuppliers.length === 0 && (
              <div className="py-16 text-center text-gray-500">
                <Building2 className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                <p className="mb-2 text-xl font-medium">Aucun fournisseur trouve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
