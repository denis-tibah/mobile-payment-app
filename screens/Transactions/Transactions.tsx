import { Fragment, useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Text,
  FlatList,
  Platform,
} from "react-native";
import { responsiveHeight as rh } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Divider } from "react-native-paper";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { AntDesign } from "@expo/vector-icons";

import FormGroup from "../../components/FormGroup";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import TransactionByDateTwo from "../../components/TransactionItem/TransactionByDateTwo";
import TransactionIcon from "../../assets/icons/Transaction";
import SearchIcon from "../../assets/icons/Search";
import Euro from "../../assets/icons/Euro";
import Filter from "../../assets/icons/Filter";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { SearchFilter } from "../../redux/transaction/transactionSlice";
import { CardStatus, transactionStatusOptions } from "../../utils/constants";
import {
  useGetCardV2Query,
  useLazyGetCardTransactionsQuery,
} from "../../redux/card/cardSliceV2";
import { useLazyGetTransactionsQuery } from "../../redux/transaction/transactionV2Slice";
import { setIsCardTransactionShown } from "../../redux/card/cardSlice";
import {
  arrayChecker,
  getFormattedDateFromUnixDotted,
  hp,
  sortUserActiveToInactiveCards,
  wp,
  formattedDateForQuery,
} from "../../utils/helpers";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface DateRangeType {
  dateTo: {
    state: boolean;
    value: number | null;
  };
  dateFrom: {
    state: boolean;
    value: number | null;
  };
}

const currentDate = new Date();

const initialSearchFieldData: SearchFilter = {
  accountId: "",
  direction: "desc",
  status: "",
  from_date: "2022-01-01",
  to_date: currentDate.toISOString().split("T")[0],
  limit: 10,
  page: 1,
  group_date: true,
};

const initialDateRange: DateRangeType = {
  dateTo: {
    state: false,
    value: null,
  },
  dateFrom: {
    state: false,
    value: null,
  },
};

