// app/supplier/offers/page.tsx
import OfferForm from "@/components/supplier/OfferForm";

export default function OffersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Offres Fournisseurs</h1>
      <OfferForm />
    </div>
  );
}
