export function initContactForm() {
  const form = document.getElementById("contact-form") as HTMLFormElement;
  const btn = document.getElementById("contact-btn") as HTMLButtonElement;
  const successMsg = document.getElementById("contact-success");
  const errorMsg = document.getElementById("contact-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML =
        '<span class="loading loading-spinner"></span> Sending...';
    }

    if (successMsg) successMsg.classList.add("hidden");
    if (errorMsg) errorMsg.classList.add("hidden");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to send message");
      }

      if (successMsg) successMsg.classList.remove("hidden");
      form.reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (errorMsg) {
        errorMsg.textContent =
          error.message ||
          "There was an error sending your message. Please try again later.";
        errorMsg.classList.remove("hidden");
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Send Message";
      }
    }
  });
}
