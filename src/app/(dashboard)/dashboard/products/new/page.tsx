import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="dashboard-home">
      <div className="product-editor-page-heading">
        <div>
          <h1 className="page-title">Create a product</h1>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
