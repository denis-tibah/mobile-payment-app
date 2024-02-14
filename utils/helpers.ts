import { Dimensions } from "react-native";
import { dateFormatter } from "./dates";
import { Transaction } from "../models/Transactions";
import { TRANSACTIONS_STATUS } from "./constants";
import { err } from "react-native-svg/lib/typescript/xml";
import dateFns from "date-fns";

export const { width: widthGlobal, height: heightGlobal } =
  Dimensions.get("window");
export const globalWidthUnit = widthGlobal / 100;
export const globalHeightUnit = heightGlobal / 100;

export const wp = (unit: number) => (globalWidthUnit / 2) * unit;
export const hp = (unit: number) => (globalHeightUnit / 2) * unit;
export interface GroupedByDateTransactionObject {
  [date: string]: Transaction[];
}

export function formatDateTableValue(date = "") {
  return date.split("-").reverse().join("-");
}

//added by Aristos
export function formatAmountTableValue(amount: any = "", currency = "") {
  if (!amount || !currency) return Number.parseFloat("0").toFixed(2);
  return `${Number(amount) > 0 ? "+ " : "- "}${Math.abs(
    Number.parseFloat(amount)
  ).toFixed(2)}`;
}

// if theres a + sign return true otherwise return false
export function isPositiveAmount(amount: any = "") {
  return amount.toString().includes("+");
}

export function isPositiveAmountWithSign(amount: any) {
  /* If the number is positive, this method returns 1.
  If the number is negative, it returns -1.
  If the number is zero, it returns 0. */
  const parsedAmount = amount ? Number(amount) : 0;
  return Math.sign(parsedAmount);
}

export function formatAmountTableValue_old(amount: any = "", currency = "") {
  if (!amount || !currency) return;

  if (!amount.split(".")[1]) {
    if (amount > 0) {
      console.log("Positive number amount.slice(1)", amount);
      console.log(
        "Postive Decimal number amount",
        Number.parseFloat(amount).toFixed(2)
      );
      return `${amount}`;
    } else {
      console.log(
        "Negative Whole number amount.slice(0, 1)",
        Number.parseFloat(amount).toFixed(2)
      );
      return `${amount.slice(0, 1)} ${amount.slice(1)}`;
    }
  }
}

export function formatAmountWithCurrency(amount: any = "") {
  if (!amount) return 0;
  const _amount = amount.split(" ");
  if (_amount.length === 2) {
    if (_amount[0] === "+") {
      return `+ € ${Number(_amount[1])}`;
    } else {
      return `- € ${Number(_amount[1])}`;
    }
  }
}

export function convertImageToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result.split("base64,")[1]);
    };
    reader.onerror = (error: any) => {
      reject(error);
    };
  });
}
export const containsOnlyNumbers = (value: any): boolean => {
  return /^\d+$/.test(value);
};

export const prependBase64 = (base64: string) => {
  return `data:image/jpeg;base64,${base64}`;
};

export const getCurrency = (currency = "") => {
  const lowercaseCurrency = currency ? currency.toLocaleLowerCase() : "";
  switch (lowercaseCurrency) {
    case "eur":
      return "€";
    case "usd":
      return "$";
    case "gbp":
      return "£";
    default:
      return "€";
  }
};

export const groupedByDateTransactions = (
  txData: Transaction[]
): GroupedByDateTransactionObject => {
  if (!txData) return {};
  const sanitizedDate: Transaction[] = txData.map((tx: Transaction) => {
    return {
      ...tx,
      transaction_datetime: dateFormatter(tx.transaction_datetime.toString()),
      transaction_datetime_with_hour: tx.transaction_datetime.toString(),
    };
  });
  const groupedByDateTransactions: GroupedByDateTransactionObject =
    sanitizedDate.reduce((current: any, element) => {
      (current[element.transaction_datetime] ??= []).push(element);
      return current;
    }, {});
  return groupedByDateTransactions;
};
export const groupedByNameTransactions = (
  txData: Transaction[]
): GroupedByDateTransactionObject => {
  if (!txData) return {};
  const sanitizedDate: Transaction[] = txData.map((tx: Transaction) => {
    return {
      ...tx,
      transaction_datetime: dateFormatter(tx.transaction_datetime.toString()),
      transaction_datetime_with_hour: tx.transaction_datetime.toString(),
    };
  });

  const groupedByNameTransactions: GroupedByDateTransactionObject =
    sanitizedDate.reduce((current: any, element) => {
      (current[element.name] ??= []).push(element);
      return current;
    }, {});
  return groupedByNameTransactions;
};

