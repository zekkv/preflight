# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Design system**: Replaced the monochrome "Typeset" look with "Checklist" (see `docs/DESIGN.md`). It uses a cool near-neutral palette with one accent (`--cleared`, a deep green that means "done" and marks focus), Instrument Sans with semi-condensed headings, and IBM Plex Mono for code only. A preflight-card checklist row (item, dotted leader, response) now reports state on the landing page, dashboard, settings and error pages.
- **Layout**: App pages use a left-rail `PageSection` band; the landing page splits the hero and a "Preflight checklist" side by side. The header shows a wordmark, "Sign in" when signed out, and Dashboard / Settings links when signed in.
- **Primitives**: Buttons and inputs are `h-10` on a white card surface with no shadow. Destructive buttons are outlined. Table headers are muted and smaller.

### Removed

- The TanStack logo images in `public/brand/` (the header uses a text wordmark) and the Schibsted Grotesk and JetBrains Mono font packages.

## [1.0.0] - 2026-05-01

### Added

- **Base Stack**: Production-grade integration of TanStack Start, Nitro, Drizzle ORM, and Better Auth.
- **Authentication**: Email OTP sign-in/sign-up, passkey support, and optional Google OAuth. Rate limited at 20 requests per 60 seconds via Better Auth's built-in rate limiting.
- **Protected routes**: `/dashboard` and `/settings` require a valid session. Auth routes (`/login`, `/signup`) redirect signed-in users away automatically.
- **Notes CRUD**: List, create, and delete notes from the dashboard. Notes are scoped to the signed-in user via a `userId` foreign key. Dashboard table powered by `@tanstack/react-table`.
- **Account settings**: `/settings` route — profile, linked providers, registered passkeys, and delete account.
- **File uploads**: Presigned PUT upload flow via `POST /api/upload-url`. Works with MinIO (local), AWS S3, Cloudflare R2, or Supabase Storage — swap backends via `MINIO_ENDPOINT`.
- **Email**: Transactional email with Resend and React Email. OTP and verification templates included. Sender address configurable via `EMAIL_FROM`.
- **Design System**: Hyper-minimalist dark-first aesthetic with a shadcn-based component library.
- **Observability**: LogTape structured logging with a Sentry sink and SSR instrumentation.
- **Architecture**: Feature-based structure (`src/features`) with clear server-function data boundaries.
- **CI and Tooling**: GitHub Actions pipeline — `lint:check`, `type:check`, `format:check`, unit tests, E2E tests, and build. Bun pinned to `1.3.14` with dependency caching across all jobs.
- **Testing**: Playwright E2E and Vitest unit test suites. Tests cover auth route guards, notes model, mailer guard, storage validation, and email send guard.
- **Documentation**: `README.md`, `ARCHITECTURE.md`, `DESIGN.md`, `AGENTS.md`, and `CONTRIBUTING.md`.

### Security

- `sendDefaultPii: false` in Sentry — PII is not forwarded by default.
- `tracesSampleRate: 0.1` — conservative server trace sampling to control cost.
- `/sentry-example` and `/api/sentry-example` return 404 in production builds.
- `POST /api/send-email` requires an authenticated session or a valid `x-email-secret` header matching `EMAIL_API_SECRET`.
- Google OAuth and Resend are optional — the app boots and authenticates without either configured.
