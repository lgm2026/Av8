# -*- coding: utf-8 -*-
import re, json
import astro_concepts, astro_content

SRC_JSX = "/home/claude/terrahype/full-bundle/TerraHype-Nature-Conservation-Education/src/TerraHype.jsx"
OUT_JSX = "/home/claude/astro/src/AstroHype.jsx"

src = open(SRC_JSX, encoding="utf-8").read()

REPLACEMENTS = []  # (old, new, expected_count) expected_count None => exactly 1
def R(old, new, n=1):
    REPLACEMENTS.append((old, new, n))

# ---------------- brand ----------------
R('var STORE_KEY = "terrahype_nature_v1";', 'var STORE_KEY = "astrohype_space_v1";')
R('var BRAND = "TerraHype Nature Conservation Education";', 'var BRAND = "AstroHype Space & Astronomy Education";')
R('var BRAND_SHORT = "TerraHype";', 'var BRAND_SHORT = "AstroHype";')
R('var TAGLINE = "Bite-sized lessons for future nature conservationists";',
  'var TAGLINE = "Bite-sized lessons for future astronomers and space explorers";')
R('var OPERATOR = "openNatureDB";', 'var OPERATOR = "openSpaceDB";')

# ---------------- Illus fallback background ----------------
R('background: "#16291D", position: "relative", lineHeight: 0 }, props.style),\n    dangerouslySetInnerHTML',
  'background: "#0D1226", position: "relative", lineHeight: 0 }, props.style),\n    dangerouslySetInnerHTML')
R('overflow: "hidden", background: "#16291D", position: "relative", lineHeight: 0 }, props.style)\n  }, h("img"',
  'overflow: "hidden", background: "#0D1226", position: "relative", lineHeight: 0 }, props.style)\n  }, h("img"')

# ---------------- ZONE_NAMES ----------------
R('var ZONE_NAMES = [\n  "Trailhead", "Meadow", "Foothills", "Woodland", "Ridgeline", "Highlands", "Summit", "Wilderness"\n];',
  'var ZONE_NAMES = [\n  "Ground Control", "Launchpad", "Low Orbit", "The Moon", "Inner Planets", "Asteroid Belt", "Outer Planets", "Deep Space"\n];')
R('else name = "Deep Explorer";', 'else name = "Cosmic Voyager";')

# ---------------- onboarding copy ----------------
R('"Welcome to TerraHype! Explore the wild land in short lessons \\u2014 from towering trees and wildflowers to bears, owls, and the rocks beneath your feet. Each lesson ends with a quick quiz so the cool facts stick. It\'s free, works offline, and stays on your device."',
  '"Welcome to AstroHype! Explore the universe in short lessons \\u2014 from the planets and moons next door to distant stars, galaxies and black holes. Each lesson ends with a quick quiz so the cool facts stick. It\'s free, works offline, and stays on your device."')
# the source uses a literal em dash char, not \u2014 — handle both forms:
R('"Welcome to TerraHype! Explore the wild land in short lessons — from towering trees and wildflowers to bears, owls, and the rocks beneath your feet. Each lesson ends with a quick quiz so the cool facts stick. It\'s free, works offline, and stays on your device."',
  '"Welcome to AstroHype! Explore the universe in short lessons — from the planets and moons next door to distant stars, galaxies and black holes. Each lesson ends with a quick quiz so the cool facts stick. It\'s free, works offline, and stays on your device."', n=0)
R('"What draws you to nature?"', '"What draws you to space?"')
R('note: "New to nature \\u2014 keep it friendly"', 'note: "New to space \\u2014 keep it friendly"', n=0)
R('note: "New to nature — keep it friendly"', 'note: "New to space — keep it friendly"', n=0)

# ---------------- HomeScreen labels ----------------
R('"Your field journal"', '"Your star log"')
R('"Trail level "', '"Explorer level "', n=0)  # may appear once
R('"Nature fact of the day"', '"Space fact of the day"')

# ---------------- PracticeScreen header art ----------------
R('h(Illus, { name: "forest", ar: "16 / 6", label: "Forest trail", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } })',
  'h(Illus, { name: "galaxy", ar: "16 / 6", label: "Deep sky", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } })')
R('var tabs = [["cards", "Flashcards"], ["review", "Daily Trek"]];',
  'var tabs = [["cards", "Flashcards"], ["review", "Daily Orbit"]];')

