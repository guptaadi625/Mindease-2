// screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { users } from '../usersData';
import { GlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics'; // ✅ Import Haptics

export default function LoginScreen({ navigation }) {
  const { fontSize } = useContext(GlobalContext);
  const { colors } = useTheme();
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 22 : 18;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ Vibrate on Login

    const userFound = users.find(
      (user) => user.email === email && user.password === password
    );

    if (userFound) {
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
      }
      navigation.navigate('MainTabs');
    } else {
      alert('Login Failed: Incorrect email or password!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: dynamicFontSize + 10 }]}>
        Welcome Back
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

      <View style={styles.rememberContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={{ color: colors.text, fontSize: dynamicFontSize }}>Remember Me</Text>
      </View>

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ marginTop: 16, color: '#6200EE', textAlign: 'center', fontSize: dynamicFontSize }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
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
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});
