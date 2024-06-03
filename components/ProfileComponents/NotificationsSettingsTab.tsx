import { useState, useEffect, useRef, FC, Fragment } from "react";
import { View, Pressable, Switch, Platform } from "react-native";
import { useSelector } from "react-redux";
import Fontisto from "react-native-vector-icons/Fontisto";
import Spinner from "react-native-loading-spinner-overlay/lib";

import Typography from "../Typography";
import { SuccessModal } from "../SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import WholeContainer from "../../layout/WholeContainer";
import {
  useGetProfileQuery,
  useUpdateNotificationsMutation,
} from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import { styles } from "./styles";
import vars from "../../styles/vars";

const NotificationsSettingsTab: FC = () => {
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  /* const [notificationLimit, setNotificationLimit] = useState<boolean>(false); */
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

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
    isLoading: isLoadingGetProfile,
    data: profileData,
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

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    setEmailNotifications(
      profileData?.userProfile?.enableAlertsYN === "Y" ? true : false
    );
  }, [profileData?.userProfile?.enableAlertsYN]);

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
      <View style={{ backgroundColor: "#ffff" }}>
        <Spinner
          visible={isLoadingUpdateNotifications || isLoadingGetProfile}
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
              {/*  <Seperator
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
      </View>
    </Fragment>
  );
};

export default NotificationsSettingsTab;
