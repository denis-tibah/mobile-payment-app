import React, { useCallback, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import * as Linking from "expo-linking";
import { createNavigationContainerRef } from "@react-navigation/native";

import AppNavigationContainer from "./navigation/AppNavigationContainer";


export default function App() {
  // added by Aristos for deep linking

  const prefix = Linking.createURL("/");
  const appScheme = prefix;
  const urlScheme = "https://www.gozazoo.com/zazoomobilestg";
  const prefixes = [appScheme, urlScheme];
  console.log('process',process);
  const [currentRoute, setCurrentRoute] = useState("");

  /* const authData = useSelector((state: any) => state?.auth?.data);
  console.log("🚀 ~ file: App.tsx:30 ~ App ~ authData:", authData);
  const dispatch = useDispatch(); */

  const linking = {
    prefixes,
    // prefixes: [prefix],
    config: {
      screens: {
        login: "login",
        signup: "signup",
        ResetPassword: "ResetPassword",
        NotFound: "*",
      },
    },
  };

  //// const url = Linking.useURL();
  // const prefix = Linking.createURL("/");
  // const linking = {
  //   prefixes: [prefix],
  //   config: {
  //     screens: {
  //       Login: "login",
  //       Signup: "signup",
  //     },
  //   },
  // };

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
  const navigationRef = createNavigationContainerRef();

  const onStateChange = (state: any) => {
    setCurrentRoute(state?.routes[state.index]?.name);
  };
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaProvider onLayout={onLayoutRootView}>
          {/* <NavigationContainer>  */}
          {/* <UserInactivity
            currentScreen={currentRoute}
            skipKeyboard={false}
            timeForInactivity={20}
            onHandleActiveInactive={function () {
              console.log("inactive");
            }}
            consoleTimer={true}
            consoleComponentChange={true}
            consoleTouchScreen={true}
            consoleLongPress={true}
          >
            <NavigationContainer
              ref={navigationRef}
              onStateChange={onStateChange}
              linking={linking}
              fallback={<Text>Loading...</Text>}
            >
              <RootSiblingParent>
                <AppNavigationWrapper />
              </RootSiblingParent>
            </NavigationContainer>
          </UserInactivity> */}
          <AppNavigationContainer />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
