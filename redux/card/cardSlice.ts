import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";
import { CardTransaction } from "../../models/Transactions";

export type CardData = {
  cardreferenceId: string;
  currency: string;
  expiration_date: string;
  frozenYN: "Y" | "N";
  lostYN: "Y" | "N";
  pan: string;
  type: "V" | "P";
};

export interface CardState {
  data: CardData[];
  transactions: CardTransaction[];
  loading: boolean;
  error: boolean;
  primaryCardID?: string;
  errorMessage?: string;
  isCardTransactionShown?: boolean;
}

const initialState: CardState = {
  data: [],
  transactions: [],
  loading: true,
  error: false,
  primaryCardID: undefined,
  errorMessage: undefined,
  isCardTransactionShown: false,
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setPrimaryCardID: (state, action) => {
      state.primaryCardID = action.payload;
    },
    setIsCardTransactionShown: (state, action) => {
      state.isCardTransactionShown = action.payload;
    },
  },
  extraReducers: (builder) => {
    //enroll for card scheme
    builder.addCase(enrollforCardScheme.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(enrollforCardScheme.fulfilled, (state, action) => {
      state = action?.payload?.data;
      //state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(enrollforCardScheme.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });

    // get cards
    builder.addCase(getCards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCards.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getCards.rejected, (state) => {
      state.error = true;
      state.loading = false;
    });

    // freeze card
    builder.addCase(setCardAsFrozen.fulfilled, (state: any, action) => {
      // find the card that has been frozen and replace with the response
      // that is returned from the endpoint
      const cardIndex = state.data.findIndex(
        (card: CardData) =>
          card.cardreferenceId === action.payload[0].cardreferenceId
      );
      state.data[cardIndex].frozenYN = action.payload[0].frozenYN;
    });
    builder.addCase(unfreezeCard.fulfilled, (state: any, action) => {
      // find the card that has been frozen and replace with the response
      // that is returned from the endpoint
      const cardIndex = state.data.findIndex(
        (card: any) =>
          card.cardreferenceId === action.payload[0].cardreferenceId
      );
      state.data[cardIndex].frozenYN = action.payload[0].frozenYN;
    });
    // get card transactions
    builder.addCase(getCardTransactions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCardTransactions.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(getCardTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload.data;
    });
    // terminate card
    builder.addCase(terminateCard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(terminateCard.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(terminateCard.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const enrollforCardScheme = createAsyncThunk(
  "enrollforCardScheme",
  async (params: any) => {
    const data = await api.post("/showcardregistrationfinxpV2", params);
    return data;
  }
);

export const orderCard = createAsyncThunk("orderCard", async (params: any) => {
  const { data } = await api.post("/OrdercardfinxpV2", params);
  return data;
});

export const sendSmsLostCardVerification = createAsyncThunk(
  "sendSmsLostCardVerification",
  async (params) => {
    const { data } = await api.post("/lostcardgetotpfinxp", params);
    return data;
  }
);

export const setCardAsLost = createAsyncThunk("setLostCard", async (params) => {
  const { data } = await api.post("/lostcardfinxp", params);
  return data;
});

export const setCardAsFrozen = createAsyncThunk(
  "setCardAsFrozen",
  async (params: any) => {
    try {
      const { data } = await api.post("/freezecardfinxpV3", params);
      return data;
    } catch (e) {
      console.log("card Freezing Error", e);
    }
  }
);

export const unfreezeCard = createAsyncThunk("unfreezeCard", async (params) => {
  const { data } = await api.post("/freezecardfinxpV3", params);
  return data;
});

export const sendSmsShowPinVerification = createAsyncThunk(
  "sendSmsShowPinVerification",
  async (params) => {
    const { data } = await api.post("/cardotpfinxp", params);
    return data;
  }
);

export const showCardPinNumber = createAsyncThunk(
  "showCardPinNumber",
  async (params: any) => {
    const { data } = await api.post("/showcardpinfinxp", params);
    return data;
  }
);

export const sendSmsShowCardVerification = createAsyncThunk(
  "sendSmsShowCardVerification",
  async (params: any) => {
    try {
      const { data } = await api.post("/cardotpfinxp", params);
      return data;
    } catch (error) {
      console.log({ sendSmsShowCardVerificationError: JSON.stringify(error) });
    }
  }
);

export const showCardDetails = createAsyncThunk(
  "showCardDetails",
  async (params: any) => {
    try {
      const { data } = await api.post("/showcardfinxpV2", params);
      return data;
    } catch (error) {
      console.log({ showCardDetailsError: JSON.stringify(error) });
    }
  }
);

export const getCards = createAsyncThunk("getCards", async () => {
  const { data } = await api.get("/getcardsfinxpV2");
  return data;
});

export const sendSmsOrderCardVerification = createAsyncThunk(
  "sendSmsOrderCardVerification",
  async (params: any) => {
    const { data } = await api.post("/cardotpfinxp", params);
    return data;
  }
);

export const getCardTransactions = createAsyncThunk(
  "getCardTransactions",
  async (params: any) => {
    try {
      const { data } = await api.post("/getCardTransactionsfinxp", params);
      // console.log("card transaction",params);
      // console.log("card transaction response",data);
      return data;
    } catch (error) {
      console.log({ error: JSON.stringify(error) });
    }
  }
);

export const terminateCard = createAsyncThunk(
  "terminateCard",
  async (params: { account_id: number, card_id: number }) => {
    try {
      const { data } = await api.post("/terminatecardfinxpV2", params);
      return data;
    } catch (error) {
      console.log({ error: JSON.stringify(error) });
    }
  }
);

export const { setPrimaryCardID } = cardSlice.actions;
export const { setIsCardTransactionShown } = cardSlice.actions;
export default cardSlice.reducer;
