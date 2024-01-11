import { useState, FC } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

import { Seperator } from "../Seperator/Seperator";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import PigIcon from "../../assets/icons/Pig";
import BusinessBagIcon from "../../assets/icons/BusinessBag";
import FormGroup from "../FormGroup";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Button from "../Button";
import { financialDataTabSchema } from "../../utils/formikSchema";
import { sourceOfWealth, employmentStatus } from "../../data/options";
import { useCreateTicketRequestMutation } from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IFinancialDetailsTab {
  cleanUpTabSelection: () => void;
}

const FinancialDetailsTab: FC<IFinancialDetailsTab> = ({
  cleanUpTabSelection,
}) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [openListForSourceOfDeposits, setOpenListForSourceOfDeposits] =
    useState<boolean>(false);
  const [openListForEmploymentStatus, setOpenListForEmploymentStatus] =
    useState<boolean>(false);
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
    "🚀 ~ FinancialDetailsTab ~ isErrorCreateTicketReq:",
    isErrorCreateTicketReq
  );
  console.log(
    "🚀 ~ FinancialDetailsTab ~ isSuccessCreateTicketReq:",
    isSuccessCreateTicketReq
  );
  console.log(
    "🚀 ~ FinancialDetailsTab ~ dataCreateTicketReq:",
    dataCreateTicketReq
  );
  console.log(
    "🚀 ~ FinancialDetailsTab ~ dataCreateTicketReq:",
    dataCreateTicketReq
  );
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
      annualSalary: profileData?.UserProfile?.annualSalary || "",
      sourceOfDeposit: profileData?.UserProfile?.sourceOfWealth || "",
      employmentStatus: profileData?.UserProfile?.employmentStatus || "",
    },
    validationSchema: financialDataTabSchema,
    onSubmit: async ({ annualSalary, sourceOfDeposit, employmentStatus }) => {
      const createTicketType = {
        ticketValue: [],
        receive_email: profileData?.email || "",
        dateSubmitted: new Date(),
      };

      Object.assign(createTicketType, {
        ticketValue: [
          {
            profile: {
              annual_salary: annualSalary || "",
              source_of_wealth: sourceOfDeposit || "",
              employment_status: employmentStatus || "",
            },
          },
        ],
        ticketType: "Update Profile Request",
      });

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

  /*   useFocusEffect(() => {
    return () => {
      cleanUpTabSelection();
    };
  }); */

  return (
    <ScrollView style={{}}>
      <View>
        <Spinner visible={isLoadingCreateTicketReq} />
        <SuccessModal
          isOpen={statusMessage?.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
        <Pressable>
          <View style={{ paddingBottom: 12 }}>
            <View
              style={[
                styles.formContainer,
                { paddingLeft: 22, paddingRight: 22 },
              ]}
            >
              <FormGroup
                validationError={
                  errors.annualSalary &&
                  touched.annualSalary &&
                  errors.annualSalary
                }
              >
                <FormGroup.Input
                  keyboardType="numeric"
                  returnKeyType={"done"}
                  onChangeText={handleChange("annualSalary")}
                  onBlur={handleBlur("annualSalary")}
                  value={values.annualSalary}
                  placeholder="Monthly account deposits"
                  placeholderTextColor={vars["ios-default-text"]}
                  iconColor="#086AFB"
                  icon={<PigIcon size={16} color="blue" />}
                />
              </FormGroup>
            </View>
            <Seperator
              backgroundColor={vars["grey"]}
              marginBottom={16}
              width="100%"
            />
            <View
              style={[
                styles.formContainer,
                { paddingLeft: 22, paddingRight: 22 },
              ]}
            >
              <FormGroup
                validationError={
                  errors.sourceOfDeposit &&
                  touched.sourceOfDeposit &&
                  errors.sourceOfDeposit
                }
              >
                <View style={styles.dropdownWrapper}>
                  <View style={styles.dropDownIconContainerLeft}>
                    <MaterialCommunityIcons
                      size={20}
                      color="#086AFB"
                      name={"storefront-outline"}
                    />
                  </View>
                  <View>
                    <DropDownPicker
                      schema={{ label: "label", value: "value" }}
                      onSelectItem={(value: any) => {
                        const { value: sourceOfWealthValue } = value;

                        setValues({
                          ...values,
                          sourceOfDeposit: sourceOfWealthValue,
                        });
                      }}
                      listMode="MODAL"
                      items={sourceOfWealth}
                      value={values?.sourceOfDeposit}
                      setOpen={setOpenListForSourceOfDeposits}
                      open={openListForSourceOfDeposits}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      placeholder="Source of deposit"
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
            <View
              style={[
                styles.formContainer,
                { paddingLeft: 22, paddingRight: 22 },
              ]}
            >
              <FormGroup
                validationError={
                  errors.employmentStatus &&
                  touched.employmentStatus &&
                  errors.employmentStatus
                }
              >
                <View style={styles.dropdownWrapper}>
                  <View style={styles.dropDownIconContainerLeft}>
                    <BusinessBagIcon size={16} color="blue" />
                  </View>
                  <View>
                    <DropDownPicker
                      schema={{ label: "label", value: "value" }}
                      onSelectItem={(value: any) => {
                        const { value: employmentStatusValue } = value;

                        setValues({
                          ...values,
                          employmentStatus: employmentStatusValue,
                        });
                      }}
                      listMode="MODAL"
                      items={employmentStatus}
                      value={values?.employmentStatus}
                      setOpen={setOpenListForEmploymentStatus}
                      open={openListForEmploymentStatus}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      placeholder="Employment status"
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
                leftIcon={
                  <Ionicons
                    color="#e7038e"
                    size={20}
                    name={"checkmark-circle-outline"}
                  />
                }
                onPress={handleSubmit}
              >
                Save changes
              </Button>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default FinancialDetailsTab;
