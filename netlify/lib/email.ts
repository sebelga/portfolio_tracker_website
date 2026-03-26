import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const forwardMessageToAdmin = async ({
  senderName,
  senderEmail,
  subject,
  html,
  text,
}: {
  senderName: string;
  senderEmail: string;
  subject: string;
  html?: string;
  text?: string;
}) => {
  const forwardTo = process.env.RESEND_FORWARD_EMAILS_TO;
  const emailFrom = process.env.EMAIL_FROM;

  if (!forwardTo || !emailFrom) {
    throw new Error(
      "Missing environment variables RESEND_FORWARD_EMAILS_TO or EMAIL_FROM",
    );
  }

  return resend.emails.send({
    from: `${senderName} <${emailFrom}>`,
    to: forwardTo,
    replyTo: senderEmail,
    subject: `[TradeGist] ${subject}`,
    html: html || "",
    text: text || "",
  });
};
