import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { printAsync } from "expo-print";

import {
  StatementFilter,
  getStatementsfinxp,
  StatementResponse,
} from "../redux/transaction/transactionSlice";
import { useGetProfileQuery } from "../redux/profile/profileSliceV2";
import { RootState } from "../store";
import { generateStatementsPDF } from "../components/StatementsPDF/StatementsPDF";

export default function useGeneratePDF() {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state?.auth?.userData);
  const accountDetails = useSelector(
    (state: RootState) => state?.account?.details
  );
  const userTokens = useSelector((state: RootState) => state?.auth?.data);

  const { isLoading: isLoadingGetProfile, data: profileData } =
    useGetProfileQuery(
      {
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      },
      {
        skip:
          !userTokens && !userTokens?.access_token && !userTokens?.token_ziyl,
      }
    );

  const [generatePDFParams, setGeneratePDFParams] = useState<{
    dateFrom: string;
    dateTo: string;
    userId: string | number | undefined;
  }>({ dateFrom: "", dateTo: "", userId: "" });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  const resetPDFParams = () => {
    setGeneratePDFParams({ dateFrom: "", dateTo: "", userId: "" });
  };

  useEffect(() => {
    const handleGeneratePDF = async () => {
      setIsGeneratingPDF(true);
      const statementFilterWithDateRange: StatementFilter = {
        account_id: Number(generatePDFParams?.userId),
        from_date: generatePDFParams?.dateFrom,
        to_date: generatePDFParams?.dateTo,
      };
      const accountData = {
        from_date: generatePDFParams?.dateFrom,
        to_date: generatePDFParams?.dateTo,
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        address_line_1: profileData?.address_line1,
        address_line_2: profileData?.address_line_2,
        country: profileData?.country,
        iban: userData?.iban,
        bic: userData?.bic,
        currentBalance: accountDetails?.curbal,
      };

      dispatch<any>(getStatementsfinxp(statementFilterWithDateRange))
        .unwrap()
        .then(async (res: StatementResponse) => {
          if (res?.statements && res?.statements?.length > 0) {
            setIsGeneratingPDF(false);
            resetPDFParams();
            const pdfUri = await generateStatementsPDF({
              statements: res?.statements,
              accountData,
            });

            return await printAsync({ uri: pdfUri });
          } else {
            setIsGeneratingPDF(false);
            alert("You dont have transaction for selected dates");
            resetPDFParams();
          }
        })
        .catch((err: any) => {
          setIsGeneratingPDF(false);
          resetPDFParams();
          console.log({ err: `${err}. Statements generation file error` });
        });
    };

    if (
      generatePDFParams?.dateFrom &&
      generatePDFParams?.dateTo &&
      generatePDFParams?.userId
    ) {
      handleGeneratePDF();
    }
  }, [generatePDFParams]);

  const handleSetDate = ({
    userId,
    previousMonthFirstDay,
    lastDateOfPrevMonth,
  }: any) => {
    setGeneratePDFParams({
      userId,
      dateFrom: previousMonthFirstDay,
      dateTo: lastDateOfPrevMonth,
    });
  };

  return {
    handleSetDate,
    isGeneratingPDF,
    resetPDFParams,
  };
}
