import { type EmailReceivedEvent, type WebhookEventPayload } from "resend";
import { simpleParser } from "mailparser";
import { resend, forwardMessageToAdmin } from "../lib/email";

const verifySignature = (
  payload: string,
  headers: Headers,
  secret: string,
):
  | { result: WebhookEventPayload; error: never }
  | { error: string; result: never } => {
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

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

const isValidToEmail = (to: string | string[] | undefined): boolean => {
  if (!to) return false;
  if (typeof to === "string") {
    return to.includes("hello@");
  }
  return to.some((email) => email.includes("hello@"));
};

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response(
      JSON.stringify({
        error: "Missing environment variables RESEND_WEBHOOK_SECRET",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const payload = await req.text();
  const { result, error } = verifySignature(
    payload,
    req.headers,
    webhookSecret,
  );

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Only process the 'email.received' event
    if (result.type === "email.received") {
      const forwardTo = process.env.RESEND_FORWARD_EMAILS_TO;
      const emailFrom = process.env.EMAIL_FROM;

      if (!forwardTo || !emailFrom) {
        return new Response(
          JSON.stringify({
            error:
              "Missing environment variables RESEND_FORWARD_EMAILS_TO or EMAIL_FROM",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const { email_id, to, subject } =
        (result as EmailReceivedEvent).data || {};

      // Only forward emails sent to hello@
      if (!isValidToEmail(to)) {
        return new Response(
          JSON.stringify({ message: "Email not sent to hello@, ignoring" }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!email_id) {
        return new Response(
          JSON.stringify({ error: "Missing email_id in payload" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Fetch the full email content (webhooks only provide metadata)
      const { data: emailContent, error: getError } =
        await resend.emails.receiving.get(email_id);

      if (getError || !emailContent) {
        console.error("Error fetching email content:", getError);
        return new Response(
          JSON.stringify({
            error: getError?.message || "Failed to fetch email content",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const { from, raw } = emailContent;
      let originalSenderEmail: string = from;
      let originalSenderName: string = "Unknown";

      if (raw) {
        // Get the raw email to get the full "From" header (in case it contains a name and email)
        const rawResponse = await fetch(raw.download_url);
        const rawEmailContent = await rawResponse.text();
        const parsed = await simpleParser(rawEmailContent, {
          skipImageLinks: true,
        });

        if (parsed.from?.value && parsed.from.value.length > 0) {
          originalSenderEmail = parsed.from.value[0].address || from;
          originalSenderName = parsed.from.value[0].name || "Unknown";
        }
      }

      // Send the email to yourself with the Reply-To header set
      const { data, error: sendError } = await forwardMessageToAdmin({
        senderName: originalSenderName,
        senderEmail: originalSenderEmail,
        subject: subject || "(no subject)",
        html: emailContent.html || "",
        text: emailContent.text || "",
      });

      if (sendError) {
        console.error("Error forwarding email:", sendError);
        return new Response(JSON.stringify({ error: sendError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ message: "Email forwarded successfully", data }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ message: "Event ignored" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error processing request" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
};
