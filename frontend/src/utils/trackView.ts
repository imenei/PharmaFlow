// utils/trackView.ts
import { createClient } from '@/lib/supabase/client';

export async function trackOfferView(offerId: string) {
  try {
    // ✅ AJOUT: Créer le client Supabase
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Vérifier si le pharmacien a déjà vu cette offre
    const { data: existingView } = await supabase
      .from('offer_views')
      .select('id')
      .eq('offer_id', offerId)
      .eq('pharmacist_id', user.id)
      .single();

    // Si pas déjà vu, enregistrer la vue
    if (!existingView) {
      await supabase
        .from('offer_views')
        .insert({
          offer_id: offerId,
          pharmacist_id: user.id,
        });
    }
  } catch (error) {
    console.error('Erreur tracking vue:', error);
  }
}