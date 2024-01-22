import { Fragment, useState, useEffect, useRef } from "react";
import {
  Keyboard,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  SafeAreaView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Button from "../../components/Button";
import { styles } from "./styles";
import Typography from "../../components/Typography";
import CheckIcon from "../../assets/icons/Check";
import ScrollableStepper from "../../components/ScrollableStepper/ScrollableStepper";
import AddressDetails from "../../components/SignupComponents/AddressDetails";
import FinancialDetails from "../../components/SignupComponents/FinancialDetails";
import LoginDetails from "../../components/SignupComponents/LoginDetails";
import ProfileDetails from "../../components/SignupComponents/ProfileDetails";
import TermsAndSecurity from "../../components/SignupComponents/TermsAndSecurity";
import Verifications from "../../components/SignupComponents/Verifications";
import VerificationLast from "../../components/SignupComponents/VerificationLast";
import Sumsub from "../../components/SignupComponents/Sumsub";
import ModalBottomSheet from "../../components/ModalBottomSheet/ModalBottomSheet";
import WholeContainer from "../../layout/WholeContainer";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";

export function SignupScreen({ navigation, route }: any) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{
    header: string;
    body: string;
    iconType: string;
  }>({ header: "", body: "", iconType: "" });

  const [selectedNavIndex, setNavIndex] = useState<number>(0);

  const refRBSheet = useRef();

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };
  const handleSelecNavIndex = (navIndex: number): void => {
    setNavIndex(navIndex);
  };

  const handleNextStep = (): void => {
    setNavIndex((prevStep) => prevStep + 1);
  };

  const handlePrevStep = (): void => {
    setNavIndex((prevStep) => prevStep - 1);
  };
  // to navigate on profile details after user has been verified
  useEffect(() => {
    if (route?.params?.stepIndex === 1) {
      setIsOpenModal(false);
      setNavIndex(route?.params?.stepIndex);
    }
  }, [route?.params]);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleModalContent = ({
    header,
    body,
    iconType,
  }: {
    header: string;
    body: string;
    iconType?: string;
  }) => {
    setModalContent({ header, body, iconType });
  };

  useEffect(() => {
    if (isOpenModal) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [isOpenModal]);

  const displayIconSwipabbleModal = () => {
    switch (modalContent?.iconType) {
      case "update": {
        return <MaterialCommunityIcons color="white" size={20} name="update" />;
      }
      default:
        return <CheckIcon color="white" size={18} />;
    }
  };

  const steps = [
    <LoginDetails
      handleNextStep={handleNextStep}
      handleOpenModal={handleOpenModal}
      handleModalContent={handleModalContent}
    />,
    <ProfileDetails
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <AddressDetails
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <FinancialDetails
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <TermsAndSecurity
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <Verifications
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
      handleOpenModal={handleOpenModal}
      handleModalContent={handleModalContent}
    />,
    <VerificationLast
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <Sumsub handlePrevStep={handlePrevStep} />,
    // <SumsubProcess handlePrevStep={handlePrevStep} />,
  ];
  return (
    <Fragment>
      <ImageBackground
        style={{ height: "100%" }}
        source={require("../../assets/images/bg.png")}
        resizeMode="cover"
      >
        <ScrollableStepper
          navList={[
            "Login Credentials",
            "Profile Details",
            "Address Details",
            "Financial Details",
            "Terms & Security",
            "Verifications",
            "Verification Last",
            "Sumsub",
          ]}
          selectedNavIndex={selectedNavIndex}
          handleSelecNavIndex={handleSelecNavIndex}
        />

        {/* <TouchableWithoutFeedback onPress={keyboardDismiss}> */}
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            keyboardDismissMode="on-drag"
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <WholeContainer>
              <View style={styles.container}>
                <View
                  style={styles.innerContainer}
                  onStartShouldSetResponder={() => true}
                >
                  <KeyboardAvoidingView style={{ flex: 1 }} enabled>
                    {steps[selectedNavIndex]}
                  </KeyboardAvoidingView>
                </View>
              </View>
            </WholeContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      {/* {isOpenModal && (modalContent?.header || modalContent?.body) ? (
        <ModalBottomSheet
          isOpen={isOpenModal}
          hasNoHeaderPadding
          contentHeight={450}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerWrapper}>
              <CheckIcon color="white" size={18} />
              <Typography
                color="#FFFF"
                fontSize={18}
                marginLeft={6}
                fontWeight={600}
              >
                {modalContent.header}
              </Typography>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <Typography color="#0DCA9D" fontSize={14} fontWeight={600}>
              {modalContent.body}
            </Typography>
          </View>
          <View style={styles.headerWrapper}>
            <Button
              color={"green"}
              onPress={() => {
                setIsOpenModal(false);
                setModalContent({ header: "", body: "" });
              }}
              style={styles.buttonOK}
            >
              <Text>OK</Text>
            </Button>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require('("../../../assets/images/verified.png')}
              style={styles.image}
            />
          </View>
        </ModalBottomSheet>
      ) : null} */}
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={380}
        wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        containerStyles={{
          backgroundColor: "#0DCA9D",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#FFF", width: 90 }}
      >
        <View style={{ backgroundColor: "#ffff" }}>
          <View style={styles.headerContainer}>
            <View style={styles.headerWrapper}>
              {displayIconSwipabbleModal()}
              <Typography
                color="#FFFF"
                fontSize={18}
                marginLeft={6}
                fontWeight={600}
              >
                {modalContent.header}
              </Typography>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <Typography color="#0DCA9D" fontSize={14} fontWeight={600}>
              {modalContent.body}
            </Typography>
          </View>
          <View style={styles.headerWrapper}>
            <Button
              color={"green"}
              onPress={() => {
                setIsOpenModal(false);
                setModalContent({ header: "", body: "", iconType: "" });
              }}
              style={styles.buttonOK}
            >
              <Text>OK</Text>
            </Button>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require('("../../../assets/images/verified.png')}
              style={styles.image}
            />
          </View>
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
}

export default SignupScreen;
