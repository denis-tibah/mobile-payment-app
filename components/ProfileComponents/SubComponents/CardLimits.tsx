import { ScrollView, View } from "react-native";
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
  <ScrollView
    style={{
      backgroundColor: '#fff',
      // overflow: 'scroll',
      // flex: 1,
      // height: heightGlobal * .73,
      }}>
      <View style={{height: heightGlobal}}>
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
          style={{ paddingHorizontal: 12, paddingBottom: 5, marginTop: 5 }}
        >
        {
            valueKeys && valueKeys.map((valueKey: any, index: number) => {
              return (
                <View style={{
                  height: 80,
                  marginTop: 5,
                }}>
                  <Typography
                    marginLeft={17}
                    marginBottom={1}
                    fontSize={16}
                    color="#4D4D4D"
                    fontFamily="Nunito-SemiBold"
                  >
                    {`${capitalizeName(cardLimit?.key)} ${convertString(valueKey)} limit`} 
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
              )
            })
          }
      </View>
      )
    }) : <Typography fontSize={16} color="black">Loading...</Typography>}
    </View>
  </ScrollView>
  )
}
export default CardLimit;