# ---------------- artFor fallback ----------------
R('  if (track && TRACK_ART[track]) return TRACK_ART[track];\n  return "forest";\n}',
  '  if (track && TRACK_ART[track]) return TRACK_ART[track];\n  return "star";\n}')

# ---------------- TRACK_ART ----------------
R('var TRACK_ART = { foundations: "river", ecology: "forest", flora: "forest", fauna: "deer", geology: "mineral", habitats: "wetland", conservation: "stewardship", methods: "fieldwork" };',
  'var TRACK_ART = { foundations: "star", ecology: "planet", flora: "sun", fauna: "star", geology: "galaxy", habitats: "blackhole", conservation: "mission", methods: "telescope" };')

# ---------------- arcade quiz games (descriptions) ----------------
R('{ id: "reefq", title: "Trail Rapid", tag: "Quiz", desc: "Fast-fire questions from every lesson.", icon: "spark", color: AB.cyan, quiz: true, pool: quizPool }',
  '{ id: "reefq", title: "Cosmic Rapid", tag: "Quiz", desc: "Fast-fire questions from every lesson.", icon: "spark", color: AB.cyan, quiz: true, pool: quizPool }')
R('{ id: "weboflife", title: "Web of Life", tag: "Relate", desc: "Pick the right link: who eats whom, who lives where.", icon: "wave", color: AB.teal, quiz: true, pool: relPool }',
  '{ id: "weboflife", title: "Cosmic Links", tag: "Relate", desc: "Pick the right link: what orbits what, what lives where.", icon: "wave", color: AB.teal, quiz: true, pool: relPool }')
R('{ id: "sortkind", title: "Sort by Kind", tag: "Sort", desc: "Is it a mammal, a bird, a rock? Sort each one.", icon: "star", color: AB.amber, quiz: true, pool: kindPool }',
  '{ id: "sortkind", title: "Sort by Kind", tag: "Sort", desc: "Is it a planet, a star, a galaxy? Sort each one.", icon: "star", color: AB.amber, quiz: true, pool: kindPool }')
R('{ id: "zoneq", title: "Topic Sorter", tag: "Sort", desc: "Match each term to its branch of nature study.", icon: "depth", color: AB.green, quiz: true, pool: zonePool }',
  '{ id: "zoneq", title: "Topic Sorter", tag: "Sort", desc: "Match each term to its branch of astronomy.", icon: "depth", color: AB.green, quiz: true, pool: zonePool }')

# ---------------- Library blurb ----------------
R('"Reference for everything in SeaHype."', '"Reference for everything in AstroHype."', n=0)
R('"Reference for everything in TerraHype."', '"Reference for everything in AstroHype."', n=0)

# ---------------- zonePool cats ----------------
gloss_cats = []
for it in astro_content.GLOSSARY:
    if it["cat"] not in gloss_cats: gloss_cats.append(it["cat"])
cats_js = "[" + ", ".join('"%s"' % c for c in gloss_cats) + "]"
R('var cats = ["Ecology", "Plants", "Animals", "Geology", "Habitats", "Conservation", "Field skills"];',
  'var cats = ' + cats_js + ';')

# ---------------- kindPool labelOf ----------------
R('''  var labelOf = {
    "tree": "Tree", "shrub": "Shrub", "wildflower": "Wildflower", "grass": "Grass",
    "fern or moss": "Fern or moss", "fungus or lichen": "Fungus or lichen",
    "mammal": "Mammal", "bird": "Bird", "reptile": "Reptile", "amphibian": "Amphibian",
    "freshwater fish": "Fish", "insect": "Insect", "arachnid": "Spider or other arachnid"
  };''',
  '''  var labelOf = {
    "constellation": "Constellation", "star": "Star", "planet": "Planet", "dwarf planet": "Dwarf planet",
    "asteroid": "Asteroid", "comet": "Comet", "moon": "Moon", "galaxy": "Galaxy",
    "nebula": "Nebula", "star cluster": "Star cluster", "spacecraft": "Spacecraft", "telescope": "Telescope",
    "black hole": "Black hole", "pulsar": "Pulsar", "quasar": "Quasar", "supernova remnant": "Supernova remnant",
    "exoplanet": "Exoplanet", "exoplanet system": "Exoplanet", "meteor shower": "Meteor shower"
  };''')
