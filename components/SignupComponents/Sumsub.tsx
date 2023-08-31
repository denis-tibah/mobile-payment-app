import { FC, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
/* import SumsubWebSdk from "@sumsub/websdk-react"; */

import { WebView } from "react-native-webview";

import Typography from "../Typography";
import { Seperator } from "../Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ISumsub {
  handlePrevStep: () => void;
}

const Sumsub: FC<ISumsub> = ({ handlePrevStep }) => {
  const registration = useSelector((state: any) => state.registration);
  let accessToken = registration?.data?.sumsubToken;
  const webviewRef = useRef(null);

  /* const [testToken, setTestToken] = useState(
    "_act-sbx-ed969f88-34dd-4127-9eed-ba937c02e8d"
  ); */
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  return (
    <View style={styles.sumSubCard}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Sumsub
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <ScrollView>
        <View
          style={{
            height: 1300,
            overflow: "scroll",
            flex: 1,
          }}
        >
          {hasPermission && (
            <WebView
              // iOS specific:
              allowsInlineMediaPlayback={true}
              cacheEnabled={true}
              geolocationEnabled={false}
              javaScriptEnabledAndroid={true}
              mediaPlaybackRequiresUserAction={false}
              originWhitelist={["*"]}
              scalesPageToFit
              // Android specific:
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode={"compatibility"}
              useWebkit
              userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
              bounces
              ref={webviewRef}
              startInLoadingState={true}
              onMessage={(event) => {
                // Handle messages received from the web SDK
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === "sumsubEvent") {
                  // Handle Sumsub events here
                  console.log(
                    "Received Sumsub event:",
                    data.eventType,
                    data.payload
                  );
                }
                console.log("Sumsub");
              }}
              source={{
                uri: "https://static.sumsub.com/idensic/static/sns-websdk-builder.js",
                html: `<html>
                    <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
                      <style>
                        #container{
                          position: relative;
                          overflo:scroll;
                          width: 100%;
                          padding-top: 500%;
                        }
                        #sumsub-websdk-container{
                          position: absolute;
                          top: 0;
                          left: 0;
                          bottom: 0;
                          right: 0;
                          width: 100%;
                        }
                      </style>
                  </head>
                  <body>
                    <script src="https://static.sumsub.com/idensic/static/sns-websdk-builder.js"></script>
                    <div id="container">
                      <div id='sumsub-websdk-container'></div>
                    </div>
                  </body>
                </html>
                <script>
                  function launchWebSdk(accessToken, applicantEmail, applicantPhone, customI18nMessages) {
                    let snsWebSdkInstance = snsWebSdk.init(
                            accessToken,
                            // token update callback, must return Promise
                            // Access token expired
                            // get a new one and pass it to the callback to re-initiate the WebSDK
                            () => this.getNewAccessToken()
                        )
                        .withConf({
                            lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
                            email: applicantEmail,
                            phone: applicantPhone,
                            i18n: customI18nMessages, //JSON of custom SDK Translations
                            uiConf: {
                                customCss: "https://url.com/styles.css"
                                // URL to css file in case you need change it dynamically from the code
                                // the similar setting at Customizations tab will rewrite customCss
                                // you may also use to pass string with plain styles ${`customCssStr:`}
                            },
                        })
                        .withOptions({ addViewportTag: false, adaptIframeHeight: true})
                        // see below what kind of messages WebSDK generates
                        .on('idCheck.stepCompleted', (payload) => {
                            console.log('stepCompleted', payload)
                        })
                        .on('idCheck.onError', (error) => {
                            console.log('onError', error)
                        })
                        .build();
                
                    // you are ready to go:
                    // just launch the WebSDK by providing the container element for it
                    snsWebSdkInstance.launch('#sumsub-websdk-container');
                }
                function getNewAccessToken() {
                  // get a new token from your backend
                  return Promise.resolve(newAccessToken);
                }
                launchWebSdk("${accessToken}");
              </script>`,
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Sumsub;
