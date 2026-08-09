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
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        api.dispatch({
          type: "auth/setTokens",
          payload: refreshResult.data,
        });
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch({ type: "auth/logout" });
        window.location.href = "/login";
      }
    } else {
      api.dispatch({ type: "auth/logout" });
      window.location.href = "/login";
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
  ],
  endpoints: () => ({}),
});
