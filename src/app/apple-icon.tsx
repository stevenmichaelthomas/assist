import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "#1A1A1A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAF8F5",
          borderRadius: 36,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        a
      </div>
    ),
    { ...size }
  );
}
