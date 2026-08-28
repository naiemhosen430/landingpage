import { api } from "./api";

export type SocialProviderSettings = {
  enabled: boolean;
  pixelId?: string;
  testEventCode?: string;
  accessToken?: string;
};

export type SettingsData = {
  store: {
    currency: string;
    timezone: string;
    language: string;
    taxRate: number;
    shippingEnabled: boolean;
    guestCheckout: boolean;
    inventoryTracking: boolean;
    lowStockThreshold: number;
    socialTracking?: {
      facebook?: SocialProviderSettings;
      tiktok?: SocialProviderSettings;
    };
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    customCss?: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: Record<string, string>;
    socialLinks?: Record<string, string>;
  };
};

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ data: SettingsData }, void>({
      query: () => "/admin/settings",
      providesTags: ["Settings"],
    }),
    updateStoreInfo: builder.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/admin/settings/store",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateBranding: builder.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/admin/settings/branding",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateContact: builder.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/admin/settings/contact",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateAllSettings: builder.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/admin/settings",
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
  useUpdateBrandingMutation,
  useUpdateContactMutation,
  useUpdateAllSettingsMutation,
} = settingsApi;
