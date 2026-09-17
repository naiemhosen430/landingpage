import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.token;
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
    const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY;

    if (
      !endpoint.startsWith("getStorageUsage") &&
      !endpoint.startsWith("listStorageModule") &&
      !endpoint.startsWith("deleteStorageRecords")
    ) {
      headers.set("x-project-id", projectId || "");
      headers.set("x-project-key", projectKey || "");
    }

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch({ type: "auth/logout" });
      return result;
    }

    refreshPromise ??= (async () => {
      const refreshResult: any = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );
      const hasData = refreshResult && refreshResult.data !== undefined;
      if (!hasData) return null;

      const refreshData =
        refreshResult.data?.data ?? refreshResult.data ?? refreshResult;
      const tokens = refreshData.tokens ?? refreshData;
      const accessToken = tokens?.accessToken ?? tokens?.token;
      if (!accessToken) return null;

      const nextRefreshToken = tokens?.refreshToken ?? refreshToken;
      api.dispatch({
        type: "auth/setTokens",
        payload: { token: accessToken, refreshToken: nextRefreshToken },
      });

      if (refreshData.user) {
        api.dispatch({
          type: "auth/setCredentials",
          payload: {
            user: refreshData.user,
            token: accessToken,
            refreshToken: nextRefreshToken,
          },
        });
      }

      return accessToken;
    })().finally(() => {
      refreshPromise = null;
    });

    const accessToken = await refreshPromise;
    if (accessToken) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Dashboard",
    "Products",
    "Product",
    "Orders",
    "Order",
    "Settings",
    "Media",
    "Profile",
    "Analytics",
    "Courier",
    "Package",
    "LandingPage",
    "LandingPages",
    "Category",
    "Categories",
    "DeliveryAreas",
    "DeliveryArea",
    "PaymentMethods",
    "TrackingEvents",
    "TrackingEvent",
    "Storage",
    "HomePage",
  ],
  endpoints: () => ({}),
});
