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