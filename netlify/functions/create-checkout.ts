import { Handler } from "@netlify/functions";
import { Creem } from "creem";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local" });
}

const creem = new Creem({
  apiKey: process.env.CREEM_API_KEY!,
  serverIdx: process.env.CONTEXT === "production" ? 0 : 1, // 0 = production, 1 = test
});

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    const { productId, userEmail } = JSON.parse(event.body);

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Product ID is required" }),
      };
    }

    const checkout = await creem.checkouts.create({
      productId: productId,
      successUrl: `${process.env.URL || "http://localhost:8888"}/pricing?success=true`,
      customer: userEmail ? { email: userEmail } : undefined,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ checkoutUrl: checkout.checkoutUrl }),
    };
  } catch (error: any) {
    console.error("Error creating checkout:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Failed to create checkout",
      }),
    };
  }
};
