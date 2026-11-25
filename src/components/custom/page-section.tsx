import type { ReactNode } from "react";

/**
 * A titled band of an app page: the title and a one-line note sit in a narrow rail on the left,
 * the content on the right, with a hairline above. It stacks to one column below `md`.
 */
export function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  const id = `section-${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      className="grid gap-4 border-t border-border py-10 md:grid-cols-4 md:gap-12"
    >
      <header className="min-w-0">
        <h2 id={id} className="text-base font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{description}</p>
        )}
      </header>
      <div className="flex min-w-0 flex-col gap-4 md:col-span-3">{children}</div>
    </section>
  );
}
