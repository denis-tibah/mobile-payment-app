import { FC, useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera } from "expo-camera";
import { View, ScrollView } from "react-native";

import { WebView } from "react-native-webview";
import Typography from "../Typography";
import { getSumsubToken } from "../../redux/registration/registrationSlice";
import { Seperator } from "../Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ISumsub {
  handlePrevStep: () => void;
}

const Sumsub: FC<ISumsub> = ({ handlePrevStep }) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);
  console.log("🚀 ~ file: Sumsub.tsx:20 ~ registration:", registration);
  const webviewRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(
    registration?.data?.sumsubToken
  );
  console.log("🚀 ~ file: Sumsub.tsx:24 ~ accessToken:", accessToken);
  const [isExpiredToken, setExpiredToken] = useState<boolean>(false);
  console.log("🚀 ~ file: Sumsub.tsx:26 ~ isExpiredToken:", isExpiredToken);
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (isExpiredToken) {
      dispatch<any>(getSumsubToken(registration?.data?.sumsubUserId))
        .then((payload: any) => {
          console.log(
            "🚀 ~ file: Sumsub.tsx:47 ~ dispatch<any> ~ payload:",
            payload?.payload?.token
          );
          if (payload?.payload?.token) {
            setAccessToken(payload?.payload?.token);
          }
        })
        .catch((error: any) => {
          setStatusMessage({
            header: "Error",
            body: "Something went wrong",
            isOpen: true,
            isError: true,
          });
          console.log(`*** get sumsub token  error: ${error} ***`);
        });
    }
  }, [isExpiredToken]);

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
            height: 1200,
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
              userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
              bounces={false}
              ref={webviewRef}
              startInLoadingState={true}
              showsHorizontalScrollIndicator={true}
              showsVerticalScrollIndicator={true}
              allowsFullscreenVideo
              onMessage={(event) => {
                console.log("🚀 ~ file: Sumsub.tsx:72 ~ event:", event);
                // Handle messages received from the web SDK
                if (event?.nativeEvent) {
                  const stringifiedData = JSON.stringify(event?.nativeEvent);
                  const objData =
                    stringifiedData && JSON.parse(stringifiedData);
                  if (
                    objData &&
                    objData?.data &&
                    objData?.data === "expiredToken"
                  ) {
                    setExpiredToken(true);
                  }
                }
              }}
              onError={(param) => {
                console.log("🚀 ~ file: Sumsub.tsx:84 ~ param:", param);
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
                  window.ReactNativeWebView.postMessage('expiredToken');
                  //return Promise.resolve("${accessToken}");
                  return Promise((resolve, reject) => {
                    setTimeout(() => {
                      resolve("${accessToken}");
                    }, 2500);
                  });
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
