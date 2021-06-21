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
  let initialValue = defaultValue;

  if(!isServerSide()) {
    let storedValue = window.localStorage.getItem(key);
    if(storedValue !== null && storedValue !== 'undefined')
      initialValue = JSON.parse(storedValue);
  }

  const { data: value = initialValue, mutate } = useSWR(
    key,
    null,
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

  return [value, setValue, removeValue];
};

export default useLocalStorage;
