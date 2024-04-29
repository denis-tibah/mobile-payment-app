import React, { useEffect, useState, Fragment } from "react";
import {
  View,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay/lib";
import * as Clipboard from "expo-clipboard";
import Feather from "react-native-vector-icons/Feather";
import { useAtom } from "jotai";
import { TouchableOpacity } from "react-native";
import { Snackbar } from "react-native-paper";

import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import { styles } from "./styles";
import { Avatar } from "../../components/Avatar/Avatar";
import ProfileIcon from "../../assets/icons/Profile";
import vars from "../../styles/vars";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import ArrowBackIcon from "../../assets/icons/ArrowBack";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import FinancialDataGraphIcon from "../../assets/icons/FinancialDataGraph";
import LimitIcon from "../../assets/icons/Limit";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { signout } from "../../redux/auth/authSlice";
import { Seperator } from "../../components/Seperator/Seperator";
import { getLimits } from "../../redux/setting/settingSlice";
import { RootState } from "../../store";
import { getCurrency } from "../../utils/helpers";
import ProfileTab from "../../components/ProfileComponents/ProfileTab";
import SecurityTab from "../../components/ProfileComponents/SecurityTab";
import FinancialDetailsTab from "../../components/ProfileComponents/FinancialDetailsTab";
import NotificationsTab from "../../components/ProfileComponents/NotificationsTab";
import LimitsTab from "../../components/ProfileComponents/LimitsTab";
import HelpTab from "../../components/ProfileComponents/HelpTab";
import { helpTabticketParams } from "../../utils/globalStates";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Typography from "../../components/Typography";

export interface SelectOption {
  label: string;
  value: string;
}

export function Profile({ route, navigation }: any) {
  const dispatch = useDispatch();

  const profileData = useSelector(
    (state: any) => state?.profile?.profile
  )?.data;
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const [ticketParams, setTicketParams] = useAtom(helpTabticketParams);

  const [isUpdateLimitSuccess, setIsUpdateLimitSuccess] = useState<{
    state: boolean;
    isModalOpen: boolean;
  }>({ state: false, isModalOpen: false });
  const [limitTypes, setLimitTypes] = useState<string>("");
  const [tabSelection, setTabSelection] = useState<string>("");
  const [snackBarMessage, setSnackBarMessage] = useState({
    open: false,
    label: "",
    message: "",
  });

  const { data: userAccountDetails, isLoading: isloadingAccountDetails } =
    useGetAccountDetailsQuery({
      accountId: userData?.id || 0,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    });

  useEffect(() => {
    if (userData?.id) dispatch(getLimits({ account_id: userData.id }) as any);
  }, [userData]);

  useEffect(() => {
    if (ticketParams?.tabSelectionRoute === "Help") {
      setTabSelection("Help");
    }
  }, [ticketParams]);

  const handleShowTab = (tab: string): void => {
    setTabSelection(tab);
  };

  const handleCopyToClipboard = async (textData: string) => {
    await Clipboard.setStringAsync(textData || "");
    setSnackBarMessage({
      open: true,
      label: "Ok",
      message: "Copied text from clipboard",
    });
  };

  const cleanUpTabSelection = () => setTabSelection("");

  const handleCloseBottomSheet = (): void => {
    setTicketParams({
      tabSelectionRoute: "",
      isOpenBottomSheet: false,
      passedTicketType: "",
      transactionReferenceNumber: "",
    });
  };

  const displayTabSelection = () => {
    switch (tabSelection) {
      case "Edit profile": {
        return <ProfileTab />;
      }
      case "Security": {
        return <SecurityTab />;
      }
      case "Financial data": {
        return <FinancialDetailsTab />;
      }
      case "Notifications": {
        return <NotificationsTab cleanUpTabSelection={cleanUpTabSelection} />;
      }
      case "Limits": {
        return <LimitsTab cleanUpTabSelection={cleanUpTabSelection} />;
      }
      case "Help": {
        return (
          <HelpTab
            isOpenBottomSheet={ticketParams.isOpenBottomSheet}
            passedTicketType={ticketParams.passedTicketType}
            transactionReferenceNumber={ticketParams.transactionReferenceNumber}
            handleCloseBottomSheet={handleCloseBottomSheet}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <MainLayout navigation={navigation}>
        <Spinner visible={isloadingAccountDetails} />
        <SuccessModal
          isOpen={isUpdateLimitSuccess.isModalOpen}
          isError={!isUpdateLimitSuccess.state}
          title={isUpdateLimitSuccess.state ? "Success" : "Error"}
          text={
            isUpdateLimitSuccess.state
              ? `${limitTypes} are on the process to update.`
              : "Something went wrong"
          }
          onClose={() =>
            setIsUpdateLimitSuccess({
              state: false,
              isModalOpen: false,
            })
          }
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView nestedScrollEnabled style={{ flexGrow: 1 }}>
            <View style={{ backgroundColor: vars["light-grey"] }}>
              {tabSelection === "" && (
                <Fragment>
                  <View style={[styles.headerProfile, styles.borderRadiusBox]}>
                    <View style={styles.headerProfileLeft}>
                      {profileData?.userProfile?.profileimage ? (
                        <Avatar
                          isBase64Image
                          src={profileData?.userProfile?.profileimage}
                          fileUpload
                          size="medium"
                          icon={false}
                        />
                      ) : null}
                      <View style={{ marginLeft: 8 }}>
                        <Typography color="#086AFB" fontSize={14}>
                          Hello
                        </Typography>
                        <Typography
                          color="#000000"
                          fontSize={20}
                          fontWeight="bold"
                          padding={0}
                          marginTop={-6}
                        >
                          {profileData?.first_name}
                        </Typography>
                      </View>
                    </View>
                    <View style={styles.headerProfileRight}>
                      <Button
                        leftIcon={<ProfileIcon color="pink" size={14} />}
                        color="light-pink"
                        onPress={() => handleShowTab("Edit profile")}
                      >
                        Edit profile
                      </Button>
                    </View>
                  </View>
                  <View style={{ margin: 10 }}>
                    {userAccountDetails?.data?.info?.iban ? (
                      <View
                        style={[
                          styles.boxIncomeDetails,
                          styles.borderRadiusBox,
                        ]}
                      >
                        <Typography fontSize={12} color="medium-grey2">
                          IBAN
                        </Typography>
                        <View style={styles.textIbanBicCurrencyContainer}>
                          <Typography fontSize={16} color="#000000">
                            {userAccountDetails?.data?.info?.iban}
                          </Typography>
                          <TouchableOpacity
                            onPress={() =>
                              handleCopyToClipboard(
                                userAccountDetails?.data?.info?.iban
                              )
                            }
                          >
                            <View>
                              <CopyClipboard color="blue" size={16} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}

                    <View style={{ marginTop: 10 }}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        {userAccountDetails?.data?.info?.bic ? (
                          <View
                            style={[
                              styles.boxIncomeDetails,
                              {
                                flexGrow: 1,
                              },
                              styles.borderRadiusBox,
                            ]}
                          >
                            <Typography fontSize={12} color="medium-grey2">
                              BIC
                            </Typography>
                            <View style={styles.textIbanBicCurrencyContainer}>
                              <Typography fontSize={16} color="#000000">
                                {userAccountDetails?.data?.info?.bic}
                              </Typography>
                              <TouchableOpacity
                                onPress={() =>
                                  handleCopyToClipboard(
                                    userAccountDetails?.data?.info?.bic
                                  )
                                }
                              >
                                <View>
                                  <CopyClipboard color="blue" size={16} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                        {userAccountDetails?.data?.curbal ? (
                          <View
                            style={[
                              styles.boxIncomeDetails,
                              {
                                flexGrow: 4,
                              },
                              styles.borderRadiusBox,
                            ]}
                          >
                            <Typography fontSize={12} color="medium-grey2">
                              Amount:
                            </Typography>
                            <View style={styles.textIbanBicCurrencyContainer}>
                              <View style={styles.currencyContainer}>
                                <Typography fontSize={16} color="#000000">
                                  {getCurrency(
                                    userAccountDetails?.data?.currency
                                  )}
                                </Typography>
                                <Typography fontSize={16} color="#000000">
                                  {userAccountDetails?.data?.curbal}
                                </Typography>
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  handleCopyToClipboard(
                                    userAccountDetails?.data?.curbal
                                  )
                                }
                              >
                                <View>
                                  <CopyClipboard color="blue" size={16} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                  <Pressable>
                    <Seperator
                      backgroundColor={vars["grey"]}
                      width="100%"
                      marginTop={28}
                    />
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Security");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <MaterialIcons
                                color="#086afb"
                                size={20}
                                name={"lock-outline"}
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={"600"}
                              marginLeft={8}
                            >
                              Security
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Financial data");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <FinancialDataGraphIcon
                                color="#086afb"
                                size={16}
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={"600"}
                              marginLeft={8}
                            >
                              Financial data
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Notifications");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <Feather color="#086afb" size={16} name="bell" />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={"600"}
                              marginLeft={8}
                            >
                              Notifications
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Limits");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <LimitIcon color="#086afb" size={18} />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={"600"}
                              marginLeft={8}
                            >
                              Limits
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleShowTab("Help");
                        }}
                      >
                        <View style={styles.buttonNavigationContainer}>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <Feather
                                color="#086afb"
                                size={18}
                                name="life-buoy"
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={"600"}
                              marginLeft={8}
                            >
                              Help
                            </Typography>
                          </View>
                          <View style={{ paddingRight: 12 }}>
                            <ArrowRightIcon color="#086afb" size={16} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />

                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(signout());
                        }}
                      >
                        <View>
                          <View style={styles.buttonNavigation}>
                            <View>
                              <MaterialIcons
                                color="#e7038e"
                                size={20}
                                name={"logout"}
                              />
                            </View>
                            <Typography
                              fontSize={18}
                              fontWeight={"600"}
                              marginLeft={8}
                            >
                              Logout
                            </Typography>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Seperator backgroundColor={vars["grey"]} width="100%" />
                  </Pressable>
                </Fragment>
              )}
              {tabSelection !== "" ? (
                <Fragment>
                  <View
                    style={[
                      styles.containerTab,
                      {
                        overflow: "hidden",
                      },
                    ]}
                  >
                    <View
                      style={{
                        backgroundColor: "#fff",
                        ...Platform.select({
                          ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 1, height: 3 },
                            shadowOpacity: 0.2,
                          },
                          android: {
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            elevation: 5,
                          },
                        }),
                      }}
                    >
                      <TouchableOpacity onPress={() => setTabSelection("")}>
                        <View style={styles.containerBackBtn}>
                          <View style={styles.btnBack}>
                            <ArrowBackIcon color="blue" size={14} />
                          </View>
                          <Typography
                            fontSize={18}
                            fontWeight={"600"}
                            fontFamily="Nunito-SemiBold"
                          >
                            {tabSelection}
                          </Typography>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {displayTabSelection()}
                </Fragment>
              ) : null}
            </View>
          </ScrollView>
        </SafeAreaView>
      </MainLayout>
      <Snackbar
        visible={snackBarMessage.open}
        onDismiss={() =>
          setSnackBarMessage({ open: false, label: "", message: "" })
        }
        action={{
          label: "Ok",
          onPress: () => {
            setSnackBarMessage({ open: false, label: "", message: "" });
          },
        }}
        duration={3000}
      >
        <View>
          <Typography fontFamily="Nunito-Regular" fontSize={14} color="#fff">
            {snackBarMessage.message}
          </Typography>
        </View>
      </Snackbar>
    </Fragment>
  );
}
