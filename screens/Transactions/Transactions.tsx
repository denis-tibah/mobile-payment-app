import { Fragment, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import FormGroup from "../../components/FormGroup";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import { styles } from "./styles";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import TransactionIcon from "../../assets/icons/Transaction";
import SearchIcon from "../../assets/icons/Search";
import {
  SearchFilter,
  clearTransactions,
  setTransationsData,
} from "../../redux/transaction/transactionSlice";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import LoadingScreen from "../../components/Loader/LoadingScreen";
/* import Pagination from "../../components/Pagination/Pagination"; */
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";
import {
  formatDateDayMonthYear,
  getUserActiveCards,
  groupedByDateTransactions,
  hp,
  sortUserActiveToInactiveCards,
  widthGlobal,
  wp,
} from "../../utils/helpers";
import { CardStatus, transactionStatusOptions } from "../../utils/constants";
import { Text } from "react-native";
import BottomSheet from "../../components/BottomSheet";
import Filter from "../../assets/icons/Filter";
import { Divider } from "react-native-paper";
import {
  useGetCardV2Query,
  useLazyGetCardTransactionsQuery,
  useLazyGetCardV2Query,
} from "../../redux/card/cardSliceV2";
import { useLazyGetTransactionsQuery } from "../../redux/transaction/transactionV2Slice";
import Ionicons from "react-native-vector-icons/Ionicons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { setIsCardTransactionShown } from "../../redux/card/cardSlice";
import TransactionItem from "../../components/TransactionItem";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";
import { ref } from "yup";
import Euro from "../../assets/icons/Euro";

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
  /* limit: 20, */
  limit: 500,
  page: 1,
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
  const currentPage = transactionsWithFilter?.current_page;
  const lastPage = transactionsWithFilter?.last_page;
  const transactionsList = transactionsWithFilter?.transactions;
  const _groupedByDateTransactions =
    groupedByDateTransactions(transactionsList);
  const [isSearchTextOpen, setIsSearchTextOpen] = useState<boolean>(false);
  // const [isSheetFilterOpen, setIsSheetFilterOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFieldData, setSearchFieldData] = useState<SearchFilter>(
    initialSearchFieldData
  );

  const [showPickerDateFilter, setShowPickerDateFilter] =
    useState<DateRangeType>(initialDateRange);
  const { data: userCardsList } = useGetCardV2Query({
    accountId: userData?.id,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });
  const [getCartTransactions, { data: cardTransactions }] =
    useLazyGetCardTransactionsQuery();
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
    dispatch<any>(setIsCardTransactionShown(false));
  };


  const handleFetchCardTransactions = async (cardId: string) => {
    const cardTransactionsFilter = {
      account_id: userData?.id,
      from_date: new Date(new Date().setFullYear(new Date().getFullYear() - 2))
        .toISOString()
        .split("T")[0],
      to_date: new Date().toISOString().split("T")[0],
      type: "PREAUTH",
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

  // const filterFromToDate = async (fromDate: string, toDate: string) => {
  //   const userId = userData?.id;
  //   if (fromDate && toDate && userId) {
  //     const search: SearchFilter = {
  //       ...searchFieldData,
  //       ...(fromDate && { from_date: fromDate }),
  //       ...(toDate && { to_date: toDate }),
  //       account_id: `${userId}`,
  //       direction: "desc",
  //     };
  //     setSortByDate(false);
  //     setSearchFieldData(search);
  //     await fetchTransactionsWithFilters(search);
  //   }
  // };

  // const handleOnSubmitEditing = (event: any) => {
  //   const isNumberOnly = containsOnlyNumbers(searchText);
  //   const userId = userData?.id;
  //   if (!userId) {
  //     return;
  //   }
  //   const { from_date, to_date } = searchFieldData;
  //   const _searchFieldData: SearchFilter = {
  //     ...(!currentSelectedSearchField && !isNumberOnly && { name: searchText }),
  //     ...(!currentSelectedSearchField &&
  //       isNumberOnly && { min_amount: Number(searchText) }),
  //     ...(currentSelectedSearchField === "bic" && { bic: searchText }),
  //     ...(currentSelectedSearchField === "status" && { status: searchText }),
  //     ...(currentSelectedSearchField === "reference_no" && {
  //       reference_no: Number(searchText),
  //     }),
  //     ...(currentSelectedSearchField === "min_amount" && {
  //       min_amount: Number(searchText),
  //     }),
  //     ...(currentSelectedSearchField === "iban" && { iban: searchText }),
  //     ...(currentSelectedSearchField === "max_amount" && {
  //       max_amount: Number(searchText),
  //     }),
  //     ...(from_date && { from_date }),
  //     ...(to_date && { to_date }),
  //     ...initialSearchFieldData,
  //     accountId: `${userId}`,
  //   };
  //   setSearchFieldData(_searchFieldData);
  //   fetchTransactionsWithFilters({
  //     ..._searchFieldData,
  //   });
  // }

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

  const handlePreviousPage = () => {
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
  };

  // const handleGeneratePDF = async (
  //   statements: StatementTransactionsResponse[]
  // ) => {
  //   const pdfUri = await generatePDF(statements);
  //   return await printAsync({ uri: pdfUri });
  // };

  // if isCardTransactionShown is true, then fetch select 

  // useEffect(() => {
  //   if (isCardTransactionShown) {
  //     const activeCard = listOfActiveCards?.find(
  //       (card: any) => card.cardStatus === CardStatus.ACTIVE
  //     );
  //     setSearchFieldData({
  //       ...searchFieldData,
  //       card_id:
  //         searchFieldData.card_id || activeCard?.cardreferenceId.toString(),
  //     });
  //     handleFetchCardTransactions(activeCard?.cardreferenceId.toString());
  //   }
  // }, [isCardTransactionShown]);

  // useEffect(() => {
  //   if (searchFieldData.card_id !== "") {
  //     dispatch<any>(setIsCardTransactionShown(true));
  //   } else {
  //     dispatch<any>(setIsCardTransactionShown(false));
  //   }
  // }, [searchFieldData.card_id]);

  useEffect(() => {
    setIsLoading(true);
    fetchTransactionsWithFilters();
    dispatch<any>(setIsCardTransactionShown(false));
    return () => {
      clearFilter();
      dispatch<any>(clearTransactions());
    };
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {/* <Spinner visible={isLoading} /> */}
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={
              isCardTransactionShown
                ? "Card Transactions History"
                : "Transactions History"
            }
            rightAction={
              <View style={{ display: "flex", flexDirection: "row" }}>
                <TouchableOpacity
                  style={styles.iconFilter}
                  onPress={() => {
                    //added by Aristos to fix issue with search being disabled
                    clearFilter();
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
          <Seperator backgroundColor={vars["grey"]} />
          {isCardTransactionShown && cardTransactions?.length > 0
            ? cardTransactions?.map((transaction: any, index: number) => (
                <TransactionItem
                  data={{
                    ...transaction,
                    id: Number(transaction.id),
                    amount: transaction.amount.toString(),
                    name: transaction.purpose,
                    balance: transaction.transactionAmount,
                    bic: "",
                    closing_balance: "",
                    running_balance: "",
                    currency: transaction.transactionCurrency,
                    description: "",
                    iban: "",
                    opening_balance: "",
                    reference_no: "",
                    service: "",
                    status: "",
                    transaction_datetime: "",
                    transaction_id: 0,
                    transaction_uuid: "",
                  }}
                  key={index}
                />
              ))
            : !_groupedByDateTransactions && (
                <Fragment>
                  <View style={{ padding: 30 }}>
                    <Text>
                      Card don't have any transactions. Make sure you have
                      selected the right card.
                    </Text>
                  </View>
                </Fragment>
              )}
          <View>
            {!isCardTransactionShown && _groupedByDateTransactions
              ? Object.keys(_groupedByDateTransactions).map((date: string) => {
                  let _amount: number = 0;
                  const transactionsByDate = _groupedByDateTransactions[
                    date
                  ].map((tx, index) => {
                    const { amount } = tx;
                    _amount = Number(_amount) + Number(amount);
                    return tx;
                  });
                  const shownData = {
                    date,
                    totalAmount: _amount.toString(),
                    currency: _groupedByDateTransactions[date][0].currency,
                  };
                  return (
                    <TransactionsByDate
                      key={_groupedByDateTransactions[date][0].transaction_uuid}
                      shownData={shownData}
                      transactionsByDate={transactionsByDate}
                      totalAmount={_amount.toString()}
                    />
                  );
                })
              : null}
              {!isCardTransactionShown && Object.keys(_groupedByDateTransactions).length === 0 && (
                <Fragment>
                  <View style={{ padding: 30, backgroundColor: '#fff', height: hp(150), alignItems: 'center' }}>
                    <Typography
                      fontSize={16}
                      color={vars["black"]}
                      fontWeight="Nunito-Bold"
                    >
                      Don't have any transactions found
                    </Typography>
                  </View>
                </Fragment>
            )}
          </View>
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
        // onClose={() => refRBSheet?.current?.close()}
        height={550}
        wrapperStyles={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
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
          <View style={{top: hp(-3), left: wp(-3)}}>
            <Typography fontSize={18} fontFamily={'Nunito-SemiBold'}>Filters</Typography>
          </View>
          {/* <Divider style={{ marginVertical: 15 }} /> */}
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
            {/* <Ionicons name="refresh" size={14} color={vars["accent-blue"]} /> */}
          </TouchableOpacity>
        </View>
      <Divider style={{ 
        marginVertical: 8, 
        width: widthGlobal,
        backgroundColor: vars["accent-grey"],
        height: 1,
        opacity: 0.3,
        // zIndex: 9999,
        overflow: "visible"
        }} />
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ flex: 1, flexWrap: "wrap"}}>
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
              disabled={searchFieldData.card_id !== ""}
            >
              {showPickerDateFilter.dateFrom.value &&
                formatDateDayMonthYear(showPickerDateFilter.dateFrom.value)}
            </Button>
            {showPickerDateFilter.dateFrom.state && (
              <DateTimePicker
                mode="date"
                display="spinner"
                onTouchCancel={() =>
                  setShowPickerDateFilter({
                    ...showPickerDateFilter,
                    dateFrom: {
                      state: false,
                      value: null,
                    },
                  })
                }
                // minimumDate={new Date(new Date().setMonth(new Date().getMonth() - 2))}
                //go back 5 years 12*5
                minimumDate={
                  new Date(new Date().setMonth(new Date().getMonth() - 60))
                }
                maximumDate={new Date()}
                value={
                  !showPickerDateFilter.dateFrom.value
                    ? currentDate
                    : new Date(showPickerDateFilter.dateFrom.value)
                }
                textColor="black"
                onChange={(event: any) => {
                  if (event.type == "set") {
                    handleOnChangeShowPickerDate(
                      event.nativeEvent.timestamp,
                      setShowPickerDateFilter,
                      showPickerDateFilter,
                      "dateFrom"
                    );
                  }
                }}
                style={styles.dropdownIOSFrom}
              />
            )}

          </View>
          {/* <View>
            <Text style={{top: 28, right: 31, fontSize: 24}}>
              _
            </Text>
          </View> */}
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
              disabled={searchFieldData.card_id !== ""}
            >
              {showPickerDateFilter.dateTo.value &&
                formatDateDayMonthYear(showPickerDateFilter.dateTo.value)}
            </Button>
            {showPickerDateFilter.dateTo.state && (
              <DateTimePicker
                mode="date"
                display="spinner"
                onTouchCancel={() =>
                  setShowPickerDateFilter({
                    ...showPickerDateFilter,
                    dateTo: {
                      state: false,
                      value: null,
                    },
                  })
                }
                // minimumDate={new Date(new Date().setMonth(new Date().getMonth() - 2))}
                //go back 5 years 12*5
                minimumDate={
                  new Date(new Date().setMonth(new Date().getMonth() - 60))
                }
                maximumDate={new Date()}
                value={
                  !showPickerDateFilter.dateTo.value
                    ? currentDate
                    : new Date(showPickerDateFilter.dateTo.value)
                }
                textColor="black"
                onChange={(event: any) => {
                  if (event.type == "set") {
                    handleOnChangeShowPickerDate(
                      event.nativeEvent.timestamp,
                      setShowPickerDateFilter,
                      showPickerDateFilter,
                      "dateTo"
                    );
                  }
                }}
                style={styles.dropdownIOSTo}
              />
            )}
          </View>
        </View>
        <Typography fontSize={10} color="#696F7A">
          maximum date range is 60 days
        </Typography>
        <Divider style={{
          marginVertical: 15, 
          width: widthGlobal,
          backgroundColor: vars["accent-grey"],
          height: 1,
          opacity: 0.2,
          // zIndex: 9999,
          overflow: "visible"
        }} />
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
              disabled={searchFieldData.card_id !== ""}
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
              disabled={searchFieldData.card_id !== ""}
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
          {/* <View>
            <Text style={{top: 22, right: 0, fontSize: 18}}>
              _
            </Text>
          </View> */}
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Typography fontSize={14} color="#696F7A">
              Amount to
            </Typography>
            <FormGroup.Input
              placeholder={"To"}
              color={vars["black"]}
              disabled={searchFieldData.card_id !== ""}
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
              icon={
                <Euro />
              }
            />
          </View>
        </View>
        <Divider style={{ 
          marginVertical: 15,
          width: widthGlobal,
          backgroundColor: vars["accent-grey"],
          height: 1,
          opacity: 0.2,
          overflow: "visible"
        }} />
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
                  setIsCardTransactionShown(false);
                  return;
                }
                setSearchFieldData({
                  ...searchFieldData,
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
        <Divider style={{
          marginVertical: 15, 
          width: widthGlobal,
          backgroundColor: vars["accent-grey"],
          height: 1,
          opacity: 0.2,
          overflow: "visible" 
          }} />
        <Button
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: "100%",
            backgroundColor: "grey",
            marginTop: 10,
            lineHeight: 25,
            borderColor: 'none',
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
            fontWeight="Nunito-Bold"
            fontWeights="600"
          >
            Submit
          </Typography>
        </Button>
        
        {/* <Divider style={{ marginVertical: 15 }} /> */}
      </SwipableBottomSheet>
      <LoadingScreen isLoading={isLoading} />
    </MainLayout>
  );
}
