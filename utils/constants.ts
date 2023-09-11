export const countries = [
    {label: "Argentina", value: "ARG"},
    {label: "United Kingdom", value: "UK"},
    {label: "Spain", value: "ESP"},
    {label: "Netherlands", value: "NLD"}
]

// export enum TRANSACTIONS_STATUS {
//     PENDING = 'pending'.toUpperCase(),
//     COMPLETED = 'complete'.toUpperCase(),
//     // SUCCESS = 'success'.toUpperCase(),
//     PROCESSING = 'processing'.toUpperCase(),
//     FAILED = 'failed'.toUpperCase()
// }

export enum TRANSACTIONS_STATUS {
    PENDING='PENDING',
    COMPLETED = 'SUCCESS',
    PROCESSING='PROCESSING',
    FAILED='FAILED'
}