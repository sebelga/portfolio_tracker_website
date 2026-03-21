import { Handler } from "@netlify/functions";
import { Creem } from "creem";
import * as crypto from "crypto";
import dotenv from "dotenv";

// Load .env.local only in local development.
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local" });
}

const creem = new Creem({
  apiKey: process.env.CREEM_API_KEY!,
  serverIdx: process.env.CONTEXT === "production" ? 0 : 1, // 0 = production, 1 = test
});

function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const computed = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
}

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing webhook secret");
    return { statusCode: 500, body: "Configuration error" };
  }

  const signature = event.headers["creem-signature"];
  if (!signature) {
    return { statusCode: 401, body: "Missing signature" };
  }

  // Verify webhook signature
  const isValid = verifySignature(event.body, signature, webhookSecret);

  if (!isValid) {
    return { statusCode: 401, body: "Invalid signature" };
  }

  try {
    const payload = JSON.parse(event.body);
    const eventType = payload.eventType;

    console.log(`Received webhook event: ${eventType}`);

    // Handle events here
    // Example:
    /*
    if (eventType === 'checkout.completed') {
      const data = payload.object;
      console.log(`Checkout completed for ${data.customer.email}`);
    } else if (eventType === 'subscription.paid') {
       // Grant access
    } else if (eventType === 'subscription.expired' || eventType === 'subscription.paused') {
       // Revoke access
    }
    */

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Webhook processing failed",
      }),
    };
  }
};
