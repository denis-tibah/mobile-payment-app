import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import { View, ScrollView, TouchableOpacity } from "react-native";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import { styles } from "./styles";
import TransactionItem from "../../components/TransactionItem";
import Typography from "../../components/Typography";
import CardIcon from "../../assets/icons/Card";
import AddIcon from "../../assets/icons/Add";
import FreezeIcon from "../../assets/icons/Freeze";
import PinIcon from "../../assets/icons/Pin";
import EyeIcon from "../../assets/icons/Eye";
import LostCardIcon from "../../assets/icons/LostCard";
import TransactionIcon from "../../assets/icons/Transaction";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import Box from "../../components/Box";
import {
  getCardTransactions,
  getCards,
  sendSmsShowCardVerification,
  setCardAsFrozen,
  showCardDetails,
  showCardPinNumber,
  terminateCard,
} from "../../redux/card/cardSlice";
import { getTodaysDate } from "../../utils/dates";
import { getCurrency } from "../../utils/helpers";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { CardView } from "../../components/Card/CardView";
import { GetCardModal } from "./GetCardModal";
import { RootState } from "../../store";
import { CodeModal } from "../../components/CodeModal/CodeModal";
import { delayCode } from "../../utils/delay";
import Carousel from "react-native-snap-carousel";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { ICardDetails } from "../../models/interface";

