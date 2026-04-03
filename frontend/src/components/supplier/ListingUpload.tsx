"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

interface Listing {
  id: string;
  title: string;
  description: string;
  file_url: string;
  extracted_text: string;
  created_at: string;
}

const ListingUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<Listing[]>([]);

  const loadListings = async () => {
    const data = await apiFetch<Listing[]>("/supplier/listings");
    setUploadHistory(data);
  };

  useEffect(() => {
    loadListings().catch((error) => console.error("Erreur chargement listings:", error));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const listing = await apiFetch<Listing>("/supplier/listings", {
        method: "POST",
        body: formData,
      });

      setUploadHistory((prev) => [listing, ...prev]);
      setFile(null);
      const input = document.getElementById("file-input") as HTMLInputElement | null;
      if (input) input.value = "";
      alert("Catalogue importe avec succes");
    } catch (error: any) {
      console.error("Erreur upload:", error);
      alert(error.message || "Erreur upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce listing et tous ses produits ?")) return;

    try {
      await apiFetch(`/supplier/listings/${id}`, { method: "DELETE" });
      setUploadHistory((prev) => prev.filter((item) => item.id !== id));
      alert("Supprime avec succes");
    } catch (error: any) {
      console.error("Erreur suppression:", error);
      alert("Erreur suppression");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
        <h3 className="text-lg font-normal text-gray-700 mb-6 pb-3 border-b border-gray-100">
          Uploader un nouveau catalogue PDF
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex flex-col items-center justify-center px-6 py-5 bg-gray-50 text-gray-500 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors w-64">
              <span className="text-sm text-center">Selectionner un PDF</span>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                disabled={isUploading}
                className="hidden"
                required
              />
            </label>
            {file && (
              <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3">
                <span className="text-sm text-blue-700">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200 space-y-1">
            <strong>Extraction backend:</strong> Le PDF est envoye au service NestJS, puis archive et parse proprement.
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            disabled={!file || isUploading}
          >
            {isUploading ? "Upload en cours..." : "Uploader et extraire"}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-normal text-gray-700 mb-6">Mes catalogues uploades</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {uploadHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Aucun catalogue uploade</div>
          ) : (
            uploadHistory.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium block truncate"
                  >
                    {item.title}
                  </a>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleDateString("fr-FR")} • {item.description}
                  </div>
                  {item.extracted_text && (
                    <div className="text-xs text-green-600 mt-1">Texte extrait: {item.extracted_text.length} caracteres</div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingUploadForm;
