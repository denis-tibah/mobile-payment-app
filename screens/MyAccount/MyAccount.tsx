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
import {
  SearchFilter,
  getTransactionsWithFilters,
} from "../../redux/transaction/transactionSlice";
import { RootState } from "../../store";
import Box from "../../components/Box";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { getCurrency, groupedByDateTransactions } from "../../utils/helpers";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { getPendingAmount, arrayChecker } from "../../utils/helpers";
import { Transaction } from "../../utils/types";
import Ionicons from "react-native-vector-icons/Ionicons";
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";

interface ITransactions {
  data: Transaction[];
  totalPage: number;
}

export function MyAccount({ navigation }: any) {
  const transactions: any = useSelector(
    (state: RootState) => state?.transaction?.data
  );
  const currentPage = transactions?.current_page;
  const lastPage = transactions?.last_page;
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const loading = useSelector((state: RootState) => state?.transaction.loading);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginateRefresh, setPaginateRefresh] = useState<boolean>(false);
  const _groupedByDateTransactions = groupedByDateTransactions(transactions?.transactions);
  const route = useRoute();
  const screenName = route.name;

  const fetchTransactions = async (pageNumber?: number) => {
    try {
      setPaginateRefresh(true);
      if (userData && userData?.id) {
        let search: SearchFilter = {
          account_id: userData?.id.toString(),
          sort: "id",
          direction: "desc",
          status: "SUCCESS", // commented out since the webservice breaks if status is added in the filter - arjajy: august 22, 2023
          limit: 20,
          page: pageNumber || 1,
        };
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const _currentPage = currentPage - 1;
      fetchTransactions(_currentPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      const _currentPage = currentPage + 1;
      fetchTransactions(_currentPage);
    }
  };

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
  // useEffect(() => {
  //   if (
  //     arrayChecker(transactions?.transactions) &&
  //     transactions?.transactions.length > 0
  //   ) {
      // get only first value of array since it contains all data ex last_page, arr of transaction etc
      // const [transactionsObj] = transactions.transactions;
      // console.log("transactionsObj", transactions.transactions.length);

  //     setTransactionsData({
  //       data: transactions.transactions || [],
  //       totalPage: parseInt(transactions.last_page, 10) || 0,
  //     });
  //   }
  // }, [transactions]);

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
      <View style={styles.balanceContainer}>
        <Box style={{...styles.totalBalance, ...styles.currentBalanceShadow}}>
          <Typography color={"medium-grey2"} fontWeight={400} fontSize={12}>
            Current Balance
          </Typography>
          <Typography color={"accent-pink"} fontWeight={600} fontSize={16}>
            € 13,000.83
          </Typography>
        </Box>
        <Box style={{...styles.totalBalance, ...styles.pendingBalanceShadow}}>
        <Typography color={"medium-grey2"} fontWeight={400} fontSize={12}>
            Pending
          </Typography>
          <Typography color={"accent-orange"} fontWeight={600} fontSize={16}>
            € 12.33
          </Typography>
        </Box>
        <Box style={{...styles.totalBalance, ...styles.availableBalanceShadow}}>
        <Typography color={"medium-grey2"} fontWeight={400} fontSize={12}>
            Available Balance
          </Typography>
          <Typography color={"accent-green"} fontWeight={600} fontSize={16}>
            € 13,000.83
          </Typography>
        </Box>
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
            {_groupedByDateTransactions ? 
              (
                <>
                  <View>
                  {_groupedByDateTransactions ? Object.keys(_groupedByDateTransactions)
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
                    }) : null}
                  </View>
                </>
              )
            : (
              <View style={styles.listHead}>
                <Typography fontFamily="Nunito-SemiBold">
                  No Transactions Found
                </Typography>
              </View>
            )}
          </View>
          <Pagination
            handlePreviousPage={handlePreviousPage}
            page={currentPage || 0}
            lastPage={lastPage || 0}
            handleNextPage={handleNextPage}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}
