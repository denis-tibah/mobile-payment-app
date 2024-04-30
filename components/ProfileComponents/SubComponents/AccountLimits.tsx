import { Pressable, View } from "react-native";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { ProgressBar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";

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
  const [selectedLimit, setSelectedLimit] = useState<{
    id: number | null;
    limit: string;
    limit_reached: number;
    type: string;
  }>({ id: 0, limit: "", limit_reached: 0, type: "" });
  const [UIProperties, setUIProperties] = useState<{
    colorBar: string;
    floatPercentage: number | null;
  }>({ colorBar: "", floatPercentage: 0 });
  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(0);

  useEffect(() => {
    let percentage;
    let colorBar = "#0DCA9D";
    if (selectedLimit?.limit_reached) {
      const limitReached = selectedLimit?.limit_reached
        ? Number(selectedLimit?.limit_reached)
        : 0;
      const limit = selectedLimit?.limit ? Number(selectedLimit?.limit) : 0;
      percentage = calculatePercentage(limitReached, limit);

      if ((percentage || 0) <= 0.3) {
        colorBar = "#0DCA9D";
      } else if ((percentage || 0) <= 0.6) {
        colorBar = "#FBB445";
      } else if ((percentage || 0) <= 0.1) {
        colorBar = "#FF7171";
      }

      setUIProperties({ colorBar, floatPercentage: percentage });
    }
  }, [selectedLimit]);

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
              ? dataGetLimits.map((params: any) => {
                  return (
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
                        fontWeight="400"
                        fontFamily="Mukta-Regular"
                      >
                        {capitalizeName(params?.type)}
                      </Typography>
                      <Button
                        color="light-blue"
                        leftIcon={
                          <FontAwesome
                            color="#086AFB"
                            size={12}
                            name={"euro"}
                          />
                        }
                        onPress={() => {
                          setSelectedLimit({ ...params });
                          refRBSheet?.current?.open();
                        }}
                      >
                        <Typography
                          fontWeight="500"
                          fontSize={12}
                          fontFamily="Mukta-SemiBold"
                        >
                          {params?.limit}
                        </Typography>
                      </Button>
                    </View>
                  );
                })
              : null}
          </View>
        </Pressable>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: bottomSheetHeight + 45,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setBottomSheetHeight(height);
          }}
        >
          <Typography
            marginBottom={18}
            fontSize={16}
            fontFamily="Mukta-Regular"
            color="#4D4D4D"
            fontWeight="500"
          >
            {capitalizeName(selectedLimit?.type)} limit
          </Typography>
          <FormGroup>
            <FormGroup.Input
              keyboardType="number-pad"
              returnKeyType={"done"}
              onChangeText={handleChange(`${selectedLimit?.type}`)}
              onBlur={handleBlur(`${selectedLimit?.type}`)}
              value={values[selectedLimit?.limit]}
              placeholderTextColor={vars["ios-default-text"]}
              placeholder={`€${selectedLimit?.limit}`}
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
                progress={UIProperties.floatPercentage || 0}
                color={UIProperties.colorBar}
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
              <Typography
                fontSize={14}
                fontWeight="400"
                color="medium-grey2"
                fontFamily="Mukta-Regular"
              >
                € {selectedLimit?.limit_reached} / {selectedLimit?.limit}
              </Typography>
            </View>
          </View>
          <View style={[styles.footerContent, { marginTop: 20 }]}>
            <View style={styles.downloadBtnMain}>
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
                  Submit
                </Typography>
              </Button>
            </View>
          </View>
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
};

export default AccountLimits;
