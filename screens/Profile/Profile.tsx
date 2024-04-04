import React, { useEffect, useState, Fragment /* useCallback */ } from "react";
import {
  /* Text, */
  View,
  ScrollView,
  /* Switch, */
  Pressable,
  SafeAreaView,
  Platform,
  ToastAndroid,
} from "react-native";
/* import { Formik } from "formik"; */
import { useDispatch, useSelector } from "react-redux";
/* import { Picker } from "@react-native-picker/picker"; */
import Spinner from "react-native-loading-spinner-overlay/lib";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
/* import DropDownPicker from "react-native-dropdown-picker"; */
import Feather from "react-native-vector-icons/Feather";
/* import Ionicons from "react-native-vector-icons/Ionicons"; */
import { useAtom } from "jotai";
import { TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";

/* import { Tabs } from "../../components/Tabs/Tabs"; */
import MainLayout from "../../layout/Main";
/* import FormGroup from "../../components/FormGroup"; */
import Button from "../../components/Button";
import { styles } from "./styles";
import { Avatar } from "../../components/Avatar/Avatar";
import ProfileIcon from "../../assets/icons/Profile";
import vars from "../../styles/vars";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import ArrowBackIcon from "../../assets/icons/ArrowBack";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import FinancialDataGraphIcon from "../../assets/icons/FinancialDataGraph";
import LimitIcon from "../../assets/icons/Limit";
import {
  /* createTicket, */
  getProfile,
  /* updateSecurity, */
} from "../../redux/profile/profileSlice";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
/* import { Address } from "../../components/Address/Address"; */
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { signout } from "../../redux/auth/authSlice";
import { Seperator } from "../../components/Seperator/Seperator";
import {
  /* DefaultResponse,
  LimitsData, */
  UpdateLimitsRequest,
  getLimits,
  updateLimits,
} from "../../redux/setting/settingSlice";
import { RootState } from "../../store";
/* import {
  checkNumber,
  checkUppercase,
  checkSpecialCharacter,
} from "../../utils/validation";
import CompassIcon from "../../assets/icons/Compass";
import SecurityIcon from "../../assets/icons/Security";
import BellIcon from "../../assets/icons/Bell";
import SettingsIcon from "../../assets/icons/Settings";
import HelpIcon from "../../assets/icons/Help";
import IncomeBox from "../../components/IncomeBox";
import Box from "../../components/Box";
import PigIcon from "../../assets/icons/Pig";
import LockIcon from "../../assets/icons/Lock";
import TransactionIcon from "../../assets/icons/Transaction";
import Camera from "../../assets/icons/Camera";
import Ticket from "../../assets/icons/Ticket";
import ArrowDown from "../../assets/icons/ArrowDown";
import Globe from "../../assets/icons/Globe";
import Email from "../../assets/icons/Email";
import Biometric from "../../assets/icons/Biometric"; */
import { getCurrency } from "../../utils/helpers";
import ProfileTab from "../../components/ProfileComponents/ProfileTab";
import SecurityTab from "../../components/ProfileComponents/SecurityTab";
import FinancialDetailsTab from "../../components/ProfileComponents/FinancialDetailsTab";
import NotificationsTab from "../../components/ProfileComponents/NotificationsTab";
import LimitsTab from "../../components/ProfileComponents/LimitsTab";
import HelpTab from "../../components/ProfileComponents/HelpTab";
import { helpTabticketParams } from "../../utils/globalStates";

import {
  updateNotifications,
  updateBiometric,
} from "../../redux/profile/profileSlice";

import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Typography from "../../components/Typography";
/* import FinancialDataGraph from "../../assets/icons/FinancialDataGraph"; */

export interface SelectOption {
  label: string;
  value: string;
}

export function Profile({ route, navigation }: any) {
  /* const getRedirectScreen = route.params?.screen; */
  const dispatch = useDispatch();
  /* const showChangeRequest = "Y";
  const salutationOptions: SelectOption[] = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
  ];
  const sourceOfWelth: SelectOption[] = [
    { label: "Salary", value: "salary" },
    { label: "Self employed", value: "self-employed" },
  ];
  const settings = useSelector((state: RootState) => state.setting.limits); */

  const profileData = useSelector(
    (state: any) => state?.profile?.profile
  )?.data;

  const [ticketParams, setTicketParams] = useAtom(helpTabticketParams);

  /* const [isLoading, setIsLoading] = useState(false); */
  const [isUpdateLimitSuccess, setIsUpdateLimitSuccess] = useState<{
    state: boolean;
    isModalOpen: boolean;
  }>({ state: false, isModalOpen: false });
  const biometricSetting = useSelector(
    (state: any) => state.auth.data.biometricYN
  );
  const [updateLimitToggles, setUpdateLimitToggles] = useState<{
    [key: string]: boolean;
  }>({});
  const [limitValueToUpdate, setLimitValueToUpdate] = useState<{
    [key: string]: string;
  }>({});
  const [limitTypes, setLimitTypes] = useState<string>("");
  const [tabSelection, setTabSelection] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState({
    open: false,
    label: "",
    message: "",
  });

  /* const [isEnabled, setIsEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [helpTopicOpen, setHelpTopicOpen] = useState(false);
  const [openListForSalutation, setOpenListForSalutation] =
    useState<boolean>(false);
  const [openListForSourceOfWealth, setOpenListForSourceOfWealth] =
    useState<boolean>(false);
  const [selectedSourceOfWealth, setSelectedSourceOfWealth] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null); */

  /* const loadingUserProfileData = useSelector(
    (state: RootState) => state.profile.profile.loading
  ); */
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const { data: userAccountDetails, isLoading: isloadingAccountDetails } =
    useGetAccountDetailsQuery({
      accountId: userData?.id || 0,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    });

  /* useEffect(() => {
    dispatch<any>(getProfile());
    set biometric checkbox setting
    if (biometricSetting == "Y") {
      setIsBiometricEnabled(true);
    } else {
      setIsBiometricEnabled(false);
    }
    //set emailAlerts checkbox setting
    if (
      profileData?.UserProfile?.EnableAlertsYN &&
      profileData?.UserProfile?.EnableAlertsYN === "Y"
    ) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, []); */

  useEffect(() => {
    if (userData?.id) dispatch(getLimits({ account_id: userData.id }) as any);
  }, [userData]);

  useEffect(() => {
    if (ticketParams?.tabSelectionRoute === "Help") {
      setTabSelection("Help");
    }
  }, [ticketParams]);

  /* function toggleSwitch(value: boolean) {
    setIsEnabled(value);

    if (value) {
      return dispatch<any>(
        updateNotifications({ email: profileData?.email, enableYN: "Y" })
      ).then((response: any) => {
        console.log(response);
        Toast.show(response?.payload?.message, {
          duration: Toast.durations.SHORT,
        });
      });
    }
    dispatch<any>(
      updateNotifications({ email: profileData?.email, enableYN: "N" })
    ).then((response: any) => {
      Toast.show(response?.payload?.message, {
        duration: Toast.durations.SHORT,
      });
    });
  } */

  /* function toggleBiometric(value: boolean) {
    setIsBiometricEnabled(value);
    Enable or Disable Biometric authentication
    if (value) {
      return dispatch<any>(
        updateBiometric({ email: profileData?.email, enableYN: "Y" })
      ).then((response: any) => {
        console.log(response);
        let message =
          response?.payload?.message +
          " but this will take effect next time you login";
        Toast.show(message, {
          duration: Toast.durations.SHORT,
        });
      });
    }
    dispatch<any>(
      updateBiometric({ email: profileData?.email, enableYN: "N" })
    ).then((response: any) => {
      let message =
        response?.payload?.message +
        " but this will take effect next time you login";
      Toast.show(message, {
        duration: Toast.durations.SHORT,
      });
    });
  } */

  /* const updateLimitRequest = async () => {
    if (!userData?.id) return;
    let _updateRequest: UpdateLimitsRequest[] = [];
    Object.keys(updateLimitToggles).forEach((key) => {
      if (updateLimitToggles[key]) {
        _updateRequest.push({
          account_id: userData.id.toString(),
          type: key,
          limit: limitValueToUpdate[key],
        });
      }
    });
    if (_updateRequest.length === 0) {
      return;
    }
    setLimitTypes(
      _updateRequest
        .map((request) => {
          return request.type.charAt(0).toUpperCase() + request.type.slice(1);
        })
        .join(", ")
    );
    try {
      this is temporary approach to update limits
      await Promise.all(
        _updateRequest.map((request) => dispatch(updateLimits(request) as any))
      );
      setIsUpdateLimitSuccess({ state: true, isModalOpen: true });
    } catch (error) {
      console.log("error:", error);
      setIsUpdateLimitSuccess({ state: false, isModalOpen: true });
    } finally {
      setUpdateLimitToggles({});
      setLimitValueToUpdate({});
      setIsLoading(false);
    }
  }; */

  const handleShowTab = (tab: string): void => {
    setTabSelection(tab);
  };

  const handleCopyToClipboard = async (textData: string) => {
    await Clipboard.setStringAsync(textData || "");
    setSnackBarMessage({
      open: true,
      label: "Ok",
      message: "Copied text from clipboard",
    });
  };

  const cleanUpTabSelection = () => setTabSelection("");

  const handleCloseBottomSheet = (): void => {
    setTicketParams({
      tabSelectionRoute: "",
      isOpenBottomSheet: false,
      passedTicketType: "",
      transactionReferenceNumber: "",
    });
  };

  const displayTabSelection = () => {
    switch (tabSelection) {
      case "Edit profile": {
        return <ProfileTab />;
      }
      case "Security": {
        return <SecurityTab />;
      }
      case "Financial data": {
        return <FinancialDetailsTab />;
      }
      case "Notifications": {
        return <NotificationsTab cleanUpTabSelection={cleanUpTabSelection} />;
      }
      case "Limits": {
        return <LimitsTab cleanUpTabSelection={cleanUpTabSelection} />;
      }
      case "Help": {
        return (
          <HelpTab
            isOpenBottomSheet={ticketParams.isOpenBottomSheet}
            passedTicketType={ticketParams.passedTicketType}
            transactionReferenceNumber={ticketParams.transactionReferenceNumber}
            handleCloseBottomSheet={handleCloseBottomSheet}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <MainLayout navigation={navigation}>
        <Spinner visible={isloadingAccountDetails} />
        <SuccessModal
          isOpen={isUpdateLimitSuccess.isModalOpen}
          isError={!isUpdateLimitSuccess.state}
          title={isUpdateLimitSuccess.state ? "Success" : "Error"}
          text={
            isUpdateLimitSuccess.state
              ? `${limitTypes} are on the process to update.`
              : "Something went wrong"
          }
          onClose={() =>
            setIsUpdateLimitSuccess({
              state: false,
              isModalOpen: false,
            })
          }
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View
            // bounces={false}
            /* style={{ backgroundColor: "#fff" }} */
            style={{ flexGrow: 1 }}
          >
            {/* <IncomeBox />
          <View style={styles.content}>
            <Tabs screen={getRedirectScreen}>
              <Tabs.Panel text="Profile" icon={<ProfileIcon />}>
                <Formik
                  initialValues={{
                    salutation: profileData?.salutation,
                    first_name: profileData?.first_name,
                    last_name: profileData?.last_name,
                    annual_salary: profileData?.UserProfile?.annualSalary,
                    source_of_wealth: profileData?.source_of_wealth,
                  }}
                  validate={(values) => {
                    let errors: any = {};
                    if (!values.salutation) errors.salutation = "Required";
                    if (!values.first_name) errors.first_name = "Required";
                    if (!values.last_name) errors.last_name = "Required";
                    if (!values.annual_salary)
                      errors.annual_salary = "Required";
                    if (!values.source_of_wealth)
                      errors.source_of_wealth = "Required";
                    return errors;
                  }}
                  onSubmit={(values) => {
                    console.log({ values });
                  }}
                >
                  {({
                    handleBlur,
                    handleChange,
                    values,
                    errors,
                    setValues,
                  }) => (
                    <View style={styles.tabContent}>
                      <View style={styles.row}>
                        <View style={{ flex: 0.3 }}>
                          <FormGroup validationError={errors.salutation}>
                            <Avatar
                              isBase64Image
                              src={profileData?.UserProfile?.profileimage}
                              fileUpload
                              size="large"
                              icon={<Camera color="blue" size={34} />}
                            />
                          </FormGroup>
                        </View>
                        <View style={{ flex: 0.7 }}>
                          <Text style={styles.titleTag}>{`Salutation`}</Text>
                          <DropDownPicker
                            schema={{ label: "label", value: "value" }}
                            onSelectItem={(value: any) => {
                              const { value: salutationValue } = value;
                              setValues({
                                ...values,
                                salutation: salutationValue,
                              });
                            }}
                            listMode="SCROLLVIEW"
                            items={salutationOptions}
                            value={values.salutation}
                            setOpen={setOpenListForSalutation}
                            open={openListForSalutation}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                            dropDownDirection="TOP"
                          />
                        </View>
                      </View>
                      <View style={{ flex: 0.7 }}>
                        <FormGroup validationError={errors.first_name}>
                          <Text style={styles.titleTag}>{`First name`}</Text>
                          <FormGroup.Input
                            icon={<ProfileIcon />}
                            onChangeText={handleChange("first_name")}
                            onBlur={handleBlur("first_name")}
                            value={values.first_name}
                            placeholder="First name"
                          />
                        </FormGroup>
                      </View>
                      <FormGroup validationError={errors.last_name}>
                        <Text style={styles.titleTag}>{`Last name`}</Text>
                        <FormGroup.Input
                          icon={<ProfileIcon />}
                          onChangeText={handleChange("last_name")}
                          onBlur={handleBlur("last_name")}
                          value={values.last_name}
                          placeholder="Last name"
                        />
                        <Seperator
                          backgroundColor={vars["light-grey"]}
                          marginTop={18}
                        />
                      </FormGroup>
                      <FormGroup validationError={errors.annual_salary}>
                        <Text style={styles.titleTag}>{`Annual Salary`}</Text>

                        <FormGroup.Input
                          icon={<PigIcon />}
                          onChangeText={handleChange("annual_salary")}
                          onBlur={handleBlur("annual_salary")}
                          value={values.annual_salary}
                          placeholder="Annual salary"
                        />
                      </FormGroup>
                      <FormGroup validationError={errors.source_of_wealth}>
                        <Text
                          style={styles.titleTag}
                        >{`Source of income`}</Text>

                        <DropDownPicker
                          schema={{ label: "label", value: "value" }}
                          onSelectItem={(value: any) => {
                            const { value: sourceOfWealthValue } = value;
                            setValues({
                              ...values,
                              source_of_wealth: sourceOfWealthValue,
                            });
                          }}
                          listMode="SCROLLVIEW"
                          setValue={(value: any) =>
                            setSelectedSourceOfWealth(value)
                          }
                          items={sourceOfWelth}
                          value={values.source_of_wealth}
                          setOpen={setOpenListForSourceOfWealth}
                          open={openListForSourceOfWealth}
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropdownContainer}
                          dropDownDirection="TOP"
                        />
                      </FormGroup>
                      <View style={{ flexDirection: "row", paddingLeft: 12 }}>
                        <Button
                          leftIcon={<TransactionIcon color="blue" />}
                          color="light-blue"
                        >
                          Change request
                        </Button>
                      </View>
                    </View>
                  )}
                </Formik>
              </Tabs.Panel>

              <Tabs.Panel text="Address" icon={<CompassIcon />}>
                <Address
                  profileData={profileData}
                  showChangeRequest={showChangeRequest}
                />
              </Tabs.Panel>

              <Tabs.Panel text="Security" icon={<SecurityIcon />}>
                <Formik
                  initialValues={{
                    first_name: profileData?.first_name,
                    last_name: profileData?.last_name,
                    password: "",
                    old_password: "",
                    password_confirmation: "",
                  }}
                  validate={(values) => {
                    let errors: any = {};
                    if (!values.password) errors.password = "Required";
                    if (!values.old_password) errors.old_password = "Required";
                    if (!values.password_confirmation)
                      errors.password_confirmation = "Required";
                    if (values.password.length < 8)
                      errors.notEnoughCharacters = true;
                    if (values.password !== values.password_confirmation)
                      errors.password_confirmation = "Passwords do not match";
                    if (!checkUppercase(values.password))
                      errors.hasUpperCase = true;
                    if (!checkNumber(values.password)) errors.hasNumber = true;
                    if (!checkSpecialCharacter(values.password))
                      errors.hasSpecialCharacters = true;
                    return errors;
                  }}
                  onSubmit={(values) => {
                    dispatch(updateSecurity(values) as any);
                  }}
                >
                  {({
                    handleBlur,
                    handleChange,
                    values,
                    errors,
                    handleSubmit,
                  }: any) => (
                    <View style={styles.tabContent}>
                      <View style={styles.biometric__switch}>
                        <View style={styles.biometric__switch__text}>
                          <Biometric color="blue" size={18} />
                          <Text>Enable Biometric Authentication</Text>
                        </View>
                        <View style={{ marginLeft: "auto" }}>
                          <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={
                              isBiometricEnabled ? "white" : vars["light-blue"]
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(e) => toggleBiometric(e)}
                            value={isBiometricEnabled}
                          />
                        </View>
                      </View>
                      <FormGroup validationError={errors.old_password}>
                        <FormGroup.Password
                          icon={<LockIcon />}
                          rightIcon
                          onChangeText={handleChange("old_password")}
                          onBlur={handleBlur("old_password")}
                          value={values.old_password}
                          placeholder="current password"
                        />
                      </FormGroup>
                      <FormGroup validationError={errors.password}>
                        <FormGroup.Password
                          icon={<LockIcon />}
                          rightIcon
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder="new password"
                        />
                      </FormGroup>
                      <FormGroup validationError={errors.password_confirmation}>
                        <FormGroup.Password
                          icon={<LockIcon />}
                          rightIcon
                          onChangeText={handleChange("password_confirmation")}
                          onBlur={handleBlur("password_confirmation")}
                          value={values.password_confirmation}
                          placeholder="password confirmation"
                        />
                      </FormGroup>
                      <Box
                        sx={{
                          flexDirection: "row",
                          paddingLeft: 24,
                          paddingBottom: 24,
                          paddingTop: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: errors.notEnoughCharacters
                              ? vars.red
                              : vars.green,
                          }}
                        >
                          Minimum 8 character |{" "}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: errors.hasUpperCase ? vars.red : vars.green,
                          }}
                        >
                          upper case |{" "}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: errors.hasNumber ? vars.red : vars.green,
                          }}
                        >
                          number |{" "}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: errors.hasSpecialCharacters
                              ? vars.red
                              : vars.green,
                          }}
                        >
                          special character
                        </Text>
                      </Box>

                      <View style={{ flexDirection: "row", paddingLeft: 12 }}>
                        <Button onPress={handleSubmit} color="light-pink">
                          Submit
                        </Button>
                      </View>
                    </View>
                  )}
                </Formik>
              </Tabs.Panel>

              <Tabs.Panel text="Notifications" icon={<BellIcon />}>
                <View style={styles.tabContent}>
                  <View style={styles.notification__switch}>
                    <View style={styles.notification__switch__text}>
                      <Email color="blue" size={18} />
                      <Text>Receive email Notifications</Text>
                    </View>
                    <View style={{ marginLeft: "auto" }}>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "white" : vars["light-blue"]}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(e) => toggleSwitch(e)}
                        value={isEnabled}
                      />
                    </View>
                  </View>
                </View>
              </Tabs.Panel>

              <Tabs.Panel
                text="Limits"
                icon={<SettingsIcon color={undefined} />}
              >
                <Formik
                  initialValues={{}}
                  validate={() => {}}
                  onSubmit={() => {}}
                >
                  {({}) => (
                    <Pressable>
                      <View style={styles.tabContent}>
                        {settings.map((setting: LimitsData, index: number) => {
                          const { type } = setting;
                          const limitType =
                            type.charAt(0).toUpperCase() + type.slice(1);
                          return (
                            <FormGroup key={index}>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <FormGroup.Label>
                                  {`${limitType}`} limit
                                </FormGroup.Label>
                                <Switch
                                  trackColor={{
                                    false: "#767577",
                                    true: "#81b0ff",
                                  }}
                                  thumbColor={
                                    updateLimitToggles[type]
                                      ? "white"
                                      : vars["light-blue"]
                                  }
                                  style={{ marginTop: -17 }}
                                  ios_backgroundColor="#3e3e3e"
                                  onValueChange={(e) =>
                                    setUpdateLimitToggles({
                                      ...updateLimitToggles,
                                      [type]: e,
                                    })
                                  }
                                  value={updateLimitToggles[type]}
                                />
                              </View>
                              <FormGroup.Input
                                editable={
                                  updateLimitToggles[type]
                                    ? updateLimitToggles[type]
                                    : false
                                }
                                placeholder={`€${setting.limit_reached} / €${setting.limit}`}
                                onChangeText={(value: string) => {
                                  setLimitValueToUpdate({
                                    ...limitValueToUpdate,
                                    [type]: value,
                                  });
                                }}
                              />
                            </FormGroup>
                          );
                        })}
                        <View style={{ flexDirection: "row", paddingLeft: 12 }}>
                          <Button
                            leftIcon={<TransactionIcon color="blue" />}
                            color="light-blue"
                            onPress={() => {
                              setIsLoading(true);
                              updateLimitRequest();
                            }}
                          >
                            Change request
                          </Button>
                        </View>
                      </View>
                    </Pressable>
                  )}
                </Formik>
              </Tabs.Panel>

              <Tabs.Panel text="Help" icon={<HelpIcon />}>
                <View style={styles.tabContent}>
                  <View style={styles.tabDropDown}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ticket color={"blue"} size={18} />
                      <Text style={{ fontWeight: "400", fontSize: 16 }}>
                        Create ticket
                      </Text>
                    </View>
                    < 
                      onPress={() => setDropDownOpen(!dropDownOpen)}
                    >
                      <ArrowDown
                        style={
                          dropDownOpen && { transform: [{ rotate: "180deg" }] }
                        }
                        size={18}
                        color={"black"}
                      />
                    </>
                  </View>
                  {dropDownOpen && (
                    <Formik
                      initialValues={{
                        type: "",
                        dateSubmitted: new Date().toISOString(),
                        ticketValue: "",
                        receive_mail: profileData.email,
                      }}
                      validate={(values) => {
                        let errors: any = {};
                        if (!values.ticketValue)
                          errors.ticketValue = "Required";
                        return errors;
                      }}
                      onSubmit={async (values) => {
                        var data = await dispatch<any>(
                          createTicket({
                            type: "helpdesk issue Request",
                            dateSubmitted: values.dateSubmitted,
                            ticketValue: [
                              {
                                help: {
                                  type: values.type,
                                  value: values.ticketValue,
                                },
                              },
                            ],
                            receive_mail: values.receive_mail,
                          })
                        );
                        if (data) {
                          Toast.show("Ticket created!", {
                            duration: Toast.durations.SHORT,
                          });
                        }
                      }}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                      }) => (
                        <View>
                          <FormGroup validationError={errors.type}>
                            <View style={styles.dropdownContainer}>
                              <Globe color={"blue"} />
                              <DropDownPicker
                                placeholder="Subject of the issue"
                                style={styles.dropdown}
                                open={helpTopicOpen}
                                value={selectedTicketType}
                                items={[
                                  { label: "Techincal", value: "technical" },
                                  { label: "Access", value: "access" },
                                  { label: "Payment", value: "payment" },
                                  {
                                    label: "Beneficiary",
                                    value: "beneficiary",
                                  },
                                  { label: "Card", value: "card" },
                                  { label: "Profile", value: "profile" },
                                  {
                                    label: "Transactions",
                                    value: "transactions",
                                  },
                                ]}
                                setValue={setSelectedTicketType}
                                setOpen={setHelpTopicOpen}
                                listMode="SCROLLVIEW"
                              />
                            </View>
                          </FormGroup>

                          <View style={styles.txtArea}>
                            <FormGroup validationError={errors.ticketValue}>
                              <FormGroup.TextArea
                                onChangeText={handleChange("ticketValue")}
                                onBlur={handleBlur("ticketValue")}
                                value={values.ticketValue}
                                backgroundColor={"#F9F9F9"}
                                placeholder="Type here your issue"
                              />
                            </FormGroup>

                            <Button
                              onPress={handleSubmit}
                              color="light-pink"
                              leftIcon={
                                <TransactionIcon color="pink" size={16} />
                              }
                              style={{
                                width: 97,
                                marginLeft: 18,
                                marginTop: 20,
                              }}
                            >
                              Submit
                            </Button>
                          </View>
                        </View>
                      )}
                    </Formik>
                  )}
                  <Seperator
                    backgroundColor={vars["input-light-grey"]}
                    marginTop={24}
                    width={"93%"}
                    marginLeft={12}
                  />
                  <Text
                    style={{ marginTop: -14, marginLeft: 23, fontSize: 16 }}
                  >
                    If you need help please visit one of our page
                  </Text>
                  <View style={styles.buttonBox}>
                    <Button
                      color="light-pink"
                      leftIcon={<TransactionIcon color="pink" size={16} />}
                      style={{ fontSize: 14 }}
                    >
                      FAQ
                    </Button>
                    <Button
                      color="light-pink"
                      leftIcon={<TransactionIcon color="pink" size={16} />}
                    >
                      Help
                    </Button>
                  </View>
                </View>
              </Tabs.Panel>
              <Tabs.Panel
                text="Log Out"
                icon={<Ionicons name={"ios-exit-outline"} />}
                onPress={async () => {
                  dispatch(signout());
                }}
              />
            </Tabs>
          </View> */}
            <View style={{ backgroundColor: vars["light-grey"] }}>
              {tabSelection === "" && (
                <Fragment>
                  <View style={[styles.headerProfile, styles.borderRadiusBox]}>
                    <View style={styles.headerProfileLeft}>
                      {profileData?.UserProfile?.profileimage ? (
                        <Avatar
                          isBase64Image
                          src={profileData?.UserProfile?.profileimage}
                          fileUpload
                          size="medium"
                          icon={false}
                        />
                      ) : null}
                      <View style={{ marginLeft: 8 }}>
                        <Typography color="#086AFB" fontSize={14}>
                          Hello
                        </Typography>
                        <Typography
                          color="#000000"
                          fontSize={20}
                          fontWeight="bold"
                          padding={0}
                          marginTop={-6}
                        >
                          {profileData?.first_name}
                        </Typography>
                      </View>
                    </View>
                    <View style={styles.headerProfileRight}>
                      <Button
                        leftIcon={<ProfileIcon color="pink" size={14} />}
                        color="light-pink"
                        onPress={() => handleShowTab("Edit profile")}
                      >
                        Edit profile
                      </Button>
                    </View>
                  </View>
                  <View style={{ margin: 10 }}>
                    {userAccountDetails?.data?.info?.iban ? (
                      <View
                        style={[
                          styles.boxIncomeDetails,
                          styles.borderRadiusBox,
                        ]}
                      >
                        <Typography fontSize={12} color="medium-grey2">
                          IBAN
                        </Typography>
                        <View style={styles.textIbanBicCurrencyContainer}>
                          <Typography fontSize={16} color="#000000">
                            {userAccountDetails?.data?.info?.iban}
                          </Typography>
                          <TouchableOpacity
                            onPress={() =>
                              handleCopyToClipboard(
                                userAccountDetails?.data?.info?.iban
                              )
                            }
                          >
                            <View>
                              <CopyClipboard color="blue" size={16} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}

                    <View style={{ marginTop: 10 }}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        {userAccountDetails?.data?.info?.bic ? (
                          <View
                            style={[
                              styles.boxIncomeDetails,
                              {
                                flexGrow: 1,
                              },
                              styles.borderRadiusBox,
                            ]}
                          >
                            <Typography fontSize={12} color="medium-grey2">
                              BIC
                            </Typography>
                            <View style={styles.textIbanBicCurrencyContainer}>
                              <Typography fontSize={16} color="#000000">
                                {userAccountDetails?.data?.info?.bic}
                              </Typography>
                              <TouchableOpacity
                                onPress={() =>
                                  handleCopyToClipboard(
                                    userAccountDetails?.data?.info?.bic
                                  )
                                }
                              >
                                <View>
                                  <CopyClipboard color="blue" size={16} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                        {userAccountDetails?.data?.curbal ? (
                          <View
                            style={[
                              styles.boxIncomeDetails,
                              {
                                flexGrow: 4,
                              },
                              styles.borderRadiusBox,
                            ]}
                          >
                            <Typography fontSize={12} color="medium-grey2">
                              Amount:
                            </Typography>
                            <View style={styles.textIbanBicCurrencyContainer}>
                              <View style={styles.currencyContainer}>
                                <Typography fontSize={16} color="#000000">
                                  {getCurrency(
                                    userAccountDetails?.data?.currency
                                  )}
                                </Typography>
                                <Typography fontSize={16} color="#000000">
                                  {userAccountDetails?.data?.curbal}
                                </Typography>
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  handleCopyToClipboard(
                                    userAccountDetails?.data?.curbal
                                  )
                                }
                              >
                                <View>
                                  <CopyClipboard color="blue" size={16} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                  <Pressable>
                    <Seperator
                      backgroundColor={vars["grey"]}
                      width="100%"
                      marginTop={28}
                    />
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Security");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <MaterialIcons
                                color="#086afb"
                                size={20}
                                name={"lock-outline"}
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={600}
                              marginLeft={8}
                            >
                              Security
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Financial data");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <FinancialDataGraphIcon
                                color="#086afb"
                                size={16}
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={600}
                              marginLeft={8}
                            >
                              Financial data
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Notifications");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <Feather color="#086afb" size={16} name="bell" />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={600}
                              marginLeft={8}
                            >
                              Notifications
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Limits");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <LimitIcon color="#086afb" size={18} />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={600}
                              marginLeft={8}
                            >
                              Limits
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Help");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <Feather
                                color="#086afb"
                                size={18}
                                name="life-buoy"
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={600}
                              marginLeft={8}
                            >
                              Help
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(signout());
                        }}
                      >
                        <View>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <MaterialIcons
                                color="#e7038e"
                                size={20}
                                name={"logout"}
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={600}
                              marginLeft={8}
                            >
                              Logout
                            </Typography>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />
                  </Pressable>
                </Fragment>
              )}
              {tabSelection !== "" ? (
                <Fragment>
                  <View
                    style={[
                      styles.containerTab,
                      {
                        overflow: "hidden",
                      },
                    ]}
                  >
                    <View
                      style={{
                        backgroundColor: "#fff",
                        ...Platform.select({
                          ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 1, height: 3 },
                            shadowOpacity: 0.2,
                          },
                          android: {
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            elevation: 5,
                          },
                        }),
                      }}
                    >
                      <TouchableOpacity onPress={() => setTabSelection("")}>
                        <View style={styles.containerBackBtn}>
                          <View style={styles.btnBack}>
                            <ArrowBackIcon color="blue" size={14} />
                          </View>
                          <Typography
                            fontSize={18}
                            fontWeight={600}
                            fontFamily="Nunito-SemiBold"
                          >
                            {tabSelection}
                          </Typography>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {displayTabSelection()}
                </Fragment>
              ) : null}
            </View>
          </View>
        </SafeAreaView>
        {/* {displayTabSelection()} */}
      </MainLayout>
      <Snackbar
        visible={snackBarMessage.open}
        onDismiss={() =>
          setSnackBarMessage({ open: false, label: "", message: "" })
        }
        action={{
          label: "Ok",
          onPress: () => {
            setSnackBarMessage({ open: false, label: "", message: "" });
          },
        }}
        duration={3000}
      >
        <View>
          <Typography fontFamily="Nunito-Regular" fontSize={14} color="#fff">
            {snackBarMessage.message}
          </Typography>
        </View>
      </Snackbar>
    </Fragment>
  );
}
