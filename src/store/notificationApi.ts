import { api } from "./api";

export type StoreNotification = {
  _id: string;
  type: "newOrder" | "orderStatus" | "paymentStatus" | "lowStock";
  title: string;
  message: string;
  href?: string;
  readAt?: string;
  emailStatus: "not_configured" | "sent" | "failed";
  emailError?: string;
  createdAt: string;
};

export type NotificationList = {
  data: StoreNotification[];
  unread: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type NotificationSettings = {
  events: {
    newOrder: boolean;
    orderStatus: boolean;
    paymentStatus: boolean;
    lowStock: boolean;
  };
  email: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    username: string;
    fromEmail: string;
    recipientEmail: string;
    passwordConfigured: boolean;
  };
};

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationList,
      { page?: number; limit?: number; unreadOnly?: boolean }
    >({
      query: ({ page = 1, limit = 20, unreadOnly = false }) => ({
        url: "/admin/notifications",
        params: { page, limit, unreadOnly },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Notifications"],
    }),
    updateNotificationReadStatus: builder.mutation<
      unknown,
      { id?: string; read: boolean; all?: boolean }
    >({
      query: (body) => ({
        url: "/admin/notifications",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => "/admin/notifications/settings",
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Notifications"],
    }),
    saveNotificationSettings: builder.mutation<
      NotificationSettings,
      {
        events: NotificationSettings["events"];
        email: Omit<NotificationSettings["email"], "passwordConfigured"> & {
          password?: string;
        };
      }
    >({
      query: (body) => ({
        url: "/admin/notifications/settings",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Notifications"],
    }),
    sendTestNotificationEmail: builder.mutation<
      { sent: boolean; recipient: string },
      void
    >({
      query: () => ({
        url: "/admin/notifications/settings",
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationReadStatusMutation,
  useGetNotificationSettingsQuery,
  useSaveNotificationSettingsMutation,
  useSendTestNotificationEmailMutation,
} = notificationApi;
