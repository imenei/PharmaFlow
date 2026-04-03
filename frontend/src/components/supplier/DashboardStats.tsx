"use client";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api/client";
import {
  Eye,
  Download,
  Star,
  Folder,
  BadgeCheck,
  FileText,
  Package,
  TrendingUp,
  Users,
  FileDown,
  Award,
  Calendar,
  Clock,
  BarChart3,
  ChevronRight,
  Sparkles,
  Crown,
  Zap,
  Target,
  ChartBar,
} from "lucide-react";

const BUCKET_NAME = "listings";

type ActiveSubscription = {
  id: string;
  status: string;
  created_at: string;
  subscriptions: {
    id: string;
    name: string;
    price: number;
    duration_days: number;
  };
};

export default function DashboardStats() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [offres, setOffres] = useState<any[]>([]);
  const [avis, setAvis] = useState<any[]>([]);
  const [totaux, setTotaux] = useState({
    vues: 0,
    downloads: 0,
    noteMoy: 0,
    totalListings: 0,
    totalOffres: 0,
  });
  const [currentPlan, setCurrentPlan] = useState<ActiveSubscription | null>(
    null
  );
  const [downloadingIds, setDownloadingIds] = useState<
    Record<string, boolean>
  >({});

  const supabase = createClient();

  const colors = {
    primary: "#4F46E5",
    secondary: "#10B981",
    accent: "#F59E0B",
    dark: "#1F2937",
    light: "#F9FAFB",
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { count: profileViews } = await supabase
          .from("supplier_profile_views")
          .select("*", { count: "exact", head: true })
          .eq("supplier_id", user.id);

        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select("id,title,file_url,views,downloads,created_at")
          .eq("supplier_id", user.id)
          .order("created_at", { ascending: false });

        if (listingsError) {
          console.error("Listings error:", listingsError);
        }

        console.log("LISTINGS DASHBOARD SUPPLIER:", listingsData);

        const { data: offresData } = await supabase
          .from("offers")
          .select("id,title,views,created_at,expires_at")
          .eq("supplier_id", user.id)
          .order("created_at", { ascending: false });

        const { data: avisData } = await supabase
          .from("ratings")
          .select("id,pharmacist_id,rating,comment,created_at")
          .eq("supplier_id", user.id)
          .order("created_at", { ascending: false });

        const { data: subData } = await supabase
          .from("subscription_payments")
          .select(
            "id,status,created_at,subscriptions(id,name,price,duration_days)"
          )
          .eq("user_id", user.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(1);

        if (subData && subData.length > 0) {
          const raw = subData[0];
          const sub = Array.isArray(raw.subscriptions)
            ? raw.subscriptions[0]
            : raw.subscriptions;
          if (sub) {
            setCurrentPlan({
              id: String(raw.id),
              status: raw.status,
              created_at: raw.created_at,
              subscriptions: {
                id: String(sub.id),
                name: sub.name,
                price: Number(sub.price),
                duration_days: Number(sub.duration_days),
              },
            });
          } else {
            setCurrentPlan(null);
          }
        } else {
          setCurrentPlan(null);
        }

        const totalViewsListings = (listingsData || []).reduce(
          (s: number, l: any) => s + (l.views || 0),
          0
        );
        const totalViewsOffres = (offresData || []).reduce(
          (s: number, o: any) => s + (o.views || 0),
          0
        );
        const totalProfileViews = profileViews || 0;
        const totalViews =
          totalViewsListings + totalViewsOffres + totalProfileViews;

        const noteMoy =
          avisData && avisData.length
            ? avisData.reduce(
                (a: number, b: any) => a + (b.rating || 0),
                0
              ) / avisData.length
            : 0;

        setListings(listingsData || []);
        setOffres(offresData || []);
        setAvis(avisData || []);
        setTotaux((prev) => ({
          ...prev,
          vues: totalViews,
          noteMoy,
          totalListings: listingsData?.length || 0,
          totalOffres: offresData?.length || 0,
        }));
      } catch (err) {
        console.error("fetchAll error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [supabase]);

  useEffect(() => {
    const totalDownloads = listings.reduce(
      (s, l) => s + (l.downloads || 0),
      0
    );
    setTotaux((prev) => ({
      ...prev,
      downloads: totalDownloads,
    }));
  }, [listings]);

  const StatCard = ({ icon: Icon, title, value, color, gradient }: any) => (
    <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${gradient || "bg-gradient-to-br from-blue-500 to-indigo-600"} shadow-md group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
      </div>
    </div>
  );

  const handleDownload = async (listing: any) => {
    if (!listing?.file_url) return;

    setDownloadingIds((prev) => ({ ...prev, [listing.id]: true }));

    try {
      const path = listing.file_url.replace(/^.*\/listings\//, "");

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = path.split("/").pop() || "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      const json = await apiFetch(`/catalog/listings/${listing.id}/download`, {
        method: "POST",
      });
      console.log("API download response (supplier):", json);

      if (!res.ok) {
        console.error("Download API error (supplier):", json);
      }

      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id
            ? { ...l, downloads: (l.downloads || 0) + 1 }
            : l
        )
      );
    } catch (err) {
      console.error("Download error (supplier):", err);
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [listing.id]: false }));
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating 
            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" 
            : "text-gray-200"
        } transition-all duration-300 hover:scale-110`}
      />
    ));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Chargement des données...</p>
      </div>
    </div>
  );

  const chartData = listings.map((l) => ({ 
    name: l.title.length > 15 ? l.title.substring(0, 15) + "..." : l.title, 
    vues: l.views 
  }));

  const chartColors = ["#4F46E5", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          
          <p className="text-gray-500 mt-1">Vue d'ensemble de vos performances</p>
        </div>
       
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Eye}
          title="Vues totales"
          value={totaux.vues}
          gradient="bg-gradient-to-br from-blue-500 to-cyan-400"
        />
        <StatCard
          icon={Download}
          title="Téléchargements"
          value={totaux.downloads}
          gradient="bg-gradient-to-br from-green-500 to-emerald-400"
        />
        <StatCard
          icon={Star}
          title="Note moyenne"
          value={totaux.noteMoy.toFixed(1)}
          gradient="bg-gradient-to-br from-yellow-500 to-orange-400"
        />
        <StatCard
          icon={Users}
          title="Engagement total"
          value={totaux.vues + totaux.downloads}
          gradient="bg-gradient-to-br from-purple-500 to-pink-400"
        />
      </div>

      {/* Graphique et Abonnement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
                Évolution des vues
              </h2>
              <p className="text-gray-500 text-sm">Performance de vos listings</p>
            </div>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Bar 
                dataKey="vues" 
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Abonnement */}
        {currentPlan && (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Crown className="w-8 h-8" />
              <BadgeCheck className="w-8 h-8 text-yellow-300" />
            </div>
            <h2 className="text-xl font-bold mb-2">Abonnement Premium</h2>
            <p className="text-indigo-100 mb-6">Vous bénéficiez de fonctionnalités avancées</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="font-semibold">{currentPlan.subscriptions.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Actif depuis {new Date(currentPlan.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-indigo-200">Prix</p>
                  <p className="font-bold">{currentPlan.subscriptions.price} DA</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-indigo-200">Durée</p>
                  <p className="font-bold">{currentPlan.subscriptions.duration_days} jours</p>
                </div>
              </div>
              
              <Link 
  href="/supplier/subscription"
  className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
>
  <span>Gérer l'abonnement</span>
  <ChevronRight className="w-5 h-5 ml-2" />
</Link>
            </div>
          </div>
        )}
      </div>

      {/* Listings */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Folder className="w-6 h-6 mr-2 text-blue-600" />
              Mes Listings
            </h2>
            <p className="text-gray-500 text-sm">Documents téléchargeables par les pharmaciens</p>
          </div>
          <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full font-semibold">
            {listings.length} fichiers
          </span>
        </div>
        <div className="space-y-4">
          {listings.map((listing) => (
            <div 
              key={listing.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {listing.views} vues
                    </span>
                    <span className="flex items-center">
                      <FileDown className="w-4 h-4 mr-1" />
                      {listing.downloads} téléchargements
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(listing)}
                  disabled={downloadingIds[listing.id]}
                  className="ml-4 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {downloadingIds[listing.id] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offres et Avis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Offres */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-600" />
                Mes Offres
              </h2>
              <p className="text-gray-500 text-sm">Promotions et offres spéciales</p>
            </div>
            <span className="px-4 py-1 bg-purple-100 text-purple-600 rounded-full font-semibold">
              {offres.length} offres
            </span>
          </div>
          <div className="space-y-4">
            {offres.map((offre) => (
              <div 
                key={offre.id}
                className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors duration-300"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{offre.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {offre.views} vues
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Expire le {new Date(offre.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avis */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Award className="w-6 h-6 mr-2 text-orange-600" />
                Avis reçus
              </h2>
              <p className="text-gray-500 text-sm">Retours des pharmaciens</p>
            </div>
            <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
              <span className="font-bold text-gray-800">{totaux.noteMoy.toFixed(1)}/5</span>
            </div>
          </div>
          <div className="space-y-4">
            {avis.map((a) => (
              <div 
                key={a.id}
                className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-1">
                    {renderStars(a.rating)}
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 italic border-l-4 border-orange-300 pl-4 py-2 bg-gradient-to-r from-orange-50 to-transparent">
                  "{a.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
