import { useEffect, useState, useRef, Fragment } from "react";
import { View, TouchableWithoutFeedback, Image } from "react-native";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { useAtom } from "jotai";
import { TouchableOpacity } from "react-native-gesture-handler";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Spinner from "react-native-loading-spinner-overlay/lib";

import useGeneratePDF from "../../hooks/useGeneratePDF";
import { Seperator } from "../Seperator/Seperator";
import { RootState } from "../../store";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import SwipableBottomSheet from "../SwipableBottomSheet";
import { styles } from "./styles";
import Avatar from "../Avatar";
import Typography from "../Typography";
import WholeContainer from "../../layout/WholeContainer";
import { useGetProfileQuery } from "../../redux/profile/profileSliceV2";
import { profileTabRoute } from "../../utils/globalStates";
import Statements from "../Notification/Statements";
import { useReadNotificationMutation } from "../../redux/notifications/notificationSlice";

export function Header({ navigation }: any): any {
  const auth = useSelector((state: any) => state.auth);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const route = useRoute();
  const refRBSheet = useRef();

  const [, setProfileRoute] = useAtom(profileTabRoute);

  const { resetPDFParams } = useGeneratePDF();

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery(
    {
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    },
    {
      skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
    }
  );
  console.log("🚀 ~ Header ~ profileData:", profileData);
  const [
    readNotification,
    {
      isLoading: isLoadingReadNotification,
      isError: isErrorReadNotification,
      isSuccess: isSuccessReadNotification,
      error: errorReadNotification,
      /* data: dataReadNotification, */
    },
  ] = useReadNotificationMutation();
  console.log("🚀 ~ Header ~ errorReadNotification:", errorReadNotification);
  console.log(
    "🚀 ~ Header ~ isSuccessReadNotification:",
    isSuccessReadNotification
  );
  console.log(
    "🚀 ~ Header ~ isErrorReadNotification:",
    isErrorReadNotification
  );
  console.log(
    "🚀 ~ Header ~ isLoadingReadNotification:",
    isLoadingReadNotification
  );

  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(0);
  const unReadNotification = profileData?.userProfile?.totalNotificationsUnread;
  const notificationId = profileData?.userProfile?.statementNotification?.id;
  const statementNotification = profileData?.userProfile?.statementNotification;
  const notificationReadByUser =
    profileData?.userProfile?.statementNotification?.readByUser;

  useEffect(() => {
    if (!isLoadingReadNotification && isSuccessReadNotification) {
      refRBSheet?.current?.open();
    }
  }, [isLoadingReadNotification, isErrorReadNotification]);

  useEffect(() => {
    if (!isLoadingReadNotification && isErrorReadNotification) {
      setStatusMessage({
        header: `Error: ${errorReadNotification?.data?.code}`,
        body:
          errorReadNotification?.data?.message ||
          "Something went wrong while reading message",
        isOpen: true,
        isError: true,
      });
    }
  }, [isLoadingReadNotification, isErrorReadNotification]);

  const handleCloseBottomSheet = () => {
    refRBSheet?.current?.close();
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
    <Fragment>
      <Spinner visible={isLoadingReadNotification} />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <View style={styles.header}>
        <View>
          <Image
            style={{ height: 30, width: 125 }}
            source={require("../../assets/images/ZazooLogo.png")}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {auth?.isAuthenticated && (
            <View style={styles.actions}>
              <View style={styles.action__iconMargin}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    console.log("click");
                    navigation.navigate("profile");
                    setProfileRoute("Notifications");
                  }}
                >
                  <View style={{ zIndex: 999, overflow: "visible" }}>
                    <View style={styles.notificationContainer}>
                      <Feather color="#086AFB" size={14} name={"bell"} />
                    </View>
                    {unReadNotification > 0 ? (
                      <View style={styles.headerAlertCounterStyle}>
                        <Typography
                          color="#fff"
                          fontSize={14}
                          fontFamily="Mukta-Regular"
                          fontWeight="800"
                        >
                          {unReadNotification || ""}
                        </Typography>
                      </View>
                    ) : (
                      ""
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("profile")}
                >
                  <View>
                    <Avatar
                      isBase64Image
                      src={profileData?.userProfile?.profileimage}
                      fileUpload
                      borderColor={
                        route.name === "profile" ? "#E7038E" : "#ddebff"
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
                {statementNotification && !statementNotification?.readByUser ? (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      const bodyParams = {
                        notificationId: notificationId || "",
                        tokenZiyl: userTokens?.token_ziyl || "",
                      };
                      readNotification(bodyParams);
                    }}
                  >
                    <View style={{ position: "absolute", top: -6, right: 2 }}>
                      <MaterialIcons
                        color="#E7038E"
                        size={20}
                        name={"notifications-active"}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null}
              </View>
            </View>
          )}
        </View>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          resetPDFParams();
          setTimeout(() => {
            refetchProfile();
          }, 3000);
        }}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: bottomSheetHeight + 45,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View
          style={{
            backgroundColor: "white",
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setBottomSheetHeight(height);
          }}
        >
          <WholeContainer>
            <View
              style={{
                paddingVertical: 6,
                marginBottom: 12,
              }}
            >
              <Typography
                fontWeight="600"
                fontSize={18}
                fontFamily="Nunito-SemiBold"
              >
                {profileData?.userProfile?.statementNotification?.title}
              </Typography>
            </View>
          </WholeContainer>
          <Seperator backgroundColor={"#DDDDDD"} />
          {profileData?.userProfile?.statementNotification?.requestType ===
          "STATEMENTS_READY" ? (
            <Fragment>
              <Statements
                onCloseBottomSheet={handleCloseBottomSheet}
                message={
                  profileData?.userProfile?.statementNotification?.message
                }
              />
            </Fragment>
          ) : null}
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
}
