export const THEME_STORAGE_KEY = "estudia-theme";

export type ThemePreference = "light" | "dark" | "system";

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") return value;
  } catch {
    /* ignore */
  }
  return "system";
}

export function resolveDark(preference: ThemePreference): boolean {
  if (preference === "dark") return true;
  if (preference === "light") return false;
  return systemPrefersDark();
}

export function applyTheme(preference: ThemePreference): void {
  document.documentElement.classList.toggle("dark", resolveDark(preference));
}

const themeListeners = new Set<() => void>();

export function subscribeTheme(onChange: () => void): () => void {
  themeListeners.add(onChange);

  if (typeof window !== "undefined") {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (readStoredTheme() === "system") {
        applyTheme("system");
        onChange();
      }
    };
    media.addEventListener("change", onSystemChange);
    return () => {
      themeListeners.delete(onChange);
      media.removeEventListener("change", onSystemChange);
    };
  }

  return () => {
    themeListeners.delete(onChange);
  };
}

export function storeTheme(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
  applyTheme(preference);
  themeListeners.forEach((listener) => listener());
}
