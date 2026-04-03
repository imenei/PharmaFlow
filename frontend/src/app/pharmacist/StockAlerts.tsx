// app/pharmacist/StockAlerts.tsx
interface StockAlertsProps {
  lowStockProducts: any[]
  outOfStockProducts: any[]
}

export default function StockAlerts({ lowStockProducts, outOfStockProducts }: StockAlertsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Alertes de Stock</h2>
      
      {/* Rupture de stock */}
      {outOfStockProducts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              ⛔ Rupture de Stock ({outOfStockProducts.length})
            </div>
          </div>
          <div className="space-y-2">
            {outOfStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-900">{product.product_name}</span>
                <span className="text-xs text-red-700">URGENT</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock faible */}
      {lowStockProducts.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              ⚠️ Stock Faible ({lowStockProducts.length})
            </div>
          </div>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-orange-900">{product.product_name}</span>
                <span className="text-xs text-orange-700">{product.quantity} unités</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
        <div className="text-center py-8">
          <div className="text-green-500 text-4xl mb-4">✅</div>
          <p className="text-gray-600">Aucune alerte de stock</p>
          <p className="text-sm text-gray-500 mt-1">Tous les produits sont bien approvisionnés</p>
        </div>
      )}
    </div>
  )
}