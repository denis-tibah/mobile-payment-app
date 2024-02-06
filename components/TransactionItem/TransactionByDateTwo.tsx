import React, { useState, Fragment } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import { Divider } from "react-native-paper";
import { useAtom } from "jotai";
import VectorIcon from "react-native-vector-icons/AntDesign";
import { Snackbar, Portal } from "react-native-paper";

import {
  formatAmountTableValue,
  getFormattedDate,
  getFormattedDateAndTime,
  fieldHasValue,
} from "../../utils/helpers";
import { styles } from "./stylesTwo";
import Button from "../Button";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Box from "../Box";
import Typography from "../Typography";
import EuroIcon from "../../assets/icons/Euro";
import DollarIcon from "../../assets/icons/Dollar";
import { Transaction } from "../../models/Transactions";
import CardIcon from "../../assets/icons/Card";
import vars from "../../styles/vars";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import { displayTitle, displayValue } from "./TransactionHelper";
import { helpTabticketParams } from "../../utils/globalStates";
import WholeContainer from "../../layout/WholeContainer";
import { Seperator } from "../../components/Seperator/Seperator";

interface TransactionItemProps {
  setIsOneTransactionOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  transactionsByDate: Transaction[];
  totalAmount: string;
  shownData: any;
}
const defaultStatus = "SUCCESS";

const TransactionsByDateTwo: React.FC<TransactionItemProps> = ({
  transactionsByDate,
  totalAmount,
  shownData,
  setIsOneTransactionOpen,
}) => {
  const { navigate }: any = useNavigation();

  const [, setTicketParams] = useAtom(helpTabticketParams);

  const [openTransactionIndex, setOpenTransactionIndex] = useState<
    number | null
  >(null);
  const [snackBarMessage, setSnackBarMessage] = useState({
    open: false,
    label: "",
    message: "",
  });

  const handleToggleDetails = (index: number) => {
    setOpenTransactionIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleCopyToClipboard = async (iban: string) => {
    await Clipboard.setStringAsync(iban);
    setSnackBarMessage({
      open: true,
      label: "Ok",
      message: "Copied text from clipboard",
    });
  };

  const TransactionByDate = ({ transactions }: any) => {
    return (
      <>
        {transactions.map((transaction: Transaction, index: number) => {
          return (
            <>
              <View
                style={styles.detailMobileForEachTransactionContainer}
                key={index}
              >
                <TouchableOpacity onPress={() => handleToggleDetails(index)}>
                  <View style={styles.detailMobileForEachTransactionWrapper}>
                    <View style={styles.nameContainer}>
                      <CardIcon size={14} color={"heavy-grey"} />
                      <Typography
                        fontSize={14}
                        fontFamily="Mukta-Regular"
                        fontWeight={400}
                      >
                        {transaction.name}
                      </Typography>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 18,
                        width: "30%",
                        justifyContent: transaction?.amount
                          ? "space-between"
                          : "flex-end",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {shownData.currency === "EUR" ? (
                          <EuroIcon
                            size={14}
                            color={+transaction?.amount > 0 ? "green" : "red"}
                          />
                        ) : (
                          <DollarIcon size={14} color="#278664" />
                        )}
                        <Typography
                          marginLeft={2}
                          fontWeight={400}
                          fontSize={14}
                          fontFamily="Mukta-Regular"
                          /* color={Number(transaction.amount) > 0 ? "green" : "red"} */
                        >
                          {formatAmountTableValue(
                            transaction.amount,
                            shownData.currency
                          )}
                        </Typography>
                      </View>
                      {openTransactionIndex === index ? (
                        <VectorIcon
                          size={14}
                          color="#000"
                          name={"minuscircleo"}
                        />
                      ) : (
                        <VectorIcon
                          size={14}
                          color="#000"
                          name={"pluscircleo"}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {openTransactionIndex !== index ? (
                <View style={{ height: 1 }}>
                  <Seperator
                    backgroundColor="#F5F4F4"
                    height={1}
                    width={"100%"}
                  />
                </View>
              ) : null}

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
                                onPress={() =>
                                  handleCopyToClipboard(transaction?.iban)
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
    <Fragment>
      <View style={{ backgroundColor: "#F5F9FF" }}>
        <Pressable>
          <WholeContainer>
            <View style={{ paddingVertical: 6 }}>
              <Typography
                fontSize={14}
                fontWeight={500}
                fontFamily="Mukta-Regular"
              >
                {getFormattedDate(shownData.date)}
              </Typography>
            </View>
          </WholeContainer>
          <TransactionByDate transactions={transactionsByDate} />
        </Pressable>
      </View>
      <Portal>
        <Snackbar
          visible={snackBarMessage.open}
          onDismiss={() =>
            setSnackBarMessage({ open: false, label: "", message: "" })
          }
          action={{
            label: "Ok",
            onPress: () => {
              setSnackBarMessage({
                open: false,
                label: "",
                message: "",
              });
            },
          }}
          duration={3000}
        >
          <View>
            <Typography fontFamily="Nunito-Regular" fontSize={14} color="#fff">
              {snackBarMessage.message}
            </Typography>
          </View>
        </Snackbar>
      </Portal>
    </Fragment>
  );
};
export default TransactionsByDateTwo;
