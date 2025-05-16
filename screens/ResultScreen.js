// screens/ResultScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics'; // ✅ Import Haptics

export default function ResultScreen({ route, navigation }) {
  const { surveyAnswers } = route.params;
  const [suggestions, setSuggestions] = useState([]);

  // Wrap generateSuggestions with useCallback to prevent re-creation on every render
  const generateSuggestions = useCallback(() => {
    let tips = [];

    Object.values(surveyAnswers).forEach((answer) => {
      if (answer === 'Often') {
        tips.push('Consider talking to a mental health professional.');
      } else if (answer === 'Sometimes') {
        tips.push('Try meditation, deep breathing exercises, and regular sleep routines.');
      } else if (answer === 'Rarely') {
        tips.push('Keep maintaining your good mental health habits!');
      }
    });

    setSuggestions(tips);
  }, [surveyAnswers]); // Depends on surveyAnswers, ensures it updates with new answers

  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]); // Call generateSuggestions when the component mounts or surveyAnswers change

  const handleChatbotPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ Vibrate on button press
    navigation.navigate('Chatbot');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Mental Health Suggestions</Text>
      {suggestions.map((tip, index) => (
        <View key={index} style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>{tip}</Text>
        </View>
      ))}
      <Button title="Talk to Chatbot" onPress={handleChatbotPress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  suggestionBox: {
    width: '100%',
    backgroundColor: '#e0f7fa',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
});
