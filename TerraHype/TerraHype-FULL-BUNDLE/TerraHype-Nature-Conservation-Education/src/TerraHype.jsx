/* ============================================================================
   SeaHype Marine Biology Education — a free, openly accessible marine-biology
   study website (operator alias: openMarineDB).
   Single-file React (global React/ReactDOM UMD harness; no JSX syntax — all
   React.createElement via the alias h).

   PARSER RULES (strict): no optional-chaining operator, no nullish-coalescing
   operator, no let/const (var only), no object spread, no regex literals inside
   map/filter/forEach callbacks, function-syntax event handlers.

   DATA ARCHITECTURE: every lesson, quiz, glossary entry, pronunciation, taxon,
   concept, career, history item and milestone is a modular record kept in
   sibling data files (seahype-lessons*.js, seahype-content.js) and merged onto
   window at build time, so content can be edited without touching the engine.

   PERSISTENCE: 100% local. safeStorage wraps localStorage and degrades to an
   in-memory store if storage is unavailable (e.g. a sandboxed preview).

   COMPLIANCE: this is a study and reference tool, NOT a substitute for
   accredited coursework, fieldwork, or scientific-diving certification.
   ========================================================================== */

var h = React.createElement;
var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;
var useMemo = React.useMemo;

/* ---------------------------------------------------------------- storage -- */
var safeStorage = (function () {
  var mem = {};
  var ok = false;
  try {
    var k = "__sea_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    ok = true;
  } catch (e) {
    ok = false;
  }
  return {
    get: function (key) {
      try { if (ok) return window.localStorage.getItem(key); } catch (e) {}
      if (Object.prototype.hasOwnProperty.call(mem, key)) return mem[key];
      return null;
    },
    set: function (key, val) {
      try { if (ok) { window.localStorage.setItem(key, val); return; } } catch (e) {}
      mem[key] = val;
    },
    remove: function (key) {
      try { if (ok) window.localStorage.removeItem(key); } catch (e) {}
      delete mem[key];
    },
    persistent: ok
  };
})();

/* Storage key is locked: renaming the brand must NOT change this, or saved
   progress is lost. */
var STORE_KEY = "terrahype_nature_v1";

function loadState() {
  var raw = safeStorage.get(STORE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}
function saveState(state) {
  try { safeStorage.set(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* ------------------------------------------------------------------ theme -- */
var THEMES = {
  dark: {
    name: "dark",
    bg: "#0C1810", bg2: "#11231A", panel: "#15291D", panelHi: "#1B3527",
    line: "#2A4A36", lineSoft: "#1F3A2B",
    text: "#EAF3EC", textDim: "#A8C4B3", textFaint: "#6E8B79",
    sky: "#57B65E", skyHi: "#7AD680", ground: "#B58A52",
    magenta: "#2FB8A0", magentaDim: "#0E3E38",
    amber: "#E8B23A", amberDim: "#3A2E0E",
    green: "#34C07E", greenDim: "#103726",
    red: "#E0594E", redDim: "#361A18",
    coral: "#E08A5B", coralDim: "#33231A",
    violet: "#9B8CF0", violetDim: "#221F44",
    sand: "#D9C089", sandDim: "#34301E",
    teal: "#2FB8A0",
    shadow: "0 12px 34px rgba(0,0,0,0.55)"
  },
  light: {
    name: "light",
    bg: "#EDF3EA", bg2: "#FFFFFF", panel: "#FFFFFF", panelHi: "#F1F7EE",
    line: "#D7E5D3", lineSoft: "#E7F0E3",
    text: "#14361F", textDim: "#3F5D49", textFaint: "#6E8B79",
    sky: "#2E8B40", skyHi: "#1E6E30", ground: "#7A5A2E",
    magenta: "#0E8A78", magentaDim: "#C7ECE6",
    amber: "#9A6A0A", amberDim: "#F3E8C6",
    green: "#167A4E", greenDim: "#CDEBD9",
    red: "#B23A2C", redDim: "#F3D9D4",
    coral: "#B5632F", coralDim: "#F1DECC",
    violet: "#5B4FC4", violetDim: "#E0DCF6",
    sand: "#7A5A2E", sandDim: "#EFE7CE",
    teal: "#0E8A78",
    shadow: "0 10px 26px rgba(20,54,31,0.14)"
  }
};

var SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif";
var MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace";

/* Display brand — safe to rename in one place. STORE_KEY above stays fixed. */
var BRAND = "TerraHype Nature Conservation Education";
var BRAND_SHORT = "TerraHype";
var TAGLINE = "Bite-sized lessons for future nature conservationists";
var PRAISE_WORDS = ["Nice work!", "You got it!", "Nailed it!", "Yes!", "Way to go!", "Boom!"];
var TRYAGAIN_WORDS = ["Not quite", "So close!", "Almost!", "Good try"];
function praiseWord(n) { if (!n || n < 0) n = 0; return PRAISE_WORDS[Math.floor(n) % PRAISE_WORDS.length]; }
function tryAgainWord(n) { if (!n || n < 0) n = 0; return TRYAGAIN_WORDS[Math.floor(n) % TRYAGAIN_WORDS.length]; }
var OPERATOR = "openNatureDB";

/* small style-merge helper (no object spread) */
function sx() {
  var out = {};
  for (var i = 0; i < arguments.length; i++) {
    var o = arguments[i];
    if (!o) continue;
    for (var k in o) {
      if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = o[k];
    }
  }
  return out;
}

/* ---------------------------------------------------------------- helpers -- */
function todayStr() {
  var d = new Date();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
}
function dayDiff(aStr, bStr) {
  if (!aStr || !bStr) return null;
  var a = new Date(aStr + "T00:00:00");
  var b = new Date(bStr + "T00:00:00");
  var ms = b.getTime() - a.getTime();
  return Math.round(ms / 86400000);
}
function clamp(n, lo, hi) { if (n < lo) return lo; if (n > hi) return hi; return n; }
function pct(a, b) { if (!b) return 0; return Math.round((a / b) * 100); }
function uid() { return "id" + Math.random().toString(36).slice(2, 9); }

/* Responsive viewport hook. Drives phone / tablet / desktop layouts so the same
   app maps cleanly onto a small phone, a tablet, or a wide desktop window. */
function getViewport() {
  var w = (typeof window !== "undefined" && window.innerWidth) ? window.innerWidth : 800;
  var phone = w < 640;
  var tablet = w >= 640 && w < 1024;
  var desktop = w >= 1024;
  return {
    w: w, phone: phone, tablet: tablet, desktop: desktop,
    contentW: desktop ? 860 : (tablet ? 720 : 640),
    wideW: desktop ? 1040 : (tablet ? 760 : 640),
    readW: desktop ? 720 : (tablet ? 680 : 640),
    cols: desktop ? 3 : (tablet ? 2 : 1),
    gutter: desktop ? 248 : 0
  };
}
function useViewport() {
  var vpState = useState(getViewport);
  var vp = vpState[0], setVp = vpState[1];
  useEffect(function () {
    function onResize() { setVp(getViewport()); }
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("resize", onResize);
      return function () { window.removeEventListener("resize", onResize); };
    }
    return undefined;
  }, []);
  return vp;
}
/* App sets ACTIVE_VP at the top of each render; screens read it via vpNow(). */
var ACTIVE_VP = getViewport();
function vpNow() { return ACTIVE_VP; }

/* ------------------------------------------------------------- illustrations -- */
/* Original embedded vector artwork (window.SEA_ART). Each lesson maps to a
   relevant scene; tracks supply a fallback so every screen has imagery. */
var LESSON_ART = {
  "terra-intro": "forest", "what-is-ecosystem": "forest", "biomes-overview": "mountain",
  "soil-basics": "soil", "water-cycle": "river", "watersheds": "river",
  "energy-flow": "meadow", "producers": "wildflower", "food-webs-land": "forest", "biodiversity-land": "meadow",
  "succession": "forest", "keystone": "beaver",
  "plant-parts": "wildflower", "photosynthesis-land": "fern", "trees-anatomy": "oak", "forest-layers": "forest",
  "fungi-lichen": "mushroom", "native-invasive-plants": "meadow",
  "animal-kingdom-land": "deer", "mammals-intro": "fox", "birds-intro": "owl",
  "reptiles-amphibians": "frog", "insects-intro": "butterfly", "animal-tracks": "deer",
  "geology-intro": "mineral", "rock-cycle": "mineral", "minerals-intro": "mineral",
  "igneous": "mountain", "sedimentary": "desert", "metamorphic": "mineral",
  "erosion-weathering": "river", "geologic-time": "fossil",
  "forest-biome": "forest", "grassland-biome": "grassland",
  "wetland-biome": "wetland", "desert-biome": "desert", "mountain-biome": "mountain", "river-stream": "river",
  "why-conserve": "stewardship", "habitat-loss": "forest", "invasive-species": "meadow", "endangered-species": "deer",
  "fire-ecology": "forest", "restoration": "meadow", "stewardship": "stewardship",
  "naturalist-skills": "fieldwork", "field-tools": "fieldwork", "surveys-monitoring": "fieldwork",
  "conservation-history": "stewardship", "careers-conservation": "fieldwork",
  "nutrient-cycles": "soil", "sun-and-seasons": "meadow", "scale-of-nature": "forest",
  "symbiosis": "forest", "predator-prey": "fox", "decomposition": "mushroom", "pollination": "butterfly",
  "seed-dispersal": "wildflower", "leaf-id": "oak", "mosses-ferns": "fern",
  "migration": "bird", "hibernation-dormancy": "fox", "camouflage-mimicry": "reptile", "metamorphosis": "frog",
  "landforms": "mountain", "caves-karst": "cave", "volcanoes-plates": "mountain",
  "tundra-biome": "tundra", "coastal-estuary": "coast", "pond-vs-lake": "pond",
  "climate-change": "stewardship", "pollution-land-water": "river", "protected-areas": "mountain",
  "using-field-guide": "fieldwork", "citizen-science": "fieldwork"
};
var TRACK_ART = { foundations: "river", ecology: "forest", flora: "forest", fauna: "deer", geology: "mineral", habitats: "wetland", conservation: "stewardship", methods: "fieldwork" };
function artFor(id, track) {
  if (id && LESSON_ART[id]) return LESSON_ART[id];
  if (track && TRACK_ART[track]) return TRACK_ART[track];
  return "forest";
}
function Illus(props) {
  var name = props.name;
  var svg = (typeof window !== "undefined" && window.SEA_ART && window.SEA_ART[name]) ? window.SEA_ART[name] : "";
  var ar = props.ar ? props.ar : "16 / 10";
  var radius = props.radius != null ? props.radius : 14;
  return h("div", {
    role: "img", "aria-label": props.label ? props.label : "",
    style: sx({ width: "100%", aspectRatio: ar, minHeight: props.minH ? props.minH : 0, borderRadius: radius, overflow: "hidden", background: "#16291D", position: "relative", lineHeight: 0 }, props.style),
    dangerouslySetInnerHTML: { __html: svg }
  });
}
// Real photo if one has been supplied for this lesson id, else the vector illustration.
function PHOTO(id) {
  return (typeof window !== "undefined" && window.__SEA_PHOTOS__ && id && window.__SEA_PHOTOS__[id]) ? window.__SEA_PHOTOS__[id] : null;
}
function Media(props) {
  var src = PHOTO(props.id);
  if (!src) {
    return h(Illus, { name: props.name, ar: props.ar, radius: props.radius, label: props.label, minH: props.minH, style: props.style });
  }
  var ar = props.ar ? props.ar : "16 / 10";
  var radius = props.radius != null ? props.radius : 14;
  return h("div", {
    role: "img", "aria-label": props.label ? props.label : "",
    style: sx({ width: "100%", aspectRatio: ar, minHeight: props.minH ? props.minH : 0, borderRadius: radius, overflow: "hidden", background: "#16291D", position: "relative", lineHeight: 0 }, props.style)
  }, h("img", { src: src, alt: props.label ? props.label : "", loading: "lazy", style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }));
}

// ---- Runtime species photos ----
// When the page is viewed online, each species lesson pulls a real photo from
// Wikimedia (which species articles almost always have, watermark-free). Results
// are cached in the browser. If offline or unavailable, the illustration shows.
function QUERY(id) {
  return (typeof window !== "undefined" && window.__SEA_QUERIES__ && id && window.__SEA_QUERIES__[id]) ? window.__SEA_QUERIES__[id] : null;
}
var PHOTO_CACHE_KEY = "seahype_photocache_v1";
function photoCacheGet(id) {
  try {
    var raw = window.localStorage.getItem(PHOTO_CACHE_KEY);
    if (!raw) return undefined;
    var m = JSON.parse(raw);
    return (m && Object.prototype.hasOwnProperty.call(m, id)) ? m[id] : undefined;
  } catch (e) { return undefined; }
}
function photoCacheSet(id, val) {
  try {
    var raw = window.localStorage.getItem(PHOTO_CACHE_KEY);
    var m = raw ? JSON.parse(raw) : {};
    m[id] = val;
    window.localStorage.setItem(PHOTO_CACHE_KEY, JSON.stringify(m));
  } catch (e) {}
}
function upscaleThumb(u) {
  if (!u) return u;
  var i = u.indexOf("px-");
  if (i < 0) return u;
  var j = i;
  while (j > 0 && u.charCodeAt(j - 1) >= 48 && u.charCodeAt(j - 1) <= 57) j--;
  if (j === i) return u;
  return u.slice(0, j) + "512" + u.slice(i);
}
function resolvePhoto(q, cb) {
  if (typeof fetch === "undefined") { cb(null); return; }
  var url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(q);
  fetch(url, { headers: { accept: "application/json" } }).then(function (r) {
    return r.ok ? r.json() : null;
  }).then(function (j) {
    if (!j) { cb(null); return; }
    var src = (j.thumbnail && j.thumbnail.source) ? j.thumbnail.source : ((j.originalimage && j.originalimage.source) ? j.originalimage.source : null);
    var page = (j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page) ? j.content_urls.desktop.page : null;
    if (!src) { cb(null); return; }
    cb({ src: upscaleThumb(src), page: page });
  }).catch(function () { cb(null); });
}
function SpeciesPhoto(props) {
  var baked = PHOTO(props.id);
  var cached = baked ? null : photoCacheGet(props.id);
  var init = baked ? { src: baked, page: null } : (cached ? cached : null);
  var st = useState(init);
  var data = st[0]; var setData = st[1];
  var fl = useState(false); var failed = fl[0]; var setFailed = fl[1];
  useEffect(function () {
    if (baked || data || cached === null) return;
    var q = QUERY(props.id);
    if (!q) return;
    var live = true;
    resolvePhoto(q, function (res) {
      photoCacheSet(props.id, res ? res : null);
      if (live && res) setData(res);
    });
    return function () { live = false; };
  }, [props.id]);
  if (!data || failed) {
    return h(Illus, { name: props.name, ar: props.ar, radius: props.radius, label: props.label, minH: props.minH, style: props.style });
  }
  var ar = props.ar ? props.ar : "16 / 10";
  var radius = props.radius != null ? props.radius : 14;
  return h("div", {
    role: "img", "aria-label": props.label ? props.label : "",
    style: sx({ width: "100%", aspectRatio: ar, minHeight: props.minH ? props.minH : 0, borderRadius: radius, overflow: "hidden", background: "#16291D", position: "relative", lineHeight: 0 }, props.style)
  },
    h("img", { src: data.src, alt: props.label ? props.label : "", loading: "lazy", onError: function () { setFailed(true); }, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }),
    data.page ? h("a", { href: data.page, target: "_blank", rel: "noopener noreferrer", title: "Photo via Wikimedia Commons",
      style: { position: "absolute", right: 6, bottom: 5, fontSize: 9.5, lineHeight: 1, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "2px 5px", borderRadius: 6, textDecoration: "none", letterSpacing: 0.2 } }, "Wikimedia") : null
  );
}

/* XP / trail-level system. Climbing higher means more advanced. */
var XP_PER_LEVEL = 120;
var ZONE_NAMES = [
  "Trailhead", "Meadow", "Foothills", "Woodland", "Ridgeline", "Highlands", "Summit", "Wilderness"
];
function levelInfo(xp) {
  if (!xp || xp < 0) xp = 0;
  var lvl = Math.floor(xp / XP_PER_LEVEL) + 1;
  var into = xp - (lvl - 1) * XP_PER_LEVEL;
  var name;
  if (lvl <= ZONE_NAMES.length) name = ZONE_NAMES[lvl - 1];
  else name = "Deep Explorer";
  return { level: lvl, name: name, into: into, need: XP_PER_LEVEL, pct: pct(into, XP_PER_LEVEL) };
}

/* ---------------------------------------------------------------- sources -- */
var SOURCES = {
  usgs: { label: "USGS", url: "https://www.usgs.gov/" },
  usfs: { label: "USDA Forest Service", url: "https://www.fs.usda.gov/" },
  nps: { label: "National Park Service", url: "https://www.nps.gov/" },
  usfws: { label: "U.S. Fish & Wildlife Service", url: "https://www.fws.gov/" },
  nrcs: { label: "USDA Natural Resources Conservation Service", url: "https://www.nrcs.usda.gov/" },
  epa: { label: "U.S. EPA", url: "https://www.epa.gov/" },
  usda: { label: "USDA PLANTS Database", url: "https://plants.usda.gov/" },
  cornell: { label: "Cornell Lab — All About Birds", url: "https://www.allaboutbirds.org/" },
  audubon: { label: "National Audubon Society", url: "https://www.audubon.org/" },
  nwf: { label: "National Wildlife Federation", url: "https://www.nwf.org/" },
  iucn: { label: "IUCN Red List", url: "https://www.iucnredlist.org/" },
  si: { label: "Smithsonian — Natural History", url: "https://naturalhistory.si.edu/" },
  eol: { label: "Encyclopedia of Life", url: "https://eol.org/" },
  natgeo: { label: "National Geographic Education", url: "https://education.nationalgeographic.org/" },
  nasa: { label: "NASA Earth Observatory", url: "https://earthobservatory.nasa.gov/" },
  noaa: { label: "NOAA — climate & weather", url: "https://www.climate.gov/" }
};
function srcOf(key) {
  if (key && Object.prototype.hasOwnProperty.call(SOURCES, key)) return SOURCES[key];
  return null;
}

/* ----------------------------------------------------------------- tracks -- */
var TRACKS = [
  { id: "foundations", label: "Land Foundations", tint: "sky", blurb: "Soil, water, watersheds, biomes and climate." },
  { id: "ecology", label: "Ecology & Food Webs", tint: "green", blurb: "Energy, producers, food webs and biodiversity." },
  { id: "flora", label: "Vegetation & Flora", tint: "teal", blurb: "Trees, shrubs, grasses, wildflowers and fungi." },
  { id: "fauna", label: "Wildlife & Fauna", tint: "coral", blurb: "Mammals, birds, reptiles, amphibians and insects." },
  { id: "geology", label: "Geology & Soils", tint: "sand", blurb: "Rocks, minerals, landforms and geologic time." },
  { id: "habitats", label: "Habitats & Biomes", tint: "violet", blurb: "Forests, grasslands, wetlands, deserts and rivers." },
  { id: "conservation", label: "Conservation & Stewardship", tint: "amber", blurb: "Threats to wild land and how it recovers." },
  { id: "methods", label: "Field Skills, History & Careers", tint: "magenta", blurb: "How nature is studied — and how to join the field." }
];
function trackById(id) {
  for (var i = 0; i < TRACKS.length; i++) { if (TRACKS[i].id === id) return TRACKS[i]; }
  return { id: id, label: id, tint: "sky", blurb: "" };
}
function trackColor(t, id) {
  var tr = trackById(id);
  var key = tr.tint;
  if (t && Object.prototype.hasOwnProperty.call(t, key)) return t[key];
  return t.sky;
}

/* --------------------------------------------------------------- data refs -- */
function LESSONS() { return (typeof window !== "undefined" && window.__SEA_LESSONS__) ? window.__SEA_LESSONS__ : {}; }
function GLOSSARY() { return (typeof window !== "undefined" && window.__SEA_GLOSSARY__) ? window.__SEA_GLOSSARY__ : []; }
function PRON() { return (typeof window !== "undefined" && window.__SEA_PRON__) ? window.__SEA_PRON__ : []; }
function TAXONOMY() { return (typeof window !== "undefined" && window.__SEA_TAXONOMY__) ? window.__SEA_TAXONOMY__ : []; }
function CONCEPTS() { return (typeof window !== "undefined" && window.__SEA_CONCEPTS__) ? window.__SEA_CONCEPTS__ : []; }
function CAREERS() { return (typeof window !== "undefined" && window.__SEA_CAREERS__) ? window.__SEA_CAREERS__ : []; }
function HISTORY() { return (typeof window !== "undefined" && window.__SEA_HISTORY__) ? window.__SEA_HISTORY__ : []; }
function MILESTONES() { return (typeof window !== "undefined" && window.__SEA_MILESTONES__) ? window.__SEA_MILESTONES__ : []; }
function SHELLS() { return (typeof window !== "undefined" && window.__SEA_SHELLS__) ? window.__SEA_SHELLS__ : []; }
function MARVELS() { return (typeof window !== "undefined" && window.__SEA_MARVELS__) ? window.__SEA_MARVELS__ : []; }
function histYear(s) {
  if (!s) return 0;
  s = "" + s;
  var bce = s.indexOf("BCE") > -1;
  var num = ""; var i;
  for (i = 0; i < s.length; i++) { var ch = s.charAt(i); if (ch >= "0" && ch <= "9") { num += ch; } else if (num.length) { break; } }
  var n = num.length ? parseInt(num, 10) : 0;
  return bce ? -n : n;
}

/* Roadmap: ordered units. Only lessons that actually exist are shown. */
var UNIT_PLAN = [
  { id: "u-found-1", track: "foundations", level: "Foundations", title: "What Conservation Is", subtitle: "The big picture and the living web of a place", ids: ["terra-intro", "what-is-ecosystem", "biomes-overview"] },
  { id: "u-found-2", track: "foundations", level: "Foundations", title: "Soil, Water & Watersheds", subtitle: "The ground beneath, and the water that shapes it", ids: ["soil-basics", "water-cycle", "watersheds"] },
  { id: "u-found-3", track: "foundations", level: "Core", title: "Cycles, Sun & Scale", subtitle: "How nutrients and energy move, and the sizes of nature", ids: ["nutrient-cycles", "sun-and-seasons", "scale-of-nature"] },
  { id: "u-ecol-1", track: "ecology", level: "Core", title: "How Ecosystems Work", subtitle: "Energy, producers and the web of life", ids: ["energy-flow", "producers", "food-webs-land", "biodiversity-land"] },
  { id: "u-ecol-2", track: "ecology", level: "Core", title: "Change & Connection", subtitle: "Succession and the species that hold it together", ids: ["succession", "keystone"] },
  { id: "u-ecol-3", track: "ecology", level: "Core", title: "Relationships in Nature", subtitle: "Partners, hunters, recyclers and pollinators", ids: ["symbiosis", "predator-prey", "decomposition", "pollination"] },
  { id: "u-flora-1", track: "flora", level: "Foundations", title: "How Plants Live", subtitle: "Parts, food-making and the shape of a forest", ids: ["plant-parts", "photosynthesis-land", "trees-anatomy", "forest-layers"] },
  { id: "u-flora-2", track: "flora", level: "Core", title: "Fungi & Plant Health", subtitle: "Recyclers, and natives versus invaders", ids: ["fungi-lichen", "native-invasive-plants"] },
  { id: "u-flora-3", track: "flora", level: "Core", title: "Spreading & Knowing Plants", subtitle: "Seed travel, leaf ID and the spore plants", ids: ["seed-dispersal", "leaf-id", "mosses-ferns"] },
  { id: "u-fauna-1", track: "fauna", level: "Foundations", title: "The Animal Kingdom", subtitle: "The major groups of land animals", ids: ["animal-kingdom-land", "mammals-intro", "birds-intro"] },
  { id: "u-fauna-2", track: "fauna", level: "Core", title: "Cold-Blooded & Six-Legged", subtitle: "Reptiles, amphibians, insects and reading their signs", ids: ["reptiles-amphibians", "insects-intro", "animal-tracks"] },
  { id: "u-fauna-3", track: "fauna", level: "Core", title: "Animal Survival", subtitle: "Migration, winter survival, disguise and changing bodies", ids: ["migration", "hibernation-dormancy", "camouflage-mimicry", "metamorphosis"] },
  { id: "u-geo-1", track: "geology", level: "Foundations", title: "Rocks & Minerals", subtitle: "What the ground is made of, and how it cycles", ids: ["geology-intro", "rock-cycle", "minerals-intro"] },
  { id: "u-geo-2", track: "geology", level: "Core", title: "The Three Rock Families", subtitle: "Igneous, sedimentary and metamorphic", ids: ["igneous", "sedimentary", "metamorphic"] },
  { id: "u-geo-3", track: "geology", level: "Core", title: "Shaping the Land", subtitle: "Erosion, landforms and deep time", ids: ["erosion-weathering", "geologic-time"] },
  { id: "u-geo-4", track: "geology", level: "Core", title: "Forces That Shape Earth", subtitle: "Landforms, caves and restless plates", ids: ["landforms", "caves-karst", "volcanoes-plates"] },
  { id: "u-hab-1", track: "habitats", level: "Core", title: "Forests & Grasslands", subtitle: "The great green and golden biomes", ids: ["forest-biome", "grassland-biome"] },
  { id: "u-hab-2", track: "habitats", level: "Core", title: "Water & Dry Land", subtitle: "Wetlands, deserts, mountains and rivers", ids: ["wetland-biome", "desert-biome", "mountain-biome", "river-stream"] },
  { id: "u-hab-3", track: "habitats", level: "Core", title: "Edges & Still Waters", subtitle: "Tundra, coasts and estuaries, ponds and lakes", ids: ["tundra-biome", "coastal-estuary", "pond-vs-lake"] },
  { id: "u-cons-1", track: "conservation", level: "Core", title: "Threats to Wild Land", subtitle: "Habitat loss, invaders and endangered species", ids: ["why-conserve", "habitat-loss", "invasive-species", "endangered-species"] },
  { id: "u-cons-2", track: "conservation", level: "Core", title: "Healing the Land", subtitle: "Fire, restoration and everyday stewardship", ids: ["fire-ecology", "restoration", "stewardship"] },
  { id: "u-cons-3", track: "conservation", level: "Core", title: "Big Challenges & Safe Havens", subtitle: "Climate change, pollution and protected areas", ids: ["climate-change", "pollution-land-water", "protected-areas"] },
  { id: "u-meth-1", track: "methods", level: "Foundations", title: "Doing Field Science", subtitle: "Observation, tools and surveys", ids: ["naturalist-skills", "field-tools", "surveys-monitoring"] },
  { id: "u-meth-2", track: "methods", level: "Foundations", title: "History & Careers", subtitle: "Who built conservation, and how to join", ids: ["conservation-history", "careers-conservation"] },
  { id: "u-meth-3", track: "methods", level: "Foundations", title: "Identify & Contribute", subtitle: "Field guides, keys and citizen science", ids: ["using-field-guide", "citizen-science"] }
];
function buildUnits() {
  var L = LESSONS();
  var plan = UNIT_PLAN.slice();
  var extra = (typeof window !== "undefined" && window.__SEA_UNITS_EXTRA__) ? window.__SEA_UNITS_EXTRA__ : [];
  for (var e = 0; e < extra.length; e++) plan.push(extra[e]);
  var out = [];
  for (var i = 0; i < plan.length; i++) {
    var u = plan[i];
    var ids = [];
    for (var j = 0; j < u.ids.length; j++) {
      var id = u.ids[j];
      if (Object.prototype.hasOwnProperty.call(L, id)) ids.push(id);
    }
    if (ids.length) out.push({ id: u.id, track: u.track, level: u.level, title: u.title, subtitle: u.subtitle, ids: ids });
  }
  return out;
}
function allLessonIds() {
  var units = buildUnits();
  var ids = [];
  for (var i = 0; i < units.length; i++) {
    for (var j = 0; j < units[i].ids.length; j++) ids.push(units[i].ids[j]);
  }
  return ids;
}

/* ------------------------------------------------------------------ glyph -- */
function Glyph(props) {
  var name = props.name;
  var size = props.size ? props.size : 20;
  var color = props.color ? props.color : "currentColor";
  var sw = props.sw ? props.sw : 2;
  var common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  var paths = [];
  if (name === "home") paths = ["M3 11l9-8 9 8", "M5 10v10h14V10"];
  else if (name === "learn") paths = ["M4 5h11a3 3 0 0 1 3 3v11", "M4 5v12a3 3 0 0 0 3 3h11", "M4 5l7 3 7-3"];
  else if (name === "practice") paths = ["M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9-2.6.9-5.5-4-3.9L9.5 8z"];
  else if (name === "log") paths = ["M6 3h12v18H6z", "M9 7h6", "M9 11h6", "M9 15h4"];
  else if (name === "library") paths = ["M4 4h5v16H4z", "M10 4h5v16h-5z", "M16 5l4 1-3 15-4-1"];
  else if (name === "profile") paths = ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"];
  else if (name === "wave") paths = ["M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2", "M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"];
  else if (name === "fish") paths = ["M3 12c4-6 11-6 15 0-4 6-11 6-15 0z", "M18 12c2-1 3-1 3-3", "M18 12c2 1 3 1 3 3", "M8 11h.01"];
  else if (name === "check") paths = ["M5 13l4 4 10-11"];
  else if (name === "x") paths = ["M6 6l12 12", "M18 6L6 18"];
  else if (name === "star") paths = ["M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 18.7 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z"];
  else if (name === "lock") paths = ["M6 11h12v9H6z", "M9 11V8a3 3 0 0 1 6 0v3"];
  else if (name === "ext") paths = ["M14 4h6v6", "M20 4l-9 9", "M19 13v6H5V5h6"];
  else if (name === "play") paths = ["M7 5l11 7-11 7z"];
  else if (name === "back") paths = ["M15 5l-7 7 7 7"];
  else if (name === "search") paths = ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M20 20l-3.5-3.5"];
  else if (name === "book") paths = ["M5 4h10v16H8a3 3 0 0 0-3 3z", "M5 4v16"];
  else if (name === "depth") paths = ["M4 6h16", "M4 12h16", "M4 18h16", "M9 3v18"];
  else if (name === "anchor") paths = ["M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", "M12 5v15", "M5 12a7 7 0 0 0 14 0", "M5 12H3", "M21 12h-2"];
  else if (name === "spark") paths = ["M12 3v6", "M12 15v6", "M3 12h6", "M15 12h6"];
  else if (name === "reset") paths = ["M4 12a8 8 0 1 0 2.3-5.6", "M4 4v4h4"];
  else if (name === "ticket") paths = ["M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z", "M14 6v12"];
  else if (name === "flame") paths = ["M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-1.5.7-3 2-4 .3 1.2 1 2 2 2 0-2-1-4 1-7z"];
  else if (name === "arcade") paths = ["M7 9h10a4 4 0 0 1 4 4 3 3 0 0 1-5.2 2L15 14H9l-.8 1A3 3 0 0 1 3 13a4 4 0 0 1 4-4z", "M8 12v2.5", "M6.8 13.2h2.4", "M16 12h.01", "M17.6 13.6h.01"];
  else paths = ["M12 12h.01"];
  var kids = [];
  for (var i = 0; i < paths.length; i++) kids.push(h("path", { key: i, d: paths[i] }));
  return h("svg", common, kids);
}

/* -------------------------------------------------------------- brand logo -- */
/* Renders the official SeaHype coin logo (window.__SEA_LOGO__). Falls back to a
   simple inline mark if the asset is unavailable (e.g. headless tests). */
function BrandLogo(props) {
  var size = props.size ? props.size : 40;
  var uri = (typeof window !== "undefined" && window.__SEA_LOGO__) ? window.__SEA_LOGO__ : null;
  if (uri) {
    return h("img", {
      src: uri, alt: BRAND, width: size, height: size,
      style: sx({ width: size, height: size, display: "block", objectFit: "contain", borderRadius: "50%" }, props.style)
    });
  }
  return h("svg", { width: size, height: size, viewBox: "0 0 64 64", role: "img", "aria-label": "SeaHype", style: props.style },
    h("circle", { cx: 32, cy: 32, r: 30, fill: "#0A2A47" }),
    h("circle", { cx: 32, cy: 31, r: 20, fill: "none", stroke: "#9FD3E6", strokeWidth: 2.5 }),
    h("path", { d: "M14 37c3.2 0 3.2-2.7 6.4-2.7s3.2 2.7 6.4 2.7 3.2-2.7 6.4-2.7 3.2 2.7 6.4 2.7 3.2-2.7 6.4-2.7", fill: "none", stroke: "#1C82A6", strokeWidth: 3, strokeLinecap: "round" })
  );
}

/* --------------------------------------------------------------- primitives -- */
function Bar(props) {
  var t = props.t;
  var value = clamp(props.value ? props.value : 0, 0, 100);
  var color = props.color ? props.color : t.sky;
  var height = props.height ? props.height : 8;
  return h("div", { style: { background: t.lineSoft, borderRadius: 99, height: height, overflow: "hidden", width: "100%" } },
    h("div", { style: { width: value + "%", height: "100%", background: color, borderRadius: 99, transition: "width .4s ease" } })
  );
}
function Chip(props) {
  var t = props.t;
  var color = props.color ? props.color : t.textDim;
  return h("span", {
    style: sx({
      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700,
      color: color, background: props.bg ? props.bg : t.panelHi, border: "1px solid " + (props.border ? props.border : t.lineSoft),
      padding: "3px 9px", borderRadius: 99, letterSpacing: 0.2
    }, props.style)
  }, props.children);
}
function Btn(props) {
  var t = props.t;
  var kind = props.kind ? props.kind : "primary";
  var bg = t.sky, fg = "#fff", border = "transparent";
  if (kind === "primary") { bg = t.sky; fg = "#fff"; }
  else if (kind === "go") { bg = t.green; fg = "#04241A"; }
  else if (kind === "soft") { bg = t.panelHi; fg = t.text; border = t.line; }
  else if (kind === "ghost") { bg = "transparent"; fg = t.text; border = t.line; }
  else if (kind === "danger") { bg = t.red; fg = "#fff"; }
  var dis = props.disabled;
  return h("button", {
    onClick: dis ? null : props.onClick,
    disabled: dis ? true : false,
    style: sx({
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      fontFamily: SANS, fontSize: props.small ? 13.5 : 15, fontWeight: 800,
      padding: props.small ? "9px 14px" : "13px 18px", borderRadius: 13,
      background: bg, color: fg, border: "1px solid " + border,
      cursor: dis ? "default" : "pointer", opacity: dis ? 0.55 : 1,
      width: props.block ? "100%" : "auto",
      boxShadow: (kind === "primary" && !dis) ? "0 8px 20px rgba(43,166,214,0.28)" : "none"
    }, props.style)
  }, props.icon ? h(Glyph, { name: props.icon, size: props.small ? 16 : 18, color: fg }) : null, props.children);
}
function Card(props) {
  var t = props.t;
  return h("div", {
    onClick: props.onClick,
    role: props.onClick ? "button" : null,
    tabIndex: props.onClick ? 0 : null,
    onKeyDown: props.onClick ? function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); props.onClick(e); } } : null,
    style: sx({
      background: t.panel, border: "1px solid " + t.line, borderRadius: 16,
      padding: props.pad != null ? props.pad : 16, boxShadow: t.shadow,
      cursor: props.onClick ? "pointer" : "default"
    }, props.style)
  }, props.children);
}
function SectionLabel(props) {
  var t = props.t;
  return h("div", { style: { display: "flex", alignItems: "center", gap: 9, margin: props.tight ? "2px 0 8px" : "18px 0 10px" } },
    props.icon ? h(Glyph, { name: props.icon, size: 16, color: props.color ? props.color : t.textFaint }) : null,
    h("span", { style: { fontSize: 12.5, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: props.color ? props.color : t.textFaint } }, props.children)
  );
}
function SourceLink(props) {
  var t = props.t;
  var url = props.url;
  var label = props.label ? props.label : url;
  if (!url) return null;
  return h("a", {
    href: url, target: "_blank", rel: "noopener noreferrer",
    style: sx({
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
      color: t.sky, textDecoration: "none", background: t.panelHi, border: "1px solid " + t.lineSoft,
      padding: "6px 10px", borderRadius: 10, lineHeight: 1.2
    }, props.style)
  }, h(Glyph, { name: "ext", size: 13, color: t.sky }), label);
}
function ComplianceBanner(props) {
  var t = props.t;
  return h("div", {
    style: { background: t.amberDim, border: "1px solid " + t.amber, borderRadius: 12, padding: "10px 12px", fontSize: 12.5, lineHeight: 1.5, color: t.text }
  },
    h("b", { style: { color: t.amber } }, "Study & reference tool. "),
    "SeaHype presents original educational content with links to authoritative sources. It is not affiliated with NOAA, the Smithsonian, or any agency, and is not a substitute for accredited coursework, fieldwork, or scientific-diving certification. Always follow local laws and safety guidance, and never handle protected or dangerous marine life."
  );
}
function Modal(props) {
  var t = props.t;
  if (!props.open) return null;
  return h("div", {
    onClick: props.onClose,
    style: { position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }
  },
    h("div", {
      onClick: function (e) { e.stopPropagation(); },
      style: { width: "100%", maxWidth: 560, background: t.bg2, borderTopLeftRadius: 20, borderTopRightRadius: 20, border: "1px solid " + t.line, borderBottom: "none", padding: 18, maxHeight: "86vh", overflowY: "auto", boxShadow: "0 -16px 50px rgba(0,0,0,0.5)" }
    },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
        h("div", { style: { fontWeight: 800, fontSize: 16, color: t.text } }, props.title),
        h("button", { onClick: props.onClose, style: { background: "none", border: "none", cursor: "pointer", padding: 4 } }, h(Glyph, { name: "x", size: 20, color: t.textDim }))
      ),
      props.children
    )
  );
}

