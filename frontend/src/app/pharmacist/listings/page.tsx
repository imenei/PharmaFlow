// app/pharmacist/listings-search/page.tsx
'use client'

import { useState } from 'react'
import { Search, Download, FileText, Building2, Star, Filter } from 'lucide-react'

interface Listing {
  id: string
  title: string
  supplier_name: string
  subscription_tier: 'gold' | 'silver' | 'bronze'
  product_count: number
  pdf_url: string
  products: string[]
}

export default function ListingsSearchPage() {
  const [searchProducts, setSearchProducts] = useState(['', '', '', '', ''])
  const [listings] = useState<Listing[]>([
    {
      id: '1',
      title: 'Catalogue Médicaments 2024',
      supplier_name: 'Pharmacie Centrale',
      subscription_tier: 'gold',
      product_count: 1500,
      pdf_url: '/catalogues/catalogue.pdf',
      products: ['Paracétamol', 'Ibuprofène', 'Amoxicilline', 'Vitamine C', 'Aspirine']
    },
    // ... autres listings
  ])

  const updateProductSearch = (index: number, value: string) => {
    const newProducts = [...searchProducts]
    newProducts[index] = value
    setSearchProducts(newProducts)
  }

  const filteredListings = listings.filter(listing =>
    searchProducts.some(product =>
      product && listing.products.some(p =>
        p.toLowerCase().includes(product.toLowerCase())
      )
    )
  ).sort((a, b) => {
    // Priorité aux abonnements gold/silver
    const tierOrder = { gold: 3, silver: 2, bronze: 1 }
    return tierOrder[b.subscription_tier] - tierOrder[a.subscription_tier] ||
           b.product_count - a.product_count
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recherche de Produits</h1>
        <p className="text-gray-600">Recherchez jusqu'à 5 produits dans les listings</p>
      </div>

      {/* Formulaire de recherche */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {searchProducts.map((product, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Produit {index + 1}
              </label>
              <input
                type="text"
                placeholder={`Nom du produit ${index + 1}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={product}
                onChange={(e) => updateProductSearch(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="flex items-center justify-center w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <Filter className="h-4 w-4 mr-2" />
          Rechercher
        </button>
      </div>

      {/* Résultats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {filteredListings.length} listing(s) trouvé(s)
        </h2>

        <div className="space-y-4">
          {filteredListings.map(listing => (
            <div key={listing.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                      listing.subscription_tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      listing.subscription_tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {listing.subscription_tier}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Building2 className="h-4 w-4 mr-1" />
                    {listing.supplier_name}
                  </div>

                  <div className="text-sm text-gray-700 mb-3">
                    <strong>{listing.product_count}</strong> produits dans le catalogue
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {listing.products.slice(0, 5).map((product, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <a
                    href={listing.pdf_url}
                    download
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </a>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Building2 className="h-4 w-4 mr-2" />
                    Profil
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Aucun résultat trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}