import { useState, FC, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";

import { registrationPhonePrefix } from "../../data/options";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import EmailIcon from "../../assets/icons/Email";
import MapIcon from "../../assets/icons/Map";
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

interface ILoginDetails {
  handleNextStep: () => void;
}

const LoginDetails: FC<ILoginDetails> = ({ handleNextStep }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isChangeEmail, setIsChangeEmail] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState({
    email: "",
  });
  const [emailToken, setEmailToken] = useState<string>(
    "4dda55e6-aaed-4d13-8ede-e36b2f5c86a8"
  );
  console.log("🚀 ~ file: LoginDetails.tsx:34 ~ emailToken:", emailToken);

  const dispatch = useDispatch<AppDispatch>();
  const registration = useSelector((state: any) => state.registration);
  console.log("🚀 ~ file: LoginDetails.tsx:42 ~ registration:", registration);

  const handleChangeEmail = () => {
    setIsChangeEmail(!isChangeEmail);
  };

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

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        email: registration?.data?.email || "",
        alternateEmail: "",
        countryCode: registration?.data?.countryCode || "",
        phoneNumber: registration?.data?.phoneNumber || "",
      },
      validationSchema: loginCredentialsSchema,
      onSubmit: ({ email, alternateEmail, phoneNumber, countryCode }) => {
        if (emailToken) {
          setIsLoading(true);
          dispatch(
            setLoginCredentials({
              email: alternateEmail ? alternateEmail : email,
              phone_number: `${countryCode}${phoneNumber}`,
            })
          )
            .unwrap()
            .then((payload: any) => {
              console.log(
                "🚀 ~ file: LoginDetails.tsx:97 ~ .then ~ payload:",
                payload
              );
              if (payload === "activation email sent") {
                setIsValidEmail(true);
              }
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
          dispatch(
            setRegistrationData({
              email: alternateEmail ? alternateEmail : email,
              phone_number: `${countryCode}${phoneNumber}`,
              identifier: `${countryCode}${phoneNumber}`,
              countryCode,
            })
          );
          return;
        }

        dispatch(
          setRegistrationData({
            email: alternateEmail ? alternateEmail : email,
            phone_number: `${countryCode}${phoneNumber}`,
            identifier: `${countryCode}${phoneNumber}`,
            countryCode,
          })
        );
        handleNextStep();
      },
    });

  return (
    <View style={styles.card}>
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
                keyboardType="email-address"
                returnKeyType={"done"}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Email Address"
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
              <FormGroup.Select
                onValueChange={handleChange("countryCode")}
                onBlur={handleBlur("countryCode")}
                selectedValue={values?.countryCode}
                icon={<MapIcon />}
              >
                {registrationPhonePrefix.map((item) => {
                  if (!item?.label && !item?.value) {
                    return (
                      <FormGroup.Option
                        key={item?.label}
                        label="Phone country code"
                        value=""
                      />
                    );
                  }
                  return (
                    <FormGroup.Option
                      key={item?.label}
                      label={item?.label}
                      value={item?.value}
                    />
                  );
                })}
              </FormGroup.Select>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.phoneNumber && touched.phoneNumber && errors.phoneNumber
              }
            >
              <FormGroup.Input
                keyboardType="phone-number"
                returnKeyType={"done"}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                placeholder="Phone Number"
                icon={<PhoneIcon />}
              />
            </FormGroup>
          </View>
          {!isValidEmail ? (
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
                      setIsChangeEmail(true);
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
                        keyboardType="alternate-address"
                        returnKeyType={"done"}
                        onChangeText={handleChange("alternateEmail")}
                        onBlur={handleBlur("alternateEmail")}
                        value={values.alternateEmail}
                        placeholder="Email Address"
                        icon={<EmailIcon />}
                      />
                    </FormGroup>
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
          </FixedBottomAction>
        </View>
      </View>
    </View>
  );
};

export default LoginDetails;
