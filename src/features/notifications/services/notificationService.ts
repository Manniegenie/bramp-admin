import axiosInstance from '@/core/services/axios';
import type { 
  NotificationRequest, 
  NotificationResponse, 
  NotificationStats,
  SendNotificationFormData 
} from '../types/notification.types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
// Use admin routes which require authentication
const NOTIFICATION_BASE = `${BASE_URL}/admin/notification`;

export const notificationService = {
  // Send notification to specific user by ID
  async sendToUser(userId: string, notification: Omit<NotificationRequest, 'userId'>): Promise<NotificationResponse> {
    try {
      const response = await axiosInstance.post(`${NOTIFICATION_BASE}/send-fcm`, {
        userId,
        title: notification.title,
        body: notification.body,
        data: notification.data || {}
      });
      
      // Normalize response format
      if (response.data.success !== undefined) {
        return {
          success: response.data.success,
          message: response.data.message || response.data.via ? `Notification sent via ${response.data.via}` : 'Notification sent successfully',
          ...response.data
        };
      }
      
      return {
        success: true,
        message: 'Notification sent successfully',
        ...response.data
      };
    } catch (error: any) {
      console.error('Error sending notification to user:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to send notification';
      throw new Error(errorMessage);
    }
  },

  // Send notification to specific device
  async sendToDevice(deviceId: string, notification: Omit<NotificationRequest, 'deviceId'>): Promise<NotificationResponse> {
    try {
      const response = await axiosInstance.post(`${NOTIFICATION_BASE}/send-fcm`, {
        deviceId,
        title: notification.title,
        body: notification.body,
        data: notification.data || {}
      });
      
      // Normalize response format
      if (response.data.success !== undefined) {
        return {
          success: response.data.success,
          message: response.data.message || response.data.via ? `Notification sent via ${response.data.via}` : 'Notification sent successfully',
          ...response.data
        };
      }
      
      return {
        success: true,
        message: 'Notification sent successfully',
        ...response.data
      };
    } catch (error: any) {
      console.error('Error sending notification to device:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to send notification';
      throw new Error(errorMessage);
    }
  },

  // Send notification to all users
  async sendToAll(notification: Omit<NotificationRequest, 'userId' | 'deviceId'>): Promise<NotificationResponse> {
    try {
      const response = await axiosInstance.post(`${NOTIFICATION_BASE}/send-all`, {
        title: notification.title,
        body: notification.body,
        data: notification.data || {}
      });
      
      // Handle both old and new response formats
      if (response.data.success !== undefined) {
        return {
          success: response.data.success,
          message: response.data.message || 'Notifications sent successfully',
          ...response.data
        };
      }
      
      // Legacy format support
      return {
        success: true,
        message: response.data.message || 'Notifications sent successfully',
        ...response.data
      };
    } catch (error: any) {
      console.error('Error sending notification to all users:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to send notification to all users';
      throw new Error(errorMessage);
    }
  },

  // Get notification statistics
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await axiosInstance.get(`${NOTIFICATION_BASE}/stats`);
      
      // Ensure all required fields are present (Expo-only now)
      return {
        totalUsers: response.data.totalUsers || 0,
        usersWithTokens: response.data.usersWithTokens || 0,
        fcmTokens: 0, // FCM removed - kept for backward compatibility
        expoTokens: response.data.expoTokens || 0,
        lastSent: response.data.lastSent || new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error fetching notification stats:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch notification statistics';
      throw new Error(errorMessage);
    }
  },

  // Test Expo notification service (Firebase test removed - using Expo only)
  async testFirebase(): Promise<{ success: boolean; message: string }> {
    // Expo service is always available, no need to test
    return {
      success: true,
      message: 'Expo notification service is ready'
    };
  },

  // Clear all push tokens
  async clearAllTokens(): Promise<{ success: boolean; message: string; modifiedCount?: number }> {
    try {
      const response = await axiosInstance.post(`${NOTIFICATION_BASE}/clear-all`);
      return response.data;
    } catch (error: any) {
      console.error('Error clearing all tokens:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to clear tokens';
      throw new Error(errorMessage);
    }
  },

  // Clear push tokens by phone number
  async clearTokensByPhone(phonenumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post(`${NOTIFICATION_BASE}/clear-by-phone`, { phonenumber });
      return response.data;
    } catch (error: any) {
      console.error('Error clearing tokens by phone:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to clear tokens by phone';
      throw new Error(errorMessage);
    }
  },

  // Send notification based on form data
  async sendNotification(formData: SendNotificationFormData): Promise<NotificationResponse> {
    const notification = {
      title: formData.title,
      body: formData.body,
      data: formData.data ? JSON.parse(formData.data) : {}
    };

    switch (formData.targetType) {
      case 'all':
        return this.sendToAll(notification);
      case 'user':
        return this.sendToUser(formData.targetValue, notification);
      case 'device':
        return this.sendToDevice(formData.targetValue, notification);
      default:
        throw new Error('Invalid target type');
    }
  }
};
