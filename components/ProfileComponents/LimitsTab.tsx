import { useState, useEffect, FC, Fragment } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { ProgressBar } from "react-native-paper";

import Typography from "../Typography";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../FormGroup";
import SettingsIcon from "../../assets/icons/Settings";
import LimitsIcon from "../../assets/icons/Limit";
import Button from "../Button";
import WholeContainer from "../../layout/WholeContainer";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import { limitsTabSchema } from "../../utils/formikSchema";
import {
  useGetLimitsQuery,
  useUpdateLimitsMutation,
} from "../../redux/setting/settingSliceV2";
import { RootState } from "../../store";
import { arrayChecker } from "../../utils/helpers";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ISecurityTab {
  cleanUpTabSelection: () => void;
}

const LimitsTab: FC<ISecurityTab> = ({ cleanUpTabSelection }) => {
  /* const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data; */

  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const userData = useSelector((state: RootState) => state?.auth?.userData);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  const {
    isLoading: isLoadingGetLimits,
    isError: isErrorGetProfile,
    /* isSuccess: isSuccessGetProfile,
    error: errorGetProfile, */
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

  useEffect(() => {
    if (!isLoadingGetLimits && isErrorGetProfile) {
      setStatusMessage({
        header: "Error",
        body: "Something went wrong getting your account limits",
        isOpen: false,
        isError: false,
      });
    }
  }, [isLoadingGetLimits, isErrorGetProfile]);

  const [
    updateLimit,
    {
      isLoading: isLoadingUpdateLimits,
      isError: isErrorUpdateLimits,
      isSuccess: isSuccessUpdateLimits,
      error: errorUpdateLimits,
      data: dataUpdateLimits,
    },
  ] = useUpdateLimitsMutation();
  console.log("🚀 ~ errorUpdateLimits:", errorUpdateLimits);
  useEffect(() => {
    if (!isLoadingUpdateLimits && isSuccessUpdateLimits) {
      if (dataUpdateLimits?.code === "200") {
        setStatusMessage({
          header: "Success",
          body: dataUpdateLimits?.message || "Updated your limit",
          isOpen: false,
          isError: false,
        });
      }
    }
  }, [isLoadingUpdateLimits, isSuccessUpdateLimits, dataUpdateLimits]);

  useEffect(() => {
    if (!isLoadingUpdateLimits && isErrorUpdateLimits) {
      if (
        errorUpdateLimits?.data?.code === 401 ||
        errorUpdateLimits?.status === 401
      ) {
        setStatusMessage({
          header: "Error",
          body: errorUpdateLimits?.data?.status || "Failed updating your limit",
          isOpen: true,
          isError: true,
        });
      }
    }
  }, [isLoadingUpdateLimits, isErrorUpdateLimits, errorUpdateLimits]);

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        transaction: "",
        daily: "",
        monthly: "",
      },
      validationSchema: limitsTabSchema,
      onSubmit: async ({ transaction, daily, monthly }) => {
        const transactionLimit = dataGetLimits.find(
          (param: any) => param?.type === "transaction"
        );
        const dailyLimit = dataGetLimits.find(
          (param: any) => param?.type === "daily"
        );
        const monthlyLimit = dataGetLimits.find(
          (param: any) => param?.type === "month"
        );
        const limitsArr = [
          {
            type: "transaction",
            limit: transaction || transactionLimit?.limit || "0",
          },
          { type: "daily", limit: daily || dailyLimit?.limit || "0" },
          { type: "monthly", limit: monthly || monthlyLimit?.limit || "0" },
        ];
        updateLimit({
          bodyParams: limitsArr,
          accessToken: userTokens?.access_token,
          tokenZiyl: userTokens?.token_ziyl,
          accountId: userData?.id,
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
    <Fragment>
      <ScrollView>
        <View style={{ backgroundColor: "#ffff" }}>
          <Spinner visible={isLoadingGetLimits || isLoadingUpdateLimits} />
          <SuccessModal
            isOpen={statusMessage?.isOpen}
            title={statusMessage.header}
            text={statusMessage.body}
            isError={statusMessage.isError}
            onClose={onCloseModal}
          />
          <Pressable>
            <View style={{ marginTop: 16 }}>
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
                                icon={<LimitsIcon size={14} />}
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
                                  € {params?.limit_reached} / {params?.limit}
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
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.footerContent}>
        <View style={styles.downloadBtnMain}>
          <WholeContainer>
            <Button
              color="light-pink"
              leftIcon={
                <Ionicons
                  color="#e7038e"
                  size={20}
                  name={"checkmark-circle-outline"}
                />
              }
              onPress={handleSubmit}
            >
              <Typography
                fontFamily="Nunito-SemiBold"
                fontSize={16}
                fontWeight={600}
              >
                Save changes
              </Typography>
            </Button>
          </WholeContainer>
        </View>
      </View>
    </Fragment>
  );
};

export default LimitsTab;
