import { Pressable, View } from "react-native";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { Platform } from "react-native";
import { ProgressBar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";
import { responsiveHeight as rh } from "react-native-responsive-dimensions";

import SwipableBottomSheet from "../../SwipableBottomSheet";

import {
  arrayChecker,
  calculatePercentage,
  capitalizeName,
} from "../../../utils/helpers";
import Typography from "../../Typography";
import FormGroup from "../../FormGroup";
import LimitsIcon from "../../../assets/icons/Limit";
import {
  useGetLimitsQuery,
  useUpdateLimitsMutation,
} from "../../../redux/setting/settingSliceV2";
import { RootState } from "../../../store";
import { limitsTabSchema } from "../../../utils/formikSchema";
import { Seperator } from "../../Seperator/Seperator";
import vars from "../../../styles/vars";
import WholeContainer from "../../../layout/WholeContainer";
import Button from "../../Button";
import { styles } from "../styles";
import { SuccessModal } from "../../SuccessModal/SuccessModal";

type AccountLimitProps = {};

const AccountLimits: React.FC<AccountLimitProps> = (): JSX.Element => {
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const userData = useSelector((state: RootState) => state?.auth?.userData);

  const refRBSheet = useRef();

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  const {
    isLoading: isLoadingGetLimits,
    isError: isErrorGetProfile,
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
  console.log("🚀 ~ dataGetLimits:", dataGetLimits);

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
              {arrayChecker(dataGetLimits) && dataGetLimits.length > 0
                ? dataGetLimits.map((params: any, index: number) => {
                    return (
                      <WholeContainer>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                          }}
                        >
                          <Typography
                            fontSize={16}
                            fontWeight="600"
                            fontFamily="Nunito-Regular"
                          >
                            {capitalizeName(params?.type)}
                          </Typography>
                          <Button
                            color="light-blue"
                            leftIcon={
                              <FontAwesome
                                color="#086AFB"
                                size={14}
                                name={"euro"}
                              />
                            }
                            onPress={() => {
                              refRBSheet?.current?.open();
                            }}
                          >
                            <Typography
                              fontWeight="600"
                              fontSize={14}
                              fontFamily="Mukta-SemiBold"
                            >
                              {params?.limit}
                            </Typography>
                          </Button>
                        </View>
                      </WholeContainer>
                    );
                  })
                : null}
              {/* <View>
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

                      const capitalizeName = (name: string) => {
                        return name.charAt(0).toUpperCase() + name.slice(1);
                      };

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
                              {capitalizeName(params?.type)} limit
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
                                disabled
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
              </View> */}
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
                fontWeight={"600"}
              >
                Save changes
              </Typography>
            </Button>
          </WholeContainer>
        </View>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: rh(Platform.OS === "android" ? 30 : 40),
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      ></SwipableBottomSheet>
    </Fragment>
  );
};

export default AccountLimits;
