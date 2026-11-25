import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { logger } from "#/lib/logger";

const loggerMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
  logger.info("Incoming request", {
    method: request.method,
    url: new URL(request.url).pathname,
  });
  return next();
});

/**
 * Low-risk response headers every page and server function should carry. The app never needs to
 * be framed, sniffed, or to share an opener with another origin (Google sign-in is a redirect,
 * not a popup). HSTS is left to production so a local `http://` origin is never pinned. A full
 * nonce-based `Content-Security-Policy` is the next step and needs the inline scripts that
 * TanStack Start and next-themes emit to carry the nonce.
 */
const securityHeadersMiddleware = createMiddleware({ type: "request" }).server(async ({ next }) => {
  const result = await next();
  const { headers } = result.response;
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  if (import.meta.env.PROD) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return result;
});

/**
 * TanStack Start instance with Sentry global middlewares and custom logging.
 *
 * - sentryGlobalRequestMiddleware: attaches request context to Sentry events.
 * - sentryGlobalFunctionMiddleware: captures errors in server functions.
 * - loggerMiddleware: logs all incoming requests for audit/metrics.
 * - securityHeadersMiddleware: adds the baseline security response headers.
 *
 * These must be first in the arrays to ensure all errors and requests are
 * captured before any other middleware has a chance to swallow them.
 */
export const startInstance = createStart(() => {
  return {
    requestMiddleware: [sentryGlobalRequestMiddleware, loggerMiddleware, securityHeadersMiddleware],
    functionMiddleware: [sentryGlobalFunctionMiddleware],
  };
});
