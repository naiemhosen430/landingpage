     import React from "react";
import "./checkout-modern-light.css";

export default function CheckoutForm({
  products = [],
  selectedProducts = {},
  onToggleProduct,
  onUpdateVariant,
  onUpdateQuantity,
  deliveryZones = [],
  selectedDeliveryZone,
  onSelectDeliveryZone,
  paymentMethods = [],
  selectedPaymentMethod,
  onSelectPaymentMethod,
  formData = {},
  onInputChange,
  formErrors = {},
  subtotal = 0,
  shippingFee = 0,
  grandTotal = 0,
  isSubmitting = false,
  onSubmitOrder,
}) {
  return (
    <div className="checkout-form-modern-light">
      <div className="checkout-form-modern-light__wrapper">
        <form onSubmit={onSubmitOrder} className="checkout-form-modern-light__grid-container">
          
          {/* MAIN FORM SECTIONS */}
          <div className="checkout-form-modern-light__main-content">
            
            {/* STEP 1: PRODUCTS */}
            <div className="checkout-form-modern-light__section-card">
              <div className="checkout-form-modern-light__section-header">
                <div className="checkout-form-modern-light__section-header-group">
                  <div className="checkout-form-modern-light__step-indicator">1</div>
                  <div>
                    <h2 className="checkout-form-modern-light__section-title">Select Items</h2>
                    <p className="checkout-form-modern-light__section-description">
                      Choose products and set variants/quantities
                    </p>
                  </div>
                </div>
                <span className="checkout-form-modern-light__selected-count-badge">
                  {Object.keys(selectedProducts).length} Selected
                </span>
              </div>

              {products.length === 0 ? (
                <div className="checkout-form-modern-light__empty-state">
                  No products available.
                </div>
              ) : (
                <div className="checkout-form-modern-light__product-list">
                  {products.map((prod) => {
                    const isSelected = !!selectedProducts[prod.id];
                    const itemState = selectedProducts[prod.id];

                    return (
                      <div
                        key={prod.id}
                        className={`checkout-form-modern-light__product-card ${
                          isSelected ? "checkout-form-modern-light__product-card--selected" : ""
                        }`}
                      >
                        <div
                          className="checkout-form-modern-light__product-card-inner"
                          onClick={() => onToggleProduct && onToggleProduct(prod.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Controlled via card click
                            className="checkout-form-modern-light__product-checkbox"
                          />
                          {prod.image && (
                            <div className="checkout-form-modern-light__product-thumbnail-wrapper">
                              <img src={prod.image} alt={prod.name} />
                            </div>
                          )}
                          <div className="checkout-form-modern-light__product-info-row">
                            <span className="checkout-form-modern-light__product-name-text">
                              {prod.name}
                            </span>
                            <span className="checkout-form-modern-light__product-price-text">
                              ${Number(prod.price || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {isSelected && itemState && (
                          <div className="checkout-form-modern-light__product-controls-panel">
                            {prod.variants && prod.variants.length > 0 && (
                              <select
                                className="checkout-form-modern-light__variant-dropdown"
                                value={itemState.variant || ""}
                                onChange={(e) =>
                                  onUpdateVariant && onUpdateVariant(prod.id, e.target.value)
                                }
                              >
                                {prod.variants.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            )}

                            <div className="checkout-form-modern-light__quantity-stepper">
                              <button
                                type="button"
                                className="checkout-form-modern-light__quantity-stepper-button"
                                onClick={() =>
                                  onUpdateQuantity && onUpdateQuantity(prod.id, -1)
                                }
                              >
                                -
                              </button>
                              <span className="checkout-form-modern-light__quantity-stepper-value">
                                {itemState.quantity || 1}
                              </span>
                              <button
                                type="button"
                                className="checkout-form-modern-light__quantity-stepper-button"
                                onClick={() =>
                                  onUpdateQuantity && onUpdateQuantity(prod.id, 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 2: SHIPPING INFORMATION */}
            <div className="checkout-form-modern-light__section-card">
              <div className="checkout-form-modern-light__section-header">
                <div className="checkout-form-modern-light__section-header-group">
                  <div className="checkout-form-modern-light__step-indicator">2</div>
                  <div>
                    <h2 className="checkout-form-modern-light__section-title">Shipping Details</h2>
                    <p className="checkout-form-modern-light__section-description">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
              </div>

              <div className="checkout-form-modern-light__fields-grid-two-col">
                <div className="checkout-form-modern-light__form-group">
                  <label className="checkout-form-modern-light__form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="checkout-form-modern-light__form-input"
                    value={formData.fullName || ""}
                    onChange={onInputChange}
                    placeholder="John Doe"
                    required
                  />
                  {formErrors.fullName && (
                    <span className="checkout-form-modern-light__form-error-message">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>
                <div className="checkout-form-modern-light__form-group">
                  <label className="checkout-form-modern-light__form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="checkout-form-modern-light__form-input"
                    value={formData.email || ""}
                    onChange={onInputChange}
                    placeholder="john@example.com"
                    required
                  />
                  {formErrors.email && (
                    <span className="checkout-form-modern-light__form-error-message">
                      {formErrors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="checkout-form-modern-light__form-group">
                <label className="checkout-form-modern-light__form-label">Street Address</label>
                <input
                  type="text"
                  name="address"
                  className="checkout-form-modern-light__form-input"
                  value={formData.address || ""}
                  onChange={onInputChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
                {formErrors.address && (
                  <span className="checkout-form-modern-light__form-error-message">
                    {formErrors.address}
                  </span>
                )}
              </div>

              <div className="checkout-form-modern-light__form-group">
                <label className="checkout-form-modern-light__form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="checkout-form-modern-light__form-input"
                  value={formData.city || ""}
                  onChange={onInputChange}
                  placeholder="New York"
                  required
                />
                {formErrors.city && (
                  <span className="checkout-form-modern-light__form-error-message">
                    {formErrors.city}
                  </span>
                )}
              </div>

              <div className="checkout-form-modern-light__form-group">
                <label className="checkout-form-modern-light__form-label">
                  Order Notes
                  <span className="checkout-form-modern-light__form-label-optional">(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  className="checkout-form-modern-light__form-textarea"
                  value={formData.notes || ""}
                  onChange={onInputChange}
                  placeholder="Special instructions for delivery..."
                />
              </div>
            </div>

            {/* STEP 3: DELIVERY ZONES */}
            {deliveryZones.length > 0 && (
              <div className="checkout-form-modern-light__section-card">
                <div className="checkout-form-modern-light__section-header">
                  <div className="checkout-form-modern-light__section-header-group">
                    <div className="checkout-form-modern-light__step-indicator">3</div>
                    <div>
                      <h2 className="checkout-form-modern-light__section-title">Delivery Method</h2>
                      <p className="checkout-form-modern-light__section-description">
                        Select your preferred shipping option
                      </p>
                    </div>
                  </div>
                </div>

                <div className="checkout-form-modern-light__delivery-zones">
                  {deliveryZones.map((zone) => (
                    <label
                      key={zone.id}
                      className={`checkout-form-modern-light__delivery-zone-card ${
                        selectedDeliveryZone === zone.id
                          ? "checkout-form-modern-light__delivery-zone-card--active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryZone"
                        value={zone.id}
                        checked={selectedDeliveryZone === zone.id}
                        onChange={() => onSelectDeliveryZone && onSelectDeliveryZone(zone.id)}
                        className="checkout-form-modern-light__delivery-zone-radio"
                      />
                      <div className="checkout-form-modern-light__delivery-zone-details">
                        <strong>{zone.name}</strong>
                        {zone.time && <span>{zone.time}</span>}
                      </div>
                      <span className="checkout-form-modern-light__delivery-zone-price">
                        ${Number(zone.price || 0).toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT METHODS */}
            {paymentMethods.length > 0 && (
              <div className="checkout-form-modern-light__section-card">
                <div className="checkout-form-modern-light__section-header">
                  <div className="checkout-form-modern-light__section-header-group">
                    <div className="checkout-form-modern-light__step-indicator">4</div>
                    <div>
                      <h2 className="checkout-form-modern-light__section-title">Payment Method</h2>
                      <p className="checkout-form-modern-light__section-description">
                        Choose how you want to pay
                      </p>
                    </div>
                  </div>
                </div>

                <div className="checkout-form-modern-light__payment-methods-list">
                  {paymentMethods.map((pay) => (
                    <label
                      key={pay.id}
                      className={`checkout-form-modern-light__payment-method-card ${
                        selectedPaymentMethod === pay.id
                          ? "checkout-form-modern-light__payment-method-card--active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pay.id}
                        checked={selectedPaymentMethod === pay.id}
                        onChange={() => onSelectPaymentMethod && onSelectPaymentMethod(pay.id)}
                        className="checkout-form-modern-light__payment-method-radio"
                      />
                      <div className="checkout-form-modern-light__payment-method-details">
                        <span className="checkout-form-modern-light__payment-method-name">
                          {pay.name}
                        </span>
                        {pay.description && (
                          <span className="checkout-form-modern-light__payment-method-description">
                            {pay.description}
                          </span>
                        )}
                        {pay.instructions && selectedPaymentMethod === pay.id && (
                          <div className="checkout-form-modern-light__payment-method-instructions">
                            {pay.instructions}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <aside className="checkout-form-modern-light__order-summary-sidebar">
            <h2 className="checkout-form-modern-light__order-summary-title">Order Summary</h2>

            {Object.keys(selectedProducts).length === 0 ? (
              <p className="checkout-form-modern-light__summary-empty-hint">
                No items selected yet.
              </p>
            ) : (
              <>
                <div className="checkout-form-modern-light__summary-line-item">
                  <span className="checkout-form-modern-light__summary-line-item-label">
                    Subtotal
                  </span>
                  <span className="checkout-form-modern-light__summary-line-item-value">
                    ${Number(subtotal).toFixed(2)}
                  </span>
                </div>

                <div className="checkout-form-modern-light__summary-line-item">
                  <span className="checkout-form-modern-light__summary-line-item-label">
                    Shipping
                  </span>
                  <span className="checkout-form-modern-light__summary-line-item-value">
                    ${Number(shippingFee).toFixed(2)}
                  </span>
                </div>

                <div className="checkout-form-modern-light__summary-total-row">
                  <span>Total</span>
                  <span className="checkout-form-modern-light__summary-total-amount">
                    ${Number(grandTotal).toFixed(2)}
                  </span>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(selectedProducts).length === 0}
              className="checkout-form-modern-light__submit-order-button"
            >
              {isSubmitting ? "Processing..." : "Complete Order"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}               
