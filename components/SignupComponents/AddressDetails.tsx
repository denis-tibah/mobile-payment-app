import { FC, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";

import FormGroup from "../../components/FormGroup";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import ButtonSubmit from "../../components/Button";

import KeyIcon from "../../assets/icons/Key";
import LocationIcon from "../../assets/icons/Location";
import CityIcon from "../../assets/icons/City";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import MapIcon from "../../assets/icons/Map";
import GlobeIcon from "../../assets/icons/Globe";
import Typography from "../../components/Typography";
import { countries } from "../../data/ISO3166";
import { noOfMonthsObj, noOfYearsObj } from "../../data/options";
import WholeContainer from "../../layout/WholeContainer";
import { Seperator } from "../../components/Seperator/Seperator";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import { addressDetailsSchema } from "../../utils/formikSchema";
import SignupScrollableBodyWrapper from "./SignupScrollableBodyWrapper";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IAddressDetails {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

interface IIsYearsRequiredForAdditionalField {
  noOfYears: string;
  noOfMonths: string;
}

const AddressDetails: FC<IAddressDetails> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const [openListForCountry, setOpenListForCountry] = useState<boolean>(false);
  const [openListForAdditionalCountry, setOpenListForAdditionalCountry] =
    useState<boolean>(false);
  const [openListForNoOfMonths, setOpenListForNoOfMonths] =
    useState<boolean>(false);
  const [openListForAdditionalNoOfMonths, setOpenListForAdditinalNoOfMonths] =
    useState<boolean>(false);
  const [openListForNoOfYears, setOpenListForNoOfYears] =
    useState<boolean>(false);
  const [openListForAdditionalNoOfYears, setOpenListForAdditionalNoOfYears] =
    useState<boolean>(false);

  const arrayChecker = (arr: any): any => {
    return arr && Array.isArray(arr) && arr.length > 0 ? true : false;
  };

  const isYearsRequiredForAdditionalField = ({
    noOfYears,
    noOfMonths,
  }: IIsYearsRequiredForAdditionalField) => {
    let years = parseInt(noOfYears, 10) || 0;
    const months = parseInt(noOfMonths, 10) || 0;
    if (months === 12) years += 1;
    return years < 3 ? true : false;
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    submitCount,
    setFieldTouched,
    setValues,
    setFieldValue,
  } = useFormik({
    validationSchema: addressDetailsSchema,
    initialValues: {
      street: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].street
        : "",
      subStreet: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].subStreet
        : "",
      town: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].town
        : "",
      state: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].state
        : "",
      postCode: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].postCode
        : "",
      country: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].country
        : null,
      noOfMonths: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].noOfMonths
        : "",
      noOfYears: arrayChecker(registration?.data?.addresses)
        ? registration?.data?.addresses[0].noOfYears
        : "",
      additionalStreet: "",
      additionalSubStreet: "",
      additionalPostcode: "",
      additionalTown: "",
      additionalState: "",
      additionalCountry: "",
      additionalNoofmonths: "",
      additionalNoofyears: "",
    },
    onSubmit: ({
      street,
      subStreet,
      town,
      state,
      postCode,
      country,
      noOfMonths,
      noOfYears,
      additionalStreet,
      additionalSubStreet,
      additionalPostcode,
      additionalTown,
      additionalState,
      additionalCountry,
      additionalNoofmonths,
      additionalNoofyears,
    }) => {
      const firstAddressObj = {
        street,
        subStreet,
        town,
        state,
        postCode,
        country,
        noOfMonths: parseInt(noOfMonths, 10),
        noOfYears: parseInt(noOfYears, 10),
      };
      const secondAddressObj = {
        street: additionalStreet,
        subStreet: additionalSubStreet,
        town: additionalTown,
        state: additionalState,
        postCode: additionalPostcode,
        country: additionalCountry,
        noOfMonths: parseInt(additionalNoofmonths, 10),
        noOfYears: parseInt(additionalNoofyears, 10),
      };

      let addresses = [firstAddressObj];
      if (
        isYearsRequiredForAdditionalField({
          noOfMonths,
          noOfYears,
        })
      ) {
        addresses = [firstAddressObj, secondAddressObj];
      }
      dispatch(setRegistrationData({ addresses }));
      handleNextStep();
    },
  });
  console.log("🚀 ~ file: AddressDetails.tsx:102 ~ values:", values);

  // to deal with individual input on touch event for the first time submit. cannot put on single useEffect since it causes other input to reset
  // #HACK needs improvement
  useEffect(() => {
    if (submitCount === 1 && errors.additionalStreet === "Required") {
      setFieldTouched("additionalStreet", false);
    }
  }, [errors.additionalStreet, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalSubStreet === "Required") {
      setFieldTouched("additionalSubStreet", false);
    }
  }, [errors.additionalSubStreet, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalPostcode === "Required") {
      setFieldTouched("additionalPostcode", false);
    }
  }, [errors.additionalPostcode, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalTown === "Required") {
      setFieldTouched("additionalTown", false);
    }
  }, [errors.additionalTown, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalState === "Required") {
      setFieldTouched("additionalState", false);
    }
  }, [errors.additionalState, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalCountry === "Required") {
      setFieldTouched("additionalCountry", false);
    }
  }, [errors.additionalCountry, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalNoofmonths === "Required") {
      setFieldTouched("additionalNoofmonths", false);
    }
  }, [errors.additionalNoofmonths, setFieldTouched, submitCount]);

  useEffect(() => {
    if (submitCount === 1 && errors.additionalNoofyears === "Required") {
      setFieldTouched("additionalNoofyears", false);
    }
  }, [errors.additionalNoofyears, setFieldTouched, submitCount]);

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Address Details
        </Typography>
        <Typography
          fontSize={14}
          fontFamily="Mukta-Regular"
          fontWeight={"400"}
          color="#696F7A"
        >
          We require 3 years of address history
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={16} />
      <SignupScrollableBodyWrapper>
        <View style={styles.cardBody}>
          <View>
            <FormGroup
              validationError={errors.street && touched.street && errors.street}
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("street")}
                onBlur={handleBlur("street")}
                value={values.street}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Address"
                iconColor="blue"
                icon={<CityIcon size={16} color="blue" />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.subStreet && touched.subStreet && errors.subStreet
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("subStreet")}
                onBlur={handleBlur("subStreet")}
                value={values.subStreet}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Address 2"
                iconColor="blue"
                icon={<KeyIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.postCode && touched.postCode && errors.postCode
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("postCode")}
                onBlur={handleBlur("postCode")}
                value={values.postCode}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Post code"
                iconColor="blue"
                icon={<MapIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={errors.town && touched.town && errors.town}
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("town")}
                onBlur={handleBlur("town")}
                value={values.town}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Town"
                iconColor="blue"
                icon={<LocationIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={errors.state && touched.state && errors.state}
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("state")}
                onBlur={handleBlur("state")}
                value={values.state}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="State"
                iconColor="blue"
                icon={<MapIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.country && touched.country && errors.country
              }
            >
              <View style={styles.dropdownWrapper}>
                <View style={styles.dropDownIconContainerLeft}>
                  <GlobeIcon size={16} color="blue" />
                </View>
                <View>
                  <DropDownPicker
                    schema={{ label: "name", value: "alpha3" }}
                    onSelectItem={(value: any) => {
                      const { alpha3: countryValue } = value;
                      setValues({
                        ...values,
                        country: countryValue,
                      });
                    }}
                    listMode="MODAL"
                    items={countries}
                    value={values?.country}
                    setOpen={setOpenListForCountry}
                    open={openListForCountry}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    placeholder="Country"
                    placeholderStyle={{
                      color: vars["medium-grey"],
                    }}
                  />
                </View>
                <View style={styles.dropDownIconContainerRight}>
                  <ArrowRightIcon size={16} color="blue" />
                </View>
              </View>
            </FormGroup>
          </View>
          <View style={styles.textSeparatorContainer}>
            <Text style={styles.textSeparator}>
              How long have you lived here?
            </Text>
          </View>
          <View style={styles.allContainerMonthsYears}>
            <View style={{ width: "50%" }}>
              <FormGroup
                validationError={
                  errors.noOfMonths && touched.noOfMonths && errors.noOfMonths
                }
              >
                <View style={{ position: "relative" }}>
                  <Text style={styles.textmonthYearAdditionalText}>
                    Number of months
                  </Text>
                  <DropDownPicker
                    schema={{ label: "label", value: "value" }}
                    onSelectItem={(value: any) => {
                      const { value: noOfMonthValue } = value;
                      setFieldValue("noOfMonths", noOfMonthValue);
                    }}
                    listMode="SCROLLVIEW"
                    items={noOfMonthsObj}
                    value={values?.noOfMonths}
                    setOpen={setOpenListForNoOfMonths}
                    open
                    style={[styles.dropdown, styles.dropdownMonthYears]}
                    dropDownContainerStyle={[
                      styles.dropdownContainer,
                      styles.dropdownContainerMonthYears,
                    ]}
                    placeholder="Number of months"
                    scrollViewProps={{
                      nestedScrollEnabled: true,
                    }}
                    labelStyle={{
                      color: "transparent",
                    }}
                    placeholderStyle={{
                      display: "none",
                    }}
                    arrowIconStyle={{ display: "none" }}
                    listItemLabelStyle={styles.listItemLabelStyle}
                    selectedItemLabelStyle={styles.selectedItemLabelStyle}
                    showTickIcon={false}
                  />
                </View>
              </FormGroup>
            </View>
            <View style={{ width: "50%" }}>
              <FormGroup
                validationError={
                  errors.noOfYears && touched.noOfYears && errors.noOfYears
                }
              >
                <View style={{ position: "relative" }}>
                  <View>
                    <Text style={styles.textmonthYearAdditionalText}>
                      Number of years
                    </Text>
                    <DropDownPicker
                      schema={{ label: "label", value: "value" }}
                      onSelectItem={(value: any) => {
                        const { value: noOfYearsValue } = value;
                        setFieldValue("noOfYears", noOfYearsValue);
                      }}
                      listMode="SCROLLVIEW"
                      items={noOfYearsObj}
                      value={values?.noOfYears}
                      setOpen={setOpenListForNoOfYears}
                      open
                      style={[styles.dropdown, styles.dropdownMonthYears]}
                      dropDownContainerStyle={[
                        styles.dropdownContainer,
                        styles.dropdownContainerMonthYears,
                      ]}
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                      labelStyle={{
                        color: "transparent",
                      }}
                      placeholderStyle={{
                        display: "none",
                      }}
                      arrowIconStyle={{ display: "none" }}
                      listItemLabelStyle={styles.listItemLabelStyle}
                      selectedItemLabelStyle={styles.selectedItemLabelStyle}
                      showTickIcon={false}
                    />
                  </View>
                </View>
              </FormGroup>
            </View>
          </View>
          {isYearsRequiredForAdditionalField({
            noOfMonths: values?.noOfMonths,
            noOfYears: values?.noOfYears,
          }) &&
            submitCount > 0 && (
              <View>
                <View
                  style={{
                    borderBottomColor: "black",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginTop: 15,
                    marginBottom: 15,
                  }}
                />
                <View style={styles.textSeparatorContainer}>
                  <Text style={styles.textSeparator}>
                    We require extra address
                  </Text>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalStreet &&
                      touched.additionalStreet &&
                      errors.additionalStreet
                    }
                  >
                    <FormGroup.Input
                      keyboardType="default"
                      returnKeyType={"done"}
                      onChangeText={handleChange("additionalStreet")}
                      onBlur={handleBlur("additionalStreet")}
                      value={values.additionalStreet}
                      placeholderTextColor={vars["ios-default-text"]}
                      placeholder="Address"
                      iconColor="blue"
                      icon={<CityIcon size={16} color="blue" />}
                    />
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalSubStreet &&
                      touched.additionalSubStreet &&
                      errors.additionalSubStreet
                    }
                  >
                    <FormGroup.Input
                      keyboardType="default"
                      returnKeyType={"done"}
                      onChangeText={handleChange("additionalSubStreet")}
                      onBlur={handleBlur("additionalSubStreet")}
                      value={values.additionalSubStreet}
                      placeholderTextColor={vars["ios-default-text"]}
                      placeholder="Address 2"
                      iconColor="blue"
                      icon={<KeyIcon size={16} color="blue" />}
                    />
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalPostcode &&
                      touched.additionalPostcode &&
                      errors.additionalPostcode
                    }
                  >
                    <FormGroup.Input
                      keyboardType="default"
                      returnKeyType={"done"}
                      onChangeText={handleChange("additionalPostcode")}
                      onBlur={handleBlur("additionalPostcode")}
                      value={values.additionalPostcode}
                      placeholderTextColor={vars["ios-default-text"]}
                      placeholder="Post code"
                      iconColor="blue"
                      icon={<MapIcon />}
                    />
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalTown &&
                      touched.additionalTown &&
                      errors.additionalTown
                    }
                  >
                    <FormGroup.Input
                      keyboardType="default"
                      returnKeyType={"done"}
                      onChangeText={handleChange("additionalTown")}
                      onBlur={handleBlur("additionalTown")}
                      value={values.additionalTown}
                      placeholderTextColor={vars["ios-default-text"]}
                      placeholder="Town"
                      iconColor="blue"
                      icon={<LocationIcon />}
                    />
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalState &&
                      touched.additionalState &&
                      errors.additionalState
                    }
                  >
                    <FormGroup.Input
                      keyboardType="default"
                      returnKeyType={"done"}
                      onChangeText={handleChange("additionalState")}
                      onBlur={handleBlur("additionalState")}
                      value={values.additionalState}
                      placeholderTextColor={vars["ios-default-text"]}
                      placeholder="State"
                      iconColor="blue"
                      icon={<MapIcon />}
                    />
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalCountry &&
                      touched.additionalCountry &&
                      errors.additionalCountry
                    }
                  >
                    <View style={styles.dropdownWrapper}>
                      <View style={styles.dropDownIconContainerLeft}>
                        <GlobeIcon size={16} color="blue" />
                      </View>
                      <View>
                        <DropDownPicker
                          schema={{ label: "name", value: "alpha3" }}
                          onSelectItem={(value: any) => {
                            const { alpha3: additionalCountryValue } = value;

                            setValues({
                              ...values,
                              additionalCountry: additionalCountryValue,
                            });
                          }}
                          listMode="MODAL"
                          items={countries}
                          value={values?.additionalCountry}
                          setOpen={setOpenListForAdditionalCountry}
                          open={openListForAdditionalCountry}
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropdownContainer}
                          dropDownDirection="TOP"
                          placeholder="Country"
                          placeholderStyle={{
                            color: vars["medium-grey"],
                          }}
                        />
                      </View>
                      <View style={styles.dropDownIconContainerRight}>
                        <ArrowRightIcon size={16} color="blue" />
                      </View>
                    </View>
                  </FormGroup>
                </View>
                <View style={styles.allContainerMonthsYears}>
                  <View style={{ width: "50%" }}>
                    <FormGroup
                      validationError={
                        errors.additionalNoofmonths &&
                        touched.additionalNoofmonths &&
                        errors.additionalNoofmonths
                      }
                    >
                      <View style={{ position: "relative" }}>
                        <View>
                          <Text style={styles.textmonthYearAdditionalText}>
                            Number of months
                          </Text>
                          <DropDownPicker
                            schema={{ label: "label", value: "value" }}
                            onSelectItem={(value: any) => {
                              const {
                                value: additionalNoOfAdditionalMonthValue,
                              } = value;
                              setFieldValue(
                                "additionalNoofmonths",
                                additionalNoOfAdditionalMonthValue
                              );
                            }}
                            listMode="SCROLLVIEW"
                            items={noOfMonthsObj}
                            value={values?.additionalNoofmonths}
                            setOpen={setOpenListForNoOfMonths}
                            open
                            style={[styles.dropdown, styles.dropdownMonthYears]}
                            dropDownContainerStyle={[
                              styles.dropdownContainer,
                              styles.dropdownContainerMonthYears,
                            ]}
                            placeholder="Number of months"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            labelStyle={{
                              color: "transparent",
                            }}
                            placeholderStyle={{
                              display: "none",
                            }}
                            arrowIconStyle={{ display: "none" }}
                            listItemLabelStyle={styles.listItemLabelStyle}
                            selectedItemLabelStyle={
                              styles.selectedItemLabelStyle
                            }
                            showTickIcon={false}
                          />
                        </View>
                      </View>
                    </FormGroup>
                  </View>
                  <View style={{ width: "50%" }}>
                    <FormGroup
                      validationError={
                        errors.additionalNoofyears &&
                        touched.additionalNoofyears &&
                        errors.additionalNoofyears
                      }
                    >
                      <View style={{ position: "relative" }}>
                        <View>
                          <Text style={styles.textmonthYearAdditionalText}>
                            Number of years
                          </Text>
                          <DropDownPicker
                            schema={{ label: "label", value: "value" }}
                            onSelectItem={(value: any) => {
                              const { value: additionalNoofyearsValue } = value;
                              setFieldValue(
                                "additionalNoofyears",
                                additionalNoofyearsValue
                              );
                            }}
                            listMode="SCROLLVIEW"
                            items={noOfYearsObj}
                            value={values?.additionalNoofyears}
                            setOpen={setOpenListForNoOfMonths}
                            open
                            style={[styles.dropdown, styles.dropdownMonthYears]}
                            dropDownContainerStyle={[
                              styles.dropdownContainer,
                              styles.dropdownContainerMonthYears,
                            ]}
                            placeholder="Number of years"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            labelStyle={{
                              color: "transparent",
                            }}
                            placeholderStyle={{
                              display: "none",
                            }}
                            arrowIconStyle={{ display: "none" }}
                            listItemLabelStyle={styles.listItemLabelStyle}
                            selectedItemLabelStyle={
                              styles.selectedItemLabelStyle
                            }
                            showTickIcon={false}
                          />
                        </View>
                      </View>
                    </FormGroup>
                  </View>
                </View>
              </View>
            )}
        </View>
      </SignupScrollableBodyWrapper>
      <View style={styles.footerContent}>
        <View style={styles.downloadBtnMain}>
          <WholeContainer>
            <View style={styles.bottomButtonContainer}>
              <ButtonSubmit
                color="light-pink"
                onPress={handlePrevStep}
                leftIcon={<ArrowLeft size={14} />}
              >
                <Typography
                  fontSize={16}
                  fontWeight={"600"}
                  fontFamily="Nunito-SemiBold"
                  marginLeft={8}
                >
                  Back
                </Typography>
              </ButtonSubmit>
              <ButtonSubmit
                color="light-pink"
                onPress={handleSubmit}
                rightIcon={<ArrowRightLong size={14} />}
              >
                <Typography
                  fontSize={16}
                  fontWeight={"600"}
                  fontFamily="Nunito-SemiBold"
                  marginLeft={8}
                >
                  Next
                </Typography>
              </ButtonSubmit>
            </View>
          </WholeContainer>
        </View>
      </View>
    </View>
  );
};

export default AddressDetails;
