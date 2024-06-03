import React from "react";
import { useSelector } from "react-redux";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
// import ZazooDebitCard from "../../assets/images/zazoo-debit-card.png";
// import ZazooVirtualCard from "../../assets/images/zazoo-virtual-card.png";
import ZazooPhysicalCard from "../../assets/images/card_background_images/physical_card.png";
import ZazooVirtualCard from "../../assets/images/card_background_images/virtual_card.png";
import ZazooTerminated from "../../assets/images/card_background_images/terminated_card.png";
import ZazooPendingCard from "../../assets/images/card_background_images/pending_card.png";
// import ZazooVirtualCard from "../../assets/images/zazocard.png";
import { useGetProfileQuery } from "../../redux/profile/profileSliceV2";
import { FreezeCard } from "./FreezeCard";
import { CardStatus } from "../../utils/constants";
import Typography from "../Typography";
import { RootState } from "../../store";

interface CardViewProps {
  freezeLoading: boolean;
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
  if (card?.frozenYN === "Y") {
    return <FreezeCard card={card} loading={freezeLoading} />;
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
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const { isLoading: isLoadingGetProfile, data: dataGetProfile } =
    useGetProfileQuery(
      {
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      },
      {
        skip:
          !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
      }
    );

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="contain"
        style={styles.cardContainer}
        imageStyle={{ borderRadius: 8, height: 239, width: 390, left: -23 }}
        source={cardImage}
      >
        <View
          style={[
            styles.headerText,
            {
              paddingTop: 30,
            },
          ]}
        >
          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              fontFamily="Nunito-Regular"
              fontSize={14}
              fontWeight="700"
              marginRight={6}
            >
              {timer() > 0 ? timer() : ""}
              {timer() > 0 ? "s" : ""}
            </Typography>
          </View>
        </View>
        <View
          style={[
            styles.headerText,
            {
              paddingTop: 10,
            },
          ]}
        >
          <View style={{ width: "78%", marginTop: 0 }}>
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
                  {dataGetProfile?.first_name || ""}{" "}
                  {dataGetProfile?.last_name || ""}
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
  headerText: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
