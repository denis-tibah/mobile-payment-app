import React, { useState, Fragment } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import { useAtom } from "jotai";
import VectorIcon from "react-native-vector-icons/AntDesign";
import { Snackbar, Portal } from "react-native-paper";

import {
  formatAmountTableValue,
  getFormattedDate,
  getFormattedDateAndTime,
  fieldHasValue,
  isPositiveAmountWithSign,
  getFormattedDateFromUnix,
  getFormattedDateFromUnixDotted,
  convertDateToDottedNameV2,
  arrayChecker,
} from "../../utils/helpers";
import { styles } from "./stylesTwo";
import Button from "../Button";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Box from "../Box";
import Typography from "../Typography";
import EuroIcon from "../../assets/icons/Euro";
import DollarIcon from "../../assets/icons/Dollar";
import GbpIcon from "../../assets/icons/Gbp";
import { Transaction } from "../../models/Transactions";
import CardIcon from "../../assets/icons/Card";
import BankIcon from "../../assets/icons/Bank";
import vars from "../../styles/vars";
import CopyClipboard from "../../assets/icons/CopyClipboard";
import { displayTitle, displayValue, currencyIcon } from "./TransactionHelper";
import { helpTabticketParams } from "../../utils/globalStates";
import WholeContainer from "../../layout/WholeContainer";
import { Seperator } from "../../components/Seperator/Seperator";
import ZazzoLogo from "../../assets/icons/ZazzoLogo";

interface TransactionItemProps {
  transactionsByDate: Transaction[];
  totalAmount: string;
  shownData?: any;
  cardId?: string;
}
const defaultStatus = "SUCCESS";

