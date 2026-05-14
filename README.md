# Claude Playwright Sandbox

An AI-driven test automation framework that pairs **Playwright + TypeScript** with **Claude Code** as an autonomous engineering collaborator.

---

## Project Overview

This repository is a modern automation infrastructure targeting [The Internet HerokuApp](https://the-internet.herokuapp.com/login) — a well-known sandbox for practicing UI and API automation against realistic web scenarios (login flows, dynamic content, basic auth, alerts, frames, file uploads, and more).

It demonstrates how an AI coding agent (Claude Code) can author, maintain, and extend a production-grade end-to-end suite alongside a human engineer, while keeping the codebase clean, typed, and resilient.

Use it as:

- A reference framework for Playwright + TypeScript with a scalable Page Object Model.
- A playground for **AI-driven test development**: ask Claude Code to add Page Objects, generate specs, debug failures, or refactor — and review the diff like any teammate's PR.

---

## Tech Stack

| Layer            | Tool                                                              |
| ---------------- | ----------------------------------------------------------------- |
| Test runner      | [Playwright Test](https://playwright.dev/) (`@playwright/test`)   |
| Language         | TypeScript (strict mode, `@types/node`)                           |
| Browser          | Google Chrome (stable channel)                                    |
| Reporting        | Playwright HTML report + **Allure Report**                        |
| AI agent         | [Claude Code](https://claude.com/claude-code) by Anthropic        |
| CI               | GitHub Actions (`.github/workflows/playwright.yml`)               |

---

## Architecture

The framework follows a classic **Page Object Model (POM)** with an inheritance-based design that scales as the suite grows. UI tests live under `tests/`, and pure API tests are isolated under `tests/api/` and use Playwright's `request` fixture (no browser is launched for those).

```text
.
├── pages/
│   ├── BasePage.ts          # Shared navigation/wait helpers; every page extends this
│   └── LoginPage.ts         # Locators + actions for /login
├── tests/
│   ├── auth.spec.ts         # UI spec: login flow via the LoginPage object
│   └── api/
│       └── basic-auth.spec.ts  # API spec: HTTP Basic Auth via request fixture
├── playwright.config.ts     # Single Google Chrome project, Allure reporter, slowMo locally
├── tsconfig.json            # Strict TypeScript
└── .github/workflows/
    └── playwright.yml       # CI: install Chrome, run tests, generate Allure report
```

Design principles:

- **`BasePage` holds cross-cutting concerns** — navigation, waits, URL/title helpers — so every concrete Page Object inherits them for free.
- **Locators live in Page Objects, never in specs.** Specs describe *user intent* (`loginPage.login(user, pass)`), not DOM details.
- **Resilient locators by default** — prefer `getByRole`, `getByLabel`, and accessible names over CSS/XPath, so the suite is robust against markup churn.
- **Strict TypeScript** — `readonly` fields, explicit return types, no implicit `any`. Refactors are caught by the compiler, not by flaky tests.
- **Single browser target** — the suite runs on the **Google Chrome stable channel** (not bundled Chromium), matching what most end users actually use.
- **Observable local runs** — locally, tests run headed with `slowMo` and character-by-character typing so you can see exactly what is happening; CI stays headless and fast.

---

## Getting Started

### Prerequisites

- Node.js LTS (≥ 18)
- npm
- Java 17+ (only required to render the Allure HTML report locally)

### Install

```bash
# Install JS dependencies (Playwright, Allure, types)
npm install

# Install the Google Chrome browser used by Playwright
npx playwright install chrome
```

That's it — you're ready to run the suite.

---

## AI Development Workflow

This project is designed to be co-developed with **Claude Code**, Anthropic's CLI coding agent. Claude Code runs locally, reads the repo, edits files, runs the test suite, and iterates until the work is done.

### Launch Claude Code

```bash
npx @anthropic-ai/claude-code
```

That drops you into an interactive session in the current directory. Claude has access to your files, your shell, and the Playwright test runner.

### Example AI-driven tasks

Below are prompts that work well against this codebase. Paste them straight into Claude Code.

#### Add a new Page Object + spec

> Create a `pages/CheckboxesPage.ts` for `https://the-internet.herokuapp.com/checkboxes`, following the same POM pattern as `LoginPage.ts`. Then add `tests/checkboxes.spec.ts` that toggles both checkboxes and asserts their final state. Run it and confirm green.

#### Fix a failing test

> Run `npm test` and investigate any failures. Identify the root cause, fix the test or the Page Object as appropriate, and re-run until the suite passes. Summarize what you changed and why.

#### Refactor for resilience

> Audit every locator in `pages/` for resilience. Replace any CSS or XPath selectors with `getByRole` / `getByLabel` / `getByText` where the page exposes accessible names. Run the suite after each file to make sure nothing regresses.

#### Extend coverage from a real page

> Visit `https://the-internet.herokuapp.com/` and pick three pages we don't yet cover. For each, propose a Page Object + spec, ask me to confirm, then implement them. Use strict TypeScript and the existing POM conventions.

#### Add a new API test

> Add an API-level test in `tests/api/` for the `/status_codes` endpoint on the-internet.herokuapp.com. Cover the 200, 301, 404, and 500 variants using Playwright's `request` fixture. No browser launch.

#### Debug a flaky test

> Run `tests/auth.spec.ts` 20 times in a row and report any failures with traces. If anything flakes, propose and apply a fix that removes the root cause (not a `waitForTimeout`).

### Tips for working with Claude Code on this repo

- Let Claude run the test suite itself after each change — it will iterate until tests pass.
- Review the diff before committing, like any PR. Claude is fast, but you own the code.
- Keep Page Objects small and focused — one page, one class.

---

## Running Tests

```bash
# Run every spec (UI + API) on Google Chrome
npm test

# Open the interactive UI mode — best for development and debugging
npm run test:ui

# Run headed explicitly (default locally, but useful as a one-liner)
npm run test:headed

# Run only the API-level specs (no browser)
npm run test:api

# Open the last Playwright HTML report
npm run report
```

### Behavior of `npm test`

- **Locally:** runs **headed** on Google Chrome with a `slowMo` delay and character-by-character typing inside the LoginPage, so you can watch the username and password being entered before the click.
- **On CI:** runs **headless** with no slow motion, retries twice on failure, and serializes to a single worker for deterministic ordering.

The mode switches automatically based on the `CI` environment variable (see `playwright.config.ts`).

---

## Allure Reporting

Every test run writes raw Allure results to `./allure-results/`. To render them as a browsable HTML report:

```bash
# Generate the static HTML report from the latest results
npm run allure:generate

# Open the generated report in your browser
npm run allure:open

# Or do both in one shot with a live server
npm run allure:serve
```

> Note: `allure generate` / `allure open` / `allure serve` require **Java 17+** on your `PATH`. The reporter itself (`allure-playwright`) does not — it only writes JSON results.

In CI, the workflow installs Java automatically, generates the report after every run, and uploads three artifacts you can download from the workflow summary:

- `playwright-report` — the standard Playwright HTML report
- `allure-results` — the raw Allure JSON results
- `allure-report` — the rendered Allure HTML report (ready to open)

---

## Continuous Integration

The GitHub Actions workflow at `.github/workflows/playwright.yml` runs on every push and pull request to `main` / `master`. It:

1. Checks out the repo
2. Sets up Node.js LTS and Java 17 (Temurin)
3. Installs npm dependencies (`npm ci`)
4. Installs the Google Chrome channel for Playwright (`npx playwright install --with-deps chrome`)
5. Runs the full Playwright suite (`npx playwright test`)
6. Generates the Allure HTML report from the raw results
7. Uploads the Playwright report, the raw Allure results, and the rendered Allure report as build artifacts (30-day retention)
