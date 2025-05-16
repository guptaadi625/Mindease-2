// App.js

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import SurveyScreen from './screens/SurveyScreen';
import SuccessScreen from './screens/SuccessScreen'; // ✅ Success after survey
import ChatbotScreen from './screens/ChatbotScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import { GlobalProvider, GlobalContext, LightTheme } from './GlobalContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <GlobalContext.Consumer>
        {({ isDarkTheme }) => (
          <NavigationContainer theme={isDarkTheme ? DarkTheme : LightTheme}>
            <Stack.Navigator initialRouteName="Splash">
              
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Survey" component={SurveyScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Success" component={SuccessScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{ headerShown: false }} />

            </Stack.Navigator>
          </NavigationContainer>
        )}
      </GlobalContext.Consumer>
    </GlobalProvider>
  );
}
