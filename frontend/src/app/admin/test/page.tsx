// app/admin/test/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnection() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // ✅ Créer le client Supabase
  const supabase = createClient()

  useEffect(() => {
    testConnection()
  }, [supabase])

  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      
      // Test 1: Compter les utilisateurs
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      console.log('Count result:', count, 'Error:', countError)

      // Test 2: Récupérer quelques utilisateurs
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)

      console.log('Users result:', users, 'Error:', usersError)

      if (usersError) {
        setError(usersError.message)
      } else {
        setData(users || [])
      }

    } catch (err: any) {
      setError(err.message)
      console.error('Test failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Test de connexion en cours...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Connexion Supabase</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <strong>Connexion réussie!</strong> Les requêtes ont été exécutées.
      </div>

      <h2 className="text-xl font-semibold mb-2">Données récupérées:</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>

      <button 
        onClick={testConnection}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tester à nouveau
      </button>
    </div>
  )
}