import { View } from "react-native";
import React, { Fragment, useEffect } from "react";
import { ProgressBar } from 'react-native-paper';
import Typography from "../../Typography";
import { heightGlobal } from "../../../utils/helpers";
import { useLazyGetCardLimitQuery } from "../../../redux/card/cardSliceV2";
import FormGroup from "../../FormGroup";
import vars from "../../../styles/vars";
import LimitsIcon from "../../../assets/icons/Limit";

const CardLimit: React.FC = () => {
  const [getCardLimits,{
    data: cardLimitsData,
  }] = useLazyGetCardLimitQuery();

  const formattedCardLimits = (cardLimit: any) => {
    if (!cardLimit) return [];
    return Object.keys(cardLimit).map((key: any) => {
      return {
        key,
        value: cardLimit[key]
      }
    });
  }

  useEffect(() => {
    getCardLimits(null);
  }, []);

  return (
  <View style={{backgroundColor: '#fff', flex: 1, height: heightGlobal}}>
    <Fragment>
      { cardLimitsData ? formattedCardLimits(cardLimitsData.data).map((cardLimit: any, index: number) => {
        const capitalizeName = (name: string) => {
          return name.charAt(0).toUpperCase() + name.slice(1);
        };
        return (
          <View
            style={{ paddingHorizontal: 18, paddingBottom: 12 }}
          >
          <Typography
            marginLeft={12}
            marginBottom={12}
            fontSize={16}
            color="#4D4D4D"
          >
            {capitalizeName(cardLimit?.key)} limit
          </Typography>
          <FormGroup>
            <FormGroup.Input
              keyboardType="number-pad"
              returnKeyType={"done"}
              // onChangeText={handleChange(`${params?.type}`)}
              // onBlur={handleBlur(`${params?.type}`)}
              value={cardLimit?.value.atm_amount}
              placeholderTextColor={vars["ios-default-text"]}
              placeholder={`€${cardLimit?.value.atm_amount}`}
              iconColor="#086AFB"
              icon={<LimitsIcon size={14} />}
              disabled
            />
          </FormGroup>
          {/* <View -- progress bar - doesnt have limit_reached and limit so ill comment it for now. - arjay
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
          </View> */}
          {/* <View
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
          </View> */}
        </View>
        )
      }) : <Typography fontSize={16} color="black">Loading...</Typography>}
    </Fragment>
  </View>
  )
}
export default CardLimit;
