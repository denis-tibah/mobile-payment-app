import { SetStateAction, useEffect } from "react";
import { View, ScrollView, Linking, Text, Platform  } from "react-native";
import { Picker } from '@react-native-picker/picker';

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
import ExportIcon from "../../assets/icons/Export";
import SearchIcon from "../../assets/icons/Search";
import CalenderEmpty from "../../assets/icons/CalenderEmpty";
import { getTransactions,getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useState } from "react";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { TextInput } from "react-native-gesture-handler";
import { Pressable } from "react-native/Libraries/Components/Pressable/Pressable";
// import DateTimePicker from "react-native-modal-datetime-picker";
import {getTodaysDate} from "../../utils/dates"
// export function Transactions({ navigation,initial}: any) {

const searchOptions = [
  {
    label: "BIC",
    value: 'bic'
  },
  {
    label: "ReferenceNo",
    value: 'reference_no'
  },
  {
    label: "IBAN",
    value: 'iban'
  },
  {
    label: "Maximum amount",
    value: 'max_amount'
  },
  {
    label: "Status",
    value: 'status'
  },
]
interface SearchOptions {
  label: string,
  value: string
}
export function Transactions({ navigation}: any) {
  const transactions = useSelector(
    (state: RootState) => state?.transaction?.data
  );

  const transactionsFiltered = useSelector(
    (state: RootState) => state?.transaction?.search
  );

  const [onStartup, setOnStartup] = useState('true');
  const [isMobileFilterShown, setIsMobileFilterShown] = useState(false);
  const [currentSelectedSearchField, setCurrentSelectedSearchField] = useState<string>();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const [searchText, setSearchText] = useState("");

  const loadingTransactions = useSelector((state:RootState) => state.transaction.loading)

  const dispatch = useDispatch();
  const setDatePickerValue = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: {timestamp},
    } = event;
  };
  const fetchTransactions = async () => {
    try {
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
    }
  };

//added by Aristos
const fetchTransactionsWithFilters = async (value :any) => {
  try {
    if (userData) await dispatch<any>(getTransactionsWithFilters(value));
  } catch (error) {
    console.log({ error });
  }
};


  useEffect(() => {
    setOnStartup('true');
    // console.log("load once navigation",onStartup)
    fetchTransactions();
  }, [transactions?.length, userData?.id]);

  useEffect(() => {
    setOnStartup('true');
    // console.log("OnStartup navigation",initial)
    fetchTransactions();
  }, []);
  const [showPickerDateTo, setShowPickerDateTo] = useState(false);
  const [showPickerDateFrom, setShowPickerDateFrom] = useState(false);

  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const containsOnlyNumbers = (str: any) => {
    return /^\d+$/.test(str);
  }
const togglePickerDateTo = () =>{
  setShowPickerDateTo(!showPickerDateTo);
}

const togglePickerDateFrom = () =>{
  setShowPickerDateFrom(!showPickerDateFrom);
}

