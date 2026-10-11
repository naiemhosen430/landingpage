"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCw,
  Save,
  Settings2,
} from "lucide-react";
import { notifyToast } from "@/lib/toast";
import {
  useGetNotificationSettingsQuery,
  useGetNotificationsQuery,
  useSaveNotificationSettingsMutation,
  useSendTestNotificationEmailMutation,
  useUpdateNotificationReadStatusMutation,
  type NotificationSettings,
} from "@/store/notificationApi";

const defaultSettings: NotificationSettings = {
  events: {
    newOrder: true,
    orderStatus: true,
    paymentStatus: true,
    lowStock: true,
  },
  email: {
    enabled: false,
    host: "",
    port: 587,
    secure: false,
    username: "",
    fromEmail: "",
    recipientEmail: "",
    passwordConfigured: false,
  },
};

const eventOptions: Array<{
  key: keyof NotificationSettings["events"];
  label: string;
  description: string;
}> = [
  {
    key: "newOrder",
    label: "New order received",
    description: "When a customer places an order.",
  },
  {
    key: "orderStatus",
    label: "Order status changed",
    description: "When an order moves to another fulfillment status.",
  },
  {
    key: "paymentStatus",
    label: "Payment status changed",
    description: "When a payment is marked paid, failed, refunded, or pending.",
  },
  {
    key: "lowStock",
    label: "Product reaches low stock",
    description: "When inventory crosses its configured low-stock threshold.",
  },
];

function errorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }
  return "The request could not be completed. Please try again.";
}

