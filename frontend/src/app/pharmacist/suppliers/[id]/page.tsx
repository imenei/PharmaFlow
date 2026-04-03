'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, MapPin, Building2, Star, RefreshCw, Phone, Mail, Eye, DownloadCloud, Gift, User } from 'lucide-react'
import { trackSupplierView } from '@/utils/trackSupplierView'

interface Supplier {
  id: string
  name: string
  address: string
  wilaya: string
  contact_email?: string
  contact_phone?: string
  description?: string
  logo_url?: string
  subscription_tier: string
  subscription_name?: string
  rating: number
  reviews_count: number
  total_views: number
  total_downloads: number
  listings_count: number
  active_offers: number
  has_active_subscription: boolean
  created_at: string
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const supabase = createClient()

  const fetchData = useCallback(async (isRefresh = false) => {
    console.log('🚀 fetchData appelé, isRefresh:', isRefresh)
    
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      console.log('📥 Début du chargement des wilayas...')
      
      // 🔧 Charger les wilayas
      const { data: wilayasData, error: wilayasError } = await supabase
        .from('wilayas')
        .select('code, nom')
        .order('nom')
        .limit(50)

      if (wilayasError) {
        console.warn('⚠️ Erreur wilayas:', wilayasError)
      } else {
        console.log(`✅ ${wilayasData?.length || 0} wilayas chargées`)
        setWilayas(wilayasData || [])
      }

      // 🔧 Charger les fournisseurs
      console.log('📥 Début du chargement des fournisseurs...')
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('profiles')
        .select(`
          id,
          company_name,
          address,
          wilaya,
          contact_email,
          contact_phone,
          description,
          logo_url,
          subscription_tier,
          subscription_name,
          rating,
          reviews_count,
          total_views,
          total_downloads,
          listings_count,
          active_offers,
          has_active_subscription,
          created_at
        `)
        .eq('role', 'supplier')
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (suppliersError) {
        console.error('❌ Erreur fournisseurs:', suppliersError)
        throw new Error(`Erreur Supabase: ${suppliersError.message}`)
      }

      console.log(`✅ ${suppliersData?.length || 0} fournisseurs chargés`)
      
      // Transformer les données
      const transformedSuppliers: Supplier[] = (suppliersData || []).map(supplier => ({
        id: supplier.id,
        name: supplier.company_name || 'Fournisseur sans nom',
        address: supplier.address || 'Adresse non spécifiée',
        wilaya: supplier.wilaya || 'Non spécifiée',
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone,
        description: supplier.description,
        logo_url: supplier.logo_url,
        subscription_tier: supplier.subscription_tier || 'basic',
        subscription_name: supplier.subscription_name,
        rating: supplier.rating || 0,
        reviews_count: supplier.reviews_count || 0,
        total_views: supplier.total_views || 0,
        total_downloads: supplier.total_downloads || 0,
        listings_count: supplier.listings_count || 0,
        active_offers: supplier.active_offers || 0,
        has_active_subscription: supplier.has_active_subscription || false,
        created_at: supplier.created_at
      }))

      console.log('✅ Données transformées, mise à jour du state...')
      setSuppliers(transformedSuppliers)
      console.log('✅ State mis à jour avec succès')

    } catch (err) {
      console.error('❌ Erreur fetchData:', err)
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      console.log('🏁 fetchData terminé, setLoading(false) appelé')
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [supabase])

  useEffect(() => {
    console.log('🎬 useEffect exécuté')
    console.log('📊 État initial - loading:', loading)
    
    const controller = new AbortController()
    let isMounted = true
    
    const loadData = async () => {
      if (isMounted) {
        console.log('🔄 Début du chargement des données...')
        await fetchData()
      }
    }
    
    loadData()
    
    return () => {
      console.log('🧹 Nettoyage useEffect')
      isMounted = false
      controller.abort()
    }
  }, [fetchData])

  // Ajouter un useEffect pour surveiller les changements d'état
  useEffect(() => {
    console.log('🔄 État changé - loading:', loading, 'error:', error, 'suppliers:', suppliers.length)
  }, [loading, error, suppliers])

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedWilaya === '' || supplier.wilaya === selectedWilaya)
  )

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const handleViewProfile = async (supplierId: string) => {
    try {
      await trackSupplierView(supplierId)
    } catch (error) {
      console.warn('Erreur tracking:', error)
    }
    window.location.href = `/pharmacist/suppliers/${supplierId}`
  }

  // SIMPLIFIER L'AFFICHAGE - test rapide
  console.log('🎨 Rendu de la page - loading:', loading)
  
  // Si loading est toujours true après un certain temps, forcer l'affichage
  if (loading) {
    console.log('⏳ Affichage de l\'écran de chargement...')
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Chargement des fournisseurs...</p>
              <p className="text-sm text-gray-400 mt-2">Veuillez patienter</p>
              {/* Ajouter un bouton pour forcer l'affichage en cas de bug */}
              <button
                onClick={() => {
                  console.log('🔄 Forcer l\'affichage - état actuel:', { loading, suppliers: suppliers.length })
                  setLoading(false)
                }}
                className="mt-4 text-xs text-blue-500 underline"
              >
                (Forcer l'affichage si bloqué)
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">Erreur de chargement</div>
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <button
              onClick={() => fetchData()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <div className="h-4 w-4 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Chargement...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  console.log('✅ Affichage du contenu principal')
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Annuaire des Fournisseurs</h1>
          <p className="text-gray-600">Trouvez des fournisseurs de produits pharmaceutiques par wilaya et spécialité</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un fournisseur
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom du fournisseur..."
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wilaya
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
              >
                <option value="">Toutes les wilayas</option>
                {wilayas.map(wilaya => (
                  <option key={wilaya.code} value={wilaya.nom}>
                    {wilaya.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? (
                  <>
                    <div className="h-4 w-4 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Actualisation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredSuppliers.length} fournisseur(s) trouvé(s)
            </h2>
            <div className="text-sm text-gray-500">
              Fournisseurs vérifiés
            </div>
          </div>

          <div className="space-y-6">
            {filteredSuppliers.map(supplier => (
              <div key={supplier.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {supplier.logo_url ? (
                      <img 
                        src={supplier.logo_url} 
                        alt={supplier.name}
                        className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="p-4 rounded-xl bg-gray-100 border-2 border-gray-200">
                        <Building2 className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{supplier.name}</h3>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="font-medium">{supplier.wilaya}</span> • {supplier.address}
                      </div>

                      {supplier.description && (
                        <p className="text-gray-700 mb-4 line-clamp-2">{supplier.description}</p>
                      )}

                      {/* Statistiques */}
                      <div className="flex flex-wrap gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="h-4 w-4 mr-1" />
                          {formatNumber(supplier.total_views)} vues
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DownloadCloud className="h-4 w-4 mr-1" />
                          {formatNumber(supplier.total_downloads)} téléch.
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-1" />
                          {supplier.listings_count} catalogues
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Gift className="h-4 w-4 mr-1" />
                          {supplier.active_offers} offres
                        </div>
                      </div>

                      {/* Contacts et rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {supplier.contact_phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {supplier.contact_phone}
                            </div>
                          )}
                          {supplier.contact_email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {supplier.contact_email}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-600">
                            {supplier.rating > 0 ? supplier.rating.toFixed(1) : 'N/A'} 
                            <span className="text-gray-400 ml-1">({supplier.reviews_count})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Profil uniquement */}
                  <div className="ml-6">
                    <button 
                      onClick={() => handleViewProfile(supplier.id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center shadow-sm hover:shadow-md"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Voir le Profil
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Building2 className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium mb-2">Aucun fournisseur trouvé</p>
                <p className="text-sm">Essayez de modifier vos critères de recherche ou vérifiez l'orthographe</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}