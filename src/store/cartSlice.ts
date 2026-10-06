import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartProduct = {
  id: string;
  _id?: string;
  name: string;
  title?: string;
  price: number;
  slug?: string;
  image?: string;
  thumbnailImage?: { url?: string; secureUrl?: string };
  stock?: number;
  variants?: Array<{
    id?: string;
    name?: string;
    price?: number;
    stock?: number;
    isActive?: boolean;
  }>;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
  variantId?: string;
  // Fallbacks for direct flat access from previous components
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  price?: number;
  image?: string;
};

type CartState = { items: CartItem[]; hydrated: boolean };

export const CART_STORAGE_KEY = "storefront-cart";

export function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : null;
    return parsed && Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

const initialState: CartState = { items: [], hydrated: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.hydrated = true;
    },
    addToCart: (
      state,
      action: PayloadAction<
        | CartProduct
        | { product: CartProduct; quantity?: number; variantId?: string }
      >,
    ) => {
      let requestedProduct: CartProduct;
      let quantity = 1;
      let variantId: string | undefined;
      if ("product" in action.payload) {
        requestedProduct = action.payload.product;
        quantity = action.payload.quantity ?? 1;
        variantId = action.payload.variantId;
      } else {
        requestedProduct = action.payload;
      }
      const variant = variantId
        ? requestedProduct.variants?.find((item) => item.id === variantId)
        : undefined;
      const product =
        variant && typeof variant.price === "number"
          ? { ...requestedProduct, price: variant.price }
          : requestedProduct;

      const productId = product.id || product._id || "";

      const existing = state.items.find(
        (item) =>
          (item.product?.id === productId ||
            item.product?._id === productId ||
            item.id === productId) &&
          item.variantId === variantId,
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          variantId,
          // Root fallbacks for UI backward compatibility
          id: productId,
          _id: productId,
          name: product.name || product.title,
          title: product.title || product.name,
          price: product.price,
          image:
            product.image ||
            product.thumbnailImage?.secureUrl ||
            product.thumbnailImage?.url,
        });
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        variantId?: string;
      }>,
    ) => {
      const { id, quantity, variantId } = action.payload;
      const item = state.items.find(
        (entry) =>
          (entry.product?.id === id ||
            entry.product?._id === id ||
            entry.id === id) &&
          entry.variantId === variantId,
      );

      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((entry) => entry !== item);
      } else {
        item.quantity = quantity;
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
      const { productId, quantity, variantId } = action.payload;
      const item = state.items.find(
        (entry) =>
          (entry.product?.id === productId ||
            entry.product?._id === productId ||
            entry.id === productId) &&
          entry.variantId === variantId,
      );

      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter((entry) => entry !== item);
      } else {
        item.quantity = quantity;
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<string | { productId: string; variantId?: string }>,
    ) => {
      const targetId =
        typeof action.payload === "string"
          ? action.payload
          : action.payload.productId;
      const variantId =
        typeof action.payload === "string"
          ? undefined
          : action.payload.variantId;
      const hasVariantId =
        typeof action.payload !== "string" &&
        Object.prototype.hasOwnProperty.call(action.payload, "variantId");

      state.items = state.items.filter((item) => {
        const itemId = item.product?.id || item.product?._id || item.id;
        const matchesId = itemId === targetId;
        const matchesVariant = hasVariantId
          ? item.variantId === variantId
          : true;
        return !(matchesId && matchesVariant);
      });
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Selectors for earlier UI components
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotalPrice = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => {
    const variantPrice = item.variantId
      ? item.product?.variants?.find(
          (variant) => variant.id === item.variantId,
        )?.price
      : undefined;
    const price = variantPrice ?? item.product?.price ?? item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

export const {
  hydrateCart,
  addToCart,
  updateQuantity,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
