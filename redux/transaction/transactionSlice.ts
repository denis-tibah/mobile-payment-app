import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";
import { Transaction } from "../../models/Transactions";
import { UserData,SearchFilter } from "../../models/UserData";


export interface TransactionState {
  data: Transaction[];
  search: Transaction[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;
}

const initialState: TransactionState = {
  data: [],
  search: [],
  loading: true,
  error: false,
  errorMessage: undefined,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get transactions
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.data = action.payload;

      //do no need sorting anymore
      // state.data = action.payload?.sort(
      //   (a, b) =>
      //     new Date(b.transaction_datetime).getTime() -
      //     new Date(a.transaction_datetime).getTime()
      // );

      state.loading = false;
    });


    builder.addCase(getTransactions.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });

    builder.addCase(getTransactionsWithFilters.fulfilled, (state, action) => {
      state.data = action.payload;

      //do no need sorting anymore
      // state.search = action.payload?.sort(
      //   (a, b) =>
      //     new Date(b.transaction_datetime).getTime() -
      //     new Date(a.transaction_datetime).getTime()
      // );
      state.loading = false;
    });
    builder.addCase(getTransactionsWithFilters.rejected, (state) => {
      state.loading = false;
      state.error = true;
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
export const getTransactions = createAsyncThunk<Transaction[], SearchFilter>(
  "getTransactions",
  async (searchFilter, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/getTransactionsV2finxp", {
        account_id: searchFilter.account_id,
        sort:       searchFilter.sort,
        direction:  searchFilter.direction,
        status:     searchFilter.status

      });

      // console.log('data ',data);
      return fulfillWithValue(data);
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getTransactionsWithFilters = createAsyncThunk<Transaction[], SearchFilter>(
  "getTransactionsWithfilters",
  async (searchFilter, { rejectWithValue, fulfillWithValue }) => {
    try {
      // console.log("searchFilter",searchFilter);
      const { data } = await api.post("/getTransactionsV2finxp", {
        // searchFilter,
        sort: searchFilter.sort,
        direction: searchFilter.direction,
        limit: searchFilter.limit,
        page: searchFilter.page,
        iban: searchFilter.bic,
        name: searchFilter.name,
        min_amount: searchFilter.min_amount,
        max_amount: searchFilter.max_amount,
        status:   searchFilter.status,
        reference_no: searchFilter.reference_no,
        bic: searchFilter.bic,
        from_date: searchFilter.from_date,
        to_date: searchFilter.to_date,
        account_id: searchFilter.account_id

      });
      // console.log("data",data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log("error with transaction search",error);
      rejectWithValue(error);
    }
  }
);

export default transactionSlice.reducer;
