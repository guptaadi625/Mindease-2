// screens/SettingsScreen.js

import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, Switch, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics'; // ✅ Import Haptics

export default function SettingsScreen() {
  const { isDarkTheme, toggleTheme, fontSize, changeFontSize } = useContext(GlobalContext);
  const { colors } = useTheme();
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 22 : 18;
  const [primaryColor, setPrimaryColor] = useState('#6200EE'); // default

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ Vibrate on Save

    try {
      await AsyncStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('fontSize', fontSize);
      await AsyncStorage.setItem('primaryColor', primaryColor);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings', error);
      alert('Failed to save settings.');
    }
  };

  const handleResetData = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // ✅ Vibrate on Reset

    try {
      await AsyncStorage.clear();
      alert('All app data reset successfully!');
    } catch (error) {
      console.error('Error resetting app data', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: dynamicFontSize + 10 }]}>
        App Settings
      </Text>

      {/* Theme Switch */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: colors.text, fontSize: dynamicFontSize }]}>
          Dark Theme:
        </Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>

      {/* Font Size */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: colors.text, fontSize: dynamicFontSize }]}>
          Font Size:
        </Text>
        <View style={styles.buttonRow}>
          <Button title="Small" onPress={() => { changeFontSize('small'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} />
          <Button title="Medium" onPress={() => { changeFontSize('medium'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} />
          <Button title="Large" onPress={() => { changeFontSize('large'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} />
        </View>
      </View>

      {/* Primary Color */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: colors.text, fontSize: dynamicFontSize }]}>
          Primary Color:
        </Text>
        <View style={styles.buttonRow}>
          <Button title="Purple" onPress={() => { setPrimaryColor('#6200EE'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} />
          <Button title="Blue" onPress={() => { setPrimaryColor('#2196F3'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} />
          <Button title="Green" onPress={() => { setPrimaryColor('#4CAF50'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} />
        </View>
      </View>

      {/* Reset Button */}
      <View style={{ marginVertical: 20 }}>
        <Button title="Reset All App Data" color="red" onPress={handleResetData} />
      </View>

      {/* About */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: 'center', color: colors.text, fontSize: dynamicFontSize }}>
          MindEase v1.0.0
        </Text>
        <Text style={{ textAlign: 'center', color: colors.text, fontSize: dynamicFontSize }}>
          Developed by Aditya
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Save Settings" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  settingRow: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
