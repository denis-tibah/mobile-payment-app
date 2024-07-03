import { StatementTransactionsResponse } from "../../redux/transaction/transactionSlice";
import { STATEMENT_TRANSACTION_FIELDS } from "../../utils/constants";
import XLSX from "xlsx";
import {
  convertLogoToBase64,
  statementsPDFGenerator,
} from "../StatementsPDF/StatementsPDF";
import RNFS from "react-native-fs";
import { Alert } from "react-native";
import ExcelJS from "exceljs";

export const generateStatementsExcel = async (
  transactions: StatementTransactionsResponse[],
  accountData: any
) => {
  const transactionsContent = transactions.map((transaction) =>
    Object.keys(transaction).reduce(
      (res, key) => ({
        ...res,
        [STATEMENT_TRANSACTION_FIELDS[key]]:
          transaction[key as keyof StatementTransactionsResponse],
      }),
      {}
    )
  );
  const image = await convertLogoToBase64();
  const obj = { image };
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(transactionsContent);

  XLSX.utils.book_append_sheet(wb, ws, "Users");
  const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
  // try {
  //   const { Workbook } = ExcelJS;
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet("My Sheet");

  //   // Add column headers
  //   worksheet.columns = [
  //     { header: "ID", key: "id", width: 10 },
  //     { header: "Name", key: "name", width: 30 },
  //     { header: "Age", key: "age", width: 10 },
  //   ];

  //   // Add rows
  //   worksheet.addRow({ id: 1, name: "John Doe", age: 28 });
  //   worksheet.addRow({ id: 2, name: "Jane Smith", age: 34 });
  //   worksheet.addRow({ id: 3, name: "Sam Johnson", age: 45 });

  //   // Create a file path
  //   const path = RNFS.DocumentDirectoryPath + "/my_excel_file.xlsx";

  //   // Write to file
  //   await workbook.xlsx.writeFile(path);
  //   Alert.alert("ABC");
  // } catch (e) {
  //   console.log(e.message);
  // }

  //   const workbook = new Excel.Workbook();
  //   const sheet = workbook.addWorksheet("Statement");

  //   const image = await convertLogoToBase64();
  //   const imageBuffer = Buffer.from(image, "base64");
  //   const imageId = workbook.addImage({
  //     buffer: imageBuffer,
  //     extension: "jpeg", // Adjust the extension as necessary
  //   });
  //   sheet.columns = Object.values(STATEMENT_TRANSACTION_FIELDS).map((key) => ({
  //     header: key,
  //     key: key,
  //     width: 15,
  //   }));
  //   sheet.addRows(transactionsContent);

  //   // Place the image in a specific cell range on the sheet
  //   sheet.addImage(imageId, {
  //     tl: { col: 1.5, row: 1.5 }, // top-left corner of the image in cell
  //     ext: { width: 100, height: 100 }, // size of the image (width x height in pixels)
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();

  RNFS.writeFile(RNFS.DownloadDirectoryPath + "/abc.xlsx", wbout, "ascii")
    .then((r) => {
      console.log("success");
      Alert.alert("Succeses");
    })
    .catch((e) => {
      console.log("Error", e);
    });
};
