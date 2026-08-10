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
  projectId,
  submitting = false,
  mode = "purchase",
  onClose,
  onSubmit,
}: PackagePurchaseModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [note, setNote] = useState("");

  if (!open || !plan) return null;

  const selectedMethod = paymentMethods.find(
    (method) => method.code === paymentMethod,
  );
  const isWallet = ["bkash", "nagad", "rocket"].includes(paymentMethod);

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
              03 / Sender information
            </div>
            <div className="package-modal-grid">
              <label>
                Sender name
                <input
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  required
                />
              </label>
              <label>
                Sender phone
                <input
                  value={senderPhone}
                  onChange={(event) => setSenderPhone(event.target.value)}
                  required
                />
              </label>
              <label>
                Sender email
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(event) => setSenderEmail(event.target.value)}
                  required
                />
              </label>
            </div>
            <label>
              Sender address
              <input
                value={senderAddress}
                onChange={(event) => setSenderAddress(event.target.value)}
                required
              />
            </label>
            <label>
              Note
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
              />
            </label>
          </section>
          <small className="package-modal-warning">
            {isWallet
              ? "Use the receiving wallet details above, then enter the transaction ID."
              : "Never enter card CVV, PIN, passwords, or other payment authentication secrets."}
          </small>
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
