import { Handler, HandlerEvent } from "@netlify/functions";
import {
  type EmailReceivedEvent,
  Resend,
  type WebhookEventPayload,
} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const verifySignature = (
  payload: string,
  headers: HandlerEvent["headers"],
  secret: string,
):
  | { result: WebhookEventPayload; error: never }
  | { error: string; result: never } => {
  const svixId = headers["svix-id"];
  const svixTimestamp = headers["svix-timestamp"];
  const svixSignature = headers["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature) {
    return {
      error: "Missing Svix signature headers",
      result: void 0 as never,
    };
  }
  try {
    const result = resend.webhooks.verify({
      payload: payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: secret,
    });
    return { result, error: void 0 as never };
  } catch (error) {
    return {
      error: "Invalid webhook",
      result: void 0 as never,
    };
  }
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing environment variables RESEND_WEBHOOK_SECRET",
      }),
    };
  }

  const { result, error } = verifySignature(
    event.body || "",
    event.headers,
    webhookSecret,
  );

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }

  try {
    // Only process the 'email.received' event
    if (result.type === "email.received") {
      const forwardTo = process.env.RESEND_FORWARD_EMAILS_TO;
      const emailFrom = process.env.EMAIL_FROM;

      if (!forwardTo || !emailFrom) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error:
              "Missing environment variables RESEND_FORWARD_EMAILS_TO or EMAIL_FROM",
          }),
        };
      }

      const { email_id, to, subject } =
        (result as EmailReceivedEvent).data || {};

      // Only forward emails sent to hello@
      if (!to || !to.includes("hello@")) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Email not sent to hello@, ignoring",
          }),
        };
      }

      if (!email_id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing email_id in payload" }),
        };
      }

      // Fetch the full email content (webhooks only provide metadata)
      const { data: emailContent, error: getError } =
        await resend.emails.receiving.get(email_id);

      if (getError || !emailContent) {
        console.error("Error fetching email content:", getError);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: getError?.message || "Failed to fetch email content",
          }),
        };
      }

      const { from } = emailContent;
      // Extract the email from possible format "Name <email@domain.com>"
      const emailMatch = from?.match(/<(.+)>/);
      const originalSenderEmail = emailMatch ? emailMatch[1] : from;
      const originalSenderName = emailMatch ? emailMatch[0].trim() : "Unknown";

      // Send the email to yourself with the Reply-To header set
      const { data, error } = await resend.emails.send({
        from: `${originalSenderName} <${emailFrom}>`,
        to: forwardTo,
        replyTo: originalSenderEmail,
        subject: `[TradeGist] ${subject || "(no subject)"}`,
        html: emailContent.html || "",
        text: emailContent.text || "",
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
