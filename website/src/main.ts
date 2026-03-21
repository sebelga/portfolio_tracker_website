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

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
  });

  console.log("Welcome to Portfolio Tracker!");
})();
