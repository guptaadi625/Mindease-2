// screens/SurveyScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  { question: "How often do you feel stressed?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { question: "How often do you feel anxious?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { question: "How well do you sleep?", options: ["Very Well", "Well", "Poorly", "Very Poorly"] },
  { question: "Do you often feel lonely?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { question: "How often do you feel happy?", options: ["Very Often", "Sometimes", "Rarely", "Never"] },
  { question: "How easy is it to manage your emotions?", options: ["Very Easy", "Somewhat Easy", "Difficult", "Very Difficult"] },
  { question: "How high is your self-esteem?", options: ["Very High", "High", "Low", "Very Low"] },
  { question: "How often do you feel overwhelmed?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { question: "How much social support do you have?", options: ["Very Strong", "Moderate", "Weak", "None"] },
  { question: "How often do you practice self-care?", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
  { question: "Do you enjoy your daily activities?", options: ["Always", "Usually", "Sometimes", "Rarely"] },
  { question: "How well do you handle change?", options: ["Very Well", "Well", "Poorly", "Very Poorly"] },
  { question: "How often do you feel hopeless?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { question: "How much energy do you have daily?", options: ["High", "Moderate", "Low", "Very Low"] },
  { question: "Are you able to relax easily?", options: ["Always", "Often", "Sometimes", "Rarely"] },
  { question: "How much control do you feel over your life?", options: ["Very Much", "Moderate", "Little", "None"] },
  { question: "How often do you feel angry?", options: ["Rarely", "Sometimes", "Often", "Always"] },
  { question: "How optimistic are you about the future?", options: ["Very Optimistic", "Somewhat Optimistic", "Neutral", "Pessimistic"] },
  { question: "How often do you laugh?", options: ["Multiple times a day", "Once a day", "Few times a week", "Rarely"] },
  { question: "How often do you feel relaxed?", options: ["Daily", "Several times a week", "Rarely", "Never"] },
  { question: "Do you set personal goals?", options: ["Always", "Often", "Rarely", "Never"] },
  { question: "How much do you exercise?", options: ["Daily", "Few times a week", "Rarely", "Never"] },
  { question: "How often do you engage in hobbies?", options: ["Daily", "Weekly", "Rarely", "Never"] },
  { question: "How often do you feel gratitude?", options: ["Daily", "Weekly", "Rarely", "Never"] },
  { question: "How easily do you forgive others?", options: ["Very Easily", "Somewhat Easily", "Rarely", "Never"] },
  { question: "How connected do you feel to others?", options: ["Very Connected", "Somewhat Connected", "Rarely Connected", "Not Connected"] }
];

export default function SurveyScreen({ navigation }) {
  const { fontSize } = useContext(GlobalContext);
  const { colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleOptionPress = (option) => {
    const updatedAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(updatedAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateMentalHealthScore(updatedAnswers);
      navigation.navigate('Chatbot', { surveyAnswers: updatedAnswers }); // Automatically navigate to Chatbot after survey
    }
  };

  const calculateMentalHealthScore = async (finalAnswers) => {
    let score = 0;
    const scoring = {
      "Rarely": 3, "Very Well": 3, "Very High": 3, "Very Strong": 3, "Very Much": 3,
      "Always": 3, "Very Optimistic": 3, "Multiple times a day": 3, "Daily": 3,
      "Somewhat Easily": 2, "Weekly": 2, "Once a day": 2, "High": 3, "Moderate": 2,
      "Usually": 2, "Few times a week": 2, "Neutral": 1, "Sometimes": 2,
      "Somewhat Connected": 2, "Often": 1, "Low": 1, "Poorly": 1, "Weak": 1,
      "Rarely Connected": 1, "Little": 1, "Never": 0, "Very Poorly": 0, "Very Low": 0,
      "Very Difficult": 0, "None": 0, "Pessimistic": 0, "Not Connected": 0
    };

    for (const key in finalAnswers) {
      const answer = finalAnswers[key];
      score += scoring[answer] !== undefined ? scoring[answer] : 1;
    }

    const maxScore = questions.length * 3;
    const percentage = Math.round((score / maxScore) * 100);

    const profile = { mentalHealthScore: percentage };
    await AsyncStorage.mergeItem('userProfile', JSON.stringify(profile));

    Alert.alert("Survey Completed!", `Your Mental Health Score is ${percentage}%`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30, justifyContent: 'center', flex: 1 }}>
        <Text style={[styles.title, { color: colors.text, fontSize: fontSize === 'small' ? 20 : fontSize === 'large' ? 28 : 24 }]}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>

        <Text style={[styles.question, { color: colors.text }]}>
          {questions[currentQuestion].question}
        </Text>

        {questions[currentQuestion].options.map((option, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionButton}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={{ color: colors.text }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
});
