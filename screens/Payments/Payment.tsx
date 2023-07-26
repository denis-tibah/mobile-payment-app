import { View, ScrollView,Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
// import { Checkbox } from "react-native-paper";
// import CheckBox from '@react-native-community/checkbox'; commented this 3 lines for now. currently testing ---
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';

import Heading from "../../components/Heading";
import { MainLayout } from "../../layout/Main/Main";
import FormGroup from "../../components/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import Button from "../../components/Button";
import { styles } from "./styles";
import { Formik } from "formik";
import EuroIcon from "../../assets/icons/Euro";
import TransactionIcon from "../../assets/icons/Transaction";
import CodeIcon from "../../assets/icons/Code";
import DocumentIcon from "../../assets/icons/Document";
import ProfileIcon from "../../assets/icons/Profile";
import { useDispatch, useSelector } from "react-redux";
import { getCurrency } from "../../utils/helpers";
import { useEffect, useState } from "react";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import {
  initiatePayment,
  processPayment,
  sendSmsPaymentVerification,
  setInitiatePaymentData,
} from "../../redux/payment/paymentSlice";

import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { delayCode } from "../../utils/delay";
import {
  addNewBeneficiary,
  getAllBeneficiary,
} from "../../redux/beneficiary/beneficiarySlice";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { RootState } from "../../store";
import { getTransactions } from "../../redux/transaction/transactionSlice";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { SearchFilter, UserData } from "../../models/UserData";
import { Text } from "react-native-paper";
import { validationPaymentSchema } from "../../utils/validation";
import { formatCurrencyToLocalEn } from "../../utils/helpers";
import PaymentsIcon from "../../assets/icons/PaymentsIcon";
import { screenNames } from "../../utils/helpers";

export function Payment({ navigation }: any) {
  const infoData = useSelector((state: any) => state.account.details);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch();
  const beneficiaryList = useSelector((state: any) => state?.beneficiary?.data);
  const accountData = useSelector(
    (state: any) => state?.account?.details?.info
  );
  const [isOtpValid, setIsOtpValid] = useState(false);

  const [displayModal, setDisplayModal] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [beneficiaryOptions, setBeneficiaryOptions] = useState<any>([]);
  const {
    transactionId,
    debtor_iban,
    creditor_iban,
    amount,
    currency,
    reason,
    remarks,
    account,
    recipientFirstname,
    recipientLastname,
    bic,
    savePayee,
    type,
  } = useSelector((state: any) => state.payment.initiatePaymentData);

  const loading = useSelector((state: any) => state.beneficiary.loading);

  const [isExternalPayment, setIsExternalPayment] = useState(false);
  const [externalPayment, setExternalPayment] = useState('');
  const { navigate }: any = useNavigation();

  useEffect(() => {
    if (!beneficiaryList.length) {
      fetchAllPayees();
    }
    setBeneficiaryOptions([
      ...beneficiaryList.map((beneficiary: any) => ({
        label: beneficiary.name,
        value: beneficiary.uuid,
      })),
      { label: "Add New", value: null },
    ]);
  }, [beneficiaryList]);

  function handleDisplayModal() {
    setDisplayModal(!displayModal);
  }

  const fetchAllPayees = async () => {
    try {
      await dispatch<any>(getAllBeneficiary());
    } catch (error) {
      console.log({ error });
    }
  };

  function getFirstAndLastName(str: string) {
    const firstSpace = str.indexOf(" ");
    return {
      firstname: str.slice(0, firstSpace),
      lastname: str.slice(firstSpace + 1),
    };
  }

  const handleSelectPayee = (item: any, values: any, setValues: any) => {
    if (!item) {
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

  const fetchTransactions = async () => {
    try {
      // const {account_id, sort, direction, status}: UserData = userData!;
      const { id }: UserData = userData!;
      const sort = "id";
      const direction = "desc";
      const status = "PROCESSING";

      // console.log('get latest transactions account_id, sort, direction, status ',id, ' ', sort, ' ', direction, ' ', status);
      // console.log('get latest transactions',userData);

      if (id && sort && direction && status) {
        const searchFilter: SearchFilter = {
          // account_id: account_id,
          // sort:       sort,
          // direction:  direction,
          // status:     status
          account_id: id,
          sort: sort,
          direction: direction,
          status: status,
        };
        await dispatch<any>(getTransactions(searchFilter));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  function gotoLimitsPage() {
    // console.log('go to limist page');
    navigation.navigate("profile", {
      screen: 'Limits',
    });
  }

    //Enable or Disable if its external payment
  function toggleExternalPayment(value: boolean) {

    setIsExternalPayment(value);
    // console.log(value,externalPayment);
  }

  useEffect(() => {
    if (isExternalPayment) {
      setExternalPayment('SEPACT');
    } else {
      setExternalPayment('null');
    }
  }, [isExternalPayment]);


  const handleSubmitOTP = async ({ code }: { code: string }) => {
    await handleProccessPayment({ code });
    setDisplayModal(false);
    await delayCode(1000);
    setPaymentSuccessful(true);
    await fetchTransactions();
  };

  const handleProccessPayment = async ({ code }: { code: string }) => {
    if (isOtpValid) {
      await dispatch(
        processPayment({
          identifier: transactionId,
          code: code,
          debtor_iban,
          creditor_iban,
          amount: amount.toString(),
          currency,
          remarks: `${reason}, ${remarks}`,
          account,
          type:  externalPayment,
        }) as any
      )
        .unwrap()
        .then((payload: any) => {
          if (payload) {
            if (payload.code === 200) {
              // if the user chose to save as a beneficiary
              if (savePayee) {
                dispatch(
                  addNewBeneficiary({
                    beneficiary_name: `${recipientFirstname} ${recipientLastname}`,
                    beneficiary_iban: creditor_iban,
                    bic: bic,
                  }) as any
                );
              }
            }
          }
        });
    }
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={loading} />
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<EuroIcon color="pink" size={25} />}
            title="Payment"
            rightAction={
              <Button color="black-only" withLine={true}>
                Save this payee
                {/* <CheckBox /> */}
                {/* <CheckBoxOutlineBlankIcon /> */}
              </Button>
            }
          />
        </View>
        <Formik
          validationSchema={validationPaymentSchema}
          initialValues={{
            recipientname: "",
            recipientFirstname: "",
            recipientLastname: "",
            creditor_iban: "",
            bic: "",
            balance: infoData?.avlbal || 0,
            // balance: infoData?.curbal || 0,
            amount: 0,
            currency: "EUR",
            reason: "",
          }}
          onSubmit={(values) => {
            // console.log('initiate payment type ',externalPayment);
            dispatch(
              initiatePayment({
                recipientFirstname: getFirstAndLastName(values.recipientname)
                  .firstname,
                recipientLastname: getFirstAndLastName(values.recipientname)
                  .lastname,
                debtor_iban: accountData?.iban,
                creditor_iban: values.creditor_iban,
                bic: values.bic,
                account: accountData?.account_number,
                amount: values.amount,
                currency: "EUR",
                reason: values.reason,
                type: externalPayment
              }) as any
            )
              .unwrap()
              .then((payload: any) => {
                if (payload) {
                  if (payload.transaction_id) {
                    dispatch(
                      setInitiatePaymentData({
                        recipientFirstname: getFirstAndLastName(
                          values.recipientname
                        ).firstname,
                        recipientLastname: getFirstAndLastName(
                          values.recipientname
                        ).lastname,
                        debtor_iban: accountData?.iban,
                        creditor_iban: values.creditor_iban,
                        bic: values.bic,
                        account: accountData?.account_number,
                        amount: values.amount,
                        currency: "EUR",
                        reason: values.reason,
                        transactionId: payload.transaction_id,
                        savePayee,
                        type:  externalPayment,
                      })
                    );
                    dispatch(
                      sendSmsPaymentVerification({
                        identifier: payload.transaction_id,
                        type: "transfer",
                        amount: values.amount,
                        currency: values.currency,
                      }) as any
                    )
                      .unwrap()
                      .then((payload: any) => {
                        if (payload) setIsOtpValid(true);
                      });
                    handleDisplayModal();
                  }
                }
              })
              .catch((error: any) => {
                console.error(error);
              });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setValues,
          }) => (
            <View style={styles.content}>
              {displayModal && !paymentSuccessful && (
                <CodeModal
                  title={"Verify your payment"}
                  subtitle={
                    "You will receive an sms to your mobile device. Please enter this code below."
                  }
                  isOpen
                  onSubmit={handleSubmitOTP}
                  onCancel={() => setDisplayModal(false)}
                />
              )}
              {paymentSuccessful && !displayModal && (
                <SuccessModal
                  title={"Payment Successful"}
                  text={"Your payment was successful"}
                  isOpen
                  onClose={() => setPaymentSuccessful(false)}
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
              {/* <View>
                <FormGroup validationError={errors.recipientname}>
                  <FormGroup.Input
                    editable={!selectedPayee}
                    name="recipientname"
                    onChangeText={handleChange("recipientname")}
                    onBlur={handleBlur("recipientname")}
                    value={values.recipientname}
                    icon={<ProfileIcon />}
                    placeholder="Payee name"
                  />
                </FormGroup>
              </View> */}
              <View>
                <FormGroup validationError={errors.amount}>
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
                <FormGroup validationError={errors.creditor_iban}>
                  <FormGroup.Input
                    name="creditor_iban"
                    editable={!selectedPayee}
                    onChangeText={handleChange("creditor_iban")}
                    onBlur={handleBlur("creditor_iban")}
                    value={values.creditor_iban}
                    placeholder="IBAN"
                    icon={<CodeIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup validationError={errors.bic}>
                  <FormGroup.Input
                    name="bic"
                    editable={!selectedPayee}
                    onChangeText={handleChange("bic")}
                    onBlur={handleBlur("bic")}
                    value={values.bic}
                    placeholder="BIC"
                    icon={<CodeIcon />}
                  />
                </FormGroup>
                <Seperator
                  marginBottom={18}
                  backgroundColor={vars["light-grey"]}
                />
              </View>
              <View>
                <FormGroup validationError={errors.reason}>
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
              <View style={styles.externalPayment__switch}>
                    <View style={styles.externalPayment__switch__text}>
                      <PaymentsIcon  color="blue" size={18} />
                      <Text>External Payment Y/N</Text>
                    </View>
                    <View style={{ marginLeft: "auto" }}>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isExternalPayment ? "white" : vars["light-blue"]}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(e) => toggleExternalPayment(e)}
                        value={isExternalPayment}
                      />
                  </View>
               </View>

              <View style={{ display: "flex", flexDirection: "row" }}>
                <Button color="blue-only" withLine={true}  onPress={gotoLimitsPage} >
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
          )}
        </Formik>
      </ScrollView>
    </MainLayout>
  );
}
