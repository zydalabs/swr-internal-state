
export type SetValue<T> = (value: T) => Promise<void>;
export type RemoveValue = () => Promise<void>;
export type LocalStorageHookResult<T> = [T|null, SetValue<T>, RemoveValue];

export type GlobalStateHookResult<T> = [T|null, SetValue<T>];
