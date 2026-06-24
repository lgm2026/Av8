// Static integrity + publishing-readiness scan. Parses the built HTML and the
// lesson data; checks name-leakage, alias, placeholders, meta tags, offline
// readiness, unit->lesson references, orphans, and per-lesson fields.
var fs = require("fs");
var JSDOM = require("jsdom").JSDOM;
var OUT = "/mnt/user-data/outputs/index.html";
var html = fs.readFileSync(OUT, "utf8");
var src = fs.readFileSync("/home/claude/sea/SeaHype.jsx", "utf8");

var pass = [],
  warn = [],
  fail = [];
function P(m) {
  pass.push(m);
}
function W(m) {
  warn.push(m);
}
function F(m) {
  fail.push(m);
}
function rx(pattern, flags) {
  return new RegExp(pattern, flags || "");
}
function has(s, pattern) {
  return rx(pattern, "i").test(s);
}
function count(s, pattern) {
  var m = s.match(rx(pattern, "gi"));
  return m ? m.length : 0;
}

// ---------- A. Head / meta ----------
var headChecks = [
  ["<html lang>", "<html[^>]*\\blang="],
  ["charset", "<meta[^>]*charset="],
  ["viewport", "name=[\"']viewport[\"']"],
  ["theme-color", "name=[\"']theme-color[\"']"],
  ["description", "name=[\"']description[\"']"],
  ["title tag", "<title>[^<]{3,}</title>"],
  ["apple-web-app-capable", "apple-mobile-web-app-capable"],
  ["og:title", "property=[\"']og:title[\"']"],
  ["twitter:card", "name=[\"']twitter:card[\"']"],
];
headChecks.forEach(function (c) {
  has(html, c[1])
    ? P("meta: " + c[0] + " present")
    : F("meta: " + c[0] + " MISSING");
});

// ---------- B. Offline readiness ----------
var scriptTags =
  html.match(rx("<script[^>]*\\ssrc=[\"'][^\"']+[\"']", "gi")) || [];
var extScript = scriptTags.filter(function (s) {
  return has(s, "src=[\"']https?:") || has(s, "src=[\"']//");
});
extScript.length === 0
  ? P("offline: no external <script src> (all JS inlined)")
  : F("offline: " + extScript.length + " external script(s)");
var linkTags = html.match(rx("<link[^>]*href=[\"'][^\"']+[\"']", "gi")) || [];
var extCss = linkTags.filter(function (s) {
  return (
    (has(s, "href=[\"']https?:") || has(s, "href=[\"']//")) &&
    has(s, "stylesheet|preload")
  );
});
extCss.length === 0
  ? P("offline: no external stylesheet/preload links")
  : W("offline: " + extCss.length + " external link(s)");
has(html, "React") && has(html, "ReactDOM")
  ? P("offline: React + ReactDOM inlined")
  : F("offline: React/ReactDOM not inline");
var imgHttp = count(html, "<img[^>]*src=[\"']https?:");
imgHttp === 0
  ? P("offline: no hardcoded remote <img> in markup")
  : W(
      "offline: " +
        imgHttp +
        " remote <img> in markup (should be runtime-only)",
    );

// ---------- C. Name leakage / alias / storage key ----------
var leaks = [
  ["pen name 'D.L. Burich'", "D\\.?\\s*L\\.?\\s*Burich"],
  ["surname 'Burich'", "Burich"],
  ["'Dustin'", "\\bDustin\\b"],
  ["wrong app key 'flightpath'", "flightpath"],
  ["other alias 'freeFlightDB'", "freeFlightDB"],
  ["'SharkToothify' leak", "sharktoothify"],
];
leaks.forEach(function (l) {
  var c = count(html, l[1]);
  c === 0 ? P("no leak: " + l[0]) : F("LEAK: " + l[0] + " x" + c);
});
var alias = count(html, "openMarineDB");
alias >= 1
  ? P("alias: 'openMarineDB' present (x" + alias + ")")
  : F("alias: 'openMarineDB' MISSING");
has(html, "seahype_marinebio_v1")
  ? P("storage key: 'seahype_marinebio_v1' present")
  : F("storage key MISSING");

// ---------- D. Placeholder / artifact scan: scoped to USER-VISIBLE content
// (lesson data + rendered DOM), done in the jsdom callback below — scanning the
// whole HTML would false-positive on the inlined React vendor bundle and on
// legitimate lowercase `placeholder=` input attributes.

// ---------- E. Roadmap unit ids (parse source) ----------
function roadmapUnits() {
  var units = [];
  var re = rx(
    '\\{\\s*id:\\s*"(u-[a-z0-9-]+)",[^}]*?ids:\\s*\\[([^\\]]*)\\]\\s*\\}',
    "g",
  );
  var m;
  while ((m = re.exec(src)) !== null) {
    var ids = m[2]
      .split(",")
      .map(function (s) {
        return s.trim().replace(/^["']|["']$/g, "");
      })
      .filter(Boolean);
    units.push({ unit: m[1], ids: ids });
  }
  return units;
}

// ---------- F. Lesson data (boot once) ----------
var dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://x.test/",
  beforeParse: function (win) {
    win.scrollTo = function () {};
    win.HTMLCanvasElement.prototype.getContext = function () {
      return null;
    };
    win.fetch = function () {
      return Promise.reject(new Error("x"));
    };
    win.matchMedia = function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
      };
    };
  },
});

