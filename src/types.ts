
export type SetValue<T> = (value: T) => void;
export type RemoveValue = () => void;
export type LocalStorageHookResult<T> = [T|null, SetValue<T>, RemoveValue];

export type GlobalStateHookResult<T> = [T|null, SetValue<T>];
