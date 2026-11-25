import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";

export type Theme = "dark" | "light" | "system";
export { useTheme };

/** `--background` from `globals.css` for each theme, as the hex `<meta name="theme-color">` takes. */
export const THEME_COLORS = { light: "#fcfcfc", dark: "#0c0c0c" } as const;

/**
 * Keeps `<meta name="theme-color">` (the browser toolbar tint on mobile and in installed apps) on
 * the resolved theme, so a dark page does not sit under light browser chrome or the reverse.
 */
function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = resolvedTheme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;
  }, [resolvedTheme]);
  return null;
}

type ThemeProviderProps = PropsWithChildren<
  Pick<
    NextThemesProviderProps,
    | "attribute"
    | "defaultTheme"
    | "disableTransitionOnChange"
    | "enableColorScheme"
    | "enableSystem"
    | "forcedTheme"
    | "nonce"
    | "scriptProps"
    | "storageKey"
    | "themes"
    | "value"
  >
>;

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  storageKey = "template-theme",
  enableColorScheme = true,
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableColorScheme={enableColorScheme}
      enableSystem={enableSystem}
      {...props}
    >
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}
