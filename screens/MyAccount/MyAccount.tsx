import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
import MainLayout from "../../layout/Main";
import { styles } from "./style";
import TransactionIcon from "../../assets/icons/Transaction";
import Typography from "../../components/Typography";
import AccountIcon from "../../assets/icons/Account";
import Pagination from "../../components/Pagination/Pagination";
import { SearchFilter } from "../../redux/transaction/transactionSlice";
import { RootState } from "../../store";
import Box from "../../components/Box";
import { getCurrency, groupedByDateTransactions } from "../../utils/helpers";
import Spinner from "react-native-loading-spinner-overlay/lib";
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import Button from "../../components/Button";
import { useLazyGetTransactionsQuery } from "../../redux/transaction/transactionV2Slice";

const defaultStatus = "SUCCESS";
export function MyAccount({ navigation }: any) {
  const transactions: any = useSelector(
    (state: RootState) => state?.transaction?.data
  );
  const currentPage = transactions?.current_page;
  const lastPage = transactions?.last_page;
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const userId = userData?.id;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const [getTransactionsWithFilter, { data: transactionsWithFilter }] =
    useLazyGetTransactionsQuery();
  const transactionsList = transactionsWithFilter?.transactions;
  const _groupedByDateTransactions =
    groupedByDateTransactions(transactionsList);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sortByStatus, setSortByStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginateRefresh, setPaginateRefresh] = useState<boolean>(false);
  const [isOneTransactionOpen, setIsOneTransactionOpen] =
    useState<boolean>(false);
  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });

  const fetchTransactions = async (filterParams?: {
    pageNumber?: number;
    status?: string;
  }) => {
    if (userData && userData?.id) {
      let search: SearchFilter = {
        accountId: `${userData?.id}`,
        direction: "desc",
        status: filterParams?.status ? filterParams?.status : defaultStatus,
        limit: 20,
        page: filterParams?.pageNumber || 1,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      };
      setIsLoading((prev) => !prev);
      getTransactionsWithFilter(search)
        .unwrap()
        .then((res) => {
          setRefreshing(false);
          setPaginateRefresh(false);
        })
        .catch((error) => {
          console.log({ error });
          setRefreshing(false);
          setPaginateRefresh(false);
        })
        .finally(() => {
          setRefreshing(false);
          setPaginateRefresh(false);
          setIsLoading(false);
        });
      setPaginateRefresh(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const _currentPage = currentPage - 1;
      fetchTransactions({ pageNumber: _currentPage });
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      const _currentPage = currentPage + 1;
      fetchTransactions({ pageNumber: _currentPage });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return (
    <MainLayout navigation={navigation}>
      <ScrollView
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTransactions}
          />
        }
      >
        <View style={styles.balanceContainer}>
          <Box
            style={{
              ...styles.totalBalance,
              ...styles.currentBalanceShadow,
              ...styles.balanceFirstThird,
            }}
          >
            <Typography color={"medium-grey2"} fontWeight={400} fontSize={12} lineHeight={14}>
              Current Balance
            </Typography>
            <Typography color={"accent-pink"} fontWeight={600} fontSize={18} ineHeight={14}>
              {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                userAccountInformation?.data?.curbal || 0
              }`}
            </Typography>
          </Box>
          <Box
            style={{
              ...styles.totalBalance,
              ...styles.pendingBalanceShadow,
              ...styles.pendingBalance,
            }}
          >
            <Typography color={"medium-grey2"} fontWeight={400} fontSize={12} lineHeight={14}>
              Pending
            </Typography>
            <Typography color={"accent-orange"} fontWeight={600} fontSize={18} ineHeight={14}>
              {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                userAccountInformation?.data?.blocked_amount || 0
              }`}
            </Typography>
          </Box>
          <Box
            style={{
              ...styles.totalBalance,
              ...styles.availableBalanceShadow,
              ...styles.balanceFirstThird,
            }}
          >
            <Typography color={"medium-grey2"} fontWeight={400} fontSize={12} lineHeight={14}>
              Available Balance
            </Typography>
            <Typography color={"accent-green"} fontWeight={600} fontSize={18} ineHeight={14}>
              {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                userAccountInformation?.data?.avlbal || 0
              }`}
            </Typography>
          </Box>
        </View>
        <View>
          <View style={styles.base}>
            <Heading
              icon={<AccountIcon color="pink" size={18} />}
              title="Latest Transactions"
              rightAction={
                <TouchableOpacity onPress={() => {}}>
                  <Button
                    color="light-pink"
                    style={styles.sortButton}
                    onPress={() => {
                      setSortByStatus(!sortByStatus);
                      fetchTransactions({
                        status: sortByStatus ? "SUCCESS" : "PROCESSING",
                      });
                    }}
                    leftIcon={<TransactionIcon size={18} color="pink" />}
                  >
                    {sortByStatus ? "Pending" : "Completed"}
                  </Button>
                </TouchableOpacity>
              }
            />
          </View>
          <View>
            <Spinner visible={paginateRefresh || isLoading} />
            {_groupedByDateTransactions ? (
              <>
                <View>
                  {_groupedByDateTransactions
                    ? Object.keys(_groupedByDateTransactions).map(
                        (date: string) => {
                          let _amount: number = 0;
                          const transactionsByDate = _groupedByDateTransactions[
                            date
                          ].map((tx) => {
                            const { amount } = tx;
                            _amount = Number(_amount) + Number(amount);

                            return tx;
                          });

                          const shownData = {
                            date,
                            totalAmount: _amount.toString(),
                            currency:
                              _groupedByDateTransactions[date][0].currency,
                          };
                          return (
                            <TransactionsByDate
                              setIsOneTransactionOpen={setIsOneTransactionOpen}
                              key={
                                _groupedByDateTransactions[date][0]
                                  .transaction_uuid
                              }
                              shownData={shownData}
                              transactionsByDate={transactionsByDate}
                              totalAmount={_amount.toString()}
                            />
                          );
                        }
                      )
                    : null}
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
            page={currentPage || 0}
            lastPage={lastPage || 0}
            handleNextPage={handleNextPage}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
}
