import { View } from "react-native";
import React, { Fragment, useEffect } from "react";
import Typography from "../../Typography";
import { heightGlobal } from "../../../utils/helpers";
import { useLazyGetCardLimitQuery } from "../../../redux/card/cardSliceV2";
import FormGroup from "../../FormGroup";
import vars from "../../../styles/vars";
import LimitsIcon from "../../../assets/icons/Limit";

type CardLimitProps = {

}

const CardLimit: React.FC<CardLimitProps> = (): JSX.Element => {
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
        const convertString = (string: string) => {
          return string.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        const valueKeys = Object.keys(cardLimit?.value);
        return (
          <View
            style={{ paddingHorizontal: 12, paddingBottom: 5  }}
          >
          {
              valueKeys && valueKeys.map((valueKey: any, index: number) => {
                return (
                  <Fragment>
                    <Typography
                      marginLeft={12}
                      marginBottom={1}
                      fontSize={16}
                      color="#4D4D4D"
                      fontFamily="Nunito-Bold"
                    >
                      {`${capitalizeName(cardLimit?.key)} ${convertString(valueKey)} limit`} 
                    </Typography>
                    <Typography
                      marginLeft={12}
                      marginBottom={4}
                      fontSize={14}
                      color="#4D4D4D"
                      borderRadius={100}
                      borderColor={vars["accent-blue"]}
                      borderWidth={1}
                      paddingLeft={10}
                    >
                      {`€ ${cardLimit?.value[valueKey]}`} 
                    </Typography>
                  </Fragment>
                )
              })
            }
        </View>
        )
      }) : <Typography fontSize={16} color="black">Loading...</Typography>}
    </Fragment>
  </View>
  )
}
export default CardLimit;
