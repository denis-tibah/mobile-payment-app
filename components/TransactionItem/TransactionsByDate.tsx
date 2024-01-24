import React, { useState } from "react";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import {
  formatAmountTableValue,
  getFormattedDate,
  getFormattedDateAndTime,
} from "../../utils/helpers";
import { styles } from "./styles";
import ArrowDown from "../../assets/icons/ArrowDown";
import Button from "../Button";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import CalenderEmptyIcon from "../../assets/icons/CalenderEmpty";
import Box from "../Box";
import Typography from "../Typography";
import EuroIcon from "../../assets/icons/Euro";
import DollarIcon from "../../assets/icons/Dollar";
import { Transaction } from "../../models/Transactions";
import ArrowRight from "../../assets/icons/ArrowRight";
import CardIcon from "../../assets/icons/Card";
import vars from "../../styles/vars";
import { Divider } from "react-native-paper";
import CopyClipboard from "../../assets/icons/CopyClipboard";

interface TransactionItemProps {
  setIsOneTransactionOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  // isOpen: boolean;
  transactionsByDate: Transaction[];
  totalAmount: string;
  shownData: any;
}
const defaultStatus = "SUCCESS";

const TransactionsByDate: React.FC<TransactionItemProps> = ({
  transactionsByDate,
  totalAmount,
  shownData,
  setIsOneTransactionOpen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnOpen = (): void => {
    setIsOpen(!isOpen);
    setIsOneTransactionOpen && setIsOneTransactionOpen(!isOpen);
  };

  // const handleExportData = async (): Promise<void> => {
  //   const pdfUri = await generateTransactionPDF([transactionsByDate]);
  //   await printAsync({ uri: pdfUri });
  // };

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
        {transactions.map((transaction: Transaction, index: number) => {
          return (
            <>
              <Box
                style={styles.detailMobileForEachTransactionContainer}
                key={index}
              >
                <Box style={styles.detailMobileForEachTransactionWrapper}>
                  <View style={styles.nameContainer}>
                    {/* <Text style={styles.nameDetailMobile}>Name:</Text> */}
                    <CardIcon size={14} color={"heavy-grey"} />
                    <Text numberOfLines={1} style={styles.valueDetailMobile}>
                      {transaction.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignSelf: "auto",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Box style={{ marginTop: 8 }}>
                      {shownData.currency === "EUR" ? (
                        <EuroIcon
                          size={18}
                          color={+transaction.amount > 0 ? "green" : "red"}
                        />
                      ) : (
                        <DollarIcon size={18} color="#278664" />
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
                              color="heavy-grey"
                              size={12}
                              style={{ paddingRight: 14 }}
                            />
                          ) : (
                            <ArrowRight
                              color="heavy-grey"
                              size={12}
                              style={{ paddingRight: 14 }}
                            />
                          )}
                        </TouchableOpacity>
                      </Text>
                    </Box>
                  </View>
                </Box>
              </Box>
              {openTransactionIndex === index ? (
                <Pressable>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      paddingHorizontal: 18,
                      borderTopColor: "#DDD",
                      borderTopWidth: 1,
                      paddingVertical: 15,
                    }}
                  >
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>
                        Transaction Reference
                      </Text>
                      <Text style={styles.valueDetailMobile}>
                        {transaction?.reference_no}
                      </Text>
                    </Box>
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>
                        Transaction Status
                      </Text>
                      <View
                        style={{
                          overflow: "hidden",
                          width: "36%",
                          borderRadius: 8,
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={
                            transaction?.status === defaultStatus
                              ? styles.valueDetailMobileStatusSuccess
                              : styles.valueDetailMobileStatusFailed
                          }
                        >
                          {transaction?.status}
                          {/* add UI here to show the reason for a unsuccessfull transaction */}
                        </Text>
                      </View>
                    </Box>
                    {transaction?.description != null  ? (
                      <Divider style={{ marginVertical: 5 }} />
                    ): null} 
                     {/* do not show description if the value is null */}
                     {transaction?.description != null  ? (
                        <Box style={styles.detailMobile}>
                          <Text style={styles.nameDetailMobile}>Description</Text>
                          <Text style={styles.valueDetailMobile}>
                            {transaction?.description}
                          </Text>
                        </Box>
                       ): null} 
                       {/* only show Iban and Bic for sepa transfer */}
                       {transaction?.service != "DEBIT CARD"  ? (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                                  <View style={styles.detailMobileInnerDetail}>
                                    <Box style={styles.detailMobile}>
                                      <Text style={styles.nameDetailMobile}>IBAN</Text>
                                      <View
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                          backgroundColor: "none",
                                        }}
                                      >
                                        <Text style={styles.valueDetailMobile}>
                                          {transaction?.iban &&
                                            `${transaction?.iban.substring(0, 14)}...`}
                                        </Text>
                                        <TouchableOpacity
                                          onPress={async () =>
                                            await Clipboard.setStringAsync(
                                              transaction?.iban || ""
                                            )
                                          }
                                          style={{ paddingLeft: 10, paddingTop: 3 }}
                                        >
                                          <CopyClipboard color="heavy-blue" size={14} />
                                        </TouchableOpacity>
                                      </View>
                                    </Box>
                                  </View>
                             {/* do not show bic if the value is null */}
                             {transaction?.bic != null  ? (
                                <View style={styles.detailMobileInnerDetail}>
                                  <Box style={styles.detailMobile}>
                                    <Text style={styles.nameDetailMobile}>BIC</Text>
                                    <Text style={styles.valueDetailMobile}>
                                      {transaction?.bic}
                                    </Text>
                                  </Box>
                                  </View>
                               ): null} 
                        </View>
                     ): null}
                 
                    <Divider style={{ marginVertical: 5 }} />
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={styles.detailMobileInnerDetail}>
                        <Box style={styles.detailMobile}>
                          <Text style={styles.nameDetailMobile}>Type</Text>
                          <Text style={styles.valueDetailMobile}>
                            {transaction?.service}
                          </Text>
                        </Box>
                      </View>
                      <View style={styles.detailMobileInnerDetail}>
                        <Box style={styles.detailMobile}>
                          <Text style={styles.nameDetailMobile}>
                            Date & Time
                          </Text>

                          <Text style={styles.valueDetailMobile}>
                            {getFormattedDateAndTime(
                              transaction?.transaction_datetime_with_hour
                            )}
                          </Text>
                        </Box>
                      </View>
                    </View>
                    {/* <Divider style={{marginVertical: 5}} /> */}
                    <View style={{ marginTop: 10 }}>
                      <Button
                        color={"light-pink"}
                        style={{ width: 154 }}
                        onPress={() => console.log("customer service")}
                        leftIcon={
                          <AntDesign
                            name="customerservice"
                            size={14}
                            color={vars["accent-pink"]}
                          />
                        }
                      >
                        Customer Service
                      </Button>
                    </View>
                  </View>
                </Pressable>
              ) : null}
            </>
          );
        })}
      </>
    );
  };

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <Pressable onPress={handleOnOpen}>
        <View style={[styles.base, isOpen && styles.isOpen]}>
          <Box
            style={{
              textAlign: "left",
              // alignItems: 'start',
              color: "white",
              borderRadius: 5,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              width: "45%",
            }}
          >
            <CalenderEmptyIcon size={14} color="blue" />
            <View style={{ top: -4, paddingLeft: 3 }}>
              <Typography fontSize={14} textAlign="left">
                {" "}
                {getFormattedDate(shownData.date)}
              </Typography>
            </View>
          </Box>
          <Box
            style={{
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              borderRadius: 5,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              width: "45%",
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
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              borderRadius: 5,
              padding: 5,
              display: "flex",
              flexDirection: "row",
              width: "45%",
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
