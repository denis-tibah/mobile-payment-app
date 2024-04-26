import { useEffect, useRef, useState } from "react";
import {
  View,
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

import ArrowLeftLine from "../../assets/icons/ArrowLeftLine";
import vars from "../../styles/vars";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { RootState } from "../../store";
import { validationPaymentSchema } from "../../utils/validation";
import {
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
import { arrayChecker, screenNames, widthGlobal } from "../../utils/helpers";
import { styles } from "./styles";
import WholeContainer from "../../layout/WholeContainer";

const PayeeSendFunds = ({ navigation, route }: any) => {
  const { params }: any = route || { params: {} };
  /*  const accountData = useSelector((state: any) => state?.account?.details); */
  const refRBSheetCodeOTP = useRef();
  const refRBSheetSuccess = useRef();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const paramsHeader = {
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  };

  const accountIban = userData?.iban || "";

  // const receiverName: string = params?.item.name || "";

   const receiverName: string = params?.item?.transaction_direction === "outgoing"  ? params?.item?.name || params?.item?.debtor_name || "" : "";

  // let receiverName: string = "";
  //   if(params?.item?.transaction_direction === "outgoing"){
  //       receiverName = params?.item?.name || params?.item?.debtor_name || "";
  //   }

  const receiverIban: string = params?.item.iban || "";

  const [timeRemaining, setTimeRemaining] = useState<number>(60);

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
  console.log("🚀 ~ PayeeSendFunds ~ errorGetOTPV2:", errorGetOTPV2);

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
          if (errorInitPaymentV2?.data && errorInitPaymentV2?.data?.errors) {
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
        } else {
          setStatusMessage({
            header: "Error",
            body: "Something went wrong on payment initialization",
            isOpen: true,
            isError: true,
          });
        }
      }
    }
  }, [isLoadingInitPaymentV2, isErrorInitPaymentV2, errorInitPaymentV2]);

  // for successfull otp
  useEffect(() => {
    if (!isLoadingGetOTPV2 && isSuccessGetOTPV2) {
      if (dataGetOTPV2?.message) {
        setBottomSheetMessage({ message: dataGetOTPV2?.message });

        refRBSheetCodeOTP?.current?.open();
      }
    }
  }, [isLoadingGetOTPV2, isSuccessGetOTPV2, dataGetOTPV2]);
  // for failed otp
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

  //for successfull process payment
  useEffect(() => {
    if (!isLoadingProcessPaymentV2 && isSuccessProcessPaymentV2) {
      // refRBSheetCodeOTP?.current?.close();
      if (dataProcessPaymentV2?.code === 200) {
        refRBSheetSuccess?.current?.open();
        setIsOpenModalSuccessMessage(true);
        setBottomSheetMessage({
          message: dataProcessPaymentV2?.message
            ? dataProcessPaymentV2?.message
            : "Your payment has been verified",
        });
      }
    }
  }, [
    isLoadingProcessPaymentV2,
    isSuccessProcessPaymentV2,
    dataProcessPaymentV2,
  ]);
  //for rejected  process payment
  useEffect(() => {
    if (!isLoadingProcessPaymentV2 && isErrorProcessPaymentV2) {
      if (
        errorProcessPaymentV2?.data?.code === 400 ||
        errorProcessPaymentV2?.data?.code === 422 ||
        errorProcessPaymentV2?.data?.code === 460 ||
        errorProcessPaymentV2?.data?.code === 461 ||
        errorProcessPaymentV2?.data?.code === 404
      ) {
        setIsOpenModalSuccessMessage(true);
        if (
          errorProcessPaymentV2?.data &&
          errorProcessPaymentV2?.data?.errors
        ) {
          refRBSheetSuccess?.current?.open();
          const errorMessage =
            arrayChecker(errorProcessPaymentV2?.data?.errors) &&
            errorProcessPaymentV2?.data?.errors.length > 0
              ? errorProcessPaymentV2?.data?.errors[0]
              : "Something went wrong";
          setBottomSheetMessage({
            message: errorMessage,
          });
          /* if (Platform.OS === "ios") {
            setStatusMessage({
              header: "Error",
              body: errorMessage,
              isOpen: true,
              isError: true,
            });
          } */
        }
      } else {
        setStatusMessage({
          header: "Error",
          body: "Semething went wrong while processing your payment",
          isOpen: true,
          isError: true,
        });
      }
    }
  }, [
    isLoadingProcessPaymentV2,
    isErrorProcessPaymentV2,
    errorProcessPaymentV2,
  ]);

  const handleProcessPayment = async ({ code }: { code: string }) => {
    if (!code) {
      setStatusMessage({
        header: "Error",
        body: "Incorrect OTP",
        isOpen: true,
        isError: true,
      });
    }
    const transactionId =
      dataInitPaymentV2?.data?.transaction_id &&
      dataInitPaymentV2?.data?.transaction_id;
    const parsedAmount = parseFloat(values?.amount).toFixed(2);
    const bodyParams = {
      identifier: transactionId,
      code,
      debtor_iban: accountIban,
      creditor_iban: receiverIban,
      creditor_name: receiverName,
      amount: parsedAmount,
      bic: userData?.bic,
      currency: values?.currency,
      remarks: values?.reference,
    };
    processPaymentV2({ bodyParams, paramsHeader });
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
      if (values.amount >= 5000 && !values?.attachedFile) {
        setStatusMessage({
          header: "",
          body: "Amount shoudn't be greater than 5000",
          isOpen: true,
          isError: true,
        });
        return;
      }

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

  const _handleResendSMSVerificationCode = () => {
    refRBSheetCodeOTP?.current?.close();
    const transactionId =
      dataInitPaymentV2?.data?.transaction_id &&
      dataInitPaymentV2?.data?.transaction_id;
    const parsedAmount = parseFloat(values?.amount).toFixed(2);
    const bodyParams = {
      identifier: transactionId,
      type: "transfer",
      amount: parsedAmount,
      currency: values?.currency,
    };
    getOTPV2({ bodyParams, paramsHeader });
  };

  const onCloseModal = (): void => {
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
        visible={
          isLoadingInitPaymentV2 ||
          isLoadingGetOTPV2 ||
          isLoadingProcessPaymentV2
        }
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
        <WholeContainer>
          <View style={styles.headerText}>
            <View style={styles.headerLeftIcon}>
              <TouchableOpacity onPress={() => navigation.pop()}>
                <ArrowLeftLine size={18} color="blue" />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 14, width: "100%" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  fontSize={14}
                  color="#000"
                  fontFamily="Nunito-SemiBold"
                >
                  {/* disabled by Aristos 26-04-2026 */}
                  {receiverName}

                  {/* added by Aristos 26-04-2026 */}
                  {/* {params?.item.transaction_direction === "outgoing" ? (
                          params?.item.name
                      ) :  params?.item.debtor_name } */}

                </Typography>

                <Typography
                  fontSize={14}
                  color="#000"
                  marginRight={24}
                  fontFamily="Nunito-SemiBold"
                >
                  Your Balance
                </Typography>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  fontSize={12}
                  color={vars["shade-grey"]}
                  fontFamily="Nunito-SemiBold"
                >
                  {receiverIban}
                </Typography>
                <Typography
                  fontSize={12}
                  color={vars["shade-grey"]}
                  fontFamily="Nunito-SemiBold"
                  marginRight={24}
                >
                  € {accountBalance}
                </Typography>
              </View>
            </View>
          </View>
        </WholeContainer>
        <View style={{ paddingRight: 6 }}>
          <View
            style={{
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
                  icon={<Euro size={"22"} />}
                />
              </FormGroup>
              {/* {errors.amount === "This amount is above your daily limit" &&
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
                    <Text style={{ color: "#FF7171", fontSize: "10", top: -2 }}>
                      Change your limits
                    </Text>
                  </TouchableOpacity>
                )} */}
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
      <View style={styles.sendButton}>
        <Button
          onPress={handleSubmit}
          color="light-pink"
          style={{ width: "100%", alignSelf: "center" }}
          leftIcon={
            <AntDesign
              name="checkcircleo"
              style={{ fontSize: 16 }}
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
              console.log("submitting");
              refRBSheetCodeOTP?.current?.close();
              handleProcessPayment({ code });
            }}
            color="light-pink"
            style={styles.buttonConfirmPayment}
            leftIcon={
              <AntDesign
                name="checkcircleo"
                //size={16}
                style={{ fontSize: 16 }}
                color={vars["accent-pink"]}
              />
            }
          >
            Confirm payment
          </Button>
        </View>
      </SwipableBottomSheet>

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
              borderColor: isSuccessProcessPaymentV2
                ? vars["accent-green"]
                : isErrorProcessPaymentV2
                ? vars["heavy-red"]
                : vars["accent-green"],
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
              {isSuccessProcessPaymentV2 ? "Payment Successful" : null}
              {isErrorProcessPaymentV2 ? "Payment rejected" : null}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography
              color="#000"
              fontSize={14}
              marginLeft={6}
              fontWeight={"400"}
              fontFamily="Mukta-Regular"
            >
              {bottomSheetMessage?.message}
            </Typography>
          </View>
          {isSuccessProcessPaymentV2 ? (
            <Image
              source={require("../../assets/images/verified.png")}
              style={styles.imageContainer}
            />
          ) : null}
          {isErrorProcessPaymentV2 ? (
            <Image
              source={require("../../assets/images/failed.png")}
              style={styles.imageContainer}
            />
          ) : null}
        </SwipableBottomSheet>
      ) : null}
      {isOpenModalSuccessMessage && Platform.OS === "ios" ? (
        <ModalBottomSheet
          isOpen={isOpenModalSuccessMessage}
          hasNoHeaderPadding
          contentHeight={500}
        >
          <View
            style={[
              styles.headerContainer,
              {
                backgroundColor: isSuccessProcessPaymentV2
                  ? "#0DCA9D"
                  : isErrorProcessPaymentV2
                  ? "#FF7171"
                  : "#0DCA9D",
              },
            ]}
          >
            <View style={styles.headerWrapper}>
              {isSuccessProcessPaymentV2 ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <CheckIcon color="white" size={"18"} />
                  <Text
                    style={[
                      styles.textConfirmation,
                      { color: "white", paddingTop: 0 },
                    ]}
                  >
                    Payment verified
                  </Text>
                </View>
              ) : null}
              {isErrorProcessPaymentV2 ? (
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
              ) : null}
            </View>
          </View>
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
              fontWeight={"400"}
              fontFamily="Mukta-Regular"
            >
              {bottomSheetMessage?.message}
            </Typography>
          </View>

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
            {isSuccessProcessPaymentV2 ? (
              <Image
                source={require('("../../../assets/images/verified.png')}
                style={styles.image}
              />
            ) : null}
            {isErrorProcessPaymentV2 ? (
              <Image
                source={require("../../assets/images/failed.png")}
                style={styles.imageContainer}
              />
            ) : null}
          </View>
        </ModalBottomSheet>
      ) : null}
    </MainLayout>
  );
};
export default PayeeSendFunds;
