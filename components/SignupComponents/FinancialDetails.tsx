import { FC } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";

import ButtonSubmit from "../../components/Button";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../../components/FormGroup";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import { financialDetailsSchema } from "../../utils/formikSchema";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import PigIcon from "../../assets/icons/Pig";
import ProfileIcon from "../../assets/icons/Profile";
import SalutationIcon from "../../assets/icons/Salutation";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import { sourceOfWealth, employmentStatus } from "../../data/options";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IFinancialDetails {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const FinancialDetails: FC<IFinancialDetails> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
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
        dispatch(
          setRegistrationData({
            annual_salary: parseInt(annualSalary, 10),
            source_of_wealth: sourceOfWealth,
            employment_status: employmentStatus,
            occupation,
            employer_name: employerName,
            position_held: positionHeld,
            length_with_employer: lengthWithEmployer,
            nature_of_business: natureOfBusiness,
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
                placeholder="Monthly account deposits"
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
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("sourceOfWealth")}
                onBlur={handleBlur("sourceOfWealth")}
                selectedValue={values?.sourceOfWealth || ""}
                icon={<PigIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {sourceOfWealth.map((item) => {
                  if (!item) {
                    return (
                      <FormGroup.Option
                        key="default"
                        value=""
                        label="Source of deposits"
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
                errors.employmentStatus &&
                touched.employmentStatus &&
                errors.employmentStatus
              }
            >
              <FormGroup.SelectForArrOfObject
                onValueChange={handleChange("employmentStatus")}
                onBlur={handleBlur("employmentStatus")}
                selectedValue={values?.employmentStatus || ""}
                icon={<PigIcon />}
                itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
              >
                {employmentStatus.map((item) => {
                  if (!item) {
                    return (
                      <FormGroup.Option
                        key="default"
                        value=""
                        label="Employment status"
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
                errors.occupation && touched.occupation && errors.occupation
              }
            >
              <FormGroup.Input
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("occupation")}
                onBlur={handleBlur("occupation")}
                value={values.occupation}
                placeholder="Occupation"
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
                placeholder="Employer name"
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
                placeholder="Position held"
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
                keyboardType="default"
                returnKeyType={"done"}
                onChangeText={handleChange("lengthWithEmployer")}
                onBlur={handleBlur("lengthWithEmployer")}
                value={values.lengthWithEmployer}
                placeholder="Length with employer"
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
                placeholder="Nature of business"
              />
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

export default FinancialDetails;
