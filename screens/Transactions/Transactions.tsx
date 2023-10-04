import { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDebounce } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import FormGroup from "../../components/FormGroup";
import Heading from "../../components/Heading";
import Modal from '../../components/Modal'
import MainLayout from "../../layout/Main";
import { styles } from "./styles";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import TransactionIcon from "../../assets/icons/Transaction";
import SearchIcon from "../../assets/icons/Search";
import { SearchFilter, StatementFilter, StatementResponse, StatementTransactionsResponse, clearTransactions, getStatementsfinxp, getTransactions, getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import { dateFormatter } from "../../utils/dates";
import { TRANSACTIONS_STATUS } from "../../utils/constants";
import { capitalizeFirstLetter } from "../../utils/helper";
import { Transaction, TransactionDetails, TransactionDetailsNew } from "../../models/Transactions";
import Pagination from "../../components/Pagination/Pagination";
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";
import Box from "../../components/Box";
import { containsOnlyNumbers } from "../../utils/helpers";

export interface GroupedByDateTransactionObject {
  [date: string]: Transaction[];
}
interface DateRangeType {
  dateTo: {
    state: boolean;
    value: string;
  }
  dateFrom: {
    state: boolean;
    value: string;
  }
}
const searchOptions = [
  // { label: "BIC", value: 'bic' },
  // { label: "ReferenceNo", value: 'reference_no' },
  // { label: "IBAN", value: 'iban' },
  { label: "Maximum amount", value: "max_amount" },
  { label: "Status", value: "status" },
];

const currentDate = new Date();
const initialSearchFieldData: SearchFilter = {
  account_id: "",
  // sort:  "id",
  direction: 'desc',
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
  const [isMobileFilterShown, setIsMobileFilterShown] = useState<boolean>(false);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [currentSelectedSearchField, setCurrentSelectedSearchField] = useState<string>("");
  const [openSearchOptions, setOpenSearchOptions] = useState<boolean>(false);
  const [openStatusOptions, setOpenStatusOptions] = useState<boolean>(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState<boolean>(false);
  const [isStatusOptionSelected, setIsStatusOptionSelected] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const debounceSearchText = useDebounce<string>(searchText, 300);
  const [txData, setTxData] = useState<GroupedByDateTransactionObject>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFieldData, setSearchFieldData] = useState<SearchFilter>(initialSearchFieldData);
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [showPickerDateFilter, setShowPickerDateFilter] = useState<DateRangeType>((initialDateRange));
  const [showStatementPickerDateToAndFrom, setShowStatementPickerDateToAndFrom] = useState<DateRangeType>(initialDateRange);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [unfilteredTransactions, setUnfilteredTransactions] = useState<GroupedByDateTransactionObject>();

  const transactionStatusOptions = Object.keys(TRANSACTIONS_STATUS).map(
    (value) => {
      return {
        label: capitalizeFirstLetter(value),
        value: TRANSACTIONS_STATUS[value as keyof typeof TRANSACTIONS_STATUS],
      };
    }
  );

  const clearFilter = () => {
    setDateFrom("");
    setDateTo("");
    setShowStatementPickerDateToAndFrom(initialDateRange);
    setShowPickerDateFilter(initialDateRange);
    setSearchFieldData(initialSearchFieldData);
    setCurrentSelectedSearchField("");
    setSearchText("");
    setIsStatusOptionSelected(false);
    setTxData(unfilteredTransactions);
  }

  const groupedByDateTransactions = ( txData: Transaction[] ): GroupedByDateTransactionObject => {
    const sanitizedDate: Transaction[] = txData.map((tx: Transaction) => {
      return {
        ...tx,
        transaction_datetime: dateFormatter(tx.transaction_datetime.toString()),
      }
    });
    const groupedByDateTransactions: GroupedByDateTransactionObject = sanitizedDate.reduce((current: any, element) => {
      (current[element.transaction_datetime] ??= []).push(element);
      return current;
    }, {});
    return groupedByDateTransactions;
  }

  const fetchTransactionsWithFilters = async (value?: SearchFilter) => {
    try {
      setIsLoading(true);
      if (userData && userData?.id) {
        let search: SearchFilter = {
          ...(value ? value : initialSearchFieldData),
          account_id: `${userData?.id}`,
        }
        await dispatch<any>(getTransactionsWithFilters(search))
        .unwrap()
        .then((res: TransactionDetailsNew) => {
          const {transactions: transactionData, last_page, current_page} = res;
          setTotalPages(last_page);
          setPage(current_page);
          const _groupedByDateTransactions = groupedByDateTransactions(transactionData);
          setTxData(_groupedByDateTransactions);
          !value && setUnfilteredTransactions(_groupedByDateTransactions);
          setIsLoading(false);
        });      
      }
    } catch (error) {
      console.log({error});
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
    const userId = userData?.id
    if (!userId) {
      return;
    }
    const { from_date, to_date } = searchFieldData;
    const _searchFieldData: SearchFilter = {
      ...(!currentSelectedSearchField && !isNumberOnly && {name: searchText}),
      ...(!currentSelectedSearchField && isNumberOnly && {min_amount: Number(searchText)}),
      ...(currentSelectedSearchField === 'bic' && {bic: searchText}),
      ...(currentSelectedSearchField === 'status' && {status: searchText}),
      ...(currentSelectedSearchField === 'reference_no' && {reference_no : Number(searchText)}),
      ...(currentSelectedSearchField === 'min_amount'&& {min_amount: Number(searchText)}),
      ...(currentSelectedSearchField === 'iban' && {iban: searchText}),
      ...(currentSelectedSearchField === 'max_amount' && {max_amount: Number(searchText)}),
      ...(from_date && {from_date}),
      ...(to_date && {to_date}),
      ...initialSearchFieldData,
      account_id: `${userId}`,
    }
    // console.log({ _searchFieldData });
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
    isOnChangeForStatements?: boolean,
    ) => {
    console.log({ values, formattedDate, key, setState });
    const { dateFrom, dateTo } = values;
    if (key === 'dateFrom') {
      if (dateTo.value) {
        const fromDate = new Date(formattedDate);
        const toDate = new Date(dateTo.value);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        } else {
          isOnChangeForStatements && filterFromToDate(formattedDate, dateTo.value);
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
          isOnChangeForStatements && filterFromToDate(dateFrom.value, formattedDate);
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
    setIsMobileFilterShown(!isMobileFilterShown);
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      const _currentPage = page - 1;
      setPage(_currentPage);
      fetchTransactionsWithFilters({
        ...searchFieldData,
        page: _currentPage,
      });
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      const _currentPage = page + 1;
      setPage(_currentPage);
      fetchTransactionsWithFilters({
        ...searchFieldData,
        page: _currentPage,
      });
    }
  }

  const handleGeneratePDF = async (statements: StatementTransactionsResponse[]) => {
    const pdfUri = await generatePDF(statements);
    return await printAsync({ uri: pdfUri });
  }

  // Fetch data when currentSelectedSearchField changes
  useEffect(() => {
    if (currentSelectedSearchField === "status") {
      setIsStatusOptionSelected(true);
    } else {
      setSearchText("");
      setIsStatusOptionSelected(false);
    }
  }, [currentSelectedSearchField]);

  useEffect(() => {
    if (currentSelectedSearchField === 'status') {
      const searchFilter: SearchFilter = {
        ...searchFieldData,
        status: searchText,
      }
      fetchTransactionsWithFilters(searchFilter);
      setSearchFieldData(searchFilter);
    }
  },[debounceSearchText]);

  useEffect(() => {
    fetchTransactionsWithFilters();
    return () => {
      clearFilter();
      dispatch<any>(clearTransactions());
    };
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {/* <Spinner 
        visible={loadingTransactions}
      /> */}
      <Modal
        isOpen={isDateRangeModalOpen}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography fontSize={16} fontFamily="Nunito-SemiBold" color="accent-blue">Export Data</Typography>
          <Typography fontSize={14} fontFamily="Nunito-Regular" color="black">Please select the date range you want to export</Typography>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button
                style={{
                  width: 110,
                  backgroundColor: "grey",
                  marginTop: 10,
                  lineHeight: 25,
                }}
                color="black-only"
                onPress={() => setShowStatementPickerDateToAndFrom({ 
                  ...showStatementPickerDateToAndFrom, 
                  dateFrom: {
                    state: true,
                    value: "",
                  }
                })}
              >
                {!showStatementPickerDateToAndFrom.dateFrom.value ? `From Date` : `${showStatementPickerDateToAndFrom.dateFrom.value}`}
              </Button>
              {showStatementPickerDateToAndFrom.dateFrom.state && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  value={!showStatementPickerDateToAndFrom.dateFrom.value ? currentDate : new Date(showStatementPickerDateToAndFrom.dateFrom.value)}
                  onChange={(event: any) => {
                    if (event.type == "set") {
                      const formattedDate = new Date(event.nativeEvent.timestamp)
                        .toISOString()
                        .split("T")[0];
                        handleOnChangeShowPickerDate(
                          formattedDate,
                          setShowStatementPickerDateToAndFrom,
                          showStatementPickerDateToAndFrom,
                          "dateFrom",
                        )
                      }
                    }
                  }
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                />
              )}
              <Button
              style={{
                width: 110,
                backgroundColor: "grey",
                marginTop: 10,
                lineHeight: 25,
              }}
              color="black-only"
              onPress={() => setShowStatementPickerDateToAndFrom({
                ...showStatementPickerDateToAndFrom,
                dateTo: {
                  state: true,
                  value: "",
                }
              })}
            >
              {!showStatementPickerDateToAndFrom.dateTo.value ? `To Date` : `${showStatementPickerDateToAndFrom.dateTo.value}`}
            </Button>
            {showStatementPickerDateToAndFrom.dateTo.state && (
              <DateTimePicker
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                value={!showStatementPickerDateToAndFrom.dateTo.value ? currentDate : new Date(showStatementPickerDateToAndFrom.dateTo.value)}
                onChange={(event: any) => {
                  if (event.type == "set") {
                    const formattedDate = new Date(event.nativeEvent.timestamp)
                      .toISOString()
                      .split("T")[0];
                      handleOnChangeShowPickerDate(
                        formattedDate,
                        setShowStatementPickerDateToAndFrom,
                        showStatementPickerDateToAndFrom,
                        "dateTo",
                      )
                    }
                  }
                }
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              />
            )}
          </View>
          <Button
            style={{
              width: 110,
              marginTop: 10,
              lineHeight: 25,
              alignSelf: 'center',
            }}
            color="green"
            onPress={async () => {
              const { dateFrom, dateTo } = showStatementPickerDateToAndFrom;
              if (userData?.id && dateFrom.value && dateTo.value) {
                const searchFilter: StatementFilter = {
                  account_id: Number(userData?.id),
                  from_date: dateFrom.value,
                  to_date: dateTo.value,
                }
                try {
                  await dispatch<any>(getStatementsfinxp(searchFilter))
                  .unwrap()
                  .then((res: StatementResponse) => {
                    const { statements } = res;
                    if (statements.length > 0) {
                      return handleGeneratePDF(statements);
                    }
                  })
                  .then(() => {
                    setIsDateRangeModalOpen(false);
                  });
                } catch (error) {
                  console.log({ error });
                }
              }
            }}
          >
            Export
          </Button>
        </Box>
      </Modal>
      <ScrollView 
        bounces={false}
      >
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={"Last Transactions"}
            rightAction={
              <Button
                style={{ height: 34, width: 120 }}
                color={"light-pink"}
                onPress={() => setIsDateRangeModalOpen(true)}
              >
                Export Data
              </Button>
            }
          />
        </View>
        <View style={styles.searchBar}>
          {isStatusOptionSelected ? (
            <View
              style={{ width: "75%", display: "flex", flexDirection: "row" }}
            >
              <DropDownPicker
                listMode="SCROLLVIEW"
                setValue={setSearchText}
                items={transactionStatusOptions}
                value={searchText}
                placeholder="Status options"
                setOpen={setOpenStatusOptions}
                open={openStatusOptions}
                zIndex={101}
                dropDownDirection="BOTTOM"
                style={[styles.dropdown, {width: '80%', alignSelf: 'flex-start'}]}
                dropDownContainerStyle={[styles.dropdownContainerStatus, { zIndex: 20 }]}
              />
            </View>
          ) : (
            <FormGroup.Input
              icon={<SearchIcon />}
              placeholder={currentSelectedSearchField === 'max_amount' ? 'Enter maximum amount' : 'Enter minimum amount'}
              color={vars["black"]}
              fontSize={14}
              fontWeight={"400"}
              style={{ width: "80%" }}
              value={searchText}
              onChangeText={(event: string) => setSearchText(event)}
              onSubmitEditing={handleOnSubmitEditing}
            />
          )}
          <View>
            <TouchableOpacity
              onPress={handleShowingAdvanceFilter}
              style={{paddingRight: 10}}
            >
              <Ionicons
                name="filter-sharp"
                size={32}
                color="#ff28b9"
                iconStyle={{ marginTop: 180, color: "#FFC0CB" }}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
        { isMobileFilterShown && (
          <View style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            zIndex: 10
          }}>
            <View style={{
                flex: 1,
                minWidth: 72,
              }}
            >
              <DropDownPicker
                listMode="SCROLLVIEW"
                setValue={setCurrentSelectedSearchField}
                items={searchOptions}
                value={currentSelectedSearchField}
                placeholder="Search options"
                setOpen={setOpenSearchOptions}
                open={openSearchOptions}
                zIndex={100}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <Button
                style={{
                  width: 110,
                  backgroundColor: "gey",
                  marginTop: 10,
                  lineHeight: 25,
                }}
                color="black-only"
                onPress={() => setShowPickerDateFilter({
                  ...showPickerDateFilter,
                  dateFrom: {
                    state: true,
                    value: "",
                  }
                  })
                }
              >
                {!showPickerDateFilter.dateFrom.value ? `From Date` : `${showPickerDateFilter.dateFrom.value}`}
              </Button>
              {showPickerDateFilter.dateFrom.state && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  value={!showPickerDateFilter.dateFrom.value ? currentDate : new Date(showPickerDateFilter.dateFrom.value)}
                  onChange={(event: any) => {
                    if (event.type == "set") {
                      const formattedFromDate = new Date(event.nativeEvent.timestamp)
                        .toISOString()
                        .split("T")[0];
                        handleOnChangeShowPickerDate(
                          formattedFromDate,
                          setShowPickerDateFilter,
                          showPickerDateFilter,
                          "dateFrom",
                          true,
                        );
                    }}
                  }
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <Button
                style={{
                  width: 110,
                  backgroundColor: "grey",
                  marginTop: 10,
                  lineHeight: 25,
                }}
                color="black-only"
                onPress={() => setShowPickerDateFilter({
                  ...showPickerDateFilter,
                  dateTo: {
                    state: true,
                    value: "",
                  }
                  })
                }
              >
                {!showPickerDateFilter.dateTo.value ? `To Date` : `${showPickerDateFilter.dateTo.value}`}
              </Button>
              {showPickerDateFilter.dateTo.state && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={!dateTo ? currentDate : new Date(dateTo)}
                  onChange={(event: any) => {
                    if (event.type == "set") {
                      const formattedToDate = new Date(event.nativeEvent.timestamp)
                        .toISOString()
                        .split("T")[0];
                      handleOnChangeShowPickerDate(
                        formattedToDate,
                        setShowPickerDateFilter,
                        showPickerDateFilter,
                        "dateTo",
                        true,
                      );
                    }
                  }}
                />
              )}
            </View>
          </View>
        )}
        <View>
          <Seperator backgroundColor={vars["grey"]} />
          <View style={styles.listHead}>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold" color="accent-blue">Date</Typography>
            <TouchableOpacity onPress={() => setSortByDate(!sortByDate)}>
            { sortByDate ? 
                <Ionicons name="arrow-up" style={styles.arrow} size={16} color="#4472C4" /> :
                <Ionicons name="arrow-down" style={styles.arrow}  size={16} color="#4472C4" />
            }
            </TouchableOpacity>
            {/* <Typography fontSize={16} fontFamily="Nunito-SemiBold" color="accent-blue">Date</Typography> */}
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Total Amount</Typography>
            {/* <Typography fontSize={16} fontFamily="Nunito-SemiBold">Balance</Typography> */}
            <Typography></Typography>
          </View>
          <Seperator backgroundColor={vars['grey']} />
          <View>
          { txData ? Object.keys(txData)
          .sort((a, b) => {
            return !sortByDate ? new Date(a).getTime() - new Date(b).getTime() : new Date(b).getTime() - new Date(a).getTime();
          })
          .map((date: string) => {
            let _amount: number = 0;
            const transactionsByDate = txData[date].map((tx, index) => {
              const { amount } = tx;
              _amount = Number(_amount) + Number(amount);
              return tx;
            });
            const shownData = {
              date,
              totalAmount: _amount.toString(),
              //  balance: txData[date][0].running_balance,
              ////currency: txData[date][0].currency,
              currency: txData[date][0].currency,
            };
            return (
              <TransactionsByDate
                key={txData[date][0].transaction_uuid}
                shownData={shownData}
                transactionsByDate={transactionsByDate}
                totalAmount={_amount.toString()}
              />
            )
            }) : null }
          </View>
          <Seperator backgroundColor={vars['grey']} />
          <View> 
            <Pagination 
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              page={page}
              lastPage={totalPages}
            />
          </View>
        </View>
        <LoadingScreen isLoading={isLoading} />
      </ScrollView>
    </MainLayout>
  );
}
