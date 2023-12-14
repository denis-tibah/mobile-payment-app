import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import { styles } from "./styles";
import Typography from "../../components/Typography";
import CardIcon from "../../assets/icons/Card";
import FreezeIcon from "../../assets/icons/Freeze";
import EyeIcon from "../../assets/icons/Eye";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import {
  getCards,
  sendSmsShowCardVerification,
  setCardAsFrozen,
  showCardDetails,
  terminateCard,
  orderCard,
  enrollforCardScheme,
  setPrimaryCardID,
} from "../../redux/card/cardSlice";
import {
  getUserActiveCards,
} from "../../utils/helpers";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { CardView } from "../../components/Card/CardView";
import { GetCardModal } from "./GetCardModal";
import { RootState } from "../../store";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import { delayCode } from "../../utils/delay";
import Carousel from "react-native-snap-carousel";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { ICardDetails } from "../../models/interface";
import vars from "../../styles/vars";
import { useDebounce } from "usehooks-ts";
import { CardTransaction } from "../../models/Transactions";
import TerminatingCardModal from "./TerminatingCardModal";
import { Divider } from "react-native-paper";
import ArrowRight from "../../assets/icons/ArrowRight";
import { ArrowSwitch } from "../../assets/icons/ArrowSwitch";
import { PinNumberCode } from "../../assets/icons/PinNumber";
import { BugIcon } from "../../assets/icons/BugIcon";
import BottomSheet from "../../components/BottomSheet";
import ManagePaymentMethod from "./Components/ManagePayment";
import { PinCodeInputBoxes } from "../../components/FormGroup/FormGroup";

const DEFAULT_CARD_ENROLLMENT_STATUS = {
  title: "",
  text: "",
  isError: false,
};

