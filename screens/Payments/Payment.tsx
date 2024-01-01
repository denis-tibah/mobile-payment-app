import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useDebounce } from "usehooks-ts";
import DropDownPicker from "react-native-dropdown-picker";
import { Text } from "react-native-paper";
import CheckBox from "expo-checkbox";

import Heading from "../../components/Heading";
import { MainLayout } from "../../layout/Main/Main";
import FormGroup from "../../components/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import Button from "../../components/Button";
import { styles } from "./styles";
import { useFormik } from "formik";
import EuroIcon from "../../assets/icons/Euro";
import TransactionIcon from "../../assets/icons/Transaction";
import CodeIcon from "../../assets/icons/Code";
import ProfileIcon from "../../assets/icons/Profile";
import { getCurrency } from "../../utils/helpers";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import {
  initiatePayment,
  processPayment,
  sendSmsPaymentVerification,
  setInitiatePaymentData,
  ibanCheck,
} from "../../redux/payment/paymentSlice";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import {
  addNewBeneficiary,
  getAllBeneficiary,
} from "../../redux/beneficiary/beneficiarySlice";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { validationPaymentSchema } from "../../utils/validation";
import { formatCurrencyToLocalEn } from "../../utils/helpers";

export function Payment({ navigation }: any) {
  const dispatch = useDispatch();

  const infoData = useSelector((state: any) => state.account.details);
  const validationSchema = validationPaymentSchema(infoData?.avlbal || 0);
  const beneficiaryList = useSelector((state: any) => state?.beneficiary?.data);
  const accountData = useSelector(
    (state: any) => state?.account?.details?.info
  );

  const [isOtpValid, setIsOtpValid] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [beneficiaryOptions, setBeneficiaryOptions] = useState<any>([]);
  const [toggledSavePayee, setToggledSavePayee] = useState<boolean>(false);
  const [isAddNewPayee, setIsAddNewPayee] = useState<boolean>(false);
  const [beneficiaryIban, setBeneficiaryIban] = useState("");

  const debouncedBeneficiaryIban = useDebounce<string>(beneficiaryIban, 2000);

  const {
    transactionId,
    debtor_iban,
    creditor_iban,
    amount,
    currency,
    reason,
    account,
    recipientFirstname,
    recipientLastname,
    bic,
    savePayee,
  } = useSelector((state: any) => state.payment.initiatePaymentData);

  const loading = useSelector((state: any) => state.beneficiary.loading);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExternalPayment, setIsExternalPayment] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>({});
  const paymentContentDefault = {
    title: "Payment Failed",
    text: "Your payment was not successful",
    isError: true,
  };
  const [paymentModalContent, setPaymentModalContent] = useState<{
    title: string;
    text: string;
    isError: boolean;
  }>(paymentContentDefault);
  const [externalPayment, setExternalPayment] = useState("");
  const [displayOTPModal, setDisplayOTPModal] = useState<boolean>(false);

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
    validationSchema: validationSchema,
    validateOnChange: true,
    initialValues: {
      recipientname: "",
      recipientFirstname: "",
      recipientLastname: "",
      creditor_iban: "",
      bic: "",
      balance: infoData?.avlbal || 0,
      amount: 0,
      currency: "EUR",
      reason: "",
    },
    onSubmit: (values) => {
      setIsLoading(true);

      dispatch(
        initiatePayment({
          recipientFirstname: getFirstAndLastName(values.recipientname)
            .firstname,
          recipientLastname: getFirstAndLastName(values.recipientname).lastname,
          debtor_iban: accountData?.iban,
          creditor_iban: values.creditor_iban,
          creditor_name: values.recipientname,
          bic: values.bic,
          account: accountData?.account_number,
          amount: values.amount,
          currency: "EUR",
          reason: values.reason,
          type: externalPayment,
        }) as any
      )
        .unwrap()
        .then((payload: { transaction_id: string }) => {
          if (payload.transaction_id) {
            dispatch(
              setInitiatePaymentData({
                recipientFirstname: getFirstAndLastName(values.recipientname)
                  .firstname,
                recipientLastname: getFirstAndLastName(values.recipientname)
                  .lastname,
                debtor_iban: accountData?.iban,
                creditor_iban: values.creditor_iban,
                creditor_name: values.recipientname,
                bic: values.bic,
                account: accountData?.account_number,
                amount: values.amount,
                currency: "EUR",
                reason: values.reason,
                transactionId: payload.transaction_id,
                savePayee,
                type: externalPayment,
              })
            );
            let _paymentRequest = {
              identifier: payload.transaction_id,
              type: "transfer",
              amount: values.amount,
              currency: values.currency,
            };
            setPaymentRequest(_paymentRequest);
            dispatch(sendSmsPaymentVerification(_paymentRequest) as any)
              .unwrap()
              .then((payload: { message: string; status: string }) => {
                const { status } = payload;
                if (status === "success") {
                  setIsOtpValid(true);
                  setDisplayOTPModal(true);
                }
              })
              .catch((error: any) => {
                console.error(error);
                setIsOtpValid(false);
              });
          }
        })
        .catch((error: any) => {
          console.error(error);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });
  const fetchBicDetails = async (iban?: string) => {
    setIsLoading(true);
    try {
      let search: any = {
        creditor_iban: `${iban}`,
      };
      const payload = await dispatch<any>(ibanCheck(search));
      console.log(
        "🚀 ~ file: Payment.tsx:201 ~ fetchBicDetails ~ payload:",
        payload
      );
      if (payload) {
        if (
          (payload?.payload?.result === 200 ||
            payload?.payload?.result === "200") &&
          payload?.payload?.data?.bank?.bic
        ) {
          setIsLoading(false);
          setFieldValue("bic", payload?.payload?.data?.bank?.bic);
        } else {
          setFieldValue("bic", "");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedBeneficiaryIban && debouncedBeneficiaryIban.length) {
      fetchBicDetails(debouncedBeneficiaryIban);
    }
  }, [debouncedBeneficiaryIban]);

  useEffect(() => {
    if (!beneficiaryList?.length) {
      fetchAllPayees();
    }
    setBeneficiaryOptions([
      ...beneficiaryList.map((beneficiary: any) => ({
        label: beneficiary.name,
        value: beneficiary.uuid,
      })),
      { label: "Add New", value: "none" },
    ]);
  }, [beneficiaryList?.length]);

  const fetchAllPayees = async () => {
    try {
      await dispatch<any>(getAllBeneficiary());
    } catch (error) {
      console.log({ error });
    }
  };

  function getFirstAndLastName(str: string) {
    const firstSpace = str.indexOf(" ");
    let data = str.slice(firstSpace + 1);
    data.slice(0, data?.indexOf(" "));
    return {
      firstname: str.slice(0, firstSpace),
      lastname: str.slice(firstSpace + 1),
    };
  }

  const handleResendSMSVerificationCode = () => {
    setIsLoading(true);
    dispatch(sendSmsPaymentVerification(paymentRequest) as any)
      .unwrap()
      .then((payload: { message: string; status: string }) => {
        const { status } = payload;
        if (status === "success") {
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.error(error);
        setIsOtpValid(false);
      });
  };

  const handleSelectPayee = (item: any, values: any, setValues: any) => {
    if (item === "none") {
      setIsAddNewPayee(true);
    } else {
      setIsAddNewPayee(false);
    }
    if (item === "none" || !item) {
      setValues({
        ...values,
        recipientname: "",
        bic: "",
        creditor_iban: "",
      });
      return;
    }
    const beneficiarySelected = beneficiaryList.find(
      (beneficiary: any) => beneficiary.uuid === item
    );
    setValues({
      ...values,
      recipientname: beneficiarySelected.name,
      bic: beneficiarySelected.bic,
      creditor_iban: beneficiarySelected?.iban,
    });
  };

  function gotoLimitsPage() {
    navigation.navigate("profile", {
      screen: "Limits",
    });
  }

  //Enable or Disable if its external payment
  function toggleExternalPayment(value: boolean) {
    setIsExternalPayment(value);
  }

  useEffect(() => {
    if (isExternalPayment) {
      setExternalPayment("SEPACT");
    } else {
      setExternalPayment("");
    }
  }, [isExternalPayment]);

  const handleProccessPayment = async ({ code }: { code: string }) => {
    if (!isOtpValid) {
      return;
    }
    if (isOtpValid) {
      setIsLoading(true);
      console.log(
        "*****creditor_name:***********",
        recipientFirstname + " " + recipientLastname
      );
      await dispatch(
        processPayment({
          identifier: transactionId,
          code: code,
          debtor_iban,
          creditor_iban,
          creditor_name: recipientFirstname + " " + recipientLastname,
          amount: amount.toString(),
          currency,
          // remarks: `${reason}, ${remarks}`,
          remarks: `${reason}`,
          account,
          type: externalPayment,
        }) as any
      )
        .unwrap()
        .then((payload: any) => {
          if (payload.code === 200) {
            setPaymentModalContent({
              title: "Payment Successful",
              text: "Your payment was successful",
              isError: false,
            });
            // if the user chose to save as a beneficiary
            if (toggledSavePayee) {
              dispatch(
                addNewBeneficiary({
                  beneficiary_name: `${recipientFirstname} ${recipientLastname}`,
                  beneficiary_iban: creditor_iban,
                  beneficiary_bic: bic,
                }) as any
              );
            }
            setDisplayOTPModal(false);
          }
        })
        .catch((error: any) => {
          console.error(error);
          setPaymentModalContent({
            title: "Payment Failed",
            text: "Your payment was not successful. OTP is invalid.",
            isError: true,
          });
        })
        .finally(() => {
          setShowPaymentStatusModal(true);
          setIsLoading(false);
        });
    }
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={loading || isLoading} />
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<EuroIcon color="pink" size={25} />}
            title="Payment"
            rightAction={
              <View style={{ flexDirection: "row", display: "flex" }}>
                <Text style={{ paddingRight: 8 }}>Save this payee</Text>
                <CheckBox
                  disabled={false}
                  value={toggledSavePayee}
                  onValueChange={() =>
                    toggledSavePayee
                      ? setToggledSavePayee(false)
                      : setToggledSavePayee(true)
                  }
                  style={styles.checkboxSavePayee}
                />
              </View>
            }
          />
        </View>
        <View style={styles.content}>
          {displayOTPModal && (
            <CodeModal
              title={"Verify your payment"}
              subtitle={
                "You will receive an sms to your mobile device. Please enter this code below."
              }
              isOpen
              onSubmit={handleProccessPayment}
              handleResendSMSVerificationCode={handleResendSMSVerificationCode}
              onCancel={() => setDisplayOTPModal(false)}
            />
          )}
          {showPaymentStatusModal && (
            <SuccessModal
              isError={paymentModalContent.isError}
              title={paymentModalContent.title}
              text={paymentModalContent.text}
              isOpen
              onClose={() => setShowPaymentStatusModal(false)}
            />
          )}
          <View style={{ zIndex: 1 }}>
            <DropDownPicker
              placeholder="Payee name"
              style={styles.dropdown}
              open={open}
              value={selectedPayee}
              items={beneficiaryOptions}
              setOpen={setOpen}
              setValue={setSelectedPayee}
              onChangeValue={(v) => handleSelectPayee(v, values, setValues)}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={100}
            />
            <Seperator
              backgroundColor={vars["light-grey"]}
              marginBottom={18}
              zIndex={-1}
            />
          </View>
          {isAddNewPayee && (
            <View>
              <FormGroup
                validationError={
                  touched.recipientname ? errors.recipientname : null
                }
              >
                <FormGroup.Input
                  name="recipientname"
                  onChangeText={handleChange("recipientname")}
                  onBlur={handleBlur("recipientname")}
                  value={values.recipientname}
                  icon={<ProfileIcon />}
                  placeholder="Payee name"
                />
              </FormGroup>
            </View>
          )}
          <View>
            <FormGroup validationError={touched.amount ? errors.amount : null}>
              <FormGroup.Input
                onChangeText={handleChange("amount")}
                name="amount"
                onBlur={handleBlur("amount")}
                value={values.amount}
                type="number"
                keyboardType="numeric"
                placeholder="Amount to send"
                icon={<EuroIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ color: "#808080", lineHeight: 36 }}>
                  {" "}
                  Available balance:{" "}
                </Text>
                <FormGroup.Input
                  editable={false}
                  value={`${getCurrency(infoData?.currency)} ${
                    (formatCurrencyToLocalEn(infoData?.avlbal) || 0)
                      // (Number(infoData?.curbal) || 0)
                      .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || 0
                  }`}
                  def
                  icon={<EuroIcon />}
                />
              </View>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                touched.creditor_iban ? errors.creditor_iban : null
              }
            >
              <FormGroup.Input
                name="creditor_iban"
                editable={!selectedPayee || isAddNewPayee}
                /* onChangeText={handleChange("creditor_iban")} */
                onChangeText={(value: string) => {
                  setBeneficiaryIban(value);
                  setFieldValue("creditor_iban", value);
                }}
                onBlur={handleBlur("creditor_iban")}
                value={values.creditor_iban}
                placeholder="IBAN"
                icon={<CodeIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup validationError={touched.bic ? errors.bic : null}>
              <FormGroup.Input
                name="bic"
                editable={!selectedPayee || isAddNewPayee}
                onChangeText={handleChange("bic")}
                onBlur={handleBlur("bic")}
                value={values.bic}
                placeholder="BIC"
                icon={<CodeIcon />}
              />
            </FormGroup>
            <Seperator marginBottom={18} backgroundColor={vars["light-grey"]} />
          </View>
          <View>
            <FormGroup validationError={touched.reason ? errors.reason : null}>
              <FormGroup.Input
                name="reason"
                onChangeText={handleChange("reason")}
                onBlur={handleBlur("reason")}
                value={values.reason}
                placeholder="Reference"
                icon={<CodeIcon />}
              />
            </FormGroup>
          </View>

          {/* start: date:03-08-23: temp disabled by Aristos */}

          {/* <View style={styles.externalPayment__switch}>
                <View style={styles.externalPayment__switch__text}>
                  <PaymentsIcon color="blue" size={18} />
                  <Text>External Payment Y/N</Text>
                </View>
                <View style={{ marginLeft: "auto" }}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      isExternalPayment ? "white" : vars["light-blue"]
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(e) => toggleExternalPayment(e)}
                    value={isExternalPayment}
                  />
                </View>
              </View> */}
          {/* end: date:03-08-23: temp disabled by Aristos */}

          <View style={{ display: "flex", flexDirection: "row" }}>
            <Button color="blue-only" withLine={true} onPress={gotoLimitsPage}>
              VIEW CURRENT LIMIT
            </Button>
          </View>
          <FixedBottomAction>
            <Button
              onPress={handleSubmit}
              color="light-pink"
              leftIcon={<TransactionIcon color="pink" size={16} />}
            >
              Submit payment
            </Button>
          </FixedBottomAction>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
