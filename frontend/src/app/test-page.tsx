'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnection() {
  // ✅ AJOUT: Créer le client Supabase
  const supabase = createClient()

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('profiles').select('*').limit(1)
      
      if (error) {
        console.error('Erreur de connexion:', error)
      } else {
        console.log('Connexion réussie!', data)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div>
      <h1>Test de connexion Supabase</h1>
      <p>Vérifie la console du navigateur pour les résultats.</p>
    </div>
  )
}