import { FC, Fragment, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Button, TouchableOpacity, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import SalutationIcon from "../../assets/icons/Salutation";
import ProfileIcon from "../../assets/icons/Profile";
import DobIcon from "../../assets/icons/Birthday";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import { salutations } from "../../data/options";
import FormGroup from "../../components/FormGroup";
import { profileDetailsSchema } from "../../utils/formikSchema";
import { countries, nationalities } from "../../data/ISO3166";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import FixedBottomAction from "../../components/FixedBottomAction";
import ButtonSubmit from "../../components/Button";

import vars from "../../styles/vars";
import { styles } from "./styles";

interface IProfileDetails {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const GENDER: any = {
  Mr: "M",
  Ms: "F",
  Mrs: "F",
};

const ProfileDetails: FC<IProfileDetails> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setFieldValue("dob", date.toLocaleDateString());
    hideDatePicker();
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
  } = useFormik({
    initialValues: {
      salutation: registration.data?.salutation || "",
      firstName: registration.data?.firstname || "",
      lastName: registration.data?.lastname || "",
      dob: registration.data?.dob || "",
      placeOfBirth: registration.data?.place_of_birth || "",
      countryOfBirth: registration.data?.country_of_birth,
      nationality: registration.data?.nationality,
    },
    validationSchema: profileDetailsSchema,
    onSubmit: ({
      salutation,
      firstName,
      lastName,
      dob,
      placeOfBirth,
      countryOfBirth,
      nationality,
    }) => {
      dispatch(
        setRegistrationData({
          salutation,
          firstname: firstName,
          lastname: lastName,
          dob,
          place_of_birth: placeOfBirth,
          gender: GENDER[salutation],
          country_of_birth: countryOfBirth,
          nationality: nationality,
        })
      );
      handleNextStep();
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Profile Details
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <FormGroup
              validationError={
                errors.salutation && touched.salutation && errors.salutation
              }
            >
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("salutation")}
                onBlur={handleBlur("salutation")}
                selectedValue={values?.salutation}
                icon={<SalutationIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {salutations.map((item) => {
                  if (!item?.label && !item?.value) {
                    return (
                      <FormGroup.Option
                        key={item?.value}
                        label="Salutation"
                        value=""
                      />
                    );
                  }
                  return (
                    <FormGroup.Option
                      key={item?.value}
                      label={item?.label}
                      value={item?.value}
                    />
                  );
                })}
              </FormGroup.SelectForArrOfObject>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.firstName && touched.firstName && errors.firstName
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                placeholder="First Name"
                icon={<ProfileIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.lastName && touched.lastName && errors.lastName
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                placeholder="Last Name"
                icon={<ProfileIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={errors.dob && touched.dob && errors.dob}
            >
              <View style={styles.dobWrapper}>
                <DobIcon size={18} color="medium-grey" />
                <TouchableOpacity onPress={showDatePicker}>
                  <Text style={styles.dobText}>
                    {values?.dob ? values?.dob : "Date of birth"}
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.placeOfBirth &&
                touched.placeOfBirth &&
                errors.placeOfBirth
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("placeOfBirth")}
                onBlur={handleBlur("placeOfBirth")}
                value={values.placeOfBirth}
                placeholder="Place of birth"
                icon={<ProfileIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.countryOfBirth &&
                touched.countryOfBirth &&
                errors.countryOfBirth
              }
            >
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("countryOfBirth")}
                onBlur={handleBlur("countryOfBirth")}
                selectedValue={
                  values?.countryOfBirth
                    ? countryValueFromLocalStorage(
                        "country",
                        values?.countryOfBirth
                      ).value
                    : null
                }
                icon={<ProfileIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {countries.map((item) => {
                  return (
                    <FormGroup.Option
                      key={item?.alpha3 ? item?.alpha3 : "default"}
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
                errors.nationality && touched.nationality && errors.nationality
              }
            >
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("nationality")}
                onBlur={handleBlur("nationality")}
                selectedValue={
                  values?.nationality
                    ? countryValueFromLocalStorage(
                        "nationality",
                        values?.nationality
                      ).value
                    : null
                }
                icon={<ProfileIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {nationalities.map((item, index) => {
                  if (index === 0) {
                    return (
                      <FormGroup.Option
                        key="default"
                        label="Nationality"
                        value=""
                      />
                    );
                  }
                  return (
                    <FormGroup.Option
                      key={item?.alpha3 ? item?.alpha3 : "default"}
                      label={item?.name}
                      value={item?.alpha3}
                    />
                  );
                })}
              </FormGroup.SelectForArrOfObject>
            </FormGroup>
          </View>
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

export default ProfileDetails;
