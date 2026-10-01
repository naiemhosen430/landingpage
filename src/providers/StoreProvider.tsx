"use client";

import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { hydrateCart, loadCartItems } from "@/store/cartSlice";

function CartHydrator() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateCart(loadCartItems()));
  }, [dispatch]);
  return null;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator />
      {children}
    </Provider>
  );
}
