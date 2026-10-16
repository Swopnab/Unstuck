# Unstuck — Devpost submission kit

## Project name
Unstuck

## Elevator pitch
When your study plan breaks, Unstuck helps you find your next doable step—then gives you a calm space to focus, recover, and see your effort grow.

## Inspiration
An assignment can feel hardest just before you start it, especially after a plan has slipped. A calendar full of overdue tasks can make the next decision feel bigger than it needs to be. Unstuck explores a gentler interaction: one clear step that fits the time and energy you have now.

This is a design hypothesis, not a claim established by student interviews or a user study. The prototype is ready for testing with students.

## What it does
Unstuck lets students add an assignment, its deadline, and ordered steps with time estimates, energy requirements, and optional work. The Today page asks how much time the student has and how their energy feels, then suggests the first unfinished step from an assignment with a suitable energy level and a near deadline. If that step takes longer than the available time, the app suggests a manageable focus chunk and explains why it chose it.

A focus timer can be paused, resumed, and saved. Only elapsed whole minutes are recorded. A recovery flow previews the effect of shortening or skipping optional steps before saving, without changing the assignment deadline. It clearly states that the capacity estimate applies to one assignment and shows remaining work across the full plan.

The Progress page turns saved study minutes into an interactive skyline or flat heat map. Students can explore days with the keyboard, switch views, and rotate the skyline. It uses recorded timer sessions, manually entered study time, or imported CSV history. The initial example assignments are labeled, and the chart starts with zero activity.

An original ambient soundtrack starts when the student enters the workspace through a welcome-page button. Playback, volume down/up, and a volume slider are available in the header. Each click on Launch balloons creates a separate celebration.

## How it was built
The frontend uses React, TypeScript, Vite, Tailwind CSS, Lucide icons, and a shadcn-compatible UI folder. The supplied curved image hero and contribution skyline were integrated into the welcome and progress screens. The scroll reveal comes from Aceternity’s public registry. A local React adapter uses the public balloons-js library because the requested 21st.dev wrapper requires authentication. The music is an original synthesized ambient composition.

Assignment and session data stay in the current browser’s local storage. The project includes JSON backup/restore and CSV study-history import/export. It does not require an account, a paid API, or a backend. Codex assisted with implementation, integration, and verification. Source dependencies and borrowed components are attributed in the project.

## Design choices
- One suggested next step reduces the number of decisions on the Today screen.
- Time and energy controls make the suggestion responsive to the student’s current situation.
- Recovery changes optional workload explicitly, with a preview and an unchanged deadline.
- Cream, sage, and warm clay colors, readable serif headings, and simple layouts create a quiet workspace.
- Labeled forms, native dialogs, keyboard chart exploration, motion controls, and reduced-motion alternatives support different interaction needs.
- Clear example labels and an initially empty activity chart separate demonstrations from recorded history.

## Challenges
The main challenges were keeping estimates consistent when a step is partially completed, preserving timer accuracy in background tabs, avoiding misleading totals when optional work is skipped, and integrating decorative animation without crowding the study workspace. The 21st.dev install links required authentication, so the public upstream sources were used for the requested scroll and balloon effects.

## Accomplishments
The result is a working frontend with a complete assignment-to-focus-to-progress flow, a recovery preview, persistent browser data, and portable backups. The visual components are connected to actual saved records rather than a generated activity year.

## What was learned
A small product can benefit from explaining its suggestion and making revisions visible before committing them. Decorative motion works best when it introduces the product or celebrates a chosen action, while planning remains calm and readable.

## What’s next
Test the main flows with students, including keyboard and screen-reader users. Explore whether the suggested step is useful, whether recovery language is clear, and whether users understand the difference between estimated remaining work and recorded study time. Future options could include opt-in calendar integration and cross-device storage.

## Built with
React, TypeScript, Vite, Tailwind CSS, Lucide, Motion, balloons-js, localStorage, Codex.

## 90-second demonstration script

0:00–0:15 — Show the welcome page’s curved photo band and scroll reveal. “When a study plan slips, the hardest part can be choosing how to restart. Unstuck helps you find one doable step.”

0:15–0:35 — Open the workspace. Change available time and energy, expand Why this step, and show the explanation. “The suggestion uses your ordered steps, deadline, time, and energy. Longer work becomes a small focus chunk.”

0:35–0:50 — Show My plan and add or edit an assignment. Start a focus timer, pause it, and show the music controls. “Your assignment becomes a sequence you can actually start. There’s also an optional ambient soundtrack.”

0:50–1:10 — Open recovery, choose optional work to shorten, and show the before/after preview. “When plans change, you can reduce optional work deliberately. Your actual deadline stays fixed.”

1:10–1:25 — Show Progress using clearly identified demonstration records or actual recorded sessions. Toggle between the heat map and skyline. “The chart reflects saved study minutes. There’s no invented year of activity.”

1:25–1:30 — Show backup/export and return to Today. “A calmer workspace, one step at a time.”

