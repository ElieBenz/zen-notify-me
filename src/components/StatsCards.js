
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatsCards = ({ reminders }) => {
  const now = new Date();
  const pending = reminders.filter(r => !r.isCompleted).length;
  const completed = reminders.filter(r => r.isCompleted).length;
  const overdue = reminders.filter(r => !r.isCompleted && r.datetime < now).length;
  const today = reminders.filter(r => r.datetime.toDateString() === new Date().toDateString()).length;

  const stats = [
    { icon: 'time', label: 'Pending', value: pending, color: '#3b82f6' },
    { icon: 'checkmark-circle', label: 'Completed', value: completed, color: '#10b981' },
    { icon: 'calendar', label: 'Today', value: today, color: '#f59e0b' },
    { icon: 'notifications', label: 'Overdue', value: overdue, color: '#ef4444' },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
            <Ionicons name={stat.icon} size={24} color={stat.color} />
          </View>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default StatsCards;
