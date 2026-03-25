import PhotoSwipeLightbox from "photoswipe/lightbox";
import {
  initBetaLicenseFlow,
  initPricingNewsletterFlow,
  initRecoverLicenseFlow,
  initRequestTemplateFlow,
} from "./pricing";
import { initNewsletterForm } from "./newsletter";
import { initThemeToggle } from "./theme";

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

  initThemeToggle();

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
    initBetaLicenseFlow();
    initPricingNewsletterFlow();
    initRecoverLicenseFlow();
    initRequestTemplateFlow();

    // Footer newsletter modal
    initNewsletterForm({
      formId: "footer-newsletter-form",
      emailInputId: "footer-newsletter-email",
      submitBtnId: "footer-newsletter-btn",
      successId: "footer-newsletter-success",
    });
  });

  console.log("Welcome to TradeGist!");
})();
