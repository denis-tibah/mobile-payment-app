import { Asset } from "expo-asset";
import {
  convertDateToDottedName,
  convertDateToName,
  formatAmountValueWithCurrency,
  formatDateV3,
} from "../../utils/helpers";
import ZazooLogo from "../../assets/images/ZazooLogoDark.jpg";
import * as FileSystem from "expo-file-system";
import mime from "react-native-mime-types";
import { StatementTransactionsResponse } from "../../redux/transaction/transactionSlice";

export const convertLogoToBase64 = async (): Promise<string> => {
  try {
    const asset = Asset.fromModule(ZazooLogo);
    await asset.downloadAsync();

    const image = await FileSystem.readAsStringAsync(asset.localUri || "", {
      encoding: "base64",
    });

    const mimeType = mime.lookup(asset.localUri || "");
    return `data:${mimeType};base64,${image}`;
  } catch (error) {
    console.log({ error: `${error}. convert image error` });
    return "";
  }
};

const generateHTML = (transactions: StatementTransactionsResponse[]) => {
  return transactions.map(
    (transaction: StatementTransactionsResponse, index: number) => {
      let transaction_ref_no = "";
      let transfer_currency = "";

      if (transaction.transaction_ref_no) {
        transaction_ref_no = `<p>Transaction Ref No.: ${transaction.transaction_ref_no}</p>`;
      }
      if (transaction.transfer_currency) {
        transfer_currency = `<p>BIC: ${transaction.transfer_currency}</p>`;
      }
      if (index % 11 === 0 && index !== 0 && index !== 1) {
        return `
          <tr class="page-break">
            <td>${transaction?.transaction_ref_no || ""}</td>
            <td>
              <p style="margin: 3px 15px; text-align: center; width: 85px;">  
                ${
                  transaction.transaction_date
                    ? formatDateV3(transaction.transaction_date)
                    : ""
                }
              </p>
            </td>
            <td>${transaction?.sender_receiver || ""}</td>
            <td>
              <p style="width: 80px !important; text-align: center;">
                ${formatAmountValueWithCurrency(
                  transaction.debit,
                  transaction.transfer_currency
                )}
              </p>
            </td>
            <td>
              <p style="width: 70px !important; text-align: center;">
                ${formatAmountValueWithCurrency(
                  transaction.credit,
                  transaction.transfer_currency
                )}
              </p>
            </td>
            <td>${transaction?.balance || ""}</td>
          </tr>
        `;
      }

      return `
      <tr>
        <td style="border: none; padding: 5px;">${
          transaction?.transaction_ref_no || ""
        }</td>
        <td style="border: none; padding: 5px;">
          <p style="margin=3px 15px; text-align=center; width=85px; height=70px !important;">  
          ${
            transaction.transaction_date
              ? formatDateV3(transaction.transaction_date)
              : ""
          }
          </p>
        </td>
        <td style="border: none; padding: 5px;">${
          transaction?.sender_receiver || ""
        }</td>
        <td style="border: none; padding: 5px;">
          <p style="width: 80px !important; text-align: center;">
            ${formatAmountValueWithCurrency(
              transaction.debit,
              transaction.transfer_currency
            )}
          </p>
        </td>
        <td style="border: none; padding: 5px;">
          <p style="width: 70px !important; text-align: center;">
            ${formatAmountValueWithCurrency(
              transaction.credit,
              transaction.transfer_currency
            )}
          </p>
        </td>
        <td style="border: none; padding: 5px; ">${
          transaction?.balance || ""
        }</td>
      </tr>
    `;
    }
  );
};