R('var nounK = (lab === "Fish" ? "fish" : lab.toLowerCase());',
  'var nounK = lab.toLowerCase();')

# ---------------- SHELLS typeLabels/tmap ----------------
R('var typeLabels = ["Igneous rock", "Sedimentary rock", "Metamorphic rock", "Mineral", "Fossil"];',
  'var typeLabels = ["Iron meteorite", "Stony meteorite", "Stony-iron meteorite", "Lunar meteorite", "Martian meteorite", "Impact glass"];')
R('var tmap = { "Igneous": "Igneous rock", "Sedimentary": "Sedimentary rock", "Metamorphic": "Metamorphic rock", "Mineral": "Mineral", "Fossil": "Fossil" };',
  'var tmap = { "Iron": "Iron meteorite", "Stony": "Stony meteorite", "Stony-iron": "Stony-iron meteorite", "Lunar": "Lunar meteorite", "Martian": "Martian meteorite", "Impactite": "Impact glass" };')

# ---------------- relPool habPool ----------------
R('var habPool = ["forests and woodlands", "grasslands and prairies", "wetlands and marshes", "deserts and dry scrub", "rivers and streams", "lakes and ponds", "mountains and high slopes", "coastal dunes and shores"];',
  'var habPool = ["the inner Solar System", "the outer Solar System", "our Milky Way galaxy", "deep space beyond the Milky Way", "the asteroid belt", "the Kuiper Belt", "orbit around a giant planet", "Earth orbit"];')

# Apply simple replacements now; block replacements (THEMES/SOURCES/TRACKS/LESSON_ART/UNIT_PLAN/OCEAN_TIPS/INTEREST_OPTIONS/relCurated) handled below via regex.
missing = []
for old, new, n in REPLACEMENTS:
    cnt = src.count(old)
    if n == 0:
        if cnt: src = src.replace(old, new)
        continue
    if cnt != n:
        missing.append((old[:70], cnt, n))
        continue
    src = src.replace(old, new)

if missing:
    print("!!! MISSING/!=expected exact replacements:")
    for m in missing: print("   ", m)
else:
    print("exact replacements OK:", len([r for r in REPLACEMENTS if r[2]!=0]))

# ===================== BLOCK REPLACEMENTS via regex =====================
def block_replace(pattern, repl, label, count=1):
    global src
    new, n = re.subn(pattern, lambda m: repl, src, count=count, flags=re.S)
    if n != count:
        print("!!! block replace FAILED:", label, "found", n)
    else:
        print("block replace OK:", label)
    src = new

# THEMES
themes_js = '''var THEMES = {
  dark: {
    name: "dark",
    bg: "#080B1A", bg2: "#0D1226", panel: "#121A33", panelHi: "#1A2444",
    line: "#2A3556", lineSoft: "#1E2742",
    text: "#EAEFFF", textDim: "#A9B6D9", textFaint: "#6E7BA3",
    sky: "#6E8BFF", skyHi: "#9DB2FF", ground: "#E0C77A",
    magenta: "#B07CFF", magentaDim: "#2A1F4A",
    amber: "#F0B43A", amberDim: "#3A2E0E",
    green: "#34C07E", greenDim: "#103726",
    red: "#E0594E", redDim: "#361A18",
    coral: "#FF8A5B", coralDim: "#33231A",
    violet: "#9B8CF0", violetDim: "#221F44",
    sand: "#E0C77A", sandDim: "#34301E",
    teal: "#3FC8D6",
    shadow: "0 12px 34px rgba(0,0,0,0.6)"
  },
  light: {
    name: "light",
    bg: "#EEF1FB", bg2: "#FFFFFF", panel: "#FFFFFF", panelHi: "#F1F4FE",
    line: "#D8DEF0", lineSoft: "#E7ECF8",
    text: "#161B33", textDim: "#3F4A6B", textFaint: "#6E7BA3",
    sky: "#3B53D6", skyHi: "#27379E", ground: "#7A5A2E",
    magenta: "#7A4FC4", magentaDim: "#E3DCF6",
    amber: "#9A6A0A", amberDim: "#F3E8C6",
    green: "#167A4E", greenDim: "#CDEBD9",
    red: "#B23A2C", redDim: "#F3D9D4",
    coral: "#C2632F", coralDim: "#F4DECC",
    violet: "#5B4FC4", violetDim: "#E0DCF6",
    sand: "#7A5A2E", sandDim: "#EFE7CE",
    teal: "#0E7E96",
    shadow: "0 10px 26px rgba(16,22,51,0.16)"
  }
};'''
block_replace(r'var THEMES = \{.*?\n\};', themes_js, "THEMES")

