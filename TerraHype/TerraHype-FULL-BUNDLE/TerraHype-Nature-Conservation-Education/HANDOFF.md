# TerraHype Nature Conservation Education — Handoff

A free, offline, single-file React study app teaching North American nature and
conservation (ecology, botany, zoology, geology, habitats, conservation, field
methods) to a 9–14 audience. Built by forking the SeaHype Marine Biology engine
and re-theming it ocean → land while keeping the proven mechanics intact.

**Deliverable:** `TerraHype Nature Conservation Education.html` — one
self-contained file (~1.4 MB). No server, no build step, no network required to
run. Open it in any modern browser (works offline; installable as a PWA-style
home-screen app on mobile). Progress is saved to browser `localStorage` only.

---

## 1. What's inside the app

- **501 lessons total** = 75 hand-written concept lessons + 426 species/specimen
  lessons, organized into **8 tracks**: Foundations, Ecology, Flora, Fauna,
  Geology, Habitats, Conservation, Methods.
- **1,385 quiz questions** (multiple-choice and true/false); every lesson has a
  quiz, every question has an explanation.
- **Library / reference**: 58-term glossary, 26 pronunciations, 12 taxonomy
  groups, 10 big-idea concepts, 10 careers, 10 history milestones, 8 progress
  milestones, 12 "Wonders" (natural-world records), and a 20-entry rocks /
  minerals / fossils reference (filterable by Igneous / Sedimentary /
  Metamorphic / Mineral / Fossil).
- **26-game 8-bit arcade**, XP / levels / streaks, 17 badges, guided
  "expeditions" (ordering challenges), and a proctored quiz mode. The arcade now
  includes two relational-thinking games — **Web of Life** (who eats whom / who
  lives where) and **Sort by Kind** (mammal vs bird vs rock, etc.) — that drill
  "actionable relativity" across the curriculum.
- **29 original procedural SVG scenes** used as lesson art (forest, oak, meadow,
  wetland, desert, mountain, river, pond, coast, tundra, cave, soil, plus
  identifiable bird / reptile / fish / frog / owl / deer / fox / mushroom / fern
  / mineral / fossil scenes); species lessons also
  attempt to load a reference photo from Wikimedia at runtime (scientific-name
  search), falling back to the SVG scene when offline or when none is found.

---

## 2. Architecture & why identifiers look "marine"

This app is a **fork of the SeaHype engine**. A deliberate decision was made to
**keep every internal identifier unchanged** and only transform values, content,
branding, themes, and art. This keeps future diffs against the upstream engine
trivial and avoids a risky rename sweep. So you will see — and must NOT rename —
the following internal names, which are invisible to end users:

- Global data keys: `window.__SEA_LESSONS__`, `window.SEA_ART`,
  `window.__SEA_QUERIES__`, `window.__SEA_SPECIES_META__`,
  `window.__SEA_UNITS_EXTRA__`, `window.__SEA_GLOSSARY__`, `__SEA_PRON__`,
  `__SEA_TAXONOMY__`, `__SEA_CONCEPTS__`, `__SEA_CAREERS__`, `__SEA_HISTORY__`,
  `__SEA_MILESTONES__`, `__SEA_MARVELS__`, `__SEA_SHELLS__`, `__SEA_PHOTOS__`,
  `__SEA_LOGO__`; boot hooks `__seaBoot` / `__seaReady` / `__seaDeferBoot` /
  `__seaPrefill`.
- Data **filenames** all stay `seahype-*.js`.
- Badge IDs (`first-dive`, `reef-regular`, `marine-scholar`, …), game IDs
  (`jelly`, `kelp`, `pearl`, …), and theme color KEY names (e.g. `coral`, now a
  terracotta accent) are kept; only their displayed titles/values changed.

**User-facing identity that DID change** (locked):
- Name **TerraHype Nature Conservation Education** (short: **TerraHype**).
- Tagline: *Bite-sized lessons for future nature conservationists*.
- Operator alias **openNatureDB** (and "the operator").
- **localStorage key `terrahype_nature_v1`** — do not change this or users lose
  progress.
- The pen name **D.L. Burich must never appear** anywhere in user-facing or
  legal output.

---

## 3. File inventory (in `src/`)

Engine:
- `TerraHype.jsx` — the entire app (~4,166 lines). React via `React.createElement`
  (aliased `h`), styles via an `sx()` merge helper (no object spread).

