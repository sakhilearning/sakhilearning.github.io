# Curriculum upgrade: 4.10.0 → 4.11.0

## Existing repository inspected

Base: `sakhilearning/sakhilearning.github.io`, commit `b4ba53e97d311f6eb93a7f2b2002fb09904afb39`, branch `main`. The base package declared 4.10.0 while its README described 4.4.2. The base full `npm run qa` suite passed before changes.

The implementation extends the existing curriculum, activity generator, templates, planner, adaptive selection, app controller, and build. It retains all original 141 skill IDs, nine domains, original artwork, progress/mastery owner, Supabase sync, and Kokoro playback. It does not introduce a separate application or framework.

## Data provenance

`data/supplied-curriculum.json` contains 295 lesson rows recovered from the referenced conversation. `docs/curriculum-coverage.json` maps each occurrence to its canonical skill and inferred grade. Repeated titles such as Equivalent Fractions share evidence. Original spellings remain in `source_aliases`, including “Multilpes” and “Multipling”. Higher-grade topics remain in the catalog, including fraction division, decimals, exponents, integers, factors/multiples, algebra, percentages, probability, angles, circle measures, surface area, and volume.

The original files and five screenshots could not be retrieved. No claim is made to have analyzed those missing attachments. Grade assignments use the sequence of pasted curriculum blocks (K through Grade 6), not a verified standards alignment. Some earlier stages include later skills because the user explicitly listed them there.

The original artwork is reused. No competitor screenshot was copied.

## Behavior

`SakhiCurriculum.skillsIn` supplies grade-eligible child skills. `allSkills` supplies the complete parent catalog. The selected grade is stored with existing learner settings. Earlier-grade prerequisites become placement assumptions for older children; they remain unassessed until evidence exists. Current-grade prerequisites still require readiness. Grade changes clear incompatible active plans while preserving earned evidence and rewards.

`SakhiPlan` continues after the former day-130 cap. Annual day/year labels derive from completed learning sessions; this is a learning-day sequence rather than a calendar attendance requirement. Six mission allocations plus four offscreen minutes and one celebration minute total exactly the chosen 20/25/30-minute budget. Actual activities may take less or more than the suggested allocation. The daily time gate independently caps visible learning time across sessions/reloads on this learner/device.

New imported math skills route through a pure seeded generator within `sakhi-activities.js`; original generators retain their owner and object identity. New diagrams are rendered by the canonical templates module. Existing question memory, teaching examples, hints, adaptive difficulty, spaced review, mastery policy, and rewards apply to the imported activities. A correct retry with support does not count as independent success.

The full curriculum table includes real evidence, overall/recent accuracy, prerequisite names, and review dates. Print resources show generated questions and a closed answer key; expanding the key is intentional parent behavior. The mini lesson shows the idea, example, solution, and transfer step. Parent export includes both catalog metadata and the existing progress snapshot.

## Audio contract

The existing app already bundled narration and warmed activities across its single-page views. This release preserves that behavior, predecodes desktop audio, and prevents the service worker from deleting the persistent voice cache on upgrade. iPad retains its tested HTML Audio byte-playback route and user-gesture requirement.

New generated math has a local “Look carefully” cue. It does not yet read the dynamic prompt, hints, or worked solution aloud. Its `audioSegments` deliberately describe the audio actually available, so offline iPad does not silently wait for missing clips or remote TTS. The interface and README disclose this limit. Completing full dynamic read-aloud is remaining work, not a passed requirement.

## Parent gate

A grown-up creates a 4–8 digit PIN on the first visit to Parents. Only a salt/hash are saved, locally. It is not an account credential and does not replace Supabase authentication. Five failed checks trigger a one-minute cooldown. Leaving Parents locks it; otherwise the unlock expires after five minutes. Forgotten PIN recovery requires clearing the local `sakhi.parent-pin.v1` entry through browser tools. Learning evidence is stored separately; do not clear all site data merely to reset the PIN.

The active-learning clock persists roughly every five seconds and when the page becomes hidden or closes. A reload can lose up to the most recent unsaved few seconds. It counts visible activity time, pauses hidden tabs, resets at local midnight, and allows parent-authorized five-minute extensions. It is not a hardened cross-device parental-control service.

## Validation

`test:grade-curriculum` checks every recovered row, canonical mappings, known routing regressions, grade eligibility in all nine domains, exact budgets across three years, mathematical oracles, a cycle-free prerequisite graph, generation validity, PIN hashing/verification/cooldown, time exhaustion, midnight reset, and hidden-tab pauses. The existing exhaustive generator, content, quality, mastery, navigation, account, audio, and deployment checks remain part of `npm run release`.

Browser smoke checking covers home, parent setup gate, child activity launch, answer submission, automatic next question, and console errors. The parent dashboard after PIN setup and real Supabase account sync are not manually verified in the browser. No production account or child data was used.

## Applying the patch

Apply the accompanying patch at the repository root with `git apply sakhi-learning-4.11.0.patch`, then run `npm ci` and `npm run release`. The local branch is `curriculum-year-plan`. Generated deployment files are included because this repository tracks them. Nothing has been pushed to GitHub or deployed to the existing public site.

## Remaining scope

Full narration for dynamic math; educator review of inferred grades, prerequisite granularity, and topic-specific lesson depth; complete higher-grade nonmath scope; curated/embedded video resources; review of the unavailable screenshots/uploads; production account/device QA. “Never runs out” means generators and review have no terminal day, not that a finite curriculum guarantees infinite unique concepts or perfect mastery.
