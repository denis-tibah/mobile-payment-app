import { FC, useState } from "react";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import ProfileIcon from "../../assets/icons/Profile";
import WebcamIcon from "../../assets/icons/Webcam";
import FixedBottomAction from "../../components/FixedBottomAction";
import WholeContainer from "../../layout/WholeContainer";
import ArrowRightLong from "../../assets/icons/ArrowRightLong";
import {
  /* sendSubsubToMobile, */
  sendSubsubToEmail,
  /*   setRegistrationData, */
} from "../../redux/registration/registrationSlice";
import { AppDispatch } from "../../store";
import Button from "../../components/Button";
import { SuccessModal } from "../SuccessModal/SuccessModal";
import vars from "../../styles/vars";
import { screenNames } from "../../utils/helpers";
import SignupScrollableBodyWrapper from "./SignupScrollableBodyWrapper";
import { styles } from "./styles";

interface IVerificationLast {
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

/* type MessageProps = {
  channel: string;
  to: string;
  content: string;
}[]; */

const VerificationLast: FC<IVerificationLast> = ({
  handleNextStep,
  handlePrevStep,
}) => {
  const { navigate }: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  // gozazoo backend
  // const baseURL = "https://gozazoo.com/";
  // staging
  const baseURL = "https://zazoostg.com/reg/ziyl";

  const registration = useSelector((state: any) => state?.registration);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  /*   const handleSendToMobile = () => {
    const messages: MessageProps = [
      {
        channel: "sms",
        to: registration?.data?.identifier,
        content:
          fromtEndURL +
          "/app/Sumsublinked/token?token=" +
          registration?.data?.sumsubToken,
      },
    ];

    dispatch(sendSubsubToMobile({ messages }))
      .unwrap()
      .then((payload) => {
        console.log(
          "🚀 ~ file: VerificationLast.tsx:55 ~ dispatch ~ payload:",
          payload
        );
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: VerificationLast.tsx:62 ~ .then ~ error:",
          error
        );
      });
  };*/

  const handleContinue = (): void => {
    handleNextStep();
  };

  const handleDoItLater = (): void => {
    dispatch(
      sendSubsubToEmail({
        registrationAuthentication:
          registration?.data?.registrationAuthentication,
        emailPayload: {
          message:
            baseURL +
            "/app/Sumsublinked/token?token=" +
            registration?.data?.sumsubToken,
          recipientAddress: [
            {
              to: registration?.data?.email,
            },
          ],
          from: "noreply@zazoo.money",
          subject: "continue zazoo registration later",
        },
      })
    )
      .unwrap()
      .then((payload: any) => {
        if (
          (payload?.status === 200 || payload?.status === "200") &&
          payload?.data
        ) {
          setStatusMessage({
            header: "Success",
            body: payload?.data,
            isOpen: true,
            isError: false,
          });
        } else {
          setStatusMessage({
            header: "Error",
            body: "Opps theres an error in data",
            isOpen: true,
            isError: true,
          });
        }
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: VerificationLast.tsx:86 ~ handleDoItLater ~ error:",
          error
        );
        setStatusMessage({
          header: "Error",
          body: "Something went wrong",
          isOpen: true,
          isError: true,
        });
      });
  };

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
    navigate(screenNames.login);
  };

  return (
    <View style={styles.card}>
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight={600}>
          Last step from your free account
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={12} />
      <SignupScrollableBodyWrapper>
        <View style={styles.cardBody}>
          <View>
            <Typography
              fontSize={16}
              fontFamily="Mukta-Regular"
              fontWeight={600}
              marginBottom={10}
            >
              Thank you for completing your account registration.
            </Typography>
            <Typography
              fontSize={16}
              fontFamily="Mukta-Regular"
              fontWeight={600}
              marginBottom={24}
            >
              The last step of the registration is to{" "}
              <Text
                style={{
                  color: vars["accent-pink"],
                  fontFamily: "Mukta-Regular",
                }}
              >
                verify your identity
              </Text>
            </Typography>
          </View>
          <Seperator
            backgroundColor={vars["v2-light-grey"]}
            marginBottom={16}
          />
          <View>
            <Typography
              fontSize={16}
              fontFamily="Mukta-Regular"
              fontWeight={600}
              marginBottom={10}
              color={vars["accent-blue"]}
            >
              You will need:
            </Typography>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <ProfileIcon color={vars["accent-blue"]} size={18} />
              <Typography
                fontSize={16}
                fontFamily="Mukta-Regular"
                fontWeight={600}
                marginLeft={5}
              >
                Your ID document
              </Typography>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <WebcamIcon color={vars["accent-blue"]} size={18} />
              <Typography
                fontSize={16}
                fontFamily="Mukta-Regular"
                fontWeight={600}
                marginLeft={5}
              >
                Access you your webcam/mobile camera
              </Typography>
            </View>
          </View>
          <Seperator
            backgroundColor={vars["v2-light-grey"]}
            marginBottom={24}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Typography
              fontSize={16}
              fontFamily="Mukta-Regular"
              fontWeight={600}
            >
              We use a third party identity provider called{" "}
              <Text
                style={{
                  color: vars["accent-blue"],
                  fontFamily: "Mukta-Regular",
                  fontWeight: 600,
                }}
              >
                SumSub
              </Text>{" "}
              and they will handle your data inline with their data protection
              policy.
            </Typography>
          </View>
        </View>
      </SignupScrollableBodyWrapper>
      <View style={styles.footerContent}>
        <View style={styles.downloadBtnMain}>
          <WholeContainer>
            <View style={styles.bottomButtonContainer}>
              <Button color="light-pink" onPress={handleDoItLater}>
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  fontFamily="Nunito-SemiBold"
                  marginLeft={8}
                >
                  Do it later
                </Typography>
              </Button>
              <Button
                color="light-pink"
                onPress={handleContinue}
                rightIcon={<ArrowRightLong size={14} />}
              >
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  fontFamily="Nunito-SemiBold"
                  marginLeft={8}
                >
                  Continue
                </Typography>
              </Button>
            </View>
          </WholeContainer>
        </View>
      </View>
    </View>
  );
};

export default VerificationLast;
