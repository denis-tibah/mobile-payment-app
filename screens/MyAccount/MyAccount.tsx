import { useEffect, useState, useRef, Fragment } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  Switch,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { subDays, format } from "date-fns";
import Animated from "react-native-reanimated";

import MainLayout from "../../layout/Main";
import { styles } from "./style";
import Typography from "../../components/Typography";
import { RootState } from "../../store";
import {
  getCurrency,
  formatCurrencyToLocalEnTwo,
  arrayChecker,
} from "../../utils/helpers";
import TransactionByDateTwo from "../../components/TransactionItem/TransactionByDateTwo";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import { useLazyGetTransactionsQuery } from "../../redux/transaction/transactionV2Slice";
import AccordionItem from "../../components/AccordionItem";
import ProgressClock from "../../assets/icons/ProgressClock";
import FaceIdIcon from "../../assets/icons/FaceId";
import TransactionsLeftRightIcon from "../../assets/icons/TransactionsLeftRight";
import WholeContainer from "../../layout/WholeContainer";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export function MyAccount({ navigation }: any) {
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const currentDate = new Date();
  const refRBSheet = useRef();

  const transactionsParams = ({ status, limit }: any) => {
    const pastDate = subDays(currentDate, 90);
    const formattedPastDate = format(pastDate, "yyyy-MM-dd");

    return {
      accountId: userData?.id || 0,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
      status,
      direction: "desc",
      limit: limit || 10,
      page: 1,
      from_date: formattedPastDate,
      to_date: currentDate.toISOString().split("T")[0],
      group_date: true,
    };
  };

  //changed Processing to Pending by Aristos 9-04-2024
  /* const {
    data: dataTransactionsProcessing,
    isLoading: isloadingTransactionsProcessing,
    refetch: refetchTransactionsProcessing,
  } = useGetTransactionsQuery(transactionsParams({ status: "PROCESSING" }), {
    skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
  });
  const groupedByDateTransactionsProcessing =
    dataTransactionsProcessing?.transactions_grouped_by_date; */

  const [
    getPendingTransactions,
    {
      data: dataPendingTransactions,
      isLoading: isloadingPendingTransactions,
      isFetching: isFetchingPendingTransactions,
      isSuccess: isSuccessPendingTransactions,
    },
  ] = useLazyGetTransactionsQuery();
  const groupedByDateTransactionsPending =
    dataPendingTransactions?.transactions_grouped_by_date;

  const [
    getCompletedTransactions,
    {
      data: dataTransactionsCompleted,
      isLoading: isloadingCompletedTransactions,
      isFetching: isFetchingCompletedTransactions,
      isSuccess: isSuccessTransactionsCompleted,
    },
  ] = useLazyGetTransactionsQuery();
  const groupedByDateTransactionsCompleted =
    dataTransactionsCompleted?.transactions_grouped_by_date;

  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });

  const [storageData, setStorageData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [triggerBiometric, setTriggerBiometric] = useState(false);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  const [enableBiometric, setEnableBiometric] = useState<boolean>(false);
  const [
    pageCompletedTransactionsProperties,
    setPageCompletedTransactionsProperties,
  ] = useState<any>({});
  const [
    pagePendingTransactionsProperties,
    setPagePendingTransactionsProperties,
  ] = useState<any>({});
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  useEffect(() => {
    const handleGetBiometricStatus = async () => {
      const enableBiometric = await SecureStore.getItemAsync("enableBiometric");
      setEnableBiometric(
        enableBiometric !== null ? JSON.parse(enableBiometric) : false
      );
    };
    handleGetBiometricStatus();
  }, []);

  useEffect(() => {
    // getCompletedTransactions(
    //   transactionsParams({ status: "SUCCESS", limit: 10 })
    // );
    // getPendingTransactions(
    //   transactionsParams({ status: "PENDING", limit: 10 })
    // );

    setTimeout(() => {
      setTriggerBiometric(true);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleBiometricStatus = async (enableBiometric: boolean) => {
      await SecureStore.setItemAsync(
        "enableBiometric",
        JSON.stringify(enableBiometric)
      );
    };
    handleBiometricStatus(enableBiometric);
  }, [enableBiometric]);

  useEffect(() => {
    const getUserEmailPassword = async () => {
      const email = await SecureStore.getItemAsync("user_email");
      const password = await SecureStore.getItemAsync("user_password");
      if (email && password) {
        setStorageData({
          email,
          password,
        });
      }
    };
    if (triggerBiometric) {
      getUserEmailPassword();
    }
  }, [triggerBiometric]);

  useEffect(() => {
    if (triggerBiometric) {
      if (
        !isloadingPendingTransactions &&
        !isloadingCompletedTransactions &&
        !enableBiometric
      ) {
        refRBSheet?.current?.open();
      }
    }
  }, [
    triggerBiometric,
    isloadingPendingTransactions,
    isloadingCompletedTransactions,
  ]);

  useEffect(() => {
    if (!isloadingCompletedTransactions && isSuccessTransactionsCompleted) {
      const copyCardOrTransactionsWithFilter = {};
      Object.assign(copyCardOrTransactionsWithFilter, {
        ...dataTransactionsCompleted,
      });
      delete copyCardOrTransactionsWithFilter.transactions_grouped_by_date;
      setPageCompletedTransactionsProperties({
        ...copyCardOrTransactionsWithFilter,
      });
    }

    if (!isloadingPendingTransactions && isSuccessPendingTransactions) {
      const copyCardOrTransactionsWithFilter = {};
      Object.assign(copyCardOrTransactionsWithFilter, {
        ...dataPendingTransactions,
      });
      delete copyCardOrTransactionsWithFilter.transactions_grouped_by_date;
      setPagePendingTransactionsProperties({
        ...copyCardOrTransactionsWithFilter,
      });
    }
  }, [
    isloadingCompletedTransactions,
    isSuccessTransactionsCompleted,
    dataTransactionsCompleted,
    isloadingPendingTransactions,
    isSuccessPendingTransactions,
    dataPendingTransactions,
  ]);

  useEffect(() => {
    if (pageCompletedTransactionsProperties?.limit) {
      const params = transactionsParams({
        status: "SUCCESS",
        limit: pageCompletedTransactionsProperties?.limit,
      });
      getCompletedTransactions(params);
    }
    if (pagePendingTransactionsProperties?.limit) {
      const params = transactionsParams({
        status: "PENDING",
        limit: pagePendingTransactionsProperties?.limit,
      });
      getPendingTransactions(params);
    }
  }, [pageCompletedTransactionsProperties, pagePendingTransactionsProperties]);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 30;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const gameItemExtractorKey = (item: any, index: any) => {
    return index.toString();
  };

  const renderTransactionList = (list: any) => {
    return (
      <Fragment>
        <TransactionByDateTwo
          key={list?.item?.date}
          shownData={{
            date: list?.item?.date,
            totalAmount: list?.item.closing_balance,
            currency: list?.item.transactions[0].currency,
          }}
          transactionsByDate={list?.item?.transactions}
          totalAmount={list?.item.closing_balance}
        />
      </Fragment>
    );
  };

  const displayListItems = (isLoading: any, items: any): JSX.Element | null => {
    if (isLoading) {
      return (
        <View style={styles.listHead}>
          <Typography
            fontFamily="Nunito-Regular"
            fontWeight={"600"}
            fontSize={14}
          >
            Loading...
          </Typography>
        </View>
      );
    }
    if (
      !isLoading &&
      ((arrayChecker(items) && items.length === 0) ||
        (items && Object.keys(items).length === 0))
    ) {
      return (
        <View style={styles.listHead}>
          <Typography
            fontFamily="Nunito-Regular"
            fontWeight={"600"}
            fontSize={14}
          >
            No Transactions Found
          </Typography>
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: 6 }}>
        {/* {items &&
            arrayChecker(items) &&
            items.length > 0 &&
            items.map((item: any) => {
              return (
                <TransactionByDateTwo
                  key={item?.date}
                  shownData={{
                    date: item.date,
                    totalAmount: item.closing_balance,
                    currency: item.transactions[0].currency,
                  }}
                  transactionsByDate={item.transactions}
                  totalAmount={item.closing_balance}
                />
              );
            })} */}
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={items && arrayChecker(items) && items.length > 0 ? items : []}
          keyExtractor={gameItemExtractorKey}
          renderItem={(item) => (
            <View style={{ flex: 1 }}>{renderTransactionList(item)}</View>
          )}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <Fragment>
      <MainLayout navigation={navigation}>
        <Spinner
          visible={
            isloadingPendingTransactions ||
            isloadingCompletedTransactions ||
            isFetchingCompletedTransactions ||
            isFetchingPendingTransactions
          }
        />
        <ScrollView
          bounces={true}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                getPendingTransactions(
                  transactionsParams({ status: "PENDING", limit: 10 })
                );
                getCompletedTransactions(
                  transactionsParams({ status: "SUCCESS", limit: 10 })
                );
              }}
            />
          }
          onScrollEndDrag={({ nativeEvent }) => {
            const currentScrollPosition = nativeEvent.contentOffset.y;
            if (currentScrollPosition > prevScrollPosition) {
              if (isCloseToBottom(nativeEvent)) {
                if (
                  pageCompletedTransactionsProperties?.to &&
                  pageCompletedTransactionsProperties?.total
                ) {
                  if (
                    pageCompletedTransactionsProperties?.to <
                    pageCompletedTransactionsProperties?.total
                  ) {
                    const parsedPagePropertiesTo = parseInt(
                      pageCompletedTransactionsProperties?.to,
                      10
                    );
                    const addedPagePropertiesTo = parsedPagePropertiesTo + 10;
                    setPageCompletedTransactionsProperties({
                      ...pageCompletedTransactionsProperties,
                      limit: addedPagePropertiesTo,
                    });
                  }
                }

                if (
                  pagePendingTransactionsProperties?.to &&
                  pagePendingTransactionsProperties?.total
                ) {
                  if (
                    pagePendingTransactionsProperties?.to <
                    pagePendingTransactionsProperties?.total
                  ) {
                    const parsedPagePropertiesTo = parseInt(
                      pagePendingTransactionsProperties?.to,
                      10
                    );
                    const addedPagePropertiesTo = parsedPagePropertiesTo + 10;
                    setPagePendingTransactionsProperties({
                      ...pagePendingTransactionsProperties,
                      limit: addedPagePropertiesTo,
                    });
                  }
                }
              } else {
                console.log("scrolling up");
              }
            }
            setPrevScrollPosition(currentScrollPosition);
          }}
          scrollEventThrottle={64}
        >
          <View style={styles.balancesContainer}>
            <View
              style={[
                styles.balanceItem,
                {
                  width: "37.33%",
                },
              ]}
            >
              <View style={{ paddingTop: 4, paddingLeft: 6 }}>
                <Typography
                  color={"medium-grey2"}
                  fontWeight={"400"}
                  fontSize={12}
                >
                  Current Balance
                </Typography>
                <Typography
                  color={"accent-pink"}
                  fontWeight={"800"}
                  fontSize={18}
                >
                  {`${getCurrency(
                    userAccountInformation?.data?.currency || 0
                  )} ${
                    formatCurrencyToLocalEnTwo(
                      userAccountInformation?.data?.curbal
                    ) || "0.00"
                  }`}
                </Typography>
              </View>
              <View
                style={[
                  styles.balanceItemBorderColor,
                  { backgroundColor: "#E7038E" },
                ]}
              />
            </View>
            <View style={[styles.balanceItem, { width: "26.33%" }]}>
              <View style={{ paddingTop: 4, paddingLeft: 6 }}>
                <Typography
                  color={"medium-grey2"}
                  fontWeight={"400"}
                  fontSize={12}
                >
                  Pending
                </Typography>
                <Typography
                  color={"accent-orange"}
                  fontWeight={"800"}
                  fontSize={18}
                >
                  {`${getCurrency(
                    userAccountInformation?.data?.currency || 0
                  )} ${
                    formatCurrencyToLocalEnTwo(
                      userAccountInformation?.data?.blocked_amount
                    ) || "0.00"
                  }`}
                </Typography>
              </View>
              <View
                style={[
                  styles.balanceItemBorderColor,
                  { backgroundColor: "#FBB445" },
                ]}
              />
            </View>
            <View style={[styles.balanceItem, { width: "37.33%" }]}>
              <View style={{ paddingTop: 4, paddingLeft: 6 }}>
                <Typography
                  color={"medium-grey2"}
                  fontWeight={"400"}
                  fontSize={12}
                >
                  Available Balance
                </Typography>
                <Typography
                  color={"accent-green"}
                  fontWeight={"800"}
                  fontSize={18}
                >
                  {`${getCurrency(
                    userAccountInformation?.data?.currency || 0
                  )} ${
                    formatCurrencyToLocalEnTwo(
                      userAccountInformation?.data?.avlbal
                    ) || "0.00"
                  }`}
                </Typography>
              </View>
              <View
                style={[
                  styles.balanceItemBorderColor,
                  { backgroundColor: "#0DCA9D" },
                ]}
              />
            </View>
          </View>
          <View>
            <View>
              <AccordionItem
                title="Pending"
                iconColor="#FBB445"
                iconSize={28}
                isOpenByDefault
                IconLeft={() => <ProgressClock color="#FBB445" size={18} />}
              >
                <View style={styles.accordionBodyContainer}>
                  {displayListItems(
                    isloadingPendingTransactions,
                    groupedByDateTransactionsPending
                  )}
                </View>
              </AccordionItem>
              <AccordionItem
                title="Latest transactions"
                iconColor="#E7038E"
                iconSize={28}
                isOpenByDefault
                IconLeft={() => (
                  <TransactionsLeftRightIcon color="#E7038E" size={18} />
                )}
              >
                <View style={styles.accordionBodyContainer}>
                  {displayListItems(
                    isloadingCompletedTransactions,
                    groupedByDateTransactionsCompleted
                  )}
                </View>
              </AccordionItem>
            </View>
          </View>
        </ScrollView>
      </MainLayout>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: dimensions.window.height - 370,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View>
          <WholeContainer>
            <View
              style={{
                paddingVertical: 4,
              }}
            >
              <Typography fontSize={18} marginLeft={8} fontWeight={"600"}>
                Turn on the biometric authentication
              </Typography>
            </View>
          </WholeContainer>
          <View>
            <Seperator
              borderColor={vars["grey"]}
              marginTop={18}
              borderWidth={0.5}
            />
          </View>
          <WholeContainer>
            <View style={{ paddingVertical: 22 }}>
              <Typography
                fontSize={14}
                fontWeight={"600"}
                color={vars["medium-grey2"]}
              >
                For security reason we suggest to turn on the biometric
                authentication
              </Typography>
            </View>
            <View>
              <View style={styles.faceIdContainer}>
                <View style={styles.faceIdIconContainer}>
                  <FaceIdIcon size={20} color="blue" />
                  <Typography fontSize={16}>Use FaceID next time</Typography>
                </View>
                <View
                  style={{
                    marginTop: 18,
                  }}
                >
                  <Switch
                    trackColor={{
                      true: "#81b0ff",
                      false: "#DDDDDD",
                    }}
                    thumbColor="#808080"
                    style={{ marginTop: -24 }}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(e) => {
                      setEnableBiometric(e);
                    }}
                    value={enableBiometric}
                  />
                </View>
              </View>
            </View>
            <View style={{ paddingTop: 22 }}>
              <Typography fontSize={16} color={vars["accent-pink"]}>
                Learn more about biometric authentication
              </Typography>
            </View>
          </WholeContainer>
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
}
