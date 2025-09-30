import PhotoSwipeLightbox from "photoswipe/lightbox";

(function init() {
  function gallery() {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();
  }

  gallery();

  console.log("Welcome to Portfolio Tracker!");
})();
