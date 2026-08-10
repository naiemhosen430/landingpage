import { api } from "./api";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getRecentOrders: builder.query({
      query: () => "/admin/dashboard/recent-orders",
      providesTags: ["Orders"],
    }),
    getRecentActivities: builder.query({
      query: () => "/admin/dashboard/activities",
      providesTags: ["Dashboard"],
    }),
    getRecentVisitors: builder.query({
      query: () => "/admin/dashboard/visitors",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetRecentActivitiesQuery,
  useGetRecentVisitorsQuery,
} = dashboardApi;
