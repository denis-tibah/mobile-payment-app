import React, { useEffect, useState } from "react";
import { StyleSheet,Text, View, ScrollView, Switch } from "react-native";
import { Tabs } from "../../components/Tabs/Tabs";
import MainLayout from "../../layout/Main";
import FormGroup from "../../components/FormGroup";
import Button from "../../components/Button";
import { styles } from "./styles";
import { Formik } from "formik";
import { Avatar } from "../../components/Avatar/Avatar";
import {
  checkNumber,
  checkUppercase,
  checkSpecialCharacter,
} from "../../utils/validation";
import ProfileIcon from "../../assets/icons/Profile";
import CompassIcon from "../../assets/icons/Compass";
import SecurityIcon from "../../assets/icons/Security";
import BellIcon from "../../assets/icons/Bell";
import SettingsIcon from "../../assets/icons/Settings";
import HelpIcon from "../../assets/icons/Help";
import IncomeBox from "../../components/IncomeBox";
import Box from "../../components/Box";
import vars from "../../styles/vars";
import StatusIcon from "../../assets/icons/Status";
import PigIcon from "../../assets/icons/Pig";
import LockIcon from "../../assets/icons/Lock";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicket,
  getProfile,
  updateSecurity,
} from "../../redux/profile/profileSlice";
import { Address } from "../../components/Address/Address";
import KeyboardDismiss from "../../components/KeyboardDismiss";
import Ionicons from "react-native-vector-icons/Ionicons";
import { signout } from "../../redux/auth/authSlice";
import { Seperator } from "../../components/Seperator/Seperator";
import TransactionIcon from "../../assets/icons/Transaction";
import { getLimits } from "../../redux/setting/settingSlice";
import { RootState } from "../../store";
import * as SecureStore from "expo-secure-store";
import Camera from "../../assets/icons/Camera";
import Ticket from "../../assets/icons/Ticket";
import ArrowDown from "../../assets/icons/ArrowDown";
import { TouchableOpacity } from "react-native";
import Globe from "../../assets/icons/Globe";
import { Picker } from "@react-native-picker/picker";
import Spinner from "react-native-loading-spinner-overlay/lib";
import Email from "../../assets/icons/Email";
import { updateNotifications } from "../../redux/profile/profileSlice";
import Toast from "react-native-root-toast";
import DropDownPicker from "react-native-dropdown-picker";