/* ============================================================ ONBOARDING == */
var INTEREST_OPTIONS = [
  "Trees & forests", "Birds", "Mammals", "Wildflowers & plants",
  "Rocks & fossils", "Insects & bugs", "Conservation", "Nature careers"
];
function Onboarding(props) {
  var t = props.t;
  var prefill = (typeof window !== "undefined" && window.__seaPrefill && window.__seaPrefill.name) ? window.__seaPrefill.name : "";
  var nameState = useState(prefill);
  var name = nameState[0], setName = nameState[1];
  var levelState = useState("teen");
  var level = levelState[0], setLevel = levelState[1];
  var intsState = useState([]);
  var ints = intsState[0], setInts = intsState[1];
  var goalState = useState("");
  var goal = goalState[0], setGoal = goalState[1];
  var stepState = useState(0);
  var step = stepState[0], setStep = stepState[1];

  function toggleInt(opt) {
    var next = [];
    var found = false;
    for (var i = 0; i < ints.length; i++) {
      if (ints[i] === opt) found = true;
      else next.push(ints[i]);
    }
    if (!found) next.push(opt);
    setInts(next);
  }
  function finish() {
    props.onDone({ name: name ? name.trim() : "", level: level, interests: ints, goal: goal });
  }

  var levels = [
    { id: "junior", label: "Just exploring", note: "New to nature — keep it friendly" },
    { id: "teen", label: "Building my knowledge", note: "I know some and want to learn more" },
    { id: "adult", label: "Going deep", note: "Bring on the details" }
  ];

  var head = h("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "6px 0 14px" } },
    h(BrandLogo, { size: 46 }),
    h("div", null,
      h("div", { style: { fontWeight: 900, fontSize: 19, color: t.text } }, BRAND_SHORT),
      h("div", { style: { fontSize: 12.5, color: t.textDim } }, TAGLINE)
    )
  );

  var body;
  if (step === 0) {
    body = h("div", null,
      h("h1", { style: { fontSize: 22, fontWeight: 900, color: t.text, margin: "8px 0 6px" } }, "Welcome aboard"),
      h("p", { style: { fontSize: 14.5, lineHeight: 1.6, color: t.textDim, margin: "0 0 16px" } },
        "Welcome to TerraHype! Explore the wild land in short lessons — from towering trees and wildflowers to bears, owls, and the rocks beneath your feet. Each lesson ends with a quick quiz so the cool facts stick. It's free, works offline, and stays on your device."),
      h("label", { style: { display: "block", fontSize: 13, fontWeight: 700, color: t.text, margin: "0 0 7px" } }, "What should we call you?"),
      h("input", {
        value: name, onChange: function (e) { setName(e.target.value); }, placeholder: "Your name (optional)",
        style: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontSize: 15, fontFamily: SANS, outline: "none", boxSizing: "border-box" }
      }),
      h("div", { style: { marginTop: 18 } }, h(Btn, { t: t, block: true, icon: "wave", onClick: function () { setStep(1); } }, "Get started"))
    );
  } else if (step === 1) {
    body = h("div", null,
      h("h1", { style: { fontSize: 21, fontWeight: 900, color: t.text, margin: "8px 0 4px" } }, "How would you describe yourself?"),
      h("p", { style: { fontSize: 13.5, color: t.textDim, margin: "0 0 14px" } }, "This just sets the vibe — every lesson teaches the same real science."),
      levels.map(function (lv) {
        var on = level === lv.id;
        return h("div", {
          key: lv.id, onClick: function () { setLevel(lv.id); },
          style: { border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.panelHi : t.panel, borderRadius: 14, padding: "13px 14px", marginBottom: 10, cursor: "pointer" }
        },
          h("div", { style: { fontWeight: 800, fontSize: 15, color: on ? t.sky : t.text } }, lv.label),
          h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 2 } }, lv.note)
        );
      }),
      h("div", { style: { display: "flex", gap: 10, marginTop: 8 } },
        h(Btn, { t: t, kind: "ghost", icon: "back", onClick: function () { setStep(0); } }, "Back"),
        h(Btn, { t: t, block: true, onClick: function () { setStep(2); } }, "Continue")
      )
    );
  } else {
    body = h("div", null,
      h("h1", { style: { fontSize: 21, fontWeight: 900, color: t.text, margin: "8px 0 4px" } }, "What draws you to nature?"),
      h("p", { style: { fontSize: 13.5, color: t.textDim, margin: "0 0 14px" } }, "Pick any that excite you (optional)."),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 } },
        INTEREST_OPTIONS.map(function (opt) {
          var on = false;
          for (var i = 0; i < ints.length; i++) { if (ints[i] === opt) on = true; }
          return h("button", {
            key: opt, onClick: function () { toggleInt(opt); },
            style: { fontFamily: SANS, fontSize: 13, fontWeight: 700, padding: "9px 13px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text }
          }, opt);
        })
      ),
      h("div", { style: { display: "flex", gap: 10 } },
        h(Btn, { t: t, kind: "ghost", icon: "back", onClick: function () { setStep(1); } }, "Back"),
        h(Btn, { t: t, kind: "go", block: true, icon: "check", onClick: finish }, "Start exploring")
      )
    );
  }

  return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "12px 16px 44px" } }, head, body,
    h("div", { style: { marginTop: 22 } }, h(ComplianceBanner, { t: t }))
  );
}

/* ============================================================ LESSON VIEW == */
function Block(props) {
  var t = props.t;
  return h("p", { style: { fontSize: 15, lineHeight: 1.68, color: t.text, margin: "0 0 13px" } }, props.children);
}
function MiniCard(props) {
  var t = props.t;
  var color = props.color ? props.color : t.sky;
  return h("div", { style: { background: props.bg ? props.bg : t.panelHi, border: "1px solid " + (props.border ? props.border : t.lineSoft), borderLeft: "3px solid " + color, borderRadius: 12, padding: "11px 13px", margin: "0 0 12px" } },
    h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: color, marginBottom: 5 } }, props.label),
    h("div", { style: { fontSize: 14, lineHeight: 1.6, color: t.text } }, props.children)
  );
}
function LessonView(props) {
  var t = props.t;
  var lesson = props.lesson;
  var tc = trackColor(t, lesson.track);
  var primarySrc = srcOf(lesson.src);
  var best = props.best != null ? props.best : 0;
  var done = props.done;

  var chips = [
    h(Chip, { key: "tk", t: t, color: tc, bg: t.panel, border: tc }, trackById(lesson.track).label),
    h(Chip, { key: "lv", t: t }, lesson.level),
    h(Chip, { key: "tm", t: t }, (lesson.time ? lesson.time : 4) + " min")
  ];
  if (done) chips.push(h(Chip, { key: "bs", t: t, color: t.green, bg: t.greenDim, border: t.green }, "Best " + best + "%"));

  var explainKids = [];
  if (lesson.explain) {
    for (var i = 0; i < lesson.explain.length; i++) explainKids.push(h(Block, { key: "e" + i, t: t }, lesson.explain[i]));
  }
  var termsRows = [];
  if (lesson.terms) {
    for (var j = 0; j < lesson.terms.length; j++) {
      var pair = lesson.terms[j];
      termsRows.push(h("div", { key: "t" + j, style: { display: "flex", gap: 10, padding: "9px 0", borderTop: j === 0 ? "none" : "1px solid " + t.lineSoft } },
        h("div", { style: { flex: "0 0 38%", fontWeight: 800, fontSize: 13.5, color: t.text } }, pair[0]),
        h("div", { style: { flex: "1 1 auto", fontSize: 13.5, lineHeight: 1.55, color: t.textDim } }, pair[1])
      ));
    }
  }
  var extraSources = [];
  if (lesson.sources) {
    for (var k = 0; k < lesson.sources.length; k++) {
      extraSources.push(h(SourceLink, { key: "s" + k, t: t, url: lesson.sources[k].url, label: lesson.sources[k].label, style: { margin: "0 8px 8px 0" } }));
    }
  }

  return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "8px 16px 40px" } },
    h("button", { onClick: props.onBack, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "6px 0", marginBottom: 6 } },
      h(Glyph, { name: "back", size: 18, color: t.textDim }), "Roadmap"),
    h(SpeciesPhoto, { id: props.id, name: lesson.art ? lesson.art : artFor(props.id, lesson.track), ar: "16 / 8", label: lesson.title, style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.22)" } }),
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 } }, chips),
    h("h1", { style: { fontSize: 23, fontWeight: 900, lineHeight: 1.25, color: t.text, margin: "0 0 12px" } }, lesson.title),
    explainKids,
    lesson.why ? h(MiniCard, { t: t, label: "Why it matters", color: tc }, lesson.why) : null,
    lesson.misconception ? h(MiniCard, { t: t, label: "Common misconception", color: t.amber, bg: t.amberDim, border: t.amber }, lesson.misconception) : null,
    termsRows.length ? h("div", { style: { marginTop: 4 } }, h(SectionLabel, { t: t, icon: "book", tight: true }, "Key terms"), h(Card, { t: t, pad: "4px 14px" }, termsRows)) : null,
    lesson.hook ? h("div", { style: { marginTop: 14, padding: "11px 13px", borderRadius: 12, background: t.panelHi, border: "1px dashed " + t.line, fontSize: 13.5, fontStyle: "italic", color: t.textDim } }, h("b", { style: { fontStyle: "normal", color: t.text } }, "Memory hook: "), lesson.hook) : null,
    extraSources.length ? h("div", { style: { marginTop: 16 } }, h(SectionLabel, { t: t, icon: "ext", tight: true }, "Sources"), h("div", { style: { display: "flex", flexWrap: "wrap" } }, extraSources)) : null,
    h("div", { style: { marginTop: 22 } }, h(Btn, { t: t, kind: "go", block: true, icon: "play", onClick: props.onStart }, "Take the quiz (" + (lesson.quiz ? lesson.quiz.length : 0) + " questions)"))
  );
}

/* ============================================================ QUIZ ENGINE == */
function normFill(s) { if (!s) return ""; return ("" + s).toLowerCase().replace(/[^a-z0-9 ]/g, "").trim(); }
function StarRow(props) {
  var t = props.t;
  var value = props.value;
  var stars = [1, 2, 3, 4, 5];
  return h("div", { style: { display: "flex", gap: 6 } },
    stars.map(function (n) {
      var on = n <= value;
      return h("button", { key: n, onClick: function () { props.onPick(n); }, style: { background: "none", border: "none", cursor: "pointer", padding: 2 } },
        h(Glyph, { name: "star", size: 26, color: on ? t.amber : t.line })
      );
    })
  );
}
function QuizEngine(props) {
  var t = props.t;
  var lesson = props.lesson;
  var quiz = lesson.quiz ? lesson.quiz : [];
  var idxState = useState(0);
  var idx = idxState[0], setIdx = idxState[1];
  var pickState = useState(null);
  var pick = pickState[0], setPick = pickState[1];
  var fillState = useState("");
  var fillVal = fillState[0], setFillVal = fillState[1];
  var revealState = useState(false);
  var reveal = revealState[0], setReveal = revealState[1];
  var correctState = useState(0);
  var correct = correctState[0], setCorrect = correctState[1];
  var phaseState = useState("quiz"); /* quiz | survey */
  var phase = phaseState[0], setPhase = phaseState[1];
  var confState = useState(0); var conf = confState[0], setConf = confState[1];
  var clarState = useState(0); var clar = clarState[0], setClar = clarState[1];
  var flagState = useState(false); var flag = flagState[0], setFlag = flagState[1];
  var noteState = useState(""); var note = noteState[0], setNote = noteState[1];

  var q = quiz[idx];
  var tc = trackColor(t, lesson.track);

  function isCorrect() {
    if (!q) return false;
    if (q.type === "tf") return pick === q.answer;
    if (q.type === "fill") return normFill(fillVal) === normFill(q.answer);
    return pick === q.answer;
  }
  function submit() {
    if (reveal) return;
    var ok = isCorrect();
    if (ok) setCorrect(correct + 1);
    setReveal(true);
  }
  function next() {
    if (idx + 1 < quiz.length) {
      setIdx(idx + 1); setPick(null); setFillVal(""); setReveal(false);
    } else {
      setPhase("survey");
    }
  }
  function done() {
    var score = pct(correct, quiz.length);
    props.onComplete({ score: score, correct: correct, total: quiz.length, survey: { confidence: conf, clarity: clar, flag: flag, note: note } });
  }

  if (phase === "survey") {
    var score2 = pct(correct, quiz.length);
    return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "10px 16px 44px" } },
      h("div", { style: { textAlign: "center", margin: "10px 0 18px" } },
        h("div", { style: { fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Quiz complete"),
        h("div", { style: { fontSize: 42, fontWeight: 900, color: score2 >= 80 ? t.green : (score2 >= 50 ? t.amber : t.red) } }, score2 + "%"),
        h("div", { style: { fontSize: 14, color: t.textDim } }, correct + " of " + quiz.length + " correct" + (score2 >= 80 ? "  ·  +15 XP bonus" : "")),
        h("div", { style: { fontSize: 14.5, fontWeight: 800, color: score2 >= 80 ? t.green : (score2 >= 50 ? t.amber : t.sky), marginTop: 6 } }, score2 >= 80 ? "Awesome work!" : (score2 >= 50 ? "Nice effort \u2014 you're getting it!" : "Keep going \u2014 you've got this!"))
      ),
      h(Card, { t: t, style: { marginBottom: 12 } },
        h("div", { style: { fontWeight: 800, fontSize: 14.5, color: t.text, marginBottom: 8 } }, "How sure do you feel about this?"),
        h(StarRow, { t: t, value: conf, onPick: setConf })
      ),
      h(Card, { t: t, style: { marginBottom: 12 } },
        h("div", { style: { fontWeight: 800, fontSize: 14.5, color: t.text, marginBottom: 8 } }, "Was the lesson easy to follow?"),
        h(StarRow, { t: t, value: clar, onPick: setClar })
      ),
      h(Card, { t: t, style: { marginBottom: 12 } },
        h("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" } },
          h("input", { type: "checkbox", checked: flag, onChange: function (e) { setFlag(e.target.checked); }, style: { width: 18, height: 18 } }),
          h("span", { style: { fontSize: 14, fontWeight: 700, color: t.text } }, "Save this to look at again later")
        )
      ),
      h(Card, { t: t, style: { marginBottom: 16 } },
        h("div", { style: { fontWeight: 800, fontSize: 14.5, color: t.text, marginBottom: 8 } }, "Add a note (optional)"),
        h("textarea", { value: note, onChange: function (e) { setNote(e.target.value); }, rows: 2, placeholder: "Something to remember…", style: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid " + t.line, background: t.panel, color: t.text, fontSize: 14, fontFamily: SANS, outline: "none", resize: "vertical", boxSizing: "border-box" } })
      ),
      h(Btn, { t: t, kind: "go", block: true, icon: "check", onClick: done }, "Save & back to roadmap")
    );
  }

  if (!q) {
    return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: 24, textAlign: "center", color: t.textDim } }, "This lesson has no quiz yet.",
      h("div", { style: { marginTop: 14 } }, h(Btn, { t: t, kind: "soft", onClick: props.onExit }, "Back")));
  }

  var choiceEls = null;
  if (q.type === "mc") {
    choiceEls = q.choices.map(function (c, ci) {
      var chosen = pick === ci;
      var bg = t.panel, bd = t.line, fg = t.text;
      if (reveal) {
        if (ci === q.answer) { bg = t.greenDim; bd = t.green; fg = t.text; }
        else if (chosen) { bg = t.redDim; bd = t.red; }
      } else if (chosen) { bg = t.panelHi; bd = tc; }
      return h("button", {
        key: ci, onClick: reveal ? null : function () { setPick(ci); },
        style: { display: "flex", alignItems: "center", gap: 10, textAlign: "left", width: "100%", fontFamily: SANS, fontSize: 14.5, fontWeight: 600, padding: "13px 14px", marginBottom: 9, borderRadius: 12, border: "1.5px solid " + bd, background: bg, color: fg, cursor: reveal ? "default" : "pointer" }
      },
        reveal && ci === q.answer ? h(Glyph, { name: "check", size: 18, color: t.green }) : (reveal && chosen ? h(Glyph, { name: "x", size: 18, color: t.red }) : h("span", { style: { width: 18, height: 18, borderRadius: 99, border: "2px solid " + (chosen ? tc : t.line), flex: "0 0 auto" } })),
        h("span", null, c)
      );
    });
  } else if (q.type === "tf") {
    choiceEls = [true, false].map(function (val) {
      var lbl = val ? "True" : "False";
      var chosen = pick === val;
      var bg = t.panel, bd = t.line;
      if (reveal) {
        if (val === q.answer) { bg = t.greenDim; bd = t.green; }
        else if (chosen) { bg = t.redDim; bd = t.red; }
      } else if (chosen) { bg = t.panelHi; bd = tc; }
      return h("button", {
        key: lbl, onClick: reveal ? null : function () { setPick(val); },
        style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, width: "48%", fontFamily: SANS, fontSize: 15, fontWeight: 800, padding: "14px 10px", borderRadius: 12, border: "1.5px solid " + bd, background: bg, color: t.text, cursor: reveal ? "default" : "pointer" }
      }, lbl);
    });
    choiceEls = h("div", { style: { display: "flex", justifyContent: "space-between" } }, choiceEls);
  } else {
    choiceEls = h("input", {
      value: fillVal, onChange: function (e) { setFillVal(e.target.value); }, disabled: reveal, placeholder: "Type your answer…",
      style: { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid " + (reveal ? (isCorrect() ? t.green : t.red) : t.line), background: t.panel, color: t.text, fontSize: 15, fontFamily: SANS, outline: "none", boxSizing: "border-box" }
    });
  }

  var canSubmit = (q.type === "fill") ? (fillVal.trim().length > 0) : (pick !== null && pick !== undefined);

  return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "8px 16px 40px" } },
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } },
      h("button", { onClick: props.onExit, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0" } },
        h(Glyph, { name: "x", size: 18, color: t.textDim }), "Exit"),
      h("span", { style: { fontSize: 13, fontWeight: 800, color: t.textDim } }, "Question " + (idx + 1) + " / " + quiz.length)
    ),
    h(Bar, { t: t, value: pct(idx + (reveal ? 1 : 0), quiz.length), color: tc, height: 6 }),
    h("h2", { style: { fontSize: 19, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "16px 0 16px" } }, q.q),
    choiceEls,
    reveal ? h(MiniCard, { t: t, label: isCorrect() ? praiseWord(idx) : tryAgainWord(idx), color: isCorrect() ? t.green : t.amber, bg: isCorrect() ? t.greenDim : t.amberDim, border: isCorrect() ? t.green : t.amber, style: { marginTop: 14 } }, q.why) : null,
    h("div", { style: { marginTop: 16 } },
      reveal
        ? h(Btn, { t: t, kind: "primary", block: true, icon: idx + 1 < quiz.length ? "play" : "check", onClick: next }, idx + 1 < quiz.length ? "Next question" : "See results")
        : h(Btn, { t: t, kind: "go", block: true, disabled: !canSubmit, onClick: submit }, "Check answer")
    )
  );
}

/* ============================================================ HOME SCREEN == */
var OCEAN_TIPS = [
  "Forests cover about 31% of Earth's land and are home to most land species.",
  "A single mature oak tree can support hundreds of different insect species.",
  "Beavers are 'ecosystem engineers' — their dams create wetlands that shelter countless animals.",
  "Most of a forest's nutrients are recycled by fungi and tiny soil organisms, not lost.",
  "It can take 500 to 1,000 years for nature to build just an inch of topsoil.",
  "Wetlands filter water and soak up floods — they're sometimes called nature's kidneys.",
  "About one in four medicines began with a chemical first found in a wild plant.",
  "Roughly 75% of the world's food crops depend at least partly on pollinators like bees."
];
function statFor(state) {
  var ids = allLessonIds();
  var done = 0;
  for (var i = 0; i < ids.length; i++) {
    var rec = state.lessons[ids[i]];
    if (rec && rec.done) done++;
  }
  return { done: done, total: ids.length };
}
function nextLessonId(state) {
  var ids = allLessonIds();
  for (var i = 0; i < ids.length; i++) {
    var rec = state.lessons[ids[i]];
    if (!rec || !rec.done) return ids[i];
  }
  return ids.length ? ids[0] : null;
}
function HomeScreen(props) {
  var t = props.t;
  var state = props.state;
  var L = LESSONS();
  var info = levelInfo(state.xp);
  var st = statFor(state);
  var nextId = nextLessonId(state);
  var nextLesson = nextId ? L[nextId] : null;
  var tipIdx = (new Date().getDate()) % OCEAN_TIPS.length;
  var streakDays = (state.streak && state.streak.days) ? state.streak.days : 0;
  var greet = state.profile && state.profile.name ? ("Welcome back, " + state.profile.name) : "Welcome back";

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 30px" } },
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 14px" } },
      h("div", null,
        h("div", { style: { fontSize: 13, fontWeight: 700, color: t.textDim } }, greet),
        h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Your field journal")
      ),
      h(BrandLogo, { size: 40 })
    ),
    h(Illus, { name: "forest", ar: "16 / 7", label: "Forest canopy", style: { marginBottom: 14, boxShadow: "0 6px 18px rgba(0,0,0,0.22)" } }),
    h(Card, { t: t, style: { marginBottom: 12, background: "linear-gradient(135deg," + t.panelHi + "," + t.panel + ")" } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 } },
        h("div", null,
          h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Trail level " + info.level),
          h("div", { style: { fontSize: 20, fontWeight: 900, color: t.sky } }, info.name)
        ),
        h("div", { style: { textAlign: "right" } },
          h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, state.xp),
          h("div", { style: { fontSize: 11.5, fontWeight: 700, color: t.textFaint } }, "total XP")
        )
      ),
      h(Bar, { t: t, value: info.pct, color: t.sky }),
      h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 6 } }, info.into + " / " + info.need + " XP to level " + (info.level + 1))
    ),
    h("div", { style: { display: "flex", gap: 12, marginBottom: 12 } },
      h(Card, { t: t, pad: 13, style: { flex: 1, textAlign: "center" } },
        h("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6 } }, h(Glyph, { name: "flame", size: 18, color: t.coral }), h("span", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, streakDays)),
        h("div", { style: { fontSize: 11.5, fontWeight: 700, color: t.textFaint, marginTop: 2 } }, "day streak")
      ),
      h(Card, { t: t, pad: 13, style: { flex: 1, textAlign: "center" } },
        h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, st.done + "/" + st.total),
        h("div", { style: { fontSize: 11.5, fontWeight: 700, color: t.textFaint, marginTop: 2 } }, "lessons done")
      ),
      h(Card, { t: t, pad: 13, style: { flex: 1, textAlign: "center" } },
        h("div", { style: { fontSize: 22, fontWeight: 900, color: t.green } }, pct(st.done, st.total) + "%"),
        h("div", { style: { fontSize: 11.5, fontWeight: 700, color: t.textFaint, marginTop: 2 } }, "complete")
      )
    ),
    h(Card, { t: t, onClick: function () { props.onGo("paths"); }, style: { marginBottom: 12, cursor: "pointer", background: "linear-gradient(135deg," + t.panelHi + "," + t.panel + ")" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { width: 44, height: 44, flex: "0 0 auto", borderRadius: 12, background: t.sky, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: "depth", size: 22, color: "#04222F" })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: t.sky, marginBottom: 2 } }, "Guided journeys"),
          h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, "Expeditions"),
          h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 1 } }, "Hike through a topic with hands-on challenges")),
        h(Glyph, { name: "play", size: 18, color: t.sky }))
    ),
    h(DailyDiveCard, { t: t, state: state, onStart: props.onReview }),
    nextLesson ? h(Card, { t: t, onClick: function () { props.onOpen(nextId); }, style: { marginBottom: 12, borderLeft: "3px solid " + trackColor(t, nextLesson.track) } },
      h("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
        h(SpeciesPhoto, { id: nextId, name: nextLesson.art ? nextLesson.art : artFor(nextId, nextLesson.track), ar: "1 / 1", radius: 10, label: nextLesson.title, style: { flex: "0 0 auto", width: 62, height: 62 } }),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: t.textFaint, marginBottom: 4 } }, st.done > 0 ? "Continue learning" : "Start here"),
          h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 6 } }, nextLesson.title),
          h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
            h(Chip, { t: t, color: trackColor(t, nextLesson.track) }, trackById(nextLesson.track).label),
            h("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, color: t.sky, fontWeight: 800, fontSize: 13.5 } }, "Open", h(Glyph, { name: "play", size: 15, color: t.sky }))
          )
        )
      )
    ) : null,
    h("div", { style: { display: "flex", gap: 12, marginBottom: 14 } },
      h(Card, { t: t, onClick: function () { props.onGo("practice"); }, style: { flex: 1 } },
        h(Glyph, { name: "practice", size: 22, color: t.violet }),
        h("div", { style: { fontWeight: 800, fontSize: 15, color: t.text, marginTop: 6 } }, "Practice"),
        h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 2 } }, "Flashcards & weak spots")
      ),
      h(Card, { t: t, onClick: function () { props.onGo("arcade"); }, style: { flex: 1 } },
        h(Glyph, { name: "ticket", size: 22, color: t.amber }),
        h("div", { style: { fontWeight: 800, fontSize: 15, color: t.text, marginTop: 6 } }, "Arcade"),
        h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 2 } }, "Earn XP & tickets")
      )
    ),
    h("div", { style: { padding: "12px 14px", borderRadius: 12, background: t.panelHi, border: "1px dashed " + t.line } },
      h("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.sky, marginBottom: 5 } }, "Nature fact of the day"),
      h("div", { style: { fontSize: 13.5, lineHeight: 1.55, color: t.text } }, OCEAN_TIPS[tipIdx])
    )
  );
}

/* ============================================================ LEARN SCREEN == */
function LearnScreen(props) {
  var t = props.t;
  var state = props.state;
  var L = LESSONS();
  var units = buildUnits();
  var openState = useState({});
  var open = openState[0], setOpen = openState[1];

  function toggle(uid2) {
    var next = {};
    for (var k in open) { if (Object.prototype.hasOwnProperty.call(open, k)) next[k] = open[k]; }
    next[uid2] = !next[uid2];
    setOpen(next);
  }

  var blocks = units.map(function (u) {
    var tc = trackColor(t, u.track);
    var doneCount = 0;
    for (var i = 0; i < u.ids.length; i++) { var r = state.lessons[u.ids[i]]; if (r && r.done) doneCount++; }
    var isOpen = open[u.id];
    var rows = null;
    if (isOpen) {
      rows = u.ids.map(function (id) {
        var lesson = L[id];
        if (!lesson) return null;
        var rec = state.lessons[id];
        var ldone = rec && rec.done;
        return h("div", {
          key: id, onClick: function () { props.onOpen(id); },
          style: { display: "flex", alignItems: "center", gap: 11, padding: "11px 4px", borderTop: "1px solid " + t.lineSoft, cursor: "pointer" }
        },
          h("div", { style: { width: 26, height: 26, borderRadius: 99, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: ldone ? t.green : t.panelHi, border: "1px solid " + (ldone ? t.green : t.line) } },
            ldone ? h(Glyph, { name: "check", size: 15, color: "#04241A" }) : h("span", { style: { width: 7, height: 7, borderRadius: 99, background: t.textFaint } })),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontSize: 14.5, fontWeight: 700, color: t.text } }, lesson.title),
            h("div", { style: { fontSize: 11.5, color: t.textFaint } }, (lesson.time ? lesson.time : 4) + " min" + (ldone ? ("  ·  best " + (rec.best ? rec.best : 0) + "%") : ""))
          ),
          h(Glyph, { name: "play", size: 16, color: t.textDim })
        );
      });
    }
    return h(Card, { t: t, key: u.id, style: { marginBottom: 12, padding: 0, overflow: "hidden" } },
      h("div", { onClick: function () { toggle(u.id); }, role: "button", tabIndex: 0, onKeyDown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(u.id); } }, style: { display: "flex", alignItems: "center", gap: 12, padding: 15, cursor: "pointer" } },
        h(Media, { id: u.ids[0], name: (LESSONS()[u.ids[0]] && LESSONS()[u.ids[0]].art) ? LESSONS()[u.ids[0]].art : artFor(u.ids[0], u.track), ar: "1 / 1", radius: 12, label: u.title, style: { width: 46, height: 46, flex: "0 0 auto", border: "1px solid " + tc } }),
        h("div", { style: { flex: 1 } },
          h("div", { style: { display: "flex", alignItems: "center", gap: 7 } }, h("span", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, u.title), h(Chip, { t: t, color: tc }, u.level)),
          h("div", { style: { fontSize: 12.5, color: t.textDim, margin: "3px 0 7px" } }, u.subtitle),
          h(Bar, { t: t, value: pct(doneCount, u.ids.length), color: tc, height: 6 }),
          h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 5 } }, doneCount + " / " + u.ids.length + " lessons")
        ),
        h(Glyph, { name: isOpen ? "x" : "play", size: 16, color: t.textFaint })
      ),
      rows ? h("div", { style: { padding: "0 15px 12px" } }, rows) : null
    );
  });

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 30px" } },
    h("div", { style: { margin: "4px 0 14px" } },
      h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Learning roadmap"),
      h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 2 } }, "Work top to bottom, or jump to any topic.")
    ),
    blocks
  );
}

