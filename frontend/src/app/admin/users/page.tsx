'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api/client'

interface UserProfile {
  id: string
  email: string
  role: string
  company_name?: string
  wilaya?: string
  phone?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<{ users: UserProfile[] }>('/admin/users')
      const nextUsers =
        filter === 'all' ? data.users : data.users.filter((user) => user.status === filter)
      setUsers(nextUsers)
    } catch (error: any) {
      if (error.message?.toLowerCase().includes('unauthorized')) {
        router.push('/auth/signin')
        return
      }
      alert(error.message || 'Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await apiFetch(status === 'approved' ? '/admin/approve-user' : '/admin/reject-user', {
        method: 'POST',
        body: JSON.stringify({ id: userId }),
      })
      await fetchUsers()
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la mise a jour')
    }
  }

  const handleSignOut = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/auth/signin')
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <div className="flex gap-3">
          <Link href="/admin/dashboard" className="rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
            Retour Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
          >
            Deconnexion
          </button>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded border p-2"
        >
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuves</option>
          <option value="rejected">Rejetes</option>
        </select>
      </div>

      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-start justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">{user.company_name || '-'}</h3>
                <p>{user.email}</p>
                <p className="text-sm">
                  Role: {user.role || 'user'} | Wilaya: {user.wilaya || '-'}
                </p>
                <p className="text-sm">Telephone: {user.phone || '-'}</p>
                <p className="text-sm">
                  Statut :
                  <span
                    className={`ml-2 rounded px-2 py-1 text-xs ${
                      user.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </p>
              </div>

              {user.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateUserStatus(user.id, 'approved')}
                    className="rounded bg-green-500 px-3 py-1 text-sm text-white"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => updateUserStatus(user.id, 'rejected')}
                    className="rounded bg-red-500 px-3 py-1 text-sm text-white"
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}

          {users.length === 0 && <p className="text-gray-500">Aucun utilisateur trouve.</p>}
        </div>
      )}
    </div>
  )
}
