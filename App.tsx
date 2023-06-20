import React, { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootSiblingParent } from 'react-native-root-siblings'

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { persistor, store } from "./store";
import AppNavigationWrapper from "./navigation/AppNavigationWrapper";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Mukta-Regular": require("./assets/fonts/Mukta-Regular.ttf"),
    "Mukta-SemiBold": require("./assets/fonts/Mukta-SemiBold.ttf"),
    "Mukta-Bold": require("./assets/fonts/Mukta-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          <NavigationContainer>
            <RootSiblingParent>
              <AppNavigationWrapper />
            </RootSiblingParent>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
