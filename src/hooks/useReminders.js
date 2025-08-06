
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'zen-reminders';

export const useReminders = () => {
  const [reminders, setReminders] = useState([]);

  // Load reminders from AsyncStorage on mount
  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const withDates = parsed.map((r) => ({
          ...r,
          datetime: new Date(r.datetime),
          createdAt: new Date(r.createdAt)
        }));
        setReminders(withDates);
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  // Save reminders to AsyncStorage whenever they change
  useEffect(() => {
    saveReminders();
  }, [reminders]);

  const saveReminders = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
    }
  };

  const addReminder = (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      isCompleted: false
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  };

  const updateReminder = (id, updates) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const toggleComplete = (id) => {
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
