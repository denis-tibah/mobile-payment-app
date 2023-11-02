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
import { ibanCheck } from "../../redux/payment/paymentSlice";
import { useEffect,useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { screenNames } from "../../utils/helpers";
import { validationAddingPayeeSchema } from "../../utils/validation";


export function AddPayee() {
  const dispatch = useDispatch();
  const { navigate }:any = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<any>({});
  const validationSchema = validationAddingPayeeSchema();
  const [beneficiary_name, setBeneficiary_name] = useState("");
  const [beneficiary_iban, setBeneficiary_iban] = useState("");
  const [beneficiary_bic, setBeneficiary_bic] = useState("");



  const [nameFocused, setNameFocused] = useState(false)
  const [ibanFocused, setIbanFocused] = useState(false)
  const [bicFocused, setBicFocused] = useState(false)
  
 
  useEffect(() => {
    if (beneficiary_iban?.length) {
      console.log('beneficiary_iban ',beneficiary_iban);
      fetchBicDetails(beneficiary_iban);

    }
}, [beneficiary_iban?.length && ibanFocused==true]);

useEffect(() => {

    console.log('beneficiary_bic ',beneficiary_bic);

}, [beneficiary_bic]);


  const fetchBicDetails = async (iban?: string) => {
    try {
      let search: any = {
        creditor_iban: `${iban}`,
      }
      console.log("iban search req", search);
      const payload = await dispatch<any>(ibanCheck(search));
      if (payload) {
        if (payload.payload.result === 200 || payload.payload.result === "200") {
          //add Bic to bic textfield box
          setBeneficiary_bic(payload.payload.data.bank.bic);
          console.log("bic is ", payload.payload.data.bank.bic);
        } else {
          console.log("failed");
        }
      }
    } catch (error) {
      console.log({ error });
    }
    // finally {
    // }
  };


  return (
    <MainLayout>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<PayeeIcon color="pink" size={18} />}
            title="Payee"
          />
        </View>
        <Formik
          initialValues={{
            beneficiary_name: "",
            beneficiary_iban: "",
            beneficiary_bic: "",
         
          }}
          validationSchema={validationSchema}
          onSubmit={(values:any) => {
            setIsSubmitting(true);
            dispatch<any>(
            //   addNewBeneficiary({
            //     ...values,
            //     beneficiary_Country: values.beneficiary_Country?.value,
            //   })
            // )
            addNewBeneficiary({
              beneficiary_name: beneficiary_name,
              beneficiary_iban:beneficiary_iban,
              beneficiary_bic:beneficiary_bic
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
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
            <View style={styles.content}>
              <View>
                <FormGroup
                  validationError={touched.beneficiary_name && errors.beneficiary_name}
                >
                  <FormGroup.Input
                    // onChangeText={handleChange("beneficiary_name")}
                    onChangeText={value => setBeneficiary_name(value)}
                    // onBlur={handleBlur("beneficiary_name")}
                    onFocus={e => setNameFocused(true)}
                    onBlur={e => setNameFocused(false)}
                    // values={values.beneficiary_name}
                    values={beneficiary_name}
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
                    // onChangeText={handleChange("beneficiary_iban")}
                    onChangeText={value => setBeneficiary_iban(value)}
                    // onBlur={handleBlur("beneficiary_iban")}
                    onFocus={e => setIbanFocused(true)}
                    onBlur={e => setIbanFocused(false)}

                    // values={values.beneficiary_iban}
                    values={beneficiary_iban}
                    placeholder="IBAN"
                    icon={<CodeIcon />}
                  />
                </FormGroup>
              </View>
              <View>
                <FormGroup
                  validationError={touched.beneficiary_bic && errors.beneficiary_bic}
                >
                  <FormGroup.Input
                    // onChangeText={handleChange("beneficiary_bic")}
                    onChangeText={value => setBeneficiary_bic(value)}
                    // onBlur={handleBlur("beneficiary_bic")}
                    onFocus={e => setBicFocused(true)}
                    onBlur={e => setBicFocused(false)}
                    // values={values.beneficiary_bic}
                    values={beneficiary_bic}
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