/* ----------------------------------------------------------------- shuffle -- */
function shuffled(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* ============================================================ FLASHCARDS == */
function buildCards() {
  var g = GLOSSARY();
  var out = [];
  for (var i = 0; i < g.length; i++) {
    out.push({ front: g[i].term, back: g[i].def, tag: g[i].cat });
  }
  return out;
}
function FlashcardView(props) {
  var t = props.t;
  var deckState = useState(function () { return shuffled(buildCards()); });
  var deck = deckState[0], setDeck = deckState[1];
  var iState = useState(0); var i = iState[0], setI = iState[1];
  var flipState = useState(false); var flip = flipState[0], setFlip = flipState[1];

  if (!deck.length) return h("div", { style: { padding: 20, color: t.textDim } }, "No flashcards available.");
  var card = deck[i];
  function go(n) {
    var ni = (i + n + deck.length) % deck.length;
    setI(ni); setFlip(false);
  }
  function reshuffle() { setDeck(shuffled(deck)); setI(0); setFlip(false); }

  return h("div", null,
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
      h("span", { style: { fontSize: 13, fontWeight: 800, color: t.textDim } }, "Card " + (i + 1) + " / " + deck.length),
      h("button", { onClick: reshuffle, style: { display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", color: t.sky, fontWeight: 700, fontSize: 13, cursor: "pointer" } }, h(Glyph, { name: "reset", size: 15, color: t.sky }), "Shuffle")
    ),
    h("div", {
      onClick: function () { setFlip(!flip); },
      style: { minHeight: 200, borderRadius: 18, border: "1px solid " + t.line, background: flip ? t.panelHi : t.panel, boxShadow: t.shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, cursor: "pointer" }
    },
      h("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: flip ? t.green : t.sky, marginBottom: 10 } }, flip ? "Definition" : "Term"),
      h("div", { style: { fontSize: flip ? 16 : 22, fontWeight: flip ? 600 : 900, lineHeight: 1.5, color: t.text } }, flip ? card.back : card.front),
      h("div", { style: { marginTop: 14 } }, h(Chip, { t: t, color: t.textFaint }, card.tag)),
      h("div", { style: { marginTop: 12, fontSize: 11.5, color: t.textFaint } }, flip ? "Tap to flip back" : "Tap to reveal")
    ),
    h("div", { style: { display: "flex", gap: 10, marginTop: 14 } },
      h(Btn, { t: t, kind: "soft", icon: "back", onClick: function () { go(-1); } }, "Prev"),
      h(Btn, { t: t, kind: "primary", block: true, onClick: function () { go(1); } }, "Next card")
    )
  );
}

/* ============================================================ PRACTICE == */
function flaggedLessons(state) {
  var L = LESSONS();
  var out = [];
  var seen = {};
  var s = state.surveys || {};
  for (var id in s) {
    if (Object.prototype.hasOwnProperty.call(s, id) && s[id] && s[id].flag && L[id] && !seen[id]) { out.push(id); seen[id] = true; }
  }
  var w = state.weak || {};
  for (var id2 in w) {
    if (Object.prototype.hasOwnProperty.call(w, id2) && w[id2] > 0 && L[id2] && !seen[id2]) { out.push(id2); seen[id2] = true; }
  }
  return out;
}
function PracticeScreen(props) {
  var t = props.t;
  var state = props.state;
  var L = LESSONS();
  var tabState = useState("cards");
  var tab = tabState[0], setTab = tabState[1];
  var tabs = [["cards", "Flashcards"], ["review", "Daily Trek"]];
  var head = h("div", { style: { display: "flex", gap: 8, marginBottom: 16 } },
    tabs.map(function (tb) {
      var on = tab === tb[0];
      return h("button", { key: tb[0], onClick: function () { setTab(tb[0]); }, style: { flex: 1, fontFamily: SANS, fontSize: 14, fontWeight: 800, padding: "10px 12px", borderRadius: 11, border: "1px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text, cursor: "pointer" } }, tb[1]);
    })
  );

  var content;
  if (tab === "cards") {
    content = h(FlashcardView, { t: t });
  } else {
    content = h(ReviewTab, { t: t, state: state, onReview: props.onReview });
  }

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 30px" } },
    h(Illus, { name: "forest", ar: "16 / 6", label: "Forest trail", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } }),
    h("div", { style: { margin: "4px 0 14px" } },
      h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Practice"),
      h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 2 } }, "Practice what you've learned!")
    ),
    head, content
  );
}

/* ============================================================ ARCADE == */
function quizPool() {
  var L = LESSONS();
  var pool = [];
  for (var id in L) {
    if (!Object.prototype.hasOwnProperty.call(L, id)) continue;
    var qz = L[id].quiz;
    if (!qz) continue;
    for (var i = 0; i < qz.length; i++) {
      var q = qz[i];
      if (q.type === "mc" && q.choices) {
        pool.push({ q: q.q, choices: q.choices.slice(), answer: q.answer, why: q.why });
      } else if (q.type === "tf") {
        pool.push({ q: q.q, choices: ["True", "False"], answer: q.answer ? 0 : 1, why: q.why });
      }
    }
  }
  return pool;
}
function zonePool() {
  var g = GLOSSARY();
  var cats = ["Ecology", "Plants", "Animals", "Geology", "Habitats", "Conservation", "Field skills"];
  var out = [];
  for (var i = 0; i < g.length; i++) {
    var item = g[i];
    var others = [];
    for (var c = 0; c < cats.length; c++) { if (cats[c] !== item.cat) others.push(cats[c]); }
    others = shuffled(others).slice(0, 3);
    var choices = shuffled([item.cat].concat(others));
    var ans = 0;
    for (var k = 0; k < choices.length; k++) { if (choices[k] === item.cat) ans = k; }
    out.push({ q: "Which topic area does this belong to?\\n“" + item.term + "”", choices: choices, answer: ans, why: item.term + " — " + item.def });
  }
  return out;
}
function relCurated() {
  return [
    { q: "What is the only food a monarch caterpillar can eat?", choices: ["Milkweed leaves", "Oak leaves", "Grass blades", "Pine needles"], answer: 0, why: "Monarch caterpillars can only eat milkweed, which is why milkweed matters so much to them." },
    { q: "A wolf is a predator. The deer it hunts is its \u2014?", choices: ["Prey", "Predator", "Producer", "Decomposer"], answer: 0, why: "The animal a predator hunts and eats is called its prey." },
    { q: "Grass is a producer. A grasshopper that eats the grass is a \u2014?", choices: ["Consumer", "Producer", "Decomposer", "Mineral"], answer: 0, why: "Animals that eat other living things are consumers; grass makes its own food, so it is a producer." },
    { q: "Which living things break down dead leaves and recycle their nutrients?", choices: ["Fungi and bacteria", "Hawks", "Deer", "Oak trees"], answer: 0, why: "Fungi and bacteria are decomposers that return nutrients to the soil." },
    { q: "A lichen is a partnership between a fungus and a \u2014?", choices: ["An alga", "A moss", "A fern", "A beetle"], answer: 0, why: "A lichen is a fungus and an alga living together as one." },
    { q: "Which keystone animal builds dams that create whole wetlands?", choices: ["Beaver", "Deer", "Robin", "Squirrel"], answer: 0, why: "Beavers are ecosystem engineers whose dams form ponds and wetlands many species use." },
    { q: "A caterpillar changes into a butterfly through a process called \u2014?", choices: ["Metamorphosis", "Photosynthesis", "Erosion", "Migration"], answer: 0, why: "The transformation from larva to adult is called metamorphosis." },
    { q: "A food chain always starts with energy from the \u2014?", choices: ["Sun", "Soil", "Wind", "Water"], answer: 0, why: "Plants capture the sun's energy, and it flows up the food chain from there." },
    { q: "Marble forms when heat and pressure change which rock?", choices: ["Limestone", "Granite", "Sandstone", "Obsidian"], answer: 0, why: "Marble is metamorphosed limestone." },
    { q: "Frogs and toads begin life in water as \u2014?", choices: ["Tadpoles", "Caterpillars", "Fawns", "Seeds"], answer: 0, why: "Amphibians usually hatch as gilled tadpoles before growing legs and lungs." },
    { q: "Which of these is an invasive species in North America?", choices: ["Kudzu vine", "White oak", "Monarch butterfly", "Brook trout"], answer: 0, why: "Kudzu is a fast-spreading non-native vine; the others are native." },
    { q: "Which of these is a pollinator?", choices: ["Honey bee", "Earthworm", "Wolf spider", "Garden snail"], answer: 0, why: "Bees move pollen between flowers so plants can make seeds and fruit." },
    { q: "Native bluebirds nest in tree holes and compete with which invasive bird?", choices: ["European starling", "Northern cardinal", "American robin", "Blue jay"], answer: 0, why: "Introduced starlings (and house sparrows) take over the cavities bluebirds need." },
    { q: "Which mammal is nocturnal \u2014 active mostly at night?", choices: ["Raccoon", "Pronghorn", "Bison", "Gray squirrel"], answer: 0, why: "Raccoons forage at night; pronghorn, bison and gray squirrels are active by day." },
    { q: "The fastest animal on Earth, in a hunting dive, is the \u2014?", choices: ["Peregrine falcon", "Bald eagle", "Mallard", "Great horned owl"], answer: 0, why: "A diving peregrine falcon can exceed 320 km/h." },
    { q: "Which tree is planted by squirrels that bury and forget its seeds?", choices: ["Oak (acorns)", "Cattail", "Bracken fern", "Sphagnum moss"], answer: 0, why: "Squirrels cache acorns and forget many, planting future oak trees." }
  ];
}
function relPool() {
  var out = relCurated();
  var M = SPMETA();
  var habPool = ["forests and woodlands", "grasslands and prairies", "wetlands and marshes", "deserts and dry scrub", "rivers and streams", "lakes and ponds", "mountains and high slopes", "coastal dunes and shores"];
  var ids = [], id;
  for (id in M) { if (Object.prototype.hasOwnProperty.call(M, id)) ids.push(id); }
  ids = shuffled(ids);
  var added = 0;
  for (var i = 0; i < ids.length && added < 60; i++) {
    var m = M[ids[i]];
    if (m.diet && m.diet.indexOf("(") !== 0 && m.diet.length > 1) {
      var dpool = ["seeds and nuts", "grasses", "insects and other small invertebrates", "fish and other water animals", "leaves, twigs and buds", "flower nectar", "animals it hunts", "fruit and berries"];
      var dwrong = [], used = {};
      used[m.diet] = 1;
      var ds = shuffled(dpool);
      for (var a = 0; a < ds.length && dwrong.length < 3; a++) { if (!used[ds[a]]) { used[ds[a]] = 1; dwrong.push(ds[a]); } }
      var dch = shuffled([m.diet].concat(dwrong)), dans = 0;
      for (var b = 0; b < dch.length; b++) { if (dch[b] === m.diet) dans = b; }
      out.push({ q: "What does the " + m.name + " mainly eat?", choices: dch, answer: dans, why: "The " + m.name + " mainly eats " + m.diet + "." });
      added++;
    } else if (m.hab) {
      var hwrong = [], huse = {};
      huse[m.hab] = 1;
      var hs = shuffled(habPool);
      for (var c = 0; c < hs.length && hwrong.length < 3; c++) { if (!huse[hs[c]]) { huse[hs[c]] = 1; hwrong.push(hs[c]); } }
      var hch = shuffled([m.hab].concat(hwrong)), hans = 0;
      for (var d2 = 0; d2 < hch.length; d2++) { if (hch[d2] === m.hab) hans = d2; }
      out.push({ q: "Where is the " + m.name + " most at home?", choices: hch, answer: hans, why: "The " + m.name + " lives in " + m.hab + "." });
      added++;
    }
  }
  return out;
}
function kindPool() {
  var out = [];
  var M = SPMETA();
  var labelOf = {
    "tree": "Tree", "shrub": "Shrub", "wildflower": "Wildflower", "grass": "Grass",
    "fern or moss": "Fern or moss", "fungus or lichen": "Fungus or lichen",
    "mammal": "Mammal", "bird": "Bird", "reptile": "Reptile", "amphibian": "Amphibian",
    "freshwater fish": "Fish", "insect": "Insect", "arachnid": "Spider or other arachnid"
  };
  var allLabels = [];
  var key;
  for (key in labelOf) { if (Object.prototype.hasOwnProperty.call(labelOf, key)) allLabels.push(labelOf[key]); }
  var id;
  for (id in M) {
    if (!Object.prototype.hasOwnProperty.call(M, id)) continue;
    var m = M[id];
    var lab = labelOf[m.cat];
    if (!lab) continue;
    var wrong = [], used = {};
    used[lab] = 1;
    var ls = shuffled(allLabels);
    for (var a = 0; a < ls.length && wrong.length < 3; a++) { if (!used[ls[a]]) { used[ls[a]] = 1; wrong.push(ls[a]); } }
    var ch = shuffled([lab].concat(wrong)), ans = 0;
    for (var b = 0; b < ch.length; b++) { if (ch[b] === lab) ans = b; }
    var nounK = (lab === "Fish" ? "fish" : lab.toLowerCase());
    out.push({ q: "A " + m.name + " is which kind of living thing?", choices: ch, answer: ans, why: "The " + m.name + " is classified as " + ("aeiou".indexOf(nounK.charAt(0)) > -1 ? "an " : "a ") + nounK + "." });
  }
  // rocks and minerals -> type
  var SH = (typeof window !== "undefined" && window.__SEA_SHELLS__) ? window.__SEA_SHELLS__ : [];
  var typeLabels = ["Igneous rock", "Sedimentary rock", "Metamorphic rock", "Mineral", "Fossil"];
  var tmap = { "Igneous": "Igneous rock", "Sedimentary": "Sedimentary rock", "Metamorphic": "Metamorphic rock", "Mineral": "Mineral", "Fossil": "Fossil" };
  for (var s = 0; s < SH.length; s++) {
    var rk = SH[s];
    var tag = (rk.regions && rk.regions.length) ? rk.regions[0] : null;
    var tlab = tag ? tmap[tag] : null;
    if (!tlab) continue;
    var twrong = [], tused = {};
    tused[tlab] = 1;
    var ts = shuffled(typeLabels);
    for (var u = 0; u < ts.length && twrong.length < 3; u++) { if (!tused[ts[u]]) { tused[ts[u]] = 1; twrong.push(ts[u]); } }
    var tch = shuffled([tlab].concat(twrong)), tans = 0;
    for (var v = 0; v < tch.length; v++) { if (tch[v] === tlab) tans = v; }
    var nounR = tlab.toLowerCase();
    out.push({ q: "What type is " + rk.name + "?", choices: tch, answer: tans, why: rk.name + " is classified as " + ("aeiou".indexOf(nounR.charAt(0)) > -1 ? "an " : "a ") + nounR + "." });
  }
  return out;
}
function MiniGame(props) {
  var t = props.t;
  var rounds = props.rounds ? props.rounds : 8;
  var deckState = useState(function () { return shuffled(props.pool).slice(0, rounds); });
  var deck = deckState[0];
  var iState = useState(0); var i = iState[0], setI = iState[1];
  var pickState = useState(null); var pick = pickState[0], setPick = pickState[1];
  var revealState = useState(false); var reveal = revealState[0], setReveal = revealState[1];
  var scoreState = useState(0); var score = scoreState[0], setScore = scoreState[1];
  var streakState = useState(0); var streak = streakState[0], setStreak = streakState[1];
  var doneState = useState(false); var fin = doneState[0], setFin = doneState[1];

  if (!deck.length) return h("div", { style: { padding: 20, color: t.textDim } }, "No questions available.");

  if (fin) {
    return h("div", { style: { textAlign: "center", padding: "12px 4px" } },
      h(Glyph, { name: "ticket", size: 34, color: t.amber }),
      h("div", { style: { fontSize: 30, fontWeight: 900, color: t.text, marginTop: 8 } }, score + " / " + deck.length),
      h("div", { style: { fontSize: 14, color: t.textDim, marginBottom: 16 } }, "+" + score + " tickets earned" + (props.cappedNote ? ("  ·  " + props.cappedNote) : "")),
      h("div", { style: { display: "flex", gap: 10 } },
        h(Btn, { t: t, kind: "soft", onClick: props.onExit }, "Done"),
        h(Btn, { t: t, kind: "primary", block: true, icon: "reset", onClick: props.onReplay }, "Play again")
      )
    );
  }

  var q = deck[i];
  function choose(ci) {
    if (reveal) return;
    setPick(ci);
    var ok = ci === q.answer;
    if (ok) { setScore(score + 1); setStreak(streak + 1); } else { setStreak(0); }
    setReveal(true);
    /* award per correct answer immediately (App enforces the daily cap) */
    if (ok && props.onCorrect) props.onCorrect();
  }
  function next() {
    if (i + 1 < deck.length) { setI(i + 1); setPick(null); setReveal(false); }
    else { setFin(true); if (props.onFinish) props.onFinish(score); }
  }

  var choiceEls = q.choices.map(function (c, ci) {
    var chosen = pick === ci;
    var bg = t.panel, bd = t.line;
    if (reveal) {
      if (ci === q.answer) { bg = t.greenDim; bd = t.green; }
      else if (chosen) { bg = t.redDim; bd = t.red; }
    }
    return h("button", {
      key: ci, onClick: function () { choose(ci); },
      style: { display: "block", textAlign: "left", width: "100%", fontFamily: SANS, fontSize: 14.5, fontWeight: 600, padding: "12px 14px", marginBottom: 8, borderRadius: 12, border: "1.5px solid " + bd, background: bg, color: t.text, cursor: reveal ? "default" : "pointer" }
    }, c);
  });

  return h("div", null,
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
      h("span", { style: { fontSize: 13, fontWeight: 800, color: t.textDim } }, (i + 1) + " / " + deck.length),
      h("span", { style: { display: "inline-flex", alignItems: "center", gap: 12 } },
        h("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: t.coral } }, h(Glyph, { name: "flame", size: 15, color: t.coral }), streak),
        h("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 800, color: t.amber } }, h(Glyph, { name: "ticket", size: 15, color: t.amber }), score)
      )
    ),
    h(Bar, { t: t, value: pct(i, deck.length), color: t.amber, height: 6 }),
    h("h2", { style: { fontSize: 17.5, fontWeight: 800, lineHeight: 1.45, color: t.text, margin: "14px 0 14px", whiteSpace: "pre-line" } }, q.q),
    choiceEls,
    reveal ? h(MiniCard, { t: t, label: pick === q.answer ? praiseWord(i) : tryAgainWord(i), color: pick === q.answer ? t.green : t.amber, bg: pick === q.answer ? t.greenDim : t.amberDim, border: pick === q.answer ? t.green : t.amber, style: { marginTop: 12 } }, q.why) : null,
    reveal ? h("div", { style: { marginTop: 12 } }, h(Btn, { t: t, kind: "primary", block: true, icon: i + 1 < deck.length ? "play" : "check", onClick: next }, i + 1 < deck.length ? "Next" : "Finish")) : null
  );
}
/* Fixed 8-bit ocean palette for the arcade (its own retro identity, dark in
   both themes by design). */
var AB = {
  bg: "#142619", navy: "#1B3324", deep: "#0C1810", line: "#2F5A40",
  teal: "#2FB89A", cyan: "#8EE6A0", coral: "#E0865B", amber: "#FFC83D",
  green: "#5CD98E", sand: "#D9C089", weed: "#2E9E6E", rock: "#6E5A3C", text: "#EAF3EC", dim: "#9FC4B0"
};
var PX = { fontFamily: MONO, textTransform: "uppercase", letterSpacing: 1 };
function pxBox(c1, c2) { return { borderRadius: 0, boxShadow: "0 0 0 2px " + c1 + ", 0 0 0 4px " + c2 }; }
function Scanlines() {
  return h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)", borderRadius: "inherit" } });
}

/* ============================================ 8-BIT GAME ENGINE ======= */
/* A shared canvas host. Each game is a compact spec:
   { id,title,tag,desc,icon,color, W,H, controls, lives, help, fact,
     setup(api)->gs, update(api,gs), draw(api,gs), press(api,gs,btn) }      */
function ctrlHas(controls, key) { return ("" + controls).indexOf(key) >= 0; }

function PadButton(props) {
  var t = props.t; var lab = props.label; var big = props.big;
  return h("button", {
    onPointerDown: function (e) { if (e && e.preventDefault) e.preventDefault(); props.onDown(); },
    onPointerUp: function () { props.onUp(); },
    onPointerLeave: function () { props.onUp(); },
    onPointerCancel: function () { props.onUp(); },
    style: sx({ width: big ? 64 : 52, height: big ? 64 : 52, display: "flex", alignItems: "center", justifyContent: "center", background: AB.navy, color: props.color || AB.cyan, fontSize: big ? 22 : 18, fontWeight: 800, cursor: "pointer", userSelect: "none", touchAction: "none" }, PX, pxBox(props.color || AB.line, AB.deep)) }, lab);
}

function GameHost(props) {
  var t = props.t; var spec = props.spec;
  var canvasRef = useRef(null);
  var apiRef = useRef(null);
  var inputRef = useRef({ l: false, r: false, u: false, d: false, fire: false, px: -1, py: -1, pdown: false, mode: "keys" });
  var earnRef = useRef(props.onEarn); earnRef.current = props.onEarn;
  var scoreRef = useRef(props.onScore); scoreRef.current = props.onScore;
  var phaseState = useState("ready"); var phase = phaseState[0], setPhase = phaseState[1];
  var scoreState = useState(0); var score = scoreState[0], setScore = scoreState[1];
  var bestState = useState(props.best ? props.best : 0); var best = bestState[0], setBest = bestState[1];
  var okState = useState(true); var canvasOk = okState[0], setCanvasOk = okState[1];
  var ctlRef = useRef({ start: function () { }, press: function () { } });

  useEffect(function () {
    var cv = canvasRef.current; if (!cv) return undefined;
    var ctx = cv.getContext ? cv.getContext("2d") : null;
    if (!ctx) { setCanvasOk(false); return undefined; }
    var W = spec.W || 160, H = spec.H || 240;
    cv.width = W; cv.height = H;
    var input = inputRef.current;
    var localScore = 0, localLives = spec.lives || 1, frame = 0, localPhase = "ready", gs = null, shakeT = 0;
    var rafFn = (typeof window !== "undefined" && window.requestAnimationFrame) ? window.requestAnimationFrame : function (cb) { return setTimeout(function () { cb(0); }, 16); };
    var cancelFn = (typeof window !== "undefined" && window.cancelAnimationFrame) ? window.cancelAnimationFrame : clearTimeout;

    function font(px) { ctx.font = "700 " + px + "px " + MONO; }
    var api = {
      W: W, H: H, ctx: ctx, input: input, dt: 1, frame: 0,
      px: function (x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, Math.max(1, w | 0), Math.max(1, h | 0)); },
      clear: function (c) { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); },
      text: function (str, x, y, c, size, align) { font(size || 8); ctx.fillStyle = c; ctx.textAlign = align || "left"; ctx.textBaseline = "top"; ctx.fillText(str, x | 0, y | 0); ctx.textAlign = "left"; },
      circle: function (cx, cy, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill(); },
      rnd: function () { return Math.random(); },
      rndInt: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
      pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
      addScore: function (n) { localScore += n; },
      setScore: function (n) { localScore = n; },
      getScore: function () { return localScore; },
      loseLife: function () { localLives -= 1; if (localLives <= 0) api.die(); },
      lives: function () { return localLives; },
      best: function () { return Math.max(best, localScore); },
      shake: function (n) { shakeT = n; },
      die: function () { if (localPhase !== "playing") return; localPhase = "dead"; setPhase("dead"); endGame(); }
    };
    apiRef.current = api;

    function start() {
      localScore = 0; localLives = spec.lives || 1; frame = 0; shakeT = 0;
      input.l = input.r = input.u = input.d = input.fire = false;
      gs = spec.setup(api); localPhase = "playing"; setPhase("playing"); setScore(0);
    }
    function endGame() {
      var sc = localScore;
      if (sc > best) { setBest(sc); if (scoreRef.current) scoreRef.current(spec.id, sc); }
      var tickets = 1 + Math.floor(sc / (spec.ticketPer || 5));
      var xp = 1 + Math.floor(sc / (spec.xpPer || 4));
      if (earnRef.current) earnRef.current(xp, tickets);
    }
    function doPress(btn) {
      if (localPhase === "ready" || localPhase === "dead") { start(); return; }
      if (spec.press) spec.press(api, gs, btn);
    }
    ctlRef.current.start = start;
    ctlRef.current.press = doPress;

    function onKey(e) {
      var k = e.key; var lk = ("" + k).toLowerCase();
      var handled = true;
      if (lk === "arrowleft" || lk === "a") input.l = true;
      else if (lk === "arrowright" || lk === "d") input.r = true;
      else if (lk === "arrowup" || lk === "w") input.u = true;
      else if (lk === "arrowdown" || lk === "s") input.d = true;
      else if (lk === " " || lk === "enter") input.fire = true;
      else handled = false;
      if (handled) input.mode = "keys";
      if (handled) {
        if (e.preventDefault) e.preventDefault();
        if (!e.repeat) {
          if (localPhase === "ready" || localPhase === "dead") start();
          else { var b = (lk === " " || lk === "enter") ? "fire" : (lk === "arrowleft" || lk === "a" ? "left" : (lk === "arrowright" || lk === "d" ? "right" : (lk === "arrowup" || lk === "w" ? "up" : "down"))); if (spec.press) spec.press(api, gs, b); }
        }
      }
    }
    function onKeyUp(e) {
      var lk = ("" + e.key).toLowerCase();
      if (lk === "arrowleft" || lk === "a") input.l = false;
      else if (lk === "arrowright" || lk === "d") input.r = false;
      else if (lk === "arrowup" || lk === "w") input.u = false;
      else if (lk === "arrowdown" || lk === "s") input.d = false;
      else if (lk === " " || lk === "enter") input.fire = false;
    }
    function ptLogical(e) {
      var r = cv.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * W;
      var y = ((e.clientY - r.top) / r.height) * H;
      return { x: x, y: y };
    }
    function onDown(e) {
      if (e && e.preventDefault) e.preventDefault();
      var p = ptLogical(e); input.px = p.x; input.py = p.y; input.pdown = true; input.mode = "pointer";
      if (localPhase === "ready" || localPhase === "dead") { start(); return; }
      if (spec.press) {
        if (ctrlHas(spec.controls, "flip")) spec.press(api, gs, p.x < W / 2 ? "left" : "right");
        else spec.press(api, gs, "tap");
      }
    }
    function onMove(e) { var p = ptLogical(e); input.px = p.x; input.py = p.y; if (e.pointerType === "mouse") { input.pdown = true; input.mode = "pointer"; } }
    function onUp(e) { if (!e || e.pointerType !== "mouse") input.pdown = false; }
    function onLeave() { input.pdown = false; }

    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    var raf = 0, running = true;
    function loop() {
      if (!running) return;
      frame += 1; api.frame = frame;
      if (localPhase === "playing") { spec.update(api, gs); if (localScore !== score) setScore(localScore); }
      ctx.save();
      if (shakeT > 0) { shakeT -= 1; ctx.translate((Math.random() * 2 - 1) * 2, (Math.random() * 2 - 1) * 2); }
      if (gs) spec.draw(api, gs); else { api.clear(spec.bg || AB.deep); }
      ctx.restore();
      raf = rafFn(loop);
    }
    raf = rafFn(loop);
    return function () {
      running = false; cancelFn(raf);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function hold(dir, val) { var inp = inputRef.current; inp[dir] = val; if (val) inp.mode = "keys"; }
  function tapBtn(btn) { if (ctlRef.current.press) ctlRef.current.press(btn); }

  // control cluster
  var controls = spec.controls || "tap";
  var ctlEls = [];
  if (ctrlHas(controls, "dpad")) {
    ctlEls.push(h("div", { key: "dpad", style: { display: "grid", gridTemplateColumns: "52px 52px 52px", gridTemplateRows: "52px 52px", gap: 6, justifyContent: "center", alignItems: "center" } },
      h("div", null), h(PadButton, { t: t, label: "\u25B2", onDown: function () { hold("u", true); tapBtn("up"); }, onUp: function () { hold("u", false); } }), h("div", null),
      h(PadButton, { t: t, label: "\u25C0", onDown: function () { hold("l", true); tapBtn("left"); }, onUp: function () { hold("l", false); } }),
      h(PadButton, { t: t, label: "\u25BC", onDown: function () { hold("d", true); tapBtn("down"); }, onUp: function () { hold("d", false); } }),
      h(PadButton, { t: t, label: "\u25B6", onDown: function () { hold("r", true); tapBtn("right"); }, onUp: function () { hold("r", false); } })));
  } else if (ctrlHas(controls, "lr")) {
    ctlEls.push(h("div", { key: "lr", style: { display: "flex", gap: 14, justifyContent: "center" } },
      h(PadButton, { t: t, big: true, label: "\u25C0", onDown: function () { hold("l", true); tapBtn("left"); }, onUp: function () { hold("l", false); } }),
      h(PadButton, { t: t, big: true, label: "\u25B6", onDown: function () { hold("r", true); tapBtn("right"); }, onUp: function () { hold("r", false); } })));
  }
  if (ctrlHas(controls, "fire")) {
    ctlEls.push(h("div", { key: "fire", style: { display: "flex", justifyContent: "center", marginTop: 10 } },
      h(PadButton, { t: t, big: true, color: AB.coral, label: "\u25CF", onDown: function () { hold("fire", true); tapBtn("fire"); }, onUp: function () { hold("fire", false); } })));
  }
  if (controls === "tap") {
    ctlEls.push(h("div", { key: "tap", style: { display: "flex", justifyContent: "center" } },
      h("button", { onPointerDown: function (e) { if (e && e.preventDefault) e.preventDefault(); tapBtn("tap"); }, style: sx({ width: "70%", maxWidth: 220, height: 48, background: AB.navy, color: AB.amber, fontSize: 14, fontWeight: 800, cursor: "pointer", touchAction: "none" }, PX, pxBox(AB.amber, AB.deep)) }, "ACTION")));
  }

  return h("div", null,
    h("div", { style: sx({ position: "relative", maxWidth: 360, margin: "0 auto", background: AB.deep, padding: 6 }, pxBox(AB.line, AB.navy)) },
      h("canvas", { ref: canvasRef, style: { width: "100%", height: "auto", display: "block", imageRendering: "pixelated", background: spec.bg || "#0A3A56", touchAction: "none", cursor: ctrlHas(controls, "pointer") ? "ew-resize" : "pointer" } }),
      h(Scanlines, null),
      canvasOk ? h("div", { style: sx({ position: "absolute", top: 7, left: 10, fontSize: 13, fontWeight: 800, color: "#fff", textShadow: "1px 1px 0 #03192A" }, PX) }, "" + score) : null,
      (canvasOk && (spec.lives || 1) > 1 && phase === "playing") ? h("div", { style: sx({ position: "absolute", top: 7, right: 10, fontSize: 12, fontWeight: 800, color: AB.coral, textShadow: "1px 1px 0 #03192A" }, PX) }, "\u2665" + (apiRef.current ? apiRef.current.lives() : 1)) : null,
      (canvasOk && phase === "ready") ? h("div", { style: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 } },
        h("div", { style: sx({ fontSize: 17, fontWeight: 800, color: spec.color || AB.cyan }, PX) }, spec.title),
        h("div", { style: { fontSize: 12, color: AB.text, margin: "8px 0 14px", lineHeight: 1.5, maxWidth: 260 } }, spec.help),
        h("div", { style: sx({ fontSize: 12, fontWeight: 800, color: AB.amber, padding: "8px 12px", background: AB.navy }, PX, pxBox(AB.line, AB.deep)) }, "Tap / Space to start")) : null,
      (canvasOk && phase === "dead") ? h("div", { style: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, background: "rgba(3,16,26,0.62)" } },
        h("div", { style: sx({ fontSize: 18, fontWeight: 800, color: AB.coral }, PX) }, "Game Over"),
        h("div", { style: { fontSize: 13, color: AB.text, margin: "8px 0 2px" } }, "Score " + score + "  \u00b7  Best " + Math.max(best, score)),
        spec.fact ? h("div", { style: { fontSize: 11, color: AB.cyan, margin: "6px 14px 0", lineHeight: 1.5 } }, "\uD83D\uDC1A " + spec.fact) : null,
        h("div", { style: sx({ fontSize: 12, fontWeight: 800, color: AB.amber, marginTop: 12, padding: "8px 12px", background: AB.navy }, PX, pxBox(AB.line, AB.deep)) }, "Tap / Space to retry")) : null,
      !canvasOk ? h("div", { style: { padding: 24, textAlign: "center", color: AB.text, fontSize: 13, lineHeight: 1.5 } }, "This game needs canvas support, which isn't available in this preview. It will play normally in your browser.") : null
    ),
    canvasOk ? h("div", { style: { marginTop: 12 } }, ctlEls) : null,
    h("div", { style: { fontSize: 11, color: t.textFaint, textAlign: "center", marginTop: 10 } }, ctrlHas(controls, "pointer") ? "Drag on the screen to move \u00b7 points earn tickets & XP" : "Points earn tickets & XP (daily XP capped)")
  );
}

/* ============================================ ARCADE GAME SPECS ======= */
var ARCADE_SPECS = [];

ARCADE_SPECS.push({
  id: "pong", title: "Acorn Pong", tag: "Arcade", desc: "Volley an acorn past the squirrel.", icon: "spark", color: AB.cyan, controls: "lr pointer", lives: 3, W: 180, H: 150, bg: "#06283A",
  fact: "A gray squirrel can relocate acorns it buried months earlier using memory and smell.",
  help: "Slide your paddle. Get the acorn past the top to score; don't let it past you.",
  setup: function (api) { return { px: api.W / 2, ai: api.W / 2, bx: api.W / 2, by: api.H / 2, vx: 1.4, vy: 2, pw: 36 }; },
  update: function (api, g) {
    var W = api.W, H = api.H;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px += (api.input.px - g.px) * 0.4; } else { if (api.input.l) g.px -= 3.6; if (api.input.r) g.px += 3.6; }
    if (g.px < g.pw / 2) g.px = g.pw / 2; if (g.px > W - g.pw / 2) g.px = W - g.pw / 2;
    var diff = g.bx - g.ai; var step = Math.max(-2.1, Math.min(2.1, diff)); g.ai += step + (api.rnd() - 0.5) * 0.7;
    if (g.ai < g.pw / 2) g.ai = g.pw / 2; if (g.ai > W - g.pw / 2) g.ai = W - g.pw / 2;
    g.bx += g.vx; g.by += g.vy;
    if (g.bx < 3) { g.bx = 3; g.vx = -g.vx; } if (g.bx > W - 3) { g.bx = W - 3; g.vx = -g.vx; }
    var py = H - 11, ay = 11;
    if (g.vy > 0 && g.by >= py - 3 && g.by <= py + 3 && Math.abs(g.bx - g.px) < g.pw / 2 + 2) { g.vy = -Math.abs(g.vy); g.vx += (g.bx - g.px) * 0.08; g.vy *= 1.03; if (g.vy > 4) g.vy = 4; }
    if (g.vy < 0 && g.by <= ay + 3 && g.by >= ay - 3 && Math.abs(g.bx - g.ai) < g.pw / 2 + 2) { g.vy = Math.abs(g.vy); g.vx += (g.bx - g.ai) * 0.06; }
    if (g.by < -2) { api.addScore(1); g.bx = W / 2; g.by = H / 2; g.vx = api.rnd() * 1.6 - 0.8; g.vy = 2; }
    else if (g.by > H + 2) { api.loseLife(); g.bx = W / 2; g.by = H / 2; g.vx = api.rnd() * 1.6 - 0.8; g.vy = -2; }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06283A");
    var y; for (y = 0; y < H; y += 8) api.px(W / 2 - 1, y, 2, 4, "#0E4B63");
    api.px(g.ai - g.pw / 2, 8, g.pw, 5, AB.coral);
    api.px(g.px - g.pw / 2, H - 13, g.pw, 5, AB.cyan);
    api.px(g.bx - 3, g.by - 3, 6, 6, AB.amber); api.px(g.bx - 4, g.by - 1, 1, 2, AB.amber); api.px(g.bx + 3, g.by - 1, 1, 2, AB.amber);
  }
});

ARCADE_SPECS.push({
  id: "breaker", title: "Boulder Breaker", tag: "Arcade", desc: "Smash the rock wall with a bouncing stone.", icon: "depth", color: AB.amber, controls: "lr pointer", lives: 3, W: 200, H: 260, bg: "#06283A",
  fact: "Lichens slowly break bare rock down into soil — often the first life to grow on fresh stone.",
  help: "Bounce the stone to break the rocks. Don't let it fall past your paddle.",
  setup: function (api) {
    var cols = 8, rows = 5, bricks = [], bw = (api.W - 8) / cols, palette = [AB.coral, AB.amber, AB.green, AB.teal, AB.sand];
    var r, c; for (r = 0; r < rows; r++) { for (c = 0; c < cols; c++) { bricks.push({ x: 4 + c * bw, y: 26 + r * 10, w: bw - 2, h: 8, alive: true, col: palette[r % 5] }); } }
    return { px: api.W / 2, pw: 40, bx: api.W / 2, by: api.H - 30, vx: 1.4, vy: -2.2, bricks: bricks, cols: cols, rows: rows, left: cols * rows };
  },
  update: function (api, g) {
    var W = api.W, H = api.H;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px += (api.input.px - g.px) * 0.4; } else { if (api.input.l) g.px -= 4; if (api.input.r) g.px += 4; }
    if (g.px < g.pw / 2) g.px = g.pw / 2; if (g.px > W - g.pw / 2) g.px = W - g.pw / 2;
    g.bx += g.vx; g.by += g.vy;
    if (g.bx < 3) { g.bx = 3; g.vx = -g.vx; } if (g.bx > W - 3) { g.bx = W - 3; g.vx = -g.vx; }
    if (g.by < 3) { g.by = 3; g.vy = -g.vy; }
    var py = H - 14;
    if (g.vy > 0 && g.by >= py - 3 && g.by <= py + 3 && Math.abs(g.bx - g.px) < g.pw / 2 + 2) { g.vy = -Math.abs(g.vy); g.vx += (g.bx - g.px) * 0.10; if (g.vx > 4) g.vx = 4; if (g.vx < -4) g.vx = -4; }
    var i; for (i = 0; i < g.bricks.length; i++) {
      var b = g.bricks[i]; if (!b.alive) continue;
      if (g.bx > b.x - 2 && g.bx < b.x + b.w + 2 && g.by > b.y - 2 && g.by < b.y + b.h + 2) {
        b.alive = false; g.left -= 1; api.addScore(1);
        var ox = Math.min(Math.abs(g.bx - b.x), Math.abs(g.bx - (b.x + b.w)));
        var oy = Math.min(Math.abs(g.by - b.y), Math.abs(g.by - (b.y + b.h)));
        if (oy < ox) g.vy = -g.vy; else g.vx = -g.vx; break;
      }
    }
    if (g.left <= 0) { api.addScore(5); var j; for (j = 0; j < g.bricks.length; j++) g.bricks[j].alive = true; g.left = g.cols * g.rows; g.by = H - 30; g.vy = -Math.abs(g.vy) * 1.04; }
    if (g.by > H + 3) { api.loseLife(); g.bx = W / 2; g.by = H - 30; g.vx = 1.4; g.vy = -2.2; }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06283A");
    var i; for (i = 0; i < g.bricks.length; i++) { var b = g.bricks[i]; if (!b.alive) continue; api.px(b.x, b.y, b.w, b.h, b.col); api.px(b.x, b.y, b.w, 1, "rgba(255,255,255,0.25)"); }
    api.px(g.px - g.pw / 2, H - 14, g.pw, 5, AB.cyan);
    api.px(g.bx - 2, g.by - 2, 4, 4, "#EAF7FF");
  }
});

ARCADE_SPECS.push({
  id: "jelly", title: "Seed Drift", tag: "Action", desc: "Float a maple seed through gaps in the canopy.", icon: "wave", color: AB.teal, controls: "tap", lives: 1, W: 160, H: 240, bg: "#072E45",
  fact: "Maple seeds spin like tiny helicopters, letting the wind carry them far from the parent tree.",
  help: "Tap to float upward. Slip through the gaps in the canopy.",
  setup: function (api) { return { y: api.H / 2, vy: 0, walls: [], t: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++;
    g.vy += 0.22; if (g.vy > 4) g.vy = 4; g.y += g.vy;
    if (g.t % 72 === 0) { var gap = 54, top = api.rndInt(18, H - 18 - gap); g.walls.push({ x: W + 10, top: top, gap: gap, w: 20, scored: false }); }
    var i; for (i = g.walls.length - 1; i >= 0; i--) {
      var wl = g.walls[i]; wl.x -= 1.7;
      if (!wl.scored && wl.x + wl.w < 40) { wl.scored = true; api.addScore(1); }
      if (wl.x < 50 && wl.x + wl.w > 30) { if (g.y < wl.top || g.y > wl.top + wl.gap) { api.die(); } }
      if (wl.x < -24) g.walls.splice(i, 1);
    }
    if (g.y > H - 6 || g.y < 4) api.die();
  },
  press: function (api, g, btn) { g.vy = -3.4; },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#072E45");
    var i; for (i = 0; i < g.walls.length; i++) { var wl = g.walls[i]; api.px(wl.x, 0, wl.w, wl.top, AB.rock); api.px(wl.x, wl.top - 4, wl.w, 4, AB.weed); api.px(wl.x, wl.top + wl.gap, wl.w, H - wl.top - wl.gap, AB.rock); api.px(wl.x, wl.top + wl.gap, wl.w, 4, AB.weed); }
    var jx = 40, jy = g.y; api.px(jx - 5, jy - 4, 10, 7, AB.teal); api.px(jx - 6, jy - 2, 12, 4, AB.teal);
    var k; for (k = -4; k <= 4; k += 3) api.px(jx + k, jy + 3, 1, 5, AB.cyan);
    api.px(jx - 2, jy - 2, 2, 2, "#CFF6FF");
  }
});

ARCADE_SPECS.push({
  id: "plastic", title: "Litter Patrol", tag: "Action", desc: "Grab the litter, spare the wildlife.", icon: "anchor", color: AB.green, controls: "lr pointer", lives: 3, W: 180, H: 240, bg: "#073049",
  fact: "A single plastic bottle can take around 450 years to break down in nature.",
  help: "Catch falling litter in your bag. Don't grab the wildlife!",
  setup: function (api) { return { px: api.W / 2, pw: 34, items: [], t: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px += (api.input.px - g.px) * 0.45; } else { if (api.input.l) g.px -= 4; if (api.input.r) g.px += 4; }
    if (g.px < g.pw / 2) g.px = g.pw / 2; if (g.px > W - g.pw / 2) g.px = W - g.pw / 2;
    if (g.t % 32 === 0) { var fish = api.rnd() < 0.28; g.items.push({ x: api.rndInt(10, W - 10), y: -6, vy: 1.2 + api.rnd() * 1.3, fish: fish }); }
    var py = H - 16, i;
    for (i = g.items.length - 1; i >= 0; i--) {
      var it = g.items[i]; it.y += it.vy;
      if (it.y > py - 5 && it.y < py + 8 && Math.abs(it.x - g.px) < g.pw / 2 + 4) { if (it.fish) { api.loseLife(); } else { api.addScore(1); } g.items.splice(i, 1); continue; }
      if (it.y > H + 6) g.items.splice(i, 1);
    }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#073049");
    api.px(0, H - 6, W, 6, "#0B2A1E");
    var i; for (i = 0; i < g.items.length; i++) { var it = g.items[i]; if (it.fish) { api.px(it.x - 4, it.y - 2, 7, 5, AB.amber); api.px(it.x - 6, it.y, 3, 3, AB.coral); } else { api.px(it.x - 3, it.y - 3, 6, 6, "#B9C7CC"); api.px(it.x - 2, it.y - 2, 2, 1, "#fff"); } }
    api.px(g.px - g.pw / 2, H - 16, g.pw, 4, AB.green); var k; for (k = -g.pw / 2; k < g.pw / 2; k += 4) api.px(g.px + k, H - 16, 1, 6, AB.weed);
  }
});

ARCADE_SPECS.push({
  id: "snake", title: "Caterpillar Crawl", tag: "Classic", desc: "Grow your caterpillar by eating leaves.", icon: "fish", color: AB.green, controls: "dpad", lives: 1, W: 160, H: 200, bg: "#062235", ticketPer: 3, xpPer: 2,
  fact: "A caterpillar can eat many times its own weight in leaves before forming a chrysalis.",
  help: "Steer the caterpillar to eat leaves. Don't hit the walls or yourself.",
  setup: function (api) {
    var cell = 10, cols = Math.floor(api.W / cell), rows = Math.floor(api.H / cell);
    return { cell: cell, cols: cols, rows: rows, body: [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }], dir: { x: 1, y: 0 }, ndir: { x: 1, y: 0 }, food: { x: 12, y: 10 }, step: 0, speed: 7 };
  },
  press: function (api, g, btn) {
    var d = g.dir;
    if (btn === "left" && d.x !== 1) g.ndir = { x: -1, y: 0 };
    else if (btn === "right" && d.x !== -1) g.ndir = { x: 1, y: 0 };
    else if (btn === "up" && d.y !== 1) g.ndir = { x: 0, y: -1 };
    else if (btn === "down" && d.y !== -1) g.ndir = { x: 0, y: 1 };
  },
  update: function (api, g) {
    g.step++; if (g.step < g.speed) return; g.step = 0;
    g.dir = g.ndir; var head = g.body[0], nh = { x: head.x + g.dir.x, y: head.y + g.dir.y };
    if (nh.x < 0 || nh.y < 0 || nh.x >= g.cols || nh.y >= g.rows) { api.die(); return; }
    var i; for (i = 0; i < g.body.length; i++) { if (g.body[i].x === nh.x && g.body[i].y === nh.y) { api.die(); return; } }
    g.body.unshift(nh);
    if (nh.x === g.food.x && nh.y === g.food.y) {
      api.addScore(1); if (g.speed > 3.5) g.speed -= 0.16;
      var ok = false, tries = 0; while (!ok && tries < 300) { tries++; var fx = api.rndInt(0, g.cols - 1), fy = api.rndInt(0, g.rows - 1); ok = true; var j; for (j = 0; j < g.body.length; j++) { if (g.body[j].x === fx && g.body[j].y === fy) { ok = false; break; } } if (ok) g.food = { x: fx, y: fy }; }
    } else { g.body.pop(); }
  },
  draw: function (api, g) {
    var c = g.cell; api.clear("#062235");
    api.px(g.food.x * c + 1, g.food.y * c + 1, c - 2, c - 2, AB.amber); api.px(g.food.x * c + c - 4, g.food.y * c + 2, 2, 2, AB.coral);
    var i; for (i = 0; i < g.body.length; i++) { var s = g.body[i]; api.px(s.x * c + 1, s.y * c + 1, c - 2, c - 2, i === 0 ? AB.green : AB.weed); }
  }
});

ARCADE_SPECS.push({
  id: "memory", title: "Trail Memory", tag: "Brain", desc: "Match pairs of forest creatures.", icon: "star", color: AB.coral, controls: "grid", lives: 1, W: 200, H: 230, bg: "#072E45", ticketPer: 2, xpPer: 2,
  fact: "An octopus has about 500 million neurons \u2014 most of them in its arms.",
  help: "Tap two tiles to flip them. Find all six matching pairs.",
  setup: function (api) {
    var syms = [AB.amber, AB.coral, AB.green, AB.cyan, AB.sand, AB.teal];
    var deck = []; var i; for (i = 0; i < syms.length; i++) { deck.push({ c: syms[i], k: i }); deck.push({ c: syms[i], k: i }); }
    deck = shuffleArr(deck);
    var cells = [], cols = 4, rows = 3, m = 8, gw = (api.W - m * 2) / cols, gh = (api.H - 40 - m) / rows, r, c;
    for (r = 0; r < rows; r++) { for (c = 0; c < cols; c++) { cells.push({ x: m + c * gw, y: 30 + r * gh, w: gw - 4, h: gh - 4, sym: deck[r * cols + c], up: false, done: false }); } }
    return { cells: cells, sel: [], lock: 0, matches: 0 };
  },
  press: function (api, g, btn) {
    if (g.lock > 0) return; var mx = api.input.px, my = api.input.py, i;
    for (i = 0; i < g.cells.length; i++) {
      var cc = g.cells[i]; if (cc.done || cc.up) continue;
      if (mx >= cc.x && mx <= cc.x + cc.w && my >= cc.y && my <= cc.y + cc.h) {
        cc.up = true; g.sel.push(i);
        if (g.sel.length === 2) {
          var a = g.cells[g.sel[0]], b = g.cells[g.sel[1]];
          if (a.sym.k === b.sym.k) { a.done = true; b.done = true; g.matches++; g.sel = []; api.addScore(2); if (g.matches === 6) { api.addScore(10); api.die(); } }
          else { g.lock = 1; }
        }
        break;
      }
    }
  },
  update: function (api, g) {
    if (g.lock > 0) { g.lock++; if (g.lock > 28) { var a = g.cells[g.sel[0]], b = g.cells[g.sel[1]]; if (a) a.up = false; if (b) b.up = false; g.sel = []; g.lock = 0; } }
  },
  draw: function (api, g) {
    api.clear("#072E45"); api.text("MATCHES " + g.matches + "/6", 6, 9, AB.cyan, 8);
    var i; for (i = 0; i < g.cells.length; i++) {
      var cc = g.cells[i];
      if (cc.done) { api.px(cc.x, cc.y, cc.w, cc.h, "#0A3A2A"); api.px(cc.x + cc.w / 2 - 3, cc.y + cc.h / 2 - 3, 6, 6, AB.green); }
      else if (cc.up) { api.px(cc.x, cc.y, cc.w, cc.h, cc.sym.c); api.px(cc.x + 3, cc.y + 3, cc.w - 6, 3, "rgba(255,255,255,0.3)"); }
      else { api.px(cc.x, cc.y, cc.w, cc.h, AB.navy); api.px(cc.x + 2, cc.y + 2, cc.w - 4, cc.h - 4, AB.rock); api.px(cc.x + cc.w / 2 - 3, cc.y + cc.h / 2 - 3, 6, 6, AB.deep); }
    }
  }
});

