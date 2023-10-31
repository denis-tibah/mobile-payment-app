import { useState } from "react";
import { Text, View } from "react-native";
import Modal from "../../components/Modal";
import Button from "../../components/Button";

import { styles } from "./styles";

const TerminatingCardModal = ({ navigation, route, isOpen, onClose, title, actionMethod }: any) => {

  return (
    <Modal
    isOpen={isOpen}
    title={title}
    footer={
      <View style={styles.buttonContainerTerminateModal}>
        <Button color="light-pink" onPress={onClose}>
          No
        </Button>
        <Button color="light-pink" onPress={actionMethod}>
          Yes
        </Button>
      </View>
    }
    renderHeader={() => (
    <View style={styles.headerTitleBoxTerminateModal}>
      <Text style={styles.headerTitleTerminateModal}>{`Terminate a card`}</Text>
    </View>
    )}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Are you sure you want to terminate this card?</Text>
      </View>
    </Modal>
  )
}
export default TerminatingCardModal;