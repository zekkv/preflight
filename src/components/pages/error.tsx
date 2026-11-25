import * as Sentry from "@sentry/tanstackstart-react";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";

import { cn } from "cn";
import { Button, buttonVariants } from "#/components/ui/button";
import { Checklist, ChecklistItem } from "#/components/custom/checklist";
import { Page } from "#/components/custom/page";
import { RootDocument } from "#/components/layout/root-document";

interface ErrorPageProps {
  error: unknown;
  reset?: () => void;
  className?: string;
  title?: string;
  /** The short state shown on the first checklist row, such as an HTTP status. */
  status?: string;
}

export function ErrorPage({
  error,
  reset,
  className,
  title = "Something went wrong",
  status = "Error",
}: ErrorPageProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <Page width="md" className={cn("py-24 md:py-32", className)}>
      <div className="flex max-w-xl flex-col gap-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-balance font-stretch-semi-condensed md:text-4xl">
          {title}
        </h1>

        <div className="flex flex-col gap-4">
          <Checklist bordered>
            <ChecklistItem label="Status" value={status} mark="fault" />
          </Checklist>
          <p className="max-h-48 overflow-auto text-sm whitespace-pre-wrap text-muted-foreground wrap-anywhere">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {reset && (
            <Button type="button" onClick={reset}>
              Try again
            </Button>
          )}
          <Link to="/" className={buttonVariants({ variant: reset ? "outline" : "default" })}>
            Back to home
          </Link>
        </div>
      </div>
    </Page>
  );
}

/**
 * The root route's error boundary. A boundary replaces everything beneath `<html>`, so it
 * re-renders the document shell itself, and it is the one place that reports the failure to
 * Sentry — on the server during SSR, and again on the client once it hydrates.
 */
export function RootErrorPage(props: ErrorComponentProps) {
  // Capture SSR rendering exceptions manually as per documentation
  if (typeof window === "undefined") {
    Sentry.captureException(props.error);
  }

  React.useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <RootDocument meta={<meta name="robots" content="noindex, nofollow" />}>
      <ErrorPage error={props.error} reset={props.reset} />
    </RootDocument>
  );
}

/** The root route's 404. Nothing to report — the address simply matched no route. */
export function RootNotFoundPage() {
  return (
    <RootDocument meta={<meta name="robots" content="noindex, nofollow" />}>
      <ErrorPage
        error="The page you are looking for does not exist."
        title="404 - Not Found"
        status="404"
      />
    </RootDocument>
  );
}
