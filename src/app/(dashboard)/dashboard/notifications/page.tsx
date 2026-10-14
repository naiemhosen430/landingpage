"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Package,
  Mail,
  RefreshCw,
  Save,
  Settings2,
  ShoppingBag,
  X,
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
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data, isLoading, isFetching, error, refetch } =
    useGetNotificationsQuery({ page, limit: 20, unreadOnly });
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

  const closeSettings = useCallback(() => {
    if (settingsResponse) setSettings(settingsResponse);
    setSmtpPassword("");
    setIsSettingsOpen(false);
  }, [settingsResponse]);

  useEffect(() => {
    if (settingsResponse) {
      setSettings(settingsResponse);
      setSmtpPassword("");
    }
  }, [settingsResponse]);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSettings();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeSettings, isSettingsOpen]);

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
      setIsSettingsOpen(false);
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

  const notificationIcon = (type: string) => {
    if (type === "newOrder") {
      return <ShoppingBag size={19} aria-hidden="true" />;
    }
    if (type === "paymentStatus") {
      return <CreditCard size={19} aria-hidden="true" />;
    }
    if (type === "lowStock") return <Package size={19} aria-hidden="true" />;
    if (type === "orderStatus") {
      return <RefreshCw size={19} aria-hidden="true" />;
    }
    return <Bell size={19} aria-hidden="true" />;
  };

  const formatNotificationDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="page-container notifications-page">
      <div className="page-header notifications-page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
        </div>
        <div className="notifications-page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings2 size={16} aria-hidden="true" />
            Notification settings
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {errorMessage(error)}
        </div>
      )}

      {isSettingsOpen && (
        <div
          className="notification-settings-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-settings-title"
          onClick={closeSettings}
        >
          <section
            className="card notification-settings-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="card-header notification-settings-header">
              <div className="notification-settings-title">
                <div>
                  <h2 className="card-title" id="notification-settings-title">
                    Notification settings
                  </h2>
                  <p>
                    Choose the updates you receive and configure email delivery.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="notification-settings-close"
                onClick={closeSettings}
                aria-label="Close notification settings"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {settingsError && (
              <div className="notification-settings-error" role="alert">
                {errorMessage(settingsError)}
              </div>
            )}
            {isSettingsLoading ? (
              <div className="card-body notification-settings-loading">
                Loading notification settings...
              </div>
            ) : (
              <form onSubmit={submitSettings}>
                <div className="card-body notification-settings-body">
                  <h3 className="notification-settings-section-title">
                    Store events
                  </h3>
                  <p className="notification-settings-section-description">
                    Choose which activity should create an in-dashboard
                    notification.
                  </p>
                  <div className="notification-event-options">
                    {eventOptions.map((option) => (
                      <label
                        key={option.key}
                        className="notification-event-option"
                      >
                        <input
                          type="checkbox"
                          checked={settings.events[option.key]}
                          onChange={(event) =>
                            updateEvent(option.key, event.target.checked)
                          }
                        />
                        <span>
                          <strong>{option.label}</strong>
                          <small>{option.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="notification-email-heading">
                    <div>
                      <h3>Email delivery</h3>
                      <p>Send selected store events to your email via SMTP.</p>
                    </div>
                  </div>

                  <label className="notification-email-toggle">
                    <input
                      type="checkbox"
                      checked={settings.email.enabled}
                      onChange={(event) =>
                        updateEmail("enabled", event.target.checked)
                      }
                    />
                    <span>
                      <strong>Enable email notifications</strong>
                      <small>
                        Send the selected events to the configured recipient.
                      </small>
                    </span>
                  </label>
                  <div className="notification-smtp-fields">
                    <label className="form-group">
                      <span>SMTP host</span>
                      <input
                        className="form-input"
                        value={settings.email.host}
                        onChange={(event) =>
                          updateEmail("host", event.target.value)
                        }
                        placeholder="smtp.example.com"
                        autoComplete="url"
                      />
                    </label>
                    <label className="form-group">
                      <span>SMTP port</span>
                      <input
                        className="form-input"
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
                        className="form-input"
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
                        className="form-input"
                        type="password"
                        value={smtpPassword}
                        onChange={(event) =>
                          setSmtpPassword(event.target.value)
                        }
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
                        className="form-input"
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
                        className="form-input"
                        type="email"
                        value={settings.email.recipientEmail}
                        onChange={(event) =>
                          updateEmail("recipientEmail", event.target.value)
                        }
                        placeholder="Defaults to store contact email"
                      />
                    </label>
                  </div>
                  <label className="notification-secure-toggle">
                    <input
                      type="checkbox"
                      checked={settings.email.secure}
                      onChange={(event) =>
                        updateEmail("secure", event.target.checked)
                      }
                    />
                    <span>Use secure TLS connection (typically port 465)</span>
                  </label>
                </div>
                <div className="notification-settings-footer">
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
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeSettings}
                    disabled={isSaving}
                  >
                    Cancel
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
        </div>
      )}

      <section className="card notifications-feed">
        <div className="notifications-feed-header">
          <div className="notifications-feed-heading">
            <span className="notification-settings-icon">
              <Bell size={19} aria-hidden="true" />
            </span>
            <div>
              <h2 className="card-title">Your notifications</h2>
              <p>
                {data?.unread
                  ? `${data.unread.toLocaleString()} unread`
                  : "You’re all caught up"}
              </p>
            </div>
          </div>
          <div className="notifications-feed-actions">
            <div
              className="notification-filter-tabs"
              aria-label="Notification filter"
            >
              <button
                type="button"
                className={!unreadOnly ? "is-active" : ""}
                onClick={() => {
                  setUnreadOnly(false);
                  setPage(1);
                }}
                aria-pressed={!unreadOnly}
              >
                All
              </button>
              <button
                type="button"
                className={unreadOnly ? "is-active" : ""}
                onClick={() => {
                  setUnreadOnly(true);
                  setPage(1);
                }}
                aria-pressed={unreadOnly}
              >
                Unread
              </button>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => void setAllRead()}
              disabled={!data?.unread || isUpdatingRead}
            >
              <Check size={15} aria-hidden="true" />
              Mark all read
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="notifications-loading" role="status">
            <span className="spinner" />
            Loading notifications...
          </div>
        ) : data?.data.length ? (
          <div className="notifications-list" aria-busy={isFetching}>
            {data.data.map((notification) => (
              <article
                key={notification._id}
                className={`notification-item ${notification.readAt ? "is-read" : "is-unread"}`}
              >
                <span
                  className={`notification-item-icon notification-item-icon-${notification.type}`}
                  aria-hidden="true"
                >
                  {notificationIcon(notification.type)}
                </span>
                <div className="notification-item-content">
                  <div className="notification-item-title-row">
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        className="notification-item-title"
                      >
                        {notification.title}
                      </Link>
                    ) : (
                      <strong className="notification-item-title">
                        {notification.title}
                      </strong>
                    )}
                    <span className="notification-type">
                      {notificationTypeLabel(notification.type)}
                    </span>
                    {!notification.readAt && (
                      <span className="notification-unread-label">New</span>
                    )}
                  </div>
                  <p className="notification-item-message">
                    {notification.message}
                  </p>
                  <div className="notification-item-meta">
                    <time dateTime={notification.createdAt}>
                      {formatNotificationDate(notification.createdAt)}
                    </time>
                    <span className="notification-email-status">
                      {notification.emailStatus === "sent" ? (
                        <>
                          <Mail size={13} aria-hidden="true" /> Email sent
                        </>
                      ) : notification.emailStatus === "failed" ? (
                        <>
                          <CircleAlert size={13} aria-hidden="true" />{" "}
                          {notification.emailError ?? "Email delivery failed"}
                        </>
                      ) : (
                        "In-dashboard"
                      )}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="notification-read-action"
                  onClick={() =>
                    void setRead(notification._id, !notification.readAt)
                  }
                  disabled={isUpdatingRead}
                  aria-label={
                    notification.readAt
                      ? `Mark ${notification.title} unread`
                      : `Mark ${notification.title} read`
                  }
                >
                  {notification.readAt ? "Mark unread" : "Mark read"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="notifications-empty">
            <span className="notifications-empty-icon">
              <Bell size={23} aria-hidden="true" />
            </span>
            <h3>
              {unreadOnly ? "No unread notifications" : "No notifications yet"}
            </h3>
            <p>
              {unreadOnly
                ? "You’re all caught up. New activity will appear here."
                : "Store activity and updates will appear here."}
            </p>
          </div>
        )}
        {data && data.meta.totalPages > 1 && (
          <div className="notifications-pagination">
            <span>
              Page {data.meta.page} of {data.meta.totalPages}
              <span className="notifications-total">
                {data.meta.total.toLocaleString()} notifications
              </span>
            </span>
            <div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!data.meta.hasPrevPage || isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                aria-label="Previous notifications"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!data.meta.hasNextPage || isFetching}
                onClick={() => setPage((current) => current + 1)}
                aria-label="Next notifications"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
