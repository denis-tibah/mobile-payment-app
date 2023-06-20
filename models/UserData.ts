export interface UserData {
  account_number: string;
  bic: string;
  customer_account_number: string;
  description: string;
  first_name: string;
  iban: string;
  id: number;
  is_active: boolean;
  last_name: string;
  status: string;
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

export interface SearchFilter {

    sort: string;
    direction: string;
    limit: number;
    page: number;
    iban: string;
    name: string;
    min_amount: number;
    max_amount: number;
    status:string;
    reference_no: string;
    bic: string;
    from_date: string;
    to_date: string;
    account_id: number;
    
}
