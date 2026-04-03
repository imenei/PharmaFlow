// hooks/use-user.ts
"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ AJOUT: Créer le client Supabase
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Erreur auth:', error)
          setUser(null)
        } else {
          setUser(user)
        }
        
      } catch (error) {
        console.error('Erreur useUser:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}