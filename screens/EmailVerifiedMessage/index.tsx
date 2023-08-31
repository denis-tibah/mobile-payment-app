import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, ImageBackground } from "react-native";

import { screenNames } from "../../utils/helpers";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";

export default function EmailVerifiedScreen({
  isOpen,
  data,
  setShowEmailVerified,
  route,
}: any) {
  console.log("🚀 ~ file: index.tsx:15 ~ route:", route);

  const { navigate }: any = useNavigation();
  const [isOpenModal, setOpenModal] = useState<Boolean>(false);
  console.log("🚀 ~ file: index.tsx:19 ~ isOpenModal:", isOpenModal);

  useEffect(() => {
    if (isOpen || route?.params?.isOpenEmailVerified) {
      setOpenModal(true);
    }
    return () => {
      setShowEmailVerified({ show: false, data: {} });
    };
  }, []);

  /* useFocusEffect(
    useCallback(() => {
      if (!isOpen) {
        navigate(screenNames.login);
      }
    }, [isOpen])
  ); */

  const closePopup = async () => {
    //Add navigation route to next step to registration process
    // setShowEmailVerified({ show: false, data: {} });
    navigate(screenNames.signup, {
      stepIndex: 1,
    });
    setOpenModal(false);
  };

  return (
    <Fragment>
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
    </Fragment>
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