ARCADE_SPECS.push({
  id: "invaders", title: "Locust Swarm", tag: "Shooter", desc: "Blast the descending swarm of locusts.", icon: "spark", color: AB.cyan, controls: "lr fire", lives: 3, W: 180, H: 240, bg: "#051E30",
  fact: "A large locust swarm can contain tens of millions of insects moving as one.",
  help: "Move with the arrows and fire to scatter the locust swarm before it lands.",
  setup: function (api) {
    var jel = [], r, c; for (r = 0; r < 3; r++) { for (c = 0; c < 6; c++) jel.push({ x: 20 + c * 24, y: 24 + r * 20, alive: true }); }
    return { px: api.W / 2, jel: jel, dir: 1, shots: [], cool: 0 };
  },
  update: function (api, g) {
    var W = api.W, H = api.H;
    if (api.input.l) g.px -= 2.6; if (api.input.r) g.px += 2.6; if (g.px < 8) g.px = 8; if (g.px > W - 8) g.px = W - 8;
    if (g.cool > 0) g.cool--;
    if (api.input.fire && g.cool <= 0) { g.shots.push({ x: g.px, y: H - 18 }); g.cool = 14; }
    var i; for (i = g.shots.length - 1; i >= 0; i--) { g.shots[i].y -= 4; if (g.shots[i].y < -4) g.shots.splice(i, 1); }
    var minx = 999, maxx = -999, maxy = -999, alive = 0, k;
    for (k = 0; k < g.jel.length; k++) { var j = g.jel[k]; if (!j.alive) continue; alive++; if (j.x < minx) minx = j.x; if (j.x > maxx) maxx = j.x; if (j.y > maxy) maxy = j.y; }
    if (alive === 0) { api.addScore(8); var idx = 0, rr, cc; for (rr = 0; rr < 3; rr++) { for (cc = 0; cc < 6; cc++) { g.jel[idx].x = 20 + cc * 24; g.jel[idx].y = 24 + rr * 20; g.jel[idx].alive = true; idx++; } } g.dir = 1; return; }
    if (api.frame % 8 === 0) {
      var stepx = g.dir * 4;
      if (maxx + stepx > W - 10 || minx + stepx < 10) { g.dir = -g.dir; var d; for (d = 0; d < g.jel.length; d++) if (g.jel[d].alive) g.jel[d].y += 8; }
      else { var e; for (e = 0; e < g.jel.length; e++) if (g.jel[e].alive) g.jel[e].x += stepx; }
    }
    var s; for (s = g.shots.length - 1; s >= 0; s--) { var sh = g.shots[s]; var jj; for (jj = 0; jj < g.jel.length; jj++) { var J = g.jel[jj]; if (!J.alive) continue; if (Math.abs(sh.x - J.x) < 8 && Math.abs(sh.y - J.y) < 8) { J.alive = false; g.shots.splice(s, 1); api.addScore(1); break; } } }
    if (maxy > H - 24) api.die();
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#051E30");
    var i; for (i = 0; i < g.jel.length; i++) { var j = g.jel[i]; if (!j.alive) continue; api.px(j.x - 5, j.y - 3, 10, 6, AB.teal); api.px(j.x - 3, j.y + 3, 1, 3, AB.cyan); api.px(j.x, j.y + 3, 1, 3, AB.cyan); api.px(j.x + 3, j.y + 3, 1, 3, AB.cyan); }
    var s; for (s = 0; s < g.shots.length; s++) api.px(g.shots[s].x - 1, g.shots[s].y - 2, 2, 4, AB.cyan);
    api.px(g.px - 7, H - 14, 14, 5, AB.amber); api.px(g.px - 2, H - 18, 4, 4, AB.amber);
  }
});

ARCADE_SPECS.push({
  id: "turtle", title: "Toad Crossing", tag: "Classic", desc: "Guide the toad safely across the road.", icon: "fish", color: AB.green, controls: "dpad", lives: 3, W: 180, H: 220, bg: "#0A3A2A",
  fact: "Some towns build small tunnels so toads can safely cross roads on rainy migration nights.",
  help: "Hop across, dodging cars and hazards. Reach the far side to score.",
  setup: function (api) {
    var cell = 20, rows = Math.floor(api.H / cell), lanes = [], r;
    for (r = 1; r < rows - 1; r++) { var spd = (r % 2 === 0 ? 1 : -1) * (0.6 + 0.22 * (r % 3)); var n = 2 + (r % 2), cars = [], c; for (c = 0; c < n; c++) cars.push({ x: c * (api.W / n) + api.rnd() * 20, w: 24 + (r % 2) * 10 }); lanes.push({ y: r * cell, spd: spd, cars: cars, h: cell }); }
    return { cell: cell, rows: rows, lanes: lanes, px: api.W / 2, py: (rows - 1) * cell + cell / 2 };
  },
  press: function (api, g, btn) {
    var c = g.cell;
    if (btn === "up") { g.py -= c; if (g.py < c / 2) { api.addScore(5); g.py = (g.rows - 1) * c + c / 2; } }
    else if (btn === "down") { g.py += c; if (g.py > (g.rows - 1) * c + c / 2) g.py = (g.rows - 1) * c + c / 2; }
    else if (btn === "left") { g.px -= c; if (g.px < c / 2) g.px = c / 2; }
    else if (btn === "right") { g.px += c; if (g.px > api.W - c / 2) g.px = api.W - c / 2; }
  },
  update: function (api, g) {
    var W = api.W, i; for (i = 0; i < g.lanes.length; i++) { var ln = g.lanes[i]; var c; for (c = 0; c < ln.cars.length; c++) { var car = ln.cars[c]; car.x += ln.spd; if (car.x > W + 30) car.x = -30; if (car.x < -30) car.x = W + 30; if (Math.abs(g.py - (ln.y + ln.h / 2)) < ln.h / 2 && g.px > car.x - 2 && g.px < car.x + car.w + 2) { api.loseLife(); g.py = (g.rows - 1) * g.cell + g.cell / 2; g.px = W / 2; } } }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#0A3A2A");
    api.px(0, 0, W, g.cell, "#0C4F6E");
    var i; for (i = 0; i < g.lanes.length; i++) { var ln = g.lanes[i]; api.px(0, ln.y, W, ln.h, "#0E3550"); var c; for (c = 0; c < ln.cars.length; c++) { var car = ln.cars[c]; api.px(car.x, ln.y + 3, car.w, ln.h - 6, AB.coral); api.px(car.x + 2, ln.y + 5, car.w - 4, 2, "rgba(255,255,255,0.2)"); } }
    api.px(g.px - 7, g.py - 7, 14, 14, AB.green); api.px(g.px - 4, g.py - 4, 8, 8, AB.weed); api.px(g.px - 2, g.py - 9, 4, 3, AB.green);
  }
});

ARCADE_SPECS.push({
  id: "crab", title: "Berry Catch", tag: "Action", desc: "Catch ripe berries, dodge the thorns.", icon: "star", color: AB.sand, controls: "lr pointer", lives: 3, W: 180, H: 240, bg: "#08263A",
  fact: "Bears gorge on berries in late summer, eating tens of thousands in a single day.",
  help: "Move the basket to catch falling berries. Avoid the sharp thorns!",
  setup: function (api) { return { px: api.W / 2, pw: 30, items: [], t: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px += (api.input.px - g.px) * 0.45; } else { if (api.input.l) g.px -= 4.2; if (api.input.r) g.px += 4.2; }
    if (g.px < g.pw / 2) g.px = g.pw / 2; if (g.px > W - g.pw / 2) g.px = W - g.pw / 2;
    if (g.t % 30 === 0) { var bad = api.rnd() < 0.3; g.items.push({ x: api.rndInt(8, W - 8), y: -6, vy: 1.4 + api.rnd() * 1.4, bad: bad }); }
    var py = H - 14, i; for (i = g.items.length - 1; i >= 0; i--) { var it = g.items[i]; it.y += it.vy; if (it.y > py - 5 && it.y < py + 8 && Math.abs(it.x - g.px) < g.pw / 2 + 4) { if (it.bad) { api.loseLife(); } else { api.addScore(1); } g.items.splice(i, 1); continue; } if (it.y > H + 6) g.items.splice(i, 1); }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#08263A"); api.px(0, H - 5, W, 5, "#0A3A2A");
    var i; for (i = 0; i < g.items.length; i++) { var it = g.items[i]; if (it.bad) { api.px(it.x - 3, it.y - 3, 6, 6, "#5B3A6B"); api.px(it.x - 5, it.y, 2, 1, "#7A4F8C"); api.px(it.x + 4, it.y, 2, 1, "#7A4F8C"); api.px(it.x, it.y - 5, 1, 2, "#7A4F8C"); } else { api.px(it.x - 2, it.y - 2, 5, 5, AB.cyan); api.px(it.x - 1, it.y - 3, 2, 1, "#fff"); } }
    api.px(g.px - g.pw / 2, H - 13, g.pw, 7, AB.coral); api.px(g.px - 4, H - 16, 2, 3, AB.coral); api.px(g.px + 3, H - 16, 2, 3, AB.coral);
  }
});

ARCADE_SPECS.push({
  id: "kelp", title: "Tree Climber", tag: "Action", desc: "Bounce up through the forest canopy.", icon: "wave", color: AB.green, controls: "lr pointer", lives: 1, W: 160, H: 240, bg: "#073B2C",
  fact: "Some bamboo can grow nearly a meter in a single day — among the fastest growth of any plant.",
  help: "Bounce higher and higher up the branches. Don't fall off the bottom!",
  setup: function (api) { var plats = [], i; for (i = 0; i < 7; i++) plats.push({ x: api.rndInt(10, api.W - 50), y: api.H - 20 - i * 32, w: 40 }); return { px: api.W / 2, py: api.H - 40, vy: -4, plats: plats, climb: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px = api.input.px; } else { if (api.input.l) g.px -= 3.4; if (api.input.r) g.px += 3.4; }
    if (g.px < 0) g.px = W; if (g.px > W) g.px = 0;
    g.vy += 0.22; g.py += g.vy;
    if (g.vy > 0) { var i; for (i = 0; i < g.plats.length; i++) { var p = g.plats[i]; if (g.px > p.x - 4 && g.px < p.x + p.w + 4 && g.py > p.y - 2 && g.py < p.y + 6) g.vy = -4.7; } }
    if (g.py < H / 2) { var dy = H / 2 - g.py; g.py = H / 2; var j; for (j = 0; j < g.plats.length; j++) g.plats[j].y += dy; g.climb += dy; api.setScore(Math.floor(g.climb / 10)); }
    var k; for (k = 0; k < g.plats.length; k++) { if (g.plats[k].y > H + 4) { g.plats[k].y -= H + 8; g.plats[k].x = api.rndInt(10, W - 50); } }
    if (g.py > H + 6) api.die();
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#073B2C");
    var i; for (i = 0; i < g.plats.length; i++) { var p = g.plats[i]; api.px(p.x, p.y, p.w, 5, AB.weed); api.px(p.x, p.y, p.w, 2, AB.green); }
    api.px(g.px - 5, g.py - 6, 10, 10, AB.amber); api.px(g.px - 2, g.py - 3, 3, 3, "#06283A"); api.px(g.px - 6, g.py, 3, 4, AB.coral);
  }
});

ARCADE_SPECS.push({
  id: "octo", title: "Hail Dodge", tag: "Survival", desc: "Survive the hailstorm.", icon: "spark", color: AB.coral, controls: "dpad pointer", lives: 1, W: 200, H: 200, bg: "#0A2238",
  fact: "Hailstones grow as storm updrafts toss raindrops up into freezing air again and again.",
  help: "Move to dodge the falling hailstones. Survive as long as you can.",
  setup: function (api) { return { px: api.W / 2, py: api.H - 20, blobs: [], t: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px += (api.input.px - g.px) * 0.5; g.py += (api.input.py - g.py) * 0.5; } else { if (api.input.l) g.px -= 3.4; if (api.input.r) g.px += 3.4; if (api.input.u) g.py -= 3.4; if (api.input.d) g.py += 3.4; }
    if (g.px < 5) g.px = 5; if (g.px > W - 5) g.px = W - 5; if (g.py < 5) g.py = 5; if (g.py > H - 5) g.py = H - 5;
    var rate = Math.max(6, 18 - Math.floor(g.t / 300));
    if (g.t % rate === 0) g.blobs.push({ x: api.rndInt(6, W - 6), y: -6, vy: 1.4 + api.rnd() * 2 + g.t / 2200, r: api.rndInt(3, 6) });
    if (g.t % 6 === 0) api.addScore(1);
    var i; for (i = g.blobs.length - 1; i >= 0; i--) { var b = g.blobs[i]; b.y += b.vy; var dx = b.x - g.px, dy = b.y - g.py; if (dx * dx + dy * dy < (b.r + 4) * (b.r + 4)) api.die(); if (b.y > H + 8) g.blobs.splice(i, 1); }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#0A2238");
    var i; for (i = 0; i < g.blobs.length; i++) { var b = g.blobs[i]; api.px(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2, "#3A2A55"); api.px(b.x - b.r + 1, b.y - b.r, 2, 1, "#5A4575"); }
    api.px(g.px - 5, g.py - 4, 10, 8, AB.coral); api.px(g.px - 3, g.py - 2, 2, 2, "#fff"); api.px(g.px + 1, g.py - 2, 2, 2, "#fff");
    var k; for (k = -4; k <= 4; k += 3) api.px(g.px + k, g.py + 4, 1, 4, AB.coral);
  }
});

ARCADE_SPECS.push({
  id: "seahorse", title: "Squirrel Sprint", tag: "Runner", desc: "Weave through three forest lanes.", icon: "fish", color: AB.amber, controls: "lr", lives: 3, W: 150, H: 240, bg: "#06324A",
  fact: "Flying squirrels don't truly fly — they glide on flaps of skin stretched between their legs.",
  help: "Tap left / right to switch lanes and dodge the rocks.",
  setup: function (api) { return { lanes: [api.W * 0.25, api.W * 0.5, api.W * 0.75], lane: 1, obs: [], t: 0, spd: 2.4 }; },
  press: function (api, g, btn) { if (btn === "left" && g.lane > 0) g.lane--; else if (btn === "right" && g.lane < 2) g.lane++; },
  update: function (api, g) {
    var H = api.H; g.t++; g.spd += 0.0009;
    if (g.t % Math.max(24, 56 - Math.floor(g.t / 120)) === 0) { g.obs.push({ lane: api.rndInt(0, 2), y: -10 }); api.addScore(1); }
    var py = H - 30, i; for (i = g.obs.length - 1; i >= 0; i--) { var o = g.obs[i]; o.y += g.spd; if (o.y > py - 10 && o.y < py + 10 && o.lane === g.lane) { api.loseLife(); g.obs.splice(i, 1); continue; } if (o.y > H + 10) g.obs.splice(i, 1); }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06324A");
    var i; for (i = 1; i < 3; i++) api.px(W * i / 3 - 1, 0, 1, H, "#0E4B63");
    for (i = 0; i < g.obs.length; i++) { var o = g.obs[i]; var x = g.lanes[o.lane]; api.px(x - 7, o.y - 7, 14, 14, AB.rock); api.px(x - 7, o.y - 7, 14, 2, AB.weed); }
    var px = g.lanes[g.lane]; api.px(px - 4, H - 36, 8, 12, AB.amber); api.px(px - 2, H - 40, 5, 5, AB.amber); api.px(px + 1, H - 39, 2, 2, "#06283A"); api.px(px - 4, H - 26, 3, 4, AB.amber);
  }
});

ARCADE_SPECS.push({
  id: "anchor", title: "Rockslide", tag: "Shooter", desc: "Blast tumbling rocks on the mountainside.", icon: "anchor", color: AB.cyan, controls: "dpad fire", lives: 3, W: 200, H: 220, bg: "#041726",
  fact: "Frost, water and gravity slowly wear mountains down — even the tallest peaks are shrinking.",
  help: "Left/right rotate, up thrusts, fire shoots. Blast rocks, don't get hit.",
  setup: function (api) { var rocks = [], i; for (i = 0; i < 4; i++) rocks.push({ x: api.rndInt(0, api.W), y: api.rndInt(0, 60), vx: api.rnd() * 1.2 - 0.6, vy: 0.4 + api.rnd() * 0.8, r: api.rndInt(8, 12) }); return { x: api.W / 2, y: api.H / 2, a: -1.57, vx: 0, vy: 0, rocks: rocks, shots: [], cool: 0, t: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++;
    if (api.input.l) g.a -= 0.08; if (api.input.r) g.a += 0.08;
    if (api.input.u) { g.vx += Math.cos(g.a) * 0.12; g.vy += Math.sin(g.a) * 0.12; }
    g.vx *= 0.99; g.vy *= 0.99; g.x += g.vx; g.y += g.vy;
    if (g.x < 0) g.x += W; if (g.x > W) g.x -= W; if (g.y < 0) g.y += H; if (g.y > H) g.y -= H;
    if (g.cool > 0) g.cool--;
    if (api.input.fire && g.cool <= 0) { g.shots.push({ x: g.x, y: g.y, vx: Math.cos(g.a) * 3.6, vy: Math.sin(g.a) * 3.6, life: 60 }); g.cool = 12; }
    var i; for (i = g.shots.length - 1; i >= 0; i--) { var s = g.shots[i]; s.x += s.vx; s.y += s.vy; s.life--; if (s.x < 0) s.x += W; if (s.x > W) s.x -= W; if (s.y < 0) s.y += H; if (s.y > H) s.y -= H; if (s.life <= 0) g.shots.splice(i, 1); }
    var r2; for (r2 = g.rocks.length - 1; r2 >= 0; r2--) {
      var rk = g.rocks[r2]; rk.x += rk.vx; rk.y += rk.vy; if (rk.x < 0) rk.x += W; if (rk.x > W) rk.x -= W; if (rk.y > H + 12) { rk.y = -10; rk.x = api.rndInt(0, W); }
      var dx = rk.x - g.x, dy = rk.y - g.y; if (dx * dx + dy * dy < (rk.r + 5) * (rk.r + 5)) { api.loseLife(); rk.y = -10; rk.x = api.rndInt(0, W); continue; }
      var s2; for (s2 = g.shots.length - 1; s2 >= 0; s2--) { var sh = g.shots[s2]; var ex = sh.x - rk.x, ey = sh.y - rk.y; if (ex * ex + ey * ey < rk.r * rk.r) { g.shots.splice(s2, 1); api.addScore(2); if (rk.r > 7) { rk.r = 6; } else { g.rocks.splice(r2, 1); } break; } }
    }
    if (g.rocks.length < 3 && g.t % 80 === 0) g.rocks.push({ x: api.rndInt(0, W), y: -10, vx: api.rnd() * 1.2 - 0.6, vy: 0.5 + api.rnd() * 0.9, r: api.rndInt(8, 12) });
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#041726");
    var i; for (i = 0; i < g.rocks.length; i++) { var rk = g.rocks[i]; api.px(rk.x - rk.r, rk.y - rk.r, rk.r * 2, rk.r * 2, AB.rock); api.px(rk.x - rk.r + 2, rk.y - rk.r + 2, 3, 3, "#0E5A70"); }
    for (i = 0; i < g.shots.length; i++) api.px(g.shots[i].x - 1, g.shots[i].y - 1, 2, 2, AB.cyan);
    var tx = g.x + Math.cos(g.a) * 6, ty = g.y + Math.sin(g.a) * 6; api.px(g.x - 3, g.y - 3, 6, 6, AB.amber); api.px(tx - 1, ty - 1, 2, 2, AB.cyan);
  }
});

ARCADE_SPECS.push({
  id: "pearl", title: "Cave Crawler", tag: "Action", desc: "Crawl deep for crystals before your lamp fades.", icon: "depth", color: AB.cyan, controls: "lr pointer", lives: 1, W: 170, H: 240, bg: "#062A40",
  fact: "Some cave crystals grow for thousands of years in darkness, fed by slow, mineral-rich water.",
  help: "Steer to grab crystals (they refill your lamp). Dodge the bats. Watch your light!",
  setup: function (api) { return { px: api.W / 2, py: 24, pearls: [], jellies: [], t: 0, air: 600 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++;
    if (api.input.mode === "pointer" && api.input.px >= 0) { g.px += (api.input.px - g.px) * 0.4; } else { if (api.input.l) g.px -= 3.4; if (api.input.r) g.px += 3.4; }
    if (g.px < 6) g.px = 6; if (g.px > W - 6) g.px = W - 6;
    if (g.py < H - 30) g.py += 1.0;
    var scroll = 1.1, i;
    for (i = g.pearls.length - 1; i >= 0; i--) { var p = g.pearls[i]; p.y -= scroll; var dx = p.x - g.px, dy = p.y - g.py; if (dx * dx + dy * dy < 64) { api.addScore(2); g.air += 45; if (g.air > 600) g.air = 600; g.pearls.splice(i, 1); continue; } if (p.y < -8) g.pearls.splice(i, 1); }
    var j; for (j = g.jellies.length - 1; j >= 0; j--) { var je = g.jellies[j]; je.y -= scroll; je.x += je.vx; if (je.x < 6 || je.x > W - 6) je.vx = -je.vx; var ex = je.x - g.px, ey = je.y - g.py; if (ex * ex + ey * ey < 72) api.loseLife(); if (je.y < -8) g.jellies.splice(j, 1); }
    if (g.t % 34 === 0) g.pearls.push({ x: api.rndInt(10, W - 10), y: H + 8 });
    if (g.t % 60 === 0) g.jellies.push({ x: api.rndInt(10, W - 10), y: H + 8, vx: api.rnd() * 1.4 - 0.7 });
    g.air -= 1; if (g.air <= 0) api.die();
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#062A40"); api.px(0, 0, W, 3, "#0C4F6E");
    var i; for (i = 0; i < g.pearls.length; i++) { var p = g.pearls[i]; api.px(p.x - 2, p.y - 2, 5, 5, AB.cyan); api.px(p.x - 1, p.y - 3, 2, 1, "#fff"); }
    for (i = 0; i < g.jellies.length; i++) { var je = g.jellies[i]; api.px(je.x - 4, je.y - 3, 9, 5, AB.coral); api.px(je.x - 2, je.y + 2, 1, 3, AB.coral); api.px(je.x + 1, je.y + 2, 1, 3, AB.coral); }
    api.px(g.px - 3, g.py - 4, 7, 9, AB.amber); api.px(g.px - 2, g.py - 6, 5, 3, "#3A2A55"); api.px(g.px - 1, g.py - 5, 2, 2, AB.cyan);
    var aw = Math.max(0, Math.min(W - 20, (g.air / 600) * (W - 20))); api.px(10, H - 8, W - 20, 4, "#0E3550"); api.px(10, H - 8, aw, 4, g.air < 150 ? AB.coral : AB.cyan);
  }
});

ARCADE_SPECS.push({
  id: "runner", title: "Trail Runner", tag: "Runner", desc: "Race down the trail, dodge the logs.", icon: "wave", color: AB.teal, controls: "dpad pointer", lives: 3, W: 240, H: 160, bg: "#053349",
  fact: "Pronghorn can sprint over 80 km/h — the fastest land animal in North America.",
  help: "Move up and down to dodge logs and grab berries. It gets faster!",
  setup: function (api) { return { py: api.H / 2, things: [], t: 0, spd: 2.0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++; g.spd += 0.0012;
    if (api.input.mode === "pointer" && api.input.py >= 0) { g.py += (api.input.py - g.py) * 0.4; } else { if (api.input.u) g.py -= 3.4; if (api.input.d) g.py += 3.4; }
    if (g.py < 8) g.py = 8; if (g.py > H - 8) g.py = H - 8;
    if (g.t % Math.max(18, 44 - Math.floor(g.t / 200)) === 0) { var bub = api.rnd() < 0.35; g.things.push({ x: W + 10, y: api.rndInt(10, H - 10), bub: bub, r: bub ? 4 : 9 }); }
    var px = 30, i; for (i = g.things.length - 1; i >= 0; i--) { var o = g.things[i]; o.x -= g.spd; var dx = o.x - px, dy = o.y - g.py; if (dx * dx + dy * dy < (o.r + 5) * (o.r + 5)) { if (o.bub) { api.addScore(1); g.things.splice(i, 1); continue; } else { api.loseLife(); g.things.splice(i, 1); continue; } } if (o.x < -12) { if (!o.bub) api.addScore(1); g.things.splice(i, 1); } }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#053349");
    var i; for (i = 0; i < g.things.length; i++) { var o = g.things[i]; if (o.bub) { api.px(o.x - 2, o.y - 2, 5, 5, AB.cyan); api.px(o.x - 1, o.y - 3, 2, 1, "#fff"); } else { api.px(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2, AB.rock); api.px(o.x - o.r, o.y - o.r, o.r * 2, 2, AB.weed); } }
    var px = 30; api.px(px - 6, g.py - 4, 12, 8, AB.amber); api.px(px + 5, g.py - 2, 3, 4, AB.coral); api.px(px + 2, g.py - 2, 2, 2, "#06283A");
  }
});

ARCADE_SPECS.push({
  id: "bubblepop", title: "Firefly Catch", tag: "Tap", desc: "Tap as many fireflies as you can.", icon: "spark", color: AB.cyan, controls: "grid", lives: 1, W: 200, H: 240, bg: "#063246",
  fact: "Fireflies flash in coded patterns — each species blinks to its own rhythm to find a mate.",
  help: "Tap the fireflies before time runs out. Chain taps for a bonus!",
  setup: function (api) { return { bubbles: [], t: 0, time: 1500, combo: 0, comboT: 0 }; },
  update: function (api, g) {
    var W = api.W, H = api.H; g.t++; g.time--;
    if (g.t % Math.max(10, 26 - Math.floor(g.t / 120)) === 0) g.bubbles.push({ x: api.rndInt(12, W - 12), y: H + 8, vy: 0.8 + api.rnd() * 1.4, r: api.rndInt(7, 12) });
    var i; for (i = g.bubbles.length - 1; i >= 0; i--) { var b = g.bubbles[i]; b.y -= b.vy; if (b.y < -12) g.bubbles.splice(i, 1); }
    if (g.comboT > 0) g.comboT--; else g.combo = 0;
    if (g.time <= 0) api.die();
  },
  press: function (api, g, btn) { var mx = api.input.px, my = api.input.py, i; for (i = g.bubbles.length - 1; i >= 0; i--) { var b = g.bubbles[i]; var dx = mx - b.x, dy = my - b.y; if (dx * dx + dy * dy < (b.r + 2) * (b.r + 2)) { g.bubbles.splice(i, 1); g.combo++; g.comboT = 40; api.addScore(g.combo > 3 ? 2 : 1); break; } } },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#063246");
    var i; for (i = 0; i < g.bubbles.length; i++) { var b = g.bubbles[i]; api.circle(b.x, b.y, b.r, "#0E5A70"); api.circle(b.x, b.y, b.r - 2, "#0A4258"); api.px(b.x - b.r + 2, b.y - b.r + 2, 2, 2, "#CFF6FF"); }
    api.text("TIME " + Math.ceil(g.time / 30), 6, 8, g.time < 300 ? AB.coral : AB.cyan, 8);
    if (g.combo > 1) api.text("x" + g.combo, W - 30, 8, AB.amber, 9);
  }
});

/* ---- tetris helpers ---- */
function tetColl(g, cells) { var i; for (i = 0; i < cells.length; i++) { var c = cells[i]; if (c.x < 0 || c.x >= g.cols || c.y >= g.rows) return true; if (c.y >= 0 && g.grid[c.y * g.cols + c.x]) return true; } return false; }
function tetSpawn(g, api) { var idx = api.rndInt(0, 6), s = g.shapes[idx], cells = [], k; for (k = 0; k < s.length; k++) cells.push({ x: s[k][0] + 3, y: s[k][1] - 1 }); g.piece = { cells: cells, col: idx + 1 }; if (tetColl(g, cells)) api.die(); }
function tetMove(g, dx, dy) { var nc = [], i; for (i = 0; i < g.piece.cells.length; i++) nc.push({ x: g.piece.cells[i].x + dx, y: g.piece.cells[i].y + dy }); if (!tetColl(g, nc)) { g.piece.cells = nc; return true; } return false; }
function tetRotate(g) { if (g.piece.col === 2) return; var p = g.piece.cells[1], nc = [], i; for (i = 0; i < g.piece.cells.length; i++) { var c = g.piece.cells[i]; nc.push({ x: p.x - (c.y - p.y), y: p.y + (c.x - p.x) }); } if (!tetColl(g, nc)) g.piece.cells = nc; }
function tetLock(g, api) {
  var i; for (i = 0; i < g.piece.cells.length; i++) { var c = g.piece.cells[i]; if (c.y >= 0) g.grid[c.y * g.cols + c.x] = g.piece.col; }
  var cleared = 0, r; for (r = g.rows - 1; r >= 0; r--) { var full = true, cc; for (cc = 0; cc < g.cols; cc++) { if (!g.grid[r * g.cols + cc]) { full = false; break; } } if (full) { cleared++; var rr; for (rr = r; rr > 0; rr--) { var x; for (x = 0; x < g.cols; x++) g.grid[rr * g.cols + x] = g.grid[(rr - 1) * g.cols + x]; } var x2; for (x2 = 0; x2 < g.cols; x2++) g.grid[x2] = 0; r++; } }
  if (cleared > 0) { g.lines += cleared; api.addScore(cleared * cleared * 10); if (g.fall > 8) g.fall -= 1; }
  tetSpawn(g, api);
}
ARCADE_SPECS.push({
  id: "tetris", title: "Strata Stacker", tag: "Puzzle", desc: "Stack rock layers and clear lines.", icon: "depth", color: AB.teal, controls: "dpad", lives: 1, W: 150, H: 240, bg: "#06283A", ticketPer: 4, xpPer: 3,
  fact: "Rock layers stack over millions of years — the deeper the layer, the older its story.",
  help: "Left / right move, up rotates, down drops. Fill a row to clear it.",
  setup: function (api) {
    var cols = 10, rows = 18, grid = [], i; for (i = 0; i < cols * rows; i++) grid.push(0);
    var SH = [[[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 1], [2, 1]], [[2, 0], [0, 1], [1, 1], [2, 1]]];
    var pal = [AB.cyan, AB.amber, AB.coral, AB.green, AB.teal, AB.sand, "#9B7BD4"];
    var g = { cols: cols, rows: rows, grid: grid, shapes: SH, palette: pal, piece: null, t: 0, fall: 30, lines: 0 };
    tetSpawn(g, api); return g;
  },
  press: function (api, g, btn) { if (!g.piece) return; if (btn === "left") tetMove(g, -1, 0); else if (btn === "right") tetMove(g, 1, 0); else if (btn === "up") tetRotate(g); else if (btn === "down") { if (!tetMove(g, 0, 1)) tetLock(g, api); g.t = 0; } },
  update: function (api, g) { if (!g.piece) return; g.t++; if (g.t >= g.fall) { g.t = 0; if (!tetMove(g, 0, 1)) tetLock(g, api); } },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06283A");
    var cw = Math.floor(W / g.cols), ch = Math.floor((H - 10) / g.rows), ox = Math.floor((W - cw * g.cols) / 2), oy = 8;
    var r, c; for (r = 0; r < g.rows; r++) { for (c = 0; c < g.cols; c++) { var v = g.grid[r * g.cols + c]; api.px(ox + c * cw, oy + r * ch, cw - 1, ch - 1, v ? g.palette[v - 1] : "#0A3550"); } }
    if (g.piece) { var i; for (i = 0; i < g.piece.cells.length; i++) { var cc = g.piece.cells[i]; if (cc.y >= 0) api.px(ox + cc.x * cw, oy + cc.y * ch, cw - 1, ch - 1, g.palette[g.piece.col - 1]); } }
  }
});

/* ---- match-3 helpers ---- */
function m3Matches(g) {
  var marked = {}, x, y;
  for (y = 0; y < g.rows; y++) { var run = 1; for (x = 1; x < g.cols; x++) { var a = g.cells[y * g.cols + x], b = g.cells[y * g.cols + x - 1]; if (a !== 0 && a === b) run++; else { if (run >= 3) { var k; for (k = 0; k < run; k++) marked[y * g.cols + x - 1 - k] = 1; } run = 1; } } if (run >= 3) { var k2; for (k2 = 0; k2 < run; k2++) marked[y * g.cols + g.cols - 1 - k2] = 1; } }
  for (x = 0; x < g.cols; x++) { var run2 = 1; for (y = 1; y < g.rows; y++) { var a2 = g.cells[y * g.cols + x], b2 = g.cells[(y - 1) * g.cols + x]; if (a2 !== 0 && a2 === b2) run2++; else { if (run2 >= 3) { var k3; for (k3 = 0; k3 < run2; k3++) marked[(y - 1 - k3) * g.cols + x] = 1; } run2 = 1; } } if (run2 >= 3) { var k4; for (k4 = 0; k4 < run2; k4++) marked[(g.rows - 1 - k4) * g.cols + x] = 1; } }
  return marked;
}
function m3Settle(g) { var loops = 0; while (loops < 40) { loops++; var m = m3Matches(g), keys = Object.keys(m); if (!keys.length) break; var i; for (i = 0; i < keys.length; i++) g.cells[keys[i]] = Math.floor(Math.random() * 5) + 1; } }
function m3Resolve(g, api) {
  var total = 0, loops = 0;
  while (loops < 20) {
    loops++; var m = m3Matches(g), keys = Object.keys(m); if (!keys.length) break; total += keys.length;
    var i; for (i = 0; i < keys.length; i++) g.cells[keys[i]] = 0; api.addScore(keys.length);
    var x; for (x = 0; x < g.cols; x++) { var col = [], y; for (y = g.rows - 1; y >= 0; y--) { if (g.cells[y * g.cols + x] !== 0) col.push(g.cells[y * g.cols + x]); } var yy; for (yy = g.rows - 1; yy >= 0; yy--) { g.cells[yy * g.cols + x] = (g.rows - 1 - yy) < col.length ? col[g.rows - 1 - yy] : (Math.floor(Math.random() * 5) + 1); } }
  }
  return total;
}
ARCADE_SPECS.push({
  id: "match3", title: "Leaf Match", tag: "Puzzle", desc: "Swap to line up three matching leaves.", icon: "star", color: AB.coral, controls: "grid", lives: 1, W: 175, H: 240, bg: "#072E45", ticketPer: 4, xpPer: 3,
  fact: "Leaves blaze red and gold in autumn as trees pull their green chlorophyll back for winter.",
  help: "Tap a leaf, then a neighbour, to swap. Make rows of 3+ before time runs out.",
  setup: function (api) { var cols = 7, rows = 8, cells = [], i; for (i = 0; i < cols * rows; i++) cells.push(api.rndInt(1, 5)); var g = { cols: cols, rows: rows, cells: cells, sel: -1, t: 0, time: 2700 }; m3Settle(g); return g; },
  update: function (api, g) { g.t++; g.time--; if (g.time <= 0) api.die(); },
  press: function (api, g, btn) {
    var mx = api.input.px, my = api.input.py, cw = api.W / g.cols, chh = (api.H - 14) / g.rows;
    var cx = Math.floor(mx / cw), cy = Math.floor((my - 12) / chh); if (cx < 0 || cx >= g.cols || cy < 0 || cy >= g.rows) return; var idx = cy * g.cols + cx;
    if (g.sel < 0) { g.sel = idx; }
    else { var sx = g.sel % g.cols, sy = Math.floor(g.sel / g.cols); if (Math.abs(sx - cx) + Math.abs(sy - cy) === 1) { var tmp = g.cells[idx]; g.cells[idx] = g.cells[g.sel]; g.cells[g.sel] = tmp; var got = m3Resolve(g, api); if (got === 0) { var t2 = g.cells[idx]; g.cells[idx] = g.cells[g.sel]; g.cells[g.sel] = t2; } g.sel = -1; } else g.sel = idx; }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#072E45"); api.text("TIME " + Math.ceil(g.time / 30), 6, 8, g.time < 300 ? AB.coral : AB.cyan, 8);
    var pal = ["#0A3550", AB.coral, AB.amber, AB.green, AB.cyan, "#9B7BD4"], cw = W / g.cols, chh = (H - 14) / g.rows, x, y;
    for (y = 0; y < g.rows; y++) { for (x = 0; x < g.cols; x++) { var v = g.cells[y * g.cols + x], px = x * cw, py = 12 + y * chh; api.px(px + 1, py + 1, cw - 2, chh - 2, pal[v]); if ((y * g.cols + x) === g.sel) { api.px(px, py, cw, 2, "#fff"); api.px(px, py, 2, chh, "#fff"); api.px(px + cw - 2, py, 2, chh, "#fff"); api.px(px, py + chh - 2, cw, 2, "#fff"); } } }
  }
});

/* ---- simon helper ---- */
function sonarPad(api, mx, my) { var area = Math.min(api.W, api.H - 24), ox = (api.W - area) / 2, oy = 22; if (mx < ox || mx > ox + area || my < oy || my > oy + area) return -1; var col = mx < ox + area / 2 ? 0 : 1, row = my < oy + area / 2 ? 0 : 1; return row * 2 + col; }
ARCADE_SPECS.push({
  id: "sonar", title: "Birdsong Says", tag: "Brain", desc: "Repeat the birdsong sequence.", icon: "spark", color: AB.green, controls: "grid", lives: 1, W: 200, H: 230, bg: "#06283A", ticketPer: 2, xpPer: 2,
  fact: "Many songbirds learn their songs from their parents, building local 'dialects' like accents.",
  help: "Watch the pads light up, then tap them back in the same order.",
  setup: function (api) { return { seq: [api.rndInt(0, 3)], pos: 0, phase: "show", showT: 0, lit: -1, flashT: 0 }; },
  update: function (api, g) {
    if (g.flashT > 0) { g.flashT--; if (g.flashT === 0 && g.phase === "input") g.lit = -1; }
    if (g.phase === "show") { g.showT++; var step = Math.floor(g.showT / 28); if (step < g.seq.length) { var sub = g.showT % 28; g.lit = sub < 18 ? g.seq[step] : -1; } else { g.phase = "input"; g.lit = -1; g.pos = 0; } }
  },
  press: function (api, g, btn) {
    if (g.phase !== "input") return; var pad = sonarPad(api, api.input.px, api.input.py); if (pad < 0) return; g.lit = pad; g.flashT = 8;
    if (pad === g.seq[g.pos]) { g.pos++; if (g.pos >= g.seq.length) { api.addScore(1); g.seq.push(api.rndInt(0, 3)); g.phase = "show"; g.showT = 0; } } else api.die();
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06283A"); api.text(g.phase === "show" ? "WATCH" : "REPEAT", 6, 8, AB.cyan, 8);
    var cols = [AB.coral, AB.amber, AB.green, AB.cyan], area = Math.min(W, H - 24), ox = (W - area) / 2, oy = 22, half = area / 2, i;
    for (i = 0; i < 4; i++) { var px = ox + (i % 2) * half, py = oy + (i < 2 ? 0 : 1) * half; var on = g.lit === i; api.px(px + 2, py + 2, half - 4, half - 4, on ? cols[i] : "#0A3550"); if (!on) api.px(px + half / 2 - 6, py + half / 2 - 6, 12, 12, cols[i]); }
  }
});

/* ---- 2048 helpers ---- */
function g2048Line(line, api) { var arr = [], i; for (i = 0; i < line.length; i++) { if (line[i] !== 0) arr.push(line[i]); } var res = [], j = 0; while (j < arr.length) { if (j + 1 < arr.length && arr[j] === arr[j + 1]) { res.push(arr[j] * 2); if (api) api.addScore(arr[j]); j += 2; } else { res.push(arr[j]); j += 1; } } while (res.length < 4) res.push(0); var moved = false, k; for (k = 0; k < 4; k++) { if (res[k] !== line[k]) moved = true; } return { line: res, moved: moved }; }
function g2048Move(cells, dir, api) {
  var moved = false, i;
  for (i = 0; i < 4; i++) {
    var line = [], rev = false, x, y;
    if (dir === "left" || dir === "right") { for (x = 0; x < 4; x++) line.push(cells[i * 4 + x]); if (dir === "right") { line.reverse(); rev = true; } }
    else { for (y = 0; y < 4; y++) line.push(cells[y * 4 + i]); if (dir === "down") { line.reverse(); rev = true; } }
    var rr = g2048Line(line, api); if (rr.moved) moved = true; var out = rr.line; if (rev) out.reverse();
    if (dir === "left" || dir === "right") { var x2; for (x2 = 0; x2 < 4; x2++) cells[i * 4 + x2] = out[x2]; }
    else { var y2; for (y2 = 0; y2 < 4; y2++) cells[y2 * 4 + i] = out[y2]; }
  }
  return moved;
}
function g2048Add(cells) { var empty = [], i; for (i = 0; i < 16; i++) if (cells[i] === 0) empty.push(i); if (!empty.length) return; cells[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4; }
function g2048Over(cells) { var i; for (i = 0; i < 16; i++) if (cells[i] === 0) return false; var x, y; for (y = 0; y < 4; y++) { for (x = 0; x < 4; x++) { var v = cells[y * 4 + x]; if (x < 3 && v === cells[y * 4 + x + 1]) return false; if (y < 3 && v === cells[(y + 1) * 4 + x]) return false; } } return true; }
ARCADE_SPECS.push({
  id: "t2048", title: "Sapling 2048", tag: "Puzzle", desc: "Merge seeds to grow a mighty tree.", icon: "spark", color: AB.cyan, controls: "dpad", lives: 1, W: 200, H: 220, bg: "#06283A", ticketPer: 8, xpPer: 6,
  fact: "A giant sequoia grows from a seed smaller than an oat flake into the largest tree on Earth.",
  help: "Swipe with the arrows to slide and merge matching seeds. Don't fill the grid!",
  setup: function (api) { var cells = [], i; for (i = 0; i < 16; i++) cells.push(0); g2048Add(cells); g2048Add(cells); return { cells: cells }; },
  press: function (api, g, btn) { if (btn !== "left" && btn !== "right" && btn !== "up" && btn !== "down") return; var moved = g2048Move(g.cells, btn, api); if (moved) { g2048Add(g.cells); if (g2048Over(g.cells)) api.die(); } },
  update: function (api, g) { },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06283A");
    var pal = { 0: "#0A3550", 2: AB.teal, 4: AB.cyan, 8: AB.green, 16: AB.amber, 32: AB.sand, 64: AB.coral, 128: "#FF9966", 256: "#9B7BD4", 512: "#C77BD4", 1024: "#E06666", 2048: "#FFD700" };
    var area = Math.min(W, H - 16), ox = (W - area) / 2, oy = 14, cw = area / 4, x, y;
    for (y = 0; y < 4; y++) { for (x = 0; x < 4; x++) { var v = g.cells[y * 4 + x], px = ox + x * cw, py = oy + y * cw; api.px(px + 2, py + 2, cw - 4, cw - 4, pal[v] ? pal[v] : "#FFD700"); if (v) api.text("" + v, px + cw / 2, py + cw / 2 - 4, v < 8 ? "#06283A" : "#06283A", v >= 128 ? 8 : 10, "center"); } }
  }
});

/* ---- minesweeper helper ---- */
function sweepReveal(g, api, x, y) {
  var idx = y * g.cols + x; if (g.rev[idx]) return; if (g.mine[idx]) { g.rev[idx] = true; api.die(); return; }
  var stack = [[x, y]]; while (stack.length) { var p = stack.pop(), px = p[0], py = p[1], i2 = py * g.cols + px; if (g.rev[i2]) continue; g.rev[i2] = true; g.left--; api.addScore(1); if (g.adj[i2] === 0) { var dx, dy; for (dy = -1; dy <= 1; dy++) { for (dx = -1; dx <= 1; dx++) { var nx = px + dx, ny = py + dy; if (nx >= 0 && nx < g.cols && ny >= 0 && ny < g.rows && !g.mine[ny * g.cols + nx] && !g.rev[ny * g.cols + nx]) stack.push([nx, ny]); } } } }
  if (g.left <= 0) { api.addScore(20); api.die(); }
}
ARCADE_SPECS.push({
  id: "sweeper", title: "Mushroom Sweeper", tag: "Brain", desc: "Uncover safe mushrooms, avoid the toxic ones.", icon: "search", color: AB.sand, controls: "grid", lives: 1, W: 176, H: 240, bg: "#072E45", ticketPer: 5, xpPer: 4,
  fact: "Never eat a wild mushroom unless an expert confirms it — many safe-looking kinds are toxic.",
  help: "Tap to uncover a tile. Numbers show nearby toxic mushrooms. Clear every safe tile!",
  setup: function (api) {
    var cols = 8, rows = 10, mines = 12, n = cols * rows, mine = [], rev = [], adj = [], i;
    for (i = 0; i < n; i++) { mine.push(false); rev.push(false); adj.push(0); }
    var placed = 0; while (placed < mines) { var idx = api.rndInt(0, n - 1); if (!mine[idx]) { mine[idx] = true; placed++; } }
    var x, y; for (y = 0; y < rows; y++) { for (x = 0; x < cols; x++) { var c = 0, dx, dy; for (dy = -1; dy <= 1; dy++) { for (dx = -1; dx <= 1; dx++) { var nx = x + dx, ny = y + dy; if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && mine[ny * cols + nx]) c++; } } adj[y * cols + x] = c; } }
    return { cols: cols, rows: rows, mine: mine, rev: rev, adj: adj, left: n - mines };
  },
  update: function (api, g) { },
  press: function (api, g, btn) { var mx = api.input.px, my = api.input.py, cw = api.W / g.cols, chh = (api.H - 14) / g.rows, cx = Math.floor(mx / cw), cy = Math.floor((my - 12) / chh); if (cx < 0 || cx >= g.cols || cy < 0 || cy >= g.rows) return; sweepReveal(g, api, cx, cy); },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#072E45");
    var num = ["", AB.cyan, AB.green, AB.amber, AB.coral, "#FF6666", "#FF6666", "#FF6666", "#FF6666"], cw = W / g.cols, chh = (H - 14) / g.rows, x, y;
    for (y = 0; y < g.rows; y++) { for (x = 0; x < g.cols; x++) { var idx = y * g.cols + x, px = x * cw, py = 12 + y * chh; if (g.rev[idx]) { api.px(px + 1, py + 1, cw - 2, chh - 2, g.mine[idx] ? AB.coral : "#0A3A2A"); if (!g.mine[idx] && g.adj[idx] > 0) api.text("" + g.adj[idx], px + cw / 2, py + chh / 2 - 4, num[g.adj[idx]], 9, "center"); } else { api.px(px + 1, py + 1, cw - 2, chh - 2, AB.rock); api.px(px + 2, py + 2, cw - 4, 2, "#0E5A70"); } } }
  }
});

