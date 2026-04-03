// app/supplier/subscription/page.tsx
import SubscriptionPanel from "@/components/supplier/SubscriptionPlans";

export default function SubscriptionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Abonnement & Paiement</h1>
      <SubscriptionPanel />
    </div>
  );
}
