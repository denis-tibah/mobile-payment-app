import * as Notifications from "expo-notifications";
import { api } from "../../api";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";


// Set up push notifications
export const registerForPushNotificationsAsync = async (
  userId: number,
  uuid: string
) => {
  let token;

  console.log("********Platform.OS*********** ", Platform.OS);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    console.log("hit this ");
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
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "53738179-17b1-4378-b234-2689d22ab698",
        })
      ).data;

console.log("***expo token*** ", token);

      await api.post("/registerPushToken", {
        token,
        userId,
        uuid,
      });
    } catch (error) {
      console.log({ notificationRegError: error });
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
};
