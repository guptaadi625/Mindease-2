// screens/ProfileScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { GlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const { fontSize } = useContext(GlobalContext);
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 22 : 18;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // Fetch user profile data if it exists
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const { name, age, gender } = JSON.parse(savedProfile);
        setName(name);
        setAge(age);
        setGender(gender);
      }
    };
    loadProfile();
  }, []);

  const handleProfileCompletion = async () => {
    if (!name || !age || !gender) {
      Alert.alert('Profile Incomplete', 'Please fill in all fields.');
    } else {
      const userProfile = { name, age, gender };
      // Save the profile data to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));

      // After profile completion, navigate to Survey or next screen
      navigation.navigate('Survey');
    }
  };

  const handleEditProfile = () => {
    // This will allow the user to update their profile
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: dynamicFontSize + 10 }]}>Complete Your Profile</Text>

      <TextInput
        style={[styles.input, { fontSize: dynamicFontSize }]}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { fontSize: dynamicFontSize }]}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { fontSize: dynamicFontSize }]}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />

      <Button title="Save Profile" onPress={handleProfileCompletion} />

      {/* If profile exists, show the Edit button */}
      <Button title="Edit Profile" onPress={handleEditProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
