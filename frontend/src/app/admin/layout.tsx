// app/admin/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Gestion des utilisateurs',
  description: 'Tableau de bord administrateur pour la gestion des utilisateurs',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[#2E7D32]">EI Saldaliya</h1>
              <span className="ml-4 text-sm text-gray-500">Espace Administrateur</span>
            </div>
            <div className="flex space-x-4">
              <a href="/admin/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="/auth/signin" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
                Déconnexion
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}