Data files (loaded in this exact order by `build_html.js`):
1. `seahype-lessons.js` — the 75 concept lessons (`__SEA_LESSONS__` via Object.assign).
2. `seahype-lessons-extra.js` … `-extra4.js` — now empty no-op stubs (all concept
   lessons were consolidated into #1; kept so the loader list is unchanged).
3. `seahype-curriculum.js` — 426 species lessons + 66 generated species units.
4. `seahype-queries.js` — `id -> Wikipedia/Wikimedia search term` for runtime photos.
5. `seahype-content.js` — glossary, pronunciations, taxonomy, concepts, careers,
   history, milestones.
6. `seahype-extra-content.js` — `__SEA_MARVELS__` only (loads AFTER content.js, so
   it must NOT redefine the content globals).
7. `seahype-art.js` — `window.SEA_ART`, 29 procedural SVG scene strings.
8. `seahype-shells.js` — `__SEA_SHELLS__`, the rocks/minerals/fossils reference.
9. `seahype-photos.js` — `__SEA_PHOTOS__` empty stub (pre-baked photo cache; left
   empty on purpose so the runtime Wikimedia fetch / SVG fallback is used).
10. `seahype-pathmeta.js` — `__SEA_SPECIES_META__`, per-species metadata for the
    guided expedition challenges.

Generators (Python 3; re-run to regenerate the data files):
- `gen_curriculum.py` — shared library: `S()` species record builder, vocab maps
  (`HAB`, `DIET`), `simple_cat()`, `art_for()`, source maps, `chunk_units()`,
  `emit()`. Imported by the species author script.
- `author_specs.py` — authors the **426 species**: a base set of 160 plus ten
  batch modules (`birds1/2`, `mammals2`, `trees2`, `plants2`, `herps2`, `fish2`,
  `fungi2`, `insects2`, `geo2`), each appending `S(...)` records with verified
  distinguishing facts and correct scientific names. It then de-duplicates ids
  (keeping the first/base occurrence), buckets everything into units, and writes
  `seahype-curriculum.js`, `seahype-queries.js`, and `seahype-pathmeta.js`.
- `gen_concepts.py` — authors the **75 concept lessons** and writes
  `seahype-lessons.js` (and blanks the four extra-lesson stubs).
- `gen_content.py` — writes `seahype-content.js`.
- `gen_extra.py` — writes `seahype-extra-content.js` (marvels) and
  `seahype-shells.js` (rocks).
- `gen_art.py` — writes `seahype-art.js` (the 29 SVG scenes).
- `gen_logo.py` — writes `logo_coin.png` (the circular badge logo, via Pillow).

Build / test:
- `build_html.js` — inlines React UMD + the JSX + all data (as a JSON blob) + the
  logo + a nature boot splash into the final single HTML file.
- `validate.js` — `node validate.js TerraHype.jsx` -> Babel parse + forbidden-token
  check (must print PASS).
- `smoke.js` — `node smoke.js` -> loads the built HTML in jsdom, validates lesson
  and quiz integrity, boots the app, and confirms it mounts (must print
  `SMOKE PASS OK`).

---

## 4. Data shapes

Concept lesson (`__SEA_LESSONS__[id]`):

    { title, track, level: "Foundations"|"Core"|"Advanced", src: "<source code>",
      time: <minutes>, explain: [paragraph, ...], why, terms: [[term, def], ...],
      hook, sources: [{label, url}, ...],
      quiz: [{type:"mc", q, choices:[...], answer:<idx>, why},
             {type:"tf", q, answer:<bool>, why}],
      misconception?: "..." }

Species lesson (same `__SEA_LESSONS__` map, built by `S()`): same shape, plus an
`art` key naming a `SEA_ART` scene. The 16 source codes are:
`usgs, usfs, nps, usfws, nrcs, epa, usda, cornell, audubon, nwf, iucn, si, eol,
natgeo, nasa, noaa`.

Species metadata (`__SEA_SPECIES_META__[id]`):
`{ name, cat, group, hab, habKey, diet, art, trait }`.

Rocks reference (`__SEA_SHELLS__[]`):
`{ name, sci, group, art, regions:[type tags], size, desc }` — `regions` is one of
Igneous / Sedimentary / Metamorphic / Mineral / Fossil (Library filter chips).

SVG scene (`SEA_ART[key]`): a self-contained `<svg viewBox="0 0 320 200">` string
injected via `dangerouslySetInnerHTML`. Gradient IDs are namespaced per scene
(e.g. `forest_sky`) to avoid DOM collisions.

---

## 5. How to expand or edit

Add/disable lessons: edit the relevant generator and re-run it, then rebuild.
- More species -> add `S(...)` lines in `author_specs.py` (give each a real
  distinguishing `trait` and a correct `sci` name so the runtime photo resolves),
  then re-run it. The unit bucketing (`chunk_units`) groups them automatically.
- More concept lessons -> add an `mk(...)` block in `gen_concepts.py`. To put it
  on the roadmap, also add its `id` to the engine's `UNIT_PLAN` (in
  `TerraHype.jsx`) under the right track/unit, and add an art key for it in the
  engine's `LESSON_ART` map.