export function Card({ navigation }: any) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const userID = userData?.id;
  const profile = useSelector((state: any) => state.profile?.profile);
  const userEmail = profile?.data.email;
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
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isManagePaymentMethod, setIsManagePaymentMethod] = useState<boolean>(false);
  const [isShowPinActionPressed, setIsShowPinActionPressed] = useState<boolean>(false);
  const [isLostPinActionPressed, setIsLostPinActionPressed] = useState<boolean>(false);
  const [showCardDetailOTP, setShowCardDetailOTP] = useState<number>(0);
  const [isEnrollmentSuccess, setEnrollmentStatus] = useState<boolean>(false);
  const [isEnrollingCard, setIsEnrollingCard] = useState<boolean>(false);
  const [enrollmentCardStatus, setEnrollmentCardStatus] = useState<{
    title: string;
    text: string;
    isError: boolean;
  }>(DEFAULT_CARD_ENROLLMENT_STATUS);
  const shownCardsOnCarousel = isTerminatedCardShown ? cardsActiveList ? [...cardsActiveList, ...cardData] : [] : cardsActiveList ? cardsActiveList : [];
  const isShowingCardDetails = !!cardDetails?.cardImage;

  const handleGetCards = async () => {
    try {
      await dispatch(getCards() as any);
    } catch (error) {
      console.log({ error });
    } finally {
      setIsloading(false);
    }
  };

  const freezeCard = async (isCardToFreeze: boolean) => {
    if(!selectedCard) {
      console.log("no card selected");
      return;
    }
    try {
      setIsloading(prev => true);
      await dispatch<any>(
        setCardAsFrozen({
          freezeYN: isCardToFreeze ? "Y" : "N",
          account_id: userData?.id,
          card_id: selectedCard?.cardreferenceId,
        })
      );
    } catch (error) {
      console.log({ error });
    } finally {
      await dispatch<any>(getCards());
      setIsloading(prev => false);
      setFreezeLoading(false);
    }
  };

  const resetCard = () => {
    setCardPin("");
    setCardDetails({});
    setRemainingTime(30);
    // clearInterval(storedIntervalId);
  };

  const requestShowCard = async () => {
    setIsEnrollingCard(false);
    setIsloading(prev => true);
    const payload = await dispatch(
      sendSmsShowCardVerification({
        type: "trusted",
      }) as any
    ).unwrap()
    .finally(() => {
      setIsloading(prev => false);
    });
    if (payload?.status !== "success") return;
    setShowCardOtpModal(true);
  };

  const handlePinCode = async ({ code }: { code: string }) => {
    if (isEnrollingCard) {
      const orderCardPayload = {
        cardType: "V",
        accountUuid: userID,
        currency: "EUR",
        email: userEmail,
        otp: code,
      };
      console.log(
        "🚀 ~ file: Card.tsx:267 ~ handlePinCode ~ orderCardPayload:",
        orderCardPayload
      );
      const payloadOrderCard = await dispatch(
        orderCard(orderCardPayload) as any
      )
      .unwrap()
      .catch((error: any) => {
        console.log("error in order card upon enrollment:", error);
      })
      .finally(() => {
        setIsEnrollingCard(false);
        setIsloading(false);
        setShowCardOtpModal(false);
      });
      console.log(
        "🚀 ~ file: Card.tsx:270 ~ handlePinCode ~ payloadOrderCard:",
        payloadOrderCard
      );
      if (payloadOrderCard?.status && payloadOrderCard?.status === "success") {
        await dispatch(
          enrollforCardScheme({ account_id: userID }) as any
        )
          .unwrap()
          .then((res: any) => {
            setEnrollmentStatus(true);
            setEnrollmentCardStatus({
              title: "Card Enrollment",
              text: `Card Status: Success`,
              isError: false,
            });
            setIsloading(false);
            setShowCardOtpModal(false);
          })
          .catch((error: any) => {
            setIsloading(false);
            setEnrollmentStatus(true);
            setEnrollmentCardStatus({
              title: "Card Enrollment",
              text: `Card Status: Pending. Check back later.`,
              isError: true,
            });
            setShowCardOtpModal(false);
          })
          .finally(() => {
            dispatch<any>(getCards());
            setIsEnrollingCard(false);
          });
      } else {
        setIsloading(false);
        setIsEnrollingCard(false);
        setShowCardOtpModal(false);
        setEnrollmentStatus(true);
        setEnrollmentCardStatus({
          title: "Card Enrollment",
          text: `${payloadOrderCard?.code}: Error while ordering card`,
          isError: true,
        });
      }
    } else {
      setShowCardOtpLoading(true);
      setIsTerminatedCardShown(false);

      const payload = await dispatch(
        showCardDetails({
          account_id: userID,
          otp: code,
          card_id: selectedCard?.cardreferenceId,
        }) as any
      ).unwrap();
      setIsloading(false);
      if (payload) {
        setCardPin("");
        setRemainingTime(30);
        setCardDetails({
          cardreferenceId: cardsActiveList[0]?.cardreferenceId,
          card: cardsActiveList[0],
          cardImage: payload.cardImageBase64,
          cardNumber: payload?.cardNumber,
        });
      }
      setShowCardOtpLoading(false);
      setShowCardOtpModal(false);
      await delayCode(100);
    }
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
        setIsloading(false);
        // handleGetCardsTransactions();
        setTerminatedCardModal(false);
        await dispatch<any>(getCards());
      }
    }
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(cardDetails?.cardNumber || "");
  };

  // const sortCardTransactionsByDate = (sortState: boolean) => {
  //   const sortedTransactions = [...cardTransactionsData].sort(
  //     (a: CardTransaction, b: CardTransaction) => {
  //       const dateA = new Date(a.receiptDate);
  //       const dateB = new Date(b.receiptDate);
  //       return sortState
  //         ? dateA.getTime() - dateB.getTime()
  //         : dateB.getTime() - dateA.getTime();
  //     }
  //   );
  //   setCardTransactionsData(sortedTransactions);
  //   setIsloading(false);
  // };

  useEffect(() => {
    (async () => {
      if (!selectedCard && cardsActiveList.length > 0) {
        setPrimaryCardID(cardsActiveList[0]?.cardreferenceId);
        setSelectedCard(shownCardsOnCarousel[0]);
      }
      if (cardsActiveList.length === 0 && cardData.length > 0) {
        try {
          await dispatch<any>(
            sendSmsShowCardVerification({
              type: "trusted",
            }))
          setIsEnrollingCard(true);
          setShowCardOtpModal(true);
        } catch(error) {
          console.log({error});
        }
      }
      setSelectedCard(shownCardsOnCarousel[0]);
    })();
  }, [cardData]);

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
    handleGetCards();
  }, []);

  return (
    <MainLayout navigation={navigation}>
      <GetCardModal
        onClose={() => setShowGetCardModal(false)}
        isModalVisible={showGetCardModal}
        onGetVirtualCard={({currency}: any) => {
          setShowGetCardModal(false);
          setIsEnrollingCard(true);
          setShowCardOtpModal(true);
  
          }
        }
      />
      <CodeModal
        confirmButtonText={isEnrollingCard ? "Submit" : "Show Card"}
        title={isEnrollingCard ? "Card Enrollment" : "Show Card"}
        subtitle="Since your account doesnt have any card. You will receive an sms to your mobile device. Please enter this code below."
        isOpen={showCardOtpModal}
        loading={showCardOtpLoading}
        onSubmit={handlePinCode}
        onCancel={() => {
          setShowCardOtpModal(false);
          setIsloading(false);
        }}
      />
      { terminatedCardModal && (
        <TerminatingCardModal
          isOpen={terminatedCardModal}
          title={"Card Terminated"}
          actionMethod={() => {
            setIsloading(true);
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
            <RefreshControl refreshing={isLoading} onRefresh={handleGetCards} />
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
                      console.log("get card");
                      setShowGetCardModal(true);
                    }}
                    color={"light-pink"}
                    leftIcon={<MaterialCommunityIcons name="credit-card-plus-outline" size={14} color={vars['accent-pink']} />}
                    // disabled={isCardHaveVirtual}
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
                data={cardDetails?.cardImage ? [cardDetails] : shownCardsOnCarousel}
                renderItem={_renderItem}
                refreshing={isLoading}
                sliderWidth={400}
                itemWidth={303}
                layout="default"
                lockScrollWhileSnapping={false}
                // swipeThreshold={10}
                onSnapToItem={(index) => {
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
                    onPress={requestShowCard}
                    leftIcon={<EyeIcon color="blue" size={14} />}
                  >
                    Show Card
                  </Button>
                </Pressable>
              </View>
              <View style={styles.cardActionsButtonMargin}>
                <Pressable>
                  <Button
                    color={selectedCard?.frozenYN === "Y" ? "blue" : "light-blue"}
                    leftIcon={
                      <FreezeIcon
                        color={selectedCard?.frozenYN === "Y" ? "white" : "blue"}
                        size={14}
                      />
                    }
                    onPress={() => {
                      setFreezeLoading(true);
                      setIsloading(prev => true);
                      freezeCard(selectedCard?.frozenYN === "Y" ? false : true);
                    }}
                    disabled={freezeLoading}
                  >
                    {selectedCard?.frozenYN === "Y" ? "Unfreeze Card" : "Freeze Card"}
                  </Button>
                </Pressable>
              </View>
            </View>
          </View>
          <Divider style={{marginVertical: 10, paddingHorizontal: 15}} />
            <View style={styles.cardActionsListContainer}>
              <View style={styles.cardActionItem}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 5}}>
                    <ArrowSwitch color="heavy-blue" size={18}/>
                  </View>
                  <Typography fontSize={16} fontWeight={600}>
                    See Card Transactions
                  </Typography>
                </View>
                <TouchableOpacity style={{marginTop: 7}} onPress={() => navigation.navigate('Transactions')}>
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </View>
            </View>
          <Divider style={{marginVertical: 5, paddingHorizontal: 15}} />
            <View style={styles.cardActionsListContainer}>
              <View style={styles.cardActionItem}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 5}}>
                    <MaterialCommunityIcons name="cog-outline" size={18} color={vars['accent-blue']} />
                  </View>
                  <Typography fontSize={16} fontWeight={600}>
                    Manage Payment Method
                  </Typography>
                </View>
                <TouchableOpacity 
                  style={{marginTop: 7}} 
                  onPress={() => setIsManagePaymentMethod(!isManagePaymentMethod)}
                >
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </View>
            </View>
          <Divider style={{marginVertical: 5, paddingHorizontal: 15}} />
            <View style={styles.cardActionsListContainer}>
              <View style={styles.cardActionItem}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 5}}>
                    <PinNumberCode color="heavy-blue" size={18} />
                  </View>
                  <Typography fontSize={16} fontWeight={600}>
                    Show Pin
                  </Typography>
                </View>
                <TouchableOpacity style={{marginTop: 7}} onPress={() => setIsShowPinActionPressed(true)}>
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </View>
            </View>
          <Divider style={{marginVertical: 5, paddingHorizontal: 15}} />
            <View style={styles.cardActionsListContainer}>
              <View style={styles.cardActionItem}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{paddingRight: 8, marginTop: 5}}>
                    <BugIcon size={18} color={vars['accent-blue']} />
                  </View>
                  <Typography fontSize={16} fontWeight={600}>
                    Lost card
                  </Typography>
                </View>
                <TouchableOpacity style={{marginTop: 7}} onPress={() => setIsLostPinActionPressed(true)}>
                  <ArrowRight color="heavy-blue" size={14}  style={{ paddingRight: 14 }}/>
                </TouchableOpacity>
              </View>
            </View>
          <Divider style={{marginVertical: 5, paddingHorizontal: 15}} />
          <BottomSheet
            isVisible={isManagePaymentMethod}
            onClose={() => setIsManagePaymentMethod(false)}
          >
            <Typography fontSize={16} fontWeight={600}>
              <MaterialCommunityIcons name="cog-outline" size={18} color={vars['accent-blue']} />
              Manage Payment Method
            </Typography>
            <Divider style={{marginVertical: 8, paddingHorizontal: 15}} />
            <ManagePaymentMethod />
            <Button 
              onPress={() => setIsManagePaymentMethod(false)}
              style={{color: '#fff'}}
              color="light-blue"
            >
              Close
            </Button>
          </BottomSheet>
          <BottomSheet
            isVisible={isShowPinActionPressed}
            onClose={() => setIsShowPinActionPressed(false)}
          >
            <Typography fontSize={16} fontWeight={600}>
              Show Card Pin Number
            </Typography>
            <Typography fontSize={12} fontWeight={400} color={"#696F7A"}>
              You will receive an sms to your mobile device. 
              Please enter this code below.
            </Typography>
            <Divider style={{marginVertical: 15, paddingHorizontal: 15}} />
            <View style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                marginBottom: 20,
              }}>
              <PinCodeInputBoxes
                fieldCount={6}
                onChange={(otp: number) => setShowCardDetailOTP(otp)}
              />
              <TouchableOpacity >
                <Text style={{
                  color: vars['accent-pink'],
                  fontSize: 14,
                  fontWeight: 500,
                  marginTop: 10,
                } as any}>
                  Did not get a verification code?
                </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{marginVertical: 15, paddingHorizontal: 15}} />
            <Button 
              onPress={() => setIsShowPinActionPressed(false)}
              style={{color: '#fff'}}
              color="light-pink"
              leftIcon={<EyeIcon color="pink" size={14} />}
            >
              Show Pin Number
            </Button>
          </BottomSheet>
          <BottomSheet
            isVisible={isLostPinActionPressed}
            onClose={() => setIsLostPinActionPressed(false)}
          >
            <Typography fontSize={16} fontWeight={600}>
              Terminate This Card?
            </Typography>
            <Typography fontSize={12} fontWeight={400} color={"#696F7A"}>
              You will receive an sms to your mobile device. 
              Please enter this code below.
            </Typography>
            <Divider style={{marginVertical: 15, paddingHorizontal: 15}} />
            <Typography fontSize={16} fontWeight={400} color={"#000"}>
              Are you sure you want to terminate this card?
            </Typography>
            <Divider style={{marginVertical: 15, paddingHorizontal: 15}} />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button 
                onPress={() => setIsLostPinActionPressed(false)}
                style={{color: '#fff', width: 140}}
                color="light-pink"
                leftIcon={<EyeIcon color="pink" size={14} />}
              >
                Yes
              </Button>
              <Button 
                onPress={() => setIsLostPinActionPressed(false)}
                style={{color: '#fff', width: 140}}
                color="light-pink"
                leftIcon={<EyeIcon color="pink" size={14} />}
              >
                No
              </Button>
            </View>
          </BottomSheet>
          <Spinner visible={isLoading} />
        </ScrollView>
      </View>
    </MainLayout>
  );
}
