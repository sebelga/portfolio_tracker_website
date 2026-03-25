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

      const { email_id, from, to, subject } = payload.data || {};

      // Only forward emails sent to hello@
      if (!to || !to.includes("hello@")) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "Email not sent to hello@, ignoring",
          }),
        };
      }

      // Extract the email from possible format "Name <email@domain.com>"
      const emailMatch = from?.match(/<(.+)>/);
      const originalSenderEmail = emailMatch ? emailMatch[1] : from;
      const originalSenderName = emailMatch
        ? emailMatch[0].trim()
        : "Unknown Sender";

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
