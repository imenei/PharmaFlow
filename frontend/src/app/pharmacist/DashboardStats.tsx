// app/(pharmacist)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Package, Users, AlertCircle, TrendingUp } from 'lucide-react'

export default async function PharmacistDashboard() {
  // ✅ correction : await
  const supabase = await createClient()

  const [
    { data: recentOffers },
    { data: suppliers },
    { data: lowStockProducts },
    { data: allProducts }
  ] = await Promise.all([
    supabase
      .from('offers')
      .select('id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('suppliers')
      .select('id')
      .eq('is_approved', true),
    supabase
      .from('listing_products')
      .select('id')
      .lt('quantity', 10),
    supabase
      .from('listing_products')
      .select('id')
  ])

  const stats = [
    {
      title: 'Offres Récentes',
      value: recentOffers?.length || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Fournisseurs Actifs',
      value: suppliers?.length || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Stocks Faibles',
      value: lowStockProducts?.length || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Produits',
      value: allProducts?.length || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Pharmacien</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Fonctionnalités Pharmacien</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Gestion des Stocks</h3>
            <p className="text-sm text-gray-600">Gérez vos médicaments</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Commandes</h3>
            <p className="text-sm text-gray-600">Suivez vos commandes</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">Fournisseurs</h3>
            <p className="text-sm text-gray-600">Consultez les offres</p>
          </div>
        </div>
      </div>
    </div>
  )
}
