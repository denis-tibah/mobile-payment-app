import { FC, Fragment } from "react";
import { View, Text } from "react-native";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";

import Typography from "../../components/Typography";
import ButtonSubmit from "../../components/Button";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import { Seperator } from "../../components/Seperator/Seperator";
import { termsAndConditionSchema } from "../../utils/formikSchema";
import { setRegistrationData } from "../../redux/registration/registrationSlice";
import FormGroup from "../../components/FormGroup";
import WholeContainer from "../../layout/WholeContainer";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ITermsAndSecurity {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const PRIVACY_SETTINGS = [
  { label: "I've read and accept the Terms", value: "termsAndConditions" },
  {
    label: "I've read and accept the Provicy Policy",
    value: "readPrivacyPolicy",
  },
];
const TermsAndSecurity: FC<ITermsAndSecurity> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const { handleSubmit, handleChange, values, touched, errors, setFieldValue } =
    useFormik({
      validationSchema: termsAndConditionSchema,
      initialValues: {
        termsAndConditions: registration?.data?.termsAndConditions || false,
        readPrivacyPolicy: registration?.data?.readPrivacyPolicy || false,
        newsLetterSubscription:
          registration?.data?.newsLetterSuncription || false,
      },
      onSubmit: ({
        termsAndConditions,
        readPrivacyPolicy,
        newsLetterSubscription,
      }) => {
        dispatch(
          setRegistrationData({
            termsAndConditions,
            readPrivacyPolicy,
            newsLetterSuncription: newsLetterSubscription,
          })
        );
        handleNextStep();
      },
    });

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Terms and Security
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <Text style={styles.termsHeaderText}>Privacy settings</Text>
            <View>
              {PRIVACY_SETTINGS.map(
                ({ label, value }: { label: String; value: string }) => {
                  return (
                    <Fragment key={value}>
                      <FormGroup
                        validationError={
                          errors[value as keyof typeof values] &&
                          touched[value as keyof typeof values] &&
                          errors[value as keyof typeof values]
                        }
                      >
                        <FormGroup.CheckboxUI
                          label={label}
                          value={values[value as keyof typeof values]}
                          color={
                            values[value as keyof typeof values]
                              ? vars["accent-pink"]
                              : undefined
                          }
                          onValueChange={() => {
                            setFieldValue(
                              value,
                              !values[value as keyof typeof values]
                            );
                          }}
                        />
                      </FormGroup>
                    </Fragment>
                  );
                }
              )}
            </View>
          </View>
          <View>
            <Text style={styles.termsHeaderText}>Optional</Text>
            <View>
              <FormGroup>
                <FormGroup.CheckboxUI
                  label="Newsletter subscription"
                  value={values?.newsLetterSubscription}
                  color={
                    values?.newsLetterSubscription
                      ? vars["accent-pink"]
                      : undefined
                  }
                  onValueChange={() => {
                    setFieldValue(
                      "newsLetterSubscription",
                      !values?.newsLetterSubscription
                    );
                  }}
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
    </View>
  );
};

export default TermsAndSecurity;
