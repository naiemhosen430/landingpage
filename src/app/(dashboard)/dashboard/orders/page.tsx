"use client";

import { notifyToast } from "@/lib/toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Globe,
  Music2,
  Pencil,
  Printer,
  Search,
  Share2,
  Truck,
  Phone,
  MessageCircle,
  X,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  type OrderStatus,
} from "@/store/orderApi";
import {
  useBookOrderWithDefaultCourierMutation,
  useLazyGetRedXDeliveryAreasQuery,
  type RedXDeliveryArea,
} from "@/store/courierApi";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusMap: Record<string, string> = {
  incomplete: "badge-default",
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
  returned: "badge-danger",
  refunded: "badge-danger",
};

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateBoundary(value: string, endOfDay = false) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

function normalizeWhatsAppPhone(phone: string) {
  let number = phone.replace(/\D/g, "");

  // Convert Bangladeshi local mobile numbers to international format.
  if (number.startsWith("01") && number.length === 11) {
    number = `88${number}`;
  } else if (number.startsWith("8801") && number.length === 13) {
    // Already in Bangladesh international format.
  }

  return number;
}

function OrderSource({ platform }: { platform?: string }) {
  if (!platform) return <span title="Source not available">—</span>;

  const normalized = platform.toLowerCase();

  const Icon = /google|bing|yahoo|search/.test(normalized)
    ? Search
    : /tiktok/.test(normalized)
      ? Music2
      : /facebook|instagram|linkedin|pinterest|snapchat|twitter/.test(
            normalized,
          ) || normalized === "x"
        ? Share2
        : Globe;

  return (
    <span className="order-source">
      <Icon size={15} aria-hidden="true" />
      {platform}
    </span>
  );
}

