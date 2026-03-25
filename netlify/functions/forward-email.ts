import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    // Only process the 'email.received' event
    if (payload.type === "email.received") {
      const emailId = payload.data?.email_id;

      if (!emailId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing email_id in payload" }),
        };
      }

      // Read fallback from environment variables
      const forwardTo = process.env.RESEND_FORWAD_EMAILS_TO;
      const emailFrom = process.env.EMAIL_FROM;

      if (!forwardTo || !emailFrom) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error:
              "Missing environment variables RESEND_FORWAD_EMAILS_TO or EMAIL_FROM",
          }),
        };
      }

      // Use the helper method provided by Resend to automatically pull content & attachments
      const { data, error } = await resend.emails.receiving.forward({
        emailId: emailId,
        to: forwardTo,
        from: emailFrom,
      });

      if (error) {
        console.error("Error forwarding email:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email forwarded successfully", data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Event ignored" }),
    };
  } catch (error: any) {
    console.error("Webhook error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message || "Error processing request",
      }),
    };
  }
};
