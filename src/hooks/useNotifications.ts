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
      const notifications = [];
      const baseId = parseInt(reminder.id.replace(/\D/g, '').slice(0, 6)) || Math.floor(Math.random() * 10000);
      
      // Main notification at scheduled time
      notifications.push({
        title: reminder.title,
        body: reminder.description || 'Reminder notification',
        id: baseId,
        schedule: { at: reminder.datetime },
        sound: 'default',
        attachments: undefined,
        actionTypeId: '',
        extra: { reminderId: reminder.id, type: 'main' }
      });

      // 1 hour before notification
      const oneHourBefore = new Date(reminder.datetime.getTime() - 60 * 60 * 1000);
      if (oneHourBefore > new Date()) {
        notifications.push({
          title: `${reminder.title} - 1 Hour Reminder`,
          body: `Your ${reminder.title} is in 1 hour`,
          id: baseId + 1,
          schedule: { at: oneHourBefore },
          sound: 'default',
          attachments: undefined,
          actionTypeId: '',
          extra: { reminderId: reminder.id, type: '1hour' }
        });
      }

      // 30 minutes before notification
      const thirtyMinsBefore = new Date(reminder.datetime.getTime() - 30 * 60 * 1000);
      if (thirtyMinsBefore > new Date()) {
        notifications.push({
          title: `${reminder.title} - 30 Min Reminder`,
          body: `Your ${reminder.title} is in 30 minutes`,
          id: baseId + 2,
          schedule: { at: thirtyMinsBefore },
          sound: 'default',
          attachments: undefined,
          actionTypeId: '',
          extra: { reminderId: reminder.id, type: '30min' }
        });
      }

      // 10 minutes before notification
      const tenMinsBefore = new Date(reminder.datetime.getTime() - 10 * 60 * 1000);
      if (tenMinsBefore > new Date()) {
        notifications.push({
          title: `${reminder.title} - 10 Min Reminder`,
          body: `Your ${reminder.title} is in 10 minutes`,
          id: baseId + 3,
          schedule: { at: tenMinsBefore },
          sound: 'default',
          attachments: undefined,
          actionTypeId: '',
          extra: { reminderId: reminder.id, type: '10min' }
        });
      }

      await LocalNotifications.schedule({ notifications });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  const cancelNotification = async (reminderId: string) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const baseId = parseInt(reminderId.replace(/\D/g, '').slice(0, 6)) || Math.floor(Math.random() * 10000);
      // Cancel all related notifications (main + 3 reminders)
      const notificationsToCancel = [
        { id: baseId },     // main
        { id: baseId + 1 }, // 1 hour
        { id: baseId + 2 }, // 30 min
        { id: baseId + 3 }  // 10 min
      ];
      await LocalNotifications.cancel({ notifications: notificationsToCancel });
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