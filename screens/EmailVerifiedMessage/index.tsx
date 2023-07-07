import { useNavigation } from "@react-navigation/native";
import React,{useEffect} from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { screenNames } from "../../utils/helpers";
import { api } from "../../api";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getTransactions } from "../../redux/transaction/transactionSlice";

export default function EmailVerifiedScreen({
  
  isOpen,
  data,
  setShowEmailVerified,
}: any) {
  // const {
  //   emailverification= {
  //     title: "",
  //     message: "",
  //   },
  //   userId = "",
  // } = data || {};

  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);


  const closePopup= async () => {
    setShowEmailVerified({ show: false, data: {} });
    
    //Add natbigation route to next step to registration process
    console.log('got to next step ', data.emailverificationDetails?.message);
    // navigate(screenNames.myaccount);
  }

  return (
    <Modal
      isOpen={isOpen}
      // footer={
      //   <View style={styles.buttonContainer}>
      //   </View>
      // }
      headerTitle={data?.emailverificationDetails?.title}
    >
      <View style={styles.container}>
        
          <View style={styles.transactionDetails}>
            <Text>
              {data?.emailverificationDetails?.message}
            </Text>
          </View>
        <Button
          color={"green"}
          onPress={() => closePopup()}
        >
          <Text style={styles.buttonText}>Next Step</Text>
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
