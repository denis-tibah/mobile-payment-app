import React, { Fragment, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Typography from "../../Typography";
import {
  heightGlobal,
  arrayChecker,
  capitalizeName,
} from "../../../utils/helpers";
import { useLazyGetCardLimitQuery } from "../../../redux/card/cardSliceV2";
import FormGroup from "../../FormGroup";
import vars from "../../../styles/vars";
import LimitsIcon from "../../../assets/icons/Limit";
import Button from "../../Button";
import WholeContainer from "../../../layout/WholeContainer";
import { Seperator } from "../../Seperator/Seperator";

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
  const [
    getCardLimits,
    {
      data: cardLimitsData,
      isLoading: isLoadingCardLimit,
      isSuccess: isSuccessCardLimit,
    },
  ] = useLazyGetCardLimitQuery();
  console.log("🚀 ~ cardLimitsData:", cardLimitsData);
  console.log("🚀 ~ cardLimitsProperties:", cardLimitsProperties);
  useEffect(() => {
    if (!isLoadingCardLimit && isSuccessCardLimit) {
      const daily = cardLimitsData?.data?.daily;
      const monthly = cardLimitsData?.data?.monthly;
      const updatedCardLimits = cardLimitsProperties.map((params: any) => {
        // const newObj = {};
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

  const formattedCardLimits = (cardLimit: any) => {
    if (!cardLimit) return [];
    return Object.keys(cardLimit).map((key: any) => {
      return {
        key,
        value: cardLimit[key],
      };
    });
  };

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
          leftIcon={<FontAwesome color="#086AFB" size={14} name={"euro"} />}
          onPress={() => {
            // refRBSheet?.current?.open();
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
    <ScrollView
      style={{
        backgroundColor: "#fff",
      }}
    >
      <View style={{ height: heightGlobal }}>
        <View style={{ marginTop: 16 }}>
          {arrayChecker(cardLimitsProperties) && cardLimitsProperties.length > 0
            ? cardLimitsProperties.map((params: any) => {
                return (
                  <WholeContainer>
                    <Typography
                      fontWeight="600"
                      fontSize={16}
                      fontFamily="Nunito-Regular"
                    >
                      {params?.header}
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
                    <Seperator
                      backgroundColor={vars["v2-light-grey"]}
                      marginBottom={16}
                    />
                  </WholeContainer>
                );
              })
            : null}
        </View>

        {/* {cardLimitsData ? (
          formattedCardLimits(cardLimitsData.data).map(
            (cardLimit: any, index: number) => {
              const capitalizeName = (name: string) => {
                return name.charAt(0).toUpperCase() + name.slice(1);
              };
              const convertString = (string: string) => {
                return string
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());
              };
              const valueKeys = Object.keys(cardLimit?.value);
              return (
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingBottom: 5,
                    marginTop: 5,
                  }}
                >
                  {valueKeys &&
                    valueKeys.map((valueKey: any, index: number) => {
                      return (
                        <View
                          style={{
                            height: 80,
                            marginTop: 5,
                          }}
                        >
                          <Typography
                            marginLeft={17}
                            marginBottom={1}
                            fontSize={16}
                            color="#4D4D4D"
                            fontFamily="Nunito-SemiBold"
                          >
                            {`${capitalizeName(cardLimit?.key)} ${convertString(
                              valueKey
                            )} limit`}
                          </Typography>
                          <Typography
                            marginLeft={12}
                            marginBottom={4}
                            marginTop={5}
                            fontSize={14}
                            color="#4D4D4D"
                            borderRadius={25}
                            borderColor={vars["accent-blue"]}
                            borderWidth={1}
                            paddingLeft={15}
                            paddingTop={8}
                            height={40}
                          >
                            {`€ ${cardLimit?.value[valueKey]}`}
                          </Typography>
                        </View>
                      );
                    })}
                </View>
              );
            }
          )
        ) : (
          <Typography fontSize={16} color="black">
            Loading...
          </Typography>
        )} */}
      </View>
    </ScrollView>
  );
};
export default CardLimit;
