import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

export interface LimitsData {
  id: string;
  type: string;
  limit: string;
  limit_reached: number;
}
export interface SettingState {
  limits: LimitsData[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;
}

export interface UpdateLimitsRequest {
  type: string;
  limit: string;
  account_id: string;
}

export interface DefaultResponse {
  code: number;
  message: string;
  data: any;
  status: string;
}

const initialState: SettingState = {
  limits: [],
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
      state.limits = action.payload;
      state.loading = false;
    });
    builder.addCase(getLimits.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    // update limits
    builder.addCase(updateLimits.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateLimits.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const getLimits = createAsyncThunk<LimitsData[],{account_id: number}>(
  "getLimits",
  async (params: { account_id: number }): Promise<LimitsData[]> => {
    const { data } = await api.post("/getlimitsfinxp", params);
    return data;
  }
);

export const updateLimits = createAsyncThunk<DefaultResponse,UpdateLimitsRequest[]>(
  "updateLimits",
  async (params: UpdateLimitsRequest[]): Promise<DefaultResponse> => {
    try {
      const { data } = await api.put("/updatelimitsfinxp", params);
      return data;
    } catch (e) {
      console.log({ updateLimitsError: e });
      throw e;
    }
  }
);

export default settingSlice.reducer;
