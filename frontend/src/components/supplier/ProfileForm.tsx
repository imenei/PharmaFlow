// src/components/supplier/ProfileForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  company_name: string | null;
  address: string | null;
  wilaya: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  description: string | null;
  role: string | null;
};

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [temp, setTemp] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ✅ Créer le client Supabase
  const supabase = createClient();

  // Charger le profil connecté
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        const user = userData?.user;
        if (!user) throw new Error("Utilisateur non connecté");

        const { data, error: dbErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbErr) throw dbErr;

        setProfile(data as Profile);
        setTemp(data as Profile);
        
        // Précharger l'avatar existant s'il existe
        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url);
        }
      } catch (e: any) {
        console.error("Erreur lors du chargement du profil:", e);
        setError(e.message || "Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTemp(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérification taille fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille du fichier ne doit pas dépasser 5MB");
        return;
      }
      
      // Vérification type fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Veuillez sélectionner une image valide (JPG, PNG, WEBP)");
        return;
      }
      
      setAvatarFile(file);
      setError(null);
      
      // Créer une preview de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = async () => {
    if (!profile) return;
    
    try {
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Si un avatar existe déjà, le supprimer de la base de données
      if (profile.avatar_url) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: null, updated_at: new Date().toISOString() })
          .eq("id", profile.id);

        if (updateError) throw updateError;

        // Mettre à jour l'état local
        setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
        setTemp(prev => ({ ...prev, avatar_url: null }));
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression du logo:", error);
      setError("Erreur lors de la suppression du logo");
    }
  };

  // Upload avatar -> retourne publicUrl
  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log("Tentative d'upload vers:", filePath);
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error("Erreur détaillée upload:", uploadError);
        throw new Error(`Échec upload: ${uploadError.message}`);
      }

      // Récupérer l'URL publique
      const { data: urlData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      
      console.log("URL publique générée:", urlData.publicUrl);
      return urlData.publicUrl;
      
    } catch (error) {
      console.error("Erreur complète upload avatar:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    // Validation des champs requis
    if (!temp.company_name?.trim()) {
      setError("La raison sociale est obligatoire");
      return;
    }

    if (!temp.email?.trim()) {
      setError("L'email est obligatoire");
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (temp.email && !emailRegex.test(temp.email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let newAvatarUrl = profile.avatar_url;

      // Uploader le nouvel avatar s'il y en a un
      if (avatarFile) {
        try {
          console.log("Début upload avatar...");
          const publicUrl = await uploadAvatar(profile.id);
          if (publicUrl) {
            newAvatarUrl = publicUrl;
            console.log("Avatar uploadé avec succès:", publicUrl);
          }
        } catch (uploadError: any) {
          console.error("Échec upload avatar:", uploadError);
          setError(`Échec de l'upload de l'image: ${uploadError.message}`);
          setSaving(false);
          return;
        }
      }

      const payload = {
        company_name: temp.company_name?.trim() ?? profile.company_name,
        address: temp.address?.trim() ?? profile.address,
        wilaya: temp.wilaya ?? profile.wilaya,
        email: temp.email?.trim() ?? profile.email,
        phone: temp.phone?.trim() ?? profile.phone,
        description: temp.description?.trim() ?? profile.description,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: updateErr } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", profile.id);

      if (updateErr) throw updateErr;

      // Recharger les données fraîches depuis la base
      const { data: updatedProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      if (fetchError) throw fetchError;

      setProfile(updatedProfile as Profile);
      setTemp(updatedProfile as Profile);
      setAvatarFile(null);
      
      // Ne pas réinitialiser avatarPreview pour garder l'affichage
      if (updatedProfile.avatar_url) {
        setAvatarPreview(updatedProfile.avatar_url);
      }
      
      alert("Profil mis à jour avec succès");
    } catch (e: any) {
      console.error("Erreur lors de la sauvegarde:", e);
      setError(e.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    if (!profile) return false;
    
    return (
      temp.company_name !== profile.company_name ||
      temp.address !== profile.address ||
      temp.wilaya !== profile.wilaya ||
      temp.email !== profile.email ||
      temp.phone !== profile.phone ||
      temp.description !== profile.description ||
      avatarFile !== null
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-600">Chargement du profil...</div>
    </div>
  );
  
  if (!profile) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-red-600">Aucun profil trouvé.</div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm max-w-3xl mx-auto border border-gray-100">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 border border-red-100">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Nouvel avatar" 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-semibold text-gray-400 shadow-sm">
                {profile.company_name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg, image/png, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {(avatarPreview || profile.avatar_url) && (
              <button
                onClick={handleRemoveLogo}
                className="absolute -bottom-2 -left-2 bg-white rounded-full p-1 shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Supprimer le logo"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Formats acceptés : JPG, PNG, WEBP (max 5MB)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raison sociale <span className="text-red-500">*</span>
          </label>
          <input
            name="company_name"
            value={temp.company_name ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Entrez le nom de votre entreprise"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya</label>
          <select
            name="wilaya"
            value={temp.wilaya ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="">Sélectionnez votre wilaya</option>
            <option value="Adrar">Adrar</option>
            <option value="Chlef">Chlef</option>
            <option value="Laghouat">Laghouat</option>
            <option value="Oum El Bouaghi">Oum El Bouaghi</option>
            <option value="Batna">Batna</option>
            <option value="Béjaïa">Béjaïa</option>
            <option value="Biskra">Biskra</option>
            <option value="Béchar">Béchar</option>
            <option value="Blida">Blida</option>
            <option value="Bouira">Bouira</option>
            <option value="Tamanrasset">Tamanrasset</option>
            <option value="Tébessa">Tébessa</option>
            <option value="Tlemcen">Tlemcen</option>
            <option value="Tiaret">Tiaret</option>
            <option value="Tizi Ouzou">Tizi Ouzou</option>
            <option value="Alger">Alger</option>
            <option value="Djelfa">Djelfa</option>
            <option value="Jijel">Jijel</option>
            <option value="Sétif">Sétif</option>
            <option value="Saïda">Saïda</option>
            <option value="Skikda">Skikda</option>
            <option value="Sidi Bel Abbès">Sidi Bel Abbès</option>
            <option value="Annaba">Annaba</option>
            <option value="Guelma">Guelma</option>
            <option value="Constantine">Constantine</option>
            <option value="Médéa">Médéa</option>
            <option value="Mostaganem">Mostaganem</option>
            <option value="M'Sila">M'Sila</option>
            <option value="Mascara">Mascara</option>
            <option value="Ouargla">Ouargla</option>
            <option value="Oran">Oran</option>
            <option value="El Bayadh">El Bayadh</option>
            <option value="Illizi">Illizi</option>
            <option value="Bordj Bou Arréridj">Bordj Bou Arréridj</option>
            <option value="Boumerdès">Boumerdès</option>
            <option value="El Tarf">El Tarf</option>
            <option value="Tindouf">Tindouf</option>
            <option value="Tissemsilt">Tissemsilt</option>
            <option value="El Oued">El Oued</option>
            <option value="Khenchela">Khenchela</option>
            <option value="Souk Ahras">Souk Ahras</option>
            <option value="Tipaza">Tipaza</option>
            <option value="Mila">Mila</option>
            <option value="Aïn Defla">Aïn Defla</option>
            <option value="Naâma">Naâma</option>
            <option value="Aïn Témouchent">Aïn Témouchent</option>
            <option value="Ghardaïa">Ghardaïa</option>
            <option value="Relizane">Relizane</option>
            <option value="Timimoun">Timimoun</option>
            <option value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</option>
            <option value="Ouled Djellal">Ouled Djellal</option>
            <option value="Béni Abbès">Béni Abbès</option>
            <option value="In Salah">In Salah</option>
            <option value="In Guezzam">In Guezzam</option>
            <option value="Touggourt">Touggourt</option>
            <option value="Djanet">Djanet</option>
            <option value="El M'Ghair">El M'Ghair</option>
            <option value="El Menia">El Menia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <input
            name="address"
            value={temp.address ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Adresse complète"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={temp.email ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="email@exemple.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input
            name="phone"
            value={temp.phone ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Numéro de téléphone"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={temp.description ?? ""}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          placeholder="Décrivez votre entreprise en quelques mots..."
        />
      </div>

      <div className="flex justify-end pt-5 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges()}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </div>
  );
}