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
        imageStyle={{ borderRadius: 8, height: 225, width: 340 }}
        source={cardImage}
      >
        <Text style={styles.panTitle}>Card Number</Text>
        <Text style={styles.panText}>{pan}</Text>
        <Text style={styles.cardHolder}>Card holder</Text>
        <Text style={styles.cardHolderName}>{profileData.first_name} {profileData.last_name}</Text>
        <Text style={styles.expiryDateTitle}>Expiry Date</Text>
        <Text style={styles.expiryDate}>{expiryMonth}/{expiryYear}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 225,
    width: 340,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  panTitle: {
    marginLeft:-60,
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 46,
  },
  panText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft:40,
    marginTop: -3,
  },
  cardHolder: {
    marginLeft:-170,
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 45,
  },
  cardHolderName: {
    marginLeft: -140,
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: -5,
  },
  expiryDateTitle: {
    marginLeft:80,
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: -29,
  },
  expiryDate: {
    marginLeft:80,
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: -5,
  },
  container: {
    alignItems: "center",
    justifyContent: "center"
  }
});
