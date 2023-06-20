import React from "react";
import { View, Text, ImageBackground, ImageSourcePropType } from "react-native";
import { styles } from "./timerStyles";
import { prependBase64 } from "../../utils/helpers";

export const TimerCard = ({ card, timer }: { card: string; timer: number }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.creditCardImg}>
        <ImageBackground
          style={styles.card}
          source={{ uri: prependBase64(card) }}
        >
          <View style={styles.overlay}>
            <Text style={styles.timer}>{timer}s</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};
