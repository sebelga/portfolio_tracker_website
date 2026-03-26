import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";
import { WORKSPACE_ADDON_URL } from "../constants.mjs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const isDev = process.env.NODE_ENV === "development";
const websiteURL = isDev ? "http://localhost:5173" : "https://thetradegist.com";
if (isDev) {
  console.log(`Docusaurus running in development mode.`);
}
const baseUrl = isDev ? "/" : "/docs/";

const config: Config = {
  title: "TradeGist for Google Sheets",
  tagline:
    "Most portfolio trackers just tell you if you're up or down. TradeGist tells you why.",
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
        googleTagManager: {
          containerId: "GTM-NGRM269Z",
        },
      } satisfies Preset.Options,
    ],
  ],

  // Custom fields are exposed to the site/client code via useDocusaurusContext().
  // Add a single source of truth for the official workspace URL so docs can reference it.
  customFields: {
    workspaceUrl: WORKSPACE_ADDON_URL,
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

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: websiteURL,
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap",
      },
    },
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Organization",
        name: "TradeGist for Google Sheets",
        url: websiteURL,
        logo: `${websiteURL}/img/logo-light.svg`,
      }),
    },
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "light",
      disableSwitch: true, // Set to true if you want to remove the dark/light mode toggle
      respectPrefersColorScheme: false, // Set to true if you want to respect the user's system color scheme preference
    },
    metadata: [
      {
        name: "keywords",
        content:
          "TradeGist, google sheets, investment tracking, financial management, stock portfolio, crypto portfolio, options portfolio, asset management",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    navbar: {
      logo: {
        alt: "TradeGist logo",
        src: "img/logo-light.svg",
        href: websiteURL,
        target: "_self",
      },
      // Items are added in the src/theme/Navbar/Content/index.tsx file to allow for a custom layout
      items: [],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
