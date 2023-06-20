import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { screenNames } from "../../utils/helpers";
import { api } from "../../api";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";

export default function TransactionApprovalScreen({
  isOpen,
  data,
  setShowApproval,
}: any) {
  const {
    transactionDetails = {
      amount: 19.99,
      title: "Bib",
      card: "2343",
    },
    userId = "123",
  } = data || {};
  const { navigate }: any = useNavigation();

  const handleTransactionResponse = async (status: any) => {
    try {
      const responsePayload = { status, userId };

      await api.post("/transactionResponse", responsePayload);
    } catch (error) {
      console.error(error);
    } finally {
      setShowApproval({ show: false, data: {} });
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
            onPress={() => handleTransactionResponse("reject")}
          >
            Decline
          </Button>
        </View>
      }
      headerTitle={"Payment Confirmation?"}
    >
      <View style={styles.container}>
        {transactionDetails && (
          <View style={styles.transactionDetails}>
            <Text>
              A Card ({transactionDetails.card}) Payment of{" "}
              {transactionDetails.amount} was made at {transactionDetails.title}
            </Text>
          </View>
        )}
        <Button
          color={"green"}
          onPress={() => handleTransactionResponse("approve")}
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
