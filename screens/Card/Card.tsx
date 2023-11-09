import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import { styles } from "./styles";
// import TransactionItem from "../../components/TransactionItem";
import Typography from "../../components/Typography";
import CardIcon from "../../assets/icons/Card";
import AddIcon from "../../assets/icons/Add";
import FreezeIcon from "../../assets/icons/Freeze";
/* import PinIcon from "../../assets/icons/Pin"; */
import EyeIcon from "../../assets/icons/Eye";
import LostCardIcon from "../../assets/icons/LostCard";
import TransactionIcon from "../../assets/icons/Transaction";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import Box from "../../components/Box";
// import ZazooVirtualCard from "../../assets/images/zazoo-virtual-card.png";
import {
  getCardTransactions,
  getCards,
  sendSmsShowCardVerification,
  setCardAsFrozen,
  showCardDetails,
  showCardPinNumber,
  terminateCard,
  orderCard,
  enrollforCardScheme,
  setPrimaryCardID,
} from "../../redux/card/cardSlice";
import { getTodaysDate } from "../../utils/dates";
import {
  getUserActiveCards,
  getCurrency,
  /* convertImageToBase64, */
  getPendingAmount,
} from "../../utils/helpers";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { CardView } from "../../components/Card/CardView";
import { GetCardModal } from "./GetCardModal";
import { RootState } from "../../store";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import { delayCode } from "../../utils/delay";
import Carousel from "react-native-snap-carousel";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { ICardDetails } from "../../models/interface";
/* import * as FileSystem from "expo-file-system";
import { getTransactionsWithFilters } from "../../redux/transaction/transactionSlice"; */
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import ArrowDown from "../../assets/icons/ArrowDown";
import { useDebounce } from "usehooks-ts";
// import { TRANSACTIONS_STATUS } from "../../utils/constants";
// import LoadingScreen from "../../components/Loader/LoadingScreen";
// import ArrowRight from "../../assets/icons/ArrowRight";
import { CardTransaction } from "../../models/Transactions";
/* import moment from "moment"; */
import TransactionItem from "../../components/TransactionItem";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { arrayChecker } from "../../utils/helpers";
import TerminatingCardModal from "./TerminatingCardModal";

/* import { Circle } from "react-native-svg"; */
const DEFAULT_CARD_ENROLLMENT_STATUS = {
  title: "",
  text: "",
  isError: false,
};

