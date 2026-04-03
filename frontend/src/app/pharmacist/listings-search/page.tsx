'use client'

import { useMemo, useState } from 'react'
import { Search, FileText, Building2, Phone, Mail, Eye, Download } from 'lucide-react'
import { apiFetch } from '@/lib/api/client'

interface ListingResult {
  id: string
  title: string
  pdf_url: string
  views: number
  downloads: number
  created_at: string
  total_products: number
  matching_products_count: number
  products: {
    product_name: string
    price?: number
    quantity?: number
  }[]
  supplier: {
    id: string
    name: string
    tier?: string
    wilaya?: string
    logo_url?: string
    contact_phone?: string
    contact_email?: string
  }
}

export default function ListingsSearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ListingResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const searchTerms = useMemo(
    () =>
      query
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [query],
  )

  const handleSearch = async () => {
    if (searchTerms.length === 0) {
      setResults([])
      setSearched(true)
      return
    }

    try {
      setLoading(true)
      const data = await apiFetch<{ listings: ListingResult[] }>('/catalog/listings/search', {
        method: 'POST',
        body: JSON.stringify({ products: searchTerms }),
      })
      setResults(data.listings || [])
      setSearched(true)
    } catch (error: any) {
      alert(error.message || 'Erreur de recherche')
    } finally {
      setLoading(false)
    }
  }

  const handleTrackView = async (listingId: string) => {
    try {
      await apiFetch(`/catalog/listings/${listingId}/view`, {
        method: 'POST',
      })
    } catch {}
  }

  const handleTrackDownload = async (listingId: string, pdfUrl: string) => {
    try {
      await apiFetch(`/catalog/listings/${listingId}/download`, {
        method: 'POST',
      })
    } catch {}

    window.open(pdfUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Recherche de Catalogues</h1>
          <p className="text-gray-600">
            Recherchez des produits dans les listings fournisseurs. Separez plusieurs produits par des virgules.
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">Produits</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Doliprane, Amoxicilline, Vitamine C"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-green-500 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </div>

        {searched && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{results.length} resultat(s)</h2>
            </div>

            <div className="space-y-6">
              {results.map((listing) => (
                <div key={listing.id} className="rounded-xl border-2 border-gray-200 p-6 hover:shadow-md">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <FileText className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building2 className="mr-1 h-4 w-4" />
                          {listing.supplier.name}
                        </div>
                        <div>{listing.supplier.wilaya || '-'}</div>
                        <div className="flex items-center">
                          <Eye className="mr-1 h-4 w-4" />
                          {listing.views} vues
                        </div>
                        <div className="flex items-center">
                          <Download className="mr-1 h-4 w-4" />
                          {listing.downloads} telechargements
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                        {listing.supplier.contact_phone && (
                          <div className="flex items-center">
                            <Phone className="mr-1 h-4 w-4" />
                            {listing.supplier.contact_phone}
                          </div>
                        )}
                        {listing.supplier.contact_email && (
                          <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            {listing.supplier.contact_email}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-700">
                          Produits correspondants : {listing.matching_products_count} / {listing.total_products}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {listing.products.slice(0, 8).map((product, index) => (
                          <span
                            key={`${listing.id}-${index}`}
                            className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                          >
                            {product.product_name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleTrackView(listing.id)}
                        className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                      >
                        Enregistrer vue
                      </button>
                      <button
                        onClick={() => handleTrackDownload(listing.id, listing.pdf_url)}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Ouvrir PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {results.length === 0 && (
                <div className="py-16 text-center text-gray-500">
                  <FileText className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                  <p className="mb-2 text-xl font-medium">Aucun catalogue trouve</p>
                  <p className="text-sm">Essaie avec d'autres noms de produits.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
