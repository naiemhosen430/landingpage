"use client";

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotalPrice,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/cartSlice";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  currency?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
  currency,
}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">Your cart is empty.</p>
              </div>
            ) : (
              items.map((item) => {
                const id =
                  item.product.id ||
                  item.product._id ||
                  item._id ||
                  item.id ||
                  "";
                return (
                  <div key={id} className="py-4 flex space-x-4">
                    <div className="relative h-20 w-20 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder-product.png"}
                        alt={item.title || item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {item.title || item.name}
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {formatCurrency(
                            item.product?.price ?? item.price ?? 0,
                            currency,
                          )}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id,
                                  quantity: Math.max(1, item.quantity - 1),
                                }),
                              )
                            }
                            className="p-1 text-gray-600 hover:text-black"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
                            className="p-1 text-gray-600 hover:text-black"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(id))}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice, currency)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onCheckout}
                  className="w-full py-3 px-4 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
