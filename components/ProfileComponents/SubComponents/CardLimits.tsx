import React, { Fragment, useEffect, useState, useRef } from "react";
import { View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import Typography from "../../Typography";
import { arrayChecker, capitalizeName } from "../../../utils/helpers";
import { useLazyGetCardLimitQuery } from "../../../redux/card/cardSliceV2";
import FormGroup from "../../FormGroup";
import vars from "../../../styles/vars";
import LimitsIcon from "../../../assets/icons/Limit";
import Button from "../../Button";
import SwipableBottomSheet from "../../SwipableBottomSheet";
import { Seperator } from "../../Seperator/Seperator";
import { styles } from "../styles";

type CardLimitProps = {};

const CardLimit: React.FC<CardLimitProps> = (): JSX.Element => {
  const [cardLimitsProperties, setCardLimitProperties] = useState<any>([
    {
      key: "amount",
      header: "Amount limits",
      data: {},
    },
    {
      key: "transaction",
      header: "Transaction limits",
      data: {},
    },
    {
      key: "atmAmount",
      header: "ATM amount limits",
      data: {},
    },
    {
      key: "atmTransaction",
      header: "ATM tansaction limits",
      data: {},
    },
    {
      key: "posAmount",
      header: "POS amount  limits",
      data: {},
    },
    {
      key: "posTransaction",
      header: "POS transaction  limits",
      data: {},
    },
  ]);
  const [selectedLimit, setSelectedLimit] = useState<{
    key: string | null;
    header: string;
    data: any;
    type: string;
  }>({ key: "0", header: "", data: {}, type: "" });
  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(0);

  const refRBSheet = useRef();

  const [
    getCardLimits,
    {
      data: cardLimitsData,
      isLoading: isLoadingCardLimit,
      isSuccess: isSuccessCardLimit,
    },
  ] = useLazyGetCardLimitQuery();
  useEffect(() => {
    if (!isLoadingCardLimit && isSuccessCardLimit) {
      const daily = cardLimitsData?.data?.daily;
      const monthly = cardLimitsData?.data?.monthly;
      const updatedCardLimits = cardLimitsProperties.map((params: any) => {
        if (params.key === "transaction") {
          Object.assign(params, {
            data: {
              daily: daily?.transaction,
              monthly: monthly?.transaction,
            },
          });
        }
        if (params.key === "amount") {
          Object.assign(params, {
            data: {
              daily: daily?.amount,
              monthly: monthly?.amount,
            },
          });
        }
        if (params.key === "atmAmount") {
          Object.assign(params, {
            data: {
              daily: daily?.atm_amount,
              monthly: monthly?.atm_amount,
            },
          });
        }
        if (params.key === "atmTransaction") {
          Object.assign(params, {
            data: {
              daily: daily?.atm_transaction,
              monthly: monthly?.atm_transaction,
            },
          });
        }
        if (params.key === "posAmount") {
          Object.assign(params, {
            data: {
              daily: daily?.pos_amount,
              monthly: monthly?.pos_amount,
            },
          });
        }
        if (params.key === "posTransaction") {
          Object.assign(params, {
            data: {
              daily: daily?.pos_transaction,
              monthly: monthly?.pos_transaction,
            },
          });
        }
        return params;
      });

      setCardLimitProperties([...updatedCardLimits]);
    }
  }, [isLoadingCardLimit, isSuccessCardLimit, cardLimitsData]);

  useEffect(() => {
    getCardLimits(null);
  }, []);

  const displayLimits = (params: any | null, type: string) => {
    return (
      <Fragment>
        <Typography fontSize={16} fontWeight="400" fontFamily="Mukta-Regular">
          {type}
        </Typography>
        <Button
          color="light-blue"
          leftIcon={<FontAwesome color="#086AFB" size={12} name={"euro"} />}
          onPress={() => {
            refRBSheet?.current?.open();
            setSelectedLimit({ ...params, type });
          }}
        >
          <Typography
            fontWeight="500"
            fontSize={12}
            fontFamily="Mukta-SemiBold"
          >
            {params?.data?.[type.toLowerCase()]}
          </Typography>
        </Button>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <View>
        <View style={{ marginTop: 16 }}>
          {arrayChecker(cardLimitsProperties) && cardLimitsProperties.length > 0
            ? cardLimitsProperties.map((params: any, index: number) => {
                return (
                  <Fragment key={params?.key}>
                    <Typography
                      fontWeight="600"
                      fontSize={16}
                      fontFamily="Nunito-Regular"
                    >
                      {params?.data?.daily || params?.data?.monthly
                        ? params?.header
                        : ""}
                    </Typography>
                    {params?.data?.daily ? (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        {displayLimits(params, "Daily")}
                      </View>
                    ) : null}
                    {params?.data?.monthly ? (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        {displayLimits(params, "Monthly")}
                      </View>
                    ) : null}
                    {(params?.data?.daily || params?.data?.monthly) &&
                    index + 1 < cardLimitsProperties.length ? (
                      <Seperator
                        backgroundColor={vars["v2-light-grey"]}
                        marginBottom={16}
                      />
                    ) : null}
                  </Fragment>
                );
              })
            : null}
        </View>
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
              /* onChangeText={handleChange(`${selectedLimit?.type}`)}
              onBlur={handleBlur(`${selectedLimit?.type}`)}
              value={values[selectedLimit?.limit]} */
              placeholderTextColor={vars["ios-default-text"]}
              placeholder={`€ ${
                selectedLimit?.data?.[
                  selectedLimit?.type ? selectedLimit?.type.toLowerCase() : ""
                ]
              }`}
              iconColor="#086AFB"
              icon={<LimitsIcon size={14} />}
              disabled
            />
          </FormGroup>

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
                // onPress={handleSubmit}
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
export default CardLimit;
