import PhotoSwipeLightbox from "photoswipe/lightbox";
import {
  initBetaLicenseFlow,
  initNewsletterFlow,
  initRecoverLicenseFlow,
  initRequestTemplateFlow,
} from "./pricing";

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

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
    initBetaLicenseFlow();
    initNewsletterFlow();
    initRecoverLicenseFlow();
    initRequestTemplateFlow();
  });

  console.log("Welcome to TradeGist!");
})();
