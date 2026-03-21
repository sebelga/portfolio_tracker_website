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
    let currentPath = window.location.pathname;

    // Trim trailing slash for sub-paths (but keep '/' for home intact)
    if (currentPath.endsWith("/") && currentPath !== "/") {
      currentPath = currentPath.slice(0, -1);
    }

    // Select all <li> in menu lists (covers both mobile and desktop)
    const menuItems = document.querySelectorAll(".menu li");

    const pathConditions: Record<string, (path: string) => boolean> = {
      "/": (path) => path === "/",
      "/docs": (path) => path.startsWith("/docs"),
      "/contact": (path) => path === "/contact",
      "/about": (path) => path === "/about",
    };

    menuItems.forEach(function (li) {
      const a = li.querySelector("a");
      if (!a) return; // Skip if no <a> found

      const linkPath = a.getAttribute("href");
      if (linkPath === null) return; // Skip if no href

      const condition = pathConditions[linkPath];
      if (condition && condition(currentPath)) {
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
