import { api } from "./api";

export interface ZaneAIChatPayload {
  message: string;
  confirmed?: boolean;
  action?: {
    productId?: string;
    data?: Record<string, unknown>;
  };
}

export interface ZaneAIResponse {
  cleanedMessage?: string;
  language?: "en" | "bn" | "bn-latn" | string;
  intent?: string;
  messageTime: string;
  task?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
  result?: {
    formRequired?: boolean;
    draft?: {
      message: string;
      cleanedMessage: string;
      intent: string;
      action: {
        productId?: string;
        data?: Record<string, unknown>;
      };
    };
    [key: string]: unknown;
  };
  reply: string;
}

export const zaneAiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendZaneAIMessage: builder.mutation<ZaneAIResponse, ZaneAIChatPayload>({
      query: (body) => ({
        url: "/admin/ai/chat",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ZaneAIResponse }) => response.data,
    }),
  }),
});

export const { useSendZaneAIMessageMutation } = zaneAiApi;
