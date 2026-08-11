import { api } from "./api";

export type LandingSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
};

export type LandingPage = {
  id: string;
  projectId: string;
  pageName: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  landingContent: string;
  seo?: LandingSeo;
  createdAt?: string;
  updatedAt?: string;
};

export const landingPageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLandingPages: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: "/admin/landing-pages",
        params: params ?? {},
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({
                type: "LandingPage" as const,
                id,
              })),
              "LandingPages",
            ]
          : ["LandingPages"],
    }),
    getLandingPageById: builder.query<any, string>({
      query: (id) => `/admin/landing-pages/${id}`,
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result, error, id) => [{ type: "LandingPage", id }],
    }),
    createLandingPage: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: "/admin/landing-pages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LandingPages"],
    }),
    updateLandingPage: builder.mutation<
      any,
      { id: string; [key: string]: any }
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/landing-pages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LandingPage", id },
        "LandingPages",
      ],
    }),
    deleteLandingPage: builder.mutation<any, string>({
      query: (id) => ({ url: `/admin/landing-pages/${id}`, method: "DELETE" }),
      invalidatesTags: ["LandingPages"],
    }),
  }),
});

export const {
  useGetLandingPagesQuery,
  useGetLandingPageByIdQuery,
  useCreateLandingPageMutation,
  useUpdateLandingPageMutation,
  useDeleteLandingPageMutation,
} = landingPageApi;
