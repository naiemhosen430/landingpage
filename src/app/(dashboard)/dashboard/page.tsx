"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  useGetDashboardStatsQuery,
  useGetRecentActivitiesQuery,
} from "@/store/dashboardApi";
import { useGetOrdersQuery } from "@/store/orderApi";
import {
  useGetActivePackagesQuery,
  useGetPaymentMethodsQuery,
  useGetMySubscriptionQuery,
  useCreatePurchaseRequestMutation,
  useRenewSubscriptionMutation,
  useCancelSubscriptionMutation,
  useToggleAutoRenewMutation,
} from "@/store/packageApi";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import ThemeToggle from "@/components/ui/ThemeToggle";
import GuideModal from "@/components/ui/GuideModal";
import Toast from "@/components/ui/Toast";
import { useUpdateOrderStatusMutation } from "@/store/orderApi";
import { useAppSelector } from "@/store/hooks";
import PackagePurchaseModal from "@/components/dashboard/PackagePurchaseModal";

const DEFAULT_PACKAGE_PLANS = [
  {
    id: "basic-plan",
    label: "Basic",
    description: "Best for small stores",
    highlight: "500MB storage",
    price: 0,
    billingCycle: "month",
    features: ["Core dashboard", "Basic reporting", "Limited products"],
    priority: false,
  },
];

