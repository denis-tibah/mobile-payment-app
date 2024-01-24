import React from "react";
import * as Print from "expo-print";
import { Asset } from 'expo-asset';
import { StyleSheet, Text, View, Image } from "react-native";
import { convertDateToDottedName, convertDateToName, formatAmountTableValue } from "../../utils/helpers";
import * as DocumentPicker from 'expo-document-picker';
import ZazooLogo from "../../assets/images/ZazooLogoDark.jpg";
import * as FileSystem from 'expo-file-system';
import mime from 'react-native-mime-types';
import { StatementTransactionsResponse } from "../../redux/transaction/transactionSlice";
// const ZazooLogo = '../../assets/images/ZazooLogo.png';

// const convertImageToBase64 = async (imagePath: string): Promise<string | undefined> => {
//   const image = await FileSystem.readAsStringAsync(imagePath, { encoding: 'base64' });
//   const mimeType = mime.lookup(imagePath);
//   console.log({ image });
//   return `data:${mimeType};base64,${image}`;
// };

const convertImageToBase64 = async (): Promise<string | undefined> => {
  try {
    const asset = Asset.fromModule(ZazooLogo);
    await asset.downloadAsync(); // Ensure the asset is downloaded

    const image = await FileSystem.readAsStringAsync(asset.localUri || '', {
      encoding: 'base64',
    });
    
  const mimeType = mime.lookup(asset.localUri || '');
    
    return `data:${mimeType};base64,${image}`;
  } catch (error) {
    console.error('Error converting image to base64', error);
    return undefined;
  }
};


const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFF',
        padding: 20,
    },
    bankStatmentHeaderContainer: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: "12px",
      marginLeft:"380px",
      marginTop: "-50px"
    },
    statementTitle: {
      flexDirection: 'row',
      marginTop: 24,
      fontSize: 12,
      marginBottom: "-10px"
    },
    bankStatementGeneratedfont: {
      fontSize: 10,
      paddingTop: -25,
      marginLeft: -30
    },
});

const generateHTML = (transactions: StatementTransactionsResponse[]) => {
  return transactions.map((transaction: StatementTransactionsResponse) => {
      let transaction_ref_no = "";
      let transfer_currency = "";

      if (transaction.transaction_ref_no) {
        transaction_ref_no = `<p>Transaction Ref No.: ${transaction.transaction_ref_no}</p>`;
      }
      if (transaction.transfer_currency) {
        transfer_currency = `<p>BIC: ${transaction.transfer_currency}</p>`;
      }
      const transactionDate = new Date(
        transaction.transaction_date
      ).toLocaleDateString();

      return `
      <tr>
        <td style="border: none; padding: 5px;">${
          transaction?.transaction_ref_no || ""
        }</td>
        <td style="border: none; padding: 5px;">${transactionDate}</td>
        <td style="border: none; padding: 5px;">${
          transaction?.sender_receiver || ""
        }</td>
        <td style="border: none; padding: 5px;">${formatAmountTableValue(
          transaction.balance,
          transaction.transfer_currency
        )}</td>
        <td style="border: none; padding: 5px; width: 250px;">${formatAmountTableValue(
          transaction.closing_balance,
          transaction.transfer_currency
        )}</td>
        <td style="border: none; padding: 5px; ">${
          transaction?.balance || ""
        }</td>
      </tr>
    `;
    }
  );
}

const statementsPDFGenerator = async ({ statements, accountData }: any): Promise<string> => {
  if (!statements || !accountData) {
    return '';
  }
  const image = await convertImageToBase64();
  const tableRows = generateHTML(statements);

  return `
    <html>
      <head>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th {
            text-align: left;
            background-color: #F9F9F9;

          }
          th, td {
            border: none;
            padding: 5px;
          }
          .title {
            color: #086AFB;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .row-div {
            display: flex;
            flex-direction: row;
          }
          .column-div {
            display: flex;
            flex-direction: column;
            line-height: 1;
          }
          .account-statement-header {
            display: flex;
            height: 100px;
            flex-direction: row;
            justify-content: space-between;
            background-color: #F9F9F9;
            width: 100%
            padding: 20px;
          }
          .left-align-div {
            text-align: left;
          }
          </style>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div style="width: 50%; height: 50%;">
              <img src="${image}" style="width: 200px; height: 50px;" alt="Zazoo2" />
            </div>
            <div style="width: 50%; text-align: right;">
              <h3>Account Statement</h3>
              <p>Generated on the ${convertDateToName(Date.now())}</p>
            </div>
          </div>
      </head>
      <body style="flex-direction: column">
        <div class="account-statement-header">
          <div>
            <h3>${accountData?.first_name} ${accountData?.last_name}</h3>
          </div>
          <div class="column-div">
            <div class="row-div" style="height: 25px; text-align: left;">
              <h5>IBAN: ${accountData?.iban} | </h5> <h5> BIC: ${" "+accountData?.bic}</h5>
            </div>
            <div style="height: 25px; width: 100%; align-items: end;">
              <h5> Curreny: EUR </h5>
            </div>
            <div style="height: 25px; width: 100%; align-items: end;">
              <h5> Current Balance: ${accountData?.curbal}</h5>
            </div>
          </div>
        </div>
        <div class="row-div" style="justify-content: space-between;">
          <h4>Transactions</h4>
          <div class="row-div">
            <h4 style="font-weight: bold; padding-left: 10px;">From:</h4><h4>${` ` + convertDateToDottedName(accountData?.from_date) + ` `}</h4>
            <h4 style="font-weight: bold; padding-left: 10px;">To:</h4><h4>${` ` + convertDateToDottedName(accountData?.to_date) + ` `}</h4>
          </div>
        </div>
        <div>
          <table>
            <tr>
              <th>Reference</th>
              <th>Date(UTC)</th>
              <th>Description</th>
              <th style="margin: 0px 15px 0px 15px;">Money out</th>
              <th style="margin: 0px 15px 0px 15px;">Money in</th>
              <th>Balance</th>
            </tr>
            ${tableRows.join("")}
          </table>
        </div>
      </body>
    </html>
  `
}

export const generateStatementsPDF = async ({statements, accountData}: any) => {
  const getHTML = await statementsPDFGenerator({ statements, accountData});
  const { uri } = await Print.printToFileAsync({ html: getHTML });
  return uri;
}
