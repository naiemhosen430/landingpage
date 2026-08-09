import { api } from "./api";

export const mediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMedia: builder.query({
      query: (params) => ({
        url: "/media",
        params,
      }),
      providesTags: ["Media"],
    }),
    uploadMedia: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/media/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Media"],
    }),
    deleteMedia: builder.mutation({
      query: (id) => ({
        url: `/media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
