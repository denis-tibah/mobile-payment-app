import React, { Fragment, useState, useEffect } from "react";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import { Text, View } from "react-native";
import * as Linking from "expo-linking";
/* import UserInactivity from "react-native-user-detector-active-inactive"; */
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "react-native-error-boundary";
import UserInactivity from "react-native-user-inactivity";
import { PaperProvider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useAtom } from "jotai";

import AppNavigationWrapper from "./AppNavigationWrapper";
import ErrorFallback from "../components/ErrorFallback";
import { signout } from "../redux/auth/authSlice";
import { setInActivityState } from "../redux/account/accountSlice";
import { sessionToken } from "../utils/globalStates";

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

  const expiresInConvertToSeconds = authData?.expires_in
    ? parseInt(authData?.expires_in, 10) * 1000
    : 60000;

  const dispatch = useDispatch();

  const navigationRef = createNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState("");

  const [userSessionToken, setSessionToken] = useAtom(sessionToken);

  const onStateChange = (state: any) => {
    setCurrentRoute(state?.routes[state.index]?.name);
  };

  const handleJSErrorForErrorBoundary = (error: any, stackTrace: string) => {
    // Show error locally on DEBUG mode
    console.log(stackTrace, error);
  };

  // runs in dev environment
  // run this on dev environment. set global variable setLoginToken in order not to get logged out
  if (__DEV__) {
    if (authData?.access_token) {
      setSessionToken(authData?.access_token);
    }
  } else {
    setSessionToken(null);
  }

  //runs in production environment
  // log out user if not dev environment and global variable loginToken is not set
  useEffect(() => {
    if (!userSessionToken && !__DEV__) {
      dispatch(signout());
    }
  }, [userSessionToken]);

  /*  return (
    <UserInactivity
      currentScreen={currentRoute}
      skipKeyboard={true}
      timeForInactivity={140}
      onHandleActiveInactive={function () {
        if (authData?.access_token) {
          dispatch(setInActivityState(true));
        }
      }}
    >
      <ErrorBoundary
        onError={handleJSErrorForErrorBoundary}
        FallbackComponent={ErrorFallback}
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
      </ErrorBoundary>
    </UserInactivity>
  ); */

  return (
    <UserInactivity
      timeForInactivity={expiresInConvertToSeconds}
      onAction={(isActive) => {
        if (authData?.access_token) {
          if (!isActive) {
            dispatch(setInActivityState(true));
          }
        }
      }}
      style={{ flex: 1 }}
    >
      <ErrorBoundary
        onError={handleJSErrorForErrorBoundary}
        FallbackComponent={ErrorFallback}
      >
        <NavigationContainer
          ref={navigationRef}
          onStateChange={onStateChange}
          linking={linking}
          fallback={
            <View>
              {/* <Spinner visible={true} /> */}
              <Text>Loading...</Text>
            </View>
          }
        >
          <PaperProvider>
            <RootSiblingParent>
              <AppNavigationWrapper />
            </RootSiblingParent>
          </PaperProvider>
        </NavigationContainer>
      </ErrorBoundary>
    </UserInactivity>
  );
};

export default AppNavigationContainer;
