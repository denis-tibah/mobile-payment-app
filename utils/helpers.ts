export function formatDateTableValue(date = "") {
  return date.split("-").reverse().join("-");
}

//added by Aristos
export function formatAmountTableValue(amount: any = "", currency = "") {
  if (!amount || !currency) return Number.parseFloat("0").toFixed(2);
  return Number.parseFloat(amount).toFixed(2);
}

export function formatAmountTableValue_old(amount: any = "", currency = "") {
  if (!amount || !currency) return;
  // if (!amount.split(".")[1]) return

  // console.log('***amount****',amount);

  // if the amount is a whole number, for example, "+10"
  if (!amount.split(".")[1]) {
    if (amount > 0) {
      console.log("Positive number amount.slice(1)", amount);
      console.log(
        "Postive Decimal number amount",
        Number.parseFloat(amount).toFixed(2)
      );
      // return `${amount.slice(1)}`;
      return `${amount}`;
    } else {
      console.log(
        "Negative Whole number amount.slice(0, 1)",
        Number.parseFloat(amount).toFixed(2)
      );
      return `${amount.slice(0, 1)} ${amount.slice(1)}`;
    }
  }

  // is the amount is a decimal number, for example, "-0.5"
  if (amount > 0) {
    if (amount.split(".")[1].length > 1) {
      // console.log('Decimal number amount.slice(1)',amount.slice(1))
      // return `${amount.slice(1)}`;
      return `${amount}`;
    } else {
      // console.log('Decimal number amount.slice(1)0',amount);
      // return `${amount.slice(1)}0`;
      return `${amount}`;
    }
  } else {
    if (amount.split(".")[1].length > 1) {
      // console.log('amount.slice(0, 1),amount.slice(1)',amount.slice(0, 1),amount.slice(1))
      return `${amount.slice(0, 1)} ${amount.slice(1)}`;
    } else {
      // console.log('amount.slice(0, 1),amount.slice(1)}0',amount.slice(0, 1),amount.slice(1),'0')
      return `${amount.slice(0, 1)} ${amount.slice(1)}0`;
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

export const prependBase64 = (base64: string) => {
  return `data:image/jpeg;base64,${base64}`;
};

export const getCurrency = (currency = "") => {
  return currency === "EUR" ? "€" : "€";
};

export const screenNames: any = {
  login: "login",
  myaccount: "My Account",
  transactions: "Transactions",
  card: "Card",
  payments: "Payments",
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
};

// export function getPendingAmount(opnbal:any,currentBalance: any) {
export function getPendingAmount(avlbal: any, currentBalance: any) {
  const pendingAmount = Math.abs(currentBalance - avlbal);
  //use toFixed(2) to format nuber to 2 decimal places
  return pendingAmount.toFixed(2) || "0.00";
}

export function getFormattedDate(dateToFormat: any) {
  const date = new Date(dateToFormat); // Create a new Date object with the current date and time

  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
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

export const arrayChecker = (arr: any[]): Boolean => {
  return arr && Array.isArray(arr) && arr.length > 0 ? true : false;
};
