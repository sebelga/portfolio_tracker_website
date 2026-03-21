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

  function initActiveLinks() {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const menuItems = document.querySelectorAll(".navbar .menu li");

    const pathConditions: Record<string, (path: string) => boolean> = {
      "/": (path) => path === "/",
      "/docs": (path) => path.startsWith("/docs"),
      "/contact": (path) => path === "/contact",
      "/about": (path) => path === "/about",
    };

    menuItems.forEach((li) => {
      const a = li.querySelector("a");
      const linkPath = a?.getAttribute("href");

      if (linkPath && pathConditions[linkPath]?.(currentPath)) {
        li.classList.add("active");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
    initActiveLinks();
  });

  console.log("Welcome to Portfolio Tracker!");
})();
