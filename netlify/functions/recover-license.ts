import { Handler } from "@netlify/functions";
import { Resend } from "resend";
import { initFirebase } from "../lib/firebase";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "../../.env.local" });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const resend = new Resend(RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = body.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required." }),
      };
    }

    const db = initFirebase();
    const licensesRef = db.collection("licenses");
    const snapshot = await licensesRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "No license found for this email address.",
        }),
      };
    }

    // Get the first matching license
    const doc = snapshot.docs[0];
    const licenseKey = doc.id;

    // Send the email via Resend
    if (RESEND_API_KEY) {
      const { error: resendError } = await resend.emails.send({
        from: `Portfolio Tracker Beta <${EMAIL_FROM}>`,
        to: [email],
        subject: "Your Recovered Portfolio Tracker License Key",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Here is your Portfolio Tracker License Key!</h2>
            <p>You recently requested to recover your license key.</p>
            <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <code style="font-size: 24px; font-weight: bold; color: #000;">${licenseKey}</code>
            </div>
            <p><strong>How to use it:</strong></p>
            <ul>
              <li>Open your Portfolio Tracker sheet.</li>
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
    return {
      statusCode: 200,
      body: JSON.stringify({ licenseKey }),
    };
  } catch (error) {
    console.error("Critical error in recover-license:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
