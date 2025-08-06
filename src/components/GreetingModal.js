
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const timeQuotes = [
  "always remember that time is the most valuable thing you can spend.",
  "time flies when you're making the most of every moment.",
  "the best time to plant a tree was 20 years ago. The second best time is now.",
  "time is what we want most, but what we use worst.",
  "your time is limited, don't waste it living someone else's life.",
  "time is the coin of your life. It is the only coin you have, and you can determine how it will be spent.",
  "yesterday is history, tomorrow is a mystery, today is a gift - that's why it's called the present.",
  "time waits for no one, but it rewards those who use it wisely.",
  "every second is a chance to turn your life around.",
  "time is free, but it's priceless. You can't own it, but you can use it."
];

const GreetingModal = ({ onNameSet }) => {
  const [name, setName] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      const randomQuote = timeQuotes[Math.floor(Math.random() * timeQuotes.length)];
      setCurrentQuote(randomQuote);
      setShowQuote(true);
      
      setTimeout(() => {
        onNameSet(name.trim(), randomQuote);
      }, 3000);
    }
  };

  if (showQuote) {
    return (
      <Modal visible={true} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.quoteIcon}
              >
                <Ionicons name="sparkles" size={24} color="white" />
              </LinearGradient>
              <Text style={styles.quoteTitle}>Hey {name}!</Text>
            </View>
            
            <View style={styles.quoteContent}>
              <View style={styles.wisdomHeader}>
                <Ionicons name="time" size={20} color="#8b5cf6" />
                <Text style={styles.wisdomText}>TIME WISDOM</Text>
              </View>
              
              <Text style={styles.quote}>
                <Text style={styles.quoteName}>Hey {name}</Text>, {currentQuote}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.iconContainer}
            >
              <Ionicons name="person" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Welcome!</Text>
            <Text style={styles.cardSubtitle}>What should we call you?</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name..."
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>
          
          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!name.trim()}
          >
            <LinearGradient
              colors={!name.trim() ? ['#d1d5db', '#d1d5db'] : ['#6366f1', '#8b5cf6']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quoteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  quoteHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  quoteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  quoteContent: {
    alignItems: 'center',
  },
  wisdomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  wisdomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
    marginLeft: 8,
    letterSpacing: 1,
  },
  quote: {
    fontSize: 18,
    lineHeight: 28,
    color: '#374151',
    textAlign: 'center',
  },
  quoteName: {
    fontWeight: '600',
    color: '#6366f1',
  },
});

export default GreetingModal;
