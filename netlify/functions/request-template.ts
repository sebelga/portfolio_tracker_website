import { Resend } from "resend";
import { initFirebase } from "../lib/firebase";
import { SHEET_TEMPLATE_URL, TEMPLATE_VERSION } from "../../constants.mjs";
import type { License } from "../lib/types";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "../../.env.local" });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = new Resend(RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const licenseKey = body.licenseKey?.trim();

    if (!licenseKey) {
      return Response.json(
        { error: "License key is required." },
        { status: 400 },
      );
    }

    const db = initFirebase();
    const docRef = db.collection("licenses").doc(licenseKey);
    const doc = await docRef.get();

    if (!doc.exists) {
      return Response.json(
        { error: "Invalid license key. Please check and try again." },
        { status: 404 },
      );
    }

    const licenseData = doc.data() as License;

    if (licenseData.status !== "active") {
      return Response.json(
        { error: "This license is no longer active." },
        { status: 403 },
      );
    }

    // Rate limiting: reuse the same recoveryEmailTimestamps field (max 4/day, 15min cooldown)
    let rawTimestamps: any[] =
      licenseData.metadata?.recoveryEmailTimestamps || [];

    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const COOLDOWN_MS = 15 * 60 * 1000;

    let recentTimestamps: number[] = rawTimestamps
      .map((ts) => (typeof ts === "number" ? ts : ts.toMillis()))
      .filter((ms) => now - ms < ONE_DAY_MS);

    recentTimestamps.sort((a, b) => b - a);

    if (recentTimestamps.length > 0) {
      const timeSinceLastEmailMs = now - recentTimestamps[0];
      if (timeSinceLastEmailMs < COOLDOWN_MS) {
        const minutesLeft = Math.ceil(
          (COOLDOWN_MS - timeSinceLastEmailMs) / 60000,
        );
        return Response.json(
          {
            error: `Please wait ${minutesLeft} minute(s) before requesting another email.`,
          },
          { status: 429 },
        );
      }
    }

    if (recentTimestamps.length >= 4) {
      return Response.json(
        {
          error:
            "Limit reached: You can only request this 4 times per 24 hours.",
        },
        { status: 429 },
      );
    }

    recentTimestamps.push(now);
    await docRef.update({
      "metadata.recoveryEmailTimestamps": recentTimestamps,
    });

    // Send email with template link
    if (RESEND_API_KEY) {
      const { error: resendError } = await resend.emails.send({
        from: `Portfolio Tracker <${EMAIL_FROM}>`,
        to: [licenseData.email],
        subject: `Portfolio Tracker Template v${TEMPLATE_VERSION}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Your Portfolio Tracker Template</h2>
            <p>You requested the latest version of the official template sheet.</p>
            <p style="margin: 8px 0; color: #666; font-size: 14px;">Template version: <strong>${TEMPLATE_VERSION}</strong></p>
            <div style="margin: 24px 0; text-align: center;">
              <a href="${SHEET_TEMPLATE_URL}" style="display: inline-block; background-color: #16a34a; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px;">Get your template copy</a>
            </div>
            <p><strong>How to use it:</strong></p>
            <ul>
              <li>Click the button above to make a copy in your Google Drive.</li>
              <li>Open the copy and install the Portfolio Tracker add-on.</li>
              <li>Enter your license key in the Configuration sheet.</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      });

      if (resendError) {
        console.warn("Non-fatal: Failed to send template email:", resendError);
      }
    }

    return Response.json({ message: "Template link sent to your email." });
  } catch (error) {
    console.error("Critical error in request-template:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
