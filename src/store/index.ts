import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import authReducer from "./authSlice";
import { loadAuthState, saveAuthState } from "./authStorage";
import cartReducer from "./cartSlice";
import { CART_STORAGE_KEY } from "./cartSlice";

const preloadedState = {
  // loadAuthState may return a partial object; cast to any so it can be used safely
  auth: loadAuthState() as any,
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // api.middleware may have incompatible tuple typing in some setups; cast to any
    getDefaultMiddleware().concat(api.middleware as any),
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveAuthState(state.auth);
  if (typeof window !== "undefined" && state.cart.hydrated) {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    } catch {
      // Keep in-memory cart behavior when browser storage is unavailable.
    }
  }
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
