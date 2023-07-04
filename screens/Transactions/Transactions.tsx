import { SetStateAction, useEffect } from "react";
import { View, ScrollView, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
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
import { getTransactions,getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { Seperator } from "../../components/Seperator/Seperator";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useState } from "react";

// export function Transactions({ navigation,initial}: any) {
  export function Transactions({ navigation}: any) {
  const transactions = useSelector(
    (state: RootState) => state?.transaction?.data
  );

  const transactionsFiltered = useSelector(
    (state: RootState) => state?.transaction?.search
  );

  const [onStartup, setOnStartup] = useState('true');


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
      // console.log("search only porcessed transactions");
      // if (userData) await dispatch<any>(getTransactions(userData));
      if (userData) await dispatch<any>(getTransactions(search));
//  console.log( ' transactions ' ,transactions);

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

  //get transactionns every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every 60s!');
      setOnStartup('true');
      fetchTransactions();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   setOnStartup('true');
  //   console.log("OnStartup navigation",initial)
  //   fetchTransactions();
  // }, [initial]);

//   useEffect(() => {
//     setOnStartup('true');
//     console.log("OnStartup navigation1",onStartup)
// });

  const handleExportData = async () => {
    const pdfUri = await generatePDF(transactions);
    await printAsync({ uri: pdfUri });
  };

  // const handleChange = (event: any) => {
  //   // console.log("event.handleChange ",event.nativeEvent.key)
  //   // setSearchText(event.nativeEvent.key);
  // };

  const handleOnSubmitEditing = (event: any) => {
    // console.log("the search criterial is ",searchText);
       const numberValue = parseInt(searchText, 10);
    if (isNaN(numberValue)) {

      //if input is not a number then here
      let search= {     account_id: userData?.id,
                        name: searchText,
                        sort: "id",
                        direction: "desc"
                      }

              fetchTransactionsWithFilters(search);
              setOnStartup('false');
              // initial='test';
      // console.log(fetchTransactionsWithFilters(search));

    } else {
      //if input is number then here
      let search= { account_id : userData?.id,
                    min_amount: searchText,
                    sort: "id",
                    direction: "desc"
              }
              fetchTransactionsWithFilters(search)
              setOnStartup('false');
              // initial='test';
      // console.log("transactions",transactions);
    }
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
            value={searchText}
            // returnKeyType={"done"}
            // onChange={handleChange}
              onChangeText={(event: string) => setSearchText(event)}
            // onKeyPress={handleKeyPress}
            onSubmitEditing={handleOnSubmitEditing}
       
          />
        </View>
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
              console.log(transaction)
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
