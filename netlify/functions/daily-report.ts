import type { Config } from "@netlify/functions";
import { Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";
import { initFirebase } from "../lib/firebase";
import type { License } from "../lib/types";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "../../.env.local" });
}

if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM environment variable is not set.");
}
if (!process.env.REPORT_EMAIL_TO) {
  throw new Error("REPORT_EMAIL_TO environment variable is not set.");
}

const EMAIL_FROM = process.env.EMAIL_FROM;
const REPORT_EMAIL_TO = process.env.REPORT_EMAIL_TO;
const resend = new Resend(process.env.RESEND_API_KEY);

export default async () => {
  try {
    const db = initFirebase();

    // Query licenses created in the last 24 hours
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const snapshot = await db
      .collection("licenses")
      .where("createdAt", ">=", Timestamp.fromDate(yesterday))
      .get();

    let free = 0;
    let premium = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() as License;
      if (data.level === "premium") {
        premium++;
      } else {
        free++;
      }
    });

    const total = free + premium;
    console.log(
      `Daily Report - Total: ${total}, Free: ${free}, Premium: ${premium}`,
    );
    const reportDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const { error } = await resend.emails.send({
      from: `TradeGist Reports <${EMAIL_FROM}>`,
      to: [REPORT_EMAIL_TO],
      subject: `Daily License Report — ${total} new signup${total !== 1 ? "s" : ""}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Daily License Report</h2>
          <p style="color: #666;">${reportDate}</p>
          <table style="border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 16px; font-weight: bold;">Total New Licenses</td>
              <td style="padding: 8px 16px;">${total}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 16px;">Free</td>
              <td style="padding: 8px 16px;">${free}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px;">Premium</td>
              <td style="padding: 8px 16px;">${premium}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">This is an automated report from TradeGist.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return new Response("Failed to send report email.", { status: 500 });
    }

    return new Response(
      JSON.stringify({ message: "Report sent", total, free, premium }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Daily report failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

// Cron: 6:00 PM CET (Andorra) = 17:00 UTC (winter) / 16:00 UTC (summer)
// Using 17:00 UTC as the baseline
export const config: Config = {
  schedule: "0 17 * * *",
};
