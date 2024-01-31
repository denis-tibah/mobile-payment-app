import { Fragment, useEffect, useState, useRef } from "react";
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign } from '@expo/vector-icons'; 
import ZazooVirualCard from "../../../assets/images/card_background_images/virtual_card.png";
import { sendSmsOrderCardVerification } from "../../../redux/card/cardSlice";
import { getAccountDetails } from "../../../redux/account/accountSlice";
import TransactionIcon from "../../../assets/icons/Transaction";
import { getProfile } from "../../../redux/profile/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import vars from "../../../styles/vars";
import MainLayout from "../../../layout/Main";
import CardIcon from "../../../assets/icons/Card";
import { screenNames } from "../../../utils/helpers";
import Heading from "../../../components/Heading";
import SwipableBottomSheet from "../../../components/SwipableBottomSheet";
import Typography from "../../../components/Typography";
import { PinCodeInputBoxes, PinCodeInputClipBoard } from "../../../components/FormGroup/FormGroup";
import { Divider } from "react-native-paper";
import { useLazyOrderCardQuery } from "../../../redux/card/cardSliceV2";
import { RootState } from "../../../store";

interface GerCardModalProps {
  onClose: () => void;
  isModalVisible: boolean;
  onGetVirtualCard?: (currency: any) => void;
}

