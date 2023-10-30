import { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import { styles } from "./style";
import TransactionItem from "../../components/TransactionItem";
import Typography from "../../components/Typography";
import AccountIcon from "../../assets/icons/Account";
import Pagination from "../../components/Pagination/Pagination";
import { SearchFilter, getTransactionsWithFilters } from "../../redux/transaction/transactionSlice";
import { RootState } from "../../store";
import Box from "../../components/Box";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { getCurrency } from "../../utils/helpers";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { getPendingAmount, arrayChecker } from "../../utils/helpers";
import { Transaction } from "../../utils/types";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ITransactions {
  data: Transaction[];
  totalPage: number;
}

export function MyAccount({ navigation }: any) {
  const transactions: any = useSelector(
    (state: RootState) => state?.transaction?.data
  );

  const userData = useSelector((state: RootState) => state?.auth?.userData);

  const totalBalance = useSelector(
    (state: RootState) => state?.account?.details
  );

  const loading = useSelector((state: RootState) => state?.transaction.loading);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginateRefresh, setPaginateRefresh] = useState<boolean>(false);
  const [transactionsData, setTransactionsData] = useState<ITransactions>({
    data: [],
    totalPage: 0,
  });

  const route = useRoute();
  const screenName = route.name;

  const fetchTransactions = async () => {
    try {
      setPaginateRefresh(true);
      if (userData && userData?.id) {
        let search: SearchFilter = {
          account_id: userData?.id.toString(),
          sort: "id",
          // direction: "asc",
          direction: "desc",
          status: "SUCCESS", // commented out since the webservice breaks if status is added in the filter - arjajy: august 22, 2023
          limit: 20,
          page,
        };
        // await dispatch<any>(getTransactions(userData));
        // console.log('userData?.id ',userData?.id);
        await dispatch<any>(getTransactionsWithFilters(search));
        await dispatch<any>(getAccountDetails(userData.id));
        setPaginateRefresh(false);
      }
    } catch (error) {
      console.log({ error });
      setRefreshing(false);
      setPaginateRefresh(false);
    } finally {
      setRefreshing(false);
      setPaginateRefresh(false);
    }
  };

  // console.log(" transactionsData?.data?.length",  arrayChecker(transactions.transactions), ' ',transactions.transactions.length,' ',transactions.last_page);

  // console.log(" transactionsData",  transactions);

  // #HACK needs improvement
  // run only once when the component mounts/unmounts
  // will load fetchTransactions on every mount of component/page
  // reset page to 1 when the component unmounts
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      return () => {
        setPage(1);
      };
    }, [])
  );

  // :start:disabled by Aristos because json reponse has changed
  // useEffect(() => {
  //   if (arrayChecker(transactions) && transactions.length > 0) {
  //     // get only first value of array since it contains all data ex last_page, arr of transaction etc
  //     const [transactionsObj] = transactions;
  //     setTransactionsData({
  //       data: transactionsObj?.data || [],
  //       totalPage: parseInt(transactionsObj?.last_page, 10) || 0,
  //     });
  //   }
  // }, [transactions]);

  // :end:disabled by Aristos because json reponse has changed

  //added by Aristos
  useEffect(() => {
    if (
      arrayChecker(transactions?.transactions) &&
      transactions?.transactions.length > 0
    ) {
      // get only first value of array since it contains all data ex last_page, arr of transaction etc
      // const [transactionsObj] = transactions.transactions;
      // console.log("transactionsObj", transactions.transactions.length);

      setTransactionsData({
        data: transactions.transactions || [],
        totalPage: parseInt(transactions.last_page, 10) || 0,
      });
    }
  }, [transactions]);

  /* const refreshTransactions = async () => {
    try {
      setRefreshing(true);

      if (userData) {
        let search = {
          account_id: userData?.id,
          sort: "id",
          direction: "desc",
          // status: "PROCESSING"
          status: "SUCCESS",
        };
        // await dispatch<any>(getTransactions(userData));

        await dispatch<any>(getTransactionsWithFilters(search));
        await dispatch<any>(getAccountDetails(userData.id));
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setRefreshing(false);
    }
  }; */

  useEffect(() => {
    if (!!userData?.id) fetchTransactions();
    // console.log("hit this");
  }, [userData?.id, page]);

  //get transactionns every 15 mins
  /*  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This will run every 15m is !');
      fetchTransactions();
    }, 900000);
    return () => clearInterval(interval);
  }, []);
 */

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    } else {
      setPage(1);
    }
  };

  const handleNextPage = () => {
    if (page < transactionsData?.totalPage) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage(transactionsData?.totalPage);
    }
  };
  return (
    <MainLayout navigation={navigation}>
      <ScrollView
        // bounces={false}
        bounces={true}
        // bounces={!refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTransactions}
          />
        }
      >
        <Box style={styles.totalBalance}></Box>
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
          <Typography color={"medium-grey2"} fontWeight={400} fontSize={17}>
            {getCurrency(totalBalance?.currency)}{" "}
            {totalBalance?.curbal || "0.0"}
          </Typography>
          <Typography color="#E53CA9" fontWeight={400} fontSize={17}>
            {getCurrency(totalBalance?.currency)}{" "}
            {getPendingAmount(
              totalBalance?.avlbal || "0.00",
              totalBalance?.curbal || "0.00"
            )}
          </Typography>
          <Typography color={"medium-grey2"} fontWeight={400} fontSize={17}>
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
            <Spinner visible={loading || paginateRefresh || isLoading} />

            {transactionsData?.data?.length > 0 ? (
              <>
                <View style={styles.listHead}>
                  <Typography fontFamily="Nunito-SemiBold" fontSize={16}>
                    Name
                  </Typography>
                  <View style={styles.dateLabel}>
                    <Typography
                      fontFamily="Nunito-SemiBold"
                      color="accent-blue"
                      fontSize={16}
                    >
                      Date{" "}
                    </Typography>
                    <TouchableOpacity
                      onPress={() => {
                        setIsLoading(true);
                        setSortByDate(!sortByDate);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 400);
                      }}
                    >
                      {sortByDate ? (
                        <Ionicons
                          name="arrow-up"
                          style={styles.arrow}
                          size={16}
                          color="#4472C4"
                        />
                      ) : (
                        <Ionicons
                          name="arrow-down"
                          style={styles.arrow}
                          size={16}
                          color="#4472C4"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.amountLabel}>
                    <Typography fontFamily="Nunito-SemiBold" fontSize={16}>
                      Amount
                    </Typography>
                  </View>
                  {/* <View style={styles.balanceLabel}>
                    <Typography fontSize={16} fontFamily="Nunito-SemiBold">
                      Balance
                    </Typography>
                  </View> */}
                  <Typography></Typography>
                </View>
                <View>
                  {[...transactionsData?.data]
                    .sort((a, b) => {
                      return !sortByDate
                        ? new Date(a.transaction_datetime).getTime() -
                            new Date(b.transaction_datetime).getTime()
                        : new Date(b.transaction_datetime).getTime() -
                            new Date(a.transaction_datetime).getTime();
                    })
                    .map((transaction: any) => (
                      <TransactionItem
                        data={transaction}
                        key={transaction.id}
                      />
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
          <Pagination
            handlePreviousPage={handlePreviousPage}
            page={page}
            lastPage={transactionsData?.totalPage}
            handleNextPage={handleNextPage}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}