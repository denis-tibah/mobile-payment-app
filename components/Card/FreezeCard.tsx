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
    <View style={styles.cardContainer}>
      <ImageBackground
        style={{
          borderRadius: 25, 
          height: 230,
          width: 390,
          // left: 20
        }}
        source={card?.type === "P" ? ZazooFrozenPhysicalCard : ZazooFrozenVirtualCard}
      >
      </ImageBackground>
    </View>
  );
};
