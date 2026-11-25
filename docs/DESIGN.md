---
name: Checklist
description: A quiet, cool-neutral system that borrows one device from a pilot's preflight card — item, dotted leader, response — and uses it wherever the app reports state. Everything else stays out of the way.
colors:
  background: "oklch(0.988 0.001 265)"
  foreground: "oklch(0.23 0.008 264)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.23 0.008 264)"
  primary: "oklch(0.23 0.008 264)"
  primary-foreground: "oklch(0.988 0.001 265)"
  secondary: "oklch(0.967 0.003 265)"
  secondary-foreground: "oklch(0.23 0.008 264)"
  muted: "oklch(0.967 0.003 265)"
  muted-foreground: "oklch(0.495 0.017 264)"
  border: "oklch(0.922 0.006 265)"
  input: "oklch(0.845 0.009 265)"
  ring: "oklch(0.482 0.071 170)"
  cleared: "oklch(0.482 0.071 170)"
  cleared-foreground: "oklch(0.988 0.001 265)"
  destructive: "oklch(0.52 0.161 29)"
  destructive-foreground: "oklch(0.988 0.001 265)"
typography:
  display:
    fontFamily: Instrument Sans Variable
    fontSize: 60px
    fontWeight: 500
    fontStretch: 87.5%
    lineHeight: 1.04
    letterSpacing: -0.025em
  h1:
    fontFamily: Instrument Sans Variable
    fontSize: 36px
    fontWeight: 500
    fontStretch: 87.5%
    lineHeight: 1.1
    letterSpacing: -0.025em
  h2:
    fontFamily: Instrument Sans Variable
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.025em
  body-lg:
    fontFamily: Instrument Sans Variable
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.625
  body-md:
    fontFamily: Instrument Sans Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Instrument Sans Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  mono-code:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 2
  mono-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 40px
  xl: 64px
  section: 112px
  gutter: 16px / 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    height: 40px
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    rounded: "{rounded.md}"
  button-destructive-solid:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: transparent
    textColor: "{colors.destructive}"
    borderColor: "{colors.destructive}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    rounded: "{rounded.md}"
    height: 40px
  checklist-leader:
    borderColor: "{colors.input}"
  checklist-tick:
    backgroundColor: "{colors.cleared}"
    textColor: "{colors.cleared-foreground}"
    rounded: "{rounded.sm}"
  separator:
    backgroundColor: "{colors.border}"
  focus-ring:
    backgroundColor: "{colors.ring}"
---

## Overview

The system is called **Checklist**. The product is a template that has already done the tedious setup, so the UI borrows the vernacular of its name: a pilot's preflight card, where every line reads _item ........ response_ and is either cleared or not.

- **One device, used with discipline.** The checklist row (`Checklist` / `ChecklistItem` in `src/components/custom/checklist.tsx`) is the only memorable element. It appears where the app reports state, and only there: the landing page's "Preflight checklist", the dashboard summary (session, email, note count), settings rows (email status, linked providers, last password change), the uploaded file's key, and the error and 404 pages.
- **Restraint everywhere else.** Hairlines and whitespace separate sections, not cards or shadows. One accent colour, used for "done". One motion, the hero fade-in.
- **Audience:** developers evaluating a foundation. The landing page's job is to show what is already wired and get them to `git clone` → `bun dev`; the app pages show the wiring working.

## Colors

Cool, near-neutral greys with a faint blue bias (hue ~264), so they read as chosen rather than default. Light is the default theme; dark mirrors it rather than inverting it.

- **Background (oklch(0.988 …)) / Foreground (oklch(0.23 …)):** paper and ink. Headings, body emphasis and primary buttons are ink.
- **Card (white):** inputs and outline buttons sit slightly above the page.
- **Muted (oklch(0.967 …)):** the quickstart well, hover fills and skeletons.
- **Muted-foreground (oklch(0.495 …)):** descriptions, checklist responses, table headers, captions.
- **Border (oklch(0.922 …)):** hairlines between sections and rows.
- **Input (oklch(0.845 …)):** control outlines and the dotted checklist leader. It is a step darker than `border`, because a control has to read as a control.
- **Cleared (oklch(0.482 0.071 170)):** a deep green and the only chromatic accent. It means "done" (checklist ticks, the verified/active/linked status dot, met password requirements) and it is the focus ring (`ring`). Its one brand use is the wordmark's tick. Never use it for links, primary actions, or other decoration. The login page's "Last sign-in used …" dot is muted, not green, because nothing there is done.
- **Destructive (oklch(0.52 0.161 29)):** errors, the "not verified" dot, the error/404 status dot, and destructive actions. Destructive buttons are outlined (`variant="destructive"`); only the final, irreversible confirmation ("Yes, delete my account") is filled (`variant="destructive-solid"`, text in `destructive-foreground`).