export default function DashboardPage() {
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem("dashboard-guide-seen");
      if (!seen) setShowGuide(true);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCloseGuide = () => {
    try {
      localStorage.setItem("dashboard-guide-seen", "1");
    } catch (e) {}
    setShowGuide(false);
  };

  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );
  const [recentPage, setRecentPage] = useState(1);
  const RECENT_PAGE_SIZE = 6;
  const { data: recentOrdersData, isLoading: recentOrdersLoading } =
    useGetOrdersQuery({ page: recentPage, limit: RECENT_PAGE_SIZE });
  const recentOrders = recentOrdersData?.data || [];
  const recentMeta = recentOrdersData?.meta;
  const { data: activities } = useGetRecentActivitiesQuery(undefined);

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    refetch: refetchSubscription,
  } = useGetMySubscriptionQuery();

  const { data: packagesData, isLoading: packagesLoading } =
    useGetActivePackagesQuery({ page: 1, limit: 6 });

  const [createPurchaseRequest, { isLoading: purchasing }] =
    useCreatePurchaseRequestMutation();
  const { data: paymentMethodsData } = useGetPaymentMethodsQuery();
  const [renewSubscription, { isLoading: renewing }] =
    useRenewSubscriptionMutation();
  const [cancelSubscription, { isLoading: cancelling }] =
    useCancelSubscriptionMutation();
  const [toggleAutoRenew, { isLoading: togglingAutoRenew }] =
    useToggleAutoRenewMutation();
  const user = useAppSelector((state) => state.auth.user);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const availablePackages = useMemo(() => {
    if (Array.isArray(packagesData)) return packagesData;
    if (packagesData?.data) return packagesData.data;
    return [];
  }, [packagesData]);

  const currentSubscription = Array.isArray(subscription)
    ? (subscription.find(
        (item: any) => item.status?.toUpperCase() === "ACTIVE",
      ) ??
      subscription[0] ??
      null)
    : (subscription?.subscription ?? subscription ?? null);
  const currentPackage =
    currentSubscription?.package ?? currentSubscription?.plan ?? null;
  const packageLimits = currentPackage?.limits ?? {};
  const packageFeatures = currentPackage?.features ?? [];
  const packageName = currentPackage?.name ?? "No active package";
  const packagePeriod =
    currentPackage?.billingCycle ?? currentPackage?.cycle ?? "monthly";
  const packageStatus =
    currentSubscription?.status?.toString()?.toUpperCase() ?? "INACTIVE";
  const isActivePackage =
    packageStatus === "ACTIVE" || packageStatus === "ACTIVE";
  const availablePlanList =
    availablePackages.length > 0 ? availablePackages : DEFAULT_PACKAGE_PLANS;

  const endDate = currentSubscription?.endDate
    ? new Date(currentSubscription.endDate)
    : currentSubscription?.nextBillingAt
      ? new Date(currentSubscription.nextBillingAt)
      : null;
  const startDate = currentSubscription?.startDate
    ? new Date(currentSubscription.startDate)
    : null;

  const daysLeft = endDate
    ? Math.max(
        0,
        Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      )
    : null;
  const totalDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : null;
  const usedDays =
    totalDays !== null && daysLeft !== null ? totalDays - daysLeft : null;
  const subscriptionProgress = totalDays
    ? Math.round(((usedDays ?? 0) / totalDays) * 100)
    : 0;

  const usage =
    currentSubscription?.usage ?? currentSubscription?.usageStats ?? {};
  const storageUsed = usage.storageGB ?? usage.storageUsedGB ?? 0;
  const storageLimit = packageLimits.maxStorageGB ?? 0;
  const storageProgress = storageLimit
    ? Math.min(100, Math.round((storageUsed / storageLimit) * 100))
    : 0;

  const isExpired = Boolean(endDate && endDate.getTime() <= Date.now());
  const canShowNoPackage =
    !subscriptionLoading && (!currentPackage || isExpired);
  const projectId =
    user?.projectId ?? user?.project?.id ?? process.env.NEXT_PUBLIC_PROJECT_ID;
  const paymentMethods = Array.isArray(paymentMethodsData)
    ? paymentMethodsData
    : (paymentMethodsData?.data ?? []);

  const handlePurchase = async (payload: Record<string, any>) => {
    setPurchaseError(null);
    setPurchaseSuccess(false);

    try {
      await createPurchaseRequest(payload).unwrap();

      setPurchaseSuccess(true);
      setSelectedPlan(null);
    } catch (err: any) {
      const msg =
        err?.data?.message || "Failed to purchase package. Please try again.";
      setPurchaseError(msg);
    }
  };

  const subscriptionId = currentSubscription?.id ?? currentSubscription?._id;
  const handleSubscriptionAction = async (
    action: "renew" | "cancel" | "autoRenew",
  ) => {
    if (!subscriptionId) return;
    try {
      if (action === "renew") await renewSubscription(subscriptionId).unwrap();
      if (action === "cancel")
        await cancelSubscription(subscriptionId).unwrap();
      if (action === "autoRenew")
        await toggleAutoRenew(subscriptionId).unwrap();
      await refetchSubscription();
      setPurchaseSuccess(true);
    } catch (err: any) {
      setPurchaseError(err?.data?.message ?? "Subscription action failed.");
    }
  };

  const handleRefund = async (orderId: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: "returned",
        note: "Refunded via dashboard",
      }).unwrap();
    } catch (err) {
      console.error("Refund failed", err);
      throw err;
    }
  };

  if (subscriptionLoading || statsLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (canShowNoPackage) {
    return (
      <div className="package-offer-screen">
        <div className="package-offer-header">
          <div>
            <h1 className="page-title">
              {isExpired
                ? "Your package has expired"
                : "Choose a package to get started"}
            </h1>
            <p className="page-subtitle">
              {isExpired
                ? "Submit a renewal request to restore access."
                : "Choose a package to unlock features, billing, and storage limits."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="package-offer-note">
              <strong>Note:</strong> you can upgrade later and your subscription
              will be active immediately.
            </div>
            <button
              className="btn btn-ghost"
              aria-label="Open guide"
              onClick={() => setShowGuide(true)}
              title="Guide"
              style={{ padding: 8 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9.09 9a3 3 0 115.82 1c0 1.5-1.5 2-2 2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Purchase feedback now shown via Toast */}

        <div className="package-grid">
          {availablePlanList.map((plan: any) => (
            <div
              key={plan.id ?? plan.slug ?? plan.label}
              className={`package-card ${plan.isPopular || plan.priority ? "package-card--highlight" : ""}`}
              aria-label={
                plan.isPopular || plan.priority ? "Recommended plan" : undefined
              }
            >
              <div className="package-card-header">
                <div>
                  <div className="package-name">{plan.name ?? plan.label}</div>
                  <div className="package-cycle">
                    {(plan.billingCycle ?? plan.cycle ?? "month")
                      .toString()
                      .toUpperCase()}
                  </div>
                </div>
                {plan.isPopular && (
                  <span className="badge badge-info">Popular</span>
                )}
                {plan.priority && (
                  <span className="badge badge-default">Recommended</span>
                )}
              </div>
              <div className="package-price">
                {formatCurrency(plan.price ?? 0)}
                <span>/ {plan.billingCycle ?? "month"}</span>
              </div>
              <p className="package-description">
                {plan.description ?? plan.highlight}
              </p>
              <div className="package-features">
                {(plan.features ?? []).map((feature: string) => (
                  <div key={feature} className="package-feature">
                    <span>•</span> {feature}
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setSelectedPlan(plan)}
                disabled={purchasing}
              >
                {isExpired ? "Renew package" : "Purchase package"}
              </button>
            </div>
          ))}
        </div>
        <PackagePurchaseModal
          open={Boolean(selectedPlan)}
          plan={selectedPlan}
          paymentMethods={paymentMethods}
          projectId={projectId}
          submitting={purchasing}
          mode={isExpired ? "renew" : "purchase"}
          onClose={() => setSelectedPlan(null)}
          onSubmit={handlePurchase}
        />
        <Toast
          message={
            purchaseError ??
            (purchaseSuccess ? "Payment request submitted for review." : "")
          }
          type={purchaseError ? "error" : "success"}
          visible={Boolean(purchaseError) || purchaseSuccess}
          onClose={() => {
            setPurchaseError(null);
            setPurchaseSuccess(false);
          }}
        />
      </div>
    );
  }

  const s = stats?.data ?? stats;

  return (
    <div>
      <div className="subscription-banner">
        <strong>Package active: {packageName}</strong>
        <span>
          {endDate
            ? `Available until ${formatDate(endDate)}`
            : "No expiry date"}
        </span>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setSelectedPlan(currentPackage)}
            disabled={purchasing}
          >
            Renew
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleSubscriptionAction("autoRenew")}
            disabled={togglingAutoRenew}
          >
            {currentSubscription?.autoRenew
              ? "Disable auto-renew"
              : "Enable auto-renew"}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleSubscriptionAction("cancel")}
            disabled={cancelling}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeToggle />
        </div>
      </div>

      <div className="package-summary">
        <div className="card package-summary-card">
          <div className="card-header">
            <h3 className="card-title">Current Package</h3>
            <span
              className={`badge ${
                packageStatus === "ACTIVE" ? "badge-success" : "badge-warning"
              }`}
            >
              {packageStatus}
            </span>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gap: 16 }}>
              <div className="package-summary-row">
                <div>
                  <div className="package-summary-label">Package</div>
                  <div className="package-summary-value">{packageName}</div>
                </div>
                <div>
                  <div className="package-summary-label">Billing cycle</div>
                  <div className="package-summary-value">{packagePeriod}</div>
                </div>
                <div>
                  <div className="package-summary-label">Next billing</div>
                  <div className="package-summary-value">
                    {endDate ? formatDate(endDate) : "—"}
                  </div>
                </div>
              </div>

              <div className="package-progress-block">
                <div className="package-progress-title">
                  Subscription progress
                </div>
                <div className="package-progress-bar">
                  <div
                    className="package-progress-fill"
                    style={{ width: `${subscriptionProgress}%` }}
                  />
                </div>
                <div className="package-progress-meta">
                  {subscriptionProgress}% elapsed · {daysLeft ?? 0} days left
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card package-summary-card">
          <div className="card-header">
            <h3 className="card-title">Package usage</h3>
          </div>
          <div className="card-body">
            <div className="package-usage-grid">
              <div className="package-usage-item">
                <div className="package-usage-label">Storage</div>
                <div className="package-usage-value">
                  {storageUsed} / {storageLimit} GB
                </div>
                <div className="package-progress-bar">
                  <div
                    className="package-progress-fill"
                    style={{ width: `${storageProgress}%` }}
                  />
                </div>
              </div>
              <div className="package-usage-item">
                <div className="package-usage-label">Products</div>
                <div className="package-usage-value">
                  {usage.products ?? "-"} / {packageLimits.maxProducts ?? "-"}
                </div>
              </div>
              <div className="package-usage-item">
                <div className="package-usage-label">Orders</div>
                <div className="package-usage-value">
                  {usage.orders ?? "-"} / {packageLimits.maxOrders ?? "-"}
                </div>
              </div>
              <div className="package-usage-item">
                <div className="package-usage-label">Customers</div>
                <div className="package-usage-value">
                  {usage.customers ?? "-"} / {packageLimits.maxCustomers ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card package-features-card">
        <div className="card-header">
          <h3 className="card-title">Plan features</h3>
        </div>
        <div className="card-body package-features-grid">
          {packageFeatures.length ? (
            packageFeatures.map((feature: string) => (
              <div key={feature} className="package-feature-item">
                {feature}
              </div>
            ))
          ) : (
            <div className="empty-state-desc">
              No feature details available for this plan.
            </div>
          )}
        </div>
      </div>

      <GuideModal open={showGuide} onClose={handleCloseGuide} />

      <PackagePurchaseModal
        open={Boolean(selectedPlan)}
        plan={selectedPlan}
        paymentMethods={paymentMethods}
        projectId={projectId}
        submitting={purchasing}
        mode={
          isExpired || selectedPlan === currentPackage ? "renew" : "purchase"
        }
        onClose={() => setSelectedPlan(null)}
        onSubmit={handlePurchase}
      />

      <Toast
        message={
          purchaseError ??
          (purchaseSuccess
            ? "Package purchased successfully. Refreshing subscription..."
            : "")
        }
        type={purchaseError ? "error" : purchaseSuccess ? "success" : "info"}
        visible={Boolean(purchaseError) || purchaseSuccess}
        onClose={() => {
          setPurchaseError(null);
          setPurchaseSuccess(false);
        }}
      />

      <div className="stats-grid">
        <StatCard
          label="Total Orders"
          value={s?.totalOrders || 0}
          change={12}
          icon="orders"
          color="blue"
        />
        <StatCard
          label="Today's Orders"
          value={s?.todayOrders || 0}
          icon="orders"
          color="blue"
        />
        <StatCard
          label="Pending Orders"
          value={s?.pendingOrders || 0}
          icon="pending"
          color="yellow"
        />
        <StatCard
          label="Delivered"
          value={s?.deliveredOrders || 0}
          icon="delivered"
          color="green"
        />
        <StatCard
          label="Cancelled"
          value={s?.cancelledOrders || 0}
          icon="cancelled"
          color="red"
        />
        <StatCard
          label="Visitors"
          value={s?.visitors || 0}
          change={8}
          icon="visitors"
          color="blue"
        />
        <StatCard
          label="Revenue"
          value={`৳${(s?.revenue || 0).toLocaleString()}`}
          change={15}
          icon="revenue"
          color="green"
        />
        <StatCard
          label="Storage Used"
          value={`${s?.storageUsed || 0} MB`}
          icon="storage"
          color="blue"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <RecentOrdersTable
              orders={recentOrders}
              onRefund={handleRefund}
              page={recentPage}
              pageSize={RECENT_PAGE_SIZE}
              total={recentMeta?.total ?? undefined}
              onPageChange={(p) => setRecentPage(p)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Latest Activity</h3>
          </div>
          <div className="card-body">
            {activities?.data?.length ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {activities.data.map((activity: any) => (
                  <div
                    key={activity.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-full)",
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {activity.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {activity.description}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 4,
                        }}
                      >
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 24 }}>
                <div className="empty-state-desc">No recent activity</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
