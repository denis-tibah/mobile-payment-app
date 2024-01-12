import { useState, useEffect, FC, useCallback } from "react";
import { View, ScrollView, Pressable, Switch } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useFocusEffect } from "@react-navigation/native";
import { ProgressBar, MD3Colors } from "react-native-paper";

import Typography from "../Typography";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../FormGroup";
import SettingsIcon from "../../assets/icons/Settings";
import Button from "../Button";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import TwoFactorAuthenticationIcon from "../../assets/icons/TwoFactorAuthentication";
import LimitIcon from "../../assets/icons/Limit";
import { limitsTabSchema } from "../../utils/formikSchema";
import { useGetLimitsQuery } from "../../redux/setting/settingSliceV2";
import { RootState } from "../../store";
import { arrayChecker } from "../../utils/helpers";
import vars from "../../styles/vars";

interface ISecurityTab {
  cleanUpTabSelection: () => void;
}

const LimitsTab: FC<ISecurityTab> = ({ cleanUpTabSelection }) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;

  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  console.log("🚀 ~ userData:", userData);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [isEnableTwoFactor, setTwoFactorAuthentication] =
    useState<boolean>(false);

  const {
    isLoading: isLoadingGetLimits,
    isError: isErrorGetProfile,
    isSuccess: isSuccessGetProfile,
    error: errorGetProfile,
    data: dataGetLimits,
  } = useGetLimitsQuery(
    {
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
      accountId: userData?.id,
    },
    {
      skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
    }
  );
  console.log("🚀 ~ errorGetProfile:", errorGetProfile);
  console.log("🚀 ~ dataGetLimits:", dataGetLimits);

  /* const [
    updatePasswordMutation,
    {
      isLoading: isLoadingUpdatePassword,
      isError: isErrorUpdatePassword,
      isSuccess: isSuccessUpdatePassword,
      error: errorUpdatePassword,
      data: dataUpdatePassword,
    },
  ] = useUpdatePasswordMutation(); */

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        transaction: "",
        daily: "",
        monthly: "",
      },
      validationSchema: limitsTabSchema,
      onSubmit: async ({ transaction, daily, monthly }) => {},
    });
  console.log("🚀 ~ values:", values);

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

  const calculatePercentage = (min: number, max: number) => {
    if (min < 0 || max < 0) {
      // Handle negative numbers if necessary
      return null;
    }
    if (min > max) {
      // Swap min and max if necessary
      [min, max] = [max, min];
    }
    // Calculate the percentage
    const percentage = (min / max) * 100;
    // Convert to floating-point number (divide by 100)
    const percentageAsFloat = percentage / 100;
    return percentageAsFloat;
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: "#ffff" }}>
        <Spinner visible={isLoadingGetLimits} />
        <SuccessModal
          isOpen={statusMessage?.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
        <Pressable>
          <View>
            <View>
              {arrayChecker(dataGetLimits)
                ? dataGetLimits.map((params: any, index: number) => {
                    const limitReached = params?.limit_reached
                      ? Number(params?.limit_reached)
                      : 0;
                    const limit = params?.limit ? Number(params?.limit) : 0;
                    const floatPercentage = calculatePercentage(
                      limitReached,
                      limit
                    );

                    let colorBar = "#0DCA9D";
                    if ((floatPercentage || 0) <= 0.3) {
                      colorBar = "#0DCA9D";
                    } else if ((floatPercentage || 0) <= 0.6) {
                      colorBar = "#FBB445";
                    } else if ((floatPercentage || 0) <= 0.1) {
                      colorBar = "#FF7171";
                    }

                    return (
                      <View>
                        <View
                          style={{ paddingHorizontal: 18, paddingBottom: 12 }}
                        >
                          <Typography
                            marginLeft={12}
                            marginBottom={12}
                            fontSize={16}
                            color="#4D4D4D"
                          >
                            {params?.type} limit
                          </Typography>
                          <FormGroup>
                            <FormGroup.Input
                              keyboardType="number-pad"
                              returnKeyType={"done"}
                              onChangeText={handleChange(`${params?.type}`)}
                              onBlur={handleBlur(`${params?.type}`)}
                              value={values[params?.limit] || ""}
                              placeholderTextColor={vars["ios-default-text"]}
                              placeholder={`€${params?.limit}`}
                              iconColor="#086AFB"
                              icon={<SettingsIcon size={12} />}
                            />
                          </FormGroup>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <View style={{ width: "94%" }}>
                              <ProgressBar
                                progress={floatPercentage || 0}
                                color={colorBar}
                              />
                            </View>
                          </View>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                width: "94%",
                              }}
                            >
                              <Typography fontSize={16} color="medium-grey2">
                                € {params?.limit_reached}/{params?.limit}
                              </Typography>
                            </View>
                          </View>
                        </View>
                        {index + 1 < dataGetLimits.length ? (
                          <Seperator
                            backgroundColor={vars["grey"]}
                            marginTop={4}
                            marginBottom={24}
                          />
                        ) : null}
                      </View>
                    );
                  })
                : null}
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

export default LimitsTab;
