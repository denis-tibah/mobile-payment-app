import { useEffect, useState } from "react";
import { Alert, Pressable, TouchableHighlight, View } from "react-native";
import Button from "../../components/Button";
import FormGroup from "../../components/FormGroup";
import MainLayout from "../../layout/Main";
import FixedBottomAction from "../../components/FixedBottomAction";
import { styles } from "./styles";
import { Formik } from "formik";
import Typography from "../../components/Typography";
import ProfileIcon from "../../assets/icons/Profile";
import EmailIcon from "../../assets/icons/Email";
import LockIcon from "../../assets/icons/Lock";
import { useDispatch } from "react-redux";
import { refreshUserData, signin } from "../../redux/auth/authSlice";
import { useNavigation } from "@react-navigation/native";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export function LoginScreen({ navigation }: any) {
  const [apiErrorMessage, setApiErrorMessage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const saveSecureCredetails = async (email: string, password: string) => {
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("password", password);
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
    const email = await SecureStore.getItemAsync("email");
    const password = await SecureStore.getItemAsync("password");
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

  useEffect(() => {
    const handleBiometricLogin = async () => {
      const credentials = await getSavedCredetails();
      console.log({ credentials });
      if (credentials.email && credentials.password) {
        const compatible = await checkCompatible();
        console.log({ compatible });
        if (compatible) {
          const saved = await checkSavedBiometrics();
          console.log({ saved });
          if (saved) {
            const auth = await handleBiometricAuth();
            console.log(auth, "AUTHH");
            if (auth) {
              setIsLoading(true);
              const result = await dispatch<any>(
                signin({ values: credentials, navigate })
              );
              console.log({ result });
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
    };

    handleBiometricLogin();
  }, []);

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
                // email: "Aristosc@iqgp.io",
                // password: "Secret@123456789",
                // email: "alex@kalytex.com",
                // password: "Q@werty123",
                email: "",
                password: "",
              }}
              validate={(values) => {
                let errors: any = {};
                if (!values.email) errors.email = "required";
                if (!values.password) errors.password = "required";
                return errors;
              }}
              onSubmit={async (values) => {
                setIsLoading(true);
                const result = await dispatch<any>(
                  signin({ values, navigate })
                );
                Alert.alert(
                  "",
                  "Do you want to login using biometric authentication?",
                  [
                    {
                      text: "Yes!",
                      onPress: async () =>
                        await saveSecureCredetails(
                          values.email,
                          values.password
                        ),
                    },
                    {
                      text: "No",
                      onPress: async () => {
                        await SecureStore.deleteItemAsync("email");
                        await SecureStore.deleteItemAsync("password");
                      },
                    },
                  ]
                );
                await dispatch<any>(refreshUserData());
                if (result.error)
                  setApiErrorMessage({ message: result.payload });
                else setApiErrorMessage({});
                setIsLoading(false);
              }}
            >
              {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
                <View>
                  <View style={styles.cardBody}>
                    <View>
                      <FormGroup validationError={errors.email}>
                        <FormGroup.Input
                          keyboardType="email-address"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          placeholder="Email address"
                          icon={<EmailIcon />}
                        />
                      </FormGroup>
                    </View>
                    <View style={styles.passwordField}>
                      <FormGroup
                        validationError={
                          errors.password || apiErrorMessage.message
                        }
                      >
                        <FormGroup.Password
                          icon={<LockIcon />}
                          rightIcon
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder="Password"
                        />
                      </FormGroup>
                    </View>
                    <View style={styles.cardBodyLink}>
                      <Typography
                        color="accent-blue"
                        fontFamily="Mukta-Regular"
                      >
                        Forgotten Password
                      </Typography>
                    </View>
                    {/* <View
                      style={[styles.cardBodyLink, styles.cardBodyLinkMargin]}
                    >
                      <Typography
                        color="accent-blue"
                        fontFamily="Mukta-Regular"
                      >
                        Registration Status
                      </Typography>
                    </View> */}
                    {/* <View
                      style={[styles.cardBodyLink, styles.cardBodyLinkMargin]}
                    >
                      <Typography
                        color="accent-blue"
                        fontFamily="Mukta-Regular"
                      >
                        Register Company
                      </Typography>
                    </View> */}
                  </View>
                  <FixedBottomAction rounded>
                    <Button
                      style={styles.signinButton}
                      loading={isLoading}
                      disabled={isLoading}
                      color="light-pink"
                      onPress={handleSubmit}
                      leftIcon={<ProfileIcon size={14} />}
                    >
                      {isLoading ? "Authenticating..." : "Sign in"}
                    </Button>
                  </FixedBottomAction>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

export default LoginScreen;
