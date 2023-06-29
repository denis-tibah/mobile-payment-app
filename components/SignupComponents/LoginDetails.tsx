import { useState, FC, Fragment } from "react";
import { View, Text } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import {
  setLoginCredentials,
  setRegistrationData,
} from "../../redux/registration/registrationSlice";
import { loginCredentialsSchema } from "../../utils/formikSchema";
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

  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Login Credentials
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
    </View>
  );
};

export default LoginDetails;
