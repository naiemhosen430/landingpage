"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import PackagePurchaseModal from "@/components/dashboard/PackagePurchaseModal";
import Toast from "@/components/ui/Toast";
import { useGetMeQuery } from "@/store/authApi";
import {
  useCancelSubscriptionMutation,
  useCreatePurchaseRequestMutation,
  useGetActivePackagesQuery,
  useGetMySubscriptionQuery,
  useGetPaymentMethodsQuery,
  useRenewSubscriptionMutation,
  useToggleAutoRenewMutation,
} from "@/store/packageApi";

const asList = (value: any, keys: string[] = []) => {
  if (Array.isArray(value)) return value;
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key];
  }
  return [];
};

const titleize = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"current" | "usage" | "features">(
    "current",
  );
  const [toast, setToast] = useState({
    message: "",
    type: "success" as "success" | "error",
  });
  const { data: user } = useGetMeQuery(undefined);
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    refetch,
  } = useGetMySubscriptionQuery({ packagedata: user?.package });
  const { data: packagesData, isLoading: packagesLoading } =
    useGetActivePackagesQuery({ page: 1, limit: 100 });
  const { data: paymentMethodsData } = useGetPaymentMethodsQuery();
  const [createPurchaseRequest, { isLoading: purchasing }] =
    useCreatePurchaseRequestMutation();
  const [renewSubscription, { isLoading: renewing }] =
    useRenewSubscriptionMutation();
  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();
  const [toggleAutoRenew, { isLoading: toggling }] =
    useToggleAutoRenewMutation();

  const subscriptions = useMemo(
    () => asList(subscriptionData, ["subscriptions", "data"]),
    [subscriptionData],
  );
  const currentSubscription = useMemo(() => {
    if (Array.isArray(subscriptionData)) {
      return (
        subscriptionData.find(
          (item: any) => item.status?.toUpperCase() === "ACTIVE",
        ) ??
        subscriptionData[0] ??
        null
      );
    }
    return subscriptionData?.subscription ?? subscriptionData ?? null;
  }, [subscriptionData]);
  const currentPackage =
    currentSubscription?.package ??
    currentSubscription?.plan ??
    (currentSubscription?.name || currentSubscription?.limits
      ? currentSubscription
      : null);
  const packages = asList(packagesData, ["packages", "data"]);
  const paymentMethods = asList(paymentMethodsData, ["data"]);
  const limits = currentPackage?.limits ?? {};
  const usage =
    currentSubscription?.usage ?? currentSubscription?.usageStats ?? {};
  const endDate =
    currentSubscription?.endDate ?? currentSubscription?.nextBillingAt;
  const startDate = currentSubscription?.startDate;
  const status =
    currentSubscription?.status?.toString().toUpperCase() ?? "INACTIVE";
  const isActive =
    status === "ACTIVE" && (!endDate || new Date(endDate) > new Date());
  const daysLeft = endDate
    ? Math.max(
        0,
        Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000),
      )
    : null;
  const totalDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              86400000,
          ),
        )
      : null;
  const elapsedDays =
    totalDays && startDate
      ? Math.min(totalDays, Math.max(0, totalDays - (daysLeft ?? 0)))
      : 0;
  const progress = totalDays ? Math.round((elapsedDays / totalDays) * 100) : 0;

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const handlePurchase = async (payload: Record<string, any>) => {
    try {
      await createPurchaseRequest(payload).unwrap();
      setSelectedPlan(null);
      showToast("Payment request submitted for review.");
      await refetch();
    } catch (error: any) {
      showToast(
        error?.data?.message ?? "Unable to submit payment request.",
        "error",
      );
    }
  };

  const handleAction = async (action: "renew" | "cancel" | "autoRenew") => {
    if (!currentPackage) return;
    try {
      if (action === "renew")
        await renewSubscription({ packagedata: currentPackage }).unwrap();
      if (action === "cancel")
        await cancelSubscription({ packagedata: currentPackage }).unwrap();
      if (action === "autoRenew")
        await toggleAutoRenew({ packagedata: currentPackage }).unwrap();
      await refetch();
      showToast(
        action === "cancel"
          ? "Auto-renewal cancelled."
          : "Subscription updated.",
      );
    } catch (error: any) {
      showToast(
        error?.data?.message ?? "Unable to update subscription.",
        "error",
      );
    }
  };

  if (subscriptionLoading || packagesLoading) {
    return (
      <div className="subscription-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="page-header subscription-page-header">
        <div>
          <div className="subscription-kicker">Billing & access</div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">
            Manage your current package, usage, and plan options.
          </p>
        </div>
        {currentPackage && (
          <span
            className={`badge ${isActive ? "badge-success" : "badge-warning"}`}
          >
            {isActive ? "Active package" : status}
          </span>
        )}
      </div>

      {currentPackage ? (
        <>
          <section className="subscription-current card">
            <div className="subscription-current-main">
              <div className="subscription-plan-mark">
                {(currentPackage.name ?? "P").slice(0, 1)}
              </div>
              <div>
                <div className="subscription-eyebrow">Current package</div>
                <h2>{currentPackage.name ?? "Unnamed package"}</h2>
                <p>
                  {currentPackage.description ??
                    "Your project access and limits are managed by this package."}
                </p>
              </div>
            </div>
            <div className="subscription-current-actions">
              <strong>{formatCurrency(currentPackage.price ?? 0)}</strong>
              <span>
                per{" "}
                {currentPackage.billingCycle ?? currentPackage.cycle ?? "month"}
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedPlan(currentPackage)}
              >
                {renewing ? "Renewing..." : "Renew package"}
              </button>
            </div>
          </section>

          <div
            className="subscription-tabs"
            role="tablist"
            aria-label="Subscription information"
          >
            {[
              ["current", "Current package"],
              ["usage", "Usage"],
              ["features", "Features"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`subscription-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() =>
                  setActiveTab(tab as "current" | "usage" | "features")
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="subscription-tab-panel" role="tabpanel">
            {activeTab === "current" && (
              <section className="card subscription-details-card">
                <div className="card-header">
                  <h2 className="card-title">Subscription details</h2>
                </div>
                <div className="card-body">
                  <div className="subscription-detail-list">
                    <div>
                      <span>Status</span>
                      <strong>{status}</strong>
                    </div>
                    <div>
                      <span>Started</span>
                      <strong>
                        {startDate ? formatDate(startDate) : "Not available"}
                      </strong>
                    </div>
                    <div>
                      <span>
                        {currentSubscription?.autoRenew
                          ? "Renews on"
                          : "Ends on"}
                      </span>
                      <strong>
                        {endDate ? formatDate(endDate) : "No expiry date"}
                      </strong>
                    </div>
                    <div>
                      <span>Days remaining</span>
                      <strong>{daysLeft ?? "Unlimited"}</strong>
                    </div>
                  </div>
                  {totalDays && (
                    <div className="subscription-progress">
                      <div className="subscription-progress-label">
                        <span>Billing period</span>
                        <strong>{progress}% elapsed</strong>
                      </div>
                      <div className="package-progress-bar">
                        <div
                          className="package-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="subscription-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAction("autoRenew")}
                      disabled={toggling || cancelling}
                    >
                      {toggling
                        ? "Updating..."
                        : currentSubscription?.autoRenew
                          ? "Turn off auto-renew"
                          : "Turn on auto-renew"}
                    </button>
                    {currentSubscription?.autoRenew && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleAction("cancel")}
                        disabled={cancelling}
                      >
                        {cancelling ? "Cancelling..." : "Cancel renewal"}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "usage" && (
              <section className="card subscription-details-card">
                <div className="card-header">
                  <h2 className="card-title">Current usage</h2>
                </div>
                <div className="card-body subscription-usage-list">
                  {Object.entries(limits).map(([key, limit]) => {
                    const used =
                      usage[
                        key
                          .replace(/^max/, "")
                          .replace(/^./, (letter) => letter.toLowerCase())
                      ] ??
                      usage[key] ??
                      0;
                    const numericLimit = typeof limit === "number" ? limit : 0;
                    const percentage = numericLimit
                      ? Math.min(
                          100,
                          Math.round((Number(used) / numericLimit) * 100),
                        )
                      : 0;
                    return (
                      <div key={key} className="subscription-usage-row">
                        <div>
                          <span>{titleize(key.replace(/^max/, ""))}</span>
                          <strong>
                            {String(used)} / {String(limit)}
                          </strong>
                        </div>
                        <div className="package-progress-bar">
                          <div
                            className="package-progress-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {!Object.keys(limits).length && (
                    <p className="empty-state-desc">
                      No usage limits are available for this package.
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === "features" && (
              <section className="card package-features-card">
                <div className="card-header">
                  <h2 className="card-title">Included features</h2>
                </div>
                <div className="card-body package-features-grid">
                  {(currentPackage.features ?? []).map((feature: string) => (
                    <div key={feature} className="package-feature-item">
                      ✓ {feature}
                    </div>
                  ))}
                  {!currentPackage.features?.length && (
                    <p className="empty-state-desc">
                      No feature details are available for this package.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </>
      ) : (
        <div className="alert alert-warning">
          You do not have an active package yet. Choose a plan below to get
          started.
        </div>
      )}

      <section className="subscription-plans-section">
        <div className="section-heading">
          <div>
            <div className="subscription-kicker">Available plans</div>
            <h2>Choose the right package</h2>
          </div>
          <span>{packages.length} plans</span>
        </div>
        <div className="package-grid">
          {packages.map((plan: any) => (
            <div
              key={plan._id ?? plan.id ?? plan.slug}
              className={`package-card ${plan.isPopular ? "package-card--highlight" : ""}`}
            >
              <div className="package-card-header">
                <div>
                  <div className="package-name">{plan.name}</div>
                  <div className="package-cycle">
                    {plan.billingCycle ?? plan.cycle ?? "monthly"}
                  </div>
                </div>
                {plan.isPopular && (
                  <span className="badge badge-info">Popular</span>
                )}
              </div>
              <div className="package-price">
                {formatCurrency(plan.price ?? 0)}
                <span>/ {plan.billingCycle ?? plan.cycle ?? "month"}</span>
              </div>
              <p className="package-description">
                {plan.description ?? "A flexible package for your store."}
              </p>
              <div className="package-features">
                {(plan.features ?? []).map((feature: string) => (
                  <div key={feature} className="package-feature">
                    <span>•</span>
                    {feature}
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setSelectedPlan(plan)}
                disabled={purchasing}
              >
                {currentPackage?.id === plan.id ||
                currentPackage?._id === plan._id
                  ? "Renew current package"
                  : "Choose package"}
              </button>
            </div>
          ))}
        </div>
        {packages.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-desc">
              No active packages are available right now.
            </div>
          </div>
        )}
      </section>

      <section className="card subscription-history-card">
        <div className="card-header">
          <h2 className="card-title">Subscription history</h2>
          <span className="badge badge-default">
            {subscriptions.length} records
          </span>
        </div>
        {subscriptions.length ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Period</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((item: any, index: number) => {
                  const plan = item.package ?? item.plan ?? {};
                  return (
                    <tr key={item._id ?? item.id ?? index}>
                      <td>
                        <strong>
                          {plan.name ?? item.packageName ?? "Package"}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${item.status?.toUpperCase() === "ACTIVE" ? "badge-success" : "badge-default"}`}
                        >
                          {item.status ?? "Unknown"}
                        </span>
                      </td>
                      <td>
                        {item.startDate ? formatDate(item.startDate) : "-"} -{" "}
                        {item.endDate ? formatDate(item.endDate) : "Ongoing"}
                      </td>
                      <td>{formatCurrency(item.amount ?? plan.price ?? 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-body empty-state-desc">
            No subscription history is available yet.
          </div>
        )}
      </section>

      <PackagePurchaseModal
        open={Boolean(selectedPlan)}
        plan={selectedPlan}
        paymentMethods={paymentMethods}
        projectId={user?.projectId ?? user?.project?.id}
        submitting={purchasing}
        mode={
          currentPackage && selectedPlan?.id === currentPackage?.id
            ? "renew"
            : "purchase"
        }
        onClose={() => setSelectedPlan(null)}
        onSubmit={handlePurchase}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={Boolean(toast.message)}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
