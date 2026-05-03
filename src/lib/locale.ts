// ja-default URL strategy:
//   ja: "/", "/demo", "/react", ...
//   en: "/en", "/en/demo", "/en/react", ...
//
// Helpers below construct URLs and absorb the asymmetry so callers don't
// repeat the prefix logic.

export type Locale = "ja" | "en";

export const DEFAULT_LOCALE: Locale = "ja";

/**
 * Build a path for a given locale.
 * `suffix` is the page identifier with no leading slash, e.g. "demo", "react",
 * "blog/release". Pass "" for the locale's landing page.
 */
export function localePath(locale: Locale, suffix: string): `/${string}` {
  const prefix = locale === "ja" ? "" : "/en";
  if (suffix === "") return (prefix === "" ? "/" : prefix) as `/${string}`;
  return `${prefix}/${suffix}` as `/${string}`;
}

/**
 * Detect the locale from a URL pathname.
 * `/en/...` and `/en` → "en"; everything else → "ja".
 */
export function detectLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

/**
 * Strip the locale prefix from a pathname, returning the suffix used by
 * `localePath()`. `/en/demo` → "demo"; `/demo` → "demo"; `/` → "".
 */
export function stripLocale(pathname: string): string {
  const noLeading = pathname.startsWith("/en/")
    ? pathname.slice(4)
    : pathname === "/en"
      ? ""
      : pathname.startsWith("/")
        ? pathname.slice(1)
        : pathname;
  return noLeading.replace(/^\/+|\/+$/g, "");
}
