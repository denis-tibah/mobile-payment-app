import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { printAsync } from "expo-print";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { View, PermissionsAndroid, Alert } from "react-native";

import {
  StatementFilter,
  StatementResponse,
  getStatementsfinxp,
  StatementTransactionsResponse,
} from "../../redux/transaction/transactionSlice";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { useGetProfileQuery } from "../../redux/profile/profileSliceV2";
import Box from "../../components/Box";
import { MainLayout } from "../../layout/Main/Main";
import Heading from "../../components/Heading";
import { styles } from "./styles";
import StatementIcon from "../../assets/icons/Statement";
import TransactionIcon from "../../assets/icons/Transaction";
import Pdf from "../../assets/icons/Pdf";
import Excel from "../../assets/icons/Excel";
import Button from "../../components/Button";
import { RootState } from "../../store";
import ScrollingButtons from "./ScrollingButtons";
import { format } from "date-fns";
import { generateStatementsPDF } from "../../components/StatementsPDF/StatementsPDF";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import { generateStatementsExcel } from "../../components/StatementsExcel";

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
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const dispatch = useDispatch();
  const accountDetails = useSelector(
    (state: RootState) => state?.account?.details
  );

  const {
    isLoading: isLoadingGetProfile,
    data: profileData,
    refetch,
  } = useGetProfileQuery(
    {
      accessToken: userTokens?.access_token,
      tokenZiyl: userTokens?.token_ziyl,
    },
    {
      skip: !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
    }
  );
  const currentBalance = accountDetails?.curbal;
  const [selectedPrint, setSelectedPrint] = useState<string>("pdf");

  const [
    showStatementPickerDateToAndFrom,
    setShowStatementPickerDateToAndFrom,
  ] = useState<DateRangeType>(initialDateRange);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userData?.id) {
      dispatch(getAccountDetails(userData.id) as any);
    }
  }, [userData]);

  const handleGeneratePDF = async (
    statements: StatementTransactionsResponse[],
    _searchFilter: StatementFilter
  ) => {
    const pdfUri = await generateStatementsPDF({
      statements,
      accountData: {
        ...userData,
        ..._searchFilter,
        currentBalance,
        ...profileData,
      },
    });
    return await printAsync({ uri: pdfUri });
  };

  const handleGenerateExcel = async (
    statements: StatementTransactionsResponse[],
    _searchFilter: StatementFilter
  ) => {
    try {
      await generateStatementsExcel({
        statements,
        accountData: {
          ...userData,
          ..._searchFilter,
          currentBalance,
        },
      });
    }
     catch(e) {
      console.log("Error")
     }
  };

  // generateStatementsPDF

  // const handleOnChangeShowPickerDate = (
  //   formattedDate: string,
  //   setState: any,
  //   values: any,
  //   key: string
  // ) => {
  //   const { dateFrom, dateTo } = values;
  //   if (key === "dateFrom") {
  //     if (dateTo.value) {
  //       const fromDate = new Date(formattedDate);
  //       const toDate = new Date(dateTo.value);
  //       if (fromDate > toDate) {
  //         alert("Date from should be before or same with Date to");
  //         return;
  //       }
  //     }
  //   } else {
  //     if (dateFrom.value) {
  //       const fromDate = new Date(dateFrom.value);
  //       const toDate = new Date(formattedDate);
  //       if (fromDate > toDate) {
  //         alert("Date from should be before or same with Date to");
  //         return;
  //       }
  //     }
  //   }
  //   setState({
  //     ...values,
  //     [key]: {
  //       state: false,
  //       value: formattedDate,
  //     },
  //   });
  // };

  const handleGenerateFile = async () => {
    const { dateFrom, dateTo } = showStatementPickerDateToAndFrom;
    if (userData?.id && dateFrom.value && dateTo.value) {
      setLoading(true);
      const getFormattedDate = new Date(dateTo.value);
      const statementFilterWithDateRange: StatementFilter = {
        account_id: Number(userData?.id),
        from_date: dateFrom.value,
        to_date:
          getFormattedDate > currentDate
            ? currentDate.toISOString().split("T")[0]
            : dateTo.value,
      };
      dispatch<any>(getStatementsfinxp(statementFilterWithDateRange))
        .unwrap()
        .then(async (res: StatementResponse) => {
          const { statements } = res;
          if (statements && statements?.length > 0) {
            //           setLoading(false);
            if (selectedPrint === "pdf") {
              await handleGeneratePDF(statements, statementFilterWithDateRange);
            } else if (selectedPrint === "excel") {
              try {
                let isPermitedExternalStorage = await PermissionsAndroid.check(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );

                if (!isPermitedExternalStorage) {
                  // Ask for permission
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                      title: "Storage permission needed",
                      message: "Storage writing permission request",
                      buttonNeutral: "Ask Me Later",
                      buttonNegative: "Cancel",
                      buttonPositive: "OK",
                    }
                  );

                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    handleGenerateExcel(statements, statementFilterWithDateRange);
                    console.log("Permission granted");
                  } else {
                    // Permission denied
                    console.log("Permission denied");
                  }
                } else {
                  handleGenerateExcel(statements, statementFilterWithDateRange);
                }
              } catch (e) {
                console.log("Error while checking permission");
                console.log(e);
                return;
              }
            }
          } else {
            alert("File type not supported yet. Please select PDF file type.");
          }
        })
        .catch((err: any) => {
          setLoading(false);
          console.log({ err: `${err}. Statements generation file error` });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("Please select from and to date");
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
              setSelectedPrint("pdf");
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
        <View style={styles.downloadBtn}>
          <Button
            onPress={() => {
              setSelectedPrint("excel");
            }}
            color={selectedPrint === "excel" ? "blue" : "light-blue"}
            leftIcon={
              <Excel
                size={16}
                color={selectedPrint === "excel" ? "white" : "blue"}
              />
            }
          >
            Excel Export
          </Button>
        </View>
      </View>
      <Box style={styles.dateContainer}>
        <ScrollingButtons
          onScrollOptions={(formattedDate) => {
            // generate pdf
            if (!formattedDate) return;
            const date = new Date(formattedDate);
            const _firstDay = format(
              new Date(date.getFullYear(), date.getMonth(), 1),
              "yyyy-MM-dd"
            );
            const _lastDay = format(
              new Date(date.getFullYear(), date.getMonth() + 1, 0),
              "yyyy-MM-dd"
            );
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
          }}
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
