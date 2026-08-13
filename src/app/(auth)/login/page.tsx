"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/authApi";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

type ErrorType = "auth" | "network" | "cors" | "server" | "validation";

interface ParsedError {
  message: string;
  type: ErrorType;
}

function parseError(err: any): ParsedError {
  // CORS / Network (no response reached server)
  if (!err.status && err.error) {
    if (
      err.error.includes("fetch") ||
      err.error.includes("network") ||
      err.error.includes("Failed to fetch")
    ) {
      return {
        type: "cors",
        message: "Cannot connect to server. CORS or server may be down.",
      };
    }
    return { type: "network", message: "Network error. Please try again." };
  }

  // RTK Query error with data from server
  if (err.data?.message) {
    return { type: "auth", message: err.data.message };
  }

  if (err.data?.errors && Array.isArray(err.data.errors)) {
    return {
      type: "validation",
      message: err.data.errors.map((e: any) => e.message || e).join(", "),
    };
  }

  // HTTP status based
  if (err.status === 401 || err.status === 403) {
    return {
      type: "auth",
      message: err.data?.message || "Invalid credentials",
    };
  }
  if (err.status === 404) {
    return { type: "server", message: "Login service not found." };
  }
  if (err.status >= 500) {
    return { type: "server", message: "Server error. Please try later." };
  }

  return { type: "server", message: "Something went wrong. Please try again." };
}

