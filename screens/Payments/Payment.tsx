import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import VectorIcon from "react-native-vector-icons/AntDesign";
import { RootState } from "../../store";
import {
  useAddPayeeMutation,
  useLazyGetPayeesQuery,
} from "../../redux/payee/payeeSlice";
import { Divider } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import Search from "../../assets/icons/Search";
import Heading from "../../components/Heading";
import { MainLayout } from "../../layout/Main/Main";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { styles } from "./styles";
import { useFormik } from "formik";
import EuroIcon from "../../assets/icons/Euro";
import CodeIcon from "../../assets/icons/Code";
import {
  formatAmountWithCurrency,
  formatTransactionsForPaymentScreen,
  getFormattedDateFromUnixDotted,
  getNameInitials,
  hp,
  isPositiveAmount,
  screenNames,
  wp,
  getFormattedDateAndTime,
} from "../../utils/helpers";
import vars from "../../styles/vars";
import {
  validationAddingPayeeSchema,
  validationPaymentSchema,
} from "../../utils/validation";
import FaceIcon from "../../assets/icons/FaceIcon";
import IconQr from "../../assets/icons/IconsQr";
import ArrowDownDotted from "../../assets/icons/ArrowDownDotted";
import Typography from "../../components/Typography";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { RefreshControl } from "react-native";
import { SearchFilter } from "../../redux/transaction/transactionSlice";
import { useLazyGetTransactionsQuery } from "../../redux/transaction/transactionV2Slice";

