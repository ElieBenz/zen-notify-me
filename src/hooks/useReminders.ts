import { useState, useEffect } from 'react';
import { Reminder } from '@/types/reminder';

const STORAGE_KEY = 'zen-reminders';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load reminders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const withDates = parsed.map((r: any) => ({
          ...r,
          datetime: new Date(r.datetime),
          createdAt: new Date(r.createdAt)
        }));
        setReminders(withDates);
      } catch (error) {
        console.error('Failed to parse stored reminders:', error);
      }
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      isCompleted: false
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const toggleComplete = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id 
          ? { ...reminder, isCompleted: !reminder.isCompleted }
          : reminder
      )
    );
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleComplete
  };
};