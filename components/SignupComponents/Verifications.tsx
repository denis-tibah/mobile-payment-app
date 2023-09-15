import { FC, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";

import Button from "../../components/Button";
import Typography from "../../components/Typography";
import PhoneIcon from "../../assets/icons/Phone";
import ArrowDownIcon from "../../assets/icons/ArrowDown";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import TickIcon from "../../assets/icons/TickWithoutCircle";
import { Seperator } from "../../components/Seperator/Seperator";
import { PinCodeInputBoxes } from "../FormGroup/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../../components/FormGroup";
import { registrationPhonePrefix } from "../../data/options";
import { verifyPhoneNumberSchema } from "../../utils/formikSchema";
import {
  setRegistrationData,
  sendSMSVerification,
  getSumsubVerificationCode,
} from "../../redux/registration/registrationSlice";
import { SuccessModal } from "../SuccessModal/SuccessModal";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IVerifications {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const Verifications: FC<IVerifications> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const [isUpdatePhoneNumber, setUpdatePhoneNumber] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabledOtp, setIsDisabledOtp] = useState<boolean>(true);
  const [SMSResent, setSMSResent] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [resetMessage, setResentMessage] = useState<{
    message: string | undefined;
    status: string;
  }>({ message: "", status: "" });
  const [openListForCountryCode, setOpenListForCountryCode] =
    useState<boolean>(false);

  useEffect(() => {
    dispatch<any>(
      sendSMSVerification({
        identifier: registration.data.phone_number,
      })
    ).catch((error: any) => {
      setStatusMessage({
        header: "Error",
        body: "Something went wrong",
        isOpen: true,
        isError: true,
      });
      console.log(`*** sending SMS verification error: ${error} ***`);
    });
  }, []);

  useEffect(() => {
    if (otp && otp.toString().length && otp.toString().length === 6) {
      setIsDisabledOtp(false);
    } else {
      setIsDisabledOtp(true);
    }
  }, [otp]);
  const handlePinCodeChange = (otpNum: number): void => {
    setOtp(otpNum);
  };

  const getOtp = ({
    wholePhoneNumber,
    countryCode,
    phoneNumber,
  }: {
    wholePhoneNumber: string;
    countryCode: string;
    phoneNumber: string;
  }): void => {
    setIsLoading(true);
    dispatch<any>(
      sendSMSVerification({
        identifier: wholePhoneNumber,
      })
    )
      .then((payload: any) => {
        setIsLoading(false);
        setSMSResent(true);
        if (payload?.payload?.status === "success") {
          setResentMessage({
            message:
              payload?.payload?.message ||
              "We resent verification code to your number",
            status: payload?.payload?.status,
          });
        } else if (
          payload?.payload?.status === "failed" ||
          payload?.payload?.code === 400
        ) {
          setResentMessage({
            message: payload?.payload?.message || "Something went wrong",
            status: payload?.payload?.status,
          });
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        setStatusMessage({
          header: "Error",
          body: "Something went wrong",
          isOpen: true,
          isError: true,
        });
        console.log(
          `*** resent sms verification to ${countryCode}${phoneNumber} failed: ${error} ***`
        );
      });
  };

  const handleChangePhoneNumber = (): void => {
    setUpdatePhoneNumber(!isUpdatePhoneNumber);
  };

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
      countryCode: "",
      phoneNumber: "",
    },
    validationSchema: verifyPhoneNumberSchema,
    onSubmit: ({ phoneNumber, countryCode }) => {
      setIsLoading(true);
      dispatch(
        setRegistrationData({
          phone_number: `${countryCode}${phoneNumber}`,
          identifier: `${countryCode}${phoneNumber}`,
        })
      );
      getOtp({
        wholePhoneNumber: `${countryCode}${phoneNumber}`,
        countryCode,
        phoneNumber,
      });
      setUpdatePhoneNumber(false);
    },
  });
  console.log("🚀 ~ file: Verifications.tsx:143 ~ values:", values);
  const handleVerifyPhoneNumber = () => {
    setIsLoading(true);
    const regData = {
      ...registration.data,
      code: otp ? otp.toString() : null,
      provider: "ziyl",
      country: registration.data.country_of_birth,
    };
    console.log(
      "🚀 ~ file: Verifications.tsx:128 ~ handleVerifyPhoneNumber ~ regData:",
      regData
    );
    dispatch<any>(getSumsubVerificationCode(regData))
      .unwrap()
      .then((payload: any) => {
        if (payload) {
          if (
            (payload?.code === 201 || payload?.code === "201") &&
            payload?.status === "success"
          ) {
            setIsLoading(false);
            dispatch(
              setRegistrationData({
                registrationAuthentication: payload?.data?.token_ziyl,
                sumsubToken: payload?.data?.token,
              })
            );
            // localStorage.setItem("token_ziyl", payload[0].token_ziyl);
            handleNextStep();
            return;
          }
          setIsLoading(false);
          // if the response code is not 201 will assume there was an error submitting the application
          setStatusMessage({
            header: "Error",
            body: "Application submission failed",
            isOpen: true,
            isError: true,
          });
        }
      })
      .catch((error: any) => {
        setStatusMessage({
          header: "Error",
          body: "Something went wrong",
          isOpen: true,
          isError: true,
        });
        setIsLoading(false);
        console.log(`*** send data to backend error: ***`, error);
      });
  };

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  const handleGetanotherVerificationcode = () => {
    getOtp({
      wholePhoneNumber:
        values?.countryCode && values?.phoneNumber
          ? `${values?.countryCode}${values?.phoneNumber}`
          : registration.data.phone_number,
      countryCode: values?.countryCode,
      phoneNumber: values?.phoneNumber,
    });
  };

  return (
    <View style={styles.card}>
      <Spinner visible={isLoading} />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Verify your phone number
        </Typography>
        <Typography
          fontSize={12}
          fontFamily="Nunito-Regular"
          marginTop={12}
          color={vars["medium-grey2"]}
        >
          You will recieve an sms to your mobile device. Please enter this code
          below
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <View style={styles.pinCodeContainer}>
              <PinCodeInputBoxes
                fieldCount={6}
                onChange={handlePinCodeChange}
              />
              <TouchableOpacity onPress={handleGetanotherVerificationcode}>
                <Text style={styles.noCode}>
                  Did not get a verification code?
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.phoneNumberContainer}>
              <View>
                {registration?.data?.identifier ? (
                  <View style={styles.phoneNumberInnerContainer}>
                    <PhoneIcon size={14} />
                    <Text>
                      {registration?.data?.identifier
                        ? registration?.data?.identifier
                        : ""}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={handleChangePhoneNumber}
                style={styles.phoneNumberInnerContainer}
              >
                <Text>Not your number</Text>
                <View style={{ marginTop: 4 }}>
                  <ArrowDownIcon color={vars["accent-pink"]} size={16} />
                </View>
              </TouchableOpacity>
            </View>
            {isUpdatePhoneNumber && (
              <View style={styles.alternatePhoneNumberContainer}>
                <View style={styles.phoneNumberInnerContainer}>
                  <View style={{ width: "100%" }}>
                    <FormGroup
                      validationError={
                        errors.countryCode &&
                        touched.countryCode &&
                        errors.countryCode
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
                          placeholderTextColor={vars["ios-default-text"]}
                          placeholder="Phone Number"
                          icon={<PhoneIcon />}
                        />
                      </FormGroup>
                    </View>
                    <View>
                      <Button
                        loading={isLoading}
                        disabled={isLoading}
                        color="light-blue"
                        onPress={handleSubmit}
                        style={{ marginLeft: 10, width: 80 }}
                      >
                        Save
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            )}
            {SMSResent ? (
              <View
                style={[
                  styles.smsResentContainer,
                  resetMessage?.status === "failed"
                    ? {
                        backgroundColor: vars["accent-pink"],
                      }
                    : { backgroundColor: "#0dca9d" },
                ]}
              >
                <View style={styles.smsResentInnerContainer}>
                  {values?.countryCode && values?.phoneNumber && (
                    <Text
                      style={[styles.smsResentText, styles.smsResentFirstText]}
                    >
                      Updated phone number
                    </Text>
                  )}
                  <Text style={styles.smsResentText}>
                    {resetMessage?.message}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <FixedBottomAction rounded>
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                /* paddingRight: 20, */
                flexWrap: "wrap",
              }}
            >
              <View style={{ marginBottom: 6 }}>
                <Button
                  color="light-pink"
                  onPress={handlePrevStep}
                  leftIcon={<ArrowLeft size={12} />}
                >
                  Back
                </Button>
              </View>
              <Button
                loading={isLoading}
                color={isDisabledOtp || isLoading ? "grey" : "light-pink"}
                onPress={handleVerifyPhoneNumber}
                leftIcon={
                  <TickIcon
                    size={12}
                    color={
                      vars[
                        isDisabledOtp || isLoading
                          ? "medium-grey2"
                          : "accent-pink"
                      ]
                    }
                  />
                }
                disabled={isDisabledOtp}
              >
                Verify your phone number
              </Button>
            </View>
          </FixedBottomAction>
        </View>
      </View>
    </View>
  );
};

export default Verifications;
