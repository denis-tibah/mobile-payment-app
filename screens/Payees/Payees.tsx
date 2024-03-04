import React, { Fragment, useEffect, useRef, useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import VectorIcon from "react-native-vector-icons/AntDesign";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { RootState } from "../../store";
import { useAddPayeeMutation, useGetPayeesQuery, useLazyGetPayeesQuery } from "../../redux/payee/payeeSlice";
import { Divider, Text } from "react-native-paper";
import { AntDesign } from '@expo/vector-icons';
import Search from "../../assets/icons/Search";
import Heading from "../../components/Heading";
import { MainLayout } from "../../layout/Main/Main";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { styles } from "./styles";
import { useFormik } from "formik";
import EuroIcon from "../../assets/icons/Euro";
import CodeIcon from "../../assets/icons/Code";
import { formatDateDayMonthYear, getCurrency, getFormattedDateFromUnixDotted, getNameInitials, hp, screenNames, widthGlobal, wp } from "../../utils/helpers";
import vars from "../../styles/vars";
import { validationAddingPayeeSchema, validationPaymentSchema } from "../../utils/validation";
import ArrowRight from "../../assets/icons/ArrowRight";
import BottomSheet from "../../components/BottomSheet";
import FaceIcon from "../../assets/icons/FaceIcon";
import BuildingIcon from "../../assets/icons/Building";
import PinGPS from "../../assets/icons/PinGPS";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import IconQr from "../../assets/icons/IconsQr";
import ArrowDownDotted from "../../assets/icons/ArrowDownDotted";
import Typography from "../../components/Typography";
import { deleteBeneficiary } from "../../redux/beneficiary/beneficiarySlice";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import Payee from "../../assets/icons/Payee";
import CalenderEmpty from "../../assets/icons/CalenderEmpty";

export function Payees({ navigation }: any) {
  const dispatch = useDispatch();
  const infoData = useSelector((state: any) => state.account.details);
  const validationSchema = validationAddingPayeeSchema();
  const refRBSheet = useRef<any>(null);
  const refRBSheetDeletePayee = useRef<any>(null);
  const refRBSheetPayeesOrder = useRef<any>(null);
  const [isAddingPayeeShown, setIsAddingPayeeShown] = useState<boolean>(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  // const [isPayeeListShown, setIsPayeeListShown] = useState<boolean>(true);
  const [isSearchFilterShown, setIsSearchFilterShown] = useState<boolean>(false);
  // const [isPayeeDetailsShown, setIsPayeeDetailsShown] = useState<boolean>(false);
  const [selectedPayeeId, setSelectedPayeeId] = useState<number>(0);
  const [isFilterForPayeeShown, setIsFilterForPayeeShown] = useState<boolean>(false);
  const [selectedFilterForPayees, setSelectedFilterForPayees] = useState<string>("1");
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const { access_token, token_ziyl } = userTokens || {};
  const [ addNewPayee, {
    isError: isAddPayeeError,
    isSuccess: isAddPayeeSuccess,
    isLoading: isAddPayeeLoading,
  }] = useAddPayeeMutation();

  const { data: payeesList,
    isLoading: isPayeesListLoading } = useGetPayeesQuery({
    accessToken: access_token,
    tokenZiyl: token_ziyl,
  });
  const [getPayees] = useLazyGetPayeesQuery();

  const filteredPayeesList = payeesList?.filter((item: any) => {
    return item.name.toLowerCase().includes(searchName.toLowerCase());
  });

  const { handleChange, handleBlur, values, touched, errors, handleSubmit, resetForm } = useFormik({
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
      .then((res: any) => {
        getPayees({ accessToken: access_token, tokenZiyl: token_ziyl});
      })
      .finally(() => {
        setIsModalSuccessOpen(true);
        setIsLoading(false);
        resetForm();
      });
    }
  });

  useEffect(() => {
    if (isAddPayeeSuccess) {
      setIsAddingPayeeShown(false);
    }
    if (isAddPayeeError) {
      setIsAddingPayeeShown(false);
    }
  }, [isAddPayeeSuccess, isAddPayeeError]);

  return (
    <MainLayout navigation={navigation}>
      <SuccessModal
        isError={isAddPayeeError}
        isOpen={isModalSuccessOpen}
        title={isAddPayeeError ? "Error" : "Success"}
        text={isAddPayeeError ? "Something went wrong" : "Payee added successfully"}
        onClose={() => setIsModalSuccessOpen(false)}
      />
      <Spinner visible={isPayeesListLoading || isAddPayeeLoading} />
      <Spinner visible={isLoading} />
      <Heading
        icon={<Payee color="pink" size={18} />}
        title={"Payees"}
        rightAction={
          <View style={{ flexDirection: "row", display: "flex"}}>
            <Button
              style={{
                marginHorizontal: wp(2)
              }}
              onPress={() => refRBSheet?.current?.open()}
              color={"light-pink"}
              leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
            >
              Add Payee
            </Button>
            <TouchableOpacity onPress={() => setIsSearchFilterShown(!isSearchFilterShown)}
              style={{
                backgroundColor: '#F5F9FF', 
                height: wp(18),
                width: wp(18),
                padding: wp(5.1),
                borderRadius: 99,
                marginHorizontal: wp(2)
              }}
            >
              <Search color={vars['accent-blue']} size={16}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => refRBSheetPayeesOrder?.current?.open()}
              style={{
                backgroundColor: '#F5F9FF',
                height: wp(18),
                width: wp(18),
                padding: wp(5.1),
                borderRadius: 99,
                marginHorizontal: wp(2)
              }}
            >
              <ArrowDownDotted color={vars['accent-blue']} size={16} />
            </TouchableOpacity>
          </View>
          }
        />
      <ScrollView 
        bounces={true} 
        style={{backgroundColor: '#fff'}}
        refreshControl={
          <RefreshControl 
            style={{ backgroundColor: "transparent", display: 'none', }}
            refreshing={false}
            onRefresh={ async () => {
              setIsLoading(true);
              getPayees({ accessToken: access_token, tokenZiyl: token_ziyl})
              .unwrap()
              .then((res: any) => {
                setIsLoading(false);
              });
            }} />
        }
        >
        <View style={styles.content}>
          { !!isSearchFilterShown && <View style={{display: 'flex', flexDirection: 'row', padding: 10}}>
            <FormGroup.Input
              icon={<Search color={vars['accent-blue']} size={18}/>}
              placeholder={"Search payee"}
              color={vars["black"]}
              fontSize={14}
              fontWeight={"400"}
              style={{ alignSelf: "center", marginTop: 10, marginBottom: 10, width: widthGlobal - 25 }}
              value={searchName}
              onChangeText={(event: string) => setSearchName(event)}
            />
          </View>
          }
          <View style={{display: 'flex', flexDirection: 'column'}}>
              { filteredPayeesList?.length > 0 && filteredPayeesList
              .sort((a: any, b: any) => {
                if (selectedFilterForPayees === '1') {
                  return a.name.localeCompare(b.name);
                  // return a.name.localeCompare(b.name);
                }
                if (selectedFilterForPayees === '2') {
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
                  <View key={index} style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTopColor: vars['grey'],
                      borderTopWidth: selectedPayeeId === index ? 0 : 1,
                      padding: 10,
                      height: hp(14),
                      borderBottomColor: vars['grey'],
                      borderBottomWidth: selectedPayeeId === index ? 0 : 1,
                    }}>
                      <TouchableOpacity onPress={() => {
                        if (selectedPayeeId === index) {
                          setSelectedPayeeId(-1);
                          return;
                        }
                        setSelectedPayeeId(index);
                      }}>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View style={{padding: 6, borderRadius: 99, backgroundColor: '#F5F4F4', width: 28, height: 28}}>
                          <Typography 
                            color={vars['accent-blue']}
                            fontSize={10}
                            fontWeight={600}
                            fontFamily="Nunito-Bold"
                          >
                            {getNameInitials(item.name)}
                          </Typography>
                        </View>
                        <View style={{
                          paddingLeft: 10,
                          top: hp(1)
                        }}>
                            <Typography 
                              color="#000"
                              fontSize={14}
                              fontWeight={600}
                              fontFamily="Nunito-Bold"
                            >
                              {item.name}
                            </Typography>
                          </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => {
                          if (selectedPayeeId === index) {
                            setSelectedPayeeId(-1);
                            return;
                          }
                          setSelectedPayeeId(index);
                        }}>
                          <View style={{
                            top: hp(.2),
                            display: 'flex',
                            flexDirection: 'row',
                            marginRight: wp(5),
                          }}>
                            <View style={{top: hp(.7)}}>
                              <CalenderEmpty color={vars['accent-grey']} size={14}/>
                            </View>
                            <Typography
                                paddingLeft={wp(3)}
                                color="#000"
                                fontSize={14}
                                fontWeight={600}
                                fontFamily="Nunito-SemiBold"
                              >{getFormattedDateFromUnixDotted(item.created_at)}
                            </Typography>
                            {/* <Text style={{fontSize: 12, color: vars['accent-green']}}>{`+ € 1200`}</Text> */}
                          </View>
                        </TouchableOpacity>
                        <View style={{ paddingTop: 3, paddingLeft: 8 }}>
                          <TouchableOpacity onPress={() => {
                            navigation.navigate(screenNames.payeeSendFunds, {
                              item,
                            });
                          }}>
                            <VectorIcon
                              size={14}
                              color={vars['accent-blue']}
                              name={"pluscircleo"}
                            />
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
                  { selectedPayeeId === index &&
                    <View style={{display: 'flex', flexDirection: 'column', paddingHorizontal: 25}}>
                      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{display: 'flex', flexDirection:'column'}}>
                          <Typography 
                            color="accent-blue"
                            fontSize={12}
                            fontWeight={600}
                            fontFamily="Nunito-Bold"
                          >
                            IBAN
                          </Typography>
                          <Typography
                            color="#000"
                            fontSize={14}
                            fontWeight={600}
                          >
                            {item.iban}
                          </Typography>
                        </View>
                        <View style={{display: 'flex', flexDirection:'column'}}>
                        <Typography 
                          color="accent-blue"
                          fontSize={12}
                          fontWeight={600}
                          fontFamily="Nunito-Bold"
                          >
                            BIC
                          </Typography>
                          <Typography 
                            color="#000"
                            fontSize={14}
                            fontWeight={400}
                            >
                            {item.bic}
                          </Typography>
                        </View>
                      </View>
                      <Divider style={{
                        marginVertical: 20,
                        height: 1,
                        backgroundColor: vars['shade-grey'],
                        opacity: .5,
                      }} />
                      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{display: 'flex', flexDirection:'column'}}>
                          <Typography 
                            color="accent-blue"
                            fontSize={12}
                            fontWeight={600}
                            fontFamily="Nunito-Bold"
                            >
                            Added
                          </Typography>
                          <Typography 
                          color="#000"
                          fontSize={14}
                          fontWeight={400}
                          >
                            {getFormattedDateFromUnixDotted(item.created_at)}
                          </Typography>
                        </View>
                        {/* delete button here */}
                        <View style={{display: 'flex', flexDirection:'column'}}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#FFF1F1',
                              borderRadius: 25,
                              paddingVertical: 5,
                              paddingHorizontal: 18,
                              top: hp(2),
                            }}
                            onPress={() => {
                              setSelectedPayeeId(item.uuid);
                              refRBSheetDeletePayee?.current?.open();
                            }}>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <AntDesign name="delete" size={14} color={'#FF7171'} />
                              <Typography 
                                color={'#FF7171'}
                                fontSize={12}
                                fontWeight={600}
                                fontFamily="Nunito-Bold"
                                paddingLeft={5}
                              > 
                                  
                                Delete payee
                              </Typography>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Divider style={{
                        marginVertical: 20,
                        opacity: 0,
                      }} />
                    </View>
                  }
                </Fragment>
              ))}
          </View>
        </View>
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust the behavior based on platform
          style={styles.container}
        >
        <View style={{display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 40}}>
          <AntDesign name="pluscircleo" size={16} color={vars['accent-pink']} />
          <View style={{marginLeft: 15, top: -3}}>
            <Typography
              color="#000"
              fontSize={16}
              fontWeight={600}
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
              errors.beneficiaryName && touched.beneficiaryName && errors.beneficiaryName
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
        <Divider style={{marginVertical: 15}} />
        <View>
          <FormGroup
            validationError={
              errors.beneficiaryIban && touched.beneficiaryIban && errors.beneficiaryIban
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
              errors.beneficiaryBic && touched.beneficiaryBic && errors.beneficiaryBic
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
        <Divider style={{marginVertical: 15}} />
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
            
          }}>
          <Button
            color={"light-pink"}
              onPress={() => {
                handleSubmit(
                  // @ts-ignore
                  values
                )
            }
            }
            style={{marginTop: 20}}
            leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
          >
            <Typography
              color={vars['accent-pink']}
              fontSize={16}
              fontWeight={600}
              fontFamily="Nunito-Bold"
            >
              Save Payee
            </Typography>
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
          <View style={{marginTop: 5, marginBottom: 10}}>
            <Typography
              color="#000"
              fontSize={18}
              fontWeight={600}
              fontFamily="Nunito-Bold"
              style={{marginTop: 10, marginBottom: 20}}
            >
              Payees Order
            </Typography>
          </View>
          <Divider style={{marginVertical: 15, height: 1, backgroundColor: vars['shade-grey'], opacity: 0.2}} />
          <ScrollView
            style={{height: 140}}
            decelerationRate={"fast"}
            snapToInterval={50}
            >
            {[{ label: 'Alphabetic A - Z', value: '1' },
              { label: 'Alphabetic Z - A', value: '2' },
              // { label: 'Oldest transaction first', value: '3' }
            ]
              .map((item, index) => (
                <Button
                  key={index}
                  color={ selectedFilterForPayees === item.value ? "blue" : "light-blue" }
                  style={{marginBottom: 10}}
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
              ))
            }
          </ScrollView>
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
          onClose={() => {
            setIsLoading(true);
            getPayees({ accessToken: access_token, tokenZiyl: token_ziyl})
            .unwrap()
            .then((res: any) => {
              setIsLoading(false);
            });
          }}
          draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
          >
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            width: wp(140),
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 15,
            }}>
            <Typography
              color="#000"
              fontSize={16}
              fontWeight={600}
              textAlign="center"
              fontFamily="Nunito-SemiBold"
              style={{marginTop: 10, marginBottom: 20}}
            >
              Are you sure you want to delete this payee?
            </Typography>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <Button
                color={"light-pink"}
                onPress={() => {
                  setIsLoading(true);
                  dispatch<any>(deleteBeneficiary(selectedPayeeId))
                  .unwrap()
                  .then((res: any) => {
                    setIsLoading(false);
                    refRBSheetDeletePayee?.current?.close();
                    
                  })
                  .catch((error: any) => {
                    console.log('error', error);
                    setIsLoading(false);
                  });
                }}
                style={{marginTop: 20, width: wp(40)}}
              >
                <Typography
                  color={vars['accent-pink']}
                  fontSize={14}
                  fontWeight={600}
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
                style={{marginTop: 20, width: wp(40)}}
              >
                <Typography
                  color={vars['accent-blue']}
                  fontSize={14}
                  fontWeight={600}
                  fontFamily="Nunito-Bold"
                >
                  No
                </Typography>
              </Button>
            </View>
          </View>
        </SwipableBottomSheet>
        <Spinner visible={isLoading} />
    </MainLayout>
  )
}
