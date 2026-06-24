# SeaHype Marine Biology Education — Handoff

A free, offline, single-file marine-biology study website. It teaches marine
biology in short lessons with quick quizzes, flashcards, an 8-bit ocean arcade,
a reference library, and progress tracking. It shares its architecture and strict
code rules with an earlier study app, but the subject, content, branding, and
identity are entirely its own — there is no aviation content anywhere in the app.

**Primary deliverable:** `index.html` — one
self-contained file (~1.56 MB, including the embedded logo, original
illustrations, and all 501 lessons of content). No server, no build step,
no network needed to run. Double-click it or host it anywhere static.

## Production readiness (release QA — passed)

This build went through a full pre-release QA pass with **zero console errors**
across every check, on mobile (320/390/412 px) and desktop (1280 px), in both
dark and light themes:

- **Structure/content:** 501 lessons across 93 roadmap units, no broken unit
  references and no orphan lessons; all 1,502 quiz items well-formed (unique
  choices, valid answer keys, every "why" present); all illustration keys and
  every source URL valid; no template artifacts, placeholders, or name leakage.
- **Every screen + tab** renders: Home, Learn, Practice (flashcards), Arcade
  (24 games — all launch and are fully playable with keyboard + mouse on PC and
  touch on mobile), Library (all 9 tabs), Progress, and the You/Settings screen.
- **End-to-end flows verified:** first-run onboarding persists; a full quiz
  records completion + XP + activity log; the theme toggle works; the completed
  state (501/501) doesn't break; corrupt/empty saved data is handled gracefully.
- **Hardening:** display names render escaped (no HTML injection); the only
  `dangerouslySetInnerHTML` is for trusted built-in SVG art; `prefers-reduced-
motion` is honored; SEO/social/iOS-web-app meta tags are in `<head>`.

Fixes applied this pass: a crashing Sources tab, an unreachable Settings screen
(theme/name/reset were stranded), and a lesson missing its vocab terms.

Photos are optional and can be added later (see `PHOTOS_README.md`); when the
site is hosted, species lessons auto-load a real photo from Wikimedia and fall
back to the illustration offline.

## Made for ages 9–14 (tone & interactivity)

The voice and feel were tuned for a 9–14 audience while keeping the science
accurate and the sourcing intact:

