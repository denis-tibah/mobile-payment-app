import React, { useState } from "react";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import { Text } from "react-native";
import * as Linking from "expo-linking";
import UserInactivity from "react-native-user-detector-active-inactive";
import { useDispatch, useSelector } from "react-redux";

import AppNavigationWrapper from "./AppNavigationWrapper";
import { signout } from "../redux/auth/authSlice";

const AppNavigationContainer = () => {
  const prefix = Linking.createURL("/");
  const appScheme = prefix;
  const urlScheme = "https://www.gozazoo.com/zazoomobilestg";
  const prefixes = [appScheme, urlScheme];
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

  const authData = useSelector((state: any) => state?.auth?.data);
  const dispatch = useDispatch();

  const navigationRef = createNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState("");

  const onStateChange = (state: any) => {
    setCurrentRoute(state?.routes[state.index]?.name);
  };
  return (
    <UserInactivity
      currentScreen={currentRoute}
      skipKeyboard={false}
      timeForInactivity={140}
      onHandleActiveInactive={function () {
        if (authData?.access_token) {
          dispatch(signout());
        }
      }}
      /* consoleTimer={true}
      consoleComponentChange={true}
      consoleTouchScreen={true}
      consoleLongPress={true} */
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
    </UserInactivity>
  );
};

export default AppNavigationContainer;
