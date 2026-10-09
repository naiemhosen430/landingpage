import { api } from "./api";

export type TrackingEvent = {
  id: string;
  _id?: string;
  projectId: string;
  provider: string;
  eventType: string;
  eventName: string;
  payload: Record<string, unknown>;
  visitorId?: string;
  sessionId?: string;
  customParameters?: Record<string, string>;
  visitor?: {
    ipAddress?: string;
    userAgent?: string;
    browser?: string;
    browserVersion?: string;
    operatingSystem?: string;
    operatingSystemVersion?: string;
    deviceType?: string;
    deviceVendor?: string;
    deviceModel?: string;
    location?: {
      country?: string;
      countryCode?: string;
      region?: string;
      city?: string;
      timeZone?: string;
      latitude?: number;
      longitude?: number;
      accuracyRadiusKm?: number;
    };
  };
  forwarded: boolean;
  createdAt?: string;
};

export type TrackingEventsResponse = {
  data: TrackingEvent[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  summary: {
    totalEvents: number;
    purchases: number;
    purchaseRevenue: number;
    eventBreakdown: Array<{ eventType: string; count: number }>;
    locationBreakdown: Array<{
      country?: string;
      region?: string;
      city?: string;
      count: number;
    }>;
    deviceBreakdown: Array<{
      deviceType?: string;
      browser?: string;
      operatingSystem?: string;
      count: number;
    }>;
  };
};

type TrackingEventsApiResponse = {
  data?: {
    data?: TrackingEvent[];
    meta?: TrackingEventsResponse["meta"];
    summary?: TrackingEventsResponse["summary"];
  };
};

export const trackingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrackingEvents: builder.query<
      TrackingEventsResponse,
      Record<string, string | number | undefined> | void
    >({
      query: (params) => ({ url: "/admin/tracking", params: params ?? {} }),
      transformResponse: (
        response: TrackingEventsApiResponse,
      ): TrackingEventsResponse => ({
        data: response.data?.data ?? [],
        meta: response.data?.meta,
        summary: response.data?.summary ?? {
          totalEvents: 0,
          purchases: 0,
          purchaseRevenue: 0,
          eventBreakdown: [],
          locationBreakdown: [],
          deviceBreakdown: [],
        },
      }),
      providesTags: (result) =>
        result ? [{ type: "TrackingEvents" as const }] : [],
    }),
    getTrackingEventById: builder.query<any, string>({
      query: (id) => `/admin/tracking/${id}`,
      providesTags: (result, error, id) => [{ type: "TrackingEvent", id }],
    }),
    deleteTrackingEvent: builder.mutation<any, string>({
      query: (id) => ({ url: `/admin/tracking/${id}`, method: "DELETE" }),
      invalidatesTags: ["TrackingEvents"],
    }),
  }),
});

export const {
  useGetTrackingEventsQuery,
  useGetTrackingEventByIdQuery,
  useDeleteTrackingEventMutation,
} = trackingApi;
