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

  function initActiveLinks() {
    document.addEventListener("DOMContentLoaded", function () {
      let currentPath = window.location.pathname;
      console.log("Current path:", currentPath);

      // Trim trailing slash for sub-paths (but keep '/' for home intact)
      if (currentPath.endsWith("/") && currentPath !== "/") {
        currentPath = currentPath.slice(0, -1);
      }

      // Select all <li> in menu lists (covers both mobile and desktop)
      const menuItems = document.querySelectorAll(".menu li");

      menuItems.forEach(function (li) {
        const a = li.querySelector("a");
        if (!a) return; // Skip if no <a> found

        const linkPath = a.getAttribute("href");

        if (linkPath === "/") {
          // Home: exact match for base URL
          if (currentPath === "/") {
            li.classList.add("active");
          }
        } else if (linkPath === "/docs") {
          // Documentation: any path starting with /docs
          if (currentPath.startsWith("/docs")) {
            li.classList.add("active");
          }
        } else if (linkPath === "/contact") {
          // Contact: exact match for /contact (after trimming trailing slash if present)
          if (currentPath === "/contact") {
            li.classList.add("active");
          }
        }
      });
    });
  }

  gallery();
  initActiveLinks();

  console.log("Welcome to Portfolio Tracker!");
})();
