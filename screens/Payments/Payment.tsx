import React, { Fragment, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useDebounce } from "usehooks-ts";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Text, Drawer } from "react-native-paper";
import CheckBox from "expo-checkbox";
import { AntDesign } from '@expo/vector-icons';
import Search from "../../assets/icons/Search";
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
import { formatDateDayMonthYear, getCurrency, getNameInitials } from "../../utils/helpers";
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
import ArrowDown from "../../assets/icons/ArrowDown";
import ArrowRight from "../../assets/icons/ArrowRight";
import BottomSheet from "../../components/BottomSheet";
import FaceIcon from "../../assets/icons/FaceIcon";
import BuildingIcon from "../../assets/icons/Building";
import PinGPS from "../../assets/icons/PinGPS";

export function Payment({ navigation }: any) {
  const dispatch = useDispatch();
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

  const infoData = useSelector((state: any) => state.account.details);
  const validationSchema = validationPaymentSchema(infoData?.avlbal || 0);
  const beneficiaryList = useSelector((state: any) => state?.beneficiary?.data);
  const accountData = useSelector(
    (state: any) => state?.account?.details?.info
  );
  const [bottomSheetOpen, setBottomSheetOpen] = useState<boolean>(false);

  const toggleBottomSheet = () => {
    setBottomSheetOpen(!bottomSheetOpen);
  };

  const fetchAllPayees = async () => {
    try {
      await dispatch<any>(getAllBeneficiary());
    } catch (error) {
      console.log({ error });
    }
  };

  const { handleChange, handleBlur, values, touched, errors } = useFormik({
    initialValues: {
      name: '',
      iban: '',
      bic: '',
      address1: '',
      address2: '',
      city: '',
      postcode: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('values', values);
    }
  });

  useEffect(() => {
    if ( beneficiaryList?.length === 0) {
      fetchAllPayees();
    }
  }, [beneficiaryList?.length]);

  console.log('beneficiaryList', beneficiaryList);
  // const debouncedBeneficiaryIban = useDebounce<string>(beneficiaryIban, 2000);

  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isExternalPayment, setIsExternalPayment] = useState(false);
  // const [paymentRequest, setPaymentRequest] = useState<any>({});
  // const paymentContentDefault = {
  //   title: "Payment Failed",
  //   text: "Your payment was not successful",
  //   isError: true,
  // };
  // const [paymentModalContent, setPaymentModalContent] = useState<{
  //   title: string;
  //   text: string;
  //   isError: boolean;
  // }>(paymentContentDefault);
  // const [externalPayment, setExternalPayment] = useState("");
  // const [displayOTPModal, setDisplayOTPModal] = useState<boolean>(false);

  // const {
  //   handleSubmit,
  //   handleChange,
  //   handleBlur,
  //   values,

  //   touched,
  //   errors,
  //   setFieldValue,
  //   setValues,
  // } = useFormik({
  //   validationSchema: validationSchema,
  //   validateOnChange: true,
  //   initialValues: {
  //     recipientname: "",
  //     recipientFirstname: "",
  //     recipientLastname: "",
  //     creditor_iban: "",
  //     bic: "",
  //     balance: infoData?.avlbal || 0,
  //     amount: 0,
  //     currency: "EUR",
  //     reason: "",
  //   },
  //   onSubmit: (values) => {
  //     setIsLoading(true);

  //     dispatch(
  //       initiatePayment({
  //         recipientFirstname: getFirstAndLastName(values.recipientname)
  //           .firstname,
  //         recipientLastname: getFirstAndLastName(values.recipientname).lastname,
  //         debtor_iban: accountData?.iban,
  //         creditor_iban: values.creditor_iban,
  //         creditor_name: values.recipientname,
  //         bic: values.bic,
  //         account: accountData?.account_number,
  //         amount: values.amount,
  //         currency: "EUR",
  //         reason: values.reason,
  //         type: externalPayment,
  //       }) as any
  //     )
  //       .unwrap()
  //       .then((payload: { transaction_id: string }) => {
  //         if (payload.transaction_id) {
  //           dispatch(
  //             setInitiatePaymentData({
  //               recipientFirstname: getFirstAndLastName(values.recipientname)
  //                 .firstname,
  //               recipientLastname: getFirstAndLastName(values.recipientname)
  //                 .lastname,
  //               debtor_iban: accountData?.iban,
  //               creditor_iban: values.creditor_iban,
  //               creditor_name: values.recipientname,
  //               bic: values.bic,
  //               account: accountData?.account_number,
  //               amount: values.amount,
  //               currency: "EUR",
  //               reason: values.reason,
  //               transactionId: payload.transaction_id,
  //               savePayee,
  //               type: externalPayment,
  //             })
  //           );
  //           let _paymentRequest = {
  //             identifier: payload.transaction_id,
  //             type: "transfer",
  //             amount: values.amount,
  //             currency: values.currency,
  //           };
  //           setPaymentRequest(_paymentRequest);
  //           dispatch(sendSmsPaymentVerification(_paymentRequest) as any)
  //             .unwrap()
  //             .then((payload: { message: string; status: string }) => {
  //               const { status } = payload;
  //               if (status === "success") {
  //                 setIsOtpValid(true);
  //                 setDisplayOTPModal(true);
  //               }
  //             })
  //             .catch((error: any) => {
  //               console.error(error);
  //               setIsOtpValid(false);
  //             });
  //         }
  //       })
  //       .catch((error: any) => {
  //         console.error(error);
  //         setIsLoading(false);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   },
  // });
  // const fetchBicDetails = async (iban?: string) => {
  //   setIsLoading(true);
  //   try {
  //     let search: any = {
  //       creditor_iban: `${iban}`,
  //     };
  //     const payload = await dispatch<any>(ibanCheck(search));
  //     console.log(
  //       "🚀 ~ file: Payment.tsx:201 ~ fetchBicDetails ~ payload:",
  //       payload
  //     );
  //     if (payload) {
  //       if (
  //         (payload?.payload?.result === 200 ||
  //           payload?.payload?.result === "200") &&
  //         payload?.payload?.data?.bank?.bic
  //       ) {
  //         setIsLoading(false);
  //         setFieldValue("bic", payload?.payload?.data?.bank?.bic);
  //       } else {
  //         setFieldValue("bic", "");
  //         setIsLoading(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (debouncedBeneficiaryIban && debouncedBeneficiaryIban.length) {
  //     fetchBicDetails(debouncedBeneficiaryIban);
  //   }
  // }, [debouncedBeneficiaryIban]);

  // useEffect(() => {
  //   if (!beneficiaryList.length) {
  //     fetchAllPayees();
  //   }
  //   setBeneficiaryOptions([
  //     ...beneficiaryList.map((beneficiary: any) => ({
  //       label: beneficiary.name,
  //       value: beneficiary.uuid,
  //     })),
  //     { label: "Add New", value: "none" },
  //   ]);
  // }, [beneficiaryList?.length]);


  // function getFirstAndLastName(str: string) {
  //   const firstSpace = str.indexOf(" ");
  //   let data = str.slice(firstSpace + 1);
  //   data.slice(0, data?.indexOf(" "));
  //   return {
  //     firstname: str.slice(0, firstSpace),
  //     lastname: str.slice(firstSpace + 1),
  //   };
  // }

  // const handleResendSMSVerificationCode = () => {
  //   setIsLoading(true);
  //   dispatch(sendSmsPaymentVerification(paymentRequest) as any)
  //     .unwrap()
  //     .then((payload: { message: string; status: string }) => {
  //       const { status } = payload;
  //       if (status === "success") {
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.error(error);
  //       setIsOtpValid(false);
  //     });
  // };

  // const handleSelectPayee = (item: any, values: any, setValues: any) => {
  //   if (item === "none") {
  //     setIsAddNewPayee(true);
  //   } else {
  //     setIsAddNewPayee(false);
  //   }
  //   if (item === "none" || !item) {
  //     setValues({
  //       ...values,
  //       recipientname: "",
  //       bic: "",
  //       creditor_iban: "",
  //     });
  //     return;
  //   }
  //   const beneficiarySelected = beneficiaryList.find(
  //     (beneficiary: any) => beneficiary.uuid === item
  //   );
  //   setValues({
  //     ...values,
  //     recipientname: beneficiarySelected.name,
  //     bic: beneficiarySelected.bic,
  //     creditor_iban: beneficiarySelected?.iban,
  //   });
  // };

  // function gotoLimitsPage() {
  //   navigation.navigate("profile", {
  //     screen: "Limits",
  //   });
  // }

  // //Enable or Disable if its external payment
  // function toggleExternalPayment(value: boolean) {
  //   setIsExternalPayment(value);
  // }

  // useEffect(() => {
  //   if (isExternalPayment) {
  //     setExternalPayment("SEPACT");
  //   } else {
  //     setExternalPayment("");
  //   }
  // }, [isExternalPayment]);

  // const handleProccessPayment = async ({ code }: { code: string }) => {
  //   if (!isOtpValid) {
  //     return;
  //   }
  //   if (isOtpValid) {
  //     setIsLoading(true);
  //     console.log(
  //       "*****creditor_name:***********",
  //       recipientFirstname + " " + recipientLastname
  //     );
  //     await dispatch(
  //       processPayment({
  //         identifier: transactionId,
  //         code: code,
  //         debtor_iban,
  //         creditor_iban,
  //         creditor_name: recipientFirstname + " " + recipientLastname,
  //         amount: amount.toString(),
  //         currency,
  //         // remarks: `${reason}, ${remarks}`,
  //         remarks: `${reason}`,
  //         account,
  //         type: externalPayment,
  //       }) as any
  //     )
  //       .unwrap()
  //       .then((payload: any) => {
  //         if (payload.code === 200) {
  //           setPaymentModalContent({
  //             title: "Payment Successful",
  //             text: "Your payment was successful",
  //             isError: false,
  //           });
  //           // if the user chose to save as a beneficiary
  //           if (toggledSavePayee) {
  //             dispatch(
  //               addNewBeneficiary({
  //                 beneficiary_name: `${recipientFirstname} ${recipientLastname}`,
  //                 beneficiary_iban: creditor_iban,
  //                 beneficiary_bic: bic,
  //               }) as any
  //             );
  //           }
  //           setDisplayOTPModal(false);
  //         }
  //       })
  //       .catch((error: any) => {
  //         console.error(error);
  //         setPaymentModalContent({
  //           title: "Payment Failed",
  //           text: "Your payment was not successful. OTP is invalid.",
  //           isError: true,
  //         });
  //       })
  //       .finally(() => {
  //         setShowPaymentStatusModal(true);
  //         setIsLoading(false);
  //       });
  //   }
  // };

  return (
    <MainLayout navigation={navigation}>
    <Heading
        icon={<EuroIcon color="pink" size={25} />}
        title="Make Payment"
        rightAction={
          <View style={{ flexDirection: "row", display: "flex" }}>
            <Button
              onPress={() =>setBottomSheetOpen(true)}
              color={"light-pink"}
              leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
              // disabled={isCardHaveVirtual}
            >
              Add Payee
            </Button>
          </View>
        }
      />
      <ScrollView bounces={true}>
        <View style={styles.content}>
          <Divider style={{ marginBottom: 10 }} />
            <FormGroup.Input
              icon={<Search color={vars['accent-blue']} size={18}/>}
              placeholder={"Search payee"}
              color={vars["black"]}
              fontSize={14}
              fontWeight={"400"}
              style={{ width: "90%", alignSelf: "center", marginTop: 10, marginBottom: 10 }}
              value={''}
              onChangeText={(event: string) => console.log('text')}
              onSubmitEditing={() => {
                // fetchTransactionsWithFilters({
                //   ...searchFieldData,
                //   name: searchText,
                // });
              }}
            />
          <Divider style={{ marginBottom: 10 }} />
          <View style={{display: 'flex', flexDirection: 'column', borderTopColor: vars['grey'], borderTopWidth: 1}}>
              { beneficiaryList?.length > 0 && beneficiaryList.map((item: any, index: number) => (
                <Fragment>
                  <View key={index} style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                      padding: 10,
                      borderBottomColor: vars['grey'],
                      borderBottomWidth: 1
                    }}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <View style={{padding: 10, borderRadius: 99, backgroundColor: '#F5F4F4', width: 40, height: 40}}>
                        <Text style={{fontSize: 14}}>{getNameInitials(item.name)}</Text>
                      </View>
                      <View style={{paddingLeft: 10}}>
                        <Text style={{fontSize: 14}}>{item.name}</Text>
                        <Text style={{fontSize: 12, color: vars['shade-grey']}}>{item.iban}</Text>
                      </View>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View>
                          <Text style={{fontSize: 14}}>{formatDateDayMonthYear(item.created_at)}</Text>
                          {/* <Text style={{fontSize: 12, color: vars['accent-green']}}>{`+ € 1200`}</Text> */}
                        </View>
                        <View style={{ paddingTop: 3, paddingLeft: 8 }}>
                          <ArrowRight color="blue" />
                        </View>
                    </View>
                  </View>
                </Fragment>
              ))}
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        isVisible={bottomSheetOpen}
        onClose={toggleBottomSheet}
        headerTitle="Add Payee"
        leftHeaderIcon={<AntDesign name="pluscircleo" size={16} color={vars['accent-pink']} />}
        isBottomSheetHeaderShown={true}
      >
        <View>
          <FormGroup
            validationError={
              errors.name && touched.name && errors.name
            }
          >
            <FormGroup.Input
              keyboardType="text"
              name="name"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.name}
              placeholderTextColor={vars["ios-default-text"]}
              placeholder="Name"
              iconColor="blue"
              icon={<FaceIcon />}
            />
          </FormGroup>
        </View>
        <Divider style={{marginVertical: 15}} />
        <View>
          <FormGroup
            validationError={
              errors.iban && touched.iban && errors.iban
            }
          >
            <FormGroup.Input
              keyboardType="text"
              name="iban"
              onChangeText={handleChange("iban")}
              onBlur={handleBlur("iban")}
              value={values.iban}
              placeholderTextColor={vars["ios-default-text"]}
              placeholder="IBAN"
              iconColor="blue"
              icon={<CodeIcon />}
            />
          </FormGroup>
        </View>
        <View>
          <FormGroup
            validationError={
              errors.bic && touched.bic && errors.bic
            }
          >
            <FormGroup.Input
              keyboardType="text"
              name="bic"
              onChangeText={handleChange("bic")}
              onBlur={handleBlur("bic")}
              value={values.bic}
              placeholderTextColor={vars["ios-default-text"]}
              placeholder="BIC"
              iconColor="blue"
              icon={<CodeIcon />}
            />
          </FormGroup>
        </View>
        <Divider style={{marginVertical: 15}} />
        {/* address 1 and address 2*/}
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <View>
            <FormGroup
              validationError={
                errors.address1 && touched.address1 && errors.address1
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="address1"
                onChangeText={handleChange("address1")}
                onBlur={handleBlur("address1")}
                value={values.address1}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Address 1"
                iconColor="blue"
                icon={<BuildingIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.address2 && touched.address2 && errors.address2
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="address2"
                onChangeText={handleChange("address2")}
                onBlur={handleBlur("address2")}
                value={values.address2}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Address 2"
                iconColor="blue"
                icon={<BuildingIcon />}
              />
            </FormGroup>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '50%'}}>
              <FormGroup
                validationError={
                  errors.address2 && touched.address2 && errors.address2
                }

              >
                <FormGroup.Input
                  keyboardType="text"
                  name="address2"
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}

                  value={values.city}
                  placeholderTextColor={vars["ios-default-text"]}
                  placeholder="City"
                  iconColor="blue"
                  icon={<PinGPS />}
                />
              </FormGroup>
            </View>
            <View style={{width: '50%'}}>
              <FormGroup
                validationError={
                  errors.address2 && touched.address2 && errors.address2
                }
              >
                <FormGroup.Input
                  keyboardType="text"
                  name="address2"
                  onChangeText={handleChange("postcode")}
                  onBlur={handleBlur("postcode")}
                  value={values.postcode}
                  placeholderTextColor={vars["ios-default-text"]}
                  placeholder="Post code"
                  iconColor="blue"
                  icon={<CodeIcon />}
                />
              </FormGroup>
            </View>
          </View>
        </View>
        <Button
          color={"light-pink"}
          onPress={toggleBottomSheet}
          style={{marginTop: 20}}
          leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
        >
          Save Payee
        </Button>
      </BottomSheet>
    </MainLayout>
  )
}
