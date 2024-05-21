import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
// import ZazooDebitCard from "../../assets/images/zazoo-debit-card.png";
// import ZazooVirtualCard from "../../assets/images/zazoo-virtual-card.png";
import ZazooPhysicalCard from "../../assets/images/card_background_images/physical_card.png";
import ZazooVirtualCard from "../../assets/images/card_background_images/virtual_card.png";
import ZazooTerminated from "../../assets/images/card_background_images/terminated_card.png";
import ZazooPendingCard from "../../assets/images/card_background_images/pending_card.png";
// import ZazooVirtualCard from "../../assets/images/zazocard.png";
import { FreezeCard } from "./FreezeCard";
import { PinCard } from "./PinCard";
import { TimerCard } from "./TimerCard";
import { getProfile } from "../../redux/profile/profileSlice";
import { CardStatus } from "../../utils/constants";

interface CardViewProps {
  freezeLoading: boolean;
  // unFreezeCard: () => void;
  card: any;
  pin: any;
  timer: any;
  resetHandler: () => void;
  cardDetails: any;
  cardDetailsDecrypted: any;
}

export const CardView = ({
  freezeLoading,
  card,
  pin,
  timer,
  cardDetails,
  cardDetailsDecrypted,
}: CardViewProps) => {
  // if (pin) return <PinCard card={card} pin={pin} timer={timer} />; showing pin is disabled

  if (card?.frozenYN === "Y") {
    return <FreezeCard card={card} loading={freezeLoading} />;
  }

  if (cardDetails.cardImage) {
    return <TimerCard timer={timer} card={cardDetails.cardImage} />;
  }

  const cardImage =
    card?.cardStatus === CardStatus.INACTIVE
      ? ZazooPendingCard
      : card?.lostYN === "N"
      ? card?.type === "P"
        ? ZazooPhysicalCard
        : ZazooVirtualCard
      : ZazooTerminated;
  const pan = card?.pan || "";

  const expiryMonth = (card?.expiration_date).split("-")[1] || "";
  const expiryYear = (card?.expiration_date).split("-")[0].slice(2, 4) || "";
  const profileData = useSelector((state: any) => state.profile?.profile)?.data;

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="contain"
        style={styles.cardContainer}
        imageStyle={{ borderRadius: 8, height: 239, width: 390, left: -23 }}
        source={cardImage}
      >
        <View
          style={{
            width: "100%",
            paddingTop: 32,
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "78%", marginTop: 28 }}>
            <Text style={styles.panTitle}>Card Number</Text>
            <Text style={styles.panText}>
              {cardDetailsDecrypted?.cardNumber || pan}
            </Text>
          </View>
        </View>
        <View style={styles.cardHolderAndExpiryDateContainer}>
          <View
            style={{
              width: "78%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <View>
                <Text style={styles.cardHolder}>Card holder</Text>
                <Text style={styles.cardHolderName}>
                  {profileData.first_name} {profileData.last_name}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: `${
                    cardDetailsDecrypted?.cvc ? "column" : "row"
                  }`,
                  alignItems: `${
                    cardDetailsDecrypted?.cvc ? "flex-start" : "flex-end"
                  }`,
                }}
              >
                {cardDetailsDecrypted?.cvc ? (
                  <View>
                    <Text style={styles.expiryDateTitle}>CVC</Text>
                    <Text style={styles.expiryDate}>
                      {cardDetailsDecrypted?.cvc}
                    </Text>
                  </View>
                ) : null}
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.expiryDateTitle}>Expiry Date</Text>
                  <Text style={styles.expiryDate}>
                    {expiryMonth}/{expiryYear}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardHolderAndExpiryDateContainer: {
    width: "100%",
    height: "45%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    //backgroundColor: "green",
  },
  panTitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "600",
  },
  panText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "400",
  },
  cardContainer: {
    height: 225,
    width: 340,
    borderRadius: 70,
  },
  cardHolder: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "600",
  },
  cardHolderName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "400",
  },
  expiryDateTitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "600",
  },
  expiryDate: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "400",
  },
});
