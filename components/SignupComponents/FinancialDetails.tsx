import { FC, useState } from "react";
import { View, Dimensions } from "react-native";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";

import ButtonSubmit from "../../components/Button";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../../components/FormGroup";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import { financialDetailsSchema } from "../../utils/formikSchema";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import PigIcon from "../../assets/icons/Pig";
import ProfileIcon from "../../assets/icons/Profile";
import SalutationIcon from "../../assets/icons/Salutation";
import Typography from "../../components/Typography";
import WholeContainer from "../../layout/WholeContainer";
import { Seperator } from "../../components/Seperator/Seperator";
import { sourceOfWealth, employmentStatus } from "../../data/options";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IFinancialDetails {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

const FinancialDetails: FC<IFinancialDetails> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const [openListForSourceOfDeposits, setOpenListForSourceOfDeposits] =
    useState<boolean>(false);
  const [openListForEmploymentStatus, setOpenListForEmploymentStatus] =
    useState<boolean>(false);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    setValues,
    setFieldValue,
  } = useFormik({
    validationSchema: financialDetailsSchema,
    initialValues: {
      annualSalary: registration.data?.annual_salary || "",
      sourceOfWealth: registration.data?.source_of_wealth || "",
      employmentStatus: registration.data?.employment_status || "",
      occupation: registration.data?.occupation || "",
      employerName: registration.data?.employer_name || "",
      positionHeld: registration.data?.position_held || "",
      lengthWithEmployer: registration.data?.length_with_employer || "",
      natureOfBusiness: registration.data?.nature_of_business || "",
    },
    onSubmit: ({
      annualSalary,
      sourceOfWealth,
      employmentStatus,
      occupation,
      employerName,
      positionHeld,
      lengthWithEmployer,
      natureOfBusiness,
    }) => {
      const natureOfBusinessSanitizeData =
        natureOfBusiness.trim() && natureOfBusiness.trim();

      dispatch(
        setRegistrationData({
          /* annual_salary: parseInt(annualSalary, 10), */
          annual_salary: annualSalary,
          source_of_wealth: sourceOfWealth,
          employment_status: employmentStatus,
          occupation,
          employer_name: employerName,
          position_held: positionHeld,
          length_with_employer: lengthWithEmployer,
          nature_of_business: natureOfBusinessSanitizeData,
        })
      );
      handleNextStep();
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Financial Details
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
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
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Monthly account deposits"
                iconColor="blue"
                icon={<PigIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.sourceOfWealth &&
                touched.sourceOfWealth &&
                errors.sourceOfWealth
              }
            >
              {/* <View>
                <DropDownPicker
                  schema={{ label: "label", value: "value" }}
                  onSelectItem={(value: any) => {
                    const { value: sourceOfWealthValue } = value;

                    setValues({
                      ...values,
                      sourceOfWealth: sourceOfWealthValue,
                    });
                  }}
                  listMode="SCROLLVIEW"
                  // setValue={setSelectedSalutation}
                  items={sourceOfWealth}
                  value={values?.sourceOfWealth}
                  setOpen={setOpenListForSourceOfDeposits}
                  open={openListForSourceOfDeposits}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownDirection="TOP"
                  placeholder="Source of wealth"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View> */}
              <View style={styles.dropdownWrapper}>
                <View style={styles.dropDownIconContainerLeft}>
                  <PigIcon size={16} color="blue" />
                </View>
                <View>
                  <DropDownPicker
                    schema={{ label: "label", value: "value" }}
                    onSelectItem={(value: any) => {
                      const { value: sourceOfWealthValue } = value;

                      setValues({
                        ...values,
                        sourceOfWealth: sourceOfWealthValue,
                      });
                    }}
                    listMode="MODAL"
                    items={sourceOfWealth}
                    value={values?.sourceOfWealth}
                    setOpen={setOpenListForSourceOfDeposits}
                    open={openListForSourceOfDeposits}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    placeholder="Source of wealth"
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
                errors.employmentStatus &&
                touched.employmentStatus &&
                errors.employmentStatus
              }
            >
              {/* <View>
                <DropDownPicker
                  schema={{ label: "label", value: "value" }}
                  onSelectItem={(value: any) => {
                    const { value: employmentStatusValue } = value;

                    setValues({
                      ...values,
                      employmentStatus: employmentStatusValue,
                    });
                    if (employmentStatusValue === "unemployed") {
                      setFieldValue("occupation", "N/A");
                      setFieldValue("employerName", "N/A");
                      setFieldValue("positionHeld", "N/A");
                      setFieldValue("lengthWithEmployer", "N/A");
                      setFieldValue("natureOfBusiness", "N/A");
                    } else {
                      setFieldValue("occupation", "");
                      setFieldValue("employerName", "");
                      setFieldValue("positionHeld", "");
                      setFieldValue("lengthWithEmployer", "");
                      setFieldValue("natureOfBusiness", "");
                    }
                  }}
                  listMode="SCROLLVIEW"
                  items={employmentStatus}
                  value={values?.employmentStatus}
                  setOpen={setOpenListForEmploymentStatus}
                  open={openListForEmploymentStatus}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  dropDownDirection="TOP"
                  placeholder="Employment status"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
              </View> */}
              <View style={styles.dropdownWrapper}>
                <View style={styles.dropDownIconContainerLeft}>
                  <PigIcon size={16} color="blue" />
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
                      if (employmentStatusValue === "unemployed") {
                        setFieldValue("occupation", "N/A");
                        setFieldValue("employerName", "N/A");
                        setFieldValue("positionHeld", "N/A");
                        setFieldValue("lengthWithEmployer", "N/A");
                        setFieldValue("natureOfBusiness", "N/A");
                      } else {
                        setFieldValue("occupation", "");
                        setFieldValue("employerName", "");
                        setFieldValue("positionHeld", "");
                        setFieldValue("lengthWithEmployer", "");
                        setFieldValue("natureOfBusiness", "");
                      }
                    }}
                    listMode="MODAL"
                    items={employmentStatus}
                    value={values?.employmentStatus}
                    setOpen={setOpenListForEmploymentStatus}
                    open={openListForEmploymentStatus}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainerTwo}
                    dropDownDirection="TOP"
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
          <View>
            <FormGroup
              validationError={
                errors.occupation && touched.occupation && errors.occupation
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("occupation")}
                onBlur={handleBlur("occupation")}
                value={values.occupation}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Occupation"
                editable={values.occupation === "N/A" ? false : true}
                selectTextOnFocus={values.occupation === "N/A" ? false : true}
                iconColor="blue"
                icon={<ProfileIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.employerName &&
                touched.employerName &&
                errors.employerName
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("employerName")}
                onBlur={handleBlur("employerName")}
                value={values.employerName}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Employer name"
                editable={values.employerName === "N/A" ? false : true}
                selectTextOnFocus={values.employerName === "N/A" ? false : true}
                iconColor="blue"
                icon={<SalutationIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.positionHeld &&
                touched.positionHeld &&
                errors.positionHeld
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("positionHeld")}
                onBlur={handleBlur("positionHeld")}
                value={values.positionHeld}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Position held"
                editable={values.positionHeld === "N/A" ? false : true}
                selectTextOnFocus={values.positionHeld === "N/A" ? false : true}
                iconColor="blue"
                icon={<ProfileIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.lengthWithEmployer &&
                touched.lengthWithEmployer &&
                errors.lengthWithEmployer
              }
            >
              <FormGroup.Input
                keyboardType="numeric"
                returnKeyType={"done"}
                onChangeText={handleChange("lengthWithEmployer")}
                onBlur={handleBlur("lengthWithEmployer")}
                value={values.lengthWithEmployer}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Length with employer"
                editable={values.lengthWithEmployer === "N/A" ? false : true}
                selectTextOnFocus={
                  values.lengthWithEmployer === "N/A" ? false : true
                }
                iconColor="blue"
                icon={<ProfileIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.natureOfBusiness &&
                touched.natureOfBusiness &&
                errors.natureOfBusiness
              }
            >
              <FormGroup.TextArea
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("natureOfBusiness")}
                onBlur={handleBlur("natureOfBusiness")}
                value={values.natureOfBusiness}
                editable={values.natureOfBusiness === "N/A" ? false : true}
                selectTextOnFocus={
                  values.natureOfBusiness === "N/A" ? false : true
                }
                placeholder="Nature of business"
                wrapperHeight={dimensions.window.height - 480}
              />
            </FormGroup>
          </View>
        </View>
        <View style={styles.footerContent}>
          <View style={styles.downloadBtnMain}>
            <WholeContainer>
              <View style={styles.bottomButtonContainer}>
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
            </WholeContainer>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FinancialDetails;
