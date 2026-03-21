import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { createMpaPlugin } from "vite-plugin-virtual-mpa";
import { templateUrl } from "./website/constants.mjs";

const projectRoot = resolve(__dirname, "website");
const pagesDir = resolve(projectRoot, "src/pages");

export default defineConfig({
  plugins: [
    {
      name: "redirect-root", // Custom plugin for dev server redirect
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/") {
            req.url = "/index.html"; // Required for the Mpa plugin to work correctly
          }
          next();
        });
      },
    },
    createMpaPlugin({
      pages: [
        {
          name: "index",
          template: resolve(pagesDir, "index.ejs"),
          filename: "index.html",
          data: {
            templateUrl,
          },
        },
        {
          name: "about",
          template: resolve(pagesDir, "about.ejs"),
          filename: "about.html",
        },
        {
          name: "contact",
          template: resolve(pagesDir, "contact.ejs"),
          filename: "contact.html",
        },
        {
          name: "docs",
          template: resolve(pagesDir, "docs.ejs"),
          filename: "docs.html",
        },
        {
          name: "terms-and-services",
          template: resolve(pagesDir, "terms-and-services.ejs"),
          filename: "terms-and-services.html",
        },
        {
          name: "privacy-policy",
          template: resolve(pagesDir, "privacy-policy.ejs"),
          filename: "privacy-policy.html",
        },
      ],
      htmlMinify: true,
      watchOptions: {
        include: "**/*.ejs", // Watch all .ejs files in the project
        handler: ({ server, file, type }) => {
          if (type === "change" && file.endsWith(".ejs")) {
            console.log(`EJS template changed: ${file}. Triggering reload.`);
            server.ws.send({
              type: "full-reload",
              path: "*",
            });
          }
        },
      },
    }),
    tailwindcss({ config: "./tailwind.config.js" }),
  ],
  // Basic config for static site
  root: "./website",
  build: {
    outDir: "../dist", // Output directory for builds
    emptyOutDir: true,
  },
  server: {
    open: true, // Auto-open browser on dev server start
  },
});
