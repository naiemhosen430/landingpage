import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
    const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY;

    headers.set("x-project-id", projectId || "");
    headers.set("x-project-key", projectKey || "");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch({ type: "auth/logout" });
      return result;
    }

    const refreshResult: any = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    const hasData = refreshResult && (refreshResult as any).data !== undefined;

    if (hasData) {
      const refreshData =
        (refreshResult as any).data?.data ??
        (refreshResult as any).data ??
        refreshResult;
      const tokens = refreshData.tokens ?? refreshData;
      const accessToken = tokens?.accessToken ?? tokens?.token;
      const nextRefreshToken = tokens?.refreshToken ?? refreshToken;
      const refreshedUser = refreshData?.user ?? null;

      if (!accessToken) {
        api.dispatch({ type: "auth/logout" });
        return result;
      }

      api.dispatch({
        type: "auth/setTokens",
        payload: {
          token: accessToken,
          refreshToken: nextRefreshToken,
        },
      });

      if (refreshedUser) {
        api.dispatch({
          type: "auth/setCredentials",
          payload: {
            user: refreshedUser,
            token: accessToken,
            refreshToken: nextRefreshToken,
          },
        });
      }

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
    "DeliveryAreas",
    "DeliveryArea",
    "PaymentMethods",
    "TrackingEvents",
    "TrackingEvent",
  ],
  endpoints: () => ({}),
});
