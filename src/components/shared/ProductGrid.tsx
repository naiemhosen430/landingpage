"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../storefront/types";

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading?: boolean;
  currency?: string;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
  currency,
  onAddToCart,
}) => {
  return (
    <section className="store-catalog-products">
      {/* Category Filter Pills */}
      <div className="store-catalog-filters">
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`store-filter-pill ${
            selectedCategory === "all"
              ? "is-selected"
              : ""
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`store-filter-pill capitalize ${
              selectedCategory === cat
                ? "is-selected"
                : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Layout / Skeleton / Empty State */}
      {isLoading ? (
        <div className="store-product-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-xl aspect-square w-full"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 font-medium">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="store-product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              currency={currency}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};
