import { api } from "./api";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/admin/settings",
      providesTags: ["Settings"],
    }),
    updateStoreInfo: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/store",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateSeo: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/seo",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateSocial: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/social",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updatePixels: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/pixels",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateTheme: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/theme",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateCustomCode: builder.mutation({
      query: (data) => ({
        url: "/admin/settings/custom-code",
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
