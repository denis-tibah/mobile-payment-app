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
  console.log("🚀 ~ TransactionItem ~ data:", data);
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
          {/* <Box paddingLeft={data.isCardTx ? -5 : 5} width={data.isCardTx ? "45%" : "30%"}> */}
          {/* <Box width={data.isCardTx ? "45%" : "30%"}> */}
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

          {/* {data.isCardTx ? (
              <View style={styles.cardpayments}>
                {currencyIcon(data?.transfer_currency)}
              </View>
            ) : (
              
              currencyIcon(data?.transfer_currency)
            )}
                  
          {data?.currency === "EUR"  ? (
              <EuroIcon size={18} color={+data?.amount > 0 ? "green" : "red"} />
            ) : (
              <DollarIcon size={18} color="#278664" />
            )}

            {!data.isCardTx ? (
              <Typography fontSize={14}>
              
                {formatAmountTableValue(data?.amount, data?.transfer_currency)}
              </Typography>
            ) : (
              <View style={styles.cardCell}>
                <Typography fontSize={14}>
                 
                  {formatAmountTableValue(data?.amount, data?.currency)}
                </Typography>
              </View>
            )} */}
          {/* </Box> */}
          {!data.isCardTx ? (
            <Box
              width="30%"
              // paddingLeft={-15}
              // paddingRight={-20}
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
              // paddingLeft={-15}
              paddingRight={-20}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              {/* {!data.isCardTx ? <EuroIcon size={18} color="green" /> : null}

            {!data.isCardTx ? (
              <Typography fontSize={14}>
                {formatAmountTableValue(data?.running_balance, data?. transfer_currency)}
              </Typography>
            ) : null} */}

              <Box style={styles.arrowCell}>
                {isOpen ? (
                  <ArrowDown color="blue" />
                ) : (
                  <ArrowDown color="blue" />
                )}
              </Box>
            </Box>
          )}

          {/* <Box style={styles.cell}>
            
            {isOpen ? <ArrowDown color="blue" /> : <ArrowDown color="blue" />}
          </Box> */}
        </View>
      </Pressable>

      {/* {isOpen && (
        <Box>
          <Box style={styles.separator}></Box>
          <Box style={styles.rowDetail}>
            <Box style={styles.detailMobileContainer}>
              <Box style={styles.detailMobileWrapper}>
                <Box style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Name:</Text>
                  <Text numberOfLines={1} style={styles.valueDetailMobile}>
                    {data?.name}
                  </Text>
                </Box>
                <Box style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Reference:</Text>
                  <Text style={styles.valueDetailMobile}>
                    {data?.approvalCode}
                  </Text>
                </Box>
                <Box style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Description:</Text>
                  <Text style={styles.valueDetailMobile}>
                    {data?.purposeSimple}
                  </Text>
                </Box>
                {!data.isCardTx ? (
                  <Box style={styles.detailMobile}>
                    <Text style={styles.nameDetailMobile}>Type:</Text>
                    <Text style={styles.valueDetailMobile}>
                      {data?.revenueType}
                    </Text>
                  </Box>
                ) : null}
                <View style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Time:</Text>
                  <Text style={styles.valueDetailMobile}>
                    {getFormattedDateAndTime(data?.receiptDate)}
                  </Text>
                </View>
                <Box style={styles.downloadContainer}>
                  <Button
                    onPress={handleExportData}
                    color="light-blue"
                    leftIcon={<Export size={14} color="blue" />}
                  >
                    Download
                  </Button>
                </Box>
              </Box>
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
            </Box>
          </Box>
        </Box>
      )} */}
      {isOpen && (
        <View>
          <Box style={styles.separator}></Box>
          <Pressable>
            <View style={styles.containerDetailsInfo}>
              <View style={{ paddingTop: 12, paddingBottom: 16 }}>
                <View
                  style={[styles.detailMobile, styles.marginerDetailMobile]}
                >
                  {displayTitle({ title: "Name:" })}
                  {displayValue({ content: data?.name })}
                </View>
                <View style={styles.detailMobile}>
                  {displayTitle({ title: "Reference:" })}
                  {displayValue({ content: data?.approvalCode })}
                </View>
              </View>
              {data?.purposeSimple != null ? <Divider /> : null}
              {data?.purposeSimple != null ? (
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
                        content: `${getCurrency(data?.currency || "")}${
                          data?.ezb
                        }`,
                      })}
                    </View>
                    <View style={styles.cardContentContainer}>
                      {displayTitle({ title: "Fees" })}
                      {displayValue({
                        content: `${getCurrency(data?.currency || "")}${
                          data?.sumBilledFees
                        }`,
                      })}
                    </View>
                  </View>
                </View>
              ) : null}
              {data?.revenueType != null ? <Divider /> : null}
              {data?.revenueType != null ? (
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
              {data.isCardTx ? (
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
