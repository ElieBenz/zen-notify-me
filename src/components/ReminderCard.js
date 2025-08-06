
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReminderCard = ({ reminder, onToggleComplete, onDelete }) => {
  const isOverdue = reminder.datetime < new Date() && !reminder.isCompleted;
  const isToday = reminder.datetime.toDateString() === new Date().toDateString();

  const getCategoryIcon = (category) => {
    const icons = {
      work: 'briefcase',
      personal: 'person',
      health: 'fitness',
      shopping: 'bag',
      appointment: 'calendar',
      other: 'ellipsis-horizontal',
    };
    return icons[category] || 'ellipsis-horizontal';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
    };
    return colors[priority] || '#6b7280';
  };

  const formatDateTime = (date) => {
    return date.toLocaleString();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(reminder.id) }
      ]
    );
  };

  return (
    <View style={[
      styles.card,
      reminder.isCompleted && styles.completedCard,
      isOverdue && styles.overdueCard
    ]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => onToggleComplete(reminder.id)}
          >
            {reminder.isCompleted ? (
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            ) : (
              <Ionicons name="ellipse-outline" size={24} color="#6b7280" />
            )}
          </TouchableOpacity>
          
          <View style={styles.categoryIcon}>
            <Ionicons 
              name={getCategoryIcon(reminder.category)} 
              size={16} 
              color="#6366f1" 
            />
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[
          styles.title,
          reminder.isCompleted && styles.completedText
        ]}>
          {reminder.title}
        </Text>
        
        {reminder.description && (
          <Text style={[
            styles.description,
            reminder.isCompleted && styles.completedText
          ]}>
            {reminder.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.dateTimeContainer}>
            <Ionicons 
              name={isToday ? "today" : "calendar-outline"} 
              size={14} 
              color={isOverdue ? "#ef4444" : "#6b7280"} 
            />
            <Text style={[
              styles.dateTime,
              isOverdue && styles.overdueText,
              isToday && styles.todayText
            ]}>
              {formatDateTime(reminder.datetime)}
            </Text>
          </View>

          <View style={styles.priorityContainer}>
            <View style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(reminder.priority) }
            ]} />
            <Text style={styles.priorityText}>
              {reminder.priority}
            </Text>
          </View>
        </View>

        {isOverdue && !reminder.isCompleted && (
          <View style={styles.overdueLabel}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.overdueLabelText}>Overdue</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  completedCard: {
    opacity: 0.7,
    borderLeftColor: '#10b981',
  },
  overdueCard: {
    borderLeftColor: '#ef4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  overdueText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  todayText: {
    color: '#f59e0b',
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  overdueLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  overdueLabelText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ReminderCard;
