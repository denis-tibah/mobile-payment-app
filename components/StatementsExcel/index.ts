import { StatementTransactionsResponse } from "../../redux/transaction/transactionSlice";
import { STATEMENT_TRANSACTION_FIELDS } from "../../utils/constants";
import XLSX from "xlsx";
import {
  convertLogoToBase64,
} from "../StatementsPDF/StatementsPDF";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import { convertDateToDottedName, convertDateToName } from "../../utils/helpers";
import dateFns from "date-fns";

export const generateStatementsExcel = async ({
  statements,
  accountData
}: any) => {
  const transactionsContent = [
    ["Zazoo Logo", "", "", "", "", "Account Statement"],
    ["", "", "", "", "", `Generated on the ${convertDateToName(Date.now())}`],
    [`${accountData?.first_name || ""} ${accountData?.last_name || ""}`, "", "", "", "", `IBAN: ${accountData?.iban || ""} | BIC: ${accountData?.bic || ""}`],
    [`${accountData?.address_line_1 || ""}  ${accountData?.address_line_2 || ""} ${accountData?.country || ""}`, "", "", "", "", `Currency: ${accountData?.currentBalance || ""}`],
    ["", "", "", "", "", `From: ${convertDateToDottedName(accountData?.from_date) + " To:"  + convertDateToDottedName(accountData?.to_date)}`],
  ]
  transactionsContent.push(Object.values(STATEMENT_TRANSACTION_FIELDS))
  transactionsContent.push(...statements.map((transaction: StatementTransactionsResponse) =>
    Object.keys(STATEMENT_TRANSACTION_FIELDS).reduce<string[]>(
      (res, key) => ([...res, transaction[key as keyof StatementTransactionsResponse]]),
      []
    )
  ));
  console.log(transactionsContent)
  const image = await convertLogoToBase64();
  const obj = { image };

  const merge = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },
    { s: { r: 1, c: 3 }, e: { r: 1, c: 5 } }, 
    { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }, { s: { r: 2, c: 3 }, e: { r: 2, c: 5 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, { s: { r: 3, c: 4 }, e: { r: 3, c: 5 } },
    { s: { r: 4, c: 3 }, e: { r: 4, c: 5 } }
  ];
  const colWidths = [{ wch: 20 },{ wch: 20 },{ wch: 10 },{ wch: 10 },{ wch: 10 },{ wch: 60 }];

  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.aoa_to_sheet(transactionsContent);
  ws["!merges"] = merge;
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "statement");
  const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
  const filename = `statement_${dateFns.format(new Date(), "yyyy-MM-dd")}.xlsx`
  RNFS.writeFile(RNFS.DownloadDirectoryPath + `/statement_${filename}.xlsx`, wbout, "ascii")
  .then((r) => {
    Alert.alert("Excel generated successfully", `File saved as ${filename}`);
  })
};
