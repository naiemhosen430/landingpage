import { api } from "./api";

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getRecentOrders: builder.query({
      query: () => "/dashboard/recent-orders",
      providesTags: ["Orders"],
    }),
    getRecentActivities: builder.query({
      query: () => "/dashboard/activities",
      providesTags: ["Dashboard"],
    }),
    getRecentVisitors: builder.query({
      query: () => "/dashboard/visitors",
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
