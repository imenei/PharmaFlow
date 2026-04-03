'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/client';

interface Profile {
  id: string;
  company_name: string;
  email: string | null;
  role: string;
  status: string;
  created_at: string;
}

interface Payment {
  id: string;
  status: string;
  created_at: string;
  profile?: { company_name?: string; email?: string | null };
  subscription?: { name?: string; price?: number; duration_days?: number };
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'replied';
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
}

type TabKey = 'pharmaciens' | 'fournisseurs' | 'paiements' | 'messages';

export default function AdminDashboard() {
  const [pharmaciens, setPharmaciens] = useState<Profile[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Profile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('pharmaciens');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setFeedback('');

      const [usersData, paymentsData, messagesData, plansData] = await Promise.all([
        apiFetch<{ users: Profile[] }>('/admin/users'),
        apiFetch<Payment[]>('/admin/payments'),
        apiFetch<ContactMessage[]>('/admin/messages'),
        apiFetch<{ subscriptions: SubscriptionPlan[] }>('/admin/subscriptions'),
      ]);

      const users = usersData.users || [];
      setPharmaciens(users.filter((user) => user.role === 'pharmacist'));
      setFournisseurs(users.filter((user) => user.role === 'supplier'));
      setPayments(paymentsData || []);
      setMessages(messagesData || []);
      setSubscriptionPlans(plansData.subscriptions || []);
    } catch (error) {
      console.error('Erreur chargement admin:', error);
      setFeedback("Erreur lors du chargement des donnees d'administration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approveUser = async (id: string) => {
    await apiFetch('/admin/approve-user', { method: 'POST', body: JSON.stringify({ id }) });
    setFeedback('Utilisateur approuve avec succes');
    loadData();
  };

  const rejectUser = async (id: string) => {
    await apiFetch('/admin/reject-user', { method: 'POST', body: JSON.stringify({ id }) });
    setFeedback('Utilisateur rejete avec succes');
    loadData();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await apiFetch('/admin/delete-user', { method: 'DELETE', body: JSON.stringify({ id }) });
    setFeedback('Utilisateur supprime avec succes');
    loadData();
  };

  const approveSubscription = async (paymentId: string) => {
    await apiFetch('/admin/approve-subscription', { method: 'POST', body: JSON.stringify({ paymentId }) });
    setFeedback('Abonnement approuve');
    loadData();
  };

  const rejectSubscription = async (paymentId: string) => {
    await apiFetch('/admin/reject-subscription', { method: 'POST', body: JSON.stringify({ paymentId }) });
    setFeedback('Abonnement rejete');
    loadData();
  };

  const markMessageAsRead = async (messageId: string) => {
    await apiFetch('/admin/messages', { method: 'POST', body: JSON.stringify({ action: 'mark-read', messageId }) });
    setFeedback('Message marque comme lu');
    loadData();
  };

  const deleteMessage = async (messageId: string) => {
    await apiFetch('/admin/messages', { method: 'POST', body: JSON.stringify({ action: 'delete', messageId }) });
    setFeedback('Message supprime');
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Pharmaciens', value: pharmaciens.length },
    { label: 'Fournisseurs', value: fournisseurs.length },
    { label: 'Paiements', value: payments.length },
    { label: 'Messages', value: messages.length },
  ];

  const renderUsers = (users: Profile[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Societe</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-100">
              <td className="px-4 py-3">{user.company_name || 'N/A'}</td>
              <td className="px-4 py-3">{user.email || 'N/A'}</td>
              <td className="px-4 py-3">{user.status}</td>
              <td className="px-4 py-3 space-x-2">
                <button onClick={() => approveUser(user.id)} className="px-3 py-1 rounded bg-green-50 text-green-700">
                  Approuver
                </button>
                <button onClick={() => rejectUser(user.id)} className="px-3 py-1 rounded bg-yellow-50 text-yellow-700">
                  Rejeter
                </button>
                <button onClick={() => deleteUser(user.id)} className="px-3 py-1 rounded bg-red-50 text-red-700">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <div>
            <div className="font-medium">{payment.profile?.company_name || 'Utilisateur'}</div>
            <div className="text-sm text-gray-500">{payment.subscription?.name || 'Abonnement'} • {payment.status}</div>
          </div>
          <div className="space-x-2">
            <button onClick={() => approveSubscription(payment.id)} className="px-3 py-1 rounded bg-green-50 text-green-700">
              Approuver
            </button>
            <button onClick={() => rejectSubscription(payment.id)} className="px-3 py-1 rounded bg-red-50 text-red-700">
              Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="font-medium">{message.subject}</div>
              <div className="text-sm text-gray-500">{message.name} • {message.email}</div>
              <p className="text-sm text-gray-700 mt-2">{message.message}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => markMessageAsRead(message.id)} className="px-3 py-1 rounded bg-blue-50 text-blue-700">
                Marquer lu
              </button>
              <button onClick={() => deleteMessage(message.id)} className="px-3 py-1 rounded bg-red-50 text-red-700">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
            <p className="text-gray-600 mt-1">Gestion complete de la plateforme</p>
          </div>
          <button onClick={loadData} className="px-4 py-2 bg-gray-700 text-white rounded-md">
            Actualiser
          </button>
        </div>

        {feedback && <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800">{feedback}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {(['pharmaciens', 'fournisseurs', 'paiements', 'messages'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm border-b-2 ${
                  activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'pharmaciens' && renderUsers(pharmaciens)}
          {activeTab === 'fournisseurs' && renderUsers(fournisseurs)}
          {activeTab === 'paiements' && renderPayments()}
          {activeTab === 'messages' && renderMessages()}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plans d'abonnement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-gray-200 p-4">
                <div className="font-medium">{plan.name}</div>
                <div className="text-sm text-gray-500">{plan.price} DA • {plan.duration_days} jours</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
