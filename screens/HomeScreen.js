// HomeScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics'; // For haptic feedback
import * as ImagePicker from 'expo-image-picker'; // Image Picker for profile pic

export default function HomeScreen({ navigation }) {
  const { isDarkTheme, fontSize } = useContext(GlobalContext);
  const { colors } = useTheme();
  
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 22 : 18;

  const [mentalHealthScore, setMentalHealthScore] = useState(75); // Mock score
  const [quote, setQuote] = useState('Stay positive, stay healthy!');
  const [userName, setUserName] = useState('Aditya'); // Placeholder user name
  const [profilePic, setProfilePic] = useState(null); // Placeholder profile pic (can be uploaded by user)
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch a random motivational quote or data from an API (here it's static for simplicity)
    setQuote('Stay positive, stay healthy!');
    
    // Set recommendations based on mock score
    setRecommendations(generateRecommendations(mentalHealthScore));
  }, [mentalHealthScore]);

  // Generate recommendations based on score
  const generateRecommendations = (score) => {
    if (score >= 80) {
      return ["Great job! Keep up the good work.", "Consider meditation to maintain your balance."];
    } else if (score >= 50) {
      return ["Take some time for yourself today.", "Try to incorporate more self-care practices."];
    } else {
      return ["Consider talking to a mental health professional.", "Practice deep breathing exercises."];
    }
  };

  const handleStartSurvey = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Add haptic feedback
    navigation.navigate('Survey');
  };

  const handleStartChatbot = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Add haptic feedback
    navigation.navigate('Chatbot');
  };

  // Function to handle image selection (Profile Picture)
  const handlePickImage = async () => {
    // Ask for permissions to use the camera and gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "We need permission to access your photos.");
      return;
    }

    // Open the image picker for the user to choose a photo
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setProfilePic(pickerResult.uri); // Set the picked image URI as the profile picture
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: dynamicFontSize + 10 }]}>Welcome to MindEase</Text>

      {/* User Profile */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={profilePic ? { uri: profilePic } : require('../assets/snack-icon.png')} // Placeholder image
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <Text style={[styles.profileName, { color: colors.text, fontSize: dynamicFontSize }]}>
          {userName}
        </Text>
      </View>

      {/* Mental Health Score */}
      <Text style={[styles.scoreText, { color: colors.text, fontSize: dynamicFontSize }]}>
        Your Mental Health Score: {mentalHealthScore}%
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${mentalHealthScore}%`, backgroundColor: '#6200EE' }]} />
      </View>

      {/* Daily Tip/Quote */}
      <Text style={[styles.quoteText, { color: colors.text, fontSize: dynamicFontSize }]}>
        "{quote}"
      </Text>

      {/* Quick Access Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStartSurvey}>
          <Text style={{ color: colors.text }}>Start Survey</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleStartChatbot}>
          <Text style={{ color: colors.text }}>Chat with MindEase</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationsSection}>
        <Text style={[styles.recommendationTitle, { color: colors.text }]}>Recommendations:</Text>
        {recommendations.map((recommendation, index) => (
          <Text key={index} style={[styles.recommendationText, { color: colors.text }]}>
            - {recommendation}
          </Text>
        ))}
      </View>

      {/* Access to Resources */}
      <View style={styles.resourcesSection}>
        <Text style={[styles.resourcesTitle, { color: colors.text }]}>Resources:</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ color: '#6200EE' }}>Mental Health Articles</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={{ color: '#6200EE' }}>Crisis Helplines</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  quoteText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 12,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    margin: 10,
    width: '40%',
    alignItems: 'center',
  },
  recommendationsSection: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  resourcesSection: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
