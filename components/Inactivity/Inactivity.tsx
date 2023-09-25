import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { Modal } from "../../components/Modal/Modal";

import { styles } from "./style";
import Button from "../Button";
import Typography from "../Typography";
import { useDispatch } from "react-redux";
import { setInActivityState } from "../../redux/account/accountSlice";

type InactivityProps = {
  isOpen: boolean;
  closePopup: () => void;
};

const Inactivity: React.FC<InactivityProps> = ({
  isOpen,
  closePopup,
}) => {
  const dispatch = useDispatch();
  const [countDown, setCountDown] = useState<number>(30);

  const handleContinueActivity = () => {
    dispatch(setInActivityState(false));
    setCountDown(30);
  };

  useEffect(() => {
    let interval:  NodeJS.Timeout;
      if (countDown > 0 && isOpen) {
        interval = setInterval(() => {
          setCountDown((countDown) => countDown - 1);
        }, 1000);
      } else if (countDown === 0) {
        closePopup();
        setCountDown(30);

      }
    return () => clearInterval(interval);
  }, [isOpen, countDown]);

  return (
    <Modal
      isOpen={isOpen}
      footer={
        <Pressable>
          <View style={styles.buttonContainer}>
            <View style={styles.actionCointaner}>
              <Button
                color="light-pink"
                onPress={handleContinueActivity}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </Button>
              <Button
                color={"green"}
                onPress={() => {
                  setCountDown(30);
                  closePopup();
                }}
              >
                <Text style={styles.buttonText}>Sign out</Text>
              </Button>
            </View>
          </View>
        </Pressable>
      }
      headerTitle={"Inactivity Detected"}
    >
      <View style={styles.container}>
        <Typography variant="h2" style={styles.title} fontSize={20}>
          You have been inactive for a while
        </Typography>
        <Typography variant="h5" style={styles.subTitle}>
          For your security, we will sign you out in {countDown} seconds.
        </Typography>
    </View>
  </Modal>
  );
}
export default Inactivity;