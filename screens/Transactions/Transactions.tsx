import { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import FormGroup from "../../components/FormGroup";
import Heading from "../../components/Heading";
import Modal from "../../components/Modal";
import MainLayout from "../../layout/Main";
import { styles } from "./styles";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import TransactionIcon from "../../assets/icons/Transaction";
import SearchIcon from "../../assets/icons/Search";
import {
  SearchFilter,
  StatementFilter,
  StatementResponse,
  StatementTransactionsResponse,
  clearTransactions,
  getStatementsfinxp,
  getTransactionsWithFilters,
} from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import Pagination from "../../components/Pagination/Pagination";
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";
import {
  containsOnlyNumbers,
  groupedByDateTransactions,
} from "../../utils/helpers";
import { transactionStatusOptions } from "../../utils/constants";
import { Text } from "react-native";
import BottomSheet from "../../components/BottomSheet";
import Filter from "../../assets/icons/Filter";
import { Divider } from "react-native-paper";

interface DateRangeType {
  dateTo: {
    state: boolean;
    value: string;
  };
  dateFrom: {
    state: boolean;
    value: string;
  };
}

const currentDate = new Date();
const initialSearchFieldData: SearchFilter = {
  account_id: "",
  // sort:  "id",
  direction: "desc",
  status: "",
  limit: 20,
  page: 1,
};
const initialDateRange: DateRangeType = {
  dateTo: {
    state: false,
    value: "",
  },
  dateFrom: {
    state: false,
    value: "",
  },
};

export function Transactions({ navigation }: any) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const transactions = useSelector(
    (state: RootState) => state?.transaction.data
  );
  const currentPage = transactions?.current_page;
  const lastPage = transactions?.last_page;
  const transactionsList = transactions?.transactions;
  const _groupedByDateTransactions =
    groupedByDateTransactions(transactionsList);
  const [isMobileFilterShown, setIsMobileFilterShown] =
    useState<boolean>(false);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [currentSelectedSearchField, setCurrentSelectedSearchField] =
    useState<string>("");
  const [selectedTransactionStatus, setSelectedTransactionStatus] =
    useState<string>("");
  const [openSearchOptions, setOpenSearchOptions] = useState<boolean>(false);
  const [isSearchTextOpen, setIsSearchTextOpen] = useState<boolean>(false);
  const [isSheetFilterOpen, setIsSheetFilterOpen] = useState<boolean>(false);
  const [isStatusOptionSelected, setIsStatusOptionSelected] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFieldData, setSearchFieldData] = useState<SearchFilter>(
    initialSearchFieldData
  );
  const [showPickerDateFilter, setShowPickerDateFilter] =
    useState<DateRangeType>(initialDateRange);
  const [
    showStatementPickerDateToAndFrom,
    setShowStatementPickerDateToAndFrom,
  ] = useState<DateRangeType>(initialDateRange);

  const clearFilter = () => {
    setShowStatementPickerDateToAndFrom(initialDateRange);
    setShowPickerDateFilter(initialDateRange);
    setSearchFieldData(initialSearchFieldData);
    setCurrentSelectedSearchField("");
    setSearchText("");
    setIsStatusOptionSelected(false);
    isMobileFilterShown && fetchTransactionsWithFilters();
  };

  const fetchTransactionsWithFilters = async (value?: SearchFilter) => {
    try {
      setIsLoading(true);
      if (userData && userData?.id) {
        let search: SearchFilter = {
          ...(value ? value : initialSearchFieldData),
          account_id: `${userData?.id}`,
        };
        await dispatch<any>(getTransactionsWithFilters(search));
        setSearchFieldData(search);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const filterFromToDate = async (fromDate: string, toDate: string) => {
    const userId = userData?.id;
    if (fromDate && toDate && userId) {
      const search: SearchFilter = {
        ...searchFieldData,
        ...(fromDate && { from_date: fromDate }),
        ...(toDate && { to_date: toDate }),
        account_id: `${userId}`,
        direction: "desc",
      };
      setSortByDate(false);
      setSearchFieldData(search);
      await fetchTransactionsWithFilters(search);
    }
  };

  const handleOnSubmitEditing = (event: any) => {
    const isNumberOnly = containsOnlyNumbers(searchText);
    const userId = userData?.id;
    if (!userId) {
      return;
    }
    const { from_date, to_date } = searchFieldData;
    const _searchFieldData: SearchFilter = {
      ...(!currentSelectedSearchField && !isNumberOnly && { name: searchText }),
      ...(!currentSelectedSearchField &&
        isNumberOnly && { min_amount: Number(searchText) }),
      ...(currentSelectedSearchField === "bic" && { bic: searchText }),
      ...(currentSelectedSearchField === "status" && { status: searchText }),
      ...(currentSelectedSearchField === "reference_no" && {
        reference_no: Number(searchText),
      }),
      ...(currentSelectedSearchField === "min_amount" && {
        min_amount: Number(searchText),
      }),
      ...(currentSelectedSearchField === "iban" && { iban: searchText }),
      ...(currentSelectedSearchField === "max_amount" && {
        max_amount: Number(searchText),
      }),
      ...(from_date && { from_date }),
      ...(to_date && { to_date }),
      ...initialSearchFieldData,
      account_id: `${userId}`,
    };
    setSearchFieldData(_searchFieldData);
    fetchTransactionsWithFilters({
      ..._searchFieldData,
    });
  };

  const handleOnChangeShowPickerDate = (
    formattedDate: string,
    setState: any,
    values: any,
    key: string,
    isOnChangeForStatements?: boolean
  ) => {
    const { dateFrom, dateTo } = values;
    if (key === "dateFrom") {
      if (dateTo.value) {
        const fromDate = new Date(formattedDate);
        const toDate = new Date(dateTo.value);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        } else {
          isOnChangeForStatements &&
            filterFromToDate(formattedDate, dateTo.value);
        }
      }
    } else {
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        const toDate = new Date(formattedDate);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        } else {
          isOnChangeForStatements &&
            filterFromToDate(dateFrom.value, formattedDate);
        }
      }
    }
    setState({
      ...values,
      [key]: {
        state: false,
        value: formattedDate,
      },
    });
  };

  const handleShowingAdvanceFilter = () => {
    clearFilter();
    setIsStatusOptionSelected(false);
    // setIsMobileFilterShown(!isMobileFilterShown);
    setIsSheetFilterOpen(!isSheetFilterOpen);
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

  const handleGeneratePDF = async (
    statements: StatementTransactionsResponse[]
  ) => {
    const pdfUri = await generatePDF(statements);
    return await printAsync({ uri: pdfUri });
  };

  useEffect(() => {
    fetchTransactionsWithFilters();
    return () => {
      clearFilter();
      dispatch<any>(clearTransactions());
    };
  }, []);

  return (
    <MainLayout navigation={navigation}>
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={"Latest Transactions"}
            rightAction={
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity 
                  style={styles.iconFilter}
                  onPress={() => {
                    // setIsMobileFilterShown(!isMobileFilterShown);
                    setIsSheetFilterOpen(!isSheetFilterOpen);
                    }
                  }
                >
                  <Filter size={14} color="blue"/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconFilter}
                  onPress={() => setIsSearchTextOpen(!isSearchTextOpen)}
                  >
                  <SearchIcon size={14} color="blue"/>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        {
          isSearchTextOpen && (
            <View style={styles.searchBar}>
              <FormGroup.Input
                icon={<SearchIcon />}
                placeholder={"Search text ..."}
                color={vars["black"]}
                fontSize={14}
                fontWeight={"400"}
                style={{ width: "100%" }}
                value={searchText}
                onChangeText={(event: string) => setSearchText(event)}
                onSubmitEditing={handleOnSubmitEditing}
              />
            </View>
          )
        }
        <View>
          <Seperator backgroundColor={vars["grey"]} />
          <View>
            {_groupedByDateTransactions
              ? Object.keys(_groupedByDateTransactions)
                  .sort((a, b) => {
                    return sortByDate
                      ? new Date(a).getTime() - new Date(b).getTime()
                      : new Date(b).getTime() - new Date(a).getTime();
                  })
                  .map((date: string) => {
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
                        key={
                          _groupedByDateTransactions[date][0].transaction_uuid
                        }
                        shownData={shownData}
                        transactionsByDate={transactionsByDate}
                        totalAmount={_amount.toString()}
                      />
                    );
                  })
              : null}
          </View>
          <Seperator backgroundColor={vars["grey"]} />
          <View>
            <Pagination
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              page={currentPage || 0}
              lastPage={lastPage || 0}
            />
          </View>
        </View>
        <LoadingScreen isLoading={isLoading} />
      </ScrollView>
      <BottomSheet isVisible={isSheetFilterOpen} onClose={() => setIsSheetFilterOpen(!isSheetFilterOpen)}>
        <View style={styles.container}>
          <Typography fontSize={18}>
            Filters
          </Typography>
        </View>
        <Divider style={{marginVertical: 5}} />
        {/* filter for date range */}
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{flex: 1, flexWrap: 'wrap'}}>
            <Typography fontSize={14} color="#696F7A">
              Start date
            </Typography>
            <Button
                style={{
                  width: 110,
                  backgroundColor: "gey",
                  marginTop: 10,
                  lineHeight: 25,
                  borderWidth: 1,
                  borderColor: vars['accent-blue']
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
                  })
                }}
              >
                {showPickerDateFilter.dateFrom.value}
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
                        value: "",
                      },
                    })
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
                      const formattedFromDate = new Date(
                        event.nativeEvent.timestamp
                      )
                        .toISOString()
                        .split("T")[0];
                      handleOnChangeShowPickerDate(
                        formattedFromDate,
                        setShowPickerDateFilter,
                        showPickerDateFilter,
                        "dateFrom",
                        true
                      );
                    }
                  }}
                  style={styles.dropdownIOSFrom}
                />
              )}
          </View>
          <View style={{flex: 1}}>
            <Typography fontSize={14} color="#696F7A">
              Finish date
            </Typography>
            <Button
                style={{
                  width: 110,
                  backgroundColor: "grey",
                  marginTop: 10,
                  lineHeight: 25,
                  borderWidth: 1,
                  borderColor: vars['accent-blue']
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
                  })
                }}
              >
                {showPickerDateFilter.dateTo.value}
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
                        value: "",
                      },
                    })
                  }
                  value={
                    !showPickerDateFilter.dateTo.value
                      ? currentDate
                      : new Date(showPickerDateFilter.dateTo.value)
                  }
                  textColor="black"
                  onChange={(event: any) => {
                    if (event.type == "set") {
                      const formattedToDate = new Date(
                        event.nativeEvent.timestamp
                      )
                        .toISOString()
                        .split("T")[0];
                      handleOnChangeShowPickerDate(
                        formattedToDate,
                        setShowPickerDateFilter,
                        showPickerDateFilter,
                        "dateTo",
                        true
                      );
                    }
                  }}
                  style={styles.dropdownIOSTo}
                />
              )}
          </View>
        </View>
        <Typography fontSize={10} color="#696F7A">maximum date range is 60 days</Typography>
        <Divider style={{marginVertical: 10}} />
        <Typography fontSize={14} color="#696F7A">
          Status
        </Typography>
        <ScrollView horizontal style={{display: 'flex', flexDirection: 'row'}}>
          {transactionStatusOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
                backgroundColor: searchFieldData.status === option.value ? vars[option.colorActive] : vars[option.color],
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRadius: 99,
              }}
              onPress={() => {
                setSearchFieldData({
                  ...searchFieldData,
                  status: option.value,
                });
                setIsStatusOptionSelected(true);
              }}
            >
              <Text style={{
                color: searchFieldData.status === option.value ? '#fff' : vars[option.colorActive],
                fontSize: 14
              }}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Divider style={{marginVertical: 10}} />
        <View style={{display: 'flex', flexDirection: 'row'}}>
            {/* two input fields for amount range: amount from and amount to */}
            <View style={{flex: 1, flexWrap: 'wrap', paddingRight: 10}}>
              <Typography fontSize={14} color="#696F7A">
                Amount from
              </Typography>
              <FormGroup.Input
                placeholder={"From"}
                color={vars["black"]}
                fontSize={14}
                fontWeight={"400"}
                style={{ width: "100%", borderWidth: 1, borderColor: vars['accent-blue'] }}
                value={searchFieldData.min_amount}
                onChangeText={(event: string) => {
                  setSearchFieldData({
                    ...searchFieldData,
                    min_amount: Number(event),
                  });
                }}
              />
            </View>
            <View style={{flex: 1, paddingLeft: 10}}>
              <Typography fontSize={14} color="#696F7A">
                Amount to
              </Typography>
              <FormGroup.Input
                placeholder={"To"}
                color={vars["black"]}
                fontSize={14}
                fontWeight={"400"}
                style={{ width: "100%", borderWidth: 1, borderColor: vars['accent-blue'] }}
                value={searchFieldData.max_amount}
                onChangeText={(event: string) => {
                  setSearchFieldData({
                    ...searchFieldData,
                    max_amount: Number(event),
                  });
                }}
              />
            </View>
        </View>
        <Divider style={{marginVertical: 10}} />
        <Typography fontSize={14} color="#696F7A">
          Your cards
        </Typography>
        <ScrollView horizontal>
          {/* list of cards, blue if its physical and pink otherwise */}
          <TouchableOpacity style={{
              backgroundColor: vars['light-pink'],
              paddingVertical: 12,
              paddingHorizontal: 18,
              borderRadius: 99,
              width: 135,
              height: 40,
              }}
            >
            <Typography fontSize={14} color={vars['accent-pink']}>
              **** **** **** 1234
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
    </MainLayout>
  );
}
