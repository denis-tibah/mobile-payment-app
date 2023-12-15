import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import ZazooVirualCard from "../../assets/images/card_background_images/virtual_card.png";
import CardIcon from "../../assets/icons/Card";
import { AntDesign } from '@expo/vector-icons'; 
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/profile/profileSlice";
import {
  sendSmsOrderCardVerification,
} from "../../redux/card/cardSlice";
import { getAccountDetails } from "../../redux/account/accountSlice";
import vars from "../../styles/vars";
import Typography from "../../components/Typography";
import DropDownPicker from "react-native-dropdown-picker";

interface GerCardModalProps {
  onClose: () => void;
  isModalVisible: boolean;
  onGetVirtualCard?: (currency: any) => void;
}

export const GetCardModal = ({
  onClose,
  onGetVirtualCard,
  isModalVisible
}: GerCardModalProps) => {
  const dispatch = useDispatch();
  const [isUserConfirmedToCreateCard, setIsUserConfirmedToCreateCard] = useState<boolean>(false);
  const userData = useSelector((state: any) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<string>("");
  const [openCurrency, setOpenCurrency] = useState(false);

  useEffect(() => {
    dispatch(getProfile() as any);
  }, []);

  useEffect(() => {
    if (!!userData) dispatch(getAccountDetails(userData.id) as any);
  }, [userData]);

  const handleCloseGetCardModal = () => {
    onClose();
  };

  const initiateOrderCard = async ({currency}: any) => {
    try {
      setLoading(true);
      const payload = await dispatch(
        sendSmsOrderCardVerification({
          type: "trusted",
        }) as any
      ).unwrap();
      if (payload?.status === "success") {
        onGetVirtualCard && onGetVirtualCard({currency: currency.value});
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
      handleCloseGetCardModal();
    }
  };

  if (isUserConfirmedToCreateCard) {
    return (
      <Modal
        isOpen={isModalVisible}
        onClose={handleCloseGetCardModal}
        onRequestClose={handleCloseGetCardModal}
        footer={
          <View style={styles.buttonContainer}>
            <Button
              leftIcon={
                <AntDesign name="checkcircleo" size={14} color={vars['accent-pink']} />
              }
              style={{ width: '100%' }}
              disabled={loading}
              loading={loading}
              color="light-pink"
              onPress={() => {
                console.log({currency});
                if(currency) {
                  initiateOrderCard(currency);
                } else {
                  alert('Please select currency');
                }
              }}
            >
              Submit
            </Button>
          </View>
        }
        renderHeader={() => (
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>
              {" "}
              Create Virtual Card</Text>
          </View>
        )}
      >
        <View style={styles.container}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-start', paddingBottom: 5}}>
            <Typography color={vars['accent-grey']} fontSize={14}>
              Select Currency
            </Typography>
          </View>
          <View style={{minHeight: 100, zIndex: 999, overflow: 'visible', display: 'flex'}}>
            <DropDownPicker
              placeholder="Currency"
              style={styles.dropdownCurrency}
              open={openCurrency}
              value={currency || null}
              items={[{ label: "Euro €", value: "EUR" }, { label: "USD $", value: "USD" }]}
              setOpen={setOpenCurrency}
              setValue={setCurrency}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1}
            />
        </View>
        </View>
      </Modal>
    )
  }

  return (
      <Modal
        isOpen={isModalVisible}
        onClose={handleCloseGetCardModal}
        onRequestClose={handleCloseGetCardModal}
        footer={
          <View style={styles.buttonContainer}>
            <Button
              leftIcon={
                <AntDesign name="pluscircleo" size={18} color={vars['accent-blue']} />
              }
              style={{ width: '100%' }}
              disabled={loading}
              loading={loading}
              color="light-blue"
              onPress={() => {
                setIsUserConfirmedToCreateCard(true);
              }}
            >
              Create now
            </Button>
          </View>
        }
        renderHeader={() => (
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>
            <CardIcon size={18} color="pink" />
              {" "}
              My Card</Text>
          </View>
        )}
      >
      <ImageBackground
        resizeMode="contain"
        imageStyle={{ borderRadius: 8, height: 225, width: 340 }}
        source={ZazooVirualCard}
        style={{
            height: 225,
            width: 340,
            borderRadius: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{color: '#fff', fontSize: 17, lineHeight: 22}}>
            This could be your virtual card
          </Text>
      </ImageBackground>
      </Modal>
  );
};

const styles = StyleSheet.create<any>({
  container: {
    display: "flex",
    height: 'auto',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    textAlign: "center",
    flexDirection: "column",
    paddingHorizontal: 10
  },
  icon: {
    width: 48,
    height: 48,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
    fontWeight: "600",
  },
  dropdownCurrency: {
    height: 42,
    backgroundColor: "#F5F9FF",
    color: vars['accent-blue'],
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 24,
    alignSelf: "center",
    borderColor: "#6BA6FD",
  },
  dropdownContainer: {
    height: "auto",
    alignSelf: "center",
    color: vars['accent-blue'],
    backgroundColor: "#F5F9FF",
    borderRadiues: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderColor: "#6BA6FD",
    zIndex: 999,
  },
});
