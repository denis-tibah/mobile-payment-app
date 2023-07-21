import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import { screenNames } from "../../utils/helpers";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";

export default function EmailVerifiedScreen({
  isOpen,
  data,
  setShowEmailVerified,
}: any) {
  const { navigate }: any = useNavigation();
  const [isOpenModal, setOpenModal] = useState<Boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setOpenModal(true);
    }
    /* setOpenModal(true); */
  }, []);

  const closePopup = async () => {
    //Add navigation route to next step to registration process
    setShowEmailVerified({ show: false, data: {} });
    navigate(screenNames.signup, {
      stepIndex: 1,
    });
    setOpenModal(false);
  };

  return (
    <Modal
      isOpen={isOpenModal}
      headerTitle={data?.emailverificationDetails?.title}
    >
      <View style={styles.container}>
        <View style={styles.transactionDetails}>
          <Text>{data?.emailverificationDetails?.message}</Text>
        </View>
        <Button color={"green"} onPress={() => closePopup()}>
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
