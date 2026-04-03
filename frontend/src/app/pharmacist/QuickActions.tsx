// app/pharmacist/QuickActions.tsx
export default function QuickActions() {
  const actions = [
    {
      title: 'Gérer le Stock',
      description: 'Ajouter ou modifier des produits',
      icon: '📦',
      color: 'bg-blue-100 text-blue-600',
      href: '/pharmacist/inventory'
    },
    {
      title: 'Passer Commande',
      description: 'Commander auprès des fournisseurs',
      icon: '🛒',
      color: 'bg-green-100 text-green-600',
      href: '/pharmacist/orders'
    },
    {
      title: 'Consulter les Offres',
      description: 'Voir les promotions en cours',
      icon: '📋',
      color: 'bg-purple-100 text-purple-600',
      href: '/pharmacist/offers'
    },
    {
      title: 'Analytics',
      description: 'Statistiques et rapports',
      icon: '📊',
      color: 'bg-orange-100 text-orange-600',
      href: '/pharmacist/analytics'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center p-4 rounded-lg border hover:shadow-md transition-shadow hover:border-gray-300"
          >
            <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}>
              <span className="text-xl">{action.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
            <div className="text-gray-400">→</div>
          </a>
        ))}
      </div>
    </div>
  )
}