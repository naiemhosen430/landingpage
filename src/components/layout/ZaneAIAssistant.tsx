"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Bot,
  LoaderCircle,
  Maximize2,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useSendZaneAIMessageMutation } from "@/store/zaneAiApi";
import { useUploadMediaMutation } from "@/store/mediaApi";

type AiDraft = {
  message: string;
  cleanedMessage: string;
  intent: string;
  action: {
    productId?: string;
    data?: Record<string, unknown>;
  };
};

type ChatMessage = {
  role: "user" | "assistant";
  text?: string;
  html?: string;
  intent?: string;
  messageTime?: string;
  draft?: AiDraft;
};

type RenderedMessage = ChatMessage & { id: number };

const quickQuestions = [
  "What can you do?",
  "How many products do I have?",
  "Show my products",
];

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

export default function ZaneAIAssistant() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [activeDraft, setActiveDraft] = useState<AiDraft | null>(null);
  const [actionFormActive, setActionFormActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const nextMessageId = useRef(0);
  const [sendMessage, { isLoading: sending }] = useSendZaneAIMessageMutation();
  const [uploadMedia] = useUploadMediaMutation();

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [open, messages, sending]);

  const appendAssistantMessage = (response: any, nextDraft: AiDraft | null) => {
    setMessages((current) => [
      ...current,
      {
        id: nextMessageId.current++,
        role: "assistant",
        html:
          response.reply || "<p>I could not find an answer for that yet.</p>",
        intent: response.intent,
        messageTime: response.messageTime,
        draft: nextDraft ?? undefined,
      },
    ]);
  };

  const ask = async (question: string) => {
    const message = question.trim();
    if (!message || sending || actionFormActive) return;

    setMessages((current) => [
      ...current,
      { id: nextMessageId.current++, role: "user", text: message },
    ]);
    setDraft("");

    try {
      const response = await sendMessage({ message }).unwrap();
      const nextDraft = response.result?.draft ?? null;
      appendAssistantMessage(response, nextDraft);
      setActiveDraft(nextDraft);
      setActionFormActive(Boolean(response.result?.formRequired && nextDraft));
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "assistant",
          text: error?.data?.message ?? "ZaneAI is unavailable right now.",
          messageTime: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleAiActionFormSubmit = async (
    event: SubmitEvent,
    form: HTMLFormElement,
  ) => {
    event.preventDefault();
    if (!activeDraft || sending) return;

    const formData = new FormData(form);
    const thumbnailFile = formData.get("thumbnailImage");
    const galleryFiles = formData
      .getAll("images")
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );
    const values = Object.fromEntries(
      [...formData.entries()].filter(
        ([name, value]) =>
          name !== "thumbnailImage" &&
          name !== "images" &&
          value !== "" &&
          !(value instanceof File),
      ),
    );
    const productId = values.productId;
    const submittedData = { ...values };
    delete submittedData.productId;
    const data: Record<string, unknown> = {
      ...(activeDraft.action.data ?? {}),
      ...submittedData,
    };

    try {
      if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
        const uploaded = await uploadMedia({
          images: [await fileToDataUri(thumbnailFile)],
          folder: "products",
        }).unwrap();
        data.thumbnailImage = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      }

      if (galleryFiles.length) {
        const uploaded = await uploadMedia({
          images: await Promise.all(galleryFiles.map(fileToDataUri)),
          folder: "products",
        }).unwrap();
        data.images = Array.isArray(uploaded) ? uploaded : [uploaded];
      }

      const submittedDraft: AiDraft = {
        ...activeDraft,
        action: {
          ...(productId ? { productId: String(productId) } : {}),
          data,
        },
      };
      setActiveDraft(submittedDraft);

      const response = await sendMessage({
        message: submittedDraft.message,
        confirmed: true,
        action: {
          ...(submittedDraft.action.productId
            ? { productId: submittedDraft.action.productId }
            : {}),
          data,
        },
      }).unwrap();
      const nextDraft = response.result?.draft ?? null;
      appendAssistantMessage(response, nextDraft);
      setActiveDraft(nextDraft);
      setActionFormActive(Boolean(response.result?.formRequired && nextDraft));
    } catch (error: any) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "assistant",
          text: error?.data?.message ?? "AI action failed. Please try again.",
          messageTime: new Date().toISOString(),
        },
      ]);
      setActionFormActive(true);
    }
  };

  useEffect(() => {
    const forms = panelRef.current?.querySelectorAll<HTMLFormElement>(
      'form[data-admin-ai-form="true"]',
    );
    if (!forms?.length) return;

    const cleanups = [...forms].map((form) => {
      const submitHandler = (event: SubmitEvent) => {
        void handleAiActionFormSubmit(event, form);
      };
      form.addEventListener("submit", submitHandler);
      return () => form.removeEventListener("submit", submitHandler);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [messages, activeDraft, sending]);

  const cancelActionForm = () => {
    setActiveDraft(null);
    setActionFormActive(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(draft);
  };

  return (
    <>
      <button
        type="button"
        className="header-btn zane-ai-trigger"
        aria-label="Open ZaneAI assistant"
        title="ZaneAI assistant"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Sparkles size={18} />
      </button>

      {open && (
        <aside
          ref={panelRef}
          className={`zane-ai-panel ${fullscreen ? "is-fullscreen" : ""}`}
          aria-label="ZaneAI assistant"
        >
          <div className="zane-ai-header">
            <div className="zane-ai-title">
              <span className="zane-ai-avatar">
                <Bot size={18} />
              </span>
              <div>
                <strong>ZaneAI</strong>
                <span>Your store assistant</span>
              </div>
            </div>
            <div className="zane-ai-header-actions">
              <button
                type="button"
                className="zane-ai-close"
                aria-label={fullscreen ? "Exit fullscreen" : "Open fullscreen"}
                title={fullscreen ? "Exit fullscreen" : "Open fullscreen"}
                onClick={() => setFullscreen((current) => !current)}
              >
                {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
              <button
                type="button"
                className="zane-ai-close"
                aria-label="Close ZaneAI"
                title="Close ZaneAI"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="zane-ai-messages" aria-live="polite">
            {!messages.length && (
              <div className="zane-ai-welcome">
                <span className="zane-ai-welcome-icon">
                  <MessageCircle size={20} />
                </span>
                <strong>How can I help?</strong>
                <p>
                  Ask about your store, orders, products, or dashboard data.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`zane-ai-message ${message.role}`}
              >
                {message.role === "assistant" && message.html ? (
                  <>
                    <div
                      className="zane-ai-html-response"
                      dangerouslySetInnerHTML={{ __html: message.html }}
                    />
                    {(message.intent || message.messageTime) && (
                      <span className="zane-ai-response-meta">
                        {message.intent?.replaceAll("_", " ")}
                        {message.messageTime
                          ? `${message.intent ? " · " : ""}${new Date(message.messageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : ""}
                      </span>
                    )}
                  </>
                ) : (
                  message.text
                )}
              </div>
            ))}
            {sending && (
              <div className="zane-ai-message assistant zane-ai-typing">
                <LoaderCircle size={15} /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {!actionFormActive && (
            <div className="zane-ai-quick-questions">
              <span>Quick questions</span>
              <div>
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void ask(question)}
                    disabled={sending}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {actionFormActive ? (
            <button
              type="button"
              className="zane-ai-cancel"
              onClick={cancelActionForm}
              disabled={sending}
            >
              Cancel action
            </button>
          ) : (
            <form className="zane-ai-composer" onSubmit={submit}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask ZaneAI..."
                aria-label="Message ZaneAI"
                disabled={sending}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim() || sending}
              >
                <Send size={17} />
              </button>
            </form>
          )}
        </aside>
      )}
    </>
  );
}
