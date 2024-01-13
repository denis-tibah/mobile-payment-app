import { useNavigation } from "@react-navigation/native";
import React,{useEffect} from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { screenNames } from "../../utils/helpers";
import { api } from "../../api";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
// import { getTransactions } from "../../redux/transaction/transactionSlice";
import * as Notifications from "expo-notifications";

export default function PaymentReceivedScreen({
  isOpen,
  data,
  setShowReceivedPayment,
  notificationIdentifier,
}: any) {
  const {
    transactionDetails = {
      amount: 0,
      message:"",
      title: "",
      card: "",
      currency:"",
      ref:"",
      transactionId:""
    },
    userId = "",
  } = data || {};

  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);

  // const handleTransactionResponse = async (status: any) => {
  //   try {
  //     const responsePayload = { status, userId };

  //     await api.post("/transactionResponse", responsePayload);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setShowApproval({ show: false, data: {} });
  //   }

  //   navigate(screenNames.myaccount);
  // };

  // useEffect(() => {
  //     fetchTransactions();
  // }, []);


  // const fetchTransactions = async () => {
  //   try {

  //     if (userData) {
  //       let search= {     
  //         account_id: userData?.id,
  //         // sort: "id",
  //         direction: "desc",
  //         // status: "PROCESSING"
  //         // status: "SUCCESS"
  //     }
  //       await dispatch<any>(getTransactions(search))
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }
  //     //  finally {
  //     //     setShowReceivedPayment({ show: false, data: {} });
  //     //   }

  //   // navigate(screenNames.myaccount);
  // };

  const closePopup= async () => {
    setShowReceivedPayment({ show: false, data: {} });
   
    //dismiss all notifications
   // Notifications.dismissAllNotificationsAsync();
     //dismiss single notifications
     Notifications.dismissNotificationAsync(notificationIdentifier);


    navigate(screenNames.myaccount);
  }

  return (
    <Modal
      isOpen={isOpen}
      footer={
        <View style={styles.buttonContainer}>
          {/* <Button
            color="light-pink"
            onPress={() => handleTransactionResponse("reject")}
          >
            Decline
          </Button> */}
        </View>
      }
      // "Title" here
      headerTitle={transactionDetails.title}
    >
      
      <View style={styles.container}>
        {transactionDetails && (
          <View style={styles.transactionDetails}>
            <Text>
              {/* You have just received a Payment of{" "} */}
              {transactionDetails.message}{transactionDetails.currency}
              {transactionDetails.amount}
        
            </Text>
          </View>
        )}
        <Button
          color={"green"}
          onPress={() => closePopup()}
        >
          <Text style={styles.buttonText}>OK</Text>
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