export function capitalizeFirstLetter(str: string): string {
  return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export const transactionStatusOptions = Object.keys(TRANSACTIONS_STATUS).map(
  (value) => {
    return {
      label: capitalizeFirstLetter(value),
      value: TRANSACTIONS_STATUS[value as keyof typeof TRANSACTIONS_STATUS],
    };
  }
);

export const formatTransactionsForPaymentScreen = (
  transactions: Transaction[]
) => {
  if (!transactions) return [];
  return transactions
    .filter((transaction) => transaction.service !== "DEBIT CARD")
    .map((transaction) => ({
      ...transaction,
      amount: formatAmountTableValue(transaction.amount, transaction.currency),
      date: formatDateTableValue(transaction.transaction_datetime.toString()),
    }));
};

export const screenNames: any = {
  login: "login",
  myaccount: "My Account",
  transactions: "Transactions",
  card: "Card",
  payments: "Payments",
  statements: "statements",
  payees: "Payees",
  payeesList: "Payees List",
  addPayee: "Add Payee",
  approve: "Approve",
  signup: "signup",
  receivedPayment: "receivedPayment",
  emailVerified: "emailVerified",
  profileDetails: " profileDetails",
  forgottenPassword: "forgottenPassword",
  resetPassword: "Reset Password",
  payeeSendFunds: "payee_send_funds",
  getCard: "getCard",
};

const chechIfResponseIsError = (response: any) => {
  const errorCodes = [
    500,
    400,
    401,
    403,
    404,
    405,
    406,
    409,
    422,
    429,
    "500",
    "400",
    "401",
    "403",
    "404",
    "405",
    "406",
    "409",
    "422",
    "429",
  ];
  if (
    response &&
    (errorCodes.includes(response.status) || errorCodes.includes(response.code))
  ) {
    return true;
  }
  return false;
};

export const getNameInitials = (name: string) => {
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

export const getUserActiveCards = (cards: any) => {
  if (!cards || chechIfResponseIsError(cards) || typeof cards === undefined)
    return [];
  return cards.filter((card: any) => card.lostYN === "N");
};

export const sortUserActiveToInactiveCards = (cards: any) => {
  if (!cards || chechIfResponseIsError(cards) || typeof cards === undefined)
    return [];
  const activeCards = cards.filter((card: any) => card.lostYN === "N");
  const inactiveCards = cards.filter((card: any) => card.lostYN === "Y");
  return [...activeCards, ...inactiveCards];
};

export function getPendingAmount(avlbal: any, currentBalance: any) {
  const pendingAmount = Math.abs(currentBalance - avlbal);
  //use toFixed(2) to format nuber to 2 decimal places
  return pendingAmount.toFixed(2) || "0.00";
}
export function formatDateDayMonthYear(dateToFormat: number) {
  return new Date(dateToFormat).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export function getFormattedDate(dateToFormat: any) {
  const date = new Date(dateToFormat);

  const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;

  return formattedDate;
}

export function getFirstAndLastName(str: string) {
  const firstSpace = str.indexOf(" ");
  let data = str.slice(firstSpace + 1);
  data.slice(0, data?.indexOf(" "));
  return {
    firstname: str.slice(0, firstSpace),
    lastname: str.slice(firstSpace + 1),
  };
}

export function getFormattedDateAndTime(dateToFormat: any) {
  const date = new Date(dateToFormat);
  // uniform date as per QA
  const formattedDateAndTime = dateFns.format(date, "dd.MM.yyyy h:mm a"); // Output: DD-MM-YYYY TT:MM PM

  /*   const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;*/
  return formattedDateAndTime;
}

export function getFormattedDateAndTimeV2(dateToFormat: any) {
  const date = new Date(dateToFormat);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = `
  ${date.getDate().toString().padStart(2, "0")} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  return formattedDate;
}

export const convertDateToDottedName = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
};

export function getFormattedDateFromUnix(dateToFormat: any) {
  const date = new Date(dateToFormat);

  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
}

export function getFormattedDateFromUnixDotted(dateToFormat: any) {
  const date = new Date(dateToFormat);

  const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;

  return formattedDate;
}

export function convertDateToName(timestamp: any) {
  let currentTimestamp = new Date(parseInt(timestamp));

  return new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(timestamp);
}

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export const formatCurrencyToLocalEn = (currency: string) => {
  if (!currency) {
    return 0.0;
  }
  const trimString = currency.replace(/[^0-9.-]+/g, "");
  if (trimString) {
    return parseFloat(trimString).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

export const formatCurrencyToLocalEnTwo = (currency: string) => {
  if (currency) {
    const trimString = currency.replace(/[^0-9.-]+/g, "");
    const convertedAmount = Number(trimString);
    if (convertedAmount) {
      return parseFloat(trimString).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  return "0.00";
};

export const arrayChecker = (arr: any[]): Boolean => {
  return arr && Array.isArray(arr) && arr.length > 0 ? true : false;
};

export const fieldHasValue = (value: any) => {
  if (value && value !== null && value !== undefined) {
    if (value.toLowerCase() !== "null") {
      return value;
    } else {
      return "";
    }
  }
  return "";
};

export const groupByDateAndSeveralProperties = ({
  items,
  groups,
}: {
  items: any;
  groups: string[];
}) => {
  const grouped = {};
  // formatted transaction_datetime
  const mapedItems = items.map((param: any) => {
    const newItems = {};
    if (param?.transaction_datetime) {
      Object.assign(newItems, {
        ...param,
        transaction_datetime: dateFormatter(
          param?.transaction_datetime.toString()
        ),
        transaction_datetime_with_hour: param?.transaction_datetime.toString(),
      });
    }
    return newItems;
  });
  mapedItems.forEach(function (a: any) {
    groups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, grouped)
      .push(a);
  });
  return grouped;
};
