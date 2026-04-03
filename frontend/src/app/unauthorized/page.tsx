// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
        <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <a href="/dashboard" className="text-blue-500 hover:text-blue-700">
          Retour au tableau de bord
        </a>
      </div>
    </div>
  )
}