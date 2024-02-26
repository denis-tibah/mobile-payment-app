import { FC, useState, useEffect, useRef, Fragment } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import Button from "../../components/Button";
import Typography from "../../components/Typography";
import PhoneIcon from "../../assets/icons/Phone";
import ArrowDownIcon from "../../assets/icons/ArrowDown";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import TickIcon from "../../assets/icons/TickWithoutCircle";
import SalutationIcon from "../../assets/icons/Salutation";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import { Seperator } from "../../components/Seperator/Seperator";
import { NewPinCodeInputBoxes } from "../FormGroup/FormGroup";
import WholeContainer from "../../layout/WholeContainer";
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
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { styles } from "./styles";

interface IVerifications {
  handlePrevStep: () => void;
  handleNextStep: () => void;
  handleOpenModal: () => void;
  handleModalContent: ({
    header,
    body,
  }: {
    header: string;
    body: string;
  }) => void;
}

const Verifications: FC<IVerifications> = ({
  handlePrevStep,
  handleNextStep,
  handleOpenModal,
  handleModalContent,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);
  const refRBSheet = useRef();

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
  const [bottomSheetContent, setBottomSheetContent] = useState<{
    isOpen: boolean;
    header: string;
    buttonText: string;
    type: string;
    height: number | null;
  }>({ isOpen: false, header: "", buttonText: "", type: "", height: null });

  useEffect(() => {
    dispatch<any>(
      sendSMSVerification({
        identifier: registration?.data?.phone_number,
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

  const formatedPhoneNumber = (): string => {
    const firstFour = registration?.data?.phoneNumberOnly.slice(0, 3);
    const lastNumbers = registration?.data?.phoneNumberOnly.slice(
      3,
      registration?.data?.phoneNumberOnly.length + 1
    );
    const formattedNumber = `${registration?.data?.countryCodeOnly} ${firstFour} ${lastNumbers}`;
    return formattedNumber || "";
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
        handleOpenModal();
        setTimeout(() => {
          if (payload?.payload?.status === "success") {
            handleModalContent({
              header: "Updated phone number",
              body:
                payload?.payload?.message ||
                "We resent verification code to your number",
            });
          } else if (
            payload?.payload?.status === "failed" ||
            payload?.payload?.code === 400
          ) {
            handleModalContent({
              header: "Error updating phone number",
              body: payload?.payload?.message || "Something went wrong",
              iconType: "error",
            });
          }
        }, 2000);
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

  const handleVerifyPhoneNumber = () => {
    setIsLoading(true);
    const regData = {
      ...registration.data,
      code: otp ? otp.toString() : null,
      provider: "ziyl",
      country: registration.data.country_of_birth,
    };
    /* console.log(
      "🚀 ~ file: Verifications.tsx:128 ~ handleVerifyPhoneNumber ~ regData:",
      regData
    ); */
    dispatch<any>(getSumsubVerificationCode(regData))
      .unwrap()
      .then((payload: any) => {
        if (payload?.data) {
          if (
            (payload?.data?.code === 201 || payload?.data?.code === "201") &&
            payload?.data?.status === "success"
          ) {
            setIsLoading(false);
            dispatch(
              setRegistrationData({
                registrationAuthentication: payload?.data?.data?.token_ziyl,
                sumsubToken: payload?.data?.data?.token,
                sumsubUserId: payload?.data?.data?.userId,
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
        } else {
          setStatusMessage({
            header: "Error",
            body: "Something went wrong with tha data",
            isOpen: true,
            isError: true,
          });
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.log(`*** send data to backend error: ***`, error);
        setStatusMessage({
          header: "Error",
          body: "Something went wrong",
          isOpen: true,
          isError: true,
        });
        setIsLoading(false);
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

  useEffect(() => {
    if (bottomSheetContent?.isOpen) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [bottomSheetContent?.isOpen]);

  const handleGetanotherVerificationcode = () => {
    setBottomSheetContent({
      isOpen: true,
      header: "Did not get verification code",
      buttonText: "Resend code",
      type: "resendCode",
      height: 325,
    });
  };

  const handleChangePhoneNumber = (): void => {
    setBottomSheetContent({
      isOpen: true,
      header: "Change your phone number",
      buttonText: "Save phone number",
      type: "phoneNumber",
      height: 280,
    });
  };

  const handleBottomSheetButton = () => {
    if (bottomSheetContent?.type === "resendCode") {
      getOtp({
        wholePhoneNumber:
          values?.countryCode && values?.phoneNumber
            ? `${values?.countryCode}${values?.phoneNumber}`
            : registration?.data?.phone_number,
        countryCode: values?.countryCode,
        phoneNumber: values?.phoneNumber,
      });
    }
    if (bottomSheetContent?.type === "phoneNumber") {
      handleSubmit();
    }
  };

  return (
    <Fragment>
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
          <Typography
            fontSize={18}
            fontFamily="Nunito-SemiBold"
            fontWeight="600"
          >
            Verify your phone number
          </Typography>
          <Typography
            fontSize={12}
            fontFamily="Nunito-Regular"
            marginTop={12}
            color={vars["medium-grey2"]}
          >
            You will recieve an sms to your mobile device. Please enter this
            code below.
          </Typography>
        </View>
        <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
        <View>
          <View style={styles.cardBody}>
            <View>
              <View style={styles.pinCodeContainer}>
                <NewPinCodeInputBoxes
                  fieldCount={6}
                  onChange={handlePinCodeChange}
                  isNewPinCodeStyle
                />
                <TouchableOpacity onPress={handleGetanotherVerificationcode}>
                  <Text style={styles.noCode}>
                    Did not get a verification code?
                  </Text>
                </TouchableOpacity>
              </View>
              <WholeContainer>
                <Seperator
                  backgroundColor={vars["v2-light-grey"]}
                  marginBottom={16}
                  marginTop={36}
                />
              </WholeContainer>
              <View />
              <View style={styles.phoneNumberContainer}>
                <View>
                  {registration?.data?.identifier ? (
                    <View>
                      <Text
                        style={{
                          color: vars["medium-grey2"],
                          marginBottom: 10,
                        }}
                      >
                        Your phone number
                      </Text>
                      <View style={styles.phoneNumberInnerContainer}>
                        <PhoneIcon color="blue" size={18} />
                        <Text style={{ marginLeft: 2, marginTop: 4 }}>
                          {registration?.data?.identifier &&
                          typeof registration?.data?.identifier === "string"
                            ? formatedPhoneNumber()
                            : ""}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity onPress={handleChangePhoneNumber}>
                  <Text style={{ color: vars["accent-pink"] }}>
                    Change your phone number
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.footerContent}>
            <View style={styles.downloadBtnMain}>
              <WholeContainer>
                <View style={styles.bottomButtonContainer}>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <View style={{ marginBottom: 6 }}>
                      <Button
                        color="light-pink"
                        onPress={handlePrevStep}
                        leftIcon={<ArrowLeft size={12} />}
                      >
                        <Typography
                          fontSize={16}
                          fontWeight={600}
                          fontFamily="Nunito-SemiBold"
                          marginLeft={8}
                        >
                          Back
                        </Typography>
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
                      <Typography
                        fontSize={16}
                        fontWeight={600}
                        fontFamily="Nunito-SemiBold"
                        marginLeft={8}
                      >
                        Verify your phone number
                      </Typography>
                    </Button>
                  </View>
                </View>
              </WholeContainer>
            </View>
          </View>
        </View>
      </View>
      {bottomSheetContent.isOpen ? (
        <SwipableBottomSheet
          rbSheetRef={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          onClose={() => {
            setBottomSheetContent({
              isOpen: false,
              header: "",
              buttonText: "",
              type: "",
              height: 0,
            });
          }}
          height={bottomSheetContent.isOpen && bottomSheetContent.height}
          wrapperStyles={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          containerStyles={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            elevation: 12,
            shadowColor: "#52006A",
          }}
          draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
        >
          <View style={{ backgroundColor: "#ffff" }}>
            <WholeContainer>
              <View style={styles.headerWrapper}>
                <Typography
                  color="#000"
                  fontFamily="Nunito-SemiBold"
                  fontSize={18}
                  fontWeight={600}
                >
                  {bottomSheetContent?.header}
                </Typography>
              </View>
            </WholeContainer>
            <Seperator backgroundColor={vars["grey"]} marginTop={12} />
            <View style={{ paddingVertical: 24 }}>
              <WholeContainer>
                {bottomSheetContent?.type === "resendCode" ? (
                  <Typography
                    fontFamily="Mukta-Regular"
                    fontSize={14}
                    fontWeight={400}
                  >
                    Lorem ipsum itt tudod újra elküldetni a kódot. Ha így sem
                    kapod meg, ellenőrizd+módosítsd a telefonszámot. Amennyiben
                    ezután is problémába ütközöl, írj a{" "}
                    <Typography color="#E7038E">info@zazoo.io</Typography>{" "}
                    címre!
                  </Typography>
                ) : null}
                {bottomSheetContent?.type === "phoneNumber" ? (
                  <View style={styles.phoneNumberInnerContainer}>
                    <View style={{ width: "50%" }}>
                      <FormGroup
                        validationError={
                          errors.countryCode &&
                          touched.countryCode &&
                          errors.countryCode
                        }
                      >
                        <View style={styles.dropdownWrapper}>
                          <View style={styles.dropDownIconContainerLeft}>
                            <Entypo size={14} color="#086AFB" name={"globe"} />
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
                              items={registrationPhonePrefix}
                              value={values?.countryCode}
                              setOpen={setOpenListForCountryCode}
                              open={openListForCountryCode}
                              style={styles.dropdown}
                              dropDownContainerStyle={styles.dropdownContainer}
                              dropDownDirection="TOP"
                              placeholder=""
                              placeholderStyle={{
                                color: vars["medium-grey"],
                              }}
                            />
                          </View>
                          <View style={styles.dropDownIconContainerRight}>
                            <ArrowDownIcon size={14} color="blue" />
                          </View>
                        </View>
                      </FormGroup>
                    </View>
                    <View style={{ width: "50%" }}>
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
                          placeholder=""
                          iconColor="blue"
                          icon={<PhoneIcon size={14} color="#086AFB" />}
                        />
                      </FormGroup>
                    </View>
                  </View>
                ) : null}
              </WholeContainer>
            </View>
            <Seperator backgroundColor={vars["grey"]} marginTop={12} />
            <WholeContainer>
              <View style={{ paddingVertical: 24 }}>
                <Button
                  color="light-pink"
                  onPress={handleBottomSheetButton}
                  leftIcon={
                    bottomSheetContent?.type === "resendCode" ? (
                      <MaterialCommunityIcons
                        color="#E7038E"
                        size={20}
                        name="send-outline"
                      />
                    ) : bottomSheetContent?.type === "phoneNumber" ? (
                      <Ionicons
                        color="#e7038e"
                        size={20}
                        name={"checkmark-circle-outline"}
                      />
                    ) : null
                  }
                >
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    fontFamily="Nunito-SemiBold"
                    marginLeft={8}
                  >
                    {bottomSheetContent?.buttonText}
                  </Typography>
                </Button>
              </View>
            </WholeContainer>
          </View>
        </SwipableBottomSheet>
      ) : null}
    </Fragment>
  );
};

export default Verifications;
