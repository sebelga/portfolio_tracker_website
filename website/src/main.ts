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

  function initBetaLicenseFlow() {
    const emailForm = document.getElementById("email-form") as HTMLFormElement;
    const codeForm = document.getElementById("code-form") as HTMLFormElement;
    const step1Email = document.getElementById("step-1-email");
    const step2Code = document.getElementById("step-2-code");
    const step3Success = document.getElementById("step-3-success");
    const displayEmail = document.getElementById("display-email");
    const sendCodeBtn = document.getElementById(
      "send-code-btn",
    ) as HTMLButtonElement;
    const verifyCodeBtn = document.getElementById(
      "verify-code-btn",
    ) as HTMLButtonElement;
    const backToEmailBtn = document.getElementById("back-to-email-btn");
    const copyLicenseBtn = document.getElementById("copy-license-btn");
    const newLicenseKeyText = document.getElementById("new-license-key");
    const betaModal = document.getElementById(
      "beta_license_modal",
    ) as HTMLDialogElement;

    if (!emailForm || !codeForm || !betaModal) return;

    let currentJwtToken = "";

    // Step 1: Request Code
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById(
        "user-email",
      ) as HTMLInputElement;
      const email = emailInput.value.trim();
      if (!email) return;

      const originalBtnText = sendCodeBtn.textContent;
      sendCodeBtn.innerHTML =
        '<span class="loading loading-spinner loading-sm"></span> Sending...';
      sendCodeBtn.disabled = true;

      try {
        // Prepare to call the actual Netlify function to be built
        /*
        const response = await fetch("/.netlify/functions/request-beta-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) throw new Error("Failed to send code");
        const data = await response.json();
        currentJwtToken = data.token;
        */

        // MOCK: Simulate network request for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        currentJwtToken = "mock_jwt_token_123";

        // Update UI
        if (displayEmail) displayEmail.textContent = email;
        step1Email?.classList.add("hidden");
        step2Code?.classList.remove("hidden");

        // Auto-focus code input
        document.getElementById("verification-code")?.focus();
      } catch (error) {
        console.error("Error sending code:", error);
        alert("Could not send the confirmation code. Please try again.");
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
      ) as HTMLInputElement;
      const code = codeInput.value.trim();
      if (!code || code.length !== 6) return;

      const originalBtnText = verifyCodeBtn.textContent;
      verifyCodeBtn.innerHTML =
        '<span class="loading loading-spinner loading-sm"></span> Verifying...';
      verifyCodeBtn.disabled = true;

      try {
        // Prepare to call the actual Netlify function to be built
        /*
        const response = await fetch("/.netlify/functions/verify-beta-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: currentJwtToken, code }),
        });
        
        if (!response.ok) throw new Error("Invalid code");
        const data = await response.json();
        const licenseKey = data.licenseKey;
        */

        // MOCK: Simulate network request for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const licenseKey =
          "PT-" + Math.random().toString(36).substring(2, 10).toUpperCase();

        // Update UI
        if (newLicenseKeyText) newLicenseKeyText.textContent = licenseKey;
        step2Code?.classList.add("hidden");
        step3Success?.classList.remove("hidden");
      } catch (error) {
        console.error("Error verifying code:", error);
        alert("Invalid or expired code. Please try again.");
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
      (document.getElementById("verification-code") as HTMLInputElement).value =
        "";
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

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
    initBetaLicenseFlow();
  });

  console.log("Welcome to Portfolio Tracker!");
})();
