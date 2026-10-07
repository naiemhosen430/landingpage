"use client";

import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { hydrateCart, loadCartItems } from "@/store/cartSlice";
import GlobalToastHost from "@/components/ui/GlobalToastHost";

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
      <GlobalToastHost />
      {children}
    </Provider>
  );
}
