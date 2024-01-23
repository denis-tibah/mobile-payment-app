import { useState } from "react";
import { Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { printAsync } from "expo-print";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { View } from "react-native";

import {
  StatementFilter,
  StatementResponse,
  getStatementsfinxp,
  StatementTransactionsResponse,
} from "../../redux/transaction/transactionSlice";
import { generatePDF } from "../../utils/files";
import Typography from "../../components/Typography";
import Box from "../../components/Box";
import { MainLayout } from "../../layout/Main/Main";
import Heading from "../../components/Heading";
import { styles } from "./styles";
import StatementIcon from "../../assets/icons/Statement";
import ExcelIcon from "../../assets/icons/Excel";
import TransactionIcon from "../../assets/icons/Transaction";
import Pdf from "../../assets/icons/Pdf";
import Button from "../../components/Button";
import { RootState } from "../../store";
import ScrollingButtons from "./ScrollingButtons";
import { format } from "path";
import { generateStatementsPDF } from "../../components/StatementsPDF/StatementsPDF";


interface DateRangeType {
  dateTo: {
    state: boolean;
    value: string;
  };
  dateFrom: {
    state: boolean;
    value: string;
  };
}

const initialDateRange: DateRangeType = {
  dateTo: {
    state: false,
    value: "",
  },
  dateFrom: {
    state: false,
    value: "",
  },
};

const currentDate = new Date();

export function Statements({ navigation }: any) {
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const dispatch = useDispatch();

  const [selectedPrint, setSelectedPrint] = useState<string>("pdf");
  const [searchFilter, setSearchFilter] = useState<StatementFilter>();

  const [
    showStatementPickerDateToAndFrom,
    setShowStatementPickerDateToAndFrom,
  ] = useState<DateRangeType>(initialDateRange);
  const [showPickerDateFilter, setShowPickerDateFilter] =
    useState<DateRangeType>(initialDateRange);
  const [isLoading, setLoading] = useState<boolean>(false);

  // const handleGeneratePDF = async (
  //   statements: StatementTransactionsResponse[]
  // ) => {
  //   const pdfUri = await generatePDF(statements);
  //   return await printAsync({ uri: pdfUri });
  // };

  const handleGeneratePDF = async (
    statements: StatementTransactionsResponse[]
  ) => {
    const pdfUri = await generateStatementsPDF({statements, accountData: {...userData, ...searchFilter}});
    return await printAsync({ uri: pdfUri });
  };

  // generateStatementsPDF

  const handleOnChangeShowPickerDate = (
    formattedDate: string,
    setState: any,
    values: any,
    key: string
  ) => {
    const { dateFrom, dateTo } = values;
    if (key === "dateFrom") {
      if (dateTo.value) {
        const fromDate = new Date(formattedDate);
        const toDate = new Date(dateTo.value);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        }
      }
    } else {
      if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        const toDate = new Date(formattedDate);
        if (fromDate > toDate) {
          alert("Date from should be before or same with Date to");
          return;
        }
      }
    }
    setState({
      ...values,
      [key]: {
        state: false,
        value: formattedDate,
      },
    });
  };

  const handleGenerateFile = async () => {
    if (selectedPrint === "pdf") {
      const { dateFrom, dateTo } = showStatementPickerDateToAndFrom;
      if (userData?.id && dateFrom.value && dateTo.value) {
        setLoading(true);
        const _searchFilter: StatementFilter = {
          account_id: Number(userData?.id),
          from_date: dateFrom.value,
          to_date: dateTo.value,
        };
        try {
          await dispatch<any>(getStatementsfinxp(_searchFilter))
            .unwrap()
            .then((res: StatementResponse) => {
              const { statements } = res;
              if (statements.length > 0) {
                setLoading(false);
                setSearchFilter(_searchFilter);
                return handleGeneratePDF(statements);
              } else {
                setLoading(false);
                alert("You dont have transaction for selected dates");
              }
              setLoading(false);
            });
        } catch (error) {
          setLoading(false);
          console.log({ error });
        }
      } else {
        alert("Please select from and to date");
      }
    }
  };

  return (
    <MainLayout navigation={navigation}>
      <Spinner visible={isLoading} />
      <View style={styles.heading}>
        <Heading
          icon={<StatementIcon size={18} color="pink" />}
          title={"Statement"}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.downloadBtn}>
          <Button
            onPress={() => {
              setSelectedPrint((prevState) =>
                prevState === "pdf" ? "" : "pdf"
              );
            }}
            color={selectedPrint === "pdf" ? "blue" : "light-blue"}
            leftIcon={
              <Pdf
                size={16}
                color={selectedPrint === "pdf" ? "white" : "blue"}
              />
            }
          >
            PDF Export
          </Button>
        </View>
        {/* <View style={styles.downloadBtn}>
          <Button
            onPress={() => {
              setSelectedPrint("excel");
            }}
            color={selectedPrint === "excel" ? "blue" : "light-blue"}
            leftIcon={
              <ExcelIcon
                size={16}
                color={selectedPrint === "excel" ? "white" : "blue"}
              />
            }
          >
            Excel Export
          </Button>
        </View> */}
      </View>
      <Box style={styles.dateContainer}>
        {/* <Typography
          fontSize={16}
          fontFamily="Nunito-SemiBold"
          color="shade-grey"
        >
          From
        </Typography> */}
        <ScrollingButtons
          onScrollOptions={(formattedDate) => {
              const date = new Date(formattedDate);
              const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toString();
              const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toString();
              const _firstDay = new Date(firstDay).toISOString().split("T")[0];
              const _lastDay = new Date(lastDay).toISOString().split("T")[0];
              setShowStatementPickerDateToAndFrom({
                dateTo: {
                  state: false,
                  value: _lastDay,
                },
                dateFrom: {
                  state: false,
                  value: _firstDay,
                },
              });
            }
          }
        />
        {/* <Typography
          fontSize={16}
          fontFamily="Nunito-SemiBold"
          color="shade-grey"
        >
          To
        </Typography>
        <ScrollingButtons 
          onScrollOptions={(formattedDate) => {
            const _formattedDate = new Date(formattedDate).toISOString().split("T")[0];
            handleOnChangeShowPickerDate(
              _formattedDate,
              setShowStatementPickerDateToAndFrom,
              showStatementPickerDateToAndFrom,
              "dateTo"
              )
          }}
        /> */}
        {/* <Typography fontSize={14} fontFamily="Nunito-Regular" color="black">
          Please select the date range you want to export
        </Typography> */}
        {/* <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonDate}
            color="black-only"
            onPress={() =>
              setShowStatementPickerDateToAndFrom({
                ...showStatementPickerDateToAndFrom,
                dateFrom: {
                  state: true,
                  value: "",
                },
              })
            }
          >
            {!showStatementPickerDateToAndFrom.dateFrom.value
              ? `From Date`
              : `${showStatementPickerDateToAndFrom.dateFrom.value}`}
          </Button>
          {showStatementPickerDateToAndFrom.dateFrom.state && (
            <DateTimePicker
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              value={
                !showStatementPickerDateToAndFrom.dateFrom.value
                  ? currentDate
                  : new Date(showStatementPickerDateToAndFrom.dateFrom.value)
              }
              onChange={(event: any) => {
                if (event.type == "set") {
                  const formattedDate = new Date(event.nativeEvent.timestamp)
                    .toISOString()
                    .split("T")[0];
                  handleOnChangeShowPickerDate(
                    formattedDate,
                    setShowStatementPickerDateToAndFrom,
                    showStatementPickerDateToAndFrom,
                    "dateFrom"
                  );
                }
              }}
              style={styles.datePicker}
            />
          )}
          <Button
            style={styles.buttonDate}
            color="black-only"
            onPress={() =>
              setShowStatementPickerDateToAndFrom({
                ...showStatementPickerDateToAndFrom,
                dateTo: {
                  state: !showPickerDateFilter.dateTo.state,
                  value: "",
                },
              })
            }
          >
            {!showStatementPickerDateToAndFrom.dateTo.value
              ? `To Date`
              : `${showStatementPickerDateToAndFrom.dateTo.value}`}
          </Button>
          {showStatementPickerDateToAndFrom.dateTo.state && (
            <DateTimePicker
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              value={
                !showStatementPickerDateToAndFrom.dateTo.value
                  ? currentDate
                  : new Date(showStatementPickerDateToAndFrom.dateTo.value)
              }
              onChange={(event: any) => {
                if (event.type == "set") {
                  const formattedDate = new Date(event.nativeEvent.timestamp)
                    .toISOString()
                    .split("T")[0];
                  handleOnChangeShowPickerDate(
                    formattedDate,
                    setShowStatementPickerDateToAndFrom,
                    showStatementPickerDateToAndFrom,
                    "dateTo"
                  );
                }
              }}
              style={styles.datePicker}
            />
          )}
        </View> */}
      </Box>
      <View style={styles.footerContent}>
        <View style={styles.downloadBtnMain}>
          <Button
            onPress={handleGenerateFile}
            color="light-pink"
            leftIcon={<TransactionIcon size={16} color="pink" />}
          >
            Generate
          </Button>
        </View>
      </View>
    </MainLayout>
  );
}
