
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useReminders } from '../hooks/useReminders';
import { useNotifications } from '../context/NotificationContext';
import GreetingModal from '../components/GreetingModal';
import AddReminderForm from '../components/AddReminderForm';
import ReminderCard from '../components/ReminderCard';
import StatsCards from '../components/StatsCards';

const HomeScreen = () => {
  const { reminders, addReminder, deleteReminder, toggleComplete } = useReminders();
  const { scheduleNotification, cancelNotification } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('all');
  const [userName, setUserName] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [backgroundQuote, setBackgroundQuote] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    checkUserName();
  }, []);

  const checkUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('zen-notify-username');
      const storedQuote = await AsyncStorage.getItem('zen-notify-quote');
      
      if (storedName) {
        setUserName(storedName);
        if (storedQuote) {
          setBackgroundQuote(storedQuote);
        }
      } else {
        setShowGreeting(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleNameSet = async (name, quote) => {
    try {
      setUserName(name);
      setBackgroundQuote(quote);
      await AsyncStorage.setItem('zen-notify-username', name);
      await AsyncStorage.setItem('zen-notify-quote', quote);
      setShowGreeting(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleAddReminder = async (reminderData) => {
    try {
      const newReminder = addReminder(reminderData);
      
      if (newReminder.datetime > new Date()) {
        await scheduleNotification(newReminder);
        Alert.alert('Success', 'Reminder added and notification scheduled!');
      } else {
        Alert.alert('Success', 'Reminder added!');
      }
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding reminder:', error);
      Alert.alert('Error', 'Failed to add reminder');
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await cancelNotification(id);
      deleteReminder(id);
      Alert.alert('Success', 'Reminder deleted!');
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      if (reminder && !reminder.isCompleted) {
        await cancelNotification(id);
      }
      toggleComplete(id);
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const getFilteredReminders = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'pending':
        return reminders.filter(r => !r.isCompleted);
      case 'completed':
        return reminders.filter(r => r.isCompleted);
      case 'overdue':
        return reminders.filter(r => !r.isCompleted && r.datetime < now);
      case 'today':
        const today = new Date().toDateString();
        return reminders.filter(r => r.datetime.toDateString() === today);
      default:
        return reminders;
    }
  };

  const filteredReminders = getFilteredReminders().sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  return (
    <SafeAreaView style={styles.container}>
      {showGreeting && <GreetingModal onNameSet={handleNameSet} />}
      {showAddForm && (
        <AddReminderForm
          onAddReminder={handleAddReminder}
          onClose={() => setShowAddForm(false)}
        />
      )}
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.logoContainer}
          >
            <Image 
              source={{ uri: '/lovable-uploads/148830d0-6df5-4b9a-b083-d51ba5b37990.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </LinearGradient>
          
          <Text style={styles.title}>Zen Notify Me</Text>
          
          {userName && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back, {userName}!</Text>
              <TouchableOpacity onPress={() => setShowGreeting(true)}>
                <Text style={styles.changeNameText}>Change name</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.subtitle}>Your mindful reminder companion</Text>
        </View>

        {/* Stats Cards */}
        <StatsCards reminders={reminders} />

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Reminder</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {[
            { key: 'all', label: 'All', count: reminders.length },
            { key: 'pending', label: 'Pending', count: reminders.filter(r => !r.isCompleted).length },
            { key: 'today', label: 'Today', count: reminders.filter(r => r.datetime.toDateString() === new Date().toDateString()).length },
            { key: 'completed', label: 'Done', count: reminders.filter(r => r.isCompleted).length },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reminders List */}
        <View style={styles.remindersContainer}>
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No reminders found</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'all' 
                  ? 'Create your first reminder to get started!'
                  : `No ${activeTab} reminders at the moment.`
                }
              </Text>
            </View>
          ) : (
            filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteReminder}
              />
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Background Quote */}
      {backgroundQuote && (
        <View style={styles.backgroundQuote}>
          <Text style={styles.quoteText}>"{backgroundQuote}"</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  changeNameText: {
    fontSize: 14,
    color: '#6366f1',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1f2937',
  },
  remindersContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  backgroundQuote: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    width: 300,
    opacity: 0.1,
    pointerEvents: 'none',
  },
  quoteText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
  },
});

export default HomeScreen;
