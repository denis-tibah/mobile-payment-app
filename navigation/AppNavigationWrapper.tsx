import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { useDispatch, useSelector } from "react-redux";

import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";
import ResetPassword from "../screens/ResetPassword";
import ProfileDetails from "../components/SignupComponents/ProfileDetails";
import MyAccountScreen from "../screens/MyAccount";
import TransactionApprovalScreen from "../screens/TransactionApproval/index";
import PaymentReceivedScreen from "../screens/PaymentReceivedMessage";

import EmailVerifiedMessageV2 from "../screens/EmailVerifiedMessageV2"

import ForgottenPassword from "../screens/ForgottenPassword";

import TransactionsScreen from "../screens/Transactions";
import CardScreen from "../screens/Card";
import PaymentScreen from "../screens/Payments";
import PayeeScreen from "../screens/Payees";
import AddPayeeScreen from "../screens/AddPayee";
import ProfileScreen from "../screens/Profile";

import TabNavigation from "./TabNavigation";
import { registerForPushNotificationsAsync } from "../components/PushNotification";
import { screenNames } from "../utils/helpers";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../store";
import { AppState } from "react-native";
import { signout } from "../redux/auth/authSlice";
import * as SecureStore from "expo-secure-store";
import Inactivity from "../components/Inactivity";

// import * as TaskManager from 'expo-task-manager';

const Tab = createBottomTabNavigator();
const Root = createNativeStackNavigator();
const Payee = createStackNavigator();

// const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
//   console.log('Received a notification in the background!');
//   // Do something with the notification data
// });

// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function PayeeStack() {
  return (
    <Payee.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Payee.Screen name={screenNames.payeesList} component={PayeeScreen} />
      <Payee.Screen name={screenNames.addPayee} component={AddPayeeScreen} />
    </Payee.Navigator>
  );
}

function DashboardStack() {
  return (
    <TabNavigation>
      <Tab.Screen name={screenNames.myaccount} component={MyAccountScreen} />
      <Tab.Screen
        name={screenNames.transactions}
        component={TransactionsScreen}
        // children={() => <TransactionsScreen initial={true} />}
      />
      <Tab.Screen name={screenNames.card} component={CardScreen} />
      <Tab.Screen name={screenNames.payments} component={PaymentScreen} />
      <Tab.Screen name={screenNames.payees} component={PayeeStack} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </TabNavigation>
  );
}

