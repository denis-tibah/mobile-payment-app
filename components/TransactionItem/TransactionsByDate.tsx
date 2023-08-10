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
import CalenderEmptyIcon from "../../assets/icons/CalenderEmpty";
import Box from "../Box";
import Typography from "../Typography";
import EuroIcon from "../../assets/icons/Euro";
import DollarIcon from "../../assets/icons/Dollar";
import { generateTransactionPDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { Transaction } from "../../models/Transactions";
import Export from "../../assets/icons/Export";
import { GroupedByDateTransaction, TransactionStatus } from "../../screens/Transactions/Transactions";
import ArrowRight from "../../assets/icons/ArrowRight";

interface TransactionItemProps {
  transactionsByDate: Transaction[];
  totalAmount: string;
  shownData: any;
}

const TransactionsByDate: React.FC<TransactionItemProps> = ({transactionsByDate, totalAmount, shownData}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOnOpen = (): void => {
    setIsOpen(!isOpen);
  };


  const handleExportData = async (): Promise<void> => {
    const pdfUri = await generateTransactionPDF([transactionsByDate]);
    await printAsync({ uri: pdfUri });
  };



  // create a box from material ui showing the name and amount of each transactions

  const TransactionByDate = ({transactions}: any) => {
    const [openTransactionIndex, setOpenTransactionIndex] = useState<number | null>(null);

    const handleToggleDetails = (index: number) => {
      setOpenTransactionIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
      <>
        {transactions.map((transaction: Transaction, index: number) => {
          const isBalanceAdded = Number(transaction.amount) > 0 ? true : false;
          return (
            <Box style={styles.detailMobileForEachTransactionContainer} key={index}>
              <Box style={styles.detailMobileForEachTransactionWrapper}>
                <Text style={styles.nameDetailMobile}>Name:</Text>
                <Text style={styles.valueDetailMobile}>{transaction.name}</Text>
                <View style={{ alignSelf: 'flex-end', flex: 1}}>
                  <Text style={[styles.amountDetailMobile, Number(transaction.amount) > 0 ? styles.amountAddedDetail : styles.amountDeductedDetail]}>
                    {/* {`${isBalanceAdded ? `+ ` : `- `} ${transaction.amount}`} */}
                    {transaction.amount}
                    <TouchableOpacity onPress={() => handleToggleDetails(index)} style={{paddingTop: 10, paddingLeft: 10}}>
                      { openTransactionIndex === index ? <ArrowDown color="pink" size={10} /> : <ArrowRight color="pink" size={10}/>}
                    </TouchableOpacity>
                  </Text>
                </View>
              </Box>
              <View>
                { openTransactionIndex === index ? (
                  <>
                  <Box style={styles.detailMobile}>
                    <Text style={styles.nameDetailMobile}>Reference:</Text>
                    <Text style={styles.valueDetailMobile}>
                      {transaction?.reference_no}
                    </Text>
                  </Box>
                  <Box style={styles.detailMobile}>
                    <Text style={styles.nameDetailMobile}>Description:</Text>
                    <Text style={styles.valueDetailMobile}>
                      {transaction?.description}
                    </Text>
                  </Box>
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>Type:</Text>
                      <Text style={styles.valueDetailMobile}>
                        {/* Invoice_{data?.reference_no} */}
                        {/* {transaction?.trn_type} */}
                        {transaction?.service}
                      </Text>
                    </Box>
                  {/* <Box style={styles.cardDetails}> */}
                  <Box>
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>IBAN:</Text>
                      {/* <Text style={styles.valueDetailMobile}>{transaction?.iban}</Text> */}
                      <Text style={styles.valueDetailMobile}>{transaction?.cr_iban}</Text>
                    </Box>
                    {/* <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>BIC:</Text>
                      <Text style={styles.valueDetailMobile}>{transaction?.bic}</Text>
                    </Box> */}
                    {/* <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>Running Balance:</Text>
                      <Text style={styles.valueDetailMobile}>

                        <Box style={styles.eurosign}>
                          <EuroIcon size={18} color= "black" />
                            <Typography fontSize={16}>
                              {transaction?.running_balance}
                            </Typography>
                        </Box>
                      </Text>
                    </Box> */}
                  </Box>
                  </>
                ) : null}
              </View>
            </Box>
          )
        })}
      </>
    )
  }

  return (
    <>
      <Pressable onPress={handleOnOpen}>
        <View style={[styles.base, isOpen && styles.isOpen]}>
          <Box
            display="flex"
            paddingLeft={12}
            flexDirection="row"
            alignItems="center"
            width="40%"
          >
            <CalenderEmptyIcon size={14} color="blue" />
            <Typography fontSize={14}>
              {" "}{getFormattedDate(shownData.date)}
            </Typography>
          </Box>
          <Box
            width="45%"
            paddingLeft={80}
            display="flex"
            flexDirection="row"
            alignItems="center"
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
            width="40%"
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
          {/* <EuroIcon size={18} color= "green" />
          <Typography fontSize={14}>
              {formatAmountTableValue(shownData.balance, shownData.currency)}
            </Typography> */}
                <Box style={styles.cell}>
                  {isOpen ? <ArrowDown color="blue" /> : <ArrowRight color="blue" />}
                </Box>
          </Box>
        </View>
      </Pressable>
      {/* show list of all transactionsByDate */}
      { isOpen && (
        <>
          <TransactionByDate transactions={transactionsByDate}/>
        </>
      )}
    </>
  );

  // return (
  //   <>
  //     <Pressable onPress={handleOnOpen}>
  //       <View style={[styles.base, isOpen && styles.isOpen]}>
  //         <Box
  //           display="flex"
  //           paddingLeft={-5}
  //           flexDirection="row"
  //           alignItems="center"
  //           width="40%"
  //         >
  //           <CalenderEmptyIcon size={14} color="blue" />
  //           <Typography fontSize={14}>
  //             {" "}
  //             {getFormattedDate(groupedTransactions?.transaction_datetime)}
  //           </Typography>
  //         </Box>
  //         <Box
  //           width="40%"
  //           paddingLeft={15}
  //           display="flex"
  //           flexDirection="row"
  //           alignItems="center"
  //         >
  //           {groupedTransactions?.currency === "EUR" ? (
  //             <EuroIcon size={18} color={+totalAmount > 0 ? "green" : "red"} />
  //           ) : (
  //             <DollarIcon size={18} color="#278664" />
  //           )}
  //           <Typography fontSize={14}>
  //             {formatAmountTableValue(totalAmount, groupedTransactions?.currency)}
  //           </Typography>
  //         </Box>

  //         <Box
  //           width="40%"
  //           display="flex"
  //           flexDirection="row"
  //           alignItems="center"
  //         >
  //         <EuroIcon size={18} color= "green" />
  //         <Typography fontSize={14}>
  //             {formatAmountTableValue(groupedTransactions?.running_balance, groupedTransactions?.currency)}
  //           </Typography>
  //               <Box style={styles.cell}>
  //                 {isOpen ? <ArrowDown color="blue" /> : <ArrowDown color="blue" />}
  //               </Box>
  //         </Box>
  //       </View>
  //     </Pressable>

  //     {isOpen && (
  //       <Box>
  //         <Box style={styles.separator}></Box>
  //         <Box style={styles.rowDetail}>
  //           <Box style={styles.detailMobileContainer}>
  //             <Box style={styles.detailMobileWrapper}>
  //               { nameAndAmount.map((value, index) => {
  //                 const isBalanceAdded = Number(value.amount) > 0 ? true : false;
  //                 return (
  //                   <Box style={styles.detailMobile} key={index}>
  //                     <Text style={styles.nameDetailMobile}>Name:</Text>
  //                     <Text style={styles.valueDetailMobile}>{value.name}</Text>
  //                     <View style={{ alignSelf: 'flex-end', flex: 1}}>
  //                       <Text style={[
  //                         styles.amountDetailMobile, 
  //                         isBalanceAdded ? styles.amountAddedDetail : styles.amountDeductedDetail]}>{`${isBalanceAdded ? `+ ` : `- `} ${value.amount}`}</Text>
  //                     </View>
  //                   </Box>
  //                 )
  //               })
  //               }
  //               <Box style={styles.detailMobile}>
  //                 <Text style={styles.nameDetailMobile}>Reference:</Text>
  //                 <Text style={styles.valueDetailMobile}>
  //                   {groupedTransactions?.reference_no}
  //                 </Text>
  //               </Box>
  //               <Box style={styles.detailMobile}>
  //                 <Text style={styles.nameDetailMobile}>Description:</Text>
  //                 <Text style={styles.valueDetailMobile}>
  //                   {groupedTransactions?.description}
  //                 </Text>
  //               </Box>
  //               <Box style={styles.cardDetails}>
  //                 <Box style={styles.detailMobile}>
  //                   <Text style={styles.nameDetailMobile}>IBAN:</Text>
  //                   <Text style={styles.valueDetailMobile}>{groupedTransactions?.iban}</Text>
  //                 </Box>
  //                 <Box style={styles.detailMobile}>
  //                   <Text style={styles.nameDetailMobile}>BIC:</Text>
  //                   <Text style={styles.valueDetailMobile}>{groupedTransactions?.bic}</Text>
  //                 </Box>
  //                 <Box style={styles.detailMobile}>
  //                   <Text style={styles.nameDetailMobile}>Running Balance:</Text>
  //                   <Text style={styles.valueDetailMobile}>

  //                     <Box style={styles.eurosign}>
  //                       <EuroIcon size={18} color= "black" />
  //                         <Typography fontSize={14}>
  //                           {groupedTransactions?.running_balance}
  //                         </Typography>
  //                     </Box>
  //                   </Text>
  //                 </Box>
  //               </Box>
  //               <View style={styles.detailMobile}>
  //                 <Text style={styles.nameDetailMobile}>Time:</Text>
  //                 <Text style={styles.valueDetailMobile}>
  //                   {groupedTransactions?.transaction_datetime}
  //                 </Text>
  //               </View>
  //               <Box style={styles.downloadContainer}>
  //                 <Button
  //                   onPress={handleExportData}
  //                   color="light-blue"
  //                   leftIcon={<Export size={14} color="blue" />}
  //                 >
  //                   Download
  //                 </Button>
  //               </Box>
  //             </Box>
  //             <Box style={styles.statusItem}>
  //               {groupedTransactions?.status === TransactionStatus.SUCCESS && (
  //                 <Chip label="Completed" color="green" />
  //               )}
  //               {groupedTransactions?.status === TransactionStatus.PENDING && (
  //                 <Chip label="Pending" color="orange" />
  //               )}
  //               {groupedTransactions?.status === TransactionStatus.CANCELLED && (
  //                 <Chip label="Cancelled" color="red" />
  //               )}
  //                 {groupedTransactions?.status === TransactionStatus.PROCESSING && (
  //                 <Chip label="Processing" color="red" />
  //               )}
  //             </Box>
  //           </Box>
  //         </Box>
  //       </Box>
  //     )}
  //   </>
  // );
}
export default TransactionsByDate;