# SOURCES
sources_js = '''var SOURCES = {
  nasa: { label: "NASA", url: "https://www.nasa.gov/" },
  nasaplanets: { label: "NASA Solar System Exploration", url: "https://science.nasa.gov/solar-system/" },
  nasaexo: { label: "NASA Exoplanet Exploration", url: "https://science.nasa.gov/exoplanets/" },
  jpl: { label: "NASA Jet Propulsion Laboratory", url: "https://www.jpl.nasa.gov/" },
  esa: { label: "European Space Agency", url: "https://www.esa.int/" },
  esahubble: { label: "ESA/Hubble & NASA", url: "https://esahubble.org/" },
  esawebb: { label: "ESA/Webb", url: "https://esawebb.org/" },
  iau: { label: "International Astronomical Union", url: "https://www.iau.org/" },
  amsmeteors: { label: "American Meteor Society", url: "https://www.amsmeteors.org/" },
  noirlab: { label: "NSF NOIRLab", url: "https://noirlab.edu/" },
  stsci: { label: "Space Telescope Science Institute", url: "https://www.stsci.edu/" }
};'''
block_replace(r'var SOURCES = \{.*?\n\};', sources_js, "SOURCES")

# TRACKS
tracks_js = '''var TRACKS = [
  { id: "foundations", label: "Cosmic Foundations", tint: "sky", blurb: "The night sky, light, distance, scale and gravity." },
  { id: "ecology", label: "Orbits & Gravity", tint: "green", blurb: "Orbits, Kepler's laws, tides, seasons and eclipses." },
  { id: "flora", label: "The Solar System", tint: "teal", blurb: "The Sun, planets, moons, asteroids and comets." },
  { id: "fauna", label: "Stars & Constellations", tint: "coral", blurb: "Stars, their life cycles and the 88 constellations." },
  { id: "geology", label: "Galaxies & Deep Sky", tint: "sand", blurb: "Galaxies, nebulae and star clusters." },
  { id: "habitats", label: "Cosmology & Exotica", tint: "violet", blurb: "The Big Bang, dark matter, black holes and exoplanets." },
  { id: "conservation", label: "Missions & Spacecraft", tint: "amber", blurb: "Rockets, probes, rovers and great telescopes." },
  { id: "methods", label: "Skywatching, History & Careers", tint: "magenta", blurb: "Observing the sky, its history and how to take part." }
];'''
block_replace(r'var TRACKS = \[.*?\n\];', tracks_js, "TRACKS")

# LESSON_ART -> {}
block_replace(r'var LESSON_ART = \{.*?\n\};', 'var LESSON_ART = {};', "LESSON_ART")

# UNIT_PLAN -> generated concept units
_, plan = astro_concepts.build()
def js_units(plan):
    rows = []
    for u in plan:
        ids = ", ".join('"%s"' % i for i in u["ids"])
        rows.append('  { id: %s, track: %s, level: %s, title: %s, subtitle: %s, ids: [%s] }' % (
            json.dumps(u["id"]), json.dumps(u["track"]), json.dumps(u["level"]),
            json.dumps(u["title"]), json.dumps(u["subtitle"]), ids))
    return "var UNIT_PLAN = [\n" + ",\n".join(rows) + "\n];"
block_replace(r'var UNIT_PLAN = \[.*?\n\];', js_units(plan), "UNIT_PLAN")

# OCEAN_TIPS (daily facts)
tips_js = '''var OCEAN_TIPS = [
  "On a clear, dark night far from city lights, you can see roughly 2,000 to 3,000 stars with just your eyes.",
  "Light from the Sun takes about eight minutes to reach Earth.",
  "The Moon drifts about 3.8 centimetres farther from Earth every year.",
  "A day on Venus lasts longer than its whole year, because it spins so slowly.",
  "There are more stars in the universe than grains of sand on all of Earth's beaches.",
  "Jupiter is so large that every other planet could fit inside it with room to spare.",
  "Neutron stars are so dense that a teaspoon of one would weigh about a billion tonnes.",
  "Footprints left by Apollo astronauts on the Moon could last for millions of years."
];'''
block_replace(r'var OCEAN_TIPS = \[.*?\n\];', tips_js, "OCEAN_TIPS")

