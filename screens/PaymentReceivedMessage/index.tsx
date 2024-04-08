import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

import { screenNames } from "../../utils/helpers";
/* import { Modal } from "../../components/Modal/Modal"; */
import CheckIcon from "../../assets/icons/Check";
import Typography from "../../components/Typography";
/* import Button from "../../components/Button"; */
import SwipableBottomSheet from "../../components/SwipableBottomSheet";

export default function PaymentReceivedScreen({
  isOpen,
  data,
  setShowReceivedPayment,
  notificationIdentifier,
}: any) {
  const {
    transactionDetails = {
      amount: 0,
      message: "",
      title: "",
      card: "",
      currency: "",
      ref: "",
      transactionId: "",
    },
    userId = "",
  } = data || {};

  const windowDimensions = Dimensions.get("screen");
  const refRBSheet = useRef();

  const { navigate }: any = useNavigation();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpenModal) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [isOpenModal]);

  const closePopup = async () => {
    setShowReceivedPayment({ show: false, data: {} });
    //dismiss all/single notifications
    Notifications.dismissNotificationAsync(notificationIdentifier);
    navigate(screenNames.myaccount);
  };

  return (
    <Fragment>
      {/* <Modal isOpen={true} headerTitle={transactionDetails.title}>
        <View style={styles.container}>
          {transactionDetails && (
            <View style={styles.transactionDetails}>
              <Text>
                {transactionDetails.message}
                {transactionDetails.currency}
                {transactionDetails.amount}
              </Text>
            </View>
          )}
          <Button color={"green"} onPress={() => closePopup()}>
            <Text style={styles.buttonText}>OK</Text>
          </Button>
        </View>
      </Modal> */}
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          closePopup();
        }}
        wrapperStyles={{
          backgroundColor: "rgba(172, 172, 172, 0.5)",
          zIndex: 2,
        }}
        wrapper={{ backgroundColor: "blue" }}
        containerStyles={{
          height: windowDimensions.height - 430,
          backgroundColor: "#0DCA9D",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#FFF", width: 90 }}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerWrapper}>
            <CheckIcon color="white" size={18} />
            <Typography
              color="#FFFF"
              fontSize={18}
              marginLeft={6}
              fontWeight={600}
            >
              Payment recieved
            </Typography>
          </View>
        </View>
        <View style={{ backgroundColor: "#fff" }}>
          {transactionDetails && (
            <View style={styles.transactionDetails}>
              <Typography
                color="#696F7A"
                fontSize={14}
                marginLeft={6}
                fontWeight={400}
                fontFamily="Mukta-Regular"
              >
                {/* {transactionDetails.message}
                {transactionDetails.currency}
                {transactionDetails.amount} */}
                Some message here from BE
              </Typography>
            </View>
          )}
        </View>
        <View style={styles.imageWrapper}>
          <Image
            source={require('("../../../assets/images/payment-approved.png')}
            style={styles.image}
          />
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
}

const styles: any = StyleSheet.create<any>({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    fontSize: 14,
    fontWeight: 400,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  headerContainer: {
    backgroundColor: "#0DCA9D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    width: "100%",
    height: 60,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  okWrapper: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  image: {
    height: 200,
    width: 180,
    marginTop: 40,
    marginLeft: 90,
  },
  buttonOK: { backgroundColor: "#fff", height: 30, width: 90, marginTop: 24 },
});
