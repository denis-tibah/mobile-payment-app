import { FC, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";

import Button from "../Button";
import FormGroup from "../FormGroup";
import Typography from "../Typography";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import Camera from "../../assets/icons/Camera";
import SalutationIcon from "../../assets/icons/Salutation";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import ProfileIcon from "../../assets/icons/Profile";
import CompassIcon from "../../assets/icons/Compass";
import ChangeRequestIcon from "../../assets/icons/ChangeRequest";
import KeyIcon from "../../assets/icons/Key";
import LocationIcon from "../../assets/icons/Location";
import DobIcon from "../../assets/icons/Birthday";
import { Avatar } from "../../components/Avatar/Avatar";
import MapIcon from "../../assets/icons/Map";
import CityIcon from "../../assets/icons/City";
import { countries } from "../../data/ISO3166";
import { salutations } from "../../data/options";
import { editProfileSchema } from "../../utils/formikSchema";
import { useCreateTicketRequestMutation } from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import WholeContainer from "../../layout/WholeContainer";
import { getFormattedDateAndTimeAndSeconds } from "../../utils/helpers";

interface IProfileTab {}

const ProfileTab: FC<IProfileTab> = () => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [openListForSalutation, setOpenListForSalutation] =
    useState<boolean>(false);
  const [openListForCountry, setOpenListForCountry] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [displayedDOB, setDisplayedDOB] = useState<string>("");
  console.log("🚀 ~ displayedDOB:", displayedDOB);

  const formatDOBToDash = (paramDOB: string): string | null => {
    const splitTimeAndDate: string[] | boolean = paramDOB
      ? paramDOB.split(" ")
      : false;
    const [date, time] = splitTimeAndDate ? splitTimeAndDate : [];
    const arrDate: string[] | boolean = date ? date.split("-") : false;
    const [year, month, day] = arrDate ? arrDate : [];
    const dateStr = year && month && day ? `${day}.${month}.${year}` : null;
    /* return `${dateStr || ""} ${time || ""}`; */
    return `${dateStr || ""}`;
  };

  // ASK SANTI FOR STATUS CODES OF /createticketfinxp
  const [
    createTicketMutation,
    {
      isLoading: isLoadingCreateTicketReq,
      isError: isErrorCreateTicketReq,
      isSuccess: isSuccessCreateTicketReq,
      error: errorCreateTicketReq,
      data: dataCreateTicketReq,
    },
  ] = useCreateTicketRequestMutation();
  console.log(
    "🚀 ~ ProfileTab ~ isErrorCreateTicketReq:",
    isErrorCreateTicketReq
  );
  console.log(
    "🚀 ~ ProfileTab ~ isSuccessCreateTicketReq:",
    isSuccessCreateTicketReq
  );
  console.log("🚀 ~ ProfileTab ~ errorCreateTicketReq:", errorCreateTicketReq);
  console.log("🚀 ~ ProfileTab ~ dataCreateTicketReq:", dataCreateTicketReq);

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      salutation: profileData?.salutation || "",
      firstName: profileData?.first_name || "",
      lastName: profileData?.last_name || "",
      dob: profileData?.dob || "",
      street: profileData?.address_line_1 || "",
      subStreet: profileData?.address_line_2 || "",
      town: profileData?.town || "",
      state: profileData?.state || "",
      postCode: profileData?.postal_code || "",
      country: profileData?.country || "",
    },
    validationSchema: editProfileSchema,
    onSubmit: async ({
      salutation,
      firstName,
      lastName,
      dob,
      street,
      subStreet,
      town,
      state,
      postCode,
      country,
    }) => {
      const createTicketType = {
        ticketValue: [],
        receive_email: profileData?.email || "",
        dateSubmitted: new Date(),
      };

      if (street && subStreet && town && postCode && state && country) {
        Object.assign(createTicketType, {
          ticketValue: [
            {
              profile: {
                salutation: salutation || "",
                first_name: firstName || "",
                dob: dob || "",
                last_name: lastName || "",
              },
            },
            {
              address: {
                street: street || "",
                subStreet: subStreet || "",
                town: town || "",
                state: state || "",
                postCode: postCode || "",
                country: country || "",
              },
            },
          ],
          ticketType: "Update Address Request",
        });
      } else {
        Object.assign(createTicketType, {
          ticketValue: [
            {
              profile: {
                salutation,
                first_name: firstName,
                last_name: lastName,
                dob: dob || "",
              },
            },
          ],
          ticketType: "Update Profile Request",
        });
      }
      createTicketMutation({
        bodyParams: createTicketType,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      });
    },
  });

  useEffect(() => {
    if (profileData?.dob) {
      // data gets from db
      const formattedDob = formatDOBToDash(profileData?.dob);
      setDisplayedDOB(formattedDob || "");
    }
    if (values?.dob) {
      // data gets from form
      const formattedDob = getFormattedDateAndTimeAndSeconds({
        dateToFormat: values?.dob,
        hasTimeAndSeconds: false,
      });
      setDisplayedDOB(formattedDob || "");
    }
  }, [profileData?.dob, values?.dob]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setFieldValue("dob", date);
    hideDatePicker();
  };

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: "#fff" }}>
        <Spinner visible={isLoadingCreateTicketReq} />
        <SuccessModal
          isOpen={statusMessage?.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
        <Pressable>
          <WholeContainer>
            <View
              style={{
                marginTop: 22,
                paddingBottom: 12,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 18,
                  marginLeft: 4,
                  marginRight: 4,
                  gap: 8,
                }}
              >
                <View style={{ width: "20%" }}>
                  {profileData?.UserProfile?.profileimage ? (
                    <Avatar
                      isBase64Image
                      src={profileData?.UserProfile?.profileimage}
                      fileUpload
                      size="large"
                      icon={<Camera color="blue" size={34} />}
                    />
                  ) : null}
                </View>
                <View
                  style={{
                    marginTop: 12,
                    width: "75%",
                  }}
                >
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
              </View>
              <View style={styles.formContainer}>
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
                    fontSize={16}
                    icon={<ProfileIcon size={10} />}
                  />
                </FormGroup>
              </View>
              <View style={styles.formContainer}>
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
                    fontSize={16}
                    iconColor="blue"
                    icon={<ProfileIcon size={10} />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup
                  validationError={errors.dob && touched.dob && errors.dob}
                >
                  <View style={styles.dobWrapper}>
                    <DobIcon size={18} color="blue" />
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Text
                        style={[
                          styles.dobText,
                          values?.dob
                            ? styles.dobTextSelected
                            : styles.dobTextDefault,
                        ]}
                      >
                        {values?.dob ? displayedDOB : "Date of birth"}
                      </Text>
                      <View style={styles.dropDownIconContainerRightDOB}>
                        <MaterialCommunityIcons
                          size={20}
                          color="#086AFB"
                          name={"calendar-month-outline"}
                        />
                      </View>
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
              <View style={styles.separatorContainer}>
                <Seperator
                  backgroundColor={vars["light-grey"]}
                  marginTop={18}
                  marginBottom={16}
                  width="94%"
                />
              </View>
              <View style={[styles.formContainer, styles.addressHeader]}>
                <CompassIcon color="blue" size={18} />
                <Typography
                  fontSize={18}
                  fontWeight={600}
                  fontFamily="Nunito-SemiBold"
                  marginLeft={4}
                >
                  Address
                </Typography>
              </View>
              <View style={styles.formContainer}>
                <FormGroup>
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
              <View style={styles.formContainer}>
                <FormGroup>
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
              <View style={styles.formContainer}>
                <FormGroup>
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
              {/*  <View style={styles.formContainer}>
                <FormGroup>
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
              </View> */}
              <View style={styles.formContainer}>
                <FormGroup>
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
                <FormGroup>
                  <View style={styles.dropdownWrapper}>
                    <View style={styles.dropDownIconContainerLeft}>
                      <Entypo size={18} color="#086AFB" name={"globe"} />
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
            </View>
          </WholeContainer>
          <View style={styles.footerContent}>
            <View style={styles.downloadBtnMain}>
              <WholeContainer>
                <Button
                  color="light-pink"
                  leftIcon={<ChangeRequestIcon color="pink" />}
                  onPress={handleSubmit}
                >
                  Change request
                </Button>
              </WholeContainer>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;
