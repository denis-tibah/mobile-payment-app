import { useState, FC, Fragment } from "react";
import { View, Text } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { registrationPhonePrefix } from "../../data/options";
import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import EmailIcon from "../../assets/icons/Email";
import MapIcon from "../../assets/icons/Map";
import PhoneIcon from "../../assets/icons/Phone";
import FormGroup from "../../components/FormGroup";
import {
  setLoginCredentials,
  setRegistrationData,
} from "../../redux/registration/registrationSlice";
import { loginCredentialsSchema } from "../../utils/formikSchema";
import { AppDispatch } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ILoginDetails {
  handleNextStep: () => void;
}

const LoginDetails: FC<ILoginDetails> = ({ handleNextStep }) => {
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [isChangeEmail, setIsChangeEmail] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState({
    email: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const registration = useSelector((state: any) => state.registration);

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        email: registration?.data?.email || "",
        alternateEmail: "",
        countryCode: window.localStorage?.getItem("countryCode") || "",
        phoneNumber: window.localStorage?.getItem("phone_number") || "",
      },
      validationSchema: loginCredentialsSchema,
      onSubmit: ({ email, alternateEmail, phoneNumber, countryCode }) => {
        dispatch(
          setLoginCredentials({
            email: alternateEmail ? alternateEmail : email,
            phone_number: `${countryCode}${phoneNumber}`,
          })
        )
          .unwrap()
          .then((payload: any) => {
            if (payload === "activation email sent") {
              setIsValidEmail(true);
            }
          })
          .catch((error: any) => {
            if (error) {
              setRegisterError({
                ...registerError,
                email: "Email already exists",
              });
            }
          });
        dispatch(
          setRegistrationData({
            email: alternateEmail ? alternateEmail : email,
            phone_number: `${countryCode}${phoneNumber}`,
            identifier: `${countryCode}${phoneNumber}`,
          })
        );
        window.localStorage.setItem("countryCode", countryCode);
        window.localStorage.setItem("phone_number", phoneNumber);

        dispatch(
          setRegistrationData({
            email: alternateEmail ? alternateEmail : email,
            phone_number: `${countryCode}${phoneNumber}`,
            identifier: `${countryCode}${phoneNumber}`,
          })
        );
        handleNextStep();
      },
    });
  console.log("🚀 ~ file: LoginDetails.tsx:36 ~ touched:", touched);
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Login Credentials
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <FormGroup
              validationError={errors.email && touched.email && errors.email}
            >
              <FormGroup.Input
                keyboardType="email-address"
                returnKeyType={"done"}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Email Address"
                icon={<EmailIcon />}
              />
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.countryCode && touched.countryCode && errors.countryCode
              }
            >
              <FormGroup.Select
                onValueChange={handleChange("countryCode")}
                onBlur={handleBlur("countryCode")}
                selectedValue={values?.countryCode}
                icon={<MapIcon />}
              >
                {registrationPhonePrefix.map((item) => {
                  if (!item?.label && !item?.value) {
                    return (
                      <FormGroup.Option
                        key={item?.label}
                        label="Phone country code"
                        value=""
                      />
                    );
                  }
                  return (
                    <FormGroup.Option
                      key={item?.label}
                      label={item?.label}
                      value={item?.value}
                    />
                  );
                })}
              </FormGroup.Select>
            </FormGroup>
          </View>
          <View>
            <FormGroup
              validationError={
                errors.phoneNumber && touched.phoneNumber && errors.phoneNumber
              }
            >
              <FormGroup.Input
                keyboardType="phone-number"
                returnKeyType={"done"}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                placeholder="Phone Number"
                icon={<PhoneIcon />}
              />
            </FormGroup>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginDetails;
