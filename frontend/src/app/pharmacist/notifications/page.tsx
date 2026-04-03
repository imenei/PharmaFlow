// app/pharmacist/notifications/page.tsx
'use client'

import { useNotifications, useNotificationStats, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import { Bell, FileText, Tag, Building2, Eye, Loader } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, loading: notificationsLoading } = useNotifications();
  const { stats, loading: statsLoading } = useNotificationStats();
  const { markAsRead, loading: markLoading } = useMarkAsRead();
  const { markAllAsRead, loading: markAllLoading } = useMarkAllAsRead();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (notificationsLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const unreadCount = stats?.unread || 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount} notification(s) non lue(s)
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllLoading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {markAllLoading ? 'Traitement...' : 'Tout marquer comme lu'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 last:border-b-0 ${
              !notification.is_read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                notification.type === 'listing' ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                {notification.type === 'listing' ? (
                  <FileText className="h-5 w-5 text-yellow-600" />
                ) : (
                  <Tag className="h-5 w-5 text-gray-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markLoading}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-1">{notification.message}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{notification.type}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  );
}