// screens/SuccessScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SuccessScreen({ navigation }) {
  const { colors } = useTheme();
  const [mentalHealthScore, setMentalHealthScore] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setMentalHealthScore(parsed.mentalHealthScore || 0);
        setName(parsed.name || '');
      }
    } catch (error) {
      console.error('Error loading profile', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.emoji, { color: colors.text }]}>🎉</Text>
      <Text style={[styles.congrats, { color: colors.text }]}>Congratulations {name}!</Text>
      <Text style={[styles.score, { color: colors.text }]}>
        Your Mental Health Score: {mentalHealthScore}%
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button
          title="Start Chat with MindEase"
          onPress={() => navigation.replace('Chatbot')}
          color="#6200EE"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  congrats: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  score: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
});
