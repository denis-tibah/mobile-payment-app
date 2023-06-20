import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import { AccountDetails } from "../../models/UserData";

export interface AccountState {
  data: any[];
  details?: AccountDetails;
  loading: boolean;
  error: boolean;
  errorMessage?: string;
}

const initialState: AccountState = {
  data: [],
  details: undefined,
  loading: true,
  error: false,
  errorMessage: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get accounts
    builder.addCase(getAccounts.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAccounts.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    // get account details
    builder.addCase(getAccountDetails.fulfilled, (state, action) => {
      state.details = action.payload?.data;
      state.loading = false;
    });
    builder.addCase(getAccountDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const getAccounts = createAsyncThunk("getAccounts", async () => {
  const { data } = await api.get("/accountsfinxp");
  return data;
});

export const getAccountDetails = createAsyncThunk(
  "getAccountDetails",
  async (accountId: number) => {
    try {
      const { data }: { data: { data: AccountDetails } } = await api.get(
        `/accountdetailsfinxp/${accountId}`
      );
      return data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export default accountSlice.reducer;
