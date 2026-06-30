import { GeistSans } from "geist/font/sans";

/**
 * Root not-found. Lives outside the [locale] layout, so it renders its own
 * <html>. Redirects users back to the default-locale landing page.
 */
export default function RootNotFound() {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          background: "#0B0F1A",
          color: "#F9FAFB",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "6rem", fontWeight: 900, margin: 0, lineHeight: 1 }}>
          404
        </h1>
        <p style={{ color: "rgba(249,250,251,0.6)", margin: 0 }}>
          This page could not be found.
        </p>
        <a
          href="/en"
          style={{
            background: "#22C55E",
            color: "#000",
            padding: "0.75rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: 900,
            textTransform: "uppercase",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          Back to GymSpot
        </a>
      </body>
    </html>
  );
}
