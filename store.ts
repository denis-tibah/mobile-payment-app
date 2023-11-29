import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice, { AuthState } from "./redux/auth/authSlice";
import accountSlice from "./redux/account/accountSlice";
import transactionSlice, {
  TransactionState,
} from "./redux/transaction/transactionSlice";
import settingSlice, { SettingState } from "./redux/setting/settingSlice";
import beneficiarySlice from "./redux/beneficiary/beneficiarySlice";
import registrationSlice from "./redux/registration/registrationSlice";
import profileSlice from "./redux/profile/profileSlice";
import searchSlice from "./redux/search/searchSlice";
import paymentSlice from "./redux/payment/paymentSlice";
import cardSlice, { CardState } from "./redux/card/cardSlice";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
import { accountV2 } from "./redux/account/accountSliceV2";
import { authV2 } from "./redux/auth/authSliceV2";

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
  [accountV2.reducerPath]: accountV2.reducer,
  [authV2.reducerPath]: authV2.reducer,
});

export interface RootState {
  auth: AuthState;
  account: any;
  transaction: TransactionState;
  setting: SettingState;
  beneficiary: any;
  profile: any;
  registration: any;
  search: any;
  payment: any;
  card: CardState;
  accountV2: any;
  authV2: any;
}

const rootReducer = (state: RootState | undefined, action: any) => {
  if (action.type === "auth/signout") {
    AsyncStorage.removeItem("persist:root");
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("token_ziyl");
    AsyncStorage.removeItem("token_receive_mobile_notifications");
    AsyncStorage.removeItem("token_type");
    AsyncStorage.removeItem("expires_in");
    state = undefined;
  }
  return reducers(state, action);
};

const persistConfig: any = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["account"],
  serialize: (data: any) =>
    JSON.stringify(data, (_, value) =>
      typeof value === "function" ? undefined : value
    ),
  deserialize: (serializedData: any) => JSON.parse(serializedData),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }).concat(thunk, accountV2.middleware, authV2.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootStateStore = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}r
export type AppDispatch = typeof store.dispatch;
