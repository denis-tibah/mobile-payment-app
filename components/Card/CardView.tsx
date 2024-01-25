import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
// import ZazooDebitCard from "../../assets/images/zazoo-debit-card.png";
// import ZazooVirtualCard from "../../assets/images/zazoo-virtual-card.png";
import ZazooPhysicalCard from '../../assets/images/card_background_images/physical_card.png';
import ZazooVirtualCard from '../../assets/images/card_background_images/virtual_card.png';
import ZazooTerminated from '../../assets/images/card_background_images/terminated_card.png';
import ZazooPendingCard from '../../assets/images/card_background_images/pending_card.png';
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
}

export const CardView = ({
  freezeLoading,
  card,
  pin,
  timer,
  cardDetails,
}: CardViewProps) => {
  // if (pin) return <PinCard card={card} pin={pin} timer={timer} />; showing pin is disabled

  if (card?.frozenYN === "Y") {
    return (
      <FreezeCard
        card={card}
        loading={freezeLoading}
      />
    );
  }

  if (cardDetails.cardImage) {
    return <TimerCard timer={timer} card={cardDetails.cardImage} />;
  }

  const cardImage = card?.cardStatus === CardStatus.INACTIVE ? ZazooPendingCard :
  card?.lostYN === "N" ? card?.type === "P" ? ZazooPhysicalCard : ZazooVirtualCard : ZazooTerminated;
  const pan = card?.pan || "";

  const expiryMonth = (card?.expiration_date).split("-")[1] || "";
  const expiryYear = (card?.expiration_date).split("-")[0].slice(2,4)  || "";
  const profileData = useSelector((state: any) => state.profile?.profile)?.data;

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="contain"
        style={styles.cardContainer}
        imageStyle={{ borderRadius: 8, height: 245, width: 370 }}
        source={cardImage}
      >
        <View style={{width: '72%', paddingTop: 15}}>
          <Text style={styles.panTitle}>Card Number</Text>
          <Text style={styles.panText}>{pan}</Text>
        </View>
        <View style={styles.cardHolderAndExpiryDateContainer}>
          <View>
            <Text style={styles.cardHolder}>Card holder</Text>
            <Text style={styles.cardHolderName}>{profileData.first_name} {profileData.last_name}</Text>
          </View>
          <View>
            <Text style={styles.expiryDateTitle}>Expiry Date</Text>
            <Text style={styles.expiryDate}>{expiryMonth}/{expiryYear}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  cardHolderAndExpiryDateContainer: {
    width: '73%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  panTitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 25,
  },
  panText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "400",
    marginTop: -3,
  },
  cardContainer: {
    height: 225,
    width: 340,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: -5,
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
