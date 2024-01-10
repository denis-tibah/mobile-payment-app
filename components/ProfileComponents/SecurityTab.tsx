import { useState } from "react";
import { View, ScrollView, Pressable, Switch, Text } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { salutations } from "../../data/options";
import Typography from "../Typography";
import { Seperator } from "../Seperator/Seperator";
import Camera from "../../assets/icons/Camera";
import SalutationIcon from "../../assets/icons/Salutation";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import ProfileIcon from "../../assets/icons/Profile";
import PigIcon from "../../assets/icons/Pig";
import CompassIcon from "../../assets/icons/Compass";
import ChangeRequestIcon from "../../assets/icons/ChangeRequest";
import KeyIcon from "../../assets/icons/Key";
import LocationIcon from "../../assets/icons/Location";
import MapIcon from "../../assets/icons/Map";
import CityIcon from "../../assets/icons/City";
import TwoFactorAuthenticationIcon from "../../assets/icons/TwoFactorAuthentication";
import { countries } from "../../data/ISO3166";
import FixedBottomAction from "../../components/FixedBottomAction";
import LockIcon from "../../assets/icons/Lock";
import FormGroup from "../FormGroup";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { Avatar } from "../../components/Avatar/Avatar";
import Button from "../Button";
import { securityTabSchema } from "../../utils/formikSchema";
import { sourceOfWealth } from "../../data/options";
import {
  useCreateTicketRequestMutation,
  useUpdatePasswordMutation,
} from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import TwoFactorAuthentication from "../../assets/icons/TwoFactorAuthentication";

/* interface ILoginDetails {
  handleNextStep: () => void;
  handleOpenModal: () => void;
  handleModalContent: ({
    header,
    body,
  }: {
    header: string;
    body: string;
  }) => void;
}
 */
const SecurityTab = () => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [openListForSalutation, setOpenListForSalutation] =
    useState<boolean>(false);
  const [openListForSourceOfDeposits, setOpenListForSourceOfDeposits] =
    useState<boolean>(false);
  const [openListForCountry, setOpenListForCountry] = useState<boolean>(false);
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

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <ScrollView>
      <View>
        <Spinner visible={isLoadingUpdatePassword} />
        <SuccessModal
          isOpen={statusMessage?.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
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
                  <Typography fontSize={16} marginLeft={4}>
                    2 factor authenticaton
                  </Typography>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isEnableTwoFactor ? "white" : vars["light-blue"]}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(e) => setTwoFactorAuthentication(e)}
                  value={isEnableTwoFactor}
                />
              </View>
            </View>
            <Seperator
              backgroundColor={vars["medium-grey"]}
              marginBottom={12}
            />
            <View style={{ paddingHorizontal: 18, paddingBottom: 12 }}>
              <Typography fontSize={16} marginLeft={12} marginBottom={12}>
                Change password
              </Typography>
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
                    placeholder="Password"
                  />
                </FormGroup>
              </View>
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
                    placeholder="Confirm password"
                  />
                </FormGroup>
              </View>
            </View>
            <FixedBottomAction isFullWidth isNoTopMargin>
              <View
                style={{ width: "100%", paddingLeft: 12, paddingRight: 12 }}
              >
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
              </View>
            </FixedBottomAction>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SecurityTab;
