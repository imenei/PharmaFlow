"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: "gold",
    name: "Or",
    price: 25000,
    yearlyPrice: 300000,
    duration: "par mois",
    features: [
      "Priorite maximale dans les resultats",
      "Mise a jour quotidienne des listings",
      "Notifications immediates aux pharmaciens",
      "Annonces sur la page d'accueil",
      "Support VIP 24/7",
    ],
    recommended: true,
  },
  {
    id: "silver",
    name: "Argent",
    price: 15000,
    yearlyPrice: 180000,
    duration: "par mois",
    features: ["Mise en avant", "Notifications", "Support prioritaire", "Statistiques avancees"],
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 10000,
    yearlyPrice: 120000,
    duration: "par mois",
    features: ["Visibilite", "Une semaine d'essai", "Fonctionnalites de base", "Support standard"],
  },
];

const SubscriptionPanel: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any | null>(null);
  const [loadingCurrentPlan, setLoadingCurrentPlan] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    apiFetch("/supplier/subscription/current")
      .then((data) => setCurrentPlan(data))
      .finally(() => setLoadingCurrentPlan(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPlan || !paymentProof) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("planId", selectedPlan);
      formData.append("paymentProof", paymentProof);
      await apiFetch("/supplier/subscription/requests", {
        method: "POST",
        body: formData,
      });
      alert("Votre demande d'abonnement a ete soumise avec succes.");
      setSelectedPlan(null);
      setPaymentProof(null);
    } catch (error: any) {
      console.error("Erreur abonnement:", error);
      alert(error.message || "Erreur lors de l'envoi du recu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
        <h3 className="text-lg font-normal text-gray-700 mb-6 pb-3 border-b border-gray-100">
          Votre abonnement actuel
        </h3>
        {loadingCurrentPlan ? (
          <div>Chargement...</div>
        ) : currentPlan ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <p>
              Plan Actuel: <strong>{currentPlan.subscriptions?.name || currentPlan.name}</strong>
            </p>
          </div>
        ) : (
          <p>Vous n'avez pas encore d'abonnement approuve.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
        <h3 className="text-lg font-normal text-gray-700 mb-4">Choisir un plan d'abonnement</h3>
        <p className="text-sm text-gray-500 mb-6">Augmentez votre visibilite aupres des pharmaciens avec nos plans.</p>

        <div className="flex justify-center items-center space-x-2 mb-8">
          <span className="text-sm font-medium text-gray-700">Mensuel</span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === "yearly" ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">Annuel</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-green-500 bg-green-50"
                  : plan.recommended
                  ? "border-amber-300"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                  Recommande
                </div>
              )}
              <h4 className="text-lg font-medium text-gray-800 mb-3">{plan.name}</h4>

              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {(billingCycle === "monthly" ? plan.price : plan.yearlyPrice).toLocaleString()} DA
                </span>
                <span className="text-sm text-gray-500 ml-1">/ {billingCycle === "monthly" ? "mois" : "an"}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <h3 className="text-lg font-normal text-gray-700 mb-4">Envoyer une preuve de paiement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept="image/*,.pdf" onChange={(event) => setPaymentProof(event.target.files?.[0] || null)} />
          <button
            type="submit"
            disabled={!selectedPlan || !paymentProof || isSubmitting}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
          >
            {isSubmitting ? "Envoi..." : "Soumettre la demande"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionPanel;
