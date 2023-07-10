import { useEffect } from "react";
import { View, ScrollView } from "react-native";

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
import { getTransactions,getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

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
    fetchTransactions();
  }, [transactions?.length, userData?.id]);

  useEffect(() => {
    setOnStartup('true');
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
  if(event.type == "set") {
    const formattedDate = new Date(event.nativeEvent.timestamp).toISOString().split('T')[0];
    setDateTo(formattedDate);
    if (dateFrom && dateTo) {
      if (dateFrom > dateTo) {
        alert("Date from should be before or same with Date to");
      } else {
        let search:any;
        if (userData?.id) {
          search = {   
            account_id: userData.id,
            from_date: dateFrom,
            to_date: dateTo,
            status: "PROCESSING",
          }
          fetchTransactionsWithFilters(search);
          setOnStartup('false');
        } else {
          alert("Try relogging in.");
        }
      }
    }
    togglePickerDateTo();
  }
}

  const onChangeShowPickerDateFrom = (event:any) => {
    if(event.type == "set"){
      const formattedDate = new Date(event.nativeEvent.timestamp).toISOString().split('T')[0];
      setDateFrom(formattedDate);
      if (dateFrom && dateTo) {
        if (dateFrom > dateTo) {
          alert("Date from should be before or same with Date to");
        } else {
          let search:any;
          search = {   
            account_id: userData?.id,
            from_date: dateFrom,
            to_date: dateTo,
            status: "PROCESSING",
          }
          fetchTransactionsWithFilters(search);
          setOnStartup('false');
        }
      }
      togglePickerDateFrom();
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
    // console.log(searchText);
    // console.log(currentSelectedSearchField);

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
                { !dateFrom ? `From Date`: dateFrom }
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
                { !dateTo ? `To Date` : dateTo }
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
