
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ReminderCategories, ReminderPriorities } from '../types/reminder';

const AddReminderForm = ({ onAddReminder, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [category, setCategory] = useState(ReminderCategories.PERSONAL);
  const [priority, setPriority] = useState(ReminderPriorities.MEDIUM);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title');
      return;
    }

    if (datetime <= new Date()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    onAddReminder({
      title: title.trim(),
      description: description.trim(),
      datetime,
      category,
      priority,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleString();
  };

  const categories = [
    { key: ReminderCategories.WORK, label: 'Work', icon: 'briefcase' },
    { key: ReminderCategories.PERSONAL, label: 'Personal', icon: 'person' },
    { key: ReminderCategories.HEALTH, label: 'Health', icon: 'fitness' },
    { key: ReminderCategories.SHOPPING, label: 'Shopping', icon: 'bag' },
    { key: ReminderCategories.APPOINTMENT, label: 'Appointment', icon: 'calendar' },
    { key: ReminderCategories.OTHER, label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const priorities = [
    { key: ReminderPriorities.LOW, label: 'Low', color: '#10b981' },
    { key: ReminderPriorities.MEDIUM, label: 'Medium', color: '#f59e0b' },
    { key: ReminderPriorities.HIGH, label: 'High', color: '#ef4444' },
  ];

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Reminder</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter reminder title..."
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Date & Time *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#6366f1" />
              <Text style={styles.dateButtonText}>{formatDate(datetime)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryButton,
                    category === cat.key && styles.categoryButtonActive
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={category === cat.key ? 'white' : '#6b7280'}
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    category === cat.key && styles.categoryButtonTextActive
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((prio) => (
                <TouchableOpacity
                  key={prio.key}
                  style={[
                    styles.priorityButton,
                    priority === prio.key && { backgroundColor: `${prio.color}20`, borderColor: prio.color }
                  ]}
                  onPress={() => setPriority(prio.key)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: prio.color }]} />
                  <Text style={[
                    styles.priorityButtonText,
                    priority === prio.key && { color: prio.color }
                  ]}>
                    {prio.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>Create Reminder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="datetime"
          onConfirm={(date) => {
            setDatetime(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
          date={datetime}
          minimumDate={new Date()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddReminderForm;
