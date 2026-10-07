"use client";

import { notifyToast } from "@/lib/toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  usePlaceOrderMutation,
  useTrackAnalyticsEventMutation,
} from "@/store/publicApi";
import { formatCurrency } from "@/lib/utils";
import {
  initializeBrowserPixels,
  trackStorefrontEvent,
} from "@/lib/tracking";
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
  facebookPixelId?: string;
  tiktokPixelId?: string;
  currency?: string;
}

const variantsOf = (product: PublicProduct): PublicVariant[] =>
  (Array.isArray(product.variants) ? product.variants : []) as PublicVariant[];

const selectableVariantsOf = (product: PublicProduct) =>
  variantsOf(product).filter((variant) => variant.isActive !== false);

const priceOf = (selection: Selection) => {
  const variant = variantsOf(selection.product).find(
    (item) => item.id === selection.variantId,
  );
  return Number(variant?.price ?? selection.product.price) || 0;
};

const createSelection = (product: PublicProduct): Selection => ({
  product,
  variantId: selectableVariantsOf(product)[0]?.id,
  quantity: 1,
  isSelected: false,
});

const isValidPhone = (phone: string) => {
  const normalized = phone.trim().replace(/[\s-]/g, "");
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(normalized);
};

const paymentDetailLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function CheckoutForm({
  products,
  deliveryCharge = 60,
  deliveryArea,
  paymentMethods = [],
  codCharge = 0,
  onClear,
  facebookPixelId,
  tiktokPixelId,
  currency = "BDT",
}: CheckoutFormProps) {
  const router = useRouter();

  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const [trackAnalyticsEvent] = useTrackAnalyticsEventMutation();
  const hasPlacedOrder = useRef(false);
  const hasTrackedInitialEvents = useRef(false);
  const hasTrackedCheckoutStart = useRef(false);

  useEffect(() => {
    initializeBrowserPixels({ facebookPixelId, tiktokPixelId });
  }, [facebookPixelId, tiktokPixelId]);

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
    const selection = selectedItems.find(
      (item) => item.product.id === product.id,
    );
    setSelectedItems((current) =>
      current.map((selection) =>
        selection.product.id === product.id
          ? { ...selection, isSelected: !selection.isSelected }
          : selection,
      ),
    );
    if (selection && !selection.isSelected) {
      const price = priceOf(selection);
      trackCheckoutEvent(
          "add_to_cart",
          "add_to_cart",
          {
            contentIds: [product.id],
            contentName: product.name,
            contentType: "product",
            contents: [
              {
                id: product.id,
                content_name: product.name,
                quantity: selection.quantity,
                item_price: price,
              },
            ],
            quantity: selection.quantity,
            value: price * selection.quantity,
          },
          `landing-add-to-cart-${product.id}`,
      );
    }
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
      (event) => {
        void trackAnalyticsEvent(event);
      },
    );
  };

  useEffect(() => {
    if (
      hasTrackedInitialEvents.current ||
      !availableProducts.length ||
      trackingPageKey === "/checkout"
    ) {
      return;
    }
    hasTrackedInitialEvents.current = true;
    availableProducts.forEach((product) => {
      const price = Number(product.price) || 0;
      trackCheckoutEvent(
        "product_view",
        "view_content",
        {
          contentIds: [product.id],
          contentName: product.name,
          contentType: "product",
          contents: [
            {
              id: product.id,
              content_name: product.name,
              quantity: 1,
              item_price: price,
            },
          ],
          value: price,
        },
        `landing-view-content-${trackingPageKey}-${product.id}`,
      );
    });
  }, [availableProducts, trackingPageKey]);

  const trackCheckoutStarted = () => {
    if (hasTrackedCheckoutStart.current) return;
    hasTrackedCheckoutStart.current = true;
    const selected = selectedItems.filter((item) => item.isSelected);
    trackCheckoutEvent(
      "checkout_started",
      "checkout_started",
      {
        value: orderTotalAmount,
        contentIds: selected.map((item) => item.product.id),
        contents: selected.map((item) => ({
          id: item.product.id,
          content_name: item.product.name,
          quantity: item.quantity,
          item_price: priceOf(item),
        })),
        num_items: selected.reduce((sum, item) => sum + item.quantity, 0),
      },
      `landing-checkout-started-${trackingPageKey}`,
    );
  };

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
    const saveDraftOnLeave = () => {
      if (hasPlacedOrder.current || !isValidPhone(formValues.customerPhone)) {
        return;
      }

      void fetch("/api/incomplete-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...buildIncompleteOrderData(),
        }),
        keepalive: true,
      }).catch(() => undefined);
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
    else if (!isValidPhone(formValues.customerPhone))
      nextErrors.customerPhone = "Enter a valid Bangladesh mobile number";
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
      notifyToast(error?.data?.message || "Failed to place order", "error");
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
      className="checkout-form-modern-light space-y-6"
      onSubmit={handlePlaceOrderSubmit}
      onFocusCapture={(event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.hasAttribute("data-checkout-start")
        ) {
          trackCheckoutStarted();
        }
      }}
    >
      {/* Section 1: Product Selection (1 column on small screens, 2 columns on large screens) */}
      <section className="checkout-form-modern-light__section-card">
        <div className="checkout-form-modern-light__product-list grid grid-cols-1 lg:grid-cols-2 gap-4">
          {availableProducts.map((product) => {
            const selection = selectedItems.find(
              (s) => s.product.id === product.id,
            );
            const isProductSelected = selection?.isSelected ?? false;
            const productVariants = selectableVariantsOf(product);

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
                        currency,
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
                          {formatCurrency(Number(variant.price) || 0, currency)}
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

      {/* Main Layout Wrapper: Stacked (flex-col) on small screens, Side-by-Side on large screens (lg:flex-row) */}
      <div className="checkout-form-modern-light__wrapper">
        <div className="checkout-form-modern-light__grid-container flex flex-col lg:flex-row gap-6">
          {/* ---------- Form Fields (First on small screens, left side on large screens) ---------- */}
          <div className="checkout-form-modern-light__main-content flex-1 order-1">
            {/* Section 3: Customer Details */}
            <section className="checkout-form-modern-light__section-card mb-6">
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
                    data-checkout-start
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
                    data-checkout-start
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
                  data-checkout-start
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
                          {formatCurrency(zone.price, currency)}
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
                        {formValues.selectedPaymentMethod === method.code &&
                          Object.entries(method.details ?? {}).length > 0 && (
                            <span
                              style={{
                                display: "grid",
                                gap: 4,
                                marginTop: 8,
                                fontSize: 13,
                              }}
                            >
                              {Object.entries(method.details ?? {}).map(
                                ([key, value]) => (
                                  <span key={key}>
                                    <strong>{paymentDetailLabel(key)}:</strong>{" "}
                                    {value}
                                  </span>
                                ),
                              )}
                            </span>
                          )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ---------- Order Summary Sidebar (Placed last on small screens via order-2) ---------- */}
          <aside className="checkout-form-modern-light__order-summary-sidebar w-full lg:w-80 order-2">
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
                      {formatCurrency(priceOf(item) * item.quantity, currency)}
                    </strong>
                  </div>
                ))
            )}

            <div className="checkout-form-modern-light__summary-line-item">
              <span className="checkout-form-modern-light__summary-line-item-label">
                Delivery
              </span>
              <strong className="checkout-form-modern-light__summary-line-item-value">
                {formatCurrency(computedDeliveryCost, currency)}
              </strong>
            </div>

            {formValues.selectedPaymentMethod === "cod" && codCharge > 0 && (
              <div className="checkout-form-modern-light__summary-line-item">
                <span className="checkout-form-modern-light__summary-line-item-label">
                  COD charge
                </span>
                <strong className="checkout-form-modern-light__summary-line-item-value">
                  {formatCurrency(codCharge, currency)}
                </strong>
              </div>
            )}

            <div className="checkout-form-modern-light__summary-total-row">
              <span>Total</span>
              <strong className="checkout-form-modern-light__summary-total-amount">
                {formatCurrency(orderTotalAmount, currency)}
              </strong>
            </div>

            <button
              type="submit"
              className="checkout-form-modern-light__submit-order-button w-full"
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
