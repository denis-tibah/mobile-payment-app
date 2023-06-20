import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

const initialState = {
  data: {
    daily: {},
    weekly: {},
    monthly: {},
  },
  loading: true,
  error: false,
  errorMessage: undefined,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get limits
    builder.addCase(getLimits.fulfilled, (state, action) => {
      state.data.daily = action.payload.find(
        (limit: any) => limit.type === "daily"
      );
      state.data.weekly = action.payload.find(
        (limit: any) => limit.type === "weekly"
      );
      state.data.monthly = action.payload.find(
        (limit: any) => limit.type === "monthly"
      );
      state.loading = false;
    });
    builder.addCase(getLimits.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const getLimits = createAsyncThunk(
  "getLimits",
  async (params: { account_id: number }) => {
    const { data } = await api.post("/getlimitsfinxp", params);
    return data;
  }
);

export default settingSlice.reducer;
