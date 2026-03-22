import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { initFirebase } from "../lib/firebase";

// Safely load fast `.env.local` for local development
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "../../.env.local" });
}

// 1. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Throw an error if process.env.JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

// 2. Secret Key used to hash JWTs in transit (never expose this)
const JWT_SECRET = process.env.JWT_SECRET;

// throw if EMAIL_FROM is not set
if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM environment variable is not set.");
}

// 3. Sender domain you set up in Resend
const EMAIL_FROM = process.env.EMAIL_FROM;

export default async (req: Request) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Initialize Firebase
    const db = initFirebase();

    // Check if the email already has a license
    const licensesRef = db.collection("licenses");
    const snapshot = await licensesRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return Response.json(
        {
          error: "A license has already been generated for this email address.",
        },
        { status: 409 },
      );
    }

    // Generate a secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a JSON Web Token payload containing the email and the code
    // expiresIn prevents playback attacks of the code an hour from now
    const token = jwt.sign({ email, code }, JWT_SECRET, { expiresIn: "15m" });

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: `Portfolio Tracker Beta <${EMAIL_FROM}>`,
      to: [email],
      subject: "Your Portfolio Tracker Confirmation Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Portfolio Tracker Public Beta</h2>
          <p>You recently requested a free premium license. Here is your 6-digit confirmation code:</p>
          <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">${code}</div>
          <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return Response.json(
        { error: "Failed to send confirmation email." },
        { status: 500 },
      );
    }

    // Return the JWT back to the client side. The client will store it
    // and push it back up with the user input string in Step 2.
    return Response.json({ token });
  } catch (error) {
    console.error("Critical error in request-beta-code:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
