"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { notifyToast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useCreateOrderMutation } from "@/store/orderApi";
import { useGetProductsQuery, type Product } from "@/store/productApi";
import { useGetPaymentMethodsAdminQuery } from "@/store/paymentMethodApi";
import { useGetDeliveryAreasQuery } from "@/store/deliveryApi";

interface OrderLine {
  product: Product;
  productId: string;
  quantity: number;
}

interface OrderForm {
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryZone: string;
  notes: string;
}

const initialForm: OrderForm = {
  customerName: "",
  customerPhone: "",
  address: "",
  paymentMethod: "",
  paymentStatus: "PENDING",
  deliveryZone: "",
  notes: "",
};

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }
  return "Could not create this order. Please check the details and try again.";
}

export default function NewOrderPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const projectId =
    user?.projectId ??
    user?.project?.id ??
    process.env.NEXT_PUBLIC_PROJECT_ID ??
    "";

  const [form, setForm] = useState<OrderForm>(initialForm);
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [validationError, setValidationError] = useState("");

  // Modal & Search States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSearchInput, setProductSearchInput] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Debounce product search input
  useEffect(() => {
    const timer = window.setTimeout(
      () => setProductSearch(productSearchInput.trim()),
      250,
    );
    return () => window.clearTimeout(timer);
  }, [productSearchInput]);

  // Query product list
  const {
    data: productsData,
    isLoading: loadingProducts,
    isFetching: fetchingProducts,
    isError: productsFailed,
  } = useGetProductsQuery(
    {
      page: 1,
      limit: 20,
      search: productSearch || undefined,
      isActive: true,
    },
    { skip: !projectId || !isModalOpen },
  );

  const {
    data: paymentMethodsData,
    isLoading: loadingPaymentMethods,
    isError: paymentMethodsFailed,
  } = useGetPaymentMethodsAdminQuery({ page: 1, limit: 100 });

  const {
    data: deliveryAreasData,
    isLoading: loadingDeliveryAreas,
    isError: deliveryAreasFailed,
  } = useGetDeliveryAreasQuery({ page: 1, limit: 100 });

  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();

  const products = productsData?.data ?? [];
  const paymentMethods = (paymentMethodsData?.data ?? []).filter(
    (method) => method.isActive,
  );

  const deliveryZones = useMemo(
    () =>
      (deliveryAreasData?.data ?? []).slice(0, 1).flatMap((area) => area.zones),
    [deliveryAreasData],
  );

  console.log("deliveryZones", deliveryZones, deliveryAreasData);

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (total, line) => total + line.product.price * line.quantity,
        0,
      ),
    [lines],
  );

  const selectedZone = deliveryZones.find(
    (zone) => zone.zone === form.deliveryZone,
  );
  const activeDeliveryArea = (deliveryAreasData?.data ?? []).find(
    (area) => area.isActive !== false,
  );
  const deliveryCost =
    selectedZone?.price ?? activeDeliveryArea?.deliveryCharge ?? 0;

  useEffect(() => {
    if (!form.paymentMethod && paymentMethods.length) {
      setForm((current) => ({
        ...current,
        paymentMethod: paymentMethods[0].code,
      }));
    }
  }, [form.paymentMethod, paymentMethods]);

  useEffect(() => {
    if (!form.deliveryZone && deliveryZones.length) {
      updateForm("deliveryZone", deliveryZones[0].zone);
    }
  }, [deliveryZones, form.deliveryZone]);

  function updateForm<K extends keyof OrderForm>(key: K, value: OrderForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setValidationError("");
  }

  function addProduct(product: Product) {
    setValidationError("");
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, product, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...current, { product, productId: product.id, quantity: 1 }];
    });
  }

  function changeQuantity(productId: string, quantity: number) {
    setValidationError("");
    setLines((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.max(1, quantity) }
          : line,
      ),
    );
  }

  function removeProduct(productId: string) {
    setValidationError("");
    setLines((current) =>
      current.filter((line) => line.productId !== productId),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creatingOrder) return;

    if (!projectId) {
      setValidationError("Your store project could not be identified.");
      return;
    }
    if (!form.customerName.trim()) {
      setValidationError("Enter the customer’s name.");
      return;
    }
    if (!form.customerPhone.trim()) {
      setValidationError("Enter the customer’s phone number.");
      return;
    }
    if (!form.address.trim()) {
      setValidationError("Enter the customer’s delivery address.");
      return;
    }
    if (!lines.length) {
      setValidationError("Add at least one product to this order.");
      return;
    }
    if (!form.paymentMethod && paymentMethods.length > 0) {
      setValidationError("Select a payment method.");
      return;
    }

    try {
      const order = await createOrder({
        projectId,
        customerName: form.customerName.trim(),
        customer: {
          name: form.customerName.trim(),
          phone: form.customerPhone.trim(),
          address: form.address.trim(),
        },
        customerPhone: form.customerPhone.trim(),
        shippingAddress: {
          street: form.address.trim(),
        },
        items: lines.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
        ...(form.paymentMethod ? { paymentMethod: form.paymentMethod } : {}),
        paymentStatus: form.paymentStatus,
        ...(form.deliveryZone ? { deliveryZone: form.deliveryZone } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
        sourcePlatform: "Admin",
      }).unwrap();

      notifyToast("Manual order created successfully.", "success");
      router.push(`/dashboard/orders/${order.id}`);
    } catch (error) {
      const message = getErrorMessage(error);
      setValidationError(message);
      notifyToast(message, "error");
    }
  }

  return (
    <main className="order-create-page">
      <header className="order-create-heading">
        <div>
          <h1 className="page-title">Create a manual order</h1>
        </div>
      </header>

      {!projectId && (
        <div className="order-create-alert" role="alert">
          Store project is missing from your account. Please sign in again or
          contact support.
        </div>
      )}

      <form className="order-create-layout" onSubmit={handleSubmit}>
        <div className="order-create-main">
          {/* Customer Section */}
          <section className="card order-create-section">
            <div className="order-create-section-heading">
              <div>
                <h2>Customer information</h2>
              </div>
            </div>
            <div className="order-create-form-grid">
              <label className="form-group">
                <span className="form-label">Customer name *</span>
                <input
                  className="form-input"
                  value={form.customerName}
                  onChange={(e) => updateForm("customerName", e.target.value)}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>
              <label className="form-group">
                <span className="form-label">Phone number *</span>
                <input
                  className="form-input"
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => updateForm("customerPhone", e.target.value)}
                  autoComplete="tel"
                  maxLength={20}
                  required
                />
              </label>

              <label className="form-group order-create-full">
                <span className="form-label">Delivery address *</span>
                <textarea
                  className="form-input order-create-notes"
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  autoComplete="street-address"
                  maxLength={500}
                  rows={3}
                  placeholder="House, road, area details..."
                  required
                />
              </label>
            </div>
          </section>

          {/* Product Items Section */}
          <section className="card order-create-section">
            <div className="order-create-section-heading align-center justify-between">
              <div>
                <h2>Order Items</h2>
              </div>
              <button
                type="button"
                className="btn btn-secondary flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                Add Products
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="order-create-empty-state text-center py-8">
                <ShoppingBag size={36} className="mx-auto text-muted mb-2" />
                <p className="font-medium">No products selected yet</p>
                <p className="text-sm text-muted mb-4">
                  Click below to browse and add products to this order.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="order-create-selected">
                {lines.map(({ product, quantity }) => (
                  <div className="order-create-line" key={product.id}>
                    <div className="order-create-line-image">
                      {product.thumbnailImage?.secureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnailImage.secureUrl}
                          alt={product.name}
                          loading="lazy"
                        />
                      ) : (
                        <ShoppingBag size={20} />
                      )}
                    </div>
                    <div className="order-create-line-info">
                      <strong>{product.name}</strong>
                      <span>{formatCurrency(product.price)} each</span>
                    </div>
                    <div className="order-create-quantity">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name} quantity`}
                        onClick={() => changeQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => changeQuantity(product.id, quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <strong className="order-create-line-total">
                      {formatCurrency(product.price * quantity)}
                    </strong>
                    <button
                      type="button"
                      className="order-create-remove"
                      onClick={() => removeProduct(product.id)}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payment & Delivery Options Section */}
          <section className="card order-create-section">
            <div className="order-create-section-heading">
              <div>
                <h2>Payment and delivery</h2>
              </div>
            </div>
            <div className="order-create-form-grid">
              <div className="form-group order-create-full">
                <label className="form-group">
                  <span className="form-label">Payment method</span>
                  <select
                    className="form-select"
                    value={form.paymentMethod}
                    onChange={(e) =>
                      updateForm("paymentMethod", e.target.value)
                    }
                    disabled={loadingPaymentMethods}
                  >
                    <option value="">
                      {loadingPaymentMethods
                        ? "Loading methods…"
                        : "Select a method"}
                    </option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.code}>
                        {method.name}
                      </option>
                    ))}
                    {paymentMethods.length === 0 && !loadingPaymentMethods && (
                      <option value="cod">Cash on Delivery</option>
                    )}
                  </select>
                </label>
              </div>
              {/* 
              <label className="form-group">
                <span className="form-label">Payment status</span>
                <select
                  className="form-select"
                  value={form.paymentStatus}
                  onChange={(e) => updateForm("paymentStatus", e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </label> */}

              <div className="form-group order-create-full">
                <span className="form-label">Delivery area</span>
                {loadingDeliveryAreas ? (
                  <div className="order-create-loading order-create-delivery-loading">
                    <LoaderCircle size={18} className="order-create-spinner" />
                    <span>Loading delivery areas…</span>
                  </div>
                ) : deliveryAreasFailed ? (
                  <div className="order-create-inline-error" role="alert">
                    Delivery areas could not be loaded.
                  </div>
                ) : deliveryZones.length ? (
                  <div
                    className="order-create-delivery-zones"
                    role="radiogroup"
                    aria-label="Delivery area"
                  >
                    {deliveryZones.map((zone) => (
                      <label
                        className={`order-create-delivery-zone ${
                          form.deliveryZone === zone.zone ? "is-selected" : ""
                        }`}
                        key={zone.zone}
                      >
                        <input
                          type="radio"
                          name="deliveryZone"
                          value={zone.zone}
                          checked={form.deliveryZone === zone.zone}
                          onChange={() => updateForm("deliveryZone", zone.zone)}
                        />
                        <span className="order-create-zone-check">
                          {form.deliveryZone === zone.zone && (
                            <Check size={12} aria-hidden="true" />
                          )}
                        </span>
                        <strong>{zone.zone}</strong>
                        <span>{formatCurrency(zone.price)}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="order-create-delivery-fallback">
                    No delivery zones are configured. The store default charge
                    will be used.
                  </p>
                )}
              </div>

              <label className="form-group order-create-full">
                <span className="form-label">Order notes</span>
                <textarea
                  className="form-input order-create-notes"
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Optional internal notes..."
                />
              </label>
            </div>
          </section>
        </div>

        {/* Sidebar Order Summary */}
        <aside className="card order-create-summary">
          <div className="order-create-summary-heading">
            <h2>Order summary</h2>
            <span>{lines.length} item types</span>
          </div>

          {lines.length ? (
            <div className="order-create-summary-items">
              {lines.map(({ product, quantity }) => (
                <div key={product.id}>
                  <span>
                    {product.name} × {quantity}
                  </span>
                  <strong>{formatCurrency(product.price * quantity)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="order-create-summary-empty">
              Add products to calculate the subtotal.
            </p>
          )}

          <div className="order-create-summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="order-create-summary-row">
            <span>Delivery</span>
            <strong>{formatCurrency(deliveryCost)}</strong>
          </div>
          <div className="order-create-summary-row order-create-total">
            <span>Estimated total</span>
            <strong>{formatCurrency(subtotal + deliveryCost)}</strong>
          </div>

          {validationError && (
            <div className="order-create-alert" role="alert">
              {validationError}
            </div>
          )}

          <br />

          <button
            type="submit"
            className="btn btn-primary order-create-submit"
            disabled={
              creatingOrder ||
              !projectId ||
              loadingProducts ||
              loadingPaymentMethods ||
              loadingDeliveryAreas ||
              paymentMethodsFailed ||
              deliveryAreasFailed ||
              !lines.length
            }
          >
            {creatingOrder ? (
              <>
                <LoaderCircle size={17} className="order-create-spinner" />
                Creating order…
              </>
            ) : (
              <>
                <Plus size={17} />
                Create order
              </>
            )}
          </button>
          <Link href="/dashboard/orders" className="order-create-cancel">
            Cancel
          </Link>
        </aside>
      </form>

      {/* Product Selection Modal */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-picker-title"
        >
          <div
            className="modal-content product-picker-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="product-picker-title">Select Products</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Modal Search Field */}
              <div className="order-create-product-search">
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  value={productSearchInput}
                  onChange={(e) => setProductSearchInput(e.target.value)}
                  placeholder="Search products by name or SKU..."
                  autoFocus
                />
                {fetchingProducts && (
                  <LoaderCircle size={16} className="order-create-spinner" />
                )}
              </div>

              {/* Product Results */}
              <div className="modal-product-list">
                {loadingProducts || fetchingProducts ? (
                  <div className="modal-loading-state">
                    <LoaderCircle size={22} className="order-create-spinner" />
                    <span>Searching catalog...</span>
                  </div>
                ) : productsFailed ? (
                  <div className="order-create-inline-error" role="alert">
                    Failed to fetch products. Please try again.
                  </div>
                ) : products.length === 0 ? (
                  <div className="modal-empty-state">
                    <ShoppingBag size={24} />
                    <span>No active products found matching your query.</span>
                  </div>
                ) : (
                  products.map((product) => {
                    const selectedLine = lines.find(
                      (line) => line.productId === product.id,
                    );
                    const selectedQty = selectedLine?.quantity ?? 0;

                    return (
                      <div className="product-picker-item" key={product.id}>
                        <button
                          type="button"
                          className="product-picker-item-main"
                          onClick={() => addProduct(product)}
                          aria-label={`${selectedQty ? "Add another" : "Add"} ${product.name} to order`}
                        >
                          <span className="product-picker-image">
                            {product.thumbnailImage?.secureUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.thumbnailImage.secureUrl}
                                alt=""
                                loading="lazy"
                              />
                            ) : (
                              <ShoppingBag size={20} aria-hidden="true" />
                            )}
                          </span>

                          <span className="product-picker-details">
                            <strong>{product.name}</strong>
                            <span className="product-picker-meta">
                              {product.sku && (
                                <span>SKU: {product.sku} · </span>
                              )}
                              <span>
                                {product.trackInventory
                                  ? `${product.stock} in stock`
                                  : "Stock untracked"}
                              </span>
                            </span>
                          </span>

                          <strong className="product-picker-price">
                            {formatCurrency(product.price)}
                          </strong>

                          <span className="product-picker-add">
                            <Plus size={15} aria-hidden="true" />
                            {selectedQty ? "Add another" : "Add"}
                          </span>
                        </button>

                        {selectedQty > 0 && (
                          <div className="product-picker-actions">
                            <div className="modal-qty-control">
                              <button
                                type="button"
                                aria-label={`Decrease ${product.name} quantity`}
                                onClick={() =>
                                  changeQuantity(product.id, selectedQty - 1)
                                }
                                disabled={selectedQty <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span aria-live="polite">{selectedQty}</span>
                              <button
                                type="button"
                                aria-label={`Increase ${product.name} quantity`}
                                onClick={() => addProduct(product)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="modal-footer">
              <span>{lines.length} items added to order</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
