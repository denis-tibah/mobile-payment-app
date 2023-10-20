import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { screenNames } from "../../utils/helpers";
import { api } from "../../api";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import * as Notifications from "expo-notifications";

export default function TransactionApprovalScreen({
  isOpen,
  data,
  setShowApproval,
  notificationIdentifier,
}: any) {
  const {
    transactionDetails = {
      requestType:"",
      amount:0,
      title:"",
      message:"",
      card:"",
      transactionId:"",
      ref:"",
      currency:"",
      transactonDate:""

    },
    userId = "",
  } = data || {};
  const { navigate }: any = useNavigation();

  const handleTransactionResponse = async (id: any,ref: any,status: any) => {
    try {
      const responsePayload = { id:id, reference:ref, approved:status };

      await api.post("/authorizationNotificationFinXP", responsePayload);
    } catch (error) {
      console.error(error);
    } finally {
      setShowApproval({ show: false, data: {} });
      //dismiss single notifications
      Notifications.dismissNotificationAsync(notificationIdentifier);
    }
    navigate(screenNames.myaccount);
  };

  return (
    <Modal
      isOpen={isOpen}
      footer={
        <View style={styles.buttonContainer}>
          <Button
            color="light-pink"
            onPress={() => 
              // handleTransactionResponse(Number(transactionDetails.transactionId),transactionDetails.ref,false)}
              handleTransactionResponse(transactionDetails.transactionId,transactionDetails.ref,false)}
          >
            Decline
          </Button>
        </View>
      }
      // headerTitle={"Payment Confirmation"}
      headerTitle={transactionDetails.title}
      
    >
      <View style={styles.container}>
        {transactionDetails && (
          <View style={styles.transactionDetails}>
            <Text>
              {transactionDetails.message} of {""}
              {transactionDetails.amount} {""} {transactionDetails.currency} {""} with id {transactionDetails.transactionId}
               was executed at {""} {transactionDetails.transactonDate} 
          
                {/* {transactionDetails.message}
              {transactionDetails.transactionId}
              {transactionDetails.ref}
              {transactionDetails.amount}
              {transactionDetails.currency}
              {transactionDetails.merchant_name}
              {transactionDetails.merchant_url}
              {transactionDetails.transactionDate} */}

            </Text>
          </View>
        )}
        <Button
          color={"green"}
          onPress={() => 
                  // handleTransactionResponse(Number(transactionDetails.transactionId),transactionDetails.ref,true)}
                  handleTransactionResponse(transactionDetails.transactionId,transactionDetails.ref,true)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </Button>
      </View>
    </Modal>
  );
}

const styles: any = StyleSheet.create<any>({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: 400,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
});
