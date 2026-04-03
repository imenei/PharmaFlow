import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header avec fond blanc */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#2E7D32]">ELSAIDALIYA</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-[#2E7D32] transition duration-200">
                Accueil
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[#2E7D32] transition duration-200">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#2E7D32] transition duration-200">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu principal avec fond #E8F5E9 */}
      <main className="flex-1 bg-[#E8F5E9]">
        {children}
      </main>

      {/* Footer avec fond blanc */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <h3 className="text-lg font-bold text-[#2E7D32] mb-4">ELSAIDALIYA</h3>
              <p className="text-sm text-gray-600">
                La première plateforme au service des pharmaciens et fournisseurs en Algérie.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">PLATEFORME</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#2E7D32]">Pour les pharmaciens</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#2E7D32]">Pour les fournisseurs</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#2E7D32]">Tarifs</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">SUPPORT</h4>
              <ul className="space-y-2">
                <li><a href="tel:+213553720952" className="text-sm text-gray-600 hover:text-[#2E7D32]">+213 553 720 952</a></li>
                <li><a href="mailto:contact@elsaidaliya.com" className="text-sm text-gray-600 hover:text-[#2E7D32]">contact@elsaidaliya.com</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#2E7D32]">Centre d'aide</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">LÉGAL</h4>
              <ul className="space-y-2">
                <li><a href="/legal" className="text-sm text-gray-600 hover:text-[#2E7D32]">Conditions d'utilisation</a></li>
                <li><a href="/legal" className="text-sm text-gray-600 hover:text-[#2E7D32]">Politique de confidentialité</a></li>
                <li><a href="/legal" className="text-sm text-gray-600 hover:text-[#2E7D32]">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2025 Elsaidaliya™. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-[#2E7D32]">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#2E7D32]">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.71 13.75 3.71 12.455s.487-2.44 1.362-3.236c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.875.807 1.362 1.952 1.362 3.236s-.487 2.44-1.362 3.236c-.875.807-2.026 1.297-3.323 1.297zm7.716-5.866c0 .732.146 1.107.244 1.454.146.55.488 1.032 1.033 1.307.293.146.65.244 1.033.244.342 0 .65-.098.942-.244.55-.275.888-.757 1.033-1.307.098-.347.244-.722.244-1.454v-2.92c0-.732-.146-1.107-.244-1.454-.146-.55-.488-1.032-1.033-1.307a2.47 2.47 0 00-.942-.244c-.383 0-.74.098-1.033.244-.545.275-.887.757-1.033 1.307-.098.347-.244.722-.244 1.454v2.92zm-1.552 3.133h-1.444c-.088 0-.146-.059-.146-.146v-7.24c0-.088.059-.146.146-.146h1.444c.088 0 .146.059.146.146v7.24c0 .087-.058.146-.146.146z"/>
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