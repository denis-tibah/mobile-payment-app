import { Fragment, useEffect, useState } from "react";
import { Pressable, View, Modal } from "react-native";
import { Text } from "react-native-paper";
// import { Modal } from "../../components/Modal/Modal";

// import { styles } from "./style";
import Button from "../Button";
import Typography from "../Typography";
import { useDispatch } from "react-redux";
import { setInActivityState } from "../../redux/account/accountSlice";
import { StyleSheet } from "react-native";

type InactivityProps = {
  isOpen: boolean;
  closePopup: () => void;
};

const Inactivity: React.FC<InactivityProps> = ({ isOpen, closePopup }) => {
  const dispatch = useDispatch();
  const [countDown, setCountDown] = useState<number>(30);

  const handleContinueActivity = () => {
    dispatch(setInActivityState(false));
    setCountDown(30);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
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
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        closePopup();
      }}
      // headerTitle={"Inactivity Detected"}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.container}>
            <Typography variant="h2" style={styles.title} fontSize={20}>
              Inactivity Detected
            </Typography>
            <Typography variant="h2" style={styles.title} fontSize={16}>
              You have been inactive for a while
            </Typography>
            <Typography variant="h5" style={styles.subTitle}>
              For your security, we will sign you out in {countDown} seconds.
            </Typography>
          </View>
          <View style={styles.actionCointaner}>
            <View>
              <Button color="light-pink" onPress={handleContinueActivity}>
                <Typography fontFamily={"Nunito-SemiBold"}>Continue</Typography>
              </Button>
            </View>
            <View>
              <Button
                color={"green"}
                onPress={() => {
                  setCountDown(30);
                  closePopup();
                }}
                // style={{right:0, position: "relative"}}
              >
                <Typography fontFamily={"Nunito-SemiBold"}>Sign out</Typography>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default Inactivity;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalView: {
    margin: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    // alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  actionCointaner: {
    display: "flex",
    flexDirection: "row",
    // width: "85%",
    justifyContent: "space-between",
    // backgroundColor: "#ACACAC",
  },
  title: {
    margin: "auto",
  },
  rightAction: {
    marginLeft: "auto",
  },
  subTitle: {
    marginVertical: 20,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#ACACAC",
    // justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
