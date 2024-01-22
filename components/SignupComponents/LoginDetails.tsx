import { useState, FC, useEffect, Fragment, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";

import { registrationPhonePrefix } from "../../data/options";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import EmailIcon from "../../assets/icons/Email";
import PhoneIcon from "../../assets/icons/Phone";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import SalutationIcon from "../../assets/icons/Salutation";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import FormGroup from "../../components/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import Button from "../../components/Button";
import { SuccessModal } from "../SuccessModal/SuccessModal";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import { useLoginCredentialsMutation } from "../../redux/registration/registrationSliceV2";
import { loginCredentialsSchema } from "../../utils/formikSchema";
import { AppDispatch } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import { registerForPushNotificationsAsync } from "../PushNotification";
import WholeContainer from "../../layout/WholeContainer";

interface ILoginDetails {
  handleNextStep: () => void;
  handleOpenModal: () => void;
  handleModalContent: ({
    header,
    body,
    iconType,
  }: {
    header: string;
    body: string;
    iconType?: string;
  }) => void;
}

const LoginDetails: FC<ILoginDetails> = ({
  handleNextStep,
  handleOpenModal,
  handleModalContent,
}) => {
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isChangeEmail, setIsChangeEmail] = useState<boolean>(false);
  const [openListForCountryCode, setOpenListForCountryCode] =
    useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [emailToken, setEmailToken] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const registration = useSelector((state: any) => state.registration);

  const [
    loginCredentialsMutation,
    {
      isLoading: isLoadingLogin,
      isError: isErrorLogin,
      isSuccess: isSuccessLogin,
      error: errorLogin,
      data: dataLoginCredentials,
    },
  ] = useLoginCredentialsMutation();

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
    onSubmit: async ({ email, alternateEmail, phoneNumber, countryCode }) => {
      const expoToken = await registerForPushNotificationsAsync({
        email: alternateEmail ? alternateEmail : email,
        /* uuid: registration?.data?.uuid, */
      }).catch((error: any) => {
        setStatusMessage({
          header: "Error",
          body: "Something went wrong with youre token",
          isOpen: true,
          isError: true,
        });
      });
      const reqData = {
        email: alternateEmail ? alternateEmail : email,
        phone_number: `${countryCode}${phoneNumber}`,
        mobile: true,
        expoToken,
      };
      loginCredentialsMutation(reqData);
      /* if (expoToken) {
        const reqData = {
          email: alternateEmail ? alternateEmail : email,
          phone_number: `${countryCode}${phoneNumber}`,
          mobile: true,
          expoToken,
        };
        loginCredentialsMutation(reqData);
      } else {
        setStatusMessage({
          header: "Error",
          body: "Something went wrong with youre token",
          isOpen: true,
          isError: true,
        });
      } */
    },
  });

  useEffect(() => {
    if (!isLoadingLogin && isSuccessLogin) {
      if (dataLoginCredentials?.code === 200) {
        setIsValidEmail(true);
        handleOpenModal();
        handleModalContent({
          header: "Verification in progress",
          body: "We have sent a verification link to your email",
          iconType: "update",
        });
        dispatch(
          setRegistrationData({
            email: values?.alternateEmail
              ? values?.alternateEmail
              : values?.email,
            phone_number: `${values?.countryCode}${values?.phoneNumber}`,
            identifier: `${values?.countryCode}${values?.phoneNumber}`,
          })
        );
      } else {
        setStatusMessage({
          header: `${dataLoginCredentials?.code}: Error`,
          body: dataLoginCredentials?.message || `Something went wrong`,
          isOpen: true,
          isError: true,
        });
      }
    }

    if (!isLoadingLogin && isErrorLogin) {
      setStatusMessage({
        header: `${errorLogin?.data?.code}: Error`,
        body: errorLogin?.data?.message || `Something went wrong`,
        isOpen: true,
        isError: true,
      });
    }
  }, [
    isLoadingLogin,
    isSuccessLogin,
    isErrorLogin,
    dataLoginCredentials,
    errorLogin,
  ]);

  useEffect(() => {
    if (emailToken) {
      dispatch(
        setRegistrationData({
          email: values?.alternateEmail
            ? values?.alternateEmail
            : values?.email,
          phone_number: `${values?.countryCode}${values?.phoneNumber}`,
          identifier: `${values?.countryCode}${values?.phoneNumber}`,
        })
      );
    }
  }, [emailToken]);

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

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <Fragment>
      <View style={styles.card}>
        <Spinner visible={isLoadingLogin} />
        <SuccessModal
          isOpen={statusMessage?.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
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
                  iconColor="blue"
                  icon={<EmailIcon size={10} />}
                />
              </FormGroup>
            </View>
            <Seperator
              backgroundColor={vars["input-light-grey"]}
              marginTop={8}
              marginBottom={20}
            />
            <View>
              <FormGroup
                validationError={
                  errors.countryCode &&
                  touched.countryCode &&
                  errors.countryCode
                }
              >
                <View style={styles.dropdownWrapper}>
                  <View style={styles.dropDownIconContainerLeft}>
                    <SalutationIcon size={16} color="blue" />
                  </View>
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
                      listMode="MODAL"
                      // setValue={setSelectedSalutation}
                      items={registrationPhonePrefix}
                      value={values?.countryCode}
                      setOpen={setOpenListForCountryCode}
                      open={openListForCountryCode}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      labelStyle={{ marginTop: 3 }}
                      bottomOffset={100}
                      placeholder="Phone country code"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                      placeholderStyle={{
                        color: vars["medium-grey"],
                      }}
                    />
                  </View>
                  <View style={styles.dropDownIconContainerRight}>
                    <ArrowRightIcon size={16} color="blue" />
                  </View>
                </View>
              </FormGroup>
            </View>
            <View>
              <FormGroup
                validationError={
                  errors.phoneNumber &&
                  touched.phoneNumber &&
                  errors.phoneNumber
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
                  iconColor="blue"
                  icon={<PhoneIcon />}
                />
              </FormGroup>
            </View>
            <Seperator
              backgroundColor={vars["input-light-grey"]}
              marginTop={8}
              marginBottom={20}
            />
            {isValidEmail ? (
              <View>
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
                          iconColor="blue"
                          icon={<EmailIcon />}
                        />
                      </FormGroup>
                      <View style={{ marginLeft: 12 }}>
                        <Button
                          loading={isLoadingLogin}
                          disabled={isLoadingLogin}
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

            <FixedBottomAction rounded isNoPaddingLeft isNoInlineStyle>
              <View
                style={{
                  width: "100%",
                }}
              >
                <WholeContainer>
                  <Button
                    isTextAtEnd
                    loading={isLoadingLogin}
                    disabled={isLoadingLogin}
                    color="light-pink"
                    onPress={handleSubmit}
                    rightIcon={<ArrowRightLong size={14} />}
                  >
                    {isLoadingLogin ? "Authenticating..." : "Next"}
                  </Button>
                </WholeContainer>
              </View>
            </FixedBottomAction>
          </View>
        </View>
      </View>
    </Fragment>
  );
};

export default LoginDetails;
