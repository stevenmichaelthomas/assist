import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Assist — AI-Powered Operations for CPG Brands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF8F5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "#C4704B15",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            right: 200,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "#7A8B6F10",
            display: "flex",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: 40,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          assist
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 800,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          We work side by side with you to make AI actually work
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 24,
            color: "#9B958F",
            maxWidth: 600,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          AI tools built by CPG founders, battle-tested on our own brands.
          Now available to yours.
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#C4704B",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
