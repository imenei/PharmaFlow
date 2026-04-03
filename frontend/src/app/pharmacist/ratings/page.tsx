'use client'

import { useEffect, useMemo, useState } from 'react'
import { Building2, MapPin, Phone, Mail, Star, RefreshCw } from 'lucide-react'
import { apiFetch } from '@/lib/api/client'

interface Supplier {
  id: string
  companyName?: string
  wilaya?: string
  phone?: string
  email?: string
  description?: string
  avatarUrl?: string
  listingsCount: number
  activeOffers: number
  rating: number
  reviewsCount: number
  totalViews: number
  totalDownloads: number
}

export default function RatingsPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [scores, setScores] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<{ suppliers: Supplier[] }>('/pharmacists/suppliers')
      setSuppliers(data.suppliers || [])
    } catch (error: any) {
      alert(error.message || 'Erreur lors du chargement des fournisseurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return suppliers

    return suppliers.filter((supplier) => {
      return (
        (supplier.companyName || '').toLowerCase().includes(term) ||
        (supplier.wilaya || '').toLowerCase().includes(term) ||
        (supplier.description || '').toLowerCase().includes(term)
      )
    })
  }, [suppliers, search])

  const setScore = (supplierId: string, score: number) => {
    setScores((prev) => ({ ...prev, [supplierId]: score }))
  }

  const setComment = (supplierId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [supplierId]: comment }))
  }

  const submitRating = async (supplierId: string) => {
    const score = scores[supplierId]
    if (!score || score < 1 || score > 5) {
      alert('Choisis une note entre 1 et 5')
      return
    }

    try {
      setSubmittingId(supplierId)
      await apiFetch('/pharmacists/ratings', {
        method: 'POST',
        body: JSON.stringify({
          supplierId,
          score,
          comment: comments[supplierId] || '',
        }),
      })
      alert('Note enregistree')
      await fetchSuppliers()
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'enregistrement de la note")
    } finally {
      setSubmittingId(null)
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Noter les fournisseurs</h1>
          <p className="text-gray-600">Les fournisseurs affiches ici viennent du backend PostgreSQL/NestJS.</p>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, wilaya ou description..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={fetchSuppliers}
              className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
            >
              Actualiser
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start gap-4">
                {supplier.avatarUrl ? (
                  <img
                    src={supplier.avatarUrl}
                    alt={supplier.companyName || 'Supplier'}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="rounded-xl bg-gray-100 p-4">
                    <Building2 className="h-10 w-10 text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{supplier.companyName || 'Fournisseur'}</h2>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    {supplier.wilaya && (
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {supplier.wilaya}
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center">
                        <Phone className="mr-1 h-4 w-4" />
                        {supplier.phone}
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4" />
                        {supplier.email}
                      </div>
                    )}
                  </div>

                  {supplier.description && (
                    <p className="mt-3 text-sm text-gray-700">{supplier.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>{supplier.listingsCount} catalogues</span>
                    <span>{supplier.activeOffers} offres</span>
                    <span>{supplier.totalViews} vues</span>
                    <span>{supplier.totalDownloads} telechargements</span>
                    <span>
                      Moyenne: {supplier.rating > 0 ? supplier.rating.toFixed(1) : 'N/A'} ({supplier.reviewsCount}{' '}
                      avis)
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="mb-3 text-sm font-medium text-gray-700">Donner une note</p>

                <div className="mb-4 flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const active = (scores[supplier.id] || 0) >= score
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setScore(supplier.id, score)}
                        className="rounded-md p-1"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            active ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>

                <textarea
                  value={comments[supplier.id] || ''}
                  onChange={(e) => setComment(supplier.id, e.target.value)}
                  rows={4}
                  placeholder="Commentaire optionnel..."
                  className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />

                <button
                  onClick={() => submitRating(supplier.id)}
                  disabled={submittingId === supplier.id}
                  className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {submittingId === supplier.id ? 'Enregistrement...' : 'Envoyer la note'}
                </button>
              </div>
            </div>
          ))}

          {filteredSuppliers.length === 0 && (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">Aucun fournisseur trouve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
