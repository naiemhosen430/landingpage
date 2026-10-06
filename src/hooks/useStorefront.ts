"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import type {
  Product,
  Category,
  TrackingEventType,
} from "@/components/storefront/types";

interface UseStorefrontProps {
  initialProducts?: Product[];
  categories?: Category[] | string[];
  initialCategory?: string;
  initialSearch?: string;
}

export const useStorefront = ({
  initialProducts = [],
  categories: initialCategories = [],
  initialCategory = "all",
  initialSearch = "",
}: UseStorefrontProps = {}) => {
  const dispatch = useAppDispatch();

  const products = initialProducts;
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Extract and normalize category names
  const categoryNames = useMemo(() => {
    if (initialCategories.length > 0) {
      return initialCategories.map((cat) =>
        typeof cat === "string" ? cat : cat.name,
      );
    }
    return Array.from(
      new Set(
        products
          .flatMap((p) => p.categories || [])
          .filter((cat): cat is string => Boolean(cat)),
      ),
    );
  }, [initialCategories, products]);

  // Analytics tracking helper
  const trackEvent = useCallback(
    (event: TrackingEventType, payload?: Record<string, unknown>) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Analytics - ${event}]`, payload);
      }
    },
    [],
  );

  // Filter products by selected category and search input
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.title || product.name || "";
      const matchesSearch = name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const selected = initialCategories.find(
        (category): category is Category =>
          typeof category !== "string" &&
          (category.id === selectedCategory ||
            category.slug === selectedCategory ||
            category.name === selectedCategory),
      );
      const categoryValues =
        typeof selectedCategory === "string" && selected
          ? [selected.id, selected.slug, selected.name].filter(
              (value): value is string => Boolean(value),
            )
          : [selectedCategory];
      const matchesCategory =
        selectedCategory === "all" ||
        (product.categories ?? []).some((category) =>
          categoryValues.includes(category),
        );

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory, initialCategories]);

  // Handler for adding items to cart
  const handleAddToCart = useCallback(
    (product: Product, variantId?: string) => {
      dispatch(
        variantId
          ? addToCart({ product, variantId })
          : addToCart(product),
      );
      trackEvent("add_to_cart", {
        productId: product._id || product.id,
        price: product.price,
      });
      setIsCartOpen(true);
    },
    [dispatch, trackEvent],
  );

  // Handler for initiating checkout
  const handleCheckout = useCallback(() => {
    trackEvent("checkout_started");
    window.location.href = "/checkout";
  }, [trackEvent]);

  return {
    products: filteredProducts,
    categories: categoryNames,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    isLoading,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleCheckout,
  };
};
