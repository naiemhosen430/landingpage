import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; phone: string };
  total: number;
  status: string;
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const statusMap: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
  returned: "badge-danger",
};

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders?.length) {
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
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div className="empty-state-title">No orders yet</div>
        <div className="empty-state-desc">
          Orders will appear here once customers start buying.
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link
                  href={`/orders/${order.id}`}
                  style={{ color: "var(--primary)", fontWeight: 500 }}
                >
                  #{order.orderNumber}
                </Link>
              </td>
              <td>
                <div>{order.customer.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {order.customer.phone}
                </div>
              </td>
              <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
              <td>
                <span
                  className={`badge ${statusMap[order.status] || "badge-default"}`}
                >
                  {order.status}
                </span>
              </td>
              <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
