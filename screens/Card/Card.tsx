import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import { styles } from "./styles";
import Typography from "../../components/Typography";
import { AntDesign } from "@expo/vector-icons";
import CardIcon from "../../assets/icons/Card";
import FreezeIcon from "../../assets/icons/Freeze";
import EyeIcon from "../../assets/icons/Eye";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import {
  getCards,
  sendSmsShowCardVerification,
  setCardAsFrozen,
  setIsCardTransactionShown,
  terminateCard,
} from "../../redux/card/cardSlice";
import {
  getUserActiveCards,
  screenNames,
} from "../../utils/helpers";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { CardView } from "../../components/Card/CardView";
import { GetCardModal } from "./GetCardModal";
import { RootState } from "../../store";
import Carousel from "react-native-snap-carousel";

import Spinner from "react-native-loading-spinner-overlay/lib";
import { ICardDetails } from "../../models/interface";
import vars from "../../styles/vars";
import TerminatingCardModal from "./TerminatingCardModal";
import { Divider } from "react-native-paper";
import ArrowRight from "../../assets/icons/ArrowRight";
import { ArrowSwitch } from "../../assets/icons/ArrowSwitch";
import { PinNumberCode } from "../../assets/icons/PinNumber";
import { BugIcon } from "../../assets/icons/BugIcon";
import BottomSheet from "../../components/BottomSheet";
import ManagePaymentMethod from "./Components/ManagePayment";
import { PinCodeInputBoxes, PinCodeInputClipBoard } from "../../components/FormGroup/FormGroup";
import { useLazyOrderCardQuery, useLazySendSmsLostCardVerificationQuery, useLazyShowCardDetailsQuery } from "../../redux/card/cardSliceV2";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { Seperator } from "../../components/Seperator/Seperator";

const DEFAULT_CARD_ENROLLMENT_STATUS = {
  title: "",
  text: "",
  isError: false,
};

