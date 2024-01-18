import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";

const initialState = {
  profile: {
    loading: false,
    error: false,
    errorMessage: "",
    data: {},
  },
  address: {
    loading: false,
    error: false,
    errorMessage: "",
  },
  security: {
    loading: false,
    error: false,
    errorMessage: "",
  },
  notifications: {
    loading: false,
    error: false,
    errorMessage: "",
  },
  help: {
    loading: false,
    error: false,
    errorMessage: "",
  },
  biometric: {
    loading: false,
    error: false,
    errorMessage: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.profile.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state) => {
      state.profile.loading = false;
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.profile.loading = false;
      state.profile.error = true;
      state.profile.errorMessage = "Error";
    });
    // update address
    builder.addCase(updateAddress.pending, (state) => {
      state.address.loading = true;
    });
    builder.addCase(updateAddress.fulfilled, (state) => {
      state.address.loading = false;
    });
    builder.addCase(updateAddress.rejected, (state) => {
      state.address.loading = false;
      state.address.error = true;
      state.address.errorMessage = "Error";
    });
    // create ticket
    builder.addCase(createTicket.pending, (state) => {
      state.help.loading = true;
    });
    builder.addCase(createTicket.fulfilled, (state) => {
      state.help.loading = false;
    });
    builder.addCase(createTicket.rejected, (state) => {
      state.help.loading = false;
      state.help.error = true;
      state.help.errorMessage = "Error";
    });
    // update notifications
    builder.addCase(updateNotifications.pending, (state) => {
      state.notifications.loading = true;
    });
    builder.addCase(updateNotifications.fulfilled, (state) => {
      state.notifications.loading = false;
    });
    builder.addCase(updateNotifications.rejected, (state) => {
      state.notifications.loading = false;
      state.notifications.error = true;
      state.notifications.errorMessage = "Error";
    });
    // update biometric
    builder.addCase(updateBiometric.pending, (state) => {
      state.biometric.loading = true;
    });
    builder.addCase(updateBiometric.fulfilled, (state) => {
      state.biometric.loading = false;
    });
    builder.addCase(updateBiometric.rejected, (state) => {
      state.biometric.loading = false;
      state.biometric.error = true;
      state.biometric.errorMessage = "Error";
    });

    // udpate security
    builder.addCase(updateSecurity.pending, (state) => {
      state.security.loading = true;
    });
    builder.addCase(updateSecurity.fulfilled, (state) => {
      state.security.loading = false;
    });
    builder.addCase(updateSecurity.rejected, (state) => {
      state.security.loading = false;
      state.security.error = true;
      state.security.errorMessage = "Error";
    });
    // get profile information
    builder.addCase(getProfile.pending, (state) => {
      state.profile.loading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.profile.loading = false;
      state.profile.data = action.payload;
    });
    builder.addCase(getProfile.rejected, (state) => {
      state.profile.loading = false;
      state.profile.error = true;
      state.profile.errorMessage = "Error";
    });
  },
});

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (params) => {
    const { data } = await api.post("/profileUpdatefinxp", params);
    return data;
  }
);

export const updateAddress = createAsyncThunk(
  "updateAddress",
  async (params) => {
    const { data } = await api.post("/profileAddressUpdatefinxp", params);
    return data;
  }
);

export const createTicket = createAsyncThunk(
  "createTicket",
  async (params: any) => {
    const { data } = await api.post("/createticketfinxpfreshdesk", params);
    return data;
  }
);

export const updateNotifications = createAsyncThunk(
  "updateNotifications",
  async (params: { email: string; enableYN: string }) => {
    const { data } = await api.post("/enablenotifications", params);
    return data;
  }
);

export const updateBiometric = createAsyncThunk(
  "updateBiometric",
  async (params: { email: string; enableYN: string }) => {
    const { data } = await api.post("/updateBiometric", params);
    // console.log("****enable biometric *********", data);
    return data;
  }
);

export const updateSecurity = createAsyncThunk(
  "changePassword",
  async (params: any) => {
    try {
      const { data } = await api.post("/updatePasswordfinxp", params);
      return data;
    } catch (error) {
      console.log({ error });
    }
  }
);

export const getProfile = createAsyncThunk("getProfile", async () => {
  const { data } = await api.get("/profilefinxp");
  return data;
});

export const uploadProfileImage = createAsyncThunk(
  "uploadProfileImage",
  async (params: any) => {
    const { data } = await api.post("/uploadprofileimage", params);
    return data;
  }
);

export default profileSlice.reducer;
