import { useEffect, useState, useRef, Fragment } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";

import MainLayout from "../../layout/Main";
import { styles } from "./style";
import Typography from "../../components/Typography";
import { RootState } from "../../store";
import {
  getCurrency,
  formatCurrencyToLocalEnTwo,
  arrayChecker,
} from "../../utils/helpers";
import Spinner from "react-native-loading-spinner-overlay/lib";
import TransactionByDateTwo from "../../components/TransactionItem/TransactionByDateTwo";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import { useGetTransactionsQuery } from "../../redux/transaction/transactionV2Slice";
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

  const transactionsParams = ({ status }: any) => {
    return {
      accountId: userData?.id || 0,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
      status,
      direction: "desc",
      limit: 100,
      page: 1,
      sort: "date",
      from_date: "2023-11-01",
      to_date: currentDate.toISOString().split("T")[0],
      group_date: true,
    };
  };

  const {
    data: dataTransactionsPending,
    isLoading: isloadingTransactionsPending,
    isUninitialized: isUninitializedTransactionsPending,
    refetch: refetchTransactionsPending,
  } = useGetTransactionsQuery(transactionsParams({ status: "PROCESSING" }), {
    skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
  });
  const groupedByDateTransactionsPending =
    dataTransactionsPending?.transactions_grouped_by_date;

  const {
    data: dataTransactionsCompleted,
    isLoading: isloadingTransactionsCompleted,
    isUninitialized: isUninitializedTransactionsCompleted,
    refetch: refetchTransactionsCompleted,
  } = useGetTransactionsQuery(transactionsParams({ status: "SUCCESS" }), {
    skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
  });
  const groupedByDateTransactionsCompleted =
    dataTransactionsCompleted?.transactions_grouped_by_date;

  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });

  const refRBSheet = useRef();

  const [refreshing, setRefreshing] = useState<boolean>(false);
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
    const handleBiometricStatus = async (enableBiometric: boolean) => {
      await SecureStore.setItemAsync(
        "enableBiometric",
        JSON.stringify(enableBiometric)
      );
    };
    handleBiometricStatus(enableBiometric);
  }, [enableBiometric]);

  /* const handlePreviousPage = () => {
    if (currentPage > 1) {
      const _currentPage = currentPage - 1;
      fetchTransactions({ pageNumber: _currentPage });
    }
  }; */

  /*   const handleNextPage = () => {
    if (currentPage < lastPage) {
      const _currentPage = currentPage + 1;
      fetchTransactions({ pageNumber: _currentPage });
    }
  }; */

  useEffect(() => {
    setTimeout(() => {
      setTriggerBiometric(true);
    }, 1000);
  }, []);

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
        !isloadingTransactionsPending &&
        !isloadingTransactionsCompleted &&
        !enableBiometric
      ) {
        refRBSheet?.current?.open();
      }
    }
  }, [
    triggerBiometric,
    isloadingTransactionsPending,
    isloadingTransactionsCompleted,
  ]);

  const displayListItems = (isLoading: any, items: any): JSX.Element | null => {
    if (isLoading) {
      return (
        <View style={styles.listHead}>
          <Typography
            fontFamily="Nunito-Regular"
            fontWeight={600}
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
            fontWeight={600}
            fontSize={14}
          >
            No Transactions Found
          </Typography>
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: 6 }}>
        <View>
          {items &&
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
            })}
        </View>
      </View>
    );
  };

  return (
    <Fragment>
      <MainLayout navigation={navigation}>
        <Spinner
          visible={
            /* paginateRefresh || */
            /* isLoading || */
            isloadingTransactionsPending || isloadingTransactionsCompleted
          }
        />
        <ScrollView
          bounces={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                refetchTransactionsPending();
                refetchTransactionsCompleted();
              }}
            />
          }
        >
          <View style={styles.balancesContainer}>
            <View
              style={[
                styles.balanceItem,
                { borderBottomColor: "#E7038E", width: "37.33%" },
              ]}
            >
              <Typography
                color={"medium-grey2"}
                fontWeight={400}
                fontSize={12}
                marginTop={4}
                lineHeight={14}
              >
                Current Balance
              </Typography>
              <Typography color={"accent-pink"} fontWeight={800} fontSize={18}>
                {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                  formatCurrencyToLocalEnTwo(
                    userAccountInformation?.data?.curbal
                  ) || "0.00"
                }`}
              </Typography>
            </View>
            <View
              style={[
                styles.balanceItem,
                { borderBottomColor: "#FBB445", width: "26.33%" },
              ]}
            >
              <Typography
                color={"medium-grey2"}
                fontWeight={400}
                fontSize={12}
                marginTop={4}
                lineHeight={14}
              >
                Pending
              </Typography>
              <Typography
                color={"accent-orange"}
                fontWeight={800}
                fontSize={18}
              >
                {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                  formatCurrencyToLocalEnTwo(
                    userAccountInformation?.data?.blocked_amount
                  ) || "0.00"
                }`}
              </Typography>
            </View>
            <View
              style={[
                styles.balanceItem,
                { borderBottomColor: "#0DCA9D", width: "37.33%" },
              ]}
            >
              <Typography
                color={"medium-grey2"}
                fontWeight={400}
                fontSize={12}
                marginTop={4}
                lineHeight={14}
              >
                Available Balance
              </Typography>
              <Typography color={"accent-green"} fontWeight={800} fontSize={18}>
                {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                  formatCurrencyToLocalEnTwo(
                    userAccountInformation?.data?.avlbal
                  ) || "0.00"
                }`}
              </Typography>
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
                    isloadingTransactionsPending,
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
                    isloadingTransactionsCompleted,
                    groupedByDateTransactionsCompleted
                  )}
                </View>
              </AccordionItem>
            </View>
            {/* Aristos: temp disabled this */}
            {/* <Pagination
            handlePreviousPage={handlePreviousPage}
            page={currentPage || 0}
            lastPage={lastPage || 0}
            handleNextPage={handleNextPage}
          /> */}
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
              <Typography fontSize={18} marginLeft={8} fontWeight={600}>
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
                fontWeight={600}
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
