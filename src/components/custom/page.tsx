import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

const WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-2xl",
  lg: "max-w-6xl",
} as const;

interface PageProps {
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  width?: keyof typeof WIDTHS;
  className?: string;
}

export function Page({
  children,
  eyebrow,
  title,
  description,
  width = "lg",
  className,
}: PageProps) {
  return (
    <main className={cn("mx-auto w-full px-4 py-16 sm:px-8 md:py-20", WIDTHS[width], className)}>
      {(eyebrow || title || description) && (
        <header className="max-w-2xl">
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          {title && (
            <h1 className="font-heading mt-3 text-3xl font-medium tracking-tight text-balance font-stretch-semi-condensed md:text-4xl">
              {title}
            </h1>
          )}
          {description && <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </main>
  );
}
