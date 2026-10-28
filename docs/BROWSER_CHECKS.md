# Repeatable browser checks

These tests use Playwright 1.63.0 / Chromium with fictional local data. They are not real-user studies or hosted production tests. Screenshots are written to `tests/screenshots/` (ignored). Set `REVIEW_OUTPUT` to another folder if desired.

Use a separate tooling folder to avoid adding production dependencies:

```sh
npm install --prefix /tmp/project-browser-tools playwright@1.63.0
/tmp/project-browser-tools/node_modules/.bin/playwright install chromium
PLAYWRIGHT_PATH=/tmp/project-browser-tools/node_modules/playwright node tests/browser.cjs
```

On Linux CI the browser install also uses `--with-deps`. Existing GitHub workflows prepare the browser and a local fixture server. New GitHub checks have not run remotely until a push is approved.

Build the app and start `npm run preview -- --port 5193`. Tests use only `?demo=1#workspace` in fresh browser contexts, keeping normal workspace keys untouched. They include an emulated clock to exercise timer elapsed-time behavior and reload, plus quota failures, two tabs and backup restoration. Visual cases use separate contexts to avoid leaking emulated time or focus between tests.

See `docs/RELEASE_REVIEW.md` for architecture and limitations. Hardware/device checks beyond Chromium viewport emulation remain manual follow-up work.
