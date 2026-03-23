import React, { type ReactNode } from "react";

function Footer(): ReactNode {
  return (
    <footer className="pageFooter bg-gray-100 py-6">
      <div className="mx-auto mt-6 text-center text-sm leading-relaxed text-gray-500">
        <p className="mb-4">
          <a href="/">Home</a> | <a href="/contact">Contact</a> |{" "}
          <a href="/docs">Documentation</a>{" "}
          <span className="hidden md:inline">|</span>{" "}
          <br className="md:hidden" />
          <a href="/terms-and-services">Terms and services</a> |{" "}
          <a href="/privacy-policy">Privacy policy</a>
        </p>
        <p className="mb-2">
          &copy; 2026 TradeGist Add-on. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          Google Sheets™ is a trademark of Google LLC.
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
