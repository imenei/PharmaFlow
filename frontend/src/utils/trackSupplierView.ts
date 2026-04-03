import { createClient } from '@/lib/supabase/client';

export async function trackSupplierView(supplierId: string) {
  try {
    // ✅ AJOUT: Créer le client Supabase
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Vérifier si le pharmacien a déjà vu ce fournisseur
    const { data: existingView } = await supabase
      .from('supplier_profile_views')
      .select('id')
      .eq('supplier_id', supplierId)
      .eq('pharmacist_id', user.id)
      .single();

    // Si pas déjà vu, enregistrer la vue
    if (!existingView) {
      const { error } = await supabase
        .from('supplier_profile_views')
        .insert({
          supplier_id: supplierId,
          pharmacist_id: user.id,
        });

      if (error) {
        console.error('Erreur insertion vue fournisseur:', error);
      } else {
        console.log('✅ Vue fournisseur trackée pour:', supplierId);
      }
    }
  } catch (error) {
    console.error('Erreur tracking vue fournisseur:', error);
  }
}
