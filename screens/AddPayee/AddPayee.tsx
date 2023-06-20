import { View, ScrollView } from "react-native";
import { styles } from "./styles";
import MainLayout from "../../layout/Main";
import Heading from "../../components/Heading";
import FormGroup from "../../components/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import Button from "../../components/Button";
import { Formik } from "formik";
import PayeeIcon from "../../assets/icons/Beneficiary";
import BeneficiaryIcon from "../../assets/icons/Beneficiary";
import ProfileIcon from "../../assets/icons/Profile";
import CodeIcon from "../../assets/icons/Code";
import { useDispatch } from "react-redux";
import { addNewBeneficiary } from "../../redux/beneficiary/beneficiarySlice";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { screenNames } from "../../utils/helpers";

export function AddPayee() {
  const dispatch = useDispatch();
  const { navigate }:any = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<any>({});

  return (
    <MainLayout>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<PayeeIcon color="pink" size={18} />}
            title="Beneficiary"
          />
        </View>
        <Formik
          initialValues={{
            beneficiary_name: "",
            beneficiary_iban: "",
            beneficiary_bic: "",
          }}
          validate={(values:any) => {
            let errors:any = {};
            if (!values.beneficiary_name) errors.beneficiary_name = "required";
            if (!values.beneficiary_iban) errors.beneficiary_iban = "required";
            if (!values.beneficiary_bic) errors.beneficiary_bic = "required";

            if (values.beneficiary_bic.length <= 3)
              errors.beneficiary_bic = "field must be minimum 3 characters";
            return errors;
          }}
          onSubmit={(values:any) => {
            setIsSubmitting(true);
            dispatch<any>(
              addNewBeneficiary({
                ...values,
                beneficiary_Country: values.beneficiary_Country?.value,
              })
            )
              .unwrap()
              .then((payload:any) => {
                if (payload) {
                  if (payload.code === 200) {
                    setIsSubmitting(false);
                    setApiError({});
                    navigate(screenNames.payeesList);
                  } else {
                    console.log("error", payload);
                    setApiError(payload.message);
                    setIsSubmitting(false);
                  }
                }
              })
              .catch((error:any) => {
                console.error(error);
                setIsSubmitting(false);
              });
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
            <View style={styles.content}>
              <View>
                <FormGroup
                  validationError={errors.beneficiary_name || apiError.name}
                >
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_name")}
                    onBlur={handleBlur("beneficiary_name")}
                    values={values.beneficiary_name}
                    placeholder="Name"
                    icon={<ProfileIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup
                  validationError={errors.beneficiary_iban || apiError.iban}
                >
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_iban")}
                    onBlur={handleBlur("beneficiary_iban")}
                    values={values.beneficiary_iban}
                    placeholder="IBAN"
                    icon={<CodeIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup
                  validationError={errors.beneficiary_bic || apiError.bic}
                >
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_bic")}
                    onBlur={handleBlur("beneficiary_bic")}
                    values={values.beneficiary_bic}
                    placeholder="BIC"
                    icon={<CodeIcon />}
                  />
                </FormGroup>
              </View>
              <FixedBottomAction smallMargin>
                <Button
                  onPress={handleSubmit}
                  color="light-pink"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  leftIcon={<BeneficiaryIcon color="pink" size={14} />}
                >
                  Save Payee
                </Button>
              </FixedBottomAction>
            </View>
          )}
        </Formik>
      </ScrollView>
    </MainLayout>
  );
}
