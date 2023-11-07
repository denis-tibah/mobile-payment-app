export const countries = [
    {label: "Argentina", value: "ARG"},
    {label: "United Kingdom", value: "UK"},
    {label: "Spain", value: "ESP"},
    {label: "Netherlands", value: "NLD"}
]

export enum TRANSACTIONS_STATUS {
    // PENDING='PENDING',
    ALL='',
    CANCELED='CANCELED',
    COMPLETED = 'SUCCESS',
    PROCESSING = 'PROCESSING',
    FAILED ='FAILED'
}

export const searchOptions = [
    // { label: "BIC", value: 'bic' },
    // { label: "ReferenceNo", value: 'reference_no' },
    // { label: "IBAN", value: 'iban' },
    { label: "Maximum amount", value: "max_amount" },
    { label: "Status", value: "status" },
];

export const CardStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};