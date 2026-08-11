import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isActive: boolean;
  thumbnailImage?: { url: string; secureUrl?: string };
  images: { url: string }[];
  sku: string;
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const statusMap: Record<string, string> = {
  active: "badge-success",
  draft: "badge-warning",
  archived: "badge-default",
};

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  if (!products?.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <div className="empty-state-title">No products found</div>
        <div className="empty-state-desc">
          Add your first product to start selling.
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius)",
                      background: "var(--bg-tertiary)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {(product.thumbnailImage?.secureUrl ??
                    product.thumbnailImage?.url ??
                    product.images?.[0]?.url) ? (
                      <img
                        src={
                          product.thumbnailImage?.secureUrl ??
                          product.thumbnailImage?.url ??
                          product.images[0].url
                        }
                        alt={product.name}
                        width={48}
                        height={48}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      style={{ fontWeight: 500, color: "var(--text-primary)" }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      SKU: {product.sku}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ fontWeight: 600 }}>
                  {formatCurrency(product.price)}
                </div>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatCurrency(product.compareAtPrice)}
                    </div>
                  )}
              </td>
              <td>
                <span
                  style={{
                    fontWeight: 500,
                    color:
                      product.stock <= 5
                        ? "var(--danger)"
                        : "var(--text-primary)",
                  }}
                >
                  {product.stock}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${statusMap[product.isActive ? "active" : "archived"]}`}
                >
                  {product.isActive ? "active" : "archived"}
                </span>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="btn btn-ghost btn-sm"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
