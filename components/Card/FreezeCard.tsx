import React, { useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles";
import SunIcon from "../../assets/icons/Sun";

import Button from "../Button";
import ZazooFrozenPhysicalCard from "../../assets/images/card_background_images/frozen_card_physical.png";
import ZazooFrozenVirtualCard from "../../assets/images/card_background_images/frozen_card_virtual.png";
import { getCards, setCardAsFrozen } from "../../redux/card/cardSlice";
import Spinner from "react-native-loading-spinner-overlay";
import { RootState } from "../../store";

export const FreezeCard = ({ card, loading }:any) => {
  return (
    <View style={{
      alignItems: "center",
      justifyContent: "center"
    }}>
      <ImageBackground
        imageStyle={{ borderRadius: 8, height: 238, width: 390, left: -23}}
        resizeMode="contain"
        style={{
          height: 225,
          width: 340,
          borderRadius: 70,
          justifyContent: "center",
          alignItems: "center",
        }}
        source={card?.type === "P" ? ZazooFrozenPhysicalCard : ZazooFrozenVirtualCard}
      >
      </ImageBackground>
    </View>
  );
};
