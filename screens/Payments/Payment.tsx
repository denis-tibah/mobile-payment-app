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

export function Payment({ navigation }: any) {
  const dispatch = useDispatch();
  const infoData = useSelector((state: any) => state.account.details);
  const validationSchema = validationAddingPayeeSchema();
  const [isAddingPayeeShown, setIsAddingPayeeShown] = useState<boolean>(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
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
          title="Make Payment"
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
          <Divider style={{ marginBottom: 10 }} />
            <FormGroup.Input
              icon={<Search color={vars['accent-blue']} size={18}/>}
              placeholder={"Search payee"}
              color={vars["black"]}
              fontSize={14}
              fontWeight={"400"}
              style={{ width: "90%", alignSelf: "center", marginTop: 10, marginBottom: 10 }}
              value={searchName}
              onChangeText={(event: string) => setSearchName(event)}
            />
          {/* <Divider style={{ marginBottom: 10 }} /> */}
          <View style={{display: 'flex', flexDirection: 'column', borderTopColor: vars['grey'], borderTopWidth: 1}}>
              { filteredPayeesList?.length > 0 && filteredPayeesList.map((item: any, index: number) => (
                <Fragment key={index}>
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
        {/*
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
        </View> */}
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
    </MainLayout>
  )
}
