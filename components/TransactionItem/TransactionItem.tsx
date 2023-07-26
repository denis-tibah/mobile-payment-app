import { Dispatch, SetStateAction, useState } from "react";
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
import GbpIcon from "../../assets/icons/Gbp";
import { generateTransactionPDF } from "../../utils/files";
import { printAsync } from "expo-print";
import { Transaction, CardTransaction } from "../../models/Transactions";
/* import { TTransaction } from "../../utils/types"; */
import Export from "../../assets/icons/Export";

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
          <Box width={data.isCardTx ? "45%" : "30%"}>
            <Text>
              <Typography fontSize={14}>
                {data?.name?.length > 10
                  ? data?.name?.substring(0, 10) + "."
                  : data?.name}
              </Typography>
            </Text>
          </Box>
          <Box
            display="flex"
            paddingLeft={-5}
            flexDirection="row"
            alignItems="center"
            width="30%"
          >
            <CalenderEmptyIcon size={14} color="blue" />
            <Typography fontSize={14}>
              {" "}
              {getFormattedDate(data?.transaction_datetime)}
            </Typography>
          </Box>
          <Box
            width="30%"
            // paddingLeft={20}
            paddingLeft={15}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            {data.isCardTx ? (
              <View style={styles.cardpayments}>
                {currencyIcon(data?.currency)}
              </View>
            ) : (
              currencyIcon(data?.currency)
            )}
            {/*       
          {data?.currency === "EUR"  ? (
              <EuroIcon size={18} color={+data?.amount > 0 ? "green" : "red"} />
            ) : (
              <DollarIcon size={18} color="#278664" />
            )} */}
<<<<<<< HEAD

            {!data.isCardTx ? (
=======
            {!data.isCardTx ?
>>>>>>> 6bf5d56 (added UI for showing details for each transaction)
              <Typography fontSize={14}>
                {formatAmountTableValue(data?.amount, data?.currency)}
              </Typography>
            ) : (
              <View style={styles.cardCell}>
                <Typography fontSize={14}>
<<<<<<< HEAD
                  {formatAmountTableValue(data?.amount, data?.currency)}
                </Typography>
              </View>
            )}
=======
                {formatAmountTableValue(data?.amount, data?.currency)}
              </Typography>
            </View>
            }
>>>>>>> 6bf5d56 (added UI for showing details for each transaction)
          </Box>

          <Box
            width="30%"
            // paddingLeft={-15}
            // paddingRight={-20}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
<<<<<<< HEAD
            {!data.isCardTx ? <EuroIcon size={18} color="green" /> : null}
=======
          {!data.isCardTx ? 
            <EuroIcon size={18} color= "green" />
            : null
          }
>>>>>>> 6bf5d56 (added UI for showing details for each transaction)

            {!data.isCardTx ? (
              <Typography fontSize={14}>
                {formatAmountTableValue(data?.running_balance, data?.currency)}
              </Typography>
            ) : null}

            <Box style={styles.cell}>
              {isOpen ? <ArrowDown color="blue" /> : <ArrowDown color="blue" />}
            </Box>
          </Box>

          {/* <Box style={styles.cell}>
            
            {isOpen ? <ArrowDown color="blue" /> : <ArrowDown color="blue" />}
          </Box> */}
        </View>
      </Pressable>

      {isOpen && (
        <Box>
          <Box style={styles.separator}></Box>
          <Box style={styles.rowDetail}>
            <Box style={styles.detailMobileContainer}>
              <Box style={styles.detailMobileWrapper}>
                <Box style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Name:</Text>
                  <Text style={styles.valueDetailMobile}>{data?.name}</Text>
                </Box>
                <Box style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Reference:</Text>
                  <Text style={styles.valueDetailMobile}>
                    {/* Invoice_{data?.reference_no} */}
                    {data?.reference_no}
                  </Text>
                </Box>
                <Box style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Description:</Text>
                  <Text style={styles.valueDetailMobile}>
                    {/* Invoice_{data?.reference_no} */}
                    {data?.description}
                  </Text>
                </Box>
                {!data.isCardTx ? (
                  <Box style={styles.cardDetails}>
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>IBAN:</Text>
                      <Text style={styles.valueDetailMobile}>{data?.iban}</Text>
                    </Box>
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>BIC:</Text>
                      <Text style={styles.valueDetailMobile}>{data?.bic}</Text>
                    </Box>
                    {/* : '') */}

                    {/* <Box style={styles.detailMobile}>
                    <Text style={styles.nameDetailMobile}>
                      Opening Balance:
                    </Text>
                    <Text style={styles.valueDetailMobile}>
                      {data?.opening_balance}
                    </Text>
                  </Box> */}
                    {/* <Box style={styles.detailMobile}>
                    <Text style={styles.nameDetailMobile}>
                      Closing Balance:
                    </Text>
                    <Text style={styles.valueDetailMobile}>
                      {data?.closing_balance}
                    </Text>
                  </Box> */}
<<<<<<< HEAD
                    <Box style={styles.detailMobile}>
                      <Text style={styles.nameDetailMobile}>
                        Running Balance:
                      </Text>
                      <Text style={styles.valueDetailMobile}>
                        {/* {data?.balance} */}
=======
                  <Box style={styles.detailMobile}>
                    <Text style={styles.nameDetailMobile}>Running Balance:</Text>
                    <Text style={styles.valueDetailMobile}>
                      {/* {data?.balance} */}
                      <Box style={styles.eurosign}>
                        <EuroIcon size={18} color= "black" />
                          
                            <Typography fontSize={14}>
                              {data?.running_balance}
                            </Typography>
                      </Box>
>>>>>>> 6bf5d56 (added UI for showing details for each transaction)

                        <Box style={styles.eurosign}>
                          <EuroIcon size={18} color="black" />

                          <Typography fontSize={14}>
                            {data?.running_balance}
                          </Typography>
                        </Box>

                        {/* {data?.running_balance} */}
                      </Text>
                    </Box>
                  </Box>
<<<<<<< HEAD
                ) : null}
=======
                </Box>
           : null }
>>>>>>> 6bf5d56 (added UI for showing details for each transaction)

                <View style={styles.detailMobile}>
                  <Text style={styles.nameDetailMobile}>Time:</Text>
                  <Text style={styles.valueDetailMobile}>
                    {/* {data?.transaction_datetime} */}
                    {getFormattedDate(data?.transaction_datetime)}
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
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
