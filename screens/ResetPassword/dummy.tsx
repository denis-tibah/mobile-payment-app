import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPasswordScreen from './ResetPasswordScreen';
import * as Linking from 'expo-linking'; // Example if using Expo for deep linking

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Handle deep linking when the app is launched or resumed
    const handleDeepLink = async (url) => {
      if (url) {
        const { path, queryParams } = Linking.parse(url);

        if (path === 'reset-password') {
          const token = queryParams?.token;
          const email = queryParams?.email;

          // Navigate to ResetPasswordScreen with token and email
          navigation.navigate('ResetPassword', { token, email });
        }
      }
    };

    // Add event listeners for deep linking
    Linking.addEventListener('url', (event) => handleDeepLink(event.url));

    // Handle initial deep link when the app is launched
    Linking.getInitialURL().then((url) => handleDeepLink(url));

    // Clean up listeners when the component unmounts
    return () => {
      Linking.removeEventListener('url', (event) => handleDeepLink(event.url));
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
