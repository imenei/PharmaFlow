'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignUp() {
  const [formData, setFormData] = useState({
    company_name: '',
    role: 'pharmacist',
    wilaya: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    terms_accepted: false
  })
  const [registerFile, setRegisterFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegisterFile(e.target.files[0])
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    // ✅ AJOUT: Créer le client Supabase
    const supabase = createClient()

    if (formData.password !== formData.confirm_password) {
      setErrorMessage('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (!formData.terms_accepted) {
      setErrorMessage('Veuillez accepter les conditions d\'utilisation')
      setLoading(false)
      return
    }

    try {
      // Étape 1: Créer l'utilisateur avec Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: formData.role,
            company_name: formData.company_name,
            phone: formData.phone,
            wilaya: formData.wilaya
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        let registerUrl = null
        
        // Étape 2: Upload du fichier si fournisseur
        if (registerFile && formData.role === 'supplier') {
          const fileExt = registerFile.name.split('.').pop()
          const fileName = `${authData.user.id}-register.${fileExt}`
          const { error: uploadError } = await supabase.storage
            .from('company-documents')
            .upload(fileName, registerFile)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage
            .from('company-documents')
            .getPublicUrl(fileName)
          
          registerUrl = urlData.publicUrl
        }

        // Étape 3: Créer le profil DIRECTEMENT avec Supabase
        // SUPPRIMEZ TOUTE RÉFÉRENCE À L'API ROUTE !
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            role: formData.role,
            company_name: formData.company_name,
            wilaya: formData.wilaya,
            phone: formData.phone,
            register_url: registerUrl,
            is_active: formData.role === 'pharmacist'
          })

        if (profileError) {
          console.error('Erreur création profil:', profileError)
          throw profileError
        }

        alert('Inscription réussie! Votre compte sera examiné par un administrateur.')
        router.push('/auth/signin')
      }
    } catch (error: any) {
      console.error('Erreur inscription:', error)
      setErrorMessage(error.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#E8F5E9]">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#2E7D32] rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Créer un compte professionnel
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez la plateforme Elsaidaliya
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Raison sociale *
              </label>
              <input
                type="text"
                id="company_name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition duration-200"
                placeholder="Nom de votre entreprise"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="pharmacist"
                    checked={formData.role === 'pharmacist'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pharmacien</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="supplier"
                    checked={formData.role === 'supplier'}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Fournisseur</span>
                </label>
              </div>
            </div>

            {formData.role === 'supplier' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registre de commerce *
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                    id="register_file"
                    required={formData.role === 'supplier'}
                  />
                  <label
                    htmlFor="register_file"
                    className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Choisir un fichier
                  </label>
                  <span className="ml-3 text-sm text-gray-600">
                    {registerFile ? registerFile.name : 'Aucun fichier sélectionné'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG ou PDF - Max 2MB
                </p>
              </div>
            )}

            <div>
              <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-2">
                Wilaya *
              </label>
              <select
                id="wilaya"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition duration-200"
                value={formData.wilaya}
                onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
              >
                <option value="">Sélectionnez votre wilaya</option>
                <option value="Alger">Alger</option>
                <option value="Oran">Oran</option>
                <option value="Constantine">Constantine</option>
                <option value="Blida">Blida</option>
                <option value="Tizi Ouzou">Tizi Ouzou</option>
                <option value="Annaba">Annaba</option>
                <option value="Batna">Batna</option>
                <option value="Sétif">Sétif</option>
                <option value="Mostaganem">Mostaganem</option>
                <option value="Béjaïa">Béjaïa</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition duration-200"
                placeholder="05 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition duration-200"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition duration-200"
                placeholder="Au moins 8 caractères"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmation *
              </label>
              <input
                type="password"
                id="confirm_password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition duration-200"
                placeholder="Confirmez le mot de passe"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded mt-1"
              checked={formData.terms_accepted}
              onChange={(e) => setFormData({...formData, terms_accepted: e.target.checked})}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              J'accepte les{' '}
              <a href="#" className="text-[#2E7D32] hover:text-[#1B5E20]">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-[#2E7D32] hover:text-[#1B5E20]">
                politique de confidentialité
              </a>
            </label>
          </div>

          <div className="bg-[#E8F5E9] p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Information importante:</strong> Après inscription, votre compte sera examiné par un administrateur avant d'être activé. 
              Vous recevrez une notification dès que votre compte sera validé.
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E7D32] text-white py-3 px-4 rounded-lg hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E7D32] disabled:opacity-50 transition duration-200 font-medium"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/auth/signin" className="font-medium text-[#2E7D32] hover:text-[#1B5E20]">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}