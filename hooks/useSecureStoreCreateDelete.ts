import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const useSecureStoreCreateDelete = () => {
  const [error, setError] = useState(null);
  const [storageData, setStorageData] = useState<any>({});

  const saveStorageData = async (key: string, value: any) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error: any) {
      setError(error);
    }
  };

  /* const getStorageData = async (key: string) => {
    try {
      const promiseStoredData = await SecureStore.getItemAsync(key);
      const storedData = promiseStoredData
        ? JSON.parse(promiseStoredData)
        : null;
      setStorageData((prevState: any) => {
        if (storedData) {
          return { ...storedData };
        }
        return prevState;
      });
    } catch (error: any) {
      setError(error);
      return null;
    }
  }; */

  const getStorageData = async (key: string) => {
    try {
      const promiseStoredData = await SecureStore.getItemAsync(key);
      const storedData = promiseStoredData
        ? JSON.parse(promiseStoredData)
        : null;
      setStorageData((prevState: any) => ({
        ...prevState,
        [key]: storedData,
      }));
    } catch (error: any) {
      setError(error);
      return null;
    }
  };

  /* const deleteStorageData = async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error: any) {
      setError(error);
    }
  }; */

  const deleteStorageData = async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
      setStorageData((prevState: any) => {
        const newState = { ...prevState };
        delete newState[key];
        return newState;
      });
    } catch (error: any) {
      setError(error);
    }
  };

  return {
    error,
    saveStorageData,
    storageData,
    getStorageData,
    deleteStorageData,
  };
};

export default useSecureStoreCreateDelete;
