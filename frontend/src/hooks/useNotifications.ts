import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/client';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

export function useNotifications(options: { limit?: number; unreadOnly?: boolean } = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { limit = 20, unreadOnly = false } = options;

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: limit.toString(),
          unreadOnly: unreadOnly.toString(),
        });

        const data = await apiFetch<{ notifications: Notification[] }>(`/notifications?${params}`);
        setNotifications(data.notifications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [limit, unreadOnly]);

  return { notifications, loading, error };
}

export function useNotificationStats() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await apiFetch<NotificationStats>('/notifications/stats');
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useMarkAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await apiFetch(`/notifications/${notificationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: true }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markAsRead, loading, error };
}

export function useMarkAllAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      setError(null);
      return await apiFetch('/notifications/mark-all-read', {
        method: 'POST',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markAllAsRead, loading, error };
}
