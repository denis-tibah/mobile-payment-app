import { View } from "react-native";
import { Text } from "react-native-paper";
import { Modal } from "../../components/Modal/Modal";

import { styles } from "./style";
import Button from "../Button";
import Typography from "../Typography";

type InactivityProps = {
  isOpen: boolean;
  closePopup: () => void;
  transactionDetails: any;
  handleTransactionResponse: (response: string) => void;
};

const Inactivity: React.FC<InactivityProps> = ({
  isOpen,
  closePopup,
}) => {
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
      headerTitle={"Payment Received"}
    >
      <View style={styles.container}>
        <Typography variant="h3">
          Inacitivity
        </Typography>
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
export default Inactivity;