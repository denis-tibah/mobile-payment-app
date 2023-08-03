import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

const initialState = {
  data: [],
  initiatePaymentData: {},
  loading: true,
  error: false,
  errorMessage: undefined,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setInitiatePaymentData(state, action) {
      state.initiatePaymentData = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const initiatePayment = createAsyncThunk(
  "initiatePayment",
  async (params: any) => {
    // console.log("*************initial params", params);
    const { data } = await api.post("/initiatepaymentfinxp", params);
    return data;
  }
);

export const sendSmsPaymentVerification = createAsyncThunk(
  "sendSmsPaymentVerification",
  async (params: any) => {
    try {
      const { data } = await api.post("/otprequestfinxp", params);
      return data;
    } catch (e) {
      console.log({ sendSmsPaymentVerificationError: e });
    }
  }
);

export const processPayment = createAsyncThunk(
  "processPayment",
  async (params: any) => {
    try {
      // console.log("*************process params", params);

      const data = await api.post("/processpaymentfinxp", params);
      return data.data;
    } catch (e) {
      console.log({ processPaymentError: e });
    }
  }
);

export const { setInitiatePaymentData } = paymentSlice.actions;

export default paymentSlice.reducer;