/* ---- lights out helpers ---- */
function lightsToggle(cells, sz, x, y) { var d = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]], k; for (k = 0; k < d.length; k++) { var nx = x + d[k][0], ny = y + d[k][1]; if (nx >= 0 && nx < sz && ny >= 0 && ny < sz) cells[ny * sz + nx] = !cells[ny * sz + nx]; } }
function lightsScramble(cells, sz, api, n) { var i; for (i = 0; i < sz * sz; i++) cells[i] = false; var k; for (k = 0; k < n; k++) lightsToggle(cells, sz, api.rndInt(0, sz - 1), api.rndInt(0, sz - 1)); }
ARCADE_SPECS.push({
  id: "lights", title: "Firefly Lights", tag: "Brain", desc: "Switch off every glowing firefly.", icon: "spark", color: AB.amber, controls: "grid", lives: 1, W: 200, H: 240, bg: "#06283A", ticketPer: 6, xpPer: 5,
  fact: "Fireflies make cold light through a chemical reaction that gives off almost no heat.",
  help: "Tap a cell to flip it and its neighbours. Turn the whole grid dark to score!",
  setup: function (api) { var size = 5, cells = [], i; for (i = 0; i < size * size; i++) cells.push(false); lightsScramble(cells, size, api, 6); return { size: size, cells: cells, solved: 0, t: 0, time: 2700 }; },
  update: function (api, g) { g.t++; g.time--; if (g.time <= 0) api.die(); },
  press: function (api, g, btn) {
    var mx = api.input.px, my = api.input.py, sz = g.size, area = Math.min(api.W, api.H - 20), cw = area / sz, ox = (api.W - area) / 2, oy = 20;
    var cx = Math.floor((mx - ox) / cw), cy = Math.floor((my - oy) / cw); if (cx < 0 || cx >= sz || cy < 0 || cy >= sz) return; lightsToggle(g.cells, sz, cx, cy);
    var all = true, i; for (i = 0; i < sz * sz; i++) if (g.cells[i]) all = false; if (all) { g.solved++; api.addScore(10); lightsScramble(g.cells, sz, api, 6 + g.solved); }
  },
  draw: function (api, g) {
    var W = api.W, H = api.H; api.clear("#06283A"); api.text("CLEARED " + g.solved, 6, 8, AB.cyan, 8);
    var sz = g.size, area = Math.min(W, H - 20), cw = area / sz, ox = (W - area) / 2, oy = 20, x, y;
    for (y = 0; y < sz; y++) { for (x = 0; x < sz; x++) { var on = g.cells[y * sz + x], px = ox + x * cw, py = oy + y * cw; api.px(px + 2, py + 2, cw - 4, cw - 4, on ? AB.amber : "#0A3550"); if (on) api.px(px + cw / 2 - 3, py + cw / 2 - 3, 6, 6, "#FFE9A8"); } }
  }
});

/* ----------------------------------------------- 8-bit canvas game: Forest Hop */
function ReefDiver(props) {
  var canvasRef = useRef(null);
  var earnRef = useRef(props.onEarn);
  earnRef.current = props.onEarn;
  var phaseState = useState("ready"); var phase = phaseState[0], setPhase = phaseState[1];
  var scoreState = useState(0); var score = scoreState[0], setScore = scoreState[1];
  var bestState = useState(0); var best = bestState[0], setBest = bestState[1];
  var okState = useState(true); var canvasOk = okState[0], setCanvasOk = okState[1];

  useEffect(function () {
    var cv = canvasRef.current;
    if (!cv) return undefined;
    var ctx = cv.getContext ? cv.getContext("2d") : null;
    if (!ctx) { setCanvasOk(false); return undefined; }
    var LW = 160, LH = 240;
    cv.width = LW; cv.height = LH;
    var PLX = 38, PW = 14, PH = 10, COLW = 22;
    var G = { phase: "ready", y: LH / 2, vy: 0, pillars: [], bubbles: [], score: 0, t: 0, flash: 0 };

    function start() {
      G.phase = "playing"; G.y = LH / 2; G.vy = 0; G.pillars = []; G.bubbles = []; G.score = 0; G.t = 0; G.flash = 0;
      setPhase("playing"); setScore(0);
    }
    function flap() {
      if (G.phase === "ready") { start(); return; }
      if (G.phase === "dead") { start(); return; }
      G.vy = -2.7;
    }
    function die() {
      G.phase = "dead"; G.flash = 6;
      setPhase("dead");
      if (G.score > best) setBest(G.score);
    }
    function onDown(e) { if (e && e.preventDefault) e.preventDefault(); flap(); }
    function onKey(e) {
      var k = e.key === " " || e.code === "Space" || e.key === "ArrowUp" || e.code === "ArrowUp";
      if (k) { if (e.preventDefault) e.preventDefault(); flap(); }
    }
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);

    function spawnIfNeeded() {
      var lastX = -999;
      for (var i = 0; i < G.pillars.length; i++) { if (G.pillars[i].x > lastX) lastX = G.pillars[i].x; }
      if (G.pillars.length === 0 || lastX < LW - 96) {
        var gap = 78;
        var top = 16 + Math.floor(Math.random() * (LH - gap - 52));
        G.pillars.push({ x: LW + 8, top: top, gap: gap, passed: false });
        if (Math.random() < 0.75) G.bubbles.push({ x: LW + 8 + COLW / 2, y: top + gap / 2 + (Math.random() * 24 - 12), got: false });
      }
    }
    function step() {
      G.t++;
      if (G.phase === "playing") {
        G.vy += 0.17; G.y += G.vy;
        var sp = 1.15 + G.score * 0.025; if (sp > 2.6) sp = 2.6;
        var i, p, b;
        for (i = 0; i < G.pillars.length; i++) { G.pillars[i].x -= sp; }
        for (i = 0; i < G.bubbles.length; i++) { G.bubbles[i].x -= sp; }
        spawnIfNeeded();
        // collisions + scoring
        for (i = 0; i < G.pillars.length; i++) {
          p = G.pillars[i];
          var overlapX = (PLX + PW > p.x) && (PLX < p.x + COLW);
          if (overlapX) {
            if (G.y < p.top || (G.y + PH) > (p.top + p.gap)) { die(); }
          }
          if (!p.passed && (p.x + COLW) < PLX) {
            p.passed = true; G.score++; setScore(G.score);
            if (earnRef.current) earnRef.current(2, 1);
          }
        }
        for (i = 0; i < G.bubbles.length; i++) {
          b = G.bubbles[i];
          if (!b.got && Math.abs(b.x - (PLX + PW / 2)) < 8 && Math.abs(b.y - (G.y + PH / 2)) < 9) {
            b.got = true; G.score++; setScore(G.score);
            if (earnRef.current) earnRef.current(2, 1);
          }
        }
        // cull offscreen
        var np = []; for (i = 0; i < G.pillars.length; i++) { if (G.pillars[i].x + COLW > -4) np.push(G.pillars[i]); } G.pillars = np;
        var nb = []; for (i = 0; i < G.bubbles.length; i++) { if (G.bubbles[i].x > -6 && !G.bubbles[i].got) nb.push(G.bubbles[i]); } G.bubbles = nb;
        // bounds
        if (G.y + PH >= LH - 12) { G.y = LH - 12 - PH; die(); }
        if (G.y < 0) { G.y = 0; G.vy = 0; }
      }
      if (G.flash > 0) G.flash--;
    }
    function px(x, y, w, hh, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, w | 0, hh | 0); }
    function draw() {
      // depth-banded background
      px(0, 0, LW, LH, "#0A3A56");
      px(0, 60, LW, LH - 60, "#08314A");
      px(0, 120, LW, LH - 120, "#062940");
      px(0, 180, LW, LH - 180, "#051F33");
      // ambient bubbles drifting (decor)
      var k;
      for (k = 0; k < 5; k++) {
        var bx = (k * 33 + ((G.t * (1 + k)) % LW)) % LW;
        var by = (LH - ((G.t * (1 + k * 0.5)) % LH));
        px(LW - bx, by, 2, 2, "rgba(150,220,240,0.25)");
      }
      // pillars (kelp/rock columns) with pixel highlight
      var i, p;
      for (i = 0; i < G.pillars.length; i++) {
        p = G.pillars[i];
        px(p.x, 0, COLW, p.top, AB.rock);
        px(p.x, 0, 3, p.top, AB.weed);
        px(p.x, p.top - 4, COLW, 4, AB.weed);
        var by2 = p.top + p.gap;
        px(p.x, by2, COLW, LH - by2 - 12, AB.rock);
        px(p.x, by2, 3, LH - by2 - 12, AB.weed);
        px(p.x, by2, COLW, 4, AB.weed);
      }
      // seabed
      px(0, LH - 12, LW, 12, "#0B2A1E");
      for (i = 0; i < LW; i += 8) { px(i + ((G.t / 2) % 8), LH - 12, 2, 2, "#13422F"); }
      // bubbles to collect
      var b;
      for (i = 0; i < G.bubbles.length; i++) {
        b = G.bubbles[i];
        px(b.x - 2, b.y - 2, 4, 4, AB.cyan);
        px(b.x - 1, b.y - 3, 2, 1, "#CFF6FF");
      }
      // player fish (pixel sprite)
      var fx = PLX, fy = G.y;
      var tilt = G.vy < -0.5 ? -1 : (G.vy > 1.5 ? 1 : 0);
      px(fx, fy + tilt, PW - 3, PH, AB.amber);
      px(fx + 2, fy - 1 + tilt, PW - 6, PH + 2, AB.amber);
      px(fx - 4, fy + 2 + tilt, 4, PH - 4, AB.coral); // tail
      px(fx + PW - 4, fy + 2 + tilt, 2, 2, "#06283A"); // eye
      px(fx + 1, fy + PH - 2 + tilt, PW - 5, 2, "#E0A21F"); // belly shade
      // hurt flash
      if (G.flash > 0) px(0, 0, LW, LH, "rgba(255,90,80,0.30)");
    }
    var rafFn = (typeof window !== "undefined" && window.requestAnimationFrame) ? window.requestAnimationFrame : function (cb) { return setTimeout(function () { cb(0); }, 16); };
    var cancelFn = (typeof window !== "undefined" && window.cancelAnimationFrame) ? window.cancelAnimationFrame : clearTimeout;
    var raf = 0, running = true;
    function loop() { if (!running) return; step(); draw(); raf = rafFn(loop); }
    raf = rafFn(loop);
    return function () {
      running = false; cancelFn(raf);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  var t = props.t;
  return h("div", null,
    h("div", { style: sx({ position: "relative", maxWidth: 320, margin: "0 auto", background: AB.deep, padding: 6 }, pxBox(AB.line, AB.navy)) },
      h("canvas", { ref: canvasRef, style: { width: "100%", height: "auto", display: "block", imageRendering: "pixelated", background: "#0A3A56", touchAction: "none", cursor: "pointer" } }),
      h(Scanlines, null),
      canvasOk && phase === "ready" ? h("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16 } },
        h("div", { style: sx({ fontSize: 17, fontWeight: 800, color: AB.cyan }, PX) }, "Forest Hop"),
        h("div", { style: { fontSize: 12, color: AB.text, margin: "8px 0 14px", lineHeight: 1.5 } }, "Hop through the gaps. Grab acorns. Don't hit the branches."),
        h("div", { style: sx({ fontSize: 12, fontWeight: 800, color: AB.amber, padding: "8px 12px", background: AB.navy }, PX, pxBox(AB.line, AB.deep)) }, "Tap / Space to hop")
      ) : null,
      canvasOk && phase === "dead" ? h("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, background: "rgba(3,16,26,0.55)" } },
        h("div", { style: sx({ fontSize: 18, fontWeight: 800, color: AB.coral }, PX) }, "Game Over"),
        h("div", { style: { fontSize: 13, color: AB.text, margin: "8px 0 4px" } }, "Score " + score + " · Best " + Math.max(best, score)),
        h("div", { style: sx({ fontSize: 12, fontWeight: 800, color: AB.amber, marginTop: 12, padding: "8px 12px", background: AB.navy }, PX, pxBox(AB.line, AB.deep)) }, "Tap / Space to retry")
      ) : null,
      canvasOk ? h("div", { style: sx({ position: "absolute", top: 8, left: 10, fontSize: 14, fontWeight: 800, color: "#fff", textShadow: "1px 1px 0 #03192A" }, PX) }, "" + score) : null,
      !canvasOk ? h("div", { style: { padding: 24, textAlign: "center", color: AB.text, fontSize: 13, lineHeight: 1.5 } }, "This game needs canvas support, which isn't available here. Try the quiz cabinets below instead.") : null
    ),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, textAlign: "center", marginTop: 10 } }, "Each gap or bubble earns tickets and XP (daily XP capped).")
  );
}

function ArcadeScreen(props) {
  var t = props.t;
  var state = props.state;
  var gameState = useState(null); var game = gameState[0], setGame = gameState[1];
  var arc = state.arcade || { tickets: 0, xpToday: 0, day: "" };
  var scores = arc.scores || {};
  var capLeft = Math.max(0, ARCADE_XP_CAP - ((arc.day === todayStr()) ? arc.xpToday : 0));

  var QUIZ = [
    { id: "reefq", title: "Trail Rapid", tag: "Quiz", desc: "Fast-fire questions from every lesson.", icon: "spark", color: AB.cyan, quiz: true, pool: quizPool },
    { id: "weboflife", title: "Web of Life", tag: "Relate", desc: "Pick the right link: who eats whom, who lives where.", icon: "wave", color: AB.teal, quiz: true, pool: relPool },
    { id: "sortkind", title: "Sort by Kind", tag: "Sort", desc: "Is it a mammal, a bird, a rock? Sort each one.", icon: "star", color: AB.amber, quiz: true, pool: kindPool },
    { id: "zoneq", title: "Topic Sorter", tag: "Sort", desc: "Match each term to its branch of nature study.", icon: "depth", color: AB.green, quiz: true, pool: zonePool }
  ];
  var ALL = ARCADE_SPECS.concat(QUIZ);
  function findGame(id) { var i; for (i = 0; i < ALL.length; i++) { if (ALL[i].id === id) return ALL[i]; } return null; }

  function header(sub) {
    return h("div", { style: sx({ position: "relative", overflow: "hidden", background: "linear-gradient(180deg," + AB.navy + "," + AB.deep + ")", padding: "16px 16px 14px", marginBottom: 14 }, pxBox(AB.line, AB.bg)) },
      h(Scanlines, null),
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, position: "relative" } }, h(Glyph, { name: "arcade", size: 22, color: AB.amber }), h("div", { style: sx({ fontSize: 19, fontWeight: 800, color: AB.cyan, textShadow: "2px 2px 0 " + AB.deep }, PX) }, "8-Bit Nature Arcade")),
      h("div", { style: { position: "relative", fontSize: 12, color: AB.dim, marginTop: 5 } }, sub));
  }

  if (game) {
    var def = findGame(game);
    if (!def) { setGame(null); return h("div", null, ""); }
    return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "10px 16px 36px" } },
      h("button", { onClick: function () { setGame(null); }, style: sx({ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 13, fontWeight: 800, cursor: "pointer", padding: "4px 0", marginBottom: 10 }, PX) }, h(Glyph, { name: "back", size: 18, color: t.textDim }), "Arcade"),
      h("div", { style: sx({ fontSize: 18, fontWeight: 800, color: def.color, marginBottom: 12 }, PX) }, def.title),
      def.quiz
        ? h("div", { style: sx({ background: AB.deep, padding: 14, position: "relative" }, pxBox(AB.line, AB.navy)) }, h(MiniGame, { t: t, key: def.id, pool: def.pool(), rounds: 8, onCorrect: function () { if (props.onEarn) props.onEarn(2, 1); }, onExit: function () { setGame(null); }, onReplay: function () { setGame(def.id); } }))
        : h(GameHost, { t: t, key: def.id, spec: def, best: scores[def.id] ? scores[def.id] : 0, onEarn: props.onEarn, onScore: props.onScore })
    );
  }

  function cabinet(g) {
    var bs = scores[g.id] ? scores[g.id] : 0;
    return h("div", { key: g.id, onClick: function () { setGame(g.id); }, role: "button", tabIndex: 0, onKeyDown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setGame(g.id); } }, style: sx({ cursor: "pointer", background: "linear-gradient(180deg," + AB.navy + "," + AB.deep + ")", padding: 12, position: "relative", overflow: "hidden" }, pxBox(g.color, AB.bg)) },
      h(Scanlines, null),
      h("div", { style: { display: "flex", alignItems: "center", gap: 11, position: "relative" } },
        h("div", { style: sx({ width: 42, height: 42, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: AB.deep }, pxBox(g.color, AB.navy)) }, h(Glyph, { name: g.icon, size: 20, color: g.color })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
            h("div", { style: sx({ fontSize: 13.5, fontWeight: 800, color: AB.text }, PX) }, g.title),
            h("span", { style: sx({ fontSize: 8.5, fontWeight: 800, color: AB.deep, background: g.color, padding: "2px 5px" }, PX) }, g.tag)),
          h("div", { style: { fontSize: 11.5, color: AB.dim, marginTop: 3, lineHeight: 1.35 } }, g.desc),
          bs > 0 ? h("div", { style: sx({ fontSize: 10, fontWeight: 800, color: AB.amber, marginTop: 4 }, PX) }, "BEST " + bs) : null)));
  }

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 30px" } },
    header("26 nature mini-games \u00b7 every point earns tickets and XP."),
    h("div", { style: { display: "flex", gap: 12, marginBottom: 16 } },
      h("div", { style: sx({ flex: 1, textAlign: "center", background: AB.navy, padding: "12px 8px", position: "relative" }, pxBox(AB.line, AB.deep)) }, h("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6 } }, h(Glyph, { name: "ticket", size: 18, color: AB.amber }), h("span", { style: sx({ fontSize: 20, fontWeight: 800, color: AB.text }, PX) }, "" + (arc.tickets ? arc.tickets : 0))), h("div", { style: sx({ fontSize: 10, fontWeight: 700, color: AB.dim, marginTop: 3 }, PX) }, "tickets")),
      h("div", { style: sx({ flex: 1, textAlign: "center", background: AB.navy, padding: "12px 8px" }, pxBox(AB.line, AB.deep)) }, h("span", { style: sx({ fontSize: 20, fontWeight: 800, color: capLeft > 0 ? AB.green : AB.dim }, PX) }, "" + capLeft), h("div", { style: sx({ fontSize: 10, fontWeight: 700, color: AB.dim, marginTop: 3 }, PX) }, "XP left today"))),
    h("div", { style: { display: "grid", gridTemplateColumns: vpNow().phone ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 11 } }, ALL.map(cabinet)));
}

/* daily arcade XP cap */
var ARCADE_XP_CAP = 120;

/* ============================================================ LIBRARY == */
function LibraryScreen(props) {
  var t = props.t;
  var tabState = useState("glossary");
  var tab = tabState[0], setTab = tabState[1];
  var queryState = useState("");
  var query = queryState[0], setQuery = queryState[1];
  var regionState = useState("All");
  var region = regionState[0], setRegion = regionState[1];

  var tabs = [["glossary", "Glossary"], ["pron", "Say it"], ["taxonomy", "Groups"], ["shells", "Rocks"], ["marvels", "Wonders"], ["concepts", "Big ideas"], ["careers", "Careers"], ["history", "History"], ["sources", "Sources"]];
  var head = h("div", { style: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 14 } },
    tabs.map(function (tb) {
      var on = tab === tb[0];
      return h("button", { key: tb[0], onClick: function () { setTab(tb[0]); setQuery(""); }, style: { flex: "0 0 auto", fontFamily: SANS, fontSize: 13, fontWeight: 800, padding: "8px 13px", borderRadius: 99, border: "1px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text, cursor: "pointer", whiteSpace: "nowrap" } }, tb[1]);
    })
  );

  var body = null;
  if (tab === "glossary") {
    var ql = query.toLowerCase();
    var g = GLOSSARY();
    var rows = [];
    for (var i = 0; i < g.length; i++) {
      var it = g[i];
      var hay = (it.term + " " + it.def + " " + it.cat).toLowerCase();
      if (ql && hay.indexOf(ql) === -1) continue;
      rows.push(h(Card, { t: t, key: i, style: { marginBottom: 9 } },
        h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 } },
          h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, it.term),
          h(Chip, { t: t, color: t.textFaint }, it.cat)
        ),
        h("div", { style: { fontSize: 13.5, lineHeight: 1.55, color: t.textDim, marginTop: 5 } }, it.def)
      ));
    }
    body = h("div", null,
      h("div", { style: { position: "relative", marginBottom: 12 } },
        h("div", { style: { position: "absolute", left: 12, top: 12 } }, h(Glyph, { name: "search", size: 18, color: t.textFaint })),
        h("input", { value: query, onChange: function (e) { setQuery(e.target.value); }, placeholder: "Search " + g.length + " terms…", style: { width: "100%", padding: "11px 12px 11px 38px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontSize: 14.5, fontFamily: SANS, outline: "none", boxSizing: "border-box" } })
      ),
      rows.length ? rows : h("div", { style: { textAlign: "center", color: t.textFaint, padding: 20 } }, "No matches.")
    );
  } else if (tab === "pron") {
    var p = PRON();
    body = h("div", null, p.map(function (it, i) {
      return h(Card, { t: t, key: i, style: { marginBottom: 9 } },
        h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, it.term),
        h("div", { style: { fontSize: 14.5, fontFamily: MONO, color: t.sky, margin: "4px 0 3px" } }, it.say),
        it.note ? h("div", { style: { fontSize: 12.5, color: t.textDim } }, it.note) : null
      );
    }));
  } else if (tab === "taxonomy") {
    var tx = TAXONOMY();
    var GROUP_ART = {
      "Mammals": "fox", "Birds": "owl", "Reptiles & amphibians": "frog", "Insects & invertebrates": "butterfly", "Freshwater fish": "river",
      "Trees & shrubs": "oak", "Wildflowers & forbs": "wildflower", "Grasses & sedges": "grassland", "Ferns & mosses": "fern", "Fungi & lichens": "mushroom",
      "Rocks & minerals": "mineral", "Fossils": "fossil"
    };
    body = h("div", null, tx.map(function (it, i) {
      return h(Card, { t: t, key: i, style: { marginBottom: 9 } },
        h("div", { style: { display: "flex", gap: 12 } },
          h(Illus, { name: GROUP_ART[it.group] ? GROUP_ART[it.group] : "forest", ar: "1 / 1", radius: 11, label: it.group, style: { width: 66, height: 66, flex: "0 0 auto" } }),
          h("div", { style: { flex: 1, minWidth: 0 } },
            h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 } },
              h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, it.group),
              h(Chip, { t: t, color: t.teal }, it.rank)
            ),
            h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 4 } }, h("b", { style: { color: t.text } }, "Examples: "), it.examples)
          )
        ),
        it.note ? h("div", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, marginTop: 8 } }, it.note) : null
      );
    }));
  } else if (tab === "concepts") {
    var co = CONCEPTS();
    body = h("div", null, co.map(function (it, i) {
      var s = srcOf(it.src);
      return h(Card, { t: t, key: i, style: { marginBottom: 10 } },
        h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, it.title),
        h("div", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.textDim, margin: "5px 0 8px" } }, it.body),
        s ? h(SourceLink, { t: t, url: s.url, label: s.label }) : null
      );
    }));
  } else if (tab === "careers") {
    var ca = CAREERS();
    body = h("div", null, ca.map(function (it, i) {
      var s = srcOf(it.src);
      return h(Card, { t: t, key: i, style: { marginBottom: 10, borderLeft: "3px solid " + t.sand } },
        h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, it.role),
        h("div", { style: { fontSize: 13.5, lineHeight: 1.55, color: t.textDim, marginTop: 5 } }, it.what),
        h("div", { style: { fontSize: 13, lineHeight: 1.55, color: t.text, marginTop: 6 } }, h("b", null, "Path: "), it.path),
        s ? h("div", { style: { marginTop: 8 } }, h(SourceLink, { t: t, url: s.url, label: s.label })) : null
      );
    }));
  } else if (tab === "history") {
    var hi = HISTORY().slice().sort(function (a, b) { return histYear(a.year) - histYear(b.year); });
    body = h("div", { style: { position: "relative", paddingLeft: 6 } }, hi.map(function (it, i) {
      return h("div", { key: i, style: { position: "relative", paddingLeft: 22, paddingBottom: 16, borderLeft: "2px solid " + t.line, marginLeft: 6 } },
        h("div", { style: { position: "absolute", left: -7, top: 2, width: 12, height: 12, borderRadius: 99, background: t.sky, border: "2px solid " + t.bg } }),
        h("div", { style: { fontSize: 12.5, fontWeight: 800, color: t.sky } }, it.year),
        h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, marginTop: 2 } }, it.title),
        h("div", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, marginTop: 3 } }, it.body)
      );
    }));
  } else if (tab === "marvels") {
    var mv = MARVELS();
    body = h("div", null,
      h("p", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, margin: "0 0 12px" } }, "Record-breakers and curiosities from the natural world — the biggest, tallest, oldest and strangest, each linked to a reputable source."),
      mv.map(function (m, i) {
        var s = SOURCES[m.src];
        return h(Card, { t: t, key: i, style: { marginBottom: 10, borderLeft: "3px solid " + t.teal } },
          h("div", { style: { display: "flex", alignItems: "flex-start", gap: 10 } },
            h("div", { style: { flex: "0 0 auto", marginTop: 1 } }, h(Glyph, { name: "spark", size: 18, color: t.teal })),
            h("div", { style: { flex: 1, minWidth: 0 } },
              h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, m.title),
              h("div", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.textDim, margin: "5px 0 8px" } }, m.fact),
              s ? h(SourceLink, { t: t, url: s.url, label: s.label }) : null
            )
          )
        );
      })
    );
  } else if (tab === "shells") {
    var allShells = SHELLS();
    var rtags = ["All", "Igneous", "Sedimentary", "Metamorphic", "Mineral", "Fossil"];
    var filterBar = h("div", { style: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 12 } },
      rtags.map(function (rt) {
        var on = region === rt;
        return h("button", { key: rt, onClick: function () { setRegion(rt); }, style: { flex: "0 0 auto", fontFamily: SANS, fontSize: 12.5, fontWeight: 800, padding: "7px 12px", borderRadius: 99, border: "1px solid " + (on ? t.teal : t.line), background: on ? t.teal : t.panel, color: on ? "#fff" : t.text, cursor: "pointer", whiteSpace: "nowrap" } }, rt === "All" ? "All regions" : rt);
      })
    );
    var shown = [];
    for (var si = 0; si < allShells.length; si++) {
      var shv = allShells[si];
      var match = region === "All";
      if (!match) { for (var ri = 0; ri < shv.regions.length; ri++) { if (shv.regions[ri] === region || shv.regions[ri] === "Common") { match = true; break; } } }
      if (match) shown.push(shv);
    }
    var grid = h("div", { style: { display: "grid", gridTemplateColumns: vpNow().phone ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 } },
      shown.map(function (sh, i) {
        return h(Card, { t: t, key: i, style: { padding: 12 } },
          h("div", { style: { display: "flex", gap: 12 } },
            h(Illus, { name: sh.art, ar: "1 / 1", radius: 12, label: sh.name, style: { width: 78, height: 78, flex: "0 0 auto" } }),
            h("div", { style: { flex: 1, minWidth: 0 } },
              h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, sh.name),
              h("div", { style: { fontSize: 12, fontStyle: "italic", color: t.textFaint, marginTop: 1 } }, sh.sci),
              h("div", { style: { fontSize: 11.5, color: t.teal, fontWeight: 700, marginTop: 3 } }, sh.group + "  ·  " + sh.size)
            )
          ),
          h("div", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, marginTop: 8 } }, sh.desc),
          h("div", { style: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 } },
            sh.regions.map(function (rg, k) { return h(Chip, { t: t, key: k, color: t.sand }, rg); })
          )
        );
      })
    );
    body = h("div", null,
      h("p", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, margin: "0 0 10px" } }, "Rocks, minerals and fossils you can find in the field, grouped by type. Tap a type to filter. Collect only common specimens where it is legal, and never disturb protected sites or take fossils from public land without permission."),
      filterBar,
      h("div", { style: { fontSize: 12, color: t.textFaint, marginBottom: 10 } }, shown.length + " of " + allShells.length + " entries"),
      shown.length ? grid : h("div", { style: { textAlign: "center", color: t.textFaint, padding: 20 } }, "No entries listed for this type yet.")
    );
  } else {
    var keys = Object.keys(SOURCES);
    var pc = (typeof window !== "undefined" && window.__SEA_PHOTO_CREDITS__) ? window.__SEA_PHOTO_CREDITS__ : [];
    body = h("div", null,
      h("p", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, margin: "0 0 12px" } }, "TerraHype's facts are drawn from established nature, ecology and conservation references and link to these authoritative organizations. Open any to explore further. Species photos load live from Wikimedia Commons \u2014 tap the \u201cWikimedia\u201d tag on any photo for its source page and image credits."),
      keys.map(function (k, i) {
        var s = SOURCES[k];
        return h("div", { key: i, style: { marginBottom: 8 } }, h(SourceLink, { t: t, url: s.url, label: s.label, style: { width: "100%", boxSizing: "border-box", justifyContent: "flex-start" } }));
      }),
      pc.length ? h("div", { style: { marginTop: 20, borderTop: "1px solid " + t.line, paddingTop: 14 } },
        h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 4 } }, "Photo credits"),
        h("p", { style: { fontSize: 12.5, lineHeight: 1.5, color: t.textDim, margin: "0 0 10px" } }, "Species photographs are used under their respective open licenses. Image, author and license:"),
        pc.map(function (c, i) {
          return h("div", { key: i, style: { fontSize: 12, color: t.textDim, marginBottom: 6, lineHeight: 1.45 } },
            h("span", { style: { fontWeight: 700, color: t.text } }, c.title ? c.title : c.id), " — ",
            c.author ? c.author : "Unknown", c.license ? (", " + c.license + " ") : " ",
            c.url ? h("a", { href: c.url, target: "_blank", rel: "noopener noreferrer", style: { color: t.teal } }, "source") : null
          );
        })
      ) : null
    );
  }

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 30px" } },
    h(Illus, { name: "forest", ar: "16 / 6", label: "Woodland", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } }),
    h("div", { style: { margin: "4px 0 14px" } },
      h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Library"),
      h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 2 } }, "Reference for everything in SeaHype.")
    ),
    head, body
  );
}

