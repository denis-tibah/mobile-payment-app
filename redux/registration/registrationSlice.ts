import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api, exportedBaseUrl } from "../../api";

const initialState = {
  data: {},
  registerBusinessData: {},
  sendToMobileSuccess: false,
  sendToEmailSuccess: false,
  loading: true,
  error: false,
  errorMessage: undefined,
  sumsubTokenSuccess: false,
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setRegistrationData(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
    setRegistrationBusinessData(state, action) {
      state.registerBusinessData = {
        ...state.registerBusinessData,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // login credentials
    builder.addCase(setLoginCredentials.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(setLoginCredentials.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // send sms verifications
    builder.addCase(sendSMSVerification.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(sendSMSVerification.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // get subsub verification token
    builder.addCase(getSumsubVerificationCode.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getSumsubVerificationCode.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // send subsub sms to mobile
    builder.addCase(sendSubsubToMobile.fulfilled, (state) => {
      state.loading = true;
      state.sendToMobileSuccess = true;
    });
    builder.addCase(sendSubsubToMobile.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // send sumsub to email
    builder.addCase(sendSubsubToEmail.fulfilled, (state) => {
      state.error = true;
      state.sendToEmailSuccess = true;
    });
    builder.addCase(sendSubsubToEmail.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
    // get sumsub userId
    builder.addCase(getSumsubToken.fulfilled, (state) => {
      state.error = true;
      state.sumsubTokenSuccess = true;
    });
    builder.addCase(getSumsubToken.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });
  },
});

export const setLoginCredentials = createAsyncThunk(
  "loginCredentials",
  async (params) => {
    const { data } = await api.post("/sendactivationemailfinxp", params, {
      responseType: "text",
    });
    return data;
  }
);

export const sendSMSVerification = createAsyncThunk(
  "sendSMSVerification",
  async (params: any) => {
    const { data } = await api.post("/getregistrationotpfinxp", params);
    return data;
  }
);

export const getSumsubVerificationCode = createAsyncThunk(
  "getSumsubVerificationCode",
  async (params: any) => {
    const { data } = await api.post("/registrationfinxpv3", params);
    return data;
  }
);

export const sendSubsubToMobile = createAsyncThunk(
  "sendSubsubToMobile",
  async (params: any) => {
    const { data } = await api.post("/sendsmszazoo", params);
    return data;
  }
);

/* export const sendSubsubToEmail = createAsyncThunk(
  "sendSubsubToEmail",
  async (params: any) => {
    const { data } = await api.post("/sendemailzazoo", params, {
      responseType: "text",
    });
    console.log("🚀 ~ file: registrationSlice.ts:114 ~ data:", data);
    return data;
  }
); */

export const sendSubsubToEmail = createAsyncThunk(
  "sendSubsubToEmail",
  async (params: any) => {
    const { emailPayload, registrationAuthentication } = params;
    const resSubsubToEmail = await axios.post(
      `${exportedBaseUrl}/sendemailzazoo`,
      emailPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${registrationAuthentication}`,
        },
      }
    );
    return resSubsubToEmail;
  }
);

export const getRegistrationStatus = createAsyncThunk(
  "getRegistrationStatus",
  async (params) => {
    const { data } = await api.post("/getregistrationstatusfinxp", params);
    return data;
  }
);

export const registerBusiness = createAsyncThunk(
  "registerBusiness",
  async (params) => {
    const { data } = await api.post("/registrationfbusinessfinxp", params);
    return data;
  }
);

export const getSumsubToken = createAsyncThunk(
  "getSumsubToken",
  async (sumsubUserId: string) => {
    console.log(
      "🚀 ~ file: registrationSlice.ts:167 ~ sumsubUserId:",
      sumsubUserId
    );
    const { data } = await api.get(`/sumsubToken/${sumsubUserId}`);
    console.log("🚀 ~ file: registrationSlice.ts:173 ~ data:", data);
    return data;
  }
);

export const { setRegistrationData, setRegistrationBusinessData } =
  registrationSlice.actions;

export default registrationSlice.reducer;