const onChangeShowPickerDateTo = (event:any) => {
  console.log(event.type)
  console.log(event.nativeEvent)
  if(event.type == "set"){
    // setDateTo(event.nativeEvent);
    const date1 = new Date(event.nativeEvent.timestamp);
    const formattedDate = date1.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    setDateTo(formattedDate);
    togglePickerDateTo();
    if (dateFrom && dateTo) {
      if (dateFrom > dateTo) {

      } else {
        let search:any;
        search = {   
          account_id: userData?.id,
          from_date: dateFrom,
          to_date: dateTo,
          status: "PROCESSING",
          sort: "id"
        }
        fetchTransactionsWithFilters(search);
        setOnStartup('false');
      }
    }
  }
}

  const onChangeShowPickerDateFrom = (event:any) => {
    if(event.type == "set"){
      const date2 = new Date(event.nativeEvent.timestamp);
      const formattedDate = date2.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setDateFrom(formattedDate);
      togglePickerDateFrom();
      if (dateFrom && dateTo) {
        if (dateFrom > dateTo) {
        } else {
          let search:any;
          search = {   
            account_id: userData?.id,
            from_date: dateFrom,
            to_date: dateTo,
            status: "PROCESSING",
            sort: "accountId"
          }
          fetchTransactionsWithFilters(search);
          setOnStartup('false');
        }
      }
    }
  }
  const handleExportData = async () => {
    const pdfUri = await generatePDF(transactions);
    await printAsync({ uri: pdfUri });
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    // Perform any other logic with the selected date/time
  };
  const handleOnSubmitEditing = (event: any) => {
    const numberValue =  containsOnlyNumbers(searchText);
    let search:any;
    console.log(searchText);
    console.log(currentSelectedSearchField);

    if (!currentSelectedSearchField && !numberValue) {
      search = {   
        account_id: userData?.id,
        name: searchText,
        sort: "name",
        direction: "desc"
      }
    }

    if (currentSelectedSearchField === "bic") {
      search = {   
        account_id: userData?.id,
        bic: searchText,
        sort: "bic",
      }

    }

    if (currentSelectedSearchField === "status") {
      search = {   
        account_id: userData?.id,
        status: searchText,
        sort: "status",
      }
      
    }

    if (currentSelectedSearchField === "reference_no") {
      search = {   
        account_id: userData?.id,
        reference_no: searchText,
        sort: "reference_no",
      }
    }

    if (currentSelectedSearchField === "min_amount" || numberValue) {
      search = {   
        account_id: userData?.id,
        min_amount: searchText,
        sort: "min_amount",
      }
    }

    if (currentSelectedSearchField === "iban") {
      search = {   
        account_id: userData?.id,
        iban: searchText,
        sort: "iban",
      }
    }

    if (currentSelectedSearchField === "max_amount") {
      search = {   
        account_id: userData?.id,
        max_amount: searchText,
        sort: "max_amount",
      }
    }
    fetchTransactionsWithFilters(search);
    setOnStartup('false');
    
    // if (isNaN(numberValue)) {

    
    //   let search= {   
    //       account_id: userData?.id,
    //       name: searchText,
    //       sort: "id",
    //       direction: "desc"
                      
    //   }

    //           fetchTransactionsWithFilters(search);
    //           setOnStartup('false');
    //           // initial='test';
    //   // console.log(fetchTransactionsWithFilters(search));

    // } else {
    //   //if input is number then here
    //   let search= { account_id : userData?.id,
    //                 min_amount: searchText,
    //                 sort: "id",
    //                 direction: "desc"
    //           }
    //           fetchTransactionsWithFilters(search)
    //           setOnStartup('false');
    //           // initial='test';
    //   // console.log("transactions",transactions);
    // }
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner 
        visible={loadingTransactions}
      />
      <ScrollView bounces={false}>
        <View style={styles.container}>
          <Heading
            icon={<TransactionIcon size={18} color="pink" />}
            title={"Transactions"}
            rightAction={
              <Button
                height={34}
                width={94}
                style={{height: 34, width: 94}}
                color={"light-pink"}
                rightIcon={<ExportIcon color="pink" size={12} />}
                onPress={handleExportData}
              >
                Report
              </Button>
            }
          />
        </View>
        <View style={styles.searchBar}>
          <FormGroup.Input
            icon={<SearchIcon />}
            placeholder="john.smith@mail.com"
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
            <Ionicons 
              onPress={(event: any) => setIsMobileFilterShown(!isMobileFilterShown)} 
              name="filter-sharp" 
              size={32}
              color="#ff28b9"
              iconStyle={{marginTop: 180, color: "#FFC0CB"}}
            >
            </Ionicons>
          </View>
        </View>
        { isMobileFilterShown && (
          <View style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row'
          }}>
            <View style={{
                flex: 1,
                minWidth: 80
              }}
            >
              <FormGroup.Select
                selectedValue=''
                setSelectedValue={(selected: any) => setCurrentSelectedSearchField(selected)}
                items={searchOptions}
                placeholder="Search options"
              />
            </View>
            <View style={{
                flex: 1
              }}
            >
              <Button
                style={{width: 110, backgroundColor: "grey"}}
                color="black-only"
                onPress={togglePickerDateFrom}
              >
                { `From Date`}
              </Button>
              {showPickerDateFrom && (
                <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChangeShowPickerDateFrom}
              />
              )}
            </View>
            <View style={{
                flex: 1
              }}
            >
              <Button
                style={{width: 110, backgroundColor: "grey"}}
                color="black-only"
                onPress={togglePickerDateTo}
              >
                { `To Date`}
              </Button>
              {showPickerDateTo && (
                <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChangeShowPickerDateTo}
              />
              )}
            </View>
          </View>
          )
        }
        <View>
            <Seperator backgroundColor={vars['grey']} />
          <View style={styles.listHead}>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Name</Typography>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold" color="accent-blue">Date</Typography>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Amount</Typography>
            <Typography fontSize={16} fontFamily="Nunito-SemiBold">Balance</Typography>
            <Typography></Typography>
          </View>
          <Seperator backgroundColor={vars['grey']} />
          {onStartup =='true' ?  <View>{transactions?.map((transaction, index) => {
              // console.log(transaction)
                return(  <TransactionItem data={transaction} key={index} />)
                                  
          })}</View>
              :   
                    <View> 
                          {transactionsFiltered?.map((transaction, index) => (
                          <TransactionItem data={transaction} key={index} />  
                        ))}
                   </View>
          }
          {/* <View > */}
           
            {/* {transactions.map((transaction, index) => (
              <TransactionItem data={transaction} key={index} />
            ))} */}
                 {/* {transactionsFiltered?.map((transaction, index) => (
              <TransactionItem data={transaction} key={index} />
            ))} */}
       
  

          {/* </View> */}
        </View>
      </ScrollView>
    </MainLayout>
  );
}