export function Card({ navigation, route }: any) {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const refRBSheetShowTerminatedCards = useRef();
  const refRBSTerminateThisCard = useRef();
  const refRBSShowCard = useRef();
  const refCarousel = useRef(null);
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const userID = userData?.id;
  const profile = useSelector((state: any) => state.profile?.profile);
  const userEmail = profile?.data.email;

  const isCardTransactionShown = useSelector((state: RootState) => state?.card?.isCardTransactionShown);

  const [cardPin, setCardPin] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState(30);
  const cardData = useSelector((state: RootState) => state?.card?.data);
  const cardsActiveList = getUserActiveCards(cardData);
  const [isTerminatedCardShown, setIsTerminatedCardShown] = useState<boolean>(false);
  const [terminatedCardModal, setTerminatedCardModal] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<ICardDetails>({});
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [showCardOtpModal, setShowCardOtpModal] = useState(false);
  const [showGetCardModal, setShowGetCardModal] = useState(false);
  const [showCardOtpLoading, setShowCardOtpLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isManagePaymentMethod, setIsManagePaymentMethod] = useState<boolean>(false);
  const [isShowTerminatedCard, setIsShowTerminatedCard] = useState<boolean>(false);
  const [isLostPinActionPressed, setIsLostPinActionPressed] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isTimeToCountDown, setIsTimeToCountDown] = useState<boolean>(false);
  const enableResend = timeRemaining === 0;
  const [onSnapEnd, setOnSnapEnd] = useState<any>(false);
  const [chosenCurrency, setChosenCurrency] = useState<string>("");
  // const [isEnrollmentSuccess, setEnrollmentStatus] = useState<boolean>(false);
  const [isEnrollingCard, setIsEnrollingCard] = useState<boolean>(false);
  const [enrollmentCardStatus, setEnrollmentCardStatus] = useState<{
    title: string;
    text: string;
    isError: boolean;
  }>(DEFAULT_CARD_ENROLLMENT_STATUS);
  const [orderCard, {
    isLoading: orderCardIsLoading, 
    isSuccess: orderCardIsSuccess,
    isError: orderCardIsError,
  }] = useLazyOrderCardQuery();
  const [showCardDetails, {
    isLoading: showCardDetailsIsLoading,
    isSuccess: showCardDetailsIsSuccess,
    data: showCardDetailsData,
    isError: showCardDetailsIsError,
  }] = useLazyShowCardDetailsQuery();
  const [terminatedThisCard] = useLazySendSmsLostCardVerificationQuery();
  const shownCardsOnCarousel = isTerminatedCardShown ? cardsActiveList ? [...cardsActiveList, ...cardData] : [] : cardsActiveList ? cardsActiveList : [];

  const handlePinCodeChange = (value: string) => {
    setCardPin(value);
    if (value.length === 6) {
      processEnrollmentAndShowPinCard({ code: value });
    }
  }

  const handleDataChangeShownOnCards = (index?: number) => {
    refCarousel.current.snapToItem(index ?? 0);
  };

  const handleGetCards = async () => {
    try {
      await dispatch(getCards() as any);
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const freezeCard = async (isCardToFreeze: boolean) => {
    if(!selectedCard) {
      setSelectedCard(cardsActiveList[0]);
    }
    setIsTerminatedCardShown(false);
    setIsLoading(prev => true);
    dispatch<any>(
      setCardAsFrozen({
        freezeYN: isCardToFreeze ? "Y" : "N",
        account_id: userData?.id,
        card_id: !selectedCard ? cardsActiveList[0].cardreferenceId : selectedCard?.cardreferenceId,
      }))
      .unwrap()
      .then((res: any) => {
        const updatedSelectedCard = res.find((card: any) => card.cardreferenceId === selectedCard?.cardreferenceId);
        handleGetCards();
        setSelectedCard(updatedSelectedCard);
      })
      .catch((error: any) => {
        console.log({ error });
      })
      .finally(() => {
        setIsLoading(prev => false);
      });
  };

  const resetCard = () => {
    setCardPin("");
    setCardDetails({});
    setRemainingTime(30);
  };

  const requestShowCard = async () => {

    setIsLoading(prev => prev = true);
    dispatch(
      sendSmsShowCardVerification({
        type: "trusted",
      }) as any
    ).unwrap()
    .then((res: any) => {
      if (res) {
        refRBSShowCard?.current?.open();
      }
    })
    .catch((error: any) => {
      console.log({ error });
    })
    .finally(() => {
      setIsLoading(prev => prev = false);
    });
    // if (payload?.status !== "success") {
    //   setShowCardOtpModal(true);
    //   return;
    // }
  };

  const processEnrollmentAndShowPinCard = async ({ code }: { code: string }) => {
    // if (isEnrollingCard) {
    //   const orderCardPayload = {
    //     cardType: "V",
    //     accountUuid: userID,
    //     currency: chosenCurrency,
    //     email: userEmail,
    //     otp: code,
    //   };
    //   console.log(
    //     "🚀 ~ file: Card.tsx:267 ~ handlePinCode ~ orderCardPayload:",
    //     orderCardPayload
    //   );
    //   orderCard(orderCardPayload)
    //   .unwrap()
    //   .then((res: any) => {
    //     console.log({ res });
    //     setShowCardOtpModal(false);
    //     setIsloading(false);
    //   })
    //   .catch((error: any) => {
    //     console.log({ error });
    //   })
    //   return;
    // } else {
      // setShowCardOtpLoading(true);
      // console.log({ account_id: userID, otp: code, card_id: selectedCard?.cardreferenceId });


      // const payload = await dispatch(
      //   showCardDetails({
      //     account_id: userID,
      //     otp: code,
      //     card_id: selectedCard?.cardreferenceId,
      //   }) as any
      // ).unwrap();
      // setIsloading(false);
      // if (payload) {
      //   setCardPin("");
      //   setRemainingTime(30);
      //   setCardDetails({
      //     cardreferenceId: cardsActiveList[0]?.cardreferenceId,
      //     card: cardsActiveList[0],
      //     cardImage: payload.cardImageBase64,
      //     cardNumber: payload?.cardNumber,
      //   });
      // }
      // setShowCardOtpLoading(false);
      // setShowCardOtpModal(false);
    // }
  };

  // TODO: target each card when doing action on each card, right now it only targets the first card
  const _renderItem = ({ item, index }: any) => {
    return (
      <Pressable key={index}>
        <CardView
          resetHandler={() => setCardDetails({})}
          cardDetails={cardDetails}
          freezeLoading={freezeLoading}
          key={index}
          card={item}
          pin={cardPin}
          timer={remainingTime}
        />
      </Pressable>
    );
  };

  const handleLostCard = async () => {
    console.log({
      account_id: Number(userData?.id),
      card_id: Number(selectedCard?.cardreferenceId),
    })
    if (userID && selectedCard?.cardreferenceId) {
      try {
        await dispatch<any>(
          terminateCard({
            account_id: Number(userData?.id),
            card_id: Number(selectedCard?.cardreferenceId),
          })
        );
      } catch (error) {
        console.log({ error });
        Alert.alert("Error", "Something went wrong");
      } finally {
        setIsLoading(false);
        // handleGetCardsTransactions();
        setTerminatedCardModal(false);
        await dispatch<any>(getCards());
      }
    }
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(cardDetails?.cardNumber || "");
  };

  useEffect(() => {
    if (showCardDetailsIsSuccess) {
      setCardPin(showCardDetailsData?.cardPin);
      setRemainingTime(30);
      setCardDetails({
        cardreferenceId: cardsActiveList[0]?.cardreferenceId,
        card: cardsActiveList[0],
        cardImage: showCardDetailsData?.cardImageBase64,
        cardNumber: showCardDetailsData?.cardNumber,
      });
    }
    if (showCardDetailsIsError) {
      Alert.alert("Error", "Something went wrong");
    }
  }, [showCardDetailsIsSuccess, showCardDetailsIsError]);

  useEffect( () => {
    if (orderCardIsSuccess) {
      // setEnrollmentStatus(true);
      setEnrollmentCardStatus({
        title: "Card Enrollment",
        text: `Card Status: Success`,
        isError: false,
      });
      setIsLoading(false);
      setShowCardOtpModal(false);
    }
    if (orderCardIsError) {
      setIsLoading(false);
      setIsEnrollingCard(false);
      setShowCardOtpModal(false);
      // setEnrollmentStatus(true);
      setEnrollmentCardStatus({
        title: "Card Enrollment",
        text: `Error while ordering card`,
        isError: true,
      });
    }
  }, [orderCardIsSuccess, orderCardIsError]);

  // this lifecycle auto order
  // useEffect(() => {
  //   (async () => {
  //     if (!selectedCard && cardsActiveList.length > 0) {
  //       setPrimaryCardID(cardsActiveList[0]?.cardreferenceId);
  //       setSelectedCard(shownCardsOnCarousel[0]);
  //     }
  //     if (cardsActiveList.length === 0 && cardData.length > 0) {
  //       try {
  //         await dispatch<any>(
  //           sendSmsShowCardVerification({
  //             type: "trusted",
  //           }))
  //         setIsEnrollingCard(true);
  //         setShowCardOtpModal(true);
  //       } catch(error) {
  //         console.log({error});
  //       }
  //     }
  //     setSelectedCard(shownCardsOnCarousel[0]);
  //   })();
  // }, [cardData]);

  // triggered when cardDetails image is truthy
  useEffect(() => {
    let interval: any;
    if (cardDetails?.cardImage) {
      interval = setInterval(() => {
        setRemainingTime((remainingTime) => remainingTime - 1);
        if (remainingTime === 0) {
          clearInterval(interval);
          resetCard();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cardDetails, remainingTime]);

  useEffect(() => {
    if (!selectedCard) {
      setSelectedCard(cardsActiveList[0]);
    }
  }, [shownCardsOnCarousel]);

  useEffect(() => {
    setIsLoading(true);
    handleGetCards();
    dispatch<any>(setIsCardTransactionShown(false));
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {/* <GetCardModal
        onClose={() => setShowGetCardModal(false)}
        isModalVisible={showGetCardModal}
        onGetVirtualCard={({currency}: any) => {
          setShowGetCardModal(false);
          setIsEnrollingCard(true);
          setShowCardOtpModal(true);
          setChosenCurrency(currency);
          }
        }
      />
      <CodeModal
        confirmButtonText={isEnrollingCard ? "Submit" : "Show Card"}
        title={isEnrollingCard ? "Card Enrollment" : "Show Card"}
        subtitle={ isEnrollingCard ?
          "Since your account doesnt have any card. You will receive an sms to your mobile device. Please enter this code below." :
          "You will receive an sms to your mobile device. Please enter this code below."
        }
        isOpen={showCardOtpModal}
        loading={showCardOtpLoading}
        onSubmit={processEnrollmentAndShowPinCard}
        onCancel={() => {
          setShowCardOtpModal(false);
          setIsloading(false);
        }}
      /> */}
      { terminatedCardModal && (
        <TerminatingCardModal
          isOpen={terminatedCardModal}
          title={"Card Terminated"}
          actionMethod={() => {
            setIsLoading(true);
            handleLostCard();
          }}
          onClose={() => {
            setTerminatedCardModal(false);
          }}
        />
      )}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          bounces={true}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: "transparent", display: 'none' }}
              refreshing={isLoading}
              onRefresh={handleGetCards}
            />
          }
        >
          <Pressable>
            <View style={styles.container}>
              <Heading
                icon={<CardIcon size={18} color="pink" />}
                title={"My Card"}
                rightAction={
                  <Button
                    onPress={() => {
                      navigation.navigate(screenNames.getCard);
                    }}
                    color={"light-pink"}
                    leftIcon={<MaterialCommunityIcons name="credit-card-plus-outline" size={14} color={vars['accent-pink']} />}
                    disabled={cardsActiveList.length === 0 ? false : true}
                  >
                    Create
                  </Button>
                }
              />
            </View>
          </Pressable>
          <View style={styles.cardSection}>
            <View style={styles.cardImages}>
              <Carousel
                ref={refCarousel}
                disableIntervalMomentum
                data={cardDetails?.cardImage ? [cardDetails] : shownCardsOnCarousel}
                renderItem={_renderItem}
                refreshing={isLoading}
                enableMomentum={false}
                decelerationRate={0.25}
                sliderWidth={370}
                snapToStart={isLoading}
                removeClippedSubviews={false}
                itemWidth={303}
                initialScrollIndex={0}
                inactiveSlideOpacity={.5}
                layout="default"
                lockScrollWhileSnapping={true}
                onSnapToItem={(index) => {
                  if(isTerminatedCardShown) {
                    setSelectedCard(shownCardsOnCarousel[index]);
                  } else {
                    setSelectedCard(cardsActiveList[index]);
                  }
                }}
                onBeforeSnapToItem={(index) => {
                  setSelectedCard(shownCardsOnCarousel[index]);
                }}
              />
              {cardDetails?.cardNumber ? (
                <TouchableOpacity onPress={handleCopyToClipboard}>
                  <View style={styles.clipboardContainer}>
                    <CopyClipboard color="light-pink" size={18} />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.cardActions}>
              <View style={styles.cardActionsButtonMargin}>
                <Pressable>
                  <Button
                    color="light-blue"
                    onPress={() => {
                      refRBSShowCard?.current?.open();
                      requestShowCard();
                    }}
                    leftIcon={<EyeIcon color="blue" size={14} />}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={600}
                      marginLeft={8}
                      fontFamily={'Nunito-SemiBold'}
                    >
                      Show Card
                    </Typography>
                  </Button>
                </Pressable>
              </View>
              <View style={styles.cardActionsButtonMargin}>
                <Pressable>
                  <Button
                    // color={selectedCard?.frozenYN === "Y" ? "blue" : "light-blue"}
                    color="light-blue"
                    leftIcon={
                      <FreezeIcon
                        color={"blue"}
                        size={14}
                      />
                    }
                    onPress={() => {
                      setFreezeLoading(true);
                      setIsLoading(prev => true);
                      //card status === do_not_honor means frozen now, before it means pending from enrollment by aristos - arjay 1.23.2024
                      if( 
                        selectedCard?.cardStatus === "cancelled" ||
                        selectedCard?.cardStatus === "terminated"
                      ) {
                        Alert.alert("Card is not active", "Please activate your card first");
                        setFreezeLoading(false);
                        setIsLoading(prev => false);
                        return;
                      } else {
                        setFreezeLoading(false);
                        setIsLoading(prev => false);
                      }
                      freezeCard(
                        selectedCard?.frozenYN === "Y" &&
                        selectedCard?.cardStatus === "do_not_honor"
                          ? false : true
                        );
                    }}
                    disabled={freezeLoading}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={600}
                      // marginLeft={8}
                      fontFamily={'Nunito-SemiBold'}
                    >
                      {selectedCard?.frozenYN === "Y" ? "Unfreeze Card" : "Freeze Card"}
                    </Typography>
                  </Button>
                </Pressable>
              </View>
            </View>
          </View>
          <Pressable>
            <Divider style={{marginVertical: 10, paddingHorizontal: 15}} />
              <View style={styles.cardActionsListContainer}>
                <TouchableOpacity style={styles.cardActionItem} onPress={() => {
                    dispatch<any>(setIsCardTransactionShown(true));
                    navigation.navigate('Transactions');
                  }}>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <View style={{paddingRight: 8, marginTop: 2 }}>
                      <ArrowSwitch color="heavy-blue" size={18}/>
                    </View>
                    <Typography fontSize={16} fontWeight={600} fontFamily={'Nunito-SemiBold'}>
                      See Card Transactions
                    </Typography>
                  </View>
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </View>
            <Divider style={{
              marginVertical: 5,
              paddingHorizontal: 15,
              height: 1,
              backgroundColor: vars['shade-grey'],
              opacity: .2,
              }}
            />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity style={styles.cardActionItem} onPress={() => refRBSheet?.current?.open()}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 2}}>
                    <MaterialCommunityIcons name="cog-outline" size={18} color={vars['accent-blue']} />
                  </View>
                  <Typography fontSize={16} fontWeight={600} fontFamily={'Nunito-SemiBold'}>
                    Manage Payment Method
                  </Typography>
                </View>
                <TouchableOpacity
                  style={{marginTop: 7}} 
                  
                >
                  <ArrowRight color="heavy-blue" size={14} style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Divider style={{
              marginVertical: 5,
              paddingHorizontal: 15,
              height: 1,
              backgroundColor: vars['shade-grey'],
              opacity: .2,
              }}
            />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity style={styles.cardActionItem} onPress={() => refRBSTerminateThisCard?.current?.open()}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 2}}>
                    <PinNumberCode color="heavy-blue" size={18} />
                  </View>
                  <Typography fontSize={16} fontWeight={600} fontFamily={'Nunito-SemiBold'}>
                    Lost Card
                  </Typography>
                </View>
                <TouchableOpacity style={{marginTop: 7}}>
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Divider style={{
              marginVertical: 5,
              paddingHorizontal: 15,
              height: 1,
              backgroundColor: vars['shade-grey'],
              opacity: .2,
              }}
            />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity style={styles.cardActionItem} onPress={() => refRBSheetShowTerminatedCards?.current?.open()}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 2}}>
                    <BugIcon size={18} color={vars['accent-blue']} />
                  </View>
                  <Typography fontSize={16} fontWeight={600} fontFamily={'Nunito-SemiBold'}>
                    {isTerminatedCardShown ? "Hide Terminated Cards" : "Show Terminated Cards"}
                  </Typography>
                </View>
                <TouchableOpacity style={{marginTop: 7}} >
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Divider style={{
              marginVertical: 5,
              paddingHorizontal: 15,
              height: 1,
              backgroundColor: vars['shade-grey'],
              opacity: .2,
              }}
            />
          </Pressable>
          <SwipableBottomSheet
            rbSheetRef={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            // onClose={() => refRBSheet?.current?.close()}
            height={250}
            wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            containerStyles={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              elevation: 12,
              shadowColor: "#52006A",
              paddingHorizontal: 15,
            }}
            draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
          >
            {/* <View style={{
            width: '30%',
              alignSelf:'center', 
              backgroundColor: vars['grey'],
              height: 5,
              borderRadius: 10, 
              zIndex: 999, 
              marginBottom: 20, 
              top: 0
              }}></View> */}
            <Typography fontSize={18} fontWeight={600} fontFamily={'Nunito-SemiBold'}>
              <MaterialCommunityIcons name="cog-outline" size={18} color={vars['accent-blue']} />
              {" "}Manage Payment Method
            </Typography>
            <Divider style={{
              // marginBottom: 25,
              marginTop: 20,
              height: 1,
              backgroundColor: vars['shade-grey'],
              opacity: .2,
              width: '100%',
              }} />
            <ManagePaymentMethod />
          </SwipableBottomSheet>
          <SwipableBottomSheet
            rbSheetRef={refRBSheetShowTerminatedCards}
            closeOnDragDown={true}
            closeOnPressMask={false}
            height={160}
            wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            containerStyles={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              elevation: 12,
              shadowColor: "#52006A",
              paddingHorizontal: 15,
            }}
            draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
          >
            <Typography fontSize={16} fontWeight={600}>
              {isTerminatedCardShown ? "Hide Terminated Cards?" : "Show Terminated Cards?"}
            </Typography>
            <Divider style={{marginVertical: 15, paddingHorizontal: 15}} />
            <View style={{
                width: "100%",
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                bottom: '2%',
                marginTop: 25
              }}>
              <Button
                onPress={() => {
                  if (isTerminatedCardShown) {
                    setIsLoading(prev => true);
                    // setIsShowTerminatedCard(false);
                    setIsTerminatedCardShown(false);
                    setSelectedCard(cardsActiveList[0]);
                  } else {
                    setIsLoading(prev => true);
                    // setIsShowTerminatedCard(true);
                    setIsTerminatedCardShown(true);
                    setSelectedCard(cardData[0]);
                  }
                  setIsLoading(prev => false);
                  handleDataChangeShownOnCards();
                  refRBSheetShowTerminatedCards?.current?.close();
                }}
                style={{color: '#fff', width: 140}}
                color="light-pink"
                fontFamily={"Nunito-SemiBold"}
                leftIcon={<EyeIcon color="pink" size={14} />}
              >
                Yes
              </Button>
              <Button
                onPress={() => {
                  refRBSheetShowTerminatedCards?.current?.close()
                }}
                style={{color: '#fff', width: 140}}
                color="grey"
              >
                Cancel
              </Button>
            </View>
          </SwipableBottomSheet>
          <SwipableBottomSheet
            rbSheetRef={refRBSTerminateThisCard}
            closeOnDragDown={true}
            closeOnPressMask={false}
            height={230}
            wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            containerStyles={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              elevation: 12,
              shadowColor: "#52006A",
              paddingHorizontal: 15,
            }}
            draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
          >
            <Typography fontSize={16} fontWeight={600} fontFamily={'Nunito-Bold'}>
              Terminate This Card?
            </Typography>
            <Divider style={{
                marginBottom: 35,
                marginTop: 10,
                height: 1,
                backgroundColor: vars['shade-grey'],
                opacity: .1,
                width: '100%',
              }} />

            <Typography fontSize={16} fontWeight={400} color={"#000"}>
              Are you sure you want to terminate this card?
            </Typography>
            {/* <Vie}}/> */}
            <Divider style={{
                marginTop: 35,
                height: 1,
                backgroundColor: vars['shade-grey'],
                opacity: .1,
                width: '100%',
              }} />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
              <Button 
                onPress={() => {
                  setIsLoading(true);
                  terminatedThisCard({
                    accountId: userID,
                    cardId: selectedCard?.cardreferenceId,
                  })
                  .unwrap()
                  .finally(() => {
                    setIsLoading(false);
                    refRBSTerminateThisCard?.current?.close();
                  })
                }}
                style={{color: '#fff', width: 140}}
                color="light-pink"
                leftIcon={<AntDesign name="checkcircleo" size={16} color={vars['accent-pink']} />}
                disabled={isLoading}
              >
                Yes
              </Button>
              <Button 
                onPress={() => refRBSTerminateThisCard?.current?.close()}
                style={{color: '#fff', width: 140}}
                color="grey"
                // leftIcon={<EyeIcon color="pink" size={14} />}
              >
                No
              </Button>
            </View>
          </SwipableBottomSheet>
          <SwipableBottomSheet
            rbSheetRef={refRBSShowCard}
            closeOnDragDown={true}
            closeOnPressMask={false}
            height={340}
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
              <Typography fontSize={16} fontWeight={600} fontFamily={'Nunito'}>
                Show Card
              </Typography>
              <Typography fontSize={14} fontWeight={400} color={vars['shade-grey']} >
                You will receive an sms to your mobile device. Please enter this code below.
              </Typography>
              <Divider style={{marginVertical: 15, paddingHorizontal: 15}} />
              <PinCodeInputClipBoard fieldCount={6} onChange={handlePinCodeChange} isNewPinCodeStyle />
              <TouchableOpacity
                onPress={() => console.log('resend')}
                disabled={isTimeToCountDown}
              >
                {isTimeToCountDown ? (
                  <Text style={styles.noCodeResend}>
                    Wait for {timeRemaining}s to request again.
                  </Text>
                ) : (
                  <Text style={styles.noCode}>Did not get a verification code?</Text>
                )}
              </TouchableOpacity>
              <View style={{alignItems: 'center', paddingTop: 50}}>
                <Button
                  onPress={() => {
                    if (!cardPin && !userID) {
                      return;
                    }
                    setIsLoading(true);
                    showCardDetails({
                      account_id: userID,
                      otp: cardPin,
                      card_id: Number(selectedCard?.cardreferenceId),
                    })
                    .unwrap()
                    .then((res: any) => {
                      if (res) {
                        setCardPin("");
                        setRemainingTime(30);
                        setCardDetails({
                          cardreferenceId: cardsActiveList[0]?.cardreferenceId,
                          card: cardsActiveList[0],
                          cardImage: res.cardImageBase64,
                          cardNumber: res?.cardNumber,
                        });
                      }})
                      .catch((error: any) => {
                        console.log({ error });
                      })
                      .finally(() => {
                        setIsLoading(false);
                        refRBSShowCard?.current?.close();
                      });
                  }}
                  style={{color: '#fff', width: 140}}
                  color="light-pink"
                  leftIcon={<AntDesign name="checkcircleo" size={16} color={vars['accent-pink']} />}
                  disabled={isLoading}
                >
                  Confirm
                </Button>
              </View>
          </SwipableBottomSheet>
          <Spinner visible={orderCardIsLoading} />
        </ScrollView>
      </View>
    </MainLayout>
  );
}
