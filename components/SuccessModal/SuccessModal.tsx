import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ChangeIcon from "../../assets/icons/Change";
import { Modal } from "../Modal/Modal";
import Button from "../Button";

export const SuccessModal = ({
  isOpen,
  title,
  onClose,
  text,
}: {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  text: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      footer={
        <View style={styles.buttonContainer}>
          <Button color="light-pink" onPress={onClose}>
            OK
          </Button>
        </View>
      }
      renderHeader={() => (
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      )}
    >
      <View style={styles.container}>
        <ChangeIcon style={styles.icon} color="pink" size={48} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create<any>({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    textAlign: "center",
    flexDirection: "column",
  },

  icon: {
    width: 48,
    height: 48,
  },
  text: {
    fontSize: 18,
    fontWeight: 400,
    marginTop: 24,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headerTitleBox: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 500,
  },
});
