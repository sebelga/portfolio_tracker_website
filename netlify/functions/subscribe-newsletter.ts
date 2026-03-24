import { addContactToLoops } from "../lib/loops";
import { validateEmail } from "../lib/utils";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email format check
    if (!validateEmail(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    const result = await addContactToLoops(email, "newsletter-form");

    if (!result.success) {
      return Response.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error in subscribe-newsletter:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
