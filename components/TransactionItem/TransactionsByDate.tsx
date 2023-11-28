import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import {
  formatAmountTableValue,
  formatDateTableValue,
  getFormattedDate,
} from "../../utils/helpers";
import { styles } from "./styles";
import ArrowDown from "../../assets/icons/ArrowDown";
import Button from "../Button";
import Chip from "../Chip";
import * as Clipboard from "expo-clipboard";
import CalenderEmptyIcon from "../../assets/icons/CalenderEmpty";
import Box from "../Box";
import Typography from "../Typography";
import EuroIcon from "../../assets/icons/Euro";
import DollarIcon from "../../assets/icons/Dollar";
import { generateTransactionPDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { Transaction } from "../../models/Transactions";
import ArrowRight from "../../assets/icons/ArrowRight";
import CardIcon from "../../assets/icons/Card";
import vars from "../../styles/vars";
import { Divider } from "react-native-paper";
import CopyClipboard from "../../assets/icons/CopyClipboard";

interface TransactionItemProps {
  transactionsByDate: Transaction[];
  totalAmount: string;
  shownData: any;
}
const defaultStatus = "SUCCESS";

const TransactionsByDate: React.FC<TransactionItemProps> = ({
  transactionsByDate,
  totalAmount,
  shownData,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOnOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const handleExportData = async (): Promise<void> => {
    const pdfUri = await generateTransactionPDF([transactionsByDate]);
    await printAsync({ uri: pdfUri });
  };

  // create a box from material ui showing the name and amount of each transactions

  const TransactionByDate = ({ transactions }: any) => {
    const [openTransactionIndex, setOpenTransactionIndex] = useState<
      number | null
    >(null);

    const handleToggleDetails = (index: number) => {
      setOpenTransactionIndex((prevIndex) =>
        prevIndex === index ? null : index
      );
    };

    return (
      <>
        {transactions.map((transaction: Transaction, index: number) => (
          <>
            <Box
              style={styles.detailMobileForEachTransactionContainer}
              key={index}
            >
              <Box style={styles.detailMobileForEachTransactionWrapper}>
                <View style={styles.nameContainer}>
                  {/* <Text style={styles.nameDetailMobile}>Name:</Text> */}
                  <CardIcon size={14} color={"heavy-grey"} />
                  <Text numberOfLines={1} style={styles.valueDetailMobile}>{transaction.name}</Text>
                </View>
                <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignSelf: 'auto', justifyContent: 'flex-end' }}>
                  <Box
                    style={{ marginTop: 8 }}
                  >
                    {shownData.currency === "EUR" ? (
                      <EuroIcon
                        size={18}
                        color={+transaction.amount > 0 ? "green" : "red"}
                      />
                    ) : (
                      <DollarIcon
                      size={18}
                      color="#278664"
                      />
                    )}
                  </Box>
                  <Box>
                    <Text
                      style={[
                        styles.amountDetailMobile,
                        Number(transaction.amount) > 0
                          ? styles.amountAddedDetail
                          : styles.amountDeductedDetail,
                      ]}
                    >
                      {/* {`${isBalanceAdded ? `+ ` : `- `} ${transaction.amount}`} */}
                      {/* {transaction.amount} */}
                      {formatAmountTableValue(
                        transaction.amount,
                        shownData.currency
                      )}

                      <TouchableOpacity
                        onPress={() => handleToggleDetails(index)}
                        style={{ paddingTop: 10, paddingLeft: 10 }}
                      >
                        {openTransactionIndex === index ? (
                          <ArrowDown
                            color="pink"
                            size={10}
                            style={{ paddingRight: 15 }}
                          />
                        ) : (
                          <ArrowRight color="pink" size={10} />
                        )}
                      </TouchableOpacity>
                    </Text>
                  </Box>
                </View>
              </Box>
            </Box>
           
                {openTransactionIndex === index ? (
                  <Pressable>
                   <View style={{backgroundColor: '#fff', paddingHorizontal: 18, borderTopColor: '#DDD', borderTopWidth: 1, paddingVertical: 15}}>
                      <Box style={styles.detailMobile}>
                        <Text style={styles.nameDetailMobile}>Transaction Reference</Text>
                        <Text style={styles.valueDetailMobile}>
                          {transaction?.reference_no}
                        </Text>
                      </Box>
                      <Box style={styles.detailMobile}>
                        <Text style={styles.nameDetailMobile}>Transaction Status</Text>
                        <View style={{overflow: 'hidden', width: '36%', borderRadius: 8, marginTop: 4}}>
                          <Text style={ transaction?.status === defaultStatus ? styles.valueDetailMobileStatusSuccess : styles.valueDetailMobileStatusFailed}>
                            {transaction?.status}
                            { /* add UI here to show the reason for a unsuccessfull transaction */}
                          </Text>
                        </View>
                      </Box>
                      <Divider style={{marginVertical: 5}} />
                      <Box style={styles.detailMobile}>
                        <Text style={styles.nameDetailMobile}>Description</Text>
                        <Text style={styles.valueDetailMobile}>
                          {transaction?.description}
                        </Text>
                      </Box>
                      <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                        <View style={styles.detailMobileInnerDetail}>
                          <Box style={styles.detailMobile}>
                            <Text style={styles.nameDetailMobile}>IBAN</Text>
                            <View style={{display: 'flex', flexDirection: 'row', backgroundColor: 'none'}}>
                              <Text style={styles.valueDetailMobile}>
                                {transaction?.iban && `${transaction?.iban.substring(0, 14)}...`}
                              </Text>
                              <TouchableOpacity 
                                onPress={async () => await Clipboard.setStringAsync(transaction?.iban || "")}
                                style={{paddingLeft: 10, paddingTop: 3}}
                                >
                                <CopyClipboard color="heavy-blue" size={14} />
                              </TouchableOpacity>
                            </View>
                          </Box>
                        </View>
                        <View style={styles.detailMobileInnerDetail}>
                          <Box style={styles.detailMobile}>
                            <Text style={styles.nameDetailMobile}>BIC</Text>
                            <Text style={styles.valueDetailMobile}>
                              {transaction?.bic}
                            </Text>
                          </Box>
                        </View>
                      </View>
                      <Divider style={{marginVertical: 5}} />
                      <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                        <View style={styles.detailMobileInnerDetail}>
                          <Box style={styles.detailMobile}>
                            <Text style={styles.nameDetailMobile}>Type</Text>
                            <Text style={styles.valueDetailMobile}>
                              {transaction?.trn_type}
                            </Text>
                          </Box>
                        </View>
                        <View style={styles.detailMobileInnerDetail}>
                          <Box style={styles.detailMobile}>
                            <Text style={styles.nameDetailMobile}>Date & Time</Text>
                            <Text style={styles.valueDetailMobile}>
                              {getFormattedDate(transaction?.transaction_datetime)}
                            </Text>
                          </Box>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ) : null}

          </>
        ))}
      </>
    );
  };

  return (
    <View>
      <Pressable onPress={handleOnOpen}>
        <View style={[styles.base, isOpen && styles.isOpen]}>
          <Box
            style={{ 
              textAlign:'left', 
              // alignItems: 'start', 
              color: 'white', 
              borderRadius: 5,
              padding: 5, 
              display: 'flex', 
              flexDirection: 'row',
              width:"45%"
            }}
          >
            <CalenderEmptyIcon size={14} color="blue" />
            <Typography fontSize={14} textAlign="left">
              {" "}
              {getFormattedDate(shownData.date)}
            </Typography>
          </Box>
          <Box
            style={{ 
              textAlign:'center', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              borderRadius: 5,
              padding: 5, 
              display: 'flex', 
              flexDirection: 'row',
              width:"45%"
            }}
          >
            {shownData.currency === "EUR" ? (
              <EuroIcon size={18} color={+totalAmount > 0 ? "green" : "red"} />
            ) : (
              <DollarIcon size={18} color="#278664" />
            )}
            <Typography fontSize={14}>
              {formatAmountTableValue(totalAmount, shownData.currency)}
            </Typography>
          </Box>
          <Box
            style={{ 
              textAlign:'center', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              borderRadius: 5,
              padding: 5, 
              display: 'flex', 
              flexDirection: 'row',
              width:"45%"
            }}
          >
            <Box style={styles.arrowCell}>
              {isOpen ? (
                <ArrowDown color="blue" />
              ) : (
                <ArrowRight color="blue" />
              )}
            </Box>
          </Box>
        </View>
      </Pressable>
      {/* show list of all transactionsByDate */}
      {isOpen && (
        <>
          <TransactionByDate transactions={transactionsByDate} />
        </>
      )}
    </View>
  );
};
export default TransactionsByDate;