/* ============================================================ LOGBOOK == */
function LogbookScreen(props) {
  var t = props.t;
  var state = props.state;
  var info = levelInfo(state.xp);
  var st = statFor(state);
  var ms = MILESTONES();
  var streakDays = (state.streak && state.streak.days) ? state.streak.days : 0;

  var milestoneEls = ms.map(function (m, i) {
    var unlocked = st.done >= m.need;
    return h(Card, { t: t, key: i, style: { marginBottom: 9, opacity: unlocked ? 1 : 0.7, borderLeft: "3px solid " + (unlocked ? t.green : t.line) } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { width: 38, height: 38, borderRadius: 99, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: unlocked ? t.greenDim : t.panelHi, border: "1px solid " + (unlocked ? t.green : t.line) } },
          unlocked ? h(Glyph, { name: "check", size: 18, color: t.green }) : h(Glyph, { name: "lock", size: 16, color: t.textFaint })),
        h("div", { style: { flex: 1 } },
          h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 } },
            h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text } }, m.title),
            h("span", { style: { fontSize: 11.5, fontWeight: 700, color: t.textFaint } }, m.need + " lessons")
          ),
          h("div", { style: { fontSize: 12.5, lineHeight: 1.5, color: t.textDim, marginTop: 3 } }, m.blurb),
          m.cite ? h("div", { style: { fontSize: 11, color: t.textFaint, marginTop: 4 } }, "Source: " + m.cite) : null
        )
      )
    );
  });

  var log = state.log || [];
  var logEls = log.slice(0, 12).map(function (e, i) {
    var d = new Date(e.t);
    var label = e.label;
    return h("div", { key: i, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: i === 0 ? "none" : "1px solid " + t.lineSoft } },
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, label),
        h("div", { style: { fontSize: 11.5, color: t.textFaint } }, d.toLocaleDateString() + (e.score != null ? ("  ·  " + e.score + "%") : ""))
      ),
      e.xp ? h("span", { style: { fontSize: 12.5, fontWeight: 800, color: t.green } }, "+" + e.xp + " XP") : null
    );
  });

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 30px" } },
    h(Illus, { name: "mountain", ar: "16 / 6", label: "The living land", style: { marginBottom: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" } }),
    h("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, margin: "4px 0 14px" } },
      h("div", null,
        h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Progress"),
        h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 2 } }, "Your journey from trailhead to summit.")
      ),
      props.onGo ? h("button", { onClick: function () { props.onGo("profile"); }, "aria-label": "Settings and account", style: { flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 6, background: t.panelHi, border: "1px solid " + t.line, borderRadius: 999, padding: "7px 12px", cursor: "pointer", color: t.textDim, fontFamily: SANS, fontSize: 13, fontWeight: 800 } }, h(Glyph, { name: "profile", size: 16, color: t.textDim }), "You") : null
    ),
    h(Card, { t: t, onClick: function () { if (props.onGo) props.onGo("badges"); }, style: { marginBottom: 14, cursor: "pointer", background: "linear-gradient(135deg," + t.panelHi + "," + t.panel + ")" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { width: 40, height: 40, flex: "0 0 auto", borderRadius: 11, background: t.amber, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: "star", size: 20, color: "#3A2A04" })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 15, fontWeight: 900, color: t.text } }, "Field Badges"),
          h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 1 } }, badgeEarnedCount(state) + " of " + BADGES.length + " earned")),
        h(Glyph, { name: "play", size: 17, color: t.amber })),
      h("div", { style: { marginTop: 10 } }, h(Bar, { t: t, value: pct(badgeEarnedCount(state), BADGES.length), color: t.amber, height: 6 }))),
    h(Card, { t: t, style: { marginBottom: 14 } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
        h("div", null, h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Trail level " + info.level), h("div", { style: { fontSize: 20, fontWeight: 900, color: t.sky } }, info.name)),
        h("div", { style: { textAlign: "right" } }, h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, state.xp), h("div", { style: { fontSize: 11.5, color: t.textFaint } }, "XP"))
      ),
      h("div", { style: { marginTop: 8 } }, h(Bar, { t: t, value: info.pct, color: t.sky })),
      h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12.5, color: t.textDim } },
        h("span", null, st.done + " / " + st.total + " lessons"),
        h("span", null, streakDays + "-day streak")
      )
    ),
    h(SectionLabel, { t: t, icon: "star" }, "Milestones"),
    milestoneEls,
    log.length ? h("div", null, h(SectionLabel, { t: t, icon: "log" }, "Recent activity"), h(Card, { t: t, pad: "4px 14px" }, logEls)) : null
  );
}

/* ============================================================ PROFILE == */
function ProfileScreen(props) {
  var t = props.t;
  var state = props.state;
  var nameState = useState(state.profile && state.profile.name ? state.profile.name : "");
  var nm = nameState[0], setNm = nameState[1];
  var confirmState = useState(false);
  var confirm = confirmState[0], setConfirm = confirmState[1];

  function saveName() { props.onPatchProfile({ name: nm.trim() }); }
  var ints = (state.profile && state.profile.interests) ? state.profile.interests : [];

  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 36px" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "4px 0 16px" } },
      h(BrandLogo, { size: 44 }),
      h("div", null, h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "You"), h("div", { style: { fontSize: 13, color: t.textDim } }, "Settings & account"))
    ),
    h(Card, { t: t, style: { marginBottom: 12 } },
      h("label", { style: { display: "block", fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 7 } }, "Display name"),
      h("div", { style: { display: "flex", gap: 8 } },
        h("input", { value: nm, onChange: function (e) { setNm(e.target.value); }, placeholder: "Your name", style: { flex: 1, padding: "11px 13px", borderRadius: 11, border: "1px solid " + t.line, background: t.panel, color: t.text, fontSize: 14.5, fontFamily: SANS, outline: "none" } }),
        h(Btn, { t: t, kind: "soft", small: true, onClick: saveName }, "Save")
      )
    ),
    h(Card, { t: t, style: { marginBottom: 12 } },
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
        h("div", null, h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, "Appearance"), h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 2 } }, t.name === "dark" ? "Woodland dark theme" : "Bright meadow theme")),
        h(Btn, { t: t, kind: "soft", small: true, onClick: props.onToggleTheme }, t.name === "dark" ? "Switch to light" : "Switch to dark")
      )
    ),
    ints.length ? h(Card, { t: t, style: { marginBottom: 12 } },
      h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 8 } }, "Your interests"),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 7 } }, ints.map(function (x, i) { return h(Chip, { t: t, key: i, color: t.sky }, x); }))
    ) : null,
    h(Card, { t: t, onClick: function () { props.onGo("teacher"); }, style: { marginBottom: 12, cursor: "pointer" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { width: 40, height: 40, flex: "0 0 auto", borderRadius: 11, background: t.panelHi, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: "lock", size: 20, color: t.sky })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, "Parent & teacher"),
          h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 2 } }, "Check progress and verify what's been learned")),
        h(Glyph, { name: "ext", size: 16, color: t.textDim })
      )
    ),
    h(Card, { t: t, style: { marginBottom: 12 } },
      h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 6 } }, "About SeaHype"),
      h("div", { style: { fontSize: 13, lineHeight: 1.6, color: t.textDim, marginBottom: 10 } }, "A free, offline nature & conservation study app. Your progress is stored only on this device", state.persistent === false ? " (currently in temporary memory — storage is unavailable in this environment)" : "", "."),
      h(ComplianceBanner, { t: t }),
      h("div", { style: { marginTop: 10 } }, h(Btn, { t: t, kind: "ghost", small: true, icon: "book", onClick: function () { props.onGo("legal"); } }, "Terms, privacy & credits"))
    ),
    h(Card, { t: t, style: { borderColor: t.redDim } },
      h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 4 } }, "Reset progress"),
      h("div", { style: { fontSize: 12.5, color: t.textDim, marginBottom: 10, lineHeight: 1.5 } }, "Erase all XP, completed lessons, streak and notes on this device. This cannot be undone."),
      h(Btn, { t: t, kind: "danger", small: true, icon: "reset", onClick: function () { setConfirm(true); } }, "Reset everything")
    ),
    h(Modal, { t: t, open: confirm, title: "Reset all progress?", onClose: function () { setConfirm(false); } },
      h("p", { style: { fontSize: 14, lineHeight: 1.6, color: t.textDim } }, "This will permanently erase your XP, completed lessons, streak, flags and notes on this device."),
      h("div", { style: { display: "flex", gap: 10, marginTop: 6 } },
        h(Btn, { t: t, kind: "soft", block: true, onClick: function () { setConfirm(false); } }, "Cancel"),
        h(Btn, { t: t, kind: "danger", block: true, onClick: function () { setConfirm(false); props.onReset(); } }, "Yes, reset")
      )
    ),
    h("div", { style: { textAlign: "center", fontSize: 11, color: t.textFaint, marginTop: 18 } }, BRAND)
  );
}

/* ============================================================ LEGAL == */
function LegalScreen(props) {
  var t = props.t;
  function Para(txt) { return h("p", { style: { fontSize: 13.5, lineHeight: 1.65, color: t.textDim, margin: "0 0 11px" } }, txt); }
  function Hd(txt) { return h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text, margin: "16px 0 7px" } }, txt); }
  var year = new Date().getFullYear();
  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 40px" } },
    h("button", { onClick: function () { props.onGo("profile"); }, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 8 } }, h(Glyph, { name: "back", size: 18, color: t.textDim }), "Back"),
    h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text, marginBottom: 4 } }, "Terms, privacy & credits"),
    Hd("Educational disclaimer"),
    Para(BRAND + " is an independent educational study and reference tool. Its lessons are original explanations of well-established marine-biology concepts, with links to authoritative public sources for further reading. It is not a substitute for accredited coursework, formal fieldwork, or a scientific-diving certification."),
    Para("SeaHype is not affiliated with, endorsed by, or sponsored by NOAA, the Smithsonian Institution, MBARI, WHOI, IUCN, NASA, FAO, or any other organization referenced. Linked sources belong to their respective owners and are provided for educational reference only."),
    Hd("Safety"),
    Para("Always follow local laws, regulations and safety guidance for any beach, water, boating or field activity. Never handle protected, venomous, or otherwise dangerous marine life. When in doubt, observe from a safe distance and consult qualified local authorities."),
    Hd("Privacy"),
    Para("SeaHype runs entirely on your device. It does not require an account, and it does not collect, transmit, or sell personal data. Your name, progress, notes and settings are stored only in your browser's local storage on this device, and you can erase them at any time from the profile screen by choosing Reset progress."),
    Hd("Copyright"),
    Para("© " + year + " " + OPERATOR + ". The original lesson text, quizzes, structure and interface of " + BRAND + " are the work of the operator. You may use the app freely for personal learning. Source organizations retain copyright to their own materials."),
    Hd("Trademarks"),
    Para("Product and organization names referenced within SeaHype are the trademarks of their respective owners and are used only for identification and educational reference. No affiliation or endorsement is implied."),
    Hd("Artwork"),
    Para("All sea-life and shell illustrations in " + BRAND + " are original vector artwork created for this app — they are drawn diagrams, not photographs. They are designed to be recognizable teaching aids that render crisply at any size and work fully offline. Real organisms vary in color and form, so use the linked sources and field guides whenever you need photographic reference or precise identification."),
    Hd("No warranty"),
    Para("SeaHype is provided “as is,” without warranty of any kind. While we strive for accuracy and cite reputable sources, science advances and errors are possible; always verify critical information against primary sources."),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 14 } }, "Operator alias: " + OPERATOR)
  );
}

/* ============================================================ NAV + APP == */
var NAV_ITEMS = [["home", "Home", "home"], ["learn", "Learn", "learn"], ["practice", "Practice", "practice"], ["arcade", "Arcade", "arcade"], ["library", "Library", "library"], ["log", "Progress", "log"]];
function navActive(view, key) {
  return view === key
    || (key === "log" && view === "profile")
    || (key === "log" && view === "legal")
    || (key === "log" && view === "badges")
    || (key === "practice" && view === "review");
}
function NavRail(props) {
  var t = props.t;
  return h("div", { style: { position: "fixed", left: 0, top: 0, bottom: 0, width: 232, zIndex: 500, background: t.bg2, borderRight: "1px solid " + t.line, display: "flex", flexDirection: "column", padding: "20px 14px" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "4px 8px 18px" } },
      h(BrandLogo, { size: 40 }),
      h("div", null,
        h("div", { style: { fontSize: 15, fontWeight: 900, color: t.text, lineHeight: 1.1 } }, BRAND_SHORT),
        h("div", { style: { fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: t.textFaint } }, "Nature & Conservation")
      )
    ),
    h("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
      NAV_ITEMS.map(function (it) {
        var on = navActive(props.view, it[0]);
        return h("button", { key: it[0], onClick: function () { props.onGo(it[0]); }, style: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", width: "100%", background: on ? t.panelHi : "transparent", border: "1px solid " + (on ? t.line : "transparent"), borderRadius: 12, padding: "11px 12px", cursor: "pointer", color: on ? t.sky : t.textDim, fontFamily: SANS, fontSize: 14.5, fontWeight: 800 } },
          h(Glyph, { name: it[2], size: 20, color: on ? t.sky : t.textDim }),
          it[1]
        );
      })
    ),
    h("div", { style: { marginTop: "auto", padding: "8px", fontSize: 11, color: t.textFaint, lineHeight: 1.5 } }, "Free · offline · your progress stays on this device")
  );
}
function BottomNav(props) {
  var t = props.t;
  var items = NAV_ITEMS;
  return h("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 500, background: t.bg2, borderTop: "1px solid " + t.line, paddingBottom: "env(safe-area-inset-bottom)" } },
    h("div", { style: { maxWidth: 560, margin: "0 auto", display: "flex" } },
      items.map(function (it) {
        var on = navActive(props.view, it[0]);
        return h("button", { key: it[0], onClick: function () { props.onGo(it[0]); }, style: { flex: 1, background: "none", border: "none", cursor: "pointer", padding: "9px 4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? t.sky : t.textFaint } },
          h(Glyph, { name: it[2], size: 22, color: on ? t.sky : t.textFaint }),
          h("span", { style: { fontSize: 10.5, fontWeight: 700 } }, it[1])
        );
      })
    )
  );
}

function freshState() {
  return {
    onboarded: false,
    profile: { name: "", level: "teen", interests: [], goal: "" },
    xp: 0,
    lessons: {},
    weak: {},
    streak: { last: "", days: 0 },
    log: [],
    arcade: { tickets: 0, xpToday: 0, day: "", scores: {} },
    surveys: {},
    assessments: [],
    paths: {},
    srs: {},
    reviewsDone: 0,
    badges: {},
    settings: { theme: "dark" }
  };
}
function cloneState(s) { try { return JSON.parse(JSON.stringify(s)); } catch (e) { return freshState(); } }
function mergeState(loaded) {
  var s = freshState();
  if (!loaded) return s;
  if (loaded.onboarded) s.onboarded = true;
  if (typeof loaded.xp === "number") s.xp = loaded.xp;
  if (loaded.profile) {
    if (loaded.profile.name) s.profile.name = loaded.profile.name;
    if (loaded.profile.level) s.profile.level = loaded.profile.level;
    if (loaded.profile.interests) s.profile.interests = loaded.profile.interests;
    if (loaded.profile.goal) s.profile.goal = loaded.profile.goal;
  }
  if (loaded.lessons) s.lessons = loaded.lessons;
  if (loaded.weak) s.weak = loaded.weak;
  if (loaded.streak) s.streak = loaded.streak;
  if (loaded.log) s.log = loaded.log;
  if (loaded.arcade) s.arcade = loaded.arcade;
  if (loaded.surveys) s.surveys = loaded.surveys;
  if (loaded.assessments) s.assessments = loaded.assessments;
  if (loaded.paths) s.paths = loaded.paths;
  if (loaded.srs) s.srs = loaded.srs;
  if (typeof loaded.reviewsDone === "number") s.reviewsDone = loaded.reviewsDone;
  if (loaded.badges) s.badges = loaded.badges;
  if (loaded.settings && loaded.settings.theme) s.settings.theme = loaded.settings.theme;
  return s;
}

/* ===================================================== PARENT / TEACHER == */
function relTimeShort(iso) {
  if (!iso) return "";
  var then = new Date(iso).getTime();
  if (!then) return "";
  var diff = Date.now() - then;
  if (diff < 0) diff = 0;
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  var days = Math.floor(hrs / 24);
  if (days < 30) return days + "d ago";
  return Math.floor(days / 30) + "mo ago";
}
function shuffleArr(a) {
  var arr = a.slice();
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}
function countPool(state, scope) {
  var L = LESSONS(); var ids = allLessonIds(); var n = 0;
  for (var i = 0; i < ids.length; i++) {
    var l = L[ids[i]];
    if (!l || !l.quiz || !l.quiz.length) continue;
    if (scope === "done") { var r = state.lessons[ids[i]]; if (!r || !r.done) continue; }
    else if (scope !== "all") { if (l.track !== scope) continue; }
    n += l.quiz.length;
  }
  return n;
}
function buildPool(state, scope) {
  var L = LESSONS(); var ids = allLessonIds(); var pool = [];
  for (var i = 0; i < ids.length; i++) {
    var l = L[ids[i]];
    if (!l || !l.quiz || !l.quiz.length) continue;
    if (scope === "done") { var r = state.lessons[ids[i]]; if (!r || !r.done) continue; }
    else if (scope !== "all") { if (l.track !== scope) continue; }
    for (var q = 0; q < l.quiz.length; q++) {
      pool.push({ item: l.quiz[q], lessonId: ids[i], lessonTitle: l.title, track: l.track });
    }
  }
  return pool;
}

function TeacherGate(props) {
  var t = props.t;
  var chalState = useState(function () { return { a: 6 + Math.floor(Math.random() * 7), b: 6 + Math.floor(Math.random() * 7) }; });
  var a = chalState[0].a, b = chalState[0].b;
  var valState = useState(""); var val = valState[0], setVal = valState[1];
  var errState = useState(false); var err = errState[0], setErr = errState[1];
  function submit() { if (parseInt(val, 10) === a * b) { props.onPass(); } else { setErr(true); } }
  return h("div", { style: { maxWidth: 460, margin: "0 auto", padding: "10px 16px 40px" } },
    h("button", { onClick: function () { props.onGo("profile"); }, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 8 } }, h(Glyph, { name: "back", size: 18, color: t.textDim }), "Back"),
    h(Card, { t: t, style: { textAlign: "center", marginTop: 8 } },
      h("div", { style: { display: "inline-flex", width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", background: t.panelHi, marginBottom: 10 } }, h(Glyph, { name: "lock", size: 24, color: t.sky })),
      h("div", { style: { fontSize: 19, fontWeight: 900, color: t.text, marginBottom: 6 } }, "Parent & teacher area"),
      h("div", { style: { fontSize: 13.5, lineHeight: 1.55, color: t.textDim, marginBottom: 16 } }, "See progress and quiz your child with an answer key in hand. To keep this for grown-ups, solve this first:"),
      h("div", { style: { fontSize: 26, fontWeight: 900, color: t.text, marginBottom: 12 } }, a + " \u00d7 " + b + " = ?"),
      h("input", { value: val, inputMode: "numeric", onChange: function (e) { setVal(e.target.value); setErr(false); }, onKeyDown: function (e) { if (e.key === "Enter") submit(); }, placeholder: "Answer", style: { width: 150, textAlign: "center", padding: "12px 14px", borderRadius: 12, border: "1.5px solid " + (err ? t.red : t.line), background: t.panel, color: t.text, fontSize: 18, fontFamily: SANS, outline: "none" } }),
      err ? h("div", { style: { fontSize: 12.5, color: t.red, marginTop: 8 } }, "Not quite \u2014 try again.") : null,
      h("div", { style: { marginTop: 16 } }, h(Btn, { t: t, kind: "go", block: true, onClick: submit }, "Enter"))
    )
  );
}

function TeacherScreen(props) {
  var t = props.t;
  var state = props.state;
  var unlockedState = useState(false); var unlocked = unlockedState[0], setUnlocked = unlockedState[1];
  var modeState = useState("dash"); var mode = modeState[0], setMode = modeState[1];
  var scopeState = useState("done"); var scope = scopeState[0], setScope = scopeState[1];
  var lenState = useState(10); var lenN = lenState[0], setLenN = lenState[1];
  var qsState = useState([]); var qs = qsState[0], setQs = qsState[1];
  var idxState = useState(0); var idx = idxState[0], setIdx = idxState[1];
  var revealState = useState(false); var reveal = revealState[0], setReveal = revealState[1];
  var marksState = useState([]); var marks = marksState[0], setMarks = marksState[1];

  if (!unlocked) { return h(TeacherGate, { t: t, onGo: props.onGo, onPass: function () { setUnlocked(true); } }); }

  var L = LESSONS();
  var ids = allLessonIds();
  var who = (state.profile && state.profile.name) ? state.profile.name : "your child";
  var LETTERS = ["A", "B", "C", "D", "E", "F"];
  function backBtn(onClick, label) {
    return h("button", { onClick: onClick, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 8 } }, h(Glyph, { name: "back", size: 18, color: t.textDim }), label);
  }
  function pill(active, label, onClick, dim) {
    return h("button", { onClick: onClick, style: { flex: "1 1 0", padding: "10px 8px", borderRadius: 10, border: "1.5px solid " + (active ? t.sky : t.line), background: active ? t.panelHi : t.panel, color: dim ? t.textFaint : (active ? t.text : t.textDim), fontSize: 13, fontWeight: 800, cursor: dim ? "default" : "pointer", opacity: dim ? 0.5 : 1, fontFamily: SANS } }, label);
  }
  function startAssessment() {
    var pool = buildPool(state, scope);
    var picked = shuffleArr(pool).slice(0, Math.min(lenN, pool.length));
    setQs(picked); setMarks([]); setIdx(0); setReveal(false); setMode("run");
  }
  function mark(ok) {
    var m = marks.slice(); m[idx] = ok; setMarks(m);
    if (idx + 1 < qs.length) { setIdx(idx + 1); setReveal(false); } else { setMode("results"); }
  }

  /* ---- DASHBOARD ---- */
  if (mode === "dash") {
    var st = statFor(state);
    var info = levelInfo(state.xp);
    var streakDays = (state.streak && state.streak.days) ? state.streak.days : 0;
    var trackStats = TRACKS.map(function (tr) {
      var tot = 0, dn = 0;
      for (var i = 0; i < ids.length; i++) { var l = L[ids[i]]; if (l && l.track === tr.id) { tot++; var r = state.lessons[ids[i]]; if (r && r.done) dn++; } }
      return { id: tr.id, label: tr.label, done: dn, total: tot };
    });
    var sumBest = 0, doneN = 0;
    for (var i2 = 0; i2 < ids.length; i2++) { var r2 = state.lessons[ids[i2]]; if (r2 && r2.done) { sumBest += (r2.best ? r2.best : 0); doneN++; } }
    var avgScore = doneN ? Math.round(sumBest / doneN) : 0;
    var surveys = state.surveys || {};
    var cSum = 0, clSum = 0, sN = 0, flagged = 0;
    for (var k in surveys) { if (Object.prototype.hasOwnProperty.call(surveys, k) && surveys[k]) { var sv = surveys[k]; if (sv.confidence) cSum += sv.confidence; if (sv.clarity) clSum += sv.clarity; sN++; if (sv.flag) flagged++; } }
    var avgConf = sN ? (cSum / sN) : 0, avgClar = sN ? (clSum / sN) : 0;
    var review = []; var seenR = {};
    for (var fk in surveys) { if (Object.prototype.hasOwnProperty.call(surveys, fk) && surveys[fk] && surveys[fk].flag && L[fk] && !seenR[fk]) { review.push(fk); seenR[fk] = true; } }
    var weak = state.weak || {};
    for (var wk in weak) { if (Object.prototype.hasOwnProperty.call(weak, wk) && weak[wk] > 0 && L[wk] && !seenR[wk]) { review.push(wk); seenR[wk] = true; } }
    review = review.slice(0, 8);
    var logArr = (state.log || []).slice(0, 8);
    var assessments = state.assessments || [];
    var lastA = assessments.length ? assessments[0] : null;
    function tile(label, value, sub, color) {
      return h("div", { style: { flex: "1 1 0", minWidth: 0, background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "12px 12px" } },
        h("div", { style: { fontSize: 22, fontWeight: 900, color: color, lineHeight: 1.1 } }, value),
        h("div", { style: { fontSize: 11.5, fontWeight: 700, color: t.textDim, marginTop: 3 } }, label),
        sub ? h("div", { style: { fontSize: 10.5, color: t.textFaint, marginTop: 1 } }, sub) : null);
    }
    return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 40px" } },
      backBtn(function () { props.onGo("profile"); }, "Back to settings"),
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, margin: "2px 0 4px" } }, h(Glyph, { name: "profile", size: 22, color: t.sky }), h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Parent & teacher")),
      h("div", { style: { fontSize: 13, color: t.textDim, margin: "0 0 16px", lineHeight: 1.5 } }, "A private overview of what " + who + " has studied \u2014 plus a way to check that it's actually sinking in."),
      h("div", { style: { display: "flex", gap: 10, marginBottom: 10 } }, tile("Lessons done", st.done + " / " + st.total, pct(st.done, st.total) + "% complete", t.sky), tile("Avg quiz score", avgScore + "%", doneN + (doneN === 1 ? " quiz" : " quizzes"), t.green)),
      h("div", { style: { display: "flex", gap: 10, marginBottom: 16 } }, tile("Trail level", "Lv " + info.level, info.name, t.violet), tile("Day streak", "" + streakDays, streakDays === 1 ? "day" : "days", t.amber)),
      h(Card, { t: t, style: { marginBottom: 16, borderLeft: "3px solid " + t.sky } },
        h("div", { style: { fontSize: 15, fontWeight: 900, color: t.text, marginBottom: 4 } }, "Verify knowledge"),
        h("div", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, marginBottom: 10 } }, "Quiz " + who + " out loud with questions pulled straight from the lessons. You get the correct answer and a short explanation to check each one \u2014 so you can see whether they're really learning the facts."),
        lastA ? h("div", { style: { fontSize: 12, color: t.textFaint, marginBottom: 10 } }, "Last check: " + lastA.correct + " / " + lastA.total + " (" + lastA.score + "%) \u00b7 " + relTimeShort(lastA.t)) : null,
        h(Btn, { t: t, kind: "go", block: true, icon: "check", onClick: function () { setScope(st.done > 0 ? "done" : "all"); setMode("setup"); } }, "Start a knowledge check")
      ),
      h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, margin: "4px 0 10px" } }, "Progress by area"),
      h("div", { style: { marginBottom: 16 } }, trackStats.map(function (ts) {
        return h("div", { key: ts.id, style: { marginBottom: 10 } },
          h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 } }, h("span", { style: { color: t.textDim, fontWeight: 700 } }, ts.label), h("span", { style: { color: t.textFaint } }, ts.done + " / " + ts.total)),
          h(Bar, { t: t, value: pct(ts.done, ts.total), color: trackColor(t, ts.id), height: 6 }));
      })),
      sN ? h(Card, { t: t, style: { marginBottom: 16 } },
        h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 8 } }, "Self-reported understanding"),
        h("div", { style: { display: "flex", gap: 20 } },
          h("div", null, h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text } }, avgConf.toFixed(1) + " / 5"), h("div", { style: { fontSize: 11.5, color: t.textDim } }, "confidence")),
          h("div", null, h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text } }, avgClar.toFixed(1) + " / 5"), h("div", { style: { fontSize: 11.5, color: t.textDim } }, "lesson clarity")),
          flagged ? h("div", null, h("div", { style: { fontSize: 18, fontWeight: 900, color: t.amber } }, "" + flagged), h("div", { style: { fontSize: 11.5, color: t.textDim } }, "flagged")) : null),
        h("div", { style: { fontSize: 11, color: t.textFaint, marginTop: 8 } }, who + "'s own ratings after each quiz \u2014 a hint, not a grade.")
      ) : null,
      review.length ? h(Card, { t: t, style: { marginBottom: 16 } },
        h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 8 } }, "Worth revisiting together"),
        review.map(function (rid) { var rl = L[rid]; if (!rl) return null; return h("div", { key: rid, style: { display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13, color: t.textDim } }, h("span", { style: { width: 6, height: 6, borderRadius: 9, background: trackColor(t, rl.track), flex: "0 0 auto" } }), h("span", null, rl.title)); })
      ) : null,
      logArr.length ? h(Card, { t: t },
        h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 8 } }, "Recent study activity"),
        logArr.map(function (e, i) { return h("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: i ? "1px solid " + t.line : "none" } }, h("span", { style: { fontSize: 13, color: t.text, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 } }, e.label), h("span", { style: { fontSize: 11.5, color: t.textFaint, flex: "0 0 auto" } }, (e.score != null ? (e.score + "% \u00b7 ") : "") + relTimeShort(e.t))); })
      ) : h("div", { style: { fontSize: 12.5, color: t.textFaint, textAlign: "center", padding: 10 } }, who + " hasn't studied anything yet.")
    );
  }

  /* ---- SETUP ---- */
  if (mode === "setup") {
    var availDone = countPool(state, "done");
    var availAll = countPool(state, "all");
    var availForLen = scope === "done" ? availDone : (scope === "all" ? availAll : countPool(state, scope));
    var canStart = availForLen > 0;
    function lenPill(n) { return pill(lenN === n, "" + n, function () { setLenN(n); }, n > availForLen && availForLen > 0); }
    return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 40px" } },
      backBtn(function () { setMode("dash"); }, "Back"),
      h("div", { style: { fontSize: 20, fontWeight: 900, color: t.text, margin: "2px 0 6px" } }, "Knowledge check"),
      h("div", { style: { fontSize: 13, lineHeight: 1.55, color: t.textDim, marginBottom: 18 } }, "Questions are drawn from the lessons " + who + " has studied, with facts taken straight from each lesson. Read each one aloud, let them answer, then reveal to check."),
      h("div", { style: { fontSize: 12.5, fontWeight: 800, color: t.text, marginBottom: 8 } }, "Draw questions from"),
      h("div", { style: { display: "flex", gap: 8, marginBottom: 18 } },
        pill(scope === "done", "Completed (" + availDone + ")", function () { setScope("done"); }, false),
        pill(scope === "all", "Whole course (" + availAll + ")", function () { setScope("all"); }, false)),
      h("div", { style: { fontSize: 12.5, fontWeight: 800, color: t.text, marginBottom: 8 } }, "How many questions"),
      h("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, lenPill(5), lenPill(10), lenPill(20)),
      (scope === "done" && availDone === 0) ? h("div", { style: { fontSize: 12.5, color: t.amber, marginBottom: 14, lineHeight: 1.5 } }, who + " hasn't finished any lessons yet \u2014 switch to \u201cWhole course\u201d, or have them complete a lesson first.") : null,
      h(Btn, { t: t, kind: "go", block: true, icon: "play", disabled: !canStart, onClick: startAssessment }, "Start \u2014 " + Math.min(lenN, availForLen) + " questions")
    );
  }

  /* ---- RUN (proctored) ---- */
  if (mode === "run") {
    if (!qs.length) { return h("div", { style: { padding: 24, textAlign: "center", color: t.textDim } }, "No questions available.", h("div", { style: { marginTop: 12 } }, h(Btn, { t: t, kind: "soft", onClick: function () { setMode("dash"); } }, "Back"))); }
    var cur = qs[idx]; var item = cur.item; var choiceEls;
    if (item.type === "mc") {
      choiceEls = item.choices.map(function (c, ci) {
        var isAns = reveal && ci === item.answer;
        return h("div", { key: ci, style: { display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", marginBottom: 8, borderRadius: 11, border: "1.5px solid " + (isAns ? t.green : t.line), background: isAns ? t.greenDim : t.panel } },
          h("span", { style: { width: 22, height: 22, flex: "0 0 auto", borderRadius: 6, background: isAns ? t.green : t.panelHi, color: isAns ? "#04222F" : t.textDim, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" } }, LETTERS[ci]),
          h("span", { style: { fontSize: 14, color: t.text, flex: 1 } }, c),
          isAns ? h(Glyph, { name: "check", size: 16, color: t.green }) : null);
      });
    } else if (item.type === "tf") {
      choiceEls = h("div", { style: { display: "flex", gap: 10 } }, [true, false].map(function (bv) {
        var isAns = reveal && item.answer === bv;
        return h("div", { key: bv ? "T" : "F", style: { flex: 1, textAlign: "center", padding: "13px", borderRadius: 11, border: "1.5px solid " + (isAns ? t.green : t.line), background: isAns ? t.greenDim : t.panel, fontWeight: 800, color: t.text } }, bv ? "True" : "False");
      }));
    } else {
      choiceEls = reveal ? h("div", { style: { padding: "11px 13px", borderRadius: 11, border: "1.5px solid " + t.green, background: t.greenDim, fontSize: 14, color: t.text } }, "Expected answer: " + item.answer) : h("div", { style: { fontSize: 12.5, color: t.textFaint, fontStyle: "italic", padding: "4px 0" } }, "Open answer \u2014 reveal to see the expected response.");
    }
    return h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "8px 16px 44px" } },
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } },
        h("button", { onClick: function () { setMode("dash"); }, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0" } }, h(Glyph, { name: "x", size: 18, color: t.textDim }), "End check"),
        h("span", { style: { fontSize: 13, fontWeight: 800, color: t.textDim } }, "Question " + (idx + 1) + " / " + qs.length)),
      h(Bar, { t: t, value: pct(idx, qs.length), color: t.sky, height: 6 }),
      h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: t.textFaint, margin: "16px 0 6px" } }, "Ask " + who + ":"),
      h("h2", { style: { fontSize: 19, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 16px" } }, item.q),
      choiceEls,
      reveal ? h(MiniCard, { t: t, label: "Answer & why", color: t.sky, bg: t.panelHi, border: t.line, style: { marginTop: 12 } }, item.why) : null,
      reveal ? h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 8 } }, "From the lesson: " + cur.lessonTitle) : null,
      reveal
        ? h("div", { style: { display: "flex", gap: 10, marginTop: 18 } }, h(Btn, { t: t, kind: "soft", block: true, onClick: function () { mark(false); } }, "\u2717 Missed it"), h(Btn, { t: t, kind: "go", block: true, onClick: function () { mark(true); } }, "\u2713 Got it"))
        : h("div", { style: { marginTop: 18 } }, h(Btn, { t: t, kind: "primary", block: true, icon: "search", onClick: function () { setReveal(true); } }, "Reveal answer"))
    );
  }

  /* ---- RESULTS ---- */
  var correct = 0; for (var ci2 = 0; ci2 < marks.length; ci2++) { if (marks[ci2]) correct++; }
  var total = qs.length;
  var score = total ? Math.round(correct * 100 / total) : 0;
  var byTrack = {};
  for (var j = 0; j < qs.length; j++) { var trk = qs[j].track; if (!byTrack[trk]) byTrack[trk] = { seen: 0, ok: 0 }; byTrack[trk].seen++; if (marks[j]) byTrack[trk].ok++; }
  var missedLessons = []; var seenM = {};
  for (var mi = 0; mi < qs.length; mi++) { if (!marks[mi]) { var lid = qs[mi].lessonId; if (!seenM[lid]) { missedLessons.push(qs[mi]); seenM[lid] = true; } } }
  var verdict = score >= 80 ? "Strong factual recall." : (score >= 50 ? "A fair grasp, with some gaps to revisit." : "Several gaps \u2014 worth studying these topics again together.");
  var vColor = score >= 80 ? t.green : (score >= 50 ? t.amber : t.red);
  function finishSave() {
    props.onSaveAssessment({ t: new Date().toISOString(), scope: scope, total: total, correct: correct, score: score });
    setMode("dash");
  }
  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "16px 16px 44px" } },
    h("div", { style: { textAlign: "center", marginBottom: 8 } },
      h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Knowledge check"),
      h("div", { style: { fontSize: 38, fontWeight: 900, color: vColor, margin: "6px 0 2px" } }, correct + " / " + total),
      h("div", { style: { fontSize: 14, color: t.textDim } }, who + " answered " + score + "% correctly"),
      h("div", { style: { fontSize: 13.5, fontWeight: 800, color: vColor, marginTop: 6 } }, verdict)),
    h(Card, { t: t, style: { marginTop: 14, marginBottom: 14 } },
      h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 10 } }, "By area"),
      Object.keys(byTrack).map(function (kk) { var bt2 = byTrack[kk]; return h("div", { key: kk, style: { marginBottom: 10 } },
        h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 } }, h("span", { style: { color: t.textDim, fontWeight: 700 } }, trackById(kk).label), h("span", { style: { color: t.textFaint } }, bt2.ok + " / " + bt2.seen)),
        h(Bar, { t: t, value: pct(bt2.ok, bt2.seen), color: trackColor(t, kk), height: 6 })); })),
    missedLessons.length ? h(Card, { t: t, style: { marginBottom: 16 } },
      h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 8 } }, "Have " + who + " revisit"),
      missedLessons.map(function (mq) { return h("div", { key: mq.lessonId, style: { display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13, color: t.textDim } }, h("span", { style: { width: 6, height: 6, borderRadius: 9, background: trackColor(t, mq.track), flex: "0 0 auto" } }), h("span", null, mq.lessonTitle)); })
    ) : h(Card, { t: t, style: { marginBottom: 16 } }, h("div", { style: { fontSize: 13, color: t.green, fontWeight: 700 } }, "No missed questions \u2014 excellent recall!")),
    h("div", { style: { display: "flex", gap: 10 } },
      h(Btn, { t: t, kind: "soft", block: true, onClick: function () { setMode("setup"); } }, "New check"),
      h(Btn, { t: t, kind: "go", block: true, icon: "check", onClick: finishSave }, "Save & finish"))
  );
}

/* ==================================================== DIVE BADGES ===== */
function bDone(state) { return statFor(state).done; }
function bMastered(state) { var M = SPMETA(); var ls = state.lessons || {}; var n = 0; for (var id in M) { if (Object.prototype.hasOwnProperty.call(M, id) && ls[id] && ls[id].best >= 80) n++; } return n; }
function bTracks(state) { var L = LESSONS(); var ls = state.lessons || {}; var seen = {}; for (var id in ls) { if (Object.prototype.hasOwnProperty.call(ls, id) && ls[id].done && L[id]) seen[L[id].track] = 1; } return Object.keys(seen).length; }
function bExpeditions(state) { var n = 0; for (var i = 0; i < TRACKS.length; i++) { var p = pathProg(state, TRACKS[i].id); if (p.total > 0 && p.done === p.total) n++; } return n; }
function bPerfect(state) { var ls = state.lessons || {}; for (var id in ls) { if (Object.prototype.hasOwnProperty.call(ls, id) && ls[id].best === 100) return true; } return false; }
function bTickets(state) { return (state.arcade && state.arcade.tickets) ? state.arcade.tickets : 0; }
function bStreak(state) { return (state.streak && state.streak.days) ? state.streak.days : 0; }
function bReviews(state) { return state.reviewsDone ? state.reviewsDone : 0; }
function progCount(cur, goal) { return { cur: cur, goal: goal }; }

