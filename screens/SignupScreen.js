// screens/SignupScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalContext } from '../GlobalContext';
import { users } from '../usersData';
import * as Haptics from 'expo-haptics'; // ✅ Import Haptics

export default function SignupScreen({ navigation }) {
  const { fontSize } = useContext(GlobalContext);
  const { colors } = useTheme();
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 22 : 18;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ Vibrate on Sign Up

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      Alert.alert('Signup Failed', 'Email already exists!');
    } else {
      users.push({ email, password });
      Alert.alert('Signup Successful', 'You can now login!');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: dynamicFontSize + 10 }]}>
        Create an Account
      </Text>

      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, fontSize: dynamicFontSize }]}
        placeholder="Email"
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, fontSize: dynamicFontSize }]}
        placeholder="Password"
        placeholderTextColor={colors.text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignup} />
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
