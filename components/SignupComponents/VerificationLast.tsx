import { FC, useState } from "react";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import ProfileIcon from "../../assets/icons/Profile";
import WebcamIcon from "../../assets/icons/Webcam";
import FixedBottomAction from "../../components/FixedBottomAction";
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
  const baseURL = "https://gozazoo.com/";

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
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Last step from your free account
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <Typography
              fontSize={14}
              fontFamily="Nunito-Regular"
              marginBottom={10}
              marginLeft={24}
            >
              Thank you for completing your account registration
            </Typography>
            <Typography
              fontSize={14}
              fontFamily="Nunito-Regular"
              marginBottom={24}
              marginLeft={24}
            >
              The last step of the registration is to{" "}
              <Text style={{ color: vars["accent-pink"] }}>
                verify your identity
              </Text>
            </Typography>
          </View>
          <Seperator
            backgroundColor={vars["verification "]}
            marginBottom={24}
          />
          <View>
            <Typography
              fontSize={14}
              fontFamily="Nunito-Regular"
              marginBottom={10}
              marginLeft={24}
              color={vars["accent-blue"]}
            >
              You will need:
            </Typography>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 24,
                marginBottom: 10,
              }}
            >
              <ProfileIcon color={vars["accent-blue"]} size={14} />
              <Typography
                fontSize={14}
                fontFamily="Nunito-Regular"
                marginLeft={5}
              >
                Your ID document
              </Typography>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 24,
                marginBottom: 24,
              }}
            >
              <WebcamIcon color={vars["accent-blue"]} size={14} />
              <Typography
                fontSize={14}
                fontFamily="Nunito-Regular"
                marginLeft={5}
              >
                Access you your webcam/mobile camera
              </Typography>
            </View>
          </View>
          <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 24,
              marginBottom: 24,
            }}
          >
            <Typography fontSize={14} fontFamily="Nunito-Regular">
              We use a third party identity provider called{" "}
              <Text style={{ color: vars["accent-blue"] }}>SumSub</Text> and
              they will handle your data inline with their data protection
              policy.
            </Typography>
          </View>
          <FixedBottomAction rounded>
            <View
              style={{
                width: "100%",
                /* alignItems: "center", */
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingRight: 20,
                gap: 8,
                paddingBottom: 34,
              }}
            >
              {/* <Button
                color="light-pink"
                onPress={handleSendToMobile}
                leftIcon={<ArrowRightLong size={14} />}
              >
                Send to Mobile
              </Button> */}

              <Button
                color="light-pink"
                onPress={handleDoItLater}
                leftIcon={<ArrowRightLong size={14} />}
              >
                Do it later
              </Button>
              <Button
                color="light-pink"
                onPress={handleContinue}
                leftIcon={<ArrowRightLong size={14} />}
              >
                Continue
              </Button>
            </View>
          </FixedBottomAction>
        </View>
      </View>
    </View>
  );
};

export default VerificationLast;
