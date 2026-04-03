"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

interface Offer {
  id?: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at?: string;
  expires_at: string;
}

const OfferForm: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentOffer, setCurrentOffer] = useState<Offer>({
    title: "",
    description: "",
    image_url: null,
    expires_at: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchOffers = async () => {
    const data = await apiFetch<Offer[]>("/supplier/offers");
    setOffers(data);
  };

  useEffect(() => {
    fetchOffers().catch((error) => console.error("Erreur chargement offres:", error));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentOffer({ ...currentOffer, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", currentOffer.title);
    formData.append("description", currentOffer.description);
    formData.append("expires_at", currentOffer.expires_at);
    if (currentOffer.image_url) formData.append("image_url", currentOffer.image_url);
    if (image) formData.append("image", image);

    if (isEditing && currentOffer.id) {
      await apiFetch(`/supplier/offers/${currentOffer.id}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      await apiFetch("/supplier/offers", {
        method: "POST",
        body: formData,
      });
    }

    resetForm();
    await fetchOffers();
  };

  const handleEdit = (offer: Offer) => {
    setCurrentOffer(offer);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    await apiFetch(`/supplier/offers/${id}`, {
      method: "DELETE",
    });
    await fetchOffers();
  };

  const resetForm = () => {
    setCurrentOffer({
      title: "",
      description: "",
      image_url: null,
      expires_at: "",
    });
    setImage(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditing ? "Modifier l'offre" : "Creer une nouvelle offre"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'offre</label>
            <input
              type="text"
              name="title"
              placeholder="Titre de l'offre"
              value={currentOffer.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Description detaillee de l'offre"
              value={currentOffer.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
            <input
              type="date"
              name="expires_at"
              value={currentOffer.expires_at}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              {isEditing ? "Mettre a jour" : "Publier l'offre"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mes offres</h2>

        {offers.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
            <p className="text-gray-500">Aucune offre creee pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                {offer.image_url && (
                  <img src={offer.image_url} alt={offer.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Expire le: {new Date(offer.expires_at).toLocaleDateString("fr-FR")}
                </p>

                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="px-4 py-1.5 text-sm bg-emerald-50 text-emerald-700 font-medium rounded-md hover:bg-emerald-100 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id!)}
                    className="px-4 py-1.5 text-sm bg-red-50 text-red-700 font-medium rounded-md hover:bg-red-100 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferForm;
