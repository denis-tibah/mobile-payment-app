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
import CompanyIcon from "../../assets/icons/Company";
import KeyIcon from "../../assets/icons/Key";
import MapIcon from "../../assets/icons/Map";
import LocationIcon from "../../assets/icons/Location";
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
            // beneficiary_Address: "",
            // beneficiary_Address2: "",
            // beneficiary_PostCode: "",
            // beneficiary_State: "",
            // beneficiary_Location: "",
            // beneficiary_Country: { label: "", value: "" },
          }}
          validate={(values) => {
            let errors:any = {};
            if (!values.beneficiary_name) errors.beneficiary_name = "required";
            if (!values.beneficiary_iban) errors.beneficiary_iban = "required";
            if (!values.beneficiary_bic) errors.beneficiary_bic = "required";

            if (values.beneficiary_bic.length <= 3)
              errors.beneficiary_bic = "field must be minimum 3 characters";

            // if (!values.beneficiary_Address)
            //   errors.beneficiary_Address = "required";
            // if (!values.beneficiary_Address2)
            //   errors.beneficiary_Address2 = "required";
            // if (!values.beneficiary_PostCode)
            //   errors.beneficiary_PostCode = "required";
            // if (!values.beneficiary_State)
            //   errors.beneficiary_State = "required";
            // if (!values.beneficiary_Location)
            //   errors.beneficiary_Location = "required";
            // if (!values.beneficiary_Country)
            //   errors.beneficiary_Country = "required";
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
              {/* <View>
                <FormGroup validationError={errors.beneficiary_Address}>
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_Address")}
                    onBlur={handleBlur("beneficiary_Address")}
                    values={values.beneficiary_Address}
                    placeholder="Address"
                    icon={<CompanyIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup validationError={errors.beneficiary_Address}>
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_Address2")}
                    onBlur={handleBlur("beneficiary_Address2")}
                    values={values.beneficiary_Address2}
                    placeholder="Address 2"
                    icon={<KeyIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup validationError={errors.beneficiary_PostCode}>
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_PostCode")}
                    onBlur={handleBlur("beneficiary_PostCode")}
                    values={values.beneficiary_PostCode}
                    placeholder="Postcode"
                    icon={<MapIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup validationError={errors.beneficiary_Location}>
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_Location")}
                    onBlur={handleBlur("beneficiary_Location")}
                    values={values.beneficiary_Location}
                    placeholder="Location"
                    icon={<MapIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup validationError={errors.beneficiary_State}>
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_State")}
                    onBlur={handleBlur("beneficiary_State")}
                    values={values.beneficiary_State}
                    placeholder="State"
                    icon={<MapIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup validationError={errors.beneficiary_Country}>
                  <FormGroup.Input
                    onChangeText={handleChange("beneficiary_Country")}
                    onBlur={handleBlur("beneficiary_Country")}
                    values={values.beneficiary_Country}
                    placeholder="Country"
                    icon={<LocationIcon />}
                  />
                </FormGroup>
              </View> */}
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
