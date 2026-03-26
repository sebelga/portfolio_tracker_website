const LIGHT_THEME = "emerald";
const DARK_THEME = "forest";
const STORAGE_KEY = "theme"; // Same as Docusaurus so users switching from documentation to website have a seamless experience

type ThemePreference = "system" | "light" | "dark";

function getPreference(): ThemePreference {
  return (localStorage.getItem(STORAGE_KEY) as ThemePreference) ?? "system";
}

function resolveTheme(pref: ThemePreference): {
  isDark: boolean;
  name: string;
} {
  if (pref === "light") return { isDark: false, name: LIGHT_THEME };
  if (pref === "dark") return { isDark: true, name: DARK_THEME };
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDark
    ? { isDark: true, name: DARK_THEME }
    : { isDark: false, name: LIGHT_THEME };
}

function applyTheme(pref: ThemePreference) {
  const theme = resolveTheme(pref);
  document.documentElement.setAttribute("data-theme", theme.name);
  const logo = document.getElementById(
    "header-logo",
  ) as HTMLImageElement | null;
  if (logo) {
    logo.src = theme.isDark ? "/img/logo-dark.svg" : "/img/logo-light.svg";
  }
}

function updateActiveButton(pref: ThemePreference) {
  const ids = ["theme-system", "theme-light", "theme-dark"] as const;
  const map: Record<ThemePreference, string> = {
    system: "theme-system",
    light: "theme-light",
    dark: "theme-dark",
  };
  for (const id of ids) {
    document
      .getElementById(id)
      ?.classList.toggle("btn-active", id === map[pref]);
  }
}

function setPreference(pref: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, pref);
  applyTheme(pref);
  updateActiveButton(pref);
}

export function initThemeToggle() {
  // Apply saved preference immediately to avoid flash
  applyTheme(getPreference());

  // Listen for OS-level color scheme changes (relevant when preference is "system")
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getPreference() === "system") {
        applyTheme("system");
      }
    });

  document.addEventListener("DOMContentLoaded", () => {
    const pref = getPreference();
    updateActiveButton(pref);

    document
      .getElementById("theme-system")
      ?.addEventListener("click", () => setPreference("system"));
    document
      .getElementById("theme-light")
      ?.addEventListener("click", () => setPreference("light"));
    document
      .getElementById("theme-dark")
      ?.addEventListener("click", () => setPreference("dark"));
  });
}
