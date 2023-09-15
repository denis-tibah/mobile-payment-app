import { FC, useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";

import FormGroup from "../../components/FormGroup";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import FixedBottomAction from "../../components/FixedBottomAction";
import ButtonSubmit from "../../components/Button";
import MapIcon from "../../assets/icons/Map";
import KeyIcon from "../../assets/icons/Key";
import LocationIcon from "../../assets/icons/Location";
import Typography from "../../components/Typography";
import { countries, nationalities } from "../../data/ISO3166";

import { noOfMonthsObj, noOfYearsObj } from "../../data/options";

import { Seperator } from "../../components/Seperator/Seperator";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import { addressDetailsSchema } from "../../utils/formikSchema";
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

  const countryValueFromLocalStorage = (
    type: string,
    value: string
  ): {
    label?: string | null;
    value?: string | null;
  } => {
    const selectedDataCountryOfBirth = {};
    if (value) {
      const arrCountry = type === "country" ? countries : nationalities;
      const countryObj = arrCountry.find((country) => country.alpha3 === value);
      if (countryObj && Object.keys(countryObj).length > 0) {
        Object.assign(selectedDataCountryOfBirth, {
          label:
            type === "country" ? countryObj?.name : countryObj?.nationality,
          value: countryObj?.alpha3,
        });
      }
    }
    return Object.keys(selectedDataCountryOfBirth).length > 0
      ? selectedDataCountryOfBirth
      : { label: null, value: null };
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
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
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
                icon={<KeyIcon />}
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
                  listMode="SCROLLVIEW"
                  // setValue={setSelectedSalutation}
                  items={countries}
                  value={values?.country}
                  setOpen={setOpenListForCountry}
                  open={openListForCountry}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownDirection="TOP"
                  placeholder="Country"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
            </FormGroup>
          </View>
          <View style={styles.textSeparatorContainer}>
            <Text style={styles.textSeparator}>
              How long have you lived here?
            </Text>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.noOfMonths && touched.noOfMonths && errors.noOfMonths
              }
            >
              <View>
                <DropDownPicker
                  schema={{ label: "label", value: "value" }}
                  onSelectItem={(value: any) => {
                    const { value: noOfMonthValue } = value;

                    setValues({
                      ...values,
                      noOfMonths: noOfMonthValue,
                    });
                  }}
                  listMode="SCROLLVIEW"
                  // setValue={setSelectedSalutation}
                  items={noOfMonthsObj}
                  value={values?.noOfMonths}
                  setOpen={setOpenListForNoOfMonths}
                  open={openListForNoOfMonths}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownDirection="TOP"
                  placeholder="Number of months"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.noOfYears && touched.noOfYears && errors.noOfYears
              }
            >
              <View>
                <DropDownPicker
                  schema={{ label: "label", value: "value" }}
                  onSelectItem={(value: any) => {
                    const { value: noOfYearsValue } = value;

                    setValues({
                      ...values,
                      noOfYears: noOfYearsValue,
                    });
                  }}
                  listMode="SCROLLVIEW"
                  // setValue={setSelectedSalutation}
                  items={noOfYearsObj}
                  value={values?.noOfYears}
                  setOpen={setOpenListForNoOfYears}
                  open={openListForNoOfYears}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownDirection="TOP"
                  placeholder="Number of years"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View>
            </FormGroup>
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
                      icon={<KeyIcon />}
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
                      icon={<KeyIcon />}
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
                        listMode="SCROLLVIEW"
                        // setValue={setSelectedSalutation}
                        items={countries}
                        value={values?.additionalCountry}
                        setOpen={setOpenListForAdditionalCountry}
                        open={openListForAdditionalCountry}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        dropDownDirection="TOP"
                        placeholder="Country"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.noOfMonths &&
                      touched.noOfMonths &&
                      errors.noOfMonths
                    }
                  >
                    <View>
                      <DropDownPicker
                        schema={{ label: "label", value: "value" }}
                        onSelectItem={(value: any) => {
                          const { value: additionalNoOfAdditionalMonthValue } =
                            value;

                          setValues({
                            ...values,
                            additionalNoofmonths:
                              additionalNoOfAdditionalMonthValue,
                          });
                        }}
                        listMode="SCROLLVIEW"
                        // setValue={setSelectedSalutation}
                        items={noOfMonthsObj}
                        value={values?.additionalNoofmonths}
                        setOpen={setOpenListForAdditinalNoOfMonths}
                        open={openListForAdditionalNoOfMonths}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        dropDownDirection="TOP"
                        placeholder="Number of months"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalNoofyears &&
                      touched.additionalNoofyears &&
                      errors.additionalNoofyears
                    }
                  >
                    <View>
                      <DropDownPicker
                        schema={{ label: "label", value: "value" }}
                        onSelectItem={(value: any) => {
                          const { value: additionalNoofyearsValue } = value;

                          setValues({
                            ...values,
                            additionalNoofyears: additionalNoofyearsValue,
                          });
                        }}
                        listMode="SCROLLVIEW"
                        // setValue={setSelectedSalutation}
                        items={noOfYearsObj}
                        value={values?.additionalNoofyears}
                        setOpen={setOpenListForAdditionalNoOfYears}
                        open={openListForAdditionalNoOfYears}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        dropDownDirection="TOP"
                        placeholder="Number of years"
                        scrollViewProps={{
                          nestedScrollEnabled: true,
                        }}
                      />
                    </View>
                  </FormGroup>
                </View>
              </View>
            )}
          <FixedBottomAction rounded>
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 20,
              }}
            >
              <ButtonSubmit
                color="light-pink"
                onPress={handlePrevStep}
                leftIcon={<ArrowLeft size={14} />}
              >
                Back
              </ButtonSubmit>
              <ButtonSubmit
                color="light-pink"
                onPress={handleSubmit}
                leftIcon={<ArrowRightLong size={14} />}
              >
                Continue
              </ButtonSubmit>
            </View>
          </FixedBottomAction>
        </View>
      </View>
    </View>
  );
};

export default AddressDetails;
