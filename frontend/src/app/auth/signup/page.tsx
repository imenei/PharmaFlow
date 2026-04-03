import { Suspense } from 'react'
import SignUpClient from './signup-client'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const params = await searchParams
  const role = params.role === 'supplier' ? 'supplier' : 'pharmacist'

  return (
    <Suspense fallback={<div className="p-8">Chargement...</div>}>
      <SignUpClient defaultRole={role} />
    </Suspense>
  )
}
