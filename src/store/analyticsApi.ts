import { api } from "./api";

export type AnalyticsRange =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "90d"
  | "12m"
  | "custom";

export interface AnalyticsQuery {
  range?: AnalyticsRange;
  from?: string;
  to?: string;
}

export interface AnalyticsDailyPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsRangeSummary {
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  newCustomers: number;
  returningCustomers: number;
  avgOrderValue: number;
}

export interface AnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    summary?: {
      totalRevenue: number;
      totalOrders: number;
      totalCustomers: number;
      totalProducts: number;
      revenueChange: number;
      ordersChange: number;
      customersChange: number;
      avgOrderValue: number;
      conversionRate: number;
      chartData: AnalyticsDailyPoint[];
    };
    detail?: {
      summary: AnalyticsRangeSummary;
      daily: AnalyticsDailyPoint[];
    };
    platform?: {
      totalProjects: number;
      activeProjects: number;
    };
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, AnalyticsQuery | void>({
      query: (query) => {
        const options = query ?? {};
        const params = new URLSearchParams();
        params.set("range", options.range ?? "30d");
        if (options.from) params.set("from", options.from);
        if (options.to) params.set("to", options.to);

        return `/admin/analytics?${params.toString()}`;
      },
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
