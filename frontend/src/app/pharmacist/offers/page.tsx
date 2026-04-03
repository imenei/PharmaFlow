'use client'

import { useEffect, useState } from 'react'
import { Search, Download, Calendar, Tag, Building2, Clock, Mail, Phone, MapPin } from 'lucide-react'
import { apiFetch } from '@/lib/api/client'

interface Offer {
  id: string
  title: string
  supplier_name: string
  supplier_id: string
  description: string
  image_url: string
  views: number
  created_at: string
  expires_at: string
  is_expired: boolean
  pdf_url: string
  supplier_info?: {
    email?: string
    phone?: string
    wilaya?: string
    avatar_url?: string
  } | null
}

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = async (search: string = '') => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = search ? `?search=${encodeURIComponent(search)}` : ''
      const data = await apiFetch<Offer[]>(`/catalog/offers${queryParams}`)
      setOffers(data)
    } catch (err) {
      console.error('Erreur fetchOffers:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchOffers(searchTerm), 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleDownload = async (offerId: string, offerTitle: string) => {
    try {
      await apiFetch('/catalog/offers/track-view', {
        method: 'POST',
        body: JSON.stringify({ offerId }),
      })

      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === offerId ? { ...offer, views: offer.views + 1 } : offer
        )
      )

      console.log(`Telechargement de l'offre: ${offerTitle}`)
    } catch (downloadError) {
      console.error('Erreur lors du suivi du telechargement:', downloadError)
    }
  }

  const handleExpiredOfferClick = (event: React.MouseEvent) => {
    event.preventDefault()
    alert("Cette offre a expire et ne peut pas etre telechargee.")
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const isExpiringSoon = (expiresAt: string) => {
    const expireDate = new Date(expiresAt)
    const today = new Date()
    const diffTime = expireDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Erreur: {error}</div>
          <button
            onClick={() => fetchOffers()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Reessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Offres des Fournisseurs</h1>
        <p className="text-gray-600">Consultez les offres promotionnelles des fournisseurs approuves</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, description ou fournisseur..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            {offers.length} offre(s) trouvee(s) pour "{searchTerm}"
          </p>
        )}
      </div>

      <div className="space-y-6">
        {offers.map((offer) => {
          const expiringSoon = isExpiringSoon(offer.expires_at)
          const expired = offer.is_expired

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                expired ? 'border-l-gray-300 opacity-60' : expiringSoon ? 'border-l-orange-500' : 'border-l-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Tag className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                    {expired && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Expiree</span>
                    )}
                    {expiringSoon && !expired && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                        Bientot expiree
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{offer.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Publie le {formatDate(offer.created_at)}
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Expire le {formatDate(offer.expires_at)}
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2 min-w-[120px]">
                  {expired ? (
                    <button
                      onClick={handleExpiredOfferClick}
                      className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Expiree
                    </button>
                  ) : (
                    <a
                      href={offer.pdf_url}
                      download={`offre-${offer.title.replace(/\s+/g, '-')}.pdf`}
                      onClick={() => handleDownload(offer.id, offer.title)}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Telecharger
                    </a>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span
                        className="hover:text-green-600 cursor-pointer font-medium"
                        onClick={() => (window.location.href = `/pharmacist/suppliers/${offer.supplier_id}`)}
                      >
                        {offer.supplier_name}
                      </span>
                    </div>

                    {offer.supplier_info && (
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {offer.supplier_info.wilaya && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {offer.supplier_info.wilaya}
                          </div>
                        )}
                        {offer.supplier_info.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {offer.supplier_info.phone}
                          </div>
                        )}
                        {offer.supplier_info.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {offer.supplier_info.email}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => (window.location.href = `/pharmacist/suppliers/${offer.supplier_id}`)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    Voir profil
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {offers.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">
              {searchTerm ? 'Aucune offre correspondante a votre recherche' : 'Aucune offre disponible pour le moment'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                Les offres apparaitront ici lorsqu&apos;elles seront publiees par les fournisseurs approuves
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
