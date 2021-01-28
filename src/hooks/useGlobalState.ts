import useSWR from 'swr';

import { GlobalStateHookResult } from '../types';

/**
 * Gets and sets value to/from global state.
 * 
 * All states with the same key are shared with each other.
 *
 * @param key key to get and set value to/from local storage.
 * @param defaultValue default value that is returned incase the key was not found.
 *
 * @returns an array of (the saved value, set value function) in the same order.
 */
const useGlobalState = <T>(key: string, defaultValue: T|null = null): GlobalStateHookResult<T>  => {
  const { data: state = defaultValue, mutate } = useSWR(
    key, 
    null, 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  const setState = (value: T): void => { mutate(value, false); };

  return [state, setState];
};

export default useGlobalState;
