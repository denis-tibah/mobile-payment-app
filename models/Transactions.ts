export interface Transaction {
  amount: string;
  balance: string | null;
  bic: string;
  closing_balance: string | null;
  running_balance: string | null;
  currency: string;
  description: string;
  iban: string;
  id: number;
  name: string;
  opening_balance: string | null;
  reference_no: string | null;
  service: any;
  status: string;
  transaction_datetime: string;
  transaction_id: number;
  transaction_uuid: string;
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
