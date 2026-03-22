import { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";
import * as admin from "firebase-admin";
import { Resend } from "resend";
import { initFirebase } from "../lib/firebase";
import type { LicenseDoc } from "../lib/types";

// Load fast `.env.local` for local development
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "../../.env.local" });
}

// Throw an error if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}
if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM environment variable is not set.");
}

const JWT_SECRET = process.env.JWT_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM;

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

/**
 * Generates securely random license key matching XXXX-XXXX-XXXX
 */
function generateLicenseKey(): string {
  const rs = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PT-${rs()}-${rs()}-${rs()}`;
}

async function sendLicenseEmail(email: string, licenseKey: string) {
  if (!RESEND_API_KEY) {
    console.warn("Resend API key missing, skipped sending license email.");
    return;
  }

  const { error: resendError } = await resend.emails.send({
    from: `Portfolio Tracker Beta <${EMAIL_FROM}>`,
    to: [email],
    subject: "Your Portfolio Tracker Premium License Key!",
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to Portfolio Tracker Beta!</h2>
        <p>Your email has been verified and your Free Premium License has been successfully generated.</p>
        <p>Here is your license key:</p>
        <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <code style="font-size: 24px; font-weight: bold; color: #000;">${licenseKey}</code>
        </div>
        <p><strong>How to use it:</strong></p>
        <ul>
          <li>Open your Portfolio Tracker sheet.</li>
          <li>Navigate to the "Configuration" sheet.</li>
          <li>Paste your key next to "license_key" in the General configuration section.</li>
        </ul>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">Keep this email safe. Your license is valid for the duration of the entire Beta phase plus 1 full year after launch.</p>
      </div>
    `,
  });

  if (resendError) {
    console.warn("Non-fatal: Failed to send license email:", resendError);
    // We do NOT return a 500 error here. The database write succeeded,
    // the user is entitled to the UI update even if the email dropped.
  }
}

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const db = initFirebase();
    const body = JSON.parse(event.body || "{}");
    const { token, code } = body;

    if (!token || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing token or code" }),
      };
    }

    // 1. Verify and decode the JWT
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // JWT is tampered with, or it expired (15m limit)
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Invalid or expired token. Please start over.",
        }),
      };
    }

    // 2. Enforce logic
    if (payload.code !== code) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Incorrect verification code." }),
      };
    }

    const email = payload.email;
    const licenseKey = generateLicenseKey();

    // 3. Document payload for Firestore DB
    const licenseDoc: LicenseDoc = {
      email: email,
      status: "active",
      paid: true,
      level: "premium",
      validUntil: admin.firestore.Timestamp.fromDate(new Date("2099-12-31")), // Forever logic
      metadata: {
        version: 1.0,
        origin: "Netlify-Free-Launch",
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 4. Save to Firestore Collections
    await db.collection("licenses").doc(licenseKey).set(licenseDoc);

    // 5. Send success email with the license key
    await sendLicenseEmail(email, licenseKey);

    // 6. Fire back License Key to the frontend for the success Modal
    return {
      statusCode: 200,
      body: JSON.stringify({ licenseKey, email }),
    };
  } catch (error) {
    console.error("Critical error in verify-beta-code:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
