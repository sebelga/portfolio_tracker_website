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

  function initCheckout() {
    const purchaseBtn = document.getElementById("purchase-license-btn");
    if (!purchaseBtn) return;

    purchaseBtn.addEventListener("click", async () => {
      try {
        const productId = purchaseBtn.getAttribute("data-product-id");
        if (!productId) {
          console.error("Product ID not found on the button");
          return;
        }

        const originalText = purchaseBtn.textContent;
        purchaseBtn.innerHTML =
          '<span class="loading loading-spinner loading-sm"></span> Loading...';
        purchaseBtn.setAttribute("disabled", "true");

        const response = await fetch("/.netlify/functions/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          console.error("Failed to create checkout session:", data);
          alert(
            "Could not start the checkout process. Please try again later.",
          );

          purchaseBtn.textContent = originalText;
          purchaseBtn.removeAttribute("disabled");
        }
      } catch (error) {
        console.error("Error connecting to checkout service:", error);
        alert(
          "Could not connect to the checkout service. Please check your internet connection and try again.",
        );

        purchaseBtn.textContent = "Purchase license";
        purchaseBtn.removeAttribute("disabled");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    gallery();
    initCheckout();
  });

  console.log("Welcome to Portfolio Tracker!");
})();