setTimeout(function () {
  var L = dom.window.__SEA_LESSONS__ || {};
  var ids = Object.keys(L);
  ids.length >= 500
    ? P("lessons: " + ids.length + " loaded")
    : F("lessons: only " + ids.length);

  // ----- artifact scan over USER-VISIBLE content (lesson data + ref datasets) -----
  function collect(o, bag) {
    if (o == null) return;
    if (typeof o === "string") {
      bag.push(o);
      return;
    }
    if (Array.isArray(o)) {
      o.forEach(function (x) {
        collect(x, bag);
      });
      return;
    }
    if (typeof o === "object") {
      Object.keys(o).forEach(function (k) {
        collect(o[k], bag);
      });
    }
  }
  var bag = [];
  collect(L, bag);
  [
    "__SEA_GLOSSARY__",
    "__SEA_PRON__",
    "__SEA_TAXONOMY__",
    "__SEA_CONCEPTS__",
    "__SEA_CAREERS__",
    "__SEA_HISTORY__",
    "__SEA_MILESTONES__",
    "__SEA_SHELLS__",
    "__SEA_MARVELS__",
  ].forEach(function (g) {
    collect(dom.window[g], bag);
  });
  var visible = bag.join(" \u0001 ");
  var arts = [
    ["lorem ipsum", "lorem ipsum", "i"],
    ["TODO marker", "TODO:?", ""],
    ["FIXME", "FIXME", ""],
    ["PLACEHOLDER (caps)", "PLACEHOLDER|XXXX", ""],
    ["[object Object]", "\\[object Object\\]", "i"],
    ["literal 'undefined'", "undefined", "i"],
    ["literal 'NaN'", "\\bNaN\\b", ""],
    ["TBD marker", "\\bTBD\\b", ""],
    ["empty <> tag remnant", "<>", ""],
  ];
  arts.forEach(function (a) {
    var m = visible.match(new RegExp(a[1], "g" + (a[2] || "")));
    var c = m ? m.length : 0;
    c === 0
      ? P("content: no '" + a[0] + "' in " + bag.length + " strings")
      : F("CONTENT ARTIFACT: '" + a[0] + "' x" + c);
  });

  var noTitle = 0,
    noExplain = 0,
    noQuiz = 0,
    noSources = 0,
    emptyPara = 0;
  ids.forEach(function (id) {
    var l = L[id];
    if (!l.title) noTitle++;
    if (!l.explain || !l.explain.length) noExplain++;
    else if (
      l.explain.some(function (p) {
        return !p || !String(p).trim();
      })
    )
      emptyPara++;
    if (!l.quiz || !l.quiz.length) noQuiz++;
    if (!l.sources || !l.sources.length) noSources++;
  });
  [
    ["title", noTitle],
    ["explain", noExplain],
    ["quiz", noQuiz],
    ["sources", noSources],
    ["non-empty explain paragraphs", emptyPara],
  ].forEach(function (p) {
    p[1] === 0
      ? P("fields: every lesson has " + p[0])
      : F("fields: " + p[1] + " lesson(s) bad " + p[0]);
  });

  var units = roadmapUnits();
  var refd = {},
    broken = [];
  units.forEach(function (u) {
    u.ids.forEach(function (id) {
      refd[id] = 1;
      if (!L[id]) broken.push(u.unit + "->" + id);
    });
  });
  units.length >= 12
    ? P(
        "roadmap: " +
          units.length +
          " units parsed (" +
          Object.keys(refd).length +
          " refs)",
      )
    : W("roadmap: only " + units.length + " units parsed");
  broken.length === 0
    ? P("roadmap: all unit lesson refs resolve")
    : F(
        "roadmap: " +
          broken.length +
          " broken ref(s): " +
          broken.slice(0, 5).join(", "),
      );

  var seen = {},
    dup = [];
  units.forEach(function (u) {
    u.ids.forEach(function (id) {
      if (seen[id]) dup.push(id);
      seen[id] = 1;
    });
  });
  dup.length === 0
    ? P("roadmap: no duplicate lesson id across units")
    : W("roadmap: dup ids: " + dup.join(", "));

  var orphans = ids.filter(function (id) {
    return !refd[id];
  });
  P(
    "structure: " +
      (ids.length - orphans.length) +
      " core lessons in roadmap; " +
      orphans.length +
      " species/curriculum lessons via Library/Expeditions (by design)",
  );

  console.log("================ STATIC INTEGRITY SCAN ================\n");
  console.log("PASS (" + pass.length + "):");
  pass.forEach(function (m) {
    console.log("  + " + m);
  });
  if (warn.length) {
    console.log("\nWARN (" + warn.length + "):");
    warn.forEach(function (m) {
      console.log("  ~ " + m);
    });
  }
  if (fail.length) {
    console.log("\nFAIL (" + fail.length + "):");
    fail.forEach(function (m) {
      console.log("  X " + m);
    });
  }
  var bytes = Buffer.byteLength(html);
  console.log(
    "\nfile size: " +
      (bytes / 1048576).toFixed(2) +
      " MB (" +
      bytes.toLocaleString() +
      " bytes) — single self-contained file",
  );
  console.log(
    "\n================ RESULT: " +
      (fail.length === 0 ? "PASS" : fail.length + " ISSUE(S)") +
      " ================",
  );
  process.exit(0);
}, 700);