export function Card({ navigation }: any) {
  const dispatch = useDispatch();
  const accountDetails = useSelector((state: RootState) => state.account?.details);
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const userID = userData?.id;
  const profile = useSelector((state: any) => state.profile?.profile);
  const userEmail = profile?.data.email;
  const [cardPin, setCardPin] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState(30);
  const cardData = useSelector((state: RootState) => state?.card?.data);
  // console.log("cardData", cardData);
  const isCardHaveVirtual = arrayChecker(cardData) ? cardData?.some((card) => card.type === "V") : false;
  const cardsActiveList = getUserActiveCards(cardData);

  const [isTerminatedCardShown, setIsTerminatedCardShown] = useState<boolean>(false);
  const [terminatedCardModal, setTerminatedCardModal] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<ICardDetails>({});
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [showCardOtpModal, setShowCardOtpModal] = useState(false);
  const [showGetCardModal, setShowGetCardModal] = useState(false);
  const [showCardOtpLoading, setShowCardOtpLoading] = useState(false);
  const [storedIntervalId, setStoredIntervalId] = useState<any>(null);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const debounceSortByDate = useDebounce<boolean>(sortByDate, 300);
  const [cardTransactionsData, setCardTransactionsData] = useState<
    CardTransaction[]
  >([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const debounceSnapCards = useDebounce<boolean>(selectedCard, 1000);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isEnrollmentSuccess, setEnrollmentStatus] = useState<boolean>(false);
  const [isFetchingCardTransactions, setFetchingCardTransactions] =
    useState<boolean>(true);
  const [isFetchingCardInfo, setFetchingCardInfo] = useState<boolean>(true);
  const [isEnrollingCard, setEnrollingCard] = useState<boolean>(false);
  const [enrollmentCardStatus, setEnrollmentCardStatus] = useState<{
    title: string;
    text: string;
    isError: boolean;
  }>(DEFAULT_CARD_ENROLLMENT_STATUS);
  const shownCardsOnCarousel = isTerminatedCardShown ? cardsActiveList ? [...cardsActiveList, ...cardData] : [] : cardsActiveList ? cardsActiveList : [];

  const handleSetSelectedCard = (card: any) => {
    setSelectedCard(card);
  };

  const handleGetCards = async () => {
    try {
      await dispatch(getCards() as any);
      const getCardReq = await dispatch<any>(getCards()).unwrap();
      if ((getCardReq && Object.keys(getCardReq).length > 0) || !getCardReq) {
        setFetchingCardInfo(false);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  // TODO: Optimization task - remove dot then and use redux state instead
  const handleGetCardsTransactions = async (_cardDetails?: any) => {
    try {
      console.log("fetchCardData", _cardDetails);
      if (userID && (_cardDetails || selectedCard)) {
        await dispatch<any>(
          getCardTransactions({
            account_id: userID,
            from_date: "2022-06-02",
            to_date: getTodaysDate(),
            type: "ALL",
            card_id: _cardDetails ? _cardDetails.cardreferenceId : selectedCard?.cardreferenceId,
          })
        )
        .unwrap()
        .then((res: any) => {
          //added this modificaton because Response has changed
          // setCardTransactionsData(res.data);
          if (res && arrayChecker(res)) {
            setCardTransactionsData(res);
            setFetchingCardTransactions(false);
          } else {
            //clear old data
            setCardTransactionsData([]);
            setFetchingCardTransactions(false);
          }
        });
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setFetchingCardTransactions(false);
      setFetchingCardInfo(false);
      setIsloading(prev => prev = false);
    }
  };

  const freezeCard = async (isCardToFreeze: boolean) => {
    try {
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
      setIsloading(false);
      setFreezeLoading(false);
      await dispatch<any>(getCards());
    }
  };

  const resetCard = () => {
    setCardPin("");
    setCardDetails({});
    setRemainingTime(30);
    clearInterval(storedIntervalId);
  };

  const requestShowCard = async () => {
    const payload = await dispatch(
      sendSmsShowCardVerification({
        type: "trusted",
      }) as any
    ).unwrap();
    if (payload?.status !== "success") return;
    setShowCardOtpModal(true);
  };

  const handlePinCode = async ({ code }: { code: string }) => {
    if (isEnrollingCard) {
      setIsloading(true);
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
          setIsloading(false);
          setEnrollingCard(false);
          setShowCardOtpModal(false);
        });

      setIsloading(false);
      console.log(
        "🚀 ~ file: Card.tsx:270 ~ handlePinCode ~ payloadOrderCard:",
        payloadOrderCard
      );
      if (payloadOrderCard?.status && payloadOrderCard?.status === "success") {
        const enrollCardPayload = await dispatch(
          enrollforCardScheme({ account_id: userID }) as any
        )
          .unwrap()
          .catch((error: any) => {
            console.log(
              "🚀 ~ file: Card.tsx:288 ~ handlePinCode ~ error:",
              error
            );
          });
        if (
          enrollCardPayload?.data?.status &&
          enrollCardPayload?.data?.status === "success"
        ) {
          setEnrollmentStatus(true);
          setEnrollmentCardStatus({
            title: "Card Enrollment",
            text: `${enrollCardPayload?.data?.code}: ${enrollCardPayload?.data?.message}`,
            isError: false,
          });
          setIsloading(false);
          setShowCardOtpModal(false);
        } else {
          setIsloading(false);
          setEnrollingCard(false);
          setEnrollmentStatus(true);
          setEnrollmentCardStatus({
            title: "Card Enrollment",
            text: `${enrollCardPayload?.data?.code}: ${enrollCardPayload?.data?.message}`,
            isError: true,
          });
          setShowCardOtpModal(false);
        }
        //dispatch(getCards() as any);
      } else {
        setIsloading(false);
        setEnrollingCard(false);
        setShowCardOtpModal(false);
        setEnrollmentStatus(true);
        setEnrollmentCardStatus({
          title: "Card Enrollment",
          text: `${payloadOrderCard?.code}: Error while ordering card`,
          isError: true,
        });
      }
    } else {
      let intervalId: any;
      setShowCardOtpLoading(true);
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
        clearInterval(storedIntervalId);
        setCardDetails({
          cardreferenceId: cardData[0]?.cardreferenceId,
          card: cardData[0],
          cardImage: payload.cardImageBase64,
          //Added by Aristos
          // cardImage:image,
          cardNumber: payload?.cardNumber,
        });
        let remainingTimer = 30;
        intervalId = setInterval(() => {
          setStoredIntervalId(intervalId);
          if (remainingTimer <= 0) return resetCard();
          setRemainingTime(remainingTimer);
          remainingTimer--;
        }, 1000);
      }
      setShowCardOtpLoading(false);
      setShowCardOtpModal(false);
      await delayCode(100);
    }
  };

  const enrollCard = async () => {
    try {
      await dispatch(sendSmsShowCardVerification({
        type: "trusted",
      }) as any);
      setEnrollingCard(true);
      setShowCardOtpModal(true);
    } catch (error: any) {
      console.log("Something went wrong with otp: ", error);
      setEnrollmentCardStatus({
        title: "Card Enrollment",
        text: `${error?.code}: ${error?.message}`,
        isError: true,
      });
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    /* only trigger card enrollment if ff conditions are met 
    -account_id(accountData?.id) is ready
    -!isFetchingCardTransactions, after fetching card transactions if theres any
    -!isFetchingCardInfo, after fetching card info if theres any
    -if cardData is empty, meaning no card information is found
    */
    if (!isFetchingCardTransactions && !isFetchingCardInfo) {
      if (!arrayChecker(cardData) && userID) {
        console.log("enrolling card");
        enrollCard();
      }
    }
  }, [
    isCardHaveVirtual,
    userID,
    isFetchingCardTransactions,
    isFetchingCardInfo,
  ]);

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
    console.log("terminating card");
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
        console.log("card terminated");
      } catch (error) {
        console.log({ error });
        Alert.alert("Error", "Something went wrong");
        console.log("card terminated error");
      } finally {
        setIsloading(false);
        handleGetCardsTransactions();
        setTerminatedCardModal(false);
      }
    }
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(cardDetails?.cardNumber || "");
  };

  const sortCardTransactionsByDate = (sortState: boolean) => {
    const sortedTransactions = [...cardTransactionsData].sort(
      (a: CardTransaction, b: CardTransaction) => {
        const dateA = new Date(a.receiptDate);
        const dateB = new Date(b.receiptDate);
        return sortState
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    );
    setCardTransactionsData(sortedTransactions);
    setIsloading(false);
  };

  useEffect(() => {
    handleGetCards();
  }, []);

  useEffect(() => {
    (() => {
      if (!selectedCard && cardsActiveList.length > 0) {
        setPrimaryCardID(cardsActiveList[0]?.cardreferenceId);
        setSelectedCard(shownCardsOnCarousel[0]);
        handleGetCardsTransactions(shownCardsOnCarousel[0]);
      }
      setSelectedCard(shownCardsOnCarousel[0]);
    })();
  }, [cardData]);

  useEffect(() => {
    sortCardTransactionsByDate(debounceSortByDate);
  }, [debounceSortByDate]);

  return (
    <MainLayout navigation={navigation}>
      {showGetCardModal && (
        <GetCardModal
          onClose={() => setShowGetCardModal(false)}
          hasPhysicalCard={false}
          hasVirtualCard={false}
          onGetVirtualCard={() => {
            setShowGetCardModal(false);
            setIsloading(true);
            enrollCard();
            }
          }
        />
      )}
      {!!showCardOtpModal && (
        <CodeModal
          confirmButtonText={isEnrollingCard ? "Submit" : "Show Card"}
          title={isEnrollingCard ? "Card Enrollment" : "Show Card"}
          subtitle="Since your account doesnt have any card. You will receive an sms to your mobile device. Please enter this code below."
          isOpen
          loading={showCardOtpLoading}
          onSubmit={handlePinCode}
          onCancel={() => {
            setShowCardOtpModal(false);
            setIsloading(false);
          }}
        />
      )}
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
      <View style={{ flex: 1 }}>
        <ScrollView
          bounces={true}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleGetCardsTransactions} />
          }
        >
          <Pressable>
            <View style={styles.container}>
              <Heading
                icon={<CardIcon size={18} color="pink" />}
                title={"Card"}
                rightAction={
                  <Button
                    onPress={() => {
                      console.log("get card");
                      setShowGetCardModal(true);
                    }}
                    color={"light-pink"}
                    rightIcon={<AddIcon color="pink" size={14} />}
                    disabled={isCardHaveVirtual}
                  >
                    Get Card
                  </Button>
                }
              />
            </View>
          </Pressable>
          { !!isCardHaveVirtual && 
            <View style={styles.cardSection}>
                <View style={styles.cardImages}>
                  <Carousel
                    data={shownCardsOnCarousel}
                    renderItem={_renderItem}
                    refreshing={isLoading}
                    sliderWidth={500}
                    itemWidth={303}
                    layout="default"
                    lockScrollWhileSnapping={false}
                    // swipeThreshold={10}
                    onSnapToItem={(index) => {
                      handleGetCardsTransactions(shownCardsOnCarousel[index]);
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
              <View style={styles.incomeBox}>
                <Pressable>
                  <View style={styles.incomeBox__group}>
                    <Typography
                      fontFamily="Nunito-SemiBold"
                      color="accent-blue"
                      style={styles.imcome__groupTypography} 
                    >
                      Total Balance:
                    </Typography>
                    <Box sx={{ marginLeft: "auto", marginBottom: 16 }}>
                      <Typography fontFamily="Mukta-Regular">
                        {getCurrency(accountDetails?.currency)}
                        {accountDetails?.curbal || "0.00"}
                      </Typography>
                    </Box>
                  </View>
                </Pressable>
                <Pressable>
                  <View style={styles.incomeBox__group}>
                    <Typography
                      fontFamily="Nunito-SemiBold"
                      color="accent-blue"
                      style={styles.imcome__groupTypography}
                    >
                      Pending:
                    </Typography>
                    <Box sx={{ marginLeft: "auto", marginBottom: 16 }}>
                      <Typography fontFamily="Mukta-Regular">
                        {getCurrency(accountDetails?.currency)}
                        {getPendingAmount(
                          accountDetails?.avlbal || "0.00",
                          accountDetails?.curbal || "0.00"
                        ) || "0.00"}
                      </Typography>
                    </Box>
                  </View>
                </Pressable>
              </View>
              <View style={styles.cardActions}>
                <ScrollView horizontal>
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
                          setIsloading(true);
                          freezeCard(selectedCard?.frozenYN === "Y" ? false : true);
                        }}
                        disabled={freezeLoading}
                      >
                        {selectedCard?.frozenYN === "Y" ? "Unfreeze Card" : "Freeze Card"}
                      </Button>
                    </Pressable>
                  </View>
                  {/* <View style={styles.cardActionsButtonMargin}> -- https://paymentworld.atlassian.net/browse/ZAZ-532 --
                    <Pressable>
                      <Button
                        color={cardPin ? "blue" : "light-blue"}
                        leftIcon={
                          <PinIcon color={cardPin ? "white" : "blue"} size={14} />
                        }
                        onPress={!cardPin ? showPin : resetCard}
                        disabled={loading}
                      >
                        Show pin
                      </Button>
                    </Pressable>
                  </View> */}
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
                        color="light-pink"
                        rightIcon={<LostCardIcon color="pink" size={14} />}
                        onPress={() => {
                          setTerminatedCardModal(!terminatedCardModal);
                        }}
                        disabled={selectedCard?.lostYN === "Y" || !selectedCard?.lostYN}
                      >
                        Lost Card
                      </Button>
                    </Pressable>
                  </View>
                  <View style={styles.cardActionsButtonMargin}>
                    <Pressable>
                      <Button
                        color="light-pink"
                        rightIcon={<LostCardIcon color="pink" size={14} />}
                        onPress={() => {
                          setIsTerminatedCardShown(!isTerminatedCardShown);
                          handleSetSelectedCard(!isTerminatedCardShown ? cardData[0] : cardsActiveList[0]);
                        }}
                      >
                        {!isTerminatedCardShown ? "Show All Cards" : "Hide Lost Cards"}
                      </Button>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </View>
          }
          <View style={styles.cardTransactions}>
            <View>
              <Heading
                icon={<TransactionIcon color="pink" size={18} />}
                title={"Latest Transactions"}
                rightAction={
                  <Button
                    onPress={handleGetCardsTransactions}
                    color={"light-blue"}
                    leftIcon={
                      <Ionicons name="refresh" size={24} color="black" />
                    }
                  >
                    Refresh
                  </Button>
                }
              />
            </View>
            <View>
              <Seperator backgroundColor={vars["grey"]} />
              {/* start: Added by Aritos  */}
              <View>
                {!!cardTransactionsData?.length ? (
                  <>
                    <View style={styles.listHeadCardTransactions}>
                      <Typography fontFamily="Nunito-SemiBold" fontSize={16}>
                        Name
                      </Typography>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: 60,
                        }}
                      >
                        <Typography
                          fontFamily="Nunito-SemiBold"
                          color="accent-blue"
                          fontSize={16}
                        >
                          Date
                        </Typography>
                        <TouchableOpacity
                          // temp disabled sorting logic
                          onPress={() => {
                            setIsloading(!isLoading);
                            setSortByDate(!sortByDate);
                          }}
                        >
                          {sortByDate ? (
                            <ArrowDown color="blue" style={{ marginTop: 5 }} />
                          ) : (
                            <AntDesign
                              name="up"
                              size={16}
                              color="blue"
                              style={{ marginTop: 5 }}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                      <Typography fontFamily="Nunito-SemiBold" fontSize={16}>
                        Amount
                      </Typography>
                    </View>
                    <View style={{ backgroundColor: "white" }}>
                      {cardTransactionsData?.map((transaction, index) => (
                        <View key={index} style={styles.listCardTransactions}>
                          <TransactionItem
                            data={{
                              ...transaction,
                              id: Number(transaction.id),
                              amount: transaction.amount.toString(),
                              name: transaction.purpose,
                              // balance: "0.00",
                              // closing_balance: "",
                              // running_balance: "",
                              // opening_balance: "",
                              currency: transaction.transactionCurrency,
                              description: transaction.purposeDetailed,
                              reference_no:
                                transaction.processingAllMessagesId.toString(),
                              transaction_datetime: transaction?.receiptDate,
                              isCardTx: true,
                            }}
                            key={index}
                          />
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <View style={{ backgroundColor: "#fff", padding: 24 }}>
                    <Typography
                      fontFamily="Nunito-Regular"
                      fontSize={16}
                      style={{
                        textAlign: "center",
                        marginTop: 20,
                        backgroundColor: "#fff",
                      }}
                    >
                      You don't have any transactions yet, why not add some
                      money to your account to get started!
                    </Typography>
                  </View>
                )}
              </View>
              {/* {isEnrollmentSuccess && (
                <SuccessModal
                  title={"Card enrollment"}
                  text={"Card Registered"}
                  isOpen
                  onClose={() => {
                    setIsloading(false);
                    setEnrollmentStatus(false);
                  }}
                />
              )} */}
              {isEnrollmentSuccess && (
                <SuccessModal
                  isError={enrollmentCardStatus.isError}
                  title={enrollmentCardStatus.title}
                  text={enrollmentCardStatus.text}
                  isOpen
                  onClose={() => {
                    setIsloading(false);
                    setEnrollmentStatus(false);
                    setEnrollmentCardStatus(DEFAULT_CARD_ENROLLMENT_STATUS);
                  }}
                />
              )}
            </View>
          </View>
          <Spinner visible={isLoading} />
        </ScrollView>
      </View>
    </MainLayout>
  );
}
