import * as Print from "expo-print";
import { formatAmountTableValue } from "./helpers";

const generateHTML = (transactions:any) => {
  const htmlTransactions = transactions.map((transaction:any) => {
    let iban = "";
    let bic = "";

    if (transaction.iban && transaction.iban.length > 0) {
      iban = `<p>IBAN: ${transaction.iban}</p>`;
    }
    if (transaction.bic && transaction.bic.length > 0) {
      bic = `<p>BIC: ${transaction.bic}</p>`;
    }
    const transactionDate = new Date(
      transaction.transaction_datetime
    ).toLocaleDateString();
    return `
      <tr>
        <td style="border: 1px solid black; padding: 5px;">${
          transaction.name
        }</td>
        <td style="border: 1px solid black; padding: 5px;">${transactionDate}</td>
        <td style="border: 1px solid black; padding: 5px;">${formatAmountTableValue(
          transaction.amount,
          transaction.currency
        )}</td>
        <td style="border: 1px solid black; padding: 5px;">${formatAmountTableValue(
          transaction.running_balance,
          transaction.currency
        )}</td>
        <td style="border: 1px solid black; padding: 5px;">${iban}${bic}</td>
      </tr>
    `;
  });

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
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
          }
          .title {
            color: #086AFB;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 14pt;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="title">Transaction Report</div>
        <table>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Details</th>
          </tr>
          ${htmlTransactions.join("")}
        </table>
      </body>
    </html>
  `;
};

export const generatePDF = async (transactions:any) => {
  try {
    const html = generateHTML(transactions);
    const pdf = await Print.printToFileAsync({ html });
    return pdf.uri;
  } catch (error) {
    console.log({ error });
  }
};

const generateTransactionHTML = (transactions:any) => {
  const htmlTransactions = transactions.map((transaction:any) => {
    let iban = "";
    let bic = "";
    let opening_balance = "";
    let closing_balance = "";
    let balance = "";
    let reference_no = "";

    if (transaction.iban && transaction.iban.length > 0) {
      iban = `<p>IBAN: ${transaction.iban}</p>`;
    }
    if (transaction.bic && transaction.bic.length > 0) {
      bic = `<p>BIC: ${transaction.bic}</p>`;
    }
    if (transaction.opening_balance && transaction.opening_balance.length > 0) {
      opening_balance = `<p>Opening Balance: ${transaction.opening_balance}</p>`;
    }
    if (transaction.closing_balance && transaction.closing_balance.length > 0) {
      closing_balance = `<p>Closing Balance: ${transaction.closing_balance}</p>`;
    }
    if (transaction.running_balance && transaction.running_balance.length > 0) {
      closing_balance = `<p>Running balance: ${transaction.running_balance}</p>`;
    }
    if (transaction.balance && transaction.balance.length > 0) {
      balance = `<p>Balance: ${transaction.balance}</p>`;
    }
    if (transaction.reference_no && transaction.reference_no.length > 0) {
      reference_no = `<p>Reference No: ${transaction.reference_no}</p>`;
    }
    const transactionDate = new Date(
      transaction.transaction_datetime
    ).toLocaleDateString();
    return `
      <tr>
        <td style="border: 1px solid black; padding: 5px;">${
          transaction.name
        }</td>
        <td style="border: 1px solid black; padding: 5px;">${transactionDate}</td>
        <td style="border: 1px solid black; padding: 5px;">${formatAmountTableValue(
          transaction.amount,
          transaction.currency
        )}</td>
        <td style="border: 1px solid black; padding: 5px;">${iban}${bic}${opening_balance}${closing_balance}${balance}${reference_no}</td>
      </tr>
    `;
  });

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
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
          }
          .title {
            color: #086AFB;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 14pt;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="title">Transaction Report</div>
        <table>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Details</th>
          </tr>
          ${htmlTransactions.join("")}
        </table>
      </body>
    </html>
  `;
};

export const generateTransactionPDF = async (transactions:any) => {
  try {
    const html = generateTransactionHTML(transactions);
    const pdf = await Print.printToFileAsync({ html });
    return pdf.uri;
  } catch (error) {
    console.log({ error });
  }
};
