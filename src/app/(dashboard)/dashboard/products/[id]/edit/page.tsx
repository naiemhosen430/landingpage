"use client";

import { useParams } from "next/navigation";
import { useGetProductQuery } from "@/store/productApi";
import ProductForm from "@/components/products/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const { data, isLoading } = useGetProductQuery(productId);

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  const product = data?.data ?? data;

  if (!product) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Product not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">Update your store product</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <ProductForm initialData={product} productId={productId} />
        </div>
      </div>
    </div>
  );
}
