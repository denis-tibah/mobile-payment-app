import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import ZazooVirualCard from "../../assets/images/card_background_images/virtual_card.png";
// import ZazooVirualCard from "../../assets/images/zazoo-virtual-card.png";
import CardIcon from "../../assets/icons/Card";
import { AntDesign } from '@expo/vector-icons'; 
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/profile/profileSlice";
import { Address } from "../../components/Address/Address";
import DropDownPicker from "react-native-dropdown-picker";
import {
  CardData,
  getCards,
  orderCard,
  sendSmsOrderCardVerification,
} from "../../redux/card/cardSlice";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import { delayCode } from "../../utils/delay";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { RadioButton } from "react-native-paper";
import { arrayChecker } from "../../utils/helpers";
import vars from "../../styles/vars";

interface GerCardModalProps {
  onClose: () => void;
  isModalVisible: boolean;
  onGetVirtualCard?: () => void;
}

export const GetCardModal = ({
  onClose,
  onGetVirtualCard,
  isModalVisible
}: GerCardModalProps) => {
  const dispatch = useDispatch();
  const [getCardSuccessResponse, setGetCardSuccessResponse] = useState(false);
  const [getCardErrorResponse, setGetCardErrorResponse] = useState(false);
  const profile = useSelector((state: any) => state.profile?.profile);
  const userData = useSelector((state: any) => state.auth.userData);
  const cardData = useSelector((state: any) => state.card?.data);
  const accountDetails = useSelector((state: any) => state.account?.details);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(true);
  const [loading, setLoading] = useState(false);

  // const [cardType, setCardType] = useState();
  const [cardType, setCardType] = useState("");
  // const [checked, setChecked] = useState('');
  const [currency, setCurrency] = useState<any>({
    label: "USD",
    value: "usd",
  });
  const VirtualCard = "V";
  const showChangeRequest = "N";

  const [open, setOpen] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  useEffect(() => {
    dispatch(getProfile() as any);
  }, []);

  useEffect(() => {
    if (!!userData) dispatch(getAccountDetails(userData.id) as any);
  }, [userData]);

  const handleCloseGetCardModal = () => {
    onClose();
    setGetCardSuccessResponse(false);
    setGetCardErrorResponse(false);
  };

  const initiateOrderCard = async () => {
    try {
      setLoading(true);
      const payload = await dispatch(
        sendSmsOrderCardVerification({
          type: "trusted",
        }) as any
      ).unwrap();
      if (payload?.status === "success") {
        setShowCardModal(false);
        onGetVirtualCard && onGetVirtualCard();
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
      handleCloseGetCardModal();
    }
  };

  // const handleOrderCard = async ({ code }: any) => {
  //   try {
  //     setLoading(true);
  //     const payload = await dispatch(
  //       orderCard({
  //         accountUuid: accountDetails?.info?.id,
  //         firstname: profile?.data?.first_name,
  //         lastname: profile?.data?.last_name,
  //         email: profile?.data?.email,
  //         cardType: cardType,
  //         currency: currency,
  //         street: profile?.data?.address_line_1,
  //         subStreet: profile?.data?.address_line_2,
  //         postCode: profile?.data?.postal_code,
  //         state: profile?.data?.state,
  //         town: profile?.data?.town,
  //         country: profile?.data?.country,
  //         otp: code,
  //       }) as any
  //     ).unwrap();
  //     if (payload) {
  //       if (payload.code === 200 || payload.code === "200") {
  //         setGetCardSuccessResponse(true);
  //         dispatch(getCards() as any);
  //       } else {
  //         setGetCardErrorResponse(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //     setGetCardErrorResponse(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmitOTP = async ({ code }: any) => {
  //   setShowCodeModal(false);
  //   await delayCode(100);
  //   setShowCardModal(true);
  //   handleOrderCard({ code });
  // };

  // const getCardOptions = () => {
  //   if (!hasPhysicalCard && !hasVirtualCard)
  //     return [
  //       { label: "Virtual", value: "V" },
  //       { label: "Physical", value: "P" },
  //     ];
  //   if (hasPhysicalCard && !hasVirtualCard)
  //     return [{ label: "Virtual", value: "V" }];
  //   if (!hasPhysicalCard && hasVirtualCard)
  //     return [{ label: "Physical", value: "P" }];

  //   return [];
  // };

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
                initiateOrderCard();
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
        style={
          {
            height: 225,
            width: 340,
            borderRadius: 70,
            justifyContent: "center",
            alignItems: "center",
          }
        }
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
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
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
    marginTop: 4,
  },
  cardTypeCombo: {
    fontFamily: "Mukta-SemiBold",
    fontSize: 18,
    fontWeight: 400,
    width: 150,
    // marginTop: 10,
    left: -20,
  },
  cardTypeText: {
    fontFamily: "Mukta-SemiBold",
    fontSize: 18,
    fontWeight: 400,
    marginTop: -30,
    left: 40,
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
  dropdownType: {
    height: 42,
    backgroundColor: "#f9f9f9",
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 12,
    width: "95%",
    alignSelf: "center",
    borderColor: "transparent",
    marginBottom: 30,
    // paddingBottom:20,
  },
  dropdownCurrency: {
    height: 42,
    backgroundColor: "#f9f9f9",
    borderRadius: 999,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 12,
    width: "50%",
    alignSelf: "center",
    borderColor: "transparent",
    marginTop: -40,
    marginBottom: 20,
    marginLeft: 70,
    left: 60,
    // paddingTop: 20,
  },
  dropdownContainer: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
    borderColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -40,
    marginBottom: 20,
    marginLeft: 70,
    left: 60,
  },
  physicalCardAddress: {
    width: "95%",
    height: "55%",
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
    borderColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
});