function CustomerContact({ name, phone }: { name?: string; phone?: string }) {
  if (!phone) {
    return <span className="order-muted">No phone number</span>;
  }

  return (
    <div className="order-contact">
      <a
        className="order-phone-number"
        href={`tel:${normalizePhone(phone)}`}
        title="Call customer"
      >
        {phone}
        <a
          href={`tel:${normalizePhone(phone)}`}
          className="btn btn-secondary btn-sm order-contact-btn"
          aria-label={`Call ${name || "customer"}`}
          title="Call customer"
          style={{ marginLeft: 8, marginRight: 8 }}
        >
          <Phone size={15} aria-hidden="true" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${normalizeWhatsAppPhone(phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm order-contact-btn"
          aria-label={`WhatsApp ${name || "customer"}`}
          title="Message on WhatsApp"
        >
          <MessageCircle size={15} aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </a>
    </div>
  );
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search).get(
      "search",
    );

    if (searchParam) {
      setSearch(searchParam);
    }
  }, []);

  const [bookingOrderId, setBookingOrderId] = useState<string | null>(null);
  const [bookingOrder, setBookingOrder] = useState<any | null>(null);
  const [deliveryAreas, setDeliveryAreas] = useState<RedXDeliveryArea[]>([]);
  const [deliveryAreaSearch, setDeliveryAreaSearch] = useState("");
  const [selectedDeliveryAreaId, setSelectedDeliveryAreaId] = useState("");
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    status: "pending",
    paymentStatus: "PENDING",
    deliveryCharge: "0",
    items: [] as Array<{
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
    }>,
  });

  const [bookOrder, { isLoading: booking }] =
    useBookOrderWithDefaultCourierMutation();

  const [getRedXDeliveryAreas, { isLoading: loadingDeliveryAreas }] =
    useLazyGetRedXDeliveryAreasQuery();

  const [updateOrder] = useUpdateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const resolvedDateRange = (() => {
    if (dateRange === "today") {
      const today = toLocalDateString(new Date());
      return { from: today, to: today };
    }
    if (dateRange === "7days" || dateRange === "30days") {
      const days = dateRange === "7days" ? 7 : 30;
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - (days - 1));
      return {
        from: toLocalDateString(fromDate),
        to: toLocalDateString(new Date()),
      };
    }
    if (dateRange === "custom") return { from: dateFrom, to: dateTo };
    return { from: "", to: "" };
  })();

  const { data, isLoading } = useGetOrdersQuery({
    page,
    limit: 20,
    status: status || undefined,
    paymentStatus: paymentStatus || undefined,
    search: search || undefined,
    dateFrom: resolvedDateRange.from
      ? toDateBoundary(resolvedDateRange.from)
      : undefined,
    dateTo: resolvedDateRange.to
      ? toDateBoundary(resolvedDateRange.to, true)
      : undefined,
    sortBy,
    sortOrder,
  });

  const orders = data?.data || [];
  const meta = data?.meta;
  const activeFilterCount = [
    status,
    paymentStatus,
    dateRange !== "all" ? dateRange : "",
    search,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatus("");
    setPaymentStatus("");
    setDateRange("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPage(1);
  };

  const handleBookOrder = async (order: any) => {
    setBookingOrderId(order.id);

    try {
      const areas = await getRedXDeliveryAreas(order.id).unwrap();

      setBookingOrder(order);
      setDeliveryAreas(areas);
      setSelectedDeliveryAreaId(areas.length === 1 ? String(areas[0].id) : "");
      setDeliveryAreaSearch("");
    } catch (error: any) {
      notifyToast(
        error?.data?.message ??
          "Could not load RedX delivery areas for this order.",
        "error",
      );
    } finally {
      setBookingOrderId(null);
    }
  };

  const handleConfirmCourierBooking = async () => {
    if (!bookingOrder || !selectedDeliveryAreaId) return;

    setBookingOrderId(bookingOrder.id);

    try {
      await bookOrder({
        orderId: bookingOrder.id,
        deliveryAreaId: Number(selectedDeliveryAreaId),
      }).unwrap();

      notifyToast("Order booked with RedX successfully.", "success");
      setBookingOrder(null);
    } catch (error: any) {
      notifyToast(
        error?.data?.message ?? "Could not book this order with RedX.",
        "error",
      );
    } finally {
      setBookingOrderId(null);
    }
  };

  const filteredDeliveryAreas = deliveryAreas.filter((area) =>
    `${area.name} ${area.post_code} ${area.division_name}`
      .toLowerCase()
      .includes(deliveryAreaSearch.toLowerCase()),
  );

  const openEditOrder = (order: any) => {
    setEditingOrder(order);

    setEditForm({
      name: order?.customer?.name ?? "",
      phone: order?.customer?.phone ?? "",
      address:
        typeof order?.customer?.address === "string"
          ? order.customer.address
          : "",
      notes: order.notes ?? "",
      status: String(order.status ?? "pending").toLowerCase(),
      paymentStatus: String(order.paymentStatus ?? "PENDING").toUpperCase(),
      deliveryCharge: String(order.deliveryCharge ?? order.shippingAmount ?? 0),
      items: (order.items ?? []).map((item: any) => ({
        productId: item.productId ?? item.id ?? "",
        name: item.productName ?? item.name ?? "Product",
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice ?? item.price) || 0,
      })),
    });
  };

  const saveOrderEdit = async () => {
    if (!editingOrder || savingOrder) return;

    setSavingOrder(true);

    try {
      await updateOrder({
        id: editingOrder.id,
        data: {
          customer: {
            name: editForm.name,
            phone: editForm.phone,
            address: editForm.address,
          },
          notes: editForm.notes || undefined,
          paymentStatus: editForm.paymentStatus,
          deliveryCharge: Number(editForm.deliveryCharge) || 0,
          items: editForm.items.map(({ productId, quantity, unitPrice }) => ({
            productId,
            quantity,
            unitPrice,
          })),
        },
      }).unwrap();

      if (editForm.status !== String(editingOrder.status).toLowerCase()) {
        await updateOrderStatus({
          id: editingOrder.id,
          status: editForm.status as OrderStatus,
        }).unwrap();
      }

      notifyToast("Order updated successfully.", "success");
      setEditingOrder(null);
    } catch (error: any) {
      notifyToast(
        error?.data?.message ?? "Could not update this order.",
        "error",
      );
    } finally {
      setSavingOrder(false);
    }
  };

  const renderOrderActions = (order: any) => {
    const unsupportedCourier = Boolean(
      order.courier?.providerCode && order.courier.providerCode !== "REDX",
    );

    return (
      <div className="order-actions">
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="btn btn-ghost btn-sm btn-icon-action"
          title="View order"
          aria-label={`View order ${order.orderNumber}`}
        >
          <Eye size={16} aria-hidden="true" />
        </Link>

        <Link
          href={`/dashboard/orders/${order.id}?print=1`}
          className="btn btn-secondary btn-sm btn-icon-action"
          title="Print invoice"
          aria-label={`Print invoice for order ${order.orderNumber}`}
        >
          <Printer size={16} aria-hidden="true" />
        </Link>

        <button
          type="button"
          className="btn btn-secondary btn-sm btn-icon-action"
          onClick={() => openEditOrder(order)}
          title="Edit order"
          aria-label={`Edit order ${order.orderNumber}`}
        >
          <Pencil size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm btn-icon-action"
          onClick={() => handleBookOrder(order)}
          aria-label={
            order.courier
              ? `Rebook courier for order ${order.orderNumber}`
              : `Book courier for order ${order.orderNumber}`
          }
          disabled={
            booking ||
            loadingDeliveryAreas ||
            bookingOrderId === order.id ||
            unsupportedCourier
          }
          title={
            unsupportedCourier
              ? `${order.courier.name} booking integration is pending`
              : order.courier
                ? `Rebook with ${order.courier.name}`
                : "Book with assigned courier"
          }
        >
          {bookingOrderId === order.id ? (
            <span className="action-button-spinner" />
          ) : (
            <Truck size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
        </div>
        <Link href="/dashboard/orders/new" className="btn btn-primary">
          <Plus size={17} aria-hidden="true" />
          Add manual order
        </Link>
      </div>

      <div className="card orders-card">
        <div className="card-header orders-toolbar">
          <div className="orders-filters">
            <div className="orders-search">
              <Search
                size={16}
                aria-hidden="true"
                className="orders-search-icon"
              />

              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="form-input"
                aria-label="Search orders"
              />

              {search && (
                <button
                  type="button"
                  className="orders-search-clear"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              className="form-select orders-status-filter"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as OrderStatus | "");
                setPage(1);
              }}
              aria-label="Filter orders by status"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="incomplete">Incomplete</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="refunded">Refunded</option>
            </select>
            {/* <select
              className="form-select orders-payment-filter"
              value={paymentStatus}
              onChange={(event) => {
                setPaymentStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter orders by payment status"
            >
              <option value="">All payments</option>
              <option value="PENDING">Payment pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select> */}
            <label className="orders-date-filter">
              <span className="sr-only">Filter by order date</span>
              <select
                className="form-select"
                value={dateRange}
                onChange={(event) => {
                  setDateRange(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter orders by date"
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="custom">Custom range</option>
              </select>
            </label>
            <label className="orders-sort-filter">
              <span className="sr-only">Sort orders</span>
              <select
                className="form-select"
                value={`${sortBy}:${sortOrder}`}
                onChange={(event) => {
                  const [nextSortBy, nextSortOrder] =
                    event.target.value.split(":");
                  setSortBy(nextSortBy);
                  setSortOrder(nextSortOrder as "asc" | "desc");
                  setPage(1);
                }}
                aria-label="Sort orders"
              >
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
                <option value="total:desc">Highest total</option>
                <option value="total:asc">Lowest total</option>
                <option value="orderNumber:desc">
                  Order number (high to low)
                </option>
                <option value="orderNumber:asc">
                  Order number (low to high)
                </option>
              </select>
            </label>
            {dateRange === "custom" && (
              <div className="orders-custom-dates">
                <label>
                  <span>From</span>
                  <input
                    type="date"
                    className="form-input"
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(event) => {
                      setDateFrom(event.target.value);
                      setPage(1);
                    }}
                    aria-label="Start date"
                  />
                </label>
                <label>
                  <span>To</span>
                  <input
                    type="date"
                    className="form-input"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(event) => {
                      setDateTo(event.target.value);
                      setPage(1);
                    }}
                    aria-label="End date"
                  />
                </label>
              </div>
            )}
            <div className="orders-filter-summary">
              <span>
                <SlidersHorizontal size={14} aria-hidden="true" />
                {activeFilterCount
                  ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"}`
                  : "All orders"}
              </span>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card-body orders-card-body">
          {isLoading ? (
            <div className="orders-loading">
              <div className="spinner" />
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state orders-empty">
              <div className="empty-state-title">No orders found</div>
              <p className="page-subtitle">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop and tablet table */}
              <div className="table-wrapper orders-desktop-table">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Courier</th>
                      <th>Source</th>
                      <th>Date</th>
                      <th className="orders-actions-heading">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id}>
                        <td>
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="order-number-link"
                          >
                            #{order.orderNumber}
                          </Link>

                          {order.notes ? (
                            <span
                              className="order-list-note"
                              title={order.notes}
                            >
                              {order.notes}
                            </span>
                          ) : (
                            <> </>
                          )}
                        </td>

                        <td>
                          <div className="order-customer-name">
                            {order.customer?.name || "Unknown customer"}
                          </div>

                          <CustomerContact
                            name={order.customer?.name}
                            phone={order.customer?.phone}
                          />

                          <div className="order-customer-address">
                            {typeof order.customer?.address === "string"
                              ? order.customer.address
                              : ""}
                          </div>
                        </td>

                        <td>{order.items?.length ?? 0} items</td>

                        <td className="order-total">
                          {formatCurrency(order.total)}
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              statusMap[order.status] || "badge-default"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="order-courier-cell">
                          {order.courier ? (
                            <>
                              <div>{order.courier.name}</div>

                              {order.courier.trackingNumber && (
                                <div className="order-tracking-number">
                                  {order.courier.trackingNumber}
                                </div>
                              )}

                              <span
                                className={`badge ${
                                  order.courier.status === "BOOKED"
                                    ? "badge-success"
                                    : order.courier.status === "FAILED"
                                      ? "badge-danger"
                                      : "badge-warning"
                                }`}
                              >
                                {order.courier.status ?? "ASSIGNED"}
                              </span>

                              {order.courier.bookingError && (
                                <div className="order-booking-error">
                                  {order.courier.bookingError}
                                </div>
                              )}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td>
                          <OrderSource platform={order.sourcePlatform} />
                        </td>
                        <td
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                          }}
                        >
                          <div>
                            {new Date(order.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              marginTop: 4,
                            }}
                          >
                            {(() => {
                              const diff =
                                Date.now() -
                                new Date(order.createdAt).getTime();
                              if (!Number.isFinite(diff)) return "Unknown time";
                              const seconds = Math.max(
                                0,
                                Math.floor(diff / 1000),
                              );

                              if (seconds < 60) return "Just now";
                              if (seconds < 3600)
                                return `${Math.floor(seconds / 60)} minutes ago`;
                              if (seconds < 86400)
                                return `${Math.floor(seconds / 3600)} hours ago`;
                              if (seconds < 604800)
                                return `${Math.floor(seconds / 86400)} days ago`;
                              if (seconds < 2592000)
                                return `${Math.floor(seconds / 604800)} weeks ago`;
                              if (seconds < 31536000)
                                return `${Math.floor(seconds / 2592000)} months ago`;

                              return `${Math.floor(seconds / 31536000)} years ago`;
                            })()}
                          </div>
                        </td>

                        <td>{renderOrderActions(order)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile order cards */}
              <div className="orders-mobile-list">
                {orders.map((order: any) => (
                  <article className="order-mobile-card" key={order.id}>
                    <div className="order-mobile-header">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="order-number-link"
                      >
                        #{order.orderNumber}
                      </Link>

                      <span
                        className={`badge ${
                          statusMap[order.status] || "badge-default"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="order-mobile-customer">
                      <strong>
                        {order.customer?.name || "Unknown customer"}
                      </strong>

                      <CustomerContact
                        name={order.customer?.name}
                        phone={order.customer?.phone}
                      />

                      <p className="order-mobile-address">
                        {typeof order.customer?.address === "string"
                          ? order.customer.address
                          : "No address provided"}
                      </p>
                    </div>

                    <div className="order-mobile-summary">
                      <div>
                        <span>Items</span>
                        <strong>{order.items?.length ?? 0}</strong>
                      </div>

                      <div>
                        <span>Total</span>
                        <strong>{formatCurrency(order.total)}</strong>
                      </div>

                      <div>
                        <span>Date</span>
                        <strong>{formatDate(order.createdAt)}</strong>
                      </div>
                    </div>

                    {order.courier && (
                      <div className="order-mobile-courier">
                        <Truck size={15} aria-hidden="true" />

                        <div>
                          <strong>{order.courier.name}</strong>

                          {order.courier.trackingNumber && (
                            <div className="order-tracking-number">
                              {order.courier.trackingNumber}
                            </div>
                          )}

                          <span
                            className={`badge ${
                              order.courier.status === "BOOKED"
                                ? "badge-success"
                                : order.courier.status === "FAILED"
                                  ? "badge-danger"
                                  : "badge-warning"
                            }`}
                          >
                            {order.courier.status ?? "ASSIGNED"}
                          </span>
                        </div>
                      </div>
                    )}

                    {order.sourcePlatform && (
                      <div className="order-mobile-source">
                        <span>Source:</span>
                        <OrderSource platform={order.sourcePlatform} />
                      </div>
                    )}

                    {order.notes && (
                      <div className="order-mobile-note">
                        <strong>Note:</strong> {order.notes}
                      </div>
                    )}

                    <div className="order-mobile-actions">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        <Eye size={15} aria-hidden="true" />
                        View
                      </Link>

                      <Link
                        href={`/dashboard/orders/${order.id}?print=1`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Printer size={15} aria-hidden="true" />
                        Invoice
                      </Link>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditOrder(order)}
                      >
                        <Pencil size={15} aria-hidden="true" />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBookOrder(order)}
                        disabled={
                          booking ||
                          loadingDeliveryAreas ||
                          bookingOrderId === order.id ||
                          Boolean(
                            order.courier?.providerCode &&
                            order.courier.providerCode !== "REDX",
                          )
                        }
                      >
                        {bookingOrderId === order.id ? (
                          <span className="action-button-spinner" />
                        ) : (
                          <Truck size={15} aria-hidden="true" />
                        )}
                        Courier
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="pagination orders-pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  className={`pagination-btn ${p === page ? "active" : ""}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              ),
            )}

            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              aria-label="Next page"
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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* RedX booking modal */}
      {bookingOrder && (
        <div
          className="modal-overlay orders-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="redx-booking-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setBookingOrder(null);
            }
          }}
        >
          <div className="modal orders-modal">
            <div className="modal-header">
              <h2 className="modal-title" id="redx-booking-title">
                Book order #{bookingOrder.orderNumber} with RedX
              </h2>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setBookingOrder(null)}
              >
                Close
              </button>
            </div>

            <div className="modal-body">
              <p className="page-subtitle">
                Select the RedX delivery area that matches the customer&apos;s
                address. Parcel weight is calculated from the product weights.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="redx-area-search">
                  Search delivery areas
                </label>

                <input
                  id="redx-area-search"
                  className="form-input"
                  value={deliveryAreaSearch}
                  onChange={(event) =>
                    setDeliveryAreaSearch(event.target.value)
                  }
                  placeholder="Search by area, postal code, or division"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="redx-area">
                  RedX delivery area *
                </label>

                <select
                  id="redx-area"
                  className="form-select"
                  value={selectedDeliveryAreaId}
                  onChange={(event) =>
                    setSelectedDeliveryAreaId(event.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select the correct area
                  </option>

                  {filteredDeliveryAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.post_code}) — {area.division_name}
                    </option>
                  ))}
                </select>

                {!filteredDeliveryAreas.length && (
                  <small className="form-hint">
                    No delivery areas match this search.
                  </small>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!selectedDeliveryAreaId || booking}
                  onClick={handleConfirmCourierBooking}
                >
                  {booking ? "Booking..." : "Book with RedX"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBookingOrder(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit order modal */}
      {editingOrder && (
        <div
          className="modal-overlay orders-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-order-title"
          onClick={(event) => {
            if (event.target === event.currentTarget && !savingOrder) {
              setEditingOrder(null);
            }
          }}
        >
          <div className="modal orders-modal orders-edit-modal">
            <div className="modal-header">
              <h2 className="modal-title" id="edit-order-title">
                Update order #{editingOrder.orderNumber}
              </h2>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setEditingOrder(null)}
                disabled={savingOrder}
              >
                Close
              </button>
            </div>

            <div className="modal-body">
              <div className="orders-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-order-status">
                    Order status
                  </label>

                  <select
                    id="edit-order-status"
                    className="form-select"
                    value={editForm.status}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        status: event.target.value,
                      })
                    }
                  >
                    {[
                      "incomplete",
                      "pending",
                      "confirmed",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                      "returned",
                    ].map((value) => (
                      <option key={value} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-delivery-charge">
                    Delivery charge
                  </label>

                  <input
                    id="edit-delivery-charge"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={editForm.deliveryCharge}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        deliveryCharge: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="orders-form-grid">
                {/* <div className="form-group">
                  <label className="form-label" htmlFor="edit-payment-status">
                    Payment status
                  </label>

                  <select
                    id="edit-payment-status"
                    className="form-select"
                    value={editForm.paymentStatus}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        paymentStatus: event.target.value,
                      })
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div> */}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-customer-name">
                  Customer name
                </label>

                <input
                  id="edit-customer-name"
                  className="form-input"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      name: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-customer-phone">
                  Phone
                </label>

                <input
                  id="edit-customer-phone"
                  type="tel"
                  className="form-input"
                  value={editForm.phone}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      phone: event.target.value,
                    })
                  }
                />

                {editForm.phone && (
                  <div className="edit-contact-preview">
                    <a
                      href={`tel:${normalizePhone(editForm.phone)}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <Phone size={15} />
                      Call
                    </a>

                    <a
                      href={`https://wa.me/${normalizeWhatsAppPhone(
                        editForm.phone,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-customer-address">
                  Address
                </label>

                <textarea
                  id="edit-customer-address"
                  className="form-textarea"
                  rows={3}
                  value={editForm.address}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      address: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-order-note">
                  Order note
                </label>

                <textarea
                  id="edit-order-note"
                  className="form-textarea"
                  rows={2}
                  value={editForm.notes}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      notes: event.target.value,
                    })
                  }
                />
              </div>

              {editForm.items.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Products and prices</label>

                  <div className="orders-edit-items">
                    {editForm.items.map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        className="orders-edit-item"
                      >
                        <span className="orders-edit-item-name">
                          {item.name}
                        </span>

                        <div className="orders-edit-item-field">
                          <label htmlFor={`edit-quantity-${index}`}>Qty</label>

                          <input
                            id={`edit-quantity-${index}`}
                            type="number"
                            min="1"
                            step="1"
                            className="form-input"
                            value={item.quantity}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                items: editForm.items.map(
                                  (current, itemIndex) =>
                                    itemIndex === index
                                      ? {
                                          ...current,
                                          quantity: Math.max(
                                            1,
                                            Number(event.target.value) || 1,
                                          ),
                                        }
                                      : current,
                                ),
                              })
                            }
                          />
                        </div>

                        <div className="orders-edit-item-field">
                          <label htmlFor={`edit-price-${index}`}>
                            Unit price
                          </label>

                          <input
                            id={`edit-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-input"
                            value={item.unitPrice}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                items: editForm.items.map(
                                  (current, itemIndex) =>
                                    itemIndex === index
                                      ? {
                                          ...current,
                                          unitPrice: Math.max(
                                            0,
                                            Number(event.target.value) || 0,
                                          ),
                                        }
                                      : current,
                                ),
                              })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer orders-edit-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingOrder(null)}
                disabled={savingOrder}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={saveOrderEdit}
                disabled={savingOrder}
              >
                {savingOrder ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
