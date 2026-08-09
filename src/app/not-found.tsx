import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-secondary)",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "var(--primary)",
            lineHeight: 1,
            marginBottom: 16,
            opacity: 0.2,
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Page Not Found
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 32,
            fontSize: 15,
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
