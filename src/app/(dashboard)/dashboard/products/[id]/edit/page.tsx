"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGetProductQuery } from "@/store/productApi";
import ProductForm from "@/components/products/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const { data, isLoading, isError } = useGetProductQuery(productId);

  if (isLoading) {
    return (
      <div className="product-editor-loading">
        <div className="spinner" />
        <span>Loading product details…</span>
      </div>
    );
  }

  const product = data;

  if (!product) {
    return (
      <div className="product-editor-not-found">
        <div className="empty-state-title">
          {isError ? "Could not load product" : "Product not found"}
        </div>
        <p className="page-subtitle">
          {isError
            ? "Check your connection and try again."
            : "This product may have been removed or the link may be incorrect."}
        </p>
        <Link href="/dashboard/products" className="btn btn-secondary">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-editor-page">
      <Link href="/dashboard/products" className="product-editor-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>
      <div className="product-editor-page-heading">
        <div>
          <h1 className="page-title">Edit product</h1>
        </div>
      </div>
      <ProductForm initialData={product} productId={productId} />
    </div>
  );
}
