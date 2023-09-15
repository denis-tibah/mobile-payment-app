import { useState, FC, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";

import { registrationPhonePrefix } from "../../data/options";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import EmailIcon from "../../assets/icons/Email";
import PhoneIcon from "../../assets/icons/Phone";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import FormGroup from "../../components/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import Button from "../../components/Button";
import {
  setLoginCredentials,
  setRegistrationData,
} from "../../redux/registration/registrationSlice";
import { loginCredentialsSchema } from "../../utils/formikSchema";
import { AppDispatch } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import { registerForPushNotificationsAsync } from "../PushNotification";

interface ILoginDetails {
  handleNextStep: () => void;
}

const LoginDetails: FC<ILoginDetails> = ({ handleNextStep }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isChangeEmail, setIsChangeEmail] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [openListForCountryCode, setOpenListForCountryCode] =
    useState<boolean>(false);

  // console.log('has it been verified ', handleNextStep);

  const [registerError, setRegisterError] = useState({
    email: "",
  });
  const [emailToken, setEmailToken] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const registration = useSelector((state: any) => state.registration);

  const handleLink = (url: string): void => {
    const { queryParams } = Linking.parse(url);

    // Retrieve the values of specific parameters
    const verifiedMailToken: any = queryParams?.verifiedMailToken
      ? queryParams?.verifiedMailToken
      : undefined;
    setEmailToken(verifiedMailToken);
    // Perform any additional actions based on the parameters
  };

  useEffect(() => {
    const handleUrl = ({ url }: any): void => handleLink(url);

    // Add a listener for the 'url' event
    const subscription = Linking.addEventListener("url", handleUrl);

    // Check if the app was opened from a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleLink(url);
      }
    });

    return () => {
      // Remove the listener when the component unmounts
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log("expotoken is ", expoPushToken);
  }, [expoPushToken]);

  const {
    handleSubmit,
    handleChange,
    values,

    touched,
    errors,
    handleBlur,
    setValues,
  } = useFormik({
    initialValues: {
      email: registration?.data?.email || "",
      alternateEmail: "",
      countryCode: registration?.data?.countryCode || "",
      phoneNumber: registration?.data?.phoneNumber || "",
    },
    validationSchema: loginCredentialsSchema,
    onSubmit: ({ email, alternateEmail, phoneNumber, countryCode }) => {
      // console.log("hit here 1 emailToken ", emailToken);

      // if (emailToken) {
      setIsLoading(true);
      //added by Aristos
      //generate expo token
      // registerForPushNotificationsRegistrationAsync(
      registerForPushNotificationsAsync(
        alternateEmail ? alternateEmail : email,
        ""
      ).then((token: any) => {
        dispatch(
          setLoginCredentials({
            email: alternateEmail ? alternateEmail : email,
            phone_number: `${countryCode}${phoneNumber}`,
            mobile: true,
            expoToken: token,
          })
        )
          .unwrap()
          .then((payload: any) => {
            //We need to ask Santiago to chanage response message to generic one or an id value
            if (
              payload === "activation email sent" ||
              payload === "new activation email sent"
            ) {
              setIsValidEmail(true);
            }
            dispatch(
              setRegistrationData({
                email: alternateEmail ? alternateEmail : email,
                phone_number: `${countryCode}${phoneNumber}`,
                identifier: `${countryCode}${phoneNumber}`,
                /* countryCode, */
              })
            );
            setIsLoading(false);
          })
          .catch((error: any) => {
            if (error) {
              console.log("🚀 ~ file: LoginDetails.tsx:108 ~ error:", error);
              setRegisterError({
                ...registerError,
                email: "Email already exists",
              });
            }
            setIsLoading(false);
          });
      });

      if (emailToken) {
        dispatch(
          setRegistrationData({
            email: alternateEmail ? alternateEmail : email,
            phone_number: `${countryCode}${phoneNumber}`,
            /*  phoneNumber, */
            identifier: `${countryCode}${phoneNumber}`,
            /* countryCode, */
          })
        );
        return;
      }

      dispatch(
        setRegistrationData({
          email: alternateEmail ? alternateEmail : email,
          phone_number: `${countryCode}${phoneNumber}`,
          identifier: `${countryCode}${phoneNumber}`,
          /* countryCode, */
        })
      );
      // handleNextStep();
    },
  });
  console.log("🚀 ~ file: LoginDetails.tsx:99 ~ values:", values);
  return (
    <View style={styles.card}>
      <Spinner visible={isLoading} />
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Login Credentials
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <FormGroup
              validationError={errors.email && touched.email && errors.email}
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Email Address"
                placeholderTextColor={vars["ios-default-text"]}
                icon={<EmailIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.countryCode && touched.countryCode && errors.countryCode
              }
            >
              <View>
                <DropDownPicker
                  schema={{ label: "label", value: "value" }}
                  onSelectItem={(value: any) => {
                    const { value: countryCodeValue } = value;
                    setValues({
                      ...values,
                      countryCode: countryCodeValue,
                    });
                  }}
                  listMode="SCROLLVIEW"
                  // setValue={setSelectedSalutation}
                  items={registrationPhonePrefix}
                  value={values?.countryCode}
                  setOpen={setOpenListForCountryCode}
                  open={openListForCountryCode}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownDirection="TOP"
                  placeholder="Phone country code"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.phoneNumber && touched.phoneNumber && errors.phoneNumber
              }
            >
              <FormGroup.Input
                keyboardType="number-pad"
                returnKeyType={"done"}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                placeholder="Phone Number"
                placeholderTextColor={vars["ios-default-text"]}
                icon={<PhoneIcon />}
              />
            </FormGroup>
          </View>
          {isValidEmail ? (
            <View>
              <View
                style={[styles.emailVerifiedContainer, styles.emailContainer]}
              >
                <Text style={styles.emailVerifiedText}>
                  Email Verified required
                </Text>
                <Text style={styles.emailVerifiedText}>
                  We have send you a verification link to your email
                </Text>
              </View>
              {!isChangeEmail ? (
                <View style={styles.emailVerifiedContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsChangeEmail(!isChangeEmail);
                    }}
                  >
                    <Text style={styles.emailVerifiedTextBlue}>
                      Did not get a verification details
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {isChangeEmail ? (
                <View style={styles.changeEmailTextContainer}>
                  <Text style={styles.changeEmailText}>
                    Change your email address
                  </Text>
                  <View style={styles.alternateEmailContainer}>
                    <FormGroup
                      validationError={
                        errors.email && touched.email && errors.email
                      }
                    >
                      <FormGroup.Input
                        keyboardType="default"
                        returnKeyType={"done"}
                        onChangeText={handleChange("alternateEmail")}
                        onBlur={handleBlur("alternateEmail")}
                        value={values.alternateEmail}
                        placeholder="Email Address"
                        icon={<EmailIcon />}
                      />
                    </FormGroup>
                    <View style={{ marginLeft: 20 }}>
                      <Button
                        loading={isLoading}
                        disabled={isLoading}
                        color="light-blue"
                        onPress={handleSubmit}
                        rightIcon={<EmailIcon size={14} color="blue" />}
                        style={{ width: 100 }}
                      >
                        Send
                      </Button>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          <FixedBottomAction rounded>
            <Button
              loading={isLoading}
              disabled={isLoading}
              color="light-pink"
              onPress={handleSubmit}
              leftIcon={<ArrowRightLong size={14} />}
            >
              {isLoading ? "Authenticating..." : "Continue"}
            </Button>
            {/* <Btn
              onPress={() => {
                navigation.navigate("emailVerified", { isOpen: true });
              }}
              title="notif"
            /> */}
          </FixedBottomAction>
        </View>
      </View>
    </View>
  );
};

export default LoginDetails;