export const statementsPDFGenerator = async ({
  statements,
  accountData,
}: any): Promise<string> => {
  if (!statements || !accountData) {
    return "";
  }
  const image = await convertLogoToBase64();
  const tableRows = generateHTML(statements);

  return `
    <html>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
        * {
          font-family: 'Nunito-Regular';

        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th {
          text-align: left;
          background-color: #F9F9F9;
          height: 55px;
        }
        th, td {
          border: none;
          padding: 5px;
        }
        td {
          font-size: 12px;
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
          padding-right: 30px;
          margin-top: -10px;
        }
        .account-statement-header {
          display: flex;
          height: 100px;
          flex-direction: row;
          justify-content: space-between;
          background-color: #F9F9F9;
          width: 100%;
          padding: 20px 20px;
        }
        .left-align-div {
          text-align: left;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
      <head>
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
          <div style="display: flex; flex-direction: column; height: 100px !important;">
            <div style="margin-top: -20px;">
              <h3>${accountData?.first_name || ""} ${
    accountData?.last_name || ""
  }</h3>
            </div>
            <div style="margin-top: -10px; flex-direction: column; display: flex;">
              <span>${accountData?.address_line_1 || ""}</span>
              <span>${accountData?.address_line_2 || ""}</span>
              <span>${accountData?.country || ""}</span>
            </div>
          </div>
          <div class="column-div">
            <div class="row-div" style="height: 25px; flex-direction: row; display: flex;">
              <h4 style="text-align: right; margin-top: 15px;">IBAN: </h4> <p style="padding-left: 5px;">${
                " " + (accountData?.iban || "") + " | "
              }</p> 
              <h4 style="text-align: right; margin-top: 15px; padding-left: 10px;"> BIC: </h4> <p style="padding-left: 5px;">${
                " " + (accountData?.bic || "")
              }</p>
            </div>
            <div style="height: 25px; width: 100%">
              <h5 style="text-align: right;"> Curreny: EUR </h5>
            </div>
            <div style="height: 25px; width: 100%; display: none">
              <h5 style="text-align: right;"> Current Balance: ${
                accountData?.currentBalance || ""
              }</h5>
            </div>
          </div>
        </div>
        <div class="row-div" style="justify-content: space-between;">
          <h4>Transactions</h4>
          <div class="row-div">
            <h4 style="font-weight: bold; padding-left: 10px;">From:</h4><h4>${
              ` ` + convertDateToDottedName(accountData?.from_date) + ` `
            }</h4>
            <h4 style="font-weight: bold; padding-left: 10px;">To:</h4><h4>${
              ` ` + convertDateToDottedName(accountData?.to_date) + ` `
            }</h4>
          </div>
        </div>
        <div>
          <table>
            <tr>
              <th>Reference</th>
              <th><p style="margin: 0px 15px !important;">Date(UTC)</p></th>
              <th>Description</th>
              <th>Money out</th>
              <th>Money in</th>
              <th>Balance</th>
            </tr>
            ${tableRows.join("")}
          </table>
        </div>
        <footer style="position: fixed; bottom: -10; left: 0; width: 100%; padding: 10px;">
        © 2023 Zazoo is a brand name operated by IQGP Ltd, a company registered in Cyprus with its Registered address at Dimostheni Severi 12, 6th Floor, Office 601, Nicosia, 1080, Cyprus and with Company Registration number HE 435932. Zazoo is not a bank. Zazoo is a technical platform that facilitates the opening and operating of an electronic money accounts for both individuals and corporate customers.
        Payment related services, debit card services, account opening and management services are provided through its relationship with regulated entity and electric money institution license holder, FinXP Ltd, a company registered in Malta with Registration number C 65783 which is regulated by the Malta Financial Services Authority and who has their registered office at Ardent Business Centre, No 4, Triq L-Oratorju, Naxxar NXR 2505, Malta.
        </footer>
      </body>
    </html>
  `;
};

export const generateStatementsPDF = async ({
  statements,
  accountData,
}: any) => {
  const { from_date, to_date } = accountData;
  const filename = `statement_${from_date}_${to_date}.pdf`;
  const newURI = FileSystem.documentDirectory + filename;
  return {newURI, filename};
};
