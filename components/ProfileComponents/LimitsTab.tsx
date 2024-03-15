import { useState, useEffect, FC, Fragment } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { TabView, SceneMap, NavigationState, TabBar } from 'react-native-tab-view';
import { useFormik } from "formik";
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { ProgressBar } from "react-native-paper";

import Typography from "../Typography";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../FormGroup";
import SettingsIcon from "../../assets/icons/Settings";
import LimitsIcon from "../../assets/icons/Limit";
import Button from "../Button";
import WholeContainer from "../../layout/WholeContainer";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { Seperator } from "../Seperator/Seperator";

import {
  useGetLimitsQuery,
  useUpdateLimitsMutation,
} from "../../redux/setting/settingSliceV2";
import { RootState } from "../../store";
import { arrayChecker, heightGlobal } from "../../utils/helpers";
import vars from "../../styles/vars";
import { styles } from "./styles";
import AccountLimits from "./SubComponents/AccountLimits";
import CardLimit from "./SubComponents/CardLimits";

interface ISecurityTab {
  cleanUpTabSelection: () => void;
}

const renderScene = SceneMap({
  first: AccountLimits,
  second: CardLimit,
});

const LimitsTab: FC<ISecurityTab> = ({ cleanUpTabSelection }) => {
  const layout = useWindowDimensions();
  const [limitIndex, setLimitIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Account' },
    { key: 'second', title: 'Card' },
  ]);

  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const userData = useSelector((state: RootState) => state?.auth?.userData);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  // const {
  //   isLoading: isLoadingGetLimits,
  //   isError: isErrorGetProfile,
  //   data: dataGetLimits,
  // } = useGetLimitsQuery(
  //   {
  //     accessToken: userTokens?.access_token,
  //     tokenZiyl: userTokens?.token_ziyl,
  //     accountId: userData?.id,
  //   },
  //   {
  //     skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
  //   }
  // );

  // useEffect(() => {
  //   if (!isLoadingGetLimits && isErrorGetProfile) {
  //     setStatusMessage({
  //       header: "Error",
  //       body: "Something went wrong getting your account limits",
  //       isOpen: false,
  //       isError: false,
  //     });
  //   }
  // }, [isLoadingGetLimits, isErrorGetProfile]);

  // const [
  //   updateLimit,
  //   {
  //     isLoading: isLoadingUpdateLimits,
  //     isError: isErrorUpdateLimits,
  //     isSuccess: isSuccessUpdateLimits,
  //     error: errorUpdateLimits,
  //     data: dataUpdateLimits,
  //   },
  // ] = useUpdateLimitsMutation();
  // console.log("🚀 ~ errorUpdateLimits:", errorUpdateLimits);
  // useEffect(() => {
  //   if (!isLoadingUpdateLimits && isSuccessUpdateLimits) {
  //     if (dataUpdateLimits?.code === "200") {
  //       setStatusMessage({
  //         header: "Success",
  //         body: dataUpdateLimits?.message || "Updated your limit",
  //         isOpen: false,
  //         isError: false,
  //       });
  //     }
  //   }
  // }, [isLoadingUpdateLimits, isSuccessUpdateLimits, dataUpdateLimits]);

  // useEffect(() => {
  //   if (!isLoadingUpdateLimits && isErrorUpdateLimits) {
  //     if (
  //       errorUpdateLimits?.data?.code === 401 ||
  //       errorUpdateLimits?.status === 401
  //     ) {
  //       setStatusMessage({
  //         header: "Error",
  //         body: errorUpdateLimits?.data?.status || "Failed updating your limit",
  //         isOpen: true,
  //         isError: true,
  //       });
  //     }
  //   }
  // }, [isLoadingUpdateLimits, isErrorUpdateLimits, errorUpdateLimits]);

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
      <ScrollView>
        <TabView
          style={{
            flex: 1,
            backgroundColor: '#fff',
            height: heightGlobal * .73,
          }}
          renderTabBar={(props) => (
            <View style={{ backgroundColor: "#fff" }}>
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "#e7038e" }}
                style={{ backgroundColor: "#fff" }}
                renderLabel={({ route, focused, color }) => (
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    color={focused ? "#e7038e" : "#4D4D4D"}
                  >
                    {route.title}
                  </Typography>
                )}
              />
            </View>
          )}
          navigationState={{ index: limitIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setLimitIndex}
          initialLayout={{ width: layout.width, height: layout.height }}
        />
      </ScrollView>
    </Fragment>
  )
};

export default LimitsTab;
