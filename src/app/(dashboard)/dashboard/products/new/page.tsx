import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Product</h1>
          <p className="page-subtitle">Create a new product for your store</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
