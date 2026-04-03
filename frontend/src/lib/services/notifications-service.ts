// lib/services/notifications-service.ts
import { createClient } from '@/lib/supabase/server';

export class NotificationsService {
  // Récupérer les notifications d'un utilisateur
  static async getUserNotifications(userId: string, options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  } = {}) {
    const supabase = await createClient();
    
    const { limit = 20, offset = 0, unreadOnly = false } = options;

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      notifications: data,
      totalCount: count || 0
    };
  }

  // Marquer une notification comme lue
  static async markAsRead(notificationId: string, userId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Marquer toutes les notifications comme lues
  static async markAllAsRead(userId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true };
  }

  // Obtenir les statistiques des notifications
  static async getNotificationStats(userId: string) {
    const supabase = await createClient();
    
    const { count: total } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: unread } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    return {
      total: total || 0,
      unread: unread || 0,
      read: (total || 0) - (unread || 0)
    };
  }
}