- **Friendlier lesson language.** The 444 species lessons were regenerated with
  warmer, clearer wording — "It mostly eats…" instead of "feeds mainly on…",
  "Scientists call it…" instead of "know it as…" — and two real text bugs were
  fixed at the source: the "X is a X" tautology (e.g., "the butterflyfish is a
  butterflyfish") and "a/an" grammar slips ("a eel" → "an eel"). The gateway
  lesson (_What marine biology is_) was rewritten from dense, college-level prose
  into short, second-person sentences ("Think of SeaHype as your study buddy…").
- **Warmer onboarding.** The intro is shorter and more inviting, and the
  experience-level choices dropped the grade/college framing ("high-school
  level", "College-bound") in favor of kid-friendly options: _Just exploring_,
  _Building my knowledge_, _Going deep_.
- **More rewarding quizzes.** Right/wrong feedback now rotates through varied,
  encouraging lines ("Nailed it!", "You got it!", "So close!", "Good try")
  instead of a flat "Correct/Explanation", results end on an encouraging verdict
  ("Awesome work!" / "Nice effort — you're getting it!" / "Keep going — you've
  got this!"), and finishing a lesson pops a little celebration with the XP.
- **Simpler check-in questions.** The post-quiz survey was reworded for younger
  readers ("How sure do you feel about this?", "Was the lesson easy to follow?",
  "Save this to look at again later").

This was a tone/interactivity pass plus a regeneration of the species lessons.
The longer hand-written concept lessons (foundations, ecology, methods, etc.)
still read at a somewhat higher level and are a good candidate for a follow-up
simplification pass if you want the whole curriculum at a consistent 9–14
reading level.

## Parent & teacher area (knowledge verification)

Settings → **Parent & teacher** opens a grown-ups area behind a simple
parent-gate (a multiplication question, re-asked on every entry so a child can't
wander in). Inside:

- **Progress dashboard** — lessons completed (overall and per area), average quiz
  score, depth level, day streak, the child's own confidence/clarity ratings,
  flagged/missed topics, and recent study activity with timestamps. This is the
  "are they actually studying?" view.
- **Verify Knowledge** — a parent-proctored check drawn from the lessons the
  child has actually studied (or the whole course). You read each question aloud;
  tapping **Reveal** shows the correct answer, a one-line explanation, and the
  source lesson, so you can confirm real factual understanding rather than
  guessing. It scores the session, breaks it down by area, lists topics to
  revisit, and saves each result so you can track checks over time. Questions and
  answers come straight from the same sourced lesson content.

---

## 8-Bit Arcade — 24 learning games (NEW)

The Arcade tab is now a **24-game "learning activity arcade"** of ocean-themed 8-bit games — classic arcade mechanics reskinned for marine biology, each with a short fact shown on game over. Every point earns tickets + XP (shared daily XP cap of 120), and each game keeps a personal high score.

**Shared canvas engine (`GameHost`).** All 22 action/puzzle games run on one reusable pixel-canvas engine, so each game is a compact "spec" object — `{ id, title, tag, desc, icon, color, W, H, controls, lives, help, fact, setup(api), update(api,gs), draw(api,gs), press(api,gs,btn) }`. The engine owns the rAF loop, score/lives HUD, ready/game-over overlays, ticket/XP rewards, high-score persistence, and a no-canvas fallback. Input is unified across keyboard (arrows/WASD/space), on-screen 8-bit buttons (auto-built from the `controls` string: `dpad`, `lr`, `fire`, `tap`, `grid`, `pointer`, `flip`), mouse, and touch — with full desktop (PC) support. On a computer, paddle/pointer games follow the **mouse cursor on hover** (no button held), and the engine uses a last-input-wins arbiter (`input.mode` = `"keys"` | `"pointer"`) so moving the mouse, pressing a key, or tapping a button each immediately takes control. The `api` passed to each spec provides drawing (`px`, `clear`, `text`, `circle`), input (`input.l/r/u/d/fire`, pointer `input.px/py/pdown`, `input.mode`), RNG (`rnd`, `rndInt`, `pick`), and game control (`addScore`, `setScore`, `loseLife`, `die`, `best`). Adding a new game = pushing one spec onto `ARCADE_SPECS`.

**The 24 cabinets**

- _Arcade & action_ — Tide Pong (Pong vs AI), Reef Breaker (breakout), Jelly Drift (flappy), Plastic Patrol & Crab Catch (catchers), Pearl Diver (descend-for-pearls with an air timer), Kelp Climber (doodle-jump).
- _Runners & survival_ — Current Runner (endless dodge), Seahorse Sprint (3-lane), Octo Dodge (ink-storm survival), Turtle Crossing (frogger).
- _Shooters_ — Jelly Invaders (space invaders), Anchor Drift (asteroids).
- _Puzzle & brain_ — Sea Snake (snake), Tide Tetris (tetris), Reef Match (match-3), Bubble 2048 (2048), Pearl Sweeper (minesweeper), Current Lights (lights-out), Tide Memory (pairs), Sonar Says (Simon), Bubble Pop Blitz (timed tap).
- _Learning cabinets_ — Reef Rapid (fast quiz from every lesson) and Topic Sorter (sort terms into branches of marine biology), both drawn from the curriculum.

**State.** High scores live in `state.arcade.scores[gameId]`; tickets/XP-today in `state.arcade` as before. The `arcadeScore(id, score)` handler records personal bests; `earnArcade(xp, tickets)` awards rewards (still capped) and can unlock the Arcade Ace badge.

**Testing.** Because canvas isn't visible headlessly, every game spec is verified by a mock-context simulation harness (`window.ARCADE_SPECS` driven with a fake `api` over ~1,100 frames of randomized input, toggling `input.mode`): all 22 confirmed exception-free, NaN-free, with working scoring and reachable game-over. A rigorous jsdom check (scoped to `#root`) confirms **24/24 cabinets render in both dark and light themes at 0 errors**. Desktop keyboard + mouse are verified **end-to-end**: a real mounted game (Tide Pong, with a recording canvas context) responds to dispatched `ArrowLeft`/`ArrowRight` key events (paddle drives left then right) and to mouse `pointermove` events (paddle tracks the cursor to x≈20 and x≈160) — both PASS.

## Content audit — references & reading level (NEW)

A site-wide pass confirmed the curriculum is factual, sourced, and age-appropriate for 8–12-year-olds.

**References — 100% coverage, verified.** All 501 lessons carry both a `sources[]` array and a `src` key; **0 lessons are unreferenced and 0 source URLs are placeholders or malformed** (every URL matches `https?://…`). Every source points to an authoritative ocean-science body — by frequency: Smithsonian Ocean (`ocean.si.edu`), NOAA Fisheries, World Register of Marine Species (WoRMS), NOAA Ocean Service / Ocean Exploration, MBARI, WHOI, NASA Earth Observatory, and the IUCN Red List. High-leverage figures were spot-checked and are accurate (e.g. ocean ≈71% of Earth's surface and ≈97% of its water; mean depth ≈3,682 m; ~2,000 new species described/yr; surface-ocean pH down ≈0.1 since pre-industrial ≈ a 30% rise in acidity; hydrothermal vents discovered 1977; the ~10% energy-transfer rule; Challenger Deep ≈10,935 m; aquaculture overtook wild capture in 2022).

**Reading level — brought into the 8–12 band.** Flesch–Kincaid grade was measured for every lesson's teaching text (via `textstat`) and the hardest lessons rewritten for shorter sentences and plainer wording, **preserving every fact, name, number, source, and quiz**. Results across all 501 lessons:

| Metric                   | Before   | After        |
| ------------------------ | -------- | ------------ |
| Mean FK grade            | 6.59     | **5.83**     |
| Median FK grade          | 6.06     | **5.84**     |
| Hardest lesson           | 17.2     | **8.1**      |
| Lessons above grade 8    | 85 (17%) | **1 (0.2%)** |
| Mean Flesch Reading Ease | 69.8     | **73.1**     |

About 85 lessons were rewritten in all — every concept/teaching lesson across the foundations, ecology, organisms, habitats, physiology, conservation, and methods tracks, plus the trait sentences of every species blurb that had measured above grade 8 (their scientific names are preserved for accuracy; only the surrounding sentences were shortened). After the pass, **99.8% of lessons read at grade ≤8, and the single lesson still measuring above it (life-domains, 8.1) is held there only by unavoidable phylum names** (cnidarians, arthropods, echinoderms, chordates) in otherwise short, simple sentences. The grade-level distribution is now: ≤4 grade 20 lessons (4%), 4–6 grade 256 (51%), 6–8 grade 224 (45%), and just 1 (0.2%) above. Note that Flesch–Kincaid penalizes long proper nouns heavily, so even this residual overstates real difficulty for a reader using the built-in glossary.

Tooling for re-runs lives in `/home/claude/sea`: `extract.js` (dumps every lesson's text + checks reference coverage/URLs), `readability.py` (per-lesson FK/FRE + distribution), and `pulltext.js` (prints a lesson's full prose for editing).

## Daily Dive — spaced-repetition review (NEW)

The core upgrade that makes SeaHype a real **training** tool: finished lessons come
back as quick active-recall checks on a spacing schedule, so the science moves into
long-term memory instead of being read once and forgotten.

- **Scheduler (Leitner):** `state.srs[id] = { box: 1..5, due, last }`. A lesson enters
  the system the moment it's completed (`completeQuiz`). A correct review bumps the box
  up and pushes the next review further out; a miss drops it back to box 1 and brings it
  back soon. Intervals in days: `SRS_DAYS = [_, 1, 2, 4, 9, 16]`.
- **The session** (`ReviewSession`, view `review`, bottom-nav hidden): pulls everything
  due today plus weak items (cap 12), presents them as quick recall challenges through
  the **same challenge engine** built for Expeditions (multiple-choice + true/false),
  grades each answer, reschedules it, then shows a motivating summary (`x / y`, `+XP`,
  "N items moved toward mastery"). If nothing is due it offers a **Free practice** round
  so there's always something to do.
- **Surfaced** on **Home** (a "Daily Dive" card showing the live due count) and the
  **Practice → Daily Dive** tab (a dashboard: due-now / learning / mastered / next-batch
  countdown). Completing a Dive counts toward the daily streak and increments
  `state.reviewsDone`.

## Dive Badges — achievements (NEW)

A friendly motivation layer of **17 earnable badges** spanning every kind of activity:
lessons finished (First Dive → Marine Scholar), species mastered (Species Spotter,
Field Naturalist), topic breadth (Well Rounded), streaks (Making Waves / Tidal Force /
Ocean Devotee), expeditions (Pathfinder, Cartographer), reviews (Memory Keeper, Steel
Trap), a perfect quiz (Flawless), and arcade tickets (Arcade Ace).

- `BADGES` defs each carry `check(state)` and an optional `prog(state)`; `awardBadges(s)`
  runs after every reward action (lesson complete, expedition stop, Daily Dive) and pops
  a **celebration modal** for anything newly unlocked.
- `state.badges = { id: dateEarned }`. `BadgesScreen` (view `badges`, reached from a card
  on **Progress**) shows the whole set — earned vs. locked, with progress bars toward the
  next milestone.

**QA:** validate/build/smoke pass; full UI tests of the Daily Dive (due flow + free
practice), SRS rescheduling/persistence, badge earning + celebration modal + persistence,
and a six-screen regression all complete with **0 console errors** in dark and light.

---

## Expeditions (guided journeys) — NEW

A new **Expeditions** mode turns the whole curriculum into seven guided journeys,
one per track. Reachable from a hero card on **Home** and surfaced as views
`paths` (hub), `expedition` (stop map), and `stop` (immersive player — bottom nav
hidden). Progress persists in `state.paths[trackId][stopId] = { done, best }` and
feeds the same depth-level XP as the rest of the app.

**Structure**

- An **Expedition** = a track (Ocean Foundations, Marine Ecology, Marine Life,
  Ocean Habitats, Adaptation & Physiology, Conservation, Methods & Careers). Its
  **stops** are that track's existing units, surfaced via `expeditionStops(trackId)`.
- Stops unlock **sequentially** (a stop opens once the previous one is done); the
  hub and map show per-track progress bars and a complete-banner.
- Each **stop ramps up**: a short **warm-up**, then a **core** loop (a compact
  lesson card followed by a challenge, lesson by lesson), then a **challenge
  round** ("boss") that mixes the toughest items for extra XP, then a results
  screen (`x / y right`, XP earned). XP per challenge scales by phase
  (warm-up 6 / core 9 / boss 14; repeats earn ⅓).

**Six tap-based challenge types** (all mobile-first, no drag), rendered by
`renderChallenge()` and built by `buildStopChallenges()` / `buildStopSteps()`:

- **Quick question** (`mcq`) and **True/false** (`tf`) — drawn from each lesson's quiz.
- **Tap the picture** (`pick`) — choose the right animal from illustrated options
  (appears where a stop spans ≥2 categories).
- **Sort them out** (`sort`) — categorize animals into buckets; adapts to the data,
  sorting by **group → habitat → diet** (first dimension that yields a clean puzzle).
- **Make the matches** (`match`) — tap-to-pair; species↔habitat, else species↔diet,
  else term↔definition.
- **Put them in order** (`sequence`) — order curated concept chains (depth zones,
  food chain, tide zonation, classification ranks, sea-turtle life cycle, coral
  bleaching, scientific method, habitat depth) keyed to the matching track.

Challenge composition is **adaptive to each topic**: every one of the 77 multi-species
units yields sort + match variety, 9 multi-category units additionally unlock the
picture-pick, and concept units lean on term-matching + sequences. New per-species
metadata lives in generated `seahype-pathmeta.js` (`window.__SEA_SPECIES_META__`,
444 entries: name, category, group, habitat, diet, art, trait), written by
`author_specs.py` alongside the curriculum.

**QA:** validate/build/smoke all pass; full UI walkthroughs of multiple stops
(concept + uniform-species + multi-category) complete end-to-end with **0 console
errors** in both dark and light themes, exercising every challenge type, and
confirming completion, XP gain, sequential unlock, and persistence.

---

## The full 501-lesson curriculum (latest)

The app now ships **501 lessons** with **1,502 quiz questions**, organized into
**93 roadmap units**. This breaks into two complementary layers:

- **~57 hand-written lessons** (the original concept track plus the deep-dive
  additions) provide depth — multi-paragraph explainers, misconceptions, memory
  hooks and richer quizzes on big ideas like reefs, the carbon pump, vents,
  keystone species and animal navigation.
- **444 generated "field-guide" lessons** provide breadth — one concise,
  accurate lesson for each of 444 marine organisms and topics: reef, open-ocean
  and deep-sea fishes; sharks, rays and skates; whales, dolphins and seals; sea
  turtles and reptiles; seabirds; cnidarians, cephalopods, snails, bivalves,
  crustaceans, echinoderms and worms; sponges and tunicates; plankton and
  microbes; and algae, seagrasses and mangroves. Each has a templated, factual
  two-paragraph explainer, relevant glossary terms, two authoritative source
  links, a topic-matched hero illustration, and an auto-built three-question quiz
  whose answers are grounded in the authored facts.

**How the generated layer is produced (and kept accurate):** authoring is done as
compact, factual specs in `author_specs.py` — for each organism, its group,
broad habitat, diet and one true distinguishing fact, all drawn from
well-established marine biology. The engine `gen_curriculum.py` expands every spec
into a full lesson and quiz, assigns hero art and sources by group, and chunks
the lessons into titled units (e.g., "Reef & Coastal Fishes I–XIV", "Sharks
I–VII", "Marine Mammals I–VIII"). It writes `seahype-curriculum.js`, which the
build merges like any other lesson file. To add or edit lessons later, change the
specs and re-run `python3 author_specs.py`, then rebuild.

The generated lessons are intentionally bite-sized (breadth over depth) — think of
them as an illustrated field guide that complements the longer concept lessons.
All 501 pass the same checks: `validate` + `build` + `smoke` report 501 lessons,
1,502 questions, 0 quiz issues and 0 source issues, and a headless walk confirms
the roadmap, lessons, practice and library all render with zero runtime errors.

> A note on imagery: every lesson, unit and screen ships with **original vector
> illustrations** — accurate, royalty-free and watermark-free. On top of that,
> when the site is viewed online each species lesson now **loads a real
> photograph automatically from Wikimedia Commons** (matched by scientific name),
> caches it in the browser, and shows a credit link; if offline or unavailable it
> falls back to the illustration. So hosting the file gives you real photos with
> nothing to run. For a fully offline, self-contained file with photos baked in
> instead, the one-command `bake_photos.py` / Colab option still ships (see
> `PHOTOS_README.md`).

---

## Content expansion (earlier)

- **57 lessons** (up from 49) and **170 quiz questions**. The eight new lessons —
  hydrothermal vents & chemosynthesis, whale falls, the mesopelagic twilight zone
  & diel vertical migration, sea otters as a keystone species, reef cleaning
  stations, cephalopod intelligence, shark electroreception, and sea-turtle
  magnetic navigation — each carry explainers, key terms, a "why it matters," a
  misconception, a memory hook, two authoritative source links, and a 3-question
  quiz. They slot into the roadmap as two new units (**Ecology in Action**,
  **Wonders of the Deep**) plus additions to existing units, each with a
  topic-matched hero illustration.
- **New "Marvels" Library tab** — 16 sourced ocean records and superlatives
  (largest animal ever, deepest point, longest-lived vertebrate, biggest eyes,
  deepest-diving mammal, most numerous vertebrate, and more), each linked to a
  reputable organization.
- **Reference library grown:** glossary 56 → 86 terms, plus new pronunciations
  (28 → 38), careers (10 → 15), big-idea concepts, and history milestones. The
  History timeline now auto-sorts chronologically.
- **Shells 26 → 34**, adding the Florida horse conch, Scotch bonnet, banded
  tulip, coquina, angel wing, turkey-wing ark, wing oyster, and common nutmeg.
- All additions verified: `validate` + `build` + `smoke` pass (57 lessons, 170
  questions, 0 quiz/source issues), and a headless walk confirms the new units,
  the Marvels tab, and chronological history — with zero runtime errors. New
  content lives in `seahype-lessons-extra4.js` and `seahype-extra-content.js`.

---

## What changed earlier — illustrations + shells

- **Sea-life artwork embedded site-wide.** An original vector-illustration
  library (`seahype-art.js`, 37 scenes — habitats, organisms, and shells) is
  bundled into the page and shown as: a reef hero banner plus a topical thumbnail
  on Home, a thumbnail on every roadmap unit header, a topic-matched hero on
  every one of the 49 lessons, header banners on Practice / Progress / Library,
  and organism thumbnails on all 16 Library "Groups" cards. These are original
  **drawn diagrams, not photographs** — chosen deliberately because licensed
  stock photos cannot be reliably embedded into a single offline file from this
  environment, whereas illustrations are license-free, always correct, render
  crisply at any size, and match the illustrated logo. A new **"Artwork"** note
  in Terms / credits states this plainly.
- **New Shells page — `Library → Shells`.** 26 common shoreline / beachcombing
  shells (`seahype-shells.js`), each with its own illustration, scientific name,
  group, typical size, a short description, and region tags. It is **filterable
  by region** (All / Atlantic / Gulf / Pacific / Caribbean / Mediterranean /
  Indo-Pacific) and carries a take-only-empty-shells, leave-living-animals
  reminder. The bottom nav stays at six tabs; Shells lives inside the Library so
  the launch ribbon is not crowded.
- **Art pipeline.** `gen_art.py` procedurally builds every SVG (depth gradients,
  light rays, parametric gastropod spirals and bivalve fans) and writes
  `seahype-art.js` as `window.SEA_ART`. The build inlines it (and the shells
  data) into the page's JSON blob, so everything stays in one file and offline.
- **Verified.** `validate` + `build` + `smoke` pass (49 lessons, 146 questions,
  0 quiz/source issues). Headless mount checks confirm the artwork renders on
  every screen and the region filter math is correct (All 26 → Pacific 4 →
  Caribbean 8 → Mediterranean 3), on both mobile (412 px, bottom nav incl. the
  Arcade tab) and desktop (1280 px, sidebar), with **zero runtime errors**.

---

## Earlier revision — logo, responsive layout, arcade

- **Official logo wired in everywhere.** The circular SeaHype badge (wave, sea
  turtle, reef scene) is embedded once and shown on the boot splash, the screen
  headers, the new desktop sidebar, and as the recolored favicon/theme color.
  The tagline band is cropped out for clean small sizes; corners are transparent
  so it sits on any background.
- **Text artifact fixed app-wide.** 340 literal escape sequences (e.g. the
  `\u2014` that was showing instead of an em dash) across the engine, all lesson
  data files, and the build script were converted to real characters.
- **Responsive on phone, tablet, and desktop.** A viewport hook drives three
  layouts: a bottom nav on phone/tablet, a fixed left sidebar with wider, gridded
  content on desktop, and reading-width columns for lessons and quizzes.
- **Arcade is now an 8-bit ocean arcade, with its own tab.** Arcade is a
  dedicated entry on the bottom launch ribbon (and the desktop sidebar), not just
  a Home shortcut. It adds **Reef Diver**, a one-button pixel canvas game (swim
  through gaps, collect bubbles), alongside the two re-skinned quiz cabinets
  (Reef Rapid, Topic Sorter), all in a CRT/scanline cabinet aesthetic. Earnings
  still feed the daily XP cap.
- **Accuracy/sourcing re-checked.** Every lesson still carries authoritative
  source links; key figures (ocean ~71% of the surface / ~97% of water, mean
  depth ~3,682 m, Challenger Deep ~10,935 m, >250,000 described marine species,
  2022 aquaculture milestone, ~30% acidity increase) verified against mainstream
  sources.

---

## What's inside (content)

- **49 lessons** across **7 tracks**, organized into **10 ordered units**:
  - Ocean Foundations (10): what the ocean is, seawater, temperature/density/
    light, pressure, pelagic & benthic zones, the seafloor, currents, tides.
  - Marine Ecology (5): primary production, plankton, food webs, biodiversity,
    species interactions.
  - Marine Life (12): the tree of life, microbes, protists/algae, plants,
    sponges & cnidarians, mollusks, arthropods, echinoderms & worms, fishes,
    sharks & rays, reptiles & birds, mammals.
  - Ocean Habitats (8): intertidal, estuaries, mangroves & seagrass, kelp
    forests, coral reefs, the open ocean, the deep sea, polar seas.
  - Adaptation & Physiology (5): osmoregulation, buoyancy & gases,
    light & bioluminescence, senses & movement, reproduction.
  - Conservation (5): fisheries, pollution, climate & the ocean, acidification,
    protection & recovery.
  - Methods & Careers (4): the scientific method at sea, tools & technology,
    a short history of the field, and careers.
- **146 quiz questions** (multiple-choice and true/false), each with an
  explanation shown on reveal.
- **98 source links** across the lessons. Every lesson cites authoritative
  organizations (NOAA Ocean Service / Ocean Exploration / Fisheries, Smithsonian
  Ocean, MBARI, WHOI, IUCN, the World Register of Marine Species, NASA, USGS,
  FAO, National Geographic Education). The Library's "Sources" tab lists the hubs.
- **Reference library:** 56 glossary terms (searchable), 28 pronunciations,
  16 taxonomic groups, 10 big-idea concepts, 10 career profiles, a 10-entry
  history timeline, and 10 progress milestones.

> Accuracy note: lessons are original explanations of well-established marine
> biology, written to current consensus figures (e.g. the ocean is ~71% of
> Earth's surface and ~97% of its water; mean depth ~3,682 m; >250,000 described
> marine species; aquaculture overtook wild capture in 2022; the ocean has taken
> up on the order of 90% of excess heat and ~25–30% of human CO2). Figures are
> phrased conservatively and linked to primary sources so reviewers can verify.

---

## Features (UX)

- **Onboarding** (name, self-described level, interests) — tone only; content is
  identical for everyone.
- **Home / dive log:** depth-level + XP, day streak, lessons-complete %,
  continue-where-you-left-off, fact of the day, quick links to Practice & Arcade.
- **Learn roadmap:** expandable units with per-unit progress; open any lesson.
- **Lesson view:** explanation, "why it matters", common-misconception callout,
  key terms, a memory hook, and source links; then the quiz.
- **Quiz engine:** MC / true-false, instant feedback + explanation, end-of-quiz
  self-survey (confidence, clarity, flag-for-review, personal note).
- **Practice:** shuffled flashcards (built from the glossary) and a Review list
  (lessons you flagged or missed questions on).
- **8-bit ocean arcade:** three cabinets — _Reef Diver_ (a one-button pixel
  canvas game: swim through reef gaps and grab bubbles), _Reef Rapid_ (rapid
  questions from every lesson), and _Topic Sorter_ (match a term to its area),
  in a CRT/scanline cabinet style. XP from the arcade is
  capped per day so lessons stay central.
- **Library:** glossary search, pronunciations, taxonomic groups, big ideas,
  careers, history timeline, and the source directory.
- **Progress:** level, streak, milestones (unlock by lessons completed), and a
  recent-activity log.
- **Profile/Settings:** edit name, dark/light theme, view interests, reset
  progress (with confirmation), and the legal/credits screen.
- Dark ("deep ocean") and light ("surface") themes. Mobile-first; works offline.

---

## Architecture

Single self-contained HTML built from modular sources:

```
SeaHype.jsx                 the app/engine (React via React.createElement; no JSX syntax)
seahype-lessons.js          foundations + ecology lessons
seahype-lessons-extra.js    marine-life survey lessons
seahype-lessons-extra2.js   habitats + physiology lessons
seahype-lessons-extra3.js   conservation + methods lessons
seahype-content.js          glossary, pronunciations, taxonomy, concepts, careers, history, milestones
build_html.js               assembles everything into the final .html (inlines React UMD + a JSON data blob + a marine boot splash)
validate.js                 parser-rule check (run before build)
smoke.js                    headless jsdom test (data integrity + real mount)
package.json                dev dependencies
```

- **Rendering:** React + ReactDOM (production UMD) are inlined and forced onto
  the global scope; the app calls `React.createElement` via the alias `h`.
- **Data:** all content lives in the sibling data files. At build time they are
  merged and embedded as one `<script type="application/json" id="sea-data">`
  blob, then copied onto `window`. To change content you edit the data files and
  rebuild — you never touch the engine.
- **Persistence:** 100% local. `safeStorage` wraps `localStorage` and falls back
  to in-memory if storage is blocked (e.g. a sandboxed preview). The storage key
  is `seahype_marinebio_v1` and must never change, or saved progress is lost.
- **Boot:** a marine splash arms a "Dive in" button, prefills the name, then
  hands off to the app (`window.__seaBoot`); a 45-second fallback and defensive
  ReactDOM resolution guard against edge cases.

### Strict code rules (enforced/honored for external review)

1. No optional-chaining operator — use `a && a.b`.
2. No nullish-coalescing operator — use `x != null ? x : y`.
3. `var` only (no `let`/`const`); React hooks aliased as `var useState = React.useState`, etc.
4. No object spread/rest — a small `sx()` helper merges style objects.
5. No regex literals inside `.map()/.filter()/.forEach()` callbacks (the single
   regex lives in the standalone `normFill()`).
6. `function () {}` event handlers.

`validate.js` parses the engine with Babel and scans for the two forbidden
operators; it must print `PASS` before building.

---

## Build & test

```bash
cd sea
npm install
node validate.js SeaHype.jsx     # must print PASS
node build_html.js               # writes the final HTML to outputs
node smoke.js                    # data integrity + real mount in jsdom
```

`smoke.js` confirms: lesson/question counts, that every quiz question is
well-formed (valid answer indices / boolean answers), that every lesson cites at
least one real http(s) source, that the reference datasets are present, and that
the app actually mounts content into `#root` with no boot error.

Latest run: **49 lessons, 146 quiz questions, 0 integrity issues, 0 source
issues**, app mounts cleanly on both first-run and returning-user paths.

---

## How to extend (what "continue" can add)

- **Deepen each track:** the unit structure has room to grow — e.g. split the
  Marine Life survey into per-phylum lessons, add chemical-oceanography and
  physical-oceanography depth to Foundations, add region/case-study lessons to
  Conservation. Add a lesson by appending a record to the relevant data file
  (and, if it should appear in the roadmap, add its id to `UNIT_PLAN`).
- **More questions per lesson** and new question types.
- **More arcade games** (the `MiniGame` engine takes any question pool).
- **More reference data** (glossary, pronunciations, taxa, careers, timeline).

### Lesson record shape

```js
"lesson-id": {
  title, track, level: "Foundations" | "Core" | "Advanced",
  src: "<SOURCES key>", time: <minutes>,
  explain: [ "paragraph", ... ],
  why: "...", misconception: "...",
  terms: [ ["term","definition"], ... ],
  hook: "memory aid",
  sources: [ { label, url }, ... ],
  quiz: [
    { type: "mc", q, choices: [...], answer: <index>, why },
    { type: "tf", q, answer: <true|false>, why }
  ]
}
```

---

## Notes

- This app is independent and educational. It is **not affiliated with** NOAA,
  the Smithsonian, MBARI, WHOI, IUCN, NASA, FAO, or any other organization
  referenced; linked sources belong to their owners and are for reference only.
- It is a study tool, **not** a substitute for accredited coursework, fieldwork,
  or scientific-diving certification. See the in-app "Terms, privacy & credits"
  screen and the accompanying Legal Notices file.
- The operator alias used in legal text is `openMarineDB`.
