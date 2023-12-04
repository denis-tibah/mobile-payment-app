import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";
import { Transaction, TransactionDetailsNew } from "../../models/Transactions";
// import { UserData, SearchFilter } from "../../models/UserData";

const defaultTransactionsDetails: TransactionDetailsNew = {
  current_page: 0,
  from: 0,
  to: 0,
  next_page: 0,
  prev_page: 0,
  total: 0,
  last_page: 0,
  per_page: 0,
  transactions: [],
};
const defaultStatementDetails: StatementResponse = {
  statements: [],
};

export interface TransactionState {
  data: TransactionDetailsNew;
  search: Transaction[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  statements: StatementResponse;
}

const initialState: TransactionState = {
  data: defaultTransactionsDetails,
  search: [],
  loading: true,
  error: false,
  errorMessage: undefined,
  statements: defaultStatementDetails,
};

export interface SearchFilter {
  account_id: string | undefined;
  sort?: string;
  name?: string;
  from_date?: string;
  to_date?: string;
  direction?: string;
  limit?: number;
  page?: number;
  min_amount?: number;
  max_amount?: number;
  status?: string;
  iban?: string;
  reference_no?: number;
  bic?: string;
}

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get transactions
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      // line 63 - line 70 is not needed anymore must be removed
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getTransactions.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(getTransactionsWithFilters.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getTransactionsWithFilters.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(getStatementsfinxp.fulfilled, (state, action) => {
      state.statements = action.payload;
      state.loading = false;
    });
    builder.addCase(getStatementsfinxp.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(clearTransactions.fulfilled, (state) => {
      state.data = defaultTransactionsDetails;
      state.loading = false;
    });
  },
});

// export const getTransactions = createAsyncThunk<Transaction[], UserData>(
//   "getTransactions",
//   async (userData, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.post("/getTransactionsV2finxp", {
//         account_id: userData.id,
//       });
//       return fulfillWithValue(data);
//     } catch (error) {
//       rejectWithValue(error);
//     }
//   }
// );
export const getTransactions = createAsyncThunk<
  TransactionDetailsNew,
  SearchFilter
>(
  "getTransactions",
  async (searchFilter, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/getTransactionsV2finxp", {
        account_id: searchFilter.account_id,
        sort: searchFilter.sort,
        direction: searchFilter.direction,
        status: searchFilter.status,
        limit: 20,
      });
      return fulfillWithValue(data);
    } catch (error) {
      // console.log("error aristos ", error);
      rejectWithValue(error);
    }
  }
);

export const getTransactionsWithFilters = createAsyncThunk<
  TransactionDetailsNew,
  SearchFilter
>(
  "getTransactionsWithfilters",
  async (searchFilter, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/getTransactionsV2finxp", {
        // searchFilter,
        sort: searchFilter?.sort,
        direction: searchFilter?.direction,
        limit: searchFilter.limit,
        page: searchFilter?.page,
        iban: searchFilter?.iban,
        name: searchFilter?.name,
        min_amount: searchFilter?.min_amount,
        max_amount: searchFilter?.max_amount,
        status: searchFilter?.status,
        reference_no: searchFilter?.reference_no,
        bic: searchFilter?.bic,
        from_date: searchFilter?.from_date,
        to_date: searchFilter?.to_date,
        account_id: searchFilter.account_id,
      });
      return fulfillWithValue(data);
    } catch (error) {
      // console.log("error with transaction search",error);
      rejectWithValue(error);
    }
  }
);

export interface StatementFilter {
  account_id: number;
  to_date: string;
  from_date: string;
}
export interface StatementTransactionsResponse {
  transaction_ref_no: "string";
  transfer_currency: "string";
  debit: "float";
  credit: "integer";
  opening_balance: "integer";
  closing_balance: "float";
  balance: "integer";
  sender_receiver: "string";
  description: "string";
  transaction_date: "date";
}

export interface StatementResponse {
  statements: StatementTransactionsResponse[];
}

export const getStatementsfinxp = createAsyncThunk<
  StatementResponse,
  StatementFilter
>(
  "getStatementsfinxp",
  async (params, { rejectWithValue, fulfillWithValue }) => {
    console.log("redux", params);
    try {
      const { data } = await api.post("/getStatementfinxp", params);
      return fulfillWithValue(data);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const clearTransactions = createAsyncThunk(
  "clearTransactions",
  async () => {
    return initialState;
  }
);

export default transactionSlice.reducer;
