import { api } from "./api";

export type MediaAsset = {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
  createdAt?: string;
  resourceType: string;
  type: string;
  etag?: string;
  tags: string[];
};

export type MediaListResponse = {
  resources: MediaAsset[];
  nextCursor?: string;
};

export type MediaListParams = {
  projectId?: string;
  folder?: string;
  limit?: number;
  nextCursor?: string;
};

export type MediaUploadPayload = {
  projectId?: string;
  folder?: string;
  images: string[];
};

export const mediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMedia: builder.query<MediaListResponse, MediaListParams | void>({
      query: (params) => ({ url: "/admin/uploads", params: params ?? {} }),
      transformResponse: (response: any) => {
        const payload = response?.data ?? response;

        // normalized list extraction supporting multiple backend shapes:
        // - { data: { data: [ ... ], meta: { ... } } }
        // - { data: { resources: [ ... ], nextCursor } }
        // - { resources: [ ... ], nextCursor }
        // - raw array
        const items =
          Array.isArray(payload?.data) && payload.data.length
            ? payload.data
            : Array.isArray(payload?.resources) && payload.resources.length
            ? payload.resources
            : Array.isArray(payload) && payload.length
            ? payload
            : [];

        const meta = payload?.meta ?? payload;
        const nextCursor =
          payload?.nextCursor ?? meta?.nextCursor ??
          (meta?.hasNextPage ? String((meta.page ?? 0) + 1) : undefined);

        const normalize = (it: any) => ({
          publicId: it.publicId ?? it.public_id ?? it.public_id?.toString() ?? it.public_id,
          url: it.url ?? it.url,
          secureUrl: it.secureUrl ?? it.secure_url ?? it.secure_url,
          format: it.format,
          width: typeof it.width === "number" ? it.width : Number(it.width) || 0,
          height: typeof it.height === "number" ? it.height : Number(it.height) || 0,
          bytes: typeof it.bytes === "number" ? it.bytes : Number(it.bytes) || 0,
          folder: it.folder,
          createdAt: it.createdAt ?? it.created_at,
          resourceType: it.resourceType ?? it.resource_type ?? "image",
          type: it.type ?? "upload",
          etag: it.etag,
          tags: Array.isArray(it.tags) ? it.tags : [],
        });

        return {
          resources: items.map(normalize),
          nextCursor,
        } as MediaListResponse;
      },
      providesTags: ["Media"],
    }),
    getMediaDetail: builder.query<
      MediaAsset,
      { publicId: string; projectId?: string }
    >({
      query: ({ publicId, projectId }) => ({
        url: `/admin/uploads/${publicId.split("/").map(encodeURIComponent).join("/")}`,
        params: projectId ? { projectId } : undefined,
      }),
      transformResponse: (response: any) => response?.data?.data ?? response?.data ?? response,
      providesTags: (result, error, { publicId }) => [
        { type: "Media", id: publicId },
      ],
    }),
    uploadMedia: builder.mutation<
      MediaAsset | MediaAsset[],
      MediaUploadPayload
    >({
      query: (body) => ({ url: "/admin/uploads", method: "POST", body }),
      transformResponse: (response: any) => response?.data?.data ?? response?.data ?? response,
      invalidatesTags: ["Media"],
    }),
    deleteMedia: builder.mutation<
      void,
      { projectId?: string; publicId?: string; publicIds?: string[] }
    >({
      query: (body) => ({ url: "/admin/uploads", method: "DELETE", body }),
      invalidatesTags: ["Media"],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useGetMediaDetailQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