export function Card({ navigation }: any) {
  const infoData = useSelector((state: RootState) => state.account.details);
  const accountData = useSelector((state: RootState) => state.auth.userData);

  const transactions = useSelector(
    (state: RootState) => state.card.transactions
  );
  const [cardPin, setCardPin] = useState("");
  const [remainingTime, setRemainingTime] = useState(30);
  const loadingState = useSelector((state: RootState) => state?.card.loading);
  const cardData = useSelector((state: RootState) => state.card?.data);
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const frozen = useSelector(
    (state: RootState) => state?.card?.data[0]?.frozenYN
  );
  const [cardDetails, setCardDetails] = useState<ICardDetails>({});
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [showCardOtpModal, setShowCardOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGetCardModal, setShowGetCardModal] = useState(false);
  const [showCardOtpLoading, setShowCardOtpLoading] = useState(false);
  const [storedIntervalId, setStoredIntervalId] = useState<any>(null);

  const dispatch = useDispatch();
  const fetchCardData = async () => {
    try {
      await dispatch<any>(getCards());
      await dispatch<any>(
        getCardTransactions({
          account_id: userData?.id,
          from_date: "2022-06-02",
          to_date: getTodaysDate(),
          type: "PREAUTH",
        })
      );
      if (userData) await dispatch<any>(getAccountDetails(userData.id));
    } catch (error) {
      console.log({ error });
    }
  };

  const freezeCard = async () => {
    setFreezeLoading(true);
    await dispatch<any>(
      setCardAsFrozen({
        freezeYN: "Y",
        account_id: userData?.id,
      })
    );
    setFreezeLoading(false);
  };

  const unFreezeCard = async () => {
    setFreezeLoading(true);
    await dispatch<any>(
      setCardAsFrozen({
        freezeYN: "N",
        account_id: userData?.id,
      })
    );
    setFreezeLoading(false);
  };

  const showPin = async () => {
    let intervalId: any;
    if (!!cardPin) {
      clearInterval(intervalId); // Clear the interval if the pin is already visible
      return setCardPin("");
    }

    setLoading(true);
    const cardPinFetched = await dispatch(
      showCardPinNumber({
        account_id: userData?.id,
        show: true,
      }) as any
    );
    setLoading(false);
    setCardPin(cardPinFetched?.payload?.data?.pin || "");
    setCardDetails({});
    setRemainingTime(30);
    clearInterval(storedIntervalId);
    let remainingTimer = 30;
    intervalId = setInterval(() => {
      setStoredIntervalId(intervalId);
      if (remainingTimer <= 0) {
        setCardPin("");
        setRemainingTime(30);
        clearInterval(intervalId);
        return resetCard;
      }
      setRemainingTime(remainingTimer);
      remainingTimer--;
    }, 1000);
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

  const handleShowCard = async ({ code }: { code: string }) => {
    let intervalId: any;
    // console.log("*******accountData ***********", accountData?.id);
    setShowCardOtpLoading(true);
    const payload = await dispatch(
      showCardDetails({
        // account_id: infoData?.info?.id,
         account_id: accountData?.id,
        otp: code,
      }) as any
    ).unwrap();
    setLoading(false);
    if (payload) {
      setCardPin("");
      setRemainingTime(30);
      clearInterval(storedIntervalId);
      setCardDetails({
        cardreferenceId: cardData[0]?.cardreferenceId,
        card: cardData[0],
        cardImage: payload.cardImageBase64,
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
  };

  useEffect(() => {
    if (!!userData?.id) fetchCardData();
  }, [userData?.id]);

  const _renderItem = ({ item, index }: any) => {
    return (
      <CardView
        resetHandler={() => setCardDetails({})}
        cardDetails={cardDetails}
        freezeLoading={freezeLoading}
        unFreezeCard={unFreezeCard}
        key={index}
        card={item}
        pin={cardPin}
        timer={remainingTime}
      />
    );
  };

  const handleLostCard = async () => {
    if (userData?.id)
      await dispatch<any>(terminateCard({ account_id: userData?.id }) as any);
    fetchCardData();
  };

  const resetCard = () => {
    setCardPin("");
    setCardDetails({});
    setRemainingTime(30);
    clearInterval(storedIntervalId);
  };

  const handleCopyToClipboard = async () => {
    await Clipboard.setStringAsync(cardDetails?.cardNumber || "");
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={loadingState} />
      {showGetCardModal && (
        <GetCardModal
          onClose={() => setShowGetCardModal(false)}
          hasPhysicalCard={false}
          hasVirtualCard={false}
        />
      )}
      {!!showCardOtpModal && (
        <CodeModal
          confirmButtonText="Show Card"
          title="Show Card"
          subtitle="You will receive an sms to your mobile device. Please enter this code below."
          isOpen
          loading={showCardOtpLoading}
          onSubmit={handleShowCard}
          onCancel={() => setShowCardOtpModal(false)}
        />
      )}
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<CardIcon size={18} color="pink" />}
            title={"Card"}
            rightAction={
              <Button
                onPress={() => setShowGetCardModal(true)}
                color={"light-pink"}
                rightIcon={<AddIcon color="pink" size={14} />}
              >
                Get Card
              </Button>
            }
          />
        </View>
        <View style={styles.cardSection}>
          <View style={styles.cardImages}>
            <Carousel
              data={cardData}
              renderItem={_renderItem}
              sliderWidth={500}
              itemWidth={303}
              layout="default"
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
                  {getCurrency(infoData?.currency)}
                  {infoData?.curbal || "0.00"}
                </Typography>
              </Box>
            </View>
          </View>
          <View style={styles.cardActions}>
            <ScrollView horizontal>
              <View style={styles.cardActionsButtonMargin}>
                <Button
                  color={frozen === "Y" ? "blue" : "light-blue"}
                  leftIcon={
                    <FreezeIcon
                      color={frozen === "Y" ? "white" : "blue"}
                      size={14}
                    />
                  }
                  onPress={freezeCard}
                  disabled={freezeLoading}
                >
                  Freeze card
                </Button>
              </View>
              <View style={styles.cardActionsButtonMargin}>
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
              </View>
              <View style={styles.cardActionsButtonMargin}>
                <Button
                  color="light-blue"
                  onPress={requestShowCard}
                  leftIcon={<EyeIcon color="blue" size={14} />}
                >
                  Show card
                </Button>
              </View>
              <View style={styles.cardActionsButtonMargin}>
                <Button
                  color="light-pink"
                  rightIcon={<LostCardIcon color="pink" size={14} />}
                  onPress={handleLostCard}
                >
                  Lost card
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={styles.cardTransactions}>
          <Heading
            icon={<TransactionIcon color="pink" size={18} />}
            title={"Latest Transactions"}
          />
          <View>
            <View style={styles.listHead}>
              <Typography fontFamily="Nunito-SemiBold">Name</Typography>
              <Typography fontFamily="Nunito-SemiBold" color="accent-blue">
                Date
              </Typography>
              <Typography fontFamily="Nunito-SemiBold">Amount</Typography>
              <Typography></Typography>
            </View>
            <View style={{ height: "70%" }}>
              <View>
                {transactions?.map((transaction, index) => (
                  <TransactionItem
                    data={{
                      ...transaction,
                      id: Number(transaction.id),
                      amount: transaction.amount.toString(),
                      name: transaction.purpose,
                      balance: "0.00",
                      bic: "",
                      closing_balance: "",
                      running_balance: "",
                      currency: transaction.transactionCurrency,
                      description: "",
                      iban: "",
                      opening_balance: "",
                      reference_no: "",
                      service: "",
                      status: "",
                      transaction_datetime: "",
                      transaction_id: 0,
                      transaction_uuid: "",
                    }}
                    key={index}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
