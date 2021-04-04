import useLocalStorage from "../useLocalStorage";
import MockedLocalStorage from "../__mocks__/mockedLocalStorage";

let mockedMutate = jest.fn();

jest.mock("swr", () => (key, persistentFetcher) => ({ data: persistentFetcher(key), mutate: mockedMutate }));

describe("persistent-storage", () => {
  let mockedLocalStorage: MockedLocalStorage = new MockedLocalStorage();

  beforeAll(() => {
    Object.defineProperty(window, "localStorage", { value: mockedLocalStorage });
  });

  beforeEach(() => {
    mockedLocalStorage.clear();
  });

  it("should set item in local-storage and call mutate in swr", () => {
    const [, setPersistentKey] = useLocalStorage<any>("key");
    setPersistentKey("value");
    expect(mockedLocalStorage.setItem).toBeCalled();
    expect(mockedMutate).toBeCalled();
    expect(mockedLocalStorage.store["key"]).toEqual(JSON.stringify("value"));
  });

  it("should get item from local-storage", () => {
    mockedLocalStorage.store["key"] = JSON.stringify("value");
    const [persistentValue] = useLocalStorage<any>("key");
    expect(mockedLocalStorage.getItem).toBeCalled();
    expect(persistentValue).toEqual("value");
  });

  it("should remove item from local-storage", () => {
    mockedLocalStorage.store["key"] = JSON.stringify("value");
    const [, , removePersistentKeyValue] = useLocalStorage<any>("key");
    removePersistentKeyValue();
    expect(mockedLocalStorage.removeItem).toBeCalled();
    expect(mockedMutate).toBeCalled();
    expect(mockedLocalStorage.store["key"]).toEqual(undefined);
  });
});
