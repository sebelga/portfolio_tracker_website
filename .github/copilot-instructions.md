# AI Agent Context: Portfolio Tracker Website

You are an expert web developer assisting with the "Portfolio Tracker" project. This is a multi-part project consisting of a main marketing website and a documentation sub-site.

## 🛠 Tech Stack & Architecture

- **Bundler:** Vite (Multi-Page Application mode)
- **Plugin:** `vite-plugin-virtual-mpa` (using `createMpaPlugin`)
- **Templating:** EJS (Embedded JavaScript)
- **Styling:** Tailwind CSS v4 + Daisy UI 5
- **Docs:** Docusaurus (located in `/documentation`)
- **Hosting:** Netlify (using Netlify Functions for backend logic)

## 📂 Project Structure

- `/website`: The root of the static site source.
  - `/website/src/pages`: All main EJS page templates.
  - `/website/src/partials`: Reusable EJS components/partials (e.g., header, footer).
  - `/website/src/main.ts`: Main TypeScript entry point.
  - `/website/src/styles.css`: Central CSS file (contains Tailwind v4 @import rules).
- `/documentation`: Independent Docusaurus project.
- `/netlify/functions`: Serverless functions for any dynamic logic.
- `/scripts/build.sh`: Master build script.

## 📜 Development Rules & Standards

### 1. UI & Styling (Tailwind v4 + Daisy UI)

- **Priority:** Always use Daisy UI components (e.g., `btn`, `card`, `navbar`) first. Use Tailwind utility classes for layout and fine-tuning.
- **Minimal CSS:** Do not add custom CSS to `/website/src/styles.css` unless absolutely necessary.
- **Responsiveness:** Every new component or page **must** be mobile-first and fully responsive.
- **Reference:** For Daisy UI components, refer to `https://daisyui.com/llms.txt`.

### 2. Multi-Page Architecture & EJS

- **Path Resolution:** Always use `path.resolve` with `__dirname` for templates to ensure absolute paths.
- **New Pages:** All new page `.ejs` files MUST be placed in `/website/src/pages`.
- **New Partials:** Any reusable EJS snippets MUST be placed in `/website/src/partials`.
- **Mandatory Registration:** When creating a new page, register it in `vite.config.mjs`.
- **Script Strategy:** Use "Vite-Native" manual injection.
- **Implementation:** Ensure `<script type="module" src="/src/main.ts"></script>` is present in `/website/src/partials/layout_bottom.ejs`.
- **Vite Config:** Do NOT use the `entry` property in `vite.config.mjs` for pages using the sandwich layout; Vite will auto-discover the script in the rendered HTML.
- **Pathing:** Always use root-relative paths (starting with `/`) for assets and scripts within EJS templates.
- **EJS Include Paths:** All `<%- include(...) %>` statements must be **Root-Relative**.
- **The Base Path:** The root is `/website`.
- **Correct Pattern:** Always use `<%- include('./src/partials/...) %>`.
- **Incorrect Pattern:** Do not use relative steps like `../partials/`.

**Configuration Pattern:**
{
name: 'page-name',
template: resolve(pagesDir, 'page-name.ejs'),
filename: 'page-name.html',
entry: '/src/main.ts'
}

### 3. Logic & Backend

- **Client-side:** Keep logic in `/website/src/main.ts`. Use TypeScript strictly.
- **Server-side:** All backend logic (API calls, data fetching, crypto price lookups) must reside in `/netlify/functions`.

### 4. SEO & Schema Rules

- **JSON-LD:** Always pass schema data via the `jsonLd` variable.
- **Multiple Schemas:** If a page requires more than one schema (e.g., Breadcrumbs + SoftwareApplication), pass them as an **Array of Objects**.
- **Layout Logic:** The `layout_top.ejs` is configured to automatically wrap arrays in a Schema.org `@graph` for better SEO.

### 5. Body Styling

- **Custom Classes:** You can pass a `bodyClass` string to `layout_top.ejs` to add classes to the <body> tag.
- **Example:** `bodyClass: 'bg-base-200 overflow-x-hidden'`
- **Default:** If no `bodyClass` is provided, the <body> has the `font-sans text-gray-900 antialiased` classes.

### 6. Navigation & Active States

- **Priority:** Handle "active" navigation states in `header.ejs` using the `slug` variable.
- **Implementation:** Use a ternary operator to check the `slug` and apply the `.active` class.
- **Consistency:** Ensure the `slug` passed in the page template matches the `href` in the header (e.g., `slug: '/contact'` for the Contact page).
- **SEO Sync:** This same `slug` is used for Canonical and Social Meta tags in `head.ejs`.

### 7. Build Process

- All changes to the build flow must be reflected in `./scripts/build.sh`.

## 🚦 Verification Checklist

- [ ] Is the new page located in `/website/src/pages`?
- [ ] Are reusable snippets in `/website/src/partials`?
- [ ] Is the page added to `vite.config.mjs`?
- [ ] Does the page use Daisy UI classes and remain responsive?
