// context/GlobalContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Global Context
export const GlobalContext = createContext();

// Default LightTheme Object
export const LightTheme = {
  dark: false,
  colors: {
    primary: '#6200EE',
    background: '#ffffff',
    card: '#f1f1f1',
    text: '#000000',
    border: '#cccccc',
    notification: '#ff3d00',
  },
};

// GlobalProvider Component that wraps the app
export const GlobalProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default theme is light
  const [fontSize, setFontSize] = useState('medium'); // Default font size

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedFontSize = await AsyncStorage.getItem('fontSize');

      if (savedTheme) {
        setIsDarkTheme(savedTheme === 'dark'); // Load saved theme
      }
      if (savedFontSize) {
        setFontSize(savedFontSize); // Load saved font size
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    AsyncStorage.setItem('fontSize', fontSize);
  }, [isDarkTheme, fontSize]);

  // Functions to toggle theme and change font size
  const toggleTheme = () => setIsDarkTheme(prev => !prev);
  const changeFontSize = (size) => setFontSize(size);

  return (
    <GlobalContext.Provider value={{
      isDarkTheme, toggleTheme,
      fontSize, changeFontSize
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
