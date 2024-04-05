import { Fragment, useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Text,
} from "react-native";
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
import {
  SearchFilter,
  clearTransactions,
  setTransationsData,
} from "../../redux/transaction/transactionSlice";
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
  widthGlobal,
  wp,
} from "../../utils/helpers";
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
  limit: 500,
  page: 1,
  group_date: false,
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

  const [
    getTransactionsWithFilter,
    { data: transactionsWithFilter, isLoading: isLoadingTransations },
  ] = useLazyGetTransactionsQuery();

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
    { data: cardTransactions, isLoading: isLoadingCardTransactions },
  ] = useLazyGetCardTransactionsQuery();

  const fetchTransactionsWithFilters = async (value?: SearchFilter) => {
    if (userData && userData?.id) {
      let search: SearchFilter = {
        ...(value ? value : initialSearchFieldData),
        accountId: `${userData?.id}`,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      };
      getTransactionsWithFilter(search)
        .then((res) => {
          if (res.data) {
            const { data: _transactions } = res;
            dispatch<any>(setTransationsData(_transactions));
          }
        })
        .catch((err) => {
          console.log("error");
          console.log({ err });
        })
        .finally(() => {
          setIsLoading(false);
        });
      setSearchFieldData(search);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTransactionsWithFilters();
    dispatch<any>(setIsCardTransactionShown(false));
    return () => {
      clearFilter();
      dispatch<any>(clearTransactions());
    };
  }, []);

  useEffect(() => {
    if (
      (!searchFieldData?.card_id || searchFieldData?.card_id === "") &&
      transactionsWithFilter?.transactions_grouped_by_date &&
      arrayChecker(transactionsWithFilter?.transactions_grouped_by_date)
    ) {
      setTransactionsList([
        ...transactionsWithFilter?.transactions_grouped_by_date,
      ]);
    }
    if (searchFieldData?.card_id) {
      if (
        cardTransactions?.data?.transactions &&
        arrayChecker(cardTransactions?.data?.transactions)
      ) {
        setTransactionsList([...cardTransactions?.data?.transactions]);
      } else {
        setTransactionsList([]);
      }
    }
  }, [
    transactionsWithFilter?.transactions_grouped_by_date,
    cardTransactions?.data?.transactions,
    searchFieldData?.card_id,
  ]);

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
    const cardTransactionsFilter = {
      account_id: userData?.id,
      from_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2))
        .toISOString()
        .split("T")[0],
      to_date: new Date().toISOString().split("T")[0],
      group_date: true,
      limit: 100,
      page: 1,
      type: "ALL",
      card_id: cardId,
    };

    getCartTransactions(cardTransactionsFilter)
      .catch((err) => {
        console.log("error");
        console.log({ err });
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    if (key === "min_amount") {
      if (searchFieldData.max_amount && amount > searchFieldData.max_amount) {
        alert("Amount from should be less than Amount to");
        return;
      }
    } else {
      if (searchFieldData.min_amount && amount < searchFieldData.min_amount) {
        alert("Amount to should be greater than Amount from");
        return;
      }
    }
    setSearchFieldData({
      ...searchFieldData,
      [key]: amount,
    });
  };

  /* const handlePreviousPage = () => {
    if (currentPage > 1) {
      const _currentPage = currentPage - 1;
      fetchTransactionsWithFilters({
        ...searchFieldData,
        page: _currentPage,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      const _currentPage = currentPage + 1;
      fetchTransactionsWithFilters({
        ...searchFieldData,
        page: _currentPage,
      });
    }
  }; */

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

  const displayListItems = () => {
    if (isLoadingTransations || isLoadingCardTransactions) {
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
      return transactionsList.map((tx: any) => {
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
      });
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
          <ScrollView horizontal>
            {listOfActiveCards?.map((card: any, index: number) => (
              <TouchableOpacity
                style={{
                  backgroundColor: handleBackgroundChangeActiveInactive(card),
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 99,
                  marginHorizontal: 3,
                  width: 151,
                  height: 40,
                }}
                onPress={() => {
                  if (searchFieldData.card_id === card.cardreferenceId) {
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
                    card_id: card.cardreferenceId,
                  });
                }}
              >
                <Typography
                  fontSize={14}
                  color={
                    searchFieldData.card_id === card.cardreferenceId
                      ? "#fff"
                      : card.cardStatus === CardStatus.INACTIVE
                      ? vars["accent-yellow"]
                      : card.lostYN === "N"
                      ? card.type === "P"
                        ? vars["accent-blue"]
                        : vars["accent-pink"]
                      : vars["accent-grey"]
                  }
                >
                  {card.pan}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
        visible={isLoadingTransations || isLoadingCardTransactions || isLoading}
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
          {/* <Seperator backgroundColor={vars["grey"]} />
          {!isCardTransactionShown && (
            <View style={{ bottom: 0 }}>
              <Pagination
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                page={currentPage || 0}
                lastPage={lastPage || 0}
              />
            </View>
          )} */}
        </View>
      </ScrollView>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={550}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
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
        <Divider
          style={{
            marginVertical: 8,
            width: widthGlobal,
            backgroundColor: vars["accent-grey"],
            height: 1,
            opacity: 0.3,
            overflow: "visible",
          }}
        />
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1, flexWrap: "wrap" }}>
            <Typography fontSize={14} color="#696F7A">
              Start date
            </Typography>
            <Button
              style={{
                width: 131,
                backgroundColor: "gey",
                marginTop: 1,
                lineHeight: 25,
                borderWidth: 1,
                borderColor: vars["accent-blue"],
              }}
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
              disabled={
                searchFieldData.card_id !== "" && isCardTransactionShown
              }
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
              style={{
                width: 131,
                backgroundColor: "grey",
                marginTop: 1,
                lineHeight: 25,
                borderWidth: 1,
                borderColor: vars["accent-blue"],
              }}
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
              disabled={
                searchFieldData.card_id !== "" && isCardTransactionShown
              }
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
        <Divider
          style={{
            marginVertical: 15,
            width: widthGlobal,
            backgroundColor: vars["accent-grey"],
            height: 1,
            opacity: 0.2,
            overflow: "visible",
          }}
        />
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
          {/* two input fields for amount range: amount from and amount to */}
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
              icon={
                // icon EUR
                <Euro />
              }
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
        <Divider
          style={{
            marginVertical: 15,
            width: widthGlobal,
            backgroundColor: vars["accent-grey"],
            height: 1,
            opacity: 0.2,
            overflow: "visible",
          }}
        />
        {displayCardList()}
        <Divider
          style={{
            marginVertical: 15,
            width: widthGlobal,
            backgroundColor: vars["accent-grey"],
            height: 1,
            opacity: 0.2,
            overflow: "visible",
          }}
        />
        <Button
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            backgroundColor: "grey",
            marginTop: 10,
            lineHeight: 25,
            borderColor: "none",
          }}
          color="light-pink"
          leftIcon={
            <AntDesign
              name="checkcircleo"
              size={16}
              color={vars["accent-pink"]}
            />
          }
          onPress={() => {
            setIsLoading(true);
            refRBSheet?.current?.close();
            !isCardTransactionShown
              ? fetchTransactionsWithFilters(searchFieldData)
              : handleFetchCardTransactions(
                  searchFieldData.card_id ||
                    activeCard?.cardreferenceId.toString()
                );
          }}
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
