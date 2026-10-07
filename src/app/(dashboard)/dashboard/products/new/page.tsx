import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="product-editor-page">
      <Link href="/dashboard/products" className="product-editor-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to products
      </Link>
      <div className="product-editor-page-heading">
        <div>
          <h1 className="page-title">Create a product</h1>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
