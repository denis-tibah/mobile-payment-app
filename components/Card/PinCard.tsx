import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { styles } from "./styles";
import SunIcon from "../../assets/icons/Sun";

import Button from "../Button";
import ZazooDebitCard from "../../assets/images/zazoo-debit-card.png";
import ZazooVirtualCard from "../../assets/images/zazoo-virtual-card.png";
import { arrayChecker } from "../../utils/helpers";

export const PinCard = ({ card, pin, timer }: any) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.creditCardImg}>
        <ImageBackground
          style={styles.card}
          source={card?.type === "P" ? ZazooDebitCard : ZazooVirtualCard}
          blurRadius={4}
        >
          <View style={styles.overlay}>
            <Text style={styles.timer}>{timer}s</Text>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Your pin number is</Text>
              <Text style={styles.pin}>
                {arrayChecker(pin) &&
                  pin
                    .split("")
                    .map((digit: any, idx: any) =>
                      idx < pin.length - 1 ? digit + " - " : digit
                    )}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