var BADGES = [
  { id: "first-dive", title: "First Steps", desc: "Finish your first lesson", icon: "check", check: function (s) { return bDone(s) >= 1; }, prog: function (s) { return progCount(bDone(s), 1); } },
  { id: "getting-wet", title: "Finding the Trail", desc: "Finish 10 lessons", icon: "wave", check: function (s) { return bDone(s) >= 10; }, prog: function (s) { return progCount(bDone(s), 10); } },
  { id: "reef-regular", title: "Trail Regular", desc: "Finish 50 lessons", icon: "fish", check: function (s) { return bDone(s) >= 50; }, prog: function (s) { return progCount(bDone(s), 50); } },
  { id: "deep-diver", title: "Backcountry", desc: "Finish 100 lessons", icon: "depth", check: function (s) { return bDone(s) >= 100; }, prog: function (s) { return progCount(bDone(s), 100); } },
  { id: "marine-scholar", title: "Field Scholar", desc: "Finish 300 lessons", icon: "book", check: function (s) { return bDone(s) >= 300; }, prog: function (s) { return progCount(bDone(s), 300); } },
  { id: "species-spotter", title: "Species Spotter", desc: "Master 25 species", icon: "search", check: function (s) { return bMastered(s) >= 25; }, prog: function (s) { return progCount(bMastered(s), 25); } },
  { id: "naturalist", title: "Field Naturalist", desc: "Master 100 species", icon: "fish", check: function (s) { return bMastered(s) >= 100; }, prog: function (s) { return progCount(bMastered(s), 100); } },
  { id: "well-rounded", title: "Well Rounded", desc: "Start all 8 topics", icon: "anchor", check: function (s) { return bTracks(s) >= 8; }, prog: function (s) { return progCount(bTracks(s), 8); } },
  { id: "making-waves", title: "Getting Outside", desc: "Reach a 3-day streak", icon: "flame", check: function (s) { return bStreak(s) >= 3; }, prog: function (s) { return progCount(bStreak(s), 3); } },
  { id: "tidal-force", title: "Trailblazer", desc: "Reach a 7-day streak", icon: "flame", check: function (s) { return bStreak(s) >= 7; }, prog: function (s) { return progCount(bStreak(s), 7); } },
  { id: "devotee", title: "Wilderness Devotee", desc: "Reach a 30-day streak", icon: "flame", check: function (s) { return bStreak(s) >= 30; }, prog: function (s) { return progCount(bStreak(s), 30); } },
  { id: "pathfinder", title: "Pathfinder", desc: "Complete an expedition", icon: "depth", check: function (s) { return bExpeditions(s) >= 1; }, prog: function (s) { return progCount(bExpeditions(s), 1); } },
  { id: "cartographer", title: "Cartographer", desc: "Complete all 8 expeditions", icon: "star", check: function (s) { return bExpeditions(s) >= 8; }, prog: function (s) { return progCount(bExpeditions(s), 8); } },
  { id: "memory-keeper", title: "Memory Keeper", desc: "Finish your first Daily Trek", icon: "spark", check: function (s) { return bReviews(s) >= 1; }, prog: function (s) { return progCount(bReviews(s), 1); } },
  { id: "steel-trap", title: "Steel Trap", desc: "Finish 15 Daily Treks", icon: "spark", check: function (s) { return bReviews(s) >= 15; }, prog: function (s) { return progCount(bReviews(s), 15); } },
  { id: "flawless", title: "Flawless", desc: "Ace a lesson quiz (100%)", icon: "star", check: function (s) { return bPerfect(s); } },
  { id: "arcade-ace", title: "Arcade Ace", desc: "Collect 50 arcade tickets", icon: "ticket", check: function (s) { return bTickets(s) >= 50; }, prog: function (s) { return progCount(bTickets(s), 50); } }
];

function awardBadges(s) {
  if (!s.badges) s.badges = {};
  var today = todayStr(); var earned = [];
  for (var i = 0; i < BADGES.length; i++) { var b = BADGES[i]; if (!s.badges[b.id] && b.check(s)) { s.badges[b.id] = today; earned.push(b); } }
  return earned;
}
function badgeEarnedCount(state) { var m = state.badges || {}; var n = 0; for (var k in m) { if (Object.prototype.hasOwnProperty.call(m, k)) n++; } return n; }

function BadgesScreen(props) {
  var t = props.t; var state = props.state; var earnedMap = state.badges || {};
  var earnedCount = badgeEarnedCount(state);
  var cards = BADGES.map(function (b) {
    var earned = !!earnedMap[b.id];
    var prog = (!earned && b.prog) ? b.prog(state) : null;
    return h("div", { key: b.id, style: { padding: "12px", borderRadius: 14, border: "1.5px solid " + (earned ? t.green : t.line), background: earned ? ("linear-gradient(135deg," + t.greenDim + "," + t.panel + ")") : t.panel, opacity: earned ? 1 : 0.96 } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } },
        h("div", { style: { width: 38, height: 38, flex: "0 0 auto", borderRadius: 11, background: earned ? t.green : t.panelHi, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: b.icon, size: 19, color: earned ? "#04222F" : t.textFaint })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 13.5, fontWeight: 900, color: earned ? t.text : t.textDim } }, b.title),
          h("div", { style: { fontSize: 11, color: t.textFaint, marginTop: 1, lineHeight: 1.35 } }, b.desc))),
      earned ? h("div", { style: { fontSize: 11, fontWeight: 800, color: t.green, display: "flex", alignItems: "center", gap: 4 } }, h(Glyph, { name: "check", size: 13, color: t.green }), "Earned")
        : (prog ? h("div", null, h(Bar, { t: t, value: pct(prog.cur < prog.goal ? prog.cur : prog.goal, prog.goal), color: t.sky, height: 5 }), h("div", { style: { fontSize: 11, color: t.textFaint, marginTop: 4 } }, prog.cur + " / " + prog.goal)) : h("div", { style: { fontSize: 11, color: t.textFaint } }, "Locked")));
  });
  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 36px" } },
    h("button", { onClick: function () { props.onGo("log"); }, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 8 } }, h(Glyph, { name: "back", size: 18, color: t.textDim }), "Progress"),
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, margin: "2px 0 4px" } }, h(Glyph, { name: "star", size: 22, color: t.amber }), h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Field Badges")),
    h("p", { style: { fontSize: 13, color: t.textDim, margin: "0 0 6px" } }, earnedCount + " of " + BADGES.length + " earned \u2014 keep exploring to collect them all."),
    h(Bar, { t: t, value: pct(earnedCount, BADGES.length), color: t.amber, height: 7 }),
    h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 } }, cards));
}

/* =============================================== SPACED REPETITION ===== */
var SRS_DAYS = [0, 1, 2, 4, 9, 16]; /* index = Leitner box (1..5) */
function addDays(dateStr, n) {
  var p = ("" + dateStr).split("-");
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  d.setDate(d.getDate() + n);
  var m = d.getMonth() + 1, dd = d.getDate();
  return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (dd < 10 ? "0" + dd : dd);
}
function srsFor(state) { return state.srs || {}; }
function lessonDone(state, id) { return !!(state.lessons && state.lessons[id] && state.lessons[id].done); }
function learnedIds(state) {
  var L = LESSONS(); var out = []; var ls = state.lessons || {};
  for (var id in ls) { if (Object.prototype.hasOwnProperty.call(ls, id) && ls[id].done && L[id]) out.push(id); }
  return out;
}
function dueReviewIds(state) {
  var srs = srsFor(state); var today = todayStr(); var L = LESSONS(); var out = [];
  for (var id in srs) {
    if (!Object.prototype.hasOwnProperty.call(srs, id)) continue;
    if (!L[id] || !lessonDone(state, id)) continue;
    if (srs[id].due && srs[id].due <= today) out.push({ id: id, due: srs[id].due, box: srs[id].box || 1 });
  }
  out.sort(function (a, b) { if (a.due !== b.due) return a.due < b.due ? -1 : 1; return a.box - b.box; });
  return out;
}
function reviewPool(state, cap) {
  var due = dueReviewIds(state); var ids = []; var seen = {};
  for (var i = 0; i < due.length; i++) { ids.push(due[i].id); seen[due[i].id] = 1; }
  var w = state.weak || {}; var L = LESSONS();
  for (var wk in w) { if (Object.prototype.hasOwnProperty.call(w, wk) && w[wk] > 0 && L[wk] && lessonDone(state, wk) && !seen[wk]) { ids.push(wk); seen[wk] = 1; } }
  return ids.slice(0, cap || 12);
}
function reviewDueCount(state) { return reviewPool(state, 999).length; }
function srsStats(state) {
  var srs = srsFor(state); var today = todayStr(); var mastered = 0, learning = 0, total = 0, nextDue = null;
  for (var id in srs) {
    if (!Object.prototype.hasOwnProperty.call(srs, id)) continue;
    if (!lessonDone(state, id)) continue;
    total++; var b = srs[id].box || 1; if (b >= 5) mastered++; else learning++;
    if (!(srs[id].due && srs[id].due <= today) && srs[id].due) { if (!nextDue || srs[id].due < nextDue) nextDue = srs[id].due; }
  }
  return { mastered: mastered, learning: learning, total: total, nextDue: nextDue };
}
function reviewChallengeFor(id, idx) {
  var L = LESSONS(); var lesson = L[id]; if (!lesson) return null;
  var q = lesson.quiz || []; var mcs = [], tfs = [];
  for (var i = 0; i < q.length; i++) { if (q[i].type === "mc") mcs.push(q[i]); else if (q[i].type === "tf") tfs.push(q[i]); }
  var wantTf = (idx % 2 === 1);
  if (wantTf && tfs.length) { var tf = tfs[idx % tfs.length]; return { kind: "tf", q: tf.q, answer: tf.answer, why: tf.why, lessonId: id, title: lesson.title, track: lesson.track }; }
  if (mcs.length) { var mc = mcs[idx % mcs.length]; return { kind: "mcq", q: mc.q, choices: mc.choices, answer: mc.answer, why: mc.why, lessonId: id, title: lesson.title, track: lesson.track }; }
  if (tfs.length) { var tf2 = tfs[idx % tfs.length]; return { kind: "tf", q: tf2.q, answer: tf2.answer, why: tf2.why, lessonId: id, title: lesson.title, track: lesson.track }; }
  return null;
}
function buildReviewItems(state) {
  var ids = reviewPool(state, 12); var mode = "due";
  if (!ids.length) { ids = shuffleArr(learnedIds(state)).slice(0, 10); mode = "free"; }
  var items = [];
  for (var i = 0; i < ids.length; i++) { var ch = reviewChallengeFor(ids[i], i); if (ch) items.push({ id: ids[i], ch: ch }); }
  return { items: items, mode: mode };
}

/* ---- the Daily Trek review player (active recall + SRS) ---- */
function ReviewSession(props) {
  var t = props.t; var items = props.items; var mode = props.mode;
  var iState = useState(0); var i = iState[0], setI = iState[1];
  var okState = useState(0); var okCount = okState[0], setOk = okState[1];
  var total = items.length;
  function done(ok) { if (ok) setOk(okCount + 1); props.onGrade(items[i].id, ok); setI(i + 1); }
  var bar = h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "8px 16px 0" } },
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
      h("button", { onClick: props.onExit, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0" } }, h(Glyph, { name: "x", size: 18, color: t.textDim }), "Exit"),
      h("span", { style: { fontSize: 12.5, fontWeight: 800, color: t.textDim } }, (mode === "free" ? "Free practice" : "Daily Trek") + "  \u00b7  " + Math.min(i + 1, total) + "/" + total)),
    h(Bar, { t: t, value: pct(i, total), color: t.coral, height: 6 }));
  if (i >= total) {
    var sc = total ? Math.round(okCount * 100 / total) : 0;
    var xp = okCount * 5;
    var vColor = sc >= 80 ? t.green : (sc >= 50 ? t.amber : t.sky);
    return h("div", null, bar, h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "22px 16px 46px", textAlign: "center" } },
      h("div", { style: { display: "inline-flex", width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", background: t.panelHi, marginBottom: 12 } }, h(Glyph, { name: "star", size: 32, color: vColor })),
      h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Lesson complete"),
      h("h1", { style: { fontSize: 26, fontWeight: 900, color: vColor, margin: "6px 0 4px" } }, okCount + " / " + total + " correct"),
      h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 8 } }, "+" + xp + " XP"),
      h("p", { style: { fontSize: 13.5, color: t.textDim, margin: "0 auto 20px", maxWidth: 380, lineHeight: 1.55 } }, okCount > 0 ? (okCount + " item" + (okCount === 1 ? "" : "s") + " moved toward mastery \u2191  " + (sc >= 80 ? "Brilliant recall!" : "Keep exploring and they'll stick.")) : "No worries \u2014 these will come back around so you can nail them next time."),
      h(Btn, { t: t, kind: "go", block: true, icon: "check", onClick: function () { props.onFinish({ total: total, correct: okCount, xp: xp }); } }, "Finish")));
  }
  var item = items[i];
  return h("div", null, bar, h("div", { key: "rv-" + i, style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "18px 16px 46px" } },
    h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: trackColor(t, item.ch.track), marginBottom: 4 } }, "Do you remember?"),
    h("div", { style: { fontSize: 12.5, color: t.textFaint, marginBottom: 16 } }, "From: " + item.ch.title),
    renderChallenge(t, item.ch, done)));
}

/* ---- Home card ---- */
function DailyDiveCard(props) {
  var t = props.t; var state = props.state; var due = reviewDueCount(state);
  var streak = (state.streak && state.streak.days) ? state.streak.days : 0;
  var learned = learnedIds(state).length; var ready = learned >= 3;
  var sub;
  if (!ready) sub = "Finish a few lessons to unlock review.";
  else if (due > 0) sub = due + " item" + (due === 1 ? "" : "s") + " ready to review";
  else sub = "All caught up \u2014 tap for free practice.";
  return h(Card, { t: t, onClick: ready ? function () { props.onStart(); } : null, style: { marginBottom: 12, cursor: ready ? "pointer" : "default", opacity: ready ? 1 : 0.75, background: "linear-gradient(135deg," + t.panelHi + "," + t.panel + ")" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
      h("div", { style: { width: 44, height: 44, flex: "0 0 auto", borderRadius: 12, background: t.coral, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: "flame", size: 22, color: "#3A0E04" })),
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: t.coral, marginBottom: 2 } }, "Daily Trek"),
        h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, "Review & remember"),
        h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 1 } }, sub)),
      (ready && due > 0) ? h("span", { style: { fontSize: 13, fontWeight: 900, color: "#fff", background: t.coral, borderRadius: 20, minWidth: 26, textAlign: "center", padding: "3px 8px" } }, "" + due)
        : h(Glyph, { name: ready ? "play" : "lock", size: 18, color: t.coral })));
}

/* ---- Practice "Review" tab dashboard ---- */
function ReviewTab(props) {
  var t = props.t; var state = props.state; var L = LESSONS();
  var learned = learnedIds(state).length;
  if (learned < 3) {
    return h(Card, { t: t, style: { textAlign: "center", padding: 26 } },
      h(Glyph, { name: "spark", size: 30, color: t.sky }),
      h("div", { style: { fontWeight: 800, fontSize: 16, color: t.text, marginTop: 8 } }, "Review unlocks soon"),
      h("p", { style: { fontSize: 13.5, color: t.textDim, marginTop: 6, lineHeight: 1.55 } }, "Finish a few lessons and SeaHype will start bringing them back here on a smart schedule \u2014 quick quizzes that get further apart as you remember, so the science really sticks."));
  }
  var due = reviewDueCount(state); var stats = srsStats(state); var queue = reviewPool(state, 6);
  var nextTxt = stats.nextDue ? ("Next batch ready " + relativeDay(stats.nextDue)) : null;
  return h("div", null,
    h(Card, { t: t, style: { marginBottom: 14, background: "linear-gradient(135deg," + t.panelHi + "," + t.panel + ")" } },
      h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: t.coral, marginBottom: 4 } }, "Spaced-repetition review"),
      h("div", { style: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 } },
        h("div", { style: { fontSize: 34, fontWeight: 900, color: due > 0 ? t.text : t.green } }, due > 0 ? "" + due : "0"),
        h("div", { style: { fontSize: 14, fontWeight: 700, color: t.textDim } }, due > 0 ? ("item" + (due === 1 ? "" : "s") + " due now") : "all caught up!")),
      h("div", { style: { display: "flex", gap: 14, marginBottom: 14 } },
        h("div", null, h("span", { style: { fontSize: 16, fontWeight: 900, color: t.sky } }, "" + stats.learning), h("span", { style: { fontSize: 12, color: t.textFaint, marginLeft: 4 } }, "learning")),
        h("div", null, h("span", { style: { fontSize: 16, fontWeight: 900, color: t.green } }, "" + stats.mastered), h("span", { style: { fontSize: 12, color: t.textFaint, marginLeft: 4 } }, "mastered"))),
      h(Btn, { t: t, kind: "go", block: true, icon: due > 0 ? "flame" : "play", onClick: function () { props.onReview(); } }, due > 0 ? "Start Daily Trek" : "Free practice round"),
      (due === 0 && nextTxt) ? h("div", { style: { fontSize: 12, color: t.textFaint, marginTop: 10, textAlign: "center" } }, nextTxt) : null),
    h("div", { style: { fontSize: 12.5, color: t.textFaint, lineHeight: 1.55, margin: "0 4px 14px" } }, "Each lesson you finish comes back as a quick recall check. Get it right and it waits longer before returning; miss it and it comes back soon. That spacing is what locks knowledge into long-term memory."),
    queue.length ? h(Card, { t: t, pad: "4px 14px" },
      h(SectionLabel, { t: t, icon: "book" }, "Up next"),
      queue.map(function (id, qi) { var le = L[id]; if (!le) return null; return h("div", { key: id, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: qi === 0 ? "none" : "1px solid " + t.lineSoft } }, h("span", { style: { width: 7, height: 7, borderRadius: 9, background: trackColor(t, le.track), flex: "0 0 auto" } }), h("span", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, le.title)); })) : null);
}
function relativeDay(dateStr) {
  var d = dayDiff(todayStr(), dateStr);
  if (d == null) return "soon";
  if (d <= 0) return "now";
  if (d === 1) return "tomorrow";
  if (d < 7) return "in " + d + " days";
  return "in " + Math.round(d / 7) + " week" + (Math.round(d / 7) === 1 ? "" : "s");
}

/* =================================================== GUIDED EXPEDITIONS == */
function SPMETA() { return (typeof window !== "undefined" && window.__SEA_SPECIES_META__) ? window.__SEA_SPECIES_META__ : {}; }

var SEQUENCES = [
  { id: "seq-soil", track: "foundations", prompt: "Put the layers of soil in order, from the surface down.", items: ["O horizon (leaf litter)", "A horizon (topsoil)", "B horizon (subsoil)", "C horizon (weathered rock)", "Bedrock"], why: "Soil forms in layers: leaf litter on top, then dark topsoil, lighter subsoil, broken-up weathered rock, and solid bedrock at the bottom." },
  { id: "seq-water", track: "foundations", prompt: "Order the steps of the water cycle, starting with evaporation.", items: ["Evaporation", "Condensation", "Precipitation", "Runoff", "Collection"], why: "Water rises as vapor, cools into clouds, falls as rain or snow, runs off the land, and collects in rivers and lakes to begin again." },
  { id: "seq-trophic", track: "ecology", prompt: "Build a meadow food chain from the bottom up.", items: ["Sunlight", "Grass", "Grasshopper", "Shrew", "Hawk"], why: "Energy flows up the chain: sunlight feeds grass, grass feeds the grasshopper, which feeds a shrew, which feeds a hawk." },
  { id: "seq-classify", track: "fauna", prompt: "Order these life groups from the broadest one to the most specific.", items: ["Domain", "Kingdom", "Phylum", "Class", "Species"], why: "Scientists sort life from broad to specific: domain is the widest group, species is the most specific." },
  { id: "seq-tree", track: "flora", prompt: "Order the life of a tree, from start to old age.", items: ["Seed", "Seedling", "Sapling", "Mature tree", "Snag (standing dead wood)"], why: "A tree grows from a seed to a seedling, a sapling, and a mature tree — and even as a standing dead snag it still shelters wildlife." },
  { id: "seq-rockcycle", track: "geology", prompt: "Follow rock around the rock cycle, starting from molten magma.", items: ["Magma", "Igneous rock", "Sediment", "Sedimentary rock", "Metamorphic rock"], why: "Magma cools into igneous rock, which weathers into sediment, which hardens into sedimentary rock, which heat and pressure change into metamorphic rock — and it can all melt again." },
  { id: "seq-elev", track: "habitats", prompt: "Order these mountain life zones from the bottom up.", items: ["Lowland forest", "Foothills", "Montane forest", "Subalpine zone", "Alpine tundra"], why: "Climbing a mountain is like traveling toward the poles: forests give way to stunted trees, then open alpine tundra above the treeline." },
  { id: "seq-success", track: "conservation", prompt: "Put the stages of forest recovery in order, after bare ground is exposed.", items: ["Bare ground", "Mosses & lichens", "Grasses & weeds", "Shrubs & young trees", "Mature forest"], why: "After a disturbance, life returns in stages: pioneers like moss break in first, then grasses, shrubs, and finally a mature forest." },
  { id: "seq-watershed", track: "foundations", prompt: "Follow a raindrop from the hills to the sea.", items: ["Rain on the hills", "Soil and runoff", "Stream", "River", "Ocean"], why: "Water that falls on high ground runs off into streams, joins rivers, and flows at last to the sea \u2014 every drop travels downhill through its watershed." },
  { id: "seq-scale", track: "foundations", prompt: "Order these from the smallest area to the largest.", items: ["Microhabitat (under a log)", "Habitat", "Ecosystem", "Biome", "Biosphere"], why: "Nature nests at every scale: a spot under a log sits in a habitat, in an ecosystem, in a biome, within the whole living biosphere." },
  { id: "seq-pyramid", track: "ecology", prompt: "Order an energy pyramid from the most energy to the least.", items: ["Producers", "Herbivores", "Small carnivores", "Top predators"], why: "Only about a tenth of the energy passes up each level, so producers hold the most energy and top predators the least \u2014 which is why predators are rare." },
  { id: "seq-forestchain", track: "ecology", prompt: "Build a forest food chain from the bottom up.", items: ["Sunlight", "Oak leaves", "Caterpillar", "Songbird", "Hawk"], why: "Energy flows up: sunlight feeds the oak, leaves feed the caterpillar, which feeds a songbird, which feeds a hawk." },
  { id: "seq-pondchain", track: "ecology", prompt: "Build a pond food chain from the bottom up.", items: ["Sunlight", "Algae", "Tadpole", "Dragonfly nymph", "Largemouth bass"], why: "Sunlight grows algae, algae feeds a tadpole, a dragonfly nymph eats the tadpole, and a bass eats the nymph." },
  { id: "seq-decompose", track: "ecology", prompt: "Order how a fallen log returns to the soil.", items: ["Living tree", "Fallen log", "Fungi and insects move in", "Crumbling wood", "Rich soil"], why: "Decomposers slowly break a dead log down, recycling its nutrients back into the soil for new plants." },
  { id: "seq-flower", track: "flora", prompt: "Order how a flower becomes seeds.", items: ["Flower bud", "Open bloom", "Pollination", "Fruit forms", "Seeds spread"], why: "A bud opens, a pollinator carries pollen, the flower forms a fruit, and the fruit spreads the seeds." },
  { id: "seq-photosyn", track: "flora", prompt: "Order the steps of photosynthesis.", items: ["Sunlight is captured", "Carbon dioxide and water combine", "Sugar (food) is made", "Oxygen is released"], why: "A leaf captures sunlight, joins carbon dioxide and water into sugar, and releases oxygen as a by-product." },
  { id: "seq-forestlayers", track: "flora", prompt: "Order the layers of a forest from the ground up.", items: ["Forest floor", "Herb layer", "Shrub layer", "Understory", "Canopy"], why: "A forest is built in layers, from the leaf-litter floor up to the sunlit canopy, each home to different life." },
  { id: "seq-metamorph", track: "fauna", prompt: "Order a butterfly's life cycle.", items: ["Egg", "Caterpillar (larva)", "Chrysalis (pupa)", "Adult butterfly"], why: "A butterfly changes completely through metamorphosis: egg, caterpillar, chrysalis, and finally winged adult." },
  { id: "seq-frogcycle", track: "fauna", prompt: "Order a frog's life cycle.", items: ["Egg", "Tadpole", "Tadpole grows legs", "Froglet", "Adult frog"], why: "A frog hatches as a gilled tadpole, grows legs, becomes a froglet, and matures into an air-breathing adult." },
  { id: "seq-classdeer", track: "fauna", prompt: "Classify the white-tailed deer from broad to specific.", items: ["Animal (kingdom)", "Chordate (phylum)", "Mammal (class)", "Deer family", "White-tailed deer"], why: "Scientists sort life from broad to specific, narrowing from the animal kingdom all the way down to a single species." },
  { id: "seq-geotime", track: "geology", prompt: "Order these moments from oldest to most recent.", items: ["Earth forms", "First life appears", "Age of dinosaurs", "First humans", "Today"], why: "Across billions of years of geologic time, life arose, dinosaurs came and went, and humans appeared only very recently." },
  { id: "seq-cave", track: "geology", prompt: "Order how a limestone cave forms.", items: ["Limestone bedrock", "Acidic water seeps in", "Rock slowly dissolves", "A cave opens up", "Stalactites grow"], why: "Slightly acidic water dissolves limestone over ages, hollowing out caves where dripping minerals build stalactites." },
  { id: "seq-fossil", track: "geology", prompt: "Order how a fossil forms.", items: ["An animal dies", "Buried in sediment", "Minerals replace it", "Rock layers build above", "Erosion reveals it"], why: "Buried remains slowly turn to stone as minerals replace them, until erosion finally uncovers the fossil." },
  { id: "seq-river", track: "habitats", prompt: "Follow a river from its start to its end.", items: ["Mountain spring", "Small stream", "River", "Wide river", "Ocean"], why: "Rivers begin as tiny mountain trickles and grow as streams join, carrying water all the way to the sea." },
  { id: "seq-biomeswet", track: "habitats", prompt: "Order these biomes from the wettest to the driest.", items: ["Rainforest", "Deciduous forest", "Grassland", "Desert"], why: "Rainfall shapes biomes: lush rainforest needs the most water, grassland less, and desert the least." },
  { id: "seq-status", track: "conservation", prompt: "Order conservation status from safest to most at risk.", items: ["Least concern", "Vulnerable", "Endangered", "Critically endangered", "Extinct"], why: "Scientists rank species by risk, from least concern up to critically endangered \u2014 and, sadly, extinct." },
  { id: "seq-fire", track: "conservation", prompt: "Order a healthy fire cycle in a fire-adapted forest.", items: ["Dead brush builds up", "A fire passes through", "Nutrients return to soil", "New shoots sprout", "The forest regrows"], why: "Regular smaller fires clear brush and return nutrients to the soil, making room for fresh new growth." },
  { id: "seq-restore", track: "conservation", prompt: "Order the steps of restoring a damaged stream.", items: ["Stop the source of harm", "Remove invasive plants", "Replant native species", "Let wildlife return", "Monitor the recovery"], why: "Restoration first stops the damage, then rebuilds the habitat with native life and watches it recover." },
  { id: "seq-survey", track: "methods", prompt: "Order the steps of a wildlife survey.", items: ["Make a plan", "Walk the transect", "Record what you see", "Analyze the data", "Share the results"], why: "Field scientists plan, count along a set line, record carefully, study the numbers, and share what they learn." },
  { id: "seq-idflower", track: "methods", prompt: "Order how to identify a wildflower.", items: ["Look closely at the plant", "Note its color and shape", "Count the petals", "Check a field guide", "Confirm the name"], why: "A naturalist observes carefully, notes key features, and checks a field guide to name a plant with confidence." },
  { id: "seq-journal", track: "methods", prompt: "Order how to make a nature journal entry.", items: ["Pick a spot", "Note the date and weather", "Sketch what you see", "Write down questions", "Look for the answers"], why: "A good journal entry records where and when, captures what you see, and turns curiosity into questions to explore." }
];

function expeditionStops(trackId) {
  var units = buildUnits(); var out = [];
  for (var i = 0; i < units.length; i++) { if (units[i].track === trackId) out.push(units[i]); }
  return out;
}
function pathDone(state, trackId, stopId) {
  var p = state.paths && state.paths[trackId] && state.paths[trackId][stopId];
  return p && p.done === true;
}
function pathProg(state, trackId) {
  var stops = expeditionStops(trackId); var done = 0;
  for (var i = 0; i < stops.length; i++) { if (pathDone(state, trackId, stops[i].id)) done++; }
  return { done: done, total: stops.length };
}
function chLabel(kind) {
  if (kind === "mcq") return "Quick question";
  if (kind === "tf") return "True or false?";
  if (kind === "sort") return "Sort them out";
  if (kind === "match") return "Make the matches";
  if (kind === "sequence") return "Put them in order";
  if (kind === "pick") return "Tap the right one";
  return "Challenge";
}
function chXP(phase) { if (phase === "warmup") return 6; if (phase === "boss") return 14; return 9; }

/* ---- challenge builder (adapts to what each topic offers) ---- */
function groupByField(species, field) {
  var g = {};
  for (var i = 0; i < species.length; i++) { var v = species[i].m[field]; if (!v) continue; if (!g[v]) g[v] = []; g[v].push(species[i]); }
  return g;
}
function buildStopChallenges(stop) {
  var L = LESSONS(); var M = SPMETA();
  var lessons = []; var species = []; var terms = []; var seenTerm = {};
  for (var i = 0; i < stop.ids.length; i++) {
    var id = stop.ids[i]; var les = L[id]; if (!les) continue;
    lessons.push({ id: id, lesson: les });
    if (M[id]) species.push({ id: id, m: M[id] });
    var tt = les.terms || [];
    for (var j = 0; j < tt.length; j++) { var term = tt[j][0]; if (term && !seenTerm[term] && tt[j][1]) { seenTerm[term] = 1; terms.push({ a: term, b: tt[j][1] }); } }
  }
  var pool = [];
  // MCQ + TF straight from each lesson's quiz
  for (var k = 0; k < lessons.length; k++) {
    var q = lessons[k].lesson.quiz || []; var mc = null, tf = null;
    for (var m = 0; m < q.length; m++) { if (!mc && q[m].type === "mc") mc = q[m]; if (!tf && q[m].type === "tf") tf = q[m]; }
    if (mc) pool.push({ ch: { kind: "mcq", q: mc.q, choices: mc.choices, answer: mc.answer, why: mc.why }, level: 2 });
    if (tf) pool.push({ ch: { kind: "tf", q: tf.q, answer: tf.answer, why: tf.why }, level: 1 });
  }
  // PICK (tap the picture) — needs species across >=2 categories with art
  var byCat = groupByField(species, "cat");
  var catKeys = Object.keys(byCat);
  if (species.length >= 3 && catKeys.length >= 2) {
    var made = 0;
    var shuffledCats = shuffleArr(catKeys);
    for (var c = 0; c < shuffledCats.length && made < 2; c++) {
      var target = shuffledCats[c]; var right = byCat[target][0];
      var others = []; for (var d = 0; d < species.length; d++) { if (species[d].m.cat !== target) others.push(species[d]); }
      if (!right || others.length < 2) continue;
      var distract = shuffleArr(others).slice(0, 3);
      var opts = [{ text: right.m.name, art: right.m.art, correct: true }];
      for (var e = 0; e < distract.length; e++) opts.push({ text: distract[e].m.name, art: distract[e].m.art, correct: false });
      pool.push({ ch: { kind: "pick", prompt: "Which one is a " + target + "?", options: shuffleArr(opts), why: "The " + right.m.name.toLowerCase() + " is the " + target + " here." }, level: 2 });
      made++;
    }
  }
  // SORT — categorize by category, or by habitat if only one category
  // SORT — try category, then habitat, then diet; use the first that gives a clean puzzle
  var sortTry = [["cat", byCat], ["hab", groupByField(species, "hab")], ["diet", groupByField(species, "diet")]];
  for (var stI = 0; stI < sortTry.length; stI++) {
    var sf = sortTry[stI][0]; var sg = sortTry[stI][1]; var keys = Object.keys(sg);
    if (keys.length < 2) continue;
    var gk = shuffleArr(keys); var buckets = []; var items = [];
    for (var b2 = 0; b2 < gk.length && buckets.length < 3; b2++) {
      var grp = sg[gk[b2]]; var take = shuffleArr(grp).slice(0, 2);
      if (take.length >= 1) { var bi = buckets.length; buckets.push(gk[b2]); for (var f = 0; f < take.length; f++) items.push({ text: take[f].m.name, bucket: bi }); }
    }
    if (items.length >= 4 && buckets.length >= 2) {
      var sp2 = sf === "cat" ? "Sort each animal into its group." : (sf === "hab" ? "Sort each animal by where it lives." : "Sort each animal by what it eats.");
      var sw2 = "Each one belongs with its " + (sf === "cat" ? "animal group" : (sf === "hab" ? "home habitat" : "main food")) + ".";
      pool.push({ ch: { kind: "sort", prompt: sp2, buckets: buckets, items: shuffleArr(items), why: sw2 }, level: 3 });
      break;
    }
  }
  // MATCH — species to habitat (distinct habitats), else term to definition
  var distinctHab = {}; var habPairs = [];
  for (var h2 = 0; h2 < species.length; h2++) { var hv = species[h2].m.hab; if (hv && !distinctHab[hv]) { distinctHab[hv] = 1; habPairs.push({ a: species[h2].m.name, b: hv }); } }
  var distinctDiet = {}; var dietPairs = [];
  for (var h3 = 0; h3 < species.length; h3++) { var dv = species[h3].m.diet; if (dv && !distinctDiet[dv]) { distinctDiet[dv] = 1; dietPairs.push({ a: species[h3].m.name, b: dv }); } }
  if (habPairs.length >= 3) {
    pool.push({ ch: { kind: "match", prompt: "Match each animal to where it lives.", pairs: shuffleArr(habPairs).slice(0, 4), why: "Every animal is suited to its own home in the sea." }, level: 2 });
  } else if (dietPairs.length >= 3) {
    pool.push({ ch: { kind: "match", prompt: "Match each animal to what it eats.", pairs: shuffleArr(dietPairs).slice(0, 4), why: "Different animals have different favorite foods." }, level: 2 });
  } else if (terms.length >= 3) {
    pool.push({ ch: { kind: "match", prompt: "Match each word to what it means.", pairs: shuffleArr(terms).slice(0, 3), why: "Knowing the words makes the big ideas click." }, level: 2 });
  }
  // SEQUENCE — curated, matching this track
  for (var s2 = 0; s2 < SEQUENCES.length; s2++) {
    if (SEQUENCES[s2].track === stop.track) { var sq = SEQUENCES[s2]; pool.push({ ch: { kind: "sequence", prompt: sq.prompt, items: sq.items, why: sq.why }, level: 3 }); }
  }
  return pool;
}
function buildStopSteps(stop) {
  var pool = buildStopChallenges(stop);
  var byLevel = function (lv) { var o = []; for (var i = 0; i < pool.length; i++) { if (pool[i].level === lv && !pool[i]._used) o.push(pool[i]); } return o; };
  var takeKindAware = function (maxLevel, lastKind) {
    var cands = []; for (var i = 0; i < pool.length; i++) { if (!pool[i]._used && pool[i].level <= maxLevel) cands.push(pool[i]); }
    if (!cands.length) return null;
    var diff = []; for (var j = 0; j < cands.length; j++) { if (cands[j].ch.kind !== lastKind) diff.push(cands[j]); }
    var arr = diff.length ? diff : cands;
    var pickOne = shuffleArr(arr)[0]; pickOne._used = true; return pickOne;
  };
  var steps = []; steps.push({ type: "intro" });
  // warm-up: prefer a quick visual "tap the picture", else an easy true/false
  var pickCands = []; for (var pc = 0; pc < pool.length; pc++) { if (!pool[pc]._used && pool[pc].ch.kind === "pick") pickCands.push(pool[pc]); }
  var warmCands = pickCands.length ? pickCands : (byLevel(1).length ? byLevel(1) : byLevel(2));
  if (warmCands.length) { var w = shuffleArr(warmCands)[0]; w._used = true; steps.push({ type: "challenge", phase: "warmup", ch: w.ch }); }
  // core: each lesson, then a challenge (varied kinds)
  var lastKind = "";
  for (var i = 0; i < stop.ids.length; i++) {
    var L = LESSONS(); if (!L[stop.ids[i]]) continue;
    steps.push({ type: "learn", id: stop.ids[i] });
    var c = takeKindAware(2, lastKind);
    if (c) { steps.push({ type: "challenge", phase: "core", ch: c.ch }); lastKind = c.ch.kind; }
  }
  // challenge round: up to 3 of the toughest remaining
  var bossPool = []; for (var b = 0; b < pool.length; b++) { if (!pool[b]._used) bossPool.push(pool[b]); }
  bossPool.sort(function (x, y) { return y.level - x.level; });
  var bosses = bossPool.slice(0, 3);
  if (bosses.length) {
    steps.push({ type: "boss" });
    for (var k = 0; k < bosses.length; k++) { bosses[k]._used = true; steps.push({ type: "challenge", phase: "boss", ch: bosses[k].ch }); }
  }
  steps.push({ type: "done" });
  return steps;
}

/* ---- shared result panel ---- */
function ChResult(props) {
  var t = props.t;
  return h("div", null,
    h(MiniCard, { t: t, label: props.ok ? praiseWord(props.seed ? props.seed : 1) : tryAgainWord(props.seed ? props.seed : 1), color: props.ok ? t.green : t.amber, bg: props.ok ? t.greenDim : t.amberDim, border: props.ok ? t.green : t.amber, style: { marginTop: 14 } }, props.why ? props.why : (props.ok ? "Nice!" : "Not quite \u2014 take another look.")),
    h("div", { style: { marginTop: 14 } }, h(Btn, { t: t, kind: "go", block: true, icon: "play", onClick: props.onContinue }, "Continue"))
  );
}

