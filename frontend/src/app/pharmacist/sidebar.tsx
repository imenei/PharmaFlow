'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Tag, FileText, Star, LogOut, User } from 'lucide-react';
import { clearAccessToken, getCurrentUser } from '@/lib/auth/session';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const profile = getCurrentUser<any>();

  const menuItems = [
    { href: '/pharmacist/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/pharmacist/suppliers', label: 'Fournisseurs', icon: <Building2 className="h-5 w-5" /> },
    { href: '/pharmacist/offers', label: 'Offres', icon: <Tag className="h-5 w-5" /> },
    { href: '/pharmacist/listings-search', label: 'Listings PDF', icon: <FileText className="h-5 w-5" /> },
    { href: '/pharmacist/ratings', label: 'Notes & Avis', icon: <Star className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 bg-[#E8F5E9] text-gray-800 h-screen p-4 flex flex-col border-r border-green-200">
      <div className="mb-8 pt-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center bg-white rounded-lg p-1.5 shadow-sm border border-green-100">
            <img src="/logo-elsaidalya.png.jpg" alt="ELSAIDALIYA Logo" className="h-9 w-9 object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#2E7D32] leading-tight tracking-tight">El Saidaliya</h1>
            <span className="text-sm text-green-600 font-medium mt-0.5">Espace Pharmacien</span>
          </div>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === item.href ? 'bg-[#2E7D32] text-white font-semibold shadow-md' : 'text-green-800 hover:bg-green-200 hover:text-green-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-4 border-t border-green-300 mt-auto">
        {profile ? (
          <>
            <Link href="/pharmacist/profile" className="flex items-center p-3 text-green-800 hover:bg-green-200 rounded-lg transition-colors mb-2">
              <div className="flex items-center justify-center bg-green-200 p-2 rounded-full h-10 w-10 shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.company_name} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-green-700" />
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile.company_name || 'Pharmacie'}</p>
                <p className="text-xs text-green-600 truncate">{profile.email}</p>
              </div>
            </Link>
            <button
              onClick={() => {
                clearAccessToken();
                router.push('/auth/signin');
              }}
              className="flex items-center w-full p-3 text-green-800 hover:bg-green-200 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3 text-green-700" />
              Deconnexion
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="text-green-600 hover:text-green-700 text-sm font-medium">
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );
}
