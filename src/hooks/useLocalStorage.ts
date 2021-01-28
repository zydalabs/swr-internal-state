import useSWR from 'swr';

import { LocalStorageHookResult } from '../types';
import { isServerSide } from '../utils';


/**
 * Gets and sets value to/from local storage.
 *
 * @param key key to get and set value to/from local storage.
 * @param defaultValue default value that is returned incase the key was not found.
 *
 * @returns an array of (the saved value, set value function, and remove value function) in the same order.
 */
const useLocalStorage = <T>(key: string, defaultValue: T|null = null): LocalStorageHookResult<T>  => {
  // Fetches the data from local storage
  const persistentFetcher = (persistentValueKey: string) => {
    let value = defaultValue;

    // If value not found from store, try to fetch it from local storage
    if (!isServerSide()) {
      const localStorageValue = window.localStorage.getItem(persistentValueKey);
      if (localStorageValue != null) { value = JSON.parse(localStorageValue); }
    }

    return value;
  };

  const { data: storedValue = defaultValue, mutate } = useSWR(
    key, 
    persistentFetcher, 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  // ========== Set value ==========
  const setValue = (value: T): void => {
    mutate(value, false);

    if (isServerSide()) { return; }

    // Save to local storage
    const localStorageValue = JSON.stringify(value);
    window.localStorage.setItem(key, localStorageValue);
  };

  // ========== Remove value ==========
  const removeValue = (): void => {
    mutate(defaultValue, false);

    if (isServerSide()) { return; }

    // Remove value from local storage
    window.localStorage.removeItem(key);
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
