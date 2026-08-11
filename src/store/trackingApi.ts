import { api } from "./api";

export type TrackingEvent = {
  id: string;
  projectId: string;
  eventType: string;
  eventName: string;
  payload: any;
  createdAt?: string;
};

export const trackingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrackingEvents: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: "/admin/tracking", params: params ?? {} }),
      providesTags: (result) =>
        result?.data ? [{ type: "TrackingEvents" as const }] : [],
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
