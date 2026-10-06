"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "../storefront/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currency?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  currency,
}) => {
  // Extract main image URL securely
  const getImageUrl = (): string => {
    if (!product.images) {
      return (
        product.thumbnailImage?.secureUrl ||
        product.thumbnailImage?.url ||
        "/placeholder-product.png"
      );
    }
    if (typeof product.images === "string") return product.images;
    if (Array.isArray(product.images) && product.images.length > 0) {
      const first = product.images[0];
      if (typeof first === "string") return first;
      return first.secureUrl || first.url || "/placeholder-product.png";
    }
    return (
      product.thumbnailImage?.secureUrl ||
      product.thumbnailImage?.url ||
      "/placeholder-product.png"
    );
  };

  const imageUrl = getImageUrl();
  const compareAtPrice = product.compareAtPrice ?? 0;
  const hasDiscount = compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((compareAtPrice - product.price) / compareAtPrice) * 100,
      )
    : product.discountPercent;
  const productName = product.title || product.name;

  return (
    <article className="store-product-card">
      <div className="store-product-card-image">
        {discountPercent ? (
          <span className="store-discount-badge">{discountPercent}% OFF</span>
        ) : null}
        <span className="store-favorite-button" aria-hidden="true">
          <Heart size={13} />
        </span>
        <Link
          className="store-product-image-link"
          href={product.slug ? `/products/${product.slug}` : "/products"}
          aria-label={`View ${productName}`}
        >
          <img
            src={imageUrl}
            alt={productName || "Product image"}
            className="store-product-image"
          />
        </Link>
      </div>

      <div className="store-product-card-details">
        <Link
          className="store-product-name"
          href={product.slug ? `/products/${product.slug}` : "/products"}
        >
          {productName}
        </Link>
        {product.shortDescription && (
          <p className="store-product-description">{product.shortDescription}</p>
        )}
        <div className="store-product-price-row">
          <span className="store-product-price">
            {formatCurrency(product.price, currency)}
          </span>
          {hasDiscount && (
            <span className="store-product-compare-price">
              {formatCurrency(compareAtPrice, currency)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="store-add-to-cart"
          disabled={product.stock !== undefined && product.stock <= 0}
        >
          {product.stock !== undefined && product.stock <= 0
            ? "Out of stock"
            : "Add to cart"}
        </button>
      </div>
    </article>
  );
};
