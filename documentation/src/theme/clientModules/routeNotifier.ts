import type { ClientModule } from "@docusaurus/types";

const routeNotifier: ClientModule = {
  async onRouteDidUpdate({ location }) {
    // Only run in iframe context
    if (window.parent === window) {
      return;
    }

    const route = location.pathname.replace("/documentation/", "/");

    setTimeout(() => {
      const docRoot: HTMLDivElement | null =
        document.querySelector("#__docusaurus");
      if (!docRoot) {
        console.warn("Could not find #__docusaurus");
        return;
      }

      // Save original styles
      const originalMinHeight = docRoot.style.minHeight;
      const originalHeight = docRoot.style.height;

      // Temporarily remove constraints to measure intrinsic content height
      docRoot.style.minHeight = "0";
      docRoot.style.height = "auto";

      // Trigger reflow
      void docRoot.offsetHeight;

      // Calculate intrinsic height (now reflects true content, e.g., 622px for short pages)
      const height = Math.max(docRoot.scrollHeight, docRoot.offsetHeight);

      // Restore styles immediately (no visual flash)
      docRoot.style.minHeight = originalMinHeight;
      docRoot.style.height = originalHeight;

      // Optional: Enforce a min height to avoid 0px issues
      const finalHeight = Math.max(height, 300);

      // Send route and height to parent (use '*' for dev; specify origin in prod)
      window.parent.postMessage(
        {
          type: "docusaurusRouteChange",
          route,
          height: finalHeight,
        },
        "*"
      );
    }, 50); // Slight delay for async renders
  },
};

export default routeNotifier;
