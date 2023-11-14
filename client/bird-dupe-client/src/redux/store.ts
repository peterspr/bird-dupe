import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { initializeAuth } from "./actions/auth.actions";

const createStore = async () => {
  try {
    const store = configureStore({
      reducer: rootReducer,
    });

    await store.dispatch(initializeAuth());

    return store;
  } catch (err: any) {
    throw new Error(`Some error occurred ${err.message}`);
  }
};

export default createStore;