import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#1A1A1A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAF8F5",
          borderRadius: 6,
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
