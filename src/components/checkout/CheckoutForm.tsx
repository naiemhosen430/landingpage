"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateIncompleteOrderMutation,
  usePlaceOrderMutation,
  useTrackAnalyticsEventMutation,
  useUpdateIncompleteOrderMutation,
} from "@/store/publicApi";
import { formatCurrency } from "@/lib/utils";
import { trackStorefrontEvent } from "@/lib/tracking";
import type {
  PublicDeliveryArea,
  PublicLandingPageData,
  PublicPaymentMethod,
} from "@/lib/landingPage";

// Import the raw CSS file in your layout or page:
import "./checkout-modern-light.css";

type PublicProduct = PublicLandingPageData["products"][number];

type PublicVariant = {
  id?: string;
  name?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
};

type Selection = {
  product: PublicProduct;
  variantId?: string;
  quantity: number;
  isSelected: boolean;
};

interface CheckoutFormProps {
  products: PublicProduct[];
  deliveryCharge?: number;
  deliveryArea?: PublicDeliveryArea | null;
  paymentMethods?: PublicPaymentMethod[];
  codCharge?: number;
  onClear?: () => void;
}

const variantsOf = (product: PublicProduct): PublicVariant[] =>
  (Array.isArray(product.variants) ? product.variants : []) as PublicVariant[];

const availableVariantsOf = (product: PublicProduct) =>
  variantsOf(product).filter(
    (variant) => variant.isActive !== false && (variant.stock ?? 1) > 0,
  );

const priceOf = (selection: Selection) => {
  const variant = variantsOf(selection.product).find(
    (item) => item.id === selection.variantId,
  );
  return Number(variant?.price ?? selection.product.price) || 0;
};

const createSelection = (product: PublicProduct): Selection => ({
  product,
  variantId: availableVariantsOf(product)[0]?.id,
  quantity: 1,
  isSelected: false,
});

const isValidPhone = (phone: string) =>
  /^[+]?[0-9\s-]{10,15}$/.test(phone.trim());

