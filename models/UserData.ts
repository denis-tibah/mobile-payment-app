export interface UserData {
  id: number;
  account_number: string;
  bic: string;
  iban: string;
  customer_account_number: string;
  description: string;
  first_name: string;
  is_active?: boolean;
  last_name: string;
  status?: string;
  account_id?: number;
  sort?: string;
  direction?: string;
}

interface AccountInfo {
  id: number;
  uuid: string;
  user_id: number;
  account_number: string;
  description: string;
  iban: string;
  bic: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountDetails {
  currency: string;
  opnbal: string;
  curbal: string;
  avlbal: string;
  info: AccountInfo;
}

