import React, { useState, Fragment } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import { Divider } from "react-native-paper";
import { useAtom } from "jotai";

import {
  formatAmountTableValue,
  getFormattedDate,
  getFormattedDateAndTime,
  fieldHasValue,
  getFormattedDateFromUnixDotted,
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
import CopyClipboard from "../../assets/icons/CopyClipboard";
import { displayTitle, displayValue } from "./TransactionHelper";
import { helpTabticketParams } from "../../utils/globalStates";

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
  const { navigate }: any = useNavigation();

  const [, setTicketParams] = useAtom(helpTabticketParams);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnOpen = (): void => {
    setIsOpen(!isOpen);
    setIsOneTransactionOpen && setIsOneTransactionOpen(!isOpen);
  };

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
                  <View style={styles.containerDetailsInfo}>
                    <View style={{ paddingTop: 12, paddingBottom: 16 }}>
                      <View
                        style={[
                          styles.detailMobile,
                          styles.marginerDetailMobile,
                        ]}
                      >
                        {displayTitle({ title: "Transaction Reference" })}
                        {displayValue({ content: transaction?.reference_no })}
                      </View>
                      <View style={styles.detailMobile}>
                        {displayTitle({ title: "Transaction Status" })}
                        <View
                          style={{
                            marginTop: 4,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={[
                              styles.transactionStatus,
                              transaction?.status === defaultStatus
                                ? styles.valueDetailMobileStatusSuccess
                                : styles.valueDetailMobileStatusFailed,
                            ]}
                          >
                            {transaction?.status}
                            {/* add UI here to show the reason for a unsuccessfull transaction */}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {fieldHasValue(transaction?.description) ? (
                      <Divider />
                    ) : null}
                    {fieldHasValue(transaction?.description) ? (
                      <View
                        style={{
                          paddingTop: 12,
                        }}
                      >
                        <View
                          style={[
                            styles.detailMobile,
                            styles.marginerDetailMobile,
                          ]}
                        >
                          {displayTitle({ title: "Description" })}
                          {displayValue({ content: transaction?.description })}
                        </View>
                      </View>
                    ) : null}
                    {!fieldHasValue(transaction?.description) &&
                    transaction?.service === "DEBIT CARD" ? (
                      <Divider /* style={{ marginTop: 10, marginBottom: 15 }}  */
                      />
                    ) : null}
                    {transaction?.service === "DEBIT CARD" ? (
                      <View
                        style={{
                          paddingTop: 16,
                          paddingBottom: 16,
                        }}
                      >
                        <View style={styles.cardContainer}>
                          <View style={styles.cardContentContainer}>
                            {displayTitle({ title: "Card" })}
                            {/* {displayValue({ content: "**** **** 5566" })} */}
                          </View>
                          <View style={styles.cardContentContainer}>
                            {displayTitle({ title: "FX" })}
                            {/* {displayValue({ content: "$266.00" })} */}
                          </View>
                          <View style={styles.cardContentContainer}>
                            {displayTitle({ title: "Fees" })}
                            {/* {displayValue({ content: "$0.86" })} */}
                          </View>
                        </View>
                      </View>
                    ) : null}
                    {transaction?.service != "DEBIT CARD" ? (
                      <Divider style={{ marginVertical: 5 }} />
                    ) : null}
                    {/* only show Iban and Bic for sepa transfer */}
                    {transaction?.service != "DEBIT CARD" ? (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                          paddingTop: 12,
                          paddingBottom: 16,
                        }}
                      >
                        <View style={styles.detailMobileInnerDetail}>
                          <Box style={styles.detailMobile}>
                            {displayTitle({ title: "IBAN" })}
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                backgroundColor: "none",
                              }}
                            >
                              {displayValue({
                                content:
                                  transaction?.iban &&
                                  `${transaction?.iban.substring(0, 14)}...`,
                              })}
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
                        {fieldHasValue(transaction?.bic) ? (
                          <View style={styles.detailMobileInnerDetail}>
                            <Box style={styles.detailMobile}>
                              {displayTitle({ title: "BIC" })}
                              {displayValue({
                                content: transaction?.bic,
                              })}
                            </Box>
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                    <Divider />
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        paddingTop: 12,
                        paddingBottom: 16,
                      }}
                    >
                      <View style={styles.detailMobileInnerDetail}>
                        <Box style={styles.detailMobile}>
                          {displayTitle({ title: "Type" })}
                          {displayValue({
                            content: transaction?.service,
                          })}
                        </Box>
                      </View>
                      <View style={styles.detailMobileInnerDetail}>
                        <View style={styles.detailMobile}>
                          {displayTitle({ title: "Date & Time" })}
                          {displayValue({
                            content: getFormattedDateAndTime(
                              transaction?.transaction_datetime_with_hour
                            ),
                          })}
                        </View>
                      </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Button
                        color={"light-pink"}
                        style={{ width: 154 }}
                        onPress={() => {
                          navigate("profile");
                          setTicketParams({
                            tabSelectionRoute: "Help",
                            passedTicketType: "transactions",
                            transactionReferenceNumber:
                              transaction?.reference_no || "",
                            isOpenBottomSheet: true,
                          });
                        }}
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
                {getFormattedDateFromUnixDotted(shownData.date)}
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
