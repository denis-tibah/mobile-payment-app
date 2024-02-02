import { useState, useEffect, FC } from "react";
import { View, ScrollView, Pressable, Switch } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay/lib";

import Typography from "../Typography";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../FormGroup";
import Button from "../Button";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";
import WholeContainer from "../../layout/WholeContainer";
import TwoFactorAuthenticationIcon from "../../assets/icons/TwoFactorAuthentication";
import { securityTabSchema } from "../../utils/formikSchema";
import {
  useGetProfileQuery,
  useUpdateNotificationsMutation,
} from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import { styles } from "./styles";
import vars from "../../styles/vars";

interface INotificationsTab {
  cleanUpTabSelection: () => void;
}

const NotificationsTab: FC<INotificationsTab> = ({ cleanUpTabSelection }) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;

  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [notificationLimit, setNotificationLimit] = useState<boolean>(false);

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

  return (
    <ScrollView>
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
              <View style={styles.toggleSliderContainer}>
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
              <Seperator
                backgroundColor={vars["v2-light-grey"]}
                marginBottom={12}
              />

              <View style={styles.toggleSliderContainer}>
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
              </View>
            </WholeContainer>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default NotificationsTab;