export function Payment({ navigation }: any) {
  const dispatch = useDispatch();
  const infoData = useSelector((state: any) => state.account.details);
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const validationSchema = validationAddingPayeeSchema();
  const refRBSheet = useRef<any>(null);
  const refRBSheetPayeesOrder = useRef<any>(null);
  const [isAddingPayeeShown, setIsAddingPayeeShown] = useState<boolean>(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [isPayeeListShown, setIsPayeeListShown] = useState<boolean>(true);
  // const [isPayeeDetailsShown, setIsPayeeDetailsShown] = useState<boolean>(false);
  const [selectedPayeeId, setSelectedPayeeId] = useState<number>(0);
  const [isFilterForPayeeShown, setIsFilterForPayeeShown] =
    useState<boolean>(false);
  const [selectedFilterForPayees, setSelectedFilterForPayees] =
    useState<string>("2");
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const { access_token, token_ziyl } = userTokens || {};
  const [
    addNewPayee,
    {
      isError: isAddPayeeError,
      isSuccess: isAddPayeeSuccess,
      isLoading: isAddPayeeLoading,
    },
  ] = useAddPayeeMutation();

  const [getTransactionsWithFilter, { data: transactionsData }] =
    useLazyGetTransactionsQuery();
  const formattedTransactionsForPayments =
    formatTransactionsForPaymentScreen(transactionsData);
  const filteredFormattedTransactionsForPayments =
    formattedTransactionsForPayments?.filter((item: any) => {
      return item.name.toLowerCase().includes(searchName.toLowerCase());
    });

  const handleGetTransactionsForPayments = async () => {
    let search: SearchFilter = {
      isGroupingDisabled: true,
      accountId: `${userData?.id}`,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
      direction: "desc",
      status: "SUCCESS",
    };
    setIsLoading(true);
    getTransactionsWithFilter(search)
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const { handleChange, handleBlur, values, touched, errors, handleSubmit } =
    useFormik({
      initialValues: {
        beneficiaryName: "",
        beneficiaryIban: "",
        beneficiaryBic: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        setIsLoading(true);
        addNewPayee({
          beneficiary_name: values.beneficiaryName,
          beneficiary_iban: values.beneficiaryIban,
          beneficiary_bic: values.beneficiaryBic,
          access_token,
          token_ziyl,
        })
          .unwrap()
          .then((res) => {
            setIsLoading(false);
            setIsModalSuccessOpen(true);
          })
          .finally(() => {
            setIsModalSuccessOpen(true);
          });
      },
    });

  useEffect(() => {
    if (isAddPayeeSuccess) {
      setIsAddingPayeeShown(false);
    }
    if (isAddPayeeError) {
      setIsAddingPayeeShown(false);
    }
  }, [isAddPayeeSuccess, isAddPayeeError]);

  useEffect(() => {
    if (access_token && token_ziyl) {
      (async () => {
        await handleGetTransactionsForPayments();
      })();
    }
  }, [access_token, token_ziyl]);

  // useEffect(() => {
  // handleGetTransactionsForPayments();
  // },[]);

  // console.log('transactionsData', transactionsData);
  // console.log('transactions_grouped_by_date', transactions_grouped_by_date);

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={isLoading} />
      <Heading
        icon={<EuroIcon color="pink" size={25} />}
        title={"Make Payment"}
        rightAction={
          <View style={{ flexDirection: "row", display: "flex" }}>
            <Button
              onPress={() => refRBSheet?.current?.open()}
              color={"light-pink"}
              leftIcon={
                <AntDesign
                  name="pluscircleo"
                  size={18}
                  color={vars["accent-pink"]}
                />
              }
            >
              Add Payee
            </Button>
          </View>
        }
      />
      {/* <View style={{
backgroundColor: '#fff',
height: 1,
width: widthGlobal,
shadowColor: "black",
shadowOffset: { width: -1, height: 3 },
shadowOpacity: 0.1,
shadowRadius: 3,
zIndex: .5,
elevation: 5
}}/> */}
      <ScrollView
        bounces={true}
        style={{ backgroundColor: "#fff" }}
        refreshControl={
          <RefreshControl
            style={{
              backgroundColor: "transparent",
              display: "none",
            }}
            refreshing={false}
            onRefresh={async () => {
              setIsLoading(true);
              await handleGetTransactionsForPayments();
            }}
          />
        }
      >
        <Pressable>
          <View style={styles.content}>
            <Divider style={{ marginBottom: 1 }} />
            <View
              style={{ display: "flex", flexDirection: "row", padding: 10 }}
            >
              <FormGroup.Input
                icon={<Search color={vars["accent-blue"]} size={18} />}
                placeholder={"Search payee"}
                color={vars["black"]}
                fontSize={14}
                fontWeight={"400"}
                style={{
                  alignSelf: "center",
                  marginTop: 10,
                  marginBottom: 10,
                  width: "70%",
                }}
                value={searchName}
                onChangeText={(event: string) => setSearchName(event)}
              />
              <TouchableOpacity
                onPress={() => setIsPayeeListShown(!isPayeeListShown)}
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  backgroundColor: "#F5F9FF",
                  height: 45,
                  width: 45,
                  padding: 14,
                  borderRadius: 99,
                }}
              >
                <IconQr color={vars["accent-blue"]} size={18} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => refRBSheetPayeesOrder?.current?.open()}
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  backgroundColor: "#F5F9FF",
                  height: 45,
                  width: 45,
                  padding: 14,
                  borderRadius: 99,
                }}
              >
                <ArrowDownDotted color={vars["accent-blue"]} size={18} />
              </TouchableOpacity>
            </View>
            {/* <Divider style={{ marginVertical: 20 }} />
<DropdownComponent />
<Divider style={{ marginVertical: 20 }} /> */}
            {/* <Divider style={{ marginBottom: 10 }} /> */}
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderTopColor: vars["grey"],
                borderTopWidth: 1,
              }}
            >
              {filteredFormattedTransactionsForPayments?.length > 0 &&
                filteredFormattedTransactionsForPayments
                  .sort((a: any, b: any) => {
                    if (selectedFilterForPayees === "1") {
                      return a.name.localeCompare(b.name);
                    }
                    if (selectedFilterForPayees === "2") {
                      return (
                        new Date(b.transaction_datetime).getTime() -
                        new Date(a.transaction_datetime).getTime()
                      );
                    }
                    if (selectedFilterForPayees === "3") {
                      return (
                        new Date(a.transaction_datetime).getTime() -
                        new Date(b.transaction_datetime).getTime()
                      );
                    }
                    return a.name.localeCompare(b.name);
                  })
                  .map((item: any, index: number) => {
                    return (
                      <Fragment key={index}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate(screenNames.payeeSendFunds, {
                              item,
                            });
                          }}
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTopColor: vars["grey"],
                            borderTopWidth: selectedPayeeId === index ? 0 : 1,
                            padding: 10,
                            borderBottomColor: vars["grey"],
                            borderBottomWidth:
                              selectedPayeeId === index ? 0 : 1,
                          }}
                        >
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <View
                              style={{
                                padding: wp(5.5),
                                borderRadius: 99,
                                backgroundColor: "#F5F4F4",
                                width: wp(20),
                                height: wp(20),
                              }}
                            >
                              <Typography
                                color="#000"
                                fontSize={12}
                                fontWeight={"600"}
                                fontFamily="Nunito-Bold"
                              >
                                {getNameInitials(item.name)}
                              </Typography>
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                              <Typography
                                color="#000"
                                fontSize={14}
                                fontWeight={"400"}
                                fontFamily="Mukta-Regular"
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                color="#808080"
                                fontSize={12}
                                fontWeight={"400"}
                                fontFamily="Mukta-SemiBold"
                              >
                                {item.iban.length > 18
                                  ? `${item.iban.substring(0, 18)}...`
                                  : item.iban}
                              </Typography>
                            </View>
                          </View>
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <View>
                              <Typography
                                color="#000"
                                fontSize={14}
                                fontWeight={"400"}
                                fontFamily="Mukta-Regular"
                              >
                                {/*the format of this date coming from BE is YYYY-MM-DD HH:MM:SS */}
                                {getFormattedDateAndTime(
                                  item.transaction_datetime
                                )}
                              </Typography>
                              <Typography
                                color={
                                  isPositiveAmount(item.amount)
                                    ? "green"
                                    : "red"
                                }
                                fontSize={12}
                                fontWeight={"400"}
                                textAlign="right"
                                fontFamily="Mukta-SemiBold"
                                top={hp(-1)}
                              >
                                {`${formatAmountWithCurrency(item.amount)}`}
                              </Typography>
                            </View>
                            <View style={{ paddingTop: 10, paddingLeft: 8 }}>
                              <VectorIcon
                                size={14}
                                color={vars["accent-blue"]}
                                name={"pluscircleo"}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </Fragment>
                    );
                  })}
            </View>
          </View>
        </Pressable>
      </ScrollView>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        // onClose={() => refRBSheet?.current?.close()}
        height={420}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust the behavior based on platform
          style={styles.container}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 40,
            }}
          >
            <AntDesign
              name="pluscircleo"
              size={16}
              color={vars["accent-pink"]}
            />
            <View style={{ marginLeft: 15, top: -3 }}>
              <Typography
                color="#000"
                fontSize={16}
                fontWeight={"600"}
                fontFamily="Nunito-Bold"
                // style={{marginLeft: 15, paddingLeft: 15, borderLeftWidth: 1, borderLeftColor: vars['grey']}}
              >
                Add Payee
              </Typography>
            </View>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.beneficiaryName &&
                touched.beneficiaryName &&
                errors.beneficiaryName
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="beneficiaryName"
                onChangeText={handleChange("beneficiaryName")}
                onBlur={handleBlur("beneficiaryName")}
                value={values.beneficiaryName}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Name"
                iconColor="blue"
                icon={<FaceIcon />}
              />
            </FormGroup>
          </View>
          <Divider style={{ marginVertical: 15 }} />
          <View>
            <FormGroup
              validationError={
                errors.beneficiaryIban &&
                touched.beneficiaryIban &&
                errors.beneficiaryIban
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="beneficiaryIban"
                onChangeText={handleChange("beneficiaryIban")}
                onBlur={handleBlur("beneficiaryIban")}
                value={values.beneficiaryIban}
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
                errors.beneficiaryBic &&
                touched.beneficiaryBic &&
                errors.beneficiaryBic
              }
            >
              <FormGroup.Input
                keyboardType="text"
                name="beneficiaryBic"
                onChangeText={handleChange("beneficiaryBic")}
                onBlur={handleBlur("beneficiaryBic")}
                value={values.beneficiaryBic}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="BIC"
                iconColor="blue"
                icon={<CodeIcon />}
              />
            </FormGroup>
          </View>
          <Divider style={{ marginVertical: 15 }} />
          <View
            style={{
              // drop shadow top of this view
              shadowColor: "#ACACAC",
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.23,
              shadowRadius: 2.62,
              elevation: 4,
            }}
          >
            <Button
              color={"light-pink"}
              onPress={() => {
                handleSubmit(
                  // @ts-ignore
                  values
                );
              }}
              style={{ marginTop: 20 }}
              leftIcon={
                <AntDesign
                  name="pluscircleo"
                  size={18}
                  color={vars["accent-pink"]}
                />
              }
            >
              Save Payee
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SwipableBottomSheet>
      <SwipableBottomSheet
        rbSheetRef={refRBSheetPayeesOrder}
        closeOnDragDown={true}
        closeOnPressMask={false}
        // onClose={() => refRBSheet?.current?.close()}
        height={260}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View style={{ marginTop: 5, marginBottom: 10 }}>
          <Typography
            color="#000"
            fontSize={18}
            fontWeight={"600"}
            fontFamily="Nunito-Bold"
            style={{ marginTop: 10, marginBottom: 20 }}
          >
            Payment History Order
          </Typography>
        </View>
        <Divider
          style={{
            marginVertical: 15,
            height: 1,
            backgroundColor: vars["shade-grey"],
            opacity: 0.2,
          }}
        />
        <ScrollView
          style={{ height: 140 }}
          decelerationRate={"fast"}
          snapToInterval={50}
        >
          {[
            // { label: 'Aplabetic', value: '1' },
            { label: "Latest transaction first", value: "2" },
            { label: "Oldest transaction first", value: "3" },
          ].map((item, index) => (
            <Button
              key={index}
              color={
                selectedFilterForPayees === item.value ? "blue" : "light-blue"
              }
              style={{ marginBottom: 10 }}
              onPress={() => {
                setSelectedFilterForPayees(item.value);
                setTimeout(() => {
                  refRBSheetPayeesOrder?.current?.close();
                }, 400);
              }}
              //leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
            >
              {item.label}
            </Button>
          ))}
        </ScrollView>
      </SwipableBottomSheet>
      <Spinner visible={isLoading} />
    </MainLayout>
  );
}
