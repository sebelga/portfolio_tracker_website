import { getElement, showToastError } from "./utils";

export function initBetaLicenseFlow() {
  const emailForm = getElement<HTMLFormElement>("email-form");
  const codeForm = getElement<HTMLFormElement>("code-form");
  const step1Email = getElement<HTMLElement>("step-1-email");
  const step1SoldOut = getElement<HTMLElement>("step-1-sold-out");
  const step2Code = getElement<HTMLElement>("step-2-code");
  const step3Success = getElement<HTMLElement>("step-3-success");
  const displayEmail = getElement<HTMLElement>("display-email");
  const sendCodeBtn = getElement<HTMLButtonElement>("send-code-btn");
  const verifyCodeBtn = getElement<HTMLButtonElement>("verify-code-btn");
  const backToEmailBtn = getElement<HTMLButtonElement>("back-to-email-btn");
  const copyLicenseBtn = getElement<HTMLButtonElement>("copy-license-btn");
  const newLicenseKeyText = getElement<HTMLElement>("new-license-key");
  const betaModal = getElement<HTMLDialogElement>("beta_license_modal");

  // Pricing card elements
  const remainingBadge = getElement<HTMLElement>("remaining-licenses-badge");
  const remainingCount = getElement<HTMLElement>("remaining-count");
  const ctaAvailable = getElement<HTMLElement>("cta-available");
  const ctaSoldOut = getElement<HTMLElement>("cta-sold-out");

  if (!emailForm || !codeForm || !betaModal) return;

  let currentJwtToken = "";
  let licensesAvailable = true;

  // Fetch license availability on page load
  async function loadLicenseStats() {
    try {
      const response = await fetch("/.netlify/functions/license-stats");
      if (!response.ok) return;

      const data = await response.json();
      const remaining = data.remaining ?? 0;

      // Update the badge
      if (remainingBadge && remainingCount) {
        remainingCount.textContent = String(remaining);
        remainingBadge.classList.remove("hidden");
      }

      if (remaining <= 0) {
        licensesAvailable = false;
        // Toggle pricing card CTAs
        ctaAvailable?.classList.add("hidden");
        ctaSoldOut?.classList.remove("hidden");
        // Toggle modal steps
        step1Email?.classList.add("hidden");
        step1SoldOut?.classList.remove("hidden");
      }
    } catch {
      // Silently fail — default to showing the form
    }
  }

  loadLicenseStats();

  // Step 1: Request Code
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById(
      "user-email",
    ) as HTMLInputElement | null;
    const email = emailInput?.value.trim();
    if (!email || !sendCodeBtn) return;

    const originalBtnText = sendCodeBtn.textContent;
    sendCodeBtn.innerHTML =
      '<span class="loading loading-spinner loading-sm"></span> Sending...';
    sendCodeBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/request-beta-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send code");
      }

      currentJwtToken = data.token;

      // Update UI
      if (displayEmail) displayEmail.textContent = email;
      step1Email?.classList.add("hidden");
      step2Code?.classList.remove("hidden");

      // Auto-focus code input
      document.getElementById("verification-code")?.focus();
    } catch (error: any) {
      console.error("Error sending code:", error);
      showToastError(
        error.message ||
          "Could not send the confirmation code. Please try again.",
      );
    } finally {
      if (sendCodeBtn) {
        sendCodeBtn.textContent = originalBtnText;
        sendCodeBtn.disabled = false;
      }
    }
  });

  // Step 2: Verify Code
  codeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codeInput = document.getElementById(
      "verification-code",
    ) as HTMLInputElement | null;
    const code = codeInput?.value.trim();
    if (!code || code.length !== 6 || !verifyCodeBtn) return;

    const originalBtnText = verifyCodeBtn.textContent;
    verifyCodeBtn.innerHTML =
      '<span class="loading loading-spinner loading-sm"></span> Verifying...';
    verifyCodeBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/verify-beta-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: currentJwtToken, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid code");
      }

      const licenseKey = data.licenseKey;

      // Update UI
      if (newLicenseKeyText) newLicenseKeyText.textContent = licenseKey;
      step2Code?.classList.add("hidden");
      step3Success?.classList.remove("hidden");
    } catch (error: any) {
      console.error("Error verifying code:", error);
      showToastError(
        error.message || "Invalid or expired code. Please try again.",
      );
    } finally {
      if (verifyCodeBtn) {
        verifyCodeBtn.textContent = originalBtnText;
        verifyCodeBtn.disabled = false;
      }
    }
  });

  // Back to email button
  backToEmailBtn?.addEventListener("click", () => {
    step2Code?.classList.add("hidden");
    step1Email?.classList.remove("hidden");
    const verificationCodeInput = document.getElementById(
      "verification-code",
    ) as HTMLInputElement | null;
    if (verificationCodeInput) verificationCodeInput.value = "";
  });

  // Copy License to clipboard
  copyLicenseBtn?.addEventListener("click", () => {
    if (!newLicenseKeyText?.textContent) return;
    navigator.clipboard.writeText(newLicenseKeyText.textContent).then(() => {
      const icon = copyLicenseBtn.innerHTML;
      copyLicenseBtn.textContent = "Copied!";
      copyLicenseBtn.classList.add("text-success");
      setTimeout(() => {
        copyLicenseBtn.innerHTML = icon;
        copyLicenseBtn.classList.remove("text-success");
      }, 2000);
    });
  });

  // Reset modal when completely closed
  betaModal?.addEventListener("close", () => {
    setTimeout(() => {
      if (licensesAvailable) {
        step1Email?.classList.remove("hidden");
        step1SoldOut?.classList.add("hidden");
      } else {
        step1Email?.classList.add("hidden");
        step1SoldOut?.classList.remove("hidden");
      }
      step2Code?.classList.add("hidden");
      step3Success?.classList.add("hidden");
      emailForm.reset();
      codeForm.reset();
      currentJwtToken = "";
    }, 300);
  });
}

