import { Resend } from "resend";
import { initFirebase } from "../lib/firebase";
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
    const email = body.email;

    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    const db = initFirebase();
    const licensesRef = db.collection("licenses");
    const snapshot = await licensesRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return Response.json({ message: "Request received." });
    }

    // Get the first matching license
    const doc = snapshot.docs[0];
    const licenseKey = doc.id;
    const licenseData = doc.data() as License;

    // 1. Rate Limiting Check (Max 4 per day + 15 min cooldown)
    let rawTimestamps: any[] =
      licenseData.metadata?.recoveryEmailTimestamps || [];

    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const COOLDOWN_MS = 15 * 60 * 1000;

    // Parse and filter timestamps within the last 24 hours
    let recentTimestamps: number[] = rawTimestamps
      .map((ts) => (typeof ts === "number" ? ts : ts.toMillis()))
      .filter((ms) => now - ms < ONE_DAY_MS);

    // Sort descending (latest first)
    recentTimestamps.sort((a, b) => b - a);

    if (recentTimestamps.length > 0) {
      const timeSinceLastEmailMs = now - recentTimestamps[0];

      if (timeSinceLastEmailMs < COOLDOWN_MS) {
        const minutesLeft = Math.ceil(
          (COOLDOWN_MS - timeSinceLastEmailMs) / 60000,
        );
        return Response.json(
          {
            error: `Please wait ${minutesLeft} minute(s) before requesting another recovery email.`,
          },
          { status: 429 },
        );
      }
    }

    if (recentTimestamps.length >= 4) {
      return Response.json(
        {
          error:
            "Limit reached: You can only request a license recovery 4 times per 24 hours.",
        },
        { status: 429 },
      );
    }

    // Add current timestamp to the array
    recentTimestamps.push(now);

    // 2. Mark the timestamps before sending to lock the record
    await licensesRef.doc(licenseKey).update({
      "metadata.recoveryEmailTimestamps": recentTimestamps,
    });

    // Send the email via Resend
    if (RESEND_API_KEY) {
      const { error: resendError } = await resend.emails.send({
        from: `TradeGist Beta <${EMAIL_FROM}>`,
        to: [email],
        subject: "Your Recovered TradeGist License Key",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Here is your TradeGist License Key!</h2>
            <p>You recently requested to recover your license key.</p>
            <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <code style="font-size: 24px; font-weight: bold; color: #000;">${licenseKey}</code>
            </div>
            <p><strong>How to use it:</strong></p>
            <ul>
              <li>Open your TradeGist sheet.</li>
              <li>Navigate to the "Configuration" sheet.</li>
              <li>Paste your key next to "license_key" in the General configuration section.</li>
            </ul>
          </div>
        `,
      });

      if (resendError) {
        console.warn("Non-fatal: Failed to send recovery email:", resendError);
      }
    } else {
      console.warn("Resend API key missing, skipped sending recovery email.");
    }

    // Return the license key so the frontend can display it
    return Response.json({ licenseKey });
  } catch (error) {
    console.error("Critical error in recover-license:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
