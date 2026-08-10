"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/store/authApi";
import { useGetMySubscriptionQuery } from "@/store/packageApi";
import { formatDate } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: subscription } = useGetMySubscriptionQuery({
    packagedata: user?.package,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

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
      <Sidebar />
      <div className="dashboard-main">
        <Header
          expiryDate={expiryDate ? formatDate(expiryDate) : null}
          daysLeft={daysLeft}
        />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