export function Transactions({ navigation, route }: any) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const refRBSheet = useRef<any>(null);
  const isCardTransactionShown = useSelector(
    (state: RootState) => state?.card?.isCardTransactionShown
  );

  const [isSearchTextOpen, setIsSearchTextOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFieldData, setSearchFieldData] = useState<SearchFilter>(
    initialSearchFieldData
  );
  const [showPickerDateFilter, setShowPickerDateFilter] =
    useState<DateRangeType>(initialDateRange);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [isFetchCardsInfo, setIsFetchCardInfo] = useState<boolean>(false);
  const [pageProperties, setPageProperties] = useState<any>({});
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  const [
    getTransactionsWithFilter,
    {
      data: transactionsWithFilter,
      isSuccess: isSuccessTransactionsWithFilter,
      isLoading: isLoadingTransactions,
      error: errorTransactionsWithFilter,
      isError: isErrorTransactionsWithFilter,
    },
  ] = useLazyGetTransactionsQuery();
  const { data: userCardsList, isLoading: isLoadingUserCardList } =
    useGetCardV2Query(
      {
        accountId: userData?.id,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      },
      { skip: !isFetchCardsInfo }
    );

  const [
    getCartTransactions,
    {
      data: cardTransactions,
      isLoading: isLoadingCardTransactions,
      isSuccess: isSuccessCardTransactions,
      isError: isErrorCardTransactions,
      error: errorCardTransactions,
    },
  ] = useLazyGetCardTransactionsQuery();

  const fetchTransactionsWithFilters = async (value?: SearchFilter) => {
    if (userData && userData?.id) {
      let search: SearchFilter = {
        ...(value ? value : initialSearchFieldData),
        accountId: `${userData?.id}`,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      };
      console.log("🚀 ~ fetchTransactionsWithFilters ~ search:", search);
      getTransactionsWithFilter(search);
      setSearchFieldData(search);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTransactionsWithFilters();
    dispatch<any>(setIsCardTransactionShown(false));
    return () => {
      clearFilter();
    };
  }, []);

  useEffect(() => {
    const copyCardOrTransactionsWithFilter = {};
    // fetching transaction history
    if (
      (!searchFieldData?.card_id || searchFieldData?.card_id === "") &&
      !isLoadingTransactions &&
      isSuccessTransactionsWithFilter &&
      transactionsWithFilter?.transactions_grouped_by_date &&
      arrayChecker(transactionsWithFilter?.transactions_grouped_by_date)
    ) {
      //set page transaction property for pagination
      setIsLoading(false);
      Object.assign(copyCardOrTransactionsWithFilter, {
        ...transactionsWithFilter,
      });
      delete copyCardOrTransactionsWithFilter.transactions_grouped_by_date;
      setPageProperties({ ...copyCardOrTransactionsWithFilter });

      setTransactionsList([
        ...transactionsWithFilter?.transactions_grouped_by_date,
      ]);
    }

    //fetching card transactions and card page properties
    if (searchFieldData?.card_id) {
      if (
        !isLoadingCardTransactions &&
        isSuccessCardTransactions &&
        cardTransactions?.data?.transactions &&
        arrayChecker(cardTransactions?.data?.transactions)
      ) {
        //set page card transaction property for pagination
        setIsLoading(false);
        Object.assign(copyCardOrTransactionsWithFilter, {
          ...cardTransactions?.data,
        });
        delete copyCardOrTransactionsWithFilter?.transactions;
        setPageProperties({ ...copyCardOrTransactionsWithFilter });
        setTransactionsList([...cardTransactions?.data?.transactions]);
      } else {
        setTransactionsList([]);
      }
    }
  }, [
    transactionsWithFilter?.transactions_grouped_by_date,
    cardTransactions?.data?.transactions,
    searchFieldData?.card_id,
    isLoadingTransactions,
    isLoadingCardTransactions,
    isSuccessTransactionsWithFilter,
    isSuccessCardTransactions,
  ]);

  // transaction with filter error status
  useEffect(() => {
    if (!isLoadingTransactions && isErrorTransactionsWithFilter) {
      const statusCode = errorTransactionsWithFilter?.data?.code
        ? errorTransactionsWithFilter?.data?.code
        : "";
      const errorMessage = errorTransactionsWithFilter?.data?.message
        ? errorTransactionsWithFilter?.data?.message
        : "";
      setStatusMessage({
        header: "Error",
        body: `${statusCode}${statusCode ? ": " : ""}${errorMessage}`,
        isOpen: true,
        isError: true,
      });
      setTransactionsList([]);
    }
  }, [
    isLoadingTransactions,
    isErrorTransactionsWithFilter,
    errorTransactionsWithFilter,
  ]);

  // card transaction error status
  useEffect(() => {
    if (!isLoadingCardTransactions && isErrorCardTransactions) {
      const statusCode = errorCardTransactions?.data?.code
        ? errorCardTransactions?.data?.code
        : "";
      const errorMessage =
        errorCardTransactions?.data?.errors &&
        arrayChecker(errorCardTransactions?.data?.errors) &&
        errorCardTransactions?.data?.errors.length > 0
          ? errorCardTransactions?.data?.errors[0]
          : "Something went wrong while fetching card history transactions";

      setStatusMessage({
        header: "Error",
        body: `${statusCode}${statusCode ? ": " : ""}${errorMessage}`,
        isOpen: true,
        isError: true,
      });
    }
  }, [
    isLoadingCardTransactions,
    isErrorCardTransactions,
    errorCardTransactions,
  ]);

  useEffect(() => {
    if (pageProperties?.limit) {
      const filterWithPagination = {
        ...searchFieldData,
        limit: pageProperties?.limit,
      };
      setIsLoading(true);
      if (searchFieldData?.card_id) {
        handleFetchCardTransactions(searchFieldData.card_id);
      } else {
        fetchTransactionsWithFilters(filterWithPagination);
      }
    }
  }, [pageProperties]);

  const listOfActiveCards = sortUserActiveToInactiveCards(userCardsList);
  const activeCard = listOfActiveCards?.find(
    (card: any) => card.cardStatus === CardStatus.ACTIVE
  );

  const clearFilter = () => {
    setShowPickerDateFilter(initialDateRange);
    setSearchFieldData({
      ...initialSearchFieldData,
      card_id: "",
    });
    setSearchText("");
    setTransactionsList([]);
    dispatch<any>(setIsCardTransactionShown(false));
  };

  const handleFetchCardTransactions = async (cardId: string) => {
    const dateFrom = formattedDateForQuery(
      showPickerDateFilter.dateFrom.value,
      "dateFrom"
    );
    const dateTo = formattedDateForQuery(
      showPickerDateFilter.dateTo.value,
      "dateTo"
    );
    const cardTransactionsFilter = {
      account_id: userData?.id,
      from_date: dateFrom,
      to_date: dateTo,
      group_date: true,
      limit: pageProperties?.limit || 10,
      page: 1,
      type: "ALL",
      card_id: cardId,
    };
    console.log(
      "🚀 ~ handleFetchCardTransactions ~ cardTransactionsFilter:",
      cardTransactionsFilter
    );

    getCartTransactions(cardTransactionsFilter);
  };

  const handleBackgroundChangeActiveInactive = (card: any): string => {
    if (card.cardreferenceId === searchFieldData.card_id) {
      if (card.cardStatus === CardStatus.INACTIVE) {
        return vars["accent-yellow"];
      } else if (card.lostYN === "N") {
        return card.type === "P" ? vars["accent-blue"] : vars["accent-pink"];
      } else {
        return vars["accent-grey"];
      }
    } else {
      if (card.cardStatus === CardStatus.INACTIVE) {
        return vars["light-yellow"];
      } else if (card.lostYN === "N") {
        return card.type === "P" ? vars["light-blue"] : vars["light-pink"];
      } else {
        return vars["light-grey"];
      }
    }
  };

  const handleOnChangeShowPickerDate = (
    rawTimeStamp: number,
    setState: any,
    values: any,
    key: string
  ) => {
    const { dateFrom, dateTo } = values;
    if (key === "dateFrom") {
      if (dateTo.value) {
        const fromDate = new Date(rawTimeStamp);
        const toDate = new Date(dateTo.value);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        }
      }
    } else {
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        const toDate = new Date(rawTimeStamp);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        }
      }
    }
    setState({
      ...values,
      [key]: {
        state: false,
        value: rawTimeStamp,
      },
    });
    setSearchFieldData({
      ...searchFieldData,
      [key === "dateFrom" ? "from_date" : "to_date"]: new Date(rawTimeStamp)
        .toISOString()
        .split("T")[0],
    });
  };

  const amountRangeFilter = (amount: number, key: string) => {
    const userId = userData?.id;
    if (!userId) {
      return;
    }
    setSearchFieldData({
      ...searchFieldData,
      [key]: amount,
    });
  };

  const hideDatePicker = ({ dateType }: { dateType: string }) => {
    setShowPickerDateFilter((prevState): any => {
      const dateObj = {};
      if (dateType === "dateFrom") {
        Object.assign(dateObj, {
          ...prevState,
          dateFrom: {
            state: false,
          },
        });
      }
      if (dateType === "dateTo") {
        Object.assign(dateObj, {
          ...prevState,
          dateTo: {
            state: false,
          },
        });
      }
      return { ...dateObj };
    });
  };

  const handleConfirm = ({
    date,
    dateType,
  }: {
    date: any;
    dateType: string;
  }) => {
    setShowPickerDateFilter((prevState): any => {
      const dateObj = {};
      if (dateType === "dateFrom") {
        Object.assign(dateObj, {
          ...prevState,
          dateFrom: {
            state: false,
            value: new Date(date),
          },
        });
        handleOnChangeShowPickerDate(
          date,
          setShowPickerDateFilter,
          showPickerDateFilter,
          "dateFrom"
        );
      }
      if (dateType === "dateTo") {
        Object.assign(dateObj, {
          ...prevState,
          dateTo: {
            state: false,
            value: date,
          },
        });
        handleOnChangeShowPickerDate(
          date,
          setShowPickerDateFilter,
          showPickerDateFilter,
          "dateTo"
        );
      }
      return { ...dateObj };
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

  const gameItemExtractorKey = (item: any, index: any) => {
    return index.toString();
  };

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

  const onSubmitFilterTransactions = () => {
    setIsLoading(true);
    refRBSheet?.current?.close();
    !isCardTransactionShown
      ? fetchTransactionsWithFilters(searchFieldData)
      : handleFetchCardTransactions(
          searchFieldData.card_id || activeCard?.cardreferenceId.toString()
        );
  };

  const handleSubmitFilterTransactions = () => {
    if (searchFieldData?.min_amount && searchFieldData?.max_amount) {
      if (searchFieldData?.min_amount > searchFieldData?.max_amount) {
        alert("Minimum amount should not be greater than maximum amount");
      } else {
        onSubmitFilterTransactions();
      }
    } else {
      onSubmitFilterTransactions();
    }
  };

  const renderTransactionList = (list: any) => {
    return (
      <Fragment>
        <TransactionByDateTwo
          key={list?.item?.date}
          shownData={{
            date: list?.item?.date,
            currency: !searchFieldData?.card_id
              ? list?.item?.transactions[0].currency
              : "",
          }}
          transactionsByDate={list?.item?.transactions}
          totalAmount={
            !searchFieldData?.card_id ? list?.item?.closing_balance : ""
          }
          cardId={searchFieldData?.card_id}
        />
      </Fragment>
    );
  };

  const displayListItems = () => {
    if (isLoadingTransactions) {
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

    if (transactionsList.length > 0) {
      /* return transactionsList.map((tx: any) => {
        return (
          <Fragment>
            <TransactionByDateTwo
              key={tx?.date}
              shownData={{
                date: tx?.date,
                currency: !searchFieldData?.card_id
                  ? tx?.transactions[0].currency
                  : "",
              }}
              transactionsByDate={tx?.transactions}
              totalAmount={!searchFieldData?.card_id ? tx?.closing_balance : ""}
              cardId={searchFieldData?.card_id}
            />
          </Fragment>
        );
      }); */
      return (
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={transactionsList}
          keyExtractor={gameItemExtractorKey}
          renderItem={(item) => (
            <View style={{ flex: 1 }}>{renderTransactionList(item)}</View>
          )}
          scrollEnabled={false}
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
          No transactions found
        </Typography>
      </View>
    );
  };

  const renderCardList = (card: any) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: handleBackgroundChangeActiveInactive(card?.item),
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 99,
          marginHorizontal: 3,
          width: 151,
          height: 40,
        }}
        onPress={() => {
          if (searchFieldData?.card_id === card?.item?.cardreferenceId) {
            setSearchFieldData({
              ...searchFieldData,
              card_id: "",
            });
            clearFilter();
            setIsCardTransactionShown(false);
            return;
          }
          dispatch<any>(setIsCardTransactionShown(true));
          setSearchFieldData({
            ...searchFieldData,
            group_date: true,
            card_id: card?.item?.cardreferenceId,
          });
        }}
      >
        <Typography
          fontSize={14}
          color={
            searchFieldData.card_id === card?.item?.cardreferenceId
              ? "#fff"
              : card?.item?.cardStatus === CardStatus.INACTIVE
              ? vars["accent-yellow"]
              : card?.item?.lostYN === "N"
              ? card?.item?.type === "P"
                ? vars["accent-blue"]
                : vars["accent-pink"]
              : vars["accent-grey"]
          }
        >
          {card?.item?.pan}
        </Typography>
      </TouchableOpacity>
    );
  };

  const displayCardList = () => {
    if (isLoadingUserCardList) {
      return (
        <Typography fontSize={14} color="#696F7A">
          Your cards are loading...
        </Typography>
      );
    }
    if (
      userCardsList &&
      arrayChecker(userCardsList) &&
      userCardsList.length > 0
    ) {
      return (
        <Fragment>
          <Typography fontSize={14} color="#696F7A">
            Your cards
          </Typography>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={
              listOfActiveCards &&
              arrayChecker(listOfActiveCards) &&
              listOfActiveCards.length > 0
                ? listOfActiveCards
                : []
            }
            keyExtractor={gameItemExtractorKey}
            renderItem={(item) => renderCardList(item)}
            horizontal
          />
        </Fragment>
      );
    }
    return (
      <Typography fontSize={14} color="#696F7A">
        We have problem getting cards.
      </Typography>
    );
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner
        visible={
          isLoadingTransactions || isLoadingCardTransactions || isLoading
        }
      />
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <ScrollView
        bounces={true}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: "transparent", display: "none" }}
            refreshing={false}
            onRefresh={() => {
              setIsLoading(true);
              fetchTransactionsWithFilters();
            }}
          />
        }
        onScroll={({ nativeEvent }) => {
          const currentScrollPosition = nativeEvent.contentOffset.y;
          if (currentScrollPosition > prevScrollPosition) {
            if (isCloseToBottom(nativeEvent)) {
              if (pageProperties?.to && pageProperties?.total) {
                if (pageProperties?.to < pageProperties?.total) {
                  const parsedPagePropertiesTo = parseInt(
                    pageProperties?.to,
                    10
                  );
                  const addedPagePropertiesTo = parsedPagePropertiesTo + 10;
                  setPageProperties({
                    ...pageProperties,
                    limit: addedPagePropertiesTo,
                  });
                }
              }
            }
          }
          setPrevScrollPosition(currentScrollPosition);
        }}
        scrollEventThrottle={1000}
      >
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={
              searchFieldData?.card_id
                ? "Card Transactions History"
                : "Transactions History"
            }
            rightAction={
              <View style={{ display: "flex", flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.iconFilter}
                  onPress={() => {
                    setShowPickerDateFilter(initialDateRange);
                    setSearchText("");
                    setIsFetchCardInfo(true);
                    refRBSheet?.current?.open();
                  }}
                >
                  <Filter size={14} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconFilter}
                  onPress={() => setIsSearchTextOpen(!isSearchTextOpen)}
                >
                  <SearchIcon size={14} color="blue" />
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        {isSearchTextOpen && (
          <View style={styles.searchBar}>
            <FormGroup.Input
              icon={<SearchIcon color="blue" size={18} />}
              placeholder={"Search for transactions ..."}
              color={vars["black"]}
              fontSize={14}
              fontWeight={"400"}
              style={{ width: "100%" }}
              value={searchText}
              onChangeText={(event: string) => setSearchText(event)}
              onSubmitEditing={() =>
                fetchTransactionsWithFilters({
                  ...searchFieldData,
                  name: searchText,
                })
              }
            />
          </View>
        )}
        <View style={{ backgroundColor: "#fff" }}>
          <View>{displayListItems()}</View>
        </View>
      </ScrollView>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: searchFieldData?.card_id
            ? rh(Platform.OS === "android" ? 40 : 50)
            : rh(Platform.OS === "android" ? 64 : 79),
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
          paddingHorizontal: 15,
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View style={styles.containerBottomSheetHeader}>
          <View style={{ top: hp(-3), left: wp(-3) }}>
            <Typography fontSize={18} fontFamily={"Nunito-SemiBold"}>
              Filters
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => clearFilter()}
            style={{ flexDirection: "row" }}
          >
            <Text
              style={{
                paddingRight: 5,
                fontSize: 12,
                top: hp(-2),
                fontFamily: "Nunito-SemiBold",
                color: vars["accent-blue"],
              }}
            >
              Clear filter
            </Text>
          </TouchableOpacity>
        </View>
        <Divider style={[styles.divider, { marginVertical: 8 }]} />
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1, flexWrap: "wrap" }}>
            <Typography fontSize={14} color="#696F7A">
              Start date
            </Typography>
            <Button
              style={styles.buttonStyles}
              color="black-only"
              onPress={() => {
                setShowPickerDateFilter({
                  dateTo: {
                    state: false,
                    value: showPickerDateFilter.dateTo.value,
                  },
                  dateFrom: {
                    state: true,
                    value: showPickerDateFilter.dateFrom.value,
                  },
                });
              }}
            >
              {showPickerDateFilter.dateFrom.value &&
                getFormattedDateFromUnixDotted(
                  showPickerDateFilter.dateFrom.value
                )}
            </Button>
            <DateTimePickerModal
              isVisible={showPickerDateFilter.dateFrom.state}
              mode="date"
              onConfirm={(date) =>
                handleConfirm({ date, dateType: "dateFrom" })
              }
              onCancel={() => hideDatePicker({ dateType: "dateFrom" })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Typography fontSize={14} color="#696F7A">
              Finish date
            </Typography>
            <Button
              style={styles.buttonStyles}
              color="black-only"
              onPress={() => {
                setShowPickerDateFilter({
                  dateFrom: {
                    state: false,
                    value: showPickerDateFilter.dateFrom.value,
                  },
                  dateTo: {
                    state: true,
                    value: showPickerDateFilter.dateTo.value,
                  },
                });
              }}
            >
              {showPickerDateFilter.dateTo.value &&
                getFormattedDateFromUnixDotted(
                  showPickerDateFilter.dateTo.value
                )}
            </Button>
            <DateTimePickerModal
              isVisible={showPickerDateFilter.dateTo.state}
              mode="date"
              onConfirm={(date) => handleConfirm({ date, dateType: "dateTo" })}
              onCancel={() => hideDatePicker({ dateType: "dateTo" })}
            />
          </View>
        </View>
        <Typography fontSize={10} color="#696F7A">
          maximum date range is 60 days
        </Typography>
        <Divider style={[styles.divider, { marginVertical: 15 }]} />
        {!searchFieldData?.card_id ? (
          <Fragment>
            <Typography fontSize={14} color="#696F7A">
              Status
            </Typography>
            <ScrollView
              horizontal
              style={{ display: "flex", flexDirection: "row" }}
            >
              {transactionStatusOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  disabled={
                    searchFieldData.card_id !== "" && isCardTransactionShown
                  }
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                    backgroundColor:
                      searchFieldData.status === option.value
                        ? vars[option.colorActive]
                        : vars[option.color],
                    paddingHorizontal: 18,
                    paddingVertical: 12,
                    borderRadius: 99,
                  }}
                  onPress={() => {
                    if (searchFieldData.status === option.value) {
                      setSearchFieldData({
                        ...searchFieldData,
                        status: "",
                      });
                      return;
                    }
                    setSearchFieldData({
                      ...searchFieldData,
                      status: option.value,
                    });
                  }}
                >
                  <Text
                    style={{
                      color:
                        searchFieldData.status === option.value
                          ? "#fff"
                          : vars[option.colorActive],
                      fontSize: 14,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Divider style={{ marginVertical: 15 }} />
            <View style={{ display: "flex", flexDirection: "row" }}>
              <View style={{ flex: 1, flexWrap: "wrap", paddingRight: 10 }}>
                <Typography fontSize={14} color="#696F7A">
                  Amount from
                </Typography>
                <FormGroup.Input
                  placeholder={"From"}
                  color={vars["black"]}
                  disabled={
                    searchFieldData.card_id !== "" && isCardTransactionShown
                  }
                  fontSize={14}
                  fontWeight={"400"}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: vars["accent-blue"],
                  }}
                  icon={<Euro />}
                  value={searchFieldData.min_amount}
                  onChangeText={(event: string) => {
                    amountRangeFilter(Number(event), "min_amount");
                  }}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Typography fontSize={14} color="#696F7A">
                  Amount to
                </Typography>
                <FormGroup.Input
                  placeholder={"To"}
                  color={vars["black"]}
                  disabled={
                    searchFieldData.card_id !== "" && isCardTransactionShown
                  }
                  fontSize={14}
                  fontWeight={"400"}
                  style={{
                    width: "100%",
                    borderWidth: 1,
                    borderColor: vars["accent-blue"],
                  }}
                  value={searchFieldData.max_amount}
                  onChangeText={(event: string) => {
                    amountRangeFilter(Number(event), "max_amount");
                  }}
                  icon={<Euro />}
                />
              </View>
            </View>
            <Divider style={[styles.divider, { marginVertical: 15 }]} />
          </Fragment>
        ) : null}
        {displayCardList()}
        <Divider style={[styles.divider, { marginVertical: 15 }]} />
        <Button
          style={styles.submitButton}
          color="light-pink"
          leftIcon={
            <AntDesign
              name="checkcircleo"
              size={16}
              color={vars["accent-pink"]}
            />
          }
          onPress={handleSubmitFilterTransactions}
        >
          <Typography
            fontSize={16}
            color={vars["accent-pink"]}
            fontFamily="Nunito-Regular"
            fontWeight={"600"}
          >
            Submit
          </Typography>
        </Button>
      </SwipableBottomSheet>
    </MainLayout>
  );
}
