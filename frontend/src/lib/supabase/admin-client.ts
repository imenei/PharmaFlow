// lib/supabase/admin-client.ts
import { createClient } from '@supabase/supabase-js'

// Utilisez des noms de variables différents pour éviter la confusion
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug en développement
if (process.env.NODE_ENV === 'development') {
  console.log('🔐 Configuration Admin Client:');
  console.log('URL:', supabaseUrl ? '✓' : '✗');
  console.log('Service Key:', serviceRoleKey ? '✓' : '✗');
}

if (!supabaseUrl || !serviceRoleKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  
  throw new Error(
    `Variables manquantes: ${missing.join(', ')}. ` +
    `Vérifiez votre fichier .env.local`
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});