import { useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
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
        await dispatch<any>(getTransactions(search))
        await dispatch<any>(getAccountDetails(userData.id));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!!userData?.id) fetchTransactions();
  }, [userData?.id]);

  return (
    <MainLayout navigation={navigation}>
      <ScrollView bounces={false}>
        <Box style={styles.totalBalance}>
          <Typography color={"medium-grey2"} fontWeight={400} fontSize={14}>
            Total balance
          </Typography>
          <Typography fontFamily="Nunito-SemiBold" fontSize={18}>
            {getCurrency(totalBalance?.currency)}{" "}
            {totalBalance?.curbal || "0.00"}
          </Typography>
        </Box>
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
                  <Typography fontFamily="Nunito-SemiBold" fontSize={13}>Name</Typography>
                  <Typography fontFamily="Nunito-SemiBold" color="accent-blue" fontSize={13}>
                    Date
                  </Typography>
                  <Typography fontFamily="Nunito-SemiBold" fontSize={13}>Amount</Typography>
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
