import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  slug?: string;
  thumbnailImage?: { url?: string; secureUrl?: string };
  stock?: number;
  variants?: Array<{
    id?: string;
    name?: string;
    price?: number;
    stock?: number;
  }>;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
  variantId?: string;
};

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: CartProduct;
        quantity?: number;
        variantId?: string;
      }>,
    ) => {
      const { product, quantity = 1, variantId } = action.payload;
      const existing = state.items.find(
        (item) =>
          item.product.id === product.id && item.variantId === variantId,
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity, variantId });
      }
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        quantity: number;
        variantId?: string;
      }>,
    ) => {
      const item = state.items.find(
        (entry) =>
          entry.product.id === action.payload.productId &&
          entry.variantId === action.payload.variantId,
      );
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((entry) => entry !== item);
      } else {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          item.product.id !== action.payload.productId ||
          item.variantId !== action.payload.variantId,
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