export default function AppNavigationWrapper() {
  const auth = useSelector((state: RootState) => state.auth);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const isUserInavtive = useSelector((state: RootState) => state.account.inactivityState);
  const [lastNotification, setLastNotification] = useState("");
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const [showApproval, setShowApproval] = useState({ show: false, data: {} });
  const [showReceivedPayment, setShowReceivedPayment] = useState({
    show: false,
    data: {},
  });
  const [showEmailVerified, setShowEmailVerified] = useState({
    show: false,
    data: {},
  });
  
  /*  const appState = useRef(AppState.currentState); */

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [selectedNavIndex, setNavIndex] = useState<number>(1);
  /* const [appCurrentState, setAppState] = useState(AppState.currentState); */
  const [isAppInactive, setIsAppInactive] = useState(false);
  const INACTIVE_TIMEOUT = 60000; // 60 seconds (adjust as needed)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //register token when app opens
  // useEffect(() => {
  //   if (!expoPushToken)
  //     registerForPushNotificationsAsync(0, '0').then(
  //       (token) => setExpoPushToken(token)
  //     );
  //   }, []);

  /* useEffect(() => {
    if (!expoPushToken) {
      registerForPushNotificationsAsync(0, "0").then((token) =>
        setExpoPushToken(token)
      );
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          handlePushNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          handlePushNotification(response.notification);
        });
    }
  }, []); */

  // console.log("*********hit transactionDetails.requestType********* ");

  // useEffect(() => {
  //   if (!expoPushToken) {
  //     console.log("*******Aristos expo going here********");
  //     registerForPushNotificationsAsync(0, auth?.data?.uuid).then(
  //       (token) => {
  //         setExpoPushToken(token);
  //         console.log("*******expo token********", token);
  //       }
  //     );
  //   }
  // }, []);


  useEffect(() => {
    if (userData?.id && auth?.data?.uuid && !expoPushToken) {
      // console.log("*******expo going here********");
      registerForPushNotificationsAsync(userData.id, auth?.data?.uuid,auth?.data?.email).then(
        (token) => {
          setExpoPushToken(token);
        }
      );
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        handlePushNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handlePushNotification(response.notification);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userData?.id, expoPushToken, auth?.data?.uuid]);

  const handlePushNotification = (notification: any) => {
    // console.log(
    //   "*************** ~ file: AppNavigationWrapper.tsx:152 ~ handlePushNotification ~ notification:",
    //   notification
    // );
    
    // console.log(
    //   "*************** ~ file: AppNavigationWrapper.tsx:152 ~ handlePushNotification ~ notification:",
    //   notification
    // );
    
    if (notification?.request?.identifier === lastNotification) return;
    
    
    const transactionDetails = notification?.request?.content?.data;
    const emailverificationData = notification?.request?.content?.data;


    if (transactionDetails.requestType === "TransactionApproval") {

      //save notification id so we can remove it from the taskbar
      setLastNotification(notification?.request?.identifier);
      setShowApproval({
        show: true,
        data: { transactionDetails, userId: userData?.id },
      });
      navigation.navigate(screenNames.approve, {
        transactionDetails,
        userId: userData?.id,
      });
    }




    if (transactionDetails.requestType === "PaymentReceived") {

      //save notification id so we can remove it from the taskbar
      setLastNotification(notification?.request?.identifier);
      setShowReceivedPayment({
        show: true,
        data: { transactionDetails, userId: userData?.id },
      });
      navigation.navigate(screenNames.receivedPayment, {
        transactionDetails,
        userId: userData?.id,
      });
    }

    //email verificationL his is triggerd by /verifyemailfinxp webservice
    if (emailverificationData.requestType === "EmailVerified") {
      //save notification id so we can remove it from the taskbar
      setLastNotification(notification?.request?.identifier); 

      setShowEmailVerified({
        show: true,
        data: { emailverificationData, userId: userData?.id },
      });

      // console.log("***********emailverificationData ********************",emailverificationData );

      //   navigation.navigate(screenNames.emailVerified, {
      //       // isOpenEmailVerified: true,
      //       emailverificationData,
      //       userId: userData?.id,
      //     });

    }


  };

  const isBiometric = async () => {
    const email = await SecureStore.getItemAsync("email");
    const password = await SecureStore.getItemAsync("password");
    if (email && password) {
      return true;
    }
    return false;
  };


  useEffect(() => {
    const handleAppStateChange = async (nextAppState: any) => {
      const isBiometricAuth = await isBiometric();
      if (nextAppState === "active") {
        // if nextAppState is active clear/refresh the timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // if nextAppState is in other state run a timer and if the reach INACTIVE_TIMEOUT and isBiometricAuth, log out the user
        timerRef.current = setTimeout(() => {
          if (isBiometricAuth) {
            dispatch(signout());
            timerRef.current = null;
          }
        }, INACTIVE_TIMEOUT);

        return () => {
          // Clear the timer if the component unmounts
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        };
      }
    };

    // Add event listeners when the component mounts
    const handleAppStateChangeEventListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      handleAppStateChangeEventListener.remove();
      // Clear the timer if the component unmounts
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <TransactionApprovalScreen
        isOpen={showApproval?.show}
        data={showApproval?.data}
        setShowApproval={setShowApproval}
        notificationIdentifier={lastNotification}
      />
      <PaymentReceivedScreen
        isOpen={showReceivedPayment?.show}
        data={showReceivedPayment?.data}
        setShowReceivedPayment={setShowReceivedPayment}
        notificationIdentifier={lastNotification}
      />
      <EmailVerifiedMessageV2
        isOpen={showEmailVerified?.show}
        data={showEmailVerified?.data}
        setShowEmailVerified={setShowEmailVerified}
        notificationIdentifier={lastNotification}
      />

      <Inactivity
        isOpen={isUserInavtive}
        closePopup={() => dispatch(signout())}
      />

      <Root.Navigator
        screenOptions={{
          header: () => {
            return <Header />;
          },
        }}
      >
        {auth?.isAuthenticated ? (
          <>
            <Root.Screen
              name="dashboard"
              component={DashboardStack}
              options={{ headerShown: false }}
            />
            <Root.Screen
              name="profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Root.Screen
              options={{ headerShown: false }}
              name={screenNames.addPayee}
              component={AddPayeeScreen}
            />
            <Root.Screen
              options={{ headerShown: false }}
              name={screenNames.payees}
              component={PayeeScreen}
            />
            <Root.Screen
              options={{ headerShown: false }}
              name={screenNames.approve}
              component={TransactionApprovalScreen}
            />
            <Root.Screen
              options={{ headerShown: false }}
              name={screenNames.receivedPayment}
              component={PaymentReceivedScreen}
            />
          </>
        ) : (
          <>
            <Root.Screen
              name={"login"}
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Root.Screen
              name={"signup"}
              component={SignupScreen}
              options={{
                headerShown: false,
              }}
            />
            <Root.Screen
              name={"forgottenPassword"}
              component={ForgottenPassword}
              options={{
                headerShown: false,
              }}
            />
            <Root.Screen
              name={screenNames.resetPassword}
              component={ResetPassword}
              options={{
                headerShown: false,
              }}
            />
            {/* emailVerified component*/}
            {/* <Root.Screen
            {/* <Root.Screen
              name={screenNames.emailVerified}
              options={{ headerShown: true }}
              component={EmailVerifiedMessageV2}
            /> */}
      
          </>
        )}
      </Root.Navigator>
    </>
  );
}