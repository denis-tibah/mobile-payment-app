import { useNavigation } from "@react-navigation/native";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { screenNames } from "../../utils/helpers";
import { api } from "../../api";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getTransactions } from "../../redux/transaction/transactionSlice";

export default function EmailVerifiedMessageV2({
  isOpen,
  data,
  setShowEmailVerified,
  route,
}: any) {

  const { navigate }: any = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const [isOpenModal, setIsOpenModal] = useState<Boolean>(false);

  // console.log('*****data*****', data?.emailverificationData);

  // useEffect(() => {
  //   // if (isOpen || route?.params?.isOpenEmailVerified) {
  //     if (isOpen) {
  //       setIsOpenModal(true);
  //   }

  // }, []);

  const closePopup = async () => {
    //Add navigation route to next step to registration process
    // setShowEmailVerified({ show: false, data: {} });
    setShowEmailVerified({ show: false, data: {} });

    navigate(screenNames.signup, {
      stepIndex: 1,
    });
    // setIsOpenModal(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      // isOpen={isOpenModal}
      footer={
        <View style={styles.buttonContainer}>
        </View>
      }
      headerTitle={"Email Verified"}
    >
      <View style={styles.container}>
        {/* { emailDetails && ( */}
          <View style={styles.transactionDetails}>
            <Text>
              {data?.emailverificationData?.message}
            </Text>
          </View>
        {/* )} */}
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
