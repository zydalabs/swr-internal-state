class MockedLocalStorage {
  public store: any;
  constructor() {
    this.store = {};
  }

  public clear = jest.fn().mockImplementation(() => (this.store = {}));

  public getItem = jest.fn().mockImplementation((key) => this.store[key]);

  public setItem = jest.fn().mockImplementation((key, value) => {
    this.store[key] = value;
  });

  public removeItem = jest.fn().mockImplementation((key) => {
    delete this.store[key];
  });
}

export default MockedLocalStorage;
