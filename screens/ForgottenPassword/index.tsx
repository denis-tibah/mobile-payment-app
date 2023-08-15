import { useEffect, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

import Button from "../../components/Button";
import FormGroup from "../../components/FormGroup";
import MainLayout from "../../layout/Main";
import FixedBottomAction from "../../components/FixedBottomAction";
import { styles } from "./styles";
import Typography from "../../components/Typography";
import ProfileIcon from "../../assets/icons/Profile";
import EmailIcon from "../../assets/icons/Email";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { forgottenPasswordSchema } from "../../utils/formikSchema";
import { forgottenPassword } from "../../redux/auth/authSlice";

export function ForgottenPassword({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgottenPasswordSchema,
    onSubmit: async ({ email }) => {
      setIsLoading(true);
      try {
        const forgottenPasswordReq = await dispatch<any>(
          forgottenPassword({
            email,
          })
        ).unwrap();

        if (
          forgottenPasswordReq &&
          Object.keys(forgottenPasswordReq).length > 0
        ) {
          if (
            (forgottenPasswordReq?.code === 200 ||
              forgottenPasswordReq?.code === "200") &&
            forgottenPasswordReq?.status === "success"
          ) {
            Alert.alert(forgottenPasswordReq?.message);
          } else {
            Alert.alert("Something went wrong please try again");
          }
          setFieldValue(email, "");
        } else {
          Alert.alert("Something went wrong please try again");
        }
        setIsLoading(false);
      } catch (error) {
        console.log(
          "🚀 ~ file: index.tsx:35 ~ ForgottenPassword ~ error:",
          error
        );
        setIsLoading(false);
      }
    },
  });

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <Typography
                fontSize={18}
                fontFamily="Nunito-SemiBold"
                fontWeight={600}
              >
                Forgotten password
              </Typography>
            </View>
            <Seperator marginBottom={36} backgroundColor={vars["grey"]} />

            <View>
              <View style={styles.cardBody}>
                <View>
                  <FormGroup validationError={errors.email}>
                    <FormGroup.Input
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      placeholder="Email address"
                      icon={<EmailIcon />}
                    />
                  </FormGroup>
                </View>
              </View>
              <FixedBottomAction rounded>
                <Button
                  style={styles.signinButton}
                  loading={isLoading}
                  disabled={isLoading}
                  color={"light-pink"}
                  onPress={handleSubmit}
                  leftIcon={<ProfileIcon size={14} />}
                >
                  Submit
                </Button>
              </FixedBottomAction>
            </View>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

export default ForgottenPassword;
