import React, { Fragment, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { RootState } from "../../store";
import { useAddPayeeMutation, useGetPayeesQuery } from "../../redux/payee/payeeSlice";
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
import { formatDateDayMonthYear, getCurrency, getNameInitials, screenNames } from "../../utils/helpers";
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

export function Payment({ navigation }: any) {
  const dispatch = useDispatch();
  const infoData = useSelector((state: any) => state.account.details);
  const validationSchema = validationAddingPayeeSchema();
  const [isAddingPayeeShown, setIsAddingPayeeShown] = useState<boolean>(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [isPayeeListShown, setIsPayeeListShown] = useState<boolean>(true);
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

  const filteredPayeesList = payeesList?.filter((item: any) => {
    return item.name.toLowerCase().includes(searchName.toLowerCase());
  });

  const toggleBottomSheet = () => {
    setIsAddingPayeeShown(!isAddingPayeeShown);
  };

  const { handleChange, handleBlur, values, touched, errors, handleSubmit } = useFormik({
    initialValues: {
      beneficiaryName: "",
      beneficiaryIban: "",
      beneficiaryBic: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addNewPayee({
        beneficiary_name: values.beneficiaryName,
        beneficiary_iban: values.beneficiaryIban,
        beneficiary_bic: values.beneficiaryBic,
        access_token,
        token_ziyl,
      })
      .unwrap()
      .finally(() => {
        setIsModalSuccessOpen(true);
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
      <Heading
          icon={<EuroIcon color="pink" size={25} />}
          title={"Make Payment"}
          rightAction={
            <View style={{ flexDirection: "row", display: "flex" }}>
              <Button
                onPress={() => setIsAddingPayeeShown(true)}
                color={"light-pink"}
                leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
              >
                Add Payee
              </Button>
            </View>
          }
        />
      <ScrollView bounces={true} style={{backgroundColor: '#fff'}}>
        <View style={styles.content}>
          <Divider style={{ marginBottom: 1 }} />
          <View style={{display: 'flex', flexDirection: 'row', padding: 10}}>
            <FormGroup.Input
              icon={<Search color={vars['accent-blue']} size={18}/>}
              placeholder={"Search payee"}
              color={vars["black"]}
              fontSize={14}
              fontWeight={"400"}
              style={{ alignSelf: "center", marginTop: 10, marginBottom: 10, width: '70%'}}
              value={searchName}
              onChangeText={(event: string) => setSearchName(event)}
            />
            <TouchableOpacity onPress={() => setIsPayeeListShown(!isPayeeListShown)}
              style={{
                marginTop: 10, 
                marginLeft: 10, 
                backgroundColor: '#F5F9FF', 
                height: 45,
                width: 45,
                padding: 14,
                borderRadius: 99,
              }}
            >
              <IconQr color={vars['accent-blue']} size={18} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFilterForPayeeShown(!isFilterForPayeeShown)}
              style={{
                marginTop: 10, 
                marginLeft: 10, 
                backgroundColor: '#F5F9FF', 
                height: 45,
                width: 45,
                padding: 14,
                borderRadius: 99,
              }}
            >
              <ArrowDownDotted color={vars['accent-blue']} size={18} />
            </TouchableOpacity>
          </View>
          {/* <Divider style={{ marginVertical: 20 }} />
          <DropdownComponent />
          <Divider style={{ marginVertical: 20 }} /> */}
          {/* <Divider style={{ marginBottom: 10 }} /> */}
          <View style={{display: 'flex', flexDirection: 'column', borderTopColor: vars['grey'], borderTopWidth: 1}}>
              { filteredPayeesList?.length > 0 && filteredPayeesList
              .sort((a: any, b: any) => {
                if (selectedFilterForPayees === '1') {
                  return a.name.localeCompare(b.name);
                }
                if (selectedFilterForPayees === '2') {
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                if (selectedFilterForPayees === '3') {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                }
                return a.name.localeCompare(b.name);
              })
              .map((item: any, index: number) => (
                <Fragment key={index}>
                  <View key={index} style={{
                      // borderTopWidth: selectedPayeeId ? 0 : 1,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      // marginTop: 10,
                      borderTopColor: vars['grey'],
                      borderTopWidth: selectedPayeeId === index ? 0 : 1,
                      marginBottom: 5,
                      padding: 10,
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
                          <View style={{padding: 10, borderRadius: 99, backgroundColor: '#F5F4F4', width: 40, height: 40}}>
                            <Text style={{fontSize: 14}}>{getNameInitials(item.name)}</Text>
                          </View>
                          <View style={{paddingLeft: 10}}>
                            <Text style={{fontSize: 14}}>{item.name}</Text>
                            <Text style={{fontSize: 12, color: vars['shade-grey']}}>{item.iban}</Text>
                          </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View>
                          <Text style={{fontSize: 14}}>{formatDateDayMonthYear(item.created_at)}</Text>
                          {/* <Text style={{fontSize: 12, color: vars['accent-green']}}>{`+ € 1200`}</Text> */}
                        </View>
                        <View style={{ paddingTop: 3, paddingLeft: 8 }}>
                          <TouchableOpacity onPress={() => {
                            navigation.navigate(screenNames.payeeSendFunds, {
                              item,
                            });
                          }}>
                            <ArrowRight color="blue" />
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
                            fontFamily="Nunito-SemiBold"
                          >
                            IBAN
                          </Typography>
                          <Text style={{color: '#000', fontSize: 12}}>
                            {item.iban}
                          </Text>
                        </View>
                        <View style={{display: 'flex', flexDirection:'column'}}>
                        <Typography 
                          color="accent-blue"
                          fontSize={12}
                          fontWeight={600}
                          fontFamily="Nunito-SemiBold"
                          >
                            BIC
                          </Typography>
                          <Typography 
                            color="black"
                            fontSize={12}
                            fontWeight={400}
                            fontFamily="Nunito-SemiBold"
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
                        {/* <View style={{display: 'flex', flexDirection:'column'}}>
                          <Text style={{color: vars['accent-blue']}}>
                            BANK
                          </Text>
                          <Text style={{color: '#000', fontSize: 12}}>
                            ING Espana
                          </Text>
                        </View> */}
                        <View style={{display: 'flex', flexDirection:'column'}}>
                          <Text style={{color: vars['accent-blue']}}>
                            Added
                          </Text>
                          <Text style={{color:'#000', fontSize: 12}}>
                            {formatDateDayMonthYear(item.created_at)}
                          </Text>
                        </View>
                        {/* delete button here */}
                        <View style={{display: 'flex', flexDirection:'column'}}>
                          <TouchableOpacity>
                            <Text style={{top: 18, right: 8}}>
                              <AntDesign name="delete" size={19} color={vars['accent-pink']} />
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Divider style={{
                        marginVertical: 20,
                        // height: 1,
                        // backgroundColor: vars['shade-grey'],
                        opacity: 0,
                      }} />
                    </View>
                  }
                </Fragment>
              ))}
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        isVisible={isAddingPayeeShown}
        onClose={toggleBottomSheet}
        headerTitle="Add Payee"
        leftHeaderIcon={<AntDesign name="pluscircleo" size={16} color={vars['accent-pink']} />}
        isBottomSheetHeaderShown={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust the behavior based on platform
          style={styles.container}
        >
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
          Save Payee
        </Button>
        </KeyboardAvoidingView>
      </BottomSheet>
      <BottomSheet
        isVisible={isFilterForPayeeShown}
        onClose={() => setIsPayeeListShown(false)}
        headerTitle="Payees"
        >
          <ScrollView 
            style={{height: 140}}
            decelerationRate={"fast"}
            snapToInterval={50}
            >
              {[{ label: 'Aplabetic', value: '1' },
                { label: 'Latest transaction first', value: '2' },
                { label: 'Oldest transaction first', value: '3' }
              ]
                .map((item, index) => (
                  <Button
                    key={index}
                    color={ selectedFilterForPayees === item.value ? "blue" : "light-blue" }
                    style={{marginBottom: 10}}
                    onPress={() => {
                      setSelectedFilterForPayees(item.value);
                      setTimeout(() => {
                        setIsFilterForPayeeShown(false);
                      }, 400);
                    }}
                    //leftIcon={<AntDesign name="pluscircleo" size={18} color={vars['accent-pink']} />}
                  >
                    {item.label}
                  </Button>
                ))
                }
          </ScrollView>
        </BottomSheet>
    </MainLayout>
  )
}
