import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, createLogger, loadEnv } from "vite";

const logger = createLogger();
const originalWarn = logger.warn.bind(logger);

logger.warn = (msg, options) => {
  if (msg.includes("Failed to load source map")) return;
  originalWarn(msg, options);
};

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";
  const hasSentryAuthToken = Boolean(
    env.SENTRY_AUTH_TOKEN && env.SENTRY_AUTH_TOKEN !== "your-sentry-auth-token"
  );

  return {
    customLogger: logger,
    optimizeDeps: {
      exclude: ["bun"],
    },
    ssr: {
      external: ["bun"],
    },
    plugins: [
      ...(isDev ? [devtools()] : []),
      nitro({
        preset: "bun",
        rollupConfig: { external: ["bun", /^bun:/] },
        traceDeps: [/^@sentry\//, /^@logtape\//],
        routeRules: {
          "/assets/**": {
            headers: {
              "cache-control": "public, max-age=31536000, immutable",
            },
          },
        },
      }),
      tailwindcss(),
      tanstackStart(),
      // Always registered: since Sentry SDK 11.13 the plugin bundles `instrument.server.mjs` into
      // the Nitro build and runs it when the server starts, so production needs no `--import`
      // preload. Release creation and source-map upload only run when an auth token is set.
      sentryTanstackStart(
        hasSentryAuthToken
          ? {
              org: env.VITE_SENTRY_ORG,
              project: env.VITE_SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
            }
          : { sourcemaps: { disable: true }, telemetry: false, silent: true }
      ),
      viteReact(),
    ],
  };
});

export default config;
