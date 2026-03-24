import { getElement, showToastError } from "./utils";

/**
 * Wires up a newsletter subscription form to the subscribe-newsletter endpoint.
 * Accepts element IDs so it can be reused across different modals/pages.
 */
export function initNewsletterForm(opts: {
  formId: string;
  emailInputId: string;
  submitBtnId: string;
  successId: string;
}) {
  const form = getElement<HTMLFormElement>(opts.formId);
  const submitBtn = getElement<HTMLButtonElement>(opts.submitBtnId);
  const successEl = getElement<HTMLElement>(opts.successId);

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = getElement<HTMLInputElement>(opts.emailInputId);
    const email = emailInput?.value.trim();
    if (!email || !submitBtn) return;

    const originalBtnText = submitBtn.textContent;
    submitBtn.innerHTML =
      '<span class="loading loading-spinner loading-sm"></span> Subscribing...';
    submitBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/subscribe-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      form.classList.add("hidden");
      successEl?.classList.remove("hidden");
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error);
      showToastError(
        error.message || "Could not subscribe. Please try again later.",
      );
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}
