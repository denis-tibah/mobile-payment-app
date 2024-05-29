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
import { getUserActiveCards, screenNames } from "../../utils/helpers";
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

  const {
    /*  generateSignature, signatureData, */ decryptRsa,
    convertPublicKeyPKCS1ToPKCS8,
  } = useDigitalSignature();
  const { startTimer, isTimesUp, stopTimer, remainingTimeCountDown } =
    useTimer();

  /* const {
    error,
    saveStorageData,
    storageData,
    getStorageData,
    deleteStorageData,
  } = useSecureStoreCreateDelete(); */

  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const cardData = useSelector((state: RootState) => state?.card?.data);
  const cardsActiveList = getUserActiveCards(cardData);

  const [cardPin, setCardPin] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState(30);
  const [isTerminatedCardShown, setIsTerminatedCardShown] =
    useState<boolean>(false);
  const [terminatedCardModal, setTerminatedCardModal] =
    useState<boolean>(false);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("🚀 ~ Card ~ isLoading:", isLoading);
  const [isSelectedCardTerminated, setIsSelectedCardTerminated] =
    useState<boolean>(false);
  const [listOfCheckedOptions, setListOfCheckedOptions] = useState<string[]>(
    []
  );
  const [resendOTP, setResendOTP] = useState<boolean>(false);
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
  console.log("🚀 ~ Card ~ signatureRSA:", signatureRSA?.privateKey);
  console.log("🚀 ~ Card ~ signatureRSA:", signatureRSA?.publicKey);
  console.log(
    "🚀 ~ Card ~ signatureRSA:encoded ",
    signatureRSA?.encodedMessage
  );
  console.log(
    "🚀 ~ Card ~ signatureRSA:public ",
    signatureRSA?.publicKeyWithoutPadding
  );

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

  // Function to strip the header and footer
  const stripPemFormatting = (pem: any) => {
    return pem
      .replace(/-----BEGIN [\s\S]+?-----/, "")
      .replace(/-----END [\s\S]+?-----/, "")
      .replace(/\r?\n|\r/g, ""); // Remove all newlines
  };

  const generateKeys = async () => {
    //4096 Is the key size
    let keyPair = await RSA.generateKeys(2048);
    setSignatureRSA({
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
    });
    if (Platform.OS === "android") {
      console.log("android");
    }
  };

  /* const generateRSASignature = async (dataToEncrypt: any) => {
    //data to be signed
    let data = dataToEncrypt; //Generate key pair
    //let keyPair = await generateKeys(); //Sign the data
    let signature = await RSA.signWithAlgorithm(
      data,
      signatureRSA?.private,
      RSA.SHA512withRSA as any
    );
    console.warn("signature ", signature);
    return signature;
  }; */

  /* const encryptMessage = async ({
    encryptedData,
    publicKey,
  }: {
    encryptedData: any;
    publicKey: any;
  }) => {
    const encodedMessage = await RSA.encrypt(encryptedData, publicKey);
    const base64 = btoa(encryptedData);
    setSignatureRSA((prevState: any) => ({
      ...prevState,
      encodedMessage,
      base64,
    }));
    await RSA.importPublicKey(publicKey);
    return encodedMessage;
  };

  const decryptMessage = async ({
    encryptedData,
    privateKey,
    type,
  }: {
    encryptedData: any;
    privateKey: any;
    type: any;
  }) => {
    if (type === "cardNumber") {
      const decryptedMessage = await RSA.decrypt(encryptedData, privateKey);
      setCardDetailsDecrypted((prevState) => ({
        ...prevState,
        cardNumber: decryptedMessage,
      }));
    }

    if (type === "cvc") {
      const decryptedMessage = await RSA.decrypt(encryptedData, privateKey);
      setCardDetailsDecrypted((prevState) => ({
        ...prevState,
        cvc: decryptedMessage,
      }));
    }

    if (type === "pin") {
      const decryptedMessage = await RSA.decrypt(encryptedData, privateKey);
      setCardDetailsDecrypted((prevState) => ({
        ...prevState,
        pin: decryptedMessage,
      }));
    }
  }; */

  /* const testEncryptDecrypt = async (message: any) => {
    // let keys=generateRSASignature(message);
    let keys = await generateKeys();
    let enc = encryptMessage(message, keys);
    let dec = decryptMessage((await enc).toString(), keys);
    console.warn("message  ", message);
    console.warn("message enc  ", (await enc).toString());
    console.warn("message dec ", (await dec).toString());
  };
 */
  /* useEffect(() => {
    console.log("🚀 ~ Card ~ signatureRSA:", signatureRSA);
    if (signatureRSA?.public) {
      encryptMessage("secret", signatureRSA);
    }
  }, [signatureRSA]); */

  // to show decrypted card details is success
  useEffect(() => {
    const { isLoadingEncryptedCardDetails, isSuccessEncryptedCardDetails } =
      encryptedCardDetails;
    let cardNumber: any;
    let cvc: string;
    let pin: string;
    if (!isLoadingEncryptedCardDetails && isSuccessEncryptedCardDetails) {
      // set timer for digital_signature for 5mins
      // startTimer("digital_signature", 60000 * 2);
      //set timer for decrypted card info deletion
      startTimer("decrypted_card_info_local_state", 30000);
      if (signatureRSA?.privateKey) {
        if (
          encryptedCardDetails?.encryptedCardDetailsData?.cardNumberEncrypted
        ) {
          /* decryptMessage({
            encryptedData:
              encryptedCardDetails?.encryptedCardDetailsData
                ?.cardNumberEncrypted,
            privateKey: signatureRSA?.privateKey,
            type: "cardNumber",
          }); */
          cardNumber = decryptRsa({
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
          cvc = decryptRsa({
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
          /* decryptMessage({
            encryptedData:
              encryptedCardDetails?.encryptedCardDetailsData?.cvc2Encrypted,
            privateKey: signatureRSA?.privateKey,
            type: "cvc",
          }); */
        }

        if (encryptedCardDetails?.encryptedCardDetailsData?.pinEncrypted) {
          pin = decryptRsa({
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
          /* decryptMessage({
            encryptedData:
              encryptedCardDetails?.encryptedCardDetailsData?.pinEncrypted,
            privateKey: signatureRSA?.privateKey,
            type: "pin",
          }); */
        }
      }

      setTimeout(() => {
        resetEncryptedCardDetailsData();
      }, 7000);
    }
  }, [
    encryptedCardDetails?.isLoadingEncryptedCardDetails,
    encryptedCardDetails?.isSuccessEncryptedCardDetails,
    encryptedCardDetails,
    signatureRSA?.privateKey,
  ]);

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

  /* useEffect(() => {
    if (isTimesUp?.digital_signature) {
      stopTimer("digital_signature");
    }
  }, [isTimesUp?.digital_signature]); */

  useEffect(() => {
    if (
      isTimesUp?.decrypted_card_info_local_state ||
      Number(remainingTimeCountDown["decrypted_card_info_local_state"]) /
        1000 ===
        0
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
    Number(remainingTimeCountDown?.decrypted_card_info_local_state) / 1000,
  ]);

  /* useEffect(() => {
    console.log(
      "🚀 ~ Card ~ remainingTimeCountDown",
      remainingTimeCountDown["test_timer"] / 1000
    );
    console.log(
      "🚀 ~ useEffect ~ isTimesUp?.test_timer:",
      isTimesUp?.test_timer
    );
    if (isTimesUp?.test_timer) {
      stopTimer("test_timer");
    }
  }, [isTimesUp?.test_timer, remainingTimeCountDown["test_timer"]]);
 */
  /* useEffect(() => {
    if (isTimesUp?.is_request_new_otp) {
      stopTimer("is_request_new_otp");
      setResendOTP(false);
    }
  }, [isTimesUp?.is_request_new_otp]); */

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
          timer={
            Number(remainingTimeCountDown["decrypted_card_info_local_state"]) /
            1000
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
  }, []);

  // store/fetch digital signature in secure store
  /* useEffect(() => {
    if (signatureData?.publicKeyWithoutPadding) {
      saveStorageData("digital_signature_public_key_without_padding", {
        publicKeyWithoutPadding: signatureData?.publicKeyWithoutPadding,
      });
      getStorageData("digital_signature_public_key_without_padding");
    }
  }, [signatureData?.publicKeyWithoutPadding]);

  useEffect(() => {
    if (signatureData?.privateKeyWithPadding) {
      saveStorageData("digital_signature_private_key_with_padding", {
        privateKeyWithPadding: signatureData?.privateKeyWithPadding,
      });
      getStorageData("digital_signature_private_key_with_padding");
    }
  }, [signatureData?.privateKeyWithPadding]); */

  const handleGetOTP = async () => {
    generateKeys();
    setIsLoading(true);
    const bodyParams = {
      type: "trusted",
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    };
    getOTP(bodyParams)
      .unwrap()
      .then((res: any) => {
        console.log("🚀 ~ .then ~ res:", res);
        if (res?.status === "success") {
          refRBSShowCard?.current?.open();
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.log("🚀 ~ handleGetOTP ~ error:", error);
        setStatusMessage({
          header: `${error?.status}${error?.status ? ":" : ""}Error`,
          body: `OTP error: Please try again`,
          isOpen: true,
          isError: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /* useEffect(() => {
    const testGenerateRSASignature = async () => {
      encryptMessage({
        encryptedData: "gggg",
        publicKey: signatureRSA?.publicKey,
      });
    };
    if (signatureRSA?.publicKey) {
      testGenerateRSASignature();
    }
  }, [signatureRSA?.public]);

  useEffect(() => {
    const testGenerateRSASignature = async () => {
      const decryptedMessage = await RSA.decrypt(
        signatureRSA?.encodedMessage,
        signatureRSA?.privateKey
      );
      console.log(
        "🚀 ~ testGenerateRSASignature ~ decryptedMessage:",
        decryptedMessage
      );
    };
    if (signatureRSA?.encodedMessage) {
      testGenerateRSASignature();
    }
  }, [signatureRSA?.encodedMessage, signatureRSA?.private]); */

  /*  useEffect(() => {
    const pv = `-----BEGIN RSA PRIVATE KEY-----
    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
    -----END RSA PRIVATE KEY-----`;
    const base64 = `FGPxukg+6ds7cjesKlFeyWp+XUthBSPRGRkhgDf4AOaJESJaeRxPZicOAnuQIK9R45NlU1YnudzEzKp9E6qDeGs1da4UOf1wNgufNBcTjP3lWo7n+OfLBMi7Y7UlDZD6SCNJ6HEWzs4hGBgwfEkXpV/2Pjp/vyxfyNUm4cFVqo2ruuI1YITgz+1Phjra1+6e9+JDeE5DaEE8M0LXfAr5D9J2Zx76+pbOfYsLL5flDmFkvCifr1m1byP2VZEQIHcKV+hthNxT4DUi2+1YGHG8H7gZcOA5Trbs2UqaS/DWMNSht6i0LlfXJGxPjtxsJGWSrgirUz00+ckvBdAc45RJjHHOmPByqmepZFmx0NkfpXCaQiBUHqV9yo/zcTsJ8RDw8kyZP1sznZLDNdiCOoyopsHyYILr2eLOZc7+0SLM5lnuqnSzzE57hkwg/NR8vDxi63mDqmEkdsK8vM4YKY2OhyMgW93frzLODxvckloXKyEUQ/kENPhmPnpLe0ytUtWcOMct9b0i3V3Wy4TLUUauAngiSHwCP7+h4+QSmqpFaDe2NgX590ItwUnBFI90gqqCW+MrkNrhvu18/opzCdNaJi5EATLHLR/qTuaY8MFIm48jO5yxpriIy2lPkd88gGikf2N6vCsrUpg65E9KcOzF4AtW126f4tON2NPO7JWpJzU=`;

    const testDecrypt = async () => {
      decryptRsa({ encryptedData: base64, privateKeyPem: pv });
    };
    testDecrypt();
  }, []); */

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
          /* deleteStorageData("digital_signature_public_key_without_padding");
          deleteStorageData("digital_signature_private_key_with_padding"); */
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
            //handleGetOTP();
          }}
          // disabled={resendOTP ? true : false}
        >
          {/*               {resendOTP ? (
                <Text style={styles.noCodeResend}>
                  Wait for 30 seconds to request again.
                </Text>
              ) : null} */}
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
                  /* encoded: signatureData?.publicKeyWithoutPadding, */
                  /* storageData?.digital_signature_public_key_without_padding
                      ?.publicKeyWithoutPadding, */
                },
              };
              console.log("🚀 ~ Card ~ bodyParams:", bodyParams);
              showCardDetailsV2(bodyParams)
                .unwrap()
                .then((res: any) => {
                  console.log("🚀 ~ .then ~ res:", res);
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
