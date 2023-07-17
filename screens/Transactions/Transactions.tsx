import { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDebounce } from 'usehooks-ts'
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons'; 
import FormGroup from "../../components/FormGroup";
import Heading from "../../components/Heading";
import TransactionItem from "../../components/TransactionItem";
import MainLayout from "../../layout/Main";
import { styles } from "./styles";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import TransactionIcon from "../../assets/icons/Transaction";
import SearchIcon from "../../assets/icons/Search";
import { SearchFields, getTransactions,getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
// import DropDownPicker from "react-native-dropdown-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import LoadingScreen from "../../components/Loader/LoadingScreen";
import { dateFormatter } from "../../utils/dates";

const searchOptions = [
  // { label: "BIC", value: 'bic' },
  // { label: "ReferenceNo", value: 'reference_no' },
  // { label: "IBAN", value: 'iban' },
  { label: "Maximum amount", value: 'max_amount' },
  { label: "Status", value: 'status' },
];

const currentDate = new Date();
const initialSearchFieldData: SearchFields = {
  account_id: 0,
  sort:  "id",
};

export function Transactions({ navigation}: any) {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state?.transaction?.data
  );

  const transactionsFiltered = useSelector(
    (state: RootState) => state?.transaction?.search
  );

  const [isMobileFilterShown, setIsMobileFilterShown] = useState<boolean>(false);
  const debounceIsMobileFilterShown = useDebounce<boolean>(isMobileFilterShown, 500);
  const [currentSelectedSearchField, setCurrentSelectedSearchField] = useState(null);
  const [openSearchOptions, setOpenSearchOptions] = useState<boolean>(false);
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchFieldData, setSearchFieldData] = useState<SearchFields>(initialSearchFieldData);
  const [showPickerDateTo, setShowPickerDateTo] = useState(false);
  const [showPickerDateFrom, setShowPickerDateFrom] = useState(false);
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const loadingTransactions = useSelector((state:RootState) => state.transaction.loading)


  const clearFilter = () => {
    setDateFrom("");
    setDateTo("");
    setCurrentSelectedSearchField(null);
    setSearchText("");
  }

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      let search:any;
          search= {     
          account_id: userData?.id,
          sort: "id",
          direction: "desc",
          status: "PROCESSING"
      }
      if (userData) await dispatch<any>(getTransactions(search));
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };

  //added by Aristos
  const fetchTransactionsWithFilters = async (value :any) => {
    try {
      setIsLoading(true);
      if (userData) {
        await dispatch<any>(getTransactionsWithFilters(value));      
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containsOnlyNumbers = (str: any) => {
    return /^\d+$/.test(str);
  }

  const filterFromToDate = (fromDate: string, toDate: string) => {
    const userId = userData?.id;
    if (fromDate && toDate && userId) {
      const search: SearchFields = {
        ...searchFieldData,
        account_id: userId,
        ...(fromDate && { from_date: fromDate }),
        ...(toDate && { to_date: toDate }),
        sort: 'id',
        direction: 'desc'
      };
      setSearchFieldData(search);
      fetchTransactionsWithFilters(search);
    }
  }

  const onChangeShowPickerDateTo = (event:any) => {
    if(event.type == "set") {
      const formattedToDate = new Date(event.nativeEvent.timestamp).toISOString().split('T')[0];
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
  }

  const onChangeShowPickerDateFrom = (event:any) => {
    if(event.type == "set"){
      const formattedFromDate = new Date(event.nativeEvent.timestamp).toISOString().split('T')[0];
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
  }

  const handleExportData = async () => {
    const pdfUri = await generatePDF(transactions);
    await printAsync({ uri: pdfUri });
  };

  const handleOnSubmitEditing = (event: any) => {
    const isNumberOnly = containsOnlyNumbers(searchText);
    const userId = userData?.id;
    if (!userId) {
      return;
    }
    const { from_date, to_date } = searchFieldData;
    const _searchFieldData: SearchFields = {
      ...(!currentSelectedSearchField && !isNumberOnly && {name: searchText}),
      ...(!currentSelectedSearchField && isNumberOnly && {min_amount: Number(searchText)}),
      ...(currentSelectedSearchField === 'bic' && {bic: searchText}),
      ...(currentSelectedSearchField === 'status' && {status: searchText}),
      ...(currentSelectedSearchField === 'reference_no' && {reference_no : Number(searchText)}),
      ...(currentSelectedSearchField === 'min_amount'&& {min_amount: Number(searchText)}),
      ...(currentSelectedSearchField === 'iban' && {iban: searchText}),
      ...(currentSelectedSearchField === 'max_amount' && {max_amount: Number(searchText)}),
      sort: "id",
      direction: 'desc',
      account_id: userId,
      ...(from_date && {from_date}),
      ...(to_date && {to_date}),
    }
    setSearchFieldData(_searchFieldData);
    fetchTransactionsWithFilters({
      ..._searchFieldData,
    });
  };

  useEffect(() => {
    if (!isMobileFilterShown) {
      clearFilter();
    }
  },[isMobileFilterShown])

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    return () => clearFilter();
  },[]);

  return (
    <MainLayout navigation={navigation}>
      <Spinner 
        visible={loadingTransactions}
      />
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={"Last Transactions"}
            rightAction={
              <Button
                style={{height: 34, width: 120}}
                color={"light-pink"}
                onPress={handleExportData}
              >
                Export Data
              </Button>
            }
          />
        </View>
        <View style={styles.searchBar}>
          <FormGroup.Input
            icon={<SearchIcon />}
            placeholder="Enter Minimum Amount"
            color={vars["black"]}
            fontSize={14}
            fontWeight={'400'}
            style={{width: "80%"}}
            value={searchText}
            // returnKeyType={"done"}
            // onChange={handleChange}
            onChangeText={(event: string) => setSearchText(event)}
            // onKeyPress={handleKeyPress}
            onSubmitEditing={handleOnSubmitEditing}
          />
          <View>
            <TouchableOpacity
              onPress={() => setIsMobileFilterShown(!isMobileFilterShown)}
            >
              <Ionicons
                name="filter-sharp"
                size={32}
                color="#ff28b9"
                iconStyle={{marginTop: 180, color: "#FFC0CB"}}
              >
              </Ionicons>
            </TouchableOpacity>
          </View>
        </View>
        { debounceIsMobileFilterShown && (
          <View style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            zIndex: 100
          }}>
            <View style={{
                flex: 1,
                minWidth: 72
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
            <View style={{
                flex: 1
              }}
            >
              <Button
                style={{width: 110, backgroundColor: "gey", marginTop: 10, lineHeight: 25}}
                color="black-only"
                onPress={() => setShowPickerDateFrom(true)}
              >
                { !dateFrom ? `From Date`: `${dateFrom}` }
              </Button>
              { showPickerDateFrom && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  value={!dateFrom ? currentDate : new Date(dateFrom)}
                  onChange={onChangeShowPickerDateFrom}
                  style={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                />
              )}
            </View>
            <View style={{
                flex: 1
              }}
              >
                <Button
                  style={{width: 110, backgroundColor: "grey", marginTop: 10, lineHeight: 25}}
                  color="black-only"
                  onPress={() => setShowPickerDateTo(true)}
                >
                  { !dateTo ? `To Date` : `${dateTo}` }
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
          )
        }
        <View style={{paddingBottom: 140}}>
            <Seperator backgroundColor={vars['grey']} />
          <View style={styles.listHead}>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Name</Typography>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold" color="accent-blue">Date</Typography>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Amount</Typography>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Balance</Typography>
            <Typography></Typography>
          </View>
          <Seperator backgroundColor={vars['grey']} />
          <View>{ transactions ? transactions?.map((transaction, index) => {
            return (
              <TransactionItem data={transaction} key={index} />
            )
          }) : null }
          </View>
        </View>
        <LoadingScreen isLoading={isLoading} />
      </ScrollView>
    </MainLayout>
  );
}
