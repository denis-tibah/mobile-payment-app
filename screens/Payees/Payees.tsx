import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Keyboard,
  Dimensions,
} from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { AntDesign } from "@expo/vector-icons";
import { Divider } from "react-native-paper";

import {
  useAddPayeeMutation,
  useGetPayeesQuery,
} from "../../redux/payee/payeeSlice";
import Search from "../../assets/icons/Search";
import Heading from "../../components/Heading";
import { MainLayout } from "../../layout/Main/Main";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import CodeIcon from "../../assets/icons/Code";
import {
  arrayChecker,
  getFormattedDateFromUnixDotted,
  getNameInitials,
  hp,
  screenNames,
  widthGlobal,
  wp,
} from "../../utils/helpers";
import vars from "../../styles/vars";
import { validationAddingPayeeSchema } from "../../utils/validation";
import ArrowRight from "../../assets/icons/ArrowRight";
import FaceIcon from "../../assets/icons/FaceIcon";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import ArrowDownDotted from "../../assets/icons/ArrowDownDotted";
import Typography from "../../components/Typography";
import { deleteBeneficiary } from "../../redux/beneficiary/beneficiarySlice";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import Payee from "../../assets/icons/Payee";
import CalenderEmpty from "../../assets/icons/CalenderEmpty";
import { RootState } from "../../store";
import RBSheet from "react-native-raw-bottom-sheet";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export function Payees({ navigation }: any) {
  const dispatch = useDispatch();
  const validationSchema = validationAddingPayeeSchema();
  const refRBSheet = useRef<any>(null);
  const refRBSheetDeletePayee = useRef<any>(null);
  const refRBSheetPayeesOrder = useRef<any>(null);

  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [isSearchFilterShown, setIsSearchFilterShown] =
    useState<boolean>(false);
  const [selectedPayeeId, setSelectedPayeeId] = useState<number>(0);
  const [selectedFilterForPayees, setSelectedFilterForPayees] =
    useState<string>("1");
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [keyboardStatus, setKeyboardStatus] = useState("hidden");
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  console.log("🚀 ~ Payees ~ keyboardStatus:", keyboardStatus);

  const { access_token, token_ziyl } = userTokens || {};
  const [
    addNewPayee,
    {
      isError: isAddPayeeError,
      isSuccess: isAddPayeeSuccess,
      isLoading: isAddPayeeLoading,
      data: addPayeeData,
      error: addPayeeError,
    },
  ] = useAddPayeeMutation();

  const {
    data: payeesList,
    isLoading: isPayeesListLoading,
    refetch: refetchPayees,
  } = useGetPayeesQuery({
    accessToken: access_token,
    tokenZiyl: token_ziyl,
  });

  const filteredPayeesList = payeesList?.filter((item: any) => {
    return item.name.toLowerCase().includes(searchName.toLowerCase());
  });

  const {
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      beneficiaryName: "",
      beneficiaryIban: "",
      beneficiaryBic: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      refRBSheet.current.close();
      addNewPayee({
        beneficiary_name: values.beneficiaryName,
        beneficiary_iban: values.beneficiaryIban,
        beneficiary_bic: values.beneficiaryBic,
        access_token,
        token_ziyl,
      });
    },
  });

  useEffect(() => {
    if (isAddPayeeSuccess) {
      const statusCode = addPayeeData?.code
        ? parseInt(addPayeeData?.code)
        : 400;
      setStatusMessage({
        header: statusCode >= 200 && statusCode < 400 ? "Success" : "Error",
        body:
          statusCode >= 200 && statusCode < 400
            ? `${statusCode}: ${
                addPayeeData?.message
                  ? addPayeeData?.message
                  : "Succesfully added payee"
              }`
            : `${statusCode}: Failed adding payee`,

        isOpen: true,
        isError: statusCode >= 200 && statusCode < 400 ? false : true,
      });
      if (statusCode >= 200 && statusCode < 400) {
        refetchPayees();
      }
      resetForm();
    }
  }, [isAddPayeeSuccess, addPayeeData]);

  useEffect(() => {
    if (isAddPayeeError) {
      let errorMessage = "Something went wrong";
      if (
        addPayeeError?.data?.errors &&
        arrayChecker(addPayeeError?.data?.errors)
      ) {
        if (addPayeeError?.data?.errors.length > 1) {
          errorMessage = addPayeeError?.data?.errors.join(",");
        }
        if (addPayeeError?.data?.errors.length === 1) {
          errorMessage = addPayeeError?.data?.errors[0];
        }
      }
      setStatusMessage({
        header: "Error",
        body: errorMessage,
        isOpen: true,
        isError: true,
      });
      resetForm();
    }
  }, [isAddPayeeError, addPayeeError]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <Fragment>
      <MainLayout navigation={navigation}>
        <ScrollView
          bounces
          style={{ backgroundColor: "#fff" }}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: "transparent", display: "none" }}
              refreshing={false}
              onRefresh={async () => {
                refetchPayees();
              }}
            />
          }
        >
          <View>
            <Heading
              icon={<Payee color="pink" size={18} />}
              title={"Payees"}
              rightAction={
                <View style={{ flexDirection: "row", display: "flex" }}>
                  <Button
                    style={{
                      marginHorizontal: wp(2),
                    }}
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
                  <TouchableOpacity
                    onPress={() => setIsSearchFilterShown(!isSearchFilterShown)}
                    style={{
                      backgroundColor: "#F5F9FF",
                      height: wp(18),
                      width: wp(18),
                      padding: wp(5.1),
                      borderRadius: 99,
                      marginHorizontal: wp(2),
                    }}
                  >
                    <Search color={vars["accent-blue"]} size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => refRBSheetPayeesOrder?.current?.open()}
                    style={{
                      backgroundColor: "#F5F9FF",
                      height: wp(18),
                      width: wp(18),
                      padding: wp(5.1),
                      borderRadius: 99,
                      marginHorizontal: wp(2),
                    }}
                  >
                    <ArrowDownDotted color={vars["accent-blue"]} size={16} />
                  </TouchableOpacity>
                </View>
              }
            />
            {!!isSearchFilterShown && (
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
                    width: widthGlobal - 25,
                  }}
                  value={searchName}
                  onChangeText={(event: string) => setSearchName(event)}
                />
              </View>
            )}
            <View style={{ display: "flex", flexDirection: "column" }}>
              {filteredPayeesList?.length > 0 &&
                filteredPayeesList
                  .sort((a: any, b: any) => {
                    if (selectedFilterForPayees === "1") {
                      return a.name.localeCompare(b.name);
                      // return a.name.localeCompare(b.name);
                    }
                    if (selectedFilterForPayees === "2") {
                      return b.name.localeCompare(a.name);
                      // return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    }
                    // if (selectedFilterForPayees === '3') {
                    //   return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    // }
                    return a.name.localeCompare(b.name);
                  })
                  .map((item: any, index: number) => (
                    <Fragment key={index}>
                      <View
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTopColor: vars["grey"],
                          borderTopWidth: selectedPayeeId === index ? 0 : 1,
                          padding: 10,
                          height: hp(14),
                          borderBottomColor: vars["grey"],
                          borderBottomWidth: selectedPayeeId === index ? 0 : 1,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            if (selectedPayeeId === index) {
                              setSelectedPayeeId(-1);
                              return;
                            }
                            setSelectedPayeeId(index);
                          }}
                        >
                          <View
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <View
                              style={{
                                padding: 6,
                                borderRadius: 99,
                                backgroundColor: "#F5F4F4",
                                width: 36,
                                height: 36,
                              }}
                            >
                              <Typography
                                color={vars["accent-blue"]}
                                fontSize={14}
                                fontWeight={"500"}
                                fontFamily="Mukta-Regular"
                                textAlign="center"
                              >
                                {getNameInitials(item.name)}
                              </Typography>
                            </View>
                            <View
                              style={{
                                paddingLeft: 10,
                                top: hp(1),
                              }}
                            >
                              <Typography
                                color="#000"
                                fontSize={14}
                                fontWeight={"400"}
                                fontFamily="Mukta-Regular"
                              >
                                {item.name}
                              </Typography>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => {
                              if (selectedPayeeId === index) {
                                setSelectedPayeeId(-1);
                                return;
                              }
                              setSelectedPayeeId(index);
                            }}
                          >
                            <View
                              style={{
                                top: hp(0.2),
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View>
                                <CalenderEmpty
                                  color={vars["accent-grey"]}
                                  size={12}
                                />
                              </View>
                              <Typography
                                paddingLeft={wp(3)}
                                color="#000"
                                fontSize={14}
                                fontWeight={"400"}
                                fontFamily="Mukta-Regular"
                              >
                                {getFormattedDateFromUnixDotted(
                                  item.created_at
                                )}
                              </Typography>
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              paddingLeft: 8,
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate(
                                  screenNames.payeeSendFunds,
                                  {
                                    item,
                                  }
                                );
                              }}
                            >
                              <ArrowRight color="blue" size={14} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      {selectedPayeeId === index && (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingHorizontal: 25,
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                color="accent-blue"
                                fontSize={14}
                                fontWeight={"400"}
                                fontFamily="Mukta-SemiBold"
                              >
                                IBAN
                              </Typography>
                              <Typography
                                color="#000"
                                fontSize={14}
                                fontWeight={"600"}
                                fontFamily="Mukta-Regular"
                              >
                                {item.iban}
                              </Typography>
                            </View>
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                color="accent-blue"
                                fontSize={14}
                                fontWeight={"600"}
                                fontFamily="Mukta-SemiBold"
                              >
                                BIC
                              </Typography>
                              <Typography
                                color="#000"
                                fontSize={14}
                                fontWeight={"400"}
                                fontFamily="Mukta-Regular"
                              >
                                {item.bic}
                              </Typography>
                            </View>
                          </View>
                          <Divider
                            style={{
                              marginVertical: 20,
                              height: 1,
                              backgroundColor: vars["shade-grey"],
                              opacity: 0.5,
                            }}
                          />
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                color="accent-blue"
                                fontSize={12}
                                fontWeight={"600"}
                                fontFamily="Nunito-Bold"
                              >
                                Added
                              </Typography>
                              <Typography
                                color="#000"
                                fontSize={14}
                                fontWeight={"400"}
                              >
                                {getFormattedDateFromUnixDotted(
                                  item.created_at
                                )}
                              </Typography>
                            </View>
                            {/* delete button here */}
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  backgroundColor: "#FFF1F1",
                                  borderRadius: 25,
                                  paddingVertical: 5,
                                  paddingHorizontal: 18,
                                  top: hp(2),
                                }}
                                onPress={() => {
                                  setSelectedPayeeId(item.uuid);
                                  refRBSheetDeletePayee?.current?.open();
                                }}
                              >
                                <View
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <AntDesign
                                    name="delete"
                                    size={14}
                                    color={"#FF7171"}
                                  />
                                  <Typography
                                    color={"#FF7171"}
                                    fontSize={12}
                                    fontWeight={"600"}
                                    fontFamily="Nunito-Bold"
                                    paddingLeft={5}
                                  >
                                    Delete payee
                                  </Typography>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Divider
                            style={{
                              marginVertical: 20,
                              opacity: 0,
                            }}
                          />
                        </View>
                      )}
                    </Fragment>
                  ))}
            </View>
          </View>
        </ScrollView>
      </MainLayout>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
          height:
            dimensions.window.height - (keyboardStatus === "shown" ? 384 : 300),
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <AntDesign name="pluscircleo" size={16} color={vars["accent-pink"]} />
          <Typography
            color="#000"
            fontSize={16}
            fontWeight={"600"}
            fontFamily="Nunito-Bold"
            marginLeft={15}
            marginBottom={30}
          >
            Add Payee
          </Typography>
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
        {keyboardStatus === "hidden" ? (
          <Fragment>
            <Divider style={{ marginVertical: 15 }} />
            <View
              style={{
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
                  // refRBSheet.current.close();
                  handleSubmit(
                    // @ts-ignore
                    values
                  );
                }}
                style={{ marginTop: 14 }}
                leftIcon={
                  <AntDesign
                    name="pluscircleo"
                    size={18}
                    color={vars["accent-pink"]}
                  />
                }
              >
                <Typography
                  color={vars["accent-pink"]}
                  fontSize={16}
                  fontWeight={"600"}
                  fontFamily="Nunito-Bold"
                >
                  Save Payee
                </Typography>
              </Button>
            </View>
          </Fragment>
        ) : null}
      </SwipableBottomSheet>
      <SwipableBottomSheet
        rbSheetRef={refRBSheetPayeesOrder}
        closeOnDragDown={true}
        closeOnPressMask={false}
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
            Payees Order
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
        {[
          { label: "Alphabetic A - Z", value: "1" },
          { label: "Alphabetic Z - A", value: "2" },
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
          >
            {item.label}
          </Button>
        ))}
      </SwipableBottomSheet>
      <SwipableBottomSheet
        rbSheetRef={refRBSheetDeletePayee}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={hp(45)}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, .5)" }}
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
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: wp(140),
            alignItems: "center",
            alignSelf: "center",
            marginTop: 15,
          }}
        >
          <Typography
            color="#000"
            fontSize={16}
            fontWeight={"600"}
            textAlign="center"
            fontFamily="Nunito-SemiBold"
            style={{ marginTop: 10, marginBottom: 20 }}
          >
            Are you sure you want to delete this payee?
          </Typography>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              color={"light-pink"}
              onPress={() => {
                refRBSheetDeletePayee?.current?.close();
                setIsLoading(true);
                dispatch<any>(deleteBeneficiary(selectedPayeeId))
                  .unwrap()
                  .then((res: any) => {
                    const statusCode = res?.code ? parseInt(res?.code) : 400;
                    if (statusCode >= 200 && statusCode < 400) {
                      setStatusMessage({
                        header: "Success",
                        body: `${statusCode}: ${
                          res?.message ? res?.message : "Success deleting payee"
                        }`,
                        isOpen: true,
                        isError: false,
                      });
                    } else {
                      setStatusMessage({
                        header: "Error",
                        body: `${statusCode}: ${
                          res?.message
                            ? res?.message
                            : "Unable to  delete payee"
                        }`,
                        isOpen: true,
                        isError: true,
                      });
                    }
                    setIsLoading(false);
                    refetchPayees();
                  })
                  .catch((error: any) => {
                    console.log("error", error);
                    setIsLoading(false);
                  });
              }}
              style={{ marginTop: 20, width: wp(40) }}
            >
              <Typography
                color={vars["accent-pink"]}
                fontSize={14}
                fontWeight={"600"}
                fontFamily="Nunito-Bold"
              >
                Yes
              </Typography>
            </Button>
            <Button
              color={"light-blue"}
              onPress={() => {
                refRBSheetDeletePayee?.current?.close();
              }}
              style={{ marginTop: 20, width: wp(40) }}
            >
              <Typography
                color={vars["accent-blue"]}
                fontSize={14}
                fontWeight={"600"}
                fontFamily="Nunito-Bold"
              >
                No
              </Typography>
            </Button>
          </View>
        </View>
      </SwipableBottomSheet>
      <Spinner
        visible={isLoading || isPayeesListLoading || isAddPayeeLoading}
      />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
    </Fragment>
  );
}