export const GetCardScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef<any>(null);
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const profile = useSelector((state: any) => state.profile?.profile);
  const userEmail = profile?.data.email;
  const userID = userData?.id;

  const refRBSSheetPinCode = useRef<any>(null);
  const [isUserConfirmedToCreateCard, setIsUserConfirmedToCreateCard] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isTimeToCountDown, setIsTimeToCountDown] = useState<boolean>(false);
  const enableResend = timeRemaining === 0;
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<string>("EUR");
  const [openCurrency, setOpenCurrency] = useState(false);
  const [orderCard, {
    isLoading: orderCardIsLoading, 
    isSuccess: orderCardIsSuccess,
    isError: orderCardIsError,
  }] = useLazyOrderCardQuery();

  const handlePinCodeChange = (value: string) => {
    setCode(value);
  };

  const _handleResendSMSVerificationCode = () => {
    console.log("Resend SMS Verification Code");
    setIsTimeToCountDown(true);
    dispatch(sendSmsOrderCardVerification({
      type: "trusted",
    }) as any);
  };

  useEffect(() => {
    dispatch(getProfile() as any);
  }, []);

  useEffect(() => {
    if (!!userData) dispatch(getAccountDetails(userData.id) as any);
  }, [userData]);

  const handleCloseGetCardModal = () => {
    // onClose();
  };

  const handleEnrollmentCard = async () => {
    if(!code) {
      alert('Please enter verification code');
      return;
    }
    setLoading(true);
    const orderCardPayload = {
      cardType: "V",
      accountUuid: userID,
      currency: "EUR",
      email: userEmail,
      otp: code,
    };
    orderCard(orderCardPayload)
    .unwrap()
    .then((res: any) => {
      console.log({ res });
      navigation.navigate(screenNames.card);
    })
    .catch((error: any) => {
      console.log({ error });
      alert('Invalid verification code');
    })
    .finally(() => {
      setLoading(false);
      refRBSSheetPinCode?.current?.close();
    });
  };

  const initiateOrderCard = async (currency: any) => {
    setLoading(true);
    dispatch(sendSmsOrderCardVerification({
      type: "trusted",
    }) as any)
    .unwrap()
    .then((res: any) => {
      if(res?.status === "success") {
        refRBSheet?.current?.close();
        refRBSSheetPinCode?.current?.open();
        // navigation.navigate(screenNames.CardVerificationScreen, {
        //   currency
        // });
      }
    }).catch((err: any) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
      refRBSheet?.current?.close();
      // handleCloseGetCardModal();
    });
    // try {
    //   setLoading(true);
    //   const payload = await dispatch(
    //     sendSmsOrderCardVerification({
    //       type: "trusted",
    //     }) as any
    //   ).unwrap();
    //   console.log({ payload });
    //   if (payload?.status === "success") {
    //     // onGetVirtualCard && onGetVirtualCard({currency});
    //   }
    // } catch (error) {
    //   console.log({ error });
    // } finally {
    //   setLoading(false);
    //   handleCloseGetCardModal();
    // }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimeToCountDown) {
      interval = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining(timeRemaining - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
    if (enableResend) {
      setIsTimeToCountDown(false);
      setTimeRemaining(60);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timeRemaining, isTimeToCountDown]);

  return (
    <MainLayout navigation={navigation}>
      <View style={{backgroundColor: 'white', height: '100%', flexDirection: 'column', display: 'flex'}}>
        <Heading
          icon={<CardIcon size={18} color="pink" />}
          title={"My Card"}
        />
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
              alignSelf: "center",
            }}
          >
            <Text style={{color: '#fff', fontSize: 17, lineHeight: 22}}>
              This could be your virtual card
            </Text>
        </ImageBackground>
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
              refRBSheet?.current?.open();
            }}
          >
            Create now
          </Button>
        </View>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={290}
        wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        containerStyles={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDD", width: 90 }}
      > 
        <View
        style={{marginTop: 10}}
        >
          <Typography
            color="#000"
            fontWeight={600}
            fontFamily="Nunito-Bold"
            fontSize={16}
          >
            Create Virtual Card
          </Typography>
        </View>
        <Divider style={{width: '120%', height: 1, backgroundColor: vars['shade-grey'], marginVertical: 15, opacity: 0.5}} />
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-start'}}>
          <Typography color={vars['accent-grey']} fontSize={14}>
            Select Currency
          </Typography>
        </View>
        <View style={{minHeight: 100, zIndex: 999, overflow: 'visible', display: 'flex', paddingTop: 10}}>
          <DropDownPicker
            placeholder="Currency"
            style={styles.dropdownCurrency}
            open={openCurrency}
            value={currency || null}
            items={[{ label: "Euro €", value: "EUR" }]}
            setOpen={setOpenCurrency}
            setValue={setCurrency}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1}
            disabled
          />
        </View>
        <View style={[styles.buttonContainer, {
          // drop shadow for ios
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          // drop shadow for android
          elevation: 4,
          backgroundColor: '#fff',
          bottom: 0,
          position: 'relative',
          marginTop: 15,
          }]}>
          <Button
            leftIcon={
              <AntDesign name="checkcircleo" size={14} color={vars['accent-pink']} />
            }
            style={{ width: '100%' }}
            disabled={loading}
            loading={loading}
            color="light-pink"
            onPress={async () => {
              if(currency) {
                await initiateOrderCard(currency);
              } else {
                alert('Please select currency');
              }
            }}
          >
            Submit
          </Button>
        </View>
      </SwipableBottomSheet>
      <SwipableBottomSheet
        rbSheetRef={refRBSSheetPinCode}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={320}
        wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        containerStyles={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDD", width: 90 }}
      >
        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'flex-start', paddingBottom: 5}}>
          <Typography color="#000" fontSize={18} fontFamily={'Nunito-SemiBold'}>
            Card Enrollment
          </Typography>
          <Typography color={vars['accent-grey']} fontSize={12} fontFamily={'Nunito-SemiBold'} >
            {" "}
            Since your account doesnt have any card. You will receive an sms to your mobile device. Please enter this code below.
          </Typography>
        </View>
        <Divider style={{width: '120%', height: 1, backgroundColor: vars['shade-grey'], marginVertical: 10, opacity: 0.5}} />
        <View style={styles.container}>
          <PinCodeInputClipBoard fieldCount={6} onChange={handlePinCodeChange} isNewPinCodeStyle/>
          <TouchableOpacity
            onPress={_handleResendSMSVerificationCode}
            disabled={isTimeToCountDown}
            style={{marginTop: 5}}
          >
            {isTimeToCountDown ? (
              <Text style={styles.noCodeResend}>
                Wait for {timeRemaining}s to request again.
              </Text>
            ) : (
              <Text style={styles.noCode}>Did not get a verification code?</Text>
            )}
          </TouchableOpacity>
          <View style={[styles.buttonContainer, {marginTop: 10}]}>
            <Button
              style={[styles.confirmButton, {marginTop: 15}]}
              color="light-pink"
              disabled={loading}
              loading={loading}
              onPress={handleEnrollmentCard}
              leftIcon={<AntDesign name="checkcircleo" size={16} color={vars['accent-pink']} />}
            >
              Submit
            </Button>
          </View>
        </View>
      </SwipableBottomSheet>
    </MainLayout>
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
    shadowColor: "#000",
    paddingTop: 10,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
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
  noCode: {
    fontSize: 14,
    color: vars["accent-pink"],
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Nunito-Regular",
  },
  confirmButton: {
    marginTop: 10,
    width: "100%",
  },
});
