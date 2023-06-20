import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { styles } from "./styles";
import SunIcon from "../../assets/icons/Sun";

import Button from "../Button";
import ZazooDebitCard from "../../assets/images/zazoo-debit-card.png";
import ZazooVirtualCard from "../../assets/images/zazoo-virtual-card.png";

export const FreezeCard = ({ card, unFreezeCard, loading }:any) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.creditCardImg}>
        <ImageBackground
          style={styles.card}
          source={card?.type === "P" ? ZazooDebitCard : ZazooVirtualCard}
          blurRadius={90}
        >
          <View style={styles.overlay}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Your card is frozen</Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onPress={unFreezeCard}
                  color="light-blue"
                  disabled={loading}
                  leftIcon={<SunIcon color="blue" />}
                >
                  Unfreeze now
                </Button>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
