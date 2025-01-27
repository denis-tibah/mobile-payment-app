import "intl";
import "intl/locale-data/jsonp/en";
import { Dimensions } from "react-native";
import dateFns, {
  format,
  isEqual,
  lastDayOfMonth,
  getMonth,
  subMonths,
  startOfMonth,
} from "date-fns";

import { dateFormatter } from "./dates";
import { Transaction } from "../models/Transactions";
import { TRANSACTIONS_STATUS } from "./constants";

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
  return `${Number(amount) > 0 ? " " : " "}${Math.abs(
    Number.parseFloat(amount)
  ).toFixed(2)}`;
}

export function formatAmountValueWithCurrency(amount: any = "", currency = "") {
  if (!amount || !currency) return Number.parseFloat("0").toFixed(2);
  return `€ ${Math.abs(Number.parseFloat(amount)).toFixed(2)}`;
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
      return `+ € ${Number(_amount[1]).toFixed(2)}`;
    } else {
      return `- € ${Number(_amount[1]).toFixed(2)}`;
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

/* export const groupedByDateTransactions = (
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
}; */
/* export const groupedByNameTransactions = (
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
}; */

export function capitalizeFirstLetter(str: string): string {
  return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export const capitalizeName = (name: string) => {
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
};

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
  // console.log("🚀 ~ getFormattedDateAndTime ~ dateToFormat:", dateToFormat);
  // const date = new Date(dateToFormat);
  // uniform date as per QA
  //const formattedDateAndTime = dateFns.format(date, "dd.MM.yyyy h:mm a"); // Output: DD-MM-YYYY TT:MM PM

  /*   const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;*/
  //return formattedDateAndTime;
  return dateToFormat ? dateToFormat.replace(/-/g, ".") : "";
}
export function getFormattedDateAndTimeAndSeconds({
  dateToFormat,
  hasTimeAndSeconds,
}: {
  dateToFormat: any;
  hasTimeAndSeconds?: boolean;
}) {
  if (!dateToFormat || dateToFormat === "" || dateToFormat === undefined)
    return "";
  const date = new Date(dateToFormat);
  const time = hasTimeAndSeconds ? "hh:mm:ss" : "";
  // uniform date as per QA
  const formattedDateAndTime = dateFns.format(date, `dd.MM.yyyy ${time}`);
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
//based on BE date as string 2024-01-25 10:02:09
export const formatDateV3 = (inputDate: any) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let formattedDate = "";
  if (inputDate) {
    // Split the input date string into date and time parts
    const [datePart, timePart] = inputDate.split(" ");

    // Extract year, month, and day from the date part
    const [year, month, day] = datePart.split("-").map(Number);

    // Extract hours, minutes, and seconds from the time part
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Format the date using the extracted components
    formattedDate = `${day} ${
      months[month - 1]
    } ${year} ${hours}:${minutes}:${seconds}`;
  }

  return formattedDate;
};

export const convertDateToDottedName = (date: string) => {
  if(!date) return ""
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

export function convertDateToDottedNameV2(dateString: string) {
  if (dateString) {
    var parts = dateString.split(" ");
    var day =
      parts[0].length === 3 ? "0" + parts[0].charAt(0) : parts[0].slice(0, 2);
    var month = parts[1];
    var year = parts[2];
    var months: any = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };
    month = months[month];
    return day + "." + month + "." + year;
  }
  return "";
}

export function convertDateToName(timestamp: any) {
  // old code
  /* return new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(timestamp); */

  const option = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  } as const;

  return new Intl.DateTimeFormat("en-UK", option as any).format(timestamp);
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
    const trimString = currency.toString().replace(/[^0-9.-]+/g, "");
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
  return arr && Array.isArray(arr) ? true : false;
};

export const fieldHasValue = (value: any) => {
  if (value !== null && value !== undefined) {
    if (value === 0) {
      return value;
    }
    if (value !== "null") {
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

export const calculatePercentage = (min: number, max: number) => {
  if (min < 0 || max < 0) {
    // Handle negative numbers if necessary
    return null;
  }
  if (min > max) {
    // Swap min and max if necessary
    [min, max] = [max, min];
  }
  // Calculate the percentage
  const percentage = (min / max) * 100;
  // Convert to floating-point number (divide by 100)
  const percentageAsFloat = percentage / 100;
  return percentageAsFloat;
};

export const formattedDateForQuery = (
  paramDate: string | null | number,
  type: string
): string => {
  const formattedDefaultDate =
    type === "dateTo" ? dateFns.format(new Date(), "yyyy-MM-dd") : "2022-01-01";
  const formattedDate = paramDate
    ? dateFns.format(new Date(paramDate), "yyyy-MM-dd")
    : formattedDefaultDate;
  return formattedDate;
};

export const dateFunctions = () => {
  const today = new Date();
  const firstDateOfMonth = format(today, "yyyy-MM-01");
  const previousMonth = format(subMonths(firstDateOfMonth, 1), "LLLL");
  const previousMonthCompleteDate = format(
    subMonths(firstDateOfMonth, 1),
    "yyyy-MM-dd"
  );
  const lastDateOfPrevMonth = format(
    lastDayOfMonth(previousMonthCompleteDate),
    "yyyy-MM-dd"
  );
  const currentDay = format(today, "yyyy-MM-dd");
  const previousMonthFirstDay = format(
    subMonths(firstDateOfMonth, 1),
    "yyyy-MM-dd"
  );
  const currentYear = format(today, "yyyy");
  const dateIsEqual = isEqual(firstDateOfMonth, currentDay);
  // returns boolean
  return {
    dateIsEqual,
    previousMonth,
    currentYear,
    previousMonthFirstDay,
    lastDateOfPrevMonth,
  };
};

export const dateFunctionsWithParams = ({
  dateParamPrevMonth,
}: {
  dateParamPrevMonth: any;
}) => {
  if (!dateParamPrevMonth) return null;
  const dateParam = new Date(dateParamPrevMonth);
  // Get the first day of the current month as a Date object
  const firstDayOfMonth = startOfMonth(dateParam);

  // Subtract one month from the first day of the current month
  const previousMonthDate = subMonths(firstDayOfMonth, 1);

  // Get the last day of the previous month as a Date object
  const lastDateOfPrevMonthDate = lastDayOfMonth(previousMonthDate);

  const previousMonthCompleteDate = format(previousMonthDate, "yyyy-MM-dd");

  const lastDateOfPrevMonth = format(lastDateOfPrevMonthDate, "yyyy-MM-dd");

  return { previousMonthCompleteDate, lastDateOfPrevMonth };
};

export const stripPemFormatting = (pem: any) => {
  return pem
    .replace(/-----BEGIN [\s\S]+?-----/, "")
    .replace(/-----END [\s\S]+?-----/, "")
    .replace(/\r?\n|\r/g, ""); // Remove all newlines
};

export const strippedHTMLTag = (param: string | null): string => {
  if (!param) return "";
  return param.replace(/(<([^>]+)>)/gi, "");
};
