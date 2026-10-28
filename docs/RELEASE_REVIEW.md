# Unstuck — readable planner and safe local storage

Status: local review. The public build is prepared but not deployed before final approval. No real student participants or private records were used.

## Product changes

- Keep existing assignments, ordered steps, energy/time choices, recovery previews, timers, study history, music, exports and imports. No AI service, account system, or new backend was added.
- “Why this step?” now names the deadline, selected time/energy, remaining estimate, required energy, and task order. Selection still uses the existing deterministic rule: first unfinished step, energy-compatible candidates where available, earliest deadline, then time fit/remaining duration. It does not infer mental health or promise academic outcomes.
- Calendar download produces RFC 5545 `.ics` assignment-deadline events. IDs remain stable, end dates are exclusive, text is escaped, and UTF-8 lines are folded safely. These are all-day deadlines, not booked study sessions or live calendar sync. Import into your calendar yourself.
- A Web Locks critical section compares the stored snapshot with the tab’s known snapshot before saving. A changed snapshot or storage event blocks further writes and offers “Export this tab” and “Use latest saved workspace”. There is no silent merge or last-writer-wins overwrite between cooperating current-version tabs.
- A restore must save the previous persisted workspace under a separate pre-restore key before replacing it. If saving the backup or new snapshot fails, the old workspace remains. “Your data” can download that recovery copy. Keep independent downloaded backups too; the browser copy is replaced on the next restore and clearing site storage removes both.
- Save-pending and failed-save states stay visible. Edits remain exportable in memory after a quota failure. Web Locks-unavailable browsers do not silently fall back to unsafe writes: changes stay in the tab with an export warning. Use a current browser on localhost or HTTPS for saving.
- `?demo=1#workspace` opens an account-free fictional demo in a separate workspace/timer namespace. It never loads the normal workspace key. Example assignments are labeled; no study history is invented. You can enter your own data locally, but demo exports should be treated as private if you do so.
- Larger body/form/navigation text, focus outlines, a quieter initial welcome animation, reduced-motion support, and a clearer mobile layout. Existing original UI identity is retained.

## Run and architecture

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview -- --port 5193
```

Open `http://127.0.0.1:5193/?demo=1#workspace` for the demo review. There is no login/account gate in the application. Hosting this static build publicly still requires the user’s final deployment approval.

React/TypeScript renders the existing planner. `src/model.ts` owns planning/validation; `src/useWorkspace.ts` owns storage coordination; `src/calendar.ts` owns calendar serialization. Existing localStorage IDs and version-1 backup formats remain readable; no database migration is required. Normal workspace/timer keys retain their established names. Only demo keys and the pre-restore backup key are added.

Normal data key: `unstuck.workspace.v1`; demo data key: `unstuck.workspace.v1.demo`. A pre-restore copy is `<workspace key>.before-restore`. Timer progress remains in sessionStorage, with separate demo/normal keys. A timer measures elapsed time, not background CPU work. Only elapsed whole minutes are saved, associated with their assignment ID. A reload restores the timer in the same tab.

## Verification and limits

`npm test` runs model and calendar cases, including task order/energy, optional-only recovery, fixed deadlines, DST/leap dates, recorded activity, invalid/duplicate-ID backups, date validation, calendar injection escaping, and Unicode folding. `npm run build` checks TypeScript and creates the static bundle. GitHub Actions runs these and uploads a review build; it does not deploy.

Browser checks use fictional records and cover assignment creation → saved localStorage → reload; rationale display; calendar download; recovery preserving deadlines/required steps; timer reload → recorded study session with assignment ID; conflicting tabs; failed saves; pre-restore recovery copy; responsive layouts and keyboard dialogs. Browser task timings are synthetic automation, not student usability results. See `tests/browser.cjs`, screenshot evidence, and `docs/USABILITY_PLAN.md`.

Limits: no cloud sync, no remote backups, no live calendar connection, no real usability study yet. Web Locks coordinate current-version tabs that follow this protocol; another old client or extension writing the same key can still interfere. Switching versions or restoring site backups should be done with other tabs closed. Browser data can be cleared by privacy settings, storage eviction, or user action. A downloaded backup is the durable recovery path. Public hosting will use a different origin from local development, so it cannot automatically read a localhost workspace; export/import is explicit.

## Interview explanation

“I kept the planner deterministic so I can explain every recommendation. I separated storage coordination from the view, used Web Locks plus snapshot comparison to detect conflicts, and saved the previous persisted state before restoration. I tested quota failures and two tabs, rather than only a successful save. Calendar integration starts with a portable, escaped file rather than an account-dependent service.”

## Checks run for this review

13 model/calendar checks and 7 standalone browser scenarios passed. TypeScript and production build passed. The welcome, working planner, screenshot images, and music asset were additionally checked under an `/Unstuck/` deployment subpath. Representative text contrast measurements identified two low-contrast planner labels; their colors were darkened. This is targeted accessibility verification, not a full accessibility certification or a real-student study.