export function initRecoverLicenseFlow() {
  const recoverForm = getElement<HTMLFormElement>("recover-form");
  const recoverStep1 = getElement<HTMLElement>("recover-step-1");
  const recoverStep2 = getElement<HTMLElement>("recover-step-2");
  const recoverBtn = getElement<HTMLButtonElement>("recover-btn");
  const recoverModal = getElement<HTMLDialogElement>("recover_license_modal");

  if (!recoverForm || !recoverModal) return;

  recoverForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById(
      "recover-email",
    ) as HTMLInputElement | null;
    const email = emailInput?.value.trim();
    if (!email || !recoverBtn) return;

    const originalBtnText = recoverBtn.textContent;
    recoverBtn.innerHTML =
      '<span class="loading loading-spinner loading-sm"></span> Finding...';
    recoverBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/recover-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 404) {
        throw new Error(data.error || "Failed to recover license");
      }

      // Update UI (show same success message whether found or not)
      recoverStep1?.classList.add("hidden");
      recoverStep2?.classList.remove("hidden");
    } catch (error: any) {
      console.error("Error recovering license:", error);
      showToastError(
        error.message ||
          "Could not recover your license. Please check the email.",
      );
    } finally {
      if (recoverBtn) {
        recoverBtn.textContent = originalBtnText;
        recoverBtn.disabled = false;
      }
    }
  });

  // Reset modal when closed
  recoverModal?.addEventListener("close", () => {
    setTimeout(() => {
      recoverStep1?.classList.remove("hidden");
      recoverStep2?.classList.add("hidden");
      recoverForm.reset();
    }, 300);
  });
}

export function initRequestTemplateFlow() {
  const templateForm = getElement<HTMLFormElement>("template-form");
  const templateStep1 = getElement<HTMLElement>("template-step-1");
  const templateStep2 = getElement<HTMLElement>("template-step-2");
  const templateBtn = getElement<HTMLButtonElement>("template-btn");
  const templateModal = getElement<HTMLDialogElement>("request_template_modal");

  if (!templateForm || !templateModal) return;

  templateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const keyInput = document.getElementById(
      "template-license-key",
    ) as HTMLInputElement | null;
    const licenseKey = keyInput?.value.trim();
    if (!licenseKey || !templateBtn) return;

    const originalBtnText = templateBtn.textContent;
    templateBtn.innerHTML =
      '<span class="loading loading-spinner loading-sm"></span> Sending...';
    templateBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/request-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send template link");
      }

      templateStep1?.classList.add("hidden");
      templateStep2?.classList.remove("hidden");
    } catch (error: any) {
      console.error("Error requesting template:", error);
      showToastError(
        error.message || "Could not send the template link. Please try again.",
      );
    } finally {
      if (templateBtn) {
        templateBtn.textContent = originalBtnText;
        templateBtn.disabled = false;
      }
    }
  });

  templateModal?.addEventListener("close", () => {
    setTimeout(() => {
      templateStep1?.classList.remove("hidden");
      templateStep2?.classList.add("hidden");
      templateForm.reset();
    }, 300);
  });
}
