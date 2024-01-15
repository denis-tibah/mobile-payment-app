import { FC, useState, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";

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

interface IProfileTab {
  cleanUpTabSelection: () => void;
}

const ProfileTab: FC<IProfileTab> = ({ cleanUpTabSelection }) => {
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
  } = useFormik({
    initialValues: {
      salutation: profileData?.salutation || "",
      firstName: profileData?.first_name || "",
      lastName: profileData?.last_name || "",
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
          <View style={{ paddingHorizontal: 22, paddingBottom: 12 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: 12,
              }}
            >
              <View style={{ flexGrow: 1 }}>
                {profileData?.UserProfile?.profileimage ? (
                  <Avatar
                    isBase64Image
                    src={profileData?.UserProfile?.profileimage}
                    fileUpload
                    size="medium"
                    icon={<Camera color="blue" size={34} />}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flexGrow: 4,
                  width: "80%",
                }}
              >
                <FormGroup
                  validationError={
                    errors.salutation && touched.salutation && errors.salutation
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
                  iconColor="blue"
                  icon={<ProfileIcon size={10} />}
                />
              </FormGroup>
            </View>
            <View style={styles.separatorContainer}>
              <Seperator
                backgroundColor={vars["medium-grey"]}
                marginTop={18}
                marginBottom={16}
                width="94%"
              />
            </View>
            <View style={[styles.formContainer, styles.addressHeader]}>
              <CompassIcon color="blue" size={18} />
              <Typography fontSize={16} marginLeft={4}>
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
                  icon={<KeyIcon />}
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
            <View style={styles.formContainer}>
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
            </View>
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
                    <CityIcon size={16} color="blue" />
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
          <View style={styles.footerContent}>
            <View style={styles.downloadBtnMain}>
              <Button
                color="light-pink"
                leftIcon={<ChangeRequestIcon color="pink" />}
                onPress={handleSubmit}
              >
                Change request
              </Button>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ProfileTab;