const TransactionsByDateTwo: React.FC<TransactionItemProps> = ({
  transactionsByDate,
  totalAmount,
  shownData,
  cardId,
}) => {
  const { navigate }: any = useNavigation();

  const [, setTicketParams] = useAtom(helpTabticketParams);

  const addFiveWorkingDays = (date: string) => {
    const currentDate = new Date(date);
    let count = 0;
    while (count < 5) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        count++;
      }
    }
    return currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
    });
  };

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
          /* delete transaction?.status;
          Object.assign(transaction, { status: "PENDING" }); */
          let amountColor = "red";
          // for transaction history
          if (transaction?.status) {
            if (transaction?.status === "SUCCESS") {
              if (isPositiveAmountWithSign(transaction?.amount) === 1) {
                amountColor = "green";
              }
            }
            if (transaction?.status === "PENDING") {
              amountColor = "#fcc774";
            }
          }

          //currency color of card transaction
          if (cardId) {
            if (isPositiveAmountWithSign(transaction?.amount) === 1) {
              amountColor = "green";
            }
          }
          const keyId = transaction?.reference_no;

          const transactionStatusHasLineThrough =
            transaction?.status &&
            ["SUCCESS", "PENDING"].includes(transaction?.status)
              ? false
              : true;

          return (
            <>
              <View
                style={styles.detailMobileForEachTransactionContainer}
                key={keyId}
              >
                <TouchableOpacity onPress={() => handleToggleDetails(index)}>
                  <View style={styles.detailMobileForEachTransactionWrapper}>
                    <View style={styles.nameContainer}>
                      {transaction?.service === "DEBIT CARD" ? (
                        <CardIcon size={14} color={"heavy-grey"} />
                      ) : null}
                      {transaction?.service === "SEPA CT IN" ||
                      transaction?.service === "SEPA CT OUT" ||
                      transaction?.service === "SEPA INST IN" ? (
                        <BankIcon size={14} color={"heavy-grey"} />
                      ) : null}
                      {transaction?.service === "INTERNAL" ? (
                        <ZazzoLogo size={14} color={"heavy-grey"} />
                      ) : null}
                      <Typography
                        fontSize={14}
                        fontFamily="Mukta-Regular"
                        fontWeight={"400"}
                        paddingRight={24}
                      >
                        {transaction?.name || transaction?.purpose}
                      </Typography>
                    </View>
                    {transactionStatusHasLineThrough ? (
                      <View style={styles.transactionStatusHasLineThrough} />
                    ) : null}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "35%",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {currencyIcon(
                          shownData?.currency || transaction?.original_currency,
                          { color: amountColor }
                        )}
                        <Typography
                          marginLeft={2}
                          fontWeight={"400"}
                          fontSize={14}
                          paddingLeft={5}
                          fontFamily="Mukta-Regular"
                        >
                          {formatAmountTableValue(
                            transaction?.amount,
                            shownData?.currency ||
                              transaction?.original_currency
                          )}
                        </Typography>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                      >
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
                    <View
                      style={{
                        paddingTop: 12,
                        paddingBottom: !cardId ? 16 : 0,
                      }}
                    >
                      {transaction?.status === "PENDING" ||
                      transaction?.status === "PROCESSING" ? (
                        <View
                          style={[
                            styles.detailMobile,
                            styles.marginerDetailMobile,
                          ]}
                        >
                          {/* {displayTitle({ title: "Transaction Reference" })} */}
                          {displayValue({
                            content: `We will be automatically reverting on ${addFiveWorkingDays(
                              transaction?.transaction_datetime
                            )} if unclaimed by the merchant.`,
                          })}
                        </View>
                      ) : null}

                      {fieldHasValue(transaction?.reference_no) ||
                      fieldHasValue(transaction?.id) ? (
                        <View
                          style={[
                            styles.detailMobile,
                            styles.marginerDetailMobile,
                          ]}
                        >
                          {displayTitle({ title: "Transaction Reference" })}
                          {displayValue({
                            content:
                              transaction?.reference_no || transaction?.id,
                          })}
                        </View>
                      ) : null}

                      {!cardId && fieldHasValue(transaction?.status) ? (
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
                      ) : null}
                    </View>
                    {!cardId && fieldHasValue(transaction?.description) ? (
                      <Seperator backgroundColor={vars["v2-light-grey"]} />
                    ) : null}
                    {!cardId && fieldHasValue(transaction?.description) ? (
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
                          {displayValue({
                            content: transaction?.description,
                          })}
                        </View>
                      </View>
                    ) : null}
                    {cardId && fieldHasValue(transaction?.purposeDetailed) ? (
                      <Seperator backgroundColor={vars["v2-light-grey"]} />
                    ) : null}
                    {cardId && fieldHasValue(transaction?.purposeDetailed) ? (
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
                          {displayValue({
                            content: transaction?.purposeDetailed,
                          })}
                        </View>
                      </View>
                    ) : null}
                    {!cardId &&
                    transaction?.service === "DEBIT CARD" &&
                    ((!cardId && fieldHasValue(transaction?.exchange_rate)) ||
                      fieldHasValue(transaction?.charges)) ? (
                      <Seperator backgroundColor={vars["v2-light-grey"]} />
                    ) : null}
                    {!cardId &&
                    transaction?.service === "DEBIT CARD" &&
                    (fieldHasValue(transaction?.exchange_rate) ||
                      fieldHasValue(transaction?.charges)) ? (
                      <View
                        style={{
                          paddingTop: 16,
                          paddingBottom: 16,
                        }}
                      >
                        <View style={styles.cardContainer}>
                          {transaction?.masked_number ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "Card" })}
                              {displayValue({
                                content: transaction?.masked_number,
                                hasCurrency: false,
                                currencyType: transaction?.currency,
                              })}
                            </View>
                          ) : null}

                          {transaction?.exchange_rate ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "FX" })}
                              {displayValue({
                                content: transaction?.exchange_rate,
                                hasCurrency: true,
                                currencyType: transaction?.currency,
                              })}
                            </View>
                          ) : null}
                          {transaction?.charges ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "Fees" })}
                              {displayValue({
                                content: transaction?.charges,
                                hasCurrency: true,
                                currencyType: transaction?.currency,
                              })}
                            </View>
                          ) : null}

                          {transaction?.original_amount ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "Original Amount" })}
                              {displayValue({
                                content: transaction?.original_amount,
                                hasCurrency: true,
                                currencyType: transaction?.original_currency,
                              })}
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ) : null}
                    {!cardId && transaction?.service != "DEBIT CARD" ? (
                      <Seperator backgroundColor={vars["v2-light-grey"]} />
                    ) : null}

                    {cardId &&
                    (fieldHasValue(transaction?.exchange_rate) ||
                      fieldHasValue(transaction?.charges)) ? (
                      <Seperator backgroundColor={vars["v2-light-grey"]} />
                    ) : null}

                    {cardId &&
                    (fieldHasValue(transaction?.masked_number) ||
                      fieldHasValue(transaction?.exchange_rate) ||
                      fieldHasValue(transaction?.charges)) ? (
                      <View
                        style={{
                          paddingTop: 16,
                          paddingBottom: 16,
                        }}
                      >
                        <View style={styles.cardContainer}>
                          {transaction?.masked_number ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "Card" })}
                              {displayValue({
                                content: transaction?.masked_number,
                                hasCurrency: false,
                                currencyType: transaction?.currency,
                              })}
                            </View>
                          ) : null}

                          {transaction?.exchange_rate === 0 ||
                          transaction?.exchange_rate ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "FX" })}
                              {displayValue({
                                content: transaction?.exchange_rate,
                                hasCurrency: true,
                                currencyType: transaction?.original_currency,
                              })}
                            </View>
                          ) : null}
                          {transaction?.charges === 0 ||
                          transaction?.charges ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "Fees" })}
                              {displayValue({
                                content: transaction?.charges,
                                hasCurrency: true,
                                currencyType: transaction?.original_currency,
                              })}
                            </View>
                          ) : null}

                          {transaction?.original_amount ? (
                            <View style={styles.cardContentContainer}>
                              {displayTitle({ title: "Original Amount" })}
                              {displayValue({
                                content: transaction?.original_amount,
                                hasCurrency: true,
                                currencyType: transaction?.currency,
                              })}
                            </View>
                          ) : null}
                        </View>
                      </View>
                    ) : null}

                    {/* only show Iban and Bic for sepa transfer */}
                    {!cardId && transaction?.service != "DEBIT CARD" ? (
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
                        {fieldHasValue(transaction?.iban) ? (
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
                        ) : null}
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
                    {!cardId ? (
                      <Fragment>
                        <Seperator backgroundColor={vars["v2-light-grey"]} />
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
                          {fieldHasValue(transaction?.service) ? (
                            <View style={styles.detailMobileInnerDetail}>
                              <Box style={styles.detailMobile}>
                                {displayTitle({ title: "Type" })}
                                {displayValue({
                                  content: transaction?.service,
                                })}
                              </Box>
                            </View>
                          ) : null}
                          {fieldHasValue(transaction?.transaction_datetime) ? (
                            <View style={styles.detailMobileInnerDetail}>
                              <View style={styles.detailMobile}>
                                {displayTitle({ title: "Date & Time" })}
                                {displayValue({
                                  content: getFormattedDateAndTime(
                                    transaction?.transaction_datetime
                                  ),
                                })}
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </Fragment>
                    ) : null}

                    {cardId && fieldHasValue(transaction?.receiptDate) ? (
                      <Seperator backgroundColor={vars["v2-light-grey"]} />
                    ) : null}
                    {cardId && fieldHasValue(transaction?.receiptDate) ? (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                          paddingTop: 12,
                        }}
                      >
                        {fieldHasValue(transaction?.receiptDate) ? (
                          <View style={styles.detailMobileInnerDetail}>
                            <View style={styles.detailMobile}>
                              {displayTitle({ title: "Date & Time" })}
                              {displayValue({
                                content: getFormattedDateAndTime(
                                  transaction?.receiptDate
                                ),
                              })}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                    {!cardId ? (
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
                              // size={14}
                              style={{ fontSize: 14 }}
                              color={vars["accent-pink"]}
                            />
                          }
                        >
                          Customer Service
                        </Button>
                      </View>
                    ) : null}
                  </View>
                  <View style={{ height: 1 }}>
                    <Seperator
                      backgroundColor="#F5F4F4"
                      height={1}
                      width={"100%"}
                    />
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
          <View
            style={{
              paddingVertical: 6,
              paddingHorizontal: 18,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontSize={14}
              fontWeight={"500"}
              fontFamily="Mukta-Regular"
            >
              {cardId
                ? shownData?.date
                : convertDateToDottedNameV2(shownData?.date)}
            </Typography>
            {totalAmount ? (
              <Typography
                fontSize={14}
                fontWeight={"500"}
                fontFamily="Nunito-SemiBold"
                marginLeft={6}
                color={
                  isPositiveAmountWithSign(totalAmount) === 1 ? "green" : "red"
                }
              >
                € {totalAmount}
              </Typography>
            ) : null}
          </View>
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
