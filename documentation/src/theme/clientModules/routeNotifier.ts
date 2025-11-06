import type { ClientModule } from "@docusaurus/types";

const routeNotifier: ClientModule = {
  onRouteDidUpdate({ location }) {
    // Only run in iframe context
    if (window.parent === window) return;

    const isDev =
      window.location.hostname === "localhost" &&
      window.location.port !== "1234";

    const scrollToAnchor = (hash: string) => {
      if (!hash) return;
      const targetOrigin = isDev
        ? "http://localhost:5173"
        : window.location.origin;

      const element = document.getElementById(hash.slice(1));
      if (element) {
        const rect = element.getBoundingClientRect();
        window.parent.postMessage(
          { type: "anchorPosition", position: rect.top, hash: hash },
          targetOrigin
        );
      }
    };

    const route = location.pathname.replace("/documentation/", "/");
    const hash = location.hash.split("?")[0];

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
          hash,
          height: finalHeight,
        },
        "*"
      );

      scrollToAnchor(hash);
    }, 50); // Slight delay for async renders
  },
};

export default routeNotifier;
