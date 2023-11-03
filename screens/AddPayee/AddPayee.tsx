import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, ScrollView } from "react-native";
import { useFormik } from "formik";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useDebounce } from "usehooks-ts";

import MainLayout from "../../layout/Main";
import Heading from "../../components/Heading";
import FormGroup from "../../components/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import Button from "../../components/Button";
import vars from "../../styles/vars";
import PayeeIcon from "../../assets/icons/Beneficiary";
import BeneficiaryIcon from "../../assets/icons/Beneficiary";
import ProfileIcon from "../../assets/icons/Profile";
import CodeIcon from "../../assets/icons/Code";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { useDispatch } from "react-redux";
import { addNewBeneficiary } from "../../redux/beneficiary/beneficiarySlice";
import { ibanCheck } from "../../redux/payment/paymentSlice";
import { screenNames, arrayChecker } from "../../utils/helpers";
import { validationAddingPayeeSchema } from "../../utils/validation";
import { styles } from "./styles";

export function AddPayee() {
  const dispatch = useDispatch();
  const { navigate }: any = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [beneficiaryIban, setBeneficiaryIban] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  const debouncedBeneficiaryIban = useDebounce<string>(beneficiaryIban, 2000);

  useEffect(() => {
    if (debouncedBeneficiaryIban && debouncedBeneficiaryIban.length) {
      fetchBicDetails(debouncedBeneficiaryIban);
    }
  }, [debouncedBeneficiaryIban]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    setFieldValue,
  } = useFormik({
    validationSchema: validationAddingPayeeSchema,
    initialValues: {
      beneficiaryName: "",
      beneficiaryIban: "",
      beneficiaryBic: "",
    },
    onSubmit: ({ beneficiaryName, beneficiaryIban, beneficiaryBic }) => {
      setIsLoading(true);
      dispatch<any>(
        addNewBeneficiary({
          beneficiary_name: beneficiaryName,
          beneficiary_iban: beneficiaryIban,
          beneficiary_bic: beneficiaryBic,
        })
      )
        .unwrap()
        .then((payload: any) => {
          console.log("🚀 ~ file: AddPayee.tsx:94 ~ .then ~ payload:", payload);
          if (payload) {
            if (payload?.code === 200) {
              setIsLoading(false);
              navigate(screenNames.payeesList);
              setStatusMessage({
                header: "Success",
                body: "Successfully added payee",
                isOpen: true,
                isError: false,
              });
            } else {
              console.log("error", payload);
              const errorMessage =
                arrayChecker(payload?.message?.iban) &&
                payload?.message?.iban.length > 0
                  ? payload?.message?.iban[0]
                  : "Something went wrong";
              setIsLoading(false);
              setStatusMessage({
                header: "Error",
                body: errorMessage,
                isOpen: true,
                isError: true,
              });
            }
          }
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error(error);
          setStatusMessage({
            header: "Error",
            body: "Something went wrong with data",
            isOpen: true,
            isError: true,
          });
          setIsLoading(false);
        });
    },
  });

  const fetchBicDetails = async (iban?: string) => {
    setIsLoading(true);
    try {
      let search: any = {
        creditor_iban: `${iban}`,
      };
      const payload = await dispatch<any>(ibanCheck(search));
      if (payload) {
        if (
          (payload?.payload?.result === 200 ||
            payload?.payload?.result === "200") &&
          payload?.payload?.data?.bank?.bic
        ) {
          setIsLoading(false);
          setFieldValue("beneficiaryBic", payload?.payload?.data?.bank?.bic);
        } else {
          console.log("failed");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <MainLayout>
      <Spinner visible={isLoading} />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading icon={<PayeeIcon color="pink" size={18} />} title="Payee" />
        </View>
        <View style={styles.content}>
          <View>
            <FormGroup
              validationError={
                touched.beneficiaryName && errors.beneficiaryName
              }
            >
              <FormGroup.Input
                keyboardType="default"
                value={values?.beneficiaryName}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="Name"
                icon={<ProfileIcon />}
                returnKeyType={"done"}
                onChangeText={handleChange("beneficiaryName")}
                onBlur={handleBlur("beneficiaryName")}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                touched.beneficiaryIban && errors.beneficiaryIban
              }
            >
              <FormGroup.Input
                keyboardType="default"
                value={values?.beneficiaryIban}
                returnKeyType={"done"}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="IBAN"
                icon={<CodeIcon />}
                onChangeText={(value: string) => {
                  setBeneficiaryIban(value);
                  setFieldValue("beneficiaryIban", value);
                }}
                onBlur={handleBlur("beneficiaryIban")}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={touched.beneficiaryBic && errors.beneficiaryBic}
            >
              <FormGroup.Input
                keyboardType="default"
                value={values?.beneficiaryBic}
                returnKeyType={"done"}
                placeholderTextColor={vars["ios-default-text"]}
                placeholder="BIC"
                icon={<CodeIcon />}
                onChangeText={handleChange("beneficiaryBic")}
                onBlur={handleBlur("beneficiaryBic")}
              />
            </FormGroup>
          </View>
          <FixedBottomAction smallMargin>
            <Button
              onPress={handleSubmit}
              color="light-pink"
              loading={isLoading}
              disabled={isLoading}
              leftIcon={<BeneficiaryIcon color="pink" size={14} />}
            >
              Save Payee
            </Button>
          </FixedBottomAction>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
