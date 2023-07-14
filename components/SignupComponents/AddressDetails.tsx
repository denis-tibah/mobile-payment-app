import { FC, useEffect } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";

import FormGroup from "../../components/FormGroup";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import FixedBottomAction from "../../components/FixedBottomAction";
import ButtonSubmit from "../../components/Button";
import MapIcon from "../../assets/icons/Map";
import KeyIcon from "../../assets/icons/Key";
import LocationIcon from "../../assets/icons/Location";
import CalenderIcon from "../../assets/icons/CalenderEmpty";
import Typography from "../../components/Typography";
import { countries, nationalities } from "../../data/ISO3166";
import { noOfMonths, noOfYears } from "../../data/options";

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
    setFieldValue,
    submitCount,
    setFieldTouched,
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
        noOfMonths,
        noOfYears,
      };
      const secondAddressObj = {
        street: additionalStreet,
        subStreet: additionalSubStreet,
        town: additionalTown,
        state: additionalState,
        postCode: additionalPostcode,
        country: additionalCountry,
        noOfMonths: additionalNoofmonths,
        noOfYears: additionalNoofyears,
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
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("country")}
                onBlur={handleBlur("country")}
                selectedValue={
                  values?.country
                    ? countryValueFromLocalStorage("country", values?.country)
                        .value
                    : null
                }
                icon={<MapIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {countries.map((item, index) => {
                  if (index === 0) {
                    return (
                      <FormGroup.Option
                        key="default"
                        label="Country"
                        value=""
                      />
                    );
                  }
                  return (
                    <FormGroup.Option
                      key={item?.alpha3}
                      label={item?.name}
                      value={item?.alpha3}
                    />
                  );
                })}
              </FormGroup.SelectForArrOfObject>
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
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("noOfMonths")}
                onBlur={handleBlur("noOfMonths")}
                selectedValue={values?.noOfMonths || ""}
                icon={<CalenderIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {noOfMonths.map((item) => {
                  if (!item) {
                    return (
                      <FormGroup.Option
                        key="default"
                        value=""
                        label="Number of months"
                      />
                    );
                  }
                  return (
                    <FormGroup.Option key={item} label={item} value={item} />
                  );
                })}
              </FormGroup.SelectForArrOfObject>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.noOfYears && touched.noOfYears && errors.noOfYears
              }
            >
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("noOfYears")}
                onBlur={handleBlur("noOfYears")}
                selectedValue={values?.noOfYears}
                icon={<CalenderIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {noOfYears.map((item) => {
                  if (!item) {
                    return (
                      <FormGroup.Option
                        key="default"
                        value=""
                        label="Number of years"
                      />
                    );
                  }
                  return (
                    <FormGroup.Option key={item} label={item} value={item} />
                  );
                })}
              </FormGroup.SelectForArrOfObject>
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
                    <FormGroup.SelectForArrOfObject
                      onValueChange={handleChange("additionalCountry")}
                      onBlur={handleBlur("additionalCountry")}
                      selectedValue={
                        values?.additionalCountry
                          ? countryValueFromLocalStorage(
                              "additionalCountry",
                              values?.additionalCountry
                            ).value
                          : null
                      }
                      icon={<MapIcon />}
                      itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
                    >
                      {countries.map((item, index) => {
                        if (index === 0) {
                          return (
                            <FormGroup.Option
                              key="default"
                              label="Country"
                              value=""
                            />
                          );
                        }
                        return (
                          <FormGroup.Option
                            key={item?.alpha3}
                            label={item?.name}
                            value={item?.alpha3}
                          />
                        );
                      })}
                    </FormGroup.SelectForArrOfObject>
                  </FormGroup>
                </View>
                <View>
                  <FormGroup
                    validationError={
                      errors.additionalNoofmonths &&
                      touched.additionalNoofmonths &&
                      errors.additionalNoofmonths
                    }
                  >
                    <FormGroup.SelectForArrOfObject
                      onValueChange={handleChange("additionalNoofmonths")}
                      onBlur={handleBlur("additionalNoofmonths")}
                      selectedValue={values?.additionalNoofmonths || ""}
                      icon={<CalenderIcon />}
                      itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
                    >
                      {noOfMonths.map((item) => {
                        if (!item) {
                          return (
                            <FormGroup.Option
                              key="default"
                              value=""
                              label="Number of months"
                            />
                          );
                        }
                        return (
                          <FormGroup.Option
                            key={item}
                            label={item}
                            value={item}
                          />
                        );
                      })}
                    </FormGroup.SelectForArrOfObject>
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
                    <FormGroup.SelectForArrOfObject
                      onValueChange={handleChange("additionalNoofyears")}
                      onBlur={handleBlur("additionalNoofyears")}
                      selectedValue={values?.additionalNoofyears}
                      icon={<CalenderIcon />}
                      itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
                    >
                      {noOfYears.map((item) => {
                        if (!item) {
                          return (
                            <FormGroup.Option
                              key="default"
                              value=""
                              label="Number of years"
                            />
                          );
                        }
                        return (
                          <FormGroup.Option
                            key={item}
                            label={item}
                            value={item}
                          />
                        );
                      })}
                    </FormGroup.SelectForArrOfObject>
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
