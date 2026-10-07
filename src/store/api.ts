import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";
import { notifyToast } from "@/lib/toast";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState, endpoint, arg }) => {
    const token = (getState() as RootState).auth.token;
    const requestUrl = typeof arg === "string" ? arg : arg.url;
    const isRefreshRequest = requestUrl.split("?")[0] === "/auth/refresh";
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

    if (token && !isRefreshRequest) {
      headers.set("authorization", `Bearer ${token}`);
    } else if (isRefreshRequest) {
      headers.delete("authorization");
    }

    return headers;
  },
});

interface RefreshResult {
  accessToken: string | null;
  invalidToken: boolean;
}

let refreshPromise: Promise<RefreshResult> | null = null;

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch({ type: "auth/logout" });
      return result;
    }

    refreshPromise ??= (async (): Promise<RefreshResult> => {
      const refreshResult: any = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );
      if (refreshResult?.error) {
        const status = refreshResult.error.status;
        const originalStatus = refreshResult.error.originalStatus;
        const invalidToken =
          status === 401 ||
          status === 403 ||
          (status === "PARSING_ERROR" &&
            (originalStatus === 401 || originalStatus === 403));
        if (!invalidToken) {
          console.error(
            "Session refresh failed; keeping the saved session:",
            refreshResult.error,
          );
        }
        return { accessToken: null, invalidToken };
      }

      if (refreshResult?.data === undefined) {
        console.error("Session refresh returned no response data");
        return { accessToken: null, invalidToken: false };
      }

      const refreshData =
        refreshResult.data?.data ?? refreshResult.data ?? refreshResult;
      if (typeof refreshData !== "object" || refreshData === null) {
        console.error("Session refresh returned an invalid response");
        return { accessToken: null, invalidToken: false };
      }

      const tokens = refreshData.tokens ?? refreshData;
      const accessToken = tokens?.accessToken ?? tokens?.token;
      if (typeof accessToken !== "string" || !accessToken) {
        const invalidToken =
          refreshData.success === false &&
          (refreshData.statusCode === 401 || refreshData.statusCode === 403);
        if (!invalidToken) {
          console.error("Session refresh response did not include an access token");
        }
        return { accessToken: null, invalidToken };
      }

      if ((api.getState() as RootState).auth.refreshToken !== refreshToken) {
        return { accessToken: null, invalidToken: false };
      }

      const nextRefreshToken =
        typeof tokens?.refreshToken === "string" && tokens.refreshToken
          ? tokens.refreshToken
          : refreshToken;
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

      return { accessToken, invalidToken: false };
    })().finally(() => {
      refreshPromise = null;
    });

    const { accessToken, invalidToken } = await refreshPromise;
    if (accessToken) {
      result = await baseQuery(args, api, extraOptions);
    } else if (invalidToken) {
      api.dispatch({ type: "auth/logout" });
    }
  }

  if (
    typeof window !== "undefined" &&
    api.type === "mutation" &&
    api.endpoint !== "trackPageView" &&
    api.endpoint !== "trackAnalyticsEvent"
  ) {
    if (result?.error) {
      const errorData = result.error.data as
        | { message?: string; errors?: unknown[] }
        | undefined;
      const firstError = errorData?.errors?.[0];
      const validationMessage =
        typeof firstError === "string"
          ? firstError
          : firstError &&
              typeof firstError === "object" &&
              "message" in firstError &&
              typeof firstError.message === "string"
            ? firstError.message
            : undefined;
      notifyToast(
        (typeof errorData?.message === "string" && errorData.message) ||
          validationMessage ||
          "The request failed. Please try again.",
        "error",
      );
    } else {
      const response = result?.data as { message?: string } | undefined;
      const endpointLabel = api.endpoint
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^(create|update|delete|remove|set|upload|place|book|cancel)/i, (action: string) =>
          `${action} `,
        );
      notifyToast(
        response?.message ??
          `${endpointLabel.charAt(0).toUpperCase()}${endpointLabel.slice(1)} completed successfully.`,
        "success",
      );
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