# INTEREST_OPTIONS
interest_js = '''var INTEREST_OPTIONS = [
  "Planets & moons", "Stars & constellations", "Galaxies & nebulae", "Black holes & cosmology",
  "Space missions", "Telescopes", "Skywatching", "Space careers"
];'''
block_replace(r'var INTEREST_OPTIONS = \[.*?\n\];', interest_js, "INTEREST_OPTIONS")

# relCurated -> astronomy relationship questions
rel_js = '''function relCurated() {
  return [
    { q: "Which planet is famous for its bright, icy rings?", choices: ["Saturn", "Mars", "Venus", "Mercury"], answer: 0, why: "Saturn's dazzling rings are made of countless chunks of ice and rock." },
    { q: "The Moon shines in our sky by reflecting light from the \\u2014?", choices: ["Sun", "Earth", "other stars", "itself"], answer: 0, why: "The Moon makes no light of its own; it reflects sunlight." },
    { q: "A light-year is a measure of \\u2014?", choices: ["distance", "time", "brightness", "weight"], answer: 0, why: "A light-year is how far light travels in a year, a distance." },
    { q: "Which force keeps the planets orbiting the Sun?", choices: ["Gravity", "Magnetism", "Wind", "Friction"], answer: 0, why: "Gravity holds the planets in their orbits around the Sun." },
    { q: "What sits at the center of our Solar System?", choices: ["The Sun", "Earth", "The Moon", "Jupiter"], answer: 0, why: "The Sun lies at the center, holding the Solar System together." },
    { q: "A Sun-like star makes energy by fusing hydrogen into \\u2014?", choices: ["Helium", "Iron", "Oxygen", "Gold"], answer: 0, why: "Stars fuse hydrogen into helium in their cores." },
    { q: "Which galaxy do we live in?", choices: ["The Milky Way", "Andromeda", "The Whirlpool", "The Sombrero"], answer: 0, why: "Our Solar System sits within the Milky Way galaxy." },
    { q: "What do we call a moon's looping path around its planet?", choices: ["An orbit", "A tail", "A crater", "A phase"], answer: 0, why: "The curved path one body takes around another is an orbit." },
    { q: "Which dwarf planet was once called the ninth planet?", choices: ["Pluto", "Ceres", "Eris", "Vesta"], answer: 0, why: "Pluto was reclassified from planet to dwarf planet in 2006." },
    { q: "Which spacecraft has flown out into interstellar space?", choices: ["Voyager 1", "Curiosity", "Hubble", "Apollo 11"], answer: 0, why: "Voyager 1 is the most distant human-made object, now in interstellar space." },
    { q: "A region of space where gravity traps even light is a \\u2014?", choices: ["Black hole", "Nebula", "Comet", "Cluster"], answer: 0, why: "Nothing, not even light, can escape a black hole." },
    { q: "Which telescope sees in infrared to study the first galaxies?", choices: ["James Webb", "Arecibo", "LIGO", "The VLA"], answer: 0, why: "The James Webb Space Telescope observes in infrared light." },
    { q: "What mainly causes the ocean tides on Earth?", choices: ["The Moon's gravity", "The wind", "Sunlight", "Earth's spin"], answer: 0, why: "The Moon's gravity raises the ocean tides." },
    { q: "A 'shooting star' is really a bit of space dust burning up in the \\u2014?", choices: ["atmosphere", "ocean", "Sun", "Moon"], answer: 0, why: "Meteors are dust grains burning up in Earth's atmosphere." },
    { q: "Which planet is known as the 'red planet'?", choices: ["Mars", "Jupiter", "Neptune", "Mercury"], answer: 0, why: "Iron oxide (rust) gives Mars its reddish colour." }
  ];
}'''
block_replace(r'function relCurated\(\) \{.*?\n\}', rel_js, "relCurated")

open(OUT_JSX, "w", encoding="utf-8").write(src)
print("\nWROTE", OUT_JSX, "bytes", len(src))