export default function CheckoutForm({
  products,
  deliveryCharge = 60,
  deliveryArea,
  paymentMethods = [],
  codCharge = 0,
  onClear,
}: CheckoutFormProps) {
  const router = useRouter();

  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [trackAnalyticsEvent] = useTrackAnalyticsEventMutation();
  const [createIncompleteOrder] = useCreateIncompleteOrderMutation();
  const [updateIncompleteOrder] = useUpdateIncompleteOrderMutation();
  const incompleteOrderId = useRef<string | null>(null);
  const hasPlacedOrder = useRef(false);
  const hasTrackedInitialEvents = useRef(false);
  const previousSelectedIds = useRef<string[]>([]);

  const availableProducts = products;

  const paymentOptions = paymentMethods.filter(
    (method) => method.isActive !== false,
  );

  const activePaymentMethods = paymentOptions.length
    ? paymentOptions
    : [{ id: "cod", code: "cod", name: "Cash on Delivery" }];

  // Initialize ALL products so controls are always visible.
  // Pre-select the first product only.
  const [selectedItems, setSelectedItems] = useState<Selection[]>(() =>
    availableProducts.map((product, index) => ({
      ...createSelection(product),
      isSelected: index === 0,
    })),
  );

  const [formValues, setFormValues] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    orderNotes: "",
    selectedPaymentMethod: activePaymentMethods[0].code,
    selectedDeliveryZone: deliveryArea?.zones?.[0]?.zone ?? "",
  });

  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleToggleProductSelection = (product: PublicProduct) => {
    setSelectedItems((current) =>
      current.map((selection) =>
        selection.product.id === product.id
          ? { ...selection, isSelected: !selection.isSelected }
          : selection,
      ),
    );
  };

  const handleUpdateProductSelection = (
    product: PublicProduct,
    changes: Partial<Omit<Selection, "product">>,
  ) => {
    setSelectedItems((current) =>
      current.map((selection) =>
        selection.product.id === product.id
          ? { ...selection, ...changes }
          : selection,
      ),
    );
  };

  const matchedDeliveryZone = deliveryArea?.zones?.find(
    (zone) => zone.zone === formValues.selectedDeliveryZone,
  );

  const computedDeliveryCost =
    matchedDeliveryZone?.price ??
    deliveryArea?.price ??
    deliveryArea?.deliveryCharge ??
    deliveryCharge;

  const selectedCount = selectedItems.filter((item) => item.isSelected).length;

  const orderSubtotal = selectedItems
    .filter((item) => item.isSelected)
    .reduce((sum, item) => sum + priceOf(item) * item.quantity, 0);

  const orderTotalAmount =
    orderSubtotal +
    computedDeliveryCost +
    (formValues.selectedPaymentMethod === "cod" ? codCharge : 0);

  const trackingContext = {
    url: typeof window === "undefined" ? undefined : window.location.href,
    currency: "BDT",
  };
  const trackingPageKey =
    typeof window === "undefined" ? "landing" : window.location.pathname;

  const trackCheckoutEvent = (
    eventType:
      | "page_view"
      | "product_view"
      | "add_to_cart"
      | "checkout_started",
    eventName: string,
    payload: Record<string, unknown>,
    dedupeKey: string,
  ) => {
    trackStorefrontEvent(
      {
        eventType,
        eventName,
        payload: { ...trackingContext, ...payload },
        url: trackingContext.url,
      },
      dedupeKey,
      trackAnalyticsEvent,
    );
  };

  useEffect(() => {
    if (hasTrackedInitialEvents.current || !availableProducts.length) return;
    hasTrackedInitialEvents.current = true;
    const firstProduct = selectedItems.find((item) => item.isSelected)?.product;
    trackCheckoutEvent(
      "page_view",
      "page_view",
      {},
      `landing-page-view-${trackingPageKey}`,
    );
    trackCheckoutEvent(
      "product_view",
      "view_content",
      {
        contentIds: firstProduct ? [firstProduct.id] : [],
        contentName: firstProduct?.name,
        contentType: "product",
      },
      `landing-view-content-${trackingPageKey}`,
    );
    trackCheckoutEvent(
      "add_to_cart",
      "add_to_cart",
      {
        contentIds: firstProduct ? [firstProduct.id] : [],
        contentName: firstProduct?.name,
        quantity: 1,
        value: firstProduct ? Number(firstProduct.price) || 0 : 0,
      },
      `landing-initial-add-to-cart-${trackingPageKey}`,
    );
    trackCheckoutEvent(
      "checkout_started",
      "checkout_started",
      {
        value: orderTotalAmount,
        contentIds: firstProduct ? [firstProduct.id] : [],
      },
      `landing-initial-checkout-${trackingPageKey}`,
    );
    previousSelectedIds.current = selectedItems
      .filter((item) => item.isSelected)
      .map((item) => item.product.id);
  }, [availableProducts.length, orderTotalAmount, selectedItems]);

  useEffect(() => {
    if (!hasTrackedInitialEvents.current) return;
    const selectedIds = selectedItems
      .filter((item) => item.isSelected)
      .map((item) => item.product.id);
    const addedId = selectedIds.find(
      (id) => !previousSelectedIds.current.includes(id),
    );
    if (addedId) {
      const added = selectedItems.find((item) => item.product.id === addedId);
      if (added) {
        trackCheckoutEvent(
          "add_to_cart",
          "add_to_cart",
          {
            contentIds: [added.product.id],
            contentName: added.product.name,
            quantity: added.quantity,
            price: priceOf(added),
            value: priceOf(added) * added.quantity,
          },
          `landing-add-to-cart-${added.product.id}-${added.quantity}`,
        );
      }
    }
    previousSelectedIds.current = selectedIds;
  }, [selectedItems]);

  const buildIncompleteOrderData = () => ({
    customer: {
      name: formValues.customerName || undefined,
      phone: formValues.customerPhone,
      address: formValues.deliveryAddress || undefined,
    },
    items: selectedItems
      .filter((item) => item.isSelected)
      .map((item) => ({
        productId: item.product.id,
        ...(item.variantId ? { variantId: item.variantId } : {}),
        quantity: item.quantity,
      })),
    notes: formValues.orderNotes || undefined,
    paymentMethod: formValues.selectedPaymentMethod || undefined,
    shippingMethod: "standard",
    deliveryZone: formValues.selectedDeliveryZone || undefined,
  });

  useEffect(() => {
    if (!isValidPhone(formValues.customerPhone) || incompleteOrderId.current) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const response = await createIncompleteOrder({
          phone: formValues.customerPhone.trim(),
        }).unwrap();
        incompleteOrderId.current = response?.data?.id ?? response?.id ?? null;
        if (incompleteOrderId.current) {
          await updateIncompleteOrder({
            id: incompleteOrderId.current,
            data: buildIncompleteOrderData(),
          }).unwrap();
        }
      } catch {
        // A failed draft save must not block the normal checkout flow.
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [createIncompleteOrder, formValues.customerPhone]);

  useEffect(() => {
    const orderId = incompleteOrderId.current;
    if (!orderId || !isValidPhone(formValues.customerPhone)) return;

    const timer = window.setTimeout(() => {
      updateIncompleteOrder({
        id: orderId,
        data: buildIncompleteOrderData(),
      }).catch(() => undefined);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [formValues, selectedItems, updateIncompleteOrder]);

  useEffect(() => {
    const saveDraftOnLeave = () => {
      const orderId = incompleteOrderId.current;
      if (
        !orderId ||
        hasPlacedOrder.current ||
        !isValidPhone(formValues.customerPhone)
      ) {
        return;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
      const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY;
      if (!apiBase) return;

      void fetch(
        `${apiBase}/public/v1/orders/incomplete/${encodeURIComponent(orderId)}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            "x-project-id": projectId ?? "",
            "x-project-key": projectKey ?? "",
          },
          body: JSON.stringify(buildIncompleteOrderData()),
          keepalive: true,
        },
      ).catch(() => undefined);
    };

    window.addEventListener("pagehide", saveDraftOnLeave);
    return () => window.removeEventListener("pagehide", saveDraftOnLeave);
  }, [formValues, selectedItems]);

  const validateCheckoutForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formValues.customerName.trim())
      nextErrors.customerName = "Full name is required";
    if (!formValues.customerPhone.trim())
      nextErrors.customerPhone = "Phone is required";
    if (!formValues.deliveryAddress.trim())
      nextErrors.deliveryAddress = "Address is required";
    setFormValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateCheckoutForm() || selectedCount === 0) return;

    try {
      hasPlacedOrder.current = true;
      const result = await placeOrder({
        items: selectedItems
          .filter((item) => item.isSelected)
          .map((item) => ({
            productId: item.product.id,
            ...(item.variantId ? { variantId: item.variantId } : {}),
            quantity: item.quantity,
          })),
        customer: {
          name: formValues.customerName,
          phone: formValues.customerPhone,
          address: formValues.deliveryAddress,
        },
        notes: formValues.orderNotes || undefined,
        paymentMethod: formValues.selectedPaymentMethod,
        shippingMethod: "standard",
        deliveryZone: formValues.selectedDeliveryZone || undefined,
      }).unwrap();

      onClear?.();
      router.push(`/thank-you/${result.data?.id || result.id || ""}`);
    } catch (error: any) {
      alert(error?.data?.message || "Failed to place order");
    }
  };

  if (!availableProducts.length) {
    return (
      <div className="checkout-form-modern-light">
        <div className="checkout-form-modern-light__wrapper">
          <div className="checkout-form-modern-light__empty-state">
            No products are available right now.
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="checkout-form-modern-light"
      onSubmit={handlePlaceOrderSubmit}
    >
      {/* Section 1: Product Selection */}
      <section className="checkout-form-modern-light__section-card">
        <div className="checkout-form-modern-light__product-list">
          {availableProducts.map((product) => {
            const selection = selectedItems.find(
              (s) => s.product.id === product.id,
            );
            const isProductSelected = selection?.isSelected ?? false;
            const productVariants = availableVariantsOf(product);

            return (
              <div
                className={[
                  "checkout-form-modern-light__product-card",
                  isProductSelected
                    ? "checkout-form-modern-light__product-card--selected"
                    : "",
                ].join(" ")}
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => handleToggleProductSelection(product)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleToggleProductSelection(product);
                  }
                }}
              >
                <label
                  className="checkout-form-modern-light__product-card-inner"
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="checkout-form-modern-light__product-checkbox"
                    checked={isProductSelected}
                    onChange={() => handleToggleProductSelection(product)}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <span className="checkout-form-modern-light__product-thumbnail-wrapper">
                    {product.thumbnailImage?.secureUrl ||
                    product.thumbnailImage?.url ? (
                      <img
                        src={
                          product.thumbnailImage.secureUrl ??
                          product.thumbnailImage.url
                        }
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : null}
                  </span>
                  <span className="checkout-form-modern-light__product-info-row">
                    <strong className="checkout-form-modern-light__product-name-text">
                      {product.name}
                    </strong>
                    <span className="checkout-form-modern-light__product-price-text">
                      {formatCurrency(
                        selection
                          ? priceOf(selection)
                          : Number(product.price) || 0,
                      )}
                    </span>
                  </span>
                </label>

                {/* Controls always visible */}
                <div
                  className="checkout-form-modern-light__product-controls-panel"
                  onClick={(event) => {
                    // Only block card toggle when already selected.
                    // When not selected, let the click bubble so the card
                    // selects itself first.
                    if (isProductSelected) {
                      event.stopPropagation();
                    }
                  }}
                >
                  {productVariants.length > 0 && (
                    <select
                      className="checkout-form-modern-light__variant-dropdown"
                      aria-label={`${product.name} variant`}
                      value={selection?.variantId ?? ""}
                      onChange={(event) =>
                        handleUpdateProductSelection(product, {
                          variantId: event.target.value,
                        })
                      }
                    >
                      {productVariants.map((variant, index) => (
                        <option
                          key={variant.id ?? index}
                          value={variant.id ?? ""}
                        >
                          {variant.name || `Option ${index + 1}`} —{" "}
                          {formatCurrency(Number(variant.price) || 0)}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="checkout-form-modern-light__quantity-stepper">
                    <button
                      type="button"
                      className="checkout-form-modern-light__quantity-stepper-button"
                      aria-label={`Decrease ${product.name} quantity`}
                      onClick={() =>
                        handleUpdateProductSelection(product, {
                          quantity: Math.max(1, (selection?.quantity ?? 1) - 1),
                        })
                      }
                    >
                      −
                    </button>
                    <span className="checkout-form-modern-light__quantity-stepper-value">
                      {selection?.quantity ?? 1}
                    </span>
                    <button
                      type="button"
                      className="checkout-form-modern-light__quantity-stepper-button"
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() =>
                        handleUpdateProductSelection(product, {
                          quantity: (selection?.quantity ?? 1) + 1,
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="checkout-form-modern-light__wrapper">
        <div className="checkout-form-modern-light__grid-container">
          {/* ---------- Main Content ---------- */}
          <div className="checkout-form-modern-light__main-content">
            {/* Section 3: Customer Details */}
            <section className="checkout-form-modern-light__section-card">
              <div className="checkout-form-modern-light__fields-grid-two-col">
                <div className="checkout-form-modern-light__form-group">
                  <label className="checkout-form-modern-light__form-label">
                    Full name{" "}
                    <span className="checkout-form-modern-light__form-label-optional">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    className="checkout-form-modern-light__form-input"
                    value={formValues.customerName}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        customerName: event.target.value,
                      })
                    }
                    placeholder="Your full name"
                  />
                  {formValidationErrors.customerName && (
                    <div className="checkout-form-modern-light__form-error-message">
                      {formValidationErrors.customerName}
                    </div>
                  )}
                </div>

                <div className="checkout-form-modern-light__form-group">
                  <label className="checkout-form-modern-light__form-label">
                    Phone{" "}
                    <span className="checkout-form-modern-light__form-label-optional">
                      *
                    </span>
                  </label>
                  <input
                    type="tel"
                    className="checkout-form-modern-light__form-input"
                    value={formValues.customerPhone}
                    onChange={(event) =>
                      setFormValues({
                        ...formValues,
                        customerPhone: event.target.value,
                      })
                    }
                    placeholder="01XXXXXXXXX"
                  />
                  {formValidationErrors.customerPhone && (
                    <div className="checkout-form-modern-light__form-error-message">
                      {formValidationErrors.customerPhone}
                    </div>
                  )}
                </div>
              </div>

              <div className="checkout-form-modern-light__form-group">
                <label className="checkout-form-modern-light__form-label">
                  Delivery address{" "}
                  <span className="checkout-form-modern-light__form-label-optional">
                    *
                  </span>
                </label>
                <textarea
                  className="checkout-form-modern-light__form-textarea"
                  rows={3}
                  value={formValues.deliveryAddress}
                  onChange={(event) =>
                    setFormValues({
                      ...formValues,
                      deliveryAddress: event.target.value,
                    })
                  }
                  placeholder="House, road, area"
                />
                {formValidationErrors.deliveryAddress && (
                  <div className="checkout-form-modern-light__form-error-message">
                    {formValidationErrors.deliveryAddress}
                  </div>
                )}
              </div>

              <div className="checkout-form-modern-light__form-group">
                <label className="checkout-form-modern-light__form-label">
                  Order note
                  <span className="checkout-form-modern-light__form-label-optional">
                    Optional
                  </span>
                </label>
                <textarea
                  className="checkout-form-modern-light__form-textarea"
                  rows={2}
                  value={formValues.orderNotes}
                  onChange={(event) =>
                    setFormValues({
                      ...formValues,
                      orderNotes: event.target.value,
                    })
                  }
                  placeholder="Any special instructions?"
                />
              </div>
            </section>

            {/* Section 2: Delivery & Payment */}
            <section className="checkout-form-modern-light__section-card">
              {deliveryArea?.zones?.length ? (
                <div className="checkout-form-modern-light__form-group">
                  <label className="checkout-form-modern-light__form-label">
                    Delivery area
                  </label>
                  <div className="checkout-form-modern-light__delivery-zones">
                    {deliveryArea.zones.map((zone) => (
                      <label
                        className={[
                          "checkout-form-modern-light__delivery-zone-card",
                          formValues.selectedDeliveryZone === zone.zone
                            ? "checkout-form-modern-light__delivery-zone-card--active"
                            : "",
                        ].join(" ")}
                        key={zone.zone}
                      >
                        <input
                          type="radio"
                          name="deliveryZone"
                          value={zone.zone}
                          className="checkout-form-modern-light__delivery-zone-radio"
                          checked={
                            formValues.selectedDeliveryZone === zone.zone
                          }
                          onChange={() =>
                            setFormValues({
                              ...formValues,
                              selectedDeliveryZone: zone.zone,
                            })
                          }
                        />
                        <span className="checkout-form-modern-light__delivery-zone-details">
                          <strong>{zone.zone}</strong>
                        </span>
                        <strong className="checkout-form-modern-light__delivery-zone-price">
                          {formatCurrency(zone.price)}
                        </strong>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="checkout-form-modern-light__form-group">
                <label className="checkout-form-modern-light__form-label">
                  Payment method
                </label>
                <div className="checkout-form-modern-light__payment-methods-list">
                  {activePaymentMethods.map((method) => (
                    <label
                      className={[
                        "checkout-form-modern-light__payment-method-card",
                        formValues.selectedPaymentMethod === method.code
                          ? "checkout-form-modern-light__payment-method-card--active"
                          : "",
                      ].join(" ")}
                      key={method.id}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="checkout-form-modern-light__payment-method-radio"
                        checked={
                          formValues.selectedPaymentMethod === method.code
                        }
                        onChange={() =>
                          setFormValues({
                            ...formValues,
                            selectedPaymentMethod: method.code,
                          })
                        }
                      />
                      <span className="checkout-form-modern-light__payment-method-details">
                        <strong className="checkout-form-modern-light__payment-method-name">
                          {method.name}
                        </strong>

                        {method.instructions &&
                          formValues.selectedPaymentMethod === method.code && (
                            <small className="checkout-form-modern-light__payment-method-instructions">
                              {method.instructions}
                            </small>
                          )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ---------- Order Summary Sidebar ---------- */}
          <aside className="checkout-form-modern-light__order-summary-sidebar">
            <h2 className="checkout-form-modern-light__order-summary-title">
              Order summary
            </h2>

            {selectedCount === 0 ? (
              <p className="checkout-form-modern-light__summary-empty-hint">
                Select a product to continue.
              </p>
            ) : (
              selectedItems
                .filter((item) => item.isSelected)
                .map((item) => (
                  <div
                    className="checkout-form-modern-light__summary-line-item"
                    key={item.product.id}
                  >
                    <span className="checkout-form-modern-light__summary-line-item-label">
                      {item.product.name} <small>x{item.quantity}</small>
                    </span>
                    <strong className="checkout-form-modern-light__summary-line-item-value">
                      {formatCurrency(priceOf(item) * item.quantity)}
                    </strong>
                  </div>
                ))
            )}

            <div className="checkout-form-modern-light__summary-line-item">
              <span className="checkout-form-modern-light__summary-line-item-label">
                Delivery
              </span>
              <strong className="checkout-form-modern-light__summary-line-item-value">
                {formatCurrency(computedDeliveryCost)}
              </strong>
            </div>

            {formValues.selectedPaymentMethod === "cod" && codCharge > 0 && (
              <div className="checkout-form-modern-light__summary-line-item">
                <span className="checkout-form-modern-light__summary-line-item-label">
                  COD charge
                </span>
                <strong className="checkout-form-modern-light__summary-line-item-value">
                  {formatCurrency(codCharge)}
                </strong>
              </div>
            )}

            <div className="checkout-form-modern-light__summary-total-row">
              <span>Total</span>
              <strong className="checkout-form-modern-light__summary-total-amount">
                {formatCurrency(orderTotalAmount)}
              </strong>
            </div>

            <button
              type="submit"
              className="checkout-form-modern-light__submit-order-button"
              disabled={isPlacingOrder || selectedCount === 0}
            >
              {isPlacingOrder ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Placing order…
                </>
              ) : (
                "Order now"
              )}
            </button>
          </aside>
        </div>
      </div>
    </form>
  );
}
