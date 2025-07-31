import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Reminder } from '@/types/reminder';

export const useNotifications = () => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      requestPermissions();
    }
  }, []);

  const requestPermissions = async () => {
    try {
      await LocalNotifications.requestPermissions();
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const scheduleNotification = async (reminder: Reminder) => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications only work on native platforms');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: reminder.title,
            body: reminder.description || 'Reminder notification',
            id: parseInt(reminder.id.replace(/\D/g, '').slice(0, 8)) || Math.floor(Math.random() * 100000),
            schedule: { at: reminder.datetime },
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: {
              reminderId: reminder.id
            }
          }
        ]
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  const cancelNotification = async (reminderId: string) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const id = parseInt(reminderId.replace(/\D/g, '').slice(0, 8)) || Math.floor(Math.random() * 100000);
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  };

  return {
    scheduleNotification,
    cancelNotification,
    requestPermissions
  };
};