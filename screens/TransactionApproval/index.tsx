import React, { useState, useEffect, useRef, Fragment } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import * as Notifications from "expo-notifications";

import { screenNames } from "../../utils/helpers";
import { api } from "../../api";
/* import { Modal } from "../../components/Modal/Modal"; */
import Button from "../../components/Button";
import CheckIcon from "../../assets/icons/Check";
import Typography from "../../components/Typography";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { RootState } from "../../store";
import { useGetProfileQuery } from "../../redux/profile/profileSliceV2";

export default function TransactionApprovalScreen({
  isOpen,
  data,
  setShowApproval,
  notificationIdentifier,
}: any) {
  console.log("🚀 ~ data:", data);
  const {
    transactionDetails = {
      requestType: "",
      amount: 0,
      title: "",
      message: "",
      card: "",
      transactionId: "",
      ref: "",
      currency: "",
      transactonDate: "",
      body: "",
    },
    userId = "",
  } = data || {};
  const { navigate }: any = useNavigation();
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const windowDimensions = Dimensions.get("screen");
  const refRBSheet = useRef();

  const { refetch: refetchProfile } = useGetProfileQuery(
    {
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    },
    {
      skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
    }
  );

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

  const handleTransactionResponse = async (id: any, ref: any, status: any) => {
    try {
      const responsePayload = { id: id, reference: ref, approve: status };
      await api.post("/authorizationNotificationFinXP", responsePayload);
    } catch (error) {
      console.error(error);
    } finally {
      setShowApproval({ show: false, data: {} });
      //dismiss single notifications
      Notifications.dismissNotificationAsync(notificationIdentifier);
      setTimeout(() => {
        refetchProfile();
      }, 2000);
    }
    setTimeout(() => {}, 1500);
    navigate(screenNames.myaccount);
  };

  return (
    <Fragment>
      {/* <Modal
        isOpen={isOpen}
        footer={
          <View style={styles.buttonContainer}>
            <Button
              color="light-pink"
              onPress={() =>
                handleTransactionResponse(
                  transactionDetails.transactionId,
                  transactionDetails.ref,
                  false
                )
              }
            >
              Decline
            </Button>
          </View>
        }
        headerTitle={transactionDetails.title}
      >
        <View style={styles.container}>
          {transactionDetails && (
            <View style={styles.transactionDetails}>
              <Text>
                {transactionDetails.message} of {""}
                {transactionDetails.amount} {""} {transactionDetails.currency}{" "}
                {""} with id {transactionDetails.transactionId}
                was executed at {""} {transactionDetails.transactonDate}
              </Text>
            </View>
          )}
          <Button
            color={"green"}
            onPress={() =>
              handleTransactionResponse(
                transactionDetails.transactionId,
                transactionDetails.ref,
                true
              )
            }
          >
            <Text style={styles.buttonText}>Approve</Text>
          </Button>
        </View>
      </Modal> */}

      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {}}
        wrapperStyles={{
          backgroundColor: "rgba(172, 172, 172, 0.5)",
          zIndex: 2,
        }}
        height={windowDimensions.height - 400}
        containerStyles={{
          backgroundColor: Platform.OS === "ios" ? "#fff" : "#0DCA9D",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          zIndex: 2,
        }}
        draggableIconStyles={{
          backgroundColor: Platform.OS === "ios" ? "#0DCA9D" : "#FFF",
          width: 90,
        }}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerWrapper}>
            <CheckIcon color="white" size={18} />
            <Typography
              color="#FFFF"
              fontSize={18}
              marginLeft={6}
              fontWeight={"600"}
            >
              Approve payment
            </Typography>
          </View>
        </View>
        <View style={{ backgroundColor: "#fff", paddingBottom: 10 }}>
          {transactionDetails && (
            <View style={styles.transactionDetails}>
              {/* <Typography
                color="#696F7A"
                fontSize={14}
                marginLeft={6}
                fontWeight={"400"}
                fontFamily="Mukta-Regular"
              >
                {transactionDetails.message} of {""}
                {transactionDetails.amount} {""} {transactionDetails.currency}{" "}
                {""} with id {transactionDetails.transactionId}
                was executed at {""} {transactionDetails.transactonDate}
              </Typography> */}
              <Typography
                color="#696F7A"
                fontSize={14}
                marginLeft={6}
                fontWeight={"400"}
                fontFamily="Mukta-Regular"
              >
                {transactionDetails?.body}
              </Typography>
            </View>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 20,
            }}
          >
            <Button
              color={"green"}
              onPress={() => {
                handleTransactionResponse(
                  transactionDetails.transactionId,
                  transactionDetails.ref,
                  true
                );
              }}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Button>
            <Button
              color={"red"}
              onPress={() => {
                handleTransactionResponse(
                  transactionDetails.transactionId,
                  transactionDetails.ref,
                  false
                );
              }}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </Button>
          </View>
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
    fontWeight: "400",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  headerContainer: {
    backgroundColor: "#0DCA9D",
    borderTopLeftRadius: Platform.OS === "ios" ? 0 : 20,
    borderTopRightRadius: Platform.OS === "ios" ? 0 : 20,
    padding: 0,
    width: "100%",
    height: Platform.OS === "ios" ? 70 : 50,
    marginBottom: 10,
    display: "flex",
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
    marginTop: 20,
    marginLeft: 90,
  },
  buttonOK: { backgroundColor: "#fff", height: 30, width: 90, marginTop: 24 },
});
