import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";

import {
  arrayChecker,
  hp,
  screenNames,
  widthGlobal,
  wp,
} from "../../utils/helpers";
import ArrowLeftLine from "../../assets/icons/ArrowLeftLine";
import vars from "../../styles/vars";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { RootState } from "../../store";
import { validationPaymentSchema } from "../../utils/validation";
import {
  useInitiatePaymentMutation,
  useProcessPaymentMutation,
  useSmsRequestVerificationMutation,
  useSubmitProcessPaymentMutation,
  useInitiatePaymentV2Mutation,
  useGetOTPV2Mutation,
  useProcessPaymentV2Mutation,
} from "../../redux/payee/payeeSlice";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import ModalBottomSheet from "../../components/ModalBottomSheet/ModalBottomSheet";
import MainLayout from "../../layout/Main";
import PayeeAttachFileSection from "./components/PayeeAttaFileSection";
import CloudMessage from "../../assets/icons/CloudMessage";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { PinCodeInputClipBoard } from "../../components/FormGroup/FormGroup";
import ChangeLimits from "../../assets/icons/ChangeLimits";
import Typography from "../../components/Typography";
import CheckIcon from "../../assets/icons/Check";
import Euro from "../../assets/icons/Euro";

const PayeeSendFunds = ({ navigation, route }: any) => {
  const { params }: any = route || { params: {} };
  const accountData = useSelector((state: any) => state?.account?.details);
  const refRBSheetCodeOTP = useRef();
  const refRBSheetSuccess = useRef();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const paramsHeader = {
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  };

  const accountIban = userData?.iban || "";
  const accountName = `${userData?.first_name} ${userData?.last_name}` || "";
  const receiverName: string = params?.item.name || "";
  const receiverIban: string = params?.item.iban || "";
  const receiverUuid: string = params?.item.uuid || "";
  const windowHeight = Dimensions.get("window").height;

  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isDropDownCurrencyOpen, setIsDropDownCurrencyOpen] =
    useState<boolean>(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [base64File, setBase64File] = useState<string>("");
  const [isPaymentResultBottomSheetOpen, setIsPaymentResultBottomSheetOpen] =
    useState<boolean>(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] =
    useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("EUR");
  const [smsPaymentRequest, setSmsPaymentRequest] = useState<any>({});

  const [code, setCode] = useState("");
  const [isTimeToCountDown, setIsTimeToCountDown] = useState<boolean>(false);
  const [isOpenModalSuccessMessage, setIsOpenModalSuccessMessage] =
    useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [bottomSheetMessage, setBottomSheetMessage] = useState<{
    message: string;
  }>({ message: "" });

  const enableResend = timeRemaining === 0;

  const handlePinCodeChange = (value: string) => {
    setCode(value);
  };

  const _handleResendSMSVerificationCode = () => {
    // handleResendHere
  };

  const [initiatePayment] = useInitiatePaymentMutation();
  const [
    initiatePaymentV2,
    {
      isLoading: isLoadingInitPaymentV2,
      isError: isErrorInitPaymentV2,
      isSuccess: isSuccessInitPaymentV2,
      error: errorInitPaymentV2,
      data: dataInitPaymentV2,
    },
  ] = useInitiatePaymentV2Mutation();

  const [smsRequestVerification] = useSmsRequestVerificationMutation();
  const [
    getOTPV2,
    {
      isLoading: isLoadingGetOTPV2,
      isError: isErrorInitGetOTPV2,
      isSuccess: isSuccessGetOTPV2,
      error: errorGetOTPV2,
      data: dataGetOTPV2,
    },
  ] = useGetOTPV2Mutation();

  const [processPayment] = useProcessPaymentMutation();
  const [
    processPaymentV2,
    {
      isLoading: isLoadingProcessPaymentV2,
      isError: isErrorProcessPaymentV2,
      isSuccess: isSuccessProcessPaymentV2,
      error: errorProcessPaymentV2,
      data: dataProcessPaymentV2,
    },
  ] = useProcessPaymentV2Mutation();

  const [submitProcessPayment] = useSubmitProcessPaymentMutation();

  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });

  const accountBalance = userAccountInformation?.data?.avlbal || 0;
  const validationSchema = validationPaymentSchema(accountBalance);

  // initiate payment request
  useEffect(() => {
    if (!isLoadingInitPaymentV2 && isSuccessInitPaymentV2) {
      if (dataInitPaymentV2?.code === 200) {
        const transactionId =
          dataInitPaymentV2?.data?.transaction_id &&
          dataInitPaymentV2?.data?.transaction_id;
        if (transactionId) {
          const parsedAmount = parseFloat(values?.amount).toFixed(2);
          const bodyParams = {
            identifier: transactionId,
            type: "transfer",
            amount: parsedAmount,
            currency: values?.currency,
          };
          getOTPV2({ bodyParams, paramsHeader });
        }
      }
    }
  }, [isLoadingInitPaymentV2, isSuccessInitPaymentV2, dataInitPaymentV2]);

  useEffect(() => {
    if (!isLoadingInitPaymentV2 && isErrorInitPaymentV2) {
      if (
        errorInitPaymentV2 &&
        errorInitPaymentV2?.data &&
        errorInitPaymentV2?.data?.code
      ) {
        if (
          errorInitPaymentV2?.data?.code === 400 ||
          errorInitPaymentV2?.data?.code === 422 ||
          errorInitPaymentV2?.data?.code === 460 ||
          errorInitPaymentV2?.data?.code === 460
        ) {
          console.log("going 1");
          if (errorInitPaymentV2?.data && errorInitPaymentV2?.data?.errors) {
            console.log("going 2");
            const errorMessage =
              arrayChecker(errorInitPaymentV2?.data?.errors) &&
              errorInitPaymentV2?.data?.errors.length > 0
                ? errorInitPaymentV2?.data?.errors[0]
                : "Something went wrong";

            setStatusMessage({
              header: "Error",
              body: errorMessage,
              isOpen: true,
              isError: true,
            });
          }
        }
      }
    }
  }, [isLoadingInitPaymentV2, isErrorInitPaymentV2, errorInitPaymentV2]);

  // for otp
  useEffect(() => {
    if (!isLoadingGetOTPV2 && isSuccessGetOTPV2) {
      if (dataGetOTPV2?.message) {
        setBottomSheetMessage({ message: dataGetOTPV2?.message });
        refRBSheetCodeOTP?.current?.open();
      }
    }
  }, [isLoadingGetOTPV2, isSuccessGetOTPV2, dataGetOTPV2]);

  useEffect(() => {
    if (!isLoadingGetOTPV2 && isErrorInitGetOTPV2) {
      setStatusMessage({
        header: "Error",
        body: "OTP error: Please try again",
        isOpen: true,
        isError: true,
      });
    }
  }, [isLoadingGetOTPV2, isErrorInitGetOTPV2]);

  const handleProcessPayment = async ({ code }: { code: string }) => {
    if (!code) {
      return;
    }
    processPayment({
      identifier: smsPaymentRequest.identifier,
      code,
      debtor_iban: accountIban,
      creditor_iban: receiverIban,
      creditor_name: receiverName,
      amount: smsPaymentRequest.amount,
      currency: smsPaymentRequest.currency,
      reference: smsPaymentRequest?.reference,
      remarks: smsPaymentRequest?.reference,
      purpose: smsPaymentRequest?.purpose,
      reason: smsPaymentRequest?.purpose,
      access_token: userTokens?.access_token,
      token_ziyl: userTokens?.token_ziyl,
    })
      .unwrap()
      .then((res) => {
        const { status } = res;
        refRBSheetCodeOTP?.current.close();
        refRBSheetSuccess?.current?.open();
        setIsOpenModalSuccessMessage(true);
        setIsPaymentSuccessful(true);
        submitProcessPayment({
          access_token: userTokens?.access_token,
          token_ziyl: userTokens?.token_ziyl,
          email: userData?.email,
          reference: smsPaymentRequest?.remarks,
          purpose: smsPaymentRequest?.reason,
          ticketValue: {
            processpaymentupload: [
              // for improvement - arjay
              {
                filename: "test.pdf",
                data: smsPaymentRequest?.attached_file,
                type: "application/pdf",
              },
            ],
          },
        });
      })
      .catch((err) => {
        console.log(err);
        refRBSheetCodeOTP?.current.close();
        refRBSheetSuccess?.current?.open();
        setIsPaymentSuccessful(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInitiatepayment = (paymentValues: any) => {
    /* const recipientFirstname = receiverName.split(" ")[0];
    const recipientLastname = receiverName.split(" ")[1];
    initiatePayment({
      recipientFirstname,
      recipientLastname,
      amount: paymentValues.amount,
      currency: paymentValues.currency,
      debtor_iban: accountIban,
      creditor_iban: receiverIban,
      creditor_name: receiverName,
      reason: paymentValues.purpose,
      purpose: paymentValues.purpose,
      remarks: paymentValues.reference,
      reference: paymentValues.reference,
      access_token: userTokens?.access_token,
      token_ziyl: userTokens?.token_ziyl,
      ...(paymentValues.attachedFile && {
        attached_file: paymentValues.attachedFile,
      }),
    })
      .unwrap()
      .then((res) => {
        let paymentRequest = {
          identifier: res.transaction_id,
          type: "transfer",
          amount: paymentValues.amount,
          currency: paymentValues.currency,
        };
        console.log("res", res);
        setIsLoading(false);
        setSmsPaymentRequest({
          ...res,
          ...paymentRequest,
          ...paymentValues,
          token_ziyl: userTokens?.token_ziyl,
          access_token: userTokens?.access_token,
        });
        smsRequestVerification({
          ...paymentRequest,
          token_ziyl: userTokens?.token_ziyl,
          access_token: userTokens?.access_token,
        })
          .unwrap()
          .then((res) => {
            const { status } = res;
            if (status === "success") {
              refRBSheetCodeOTP?.current.open();
            }
          })
          .catch((err) => {
            console.log("Error2: ", err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.log("Error1: ", err);
        setIsLoading(false);
      }); */
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    setFieldValue,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      amount: "",
      currency: "EUR",
      remarks: "",
      purpose: "",
      reference: "",
      isManualProcessing: false,
      reason: "",
      attachedFile: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      // setIsLoading(true);
      if (values.amount >= 5000 && !values?.attachedFile) {
        setIsLoading(false);
        return;
      }
      /* const { amount } = values;
      handleInitiatepayment({
        ...values,
        amount: parseFloat(amount).toFixed(2),
      }); */

      const parsedAmount = parseFloat(values?.amount).toFixed(2);
      const bodyParams = {
        debtor_iban: accountIban,
        creditor_iban: receiverIban,
        creditor_name: receiverName,
        amount: parsedAmount,
        currency: values?.currency,
        purpose: values?.purpose,
        reference: values?.reference,
        bic: userData?.bic,
      };

      initiatePaymentV2({ bodyParams, paramsHeader });
    },
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success") {
        const { uri } = result;
        const fileContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setValues({
          ...values,
          attachedFile: fileContent,
        });
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimeToCountDown) {
      interval = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining(timeRemaining - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
    if (enableResend) {
      setIsTimeToCountDown(false);
      setTimeRemaining(60);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timeRemaining, isTimeToCountDown]);

  const closePopup = () => {
    resetForm();
    setIsOpenModalSuccessMessage(false);
  };

  const onCloseModal = (): void => {
    console.log("closing asap");
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <MainLayout>
      <Spinner
        visible={isLoading || isLoadingInitPaymentV2 || isLoadingGetOTPV2}
      />
      <KeyboardAwareScrollView
        style={{ height: "100%", backgroundColor: "white" }}
      >
        <SuccessModal
          isOpen={statusMessage.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
        <View style={{ paddingRight: 6 }}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.headerLeftIcon}
                onPress={() => navigation.pop()}
              >
                <ArrowLeftLine size={18} color="blue" />
              </TouchableOpacity>
              <View>
                <Typography
                  fontSize={14}
                  color="#000"
                  textAlign="left"
                  fontFamily="Nunito-SemiBold"
                >
                  {receiverName}
                </Typography>
                <Typography
                  fontSize={12}
                  color={vars["shade-grey"]}
                  textAlign="left"
                  fontFamily="Nunito-SemiBold"
                >
                  {receiverIban}
                </Typography>
              </View>
            </View>
            <View style={{ paddingRight: 5 }}>
              <Typography
                fontSize={14}
                color="#000"
                textAlign="left"
                fontFamily="Nunito-SemiBold"
              >
                Your Balance
              </Typography>
              <Typography
                fontSize={12}
                color={vars["shade-grey"]}
                textAlign="right"
                fontFamily="Nunito-SemiBold"
              >
                € {accountBalance}
              </Typography>
            </View>
          </View>
          <View
            style={{
              // paddingTop: 8,
              backgroundColor: "#fff",
              paddingHorizontal: 18,
            }}
          >
            <Divider
              style={{
                marginBottom: 26,
                width: widthGlobal,
                left: -18,
                height: 1,
                backgroundColor: "#ACACAC",
                opacity: 0.4,
              }}
            />
            <View style={{ marginBottom: 8, paddingBottom: 10 }}>
              <FormGroup
                validationError={
                  errors.amount && touched.amount && errors.amount
                }
              >
                <FormGroup.Input
                  name="amount"
                  keyboardType="numeric"
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  value={values.amount}
                  placeholderTextColor={vars["ios-default-text"]}
                  placeholder="Amount to send"
                  iconColor="blue"
                  style={{ height: 42 }}
                  icon={<Euro size={22} />}
                />
              </FormGroup>
              {errors.amount === "This amount is above your daily limit" &&
                touched.amount && (
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 56,
                      bottom: 0,
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      backgroundColor: "#FFF1F1",
                      borderRadius: 15,
                      display: "flex",
                      flexDirection: "row",
                      padding: 5,
                      height: 24,
                    }}
                    onPress={() => {
                      console.log("change limits");
                    }}
                  >
                    <ChangeLimits />
                    <Text style={{ color: "#FF7171", fontSize: 10, top: -2 }}>
                      Change your limits
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
            <FormGroup
              validationError={
                errors.reference && touched.reference && errors.reference
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="reference"
                onChangeText={handleChange("reference")}
                onBlur={handleBlur("reference")}
                value={values.reference}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Reference"
                iconColor="blue"
                style={{ height: 42 }}
                icon={<CloudMessage />}
              />
            </FormGroup>
            <Divider
              style={{
                marginVertical: 15,
                width: widthGlobal,
                left: -18,
                height: 1,
                backgroundColor: "#ACACAC",
                opacity: 0.4,
              }}
            />
            {values.amount >= 5000 && (
              <PayeeAttachFileSection
                values={values}
                setFieldValue={setFieldValue}
                pickDocument={pickDocument}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingVertical: 20,
          shadowColor: "#ACACAC",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex: 999,
        }}
      >
        <Button
          onPress={handleSubmit}
          color="light-pink"
          style={{ width: "100%", alignSelf: "center" }}
          leftIcon={
            <AntDesign
              name="checkcircleo"
              size={16}
              color={vars["accent-pink"]}
            />
          }
        >
          Send
        </Button>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheetCodeOTP}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          setBottomSheetMessage({ message: "" });
        }}
        height={385}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#DDD", width: 90 }}
      >
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 18,
              left: 20,
              fontFamily: "Nunito-SemiBold",
              color: "#000",
              textAlign: "left",
            }}
          >
            Verify your payment
          </Text>
          <View style={{ paddingRight: 24 }}>
            <Text
              style={{
                fontSize: 14,
                left: 20,
                fontFamily: "Nunito-SemiBold",
                color: vars["shade-grey"],
                textAlign: "left",
                paddingTop: 10,
              }}
            >
              {bottomSheetMessage?.message}
            </Text>
          </View>
          <Divider
            style={{
              marginTop: 10,
              height: 1,
              backgroundColor: vars["shade-grey"],
              opacity: 0.2,
              marginBottom: 40,
            }}
          />
          <View style={{ alignItems: "center", paddingHorizontal: 12 }}>
            <PinCodeInputClipBoard
              fieldCount={6}
              onChange={handlePinCodeChange}
            />
            <TouchableOpacity
              onPress={_handleResendSMSVerificationCode}
              disabled={isTimeToCountDown}
            >
              {isTimeToCountDown ? (
                <Text style={styles.noCodeResend}>
                  Wait for {timeRemaining}s to request again.
                </Text>
              ) : (
                <Text style={styles.noCodeResend}>
                  Did not get a verification code?
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <Divider
            style={{
              marginVertical: 10,
              height: 1,
              backgroundColor: vars["shade-grey"],
              opacity: 0.2,
            }}
          />
          <Button
            onPress={() => {
              setIsLoading(true);
              handleProcessPayment({ code });
            }}
            color="light-pink"
            style={{
              width: "90%",
              bottom: 0,
              position: "relative",
              alignItems: "center",
              alignSelf: "center",
              marginTop: 20,
            }}
            leftIcon={
              <AntDesign
                name="checkcircleo"
                size={16}
                color={vars["accent-pink"]}
              />
            }
          >
            Confirm payment
          </Button>
        </View>
      </SwipableBottomSheet>
      {isOpenModalSuccessMessage && Platform.OS === "ios" ? (
        <ModalBottomSheet
          isOpen={isOpenModalSuccessMessage}
          hasNoHeaderPadding
          contentHeight={500}
        >
          <View
            style={[
              styles.headerContainer,
              { backgroundColor: isPaymentSuccessful ? "#0DCA9D" : "#FF7171" },
            ]}
          >
            <View style={styles.headerWrapper}>
              <View>
                {isPaymentSuccessful ? (
                  <View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <CheckIcon color="white" size={18} />
                      <Text
                        style={[
                          styles.textConfirmation,
                          { color: "white", paddingTop: 0 },
                        ]}
                      >
                        Payment verified
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <Text
                        style={[
                          styles.textConfirmation,
                          { color: "white", paddingTop: 0 },
                        ]}
                      >
                        Payment rejected
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
          {isPaymentSuccessful ? (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
              }}
            >
              <Typography
                color="#000"
                fontSize={14}
                marginLeft={6}
                fontWeight={400}
                fontFamily="Mukta-Regular"
              >
                Your payment is on the way.
              </Typography>
              <Typography
                color="#000"
                fontSize={14}
                marginLeft={6}
                fontWeight={400}
                fontFamily="Mukta-Regular"
              >
                Check your notification and transaction page.
              </Typography>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
              }}
            >
              <Typography
                color="#000"
                fontSize={14}
                marginLeft={6}
                fontWeight={400}
                fontFamily="Mukta-Regular"
              >
                Your payment is rejected.
              </Typography>
              <Typography
                color="#000"
                fontSize={14}
                marginLeft={6}
                fontWeight={400}
                fontFamily="Mukta-Regular"
              >
                Get new verification code to your phone or get support from our
                team
              </Typography>
            </View>
          )}

          <View style={styles.headerWrapper}>
            <Button
              color={"green"}
              onPress={() => closePopup()}
              style={styles.buttonOK}
            >
              <Text>OK</Text>
            </Button>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require('("../../../assets/images/verified.png')}
              style={styles.image}
            />
          </View>
        </ModalBottomSheet>
      ) : null}
      {Platform.OS === "android" ? (
        <SwipableBottomSheet
          rbSheetRef={refRBSheetSuccess}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={420}
          wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
          containerStyles={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            elevation: 12,
            shadowColor: "#52006A",
          }}
          onClose={() => {
            navigation.navigate(screenNames.payments);
          }}
          draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
        >
          <View
            style={{
              borderColor: isPaymentSuccessful
                ? vars["accent-green"]
                : vars["heavy-red"],
              borderTopWidth: 60,
            }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                top: -45,
                fontSize: 18,
              }}
            >
              {isPaymentSuccessful ? "Payment Successful" : "Payment Failed"}
            </Text>
          </View>
          {isPaymentSuccessful ? (
            <>
              <Text style={styles.textConfirmation}>
                Your payment has been verified.
              </Text>
              <Text style={styles.textConfirmation}>
                Check your notifications and transaction page.
              </Text>
              <Image
                source={require("../../assets/images/verified.png")}
                style={styles.imageContainer}
              />
            </>
          ) : (
            <>
              <Text style={styles.textConfirmation}>
                Your payment failed to verify.
              </Text>
              <Text style={styles.textConfirmation}>
                Check your notifications and transaction page.
              </Text>
              <Image
                source={require("../../assets/images/failed.png")}
                style={styles.imageContainer}
              />
            </>
          )}
        </SwipableBottomSheet>
      ) : null}
    </MainLayout>
  );
};
export default PayeeSendFunds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingTop: 25,
    paddingHorizontal: 10,
    // backgroundColor: "#ACACAC",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
  },
  headerLeftIcon: {
    height: wp(23),
    width: wp(23),
    borderRadius: wp(23),
    top: hp(-2.7),
    margin: 7,
    backgroundColor: "#F5F9FF",
    padding: wp(7.5),
  },
  dropdown: {
    width: "93%",
    height: 52,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: vars["accent-blue"],
    borderWidth: 1,
    borderRadius: 40,
  },
  dropdownContainer: {
    width: "93%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 0,
    borderRadius: 40,
  },
  textConfirmation: {
    fontSize: 14,
    color: vars["accent-grey"],
    alignSelf: "center",
    fontWeight: 400,
    paddingTop: 6,
  },
  imageContainer: {
    width: 200,
    height: 200,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: 20,
    right: -45,
  },
  noCodeResend: {
    color: vars["accent-pink"],
    fontSize: 12,
    fontWeight: "400",
    marginTop: 12,
    textAlign: "center",
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: "#0DCA9D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    width: "100%",
    height: 75,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  buttonOK: { backgroundColor: "#fff", height: 30, width: 90, marginTop: 24 },
  image: {
    height: 200,
    width: 180,
    marginTop: 46,
    marginLeft: 90,
  },
});