function notificationTypeLabel(type: string) {
  return (
    {
      newOrder: "New order",
      orderStatus: "Order status",
      paymentStatus: "Payment",
      lowStock: "Inventory",
    }[type] ?? "Store update"
  );
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, refetch } =
    useGetNotificationsQuery({ page, limit: 20 });
  const {
    data: settingsResponse,
    isLoading: isSettingsLoading,
    error: settingsError,
  } = useGetNotificationSettingsQuery();
  const [saveSettings, { isLoading: isSaving }] =
    useSaveNotificationSettingsMutation();
  const [sendTestEmail, { isLoading: isTesting }] =
    useSendTestNotificationEmailMutation();
  const [updateReadStatus, { isLoading: isUpdatingRead }] =
    useUpdateNotificationReadStatusMutation();
  const [settings, setSettings] = useState(defaultSettings);
  const [smtpPassword, setSmtpPassword] = useState("");

  useEffect(() => {
    if (settingsResponse) {
      setSettings(settingsResponse);
      setSmtpPassword("");
    }
  }, [settingsResponse]);

  const updateEvent = (
    key: keyof NotificationSettings["events"],
    value: boolean,
  ) => {
    setSettings((current) => ({
      ...current,
      events: { ...current.events, [key]: value },
    }));
  };

  const updateEmail = <K extends keyof NotificationSettings["email"]>(
    key: K,
    value: NotificationSettings["email"][K],
  ) => {
    setSettings((current) => ({
      ...current,
      email: { ...current.email, [key]: value },
    }));
  };

  const submitSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await saveSettings({
        events: settings.events,
        email: {
          enabled: settings.email.enabled,
          host: settings.email.host,
          port: Number(settings.email.port),
          secure: settings.email.secure,
          username: settings.email.username,
          fromEmail: settings.email.fromEmail,
          recipientEmail: settings.email.recipientEmail,
          ...(smtpPassword ? { password: smtpPassword } : {}),
        },
      }).unwrap();
      setSmtpPassword("");
      notifyToast("Notification settings saved.", "success");
    } catch (saveError) {
      notifyToast(errorMessage(saveError), "error");
    }
  };

  const sendTest = async () => {
    try {
      const result = await sendTestEmail().unwrap();
      notifyToast(`Test email sent to ${result.recipient}.`, "success");
    } catch (testError) {
      notifyToast(errorMessage(testError), "error");
    }
  };

  const setRead = async (id: string, read: boolean) => {
    try {
      await updateReadStatus({ id, read }).unwrap();
    } catch (readError) {
      notifyToast(errorMessage(readError), "error");
    }
  };

  const setAllRead = async () => {
    try {
      await updateReadStatus({ all: true, read: true }).unwrap();
      notifyToast("All notifications marked as seen.", "success");
    } catch (readError) {
      notifyToast(errorMessage(readError), "error");
    }
  };

  return (
    <div className="page-container">
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
      >
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-description">
            Choose which store events to follow and configure email delivery
            through your SMTP account.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {(error || settingsError) && (
        <div className="alert alert-error" role="alert">
          {errorMessage(error ?? settingsError)}
        </div>
      )}

      <section className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Settings2 size={19} aria-hidden="true" />
            <h2 className="card-title">Notification preferences</h2>
          </div>
        </div>
        {isSettingsLoading ? (
          <div className="card-body">Loading notification settings...</div>
        ) : (
          <form onSubmit={submitSettings}>
            <div className="card-body">
              <h3 style={{ marginTop: 0 }}>Events to notify me about</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {eventOptions.map((option) => (
                  <label
                    key={option.key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: 12,
                      border: "1px solid var(--border-color)",
                      borderRadius: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={settings.events[option.key]}
                      onChange={(event) =>
                        updateEvent(option.key, event.target.checked)
                      }
                    />
                    <span>
                      <strong style={{ display: "block" }}>
                        {option.label}
                      </strong>
                      <small style={{ color: "var(--text-secondary)" }}>
                        {option.description}
                      </small>
                    </span>
                  </label>
                ))}
              </div>

              <hr style={{ margin: "24px 0", borderColor: "var(--border-color)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={18} aria-hidden="true" />
                <h3 style={{ margin: 0 }}>Email delivery (SMTP)</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                SMTP password is encrypted before storage and never returned to
                the browser. If recipient email is blank, the store contact
                email is used.
              </p>
              <label
                style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}
              >
                <input
                  type="checkbox"
                  checked={settings.email.enabled}
                  onChange={(event) => updateEmail("enabled", event.target.checked)}
                />
                Send enabled event notifications to email
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 14,
                }}
              >
                <label className="form-group">
                  <span>SMTP host</span>
                  <input
                    className="form-control"
                    value={settings.email.host}
                    onChange={(event) => updateEmail("host", event.target.value)}
                    placeholder="smtp.example.com"
                    autoComplete="url"
                  />
                </label>
                <label className="form-group">
                  <span>SMTP port</span>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    max="65535"
                    value={settings.email.port}
                    onChange={(event) =>
                      updateEmail("port", Number(event.target.value))
                    }
                  />
                </label>
                <label className="form-group">
                  <span>SMTP username</span>
                  <input
                    className="form-control"
                    value={settings.email.username}
                    onChange={(event) =>
                      updateEmail("username", event.target.value)
                    }
                    autoComplete="username"
                  />
                </label>
                <label className="form-group">
                  <span>SMTP password</span>
                  <input
                    className="form-control"
                    type="password"
                    value={smtpPassword}
                    onChange={(event) => setSmtpPassword(event.target.value)}
                    placeholder={
                      settings.email.passwordConfigured
                        ? "Saved; enter a new password to replace"
                        : "SMTP password or app password"
                    }
                    autoComplete="new-password"
                  />
                </label>
                <label className="form-group">
                  <span>From email</span>
                  <input
                    className="form-control"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(event) =>
                      updateEmail("fromEmail", event.target.value)
                    }
                    placeholder="store@example.com"
                  />
                </label>
                <label className="form-group">
                  <span>Notification recipient</span>
                  <input
                    className="form-control"
                    type="email"
                    value={settings.email.recipientEmail}
                    onChange={(event) =>
                      updateEmail("recipientEmail", event.target.value)
                    }
                    placeholder="Defaults to store contact email"
                  />
                </label>
              </div>
              <label
                style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 14 }}
              >
                <input
                  type="checkbox"
                  checked={settings.email.secure}
                  onChange={(event) => updateEmail("secure", event.target.checked)}
                />
                Use secure TLS connection (typically port 465)
              </label>
            </div>
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => void sendTest()}
                disabled={
                  isTesting ||
                  Boolean(settingsError) ||
                  !settings.email.passwordConfigured
                }
                title={
                  settings.email.passwordConfigured
                    ? "Send a test email using the saved SMTP settings"
                    : "Save SMTP settings, including a password, before testing"
                }
              >
                <Mail size={16} aria-hidden="true" />
                {isTesting ? "Sending..." : "Send test email"}
              </button>
              <button
                className="btn btn-primary"
                disabled={isSaving || Boolean(settingsError)}
              >
                <Save size={16} aria-hidden="true" />
                {isSaving ? "Saving..." : "Save preferences"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="card">
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={19} aria-hidden="true" />
            <h2 className="card-title">Store activity</h2>
            {(data?.unread ?? 0) > 0 && (
              <span className="badge badge-warning">
                {data!.unread} unseen
              </span>
            )}
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => void setAllRead()}
            disabled={!data?.unread || isUpdatingRead}
          >
            <Check size={15} aria-hidden="true" />
            Mark all seen
          </button>
        </div>
        {isLoading ? (
          <div className="card-body">Loading notifications...</div>
        ) : data?.data.length ? (
          <div>
            {data.data.map((notification) => (
              <article
                key={notification._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 18,
                  borderTop: "1px solid var(--border-color)",
                  background: notification.readAt
                    ? "transparent"
                    : "var(--bg-tertiary)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!notification.readAt && (
                      <span
                        aria-label="Unseen"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--primary)",
                        }}
                      />
                    )}
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        style={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        {notification.title}
                      </Link>
                    ) : (
                      <strong>{notification.title}</strong>
                    )}
                    <span className="badge badge-default">
                      {notificationTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p style={{ margin: "7px 0", color: "var(--text-secondary)" }}>
                    {notification.message}
                  </p>
                  <small style={{ color: "var(--text-muted)" }}>
                    {new Date(notification.createdAt).toLocaleString()}
                    {" · "}
                    {notification.emailStatus === "sent"
                      ? "Email sent"
                      : notification.emailStatus === "failed"
                        ? notification.emailError ?? "Email delivery failed"
                        : "In-dashboard only"}
                  </small>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void setRead(notification._id, !notification.readAt)
                  }
                  disabled={isUpdatingRead}
                  aria-label={
                    notification.readAt
                      ? `Mark ${notification.title} unseen`
                      : `Mark ${notification.title} seen`
                  }
                >
                  {notification.readAt ? "Mark unseen" : "Mark seen"}
                </button>
              </article>
            ))}
            {data.meta.totalPages > 1 && (
              <div
                className="card-body"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <span>
                  Page {data.meta.page} of {data.meta.totalPages} ·{" "}
                  {data.meta.total.toLocaleString()} notifications
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={!data.meta.hasPrevPage || isFetching}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    aria-label="Previous notifications"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={!data.meta.hasNextPage || isFetching}
                    onClick={() => setPage((current) => current + 1)}
                    aria-label="Next notifications"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card-body empty-state">
            <div className="empty-state-title">No notifications yet</div>
            <div className="empty-state-desc">
              Enabled store events will appear here.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
