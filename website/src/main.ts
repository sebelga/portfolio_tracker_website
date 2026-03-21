import PhotoSwipeLightbox from "photoswipe/lightbox";

(function init() {
  function gallery() {
    if (!document.getElementById("gallery")) {
      return;
    }

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
      zoom: false,
    });

    lightbox.init();
  }

  // write a handler with a <R> return type that receives a string and return
  // the Type or null reading the document.getElementById
  const getElement = <R extends HTMLElement>(id: string): R | null => {
    const element = document.getElementById(id);
    return element as R | null;
  };

  const showToastError = (message: string) => {
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-center z-[9999]";
    toast.innerHTML = `
      <div class="alert alert-error text-error-content shadow-lg max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="text-sm">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };

  function initBetaLicenseFlow() {
    const emailForm = getElement<HTMLFormElement>("email-form");
    const codeForm = getElement<HTMLFormElement>("code-form");
    const step1Email = getElement<HTMLElement>("step-1-email");
    const step2Code = getElement<HTMLElement>("step-2-code");
    const step3Success = getElement<HTMLElement>("step-3-success");
    const displayEmail = getElement<HTMLElement>("display-email");
    const sendCodeBtn = getElement<HTMLButtonElement>("send-code-btn");
    const verifyCodeBtn = getElement<HTMLButtonElement>("verify-code-btn");
    const backToEmailBtn = getElement<HTMLButtonElement>("back-to-email-btn");
    const copyLicenseBtn = getElement<HTMLButtonElement>("copy-license-btn");
    const newLicenseKeyText = getElement<HTMLElement>("new-license-key");
    const betaModal = getElement<HTMLDialogElement>("beta_license_modal");

    if (!emailForm || !codeForm || !betaModal) return;

    let currentJwtToken = "";

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
        step1Email?.classList.remove("hidden");
        step2Code?.classList.add("hidden");
        step3Success?.classList.add("hidden");
        emailForm.reset();
        codeForm.reset();
        currentJwtToken = "";
      }, 300); // Wait for transition
    });
  }

  function initRecoverLicenseFlow() {
    const recoverForm = getElement<HTMLFormElement>("recover-form");
    const recoverStep1 = getElement<HTMLElement>("recover-step-1");
    const recoverStep2 = getElement<HTMLElement>("recover-step-2");
    const recoverBtn = getElement<HTMLButtonElement>("recover-btn");
    const recoverCopyBtn = getElement<HTMLButtonElement>("recover-copy-btn");
    const recoveredLicenseKeyText = getElement<HTMLElement>(
      "recovered-license-key",
    );
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

        if (!response.ok) {
          throw new Error(data.error || "Failed to recover license");
        }

        // Update UI
        if (recoveredLicenseKeyText)
          recoveredLicenseKeyText.textContent = data.licenseKey;
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

    // Copy License to clipboard
    recoverCopyBtn?.addEventListener("click", () => {
      if (!recoveredLicenseKeyText?.textContent) return;
      navigator.clipboard
        .writeText(recoveredLicenseKeyText.textContent)
        .then(() => {
          const icon = recoverCopyBtn.innerHTML;
          recoverCopyBtn.textContent = "Copied!";
          recoverCopyBtn.classList.add("text-success");
          setTimeout(() => {
            recoverCopyBtn.innerHTML = icon;
            recoverCopyBtn.classList.remove("text-success");
          }, 2000);
        });
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

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
    initBetaLicenseFlow();
    initRecoverLicenseFlow();
  });

  console.log("Welcome to Portfolio Tracker!");
})();
