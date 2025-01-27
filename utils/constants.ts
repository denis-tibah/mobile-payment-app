import ATMWithdraw from "../assets/icons/ATMWithdraw";
import ChipPinTransaction from "../assets/icons/ChipPinTransaction";
import ContactlessTransaction from "../assets/icons/ContactlessTransaction";
import Globe from "../assets/icons/Globe";
import CardIcon from "../assets/icons/Card";
import { MobileWalletIcon } from "../assets/icons/MobileWallets/MobileWallets";
import vars from "../styles/vars";

export const countries = [
    {label: "Argentina", value: "ARG"},
    {label: "United Kingdom", value: "UK"},
    {label: "Spain", value: "ESP"},
    {label: "Netherlands", value: "NLD"}
]

export enum TRANSACTIONS_STATUS {
    //enabled by aristos 09-04-2024
    PENDING='PENDING',
    SUCCESS = 'SUCCESS',
    PROCESSING = 'PROCESSING',
    //finxp did a change whic requires chanegs on ourside
    //CANCELLED='CANCELED',
    //REJECTED = 'FAILED'
    CANCEL='CANCEL',
    REJECT = 'FAILED',
    RECALL= "REFUND"



}

export const transactionStatusOptions = [
    {label: "Success", value: TRANSACTIONS_STATUS.SUCCESS, color: 'light-green', colorActive: 'heavy-green'},
      //disabled by Aristos 09-04-2024
    // {label: "Processing", value: TRANSACTIONS_STATUS.PROCESSING, color: 'light-blue', colorActive: 'accent-blue'},
      //added by Aristos 09-04-2024
    {label: "Pending", value: TRANSACTIONS_STATUS.PENDING, color: 'light-blue', colorActive: 'accent-blue'},
    // {label: "Cancelled", value: TRANSACTIONS_STATUS.CANCELLED, color: 'light-yellow', colorActive: 'heavy-yellow'},
    // {label: "Failed", value: TRANSACTIONS_STATUS.REJECTED, color: 'light-red', colorActive: 'heavy-red'},
    {label: "Cancelled", value: TRANSACTIONS_STATUS.CANCEL, color: 'light-yellow', colorActive: 'heavy-yellow'},
    {label: "Failed", value: TRANSACTIONS_STATUS.REJECT, color: 'light-red', colorActive: 'heavy-red'},
    {label: "Refund", value: TRANSACTIONS_STATUS.RECALL, color: 'light-yellow', colorActive: 'heavy-yellow'}

]

export const managePaymentMethods = [
    // { label: "ATM Withdrawals", value: "atm_withdrawals",
    // icon: ATMWithdraw({size: 18, color: vars['accent-blue']}) },
    { label: "Online Payment", value: "online_payment",
    icon: Globe({size: 18, color: vars['accent-blue']}) },
    // { label: "Chip & PIN Transactions", value: "chip_pin_transactions",
    // icon: ChipPinTransaction({size: 18, color: vars['accent-blue']}) },
    // { label: "Mobile Wallets", value: "mobile_wallets",
    // icon: MobileWalletIcon({size: 18, color: vars['accent-blue']}) },
    // { label: "Contactless Transactions", value: "contactless_transactions",
    // icon: ContactlessTransaction({size: 18, color: vars['accent-blue']}) },
    // { label: "Magnetic Stripe Transactions", value: "magnetic_stripe_transactions",
    // icon: CardIcon({size: 18, color: 'blue'}) },
];
export const searchOptions = [
    // { label: "BIC", value: 'bic' },
    // { label: "ReferenceNo", value: 'reference_no' },
    // { label: "IBAN", value: 'iban' },
    { label: "Minimum amount", value: "min_amount" },
    { label: "Maximum amount", value: "max_amount" },
    { label: "Status", value: "status" },
];

export const CardStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

export const STATEMENT_TRANSACTION_FIELDS = {
  transaction_ref_no: "Reference",
  transaction_date: "Date(UTC)",
  closing_balance: "Money out",
  opening_balance: "Money In",
  balance: "Balance",
  description: "description",
};