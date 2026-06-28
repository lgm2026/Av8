# AstroHype Space & Astronomy Education — Handoff

A free, offline, single-file React study app teaching space and astronomy
(the night sky, gravity and orbits, the Solar System, stars and constellations,
galaxies and deep-sky objects, cosmology, space missions, and skywatching) to a
broad, curious audience. Built by forking the same proven single-file learning
engine used for the SeaHype / TerraHype study apps and re-theming it to space
while keeping the mechanics intact.

**Deliverable:** `AstroHype Space & Astronomy Education.html` — one
self-contained file (~1.5 MB). No server, no build step, no network required to
run. Open it in any modern browser (works offline; installable as a PWA-style
home-screen app on mobile). Progress is saved to browser `localStorage` only.

---

## 1. What's inside the app

- **501 lessons total** = 75 hand-written concept lessons + 426 object lessons
  (planets, moons, asteroids, comets, stars, constellations, galaxies, nebulae,
  clusters, spacecraft, telescopes, black holes, pulsars, quasars, exoplanets,
  meteor showers), organized into **8 tracks**: Cosmic Foundations, Orbits &
  Gravity, The Solar System, Stars & Constellations, Galaxies & Deep Sky,
  Cosmology & Exotica, Missions & Spacecraft, and Skywatching/History/Careers.
- **1,428 quiz questions** (927 multiple-choice + 501 true/false); every lesson
  has a quiz, every question has an explanation.
- **Library / reference**: 58-term glossary, 26 pronunciations, 12 object-class
  groups, 10 big-idea concepts, 10 careers, 10 history milestones, 8 progress
  milestones, 12 "Cosmic Wonders" (record-setting facts), and a 20-entry
  meteorite / space-rock reference (filterable by Iron / Stony / Stony-iron /
  Lunar / Martian / Impact glass).
- **26-game 8-bit arcade**, XP / levels / streaks, 17 badges, guided
  "expeditions" (ordering challenges), and a proctored quiz mode. The arcade
  includes two relational-thinking games — **Cosmic Links** (what orbits what /
  what is found where) and **Sort by Kind** (planet vs star vs galaxy, etc.) —
  that drill connections across the curriculum.
- **14 original procedural SVG scenes** used as lesson art (sun, planet, moon,
  star, galaxy, nebula, comet, asteroid, constellation, cluster, mission,
  telescope, black hole, dwarf), plus 29 legacy aliases so every track and
  screen resolves to a space scene. Object lessons also attempt to load a
  reference photo from Wikimedia at runtime (by name), falling back to the SVG
  scene when offline or when none is found.

---

## 2. Progression, zones, and levels

XP is earned by finishing lessons, acing quizzes, completing Daily Orbits, and
playing the arcade. Level names follow a journey from the ground to deep space:
Ground Control, Launchpad, Low Orbit, The Moon, Inner Planets, Asteroid Belt,
Outer Planets, Deep Space (and Cosmic Voyager beyond).

---

## 3. Key invariant — DO NOT CHANGE

- **localStorage key:** `astrohype_space_v1`. Renaming the brand must NOT change
  this key, or all saved user progress is lost. There is a single `STORE_KEY`
  constant at the top of the engine and a matching string in the boot splash
  script in the built HTML; both must stay in sync.
- The photo cache key is `astrohype_photocache_v1`.
- The display brand lives in one place (`BRAND` / `BRAND_SHORT` / `TAGLINE`) and
  is safe to edit; the store key is not.

---

## 4. How it's built

Single file = bootsplash + CSS + base64 logo, then `<script>` blocks in order:
React UMD, ReactDOM UMD, a JSON data blob (`<script type="application/json"
id="sea-data">`), then the app. The data globals are `JSON.parse`d onto
`window[...]` at load. The engine is content-agnostic: it reads all content from
window globals (prefixed `__SEA_*` / `SEA_*`) plus a few in-file config arrays.
(The internal `sea` / `__sea*` boot-handshake names are retained from the engine
lineage and are not user-visible.)

### Regenerate from source
```
cd src
python3 retheme.py        # pass 1: brand, themes, tracks, sources, zones, units, copy
python3 retheme2.py       # pass 2: arcade, badges, sequences, expedition prompts, legal
python3 build_astrohype.py  # assemble the data blob + final HTML
```
Outputs `AstroHype Space & Astronomy Education.html`.

### Validation performed
- Node `new Function(...)` parse check on `AstroHype.jsx` — valid JavaScript.
- Python shape-validation of all 501 lessons (explain / quiz / answers / terms /
  sources / art keys / unit references all valid; every lesson reachable in a
  unit; zero ID collisions).
- jsdom render smoke tests — the app boots, React + ReactDOM render the
  onboarding screen and navigate to Home/Learn, with zero runtime errors.

---

## 5. Source layout (`src/`)

- `data_*.py` — object datasets (constellations, stars, Solar-System bodies,
  deep-sky objects, missions/telescopes, plus a supplement) totalling exactly
  426 entries with no duplicate ids.
- `gen_sources.py`, `gen_entries.py` — build the source map, the 426 object
  lessons + quizzes + per-object metadata, and the object units.
- `astro_concepts*.py` — the 75 hand-authored concept lessons and their units.
- `astro_content.py` — glossary, pronunciations, taxonomy, concepts, careers,
  history, milestones, meteorite reference, and "wonders."
- `astro_art.py` — the 14 procedural SVG scenes (+ aliases).
- `AstroHype.jsx` — the re-themed engine.
- `react.wrapped.js`, `react-dom.wrapped.js` — React 18 UMD, globally wrapped.
- `retheme.py`, `retheme2.py` — the two re-theming passes (engine fork).
- `build_astrohype.py` — assembles the data blob and the final HTML.
- `astrohype_logo.png` — app logo (ringed planet badge).
- `smoketest.js` — jsdom render check.
- `package.json` — dev dependencies (jsdom, react, react-dom).

---

## 6. Notes

- Works fully offline; live object photos load from Wikimedia only when online.
- All figures (distances, sizes, dates, counts) are rounded for teaching and are
  approximate.
- See `AstroHype Space & Astronomy Education - Legal Notices.txt` for
  educational-use, accuracy, non-affiliation, and Sun-safety information.
