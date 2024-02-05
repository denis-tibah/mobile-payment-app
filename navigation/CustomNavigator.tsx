import React, { useCallback, useEffect, useRef, Fragment } from "react";
import { useKeycloak } from "@react-keycloak/native";
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  StackRouter,
} from "@react-navigation/native";
import { View, PanResponder } from "react-native";
const CustomNavigator = ({
  initialRouteName,
  children,
  screenOptions,
}: any) => {
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  const [keycloak] = useKeycloak();
  const timerId = useRef(false);
  useEffect(() => {
    resetInactivityTimeout();
  }, [resetInactivityTimeout]);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
      },
    })
  ).current;
  const resetInactivityTimeout = useCallback(() => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      // action after user has been detected idle
      // ex: logout from the app
      console.log("timeout");
    }, 3000);
  }, []);
  return (
    <Fragment>{descriptors[state.routes[state.index].key].render()}</Fragment>
  );
};
export default CustomNavigator;
