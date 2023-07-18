import { Fragment, useState, useEffect } from "react";
import {
  Keyboard,
  Pressable,
  TouchableHighlight,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";

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
import PhoneIcon from "../../assets/icons/Phone";
import MapIcon from "../../assets/icons/Map";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { validateLoginCredentials } from "../../utils/validation";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import ScrollableStepper from "../../components/ScrollableStepper/ScrollableStepper";
import AddressDetails from "../../components/SignupComponents/AddressDetails";
import FinancialDetails from "../../components/SignupComponents/FinancialDetails";
import LoginDetails from "../../components/SignupComponents/LoginDetails";
import ProfileDetails from "../../components/SignupComponents/ProfileDetails";
import TermsAndSecurity from "../../components/SignupComponents/TermsAndSecurity";
import Verifications from "../../components/SignupComponents/Verifications";
import EmailVerifiedScreen from "../EmailVerifiedMessage";

export function SignupScreen({ navigation, route }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const { navigate }: any = useNavigation();
  const [selectedNavIndex, setNavIndex] = useState<number>(0);

  const dispatch = useDispatch();
  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };
  const handleSelecNavIndex = (navIndex: number): void => {
    setNavIndex(navIndex);
  };

  const handleNextStep = (): void => {
    setNavIndex((prevStep) => prevStep + 1);
  };

  const handlePrevStep = (): void => {
    setNavIndex((prevStep) => prevStep - 1);
  };
  // to navigate on profile details after user has been verified
  useEffect(() => {
    if (route?.params?.stepIndex === 1) {
      setNavIndex(route?.params?.stepIndex);
    }
  }, [route?.params]);

  const steps = [
    <LoginDetails handleNextStep={handleNextStep} />,
    <ProfileDetails
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <AddressDetails
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <FinancialDetails
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <TermsAndSecurity
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <Verifications
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    {
      /* <VerificationLast nextRegistrationForm={nextRegistrationForm} />,
    <Sumsub />, */
    },
  ];
  return (
    <Fragment>
      <ImageBackground
        style={{ height: "100%" }}
        source={require("../../assets/images/bg.png")}
        resizeMode="cover"
      >
        <ScrollableStepper
          navList={[
            "Login Credentials",
            "Profile Details",
            "Address Details",
            "Financial Details",
            "Terms & Security",
            "Verifications",
          ]}
          selectedNavIndex={selectedNavIndex}
          handleSelecNavIndex={handleSelecNavIndex}
        />

        <TouchableWithoutFeedback onPress={keyboardDismiss}>
          <KeyboardAvoidingView style={{ flex: 1 }} enabled>
            <ScrollView keyboardDismissMode="on-drag">
              <View style={styles.container}>
                <View style={styles.innerContainer}>
                  {steps[selectedNavIndex]}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        {/* <MainLayout navigation={navigation}>
      <TouchableWithoutFeedback onPress={keyboardDismiss}>
        <KeyboardAvoidingView style={{ flex: 1 }} enabled>
          <ScrollView keyboardDismissMode="on-drag">
            <View style={styles.container}>
              <View style={styles.innerContainer}>
                <View style={styles.card}>
                  <View style={styles.cardTitle}>
                    <Typography
                      fontSize={18}
                      fontFamily="Nunito-SemiBold"
                      fontWeight="600"
                    >
                      Login Credentials
                    </Typography>
                  </View>
                  <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                      confirmPassword: "",
                      countryCode: "",
                      phoneNumber: "",
                    }}
                    validate={(values) => validateLoginCredentials(values)}
                    onSubmit={(values) => {
                      setIsLoading(true);
                      // dispatch(mockSignin());
                    }}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      values,
                      errors,
                    }) => (
                      <View>
                        <View style={styles.cardBody}>
                          <View>
                            <FormGroup validationError={errors.email}>
                              <FormGroup.Input
                                keyboardType="email-address"
                                returnKeyType={"done"}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                                placeholder="Email Address"
                                icon={<EmailIcon />}
                              />
                              <Seperator
                                marginTop={18}
                                width={315}
                                backgroundColor={vars["light-grey"]}
                              />
                            </FormGroup>
                          </View>
                          <View>
                            <FormGroup>
                              <FormGroup.Input
                                returnKeyType={"done"}
                                inputMode="tel"
                                keyboardType="phone-pad"
                                onChangeText={handleChange("countryCode")}
                                onBlur={handleBlur("countryCode")}
                                value={values.countryCode}
                                placeholder="Country Code"
                                icon={<MapIcon />}
                              />
                            </FormGroup>
                          </View>
                          <View>
                            <FormGroup>
                              <FormGroup.Input
                                returnKeyType={"done"}
                                inputMode="tel"
                                keyboardType="phone-pad"
                                onChangeText={handleChange("phoneNumber")}
                                onBlur={handleBlur("phoneNumber")}
                                value={values.phoneNumber}
                                placeholder="Phone Number"
                                icon={<PhoneIcon />}
                              />
                              <Seperator
                                backgroundColor={vars["light-grey"]}
                                width={315}
                                marginTop={18}
                              />
                            </FormGroup>
                          </View>
                          <Typography
                            paddingLeft={30}
                            fontSize={14}
                            fontWeight={500}
                            marginBottom={12}
                          >
                            Must be at least 8 characters.
                          </Typography>
                          <View>
                            <FormGroup validationError={errors.password}>
                              <FormGroup.Password
                                rightIcon
                                returnKeyType={"done"}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("Password")}
                                value={values.password}
                                placeholder="Password"
                                icon={<LockIcon />}
                              />
                            </FormGroup>
                          </View>
                          <View>
                            <FormGroup validationError={errors.confirmPassword}>
                              <FormGroup.Password
                                rightIcon
                                returnKeyType={"done"}
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("Confirm Password")}
                                value={values.confirmPassword}
                                placeholder="Confirm Password"
                                icon={<LockIcon />}
                              />
                            </FormGroup>
                          </View>
                        </View>
                        <FixedBottomAction rounded>
                          <Button
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
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </MainLayout> */}
      </ImageBackground>
    </Fragment>
  );
}

export default SignupScreen;
