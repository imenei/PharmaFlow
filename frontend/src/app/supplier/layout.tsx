'use client';

import SupplierSidebar from '@/components/supplier/SupplierSidebar';
import { useEffect, useState } from 'react';

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Fermer les notifications quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotificationOpen(false);
    };

    if (isNotificationOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 shrink-0">
        <SupplierSidebar />
      </div>
      
      {/* Contenu principal */}
      <main 
        className="flex-1 overflow-auto" 
        onClick={() => setIsNotificationOpen(false)}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}