import { Platform, View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { screenNames } from "../utils/helpers"
import vars from "../styles/vars"
import AccountIcon from "../assets/icons/Account"
import TransactionIcon from "../assets/icons/Transaction"
import CardIcon from "../assets/icons/Card"
import PaymentIcon from "../assets/icons/Euro"
import PayeeIcon from "../assets/icons/Beneficiary"
import KeyboardDismiss from "../components/KeyboardDismiss";
import StatementsIcon from "../assets/icons/StatementsIcon";

const Tab = createBottomTabNavigator()
export default function TabNavigation({ children }: any) {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            if (route.name === screenNames.myaccount) {
              return <AccountIcon size={size} color={focused ? "pink" : "soft-pink"} />
            }
            if (route.name === screenNames.transactions) {
              return <TransactionIcon size={size} color={focused ? "pink" : "soft-pink"} />
            }
            if (route.name === screenNames.card) {
              return <CardIcon size={size} color={focused ? "pink" : "soft-pink"} />
            }
            if (route.name === screenNames.payments) {
              return <PaymentIcon size={35} color={focused ? "pink" : "soft-pink"} />
            }
            if (route.name === screenNames.statements) {
              return <StatementsIcon size={35} color={focused ? "pink" : "soft-pink"} />
            }
            if (
              route.name === screenNames.payees ||
              route.name === screenNames.addPayee
            ) {
              return (
                <PayeeIcon size={size} color={focused ? "pink" : "soft-pink"} />
              );
            }
          },

          tabBarStyle: {
            width: '120%',
            alignItems: "center",
            backgroundColor: 'white',
            height: Platform.OS === "ios" && 94 || 64,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 1,
            elevation: 10,
            zIndex:99,
            borderTopWidth: 0,
            bottom:0
          },
          tabBarShowLabel: false,
          tabBarIconStyle: { backgroundColor: "blue", position: "relative" },
          tabBarActiveTintColor: vars["accent-pink"],
          headerShown: false,
        })}>
        {children}
      </Tab.Navigator>
      <KeyboardDismiss />
    </>
  )
}
