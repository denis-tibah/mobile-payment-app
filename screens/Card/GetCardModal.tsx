import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import PinIcon from "../../assets/icons/Pin";
import { Modal } from "../../components/Modal/Modal";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/profile/profileSlice";
import { Address } from "../../components/Address/Address";
import DropDownPicker from "react-native-dropdown-picker";
import {
  getCards,
  orderCard,
  sendSmsOrderCardVerification,
} from "../../redux/card/cardSlice";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import { delayCode } from "../../utils/delay";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { RadioButton } from 'react-native-paper';

interface GerCardModalProps {
  onClose: () => void;
  hasPhysicalCard?: boolean;
  hasVirtualCard?: boolean;
}

export const GetCardModal = ({
  onClose,
  hasPhysicalCard,
  hasVirtualCard,
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
  const [cardType, setCardType] = useState('');
  // const [checked, setChecked] = useState('');
  const [currency, setCurrency] = useState<any>({
    label: "USD",
    value: "usd",
  });
  const VirtualCard ="V";
  const showChangeRequest ='N';

  const [open, setOpen] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  // console.log('******cardData**********',cardData[0].type);
  // console.log('******showChangeRequest**********',showChangeRequest);

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
        await delayCode(100);
        setShowCodeModal(true);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCard = async ({ code }: any) => {
    try {
      setLoading(true);
      const payload = await dispatch(
        orderCard({
          accountUuid: accountDetails?.info?.id,
          firstname: profile?.data?.first_name,
          lastname: profile?.data?.last_name,
          email: profile?.data?.email,
          cardType: cardType,
          currency: currency,
          street: profile?.data?.address_line_1,
          subStreet: profile?.data?.address_line_2,
          postCode: profile?.data?.postal_code,
          state: profile?.data?.state,
          town: profile?.data?.town,
          country: profile?.data?.country,
          otp: code,
        }) as any
      ).unwrap();

      if (payload) {
        if (payload.code === 200 || payload.code === "200") {
          setGetCardSuccessResponse(true);
          dispatch(getCards() as any);
        } else {
          setGetCardErrorResponse(true);
        }
      }
    } catch (error) {
      console.log({ error });
      setGetCardErrorResponse(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async ({ code }: any) => {
    setShowCodeModal(false);
    await delayCode(100);
    setShowCardModal(true);
    handleOrderCard({ code });
  };

  const getCardOptions = () => {
    if (!hasPhysicalCard && !hasVirtualCard)
      return [
        { label: "Virtual", value: "V" },
        { label: "Physical", value: "P" },
      ];
    if (hasPhysicalCard && !hasVirtualCard)
      return [{ label: "Virtual", value: "V" }];
    if (!hasPhysicalCard && hasVirtualCard)
      return [{ label: "Physical", value: "P" }];

    return [];
  };

  return (
    <View>
      {!!showCodeModal && !showCardModal && (
        <CodeModal
          confirmButtonText="Order Card"
          title="Order Card"
          subtitle="You will receive an sms to your mobile device. Please enter this code below."
          isOpen
          loading={loading}
          onSubmit={handleSubmitOTP}
          onCancel={() => setShowCodeModal(false)}
        />
      )}
      {!!showCardModal && !showCodeModal && (
        <Modal
          isOpen
          footer={
            <View style={styles.buttonContainer}>
              {!getCardSuccessResponse && !getCardErrorResponse && (
                <Button
                  leftIcon={
                    <PinIcon style={styles.icon} color="pink" size={18} />
                  }
                  disabled={loading}
                  loading={loading}
                  color="light-pink"
                  onPress={initiateOrderCard}
                >
                  Order Card
                </Button>
              )}
              <Button color="grey" onPress={handleCloseGetCardModal}>
                Close
              </Button>
            </View>
          }
          renderHeader={() => (
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Order Card</Text>
            </View>
          )}
        >
          <View style={styles.container}>
            {!getCardSuccessResponse && !getCardErrorResponse && (
              <View
                style={{
                  zIndex: 1,
                }}
              >
                {/* <DropDownPicker
                  placeholder="Card Type"
                  style={styles.dropdownType}
                  open={open}
                  value={cardType || null}
                  items={getCardOptions()}
                  setOpen={setOpen}
                  setValue={setCardType}
                  listMode="SCROLLVIEW"
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={2}
                /> */}

      {/* only show card thathas not been ordered yet--added by Aristos  19/06/2023        */}
      {cardData[0].type == VirtualCard ? 
       <View style={styles.cardTypeCombo} >
              <RadioButton
                  value="P"
                  status={ cardType === 'P' ? 'checked' : 'unchecked' }
                    onPress={() => setCardType('P')} 
                  color='#E7038E'
                />  
                <Text style={styles.cardTypeText}>Physical Card</Text>
    
          </View>
                :
                <View style={styles.cardTypeCombo} >
                      <RadioButton
                      value="V"
                      status={ cardType === 'V' ? 'checked' : 'unchecked' }
                      onPress={() => setCardType('V')}
                      color='#E7038E'
                    />
                  <Text style={styles.cardTypeText}>Virtual Card</Text>
           
              </View> 
                
                }
      
                <DropDownPicker
                  placeholder="Currency"
                  style={styles.dropdownCurrency}
                  open={openCurrency}
                  value={currency || null}
                  items={[{ label: "EUR", value: "EUR" }]}
                  setOpen={setOpenCurrency}
                  setValue={setCurrency}
                  listMode="SCROLLVIEW"
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={1}
                />
            </View>
            )}
            
                {!getCardSuccessResponse &&
                  !getCardErrorResponse &&
                  cardType === "P" && (
                    <View style={styles.physicalCardAddress}>
                      <Address compact profileData={profile?.data} showChangeRequest={showChangeRequest} />
                    </View>
                  )}
              
            {!getCardSuccessResponse &&
              getCardErrorResponse &&
              getCardSuccessResponse && <Text>Your card has been ordered</Text>}
            {!getCardSuccessResponse && getCardErrorResponse && (
              <Text>Something went wrong please try again</Text>
            )}
          </View>
        </Modal>
      )}
    </View>
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
    marginLeft:70,
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
    marginLeft:70,
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
