import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

const initialState = {
  data: [],
  loading: true,
  error: false,
  errorMessage: undefined,
};

export const beneficiarySlice = createSlice({
  name: "beneficiary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all beneficiaries
    builder.addCase(getAllBeneficiary.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getAllBeneficiary.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // add new beneficiary
    builder.addCase(addNewBeneficiary.fulfilled, (state: any, action: any) => {
      if (action.payload.data) {
        state.data = [action.payload.data, ...state.data];
      }
      state.loading = false;
    });
    builder.addCase(addNewBeneficiary.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // delete new beneficiary
    builder.addCase(deleteBeneficiary.fulfilled, (state: any, action: any) => {
      state.loading = false;
      state.data = state.data.filter((b: any) => b.uuid !== action.meta.arg);
    });
    builder.addCase(deleteBeneficiary.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const getAllBeneficiary = createAsyncThunk(
  "getAllBeneficiary",
  async () => {
    const { data } = await api.get("/getBeneficiaryfinxp");
    return data;
  }
);

export const addNewBeneficiary = createAsyncThunk(
  "addNewBeneficiary",
  async (params: any) => {
    const { data } = await api.post("/createbeneficiaryfinxp", params);
    return data;
  }
);

export const deleteBeneficiary = createAsyncThunk(
  "deleteBeneficiary",
  async (uuid: any) => {
      const { data } = await api.delete(`/deleteBeneficiaryfinxp/${uuid}`);
      return data; 
   
  }
);

export default beneficiarySlice.reducer;
