import { api } from "./api";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateStoreInfo: builder.mutation({
      query: (data) => ({
        url: "/settings/store",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateSeo: builder.mutation({
      query: (data) => ({
        url: "/settings/seo",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateSocial: builder.mutation({
      query: (data) => ({
        url: "/settings/social",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updatePixels: builder.mutation({
      query: (data) => ({
        url: "/settings/pixels",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateTheme: builder.mutation({
      query: (data) => ({
        url: "/settings/theme",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateCustomCode: builder.mutation({
      query: (data) => ({
        url: "/settings/custom-code",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateStoreInfoMutation,
  useUpdateSeoMutation,
  useUpdateSocialMutation,
  useUpdatePixelsMutation,
  useUpdateThemeMutation,
  useUpdateCustomCodeMutation,
} = settingsApi;
