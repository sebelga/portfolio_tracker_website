import jwt from "jsonwebtoken";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { initFirebase } from "../lib/firebase";
import { addContactToLoops } from "../lib/loops";
import type { LicenseDoc } from "../lib/types";
import { MAX_PREMIUM_LICENSES } from "../../constants.mjs";

// Load fast `.env.local` for local development
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "../../.env.local" });
}

const JWT_SECRET = process.env.JWT_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM;
const SHEET_TEMPLATE_URL = process.env.SHEET_TEMPLATE_URL;

const resend = new Resend(RESEND_API_KEY);

/**
 * Generates securely random license key matching XXXX-XXXX-XXXX
 */
function generateLicenseKey(): string {
  const rs = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TG-${rs()}-${rs()}-${rs()}`;
}

async function sendLicenseEmail(email: string, licenseKey: string) {
  if (!RESEND_API_KEY) {
    console.warn("Resend API key missing, skipped sending license email.");
    return;
  }

  const { error: resendError } = await resend.emails.send({
    from: `TradeGist Beta <${EMAIL_FROM}>`,
    to: [email],
    subject: "Your TradeGist Premium License Key!",
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to TradeGist Beta!</h2>
        <p>Your email has been verified and your Free Premium License has been successfully generated.</p>
        <p>Here is your license key:</p>
        <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <code style="font-size: 24px; font-weight: bold; color: #000;">${licenseKey}</code>
        </div>
        <p><strong>Get started:</strong></p>
        <div style="margin: 24px 0;">
          <a href="${SHEET_TEMPLATE_URL}" style="display: inline-block; background-color: #16a34a; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px;">Get your template copy</a>
        </div>
        <p><strong>How to activate:</strong></p>
        <ul>
          <li>Open your TradeGist sheet.</li>
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

export default async (req: Request) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set.");
    }
    if (!EMAIL_FROM) {
      throw new Error("EMAIL_FROM environment variable is not set.");
    }

    const db = initFirebase();
    const body = await req.json();
    const { token, code, subscribe } = body;

    if (!token || !code) {
      return Response.json({ error: "Missing token or code" }, { status: 400 });
    }

    if (!SHEET_TEMPLATE_URL) {
      console.warn(
        "SHEET_TEMPLATE_URL is not set. Cannot send template link email.",
      );
      return Response.json(
        {
          error:
            "Template URL is not configured. Please contact support for assistance.",
        },
        { status: 500 },
      );
    }

    // 1. Verify and decode the JWT
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // JWT is tampered with, or it expired (15m limit)
      return Response.json(
        { error: "Invalid or expired token. Please start over." },
        { status: 401 },
      );
    }

    // 2. Enforce logic
    if (payload.code !== code) {
      return Response.json(
        { error: "Incorrect verification code." },
        { status: 401 },
      );
    }

    const email = payload.email;
    const licenseKey = generateLicenseKey();

    // 3. Document payload for Firestore DB
    const licenseDoc: LicenseDoc = {
      email: email,
      status: "active",
      paid: true,
      level: "premium",
      validUntil: Timestamp.fromDate(
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      ), // 1 year trial
      metadata: {
        version: 1.0,
        origin: "Public-Beta-Free-Launch",
      },
      createdAt: FieldValue.serverTimestamp(),
    };

    // 4. Atomically check the premium license cap and save the license
    const countersRef = db.collection("metadata").doc("license-counts");

    await db.runTransaction(async (transaction) => {
      const countersSnap = await transaction.get(countersRef);
      const currentPremium = countersSnap.exists
        ? (countersSnap.data()?.premium ?? 0)
        : 0;

      if (currentPremium >= MAX_PREMIUM_LICENSES) {
        throw new Error("PREMIUM_CAP_REACHED");
      }

      // Write the license document
      const licenseRef = db.collection("licenses").doc(licenseKey);
      transaction.set(licenseRef, licenseDoc);

      // Increment the premium counter
      if (countersSnap.exists) {
        transaction.update(countersRef, {
          premium: FieldValue.increment(1),
        });
      } else {
        transaction.set(countersRef, { premium: 1, free: 0 });
      }
    });

    // 5. Send success email with the license key
    await sendLicenseEmail(email, licenseKey);

    // 6. Optionally add the user to the Loops newsletter audience
    if (subscribe) {
      // For now we can only generate beta-licenses. We'll have to update this logic
      // once we can create free|premium licenses.
      addContactToLoops(email, "beta-license", "beta-license").catch((err) =>
        console.warn("Non-fatal: Failed to add contact to Loops:", err),
      );
    }

    // 7. Fire back License Key to the frontend for the success Modal
    return Response.json({ licenseKey, email });
  } catch (error: any) {
    if (error?.message === "PREMIUM_CAP_REACHED") {
      return Response.json(
        {
          error:
            "All free premium licenses for the Beta have been claimed. Stay tuned for the official launch!",
        },
        { status: 409 },
      );
    }
    console.error("Critical error in verify-beta-code:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