export function Profile({ navigation }: any) {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.setting.data);
  const profileData = useSelector(
    (state: any) => state?.profile?.profile
  )?.data;
  const [isEnabled, setIsEnabled] = useState(false);
  const [limitIsEnabled, setLimitIsEnabled] = useState<boolean>(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const [helpTopicOpen, setHelpTopicOpen] = useState(false);
  const loadingUserProfileData = useSelector(
    (state: RootState) => state.profile.profile.loading
  );

  const showChangeRequest ='Y';

  // const [open, setOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [selectedTicketValue, setSelectedTicketValue] = useState(null);
  // const [items, setItems] = useState([
  //   {label: 'Apple', value: 'apple'},
  //   {label: 'Banana', value: 'banana'}
  // ]);

  useEffect(() => {
    dispatch<any>(getProfile());
  }, []);

  useEffect(() => {
    if (userData?.id) dispatch(getLimits({ account_id: userData.id }) as any);
  }, [userData]);

  function toggleSwitch(value: boolean) {
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
  }

  function toggleLimitIsEnabled(value: boolean) {
    setLimitIsEnabled(value);
  }

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={loadingUserProfileData} />
      <ScrollView bounces={false}>
        <IncomeBox />
        {/* content */}
        <View style={styles.content}>
          <Tabs>
            <Tabs.Panel text="Profile" icon={<ProfileIcon />}>
              <Formik
                // enableReinitialize
                initialValues={{
                  salutation: profileData?.salutation,
                  first_name: profileData?.first_name,
                  last_name: profileData?.last_name,
                  annual_salary: profileData?.UserProfile?.annualSalary,
                  source_of_wealth: profileData?.UserProfile?.sourceOfWealth,
                }}
                validate={(values) => {
                  let errors: any = {};
                  if (!values.salutation) errors.salutation = "Required";
                  if (!values.first_name) errors.first_name = "Required";
                  if (!values.last_name) errors.last_name = "Required";
                  if (!values.annual_salary) errors.annual_salary = "Required";
                  if (!values.source_of_wealth)
                    errors.source_of_wealth = "Required";
                  return errors;
                }}
                onSubmit={(values) => {
                  console.log({ values });
                }}
              >
                {({ handleBlur, handleChange, values, errors }) => (
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
                        <FormGroup validationError={errors.salutation}>
                          <FormGroup.Input
                            icon={<StatusIcon color={undefined} />}
                            onChangeText={handleChange("salutation")}
                            onBlur={handleBlur("salutation")}
                            values={values.salutation}
                            placeholder="salutation"
                          />
                        </FormGroup>
                      </View>
                    </View>
                    <View style={{ flex: 0.7 }}>
                      <FormGroup validationError={errors.first_name}>
                        <FormGroup.Input
                          icon={<ProfileIcon />}
                          onChangeText={handleChange("first_name")}
                          onBlur={handleBlur("first_name")}
                          value={values.first_name}
                          placeholder="first name"
                        />
                      </FormGroup>
                    </View>
                    <FormGroup validationError={errors.last_name}>
                      <FormGroup.Input
                        icon={<ProfileIcon />}
                        onChangeText={handleChange("last_name")}
                        onBlur={handleBlur("last_name")}
                        value={values.last_name}
                        placeholder="last name"
                      />
                      <Seperator
                        backgroundColor={vars["light-grey"]}
                        marginTop={18}
                      />
                    </FormGroup>
                    <FormGroup validationError={errors.annual_salary}>
                      <FormGroup.Input
                        icon={<PigIcon />}
                        onChangeText={handleChange("annual_salary")}
                        onBlur={handleBlur("annual_salary")}
                        value={values.annual_salary}
                        placeholder="annual salary"
                      />
                    </FormGroup>
                    <FormGroup validationError={errors.source_of_wealth}>
                      <FormGroup.Input
                        icon={<PigIcon />}
                        onChangeText={handleChange("source_of_wealth")}
                        onBlur={handleBlur("source_of_wealth")}
                        value={values.source_of_wealth}
                        placeholder="source of wealth"
                      />
                    </FormGroup>
                    <View style={{ flexDirection: "row", paddingLeft: 12 }}>
                      <Button
                        leftIcon={<TransactionIcon color="pink" />}
                        color="light-pink"
                      >
                        Change request
                      </Button>
                    </View>
                  </View>
                )}
              </Formik>
            </Tabs.Panel>

            <Tabs.Panel text="Address" icon={<CompassIcon />}>
              <Address profileData={profileData} showChangeRequest={showChangeRequest} />
            </Tabs.Panel>

            <Tabs.Panel text="Security" icon={<SecurityIcon />}>
              <Formik
                // enableReinitialize
                initialValues={{
                  first_name: profileData?.first_name,
                  last_name: profileData?.last_name,
                  password: "",
                  old_password: "",
                  password_confirmation: "",
                  // first_name: "",
                  // last_name: "",
                  // password: "",
                  // old_password: "",
                  // password_confirmation: "",
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
                  // dispatch(createTicket(values));
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
                {/* <View style={styles.notification__switch}>
                  <View style={styles.notification__switch__text}>
                    <BellIcon color="blue" size={18} />
                    <Text>Notifications when limit is reached</Text>
                  </View>
                  <View style={{ marginLeft: "auto" }}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isEnabled ? "white" : vars["light-blue"]}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(e) => toggleLimitIsEnabled(e)}
                      value={limitIsEnabled}
                    />
                  </View>
                </View> */}
              </View>
            </Tabs.Panel>

            <Tabs.Panel text="Limits" icon={<SettingsIcon color={undefined} />}>
              <Formik
                // enableReinitialize
                initialValues={{}}
                validate={() => {}}
                onSubmit={() => {}}
              >
                {({}) => (
                  <View style={styles.tabContent}>
                    <FormGroup>
                      <FormGroup.Label> 1 day limit </FormGroup.Label>
                      <FormGroup.Input
                        editable={false}
                        placeholder={
                          "€" +
                          settings?.daily?.limit_reached +
                          "/" +
                          "€" +
                          settings.daily.limit
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormGroup.Label>7 day limit</FormGroup.Label>
                      <FormGroup.Input
                        editable={false}
                        placeholder={
                          "€" +
                          settings?.weekly?.limit_reached +
                          "/" +
                          "€" +
                          settings.weekly.limit
                        }
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormGroup.Label>1 month limit</FormGroup.Label>
                      <FormGroup.Input
                        editable={false}
                        placeholder={
                          "€" +
                          settings?.monthly?.limit_reached +
                          "/" +
                          "€" +
                          settings.monthly.limit
                        }
                      />
                    </FormGroup>
                  </View>
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
                  <TouchableOpacity
                    onPress={() => setDropDownOpen(!dropDownOpen)}
                
                  >
                    <ArrowDown
                      style={
                        dropDownOpen && { transform: [{ rotate: "180deg" }] }
                      }
                      size={18}
                      color={"black"}
                    />
                  </TouchableOpacity>
                </View>
                {dropDownOpen && (
                  <Formik
                    // enableReinitialize
                    initialValues={{
                      type: "",
                      dateSubmitted: new Date().toISOString(),
                      ticketValue: "",
                      receive_mail: profileData.email,
                    }}
                    validate={(values) => {
                      let errors: any = {};
                      if (!values.type) errors.type = "Required";
                      if (!values.ticketValue) errors.ticketValue = "Required";
                      return errors;
                    }}
                    onSubmit={async (values) => {
                      
                      console.log('create ticket', values, 'values.type', values.type);

                      await dispatch<any>(createTicket(values));
                      Toast.show("Ticket created!", {
                        duration: Toast.durations.SHORT,
                      });
                    }}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      // setFieldValue,
                      values,
                      errors,
                      // setValues,
                    }) => (
                      
                    
                      <View>
                            

                        <FormGroup validationError={errors.type}> 

                          {/* <View style={[styles.wrapper, {zIndex: 1}]}> */}
                          <View style={styles.dropdownContainer}>
                          {/* <View>  */}
                            {/* style={[{ backgroundColor: '#6638f0' }]} > */}
                            <Globe color={"blue"} />
                            {/* <DropDownPicker
                              placeholder="Subject of the issue"
                              style={styles.dropdown}
                              open={helpTopicOpen}
                              value={values.type}
                              items={[
                                { label: "Techincal", value: "technical" },
                                { label: "Access", value: "access" },
                                { label: "Payment", value: "payment" },
                                { label: "Beneficiary", value: "beneficiary" },
                                { label: "Card", value: "card" },
                                { label: "Profile", value: "profile" },
                                {
                                  label: "Transactions",
                                  value: "transactions",
                                },
                              ]}
                              setOpen={setHelpTopicOpen}
                              setValue={(v) => setFieldValue("type", v)}
                              onChangeValue={(v) => setFieldValue("type", v)}
                              listMode="SCROLLVIEW"
                              dropDownContainerStyle={styles.dropdownContainer}
                              zIndex={100}
                            /> */}


                 <DropDownPicker
                    placeholder="Subject of the issue"
                    style={styles.dropdown}
                    open={helpTopicOpen}
                    // value={values.type}
                    value={selectedTicketType}
                      items={[
                        { label: "Techincal", value: "technical" }, 
                        { label: "Access", value: "access" },
                        { label: "Payment", value: "payment" },
                        { label: "Beneficiary", value: "beneficiary" },
                        { label: "Card", value: "card" },
                        { label: "Profile", value: "profile" },
                        {
                          label: "Transactions",
                          value: "transactions",
                        },
                  ]}
                  setValue={setSelectedTicketType}
                  // setItems={setItems}
                  setOpen={setHelpTopicOpen}
                  // onChangeValue={(v) => setFieldValue("type", v)}
                  // onChangeValue={(value) => {
                  //   console.log(value);
                  //   // setSelectedTicketValue('value');
                  // }}
                  listMode="SCROLLVIEW"
                   />

{/* <DropDownPicker
     placeholder="Aristos test"
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    /> */}
                {/* </View> */}
                
                            
                            {/* <Picker
                              selectedValue={values.type}
                              onValueChange={handleChange("type")}
                              style={styles.picker}
                            >
                              <FormGroup.Option
                                label="Subject of the issue "
                                value="testing"
                              />

                              <FormGroup.Option
                                label="option 1"
                                value="value option1"
                              />
                              <FormGroup.Option
                                label={"option 2"}
                                value={"value option 2"}
                              />
                            </Picker> */}
                          </View>
                        </FormGroup>

                        
                         <View style={styles.txtArea}> 
                                <FormGroup
                                  validationError={errors.ticketValue}
                                  // style={{ justifyContent: "start"}}
                                  // zIndex={0}
                                  // style={styles.txtArea}
                                >
                                  <FormGroup.TextArea
                                    onChangeText={handleChange("ticketValue")}
                                    onBlur={handleBlur("ticketValue")}
                                    value={values.ticketValue}
                                    backgroundColor={'#F9F9F9'}
                                    placeholder="Type here your issue"
                                  
                                  />
                                </FormGroup>
                             
                                    <Button
                                      onPress={handleSubmit}
                                      color="light-pink"
                                      leftIcon={<TransactionIcon color="pink" size={16} />}
                                      style={{ width: 97, marginLeft: 18,marginTop:20 }}
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
                <Text style={{ marginTop: -14, marginLeft: 23, fontSize: 16 }}>
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
                await SecureStore.deleteItemAsync("email");
                await SecureStore.deleteItemAsync("password");
                dispatch(signout());
              }}
            />
          </Tabs>
        </View>
      </ScrollView>
    </MainLayout>
  );
  
}

// const styles = StyleSheet.create<any>({
//   root: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   container: {
//     height: 200,
//     width: 200,
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 8,
//     borderColor: 'rgba(0,0,0,0.2)',
//   },
//   item: {
//     borderWidth: 4,
//     borderColor: 'rgba(0,0,0,0.2)',
//     height: 48,
//     width: 48,
//     borderRadius: 8,
//   },
// });
