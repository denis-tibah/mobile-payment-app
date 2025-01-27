import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useFormik } from "formik";
import Spinner from "react-native-loading-spinner-overlay/lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { RSA } from "react-native-rsa-native";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";

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
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { signInViaRTK } from "../../redux/auth/authSlice";
import {
  useLoginMutation,
  useLoginV2Mutation,
} from "../../redux/auth/authSliceV2";
import { useLazyGetAccountQuery } from "../../redux/account/accountSliceV2";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { arrayChecker, hp, stripPemFormatting } from "../../utils/helpers";
import { validationAuthSchema } from "../../utils/validation";
import { getDeviceDetails } from "../../utils/getIpAddress";
import { sessionToken } from "../../utils/globalStates";
import useDigitalSignature from "../../hooks/useDigitalSignature";
import useDeviceFingerprint from "../../hooks/useDeviceFingerprint";

export function LoginScreen({ navigation }: any) {
  const appVersion = Constants?.manifest?.version;

  const { convertPublicKeyPKCS1ToPKCS8 } = useDigitalSignature();
  const { deviceFingerprint, type, name } = useDeviceFingerprint();

  const [isFaceId, setFaceId] = useState<boolean>(true);
  const [storageData, setStorageData] = useState<any>({});
  const [biometricFlag, setBiometricFlag] = useState<string>("null");
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [biometricStatus, setBiometricStatus] = useState<boolean>(false);

  const [, setSessionToken] = useAtom(sessionToken);

  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();

  const saveSecureCredentials = async (email: string, password: string) => {
    await SecureStore.setItemAsync("user_email", email);
    await SecureStore.setItemAsync("user_password", password);
  };

  const [
    loginMutation,
    {
      isLoading: isLoadingLogin,
      isError: isErrorLogin,
      isSuccess: isSuccessLogin,
      error: errorLogin,
      data: dataLogin,
    },
  ] = useLoginV2Mutation();

  const [
    getAccountQuery,
    {
      isLoading: isLoadingAccount,
      isError: isErrorAccount,
      isSuccess: isSuccessAccount,
      error: errorAccount,
      data: dataAccount,
    },
  ] = useLazyGetAccountQuery();

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: validationAuthSchema,
      onSubmit: async ({ email, password }) => {
        const ipAddress = await getDeviceDetails();
        const reqData = {
          email,
          password,
          ipAddress,
          browserfingerprint: deviceFingerprint,
          device: {
            type: type,
            name: name,
            fingerprint: deviceFingerprint,
          },
        };
        loginMutation(reqData);
      },
    });

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  const generateKeys = async () => {
    //2048 Is the key size
    let keyPair = await RSA.generateKeys(2048);
    const publicKey =
      keyPair?.public && Platform.OS === "android"
        ? convertPublicKeyPKCS1ToPKCS8(keyPair?.public)
        : "";
    const publicKeyWithoutPadding = keyPair?.public
      ? stripPemFormatting(
          Platform.OS === "android"
            ? convertPublicKeyPKCS1ToPKCS8(keyPair?.public)
            : keyPair?.public
        )
      : "";
    const privateKey = keyPair?.private ? keyPair?.private : "";
    const keys = {
      public_key: publicKey,
      public_key_without_padding: publicKeyWithoutPadding,
      private_key: privateKey,
    };
    RNSecureStorage.multiSet(keys, { accessible: ACCESSIBLE.WHEN_UNLOCKED })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogin = async (signInData: any) => {
    const { dataLogin, accountQuery } = signInData;
    const objAccountQuery =
      arrayChecker(accountQuery) && accountQuery.length > 0
        ? accountQuery[0]
        : {};
    if (dataLogin?.data?.token_ziyl && dataLogin?.data?.access_token) {
      setSessionToken(dataLogin?.data?.access_token);
      await AsyncStorage.setItem("tokenZiyl", dataLogin?.data?.token_ziyl);
      await AsyncStorage.setItem("accessToken", dataLogin?.data?.access_token);
      generateKeys();
      dispatch<any>(
        signInViaRTK({
          dataLogin: dataLogin?.data,
          dataAccount: objAccountQuery,
        })
      );
      // for biometrics
      await saveSecureCredentials(
        dataLogin?.email || values?.email,
        values?.password || storageData?.password
      );
    }
  };

  useEffect(() => {
    const handleGetBiometricStatus = async () => {
      const enableBiometric = await SecureStore.getItemAsync("enableBiometric");
      setBiometricStatus(
        enableBiometric !== null ? JSON.parse(enableBiometric) : false
      );
    };
    handleGetBiometricStatus();
  }, []);

  const checkCompatible = async () => {
    const compatible: boolean = await LocalAuthentication.hasHardwareAsync();
    console.log({ compatible });
    return compatible;
  };

  const checkSavedBiometrics = async (): Promise<boolean> => {
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

  /* const handleChangeFaceId = () => {
    setFaceId(!isFaceId);
  }; */

  // set storage data for biometric to be used on users next session
  /* const handleSetBiometricFlag = async (param: string) => {
    await AsyncStorage.setItem("IsBiometricOn", param);
  };
 */
  // get storage data for biometric
  /* const handleGetBiometricFlag = async () => {
    const isBiometric = await AsyncStorage.getItem("IsBiometricOn");
    return isBiometric;
  }; */

  // set storage data for faceId switch. this will be remembered when user go to login page
  /* const handleSetFaceIdFlag = async (param: string) => {
    await AsyncStorage.setItem("faceId", param);
  }; */

  // get storage data for faceId
  /* const handleGetFaceIdFlag = async () => {
    const faceIdFlag = await AsyncStorage.getItem("faceId");
    return faceIdFlag;
  }; */

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
    if (isSuccessLogin) {
      const stringCode = dataLogin?.code ? dataLogin?.code.toString() : null;
      if (!stringCode || (stringCode !== "200" && stringCode !== "230")) {
        setStatusMessage({
          header: stringCode,
          body: "Something went wrong",
          isOpen: true,
          isError: false,
        });
      }
      if (stringCode === "200") {
        getAccountQuery({
          tokenZiyl: dataLogin?.data?.token_ziyl,
          accessToken: dataLogin?.data?.access_token,
        });
      }
      if (stringCode === "230") {
        setStatusMessage({
          header: stringCode,
          body: dataLogin?.message ? dataLogin?.message : "",
          isOpen: true,
          isError: false,
        });
      }
    }
  }, [isSuccessLogin, dataLogin]);

  useEffect(() => {
    if (isSuccessAccount) {
      handleLogin({ dataLogin, accountQuery: dataAccount });
    }
  }, [isSuccessAccount]);

  useEffect(() => {
    if (isErrorAccount) {
      console.log({ errorAccount });
      setStatusMessage({
        header: `${errorAccount?.data?.code} Error`,
        body: errorAccount?.data?.message || errorAccount?.data?.status,
        isOpen: true,
        isError: true,
      });
    }
    if (isErrorLogin) {
      console.log({ errorLogin });
      const errorMessage =
        arrayChecker(errorLogin?.data?.errors) &&
        errorLogin?.data?.errors.length > 0
          ? errorLogin?.data?.errors.join(" ")
          : "Something went wrong";
      setStatusMessage({
        header: `${errorLogin?.data?.code} Error`,
        body: errorMessage,
        isOpen: true,
        isError: true,
      });
    }
  }, [isErrorLogin, errorLogin, isErrorAccount, errorAccount]);

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

  /* useEffect(() => {
    // set biometricFlag true/false to show or hide biometrics switch
    handleGetBiometricFlag()
      .then((res: any) => {
        if (res === "null" || res === null) {
          setBiometricFlag("null");
        } else {
          setBiometricFlag(res);
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
  }, []); */

  // set biometric flag if theres email and password from storage
  /*  useEffect(() => {
    if (storageData?.email && storageData?.password) {
      handleSetBiometricFlag("Y");
      setBiometricFlag("Y");
    }
  }, [storageData]); */

  // login user using biometric
  /* useEffect(() => {
    const faceIdStorageData = isFaceId ? "T" : "F";
    handleSetFaceIdFlag(faceIdStorageData);

    const triggerBiometric = async () => {
      const compatible = await checkCompatible();
      if (compatible) {
        const saved = await checkSavedBiometrics();
        if (saved) {
          const auth = await handleBiometricAuth();
          console.log(auth, "AUTHH");
          if (auth) {
            const ipAddress = await getDeviceDetails();
            const reqData = {
              email: storageData?.email,
              password: storageData?.password,
              ipAddress,
              browserfingerprint: "react native app",
            };
            loginMutation(reqData);
          } else {
            setFaceId(false);
          }
        }
      }
    };
    if (isFaceId && storageData?.email && storageData?.password) {
      triggerBiometric();
    }
  }, [isFaceId, storageData]); */

  useEffect(() => {
    handleGetStoredEmailPassword();
  }, []);

  useEffect(() => {
    const triggerBiometric = async () => {
      const compatible = await checkCompatible();
      if (compatible) {
        const saved = await checkSavedBiometrics();
        if (saved) {
          const auth = await handleBiometricAuth();
          console.log(auth, "AUTHH");
          if (auth) {
            const ipAddress = await getDeviceDetails();
            const reqData = {
              email: storageData?.email,
              password: storageData?.password,
              ipAddress,
              browserfingerprint: deviceFingerprint,
            };
            loginMutation(reqData);
          } else {
            setFaceId(false);
          }
        }
      }
    };
    if (biometricStatus && storageData?.email && storageData?.password) {
      triggerBiometric();
    }
  }, [biometricStatus, storageData]);

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={isLoadingLogin || isLoadingAccount} />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <Typography
                fontSize={18}
                fontFamily="Nunito-SemiBold"
                fontWeight={"600"}
              >
                Sign in
              </Typography>
              <View style={styles.cardTitleSubheader}>
                <Typography
                  fontFamily="Mukta-Regular"
                  fontWeight={"500"}
                  fontSize={14}
                  color={vars["medium-grey-lighter"]}
                >
                  Don't have an account?{" "}
                </Typography>
                <Pressable onPress={() => navigate("signup")}>
                  <Typography
                    color="accent-pink"
                    fontWeight={"500"}
                    fontFamily="Nunito-SemiBold"
                  >
                    Sign up
                  </Typography>
                </Pressable>
              </View>
            </View>
            {/* <Seperator marginBottom={36} backgroundColor={vars["grey"]} /> */}
            <View>
              <View style={styles.cardBody}>
                <View>
                  <FormGroup
                    validationError={
                      errors.email && touched.email && errors.email
                    }
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
                <View>
                  <FormGroup
                    validationError={
                      errors.password && touched.password && errors.password
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
                  <Pressable onPress={() => navigate("forgottenPassword")}>
                    <Typography
                      color="accent-blue"
                      fontFamily="Mukta-Regular"
                      fontWeight="500"
                      marginBottom={12}
                    >
                      Forgot Password?
                    </Typography>
                  </Pressable>
                </View>
              </View>
              {/* {biometricFlag !== "null" ? (
                <View style={styles.faceIdContainer}>
                  <View style={styles.faceIdIconContainer}>
                    <FaceIdIcon size={20} color="blue" />
                    <Typography fontSize={16}>Use FaceID next time</Typography>
                  </View>
                  <View
                    style={{
                      marginTop: 18,
                    }}
                  >
                    <Switch
                      value={isFaceId}
                      trackColor={{
                        true: "#81b0ff",
                        false: "#DDDDDD",
                      }}
                      thumbColor="#808080"
                      style={{ marginTop: -24 }}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={handleChangeFaceId}
                    />
                  </View>
                </View>
              ) : null} */}
              <FixedBottomAction
                rounded
                isFullWidth
                isNoTopMargin
                style={{ backgroundColor: "#ACACAC" }}
              >
                <View
                  style={{
                    width: "100%",
                    paddingLeft: 12,
                    paddingRight: 12,
                  }}
                >
                  <Button
                    style={styles.signinButton}
                    loading={isLoadingLogin || isLoadingAccount}
                    disabled={isLoadingLogin || isLoadingAccount}
                    color="light-pink"
                    onPress={handleSubmit}
                    leftIcon={
                      <AntDesign
                        name="checkcircleo"
                        size={16}
                        color={vars["accent-pink"]}
                      />
                    }
                  >
                    Submit
                  </Button>
                </View>
              </FixedBottomAction>
            </View>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: biometricFlag !== null ? hp(-46) : hp(-65),
          }}
        >
          {appVersion ? (
            <Typography
              textAlign="center"
              color="#fff"
              fontFamily="Nunito-SemiBold"
              fontWeight="500"
            >
              v{appVersion}
            </Typography>
          ) : (
            <Typography
              textAlign="center"
              color="#fff"
              fontFamily="Nunito-SemiBold"
              fontWeight="500"
            ></Typography>
          )}
        </View>
      </KeyboardAvoidingView>
    </MainLayout>
  );
}

export default LoginScreen;