/* ---- challenge components (all tap-based) ---- */
function ChMCQ(props) {
  var t = props.t; var ch = props.ch;
  var pickState = useState(null); var pick = pickState[0], setPick = pickState[1];
  var revState = useState(false); var reveal = revState[0], setReveal = revState[1];
  var ok = pick === ch.answer;
  var choiceEls = ch.choices.map(function (c, ci) {
    var bd = t.line, bg = t.panel;
    if (reveal) { if (ci === ch.answer) { bd = t.green; bg = t.greenDim; } else if (ci === pick) { bd = t.red; bg = t.redDim; } }
    else if (ci === pick) { bd = t.sky; bg = t.panelHi; }
    return h("button", { key: ci, onClick: reveal ? null : function () { setPick(ci); }, style: { display: "block", textAlign: "left", width: "100%", fontFamily: SANS, fontSize: 14.5, fontWeight: 600, padding: "12px 14px", marginBottom: 8, borderRadius: 12, border: "1.5px solid " + bd, background: bg, color: t.text, cursor: reveal ? "default" : "pointer" } }, c);
  });
  return h("div", null,
    h("h3", { style: { fontSize: 17, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 14px" } }, ch.q),
    choiceEls,
    reveal ? h(ChResult, { t: t, ok: ok, why: ch.why, seed: ch.answer + 2, onContinue: function () { props.onDone(ok); } })
      : h("div", { style: { marginTop: 6 } }, h(Btn, { t: t, kind: "primary", block: true, icon: "check", disabled: pick === null, onClick: function () { setReveal(true); } }, "Check answer"))
  );
}
function ChTF(props) {
  var t = props.t; var ch = props.ch;
  var pickState = useState(null); var pick = pickState[0], setPick = pickState[1];
  var revState = useState(false); var reveal = revState[0], setReveal = revState[1];
  var ok = pick === ch.answer;
  var opt = function (val, label) {
    var bd = t.line, bg = t.panel;
    if (reveal) { if (val === ch.answer) { bd = t.green; bg = t.greenDim; } else if (val === pick) { bd = t.red; bg = t.redDim; } }
    else if (val === pick) { bd = t.sky; bg = t.panelHi; }
    return h("button", { key: label, onClick: reveal ? null : function () { setPick(val); setReveal(true); }, style: { flex: 1, padding: "16px", borderRadius: 12, border: "1.5px solid " + bd, background: bg, color: t.text, fontSize: 16, fontWeight: 800, fontFamily: SANS, cursor: reveal ? "default" : "pointer" } }, label);
  };
  return h("div", null,
    h("h3", { style: { fontSize: 17, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 16px" } }, ch.q),
    h("div", { style: { display: "flex", gap: 10 } }, opt(true, "True"), opt(false, "False")),
    reveal ? h(ChResult, { t: t, ok: ok, why: ch.why, seed: 3, onContinue: function () { props.onDone(ok); } }) : null
  );
}
function ChPick(props) {
  var t = props.t; var ch = props.ch;
  var pickState = useState(null); var pick = pickState[0], setPick = pickState[1];
  var revState = useState(false); var reveal = revState[0], setReveal = revState[1];
  var ok = pick !== null && ch.options[pick].correct;
  var cards = ch.options.map(function (o, oi) {
    var bd = t.line;
    if (reveal) { if (o.correct) bd = t.green; else if (oi === pick) bd = t.red; }
    else if (oi === pick) bd = t.sky;
    return h("button", { key: oi, onClick: reveal ? null : function () { setPick(oi); }, style: { padding: 8, borderRadius: 14, border: "2px solid " + bd, background: oi === pick && !reveal ? t.panelHi : t.panel, cursor: reveal ? "default" : "pointer", fontFamily: SANS } },
      h(Illus, { name: o.art, ar: "16 / 10", radius: 9, style: { marginBottom: 6 } }),
      h("div", { style: { fontSize: 13, fontWeight: 700, color: t.text, textAlign: "center" } }, o.text));
  });
  return h("div", null,
    h("h3", { style: { fontSize: 17, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 14px" } }, ch.prompt),
    h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, cards),
    reveal ? h(ChResult, { t: t, ok: ok, why: ch.why, seed: 4, onContinue: function () { props.onDone(ok); } })
      : h("div", { style: { marginTop: 14 } }, h(Btn, { t: t, kind: "primary", block: true, icon: "check", disabled: pick === null, onClick: function () { setReveal(true); } }, "Check answer"))
  );
}
function ChSort(props) {
  var t = props.t; var ch = props.ch;
  var assignState = useState(function () { var a = []; for (var i = 0; i < ch.items.length; i++) a.push(null); return a; });
  var assign = assignState[0], setAssign = assignState[1];
  var revState = useState(false); var reveal = revState[0], setReveal = revState[1];
  var allSet = true; for (var z = 0; z < assign.length; z++) { if (assign[z] === null) allSet = false; }
  var okCount = 0; for (var z2 = 0; z2 < ch.items.length; z2++) { if (assign[z2] === ch.items[z2].bucket) okCount++; }
  var ok = okCount === ch.items.length;
  function setItem(i, b) { if (reveal) return; var a = assign.slice(); a[i] = b; setAssign(a); }
  var rows = ch.items.map(function (it, ii) {
    var correct = assign[ii] === it.bucket;
    var pills = ch.buckets.map(function (bl, bi) {
      var sel = assign[ii] === bi; var bd = t.line, bg = t.panel, col = t.textDim;
      if (sel && !reveal) { bd = t.sky; bg = t.panelHi; col = t.text; }
      if (reveal && sel) { if (correct) { bd = t.green; bg = t.greenDim; col = t.text; } else { bd = t.red; bg = t.redDim; col = t.text; } }
      return h("button", { key: bi, onClick: function () { setItem(ii, bi); }, style: { padding: "6px 10px", borderRadius: 9, border: "1.5px solid " + bd, background: bg, color: col, fontSize: 12, fontWeight: 700, fontFamily: SANS, cursor: reveal ? "default" : "pointer" } }, bl);
    });
    return h("div", { key: ii, style: { padding: "10px 12px", marginBottom: 8, borderRadius: 12, border: "1px solid " + t.line, background: t.panel } },
      h("div", { style: { fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 7 } }, it.text),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, pills),
      reveal && !correct ? h("div", { style: { fontSize: 11.5, color: t.green, marginTop: 6 } }, "\u2192 " + ch.buckets[it.bucket]) : null);
  });
  return h("div", null,
    h("h3", { style: { fontSize: 17, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 14px" } }, ch.prompt),
    rows,
    reveal ? h(ChResult, { t: t, ok: ok, why: (ok ? ch.why : "You sorted " + okCount + " of " + ch.items.length + " correctly. " + ch.why), seed: 5, onContinue: function () { props.onDone(ok); } })
      : h("div", { style: { marginTop: 6 } }, h(Btn, { t: t, kind: "primary", block: true, icon: "check", disabled: !allSet, onClick: function () { setReveal(true); } }, "Check answers"))
  );
}
function ChMatch(props) {
  var t = props.t; var ch = props.ch;
  var rightState = useState(function () { var arr = []; for (var i = 0; i < ch.pairs.length; i++) arr.push({ b: ch.pairs[i].b, idx: i }); return shuffleArr(arr); });
  var rightItems = rightState[0];
  var selState = useState(null); var sel = selState[0], setSel = selState[1];
  var solvedState = useState({}); var solved = solvedState[0], setSolved = solvedState[1];
  var flashState = useState(null); var flash = flashState[0], setFlash = flashState[1];
  var missState = useState(0); var miss = missState[0], setMiss = missState[1];
  var doneCount = Object.keys(solved).length; var complete = doneCount === ch.pairs.length;
  function tapLeft(i) { if (solved[i]) return; setSel(i); }
  function tapRight(pairIdx) {
    if (sel === null) return; if (solved[pairIdx]) return;
    if (pairIdx === sel) { var s = sx(solved, {}); s[sel] = true; setSolved(s); setSel(null); }
    else { setFlash(pairIdx); setMiss(miss + 1); setSel(null); setTimeout(function () { setFlash(null); }, 380); }
  }
  var ok = miss <= 1;
  var leftCol = ch.pairs.map(function (p, i) {
    var done = solved[i]; var on = sel === i;
    return h("button", { key: i, onClick: function () { tapLeft(i); }, disabled: done, style: { display: "block", width: "100%", textAlign: "left", padding: "11px 12px", marginBottom: 8, borderRadius: 11, border: "1.5px solid " + (done ? t.green : (on ? t.sky : t.line)), background: done ? t.greenDim : (on ? t.panelHi : t.panel), color: done ? t.textDim : t.text, fontSize: 13.5, fontWeight: 700, fontFamily: SANS, cursor: done ? "default" : "pointer" } }, p.a);
  });
  var rightCol = rightItems.map(function (r) {
    var done = solved[r.idx]; var bad = flash === r.idx;
    return h("button", { key: r.idx, onClick: function () { tapRight(r.idx); }, disabled: done, style: { display: "block", width: "100%", textAlign: "left", padding: "11px 12px", marginBottom: 8, borderRadius: 11, border: "1.5px solid " + (done ? t.green : (bad ? t.red : t.line)), background: done ? t.greenDim : (bad ? t.redDim : t.panel), color: done ? t.textDim : t.text, fontSize: 13.5, fontWeight: 600, fontFamily: SANS, cursor: done ? "default" : "pointer" } }, r.b);
  });
  return h("div", null,
    h("h3", { style: { fontSize: 17, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 6px" } }, ch.prompt),
    h("div", { style: { fontSize: 12, color: t.textFaint, margin: "0 0 12px" } }, "Tap one on the left, then its match on the right."),
    h("div", { style: { display: "flex", gap: 10 } }, h("div", { style: { flex: 1 } }, leftCol), h("div", { style: { flex: 1 } }, rightCol)),
    complete ? h(ChResult, { t: t, ok: ok, why: (ok ? ch.why : "Matched, with " + miss + " slip-ups. " + ch.why), seed: 6, onContinue: function () { props.onDone(ok); } }) : null
  );
}
function ChSequence(props) {
  var t = props.t; var ch = props.ch;
  var scrState = useState(function () { var arr = []; for (var i = 0; i < ch.items.length; i++) arr.push(i); return shuffleArr(arr); });
  var scrambled = scrState[0];
  var orderState = useState([]); var order = orderState[0], setOrder = orderState[1];
  var revState = useState(false); var reveal = revState[0], setReveal = revState[1];
  function tap(origIdx) { if (reveal) return; if (order.indexOf(origIdx) >= 0) return; setOrder(order.concat([origIdx])); }
  function clear() { if (reveal) return; setOrder([]); }
  var full = order.length === ch.items.length;
  var okCount = 0; for (var z = 0; z < order.length; z++) { if (order[z] === z) okCount++; }
  var ok = okCount === ch.items.length;
  var chosenRow = order.map(function (oi, pos) {
    var good = oi === pos; var bd = reveal ? (good ? t.green : t.red) : t.line; var bg = reveal ? (good ? t.greenDim : t.redDim) : t.panelHi;
    return h("div", { key: pos, style: { display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", marginBottom: 6, borderRadius: 10, border: "1.5px solid " + bd, background: bg } },
      h("span", { style: { width: 20, height: 20, flex: "0 0 auto", borderRadius: 6, background: t.sky, color: "#04222F", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" } }, "" + (pos + 1)),
      h("span", { style: { fontSize: 13.5, fontWeight: 700, color: t.text } }, ch.items[oi]));
  });
  var chips = scrambled.map(function (oi) {
    var used = order.indexOf(oi) >= 0;
    return h("button", { key: oi, onClick: function () { tap(oi); }, disabled: used, style: { padding: "9px 12px", borderRadius: 10, border: "1.5px solid " + (used ? t.line : t.sky), background: used ? t.panel : t.panelHi, color: used ? t.textFaint : t.text, fontSize: 13, fontWeight: 700, fontFamily: SANS, opacity: used ? 0.45 : 1, cursor: used ? "default" : "pointer" } }, ch.items[oi]);
  });
  return h("div", null,
    h("h3", { style: { fontSize: 17, fontWeight: 800, lineHeight: 1.4, color: t.text, margin: "0 0 6px" } }, ch.prompt),
    h("div", { style: { fontSize: 12, color: t.textFaint, margin: "0 0 12px" } }, "Tap them in order, top to bottom."),
    order.length ? h("div", { style: { marginBottom: 10 } }, chosenRow) : null,
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 } }, chips),
    !reveal && order.length ? h("button", { onClick: clear, style: { background: "none", border: "none", color: t.textDim, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "8px 0" } }, "Start over") : null,
    reveal ? h(ChResult, { t: t, ok: ok, why: (ok ? ch.why : "You placed " + okCount + " of " + ch.items.length + " correctly. " + ch.why), seed: 7, onContinue: function () { props.onDone(ok); } })
      : h("div", { style: { marginTop: 8 } }, h(Btn, { t: t, kind: "primary", block: true, icon: "check", disabled: !full, onClick: function () { setReveal(true); } }, "Check order"))
  );
}
function renderChallenge(t, ch, onDone) {
  if (ch.kind === "mcq") return h(ChMCQ, { t: t, ch: ch, onDone: onDone });
  if (ch.kind === "tf") return h(ChTF, { t: t, ch: ch, onDone: onDone });
  if (ch.kind === "pick") return h(ChPick, { t: t, ch: ch, onDone: onDone });
  if (ch.kind === "sort") return h(ChSort, { t: t, ch: ch, onDone: onDone });
  if (ch.kind === "match") return h(ChMatch, { t: t, ch: ch, onDone: onDone });
  if (ch.kind === "sequence") return h(ChSequence, { t: t, ch: ch, onDone: onDone });
  return h("div", null, "Challenge unavailable.");
}

/* ---- compact in-path lesson card ---- */
function PathLearn(props) {
  var t = props.t; var L = LESSONS(); var les = L[props.id]; if (!les) return h("div", null, "");
  var paras = (les.explain || []).slice(0, 2);
  var term = (les.terms && les.terms.length) ? les.terms[0] : null;
  return h("div", null,
    h("div", { style: { fontSize: 11.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: t.sky, marginBottom: 8 } }, "Learn"),
    les.art ? h(Illus, { name: les.art, ar: "16 / 9", radius: 14, style: { marginBottom: 12 } }) : null,
    h("h2", { style: { fontSize: 20, fontWeight: 900, color: t.text, margin: "0 0 10px" } }, les.title),
    paras.map(function (p, pi) { return h("p", { key: pi, style: { fontSize: 14.5, lineHeight: 1.6, color: t.textDim, margin: "0 0 10px" } }, p); }),
    term ? h("div", { style: { background: t.panelHi, border: "1px solid " + t.line, borderRadius: 12, padding: "10px 12px", marginTop: 4 } },
      h("span", { style: { fontSize: 13.5, fontWeight: 800, color: t.text } }, term[0] + ": "),
      h("span", { style: { fontSize: 13.5, color: t.textDim } }, term[1])) : null,
    h("div", { style: { marginTop: 16 } }, h(Btn, { t: t, kind: "go", block: true, icon: "play", onClick: props.onNext }, "Got it \u2014 keep going"))
  );
}

/* ---- the stop player (warm-up -> core -> challenge round) ---- */
function StopPlayer(props) {
  var t = props.t; var stop = props.stop;
  var stepsState = useState(function () { return buildStopSteps(stop); });
  var steps = stepsState[0];
  var iState = useState(0); var i = iState[0], setI = iState[1];
  var scState = useState({ done: 0, ok: 0, xp: 0 }); var sc = scState[0], setSc = scState[1];
  function advance() { if (i + 1 < steps.length) setI(i + 1); }
  if (!steps.length) { return h("div", { style: { padding: 24 } }, "Nothing here yet.", h(Btn, { t: t, kind: "soft", onClick: props.onExit }, "Back")); }
  var step = steps[i];
  var tc = trackColor(t, stop.track);
  function chDone(ok) { var add = ok ? chXP(step.phase) : Math.round(chXP(step.phase) / 3); setSc({ done: sc.done + 1, ok: sc.ok + (ok ? 1 : 0), xp: sc.xp + add }); advance(); }

  var topBar = h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "8px 16px 0" } },
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
      h("button", { onClick: props.onExit, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0" } }, h(Glyph, { name: "x", size: 18, color: t.textDim }), "Exit"),
      h("span", { style: { fontSize: 12.5, fontWeight: 800, color: t.textDim } }, stop.title)),
    h(Bar, { t: t, value: pct(i, steps.length - 1), color: tc, height: 6 }));

  var body;
  if (step.type === "intro") {
    body = h("div", { style: { textAlign: "center", padding: "20px 4px" } },
      h("div", { style: { display: "inline-flex", width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center", background: t.panelHi, marginBottom: 14 } }, h(Glyph, { name: "depth", size: 30, color: tc })),
      h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Expedition stop"),
      h("h1", { style: { fontSize: 23, fontWeight: 900, color: t.text, margin: "6px 0 8px" } }, stop.title),
      h("p", { style: { fontSize: 14, lineHeight: 1.6, color: t.textDim, maxWidth: 420, margin: "0 auto 8px" } }, stop.subtitle),
      h("p", { style: { fontSize: 12.5, color: t.textFaint, margin: "0 0 20px" } }, "A quick warm-up, then we learn together, then a challenge round."),
      h(Btn, { t: t, kind: "go", block: true, icon: "play", onClick: advance }, "Let's get started"));
  } else if (step.type === "learn") {
    body = h(PathLearn, { t: t, id: step.id, onNext: advance });
  } else if (step.type === "boss") {
    body = h("div", { style: { textAlign: "center", padding: "20px 4px" } },
      h("div", { style: { display: "inline-flex", width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center", background: t.panelHi, marginBottom: 14 } }, h(Glyph, { name: "flame", size: 28, color: t.amber })),
      h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.amber } }, "Challenge round"),
      h("h1", { style: { fontSize: 22, fontWeight: 900, color: t.text, margin: "6px 0 8px" } }, "Show what you've got!"),
      h("p", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.textDim, maxWidth: 400, margin: "0 auto 20px" } }, "A few tougher challenges that mix everything from this stop. Worth extra XP."),
      h(Btn, { t: t, kind: "go", block: true, icon: "flame", onClick: advance }, "Bring it on"));
  } else if (step.type === "challenge") {
    var phaseLabel = step.phase === "warmup" ? "Warm-up" : (step.phase === "boss" ? "Challenge round" : "Practice");
    var phaseColor = step.phase === "warmup" ? t.sky : (step.phase === "boss" ? t.amber : tc);
    body = h("div", null,
      h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 } },
        h("span", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: phaseColor, background: t.panelHi, border: "1px solid " + t.line, borderRadius: 20, padding: "3px 9px" } }, phaseLabel),
        h("span", { style: { fontSize: 11.5, fontWeight: 700, color: t.textFaint } }, chLabel(step.ch.kind))),
      renderChallenge(t, step.ch, chDone));
  } else {
    var score = sc.done ? Math.round(sc.ok * 100 / sc.done) : 100;
    var vColor = score >= 80 ? t.green : (score >= 50 ? t.amber : t.sky);
    body = h("div", { style: { textAlign: "center", padding: "16px 4px" } },
      h("div", { style: { display: "inline-flex", width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", background: t.panelHi, marginBottom: 12 } }, h(Glyph, { name: "star", size: 32, color: vColor })),
      h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: t.textFaint } }, "Stop complete"),
      h("h1", { style: { fontSize: 26, fontWeight: 900, color: vColor, margin: "6px 0 4px" } }, sc.ok + " / " + sc.done + " right"),
      h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 2 } }, "+" + sc.xp + " XP"),
      h("p", { style: { fontSize: 13.5, color: t.textDim, margin: "8px 0 20px" } }, score >= 80 ? "Outstanding work!" : (score >= 50 ? "Nice work \u2014 you're getting the hang of it!" : "Good effort \u2014 every lesson makes you stronger!")),
      h(Btn, { t: t, kind: "go", block: true, icon: "check", onClick: function () { props.onComplete({ trackId: stop.track, stopId: stop.id, ok: sc.ok, total: sc.done, xp: sc.xp, score: score }); } }, "Finish stop"));
  }
  return h("div", null, topBar, h("div", { style: { maxWidth: vpNow().readW, margin: "0 auto", padding: "18px 16px 44px" } }, body));
}

/* ---- expedition map (the stops in one track) ---- */
function ExpeditionScreen(props) {
  var t = props.t; var state = props.state; var trackId = props.trackId;
  var tr = trackById(trackId); var tc = trackColor(t, trackId);
  var stops = expeditionStops(trackId);
  var prog = pathProg(state, trackId);
  var firstOpen = -1;
  var rows = stops.map(function (s, si) {
    var done = pathDone(state, trackId, s.id);
    var unlocked = si === 0 || pathDone(state, trackId, stops[si - 1].id);
    if (unlocked && !done && firstOpen < 0) firstOpen = si;
    var isCurrent = unlocked && !done && firstOpen === si;
    var statusColor = done ? t.green : (unlocked ? tc : t.textFaint);
    return h(Card, { key: s.id, t: t, onClick: unlocked ? function () { props.onOpenStop(s); } : null, style: { marginBottom: 10, cursor: unlocked ? "pointer" : "default", opacity: unlocked ? 1 : 0.55, borderLeft: "3px solid " + statusColor } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { width: 34, height: 34, flex: "0 0 auto", borderRadius: 10, background: t.panelHi, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: done ? "check" : (unlocked ? "depth" : "lock"), size: 17, color: statusColor })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, s.title),
          h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 1 } }, s.subtitle)),
        isCurrent ? h("span", { style: { fontSize: 11, fontWeight: 800, color: tc, background: t.panelHi, borderRadius: 20, padding: "3px 9px" } }, "Start") : (done ? h("span", { style: { fontSize: 11, fontWeight: 700, color: t.green } }, "Done") : null)));
  });
  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 36px" } },
    h("button", { onClick: function () { props.onGo("paths"); }, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textDim, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 8 } }, h(Glyph, { name: "back", size: 18, color: t.textDim }), "All expeditions"),
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "2px 0 6px" } },
      h("div", { style: { width: 44, height: 44, flex: "0 0 auto", borderRadius: 12, background: tc, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: "depth", size: 22, color: "#04222F" })),
      h("div", null, h("div", { style: { fontSize: 21, fontWeight: 900, color: t.text } }, tr.label), h("div", { style: { fontSize: 12.5, color: t.textDim } }, prog.done + " of " + prog.total + " stops complete"))),
    h(Bar, { t: t, value: pct(prog.done, prog.total), color: tc, height: 7 }),
    prog.done === prog.total && prog.total > 0 ? h("div", { style: { textAlign: "center", fontSize: 13, fontWeight: 800, color: t.green, margin: "14px 0 2px" } }, "Expedition complete \u2014 amazing! \uD83C\uDF0A") : null,
    h("div", { style: { marginTop: 16 } }, rows));
}

/* ---- expeditions hub ---- */
function PathsScreen(props) {
  var t = props.t; var state = props.state;
  var cards = TRACKS.map(function (tr) {
    var tc = trackColor(t, tr.id); var prog = pathProg(state, tr.id);
    var started = prog.done > 0; var complete = prog.total > 0 && prog.done === prog.total;
    return h(Card, { key: tr.id, t: t, onClick: function () { props.onOpenExpedition(tr.id); }, style: { marginBottom: 12, cursor: "pointer", borderLeft: "3px solid " + tc } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 } },
        h("div", { style: { width: 40, height: 40, flex: "0 0 auto", borderRadius: 11, background: tc, display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: "depth", size: 20, color: "#04222F" })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, tr.label),
          h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 1 } }, tr.blurb)),
        h("span", { style: { fontSize: 11.5, fontWeight: 800, color: complete ? t.green : (started ? tc : t.textFaint) } }, complete ? "Done" : (started ? "Continue" : "Start"))),
      h(Bar, { t: t, value: pct(prog.done, prog.total), color: tc, height: 6 }),
      h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 6 } }, prog.done + " / " + prog.total + " stops"));
  });
  return h("div", { style: { maxWidth: vpNow().contentW, margin: "0 auto", padding: "10px 16px 36px" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, margin: "4px 0 4px" } }, h(Glyph, { name: "depth", size: 22, color: t.sky }), h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, "Expeditions")),
    h("p", { style: { fontSize: 13.5, lineHeight: 1.55, color: t.textDim, margin: "0 0 16px" } }, "Pick a topic and dive through it as a guided journey \u2014 short lessons and hands-on challenges that build up step by step. Each stop ends with a challenge round."),
    cards);
}

function App() {
  var initial = useMemo(function () { return mergeState(loadState()); }, []);
  var stateState = useState(initial);
  var state = stateState[0], setState = stateState[1];
  var viewState = useState(initial.onboarded ? "home" : "onboard");
  var view = viewState[0], setView = viewState[1];
  var lessonState = useState(null);
  var currentId = lessonState[0], setCurrentId = lessonState[1];
  var toastState = useState(null);
  var toast = toastState[0], setToast = toastState[1];
  var curTrackState = useState(null); var curTrack = curTrackState[0], setCurTrack = curTrackState[1];
  var curStopState = useState(null); var curStop = curStopState[0], setCurStop = curStopState[1];
  var reviewItemsState = useState([]); var reviewItems = reviewItemsState[0], setReviewItems = reviewItemsState[1];
  var reviewModeState = useState("due"); var reviewMode = reviewModeState[0], setReviewMode = reviewModeState[1];
  var badgeModalState = useState(null); var badgeModal = badgeModalState[0], setBadgeModal = badgeModalState[1];
  var vp = useViewport();
  ACTIVE_VP = vp;

  useEffect(function () { saveState(state); }, [state]);

  var themeName = state.settings && state.settings.theme ? state.settings.theme : "dark";
  var t = THEMES[themeName] ? THEMES[themeName] : THEMES.dark;
  t = sx(t, { persistent: safeStorage.persistent });

  function go(v) { setView(v); if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0); }
  function openLesson(id) { setCurrentId(id); setView("lesson"); if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0); }

  function finishOnboard(profile) {
    var s = cloneState(state);
    s.onboarded = true;
    s.profile.name = profile.name;
    s.profile.level = profile.level;
    s.profile.interests = profile.interests;
    s.profile.goal = profile.goal;
    setState(s);
    go("home");
  }
  function completeQuiz(result) {
    var s = cloneState(state);
    var L = LESSONS();
    var id = currentId;
    var lesson = L[id];
    if (!lesson) { go("learn"); return; }
    var prev = s.lessons[id] ? s.lessons[id] : { done: false, best: 0, attempts: 0 };
    var firstDone = !prev.done;
    var best = Math.max(prev.best ? prev.best : 0, result.score);
    s.lessons[id] = { done: true, best: best, attempts: (prev.attempts ? prev.attempts : 0) + 1 };
    var gained = firstDone ? (result.correct * 10 + (result.score >= 80 ? 15 : 0)) : Math.round(result.correct * 3);
    s.xp = (s.xp ? s.xp : 0) + gained;
    var missed = result.total - result.correct;
    if (missed > 0) s.weak[id] = missed; else { if (s.weak[id]) delete s.weak[id]; }
    if (!s.surveys) s.surveys = {};
    s.surveys[id] = result.survey;
    var today = todayStr();
    if (!s.srs) s.srs = {};
    var startBox = (result.score >= 80 && missed === 0) ? 2 : 1;
    var curBox = s.srs[id] ? s.srs[id].box : startBox;
    var nb = missed > 0 ? 1 : curBox;
    s.srs[id] = { box: nb, due: addDays(today, SRS_DAYS[nb]), last: today };
    if (!s.streak) s.streak = { last: "", days: 0 };
    if (s.streak.last !== today) {
      var d = dayDiff(s.streak.last, today);
      if (s.streak.last && d === 1) s.streak.days = (s.streak.days ? s.streak.days : 0) + 1;
      else s.streak.days = 1;
      s.streak.last = today;
    }
    if (!s.log) s.log = [];
    s.log.unshift({ t: new Date().toISOString(), kind: "lesson", label: lesson.title, score: result.score, xp: gained });
    if (s.log.length > 60) s.log = s.log.slice(0, 60);
    var earnedB = awardBadges(s);
    setState(s);
    setToast(praiseWord(s.xp) + "  +" + gained + " XP · " + lesson.title);
    setTimeout(function () { setToast(null); }, 2600);
    if (earnedB.length) setBadgeModal(earnedB);
    go("learn");
  }
  function saveAssessment(rec) {
    var s = cloneState(state);
    if (!s.assessments) s.assessments = [];
    s.assessments.unshift(rec);
    if (s.assessments.length > 12) s.assessments = s.assessments.slice(0, 12);
    setState(s);
  }
  function openExpedition(trackId) { setCurTrack(trackId); go("expedition"); }
  function openStop(stop) { setCurStop(stop); go("stop"); }
  function completeStop(rec) {
    var s = cloneState(state);
    if (!s.paths) s.paths = {};
    if (!s.paths[rec.trackId]) s.paths[rec.trackId] = {};
    var prev = s.paths[rec.trackId][rec.stopId];
    var firstTime = !(prev && prev.done);
    var best = (prev && prev.best && prev.best > rec.score) ? prev.best : rec.score;
    s.paths[rec.trackId][rec.stopId] = { done: true, best: best };
    var gained = firstTime ? rec.xp : Math.round(rec.xp / 3);
    s.xp = (s.xp ? s.xp : 0) + gained;
    if (!s.log) s.log = [];
    var label = (curStop && curStop.title) ? curStop.title : "stop";
    s.log.unshift({ t: new Date().toISOString(), kind: "stop", label: "Expedition: " + label, score: rec.score, xp: gained });
    if (s.log.length > 60) s.log = s.log.slice(0, 60);
    var earnedB = awardBadges(s);
    setState(s);
    setToast(praiseWord(s.xp) + "  +" + gained + " XP");
    setTimeout(function () { setToast(null); }, 2600);
    if (earnedB.length) setBadgeModal(earnedB);
    go("expedition");
  }
  function startReview() {
    var built = buildReviewItems(state);
    if (!built.items.length) { setToast("Finish a few lessons first!"); setTimeout(function () { setToast(null); }, 2200); return; }
    setReviewItems(built.items); setReviewMode(built.mode); go("review");
  }
  function gradeReview(id, ok) {
    var s = cloneState(state); if (!s.srs) s.srs = {}; var today = todayStr();
    var cur = s.srs[id] ? s.srs[id].box : 1;
    var nb = ok ? Math.min(5, cur + 1) : 1;
    s.srs[id] = { box: nb, due: addDays(today, SRS_DAYS[nb]), last: today };
    if (!s.weak) s.weak = {};
    if (ok) { if (s.weak[id]) delete s.weak[id]; } else { s.weak[id] = (s.weak[id] ? s.weak[id] : 0) + 1; }
    setState(s);
  }
  function finishReview(summary) {
    var s = cloneState(state); var today = todayStr();
    if (!s.streak) s.streak = { last: "", days: 0 };
    if (s.streak.last !== today) { var d = dayDiff(s.streak.last, today); if (s.streak.last && d === 1) s.streak.days = (s.streak.days ? s.streak.days : 0) + 1; else s.streak.days = 1; s.streak.last = today; }
    s.reviewsDone = (s.reviewsDone ? s.reviewsDone : 0) + 1;
    s.xp = (s.xp ? s.xp : 0) + (summary.xp ? summary.xp : 0);
    if (!s.log) s.log = [];
    s.log.unshift({ t: new Date().toISOString(), kind: "review", label: "Daily Trek review", score: summary.total ? Math.round(summary.correct * 100 / summary.total) : 0, xp: summary.xp ? summary.xp : 0 });
    if (s.log.length > 60) s.log = s.log.slice(0, 60);
    var earnedB = awardBadges(s);
    setState(s);
    setToast(praiseWord(s.xp) + "  +" + (summary.xp ? summary.xp : 0) + " XP");
    setTimeout(function () { setToast(null); }, 2600);
    if (earnedB.length) setBadgeModal(earnedB);
    go("practice");
  }
  function earnArcade(xp, tickets) {
    var s = cloneState(state);
    if (!s.arcade) s.arcade = { tickets: 0, xpToday: 0, day: "" };
    var today = todayStr();
    if (s.arcade.day !== today) { s.arcade.day = today; s.arcade.xpToday = 0; }
    var room = Math.max(0, ARCADE_XP_CAP - s.arcade.xpToday);
    var add = Math.min(room, xp);
    s.arcade.xpToday = s.arcade.xpToday + add;
    s.xp = (s.xp ? s.xp : 0) + add;
    s.arcade.tickets = (s.arcade.tickets ? s.arcade.tickets : 0) + tickets;
    var earnedB = awardBadges(s);
    setState(s);
    if (earnedB.length) setBadgeModal(earnedB);
  }
  function arcadeScore(id, score) {
    var s = cloneState(state);
    if (!s.arcade) s.arcade = { tickets: 0, xpToday: 0, day: "" };
    if (!s.arcade.scores) s.arcade.scores = {};
    var prev = s.arcade.scores[id] ? s.arcade.scores[id] : 0;
    if (score > prev) { s.arcade.scores[id] = score; setState(s); }
  }
  function patchProfile(patch) {
    var s = cloneState(state);
    for (var k in patch) { if (Object.prototype.hasOwnProperty.call(patch, k)) s.profile[k] = patch[k]; }
    setState(s);
    setToast("Saved");
    setTimeout(function () { setToast(null); }, 1500);
  }
  function toggleTheme() {
    var s = cloneState(state);
    s.settings.theme = (s.settings.theme === "dark") ? "light" : "dark";
    setState(s);
  }
  function resetAll() {
    var s = freshState();
    s.onboarded = true;
    s.profile = cloneState(state).profile;
    s.settings.theme = themeName;
    setState(s);
    go("home");
    setToast("Progress reset");
    setTimeout(function () { setToast(null); }, 1800);
  }

  var page = null;
  var showNav = true;
  if (view === "onboard") { page = h(Onboarding, { t: t, onDone: finishOnboard }); showNav = false; }
  else if (view === "home") page = h(HomeScreen, { t: t, state: state, onOpen: openLesson, onGo: go, onReview: startReview });
  else if (view === "learn") page = h(LearnScreen, { t: t, state: state, onOpen: openLesson });
  else if (view === "practice") page = h(PracticeScreen, { t: t, state: state, onOpen: openLesson, onReview: startReview });
  else if (view === "review") { if (reviewItems.length) { page = h(ReviewSession, { t: t, items: reviewItems, mode: reviewMode, onGrade: gradeReview, onFinish: finishReview, onExit: function () { go("practice"); } }); showNav = false; } else { page = h(PracticeScreen, { t: t, state: state, onOpen: openLesson, onReview: startReview }); } }
  else if (view === "arcade") page = h(ArcadeScreen, { t: t, state: state, onEarn: earnArcade, onScore: arcadeScore });
  else if (view === "library") page = h(LibraryScreen, { t: t });
  else if (view === "log") page = h(LogbookScreen, { t: t, state: state, onGo: go });
  else if (view === "badges") page = h(BadgesScreen, { t: t, state: state, onGo: go });
  else if (view === "profile") page = h(ProfileScreen, { t: t, state: state, onToggleTheme: toggleTheme, onReset: resetAll, onPatchProfile: patchProfile, onGo: go });
  else if (view === "teacher") { page = h(TeacherScreen, { t: t, state: state, onGo: go, onSaveAssessment: saveAssessment }); showNav = false; }
  else if (view === "paths") page = h(PathsScreen, { t: t, state: state, onOpenExpedition: openExpedition, onGo: go });
  else if (view === "expedition") { page = curTrack ? h(ExpeditionScreen, { t: t, state: state, trackId: curTrack, onOpenStop: openStop, onGo: go }) : h(PathsScreen, { t: t, state: state, onOpenExpedition: openExpedition, onGo: go }); }
  else if (view === "stop") { if (curStop) { page = h(StopPlayer, { t: t, state: state, stop: curStop, onExit: function () { go("expedition"); }, onComplete: completeStop }); showNav = false; } else { page = h(PathsScreen, { t: t, state: state, onOpenExpedition: openExpedition, onGo: go }); } }
  else if (view === "legal") page = h(LegalScreen, { t: t, onGo: go });
  else if (view === "lesson") {
    showNav = false;
    var L1 = LESSONS();
    var lesson1 = currentId ? L1[currentId] : null;
    if (!lesson1) { page = h("div", { style: { padding: 24 } }, "Lesson not found."); }
    else {
      var rec1 = state.lessons[currentId];
      page = h(LessonView, { t: t, lesson: lesson1, id: currentId, best: rec1 ? rec1.best : 0, done: rec1 && rec1.done, onBack: function () { go("learn"); }, onStart: function () { setView("quiz"); if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0); } });
    }
  }
  else if (view === "quiz") {
    showNav = false;
    var L2 = LESSONS();
    var lesson2 = currentId ? L2[currentId] : null;
    if (!lesson2) { page = h("div", { style: { padding: 24 } }, "Lesson not found."); }
    else page = h(QuizEngine, { t: t, lesson: lesson2, onComplete: completeQuiz, onExit: function () { setView("lesson"); } });
  }
  else page = h(HomeScreen, { t: t, state: state, onOpen: openLesson, onGo: go, onReview: startReview });

  var useRail = showNav && vp.desktop;
  var useBottom = showNav && !vp.desktop;
  return h("div", { style: { minHeight: "100vh", background: t.bg, color: t.text, fontFamily: SANS, paddingLeft: useRail ? vp.gutter : 0, paddingBottom: useBottom ? 72 : 0, transition: "padding .25s ease" } },
    useRail ? h(NavRail, { t: t, view: view, onGo: go }) : null,
    page,
    useBottom ? h(BottomNav, { t: t, view: view, onGo: go }) : null,
    toast ? h("div", { style: { position: "fixed", left: useRail ? "calc(50% + " + (vp.gutter / 2) + "px)" : "50%", transform: "translateX(-50%)", bottom: useBottom ? 84 : 28, zIndex: 1200, background: t.green, color: "#04241A", fontWeight: 800, fontSize: 13.5, padding: "10px 16px", borderRadius: 99, boxShadow: "0 10px 26px rgba(0,0,0,0.4)", maxWidth: "86%", textAlign: "center" } }, toast) : null,
    badgeModal ? h("div", { onClick: function () { setBadgeModal(null); }, style: { position: "fixed", left: 0, top: 0, right: 0, bottom: 0, background: "rgba(3,12,20,0.74)", zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
      h("div", { onClick: function (e) { e.stopPropagation(); }, style: { maxWidth: 340, width: "100%", background: t.panel, borderRadius: 20, border: "1px solid " + t.line, padding: "26px 22px", textAlign: "center", boxShadow: "0 24px 70px rgba(0,0,0,0.55)" } },
        h("div", { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: t.amber } }, badgeModal.length > 1 ? "Badges earned!" : "Badge earned!"),
        badgeModal.map(function (b) { return h("div", { key: b.id, style: { marginTop: 16 } },
          h("div", { style: { width: 66, height: 66, margin: "0 auto 10px", borderRadius: 18, background: t.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px rgba(0,0,0,0.3)" } }, h(Glyph, { name: b.icon, size: 32, color: "#04222F" })),
          h("div", { style: { fontSize: 20, fontWeight: 900, color: t.text } }, b.title),
          h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 3 } }, b.desc)); }),
        h("div", { style: { marginTop: 20 } }, h(Btn, { t: t, kind: "go", block: true, icon: "star", onClick: function () { setBadgeModal(null); } }, "Nice!")))) : null
  );
}

/* ================================ MOUNT ================================ */
(function () {
  if (typeof window !== "undefined" && window.__seaMountStarted) { return; }
  if (typeof window !== "undefined") { window.__seaMountStarted = true; }
  var mount = document.getElementById("root");
  if (!mount) { mount = document.createElement("div"); mount.id = "root"; document.body.appendChild(mount); }
  var RD = null;
  if (typeof ReactDOM !== "undefined") { RD = ReactDOM; }
  else if (typeof window !== "undefined" && window.ReactDOM) { RD = window.ReactDOM; }
  var RootApi = (RD && RD.createRoot) ? RD.createRoot : ((typeof React !== "undefined" && React.createRoot) ? React.createRoot : null);
  var LegacyRender = (RD && RD.render) ? RD.render : null;
  function showBootError() {
    var r = document.getElementById("root");
    if (r && r.children && r.children.length > 0) return;
    if (document.getElementById("sea-booterror")) return;
    var d = document.createElement("div");
    d.id = "sea-booterror";
    d.setAttribute("style", "font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:48px auto;padding:20px 22px;border:1px solid #1E4458;border-radius:14px;line-height:1.55;color:#E8F4F8;background:#0E2230");
    d.innerHTML = '<div style="font-weight:800;font-size:16px;margin-bottom:6px">Can’t start: ReactDOM was not found</div>This build expects React and ReactDOM to be available as globals before it runs.';
    document.body.appendChild(d);
  }
  function doRender() {
    if (RootApi) { RootApi(mount).render(h(App, null)); }
    else if (LegacyRender) { LegacyRender(h(App, null), mount); }
    else { showBootError(); }
  }
  var W = (typeof window !== "undefined") ? window : null;
  if (W && W.__seaDeferBoot) {
    W.__seaBoot = function () { if (W.__seaBooted) return; W.__seaBooted = true; doRender(); };
    if (typeof W.__seaReady === "function") W.__seaReady();
    setTimeout(function () {
      if (!W.__seaBooted) {
        W.__seaBoot();
        var bs = document.getElementById("sea-bootsplash");
        if (bs && bs.parentNode) bs.parentNode.removeChild(bs);
      }
    }, 45000);
  } else {
    doRender();
  }
})();
