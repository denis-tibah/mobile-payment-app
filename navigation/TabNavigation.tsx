import { Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { screenNames } from "../utils/helpers";
import vars from "../styles/vars";
import AccountIcon from "../assets/icons/Account";
import TransactionIcon from "../assets/icons/Transaction";
import CardIcon from "../assets/icons/Card";
import PaymentIcon from "../assets/icons/Euro";
import PayeeIcon from "../assets/icons/Beneficiary";
import KeyboardDismiss from "../components/KeyboardDismiss";
import StatementsIcon from "../assets/icons/StatementsIcon";

const Tab = createBottomTabNavigator();
export default function TabNavigation({ children }: any) {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          ...(route.name === screenNames.payments && {
            unmountOnBlur: true,
          }),
          ...(route.name === screenNames.payees && {
            unmountOnBlur: true,
          }),
          tabBarIcon: ({ focused, size }) => {
            if (route.name === screenNames.myaccount) {
              return (
                <AccountIcon
                  size={size}
                  color={focused ? "pink" : "soft-pink"}
                />
              );
            }
            if (route.name === screenNames.transactions) {
              return (
                <TransactionIcon
                  size={size}
                  color={focused ? "pink" : "soft-pink"}
                />
              );
            }
            if (route.name === screenNames.card) {
              return (
                <CardIcon size={size} color={focused ? "pink" : "soft-pink"} />
              );
            }
            if (route.name === screenNames.payments) {
              return (
                <PaymentIcon size={30} color={focused ? "pink" : "soft-pink"} />
              );
            }
            if (route.name === screenNames.statements) {
              return (
                <StatementsIcon
                  size={35}
                  color={focused ? "pink" : "soft-pink"}
                />
              );
            }
            if ( route.name === screenNames.payees ) {
              return (
                <PayeeIcon size={size} color={focused ? "pink" : "soft-pink"} />
              );
            }
          },

          tabBarStyle: {
            width: "120%",
            alignItems: "center",
            backgroundColor: "white",
            height: (Platform.OS === "ios" && 94) || 64,
            shadowColor: "black",
            shadowOffset: { width: -2, height: 15 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            zIndex: 99,
            elevation: 10,
          },
          tabBarShowLabel: false,
          tabBarIconStyle: { backgroundColor: "blue", position: "relative" },
          tabBarActiveTintColor: vars["accent-pink"],
          headerShown: false,
        })}
      >
        {children}
      </Tab.Navigator>
      <KeyboardDismiss />
    </>
  );
}
