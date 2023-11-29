import { useEffect, useState } from "react";
import { Alert, Pressable, View, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Button from "../../components/Button";
import FormGroup from "../../components/FormGroup";
import MainLayout from "../../layout/Main";
import FixedBottomAction from "../../components/FixedBottomAction";
import { styles } from "./styles";
import Typography from "../../components/Typography";
import ProfileIcon from "../../assets/icons/TransactionLogoSelect";
import EmailIcon from "../../assets/icons/Email";
import LockIcon from "../../assets/icons/Lock";
import FaceIdIcon from "../../assets/icons/FaceId";
import {
  SIGNIN_SUCCESS_MESSAGES,
  refreshUserData,
  signin,
} from "../../redux/auth/authSlice";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { screenNames } from "../../utils/helpers";
import { validationAuthSchema } from "../../utils/validation";

export function LoginScreen({ navigation }: any) {
  const [apiErrorMessage, setApiErrorMessage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceId, setFaceId] = useState<boolean>(true);
  const [storageData, setStorageData] = useState<any>({});
  const [biometricFlag, setBiometricFlag] = useState<string>("null");

  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();
  const validationSchema = validationAuthSchema();

  const saveSecureCredetails = async (email: string, password: string) => {
    await SecureStore.setItemAsync("user_email", email);
    await SecureStore.setItemAsync("user_password", password);
  };

  const checkCompatible = async () => {
    const compatible: boolean = await LocalAuthentication.hasHardwareAsync();
    console.log({ compatible });
    return compatible;
  };

  const checkSavedBiometrics = async () => {
    const savedBiometric = await LocalAuthentication.isEnrolledAsync().then(
      (isEnrolled: boolean) => {
        if (!isEnrolled) {
          Alert.alert(
            "Biometric not found",
            "Please enroll biometric to continue"
          );
          return false;
        }
        return true;
      }
    );

    return savedBiometric;
  };

  const getSavedCredetails = async () => {
    const email = await SecureStore.getItemAsync("user_email");
    const password = await SecureStore.getItemAsync("user_password");
    if (email && password) {
      return { email, password };
    }
    return {};
  };

  const handleBiometricAuth = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert("Biometric authentication is not available on this device.");
      return false;
    }

    const biometricType =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    console.log({ biometricType });
    const promptMessage = `Login with ${biometricType[0]} authentication`;

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage,
      disableDeviceFallback: false,
      cancelLabel: "Cancel",
    });

    console.log({ biometricAuth });
    return biometricAuth.success;
  };

  // original logic of biometrics login
  /*   useEffect(() => {
    (async () => {
      const credentials = await getSavedCredetails();
      // console.log({ credentials });
      if (credentials.email && credentials.password) {
        const compatible = await checkCompatible();
        // console.log({ compatible });
        if (compatible) {
          const saved = await checkSavedBiometrics();
          // console.log({ saved });
          if (saved) {
            const auth = await handleBiometricAuth();
            console.log(auth, "AUTHH");
            if (auth) {
              setIsLoading(true);
              const result = await dispatch<any>(
                signin({ values: credentials, navigate })
              );
              // console.log({ result });
              await AsyncStorage.setItem("tokenZiyl", result?.token_ziyl);
              await AsyncStorage.setItem("accessToken", result?.access_token);
              await dispatch<any>(refreshUserData());
              if (result.error) {
                setApiErrorMessage({ message: result.payload });
              } else {
                setApiErrorMessage({});
              }
              setIsLoading(false);
            }
          }
        }
      }
    })();
  }, []); */

  const handleChangeFaceId = () => {
    setFaceId(!isFaceId);
  };

  // set storage data for biometric to be used on users next session
  const handleSetBiometricFlag = async (param: string) => {
    await AsyncStorage.setItem("IsBiometricOn", param);
  };
  // get storage data for biometric
  const handleGetBiometricFlag = async () => {
    const isBiometric = await AsyncStorage.getItem("IsBiometricOn");
    return isBiometric;
  };
  // set storage data for faceId switch. this will be remembered when user go to login page
  const handleSetFaceIdFlag = async (param: string) => {
    await AsyncStorage.setItem("faceId", param);
  };
  // get storage data for faceId
  const handleGetFaceIdFlag = async () => {
    const faceIdFlag = await AsyncStorage.getItem("faceId");
    return faceIdFlag;
  };
  // get email and password from storage
  const handleGetStoredEmailPassword = async () => {
    const credentials = await getSavedCredetails();
    if (credentials?.email && credentials?.password) {
      setStorageData({
        email: credentials?.email,
        password: credentials?.password,
      });
    }
  };

  useEffect(() => {
    // set biometricFlag true/false to show or hide biometrics switch
    handleGetBiometricFlag()
      .then((res: any) => {
        if (res === "null") {
          setBiometricFlag("null");
        }
      })
      .catch((err: any) => console.log(err));
    // initially fetch email and password from storage
    handleGetStoredEmailPassword();
    // mirror storage data to state isFaceId
    handleGetFaceIdFlag()
      .then((res: any) => {
        setFaceId(res === "T" ? true : false);
      })
      .catch((err: any) => console.log(err));
  }, []);

  useEffect(() => {
    // set biometric flag if theres email and password from storage
    if (storageData?.email && storageData?.password) {
      handleSetBiometricFlag("Y");
      setBiometricFlag("Y");
    }
  }, [storageData]);

  useEffect(() => {
    const faceIdStorageData = isFaceId ? "T" : "F";
    handleSetFaceIdFlag(faceIdStorageData);

    // login user using biometric
    const triggerBiometric = async () => {
      const compatible = await checkCompatible();
      if (compatible) {
        const saved = await checkSavedBiometrics();
        if (saved) {
          const auth = await handleBiometricAuth();
          console.log(auth, "AUTHH");
          if (auth) {
            console.log("eee");
            setIsLoading(true);
            const result = await dispatch<any>(
              signin({
                values: {
                  email: storageData?.email,
                  password: storageData?.password,
                },
                navigate,
              })
            );
            // console.log({ result });
            await AsyncStorage.setItem("tokenZiyl", result?.token_ziyl);
            await AsyncStorage.setItem("accessToken", result?.access_token);
            await dispatch<any>(refreshUserData());
            if (result.error) {
              setApiErrorMessage({ message: result.payload });
            } else {
              setApiErrorMessage({});
            }
            setIsLoading(false);
          } else {
            setFaceId(false);
          }
        }
      }
    };

    if (isFaceId && storageData?.email && storageData?.password) {
      triggerBiometric();
    }
  }, [isFaceId, storageData]);

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <Typography
                fontSize={18}
                fontFamily="Nunito-SemiBold"
                fontWeight={600}
              >
                Sign in
              </Typography>
              <View style={styles.cardTitleSubheader}>
                <Typography
                  fontFamily="Mukta-Regular"
                  fontWeight="500"
                  fontSize={14}
                  color={vars["medium-grey-lighter"]}
                >
                  Don't have an account?{" "}
                </Typography>
                <Pressable onPress={() => navigate("signup")}>
                  <Typography color="accent-pink">Sign up</Typography>
                </Pressable>
              </View>
            </View>
            <Seperator marginBottom={36} backgroundColor={vars["grey"]} />
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validateOnChange={true}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                setIsLoading(true);
                try {
                  const result = await dispatch<any>(
                    signin({ values, navigate /* , ip */ })
                  ).unwrap();

                  if (
                    result &&
                    (result?.payload?.biometricYN || result?.biometricYN) &&
                    (result?.payload?.biometricYN === "Y" ||
                      result?.biometricYN === "Y")
                  ) {
                    console.log("Use biometic ");
                    let tokenZiyl;
                    if (result?.token_ziyl) {
                      tokenZiyl = result?.token_ziyl;
                    } else if (result?.payload?.token_ziyl) {
                      tokenZiyl = result?.payload?.token_ziyl;
                    }
                    await saveSecureCredetails(values?.email, values?.password);
                    await AsyncStorage.setItem("tokenZiyl", tokenZiyl);
                    await AsyncStorage.setItem(
                      "accessToken",
                      result?.access_token
                    );
                  } else {
                    // console.log("Do not use biometric");
                    await SecureStore.deleteItemAsync("email");
                    await SecureStore.deleteItemAsync("password");
                  }
                  await dispatch<any>(refreshUserData());
                  if (result.error)
                    setApiErrorMessage({ message: result.payload });
                  else setApiErrorMessage({});
                } catch (error: any) {
                  console.log({ error });
                  if (error?.message === SIGNIN_SUCCESS_MESSAGES.EXPIRED) {
                    Alert.alert(SIGNIN_SUCCESS_MESSAGES.EXPIRED);
                    navigate(screenNames.resetPassword, {
                      email: values.email,
                      resetToken: error.resetToken,
                    });
                  } else {
                    setApiErrorMessage({ message: error });
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
              }) => {
                return (
                  <View>
                    <View style={styles.cardBody}>
                      <View>
                        <FormGroup
                          validationError={touched.email ? errors.email : null}
                        >
                          <FormGroup.Input
                            keyboardType="email-address"
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            value={values.email}
                            placeholderTextColor={vars["ios-default-text"]}
                            placeholder="Email address"
                            iconColor="blue"
                            icon={<EmailIcon />}
                          />
                        </FormGroup>
                      </View>
                      <View style={styles.passwordField}>
                        <FormGroup
                          validationError={
                            touched.password
                              ? errors.password || apiErrorMessage.message
                              : null
                          }
                        >
                          <FormGroup.Password
                            iconColor="blue"
                            icon={<LockIcon />}
                            rightIcon
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                            placeholderTextColor={vars["ios-default-text"]}
                            placeholder="Password"
                          />
                        </FormGroup>
                      </View>
                      <View style={styles.cardBodyLink}>
                        <Pressable
                          onPress={() => navigate("forgottenPassword")}
                        >
                          <Typography
                            color="accent-blue"
                            fontFamily="Mukta-Regular"
                          >
                            Forgot Password?
                          </Typography>
                        </Pressable>
                      </View>
                      {biometricFlag !== "null" ? (
                        <View style={styles.faceIdContainer}>
                          <View style={styles.faceIdIconContainer}>
                            <FaceIdIcon size={20} color="blue" />
                            <Typography fontSize={16}>
                              Use FaceID next time
                            </Typography>
                          </View>
                          <View
                            style={{
                              marginTop: 18,
                            }}
                          >
                            <Switch
                              value={isFaceId}
                              trackColor={{
                                false: "#767577",
                                true: "#81b0ff",
                              }}
                              thumbColor={
                                isFaceId ? "white" : vars["light-blue"]
                              }
                              style={{ marginTop: -24 }}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={handleChangeFaceId}
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                    <FixedBottomAction rounded isFullWidth isNoTopMargin>
                      <View
                        style={{
                          width: "100%",
                          paddingLeft: 12,
                          paddingRight: 12,
                        }}
                      >
                        <Button
                          style={styles.signinButton}
                          loading={isLoading}
                          disabled={isLoading}
                          color="light-pink"
                          onPress={handleSubmit}
                          leftIcon={<ProfileIcon size={14} />}
                        >
                          Submit
                        </Button>
                      </View>
                    </FixedBottomAction>
                  </View>
                );
              }}
            </Formik>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

export default LoginScreen;
