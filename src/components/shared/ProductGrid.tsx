"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../storefront/types";
import { Filter, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import "./product-catalog-filters.css";

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading?: boolean;
  currency?: string;
  onAddToCart: (product: Product) => void;
}

type SortOption = "featured" | "name-asc" | "price-asc" | "price-desc";

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
  currency,
  onAddToCart,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileFiltersOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileFiltersOpen]);

  const filteredProducts = useMemo(() => {
    const min = minPrice.trim() === "" ? null : Number(minPrice);
    const max = maxPrice.trim() === "" ? null : Number(maxPrice);

    const filtered = products.filter((product) => {
      const price = Number(product.price ?? 0);
      const stock = Number(product.stock ?? 0);

      if (inStockOnly && stock <= 0) return false;
      if (min !== null && Number.isFinite(min) && price < min) return false;
      if (max !== null && Number.isFinite(max) && price > max) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a.name ?? "").localeCompare(b.name ?? "");
      }
      if (sortBy === "price-asc") {
        return Number(a.price ?? 0) - Number(b.price ?? 0);
      }
      if (sortBy === "price-desc") {
        return Number(b.price ?? 0) - Number(a.price ?? 0);
      }
      return 0;
    });
  }, [products, sortBy, inStockOnly, minPrice, maxPrice]);

  const activeExtraFilters =
    inStockOnly || minPrice.trim() !== "" || maxPrice.trim() !== "";

  const resetFilters = () => {
    onSelectCategory("all");
    setSortBy("featured");
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
  };

  const categoryOptions = (
    <div className="catalog-filter-group">
      <h3 className="catalog-filter-heading">Categories</h3>
      <div className="catalog-category-list">
        <button
          type="button"
          className={`catalog-category-option ${
            selectedCategory === "all" ? "is-selected" : ""
          }`}
          onClick={() => {
            onSelectCategory("all");
            setMobileFiltersOpen(false);
          }}
        >
          <span>All products</span>
          <span className="catalog-category-count">{products.length}</span>
        </button>

        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`catalog-category-option ${
              selectedCategory === category ? "is-selected" : ""
            }`}
            onClick={() => {
              onSelectCategory(category);
              setMobileFiltersOpen(false);
            }}
          >
            <span>{category}</span>
            <span aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </div>
  );

  const filterControls = (
    <>
      {categoryOptions}

      <div className="catalog-filter-group">
        <h3 className="catalog-filter-heading">Price range</h3>
        <div className="catalog-price-fields">
          <label>
            <span>Min</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              aria-label="Minimum price"
            />
          </label>
          <label>
            <span>Max</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Any"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              aria-label="Maximum price"
            />
          </label>
        </div>
        {minPrice.trim() !== "" &&
          maxPrice.trim() !== "" &&
          Number(minPrice) > Number(maxPrice) && (
            <p className="catalog-filter-error">
              Minimum price must be less than maximum price.
            </p>
          )}
      </div>

      <div className="catalog-filter-group">
        <h3 className="catalog-filter-heading">Availability</h3>
        <label className="catalog-stock-toggle">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
          />
          <span>In stock only</span>
        </label>
      </div>

      <button
        type="button"
        className="catalog-reset-button"
        onClick={resetFilters}
      >
        <RotateCcw size={15} />
        Reset filters
      </button>
    </>
  );

  return (
    <section className="store-catalog-layout" aria-label="Product catalog">
      <aside className="store-catalog-sidebar" aria-label="Product filters">
        <div className="catalog-sidebar-title">
          <SlidersHorizontal size={18} />
          <h2>Filters</h2>
        </div>
        {filterControls}
      </aside>

      {mobileFiltersOpen && (
        <div
          className="catalog-mobile-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMobileFiltersOpen(false);
            }
          }}
        >
          <aside
            className="catalog-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            id="catalog-mobile-filters"
          >
            <div className="catalog-drawer-header">
              <div className="catalog-sidebar-title">
                <SlidersHorizontal size={18} />
                <h2>Filters</h2>
              </div>
              <button
                type="button"
                className="catalog-icon-button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X size={21} />
              </button>
            </div>
            {filterControls}
            <button
              type="button"
              className="catalog-apply-button"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filteredProducts.length} products
            </button>
          </aside>
        </div>
      )}

      <div className="store-catalog-products">
        <div className="catalog-toolbar">
          <div className="catalog-toolbar-copy">
            <h1>Shop all products</h1>
            <p>
              {isLoading
                ? "Loading products…"
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "product" : "products"
                  } found`}
            </p>
          </div>

          <div className="catalog-toolbar-actions">
            <button
              type="button"
              className="catalog-mobile-filter-button"
              onClick={() => setMobileFiltersOpen(true)}
              aria-expanded={mobileFiltersOpen}
              aria-controls="catalog-mobile-filters"
            >
              <Filter size={17} />
              Filters
              {(selectedCategory !== "all" || activeExtraFilters) && (
                <span className="catalog-filter-dot" />
              )}
            </button>

            <label className="catalog-sort-control">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
              >
                <option value="featured">Recommended</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        {isLoading ? (
          <div className="store-product-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="catalog-product-skeleton"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalog-empty-state">
            <div className="catalog-empty-icon">
              <Filter size={24} />
            </div>
            <h2>No products found</h2>
            <p>Try changing your category or adjusting the filters.</p>
            <button type="button" onClick={resetFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="store-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                currency={currency}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
