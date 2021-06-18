# SWR Internal State
This package provides 2 hooks that can be used to manage react (or Next.js) project's internal state in ways: in memory state, and local storage persistent state.

This package is based on [swr](https://swr.vercel.app/) as they have built a very good caching method that can be generalized and used with different use cases other than fetching and caching data from an external service. Like managing internal app state and syncing that state between different components.

The 2 hooks that we expose are:
- `useGlobalState`: used for managing and syncing in-memory state.
- `useLocalStorage`: used for managing and syncing local storage persistent state.

## When to Use
This package was made with the intention to be used to manage the internal states of projects that rely heavily on external services and has simple internal states. So -for small/simple states- it can be a convenient replacement for `Redux`, `PullState`, and even React's `Context` API.

## Installation
With npm...
```bash
npm i @zyda/swr-internal-state
```

Or with yarn...
```bash
yarn add @zyda/swr-internal-state
```

## How it works
The 2 used hooks accept similar parameters and have similar return types. Each of them accept a key and a default value. And both of them return an array of the state and its management functions (the exact interface of the hooks is explained below).

These 2 hooks are intended to be used as a building block for other custom hooks that are used to encapsulate the whole state.
I.e. If you want to save a state that contains user info, you should create a custom hook `useUserInfo` that looks like the following...
```tsx
const useUserInfo= () => useGlobalState<UserInfo>('user-info', { name: '', age: null });

// And in your components...
const UserName = () => {
  const [userInfo, setUserInfo] = useUserInfo();
  return <span>{userInfo.name}</span>;
}

const UpdateUser = () => {
  const [userInfo, setUserInfo] = useUserInfo();

  const updateUser = () => {
    const userName = /* some logic */;
    const userAge = /* some logic */;
    setUserInfo({ name: userName, age: userAge });
  }

  // Component logic...

  return (
    <div>
      {/* Some UI */}
      <button onClick={updateUser}>Update User</button>
    </div>
  );
}

```
When you use `setUserInfo` it updates `userInfo` state in all the components that use it as if it was raised to their parent and shared from it (but that's not how SWR manage their state).

## Hooks Interface

### In-memory Hook
```ts
useGlobalState<T>(key: string, defaultValue: T): [T, setValue: (T) => void]
```

This hook is used to manage and sync in-memory state between different components. The saved state is not persisted and will be reset with page refresh.

Parameters:
- `key` (required): a unique key to the state that you want to manage. Used to differentiate states from each other (for example: to tell the difference between `user-info` and `user-cart` states)
- `defaultValue` (optional, defaults to `null`): The initial value of that state.

Return values:
The hook returns an array that contains 2 values:
1. The state: what ever you decide to save into that state. Initially it's value equals `defaultValue`.
1. `setState` function: A function that accepts 1 parameter: the new state.

### Local Storage Persistent State
```ts
useLocalStorage<T>(key: string, defaultValue: T): [T, setValue: (T) => void, removeValue: () => void]
```

This hook is used to manage and sync persisted state between different components. The saved state will be saved to the local storage and it will survive refreshing the page and closing the browser.

Parameters:
- `key` (required): a unique key to the state that you want to manage. Used to differentiate states from each other (for example: to tell the difference between `user-info` and `user-cart` states)
- `defaultValue` (optional, defaults to `value stored in locale storage if exisits or null`): The initial value of that state.

Return values:
1. The state: what ever you decide to save into that state. Initially it's value equals `defaultValue`.
1. `setState` function: A function that accepts 1 parameter: the new state.
1. `removeValue` function: A function that does not accept any value. Used to clear the local storage from the saved state and sets the state to `defaultValue`.
