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
  const accountDetails = useSelector((state: RootState) => state?.account?.details);
  const currentBalance = accountDetails?.curbal;
  const [selectedPrint, setSelectedPrint] = useState<string>("pdf");

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
    statements: StatementTransactionsResponse[],
    _searchFilter: StatementFilter
  ) => {
    const pdfUri = await generateStatementsPDF({statements, accountData: {...userData, ..._searchFilter, currentBalance}});
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
        const getFormattedDate = new Date(dateTo.value);
        const statementFilterWithDateRante: StatementFilter = {
          account_id: Number(userData?.id),
          from_date: dateFrom.value,
          to_date: getFormattedDate > currentDate ? currentDate.toISOString().split("T")[0] : dateTo.value,
        };
        dispatch<any>(getStatementsfinxp(statementFilterWithDateRante))
        .unwrap()
        .then(async (res: StatementResponse) => {
          const { statements } = res;
          if (statements && statements?.length > 0) {
            setLoading(false);
            await handleGeneratePDF(statements, statementFilterWithDateRante);
          } else {
            setLoading(false);
            alert("You dont have transaction for selected dates");
          }
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
          alert("Something went wrong");
          console.log({ err: `${err}. Statements generation file error` });
        });
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
      </View>
      <Box style={styles.dateContainer}>
        <ScrollingButtons
          onScrollOptions={(formattedDate) => {
            if (!formattedDate) return;
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
