export type Transaction = {
  amount: string;
  bic: string;
  currency: string;
  description: string;
  iban: string;
  id: number;
  name: number;
  reference_no: string;
  running_balance: string;
  service: string | null;
  status: string;
  transaction_datetime: string;
  transaction_id: number;
  transaction_uuid: string;
  closing_balance?: string | number;
  balance?: string | null;
  opening_balance?: string | number;
  isCardTx?: boolean;
  original_amount?: string;
  original_currency?: string;
};
