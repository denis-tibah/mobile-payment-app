export function formatDateTableValue(date = "") {
  return date.split("-").reverse().join("-");
}

export function formatAmountTableValue(amount: any = "", currency = "") {
  if (!amount || !currency) return;
  // if (!amount.split(".")[1]) return
  
  // console.log('***amount****',amount);

  // if the amount is a whole number, for example, "+10"
  if (!amount.split(".")[1]) {
    if (amount > 0) {
      // console.log('Whole number amount.slice(1)',amount)
      // return `${amount.slice(1)}`;
      return `${amount}`;
    } else {
      // console.log('Whole number amount.slice(0, 1)',amount.slice(0, 1))
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
      // console.log('Decimal number amount.slice(1)0',amount)
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
  return currency === "EUR" ? "€" : "$";
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
};
