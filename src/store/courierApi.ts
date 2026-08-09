import { api } from "./api";

export const courierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourierSettings: builder.query({
      query: () => "/courier/settings",
      providesTags: ["Courier"],
    }),
    updateCourierSettings: builder.mutation({
      query: (data) => ({
        url: "/courier/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Courier"],
    }),
    getCourierProviders: builder.query({
      query: () => "/courier/providers",
    }),
    testCourierConnection: builder.mutation({
      query: (providerId) => ({
        url: `/courier/${providerId}/test`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCourierSettingsQuery,
  useUpdateCourierSettingsMutation,
  useGetCourierProvidersQuery,
  useTestCourierConnectionMutation,
} = courierApi;
