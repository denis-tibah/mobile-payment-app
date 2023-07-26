import { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDebounce } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import FormGroup from "../../components/FormGroup";
import Heading from "../../components/Heading";
import TransactionItem from "../../components/TransactionItem";
import MainLayout from "../../layout/Main";
import { styles } from "./styles";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import TransactionIcon from "../../assets/icons/Transaction";
import SearchIcon from "../../assets/icons/Search";
import { SearchFilter, getTransactions, getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import LoadingScreen from "../../components/Loader/LoadingScreen";
import { dateFormatter } from "../../utils/dates";
import { TRANSACTIONS_STATUS } from "../../utils/constants";
import ArrowDown from "../../assets/icons/ArrowDown";
import { arrayChecker } from "../../utils/helper";
import { Transaction, TransactionDetails,TransactionDetailsNew } from "../../models/Transactions";
import Pagination from "../../components/Pagination/Pagination";
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";

export interface GroupedByDateTransactionObject {
  [date: string]: Transaction[];
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
  sort:  "id",
  direction: 'desc',
  status: "",
  limit: 20,
  page: 1,
};

export function Transactions({ navigation }: any) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const [isMobileFilterShown, setIsMobileFilterShown] = useState<boolean>(false);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [currentSelectedSearchField, setCurrentSelectedSearchField] = useState<string>("");
  const [openSearchOptions, setOpenSearchOptions] = useState<boolean>(false);
  const [openStatusOptions, setOpenStatusOptions] = useState<boolean>(false);
  // const [transactions] = useSelector((state: RootState) => state?.transaction?.data); disabled temporarily since finxp is not returning the correct data - Arjay
  const transactions = useSelector((state: RootState) => state?.transaction?.data);

  const [isStatusOptionSelected, setIsStatusOptionSelected] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const debounceSearchText = useDebounce<string>(searchText, 300);
  const [txData, setTxData] = useState<GroupedByDateTransactionObject>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFieldData, setSearchFieldData] = useState<SearchFilter>(initialSearchFieldData);
  const [showPickerDateTo, setShowPickerDateTo] = useState(false);
  const [showPickerDateFrom, setShowPickerDateFrom] = useState(false);
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [unfilteredTransactions, setUnfilteredTransactions] = useState<GroupedByDateTransactionObject>();

  function capitalizeFirstLetter(str: string): string {
    return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  }

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
    setCurrentSelectedSearchField("");
    setSearchText("");
    setIsStatusOptionSelected(false);
    setTxData(unfilteredTransactions);
  }

  const groupedByDateTransactions = ( txData: Transaction[] ): GroupedByDateTransactionObject => {
    const sanitizedDate: Transaction[] = txData.map((tx: Transaction) => {
      return {
        ...tx,
        transaction_datetime: dateFormatter(tx.transaction_datetime),
      }
    });
    const groupedByDateTransactions: GroupedByDateTransactionObject = sanitizedDate.reduce((current: any, element) => {
      (current[element.transaction_datetime] ??= []).push(element);
      return current;
    }, {});
    return groupedByDateTransactions;
  }

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      if (userData) {
        let search: SearchFilter = {
          ...initialSearchFieldData,
          account_id: `${userData?.id}`,
        }
        await dispatch<any>(getTransactionsWithFilters(search))
        .unwrap()
        .then((res: TransactionDetailsNew) => {
          // const [transaction] = res;
          // const transactionData = res.transactions;
          // const last_page=res.last_page;
          // const current_page=res.current_page;
          // console.log('data ',transactionData)

          const {transactions: transactionData, last_page, current_page} = res;
          setTotalPages(last_page);
          setPage(current_page);
          const _groupedByDateTransactions = groupedByDateTransactions(transactionData);
          setTxData(_groupedByDateTransactions);
          setUnfilteredTransactions(_groupedByDateTransactions);
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  //added by Aristos
  const fetchTransactionsWithFilters = async (value: SearchFilter) => {
    try {
      setIsLoading(true);
      if (userData && userData?.id) {
        let search: SearchFilter = {
          ...value,
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
          setIsLoading(false);
        });      
      }
    } catch (error) {
      console.log("error aristos 2 ");
      console.log({error});
    } finally {
      setIsLoading(false);
    }
  };

  const containsOnlyNumbers = (str: any): boolean => {
    return /^\d+$/.test(str);
  };

  const filterFromToDate = async (fromDate: string, toDate: string) => {
    const userId = userData?.id;
    if (fromDate && toDate && userId) {
      const search: SearchFilter = {
        ...searchFieldData,
        ...(fromDate && { from_date: fromDate }),
        ...(toDate && { to_date: toDate }),
        account_id: `${userId}`,
        sort: "id",
        direction: "desc",
      };
      setSortByDate(false);
      setSearchFieldData(search);
      await fetchTransactionsWithFilters(search);
    }
  };

  const onChangeShowPickerDateTo = (event: any) => {
    if (event.type == "set") {
      const formattedToDate = new Date(event.nativeEvent.timestamp)
        .toISOString()
        .split("T")[0];
      setDateTo(formattedToDate);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      setShowPickerDateTo(false);
      if (fromDate > toDate) {
        alert("Date from should be before or same with Date to");
        return;
      } else {
        filterFromToDate(dateFrom, formattedToDate);
      }
    }
  };

  const onChangeShowPickerDateFrom = (event: any) => {
    if (event.type == "set") {
      const formattedFromDate = new Date(event.nativeEvent.timestamp)
        .toISOString()
        .split("T")[0];
      setDateFrom(formattedFromDate);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      setShowPickerDateFrom(false);
      if (fromDate > toDate) {
        alert("Date from should be before or same with Date to");
        return;
      } else {
        filterFromToDate(formattedFromDate, dateTo);
      }
    }
  };

  const handleExportData = async () => {
    // const pdfUri = await generatePDF(transactions);
    // const { data: transactionsData } = transactions; - Arjay: disabled temporarily since finxp change the format of response
  
    // const pdfUri = await generatePDF(transactions);
    //modified by Aristos: 18-4-2023 due to finXP response changing
    const pdfUri = await generatePDF(transactions?.transactions);
    await printAsync({ uri: pdfUri });
  };

  const handleOnSubmitEditing = (event: any) => {
    const isNumberOnly = containsOnlyNumbers(searchText);
    const userId = userData?.id;
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
    setSearchFieldData(_searchFieldData);
    fetchTransactionsWithFilters({
      ..._searchFieldData,
    });
  };

  const handleSortByDate = (_sortByDate: boolean) => {
    const sortState = _sortByDate ? 'asc' : 'desc';
    const searchFilter: SearchFilter = {
      ...searchFieldData,
      account_id: `${userData?.id}`,
      direction: sortState,
    };
    fetchTransactionsWithFilters(searchFilter);
    setSearchFieldData(searchFilter);
  }

  const handleShowingAdvanceFilter = () => {
    clearFilter();
    setIsStatusOptionSelected(false);
    setIsMobileFilterShown(!isMobileFilterShown);
  }

  // const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => { //  a method for infinite scrolling feature (not used)
  //   const paddingToBottom = 20;
  //   return layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom;
  // };

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
    fetchTransactions();
    return () => clearFilter();
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {/* <Spinner 
        visible={loadingTransactions}
      /> */}
      <ScrollView 
        bounces={false}
        // onMomentumScrollEnd={({nativeEvent}) => { // posible feature for future improvements. this is draft for infinite scroll
        //   if (isCloseToBottom(nativeEvent)) {
        //     fetchTransactions(limitCount);
        //     let _limitCount = limitCount;
        //     setLimitCount(++_limitCount);
        //   }
        // }}
      >
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={"Last Transactions"}
            rightAction={
              <Button
                style={{ height: 34, width: 120 }}
                color={"light-pink"}
                onPress={handleExportData}
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
              placeholder="Enter Minimum Amount"
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
                onPress={() => setShowPickerDateFrom(true)}
              >
                {!dateFrom ? `From Date` : `${dateFrom}`}
              </Button>
              {showPickerDateFrom && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  value={!dateFrom ? currentDate : new Date(dateFrom)}
                  onChange={onChangeShowPickerDateFrom}
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
                onPress={() => setShowPickerDateTo(true)}
              >
                {!dateTo ? `To Date` : `${dateTo}`}
              </Button>
              {showPickerDateTo && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={!dateTo ? currentDate : new Date(dateTo)}
                  onChange={onChangeShowPickerDateTo}
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