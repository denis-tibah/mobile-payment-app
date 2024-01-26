import { Dispatch, SetStateAction, useState } from "react";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import {
  formatAmountTableValue,
  formatDateTableValue,
  getFormattedDate,
  getFormattedDateAndTime,
  getFormattedDateFromUnix,
  getCurrency,
  formatCurrencyToLocalEn,
  formatCurrencyToLocalEnTwo,
  fieldHasValue,
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
import GbpIcon from "../../assets/icons/Gbp";
import { generateTransactionPDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { Transaction, CardTransaction } from "../../models/Transactions";
/* import { TTransaction } from "../../utils/types"; */
import Export from "../../assets/icons/Export";
import { displayTitle, displayValue } from "./TransactionHelper";
import { Divider } from "react-native-paper";

interface TransactionItemProps {
  data: Transaction;
}

export function TransactionItem({ data }: TransactionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleExportData = async () => {
    const pdfUri = await generateTransactionPDF([data]);
    await printAsync({ uri: pdfUri });
  };

  const currencyIcon = (param: any) => {
    // console.log("currecy is ", param);
    // console.log("data?.amount ", data?.amount );
    // console.log("data.isCardTx ", data.isCardTx );

    switch (param) {
      case "EUR":
        return (
          <EuroIcon size={18} color={+data?.amount > 0 ? "green" : "red"} />
        );
      case "USD":
        return (
          <DollarIcon size={18} color={+data?.amount > 0 ? "#278664" : "red"} />
        );
      case "GBP":
        return (
          <GbpIcon size={18} color={+data?.amount > 0 ? "#105ED0" : "red"} />
        );
      default:
        return (
          <EuroIcon size={18} color={+data?.amount > 0 ? "green" : "red"} />
        );
    }
  };

  return (
    <>
      <Pressable onPress={handleOnOpen}>
        <View style={[styles.base, isOpen && styles.isOpen]}>
          <Box
            marginLeft={data.isCardTx ? -10 : 10}
            width={data.isCardTx ? "45%" : "30%"}
          >
            <Text>
              {!data.isCardTx ? (
                <Typography fontSize={14}>
                  {data?.name?.length > 10
                    ? data?.name?.substring(0, 20) + "."
                    : data?.name}
                </Typography>
              ) : (
                <Typography fontSize={14}>
                  {data?.name?.length > 10
                    ? data?.name?.substring(0, 15) + "."
                    : data?.name}
                </Typography>
              )}
            </Text>
          </Box>
          {!data.isCardTx ? (
            <Box
              display="flex"
              paddingLeft={35}
              flexDirection="row"
              alignItems="center"
              width="40%"
            >
              <CalenderEmptyIcon size={14} color="blue" />
              <Typography fontSize={14}>
                {getFormattedDateFromUnix(data?.receiptDate)}
              </Typography>
            </Box>
          ) : (
            <Box
              display="flex"
              paddingLeft={-5}
              flexDirection="row"
              alignItems="center"
              width="40%"
            >
              <CalenderEmptyIcon size={14} color="blue" />
              <Typography fontSize={14}>
                {" "}
                {getFormattedDateFromUnix(data?.receiptDate)}
              </Typography>
            </Box>
          )}
          {!data.isCardTx ? (
            <Box
              width="30%"
              // paddingLeft={20}
              paddingLeft={35}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <View>{currencyIcon(data?.currency)}</View>

              <Typography fontSize={14}>
                {formatAmountTableValue(data?.amount, data?.currency)}
              </Typography>
            </Box>
          ) : (
            <Box
              width="30%"
              // paddingLeft={20}
              paddingLeft={15}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <View style={styles.cardpayments}>
                {currencyIcon(data?.currency)}
              </View>

              <View style={styles.cardCell}>
                <Typography fontSize={14}>
                  {formatAmountTableValue(data?.amount, data?.currency)}
                </Typography>
              </View>
            </Box>
          )}
          {!data.isCardTx ? (
            <Box
              width="30%"
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box style={styles.cell}>
                {isOpen ? (
                  <ArrowDown color="blue" />
                ) : (
                  <ArrowDown color="blue" />
                )}
              </Box>
            </Box>
          ) : (
            <Box
              width="30%"
              paddingRight={-20}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box style={styles.arrowCell}>
                {isOpen ? (
                  <ArrowDown color="blue" />
                ) : (
                  <ArrowDown color="blue" />
                )}
              </Box>
            </Box>
          )}
        </View>
      </Pressable>
      {isOpen && (
        <View>
          <Box style={styles.separator}></Box>
          <Pressable>
            <View style={styles.containerDetailsInfo}>
              {fieldHasValue(data?.name) ||
              fieldHasValue(data?.approvalCode) ? (
                <View style={{ paddingTop: 12, paddingBottom: 16 }}>
                  {fieldHasValue(data?.name) ? (
                    <View
                      style={[styles.detailMobile, styles.marginerDetailMobile]}
                    >
                      {displayTitle({ title: "Name:" })}
                      {displayValue({ content: data?.name })}
                    </View>
                  ) : null}
                  {fieldHasValue(data?.approvalCode) ? (
                    <View style={styles.detailMobile}>
                      {displayTitle({ title: "Reference:" })}
                      {displayValue({ content: data?.approvalCode })}
                    </View>
                  ) : null}
                </View>
              ) : null}
              {fieldHasValue(data?.purposeSimple) ? <Divider /> : null}
              {fieldHasValue(data?.purposeSimple) ? (
                <View
                  style={{
                    paddingTop: 12,
                    paddingBottom: 16,
                  }}
                >
                  <View
                    style={[styles.detailMobile, styles.marginerDetailMobile]}
                  >
                    {displayTitle({ title: "Description" })}
                    {displayValue({ content: data?.purposeSimple })}
                  </View>
                  <View style={styles.cardContainer}>
                    <View style={styles.cardContentContainer}>
                      {displayTitle({ title: "Card" })}
                      {/* {displayValue({ content: "**** **** 5566" })} */}
                    </View>
                    <View style={styles.cardContentContainer}>
                      {displayTitle({ title: "FX" })}
                      {displayValue({
                        content: `${getCurrency(
                          data?.currency || ""
                        )}${formatCurrencyToLocalEnTwo(data?.ezb)}`,
                      })}
                    </View>
                    <View style={styles.cardContentContainer}>
                      {displayTitle({ title: "Fees" })}
                      {displayValue({
                        content: `${getCurrency(
                          data?.currency || ""
                        )}${formatCurrencyToLocalEnTwo(data?.sumBilledFees)}`,
                      })}
                    </View>
                  </View>
                </View>
              ) : null}
              {fieldHasValue(data?.revenueType) ? <Divider /> : null}
              {fieldHasValue(data?.revenueType) ? (
                <View
                  style={{
                    paddingTop: 12,
                    paddingBottom: 16,
                  }}
                >
                  <View
                    style={[styles.detailMobile, styles.marginerDetailMobile]}
                  >
                    {displayTitle({ title: "Type:" })}
                    {displayValue({ content: data?.revenueType })}
                  </View>
                  <View style={styles.detailMobile}>
                    {displayTitle({ title: "Time:" })}
                    {displayValue({
                      content: getFormattedDateAndTime(data?.receiptDate),
                    })}
                  </View>
                </View>
              ) : null}
              {!data.isCardTx ? (
                <Box style={styles.statusItem}>
                  {data?.status === "SUCCESS" && (
                    <Chip label="Completed" color="green" />
                  )}
                  {data?.status === "PENDING" && (
                    <Chip label="Pending" color="orange" />
                  )}
                  {data?.status === "CANCELLED" && (
                    <Chip label="Cancelled" color="red" />
                  )}
                  {data?.status === "PROCESSING" && (
                    <Chip label="Processing" color="red" />
                  )}
                </Box>
              ) : (
                <Box style={styles.statusItem}>
                  {data?.revenueType === "CLEARING" && (
                    <Chip label="Clearing" color="green" />
                  )}
                  {data?.revenueType === "PREAUTH" && (
                    <Chip label="Preauth" color="orange" />
                  )}
                </Box>
              )}
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
}
