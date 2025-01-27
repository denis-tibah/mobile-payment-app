export interface Transaction {
  amount: string;
  balance: string | null;
  bic: string;
  closing_balance: string | null;
  running_balance: string | null;
  currency: string;
  transaction_direction:string;
  description: string;
  iban: string;
  id: number | string | null;
  name: string;
  debtor_name:string;
  opening_balance: string | null;
  reference_no: string | null;
  service: any;
  status: string;
  transaction_datetime: string | number;
  transaction_datetime_with_hour: string | number;
  transaction_id: number;
  transaction_uuid: string;
  isCardTx: boolean;
  total_amount?: string;
  trn_type: string;
  dr_iban: string;
  cr_iban: string;
  transfer_currency: string;
  revenueType: string;
  charges: string;
  exchange_rate: string;
  original_amount?: string;
  original_currency?: string;
  masked_number?: string;
  receiptDate?: string;
  purposeDetailed?: string;
}

export interface transactions {
  amount: string;
  balance: string | null;
  bic: string;
  closing_balance: string | null;
  running_balance: string | null;
  currency: string;
  transaction_direction:string;
  description: string;
  iban: string;
  id: number;
  name: string;
  debtor_name:string;
  opening_balance: string | null;
  reference_no: string | null;
  service: any;
  status: string;
  transaction_datetime: string;
  transaction_id: number;
  transaction_uuid: string;
  isCardTx: boolean;
  total_amount?: string;
  trn_type: string;
  dr_iban: string;
  cr_iban: string;
  transfer_currency: string;
}

export interface CardTransaction {
  id: string;
  dsName: string;
  userId: string;
  cardId: string;
  authCardId: string;
  receiptDate: number;
  confirmDate: null;
  amount: number;
  purpose: string;
  transactionType: null;
  billedFees: any[];
  revenueType: string;
  responseCode: number;
  responseText: null;
  ruleSetErrors: null;
  terminalId: string;
  approvalCode: string;
  cardholderAmount: number;
  processingCode: null;
  processingAllMessagesId: number;
  declineReasons: null;
  transactionAmount: number;
  transactionCurrency: string;
  ezb: number;
  mastercardActual: number;
  paymentType: string;
  walletId: null;
  balanceAlreadyChanged: boolean;
  instantCreditRejectedReason: null;
  merchantCategoryCode: number;
  moneysend: boolean;
  credit: boolean;
  purposeSimple: string;
  sumBilledFees: number;
  purposeDetailed: string;
  billedFeesNotZero: any[];
}

/**
 * @deprecated Use `TransactionDetailsNew` instead.
 */
export interface TransactionDetails {
  current_page: number;
  transactions: Transaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  links: Link[];
}
export interface TransactionDetailsNew {
  current_page: number;
  from: number;
  to: number;
  next_page: number;
  prev_page: number;
  total: number;
  last_page: number;
  per_page: number;
  transactions: Transaction[];
}

interface Link {
  url: string | null;
  label: string;
  active: boolean;
}
