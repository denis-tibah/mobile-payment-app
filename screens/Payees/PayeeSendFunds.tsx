import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Euro from "../../assets/icons/Euro";
import PayeeAttachFileSection from "./components/PayeeAttaFileSection";
import CheckBox from "expo-checkbox";
import { useFormik } from "formik";
import MainLayout from "../../layout/Main";
import { globalWidthUnit, hp, screenNames, widthGlobal, wp } from "../../utils/helpers";
import ArrowLeftLine from "../../assets/icons/ArrowLeftLine";
import vars from "../../styles/vars";
import { Divider, overlay } from "react-native-paper";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { RootState } from "../../store";
import StatementsIcon from "../../assets/icons/StatementsIcon";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useRef, useState } from "react";
import { validationPaymentSchema } from "../../utils/validation";
import {
  useInitiatePaymentMutation,
  useProcessPaymentMutation,
  useSmsRequestVerificationMutation,
  useSubmitProcessPaymentMutation,
} from "../../redux/payee/payeeSlice";
import BottomSheet from "../../components/BottomSheet";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Image } from "react-native";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import CloudMessage from "../../assets/icons/CloudMessage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import {
  PinCodeInputBoxes,
  PinCodeInputClipBoard,
} from "../../components/FormGroup/FormGroup";
import ChangeLimits from "../../assets/icons/ChangeLimits";
import Document from "../../assets/icons/Document";
import Typography from "../../components/Typography";


const currencyOptions = [
  { label: "EUR", value: "EUR" },
  { label: "USD", value: "USD" },
];

const PayeeSendFunds = ({ navigation, route }: any) => {
  const { params }: any = route || { params: {} };
  const accountData = useSelector((state: any) => state?.account?.details);
  const refRBSheetCodeOTP = useRef();
  const refRBSheetSuccess = useRef();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const accountIban = userData?.iban || "";
  const accountName = `${userData?.first_name} ${userData?.last_name}` || "";
  const receiverName: string = params?.item.name || "";
  const receiverIban: string = params?.item.iban || "";
  const receiverUuid: string = params?.item.uuid || "";
  const windowHeight = Dimensions.get("window").height;

  const [initiatePayment] = useInitiatePaymentMutation();
  const [smsRequestVerification] = useSmsRequestVerificationMutation();
  const [processPayment] = useProcessPaymentMutation();
  const [submitProcessPayment] = useSubmitProcessPaymentMutation();

  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });
  const accountBalance = userAccountInformation?.data?.avlbal || 0;
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
  const validationSchema = validationPaymentSchema(accountBalance);
  const [code, setCode] = useState("");
  const [isTimeToCountDown, setIsTimeToCountDown] = useState<boolean>(false);
  const enableResend = timeRemaining === 0;

  const handlePinCodeChange = (value: string) => {
    setCode(value);
  };

  const _handleResendSMSVerificationCode = () => {
    // handleResendHere
  };

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
        setIsPaymentSuccessful(true);
        submitProcessPayment({
          access_token: userTokens?.access_token,
          token_ziyl: userTokens?.token_ziyl,
          email: userData?.email,
          reference: smsPaymentRequest?.remarks,
          purpose: smsPaymentRequest?.reason,
          ticketValue: {
            processpaymentupload: [ // for improvement - arjay
              {
                filename:"test.pdf", 
                data: smsPaymentRequest?.attached_file,
                type: "application/pdf",
              }
            ]
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

  const handleResendSMSVerificationCode = () => {
    smsRequestVerification(smsPaymentRequest);
  };

  const handleInitiatepayment = (paymentValues: any) => {
    const recipientFirstname = receiverName.split(" ")[0];
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
      });
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
    onSubmit: (values: any) => {
      setIsLoading(true);
      if (values.amount >= 5000 && !values?.attachedFile) {
        setIsLoading(false);
        return;
      }
      handleInitiatepayment(values);
    },
    validationSchema: validationSchema,
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

  return (
    <MainLayout>
      <LoadingScreen isLoading={isLoading} />
      <KeyboardAwareScrollView
        style={{ height: "100%", backgroundColor: "white" }}
      >
        <View style={{ paddingRight: 6 }}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.headerLeftIcon}
                onPress={() => navigation.navigate(screenNames.payments)}
              >
                <ArrowLeftLine size={18} color="blue"/>
              </TouchableOpacity>
              <View>
                <Typography fontSize={14} color='#000' textAlign="left" fontFamily="Nunito-SemiBold">{receiverName}</Typography>
                <Typography fontSize={12} color={vars["shade-grey"]} textAlign="left" fontFamily="Nunito-SemiBold">
                  {receiverIban}
                </Typography>
              </View>
            </View>
            <View style={{paddingRight:5}}>
              <Typography fontSize={14} color='#000' textAlign="left" fontFamily="Nunito-SemiBold">Your Balance</Typography>
              <Typography fontSize={12} color={vars["shade-grey"]} textAlign="right" fontFamily="Nunito-SemiBold">
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
            <Divider style={{
              marginBottom: 26,
              width: widthGlobal,
              left: -18,
              height: 1,
              backgroundColor: '#ACACAC',
              opacity: 0.4
            }} />
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
              {errors.amount === "This amount is above your daily limit" && touched.amount && (
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
              validationError={errors.reference && touched.reference && errors.reference}
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
            <Divider style={{
              marginVertical: 15,
              width: widthGlobal,
              left: -18,
              height: 1,
              backgroundColor: '#ACACAC',
              opacity: 0.4
            }} />
            {values.amount >= 5000 && (
              <PayeeAttachFileSection
                values={values}
                setFieldValue={setFieldValue}
                pickDocument={pickDocument}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              )
            }
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
        height={380}
        wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
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
        draggableIconStyles={{ backgroundColor: "#DDD", width: 90 }}
      >
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 18,
              // fontWeight: "bold",
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
                // fontWeight: "bold",
                left: 20,
                fontFamily: "Nunito-SemiBold",
                color: vars["shade-grey"],
                textAlign: "left",
                paddingTop: 10,
              }}
            >
              You will receive an sms to your mobile device. Please enter this
              code below.
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
      <SwipableBottomSheet
        rbSheetRef={refRBSheetSuccess}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={420}
        wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
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
    paddingTop: 10,
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
});
