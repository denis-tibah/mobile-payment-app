import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// staging backend v1
// const baseURL = process.env.APIURL || "https://zazoostg.com/reg/ziyl";
// export const exportedBaseUrl = process.env.APIURL || "https://zazoostg.com/reg/ziyl";

// staging backend v2
//  const baseURL = process.env.APIURL || "https://zazoostg.com/v2/reg/ziyl";
// export const exportedBaseUrl =
//   process.env.APIURL || "https://zazoostg.com/v2/reg/ziyl"; 

// live backend
const baseURL = process.env.APIURL || "https://zazooapi.com/prod/ziyl";
export const exportedBaseUrl =
  process.env.APIURL || "https://zazooapi.com/prod/ziyl";

export const api = axios.create({ baseURL });
let _store: any;
let _signoutAction: any;

export function setApiStore(store: any, signoutAction: any) {
  _store = store;
  _signoutAction = signoutAction;
}

// this will append the headers before the request is sent
// on all requests when the user is authenticated
api.interceptors.request.use(
  (config) => {
    if (_store) {
      const state = JSON.parse(JSON.stringify(_store.getState()));
      config.headers[
        "AuthorizationFinxp"
      ] = `Bearer ${state?.auth?.data?.access_token}`;
      config.headers[
        "Authorization"
      ] = `Bearer ${state?.auth?.data?.token_ziyl}`;
      config.headers[
        "AuthorizationReceiveMobileNotifications"
      ] = `Bearer ${state?.auth?.data?.token_receive_mobile_notifications}`;
    }

    return config;
  },
  (error) => {
    console.log("🚀 ~ file: api.ts:50 ~ error:", error);
    return Promise.reject(error);
  }
);

// // if the response code is 401 axios interceptor will
// // redirect to the login page
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Dispatch an action to sign out the user and clear the store state
        await _store.dispatch(_signoutAction());
      } catch (err) {
        console.log("Error clearing store state: ", err);
      }
      return;
    }
    if (error?.response?.status === 400 || error?.response?.status === 500) {
      return error?.response;
    }
    return Promise.reject(error);
  }
);
