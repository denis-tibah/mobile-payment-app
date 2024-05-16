import { useState, useEffect, useRef, FC, Fragment } from "react";
import {
  View,
  Pressable,
  Switch,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Spinner from "react-native-loading-spinner-overlay/lib";

import Typography from "../Typography";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import WholeContainer from "../../layout/WholeContainer";
import {
  useGetProfileQuery,
  useUpdateNotificationsMutation,
} from "../../redux/profile/profileSliceV2";
import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
} from "../../redux/notifications/notificationSlice";
import { RootState } from "../../store";
import { styles } from "./styles";
import vars from "../../styles/vars";
import { arrayChecker } from "../../utils/helpers";
import useGeneratePDF from "../../hooks/useGeneratePDF";
import SwipableBottomSheet from "../SwipableBottomSheet";
import Statements from "../Notification/Statements";

interface INotificationsTab {
  cleanUpTabSelection: () => void;
}

const NotificationsTab: FC<INotificationsTab> = ({ cleanUpTabSelection }) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;

  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const { resetPDFParams } = useGeneratePDF();

  const refRBSheet = useRef();

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  /* const [notificationLimit, setNotificationLimit] = useState<boolean>(false); */
  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(0);
  const [notification, setNotication] = useState<any>({});

  const {
    isLoading: isLoadingGetProfile,
    /* isError: isErrorGetProfile,
    isSuccess: isSuccessGetProfile,
    error: errorGetProfile, */
    data: dataGetProfile,
    refetch,
  } = useGetProfileQuery(
    {
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    },
    {
      skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
    }
  );

  const [
    updateNotificationsMutation,
    {
      isLoading: isLoadingUpdateNotifications,
      /* isError: isErrorUpdateNotifications, */
      isSuccess: isSuccessUpdateNotifications,
      /* error: errorUpdateNotifications, */
      data: dataUpdateNotifications,
    },
  ] = useUpdateNotificationsMutation();

  const {
    isLoading: isLoadingGetNotifications,
    isError: isErrorGetNotifications,
    error: errorGetNotifications,
    data: dataNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(
    {
      tokenZiyl: userTokens?.token_ziyl,
    },
    {
      skip: !userTokens && !userTokens?.token_ziyl,
    }
  );

  const [
    readNotification,
    {
      isLoading: isLoadingReadNotification,
      isError: isErrorReadNotification,
      /* isSuccess: isSuccessReadNotification, */
      error: errorReadNotification,
      /* data: dataReadNotification, */
    },
  ] = useReadNotificationMutation();

  useEffect(() => {
    setEmailNotifications(
      dataGetProfile?.UserProfile?.EnableAlertsYN === "Y" ? true : false
    );
  }, [dataGetProfile?.UserProfile?.EnableAlertsYN]);

  useEffect(() => {
    if (!isLoadingUpdateNotifications && isSuccessUpdateNotifications) {
      if (dataUpdateNotifications?.code === "200") {
        refetch();
        setStatusMessage({
          header: "Success",
          body:
            dataUpdateNotifications?.message || "Changing notification success",
          isOpen: true,
          isError: false,
        });
      }
    }
  }, [isLoadingUpdateNotifications, isSuccessUpdateNotifications]);

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

  useEffect(() => {
    if (!isLoadingGetNotifications && isErrorGetNotifications) {
      setStatusMessage({
        header: `Error: ${errorGetNotifications?.data?.code}`,
        body:
          errorGetNotifications?.data?.message || "Unable to get notifications",
        isOpen: true,
        isError: true,
      });
    }
  }, [isLoadingGetNotifications, isErrorGetNotifications]);

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  const handleToggleNotification = (toggleValue: boolean) => {
    setEmailNotifications(toggleValue);

    const bodyParams = {
      email: profileData?.email,
      enableYN: toggleValue ? "Y" : "N",
    };
    updateNotificationsMutation({
      bodyParams,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    });
  };

  const gameItemExtractorKey = (item: any, index: any) => {
    return index.toString();
  };

  const renderNotificationList = (item: any) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setNotication((prevState) => {
            if (item?.item) {
              return { ...item?.item };
            }
            return prevState;
          });
          refRBSheet?.current?.open();
          if (!item?.item?.readByUser) {
            const bodyParams = {
              notificationId: item?.item?.id || "",
              tokenZiyl: userTokens?.token_ziyl || "",
            };
            readNotification(bodyParams);
            refetchNotifications();
          }
        }}
      >
        <View>
          <Seperator backgroundColor={"#F5F4F4"} height={2} />
          <WholeContainer>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
              }}
            >
              <View>
                <Typography
                  fontSize={14}
                  color={"#000"}
                  fontFamily="Mukta-Regular"
                  fontWeight="400"
                >
                  {item?.item?.title}
                </Typography>
                <Typography
                  fontSize={12}
                  color={vars["shade-grey"]}
                  fontFamily="Mukta-SemiBold"
                  fontWeight="500"
                >
                  {item?.item?.submittedDate}
                </Typography>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {!item?.item?.readByUser ? (
                  <FontAwesome
                    color={vars["accent-pink"]}
                    size={6}
                    name={"circle"}
                  />
                ) : null}
                <ArrowRightIcon color="#086afb" size={14} />
              </View>
            </View>
          </WholeContainer>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const displayListItems = () => {
    if (isLoadingGetNotifications) {
      return (
        <WholeContainer>
          <View style={styles.listHead}>
            <Typography
              fontFamily="Nunito-Regular"
              fontWeight={"600"}
              fontSize={14}
            >
              Loading...
            </Typography>
          </View>
        </WholeContainer>
      );
    }
    if (
      arrayChecker(dataNotifications?.data) &&
      dataNotifications?.data.length > 0
    ) {
      return (
        <FlatList
          data={dataNotifications?.data || []}
          keyExtractor={gameItemExtractorKey}
          scrollEnabled={false}
          renderItem={(item) => (
            <View style={{ flex: 1 }}>{renderNotificationList(item)}</View>
          )}
        />
      );
    }
    return (
      <View style={styles.listHead}>
        <Typography
          fontSize={16}
          color={vars["black"]}
          fontFamily="Nunito-Regular"
          fontWeight={"600"}
        >
          No notification found
        </Typography>
      </View>
    );
  };

  const handleCloseBottomSheet = () => {
    refRBSheet?.current?.close();
  };

  return (
    <Fragment>
      <View style={{ backgroundColor: "#ffff" }}>
        <Spinner
          visible={
            isLoadingUpdateNotifications ||
            isLoadingGetProfile ||
            isLoadingGetNotifications ||
            isLoadingReadNotification
          }
        />
        <SuccessModal
          isOpen={statusMessage?.isOpen}
          title={statusMessage.header}
          text={statusMessage.body}
          isError={statusMessage.isError}
          onClose={onCloseModal}
        />
        <Pressable>
          <View>
            <WholeContainer>
              <View
                style={[
                  styles.toggleSliderContainer,
                  {
                    ...Platform.select({
                      ios: {
                        marginVertical: 8,
                      },
                    }),
                  },
                ]}
              >
                <View style={styles.toggleSliderContainerText}>
                  <Fontisto color="#086AFB" size={22} name={"email"} />
                  <Typography fontSize={16} marginLeft={6}>
                    Recieve email notifications
                  </Typography>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={emailNotifications ? "white" : vars["light-blue"]}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(e) => {
                    handleToggleNotification(e);
                  }}
                  value={emailNotifications}
                />
              </View>
              {/* <Seperator
              backgroundColor={vars["v2-light-grey"]}
              marginBottom={12}
            /> */}
              {/* temporary hiding as per aristos, 05/15/24 */}
              {/*  <View
                style={[
                  styles.toggleSliderContainer,
                  {
                    ...Platform.select({
                      ios: {
                        marginVertical: 8,
                      },
                    }),
                  },
                ]}
              >
                <View style={styles.toggleSliderContainerText}>
                  <Feather color="#086AFB" size={22} name={"bell"} />
                  <Typography fontSize={16} marginLeft={6}>
                    Notifications when limit is reached
                  </Typography>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={notificationLimit ? "white" : vars["light-blue"]}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(e) => setNotificationLimit(e)}
                  value={notificationLimit}
                />
              </View> */}
            </WholeContainer>
          </View>
        </Pressable>
        {displayListItems()}
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          resetPDFParams();
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
                {notification?.title ? notification?.title : ""}
              </Typography>
            </View>
          </WholeContainer>
          <Seperator backgroundColor={"#DDDDDD"} />
          {notification?.requestType === "STATEMENTS_READY" ? (
            <Fragment>
              <Statements onCloseBottomSheet={handleCloseBottomSheet} />
            </Fragment>
          ) : null}
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
};

export default NotificationsTab;
