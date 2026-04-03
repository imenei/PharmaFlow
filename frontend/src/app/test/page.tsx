'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')

  // ✅ AJOUT: Créer le client Supabase
  const supabase = createClient()

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test simple de connexion
        const { data, error } = await supabase.from('profiles').select('count')
        
        if (error) {
          setConnectionStatus(`Error: ${error.message}`)
          console.error('Erreur de connexion:', error)
        } else {
          setConnectionStatus('✅ Connexion à Supabase réussie!')
          console.log('Connexion réussie!', data)
        }
      } catch (error) {
        setConnectionStatus('❌ Erreur de connexion')
        console.error('Erreur:', error)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test de connexion Supabase</h1>
      <p>{connectionStatus}</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h2>Informations de connexion :</h2>
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p>Clé: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
      </div>
    </div>
  )
}