import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Euro from "../../assets/icons/Euro";
import CheckBox from "expo-checkbox";
import { useFormik } from "formik";
import MainLayout from "../../layout/Main";
import { screenNames } from "../../utils/helpers";
import ArrowLeftLine from "../../assets/icons/ArrowLeftLine";
import vars from "../../styles/vars";
import { Divider } from "react-native-paper";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { RootState } from "../../store";
import StatementsIcon from "../../assets/icons/StatementsIcon";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useRef, useState } from "react";
import { validationPaymentSchema } from "../../utils/validation";
import { useInitiatePaymentMutation, useProcessPaymentMutation, useSmsRequestVerificationMutation } from "../../redux/payee/payeeSlice";
import BottomSheet from "../../components/BottomSheet";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Image } from "react-native";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import CloudMessage from "../../assets/icons/CloudMessage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { PinCodeInputBoxes } from "../../components/FormGroup/FormGroup";

const currencyOptions = [
  { label: "EUR", value: "EUR" },
  { label: "USD", value: "USD" },
];

const PayeeSendFunds = ({navigation, route}: any) => {
  const { params }: any = route || { params: {} };
  const accountData = useSelector(
    (state: any) => state?.account?.details
  );
  const refRBSheetCodeOTP = useRef();
  const refRBSheetSuccess = useRef();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const accountIban = userData?.iban || '';
  const accountName = `${userData?.first_name} ${userData?.last_name}` || '';
  const receiverName: string = params?.item.name || '';
  const receiverIban: string = params?.item.iban || '';
  const windowHeight = Dimensions.get('window').height;

  const [initiatePayment] = useInitiatePaymentMutation();
  const [smsRequestVerification] = useSmsRequestVerificationMutation();
  const [processPayment] = useProcessPaymentMutation();
  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });
  const accountBalance = userAccountInformation?.data?.avlbal || 0;
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isDropDownCurrencyOpen, setIsDropDownCurrencyOpen] = useState<boolean>(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [base64File, setBase64File] = useState<string>("");
  const [isPaymentResultBottomSheetOpen, setIsPaymentResultBottomSheetOpen] = useState<boolean>(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
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

  const handleProcessPayment = async ({code}: {code: string}) => {
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
      remarks: smsPaymentRequest?.remarks,
      access_token: userTokens?.access_token,
      token_ziyl: userTokens?.token_ziyl,
    })
    .unwrap()
    .then((res) => {
      const { status } = res;
      if(status === 'success') {
        refRBSheetCodeOTP?.current.close();
        refRBSheetSuccess?.current?.open();
        setIsPaymentSuccessful(true);
      }
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
  }

  const handleResendSMSVerificationCode = () => {
    smsRequestVerification(smsPaymentRequest);
  }

  const handleInitiatepayment = (paymentValues: any) => {
    const recipientFirstname = receiverName.split(' ')[0];
    const recipientLastname = receiverName.split(' ')[1];
    console.log({
      recipientFirstname,
      recipientLastname,
      amount: paymentValues.amount,
      currency: paymentValues.currency,
      debtor_iban: accountIban,
      creditor_iban: receiverIban,
      creditor_name: receiverName,
      reason: paymentValues.reason,
      access_token: userTokens?.access_token,
      token_ziyl: userTokens?.token_ziyl,
      ...(paymentValues.attachedFile && {attached_file: paymentValues.attachedFile}),
    });
    initiatePayment({
      recipientFirstname,
      recipientLastname,
      amount: paymentValues.amount,
      currency: paymentValues.currency,
      debtor_iban: accountIban,
      creditor_iban: receiverIban,
      creditor_name: receiverName,
      reason: paymentValues.reason,
      access_token: userTokens?.access_token,
      token_ziyl: userTokens?.token_ziyl,
      ...(paymentValues.attachedFile && {attached_file: paymentValues.attachedFile}),
    })
    .unwrap()
    .then((res) => {
      let paymentRequest = {
        identifier: res.transaction_id,
        type: 'transfer',
        amount: paymentValues.amount,
        currency: paymentValues.currency,
      }
      console.log('res', res);
      setIsLoading(false);
      setSmsPaymentRequest({
        ...res,
        ...paymentRequest,
        token_ziyl: userTokens?.token_ziyl,
        access_token: userTokens?.access_token,
      });
      smsRequestVerification({
        ...paymentRequest,
        token_ziyl: userTokens?.token_ziyl,
        access_token: userTokens?.access_token
      })
      .unwrap()
      .then((res) => {
        const { status } = res;
        if(status === 'success') {
          refRBSheetCodeOTP?.current.open();
        }
      })
      .catch((err) => {
        console.log("Error2: ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }).
    catch((err) => {
      console.log("Error1: ", err);
      setIsLoading(false);
    });
  }

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
      amount: '',
      currency: 'EUR',
      purpose: '',
      isManualProcessing: false,
      reason: '',
    },
    onSubmit: (values: any) => {
      setIsLoading(true);
      handleInitiatepayment(values);
    },
    validationSchema: validationSchema,
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (result.type === 'success') {
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
      console.error('Error picking document:', err);
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
        <KeyboardAwareScrollView style={{height: '100%', backgroundColor: 'white'}}>
          <View>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.headerLeftIcon}
                  onPress={() => navigation.navigate(screenNames.payments)}
                >
                  <ArrowLeftLine size={14} color='blue'/>
                </TouchableOpacity>
                <View>
                  <Text style={{fontSize: 14}}>{receiverName}</Text>
                  <Text style={{fontSize: 12, color: vars['shade-grey']}}>{receiverIban}</Text>
                </View>
              </View>
              <View>
                <Text>Your Balance</Text>
                <Text style={{fontSize: 12, color: vars['shade-grey']}}>€ {accountBalance}</Text>
              </View>
            </View>
            <View style={{paddingVertical: 15, backgroundColor: '#fff'}}>
              <Divider style={{marginBottom: 25}}/>
              <FormGroup
                validationError={
                  errors.amount && touched.amount && errors.amount
                }
              >
                <FormGroup.Input
                  keyboardType="text"
                  name="amount"
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  value={values.amount}
                  placeholderTextColor={vars["ios-default-text"]}
                  placeholder="Amount to send"
                  iconColor="blue"
                  style={{height: 52}}
                  icon={<Euro size={22} />}
                />
              </FormGroup>
              <FormGroup
                validationError={
                  errors.reason && touched.reason && errors.reason
                }
              >
                <FormGroup.Input
                  keyboardType="text"
                  name="reason"
                  onChangeText={handleChange("reason")}
                  onBlur={handleBlur("reason")}
                  value={values.reason}
                  placeholderTextColor={vars["ios-default-text"]}
                  placeholder="Reference"
                  iconColor="blue"
                  style={{height: 52}}
                  icon={<CloudMessage />}
                />
              </FormGroup>
            <Divider style={{marginVertical: 15}}/>
            {/* purpose of your transfer input */}
            <Text style={{fontSize: 12, color: vars['accent-grey'], alignSelf: 'center'}}>Please provide supporting information for all transfers above $5,000</Text>
            <Divider style={{marginVertical: 15}}/>
            <FormGroup
              validationError={
                errors.purpose && touched.purpose && errors.purpose
              }
            >
              <FormGroup.TextArea
                keyboardType="default"
                name="purpose"
                returnKeyType={"done"}
                onChangeText={handleChange("purpose")}
                onBlur={handleBlur("purpose")}
                value={values.postcode}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Purpose of your transfer"
                iconColor="blue"
                editable={values.reason === "N/A" ? false : true}
                icon={<StatementsIcon size={16} />}
              />
              </FormGroup>
              <View style={{paddingHorizontal: 16}}>
                <TouchableOpacity onPress={pickDocument} style={{display: 'flex', flexDirection: 'row'}}>
                  <AntDesign name="pluscircleo" size={42} color={vars['accent-blue']} />
                  <Text style={{color: vars['shade-grey'], top: 10, paddingLeft: 15}}>Attach a file</Text>
                </TouchableOpacity>
              </View>
              <Divider style={{marginVertical: 15}}/>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <FormGroup>
                  <FormGroup.CheckboxUI
                    label="For manual processing outside my limits"
                    value={values?.isManualProcessing}
                    color={
                      values?.isManualProcessing
                        ? vars["accent-blue"]
                        : undefined
                    }
                    onValueChange={() => {
                      setFieldValue(
                        "isManualProcessing",
                        !values?.isManualProcessing
                      );
                    }}
                  />
                </FormGroup>
                <Text style={{backgroundColor: vars['shade-grey']}}>{` `}</Text>
              </View>
            </View>
            <View style={{ bottom: windowHeight * .01 - 10, width: '100%'}}>
              <Button
                onPress={handleSubmit}
                color="light-pink"
                style={{width: '80%', alignSelf: 'center'}}
                leftIcon={<AntDesign name="checkcircleo" size={16} color={vars['accent-pink']} />}
              >
                Send
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <BottomSheet
          isVisible={isPaymentResultBottomSheetOpen}
          onClose={() => setIsPaymentResultBottomSheetOpen(false)}
          headerResponse={{
            isShown: true,
            isSuccessful: isPaymentSuccessful,
            message: isPaymentSuccessful ? 'Payment Successful' : 'Payment Failed',
          }}
        >
          { isPaymentSuccessful ? (
            <>
              <Text style={styles.textConfirmation}>Your payment has been verified.</Text>
              <Text style={styles.textConfirmation}>Check your notifications and transaction page.</Text>
              <Image
                source={require('../../assets/images/verified.png')}
                style={styles.imageContainer}
              />
            </>
          ) : (
            <>
              <Text style={styles.textConfirmation}>Your payment failed to verify.</Text>
              <Text style={styles.textConfirmation}>Check your notifications and transaction page.</Text>
              <Image
                source={require('../../assets/images/failed.png')}
                style={styles.imageContainer}
              />
            </>
          )}
        </BottomSheet> */}
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
        draggableIconStyles={{ backgroundColor: "#FFF", width: 90 }}
      >
        <View style={styles.container}>
          <Text style={{
            fontSize: 18,
            // fontWeight: "bold",
            left: 20,
            fontFamily: "Nunito",
            color: "#000",
            textAlign:'left',
            paddingTop: 20,
          }}>
            Verify your payment
          </Text>
          <Text style={{
              fontSize: 14,
              // fontWeight: "bold",
              left: 20,
              fontFamily: "Nunito",
              color: vars["shade-grey"],
              textAlign:'left',
              paddingTop: 20,
            }}>
            Please enter the 6-digit code sent to your mobile number.
          </Text>
          <Divider style={{marginVertical: 25}}/>
          <View style={{alignItems: 'center', paddingHorizontal: 32}}>
            <PinCodeInputBoxes fieldCount={6} onChange={handlePinCodeChange} />
              <TouchableOpacity
                onPress={_handleResendSMSVerificationCode}
                disabled={isTimeToCountDown}
              >
                {isTimeToCountDown ? (
                  <Text style={styles.noCodeResend}>
                    Wait for {timeRemaining}s to request again.
                  </Text>
                ) : (
                  <Text style={styles.noCodeResend}>Did not get a verification code?</Text>
                )}
              <Button
                onPress={() => {
                  setIsLoading(true);
                  handleProcessPayment({code});
                }}
                color="light-pink"
                style={{width: '100%', alignSelf: 'center'}}
                leftIcon={<AntDesign name="checkcircleo" size={16} color={vars['accent-pink']} />}
              >
                Confirm
              </Button>
            </TouchableOpacity>
          </View>
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
        draggableIconStyles={{ backgroundColor: "#FFF", width: 90 }}
      >
      <View style={{
        width: '30%',
          alignSelf:'center',
          backgroundColor: vars['grey'],
          height: 5,
          borderRadius: 10, 
          zIndex: 999, 
          marginBottom: 20, 
          top: 0
      }}></View>
      <View style={{
            borderColor: isPaymentSuccessful ? vars["accent-green"] : vars["heavy-red"],
            borderTopWidth: 60
          }}>
        <Text style={{color: 'white', alignSelf: 'center', top: -45, fontSize: 18}}>
            {isPaymentSuccessful ? 'Payment Successful' : 'Payment Failed'}
        </Text>
      </View>
      { isPaymentSuccessful ? (
          <>
            <Text style={styles.textConfirmation}>Your payment has been verified.</Text>
            <Text style={styles.textConfirmation}>Check your notifications and transaction page.</Text>
            <Image
              source={require('../../assets/images/verified.png')}
              style={styles.imageContainer}
            />
          </>
        ) : (
          <>
            <Text style={styles.textConfirmation}>Your payment failed to verify.</Text>
            <Text style={styles.textConfirmation}>Check your notifications and transaction page.</Text>
            <Image
              source={require('../../assets/images/failed.png')}
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
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
  },
  headerLeftIcon: {
    height: 35,
    width: 35,
    borderRadius: 20,
    margin: 7,
    backgroundColor: "#F5F9FF",
    padding: 10,
  },
  dropdown: {
    width: "93%",
    height: 52,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: vars['accent-blue'],
    borderWidth: 1,
    borderRadius: 40,
  },
  dropdownContainer: {
    width: "93%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderColor: '#fff',
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
    alignSelf: 'center', 
    resizeMode: 'contain',
    marginTop: 20,
    right: -45
  },
  noCodeResend: {
    color: vars["accent-pink"],
    fontSize: 12,
    fontWeight: "400",
    marginTop: 12,
    textAlign: 'center',
    paddingBottom: 40,
  },
});
