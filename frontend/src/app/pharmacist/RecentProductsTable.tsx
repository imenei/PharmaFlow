// app/pharmacist/RecentProductsTable.tsx
interface RecentProductsTableProps {
  products: any[]
}

export default function RecentProductsTable({ products }: RecentProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
        <p className="text-gray-500">Aucun produit récent</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Produits Récemment Ajoutés</h2>
        <span className="text-sm text-gray-500">Dernières entrées</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Produit</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stock</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fournisseur</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{product.product_name}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.quantity === 0 
                      ? 'bg-red-100 text-red-800' 
                      : product.quantity < 10
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.quantity} unités
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {product.suppliers?.name || 'N/A'}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  {new Date(product.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}