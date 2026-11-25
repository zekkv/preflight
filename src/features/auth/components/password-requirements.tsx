import { Check } from "lucide-react";

import { cn } from "#/lib/utils";
import { PASSWORD_REQUIREMENTS } from "#/features/auth/schema/password";

export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="flex flex-col gap-1.5" aria-label="Password requirements">
      {PASSWORD_REQUIREMENTS.map(requirement => {
        const met = requirement.test(password);
        return (
          <li
            key={requirement.label}
            aria-label={`${requirement.label}: ${met ? "met" : "not met"}`}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              met ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-3.5 shrink-0 place-items-center rounded-sm border transition-colors",
                met ? "border-cleared bg-cleared text-cleared-foreground" : "border-input"
              )}
            >
              {met && <Check className="size-2.5" strokeWidth={3} />}
            </span>
            {requirement.label}
          </li>
        );
      })}
    </ul>
  );
}