const errorIcons: Record<ErrorType, string> = {
  auth: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  network:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  cors: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  server:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  validation: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const errorTitles: Record<ErrorType, string> = {
  auth: "Authentication Failed",
  network: "Connection Error",
  cors: "CORS Blocked",
  server: "Server Error",
  validation: "Validation Error",
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ParsedError | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const root = document.querySelector(".prm-auth-page");
    let theme = "light";

    try {
      const stored = localStorage.getItem("dashboard-theme");
      if (stored === "light" || stored === "dark") {
        theme = stored;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      }
    } catch (e) {
      // ignore
    }

    if (root) {
      root.setAttribute("data-theme", theme);
    }
  }, []);

  // Trigger shake animation when error changes
  useEffect(() => {
    if (error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setError(null);

    if (!email || !password) {
      setError({
        type: "validation",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      const response = await login({
        email,
        password,
      });

      // RTK Query error response
      if ("error" in response) {
        console.error("LOGIN ERROR:", response.error);

        setError(parseError(response.error));
        return;
      }

      /**
       * API response:
       *
       * {
       *   success: true,
       *   message: "Login successful",
       *   data: {
       *     user: {...},
       *     tokens: {
       *       accessToken: "...",
       *       refreshToken: "...",
       *       expiresIn: 900
       *     }
       *   }
       * }
       */

      const result = response.data;

      if (!result?.success || !result?.data) {
        setError({
          type: "server",
          message: result?.message || "Login failed",
        });
        return;
      }

      const user = result.data.user;
      const accessToken = result.data.tokens?.accessToken;
      const refreshToken = result.data.tokens?.refreshToken;

      // Make sure required authentication data exists
      if (!user || !accessToken) {
        console.error("Invalid login response:", result);

        setError({
          type: "server",
          message: "Login response is missing authentication data.",
        });

        return;
      }

      // Save credentials to Redux
      dispatch(
        setCredentials({
          user,
          token: accessToken,
          refreshToken: refreshToken ?? null,
        }),
      );

      // Redirect after successful login
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("LOGIN EXCEPTION:", err);

      setError(parseError(err));
    }
  };

  const hasFieldError = error?.type === "validation" || error?.type === "auth";

  return (
    <>
      <style>{`
        @keyframes prm-fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes prm-fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes prm-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        @keyframes prm-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes prm-meshDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes prm-orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 30px); }
        }
        @keyframes prm-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes prm-slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .prm-auth-page {
          --auth-page-bg: #0b0b10;
          --auth-card-bg: rgba(17, 17, 27, 0.65);
          --auth-border: rgba(255, 255, 255, 0.06);
          --auth-input-bg: rgba(255, 255, 255, 0.025);
          --auth-input-border: rgba(255, 255, 255, 0.07);
          --auth-text: #f1f5f9;
          --auth-muted: #94a3b8;
          --auth-error-bg: rgba(244, 63, 94, 0.06);
          --auth-error-border: rgba(244, 63, 94, 0.15);
          --auth-error-title: #fda4af;
          --auth-error-text: #fb7185;

          margin: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--auth-page-bg);
          color: var(--auth-text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px;
          box-sizing: border-box;
        }

        .prm-auth-page[data-theme="light"] {
          --auth-page-bg: #f8fafc;
          --auth-card-bg: rgba(255, 255, 255, 0.98);
          --auth-border: rgba(148, 163, 184, 0.24);
          --auth-input-bg: #f8fafc;
          --auth-input-border: #e2e8f0;
          --auth-text: #0f172a;
          --auth-muted: #64748b;
          --auth-error-bg: #fee2e2;
          --auth-error-border: #fecaca;
          --auth-error-title: #b91c1c;
          --auth-error-text: #991b1b;
        }

        .prm-auth-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 15% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 80%, rgba(192, 132, 252, 0.08) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 70%);
          animation: prm-meshDrift 18s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .prm-auth-orb {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(192, 132, 252, 0.04));
          filter: blur(90px);
          top: -150px;
          right: -150px;
          animation: prm-orbFloat 14s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .prm-auth-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
        }

        .prm-auth-logo {
          text-align: center;
          margin-bottom: 2rem;
          animation: prm-fadeInDown 0.6s ease-out;
        }

        .prm-auth-logo h1 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 0.375rem 0;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #f8fafc 0%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .prm-auth-logo p {
          font-size: 0.9375rem;
          color: var(--auth-muted);
          margin: 0;
          font-weight: 400;
        }

        .prm-auth-card {
          background: var(--auth-card-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--auth-border);
          border-radius: 20px;
          padding: 2.25rem;
          box-shadow:
            0 24px 48px -12px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 0 60px rgba(99, 102, 241, 0.08);
          position: relative;
          overflow: hidden;
          animation: prm-fadeInUp 0.6s ease-out 0.08s both;
        }

        .prm-auth-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(192, 132, 252, 0.08), transparent 65%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* ===== ERROR BANNER ===== */
        .prm-auth-error {
          background: var(--auth-error-bg);
          border: 1px solid var(--auth-error-border);
          border-radius: 14px;
          padding: 1rem 1.125rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          animation: prm-slideDown 0.35s ease-out;
          position: relative;
          overflow: hidden;
        }

        .prm-auth-error::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #f43f5e, #e11d48);
          border-radius: 14px 0 0 14px;
        }

        .prm-auth-error-shake {
          animation: prm-slideDown 0.35s ease-out, prm-shake 0.5s ease-in-out;
        }

        .prm-auth-error-icon-wrap {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(244, 63, 94, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }

        .prm-auth-error-icon {
          width: 16px;
          height: 16px;
          color: #fb7185;
        }

        .prm-auth-error-body {
          flex: 1;
          min-width: 0;
        }

        .prm-auth-error-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--auth-error-title);
          margin: 0 0 0.125rem 0;
          line-height: 1.4;
        }

        .prm-auth-error-msg {
          font-size: 0.8125rem;
          font-weight: 400;
          color: var(--auth-error-text);
          margin: 0;
          line-height: 1.5;
        }

        .prm-auth-error-close {
          flex-shrink: 0;
          background: none;
          border: none;
          padding: 2px;
          margin: -2px;
          cursor: pointer;
          color: #64748b;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .prm-auth-error-close:hover {
          color: #f43f5e;
        }

        /* ===== FIELD ERROR STATE ===== */
        .prm-auth-field {
          position: relative;
          margin-bottom: 1rem;
        }

        .prm-auth-field:last-of-type {
          margin-bottom: 1.5rem;
        }

        .prm-auth-field.prm-field-error .prm-auth-input {
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(244, 63, 94, 0.03);
        }

        .prm-auth-field.prm-field-error .prm-auth-input:focus {
          border-color: rgba(244, 63, 94, 0.6);
          box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.08), 0 0 20px rgba(244, 63, 94, 0.06);
        }

        .prm-auth-field.prm-field-error .prm-auth-field-icon {
          color: #f43f5e;
        }

        .prm-auth-field-error-text {
          font-size: 0.75rem;
          color: #fb7185;
          margin-top: 0.375rem;
          margin-left: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          animation: prm-slideDown 0.25s ease-out;
        }

        .prm-auth-field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: var(--auth-muted);
          transition: all 0.25s ease;
          pointer-events: none;
          z-index: 2;
        }

        .prm-auth-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.8125rem;
          color: var(--auth-muted);
          animation: prm-fadeInUp 0.6s ease-out 0.16s both;
        }

        .prm-auth-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: var(--auth-input-bg);
          border: 1px solid var(--auth-input-border);
          border-radius: 12px;
          color: var(--auth-text);
          font-size: 0.9375rem;
          font-weight: 400;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .prm-auth-input::placeholder {
          color: var(--auth-muted);
        }

        .prm-auth-input:hover {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.035);
        }

        .prm-auth-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(99, 102, 241, 0.03);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 0 24px rgba(99, 102, 241, 0.08);
        }

        .prm-auth-field:focus-within .prm-auth-field-icon {
          color: #818cf8;
        }

        .prm-auth-submit {
          width: 100%;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
          font-family: inherit;
        }

        .prm-auth-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%);
        }

        .prm-auth-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99, 102, 241, 0.45);
        }

        .prm-auth-submit:hover::after {
          animation: prm-shimmer 0.9s ease;
        }

        .prm-auth-submit:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
        }

        .prm-auth-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .prm-auth-submit:disabled::after {
          display: none;
        }

        .prm-auth-spinner {
          display: inline-block;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: prm-spin 0.75s linear infinite;
        }

        .prm-auth-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.8125rem;
          color: #475569;
          animation: prm-fadeInUp 0.6s ease-out 0.16s both;
        }

        .prm-auth-footer-line {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 0 auto 0.875rem;
        }

        @media (max-width: 480px) {
          .prm-auth-page { padding: 16px; }
          .prm-auth-card { padding: 1.75rem; border-radius: 16px; }
          .prm-auth-logo h1 { font-size: 1.75rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .prm-auth-logo, .prm-auth-card, .prm-auth-footer, .prm-auth-error {
            animation: none;
          }
          .prm-auth-page::before, .prm-auth-orb {
            animation: none;
          }
        }
      `}</style>

      <div className="prm-auth-page">
        <div className="prm-auth-orb" />
        <div className="prm-auth-wrap">
          <div className="prm-auth-logo">
            <h1>{process.env.NEXT_PUBLIC_STORE_NAME || "Store"}</h1>
            <p>Sign in to your dashboard</p>
          </div>

          <div className="prm-auth-card">
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  className={`prm-auth-error ${shake ? "prm-auth-error-shake" : ""}`}
                >
                  <div className="prm-auth-error-icon-wrap">
                    <svg
                      className="prm-auth-error-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={errorIcons[error.type]} />
                    </svg>
                  </div>
                  <div className="prm-auth-error-body">
                    <p className="prm-auth-error-title">
                      {errorTitles[error.type]}
                    </p>
                    <p className="prm-auth-error-msg">{error.message}</p>
                  </div>
                  <button
                    type="button"
                    className="prm-auth-error-close"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              <div
                className={`prm-auth-field ${hasFieldError ? "prm-field-error" : ""}`}
              >
                <svg
                  className="prm-auth-field-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className="prm-auth-input"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error?.type === "validation" || error?.type === "auth")
                      setError(null);
                  }}
                  required
                />
              </div>

              <div
                className={`prm-auth-field ${hasFieldError ? "prm-field-error" : ""}`}
              >
                <svg
                  className="prm-auth-field-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  className="prm-auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error?.type === "validation" || error?.type === "auth")
                      setError(null);
                  }}
                  required
                />
                {hasFieldError && (
                  <div className="prm-auth-field-error-text">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="prm-auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="prm-auth-spinner"
                      style={{ width: 18, height: 18, borderWidth: 2 }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <div className="prm-auth-footer">
            <div className="prm-auth-footer-line" />
            Protected by {process.env.NEXT_PUBLIC_APP_NAME || "Platform"}
          </div>
        </div>
      </div>
    </>
  );
}
