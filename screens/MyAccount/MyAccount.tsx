import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
import {
  getCurrency,
  groupedByDateTransactions,
  arrayChecker,
  groupByDateAndSeveralProperties,
} from "../../utils/helpers";
import Spinner from "react-native-loading-spinner-overlay/lib";
import TransactionsByDate from "../../components/TransactionItem/TransactionsByDate";
import TransactionByDateTwo from "../../components/TransactionItem/TransactionByDateTwo";
import { useGetAccountDetailsQuery } from "../../redux/account/accountSliceV2";
import Button from "../../components/Button";
import {
  useLazyGetTransactionsQuery,
  useGetTransactionsQuery,
} from "../../redux/transaction/transactionV2Slice";
import { stat } from "fs";
import AccordionItem from "../../components/AccordionItem";
import ProgressClock from "../../assets/icons/ProgressClock";
import TransactionsLeftRightIcon from "../../assets/icons/TransactionsLeftRight";
import WholeContainer from "../../layout/WholeContainer";

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

  /* const [getTransactionsWithFilter, { data: transactionsWithFilter }] =
    useLazyGetTransactionsQuery();
  const transactionsList = transactionsWithFilter?.transactions;
  const _groupedByDateTransactions =
    groupedByDateTransactions(transactionsList); */

  const transactionsParams = ({ status }: any) => {
    return {
      accountId: userData?.id || 0,
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
      status,
      direction: "desc",
      limit: 100,
      page: 1,
    };
  };

  const {
    data: dataTransactionsPending,
    isLoading: isloadingTransactionsPending,
    isUninitialized: isUninitializedTransactionsPending,
    refetch: refetchTransactionsPending,
  } = useGetTransactionsQuery(transactionsParams({ status: "PROCESSING" }), {
    skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
  });
  const transactionsListPending = dataTransactionsPending?.transactions;
  const groupedByDateTransactionsPending = groupedByDateTransactions(
    transactionsListPending
  );
  /* const groupedByDateTransactionsPendingAndProperties =
    groupByDateAndSeveralProperties({
      items: transactionsListPending,
      groups: ["transaction_datetime", "name"],
    });
 */
  const {
    data: dataTransactionsCompleted,
    isLoading: isloadingTransactionsCompleted,
    isUninitialized: isUninitializedTransactionsCompleted,
    refetch: refetchTransactionsCompleted,
  } = useGetTransactionsQuery(transactionsParams({ status: "SUCCESS" }), {
    skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
  });
  const transactionsListCompleted = dataTransactionsCompleted?.transactions;
  const groupedByDateTransactionsCompleted = groupedByDateTransactions(
    transactionsListCompleted
  );
  /* const groupedByDateTransactionsCompletedAndProperties =
    groupByDateAndSeveralProperties({
      items: transactionsListCompleted,
      groups: ["transaction_datetime", "name"],
    });
 */
  const { data: userAccountInformation } = useGetAccountDetailsQuery({
    accountId: userData?.id || 0,
    accessToken: userTokens?.access_token,
    tokenZiyl: userTokens?.token_ziyl,
  });

  const [refreshing, setRefreshing] = useState<boolean>(false);
  /* const [sortByStatus, setSortByStatus] = useState<boolean>(false); */
  /* const [isLoading, setIsLoading] = useState<boolean>(false); */
  /* const [paginateRefresh, setPaginateRefresh] = useState<boolean>(false); */
  const [isOneTransactionOpen, setIsOneTransactionOpen] =
    useState<boolean>(false);

  /* const fetchTransactions = async (filterParams?: {
    pageNumber?: number;
    status?: string;
  }) => {
    if (userData && userData?.id) {
      let search: SearchFilter = {
        accountId: `${userData?.id}`,
        direction: "desc",
        status: filterParams?.status ? filterParams?.status : defaultStatus,
        limit: 100,
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
  }; */

  /* const handlePreviousPage = () => {
    if (currentPage > 1) {
      const _currentPage = currentPage - 1;
      fetchTransactions({ pageNumber: _currentPage });
    }
  }; */

  /*   const handleNextPage = () => {
    if (currentPage < lastPage) {
      const _currentPage = currentPage + 1;
      fetchTransactions({ pageNumber: _currentPage });
    }
  }; */

  /* useEffect(() => {
    fetchTransactions();
  }, [userId]); */

  const displayListItems = (isLoading: any, items: any): JSX.Element | null => {
    if (isLoading) {
      return (
        <View style={styles.listHead}>
          <Typography fontFamily="Nunito-Bold" fontWeight={600} fontSize={14}>
            Loading...
          </Typography>
        </View>
      );
    }
    if (!isLoading && Object.keys(items).length === 0) {
      return (
        <View style={styles.listHead}>
          <Typography fontFamily="Nunito-Bold" fontWeight={600} fontSize={14}>
            No Transactions Found
          </Typography>
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: 6 }}>
        <View>
          {Object.keys(items).map((date: string) => {
            let _amount: number = 0;
            const transactionsByDate = items[date].map((tx: any) => {
              const { amount } = tx;
              _amount = Number(_amount) + Number(amount);

              return tx;
            });

            const shownData = {
              date,
              totalAmount: _amount.toString(),
              currency: items[date][0].currency,
            };
            return (
              <TransactionByDateTwo
                setIsOneTransactionOpen={setIsOneTransactionOpen}
                key={items[date][0].transaction_uuid}
                shownData={shownData}
                transactionsByDate={transactionsByDate}
                totalAmount={_amount.toString()}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner
        visible={
          /* paginateRefresh || */
          /* isLoading || */
          isloadingTransactionsPending || isloadingTransactionsCompleted
        }
      />
      <ScrollView
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            /* onRefresh={fetchTransactions} */
            onRefresh={() => {}}
          />
        }
      >
        <View style={styles.balancesContainer}>
          <View
            style={[
              styles.balanceItem,
              { borderBottomColor: "#E7038E", width: "37.33%" },
            ]}
          >
            <Typography
              color={"medium-grey2"}
              fontWeight={400}
              fontSize={12}
              marginTop={4}
              lineHeight={14}
            >
              Current Balance
            </Typography>
            <Typography color={"accent-pink"} fontWeight={800} fontSize={18}>
              {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                userAccountInformation?.data?.curbal || 0
              }`}
            </Typography>
          </View>
          <View
            style={[
              styles.balanceItem,
              { borderBottomColor: "#FBB445", width: "26.33%" },
            ]}
          >
            <Typography
              color={"medium-grey2"}
              fontWeight={400}
              fontSize={12}
              marginTop={4}
              lineHeight={14}
            >
              Pending
            </Typography>
            <Typography color={"accent-orange"} fontWeight={800} fontSize={18}>
              {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                userAccountInformation?.data?.blocked_amount || 0
              }`}
            </Typography>
          </View>
          <View
            style={[
              styles.balanceItem,
              { borderBottomColor: "#0DCA9D", width: "37.33%" },
            ]}
          >
            <Typography
              color={"medium-grey2"}
              fontWeight={400}
              fontSize={12}
              marginTop={4}
              lineHeight={14}
            >
              Available Balance
            </Typography>
            <Typography color={"accent-green"} fontWeight={800} fontSize={18}>
              {`${getCurrency(userAccountInformation?.data?.currency || 0)} ${
                userAccountInformation?.data?.avlbal || 0
              }`}
            </Typography>
          </View>
        </View>
        <View>
          {/* <View style={styles.base}>
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
          </View> */}
          <View>
            <AccordionItem
              title="Pending"
              iconColor="#FBB445"
              iconSize={28}
              isOpenByDefault
              IconLeft={() => <ProgressClock color="#FBB445" size={18} />}
            >
              <View style={styles.accordionBodyContainer}>
                {displayListItems(
                  isloadingTransactionsPending,
                  groupedByDateTransactionsPending
                )}
              </View>
            </AccordionItem>
            <AccordionItem
              title="Latest transactions"
              iconColor="#E7038E"
              iconSize={28}
              isOpenByDefault
              IconLeft={() => (
                <TransactionsLeftRightIcon color="#E7038E" size={18} />
              )}
            >
              <View style={styles.accordionBodyContainer}>
                {displayListItems(
                  isloadingTransactionsCompleted,
                  groupedByDateTransactionsCompleted
                )}
              </View>
            </AccordionItem>
            {/* {_groupedByDateTransactions ? (
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
            )} */}
          </View>
          {/* Aristos: temp disabled this */}
          {/* <Pagination
            handlePreviousPage={handlePreviousPage}
            page={currentPage || 0}
            lastPage={lastPage || 0}
            handleNextPage={handleNextPage}
          /> */}
        </View>
      </ScrollView>
    </MainLayout>
  );
}
