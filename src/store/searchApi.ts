import { api } from "./api";

export type GlobalSearchResult = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
};

export type GlobalSearchResponse = {
  results: GlobalSearchResult[];
  hasMore: boolean;
};

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<
      GlobalSearchResponse,
      { query: string; offset: number }
    >({
      query: ({ query, offset }) => ({
        url: "/admin/search",
        params: { q: query, offset },
      }),
      transformResponse: (response: any) => {
        const payload = response?.data ?? response;
        const data = payload?.data ?? payload;
        return {
          results: Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data)
              ? data
              : [],
          hasMore: data?.hasMore === true,
        };
      },
    }),
  }),
});

export const { useGlobalSearchQuery } = searchApi;
