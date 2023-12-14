import { ATMWithdraw } from "../assets/icons/ATMWithdraw";
import ChipPinTransaction from "../assets/icons/ChipPinTransaction";
import ContactlessTransaction from "../assets/icons/ContactlessTransaction";
import Globe from "../assets/icons/Globe";
import { MobileWalletIcon } from "../assets/icons/MobileWallets/MobileWallets";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import vars from "../styles/vars";
import { Card } from "../assets/icons/Card/Card";

export const countries = [
    {label: "Argentina", value: "ARG"},
    {label: "United Kingdom", value: "UK"},
    {label: "Spain", value: "ESP"},
    {label: "Netherlands", value: "NLD"}
]

export enum TRANSACTIONS_STATUS {
    // PENDING='PENDING',
    SUCCESS = 'SUCCESS',
    PROCESSING = 'PROCESSING',
    CANCELLED='CANCELED',
    REJECTED = 'FAILED'
}

export const transactionStatusOptions = [
    {label: "Success", value: TRANSACTIONS_STATUS.SUCCESS, color: 'light-green', colorActive: 'heavy-green'},
    {label: "Processing", value: TRANSACTIONS_STATUS.PROCESSING, color: 'light-blue', colorActive: 'accent-blue'},
    {label: "Cancelled", value: TRANSACTIONS_STATUS.CANCELLED, color: 'light-yellow', colorActive: 'heavy-yellow'},
    {label: "Failed", value: TRANSACTIONS_STATUS.REJECTED, color: 'light-red', colorActive: 'heavy-red'}
]

export const managePaymentMethods = [
    { label: "ATM Withdrawals", value: "atm_withdrawals",
    icon: ATMWithdraw({size: 18, color: vars['accent-blue']}) },
    { label: "Online Payment", value: "online_payment",
    icon: Globe({size: 18, color: vars['accent-blue']}) },
    { label: "Chip & PIN Transactions", value: "chip_pin_transactions",
    icon: ChipPinTransaction({size: 18, color: vars['accent-blue']}) },
    { label: "Mobile Wallets", value: "mobile_wallets",
    icon: MobileWalletIcon({size: 18, color: vars['accent-blue']}) },
    { label: "Contactless Transactions", value: "contactless_transactions",
    icon: ContactlessTransaction({size: 18, color: vars['accent-blue']}) },
    { label: "Magnetic Stripe Transactions", value: "magnetic_stripe_transactions",
    icon: Card({size: 18, color: vars['accent-blue']}) },
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