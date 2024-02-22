import { FC, Fragment, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";

import ProfileIcon from "../../assets/icons/Profile";
import DobIcon from "../../assets/icons/Birthday";
import SalutationIcon from "../../assets/icons/Salutation";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import CityIcon from "../../assets/icons/City";
import { salutations } from "../../data/options";
import FormGroup from "../../components/FormGroup";
import { profileDetailsSchema } from "../../utils/formikSchema";
import { countries, nationalities } from "../../data/ISO3166";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import ButtonSubmit from "../../components/Button";
import WholeContainer from "../../layout/WholeContainer";

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

  const windowDimensionsHeight = Dimensions.get("window").height - 390;

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [openListForSalutation, setOpenListForSalutation] =
    useState<boolean>(false);
  const [openListForCountryOfBirth, setOpenListForCountryOfBirth] =
    useState<boolean>(false);
  const [openListForNationality, setOpenListForNationality] =
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

  const formatDOBToDash = (paramDOB: string): string | null => {
    const arrDOB: string[] | boolean = paramDOB ? paramDOB.split("-") : false;
    const [year, month, day] = arrDOB ? arrDOB : [];
    return year && month && day ? `${month}/${day}/${year}` : null;
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      salutation: registration.data?.salutation || "",
      firstName: registration.data?.firstname || "",
      lastName: registration.data?.lastname || "",
      dob: formatDOBToDash(registration.data?.dob) || "",
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
      const arrDOB: string[] | boolean = dob ? dob.split("/") : false;
      const [month, day, year] = arrDOB ? arrDOB : [];
      dispatch(
        setRegistrationData({
          salutation,
          firstname: firstName,
          lastname: lastName,
          dob:
            month && day && year
              ? `${year}-${month.length === 2 ? month : `0${month}`}-${
                  day.length === 2 ? day : `0${day}`
                }`
              : "",
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
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight={600}>
          Profile Details
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View style={{ height: windowDimensionsHeight }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            bounces={false}
            nestedScrollEnabled
            style={{ flexGrow: 1 }}
          >
            <Pressable>
              <View style={[styles.cardBody, {}]}>
                <View>
                  <FormGroup
                    validationError={
                      errors.salutation &&
                      touched.salutation &&
                      errors.salutation
                    }
                  >
                    <View style={styles.dropdownWrapper}>
                      <View style={styles.dropDownIconContainerLeft}>
                        <SalutationIcon size={16} color="blue" />
                      </View>
                      <View>
                        <DropDownPicker
                          schema={{ label: "label", value: "value" }}
                          onSelectItem={(value: any) => {
                            const { value: salutationValue } = value;
                            setValues({
                              ...values,
                              salutation: salutationValue,
                            });
                          }}
                          listMode="MODAL"
                          // setValue={setSelectedSalutation}
                          items={salutations}
                          value={values?.salutation}
                          setOpen={setOpenListForSalutation}
                          open={openListForSalutation}
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropdownContainer}
                          placeholder="Salutation"
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
                <WholeContainer>
                  <Seperator
                    backgroundColor={vars["v2-light-grey"]}
                    marginBottom={16}
                  />
                </WholeContainer>
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
                      placeholderTextColor={vars["ios-default-text"]}
                      iconColor="blue"
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
                      placeholderTextColor={vars["ios-default-text"]}
                      iconColor="blue"
                      icon={<ProfileIcon />}
                    />
                  </FormGroup>
                </View>
                <WholeContainer>
                  <Seperator
                    backgroundColor={vars["v2-light-grey"]}
                    marginBottom={16}
                  />
                </WholeContainer>
                <View>
                  <FormGroup
                    validationError={errors.dob && touched.dob && errors.dob}
                  >
                    <View style={styles.dobWrapper}>
                      <DobIcon size={18} color="blue" />
                      <TouchableOpacity onPress={showDatePicker}>
                        <Text
                          style={[
                            styles.dobText,
                            values?.dob
                              ? styles.dobTextSelected
                              : styles.dobTextDefault,
                          ]}
                        >
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
                      placeholderTextColor={vars["ios-default-text"]}
                      placeholder="Place of birth"
                      iconColor="blue"
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
                    <View style={styles.dropdownWrapper}>
                      <View style={styles.dropDownIconContainerLeft}>
                        <CityIcon size={16} color="blue" />
                      </View>
                      <View>
                        <DropDownPicker
                          schema={{
                            label: "name",
                            value: "alpha3",
                          }}
                          onSelectItem={(value: any) => {
                            const { alpha3: contryOfBirthValue } = value;
                            setValues({
                              ...values,
                              countryOfBirth: contryOfBirthValue,
                            });
                          }}
                          listMode="MODAL"
                          items={countries}
                          value={values?.countryOfBirth || ""}
                          setOpen={setOpenListForCountryOfBirth}
                          open={openListForCountryOfBirth}
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropdownContainer}
                          placeholder="Country of birth"
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
                <View>
                  <FormGroup
                    validationError={
                      errors.nationality &&
                      touched.nationality &&
                      errors.nationality
                    }
                  >
                    <View style={styles.dropdownWrapper}>
                      <View style={styles.dropDownIconContainerLeft}>
                        <CityIcon size={16} color="blue" />
                      </View>
                      <View>
                        <DropDownPicker
                          schema={{
                            label: "name",
                            value: "alpha3",
                          }}
                          onSelectItem={(value: any) => {
                            const { alpha3: nationalityValue } = value;
                            setValues({
                              ...values,
                              nationality: nationalityValue,
                            });
                          }}
                          listMode="MODAL"
                          items={nationalities}
                          value={values?.nationality || ""}
                          setOpen={setOpenListForNationality}
                          open={openListForNationality}
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropdownContainer}
                          placeholderStyle={{
                            color: vars["medium-grey"],
                          }}
                          placeholder="Nationality"
                        />
                      </View>
                      <View style={styles.dropDownIconContainerRight}>
                        <ArrowRightIcon size={16} color="blue" />
                      </View>
                    </View>
                  </FormGroup>
                </View>
                {/* <View style={styles.footerContent}>
                  <View style={styles.downloadBtnMain}>
                    <WholeContainer>
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <ButtonSubmit
                          color="light-pink"
                          onPress={handlePrevStep}
                          leftIcon={<ArrowLeft size={14} />}
                        >
                          <Typography
                            fontSize={16}
                            fontWeight={600}
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
                            fontWeight={600}
                            fontFamily="Nunito-SemiBold"
                            marginLeft={8}
                          >
                            Next
                          </Typography>
                        </ButtonSubmit>
                      </View>
                    </WholeContainer>
                  </View>
                </View> */}
              </View>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </View>
      <View style={styles.footerContent}>
        <View style={styles.downloadBtnMain}>
          <WholeContainer>
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ButtonSubmit
                color="light-pink"
                onPress={handlePrevStep}
                leftIcon={<ArrowLeft size={14} />}
              >
                <Typography
                  fontSize={16}
                  fontWeight={600}
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
                  fontWeight={600}
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

export default ProfileDetails;
