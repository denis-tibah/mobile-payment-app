import { useState, useEffect, FC, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Switch,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Typography from "../Typography";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../FormGroup";
import Button from "../Button";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import TwoFactorAuthenticationIcon from "../../assets/icons/TwoFactorAuthentication";
import { securityTabSchema } from "../../utils/formikSchema";
import { useUpdatePasswordMutation } from "../../redux/profile/profileSliceV2";
import WholeContainer from "../../layout/WholeContainer";
import { RootState } from "../../store";
import vars from "../../styles/vars";

interface ISecurityTab {
  cleanUpTabSelection: () => void;
}

const SecurityTab: FC<ISecurityTab> = ({ cleanUpTabSelection }) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [isEnableTwoFactor, setTwoFactorAuthentication] =
    useState<boolean>(false);

  const [
    updatePasswordMutation,
    {
      isLoading: isLoadingUpdatePassword,
      isError: isErrorUpdatePassword,
      isSuccess: isSuccessUpdatePassword,
      error: errorUpdatePassword,
      data: dataUpdatePassword,
    },
  ] = useUpdatePasswordMutation();

  console.log(
    "🚀 ~ SecurityTab ~ isErrorUpdatePassword:",
    isErrorUpdatePassword
  );
  console.log(
    "🚀 ~ SecurityTab ~ isSuccessUpdatePassword:",
    isSuccessUpdatePassword
  );
  console.log("🚀 ~ SecurityTab ~ errorUpdatePassword:", errorUpdatePassword);
  console.log("🚀 ~ SecurityTab ~ dataUpdatePassword:", dataUpdatePassword);

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        password: "",
        oldPassword: "",
        passwordConfirmation: "",
      },
      validationSchema: securityTabSchema,
      onSubmit: async ({ password, oldPassword, passwordConfirmation }) => {
        const bodyParams = {
          email: profileData?.email,
          password,
          old_password: oldPassword,
          password_confirmation: passwordConfirmation,
        };
        updatePasswordMutation({
          bodyParams,
          accessToken: userTokens?.access_token,
          tokenZiyl: userTokens?.token_ziyl,
        });
      },
    });

  useEffect(() => {
    if (!isLoadingUpdatePassword && isSuccessUpdatePassword) {
      if (dataUpdatePassword?.code === 404) {
        setStatusMessage({
          header: "Error",
          isOpen: true,
          body: dataUpdatePassword?.message || "Something went wrong",
          isError: true,
        });
      }
      if (
        dataUpdatePassword?.code === 200 ||
        dataUpdatePassword?.code === "200"
      ) {
        setStatusMessage({
          header: "Success",
          isOpen: true,
          body: dataUpdatePassword?.message || "Something went wrong",
          isError: false,
        });
      } else {
        setStatusMessage({
          header: "Error",
          isOpen: true,
          body: "Something went wrong",
          isError: true,
        });
      }
    }
  }, [isLoadingUpdatePassword, isSuccessUpdatePassword]);

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  /*   useFocusEffect(() => {
    useCallback(() => {
      return () => {
        cleanUpTabSelection();
      };
    }, []);
  }); */

  return (
    <View style={{ flexGrow: 0, backgroundColor: "#fff", height: "75%" }}>
      <Spinner visible={isLoadingUpdatePassword} />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{
            backgroundColor: "white",
          }}
        >
          <Pressable>
            <View>
              <View style={{ paddingHorizontal: 18, paddingBottom: 12 }}>
                <View
                  style={{
                    marginLeft: 12,
                    marginRight: 12,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TwoFactorAuthenticationIcon color="blue" size={18} />
                    <Typography
                      fontSize={16}
                      fontWeight={400}
                      fontFamily="Mukta-Regular"
                      marginLeft={8}
                    >
                      2 factor authentication
                    </Typography>
                  </View>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={
                      isEnableTwoFactor ? "white" : vars["light-blue"]
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(e) => setTwoFactorAuthentication(e)}
                    value={isEnableTwoFactor}
                  />
                </View>
              </View>
              <View style={{ paddingBottom: 12 }}>
                <WholeContainer>
                  <Seperator
                    backgroundColor={vars["v2-light-grey"]}
                    marginBottom={16}
                  />
                  <Typography
                    fontSize={16}
                    fontWeight={400}
                    fontFamily="Mukta-Regular"
                    marginLeft={12}
                    marginBottom={12}
                  >
                    Change password
                  </Typography>
                  <View>
                    <FormGroup
                      validationError={
                        errors.oldPassword &&
                        touched.oldPassword &&
                        errors.oldPassword
                      }
                    >
                      <FormGroup.Password
                        iconColor="#086AFB"
                        icon={
                          <MaterialCommunityIcons
                            color="#086AFB"
                            size={22}
                            name={"key-outline"}
                          />
                        }
                        rightIcon
                        onChangeText={handleChange("oldPassword")}
                        onBlur={handleBlur("oldPassword")}
                        value={values.oldPassword}
                        placeholderTextColor={vars["ios-default-text"]}
                        placeholder="Old password"
                      />
                    </FormGroup>
                  </View>
                  <View>
                    <FormGroup
                      validationError={
                        errors.password && touched.password && errors.password
                      }
                    >
                      <FormGroup.Password
                        iconColor="#086AFB"
                        icon={
                          <MaterialCommunityIcons
                            color="#086AFB"
                            size={22}
                            name={"key-outline"}
                          />
                        }
                        rightIcon
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        placeholderTextColor={vars["ios-default-text"]}
                        placeholder="New password"
                      />
                    </FormGroup>
                  </View>
                  <View>
                    <FormGroup
                      validationError={
                        errors.passwordConfirmation &&
                        touched.passwordConfirmation &&
                        errors.passwordConfirmation
                      }
                    >
                      <FormGroup.Password
                        iconColor="#086AFB"
                        icon={
                          <MaterialCommunityIcons
                            color="#086AFB"
                            size={22}
                            name={"key-outline"}
                          />
                        }
                        rightIcon
                        onChangeText={handleChange("passwordConfirmation")}
                        onBlur={handleBlur("passwordConfirmation")}
                        value={values.passwordConfirmation}
                        placeholderTextColor={vars["ios-default-text"]}
                        placeholder="New password again"
                      />
                    </FormGroup>
                  </View>
                </WholeContainer>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
      {/* <FixedBottomAction isFullWidth> */}
      <View
        style={{
          /* width: "100%",
          paddingLeft: 12,
          paddingRight: 12, */

          position: "relative",
          width: "100%",
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingVertical: 20,
          shadowColor: "#ACACAC",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex: 999,
        }}
      >
        <WholeContainer>
          <Button
            color="light-pink"
            fontWeight="bold"
            fontSize={30}
            leftIcon={
              <Ionicons
                color="#e7038e"
                size={20}
                name={"checkmark-circle-outline"}
              />
            }
            onPress={handleSubmit}
          >
            Save changes
          </Button>
        </WholeContainer>
      </View>
      {/* </FixedBottomAction> */}
    </View>
  );
};

export default SecurityTab;
