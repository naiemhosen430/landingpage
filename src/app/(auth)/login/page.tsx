"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/authApi";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.token,
          refreshToken: result.data.refreshToken,
        }),
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message || "Invalid credentials");
    }
  };

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

        .prm-auth-page {
          margin: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0b0b10;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px;
          box-sizing: border-box;
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
          color: #94a3b8;
          margin: 0;
          font-weight: 400;
        }

        .prm-auth-card {
          background: rgba(17, 17, 27, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
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

        .prm-auth-error {
          background: rgba(244, 63, 94, 0.07);
          border: 1px solid rgba(244, 63, 94, 0.18);
          color: #fb7185;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: prm-shake 0.5s ease-in-out, prm-fadeInUp 0.3s ease-out;
        }

        .prm-auth-error-icon {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
        }

        .prm-auth-field {
          position: relative;
          margin-bottom: 1rem;
        }

        .prm-auth-field:last-of-type {
          margin-bottom: 1.5rem;
        }

        .prm-auth-field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: #64748b;
          transition: all 0.25s ease;
          pointer-events: none;
          z-index: 2;
        }

        .prm-auth-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 0.9375rem;
          font-weight: 400;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .prm-auth-input::placeholder {
          color: #475569;
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
                <div className="prm-auth-error">
                  <svg
                    className="prm-auth-error-icon"
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
                  {error}
                </div>
              )}

              <div className="prm-auth-field">
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="prm-auth-field">
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
