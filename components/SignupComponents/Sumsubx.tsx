import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { View } from "react-native";
import SNSMobileSDK from "@sumsub/react-native-mobilesdk-module";

import Typography from "../Typography";
import { Seperator } from "../Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ISumsub {
  handlePrevStep: () => void;
}

const Sumsub: FC<ISumsub> = ({ handlePrevStep }) => {
  const registration = useSelector((state: any) => state.registration);
  console.log("🚀 ~ file: Sumsub.tsx:17 ~ registration:", registration);

  let launchSNSMobileSDK = () => {
    // From your backend get an access token for the applicant to be verified.
    // The token must be generated with `levelName` and `userId`,
    // where `levelName` is the name of a level configured in your dashboard.
    //
    // The sdk will work in the production or in the sandbox environment
    // depend on which one the `accessToken` has been generated on.
    //

    let accessToken = registration?.data?.sumsubToken;
    console.log(
      "🚀 ~ file: Sumsub.tsx:28 ~ launchSNSMobileSDK ~ accessToken:",
      accessToken
    );
    let snsMobileSDK = SNSMobileSDK.init(accessToken, () => {
      // this is a token expiration handler, will be called if the provided token is invalid or got expired
      // call your backend to fetch a new access token (this is just an example)
      return fetch("http://example.org/", {
        method: "GET",
      }).then((resp) => {
        // return a fresh token from here
        return "new_access_token";
      });
    })
      .withHandlers({
        // Optional callbacks you can use to get notified of the corresponding events
        onStatusChanged: (event: any) => {
          console.log(
            "onStatusChanged: [" +
              event.prevStatus +
              "] => [" +
              event.newStatus +
              "]"
          );
        },
        onLog: (event: any) => {
          console.log("onLog: [Idensic] " + event.message);
        },
      })
      .withDebug(true)
      .withLocale("en") // Optional, for cases when you need to override the system locale
      .build();

    snsMobileSDK
      .launch()
      .then((result: any) => {
        console.log("SumSub SDK State: " + JSON.stringify(result));
      })
      .catch((err: any) => {
        console.log("SumSub SDK Error: " + JSON.stringify(err));
      });
  };

  useEffect(() => {
    launchSNSMobileSDK();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Sumsub
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}></View>
      </View>
    </View>
  );
};

export default Sumsub;
