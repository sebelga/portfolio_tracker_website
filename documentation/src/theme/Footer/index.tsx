import React, { type ReactNode } from "react";

function Footer(): ReactNode {
  return (
    <footer className="footer footer-horizontal bg-base-200 text-base-content border-base-300 border-t px-10 py-4">
      <aside className="grid-flow-col items-center">
        <p>
          &copy; {new Date().getFullYear()} TradeGist Add-on. All rights
          reserved.
        </p>
      </aside>
      <nav className="md:place-self-center md:justify-self-end flex items-center gap-4">
        <p className="text-xs opacity-50">
          Google Sheets™ is a trademark of Google LLC.
        </p>
      </nav>
    </footer>
  );
}

export default React.memo(Footer);
