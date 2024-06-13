import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import Carousel from "react-native-snap-carousel";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { RSA } from "react-native-rsa-native";
import RNSecureStorage from "rn-secure-storage";

import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import CardIcon from "../../assets/icons/Card";
import FreezeIcon from "../../assets/icons/Freeze";
import EyeIcon from "../../assets/icons/Eye";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import {
  getCards,
  setCardAsFrozen,
  setIsCardTransactionShown,
  terminateCard,
} from "../../redux/card/cardSlice";
import {
  getUserActiveCards,
  screenNames,
  stripPemFormatting,
} from "../../utils/helpers";
import { CardView } from "../../components/Card/CardView";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import TerminatingCardModal from "./TerminatingCardModal";
import { Divider } from "react-native-paper";
import ArrowRight from "../../assets/icons/ArrowRight";
import { ArrowSwitch } from "../../assets/icons/ArrowSwitch";
import { PinNumberCode } from "../../assets/icons/PinNumber";
import { BugIcon } from "../../assets/icons/BugIcon";
import ManagePaymentMethod from "./Components/ManagePayment";
import { NewPinCodeInputBoxes } from "../../components/FormGroup/FormGroup";
import {
  useLazySendSmsLostCardVerificationQuery,
  useLazyShowCardDetailsV2Query,
  useLazySendSmsShowPinVerificationQuery,
} from "../../redux/card/cardSliceV2";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { styles } from "./styles";
import useDigitalSignature from "../../hooks/useDigitalSignature";
import useSecureStoreCreateDelete from "../../hooks/useSecureStoreCreateDelete";
import useTimer from "../../hooks/useTimer";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { arrayChecker } from "../../utils/helper";
import { stopCoverage } from "v8";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export function Card({ navigation, route }: any) {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const refRBSheetShowTerminatedCards = useRef();
  const refRBSTerminateThisCard = useRef();
  const refRBSShowCard = useRef();
  const refCarousel = useRef(null);
  const userData = useSelector((state: RootState) => state.auth?.userData);
  const userID = userData?.id;

  const { decryptRsa, convertPublicKeyPKCS1ToPKCS8 } = useDigitalSignature();
  const { startTimer, isTimesUp, stopTimer, remainingTimeCountDown } =
    useTimer();

  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const cardData = useSelector((state: RootState) => state?.card?.data);
  const cardsActiveList = getUserActiveCards(cardData);

  const [cardPin, setCardPin] = useState<string>("");
  const [isTerminatedCardShown, setIsTerminatedCardShown] =
    useState<boolean>(false);
  const [terminatedCardModal, setTerminatedCardModal] =
    useState<boolean>(false);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectedCardTerminated, setIsSelectedCardTerminated] =
    useState<boolean>(false);
  const [listOfCheckedOptions, setListOfCheckedOptions] = useState<string[]>(
    []
  );
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  /* console.log("🚀 ~ Card ~ resendOTP:", resendOTP); */
  const [signatureRSA, setSignatureRSA] = useState<{
    privateKey: string;
    publicKey: string;
    publicKeyWithoutPadding: string;
    encodedMessage?: string;
  }>({
    privateKey: "",
    publicKey: "",
    publicKeyWithoutPadding: "",
    encodedMessage: "",
  });
  console.log("🚀 ~ Card ~ signatureRSA:", signatureRSA);
  /* console.log("🚀 ~ Card ~ signatureRSA:", signatureRSA?.privateKey);
  console.log("🚀 ~ Card ~ signatureRSA:", signatureRSA?.publicKey);
  console.log(
    "🚀 ~ Card ~ signatureRSA:public ",
    signatureRSA?.publicKeyWithoutPadding
  ); */

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  const [cardDetailsDecrypted, setCardDetailsDecrypted] = useState<{
    cardNumber: string;
    cvc: string;
    pin: string;
  }>({ cardNumber: "", cvc: "", pin: "" });
  console.log("🚀 ~ Card ~ cardDetailsDecrypted:", cardDetailsDecrypted);
  const [encryptedCardDetails, setEncryptedCardDetails] = useState<{
    isLoadingEncryptedCardDetails: boolean;
    isSuccessEncryptedCardDetails: boolean;
    encryptedCardDetailsData: any;
    isErrorEncryptedCardDetails: boolean;
    encryptedCardDetailsError: any;
  }>({
    isLoadingEncryptedCardDetails: false,
    isSuccessEncryptedCardDetails: false,
    encryptedCardDetailsData: {},
    isErrorEncryptedCardDetails: false,
    encryptedCardDetailsError: {},
  });

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  const resetEncryptedCardDetailsData = () => {
    setEncryptedCardDetails({
      isLoadingEncryptedCardDetails: false,
      isSuccessEncryptedCardDetails: false,
      encryptedCardDetailsData: {},
      isErrorEncryptedCardDetails: false,
      encryptedCardDetailsError: {},
    });
  };

  const [showCardDetailsV2] = useLazyShowCardDetailsV2Query();

  const [terminatedThisCard] = useLazySendSmsLostCardVerificationQuery();
  const shownCardsOnCarousel = isTerminatedCardShown
    ? cardsActiveList
      ? [...cardsActiveList, ...cardData]
      : []
    : cardsActiveList
    ? cardsActiveList
    : [];

  const [getOTP] = useLazySendSmsShowPinVerificationQuery();

  const generateKeys = async () => {
    //4096 Is the key size
    let keyPair = await RSA.generateKeys(2048);
    /* setSignatureRSA({
      privateKey: keyPair?.private,
      publicKey:
        keyPair?.public && Platform.OS === "android"
          ? convertPublicKeyPKCS1ToPKCS8(keyPair?.public)
          : keyPair?.public,
      publicKeyWithoutPadding: keyPair?.public
        ? stripPemFormatting(
            Platform.OS === "android"
              ? convertPublicKeyPKCS1ToPKCS8(keyPair?.public)
              : keyPair?.public
          )
        : "",
    }); */
  };

  // to show decrypted card details is success
  useEffect(() => {
    const decrypt = async () => {
      const { isLoadingEncryptedCardDetails, isSuccessEncryptedCardDetails } =
        encryptedCardDetails;
      let cardNumber: any;
      let cvc: string;
      let pin: string;

      if (!isLoadingEncryptedCardDetails && isSuccessEncryptedCardDetails) {
        //set timer for decrypted card info deletion
        //startTimer("decrypted_card_info_local_state", 30000);
        if (signatureRSA?.privateKey) {
          if (
            encryptedCardDetails?.encryptedCardDetailsData?.cardNumberEncrypted
          ) {
            cardNumber = await decryptRsa({
              encryptedData:
                encryptedCardDetails?.encryptedCardDetailsData
                  ?.cardNumberEncrypted,
              privateKeyPem: signatureRSA?.privateKey,
            });
            if (cardNumber) {
              setCardDetailsDecrypted((prevState) => ({
                ...prevState,
                cardNumber,
              }));
            }
          }

          if (encryptedCardDetails?.encryptedCardDetailsData?.cvc2Encrypted) {
            cvc = await decryptRsa({
              encryptedData:
                encryptedCardDetails?.encryptedCardDetailsData?.cvc2Encrypted,
              privateKeyPem: signatureRSA?.privateKey,
            });
            if (cvc) {
              setCardDetailsDecrypted((prevState) => ({
                ...prevState,
                cvc,
              }));
            }
          }

          if (encryptedCardDetails?.encryptedCardDetailsData?.pinEncrypted) {
            pin = await decryptRsa({
              encryptedData:
                encryptedCardDetails?.encryptedCardDetailsData?.pinEncrypted,
              privateKeyPem: signatureRSA?.privateKey,
            });
            if (pin) {
              setCardDetailsDecrypted((prevState) => ({
                ...prevState,
                pin,
              }));
            }
          }
        }
      }

      setTimeout(() => {
        resetEncryptedCardDetailsData();
      }, 7000);
    };
    decrypt();
  }, [
    encryptedCardDetails?.isLoadingEncryptedCardDetails,
    encryptedCardDetails?.isSuccessEncryptedCardDetails,
    encryptedCardDetails,
    signatureRSA?.privateKey,
  ]);

  useEffect(() => {
    if (
      cardDetailsDecrypted?.cardNumber &&
      cardDetailsDecrypted?.cvc &&
      cardDetailsDecrypted?.pin
    ) {
      //set timer for decrypted card info deletion
      startTimer("decrypted_card_info_local_state", 30000);
    }
  }, [cardDetailsDecrypted]);

  useEffect(() => {
    const {
      isErrorEncryptedCardDetails,
      isLoadingEncryptedCardDetails,
      encryptedCardDetailsError,
    } = encryptedCardDetails;
    if (!isLoadingEncryptedCardDetails && isErrorEncryptedCardDetails) {
      const errorMessage =
        arrayChecker(encryptedCardDetailsError?.data?.errors) &&
        encryptedCardDetailsError?.data?.errors.length > 0
          ? encryptedCardDetailsError?.data?.errors[0]
          : "Something went wrong";
      setStatusMessage({
        header: `${encryptedCardDetailsError?.data?.code || ""}${
          encryptedCardDetailsError?.data?.code ? ":" : ""
        }Error`,
        body: `${errorMessage}`,
        isOpen: true,
        isError: true,
      });
    }
  }, [
    encryptedCardDetails?.isLoadingEncryptedCardDetails,
    encryptedCardDetails?.isErrorEncryptedCardDetails,
    encryptedCardDetails?.encryptedCardDetailsError,
  ]);

  const getTimer = (timer: any) => {
    if (!timer) return 0;
    return Number(timer) / 1000;
  };

  useEffect(() => {
    if (
      isTimesUp?.decrypted_card_info_local_state &&
      getTimer(remainingTimeCountDown?.decrypted_card_info_local_state) === 0
    ) {
      stopTimer("decrypted_card_info_local_state");
      setCardDetailsDecrypted({
        cardNumber: "",
        cvc: "",
        pin: "",
      });
    }
  }, [
    isTimesUp?.decrypted_card_info_local_state,
    getTimer(remainingTimeCountDown?.decrypted_card_info_local_state),
  ]);

  useEffect(() => {
    if (
      isTimesUp?.resend_otp &&
      getTimer(remainingTimeCountDown?.resend_otp) === 0
    ) {
      stopTimer("resend_otp");
      setResendOTP(false);
    }
  }, [isTimesUp?.resend_otp, getTimer(remainingTimeCountDown?.resend_otp)]);

  const handlePinCodeChange = (value: string) => {
    setCardPin(value);
  };

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
    if (!selectedCard) {
      setSelectedCard(cardsActiveList[0]);
    }
    const _isTerminatedCardShown = isTerminatedCardShown;
    if (_isTerminatedCardShown) {
      setIsTerminatedCardShown(false);
    }

    setIsLoading((prev) => true);
    dispatch<any>(
      setCardAsFrozen({
        freezeYN: isCardToFreeze ? "Y" : "N",
        account_id: userData?.id,
        card_id: !selectedCard
          ? cardsActiveList[0].cardreferenceId
          : selectedCard?.cardreferenceId,
      })
    )
      .unwrap()
      .then((res: any) => {
        const updatedSelectedCard = res.find(
          (card: any) => card.cardreferenceId === selectedCard?.cardreferenceId
        );
        handleGetCards();
        setTimeout(() => {
          setSelectedCard(updatedSelectedCard);
          if (_isTerminatedCardShown) {
            setIsTerminatedCardShown(true);
          }
        }, 1000);
      })
      .catch((error: any) => {
        console.log({ error });
      })
      .finally(() => {
        setIsLoading((prev) => false);
      });
  };

  const handleOnlinePayment = async () => {
    setFreezeLoading(true);
    setIsLoading((prev) => true);
    //card status === do_not_honor means frozen now, before it means pending from enrollment by aristos - arjay 1.23.2024
    if (
      selectedCard?.cardStatus === "cancelled" ||
      selectedCard?.cardStatus === "terminated"
    ) {
      Alert.alert("Card is not active", "Please activate your card first");
      setFreezeLoading(false);
      setIsLoading((prev) => false);
      return;
    } else {
      setFreezeLoading(false);
      setIsLoading((prev) => false);
    }
    freezeCard(
      selectedCard?.frozenYN === "Y" &&
        selectedCard?.cardStatus === "do_not_honor"
        ? false
        : true
    );
  };

  // TODO: target each card when doing action on each card, right now it only targets the first card
  const _renderItem = ({ item, index }: any) => {
    return (
      <Pressable key={index}>
        <CardView
          resetHandler={() => {}}
          cardDetails={{}}
          freezeLoading={freezeLoading}
          key={index}
          card={item}
          pin={cardPin}
          timer={() =>
            getTimer(remainingTimeCountDown?.decrypted_card_info_local_state)
          }
          cardDetailsDecrypted={cardDetailsDecrypted}
        />
      </Pressable>
    );
  };

  const handleLostCard = async () => {
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
    await Clipboard.setStringAsync(cardDetailsDecrypted?.cardNumber || "");
  };

  const checkIfCardIsFrozen = (card: any) => {
    if (card.frozenYN === "N" && card.cardStatus === "active") {
      // means the card is not frozen
      setListOfCheckedOptions([...listOfCheckedOptions, "online_payment"]);
    } else {
      const removeOnlinePaymentOption = listOfCheckedOptions.filter(
        (option) => option !== "online_payment"
      );
      setListOfCheckedOptions(removeOnlinePaymentOption);
    }
  };

  useEffect(() => {
    if (!selectedCard) {
      setSelectedCard(cardsActiveList[0]);
    }
  }, [shownCardsOnCarousel]);

  useEffect(() => {
    if (
      selectedCard?.cardStatus === "cancelled" &&
      selectedCard?.lostYN === "Y"
    ) {
      setIsSelectedCardTerminated(true);
    } else {
      setIsSelectedCardTerminated(false);
    }
  }, [selectedCard]);

  useEffect(() => {
    setIsLoading(true);
    handleGetCards();
    dispatch<any>(setIsCardTransactionShown(false));

    RNSecureStorage.multiGet([
      "public_key",
      "public_key_without_padding",
      "private_key",
    ])
      .then((res) => {
        console.log(res);
        setSignatureRSA({
          privateKey: res?.private_key,
          publicKey: res?.public_key,
          publicKeyWithoutPadding: res?.public_key_without_padding,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleGetOTP = async () => {
    // generateKeys();
    setIsLoading(true);
    const bodyParams = {
      type: "trusted",
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    };
    getOTP(bodyParams)
      .unwrap()
      .then((res: any) => {
        if (res?.status === "success") {
          refRBSShowCard?.current?.open();
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        setStatusMessage({
          header: `${error?.status}${error?.status ? ":" : ""}Error`,
          body: `OTP error: Please try again`,
          isOpen: true,
          isError: true,
        });
      })
      .finally(() => {
        startTimer("resend_otp", 30000);
        setIsLoading(false);
      });
  };

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <MainLayout navigation={navigation}>
      <SuccessModal
        isOpen={statusMessage.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      {terminatedCardModal && (
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
      <Spinner
        visible={
          isLoading || encryptedCardDetails?.isLoadingEncryptedCardDetails
        }
      />
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          bounces={true}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              style={{ backgroundColor: "transparent", display: "none" }}
              refreshing={false}
              onRefresh={() => {
                setIsLoading(true);
                handleGetCards();
              }}
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
                    leftIcon={
                      <MaterialCommunityIcons
                        name="credit-card-plus-outline"
                        size={14}
                        color={vars["accent-pink"]}
                      />
                    }
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
                data={shownCardsOnCarousel}
                renderItem={_renderItem}
                refreshing={isLoading}
                enableMomentum={false}
                decelerationRate={0.25}
                sliderWidth={370}
                snapToStart={isLoading}
                removeClippedSubviews={false}
                itemWidth={303}
                initialScrollIndex={0}
                inactiveSlideOpacity={0.5}
                layout="default"
                lockScrollWhileSnapping={true}
                onSnapToItem={(index) => {
                  setCardDetailsDecrypted({
                    cardNumber: "",
                    cvc: "",
                    pin: "",
                  });
                  if (isTerminatedCardShown) {
                    setSelectedCard(shownCardsOnCarousel[index]);
                  } else {
                    setSelectedCard(cardsActiveList[index]);
                  }
                }}
                onBeforeSnapToItem={(index) => {
                  setSelectedCard(shownCardsOnCarousel[index]);
                }}
              />
              {cardDetailsDecrypted?.cardNumber ? (
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
                      handleGetOTP();
                    }}
                    leftIcon={<EyeIcon color="blue" size={14} />}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={"600"}
                      marginLeft={8}
                      fontFamily={"Nunito-SemiBold"}
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
                    leftIcon={<FreezeIcon color={"blue"} size={14} />}
                    onPress={() => {
                      setFreezeLoading(true);
                      setIsLoading((prev) => true);
                      //card status === do_not_honor means frozen now, before it means pending from enrollment by aristos - arjay 1.23.2024
                      if (
                        selectedCard?.cardStatus === "cancelled" ||
                        selectedCard?.cardStatus === "terminated"
                      ) {
                        Alert.alert(
                          "Card is not active",
                          "Please activate your card first"
                        );
                        setFreezeLoading(false);
                        setIsLoading((prev) => false);
                        return;
                      } else {
                        setFreezeLoading(false);
                        setIsLoading((prev) => false);
                      }
                      freezeCard(
                        selectedCard?.frozenYN === "Y" &&
                          selectedCard?.cardStatus === "do_not_honor"
                          ? false
                          : true
                      );
                    }}
                    disabled={freezeLoading || isSelectedCardTerminated}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={"600"}
                      fontFamily={"Nunito-SemiBold"}
                    >
                      {selectedCard?.frozenYN === "Y"
                        ? "Unfreeze Card"
                        : "Freeze Card"}
                    </Typography>
                  </Button>
                </Pressable>
              </View>
            </View>
          </View>
          <Pressable>
            <Divider style={{ marginVertical: 10, paddingHorizontal: 15 }} />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity
                style={styles.cardActionItem}
                onPress={() => {
                  navigation.navigate("Transactions", {
                    isShowCardTransaction: true,
                    cardId: selectedCard?.cardreferenceId,
                  });
                }}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ paddingRight: 8, marginTop: 2 }}>
                    <ArrowSwitch color="heavy-blue" size={18} />
                  </View>
                  <Typography
                    fontSize={16}
                    fontWeight={"600"}
                    fontFamily={"Nunito-SemiBold"}
                  >
                    See Card Transactions
                  </Typography>
                </View>
                <ArrowRight
                  color="heavy-blue"
                  size={14}
                  style={{ paddingRight: 14 }}
                />
              </TouchableOpacity>
            </View>
            <Divider
              style={{
                marginVertical: 5,
                paddingHorizontal: 15,
                height: 1,
                backgroundColor: vars["shade-grey"],
                opacity: 0.2,
              }}
            />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity
                style={styles.cardActionItem}
                onPress={() => {
                  if (!selectedCard) {
                    return;
                  }
                  checkIfCardIsFrozen(selectedCard);
                  refRBSheet?.current?.open();
                }}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ paddingRight: 8, marginTop: 2 }}>
                    <MaterialCommunityIcons
                      name="cog-outline"
                      size={18}
                      color={vars["accent-blue"]}
                    />
                  </View>
                  <Typography
                    fontSize={16}
                    fontWeight={"600"}
                    fontFamily={"Nunito-SemiBold"}
                  >
                    Manage Payment Method
                  </Typography>
                </View>
                <TouchableOpacity style={{ marginTop: 7 }}>
                  <ArrowRight
                    color="heavy-blue"
                    size={14}
                    style={{ paddingRight: 14 }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Divider
              style={{
                marginVertical: 5,
                paddingHorizontal: 15,
                height: 1,
                backgroundColor: vars["shade-grey"],
                opacity: 0.2,
              }}
            />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity
                style={styles.cardActionItem}
                onPress={() => refRBSTerminateThisCard?.current?.open()}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ paddingRight: 8, marginTop: 2 }}>
                    <PinNumberCode color="heavy-blue" size={18} />
                  </View>
                  <Typography
                    fontSize={16}
                    fontWeight={"600"}
                    fontFamily={"Nunito-SemiBold"}
                  >
                    Lost Card
                  </Typography>
                </View>
                <TouchableOpacity style={{ marginTop: 7 }}>
                  <ArrowRight
                    color="heavy-blue"
                    size={14}
                    style={{ paddingRight: 14 }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Divider
              style={{
                marginVertical: 5,
                paddingHorizontal: 15,
                height: 1,
                backgroundColor: vars["shade-grey"],
                opacity: 0.2,
              }}
            />
            <View style={styles.cardActionsListContainer}>
              <TouchableOpacity
                style={styles.cardActionItem}
                onPress={() => refRBSheetShowTerminatedCards?.current?.open()}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ paddingRight: 8, marginTop: 2 }}>
                    <BugIcon size={18} color={vars["accent-blue"]} />
                  </View>
                  <Typography
                    fontSize={16}
                    fontWeight={"600"}
                    fontFamily={"Nunito-SemiBold"}
                  >
                    {isTerminatedCardShown
                      ? "Hide Terminated Cards"
                      : "Show Terminated Cards"}
                  </Typography>
                </View>
                <TouchableOpacity style={{ marginTop: 7 }}>
                  <ArrowRight
                    color="heavy-blue"
                    size={14}
                    style={{ paddingRight: 14 }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <Divider
              style={{
                marginVertical: 5,
                paddingHorizontal: 15,
                height: 1,
                backgroundColor: vars["shade-grey"],
                opacity: 0.2,
              }}
            />
          </Pressable>
        </ScrollView>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: 250,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <Typography
          fontSize={18}
          fontWeight={"600"}
          fontFamily={"Nunito-SemiBold"}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={18}
            color={vars["accent-blue"]}
          />
          Manage Payment Method
        </Typography>
        <Divider
          style={{
            marginTop: 20,
            height: 1,
            backgroundColor: vars["shade-grey"],
            opacity: 0.2,
            width: "100%",
          }}
        />
        <ManagePaymentMethod
          handleOnlinePayment={handleOnlinePayment}
          listOfCheckedOptions={listOfCheckedOptions}
          setListOfCheckedOptions={setListOfCheckedOptions}
        />
      </SwipableBottomSheet>
      <SwipableBottomSheet
        rbSheetRef={refRBSheetShowTerminatedCards}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height:
            dimensions.window.height - (Platform.OS === "android" ? 535 : 600),
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <Typography fontSize={16} fontWeight={"600"}>
          {isTerminatedCardShown
            ? "Hide Terminated Cards?"
            : "Show Terminated Cards?"}
        </Typography>
        <Divider style={{ marginVertical: 15, paddingHorizontal: 15 }} />
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
            bottom: "2%",
            marginTop: 25,
          }}
        >
          <Button
            onPress={() => {
              if (isTerminatedCardShown) {
                setIsTerminatedCardShown(false);
                setSelectedCard(cardsActiveList[0]);
              } else {
                setIsTerminatedCardShown(true);
                setSelectedCard(shownCardsOnCarousel[0]);
              }
              handleDataChangeShownOnCards();
              refRBSheetShowTerminatedCards?.current?.close();
            }}
            style={{ color: "#fff", width: 140 }}
            color="light-pink"
            fontFamily={"Nunito-SemiBold"}
            leftIcon={<EyeIcon color="pink" size={14} />}
          >
            Yes
          </Button>
          <Button
            onPress={() => {
              refRBSheetShowTerminatedCards?.current?.close();
            }}
            style={{ color: "#fff", width: 140 }}
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
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: 230,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <Typography fontSize={16} fontWeight={"600"} fontFamily={"Nunito-Bold"}>
          Terminate This Card?
        </Typography>
        <Divider
          style={{
            marginBottom: 35,
            marginTop: 10,
            height: 1,
            backgroundColor: vars["shade-grey"],
            opacity: 0.1,
            width: "100%",
          }}
        />

        <Typography fontSize={16} fontWeight={"400"} color={"#000"}>
          Are you sure you want to terminate this card?
        </Typography>
        <Divider
          style={{
            marginTop: 35,
            height: 1,
            backgroundColor: vars["shade-grey"],
            opacity: 0.1,
            width: "100%",
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Button
            onPress={() => {
              setIsLoading(true);
              terminatedThisCard({
                accountId: userID,
                cardId: selectedCard?.cardreferenceId,
              })
                .unwrap()
                .then((res: any) => {
                  if (res) {
                    setSelectedCard(shownCardsOnCarousel[0]);
                  }
                })
                .finally(() => {
                  setIsLoading(false);
                  refRBSTerminateThisCard?.current?.close();
                });
            }}
            style={{ color: "#fff", width: 140 }}
            color="light-pink"
            leftIcon={
              <AntDesign
                name="checkcircleo"
                size={16}
                color={vars["accent-pink"]}
              />
            }
            disabled={isLoading}
          >
            Yes
          </Button>
          <Button
            onPress={() => refRBSTerminateThisCard?.current?.close()}
            style={{ color: "#fff", width: 140 }}
            color="grey"
          >
            No
          </Button>
        </View>
      </SwipableBottomSheet>
      <SwipableBottomSheet
        rbSheetRef={refRBSShowCard}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          //setCardPin("");
          setResendOTP(false);
          stopTimer("resend_otp");
        }}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: 340,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDD", width: 90 }}
      >
        <Typography
          fontSize={16}
          fontWeight={"600"}
          fontFamily={"Nunito-Regular"}
        >
          Show Card
        </Typography>
        <Typography fontSize={14} fontWeight={"400"} color={vars["shade-grey"]}>
          You will receive an sms to your mobile device. Please enter this code
          below.
        </Typography>
        <Divider style={{ marginVertical: 15, paddingHorizontal: 15 }} />
        <View
          style={{
            display: "flex",
            alignItems: "center",
            paddingVertical: 8,
          }}
        >
          <NewPinCodeInputBoxes
            fieldCount={6}
            onChange={handlePinCodeChange}
            isNewPinCodeStyle
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setResendOTP(true);
            if (getTimer(remainingTimeCountDown?.resend_otp) === 0) {
              handleGetOTP();
            }
          }}
          disabled={
            resendOTP && getTimer(remainingTimeCountDown?.resend_otp) > 0
              ? true
              : false
          }
        >
          {resendOTP && getTimer(remainingTimeCountDown?.resend_otp) > 0 ? (
            <Text style={{ textAlign: "center" }}>
              Wait for {getTimer(remainingTimeCountDown?.resend_otp)} seconds to
              request again.
            </Text>
          ) : null}
          <Text style={styles.noCode}>Did not get a verification code?</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center", paddingTop: 50 }}>
          <Button
            onPress={() => {
              if (!cardPin && !userID) {
                return;
              }
              refRBSShowCard?.current?.close();
              setEncryptedCardDetails((prevState) => ({
                ...prevState,
                isLoadingEncryptedCardDetails: true,
              }));
              const bodyParams = {
                account_id: userID,
                otp: cardPin,
                card_id: Number(selectedCard?.cardreferenceId),
                public_key: {
                  format: "X.509",
                  algorithm: "RSA",
                  encoded: signatureRSA?.publicKeyWithoutPadding,
                },
              };
              showCardDetailsV2(bodyParams)
                .unwrap()
                .then((res: any) => {
                  if (res?.code === 200 || res?.code === "200") {
                    setEncryptedCardDetails((prevState) => ({
                      ...prevState,
                      isLoadingEncryptedCardDetails: false,
                      isSuccessEncryptedCardDetails: true,
                      encryptedCardDetailsData: { ...res.data },
                    }));
                  }
                  setEncryptedCardDetails((prevState) => ({
                    ...prevState,
                    isLoadingEncryptedCardDetails: false,
                  }));
                })
                .catch((error: any) => {
                  console.log({ error });
                  setEncryptedCardDetails((prevState) => ({
                    ...prevState,
                    isLoadingEncryptedCardDetails: false,
                    isErrorEncryptedCardDetails: true,
                    encryptedCardDetailsError: error,
                  }));
                })
                .finally(() => {
                  resetEncryptedCardDetailsData();
                  refRBSShowCard?.current?.close();
                });
            }}
            style={{ color: "#fff", width: 140 }}
            color="light-pink"
            leftIcon={
              <AntDesign
                name="checkcircleo"
                size={16}
                color={vars["accent-pink"]}
              />
            }
            disabled={isLoading}
          >
            Confirm
          </Button>
        </View>
      </SwipableBottomSheet>
    </MainLayout>
  );
}
