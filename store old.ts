import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./redux/auth/authSlice";
import accountSlice from "./redux/account/accountSlice";
import transactionSlice from "./redux/transaction/transactionSlice";
import settingSlice from "./redux/setting/settingSlice";
import beneficiarySlice from "./redux/beneficiary/beneficiarySlice";
import registrationSlice from "./redux/registration/registrationSlice";
import profileSlice from "./redux/profile/profileSlice";
import searchSlice from "./redux/search/searchSlice";
import paymentSlice from "./redux/payment/paymentSlice";
import cardSlice from "./redux/card/cardSlice";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const reducers = combineReducers({
  auth: authSlice,
  account: accountSlice,
  transaction: transactionSlice,
  setting: settingSlice,
  beneficiary: beneficiarySlice,
  profile: profileSlice,
  registration: registrationSlice,
  search: searchSlice,
  payment: paymentSlice,
  card: cardSlice,
});

const rootReducer = (state:any, action:any) => {
  if (action.type === "auth/signout") {
    localStorage.removeItem("persist:root");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token_ziyl");
    localStorage.removeItem("token_receive_mobile_notifications");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    state = {};
  }
  return reducers(state, action);
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["account"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    auth: authSlice,
    account: accountSlice,
    transaction: transactionSlice,
    setting: settingSlice,
    beneficiary: beneficiarySlice,
    profile: profileSlice,
    registration: registrationSlice,
    search: searchSlice,
    payment: paymentSlice,
    card: cardSlice,
  },
  // devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export const setupStore = (preloadedState:any) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};
