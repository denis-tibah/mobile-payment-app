import * as Notifications from "expo-notifications";
import { api } from "../../api";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";

type Props = {
  userId?: number;
  uuid?: string;
  email: string;
};
// Set up push notifications
export const registerForPushNotificationsAsync = async ({
  userId,
  uuid,
  email,
}: Props) => {
  let token;
  let projectId = "7454c009-85fa-4eb0-ae8c-5834ded616c2";

  // console.log("********Platform.OS*********** ", Platform.OS);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    console.log("from registerForPushNotificationsAsync Device.isDevice ");
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    } catch (error) {
      console.log({ notificationRegError: error });
    }

    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          // projectId: "53738179-17b1-4378-b234-2689d22ab698",
          projectId: projectId,
        })
      ).data;

      console.log(
        "***from registerForPushNotificationsAsync expo token*** ",
        token,
        " email ",
        email,
        " uuid ",
        uuid
      );

      if (!token) {
        alert("Failed to get push token for push notification!");
        return;
      }

      await api.post("/registerPushToken", {
        token,
        // userId,
        uuid,
        email: email, //modification by aristos
      });
    } catch (error) {
      console.log({ getingTokenError: error });
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
};
