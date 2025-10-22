import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";
import { templateUrl } from "./src/constants";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const isDev = process.env.NODE_ENV === "development";
const websiteURL = isDev
  ? "http://localhost:5173"
  : "https://portfoliotrackergooglesheets.com";
if (isDev) {
  console.log(`Docusaurus running in development mode.`);
}
const baseUrl = isDev ? "/" : "/documentation/";

const config: Config = {
  title: "Portfolio tracker for Google Sheets",
  tagline:
    "Track your stock, crypto, and options investments with Google Sheets effortlessly",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: websiteURL,
  baseUrl,

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  // Custom fields are exposed to the site/client code via useDocusaurusContext().
  // Add a single source of truth for the official template URL so docs can reference it.
  customFields: {
    templateUrl,
  },

  clientModules: [
    path.resolve(__dirname, "src/theme/clientModules/routeNotifier"),
  ],

  scripts: [
    {
      src: `${baseUrl}js/custom.js`,
      async: true,
    },
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Portfolio tracker",
      items: [
        {
          position: "left",
          label: "Home",
          target: "_self",
          href: websiteURL,
        },
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "Documentation",
          to: "/",
        },
        {
          // type: "docSidebar",
          position: "left",
          label: "Contact",
          href: `${websiteURL}/contact`,
          target: "_self",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
