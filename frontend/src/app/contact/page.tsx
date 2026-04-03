"use client"
import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Home, Info, MessageSquare } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    type: "success" as "success" | "error"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiFetch('/public/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
        skipAuth: true
      });

      setToastMessage({
        title: "Message envoyé avec succès!",
        description: "Nous vous répondrons dans les plus brefs délais.",
        type: "success"
      });
      setShowToast(true);
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      
      setToastMessage({
        title: "Erreur d'envoi",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        type: "error"
      });
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-white rounded-lg p-1.5 border border-green-100">
                <img 
                  src="/logo-elsaidalya.png.jpg" 
                  alt="ELSAIDALIYA Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-[#2E7D32] ml-3">ELSAIDALIYA</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className="flex items-center text-gray-700 hover:text-[#2E7D32] transition-colors font-medium"
              >
                <Home className="h-4 w-4 mr-1" />
                Accueil
              </Link>
              <Link 
                href="/#about" 
                className="flex items-center text-gray-700 hover:text-[#2E7D32] transition-colors font-medium"
              >
                <Info className="h-4 w-4 mr-1" />
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center text-[#2E7D32] font-semibold"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact
              </Link>
            </nav>

            {/* Mobile menu button (optional) */}
            <div className="md:hidden">
              <button className="text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-4 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm ${
          toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="font-medium">{toastMessage.title}</div>
          <div className="text-sm">{toastMessage.description}</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Des questions ou des suggestions ? N'hésitez pas à nous contacter.
            Notre équipe est à votre disposition pour vous aider.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Votre nom"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition duration-200 disabled:bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="votre@email.com"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition duration-200 disabled:bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Sujet
                  </label>
                  <input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    placeholder="Le sujet de votre message"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition duration-200 disabled:bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    placeholder="Votre message..." 
                    rows={5}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition duration-200 resize-vertical disabled:bg-gray-100"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition duration-200 font-medium shadow-sm flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le message"
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <Mail className="h-6 w-6 text-[#2E7D32]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">contact@elsaidaliya.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="shrink-0">
                    <Phone className="h-6 w-6 text-[#2E7D32]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Téléphone</p>
                    <p className="text-sm text-gray-600">+213 553 720 952</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="shrink-0">
                    <MapPin className="h-6 w-6 text-[#2E7D32]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-600">Constantine, Algérie</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Suivez-nous sur les réseaux sociaux
                </h3>
                <div className="flex space-x-6">
                  <a 
                    href="https://www.facebook.com/profile.php?id=61576353654046" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-gray-600 hover:text-[#2E7D32] transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  
                  <a 
                    href="https://www.instagram.com/elsaidaliya.s/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-gray-600 hover:text-[#2E7D32] transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  
                  <a 
                    href="https://wa.me/+213553720952" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-gray-600 hover:text-[#2E7D32] transition-colors"
                  >
                    <Phone className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
