import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { screenNames } from "../../utils/helpers";
import MainLayout from "../../layout/Main";
import LockIcon from "../../assets/icons/Lock";
import ProfileIcon from "../../assets/icons/Profile";
import EmailIcon from "../../assets/icons/Email";
import Button from "../../components/Button";
import { Seperator } from "../../components/Seperator/Seperator";
import Typography from "../../components/Typography";
import FormGroup from "../../components/FormGroup";
import vars from "../../styles/vars";
import {
  ResetPasswordPayloadRequest,
  resetPassword,
} from "../../redux/auth/authSlice";
import FixedBottomAction from "../../components/FixedBottomAction";
import { styles } from "./styles";

const ResetPassword: React.FC = ({ navigation, route }: any) => {
  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();
  const navigationParams = route.params;
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResetPassword = async (values: any) => {
    setIsLoading(true);
    const { password, confirmPassword } = values;
    const resetPayload: ResetPasswordPayloadRequest = {
      email,
      password,
      password_confirmation: confirmPassword,
      token: resetToken,
    };
    try {
      const response = await dispatch<any>(
        resetPassword(resetPayload)
      ).unwrap();
      if (response.code === 201 || response.code === 200) {
        setIsLoading(false);
        navigate(screenNames.login);
      }
    } catch (error) {
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigationParams?.email && navigationParams?.resetToken) {
      setEmail(navigationParams.email);
      setResetToken(navigationParams.resetToken);
    }
  }, [navigationParams]);

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <Typography
                fontSize={18}
                fontFamily="Nunito-SemiBold"
                fontWeight={"600"}
              >
                Change Password
              </Typography>
            </View>
            <Seperator marginBottom={36} backgroundColor={vars["grey"]} />
            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.password) {
                  errors.password = "Password is required";
                } else if (!values.confirmPassword) {
                  errors.confirmPassword = "Confirm password is required";
                } else if (values.password !== values.confirmPassword) {
                  errors.confirmPassword = "Passwords do not match";
                }
                console.log(errors);
                return errors;
              }}
              onSubmit={handleResetPassword}
            >
              {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
                <View>
                  <View style={styles.cardBody}>
                    <View>
                      <FormGroup validationError={errors.email}>
                        <FormGroup.Input
                          name="email"
                          keyboardType="email-address"
                          value={email}
                          disabled={true}
                          placeholder="Email address"
                          icon={<EmailIcon />}
                        />
                      </FormGroup>
                    </View>
                    <View style={styles.passwordField}>
                      <FormGroup validationError={errors.password}>
                        <FormGroup.Password
                          icon={<LockIcon />}
                          rightIcon
                          name="password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder="New password"
                        />
                      </FormGroup>
                    </View>
                    <View style={styles.passwordField}>
                      <FormGroup validationError={errors.confirmPassword}>
                        <FormGroup.Password
                          icon={<LockIcon />}
                          rightIcon
                          name="confirmPassword"
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          value={values.confirmPassword}
                          placeholder="Confirm new Password"
                        />
                      </FormGroup>
                    </View>
                  </View>
                  <FixedBottomAction rounded>
                    <Button
                      style={styles.signinButton}
                      loading={isLoading}
                      disabled={isLoading}
                      color="light-pink"
                      onPress={handleSubmit}
                      leftIcon={<ProfileIcon size={14} />}
                    >
                      {isLoading ? "Authenticating..." : "Confirm"}
                    </Button>
                  </FixedBottomAction>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </MainLayout>
  );
};

export default ResetPassword;
