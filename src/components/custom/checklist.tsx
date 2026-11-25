import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "#/lib/utils";

/**
 * The design system's one recurring device, taken from a pilot's preflight card: an item, a
 * dotted leader, and its response ("Session ........ Active"). Use it wherever the app reports
 * state — the landing checklist, the dashboard summary, settings rows, the 404 — and nowhere
 * else. See docs/DESIGN.md.
 */
export function Checklist({
  children,
  ruled = false,
  bordered = false,
  className,
  ...props
}: React.ComponentProps<"ul"> & {
  /** A hairline between rows, for lists long enough that the eye needs help along each line. */
  ruled?: boolean;
  /** Hairlines above the first row and below the last, for a list that stands on its own. */
  bordered?: boolean;
}) {
  return (
    <ul
      className={cn(
        "flex flex-col",
        ruled && "divide-y divide-border",
        bordered && "border-y border-border",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

type Mark = "tick" | "cleared" | "pending" | "fault";

interface ChecklistItemProps {
  label: ReactNode;
  value: ReactNode;
  /**
   * `tick` draws a checked box before the label (an item that is done). The others draw a status
   * dot before the value: `cleared` (good), `pending` (neutral), `fault` (needs attention).
   */
  mark?: Mark;
  /** Lets the value wrap under the label on narrow screens instead of beside the leader. */
  stackOnMobile?: boolean;
}

export function ChecklistItem({ label, value, mark, stackOnMobile = false }: ChecklistItemProps) {
  const dot = mark && mark !== "tick";
  return (
    <li
      className={cn(
        "flex items-baseline gap-2.5 py-3 text-sm sm:text-base",
        stackOnMobile && "flex-wrap gap-y-0.5 sm:flex-nowrap"
      )}
    >
      {mark === "tick" && (
        <span
          aria-hidden="true"
          className="grid size-4 shrink-0 translate-y-0.5 place-items-center self-start rounded-sm bg-cleared text-cleared-foreground"
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
      <span className="shrink-0">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "min-w-6 flex-1 -translate-y-1 border-b-2 border-dotted border-input",
          stackOnMobile && "hidden sm:block"
        )}
      />
      <span
        className={cn(
          "inline-flex min-w-0 items-baseline gap-1.5 text-right text-muted-foreground",
          stackOnMobile && "basis-full text-left sm:basis-auto sm:text-right",
          // Line the stacked value up with the label, which sits after the tick when there is one.
          stackOnMobile && mark === "tick" && "pl-6.5 sm:pl-0"
        )}
      >
        {dot && (
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 shrink-0 self-center rounded-full",
              mark === "cleared" && "bg-cleared",
              mark === "pending" && "bg-muted-foreground",
              mark === "fault" && "bg-destructive"
            )}
          />
        )}
        <span className="min-w-0 wrap-anywhere">{value}</span>
      </span>
    </li>
  );
}
