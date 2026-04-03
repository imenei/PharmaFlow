import Sidebar from '@/app/pharmacist/sidebar'

export default function PharmacistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}
