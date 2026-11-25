import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Page } from "#/components/custom/page";
import { Checklist, ChecklistItem } from "#/components/custom/checklist";
import { Button, buttonVariants } from "#/components/ui/button";

const REPO_URL = "https://github.com/zekkv/preflight";
const DOCS_URL = "https://tanstack.com/start/latest/docs/framework/react/overview";

const QUICKSTART = `git clone https://github.com/zekkv/preflight.git
cd preflight
bun install && bun dev`;

/** What the template has already cleared, in the order a new project would meet it. */
const CHECKLIST = [
  { item: "Sign-in", response: "Password, email code, passkey, Google" },
  { item: "Sessions", response: "Guarded routes, rate limited" },
  { item: "Database", response: "Postgres through Drizzle, generated migrations" },
  { item: "Email", response: "Resend and React Email, or any SMTP relay" },
  { item: "Uploads", response: "Presigned PUT to any S3-compatible store" },
  { item: "Account", response: "Verify email, passkeys, password, deletion" },
  { item: "Tests", response: "Vitest, Testcontainers, Playwright" },
  { item: "Observability", response: "LogTape and Sentry, PII off by default" },
  { item: "CI", response: "Lint, types, migration drift, build" },
];

interface TreeEntry {
  glyph: string;
  path: string;
  note?: string;
}

const TREE: TreeEntry[][] = [
  [
    { glyph: "", path: "src/" },
    { glyph: "├─", path: "routes/", note: "File-based routing, auth-guarded loaders" },
    { glyph: "├─", path: "features/auth/", note: "Better Auth: email OTP, passkeys, Google" },
    { glyph: "├─", path: "db/", note: "Drizzle ORM schema and migrations" },
    { glyph: "├─", path: "lib/", note: "Mailer (Resend), storage (S3 presign), Redis" },
    { glyph: "└─", path: "components/ui/", note: "shadcn primitives, themed once here" },
  ],
  [
    { glyph: "", path: "tests/" },
    { glyph: "├─", path: "unit/", note: "Vitest, pure logic" },
    { glyph: "├─", path: "integration/", note: "Testcontainers against real Postgres" },
    { glyph: "└─", path: "e2e/", note: "Playwright against the built app" },
  ],
];

const ALSO_INCLUDED = [
  {
    term: "Infrastructure",
    detail: "Dockerfile and compose file with Postgres, SeaweedFS, Redis and Mailpit",
  },
  { term: "Guardrails", detail: "Lefthook runs format, lint and typecheck before every commit" },
];

export function LandingPage() {
  return (
    <Page className="py-0 md:py-0">
      <HeroSection />
      <ContentsSection />
      <footer className="mt-24 flex flex-col gap-3 border-t border-border py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>MIT license</span>
        <nav className="flex gap-6">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            TanStack Start docs
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </footer>
    </Page>
  );
}

function HeroSection() {
  return (
    <section className="grid animate-in gap-14 py-16 duration-700 fade-in md:py-24 lg:grid-cols-11 lg:gap-16 lg:py-28">
      <div className="min-w-0 lg:col-span-5">
        <h1 className="font-heading text-5xl font-medium tracking-tight text-balance font-stretch-semi-condensed md:text-6xl md:leading-display">
          Start from done.
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          A full-stack TanStack Start template with the unglamorous parts already checked off. Clone
          it, delete the demo notes, and build your product.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            Get started
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline decoration-input underline-offset-4 transition-colors hover:decoration-foreground"
          >
            View on GitHub
          </a>
        </div>

        <QuickstartBlock />
      </div>

      <section aria-labelledby="checklist-heading" className="min-w-0 lg:col-span-6">
        <div className="flex items-baseline justify-between gap-3 border-t-2 border-foreground pt-4">
          <h2 id="checklist-heading" className="text-lg font-semibold tracking-tight">
            Preflight checklist
          </h2>
          <p className="text-sm text-muted-foreground tabular-nums">
            {CHECKLIST.length} of {CHECKLIST.length} checked
          </p>
        </div>
        <Checklist ruled className="mt-2">
          {CHECKLIST.map(entry => (
            <ChecklistItem
              key={entry.item}
              mark="tick"
              label={entry.item}
              value={entry.response}
              stackOnMobile
            />
          ))}
        </Checklist>
      </section>
    </section>
  );
}

function QuickstartBlock() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(QUICKSTART);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className="mt-12 max-w-lg">
      <figcaption className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>Quickstart</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => void handleCopy()}
          aria-label={copied ? "Copied" : "Copy commands"}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </figcaption>
      <pre className="mt-1 overflow-x-auto rounded-md border border-border bg-muted px-4 py-3.5 font-mono text-xs leading-loose sm:text-sm">
        {QUICKSTART.split("\n").map(line => (
          <div key={line} className="whitespace-pre">
            <span className="mr-3 text-muted-foreground select-none">$</span>
            {line}
          </div>
        ))}
      </pre>
    </figure>
  );
}

function ContentsSection() {
  return (
    <section
      className="grid gap-8 border-t border-border pt-16 md:pt-20 lg:grid-cols-11 lg:gap-16"
      aria-labelledby="contents-heading"
    >
      <div className="lg:col-span-5">
        <h2 id="contents-heading" className="text-xl font-semibold tracking-tight">
          What&rsquo;s inside
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Features live in <code className="font-mono text-xs">src/features</code> and cross the
          server boundary only through server functions.
        </p>
      </div>

      <div className="min-w-0 lg:col-span-6">
        <ul className="flex flex-col gap-7">
          {TREE.map(group => (
            <li key={group[0].path}>
              <ul className="text-sm">
                {group.map(entry =>
                  entry.note ? (
                    <li
                      key={`${entry.glyph}${entry.path}`}
                      className="grid gap-0.5 border-t border-border py-2 sm:grid-cols-5 sm:gap-4"
                    >
                      <span className="font-mono text-xs whitespace-pre sm:col-span-2 sm:text-sm">
                        <span className="mr-1.5 text-muted-foreground">{entry.glyph}</span>
                        {entry.path}
                      </span>
                      <span className="text-muted-foreground sm:col-span-3">{entry.note}</span>
                    </li>
                  ) : (
                    <li key={entry.path} className="pb-1.5 font-mono text-sm font-medium">
                      {entry.path}
                    </li>
                  )
                )}
              </ul>
            </li>
          ))}
        </ul>

        <dl className="mt-10 flex flex-col gap-3.5 text-sm">
          {ALSO_INCLUDED.map(item => (
            <div key={item.term} className="grid gap-0.5 sm:grid-cols-5 sm:gap-4">
              <dt className="font-medium sm:col-span-2">{item.term}</dt>
              <dd className="text-muted-foreground sm:col-span-3">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