Dark: background oklch(0.204 0.007 258), foreground oklch(0.931 0.004 271), card/muted oklch(0.238 0.009 256), muted-foreground oklch(0.714 0.014 262), border oklch(0.289 0.012 264), input oklch(0.363 0.015 264), cleared and ring oklch(0.753 0.077 168), destructive oklch(0.721 0.123 27).

## Typography

Two faces, both self-hosted through Fontsource.

- **Instrument Sans Variable** (`@fontsource-variable/instrument-sans/standard.css`, which carries the weight _and_ width axes) is the only text face. Headings are set slightly condensed with `font-stretch-semi-condensed` (87.5%), weight 500 and `tracking-tight`. That narrowing is the typographic signature; body text stays at full width.
  - Display: the landing "Start from done." at `text-5xl md:text-6xl`, `md:leading-display` (1.04).
  - Page title (`Page`'s `h1`, auth headings): `text-3xl md:text-4xl` (auth pages stay at `text-3xl`).
  - Section titles (`h2`): `text-base` in `PageSection` (the common case), `text-lg`–`text-xl` on the landing page; weight 600, full width.
  - Body: 16px, with `text-lg` for the landing lede and `text-sm` for descriptions and tables.
- **IBM Plex Mono** (400 and 500) appears only for literal code: the quickstart commands, the directory tree, `src/features`, object keys, and the one-time code field (`Input variant="otp"`), whose digits are a code. It is never used for labels, eyebrows or ordinary numbers.
- No uppercase tracked labels anywhere. Eyebrows (`Page`'s `eyebrow`) are plain `text-sm text-muted-foreground`, in sentence case.
- Numbers that change or line up use `tabular-nums`: the dashboard note count and dates, the settings "Last changed" and passkey "Added" dates, the landing "9 of 9 checked".

## Layout

- **Outer measure:** `max-w-6xl` (72rem) for the header, landing and app pages; `Page width="sm"` (24rem) for the auth forms; `width="md"` for the error page. Side gutters are `px-4` on phones and `sm:px-8` above.
- **Landing:** an 11-column grid at `lg`. The hero copy takes 5 columns and the Preflight checklist 6; "What's inside" repeats the same split below a hairline. It stacks to one column below `lg`.
- **App pages:** a `Page` header (eyebrow, title, one-line description), then `PageSection` bands (`src/components/custom/page-section.tsx`): a hairline on top, the section title and a one-line note in a narrow rail on the left (1 of 4 columns at `md`), the content on the right. The dashboard puts its status `Checklist` between the header and the first section.
- **Spacing:** 4 / 8 / 16 / 40 / 64 / 112. Sections breathe (`py-10` for `PageSection`, `py-16 md:py-24 lg:py-28` for the hero).
- **Header:** sticky, `h-14`, `border-b`. The wordmark is a green tick (`SquareCheck`) and the word "preflight" in text. Right side: "Sign in" (signed out) or "Dashboard" / "Settings" (signed in, the current one in ink), then GitHub (hidden on phones), the theme toggle and sign out.

## Elevation & Depth

Flat. No shadows on page content, no gradients, no glass. Hierarchy comes from the type scale, ink versus muted, and hairlines. The only raised surfaces are transient overlays from upstream shadcn: the dialog (a ring over a blurred scrim) and Sonner toasts.

## Shapes

`--radius: 0.5rem`. Controls (buttons, inputs) are `rounded-md` (6px), and the quickstart well and upload panel are `rounded-md` too. Those two are the only boxed areas on a page: one holds code to copy, the other a control target. Checklist ticks are `rounded-sm`, status dots are circles, and dialogs are `rounded-xl`. Sections have no radius at all, because they are separated by rules rather than boxed.

## Components

- **Checklist / ChecklistItem** (`#/components/custom/checklist`): `label`, a flexible dotted leader (`border-b-2 border-dotted border-input`), `value` in muted text. Props:
  - `mark="tick"` draws a filled green box before the label (an item that is done; the landing checklist).
  - `mark="cleared" | "pending" | "fault"` draws a status dot before the value (green / grey / red).
  - `stackOnMobile` drops the leader and wraps the value under the label below `sm`, for long responses.
  - `Checklist ruled` adds a hairline between rows; `Checklist bordered` adds one above the first and below the last, for a list that stands alone (the dashboard summary, the error page).
  - Labels do not wrap or shrink, so keep them to short fixed words ("Email", "Uploaded"). Put anything user-supplied or long, such as a file name, an address or an object key, in `value`, which wraps.
- **PageSection** (`#/components/custom/page-section`): titled band with a left rail; use it for every group on an app page.
- **Page** (`#/components/custom/page`): the page shell; `eyebrow` is a plain muted line, not a mono label.
- **Buttons** (`src/components/ui/button.tsx`):
  - `default` is solid ink, `h-10 px-4`.
  - `outline` is a white card with an `input` border that darkens on hover (no shadow).
  - `ghost` is for icon actions; the note and passkey delete buttons are ghost icons, not red.
  - `destructive` is a red outline that fills faintly on hover; `destructive-solid` is filled, for the final confirmation only.
  - `nav` (with `size="nav"`) is the header links: muted until the link is the current page (`data-status="active"`), with `px-2` on phones and `px-3` above.
  - `sm` is `h-8`, `lg` is `h-11`.
- **Links:** standalone inline links ("View on GitHub") are ink with an `input`-coloured underline that darkens on hover (`underline decoration-input underline-offset-4 hover:decoration-foreground`). Links inside a `FieldDescription` (Sign up, Forgot your password?, Go back) keep that primitive's own treatment: muted text with a current-colour underline. Link-shaped buttons are plain `<a>`/`<Link>` elements styled with `buttonVariants(...)`, never `Button render={<a>}`, which drops native link semantics and makes Base UI warn. `buttonVariants` resolves class conflicts itself (it runs `cn` over the `cva` output), so a `className` passed to it merges correctly.
- **Inputs:** `h-10`, `bg-card`, `border-input`, focus ring in `ring` (cleared green). `PasswordInput`'s `InputGroup` matches. The OTP field is `variant="otp"`: `h-12`, mono, centred, tracked.
- **Password requirements:** a list of small tick boxes that fill green as each rule is met. It keeps the accessible `aria-label` "<rule>: met | not met".
- **Tables:** muted `text-xs` headers, hairline rows, no outer padding on the first and last columns. Dates are muted and tabular.
- **Quickstart:** caption row ("Quickstart" plus a ghost copy button), then a `bg-muted` well with mono commands and muted `$` prompts.
- **Error / 404:** title, a bordered checklist row (`Status ........ ● 404`, or `Error`), the message below it in muted text (whitespace kept, scrolls past 12rem), then "Try again" / "Back to home".
- **Upload:** a bordered panel with a status line (`<output>`, so "Uploading…" is announced) and "Choose file". A success adds an `Uploaded ........ ● <file name> <object key>` row.
- **Theme toggle:** a single ghost icon button that switches to the other theme.

## Do's and Don'ts

- Do use the checklist row for state the user cares about. Don't use it as generic key/value decoration, and don't add dot leaders anywhere else.
- Do keep `cleared` for "done" and focus. Don't add a second accent hue, or colour links and primary buttons green.
- Do keep mono for literal code and paths. Don't bring back uppercase tracked mono labels or eyebrows.
- Do separate groups with hairlines and the `PageSection` rail. Don't wrap sections in cards or add shadows.
- Do use 01/02/03 numerals only where order is information. The template has none today.
- Do keep motion to the hero fade-in and state transitions (ticks, hovers). Don't add staggered or scroll-triggered animation.
- Do respect `prefers-reduced-motion` (handled globally in `src/globals.css`) and keep focus rings visible.
- Do check phone width (375px) with a signed-in header: every item there costs room.

## Lint rules

`@shadcn/lint` enforces this system through six Oxlint rules. Each rule reports the approved fix, and `settings.shadcn.note` in `.oxlintrc.json` appends a pointer back to this file.

| Rule                            | Enforces                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `shadcn/no-restyle`             | Components own their appearance; call sites pass only `layout` classes. The `Skeleton` contract also allows `rounded-full`. |
| `shadcn/no-raw-colors`          | Theme tokens instead of raw palette classes such as `bg-pink-500`.                                                          |
| `shadcn/no-arbitrary-values`    | The theme scale instead of one-off values such as `p-[13px]`; `layout` values are exempt.                                   |
| `shadcn/no-inline-styles`       | No `style={}` props or `<style>` elements; styling stays in Tailwind classes.                                               |
| `shadcn/no-unknown-classes`     | Only classes the project's Tailwind setup can generate.                                                                     |
| `shadcn/require-static-classes` | Class strings the linter can read; no `` `bg-${color}` ``.                                                                  |

Approved exceptions live in the `overrides` array of `.oxlintrc.json`. `src/components/ui/**` has its own block because those files are upstream shadcn components this design system does not own, and `src/features/emails/**` turns off `no-inline-styles` because email clients need them. Individual upstream components allowlist or disable `no-unknown-classes` and `no-inline-styles` where their internals defeat static analysis.
