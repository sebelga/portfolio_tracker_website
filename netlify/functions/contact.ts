import { validateEmail } from "../lib/utils";
import { forwardMessageToAdmin } from "../lib/email";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    const { name: _name, email, message: _message } = payload;

    if (!_name || !email || !_message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const name = String(_name).trim();
    const message = String(_message).trim();

    if (name.length === 0 || message.length === 0) {
      return new Response(
        JSON.stringify({ error: "Name and message cannot be empty" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await forwardMessageToAdmin({
      senderName: name,
      senderEmail: email,
      subject: `New Contact Form Message from ${name}`,
      text: `${message}\n\n--\nName: ${name}\nEmail: ${email}`,
    });

    if (error) {
      console.error("Error sending contact email:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Message sent successfully", data }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error processing request" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
};
