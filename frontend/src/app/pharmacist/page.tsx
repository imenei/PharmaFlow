import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PharmacistDashboard() {
  const supabase = await createClient() // ✅ Ajout de await ici aussi
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || session.user.user_metadata?.role !== 'pharmacist') {
    redirect('/auth/signin')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tableau de bord Pharmacien</h1>
      <p>Bienvenue, {session.user.email}</p>
    </div>
  )
}