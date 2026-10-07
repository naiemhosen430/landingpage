"use client";

import { FormEvent, useState } from "react";

interface PaymentMethod {
  code: string;
  name: string;
  description?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  instructions?: string;
}

interface PackagePurchaseModalProps {
  open: boolean;
  plan: any;
  paymentMethods: PaymentMethod[];
  user?: Record<string, any> | null;
  projectId?: string;
  submitting?: boolean;
  mode?: "purchase" | "renew";
  onClose: () => void;
  onSubmit: (payload: Record<string, any>) => void;
}

export default function PackagePurchaseModal({
  open,
  plan,
  paymentMethods,
  user,
  projectId,
  submitting = false,
  mode = "purchase",
  onClose,
  onSubmit,
}: PackagePurchaseModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");

  if (!open || !plan) return null;

  const profile = user?.data ?? user;
  const senderName =
    typeof profile?.name === "string"
      ? profile.name
      : typeof profile?.fullName === "string"
        ? profile.fullName
        : "";
  const senderEmail =
    typeof profile?.email === "string" ? profile.email : "";
  const senderPhone =
    typeof profile?.phone === "string"
      ? profile.phone
      : typeof profile?.phoneNumber === "string"
        ? profile.phoneNumber
        : "";
  const senderAddress =
    typeof profile?.address === "string" ? profile.address : "";
  const selectedMethod = paymentMethods.find(
    (method) => method.code === paymentMethod,
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      projectId,
      packageId: plan._id ?? plan.id,
      paymentMethod,
      paymentDetails: {
        bankName: selectedMethod?.bankName,
        branchName: selectedMethod?.branchName,
        accountName: selectedMethod?.accountName,
        accountNumber: selectedMethod?.accountNumber,
        routingNumber: selectedMethod?.routingNumber,
      },
      transactionId,
      senderName,
      senderPhone,
      senderEmail,
      senderAddress,
      note,
    });
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-modal-title"
    >
      <form className="modal package-purchase-modal" onSubmit={submit}>
        <div className="package-modal-hero">
          <div>
            <h3 id="package-modal-title">
              {mode === "renew"
                ? "Renew your package"
                : "Complete your package purchase"}
            </h3>
          </div>
          <button
            type="button"
            className="package-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="package-modal-body">
          <div className="package-modal-plan">
            <div>
              <span>Selected plan</span>
              <strong>{plan.name ?? plan.label}</strong>
            </div>
            <strong>
              {plan.price ?? 0}{" "}
              <small>/ {plan.billingCycle ?? "monthly"}</small>
            </strong>
          </div>
          <section className="package-modal-section">
            <div className="package-modal-section-title">
              01 / Choose payment method
            </div>
            <select
              className="package-modal-select"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              required
            >
              {paymentMethods.length ? (
                paymentMethods.map((method) => (
                  <option key={method.code} value={method.code}>
                    {method.name}
                  </option>
                ))
              ) : (
                <option value="bank_transfer">Bank Transfer</option>
              )}
            </select>
            {selectedMethod && (
              <div className="payment-method-details">
                <strong>{selectedMethod.name}</strong>
                {selectedMethod.description && (
                  <span>{selectedMethod.description}</span>
                )}
                {selectedMethod.bankName && (
                  <span>Bank: {selectedMethod.bankName}</span>
                )}
                {selectedMethod.branchName && (
                  <span>Branch: {selectedMethod.branchName}</span>
                )}
                {selectedMethod.accountName && (
                  <span>Account name: {selectedMethod.accountName}</span>
                )}
                {selectedMethod.accountNumber && (
                  <span>Account number: {selectedMethod.accountNumber}</span>
                )}
                {selectedMethod.routingNumber && (
                  <span>Routing number: {selectedMethod.routingNumber}</span>
                )}
                {selectedMethod.instructions && (
                  <span>{selectedMethod.instructions}</span>
                )}
              </div>
            )}
          </section>
          <section className="package-modal-section">
            <div className="package-modal-section-title">
              02 / Payment reference
            </div>
            <label>
              Transaction ID
              <input
                value={transactionId}
                onChange={(event) => setTransactionId(event.target.value)}
                required
              />
            </label>
          </section>
          <section className="package-modal-section">
            <div className="package-modal-section-title">
              03 / Your account information
            </div>
            <div className="payment-method-details">
              {senderName && <span>Name: {senderName}</span>}
              {senderEmail && <span>Email: {senderEmail}</span>}
              {senderPhone && <span>Phone: {senderPhone}</span>}
              {senderAddress && <span>Address: {senderAddress}</span>}
              {!senderName && !senderEmail && !senderPhone && !senderAddress && (
                <span>
                  Account details are unavailable. Update your profile if needed.
                </span>
              )}
            </div>
            <label>
              Note (optional)
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
              />
            </label>
          </section>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit payment request"}
          </button>
        </div>
      </form>
    </div>
  );
}