Change art: edit `gen_art.py` and re-run. Every `SEA_ART` key referenced by
`LESSON_ART`, `TRACK_ART`, `GROUP_ART`, `__SEA_SHELLS__`, or species metadata must
exist, or those tiles fall back to a blank panel. (Current build: 0 missing.)

Build cycle (always run all three):

    cd src
    node validate.js TerraHype.jsx      # must print PASS
    node build_html.js                  # writes the HTML to the outputs folder
    node smoke.js                       # must print SMOKE PASS OK

---

## 6. Strict parser rules (honor in any edit)

The engine is written to a strict subset so it can be inlined and parsed reliably:

- No optional chaining `?.` and no nullish coalescing `??`.
- `var` only — no `let` / `const`.
- No object spread — merge styles with the `sx()` helper instead.
- No regex literals inside `map` / `filter` / `forEach` callbacks.
- Use `function () {}` handlers; hooks are aliased (`var useState = React.useState`).

`validate.js` fails the build on `?.` or `??`; the other rules are conventions
that keep the file consistent and safe to inline.

---

## 7. Notes & known trade-offs

- **QA audit (passed):** a full accuracy / spelling / age-appropriateness (8-12) /
  logic deep-dive was run on all 501 lessons. Results: spelling clean (no real
  misspellings; the only flagged tokens are agency acronyms, units and real
  compound nature words); every one of the 426 scientific names verified correct,
  including recent reclassifications; all 1,385 quiz questions structurally valid
  (answer in range, no duplicate choices) with every auto-generated species quiz
  cross-checked so its marked answer matches the species' real category and
  habitat; content age-appropriate (predation, venom, decomposition all framed
  gently and factually); average reading level about grade 6.6. Fixes applied in
  this pass: corrected proper-noun casing in generated prose (e.g. "New England
  aster", "Christmas fern", "Gila monster"), removed a tautology in the extra
  rock/mineral lessons (now "The gabbro is a coarse igneous rock"), split a few
  run-on sentences in the hardest concept lessons, and removed a duplicate
  "American red squirrel" entry (replaced with the American marten to hold the
  count at exactly 501). A second deep-dive pass also fact-checked the reference
  library (all 12 records, 10 history dates, taxonomy, careers, big-ideas and 26
  pronunciations) and the arcade/expedition game logic (the 16 curated Web-of-Life
  questions and all 31 ordering sequences verified correct); fixes from that pass:
  corrected a mislabeled pronunciation ("Hemlock woolly adelgid", was
  "Coniferous adelgid"), moved cattail out of the "Grasses & sedges" group, and
  fixed a/an grammar in the Sort-by-Kind game feedback ("an insect", "an igneous
  rock").
- **Accessibility pass:** primary buttons, quiz answer choices (multiple-choice
  and true/false), the bottom nav, and onboarding chips already render as native
  `<button>` elements; decorative SVG scenes carry `role="img"` and aria-labels;
  species photos have alt text; the document sets lang, viewport and charset; and
  a `prefers-reduced-motion` rule disables animation for motion-sensitive users.
  This pass added keyboard operability (role="button", tabIndex, Enter/Space
  handlers) to the previously mouse-only clickable surfaces — lesson/unit/library
  Cards, the unit expand/collapse headers, and the arcade game tiles — plus a
  high-contrast `:focus-visible` outline so keyboard focus is clearly visible on
  the dark theme. localStorage reads/writes are wrapped in try/catch so the app
  degrades gracefully if storage is unavailable.
- The jsdom checks in `smoke.js` work because they avoid leaving the app's
  animation/interval timers running. A full "boot then deep-navigate" jsdom
  script can hang on lingering timers — prefer `smoke.js` as the gate.
- Runtime species photos depend on the viewer being online; offline, every
  illustration is the curated SVG scene (always correct and on-brand).
- If a future budget forces trimming, trim the species count (in
  `author_specs.py`) rather than removing features, and note it here.
