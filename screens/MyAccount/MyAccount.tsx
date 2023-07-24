import { useEffect,useState,useCallback } from "react";
import { View, ScrollView, ActivityIndicator,  RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import { styles } from "./style";
import TransactionItem from "../../components/TransactionItem";
import Typography from "../../components/Typography";
import AccountIcon from "../../assets/icons/Account";
import IncomeBox from "../../components/IncomeBox";
import { getTransactions,getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { RootState } from "../../store";
import Box from "../../components/Box";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { getCurrency } from "../../utils/helpers";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { getPendingAmount } from "../../utils/helpers";

export function MyAccount({ navigation }: any) {
  const transactions = useSelector(
    (state: RootState) => state?.transaction?.data
  );
  const userData = useSelector((state: RootState) => state?.auth?.userData);

  const totalBalance = useSelector(
    (state: RootState) => state?.account?.details
  );


  const loading = useSelector((state:RootState) => state?.transaction.loading);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   // console.log("1 account ",totalBalance);
  //   // fetchTransactions();
  //     setTimeout(() => {
  //       setRefreshing(false);
  //       // console.log("2 get new transactions for userData.id is ", userData);
  //       fetchTransactions();
  //     }, 5000);
  // }, []);

  const refreshTransactions = async () => {

    try {
      setRefreshing(true);
      
      if (userData) {
        let search= {     
          account_id: userData?.id,
          sort: "id",
          direction: "desc",
          status: "PROCESSING"
      }
        // await dispatch<any>(getTransactions(userData));

        await dispatch<any>(getTransactionsWithFilters(search))
        await dispatch<any>(getAccountDetails(userData.id));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchTransactions = async () => {
    try {
      if (userData) {
        let search= {     
          account_id: userData?.id,
          sort: "id",
          direction: "desc",
          status: "PROCESSING"
      }
        // await dispatch<any>(getTransactions(userData));
        // console.log('userData?.id ',userData?.id);
        await dispatch<any>(getTransactionsWithFilters(search))
        await dispatch<any>(getAccountDetails(userData.id));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!!userData?.id) fetchTransactions();
    // console.log("hit this");
  }, [userData?.id]);

    //get transactionns every 15 mins
    useEffect(() => {
      const interval = setInterval(() => {
        // console.log('This will run every 15m is !');
        fetchTransactions();
      }, 1500000);
      return () => clearInterval(interval);
    }, []);

  return (
    <MainLayout navigation={navigation}>
      <ScrollView 
      // bounces={false} 
      bounces={true} 
      // bounces={!refreshing}
       refreshControl={
        <RefreshControl refreshing={refreshing} 
        onRefresh={refreshTransactions} 
        />}
      >
        <Box style={styles.totalBalance}>
        </Box>
        <View style={styles.balancesTitleA}>
              <Typography color={"medium-grey2"} fontWeight={400} fontSize={13}>
                {/* Current {"\n"} Balance */}
                Current 
              </Typography>
              <Typography color={"medium-grey2"} fontWeight={400} fontSize={13}>
                {/* Pending */}
              </Typography>
              <Typography color={"medium-grey2"} fontWeight={400} fontSize={13}>
                {/* Available {"\n"} Balance */}
                Available
              </Typography>
          </View>
        <View style={styles.balancesTitleB}>
        <Typography color={"medium-grey2"} fontWeight={400} fontSize={18}>
                Balance
            </Typography>
            <Typography color={"medium-grey2"} fontWeight={400} fontSize={18}>
                 Pending
            </Typography>
            <Typography color={"medium-grey2"} fontWeight={400} fontSize={18}>
                 Balance
            </Typography>
          </View>


        <View style={styles.balances}>
        <Typography color={"medium-grey2"} fontWeight={400} fontSize={18}>
              {getCurrency(totalBalance?.currency)}{" "}
              {totalBalance?.curbal || "0.0"}
            </Typography>
            <Typography color="#E53CA9"  fontWeight={400} fontSize={18}>
              {getCurrency(totalBalance?.currency)}{" "}
              {getPendingAmount(totalBalance?.opnbal ||"0.00",totalBalance?.curbal ||"0.00")}
            </Typography>
            <Typography color={"medium-grey2"} fontWeight={400} fontSize={18}>
              {getCurrency(totalBalance?.currency)}{" "}
              {totalBalance?.avlbal || "0.00"}
            </Typography>
          </View>
        <View>
          <View style={styles.base}>
            <Heading
              icon={<AccountIcon color="pink" size={18} />}
              title="Latest transactions"
            />
          </View>
          <View>
            <Spinner
              visible={loading}
            />
            {!!transactions?.length ? (
              <>
                <View style={styles.listHead}>
                  <Typography fontFamily="Nunito-SemiBold" fontSize={16}>Name</Typography>
                  <View style={styles.dateLabel}>
                    <Typography fontFamily="Nunito-SemiBold" color="accent-blue" fontSize={16}>Date </Typography>
                  </View>
                  <View style={styles.amountLabel}>
                      <Typography fontFamily="Nunito-SemiBold" fontSize={16}>Amount</Typography>
                  </View>
                  <View style={styles.balanceLabel}>
                    <Typography fontSize={16} fontFamily="Nunito-SemiBold">Balance</Typography>
                  </View>
                  <Typography></Typography>
                </View>
                <View>
                  {transactions?.map((transaction: any) => (
                    <TransactionItem data={transaction} key={transaction.id} />
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.listHead}>
                <Typography fontFamily="Nunito-SemiBold">
                  No Transactions Found
                </Typography>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}
