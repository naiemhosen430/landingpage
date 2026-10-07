"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/authApi";
import { useGetMySubscriptionQuery } from "@/store/packageApi";
import { formatDate } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import "@/styles/dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const storedUser = useAppSelector((state) => state.auth.user);
  const {
    data: currentUser,
    isLoading,
  } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = currentUser ?? storedUser;
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );
  const { data: subscription } = useGetMySubscriptionQuery({
    packagedata: user?.package,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const currentSubscription = Array.isArray(subscription)
    ? (subscription.find(
        (item: any) => item.status?.toUpperCase() === "ACTIVE",
      ) ??
      subscription[0] ??
      null)
    : (subscription?.subscription ?? subscription ?? null);
  const expiryDate = currentSubscription?.endDate
    ? new Date(currentSubscription.endDate)
    : currentSubscription?.nextBillingAt
      ? new Date(currentSubscription.nextBillingAt)
      : null;
  const daysLeft = expiryDate
    ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="dashboard-main">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          expiryDate={expiryDate ? formatDate(expiryDate) : null}
          daysLeft={daysLeft}
        />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
