import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import { UserData } from "../../models/UserData";
import { getIpAddress } from "../../utils/getIpAddress";

export const SIGNIN_SUCCESS_MESSAGES = {
  EXPIRED: 'Your password is Expired. Please update.',
  SUCCESS: 'Logged in successfully',
}
export interface AuthState {
  data?: any;
  isAuthenticated: boolean;
  resetPasswordToken?: string;
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  example: boolean;
  userData?: UserData;
}

const initialState: AuthState = {
  data: undefined,
  isAuthenticated: false,
  resetPasswordToken: undefined,
  loading: true,
  error: false,
  example: false,
  errorMessage: undefined,
  userData: undefined,
};

export const refreshUserData = createAsyncThunk(
  "refreshUserData",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/accountsfinxp");
      if (data.length) return fulfillWithValue(data[0]);
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

export const signin = createAsyncThunk(
  "signin",
  async ({ values /* , ip */ }: any, { rejectWithValue, fulfillWithValue }) => {
    try {
      /* if (ip && Object.keys(ip).length > 0) {
        const { data } = await api.post("/loginfinxpmobile", {
          ...values,
          ipAddress: ip,
          browserfingerprint: "react native app",
        });

        const { message } = data;

        if (data.code === 400 && data.message === SIGNIN_SUCCESS_MESSAGES.EXPIRED) {
          return rejectWithValue(SIGNIN_SUCCESS_MESSAGES.EXPIRED);
        }

        if (data.code === 401 || !data)
          return rejectWithValue("Invalid email or password");

        if (data.code !== "200" && data.code !== "201")
          return rejectWithValue(message);
        if (data.code === "200" || data.code === "201" && data.message === SIGNIN_SUCCESS_MESSAGES.EXPIRED) {
          return rejectWithValue(message);
        }
        if (data.code === "200" || data.code === "201")
          return fulfillWithValue(data);
      } else {
        return rejectWithValue("Failed to load ip location");
      } */
      const ipResponse = await getIpAddress().catch((error) => {
        console.log("error getting ip", error);
      });
      console.log("🚀 ~ file: authSlice.ts:68 ~ ipResponse:", ipResponse);
      if (ipResponse && Object.keys(ipResponse).length > 0) {
        const { data } = await api.post("/loginfinxpmobile", {
          ...values,
          ipAddress: ipResponse,
          browserfingerprint: "react native app",
        });

        const { message } = data;

        if (data.code === 401 || !data)
          return rejectWithValue("Invalid email or password");

        if (data.code !== "200" && data.code !== "201")
          return rejectWithValue(message);

        if (data.code === "200" || data.code === "201")
          return fulfillWithValue(data);
      } else {
        return fulfillWithValue("Failed to load ip location");
      }
    } catch (error: any) {
      return rejectWithValue("Something went wrong");
    }
  }
);

export const changePassword = createAsyncThunk(
  "changePassword",
  async (params) => {
    const { data } = await api.put("/updatePasswordfinxp", params);
    return data;
  }
);

export interface ResetPasswordPayloadRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (params: ResetPasswordPayloadRequest) => {
    const { email, password, password_confirmation, token } = params;
    const payloadRequest: ResetPasswordPayloadRequest = {
      email,
      password,
      password_confirmation,
      token,
    } 
    const { data } = await api.post("/resetPasswordfinxp", payloadRequest);
    return data;
  }
);

export const forgottenPassword = createAsyncThunk(
  "forgottenPassword",
  async (params) => {
    const { data } = await api.post("/RequestForgotPasswordfinxp", params);
    return data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth(state) {
      state.data = {};
      state.isAuthenticated = false;
      state.resetPasswordToken = undefined;
      state.userData = undefined;
      state.loading = false;
    },
    signout(state) {
      state.data = {};
      state.isAuthenticated = false;
      state.resetPasswordToken = undefined;
      state.userData = undefined;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signin.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(signin.rejected, (state: any, action: any) => {
      state.error = true;
      state.data = {};
      state.isAuthenticated = false;
      state.userData = {};
      state.errorMessage = action.payload;
      state.loading = false;
    });
    builder.addCase(refreshUserData.rejected, (state: any, action: any) => {
      state.error = true;
      state.loading = false;
      state.data = {};
      state.isAuthenticated = false;
      state.userData = {};
      state.errorMessage = action.payload;
    });
    builder.addCase(refreshUserData.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(changePassword.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(forgottenPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgottenPassword.rejected, (state) => {
      state.error = true;
    });
  },
});

export const { resetAuth } = authSlice.actions;
export const { signout } = authSlice.actions;

export default authSlice.reducer;
