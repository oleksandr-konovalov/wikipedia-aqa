# Wikipedia — interface language E2E test

An authorized user changes the interface language in Wikipedia preferences, and the whole application
starts speaking that language. This repo automates that scenario with Playwright and TypeScript, following
the Page Object Model layering used in Studytube's `autotests`: components → pages → app → fixtures → specs.

## Quick start

```bash
npm install
npm run pw:browsers:install
cp .env.example .env   # then put your Wikipedia login and password in it
npm run pw:test
```

The run takes about 25 seconds. The report lands in `playwright-report/`; open it with `npm run pw:report`.

## The test case

**WIKI-1 — Authorized user changes the interface language of the application**

**Given** a Wikipedia account whose interface language is English,
**when** the user opens Preferences → User profile → Internationalisation and picks another language,
**then** the interface is displayed in that language.

Preconditions: the credentials are in `.env`, the user is signed in to `en.wikipedia.org`, and the current
interface language is English.

Test data: the target language is drawn at random on every run from `uk, de, fr, es, pl, it, nl`. The
language that is currently selected is always excluded, so the test really switches something.

Steps:

1. **Open `Special:Preferences`.** The page opens with the title "Preferences" and `<html lang="en">`.
2. **Open the "User profile" tab.** The tab is selected.
3. **Scroll to "Internationalisation".** The section shows the "Language" field.
4. **Type the name of the random language and pick the suggestion** (for example `uk · українська`).
   The field submits the chosen language code.
5. **Press "Save".** Wikipedia shows the "preferences have been saved" notification.
6. **Look at Preferences again.** Everything is in the new language: `<html lang="uk">`, the title reads
   "Налаштування", and the language field keeps the chosen value.
7. **Open the "Ukraine" article.** The article itself is still the English one, but the interface around it
   follows the new language: `<html lang="uk">`.
8. **Follow the interlanguage link of the chosen language.** The article opens on `uk.wikipedia.org` and its
   title is in that language: "Україна" (`Ucrania` in Spanish, `Oekraïne` in Dutch, and so on).

Afterwards the test sets the account back to English in `afterEach`, so it can be re-run any number of times.

Every localized string in the assertions comes from Wikipedia itself — the MediaWiki `allmessages` API and
the interlanguage links of the "Ukraine" article — rather than from a dictionary or a guess.

## How the project is laid out

```
playwright.config.ts              projects, reporter, timeouts
playwright/
├── app/
│   ├── abstractClass.ts          PageHolder / Component / AppPage
│   ├── index.ts                  WikipediaApp — the single entry point to every page
│   ├── component/                button, lookup, notification
│   └── pages/                    preferences, article
├── e2e/
│   ├── auth/auth.setup.ts        signs in once, stores the session in playwright/.auth
│   └── preferences/              the spec
├── fixtures/
│   ├── constants/                timeouts, selectors, article name
│   └── fixtures/                 app instance and the language-restore fixture
├── helpers/                      env() accessor, URL builder, random language picker
├── types/                        enums and shared types
└── utils/logStep.ts              @logStep — every page action becomes a step in the report
```

A page object declares `pagePath` only when it has a fixed URL. The article page does not: it is opened by
name, `article.openByName('Ukraine')`.

## Running in Docker

```bash
npm run docker:test    # docker compose up --build --abort-on-container-exit --exit-code-from tests
npm run docker:clean   # remove the image, containers and volumes
```

The image is built on `mcr.microsoft.com/playwright:v1.61.1-noble`, so browsers and system libraries are
already there. Credentials are passed at run time through `env_file: .env` and never end up in the image.

## Where the report is

`playwright-report/` and `test-results/` are bind-mounted in `docker-compose.yml`:

```yaml
volumes:
  - ./playwright-report:/app/playwright-report
  - ./test-results:/app/test-results
```

So when the container exits, the standard Playwright HTML report is already on your machine at
`playwright-report/index.html` — open it directly or run `npm run pw:report`. Traces and screenshots of
failed attempts are in `test-results/`.

## Other commands

| Command               | What it does                 |
| --------------------- | ---------------------------- |
| `npm run pw:ui`       | Playwright UI mode           |
| `npm run pw:debug`    | Inspector / step-by-step run |
| `npm run pw:report`   | Open the last HTML report    |
| `npm run pw:ts:build` | Type-check the project       |
| `npm run lint`        | ESLint                       |

## Notes on two things that are not obvious

**Signing in.** Wikipedia protects its login form with hCaptcha, which rejects automated browsers, so
`auth.setup.ts` signs in through the MediaWiki `action=clientlogin` API — the same flow the form itself
uses — and saves the resulting session for the specs. A bot password (`Special:BotPasswords`) is not an
option: that session is accepted by the API only, and `Special:Preferences` still renders the login page
for it. `clientlogin` returns a regular web session and works headless, in Docker and in CI.

**The language field is not a `<select>`.** MediaWiki renders it as a Codex lookup: a combobox you type
into, with a hidden native select carrying the value. The `Lookup` component drives the visible input and
reads the value from the hidden select.

## Secrets

Credentials live only in `.env`, which is listed in both `.gitignore` and `.dockerignore`. The code reads
them through `process.env` in the `env()` helper, which fails immediately with a clear message when a
variable is missing. `.env.example` documents the variables without any real values, and the stored session
in `playwright/.auth/` is git-ignored as well.
