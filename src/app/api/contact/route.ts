import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, brand, message } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        brand TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO contact_submissions (name, email, brand, message)
      VALUES (${name}, ${email}, ${brand || null}, ${message || null})
    `;

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Assist <onboarding@resend.dev>",
        to: process.env.NOTIFICATION_EMAIL!,
        subject: `New lead: ${name}${brand ? ` from ${brand}` : ""}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          brand ? `Brand: ${brand}` : null,
          message ? `Message: ${message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }
}
