import { api } from "./api";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query({
      query: (range) => `/analytics/overview?range=${range}`,
      providesTags: ["Analytics"],
    }),
    getRevenueChart: builder.query({
      query: (range) => `/analytics/revenue?range=${range}`,
    }),
    getOrderChart: builder.query({
      query: (range) => `/analytics/orders?range=${range}`,
    }),
    getVisitorChart: builder.query({
      query: (range) => `/analytics/visitors?range=${range}`,
    }),
    getTopProducts: builder.query({
      query: (range) => `/analytics/top-products?range=${range}`,
    }),
    getTopPages: builder.query({
      query: (range) => `/analytics/top-pages?range=${range}`,
    }),
    getTrafficSources: builder.query({
      query: (range) => `/analytics/traffic?range=${range}`,
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetRevenueChartQuery,
  useGetOrderChartQuery,
  useGetVisitorChartQuery,
  useGetTopProductsQuery,
  useGetTopPagesQuery,
  useGetTrafficSourcesQuery,
} = analyticsApi;
