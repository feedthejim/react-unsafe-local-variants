import {
  variant,
  fromLocalStorage,
  fromCookie,
  fromSearchParam,
  fromMediaQuery,
} from "../../src";

// Theme from localStorage
export const theme = variant({
  key: "theme-choice",
  options: ["light", "dark", "system"] as const,
  default: "system",
  read: fromLocalStorage("theme"),
});

// View mode from cookie
export const viewMode = variant({
  key: "view-mode",
  options: ["grid", "list", "compact"] as const,
  default: "list",
  read: fromCookie("view_mode"),
});

// Feature flag from URL search param
export const featureFlag = variant({
  key: "feature",
  options: ["stable", "beta", "experimental"] as const,
  default: "stable",
  read: fromSearchParam("feature"),
});

// Motion preference from media query
export const motionPref = variant({
  key: "motion",
  options: ["full", "reduced"] as const,
  default: "full",
  read: fromMediaQuery("(prefers-reduced-motion: reduce)", {
    true: "reduced",
    false: "full",
  }),
});

// Color scheme from media query (system preference)
export const colorScheme = variant({
  key: "color-scheme",
  options: ["light", "dark"] as const,
  default: "light",
  read: fromMediaQuery("(prefers-color-scheme: dark)", {
    true: "dark",
    false: "light",
  }),
});
