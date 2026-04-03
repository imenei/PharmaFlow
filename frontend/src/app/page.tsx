'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api/client'

// Définition du type pour un fournisseur
interface Supplier {
  id: string
  company_name: string
  wilaya: string
  description?: string
  avatar_url?: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('pharmacist')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [goldSuppliers, setGoldSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  // Fonction pour récupérer les fournisseurs avec abonnement "Or"
  useEffect(() => {
    async function fetchGoldSuppliers() {
      try {
        // Ici, vous devez implémenter l'appel à votre API
        // Exemple avec fetch vers une route API Next.js
        const data = await apiFetch<Supplier[]>('/public/suppliers/gold', { skipAuth: true })
        setGoldSuppliers(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des fournisseurs:', error)
        setGoldSuppliers([])
      } finally {
        setLoading(false)
      }
    }

    fetchGoldSuppliers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      {/* Header avec design moderne */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
                <img src="logo-elsaidalya.png.jpg" alt="ELSAIDALIYA Logo" className="w-8 h-8" />

              <span className="text-xl font-bold text-[#2E7D32]">ELSAIDALIYA</span>
            </div>
            
            {/* Menu mobile */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#2E7D32] p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            <nav className="hidden md:flex space-x-8">
               <a href="#features" className="text-gray-700 hover:text-[#2E7D32] transition duration-200 text-sm font-medium">
                   Fonctionnalités
               </a>
               <a href="#pricing" className="text-gray-700 hover:text-[#2E7D32] transition duration-200 text-sm font-medium">
                    Abonnements
               </a>
               <a href="#about" className="text-gray-700 hover:text-[#2E7D32] transition duration-200 text-sm font-medium">
                    À propos
               </a>
              <Link href="/contact" className="text-gray-700 hover:text-[#2E7D32] transition duration-200 text-sm font-medium">
                    Contact
              </Link>
           </nav>

            <div className="hidden md:flex items-center space-x-3">
              <Link 
                href="/auth/signin" 
                className="bg-[#2E7D32] text-white px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition duration-200 text-sm font-medium shadow-sm"
              >
                Se connecter
              </Link>
            </div>
          </div>

          {/* Menu mobile ouvert */}
          {isMenuOpen && (
            <div className="md:hidden py-4 bg-white rounded-lg mt-2 shadow-lg">
              <div className="flex flex-col space-y-3 px-4">
                <a 
                  href="#features" 
                  className="text-gray-700 hover:text-[#2E7D32] py-2 transition duration-200 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fonctionnalités
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-700 hover:text-[#2E7D32] py-2 transition duration-200 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Abonnements
                </a>
                <a 
                  href="#about" 
                  className="text-gray-700 hover:text-[#2E7D32] py-2 transition duration-200 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  À propos
                </a>
                <Link 
                  href="/contact" 
                  className="text-gray-700 hover:text-[#2E7D32] py-2 transition duration-200 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="border-t border-gray-200 pt-3 flex flex-col space-y-3">
                  <Link 
                    href="/auth/signin" 
                    className="text-gray-700 hover:text-[#2E7D32] transition duration-200 text-sm font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="bg-[#2E7D32] text-white px-4 py-2 rounded-lg hover:bg-[#1B5E20] transition duration-200 text-sm font-medium shadow-sm text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

     {/* Hero Section modifiée */}
{/* Hero Section avec logo et nom */}
<section className="relative h-[80vh] min-h-[600px] overflow-hidden">
  {/* Background exact avec SVG */}
  <div className="absolute inset-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 1024"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      {/* Vague blanche à gauche */}
      <path
        d="M0,0 Q400,200 0,600 Q600,800 0,1024 L0,0 Z"
        fill="white"
      />
      {/* Fond vert très clair #E8F5E9 */}
      <path
        d="M0,0 L1440,0 L1440,1024 L0,1024 Z"
        fill="#E8F5E9"
      />
    </svg>
  </div>

  {/* Cercles animés flottants */}
  <div className="absolute inset-0 overflow-hidden">
    {/* Cercle 1 */}
    <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#2E7D32] rounded-full opacity-5 animate-float1"></div>
    
    {/* Cercle 2 */}
    <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-[#2E7D32] rounded-full opacity-7 animate-float2"></div>
    
    {/* Cercle 3 */}
    <div className="absolute top-1/2 right-1/5 w-20 h-20 bg-[#2E7D32] rounded-full opacity-10 animate-float3"></div>
    
    {/* Cercle 4 */}
    <div className="absolute bottom-1/4 left-1/5 w-28 h-28 bg-[#2E7D32] rounded-full opacity-6 animate-float4"></div>
    
    {/* Cercle 5 */}
    <div className="absolute top-1/3 right-2/3 w-16 h-16 bg-[#2E7D32] rounded-full opacity-8 animate-float5"></div>

    {/* Cercles supplémentaires */}
    <div className="absolute top-10 left-1/4 w-40 h-40 bg-[#4CAF50] rounded-full opacity-4 animate-float6"></div>
    <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-[#66BB6A] rounded-full opacity-6 animate-float7"></div>
    <div className="absolute top-3/4 left-1/2 w-20 h-20 bg-[#81C784] rounded-full opacity-8 animate-float8"></div>
    <div className="absolute top-1/6 right-10 w-28 h-28 bg-[#A5D6A7] rounded-full opacity-5 animate-float9"></div>
    <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#C8E6C9] rounded-full opacity-7 animate-float10"></div>
    <div className="absolute top-2/3 right-1/6 w-24 h-24 bg-white rounded-full opacity-15 animate-float11"></div>
    <div className="absolute top-1/4 left-10 w-30 h-30 bg-white rounded-full opacity-12 animate-float12"></div>
  </div>

  {/* Styles d'animation */}
  <style jsx>{`
    @keyframes float1 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-20px) translateX(10px) scale(1.05); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(15px) translateX(-15px) scale(1.03); }
    }
    @keyframes float3 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-10px) translateX(5px) scale(1.02); }
    }
    @keyframes float4 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(25px) translateX(-10px) scale(1.04); }
    }
    @keyframes float5 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-15px) translateX(8px) scale(1.06); }
    }
    @keyframes float6 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-25px) translateX(12px) scale(1.07); }
    }
    @keyframes float7 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(18px) translateX(-8px) scale(1.04); }
    }
    @keyframes float8 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-12px) translateX(6px) scale(1.03); }
    }
    @keyframes float9 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(22px) translateX(-5px) scale(1.05); }
    }
    @keyframes float10 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-18px) translateX(9px) scale(1.06); }
    }
    @keyframes float11 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(14px) translateX(-7px) scale(1.04); }
    }
    @keyframes float12 {
      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
      50% { transform: translateY(-16px) translateX(11px) scale(1.05); }
    }
    .animate-float1 { animation: float1 6s ease-in-out infinite; }
    .animate-float2 { animation: float2 8s ease-in-out infinite; }
    .animate-float3 { animation: float3 7s ease-in-out infinite; }
    .animate-float4 { animation: float4 9s ease-in-out infinite; }
    .animate-float5 { animation: float5 5s ease-in-out infinite; }
    .animate-float6 { animation: float6 10s ease-in-out infinite; }
    .animate-float7 { animation: float7 11s ease-in-out infinite; }
    .animate-float8 { animation: float8 6.5s ease-in-out infinite; }
    .animate-float9 { animation: float9 8.5s ease-in-out infinite; }
    .animate-float10 { animation: float10 7.5s ease-in-out infinite; }
    .animate-float11 { animation: float11 9.5s ease-in-out infinite; }
    .animate-float12 { animation: float12 6.8s ease-in-out infinite; }
  `}</style>

  {/* Logo et nom en haut à gauche */}
  <div className="relative z-20 pt-6 pl-6 md:pt-8 md:pl-8">
    <div className="flex items-center space-x-3">
      
    </div>
  </div>

  {/* Contenu principal */}
  <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
    <div className="flex flex-col md:flex-row items-center w-full mt-[-40px]">
      {/* Partie texte */}
      <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Approvisionnement 
          <span className="text-[#2E7D32]"> pharmaceutique</span> en un clic!
        </h1>
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
          Le trait d'union entre pharmacien et phournisseur
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/auth/signup?role=pharmacist" 
            className="bg-[#2E7D32] text-white px-8 py-3.5 rounded-lg hover:bg-[#1B5E20] transition duration-200 text-sm font-medium shadow-sm text-center"
          >
            Commencer en tant que Pharmacien
          </Link>
          <Link 
            href="/auth/signup?role=supplier" 
            className="bg-white text-[#2E7D32] border border-[#2E7D32] px-8 py-3.5 rounded-lg hover:bg-[#2E7D32] hover:text-white transition duration-200 text-sm font-medium text-center"
          >
            Devenir Fournisseur
          </Link>
        </div>
      </div>

      {/* Partie image */}
      <div className="md:w-1/2 flex justify-center">
        <div className="relative">
          <img 
            src="design_sans_titre.svg" 
            alt="Plateforme pharmaceutique" 
            className="max-w-full h-auto relative z-10"
            style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))' }}
          />
        </div>
      </div>
    </div>
  </div>
</section>
  {/* Features Section avec onglets */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Des fonctionnalités adaptées à vos besoins
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez comment ELSAIDALIYA peut transformer votre activité pharmaceutique
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('pharmacist')}
                className={`px-8 py-3 rounded-lg text-sm font-medium transition duration-200 ${
                  activeTab === 'pharmacist'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#2E7D32]'
                }`}
              >
                Pharmaciens
              </button>
              <button
                onClick={() => setActiveTab('supplier')}
                className={`px-8 py-3 rounded-lg text-sm font-medium transition duration-200 ${
                  activeTab === 'supplier'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#2E7D32]'
                }`}
              >
                Fournisseurs
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'pharmacist' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Tableau de bord intelligent</h3>
                  <p className="text-gray-600 text-sm">
                    Visualisez les dernières offres et fournisseurs actifs avec des recommandations personnalisées.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recherche avancée</h3>
                  <p className="text-gray-600 text-sm">
                    Trouvez des produits et fournisseurs par wilaya, nom et type de produits.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Listings PDF</h3>
                  <p className="text-gray-600 text-sm">
                    Consultez et téléchargez les catalogues produits des fournisseurs.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Notation & Avis</h3>
                  <p className="text-gray-600 text-sm">
                    Partagez votre expérience avec les fournisseurs pour aider la communauté.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'supplier' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Statistiques détaillées</h3>
                  <p className="text-gray-600 text-sm">
                    Suivez les performances de vos listings avec des analytics avancés.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Gestion des listings</h3>
                  <p className="text-gray-600 text-sm">
                    Upload, modification et suppression de vos catalogues PDF.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Offres promotionnelles</h3>
                  <p className="text-gray-600 text-sm">
                    Publiez des offres spéciales avec images et descriptions détaillées.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Abonnements premium</h3>
                  <p className="text-gray-600 text-sm">
                    Maximisez votre visibilité avec nos plans d'abonnement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section Fournisseurs Premium */}
      <section className="py-16 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Fournisseurs Premium
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos fournisseurs les plus fiables avec l'abonnement Or
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E7D32]"></div>
              <p className="mt-4 text-gray-600">Chargement des fournisseurs...</p>
            </div>
          ) : goldSuppliers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {goldSuppliers.map((supplier) => (
                <div 
                  key={supplier.id} 
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {supplier.avatar_url ? (
                        <img 
                          src={supplier.avatar_url} 
                          alt={supplier.company_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-500">
                          <span className="text-2xl font-bold text-amber-600">
                            {supplier.company_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex justify-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                          </svg>
                          Premium
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {supplier.company_name}
                      </h3>
                      <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{supplier.wilaya}</span>
                      </div>
                      
                      {supplier.description && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {supplier.description}
                        </p>
                      )}
                      
                      <Link 
                       href="/auth/signin"
                        className="inline-flex items-center text-[#2E7D32] hover:text-[#1B5E20] text-sm font-medium"
                      >
                        Voir le profil
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Aucun fournisseur premium pour le moment
              </h3>
              <p className="text-gray-600">
                Les fournisseurs avec abonnement Or apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Des abonnements adaptés à votre activité
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins et développez votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Bronze Plan */}
            <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Bronze</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                10,000 DZD
              </div>
              <p className="text-gray-500 text-sm mb-4">par mois</p>
              <div className="text-lg font-semibold text-gray-700 mb-4">
                100,000 DZD / an
              </div>
              <p className="text-green-600 text-sm font-medium mb-6">
                (2 mois gratuits)
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Visibilité dans les résultats de recherche
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Une semaine d'essai gratuite
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Accès à toutes les fonctionnalités de base
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Support standard
                </li>
              </ul>
              <button className="w-full bg-green-50 text-[#2E7D32] py-3 px-4 rounded-lg hover:bg-[#2E7D32] hover:text-white transition duration-200 text-sm font-medium">
                Choisir Bronze
              </button>
            </div>

            {/* Argent Plan - Mise en avant */}
            <div className="bg-white p-8 rounded-xl border-2 border-[#2E7D32] text-center shadow-lg relative transform hover:-translate-y-1">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2E7D32] text-white px-4 py-1 rounded-full text-xs font-bold">
                PLUS POPULAIRE
              </div>
              <h3 className="text-xl font-semibold text-[#2E7D32] mb-2">Argent</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                15,000 DZD
              </div>
              <p className="text-gray-500 text-sm mb-4">par mois</p>
              <div className="text-lg font-semibold text-gray-700 mb-4">
                150,000 DZD / an
              </div>
              <p className="text-green-600 text-sm font-medium mb-6">
                (2 mois gratuits)
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center justify-start">
                  <svg className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mise en avant dans les résultats de recherche
                </li>
                <li className="flex items-center justify-start">
                  <svg className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Notifications aux pharmaciens
                </li>
                <li className="flex items-center justify-start">
                  <svg className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Support prioritaire
                </li>
                <li className="flex items-center justify-start">
                  <svg className="w-4 h-4 text-[#2E7D32] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Statistiques avancées
                </li>
              </ul>
              <button className="w-full bg-[#2E7D32] text-white py-3 px-4 rounded-lg hover:bg-[#1B5E20] transition duration-200 text-sm font-medium">
                Choisir Argent
              </button>
            </div>

            {/* Or Plan */}
            <div className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Or</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                25,000 DZD
              </div>
              <p className="text-gray-500 text-sm mb-4">par mois</p>
              <div className="text-lg font-semibold text-gray-700 mb-4">
                250,000 DZD / an
              </div>
              <p className="text-green-600 text-sm font-medium mb-6">
                (2 mois gratuits)
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priorité maximale dans les résultats
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mise à jour quotidienne des listings
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Notifications immédiates aux pharmaciens
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Annonces sur la page d'accueil
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Support VIP 24/7
                </li>
              </ul>
              <button className="w-full bg-amber-50 text-amber-600 py-3 px-4 rounded-lg hover:bg-amber-600 hover:text-white transition duration-200 text-sm font-medium">
                Choisir Or
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Elsaidaliya ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une plateforme conçue spécifiquement pour le marché pharmaceutique algérien
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-b from-white to-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sécurisé</h3>
              <p className="text-gray-600 text-sm">
                Plateforme sécurisée avec authentification multi-niveaux et données cryptées
              </p>
            </div>

            <div className="text-center bg-gradient-to-b from-white to-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Rapide</h3>
              <p className="text-gray-600 text-sm">
                Interface optimisée pour une expérience utilisateur fluide et réactive
              </p>
            </div>

            <div className="text-center bg-gradient-to-b from-white to-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Moderne</h3>
              <p className="text-gray-600 text-sm">
                Design responsive qui s'adapte à tous les appareils et navigateurs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#18391a] to-[#1B5E20]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à transformer votre activité ?
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez la plateforme qui modernise l'approvisionnement pharmaceutique en Algérie
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/auth/signup?role=pharmacist" 
              className="bg-white text-[#2E7D32] px-8 py-3.5 rounded-lg hover:bg-green-50 transition duration-200 text-sm font-medium shadow-sm"
            >
              Créer un compte gratuit
            </Link>
            <Link 
              href="/auth/signin" 
              className="bg-transparent text-white border border-white px-8 py-3.5 rounded-lg hover:bg-white hover:text-[#2E7D32] transition duration-200 text-sm font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center mb-4">
          <img 
            src="/logo-elsaidalya.png.jpg" 
            alt="ELSAIDALIYA Logo"
            className="h-8 w-8 mr-3 -mt-1"
          />
          <h3 className="text-lg font-semibold text-gray-900">ELSAIDALIYA</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Le trait d'union entre pharmacien et phournisseur
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Plateforme</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><a href="#" className="hover:text-green-600 transition duration-200">Pharmaciens</a></li>
          <li><a href="#" className="hover:text-green-600 transition duration-200">Fournisseurs</a></li>
          <li><a href="#" className="hover:text-green-600 transition duration-200">Tarifs</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><a href="tel:+213553720952" className="hover:text-green-600 transition duration-200">+213 553 720 952</a></li>
          <li><a href="mailto:contact@elsaidaliya.com" className="hover:text-green-600 transition duration-200">contact@elsaidaliya.com</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Légal</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <a href="/legal" className="hover:text-green-600 transition duration-200">
              Conditions
            </a>
          </li>
         
        </ul>
      </div>
    </div>

    <div className="mt-12 pt-8 border-t border-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600">
          © 2025 Elsaidaliya. Tous droits réservés.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          
          <a href="#" className="text-gray-500 hover:text-green-600 transition duration-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-green-600 transition duration-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  )
}
