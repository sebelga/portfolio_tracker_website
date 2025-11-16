import React, { type ReactNode } from "react";

import { useThemeConfig } from "@docusaurus/theme-common";
import FooterLinks from "@theme/Footer/Links";
import FooterLogo from "@theme/Footer/Logo";
import FooterCopyright from "@theme/Footer/Copyright";
import FooterLayout from "@theme/Footer/Layout";

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
          &copy; 2025 Portfolio Tracker Add-on. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          Google Sheets™ is a trademark of Google LLC.
        </p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
