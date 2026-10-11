"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ZaneAIAssistant from "@/components/layout/ZaneAIAssistant";
import { Bell, Menu } from "lucide-react";
import { useGetNotificationsQuery } from "@/store/notificationApi";

interface HeaderProps {
  onMenuClick: () => void;
  expiryDate?: string | null;
  daysLeft?: number | null;
}

export default function Header({
  onMenuClick,
  expiryDate,
  daysLeft,
}: HeaderProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data: notifications } = useGetNotificationsQuery(
    { page: 1, limit: 1 },
    { pollingInterval: 30_000 },
  );

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    if (query.length >= 2) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="header">
      <button
        className="header-menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>
      <form className="header-search" onSubmit={submitSearch} role="search">
        <input
          type="text"
          placeholder="Search products, orders, settings..."
          aria-label="Search the admin dashboard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="header-search-submit"
          type="submit"
          aria-label="Show search results"
          disabled={search.trim().length < 2}
        >
          <svg
            className="header-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      <div className="header-actions">
        <ThemeToggle rootSelector=".dashboard-layout" />
        <ZaneAIAssistant />
        <Link
          href="/dashboard/notifications"
          className="header-btn"
          aria-label={`Notifications, ${notifications?.unread ?? 0} unread`}
          title="Notifications"
        >
          <Bell size={20} />
          {(notifications?.unread ?? 0) > 0 && (
            <span className="header-badge notification-badge">
              {notifications!.unread > 99 ? "99+" : notifications!.unread}
            </span>
          )}
        </Link>
        {expiryDate && (
          <span
            style={{
              color:
                daysLeft != null && daysLeft <= 10
                  ? "var(--danger)"
                  : "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Expires {expiryDate}
          </span>
        )}
        <Link href="/dashboard/orders" className="header-btn">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </Link>

        <Link href="/dashboard/settings" className="header-btn">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
