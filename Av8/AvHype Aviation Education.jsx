
/* ============================================================================
   AvHype Aviation Education — a free, openly accessible flight-study website (operator alias: freeFlightDB)
   Single-file React (global React/ReactDOM + Babel-standalone harness).

   PARSER RULES (strict): no optional chaining, no nullish coalescing,
   no regex inside map/filter callbacks, function-syntax event handlers.

   DATA ARCHITECTURE: every lesson, quiz, ACS task, FAA source, certificate,
   rating, endorsement and progress item is a modular constant or keyed record
   so it can be updated/extended without touching the engine.

   PERSISTENCE: 100% local. safeStorage wraps localStorage and degrades to an
   in-memory store if storage is unavailable (e.g. sandboxed preview).

   COMPLIANCE: this is a study/preparation/tracking tool, NOT a substitute for
   FAA-required instruction, hours, medical, sign-offs, knowledge tests, or
   checkrides. The compliance banner is rendered on every certification screen.
   ========================================================================== */

const { useState, useEffect, useRef, useMemo } = React;

/* ---------------------------------------------------------------- storage -- */
var safeStorage = (function () {
  var mem = {};
  var ok = false;
  try {
    var k = "__fp_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    ok = true;
  } catch (e) {
    ok = false;
  }
  return {
    get: function (key) {
      try {
        if (ok) return window.localStorage.getItem(key);
      } catch (e) {}
      if (Object.prototype.hasOwnProperty.call(mem, key)) return mem[key];
      return null;
    },
    set: function (key, val) {
      try {
        if (ok) {
          window.localStorage.setItem(key, val);
          return;
        }
      } catch (e) {}
      mem[key] = val;
    },
    remove: function (key) {
      try {
        if (ok) window.localStorage.removeItem(key);
      } catch (e) {}
      delete mem[key];
    },
    persistent: ok
  };
})();

var STORE_KEY = "flightpath_academy_v1";

function loadState() {
  var raw = safeStorage.get(STORE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function saveState(state) {
  try {
    safeStorage.set(STORE_KEY, JSON.stringify(state));
  } catch (e) {}
}

/* ------------------------------------------------------------------ theme -- */
var THEMES = {
  dark: {
    name: "dark",
    bg: "#070E1C",
    bg2: "#0B1626",
    panel: "#0F1D31",
    panelHi: "#15263D",
    line: "#26405F",
    lineSoft: "#1A2C44",
    text: "#EAF1FB",
    textDim: "#9FB3C9",
    textFaint: "#5F7488",
    sky: "#2C6FE0",
    skyHi: "#4D86F2",
    ground: "#B5762E",
    magenta: "#2E9BDE",
    magentaDim: "#143A52",
    amber: "#F2B705",
    green: "#2FB67A",
    greenDim: "#16402F",
    red: "#E5564B",
    shadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  light: {
    name: "light",
    bg: "#EEF2FA",
    bg2: "#FFFFFF",
    panel: "#FFFFFF",
    panelHi: "#F3F7FD",
    line: "#DBE3F0",
    lineSoft: "#E9EFF8",
    text: "#0E2A5E",
    textDim: "#46586F",
    textFaint: "#8694A8",
    sky: "#1150C8",
    skyHi: "#0C42A8",
    ground: "#9A6326",
    magenta: "#1A7DC2",
    magentaDim: "#C8E1F2",
    amber: "#C98A00",
    green: "#1E8E5F",
    greenDim: "#CDE9DC",
    red: "#C0392B",
    shadow: "0 8px 22px rgba(14,42,94,0.14)"
  }
};

var MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace";
var SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif";

/* Display brand. Change in one place; the storage key (STORE_KEY) intentionally
   stays the same so existing progress is preserved across a rename. */
var BRAND = "AvHype Aviation Education";
var TAGLINE = "Bite-sized learning for future aviators";
var LOGO_FULL = (typeof window !== "undefined" && window.__AVHYPE_LOGO__) ? window.__AVHYPE_LOGO__ : "";
var LOGO_MARK = (typeof window !== "undefined" && window.__AVHYPE_MARK__) ? window.__AVHYPE_MARK__ : "";

/* small style-merge helper (avoids spreading falsy values) */
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
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
function clamp(n, lo, hi) {
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}
function uid() {
  return "id" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}
function pct(n) {
  return Math.round(n) + "%";
}

/* XP curve -> "Flight Level". Each level needs progressively more XP. */
function levelInfo(xp) {
  var lvl = 1;
  var need = 100;
  var base = 0;
  while (xp >= base + need) {
    base += need;
    lvl += 1;
    need = Math.round(need * 1.18);
  }
  var into = xp - base;
  return { level: lvl, into: into, need: need, pct: clamp((into / need) * 100, 0, 100) };
}

/* ---- The Hangar: each Flight Level milestone earns a notable aircraft ----
   A progression from a first paper airplane to Mach 2. Unlock levels are tuned
   so a learner who works through the curriculum collects most of the hangar,
   with the final few as long-term goals. */
var RANKS = [
  { id: "paper",    name: "Paper Airplane",   level: 1,  tag: "Every pilot starts here", tint: "sky" },
  { id: "balloon",  name: "Hot-Air Balloon",  level: 2,  tag: "Lighter than air",        tint: "amber" },
  { id: "wright",   name: "Wright Flyer",     level: 3,  tag: "Where it all began",      tint: "sky" },
  { id: "glider",   name: "Sailplane",        level: 4,  tag: "Silent soaring",          tint: "green" },
  { id: "cub",      name: "Piper Cub",        level: 5,  tag: "The classic taildragger", tint: "amber" },
  { id: "cessna",   name: "Cessna 172",       level: 6,  tag: "The world's trainer",     tint: "sky" },
  { id: "heli",     name: "Helicopter",       level: 8,  tag: "Rotary wing",             tint: "magenta" },
  { id: "biplane",  name: "Stearman Biplane", level: 10, tag: "Barnstormer",             tint: "red" },
  { id: "bizjet",   name: "Business Jet",     level: 12, tag: "Wheels up to the flight levels", tint: "green" },
  { id: "airliner", name: "Jumbo Jet",        level: 14, tag: "Long-haul heavy",         tint: "sky" },
  { id: "fighter",  name: "Fighter Jet",      level: 16, tag: "Afterburner",             tint: "magenta" },
  { id: "concorde", name: "Concorde",         level: 18, tag: "Mach 2",                  tint: "amber" }
];
function rankIndexForLevel(level) {
  var idx = 0;
  for (var i = 0; i < RANKS.length; i++) { if (level >= RANKS[i].level) idx = i; }
  return idx;
}
function rankForLevel(level) { return RANKS[rankIndexForLevel(level)]; }
function nextRank(level) {
  for (var i = 0; i < RANKS.length; i++) { if (RANKS[i].level > level) return RANKS[i]; }
  return null;
}

/* Distinct flat silhouette for each hangar aircraft. Pure presentational SVG;
   color is supplied by the caller so locked badges can render greyed. */
function AircraftArt(props) {
  var c = props.color || "#8aa0b2";
  var size = props.size || 48;
  var id = props.id;
  function P(d) { return h("path", { d: d, fill: c }); }
  function L(d, w) { return h("path", { d: d, stroke: c, strokeWidth: w || 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }); }
  function R(x, y, w, hh, r) { return h("rect", { x: x, y: y, width: w, height: hh, rx: (r === undefined ? 1 : r), fill: c }); }
  function C(cx, cy, r) { return h("circle", { cx: cx, cy: cy, r: r, fill: c }); }
  var kids;
  if (id === "paper") {
    kids = [P("M61 20 L8 9 L29 20 L8 31 Z")];
  } else if (id === "balloon") {
    kids = [
      P("M32 3 C19 3 13 13 16 22 C17.5 26.5 23 30 32 30 C41 30 46.5 26.5 48 22 C51 13 45 3 32 3 Z"),
      R(28.5, 33, 7, 5, 1.2),
      L("M21.5 27 L29 33", 1.4), L("M42.5 27 L35 33", 1.4)
    ];
  } else if (id === "wright") {
    kids = [
      R(7, 11.5, 50, 3, 1.5), R(7, 25, 50, 3, 1.5),
      R(11, 13, 2.2, 13, 0.6), R(31, 13, 2.2, 13, 0.6), R(50.8, 13, 2.2, 13, 0.6),
      R(21, 6, 22, 2.4, 1), R(25, 7, 1.6, 5, 0.5), R(38, 7, 1.6, 5, 0.5)
    ];
  } else if (id === "glider") {
    kids = [
      P("M32 4 C30 4 29 7 29 12 L29 30 C29 34 30 36 32 36 C34 36 35 34 35 30 L35 12 C35 7 34 4 32 4 Z"),
      P("M3 18 L61 18 L60 20.6 L4 20.6 Z"),
      P("M24 30.5 L40 30.5 L40 33 L24 33 Z")
    ];
  } else if (id === "cub") {
    kids = [
      P("M9 21 C9 18 12 17 17 17 L45 17.5 L54 20 L54 21.2 L20 23 C12 23 9 23 9 21 Z"),
      R(14, 10.5, 30, 3, 1), L("M21 13.5 L19 17", 1.3), L("M37 13.5 L40 17", 1.3), R(27.5, 13, 3, 4.5, 0.6),
      P("M50 11 L56.5 19 L50 19 Z"),
      C(24, 26, 3), L("M24 23 L24 24.5", 1.4), L("M21.5 25 L26.5 25", 1.4), C(52, 24, 1.5)
    ];
  } else if (id === "cessna") {
    kids = [
      C(32, 5.5, 2),
      P("M32 5 C30 5 29 9 29 13 L29 28 C29 33 30 35 32 35 C34 35 35 33 35 28 L35 13 C35 9 34 5 32 5 Z"),
      P("M6 14 L58 14 L58 18 L6 18 Z"),
      P("M19 29 L45 29 L45 32 L19 32 Z")
    ];
  } else if (id === "heli") {
    kids = [
      R(5, 13, 50, 2.6, 1.3), R(28, 15, 3, 6, 0.6), C(29.5, 13.6, 2),
      P("M14 22 C10 22 8 25 9 28 C10.5 31 17 32.5 25 32.5 L41 32.5 C45 32.5 47.5 30.5 46.5 27.5 L43.5 22 C41.5 20 38 20 32 20 L21 20 C18 20 15.5 21 14 22 Z"),
      P("M44 25 L60 27 L60 28.8 L44 28.8 Z"),
      P("M58 21.5 L62.5 30 L57 28 Z"),
      R(15, 34, 30, 1.8, 0.9), L("M20 32.5 L18 35", 1.5), L("M40 32.5 L42 35", 1.5)
    ];
  } else if (id === "biplane") {
    kids = [
      C(11, 19, 3.4),
      P("M10 20 C10 17.5 13 16.5 17 16.5 L45 17.5 L52 19.5 L52 21 L19 22 C13 22 10 22 10 20 Z"),
      R(10, 9, 40, 3, 1.2), R(15, 22.5, 33, 3, 1.2),
      L("M20 12 L20 22.5", 1.3), L("M40 12 L40 23", 1.3), L("M28 12 L28 16", 1.2), L("M32 12 L32 16", 1.2),
      P("M47 11.5 L53.5 19 L47 19 Z"), R(45, 18, 9, 2, 0.8),
      C(22, 25, 3), C(50, 23, 1.4)
    ];
  } else if (id === "bizjet") {
    kids = [
      P("M5 20 C5 18 9 17 14 17 L48 17 C54 17 59 18.5 62 20 C59 21.5 54 23 48 23 L14 23 C9 23 5 22 5 20 Z"),
      P("M35 22 L22 30.5 L29.5 30.5 L42 23 Z"),
      P("M51 18 L57 9 L59 9 L55 18 Z"), R(49, 8, 14, 2.2, 1),
      h("ellipse", { cx: 49.5, cy: 20, rx: 4.2, ry: 2.6, fill: c })
    ];
  } else if (id === "airliner") {
    kids = [
      P("M32 3 C30 3 28.5 6 28.5 11 L28.5 31 C28.5 35 30 37.5 32 37.5 C34 37.5 35.5 35 35.5 31 L35.5 11 C35.5 6 34 3 32 3 Z"),
      P("M30 16.5 L5 27 L5 29 L30 21 Z"), P("M34 16.5 L59 27 L59 29 L34 21 Z"),
      R(13.5, 23, 4, 3.2, 1), R(46.5, 23, 4, 3.2, 1),
      P("M31 30 L20 35.5 L20 36.8 L31 33 Z"), P("M33 30 L44 35.5 L44 36.8 L33 33 Z")
    ];
  } else if (id === "fighter") {
    kids = [
      P("M32 2 L29.2 12 L29.2 30 L31 37 L33 37 L34.8 30 L34.8 12 Z"),
      P("M30 16 L9 30 L13.5 30 L31 22 Z"), P("M34 16 L55 30 L50.5 30 L33 22 Z"),
      P("M30.2 30 L25 37 L27 37 L31.2 33 Z"), P("M33.8 30 L39 37 L37 37 L32.8 33 Z")
    ];
  } else if (id === "concorde") {
    kids = [
      P("M3 23.2 L13 20.5 L50 18 C56 18 60 19 62.5 20 C60 21 56 22 50 22 L14 23.4 C9 23.6 5 23.6 3 23.2 Z"),
      P("M23 22 L19 31 L46 31 L40.5 22 Z"),
      P("M52 11.5 L57.5 18 L52 18 Z")
    ];
  } else {
    kids = [C(32, 20, 8)];
  }
  var svgProps = { width: size, height: Math.round(size * 40 / 64), viewBox: "0 0 64 40", style: { display: "block" }, "aria-hidden": "true" };
  return h.apply(null, ["svg", svgProps].concat(kids));
}

/* normalize a fill-in answer for comparison without regex */
function normAnswer(s) {
  s = ("" + s).toLowerCase().trim();
  var out = "";
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    var code = c.charCodeAt(0);
    var isNum = code >= 48 && code <= 57;
    var isLow = code >= 97 && code <= 122;
    if (isNum || isLow) out += c;
  }
  return out;
}

/* --------------------------------------------------------- compliance text - */
var COMPLIANCE_TEXT =
  "This website is an educational and training-support tool. FAA certificates, ratings, " +
  "endorsements, medical certification, flight time, instructor sign-offs, knowledge tests, " +
  "and practical tests must be completed through authorized FAA processes, certificated " +
  "instructors, approved testing providers, and designated pilot examiners where required.";

/* ============================ legal / policy documents ============================
   Plain-English, comprehensive notices for a free, independent educational app.
   Owner/effective-date/contact are centralized so they are easy to update.
   ========================================================================== */
var LEGAL_OWNER = "freeFlightDB";
var LEGAL_YEAR = "2026";
var LEGAL_EFFECTIVE = "June 14, 2026";
var LEGAL_COPYRIGHT = "\u00A9 " + LEGAL_YEAR + " " + LEGAL_OWNER + ". All rights reserved.";

var TERMS_DOC = [
  { h: "1. Acceptance of these Terms", p: [
    "These Terms of Use (\u201CTerms\u201D) govern your access to and use of " + BRAND + " (the \u201CWebsite\u201D), a free, independent flight-study website operated under the name " + LEGAL_OWNER + " (\u201Cwe,\u201D \u201Cus,\u201D or the \u201Coperator\u201D). By accessing or using the Website, you agree to these Terms. If you do not agree, please do not use the Website." ] },
  { h: "2. What the Website is \u2014 and is not", p: [
    BRAND + " is a free, openly accessible educational study resource for people learning about aviation and preparing to study FAA subject matter. It is not a flight school, not a certificated training provider, and not affiliated with, endorsed by, or sponsored by the Federal Aviation Administration (FAA) or any government agency.",
    "The Website does not provide flight or ground instruction within the meaning of the federal aviation regulations; does not issue or substitute for any certificate, rating, endorsement, logbook entry, knowledge-test result, or medical certificate; and does not authorize you to operate any aircraft. All airman certification must be completed through authorized FAA processes, certificated instructors, approved testing providers, and designated examiners where required." ] },
  { h: "3. Eligibility and younger users", p: [
    "The Website is intended for a general audience and may be used by learners of varying ages. It is free to use, does not require an account, and does not knowingly collect personal information (see the Privacy & Data notice). If you are a minor, you should use the Website with the involvement of a parent, guardian, or teacher, and your use is subject to their agreement to these Terms.",
    "Nothing on the Website authorizes anyone, of any age, to operate an aircraft. Real flight activity is governed entirely by the FAA and by a certificated instructor." ] },
  { h: "4. Not professional, legal, or instructional advice", p: [
    "The content on the Website \u2014 including lessons, summaries, quiz questions, the glossary, reference material, and any milestones or transcripts \u2014 is general educational information for self-study. It is not flight instruction, legal advice, medical advice, or professional advice, and it is not a substitute for a certificated flight instructor or for current, official FAA publications.",
    "Aviation regulations, procedures, weather products, and standards change. Before relying on any information for a real flight or a real test, verify it against current FAA sources and confirm it with a certificated instructor." ] },
  { h: "5. Accuracy and \u201Cas-is\u201D content", p: [
    "We work to keep the Website accurate and current, but we do not warrant that it is complete, error-free, or up to date. Original quiz questions are written for study and are not drawn from any official FAA test bank; performing well on the Website's quizzes does not indicate that you will pass any official test.",
    "The Website may host or summarize public-domain U.S. Government material and may link to third-party websites. We are not responsible for the content, accuracy, or availability of third-party material." ] },
  { h: "6. Your responsibilities", p: [
    "You agree to use the Website lawfully and for personal, non-commercial study; to independently verify any information before acting on it; never to rely on the Website as the sole basis for a real-world aeronautical decision; and not to misuse, disrupt, copy, scrape, reverse engineer, or create derivative works from the Website except as permitted by law or by the Copyright notice." ] },
  { h: "7. Your data stays in your browser", p: [
    "The Website saves your progress \u2014 such as completed lessons, scores, surveys, logbook entries, and settings \u2014 locally in your own browser. It does not create an account or transmit this information to the operator. You can erase it at any time using \u201CReset all data\u201D on the Website or by clearing your browser storage. See the Privacy & Data notice for details." ] },
  { h: "8. Intellectual property", p: [
    "The Website's original content, design, code, and brand are protected by copyright and trademark law and remain the property of the operator or its licensors. Public-domain U.S. Government works are not claimed. Your use of the Website does not transfer any ownership. Please review the Copyright and Trademark notices." ] },
  { h: "9. Disclaimer of warranties", p: [
    "THE WEBSITE IS PROVIDED \u201CAS IS\u201D AND \u201CAS AVAILABLE,\u201D WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT, TO THE FULLEST EXTENT PERMITTED BY LAW." ] },
  { h: "10. Limitation of liability", p: [
    "TO THE FULLEST EXTENT PERMITTED BY LAW, THE OPERATOR WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, OR FOR ANY LOSS ARISING FROM YOUR USE OF OR RELIANCE ON THE WEBSITE, INCLUDING ANY DECISION RELATED TO FLIGHT OR TRAINING. THE WEBSITE IS A FREE STUDY RESOURCE, AND YOU USE IT AT YOUR OWN RISK.",
    "Because the Website is provided free of charge, nothing in these Terms requires the operator to provide support, updates, or continued availability." ] },
  { h: "11. Changes to the Website and these Terms", p: [
    "We may update, change, or discontinue the Website or these Terms at any time. Changes take effect when the updated Website or Terms are made available, and the \u201CEffective\u201D date above will be revised. Your continued use after a change means you accept the updated Terms." ] },
  { h: "12. Governing law", p: [
    "These Terms are governed by the laws of the United States and of the jurisdiction in which the Website's operator is established, without regard to conflict-of-laws rules, except where a mandatory consumer-protection law of your own jurisdiction applies." ] },
  { h: "13. Contact", p: [
    "Questions about these Terms may be directed to the operator through the contact channel provided on the Website." ] }
];

var COPYRIGHT_DOC = [
  { h: "Copyright", p: [
    LEGAL_COPYRIGHT,
    "Except for material in the public domain, all content on " + BRAND + " (the \u201CWebsite\u201D) is the original work of the operator, or is used with permission, and is protected by United States and international copyright law." ] },
  { h: "What is protected", p: [
    "Protected material includes, without limitation: the original instructional writing and lesson text; the selection, sequence, and arrangement of the curriculum; the original quiz questions, answers, and explanations; the glossary entries and definitions; the Website's source code; the user-interface and visual design; original graphics and icons; and the Website as a whole compilation." ] },
  { h: "U.S. Government material is not claimed", p: [
    "Works of the U.S. Government \u2014 including FAA handbooks, the Aeronautical Information Manual (AIM), the Airman Certification Standards (ACS), and the regulations in Title 14 of the Code of Federal Regulations \u2014 are in the public domain under 17 U.S.C. \u00A7 105 and are not copyrighted by the operator. The Website references, links to, and summarizes such material for educational purposes only.",
    "Original summaries and explanations of public-domain material that were written for the Website are themselves original works and are protected." ] },
  { h: "Third-party material", p: [
    "Any third-party names, marks, products, or materials referenced on the Website remain the property of their respective owners and are used for identification, commentary, or education. See the Trademark notice." ] },
  { h: "What you may do", p: [
    "You may use the Website for personal, non-commercial study. You may keep notes and use material you export for your own records, such as your training transcript or logbook." ] },
  { h: "What you may not do", p: [
    "Without the operator's prior written permission, you may not copy, reproduce, republish, distribute, sell, sublicense, publicly display, modify, translate, reverse engineer, or create derivative works from the Website's original content, in whole or in part; remove or alter any copyright, trademark, or other proprietary notice; or use the Website's content to build or train a competing product or dataset." ] },
  { h: "Reporting claimed infringement", p: [
    "We respect the intellectual property of others and ask the same in return. If you believe content on the Website infringes your copyright, please use the contact channel provided on the Website to send a description of the work, where it appears on the Website, your contact information, and a statement of your good-faith belief that the use is unauthorized, so we can review it and, where appropriate, remove the material." ] }
];

var TRADEMARK_DOC = [
  { h: "Our marks", p: [
    "\u201CAvHype,\u201D \u201C" + BRAND + ",\u201D and the Website's logo and related names and designs are trademarks and service marks associated with the Website (the \u201CMarks\u201D), whether or not designated with a \u2122 symbol. The Marks may not be used without prior written permission, including in any manner likely to cause confusion or that disparages the Website.",
    "Unless otherwise noted, the Marks are claimed as common-law trademarks and may not be federally registered." ] },
  { h: "FAA and government names", p: [
    "\u201CFAA\u201D and \u201CFederal Aviation Administration,\u201D and the names of other agencies such as the NTSB and TSA, are used only to identify and describe the subject matter for educational purposes. " + BRAND + " is independent and is not affiliated with, endorsed by, sponsored by, or authorized by the FAA or any government agency. The Website does not use the FAA seal, logo, or other official insignia, and nothing on the Website should be read as an official government communication." ] },
  { h: "Aircraft and manufacturer names", p: [
    "Aircraft model and manufacturer names that may appear on the Website (for example, in the aircraft reference or the on-site hangar) are the trademarks of their respective owners. They are used nominatively, to identify and describe the aircraft for education. No affiliation, sponsorship, or endorsement is implied." ] },
  { h: "Third-party products and study materials", p: [
    "Names of third-party books, courses, apps, or other study products mentioned on the Website are the trademarks of their respective owners. Any mention is for the user's convenience and information only; it is not an endorsement, and the operator does not host, sell, or include those products' content without a license." ] },
  { h: "Nominative fair use", p: [
    "Where third-party trademarks are referenced, they are used only as reasonably necessary to identify the relevant product, organization, or subject, and not to suggest any relationship with the trademark owner. All trademarks remain the property of their respective owners." ] }
];

var PRIVACY_DOC = [
  { h: "Summary", p: [
    BRAND + " is built to respect your privacy. It is free, does not require an account, and your study data stays in your own browser. The operator does not build third-party advertising or tracking into the Website." ] },
  { h: "What is stored, and where", p: [
    "When you use the Website, information such as your chosen name or nickname, selected pathways and goals, completed lessons, quiz scores, confidence surveys, streaks and progress, logbook and training-record entries, and your settings is saved locally in your browser's storage (for example, localStorage). This information stays on your device and is not transmitted to the operator or to any server by the Website.",
    "Because the data is local, it is generally accessible only in the browser where you entered it, and it may be lost if you clear your browser data or use a different device or browser." ] },
  { h: "What we do not collect", p: [
    "The operator does not run an account system for the Website, does not request sensitive personal information, and does not collect, sell, or share your study data. The Website is designed to function without sending your personal information anywhere." ] },
  { h: "Your control", p: [
    "You are in control of your data. You can erase all of it at any time using \u201CReset all data\u201D in the Website's settings, or by clearing your browser's storage for the Website. Doing so permanently removes your saved progress." ] },
  { h: "Optional features you initiate", p: [
    "If the Website offers a feature that reaches an outside service \u2014 for example, opening an official FAA or weather website through a link \u2014 that interaction is governed by the privacy practices of that outside service, not by the operator. Use of any such feature is at your discretion." ] },
  { h: "Children's privacy", p: [
    "Because the Website does not collect personal information or require an account, it is suitable for a general audience. We do not knowingly gather personal information from children. A parent, guardian, or teacher should supervise a child's use, and any information a child chooses to enter (such as a first name) remains only in the browser." ] },
  { h: "Hosting and access", p: [
    "The Website may be served through a hosting provider or content-delivery network that can process basic technical data (such as your IP address and browser type) in order to deliver the site, under that provider's own privacy practices. This is standard for websites, is separate from this notice, and is outside the operator's direct control." ] },
  { h: "Changes", p: [
    "This notice may be updated as the Website evolves; the \u201CEffective\u201D date above will reflect the latest version." ] }
];

/* ----------------------------------------------------------- FAA sources --- */
/* tier: "host" = public-domain FAA, embeddable/linkable; "link" = link only;
   "paid" = optional commercial, recommendation only (never hosted w/o license). */
var EXTERNAL_LINKS = {
  faaHandbooksIndex:
    "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation",
  phak: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak",
  afh: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook",
  hfh: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook",
  ifh: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_flying_handbook",
  iph: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_procedures_handbook",
  aih: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/aviation_instructors_handbook",
  rmh: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/risk_management_handbook",
  wbh: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/weight_balance_handbook",
  suasStudy:
    "https://www.faa.gov/uas/resources/policy_library/#remote_pilot_study_guide",
  acs: "https://www.faa.gov/training_testing/testing/acs",
  aim: "https://www.faa.gov/air_traffic/publications/atpubs/aim_html/",
  chartUsersGuide:
    "https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/cug/",
  sampleQuestions:
    "https://www.faa.gov/training_testing/testing/test_questions",
  faaSafety: "https://www.faasafety.gov/",
  wings: "https://www.faasafety.gov/WINGS/pub/learn_more.aspx",
  cfr61: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61",
  cfr67: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-67",
  cfr91: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91",
  cfr107: "https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107",
  medical: "https://www.faa.gov/pilots/medical_certification",
  iacra: "https://iacra.faa.gov/",
  psi: "https://faa.psiexams.com/",
  dpe: "https://designee.faa.gov/designeeLocator",
  notams: "https://notams.aim.faa.gov/notamSearch/",
  tfr: "https://tfr.faa.gov/",
  laanc: "https://www.faa.gov/uas/getting_started/laanc",
  trust: "https://www.faa.gov/uas/recreational_flyers/knowledge_test_updates",
  remoteId: "https://www.faa.gov/uas/getting_started/remote_id",
  droneRegister: "https://faadronezone-access.faa.gov/",
  awc: "https://aviationweather.gov/",
  asrs: "https://asrs.arc.nasa.gov/",
  ntsb: "https://www.ntsb.gov/Pages/AviationQuery.aspx"
};

var FAA_SOURCES = [
  { id: "phak", code: "FAA-H-8083-25C", title: "Pilot's Handbook of Aeronautical Knowledge", tier: "host", url: EXTERNAL_LINKS.phak },
  { id: "afh", code: "FAA-H-8083-3C", title: "Airplane Flying Handbook", tier: "host", url: EXTERNAL_LINKS.afh },
  { id: "hfh", code: "FAA-H-8083-21", title: "Helicopter Flying Handbook", tier: "host", url: EXTERNAL_LINKS.hfh },
  { id: "ifh", code: "FAA-H-8083-15", title: "Instrument Flying Handbook", tier: "host", url: EXTERNAL_LINKS.ifh },
  { id: "iph", code: "FAA-H-8083-16", title: "Instrument Procedures Handbook", tier: "host", url: EXTERNAL_LINKS.iph },
  { id: "aih", code: "FAA-H-8083-9", title: "Aviation Instructor's Handbook", tier: "host", url: EXTERNAL_LINKS.aih },
  { id: "rmh", code: "FAA-H-8083-2", title: "Risk Management Handbook", tier: "host", url: EXTERNAL_LINKS.rmh },
  { id: "wbh", code: "FAA-H-8083-1", title: "Weight & Balance Handbook", tier: "host", url: EXTERNAL_LINKS.wbh },
  { id: "suas", code: "FAA-G-8082-22", title: "Remote Pilot sUAS Study Guide", tier: "host", url: EXTERNAL_LINKS.suasStudy },
  { id: "aim", code: "AIM", title: "Aeronautical Information Manual", tier: "host", url: EXTERNAL_LINKS.aim },
  { id: "cug", code: "FAA CUG", title: "Chart Users' Guide", tier: "host", url: EXTERNAL_LINKS.chartUsersGuide },
  { id: "acs", code: "FAA ACS", title: "Airman Certification Standards (all)", tier: "host", url: EXTERNAL_LINKS.acs },
  { id: "samples", code: "FAA", title: "Sample Knowledge Test Questions", tier: "host", url: EXTERNAL_LINKS.sampleQuestions },
  { id: "wings", code: "FAASTeam", title: "WINGS Pilot Proficiency Program", tier: "host", url: EXTERNAL_LINKS.wings }
];

var LINK_ONLY = [
  { id: "cfr61", title: "14 CFR Part 61 — Pilot / Instructor Certification", url: EXTERNAL_LINKS.cfr61 },
  { id: "cfr67", title: "14 CFR Part 67 — Medical Certification", url: EXTERNAL_LINKS.cfr67 },
  { id: "cfr91", title: "14 CFR Part 91 — General Operating & Flight Rules", url: EXTERNAL_LINKS.cfr91 },
  { id: "cfr107", title: "14 CFR Part 107 — Small Unmanned Aircraft", url: EXTERNAL_LINKS.cfr107 },
  { id: "medical", title: "FAA Medical Certification", url: EXTERNAL_LINKS.medical },
  { id: "iacra", title: "FAA IACRA (electronic applications)", url: EXTERNAL_LINKS.iacra },
  { id: "psi", title: "PSI Knowledge Testing", url: EXTERNAL_LINKS.psi },
  { id: "dpe", title: "FAA Designee (DPE) Locator", url: EXTERNAL_LINKS.dpe },
  { id: "notams", title: "FAA NOTAM Search", url: EXTERNAL_LINKS.notams },
  { id: "tfr", title: "FAA Temporary Flight Restrictions", url: EXTERNAL_LINKS.tfr },
  { id: "laanc", title: "FAA LAANC Information", url: EXTERNAL_LINKS.laanc },
  { id: "awc", title: "Aviation Weather Center (NOAA/NWS)", url: EXTERNAL_LINKS.awc },
  { id: "asrs", title: "NASA Aviation Safety Reporting System", url: EXTERNAL_LINKS.asrs },
  { id: "ntsb", title: "NTSB Aviation Accident Database", url: EXTERNAL_LINKS.ntsb }
];

var PAID_BOOKS = [
  { id: "jepp-pp", title: "Jeppesen Private Pilot Manual" },
  { id: "jepp-ic", title: "Jeppesen Instrument / Commercial Manual" },
  { id: "asa-ppo", title: "ASA Private Pilot Oral Exam Guide" },
  { id: "asa-io", title: "ASA Instrument Oral Exam Guide" },
  { id: "asa-co", title: "ASA Commercial Oral Exam Guide" },
  { id: "asa-faraim", title: "ASA FAR/AIM" },
  { id: "gleim-pp", title: "Gleim Private Pilot Test Prep" },
  { id: "gleim-ir", title: "Gleim Instrument Pilot Test Prep" },
  { id: "gleim-cp", title: "Gleim Commercial Pilot Test Prep" },
  { id: "sportys", title: "Sporty's Learn to Fly" },
  { id: "king", title: "King Schools Courses" },
  { id: "machado", title: "Rod Machado's Private Pilot Handbook" },
  { id: "stickrudder", title: "Stick and Rudder — Wolfgang Langewiesche" },
  { id: "wxflying", title: "Weather Flying — Robert Buck" },
  { id: "killzone", title: "The Killing Zone — Paul Craig" },
  { id: "everything", title: "Everything Explained for the Professional Pilot — Richie Lengel" }
];

/* ------------------------------------------------------- pathways & goals -- */
var PATHWAYS = [
  { id: "drone", label: "Drone Pilot", glyph: "rotor", blurb: "Recreational flying through FAA Part 107 commercial operations.", tint: "magenta" },
  { id: "airplane", label: "Airplane Pilot", glyph: "wing", blurb: "Absolute beginner through ATP and the airline track.", tint: "sky" },
  { id: "helicopter", label: "Helicopter Pilot", glyph: "heli", blurb: "Rotorcraft fundamentals through commercial and instructor.", tint: "amber" },
  { id: "glider", label: "Glider Pilot", glyph: "glider", blurb: "Engineless soaring — no medical required — from first flight through commercial.", tint: "green" },
  { id: "balloon", label: "Balloon Pilot", glyph: "balloon", blurb: "Lighter-than-air flight — no medical required — hot air and the wind.", tint: "red" },
  { id: "gyroplane", label: "Gyroplane Pilot", glyph: "gyro", blurb: "Rotorcraft with a free-spinning rotor — sport through commercial.", tint: "magenta" },
  { id: "poweredlift", label: "Powered-Lift Pilot", glyph: "poweredlift", blurb: "Vertical takeoff meets winged cruise — the newest category and eVTOL.", tint: "sky" },
  { id: "weightshift", label: "Weight-Shift (Trike)", glyph: "weightshift", blurb: "A wing and a carriage — flown by shifting weight, sport through private.", tint: "amber" },
  { id: "poweredchute", label: "Powered Parachute", glyph: "poweredchute", blurb: "A parafoil and a cart — the simplest aircraft to fly, sport through private.", tint: "magenta" }
];

var GOAL_GROUPS = [
  {
    group: "Start here",
    items: [
      { id: "rec", label: "Recreational knowledge only" },
      { id: "remote", label: "FAA Remote Pilot Certificate", path: "drone" },
      { id: "student", label: "Student Pilot", path: "airplane" }
    ]
  },
  {
    group: "Airplane certificates",
    items: [
      { id: "sport", label: "Sport Pilot", path: "airplane" },
      { id: "recpilot", label: "Recreational Pilot", path: "airplane" },
      { id: "ppl", label: "Private Pilot", path: "airplane" },
      { id: "ifr", label: "Instrument Rating", path: "airplane" },
      { id: "cpl", label: "Commercial Pilot", path: "airplane" },
      { id: "me", label: "Multi-Engine Rating", path: "airplane" },
      { id: "atp", label: "Airline Transport Pilot", path: "airplane" },
      { id: "type", label: "Type Rating", path: "airplane" }
    ]
  },
  {
    group: "Airplane endorsements & skills",
    items: [
      { id: "seaplane", label: "Seaplane Rating", path: "airplane" },
      { id: "tailwheel", label: "Tailwheel Endorsement", path: "airplane" },
      { id: "complex", label: "Complex Endorsement", path: "airplane" },
      { id: "hp", label: "High-Performance Endorsement", path: "airplane" },
      { id: "highalt", label: "High-Altitude Endorsement", path: "airplane" },
      { id: "night", label: "Night Proficiency", path: "airplane" },
      { id: "mountain", label: "Mountain Flying", path: "airplane" },
      { id: "aero", label: "Aerobatics Awareness", path: "airplane" }
    ]
  },
  {
    group: "Instructor track",
    items: [
      { id: "cfi", label: "Flight Instructor", path: "airplane" },
      { id: "cfii", label: "Instrument Flight Instructor", path: "airplane" },
      { id: "mei", label: "Multi-Engine Instructor", path: "airplane" },
      { id: "gi", label: "Ground Instructor", path: "airplane" }
    ]
  },
  {
    group: "Helicopter",
    items: [
      { id: "h-ppl", label: "Helicopter Private Pilot", path: "helicopter" },
      { id: "h-ifr", label: "Helicopter Instrument Rating", path: "helicopter" },
      { id: "h-cpl", label: "Helicopter Commercial Pilot", path: "helicopter" },
      { id: "h-cfi", label: "Helicopter Flight Instructor", path: "helicopter" },
      { id: "h-load", label: "External Load Awareness", path: "helicopter" }
    ]
  },
  {
    group: "Drone operations",
    items: [
      { id: "d-comm", label: "Drone Commercial Operator", path: "drone" },
      { id: "d-safety", label: "Public Safety Operator", path: "drone" },
      { id: "d-media", label: "Mapping / Photo / Video", path: "drone" },
      { id: "d-inspect", label: "Inspection Operator", path: "drone" }
    ]
  },
  {
    group: "Glider",
    items: [
      { id: "g-solo", label: "Solo a Glider", path: "glider" },
      { id: "g-ppl", label: "Private Pilot — Glider", path: "glider" },
      { id: "g-cpl", label: "Commercial Pilot — Glider", path: "glider" },
      { id: "g-xc", label: "Cross-Country Soaring", path: "glider" }
    ]
  },
  {
    group: "Balloon & lighter-than-air",
    items: [
      { id: "b-ppl", label: "Private Pilot — Balloon", path: "balloon" },
      { id: "b-cpl", label: "Commercial Pilot — Balloon", path: "balloon" },
      { id: "b-rides", label: "Balloon Ride Operations", path: "balloon" }
    ]
  },
  {
    group: "Gyroplane",
    items: [
      { id: "gy-sport", label: "Sport Pilot — Gyroplane", path: "gyroplane" },
      { id: "gy-ppl", label: "Private Pilot — Gyroplane", path: "gyroplane" },
      { id: "gy-cpl", label: "Commercial Pilot — Gyroplane", path: "gyroplane" }
    ]
  },
  {
    group: "Powered-lift & eVTOL",
    items: [
      { id: "pl-cert", label: "Powered-Lift Certificate", path: "poweredlift" },
      { id: "pl-evtol", label: "eVTOL / Air Taxi", path: "poweredlift" }
    ]
  },
  {
    group: "Weight-shift (trike)",
    items: [
      { id: "ws-sport", label: "Sport Pilot — Weight-Shift", path: "weightshift" },
      { id: "ws-ppl", label: "Private Pilot — Weight-Shift", path: "weightshift" }
    ]
  },
  {
    group: "Powered parachute",
    items: [
      { id: "pp-sport", label: "Sport Pilot — Powered Parachute", path: "poweredchute" },
      { id: "pp-ppl", label: "Private Pilot — Powered Parachute", path: "poweredchute" }
    ]
  }
];

/* --------------------------------------------------- age bands & voice tiers */
/* Aviation facts never change with age. What scales is reading level, tone,
   framing, and eligibility messaging. Four selectable bands map to three
   authored voice tiers. No AI is used anywhere — tiers are authored, with
   graceful fallback to the standard (adult) copy. Each band has its own
   description even where two share a voice tier. */
var AGE_BANDS = [
  { id: "8-15",  label: "8–15",  tier: "junior", frame: "explore", note: "Young explorer",
    desc: "Friendly, plain-language lessons with concrete examples and plenty of encouragement — built for younger learners getting their first taste of aviation." },
  { id: "16-20", label: "16–20", tier: "teen", frame: "launch", note: "Future aviator",
    desc: "Clear, motivating lessons framed around earning your first certificate — great timing, since many ratings open up at 16 and 17." },
  { id: "21-29", label: "21–29", tier: "adult", frame: "career", note: "Charting the course",
    desc: "Full, no-nonsense briefings with real checkride framing — for adults studying with intent, whether for a serious hobby or a career change." },
  { id: "30+",   label: "30+",   tier: "adult", frame: "career", note: "On your own terms",
    desc: "Complete, professional-level briefings at your own pace, with the practical, time-respecting tone of an experienced ground instructor." }
];
function bandById(id) {
  for (var i = 0; i < AGE_BANDS.length; i++) { if (AGE_BANDS[i].id === id) return AGE_BANDS[i]; }
  return null;
}
function tierFor(state) {
  var id = (state && state.profile && state.profile.ageBand) ? state.profile.ageBand : "";
  var b = bandById(id);
  return b ? b.tier : "adult";
}
function frameFor(state) {
  var id = (state && state.profile && state.profile.ageBand) ? state.profile.ageBand : "";
  var b = bandById(id);
  return b ? b.frame : "career";
}
/* tiered UI copy — high-visibility strings; everything else falls back safely */
var COPY = {
  learnSub: {
    junior: "Your next mission is ready. Let's go flying!",
    teen: "Pick up where you left off — and keep that streak alive.",
    adult: "Resume your training and keep your streak current."
  },
  startCta: { junior: "Let's fly!", teen: "Start flying", adult: "Begin training" },
  quizCta: { junior: "Start the challenge", teen: "Start the quiz", adult: "Begin knowledge check" },
  weakHdr: {
    junior: "Let's practice the tricky ones",
    teen: "Sharpen your weak spots",
    adult: "Targeted weak-area review"
  }
};
function copyFor(key, tier) {
  var m = COPY[key];
  if (!m) return "";
  return m[tier] ? m[tier] : m.adult;
}
/* lesson body resolves to the learner's tier, falling back to standard copy */
function explainFor(lesson, tier) {
  if (lesson && lesson.explainByTier && lesson.explainByTier[tier]) return lesson.explainByTier[tier];
  return lesson ? lesson.explain : [];
}
function hookFor(lesson, tier) {
  if (lesson && lesson.hookByTier && lesson.hookByTier[tier]) return lesson.hookByTier[tier];
  return lesson ? lesson.hook : "";
}
/* youngest learners: surface when official training can begin */
function eligibilityNote(tier) {
  if (tier === "junior") return "You can start learning right now. Official FAA student training begins at 14 for gliders and balloons, and 16 for powered aircraft and drones — keep building knowledge until then.";
  if (tier === "teen") return "Many certificates open up at 16–17. Build the knowledge now so you are ready the day you become eligible.";
  return "";
}

/* ============================================================================
   CURRICULUM — lessons are keyed records; UNITS are ordered references.
   Each lesson carries the full lesson template required by the brief:
   plain-English explanation, why-it-matters, common mistake, instructor note,
   safety warning, key terms, memory hook, scenario, oral question, practical
   application, FAA source, ACS task, and an original (non-FAA-bank) quiz.
   ========================================================================== */

var LESSONS = (typeof window !== "undefined" && window.__AV_LESSONS__) ? window.__AV_LESSONS__ : {};

/* ---- UNITS: ordered references into LESSONS, grouped by pathway ---------- */
var UNITS = [
  {
    id: "af-airplane",
    cert: "foundation",
    pathway: "airplane",
    level: "Airplane • Fundamentals",
    title: "Aviation Fundamentals — Airplane",
    subtitle: "How an airplane flies, the controls and cockpit, and what a first lesson looks like.",
    lessons: ["af-a-intro", "af-a-controls", "af-a-cockpit", "af-a-anatomy", "af-a-firstflight"]
  },
  {
    id: "af-drone",
    cert: "foundation",
    pathway: "drone",
    level: "Drone • Fundamentals",
    title: "Aviation Fundamentals — Drone",
    subtitle: "What a drone is, how a multirotor flies, the controller, and where you may fly.",
    lessons: ["af-d-intro", "af-d-howfly", "af-d-controller", "af-d-rules", "af-d-preflight"]
  },
  {
    id: "af-helicopter",
    cert: "foundation",
    pathway: "helicopter",
    level: "Helicopter • Fundamentals",
    title: "Aviation Fundamentals — Helicopter",
    subtitle: "How helicopters fly, the four controls, torque and the tail rotor, and the hover.",
    lessons: ["af-h-intro", "af-h-controls", "af-h-torque", "af-h-hover", "af-h-anatomy-haz"]
  },
  {
    id: "foundation",
    cert: "foundation",
    pathway: "foundation",
    level: "Aviation 000",
    title: "Absolute Beginner",
    subtitle: "Everyone starts on the ramp. Build the vocabulary and judgment first.",
    lessons: ["f-intro", "f-cert", "f-orgs", "f-catclass", "f-airspace", "f-adm", "f-weather"]
  },
  {
    id: "d107",
    cert: "remote",
    pathway: "drone",
    level: "Drone Level 2",
    title: "FAA Part 107 Remote Pilot",
    subtitle: "The knowledge core for legal commercial drone operations.",
    lessons: ["d-overview", "d-eligibility", "d-limits", "d-airspace", "d-remoteid", "d-people", "d-wx-perf"]
  },
  {
    id: "a-foundation",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane Levels 1–2",
    title: "Pre-Solo & Private Pilot Core",
    subtitle: "Fundamentals through the knowledge that gets you to your checkride.",
    lessons: ["a-fundamentals", "a-forces", "a-pattern", "a-airspace-vfr", "a-wb", "a-metar", "a-slowflight"]
  },
  {
    id: "a-aero",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aerodynamics",
    title: "Aerodynamics in Depth",
    subtitle: "Angle of attack, stalls and spins, load factor and Va, stability and trim, the left-turning tendencies, and ground effect.",
    lessons: ["aero-aoa", "aero-stall", "aero-spin", "aero-loadfactor", "aero-stability", "aero-leftturn", "aero-groundeffect"]
  },
  {
    id: "a-systems",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Systems",
    title: "Aircraft Systems",
    subtitle: "The piston engine, ignition and magnetos, fuel, mixture and carb ice, electrical, the pitot-static system, and propellers.",
    lessons: ["sys-engine", "sys-ignition", "sys-fuel", "sys-carb", "sys-electrical", "sys-pitotstatic", "sys-prop"]
  },
  {
    id: "a-instruments",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Instruments",
    title: "Flight Instruments",
    subtitle: "The altimeter and altitude types, the airspeed indicator with V-speeds and arcs, gyroscopic instruments, and compass errors.",
    lessons: ["inst-altimeter", "inst-airspeed", "inst-gyro", "inst-compass"]
  },
  {
    id: "a-weather2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather Deep Dive",
    subtitle: "The atmosphere and stability, air masses and fronts, thunderstorms and microbursts, icing, and reading METARs, TAFs and PIREPs.",
    lessons: ["wx-atmosphere", "wx-stability2", "wx-fronts2", "wx-thunderstorms2", "wx-icing2", "wx-reports"]
  },
  {
    id: "a-nav2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Navigation",
    title: "Navigation",
    subtitle: "Sectional charts and lat/long, pilotage and dead reckoning, VOR and GPS, and planning a cross-country.",
    lessons: ["nav-charts2", "nav-ded", "nav-radio", "nav-xc"]
  },
  {
    id: "a-regs2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Regulations",
    title: "Regulations & Currency",
    subtitle: "Required documents and inspections, currency, flight reviews and medicals, and right-of-way, VFR minimums and fuel reserves.",
    lessons: ["reg-docs", "reg-currency", "reg-vfr"]
  },
  {
    id: "a-human2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Human Factors",
    title: "Aeromedical & Decision-Making",
    subtitle: "Fitness and hypoxia, spatial disorientation and illusions, and aeronautical decision-making with the PAVE checklist.",
    lessons: ["med-fitness", "med-illusions", "adm-risk"]
  },
  {
    id: "a-maneuvers2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Maneuvers",
    title: "Crosswinds, Maneuvers & Emergencies",
    subtitle: "Crosswind landings with the crab and the slip, short- and soft-field technique, go-arounds, and engine-out forced landings.",
    lessons: ["man-crosswind", "man-takeland", "man-goaround", "man-emergency"]
  },
  {
    id: "a-airspace2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Airspace",
    title: "Airspace System in Depth",
    subtitle: "Classes A through G, the dimensions and entry rules, special use airspace, TFRs, and the equipment required to fly in each.",
    lessons: ["as-classes", "as-eg", "as-sua", "as-tfr", "as-equip"]
  },
  {
    id: "a-comms",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Communications",
    title: "Radio Communications",
    subtitle: "Standard phraseology, self-announce CTAF calls at non-towered fields, working a control tower, and what to do if you lose comms.",
    lessons: ["com-basics", "com-phrase", "com-nontower", "com-tower", "com-lost"]
  },
  {
    id: "a-airport2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Airport Ops",
    title: "Airport & Night Operations",
    subtitle: "Runway and taxiway markings and signs, airport lighting with VASI and PAPI, wind indicators, LAHSO, and the rules for flying at night.",
    lessons: ["apt-markings", "apt-signs", "apt-lighting", "apt-windlahso", "apt-night"]
  },
  {
    id: "a-night1",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Night Flying",
    title: "Night Flying: Aircraft Lights",
    subtitle: "Position (nav) lights, reading other aircraft's lights in the dark, anti-collision beacons and strobes, landing and taxi lights, and the FLAPS night-equipment list.",
    lessons: ["nite-poslights", "nite-seelights", "nite-anticol", "nite-landingtaxi", "nite-equip"]
  },
  {
    id: "a-night2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Night Flying",
    title: "Night Flying: Airport & Approach Lighting",
    subtitle: "Runway and taxiway light colors, REIL and rotating beacons, VASI and PAPI glidepath aids, approach lighting systems, pilot-controlled lighting, and obstruction lights.",
    lessons: ["nite-runwaylights", "nite-taxiwaylights", "nite-reilbeacon", "nite-vasipapi", "nite-als", "nite-pcl", "nite-obstruction"]
  },
  {
    id: "a-night3",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Night Flying",
    title: "Night Flying: Vision & Illusions",
    subtitle: "Rods, cones, and the night blind spot; dark adaptation; oxygen and night vision; and the night illusions that fool you into a low approach.",
    lessons: ["nite-rodscones", "nite-darkadapt", "nite-o2", "nite-illusions"]
  },
  {
    id: "a-night4",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Night Flying",
    title: "Night Flying: Operations & Emergencies",
    subtitle: "The three legal definitions of night, night passenger currency, planning a night cross-country, and handling an engine failure after dark.",
    lessons: ["nite-definitions", "nite-currency", "nite-xc", "nite-emerg"]
  },
  {
    id: "a-radionav",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Navigation",
    title: "Radio Navigation: VOR & GPS",
    subtitle: "How a VOR works, tracking and intercepting radials, GPS and RAIM, RNAV and WAAS, and the legacy DME and ADF you may still meet on a checkride.",
    lessons: ["navd-vor", "navd-vortrack", "navd-gps", "navd-rnav", "navd-dme-adf"]
  },
  {
    id: "a-xcskills",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Navigation",
    title: "Cross-Country Skills",
    subtitle: "Diverting to an alternate, the five C's of lost procedures, and managing fuel and reserves on a cross-country.",
    lessons: ["navd-diversion", "navd-lost", "navd-fuelmgmt"]
  },
  {
    id: "a-airworthy",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Regulations",
    title: "Airworthiness & Regulations",
    subtitle: "Required documents (ARROW), inspection intervals (AV1ATE), airworthiness responsibility and ADs, pilot preventive maintenance, inoperative equipment and the MEL, ELTs, and NTSB 830 reporting.",
    lessons: ["regd-arrow", "regd-inspections", "regd-airworthy", "regd-maint", "regd-mel", "regd-elt", "regd-ntsb830"]
  },
  {
    id: "a-humanfactors",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Human Factors",
    title: "Human Factors: Fit to Fly",
    subtitle: "The alcohol rules (8 hours, 0.04 BAC), medications and over-the-counter drugs, the sterile cockpit and checklist discipline, and runway-incursion avoidance.",
    lessons: ["hfd-alcohol", "hfd-meds", "hfd-sterile", "hfd-incursion"]
  },
  {
    id: "a-groundref",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Maneuvers",
    title: "Ground Reference Maneuvers",
    subtitle: "The rectangular course, turns around a point, S-turns across a road, and steep turns -- dividing attention while flying a precise track.",
    lessons: ["mand-rectangular", "mand-turnspoint", "mand-sturns", "mand-steepturns"]
  },
  {
    id: "a-emergencies2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Emergencies",
    title: "Abnormal & Emergency Procedures",
    subtitle: "Electrical fire and cockpit smoke, ditching and water survival, and surviving an off-airport landing in remote terrain.",
    lessons: ["emd-elecfire", "emd-ditching", "emd-survival"]
  },
  {
    id: "a-cmxmaneuvers",
    cert: "commercial",
    pathway: "airplane",
    level: "Airplane • Commercial Maneuvers",
    title: "Commercial Maneuvers",
    subtitle: "Chandelles, lazy eights, eights on pylons and pivotal altitude, the steep spiral, the power-off 180 accuracy landing, and accelerated and secondary stalls.",
    lessons: ["cmx-chandelle", "cmx-lazyeight", "cmx-pylons", "cmx-steepspiral", "cmx-poweroff180", "cmx-accelstall", "cmx-secondary"]
  },
  {
    id: "a-advops",
    cert: "commercial",
    pathway: "airplane",
    level: "Airplane • Advanced Operations",
    title: "Advanced Airplane Operations",
    subtitle: "Tailwheel handling, mountain flying, high-altitude operations and oxygen, cabin pressurization, the glass cockpit, and aerobatics and upset recovery.",
    lessons: ["advx-tailwheel", "advx-mountain", "advx-highalt", "advx-pressurization", "advx-glass", "advx-aerobatics"]
  },
  {
    id: "a-seaplane1",
    cert: "class",
    pathway: "airplane",
    level: "Airplane • Seaplane",
    title: "Seaplane: On the Water",
    subtitle: "Floats versus flying boats, the hydrodynamics of displacement, plowing and the step, water taxiing, water rudders and sailing, and step turns.",
    lessons: ["seap-config", "seap-hydro", "seap-taxi", "seap-rudder", "seap-step"]
  },
  {
    id: "a-seaplane2",
    cert: "class",
    pathway: "airplane",
    level: "Airplane • Seaplane",
    title: "Seaplane: Takeoffs & Landings",
    subtitle: "Normal, glassy, and rough water takeoffs and landings, plus recognizing and recovering from porpoising and skipping.",
    lessons: ["seap-takeoff", "seap-glassyto", "seap-roughto", "seap-landing", "seap-glassyldg", "seap-roughldg", "seap-porpoise"]
  },
  {
    id: "a-seaplane3",
    cert: "class",
    pathway: "airplane",
    level: "Airplane • Seaplane",
    title: "Seaplane: Docking & Safety",
    subtitle: "Docking, beaching, and mooring; right-of-way rules on the water; and seaplane safety, egress, and the amphibian wheel-position check.",
    lessons: ["seap-dock", "seap-regs", "seap-safety"]
  },
  {
    id: "a-ifr-hold",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Holding & Course Reversals",
    subtitle: "The three holding entries and the 70-degree rule, holding speeds and timing, procedure turns and holds-in-lieu, and flying a DME arc.",
    lessons: ["ifrd-holdentry", "ifrd-holdspeed", "ifrd-procturn", "ifrd-dmearc"]
  },
  {
    id: "a-ifr-app",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Approaches in Depth",
    subtitle: "Approach categories and minimums, localizer/glideslope/marker beacons, DA versus MDA and step-down fixes, and visual, contact, and timed approaches.",
    lessons: ["ifrd-apptcat", "ifrd-localizer", "ifrd-minsdamda", "ifrd-apptypes"]
  },
  {
    id: "a-ifr-system2",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Enroute, Arrivals & Currency",
    subtitle: "Enroute altitudes (MEA, MOCA, MVA, OROCA), STARs and feeder routes, the required IFR reports, and the 6-month instrument currency rules.",
    lessons: ["ifrd-enroutealts", "ifrd-starsfeeders", "ifrd-reports", "ifrd-currency"]
  },
  {
    id: "a-atp-ops",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Operations & Crew",
    subtitle: "Part 121 versus Part 135 operations, crew resource management, and the flight, duty, and rest rules of Part 117.",
    lessons: ["atpd-part121135", "atpd-crm", "atpd-restrules"]
  },
  {
    id: "a-atp-power",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Turbine & High-Speed Flight",
    subtitle: "Turbine engine basics, jet engine types, swept-wing aerodynamics, Mach and Mach tuck, and high-altitude flight and coffin corner.",
    lessons: ["atpd-turbine", "atpd-jettypes", "atpd-sweptwing", "atpd-mach", "atpd-coffincorner"]
  },
  {
    id: "a-atp-perf",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Transport Performance",
    subtitle: "V1, Vr, and V2 with the balanced field, and the accelerate-stop and accelerate-go distances behind every transport takeoff.",
    lessons: ["atpd-takeoffspeeds", "atpd-accelstopgo"]
  },
  {
    id: "a-cpl-priv",
    cert: "commercial",
    pathway: "airplane",
    level: "Airplane • Commercial",
    title: "Commercial: Privileges & Operations",
    subtitle: "Commercial privileges and the no-instrument-rating limitation, common carriage and holding out, how the FAA reads compensation and logging PIC/SIC, and complex and high-performance endorsements.",
    lessons: ["cpld-privileges", "cpld-commoncarriage", "cpld-compensation", "cpld-complex"]
  },
  {
    id: "a-ppl-aero2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aerodynamics & Aeromedical",
    title: "Aerodynamics & Aeromedical Extras",
    subtitle: "Adverse yaw and coordinated flight, wingtip vortices and induced drag, ear and sinus block and motion sickness, and decompression sickness after diving.",
    lessons: ["ppld-adverseyaw", "ppld-vortices", "ppld-ear", "ppld-dcs"]
  },
  {
    id: "a-ppl-airspace2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Airspace",
    title: "Special VFR & Class B",
    subtitle: "Operating Special VFR in a surface area below basic VFR, and the clearance and equipment required to enter Class B airspace.",
    lessons: ["ppld-svfr", "ppld-classb"]
  },
  {
    id: "a-ifr-rnav",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: GPS, RNAV & WAAS",
    subtitle: "RNAV (GPS) lines of minima (LNAV, LNAV/VNAV, LPV), WAAS and approach service levels, and required navigation performance (RNP).",
    lessons: ["ifrd-gpsapp", "ifrd-waaslpv", "ifrd-rnp"]
  },
  {
    id: "a-ifr-app2",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Approach Techniques",
    subtitle: "The visual descent point, circle-to-land procedures, the localizer back course, radar approaches (ASR and PAR), and briefing the approach plate.",
    lessons: ["ifrd-vdp", "ifrd-circle", "ifrd-backcourse", "ifrd-radar-app", "ifrd-briefing"]
  },
  {
    id: "a-ifr-plan",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Departures, Alternates & Cold Temps",
    subtitle: "Takeoff minimums and obstacle departure procedures, alternate airport minimums, and cold-temperature altimetry corrections.",
    lessons: ["ifrd-tomins-odp", "ifrd-altmins", "ifrd-coldtemp"]
  },
  {
    id: "a-ppl-instruments2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Instruments",
    title: "Airspeed & Altitude Explained",
    subtitle: "Indicated, calibrated, true, and groundspeed; indicated, pressure, density, and absolute altitude; and how density altitude drives performance.",
    lessons: ["ppld-airspeeds", "ppld-altitudes", "ppld-densityalt"]
  },
  {
    id: "a-ppl-equip-airspace",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Equipment & Charts",
    title: "Transponders, Charts & Minimum Altitudes",
    subtitle: "Transponder/ADS-B and the Mode C veil, reading the sectional chart legend, minimum safe altitudes (91.119), and VFR cruising altitudes.",
    lessons: ["ppld-modecveil", "ppld-chartlegend", "ppld-msa", "ppld-cruisealt"]
  },
  {
    id: "a-ppl-notam-tfr",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Preflight & Operations",
    title: "NOTAMs, TFRs & Wake Turbulence",
    subtitle: "NOTAMs and their types, the kinds of temporary flight restrictions, and wake turbulence categories and separation techniques.",
    lessons: ["ppld-notams", "ppld-tfrtypes", "ppld-wakecat"]
  },
  {
    id: "a-ppl-aeromed2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aeromedical",
    title: "Dehydration & Fitness",
    subtitle: "How dehydration and a hot cockpit quietly degrade pilot performance, and the simple habits that keep you sharp.",
    lessons: ["ppld-dehydration"]
  },
  {
    id: "a-atp-systems1",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP Systems",
    title: "Transport Systems I",
    subtitle: "Hydraulic systems and redundancy, pneumatics and bleed air, transport anti-ice and de-ice, and oxygen systems.",
    lessons: ["atpd-hydraulics", "atpd-pneumatic", "atpd-antiice", "atpd-oxygen"]
  },
  {
    id: "a-atp-systems2",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP Systems",
    title: "Transport Systems II",
    subtitle: "Fire detection and suppression, the auxiliary power unit, and the spoilers, speedbrakes, reversers, and autobrakes that stop a jet.",
    lessons: ["atpd-fire", "atpd-apu", "atpd-spoilers"]
  },
  {
    id: "a-atp-avionics",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP Avionics",
    title: "Automation & Protection",
    subtitle: "The flight management system and autoflight, TCAS traffic avoidance, and EGPWS/TAWS terrain awareness.",
    lessons: ["atpd-fms", "atpd-tcas", "atpd-egpws"]
  },
  {
    id: "a-ifr-ops1",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Clearances & Reports",
    subtitle: "Pilot reports, clearance void and release times, radar vectors and the MVA, and using GPS to substitute for DME and ADF.",
    lessons: ["ifro-pirep", "ifro-clearvoid", "ifro-vectors", "ifro-gpssubst"]
  },
  {
    id: "a-ifr-ops2",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Descent, Missed & Failures",
    subtitle: "Descent planning and top of descent, missed-approach climb gradients, pitot-static failures, and in-flight icing decisions.",
    lessons: ["ifro-descent", "ifro-missedclimb", "ifro-pitotfail", "ifro-icingdec"]
  },
  {
    id: "a-ifr-ops3",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: High-Altitude & Oceanic",
    subtitle: "RVSM airspace and the equipment it demands, and the procedural world of oceanic and remote operations.",
    lessons: ["ifro-rvsm", "ifro-oceanic"]
  },
  {
    id: "a-perf-wind-dist",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Performance",
    title: "Performance: Wind & Distances",
    subtitle: "Crosswind and headwind components, takeoff and landing distance factors, and how runway slope, surface, and contamination change the numbers.",
    lessons: ["perfx-crosswind", "perfx-takeoffdist", "perfx-landingdist", "perfx-runwaysurface"]
  },
  {
    id: "a-perf-wb",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weight & Balance",
    title: "Weight, Balance & CG",
    subtitle: "How the center of gravity affects stability, stall speed, and control, and the arm-and-moment arithmetic to compute it.",
    lessons: ["perfx-cg", "perfx-wbmath"]
  },
  {
    id: "a-adm-risk",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Risk Management",
    title: "Risk Management",
    subtitle: "The PAVE preflight checklist, the in-flight 5P check, building personal minimums, briefing passengers with SAFETY, and breaking the accident error chain.",
    lessons: ["admx-pave", "admx-5p", "admx-personalmins", "admx-paxbrief", "admx-chain"]
  },
  {
    id: "a-wx-atmos",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather: Atmosphere & Moisture",
    subtitle: "The standard lapse rate, relative humidity and the dewpoint spread, temperature inversions, and the tropopause.",
    lessons: ["wxg-lapse", "wxg-humidity", "wxg-inversion", "wxg-tropopause"]
  },
  {
    id: "a-wx-winds-haz",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather: Winds & High-Altitude Hazards",
    subtitle: "The jet stream, clear air turbulence, squall lines, and mountain wave with its rotors.",
    lessons: ["wxg-jetstream", "wxg-cat", "wxg-squall", "wxg-mtnwave"]
  },
  {
    id: "a-wx-ice-frost",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather: Frost & Icing",
    subtitle: "Why frost must be removed before flight, and the differences between clear, rime, and mixed structural ice.",
    lessons: ["wxg-frost", "wxg-icetypes"]
  },
  {
    id: "a-atp-aero2",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Stall & Envelope Protection",
    subtitle: "The stick shaker and stick pusher, stall and envelope protection philosophies, and engine-out drift-down.",
    lessons: ["atpx-stickshaker", "atpx-stallprot", "atpx-driftdown"]
  },
  {
    id: "a-atp-runway",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Runway & Low-Vis Operations",
    subtitle: "Contaminated runways, hydroplaning, CAT II/III low-visibility approaches, and autoland.",
    lessons: ["atpx-contam", "atpx-hydroplane", "atpx-catiii", "atpx-autoland"]
  },
  {
    id: "a-atp-dispatch",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Dispatch, Fuel & Performance",
    subtitle: "ETOPS, dispatch and the flight release, the cost index, performance-limited takeoff weights, transport fuel planning, and takeoff and destination alternates.",
    lessons: ["atpx-etops", "atpx-dispatch", "atpx-costindex", "atpx-perfweights", "atpx-fuelplan", "atpx-takeoffalt"]
  },
  {
    id: "a-ppl-sua1",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Airspace",
    title: "Special-Use Airspace I",
    subtitle: "Military Operations Areas, restricted areas, prohibited areas, and warning areas.",
    lessons: ["asp-moa", "asp-restricted", "asp-prohibited", "asp-warning"]
  },
  {
    id: "a-ppl-sua2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Airspace",
    title: "Special-Use Airspace II",
    subtitle: "Alert areas, National Security Areas, Terminal Radar Service Areas, and Air Defense Identification Zones.",
    lessons: ["asp-alert", "asp-nsa", "asp-trsa", "asp-adiz"]
  },
  {
    id: "a-ifr-clr1",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Special Clearances",
    subtitle: "VFR-on-top, cruise clearances, and tower en route control.",
    lessons: ["ifrx-vfrontop", "ifrx-cruise", "ifrx-towerenroute"]
  },
  {
    id: "a-ifr-clr2",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Reports, Codes & Parallels",
    subtitle: "Non-radar position reports, equipment and capability codes, parallel and PRM approaches, and the sidestep maneuver.",
    lessons: ["ifrx-posreport", "ifrx-equipsuffix", "ifrx-parallel", "ifrx-sidestep"]
  },
  {
    id: "a-ifr-route",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "IFR: Route Structure & Fuel",
    subtitle: "Victor airways and the route system, changeover points, and minimum-fuel and fuel-emergency communication.",
    lessons: ["ifrx-airways", "ifrx-cop", "ifrx-minfuel"]
  },
  {
    id: "a-ppl-ground2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Airport Operations",
    title: "Wildlife, Hot Spots & Movement Areas",
    subtitle: "Bird and wildlife strikes, airport hot spots, and the movement versus non-movement areas.",
    lessons: ["apx-birdstrike", "apx-hotspots", "apx-movementarea"]
  },
  {
    id: "a-ppl-aeromed3",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aeromedical",
    title: "Oxygen & Hypoxia",
    subtitle: "Time of useful consciousness, G-induced loss of consciousness, supplemental oxygen requirements, the four types of hypoxia, and carbon monoxide poisoning.",
    lessons: ["med-tuc", "med-gloc", "med-o2req", "med-hypoxiatypes", "med-cohazard"]
  },
  {
    id: "a-ppl-certs",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Certification",
    title: "Certificates, Medicals & Currency",
    subtitle: "Pilot certificate levels, medical certificate classes and BasicMed, the flight review and passenger recency, and airspeed indicator markings.",
    lessons: ["ppx-pilotcerts", "ppx-medclasses", "ppx-currency", "ppx-asiarcs"]
  },
  {
    id: "a-wx-products1",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather Products: Charts",
    subtitle: "Surface analysis charts, prognostic charts, and radar imagery.",
    lessons: ["wxp-surface", "wxp-prog", "wxp-radar"]
  },
  {
    id: "a-wx-products2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather Products: Winds, GFA & Convection",
    subtitle: "The winds and temperatures aloft forecast, the Graphical Forecasts for Aviation, and convective outlooks and SIGMETs.",
    lessons: ["wxp-winds", "wxp-gfa", "wxp-convective"]
  },
  {
    id: "a-atp-systems3",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP Systems",
    title: "Transport Systems III",
    subtitle: "Electrical systems and buses, fuel systems and transfer, landing gear systems, and brakes and antiskid.",
    lessons: ["atps-electrical", "atps-fuel", "atps-gear", "atps-brakes"]
  },
  {
    id: "a-atp-controls",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Controls & Augmentation",
    subtitle: "Primary and secondary flight controls, the yaw damper and Mach trim, and minimum control speeds (Vmc).",
    lessons: ["atps-flightcontrols", "atps-yawdamper", "atpx-vmc"]
  },
  {
    id: "a-atp-perf2",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "ATP: Climb, Windshear & Deicing",
    subtitle: "Takeoff climb segments, the windshear escape maneuver, more transport V-speeds, ground deicing and holdover time, and transport weight and balance.",
    lessons: ["atpx-climbsegs", "atpx-windshear", "atpx-vspeeds2", "atpx-holdover", "atpx-weightbal"]
  },
  {
    id: "a-aero-lift",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aerodynamics",
    title: "Aerodynamics: Lift & Stability",
    subtitle: "How a wing makes lift, static and dynamic stability, and stability about the three axes.",
    lessons: ["aero-bernoulli", "aero-staticstab", "aero-dynstab", "aero-longstab"]
  },
  {
    id: "a-aero-forces",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aerodynamics",
    title: "Aerodynamics: Drag, Turns & Slips",
    subtitle: "Forward and sideslips, parasite drag and the total drag curve, turn rate and radius, and wing washout and stall progression.",
    lessons: ["aero-slips", "aero-paradrag", "aero-turns", "aero-washout"]
  },
  {
    id: "a-aero-perf",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Aerodynamics",
    title: "Aerodynamics: Glide & Ceilings",
    subtitle: "Best glide and gliding distance, and the service and absolute ceilings.",
    lessons: ["aero-glide", "aero-ceilings"]
  },
  {
    id: "a-sys-engine1",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Systems",
    title: "Engine: Mixture, Prop & Combustion",
    subtitle: "Leaning the mixture, constant-speed propellers, and detonation and preignition.",
    lessons: ["sys-leaning", "sys-csprop", "sys-detonation"]
  },
  {
    id: "a-sys-engine2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Systems",
    title: "Engine: Oil, Cooling & Electrical",
    subtitle: "The oil system, engine cooling, the alternator and ammeter, and the vacuum system.",
    lessons: ["sys-oil", "sys-cooling", "sys-alternator", "sys-vacuum"]
  },
  {
    id: "a-sys-fuel",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Systems",
    title: "Fuel & Induction",
    subtitle: "Aviation fuel grades and contamination, and the difference between carburetors and fuel injection.",
    lessons: ["sys-fuelgrades", "sys-fuelinjection"]
  },
  {
    id: "a-sys-airframe",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Systems",
    title: "Flaps & Landing Gear",
    subtitle: "The types of flaps and what they do, and tricycle versus conventional landing gear.",
    lessons: ["sys-flaps", "sys-tricycle"]
  },
  {
    id: "a-inst-gyro",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Instruments",
    title: "Instruments: Gyroscopic",
    subtitle: "The attitude indicator, the heading indicator, the turn coordinator, and the gyroscopic principles behind them.",
    lessons: ["inst-attitude", "inst-heading", "inst-turncoord", "inst-gyros"]
  },
  {
    id: "a-inst-nav-alt",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Instruments",
    title: "Instruments: VSI & HSI",
    subtitle: "The vertical speed indicator, and the horizontal situation indicator (HSI).",
    lessons: ["inst-vsi", "inst-hsi"]
  },
  {
    id: "a-wx-fronts",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather: Fronts",
    subtitle: "Cold fronts, warm fronts, occluded fronts, and stationary fronts.",
    lessons: ["wxf-coldfront", "wxf-warmfront", "wxf-occluded", "wxf-stationary"]
  },
  {
    id: "a-wx-clouds",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather: Clouds, Storms & Stability",
    subtitle: "Cloud types and what they reveal, the thunderstorm life cycle, and stable versus unstable air.",
    lessons: ["wxc-cloudtypes", "wxc-tstorm", "wxc-stability"]
  },
  {
    id: "a-wx-fog",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather: Fog",
    subtitle: "How fog forms, plus radiation fog, advection fog, and upslope and steam fog.",
    lessons: ["wxc-fog", "wxc-radfog", "wxc-advfog", "wxc-upslope"]
  },
  {
    id: "a-reg-airworthy",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Regulations",
    title: "Airworthiness: Inspections & ADs",
    subtitle: "Annual and 100-hour inspections, airworthiness directives, special flight permits, and inoperative equipment.",
    lessons: ["reg-annual", "reg-ad", "reg-ferry", "reg-inopequip"]
  },
  {
    id: "a-reg-pic",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Regulations",
    title: "Pilot in Command",
    subtitle: "The pilot in command's authority and responsibility, and the required preflight action.",
    lessons: ["reg-picauth"]
  },
  {
    id: "a-com-xpdr",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Communications",
    title: "Comms, Transponder & Static",
    subtitle: "Transponder codes and emergency squawks, runway visual range, and static wicks and precipitation static.",
    lessons: ["com-squawk", "com-rvr", "com-staticwick"]
  },
  {
    id: "a-inav-types",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument",
    title: "Approach Aids: LDA & SDF",
    subtitle: "Localizer-type directional aids and simplified directional facilities, and how they differ from a standard ILS localizer.",
    lessons: ["inav-ldasdf"]
  },
  {
    id: "a-perf2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Performance",
    title: "Performance, Weight & Balance",
    subtitle: "Density altitude, computing weight and balance, reading performance charts, climb speeds Vx and Vy, and how loading shifts your CG.",
    lessons: ["perf-da", "perf-wb", "perf-charts", "perf-climb", "perf-loadcg"]
  },
  {
    id: "a-maneuvers3",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Maneuvers",
    title: "Core Flight Maneuvers",
    subtitle: "Slow flight, power-on and power-off stalls, steep turns, ground reference maneuvers, and normal takeoffs and landings.",
    lessons: ["man-slowflight", "man-stalls", "man-steep", "man-groundref", "man-normaltl"]
  },
  {
    id: "a-weather3",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Weather",
    title: "Weather Services & Hazards",
    subtitle: "Weather briefings and services, pressure and wind, fog formation, turbulence and wind shear, and in-flight advisories like AIRMETs and SIGMETs.",
    lessons: ["wx-services", "wx-winds", "wx-fog", "wx-turb", "wx-advisories"]
  },
  {
    id: "a-human3",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Human Factors",
    title: "Aeromedical in Depth",
    subtitle: "Vision and the scan, respiration and carbon monoxide, ears and sinuses, spatial disorientation and illusions, and supplemental oxygen.",
    lessons: ["med-vision", "med-respir", "med-ears", "med-spatial", "med-o2"]
  },
  {
    id: "a-adm2",
    cert: "ppl",
    pathway: "airplane",
    level: "Airplane • Decision-Making",
    title: "Aeronautical Decision-Making",
    subtitle: "The DECIDE model and the 3P and PAVE checklists, single-pilot resource management, managing cockpit automation, and fatigue with IMSAFE.",
    lessons: ["adm-decide", "adm-srm", "adm-auto", "adm-fatigue"]
  },
  {
    id: "a-instrument",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Instrument Rating",
    title: "Instrument Rating",
    subtitle: "Fly in the clouds: the scan, illusions, IFR weather, clearances, and approaches.",
    lessons: ["ir-intro", "ir-scan", "ir-spatial", "ir-weather", "ir-clearance", "ir-approaches"]
  },
  {
    id: "i-system",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • IFR System",
    title: "Flying in the System",
    subtitle: "Copying clearances with CRAFT, departures and SIDs, the enroute structure and minimum altitudes, IFR communications and lost-comm rules, and radar vectors.",
    lessons: ["isys-clearance", "isys-departure", "isys-enroute", "isys-comms", "isys-radar"]
  },
  {
    id: "i-charts",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • IFR Charts",
    title: "Charts & Procedures",
    subtitle: "Reading the enroute low chart, the anatomy of an approach plate, approach minimums and categories, arrivals (STARs), and holding patterns.",
    lessons: ["ichart-enroute", "ichart-approach", "ichart-mins", "ichart-star", "ichart-holding"]
  },
  {
    id: "i-approaches",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • IFR Approaches",
    title: "Instrument Approaches",
    subtitle: "The ILS, RNAV (GPS) approaches with LPV, non-precision approaches, circling and the missed approach, and the stabilized-approach concept.",
    lessons: ["iapp-ils", "iapp-rnav", "iapp-nonprecision", "iapp-circling", "iapp-stabilized"]
  },
  {
    id: "i-regs",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • IFR Regulations",
    title: "IFR Regulations",
    subtitle: "IFR currency and the IPC, alternates and the 1-2-3 rule, fuel requirements, required equipment and inspections, and clearance authority.",
    lessons: ["ireg-currency", "ireg-alternate", "ireg-fuel", "ireg-equipment", "ireg-clearances"]
  },
  {
    id: "i-weather",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • IFR Weather",
    title: "IFR Weather & Hazards",
    subtitle: "Structural icing, embedded thunderstorms, freezing levels and freezing rain, ceilings and flight categories, and the IFR weather products that keep you ahead of it.",
    lessons: ["iwx-icing", "iwx-convective", "iwx-freezing", "iwx-ceilings", "iwx-sources"]
  },
  {
    id: "i-attitude",
    cert: "instrument",
    pathway: "airplane",
    level: "Airplane • Attitude Flying",
    title: "Attitude Instrument Flying",
    subtitle: "The instrument scan, unusual attitude recovery, partial-panel instrument failures, spatial disorientation in IMC, and managing the autopilot.",
    lessons: ["iai-scan", "iai-unusual", "iai-partial", "iai-spatial", "iai-autopilot"]
  },
  {
    id: "h-private",
    cert: "ppl",
    pathway: "helicopter",
    level: "Helicopter • Private Pilot",
    title: "Private Pilot — Helicopter",
    subtitle: "Maneuvers, autorotation, performance, and the hazards unique to helicopters.",
    lessons: ["hp-intro", "hp-maneuvers", "hp-autorotation", "hp-performance", "hp-emergencies"]
  },
  {
    id: "d-advanced",
    cert: "remote",
    pathway: "drone",
    level: "Drone • Recurrent & Waivers",
    title: "Part 107 Recurrent & Advanced Operations",
    subtitle: "Stay current and unlock advanced ops: recurrency, waivers, authorizations, over-people, Remote ID.",
    lessons: ["da-recurrent", "da-waivers", "da-airspace-auth", "da-ops-people", "da-remoteid"]
  },
  {
    id: "a-commercial",
    cert: "commercial",
    pathway: "airplane",
    level: "Airplane • Commercial Pilot",
    title: "Commercial Pilot",
    subtitle: "Get paid to fly: privileges, experience, precision maneuvers, complex systems, the regs, and professionalism.",
    lessons: ["cp-intro", "cp-eligibility", "cp-maneuvers", "cp-complex", "cp-regs", "cp-prof"]
  },
  {
    id: "h-commercial",
    cert: "commercial",
    pathway: "helicopter",
    level: "Helicopter • Commercial Pilot",
    title: "Commercial Pilot — Helicopter",
    subtitle: "Professional rotary-wing flying: privileges, advanced maneuvers, operations, performance, and judgment.",
    lessons: ["ch-intro", "ch-maneuvers", "ch-ops", "ch-performance", "ch-safety"]
  },
  {
    id: "a-cfi",
    cert: "cfi",
    pathway: "airplane",
    level: "Instructor • CFI / CFII / MEI / GI",
    title: "Flight Instructor",
    subtitle: "Teach flying: the CFI certificate, fundamentals of instructing, the teaching process, and added ratings.",
    lessons: ["cfi-intro", "cfi-foi", "cfi-teaching", "cfi-addons", "cfi-ground"]
  },
  {
    id: "a-entry",
    cert: "sport",
    pathway: "airplane",
    level: "Airplane • Sport & Recreational",
    title: "Sport & Recreational Pilot",
    subtitle: "The accessible entry certificates: sport pilot, light-sport aircraft, recreational pilot, and how to choose.",
    lessons: ["sr-sport-intro", "sr-sport-limits", "sr-lsa", "sr-rec-intro", "sr-compare"]
  },
  {
    id: "a-classratings",
    cert: "class",
    pathway: "airplane",
    level: "Airplane • Multi-Engine & Seaplane",
    title: "Multi-Engine & Seaplane Ratings",
    subtitle: "Class-rating add-ons: the twin and engine-out aerodynamics, plus flying on and off the water.",
    lessons: ["cr-me-intro", "cr-me-vmc", "cr-me-perf", "cr-sea-intro", "cr-sea-ops"]
  },
  {
    id: "a-atp",
    cert: "atp",
    pathway: "airplane",
    level: "Airplane • ATP",
    title: "Airline Transport Pilot",
    subtitle: "The top certificate: eligibility and the restricted ATP, the experience breakdown, ATP-CTP, type ratings, and airline standards.",
    lessons: ["atp-intro", "atp-eligibility", "atp-experience", "atp-ctp", "atp-type", "atp-pro"]
  },
  {
    id: "h-instrument",
    cert: "instrument",
    pathway: "helicopter",
    level: "Helicopter • Instrument Rating",
    title: "Instrument Rating — Helicopter",
    subtitle: "Flying the helicopter on instruments: the rating, why it is demanding, and real IFR operations.",
    lessons: ["hir-intro", "hir-challenges", "hir-ops"]
  },
  {
    id: "h-atp",
    cert: "atp",
    pathway: "helicopter",
    level: "Helicopter • ATP",
    title: "Airline Transport Pilot — Helicopter",
    subtitle: "The top rotary-wing certificate and the professional air-carrier operations it opens.",
    lessons: ["hatp-intro", "hatp-ops"]
  },
  {
    id: "g-soaring",
    cert: "glider",
    pathway: "glider",
    level: "Glider • Private & Commercial",
    title: "Glider & Soaring",
    subtitle: "Engineless flight: the category and no-medical rule, certificates, launches, finding lift, performance, and landing out.",
    lessons: ["gl-intro", "gl-certs", "gl-launch", "gl-soaring", "gl-performance", "gl-safety"]
  },
  {
    id: "b-balloon",
    cert: "balloon",
    pathway: "balloon",
    level: "Balloon • Private & Commercial",
    title: "Balloon & Lighter-Than-Air",
    subtitle: "Floating on hot air: the category and no-medical rule, certificates, how a balloon flies, steering by wind, and operations.",
    lessons: ["bl-intro", "bl-certs", "bl-howfly", "bl-wind", "bl-ops"]
  },
  {
    id: "gy-gyro",
    cert: "gyro",
    pathway: "gyroplane",
    level: "Gyroplane • Sport to Commercial",
    title: "Gyroplane",
    subtitle: "The free-spinning rotorcraft: what it is, how it flies, controls and prerotation, certificates, and handling safety.",
    lessons: ["gy-intro", "gy-howfly", "gy-controls", "gy-certs", "gy-safety"]
  },
  {
    id: "pl-poweredlift",
    cert: "poweredlift",
    pathway: "poweredlift",
    level: "Powered-Lift • The newest category",
    title: "Powered-Lift & eVTOL",
    subtitle: "Vertical lift meets winged cruise: the category, the transition, the evolving certification path, and advanced air mobility.",
    lessons: ["pl-intro", "pl-howfly", "pl-certs", "pl-future"]
  },
  {
    id: "ws-trike",
    cert: "weightshift",
    pathway: "weightshift",
    level: "Weight-Shift • Sport & Private",
    title: "Weight-Shift Control (Trike)",
    subtitle: "Flying by weight shift: what a trike is, the reversed-feel controls, certificates, and operating safely.",
    lessons: ["ws-intro", "ws-control", "ws-certs", "ws-ops"]
  },
  {
    id: "pp-chute",
    cert: "poweredchute",
    pathway: "poweredchute",
    level: "Powered Parachute • Sport & Private",
    title: "Powered Parachute",
    subtitle: "The simplest aircraft: a ram-air canopy wing, throttle-for-altitude controls, certificates, and canopy safety.",
    lessons: ["pp-intro", "pp-control", "pp-certs", "pp-ops"]
  }
];

function unitForLesson(lessonId) {
  for (var i = 0; i < UNITS.length; i++) {
    if (UNITS[i].lessons.indexOf(lessonId) > -1) return UNITS[i];
  }
  return null;
}
function allLessonIdsForPathway(pathway) {
  var out = [];
  UNITS.forEach(function (u) {
    if (u.pathway === pathway) out = out.concat(u.lessons);
  });
  return out;
}

/* ============================================================================
   REFERENCE DATABASES — certificates, ratings, endorsements, career, safety.
   Searchable, modular, each with a source link.
   ========================================================================== */

var CERTIFICATES = (typeof window !== "undefined" && window.__AV_CERTIFICATES__) ? window.__AV_CERTIFICATES__ : [];

var RATINGS = [
  { id: "asel", name: "Airplane Single-Engine Land", kind: "Class rating", path: "airplane", summary: "Most common training class; one engine, land gear.", source: "cfr61" },
  { id: "ases", name: "Airplane Single-Engine Sea", kind: "Class rating", path: "airplane", summary: "Floatplanes/amphibians; adds water operations.", source: "cfr61" },
  { id: "amel", name: "Airplane Multi-Engine Land", kind: "Class rating", path: "airplane", summary: "Two or more engines; adds engine-out skills (Vmc).", source: "cfr61" },
  { id: "ames", name: "Airplane Multi-Engine Sea", kind: "Class rating", path: "airplane", summary: "Multi-engine seaplanes.", source: "cfr61" },
  { id: "heli", name: "Rotorcraft — Helicopter", kind: "Class rating", path: "helicopter", summary: "Powered rotor flight; hover, autorotation, unique aerodynamics.", source: "cfr61" },
  { id: "gyro", name: "Rotorcraft — Gyroplane", kind: "Class rating", path: "helicopter", summary: "Unpowered (autorotating) main rotor with separate thrust.", source: "cfr61" },
  { id: "inst-a", name: "Instrument — Airplane", kind: "Rating", path: "airplane", summary: "Fly in instrument meteorological conditions under IFR.", source: "cfr61" },
  { id: "inst-h", name: "Instrument — Helicopter", kind: "Rating", path: "helicopter", summary: "IFR privileges in rotorcraft; helicopter-specific risks.", source: "cfr61" },
  { id: "glider", name: "Glider", kind: "Category rating", path: "airplane", summary: "Unpowered soaring flight.", source: "cfr61" },
  { id: "type", name: "Type Ratings", kind: "Rating", path: "airplane", summary: "Specific large/turbojet aircraft requiring model-specific qualification.", source: "cfr61" }
];

var INSTRUCTOR_RATINGS = [
  { id: "cfi-a", name: "CFI — Airplane", kind: "Instructor", summary: "Teach airplane category training." },
  { id: "cfii", name: "CFII", kind: "Instructor", summary: "Teach instrument flying." },
  { id: "mei", name: "MEI", kind: "Instructor", summary: "Teach multi-engine operations." },
  { id: "cfi-h", name: "CFI — Helicopter", kind: "Instructor", summary: "Teach rotorcraft training." },
  { id: "bgi", name: "Ground Instructor — Basic", kind: "Instructor", summary: "Basic ground knowledge instruction." },
  { id: "agi", name: "Ground Instructor — Advanced", kind: "Instructor", summary: "Advanced ground knowledge instruction." },
  { id: "igi", name: "Instrument Ground Instructor", kind: "Instructor", summary: "Instrument knowledge instruction." }
];

/* Endorsements appear in the tracker (status) and the searchable DB. */
var ENDORSEMENTS = [
  { id: "solo", name: "Solo flight", note: "Instructor authorizes solo in make/model after pre-solo knowledge & proficiency." },
  { id: "solo-xc", name: "Solo cross-country", note: "Authorizes solo cross-country flights with route review." },
  { id: "night-solo", name: "Night solo (where applicable)", note: "Specific authorization for solo night operations during training." },
  { id: "tailwheel", name: "Tailwheel", note: "Required to act as PIC of a tailwheel airplane." },
  { id: "complex", name: "Complex airplane", note: "Retractable gear, flaps, controllable-pitch prop." },
  { id: "hp", name: "High-performance airplane", note: "Engine of more than 200 horsepower." },
  { id: "highalt", name: "High-altitude (pressurized)", note: "Required for many pressurized aircraft above defined altitudes." },
  { id: "flightreview", name: "Flight review", note: "Required every 24 calendar months to act as PIC." },
  { id: "ipc", name: "Instrument proficiency check", note: "Restores instrument currency when it has lapsed." },
  { id: "addclass", name: "Additional category/class", note: "Training endorsement toward a new category or class." },
  { id: "practical", name: "Practical test endorsement", note: "Instructor sign-off to take a checkride." },
  { id: "knowledge", name: "Knowledge test endorsement", note: "Sign-off (when required) to take a knowledge test." },
  { id: "tsa", name: "TSA citizenship/alien flight awareness", note: "Citizenship verification or AFSP steps where applicable." }
];

var CAREER_PATHS = (typeof window !== "undefined" && window.__AV_CAREER_PATHS__) ? window.__AV_CAREER_PATHS__ : [];

/* ---- Safety Center checklists (interactive) ---- */
var IMSAFE_ITEMS = [
  { id: "i", label: "Illness — am I sick or symptomatic in any way?" },
  { id: "m", label: "Medication — anything that could impair me?" },
  { id: "s", label: "Stress — life/work pressure clouding judgment?" },
  { id: "a", label: "Alcohol — within bottle-to-throttle and clearly sober?" },
  { id: "f", label: "Fatigue — genuinely rested, not pushing through?" },
  { id: "e", label: "Emotion/Eating — emotionally steady and fed/hydrated?" }
];
var PAVE_ITEMS = [
  { id: "p", label: "Pilot — current, proficient, and fit (IMSAFE)?" },
  { id: "a", label: "Aircraft — airworthy, fueled, equipped for this flight?" },
  { id: "v", label: "enVironment — weather, terrain, airspace, lighting acceptable?" },
  { id: "e", label: "External pressures — am I free of get-there-itis?" }
];
var FIVEP_ITEMS = [
  { id: "plan", label: "Plan — route, weather, NOTAMs, fuel still valid?" },
  { id: "plane", label: "Plane — systems, fuel, equipment status good?" },
  { id: "pilot", label: "Pilot — still fit and ahead of the aircraft?" },
  { id: "pax", label: "Passengers — comfortable, briefed, not pressuring?" },
  { id: "prog", label: "Programming — avionics/automation set correctly?" }
];

/* ============================================================================
   AIRCRAFT ENCYCLOPEDIA — notable, historical, and popular aircraft.
   cat is used for filtering: airplane, rotorcraft, balloon, glider, poweredlift.
   Facts are kept to well-established history; verify exact figures with sources.
   ========================================================================== */
var AIRCRAFT = (typeof window !== "undefined" && window.__AV_AIRCRAFT__) ? window.__AV_AIRCRAFT__ : [];
function aircraftCats() {
  var seen = {}, out = [];
  for (var i = 0; i < AIRCRAFT.length; i++) { var c = AIRCRAFT[i].cat; if (!seen[c]) { seen[c] = true; out.push(c); } }
  return out;
}
var AIRCRAFT_CAT_LABEL = { airplane: "Airplanes", rotorcraft: "Rotorcraft", balloon: "Lighter-than-air", glider: "Gliders", poweredlift: "Powered-lift" };

/* ============================================================================
   AVIATION HISTORY — a timeline of milestones, grouped by era.
   ========================================================================== */
var HISTORY = (typeof window !== "undefined" && window.__AV_HISTORY__) ? window.__AV_HISTORY__ : [];

/* ============================================================================
   AIRPORT OPERATIONS — the airport environment, markings, lighting, patterns,
   communications, airspace, and safety. Grounded in the AIM, PHAK, and the
   Aeronautical Chart User's Guide. Always operate by current charts and ATC.
   ========================================================================== */
var AIRPORT_OPS = (typeof window !== "undefined" && window.__AV_AIRPORT_OPS__) ? window.__AV_AIRPORT_OPS__ : [];
function airportOpsGroups() {
  var seen = {}, out = [];
  for (var i = 0; i < AIRPORT_OPS.length; i++) { var g = AIRPORT_OPS[i].group; if (!seen[g]) { seen[g] = true; out.push(g); } }
  return out;
}

/* ============================================================================
   AIRPORT DIRECTORY — quick facts on major hubs, notable US fields, and
   iconic or extreme airports worldwide. Elevations are approximate; runway
   and operational details change, so always consult current charts.
   ========================================================================== */
var AIRPORTS = (typeof window !== "undefined" && window.__AV_AIRPORTS__) ? window.__AV_AIRPORTS__ : [];
/* ---- Comprehensive airport directory (OurAirports, public domain / CC0): all US public-use airports + all large & medium airports worldwide. The ~1MB dataset loads in the BACKGROUND from a sibling file (avhype-airports.js) AFTER the app is interactive, so it never blocks initial load. That file sets window.__AVHYPE_AIRPORTS_PACKED, a pipe/tilde-delimited string: code|iata|name|city|region|country|type|elev, records joined by ~. ---- */
function airportGroups() {
  var seen = {}, out = [];
  for (var i = 0; i < AIRPORTS.length; i++) { var g = AIRPORTS[i].group; if (!seen[g]) { seen[g] = true; out.push(g); } }
  return out;
}
function airportGroupTint(t, group) {
  if (group === "Major US hubs") return t.sky;
  if (group === "Major world hubs") return t.magenta;
  if (group === "Notable US airports") return t.green;
  if (group === "Iconic & extreme") return t.amber;
  return t.sky;
}
/* ---- Directory DB helpers (AIRPORTS_DB rows: [code, iata, name, city, region, country, typeChar, elev]) ---- */
function airportTypeLabel(c) {
  if (c === "L") return "Major / large";
  if (c === "M") return "Regional / medium";
  return "GA & local";
}
function airportTypeTint(t, c) {
  if (c === "L") return t.sky;
  if (c === "M") return t.magenta;
  return t.green;
}
/* Airport directory data loads lazily in the background from avhype-airports.js (a sibling file)
   so the app starts instantly. Status: idle | loading | ready | error. */
var AIRPORTS_DB = null;
var AIRPORTS_DB_STATUS = "idle";
var __airportsListeners = [];
function onAirportsChange(fn) { __airportsListeners.push(fn); }
function notifyAirports() { for (var i = 0; i < __airportsListeners.length; i++) { try { __airportsListeners[i](); } catch (e) {} } }
function airportsPacked() { return (typeof window !== "undefined" && window.__AVHYPE_AIRPORTS_PACKED) ? window.__AVHYPE_AIRPORTS_PACKED : ""; }
function loadAirportsData() {
  if (AIRPORTS_DB_STATUS === "ready" || AIRPORTS_DB_STATUS === "loading") return;
  if (airportsPacked()) { AIRPORTS_DB_STATUS = "ready"; notifyAirports(); return; }
  if (typeof document === "undefined") { return; }
  AIRPORTS_DB_STATUS = "loading"; notifyAirports();
  var s = document.createElement("script");
  s.src = "avhype-airports.js";
  s.async = true;
  s.onload = function () { AIRPORTS_DB = null; AIRPORTS_DB_STATUS = airportsPacked() ? "ready" : "error"; notifyAirports(); };
  s.onerror = function () { AIRPORTS_DB_STATUS = "error"; notifyAirports(); };
  (document.head || document.body).appendChild(s);
}
function airportsDB() {
  if (AIRPORTS_DB !== null) return AIRPORTS_DB;
  var packed = airportsPacked();
  if (!packed) return [];
  var out = [];
  var recs = packed.split("~");
  for (var i = 0; i < recs.length; i++) {
    var f = recs[i].split("|");
    out.push([f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7]]);
  }
  AIRPORTS_DB = out;
  AIRPORTS_DB_STATUS = "ready";
  return AIRPORTS_DB;
}
var AIRPORTS_DB_IDX = null;
function airportsIdx() {
  if (AIRPORTS_DB_IDX) return AIRPORTS_DB_IDX;
  var db = airportsDB();
  var idx = [];
  for (var i = 0; i < db.length; i++) {
    var a = db[i];
    idx.push(normAnswer(a[0] + a[1] + a[2] + a[3] + a[4]));
  }
  AIRPORTS_DB_IDX = idx;
  return idx;
}
function searchAirportsDB(needle, typeFilter, cap) {
  var out = [];
  if (!needle || needle.length < 2) return out;
  var db = airportsDB();
  var idx = airportsIdx();
  for (var i = 0; i < db.length; i++) {
    var a = db[i];
    if (typeFilter !== "all" && a[6] !== typeFilter) continue;
    if (idx[i].indexOf(needle) > -1) { out.push(a); if (out.length >= cap) break; }
  }
  return out;
}
function browseAirportsDB(typeFilter, cap) {
  var out = [];
  var db = airportsDB();
  for (var i = 0; i < db.length; i++) {
    var a = db[i];
    if (typeFilter !== "all" && a[6] !== typeFilter) continue;
    out.push(a); if (out.length >= cap) break;
  }
  return out;
}

/* ============================================================================
   PREFLIGHT CHECKLIST — two parallel rituals. "Before you fly" is a study
   illustration of a typical light-aircraft preflight flow (not a substitute
   for an aircraft's approved checklist). "Before you study" mirrors the same
   structure so the discipline carries over. Anchored by the 1935 Boeing 299
   crash that gave us the cockpit checklist.
   ========================================================================== */
var PREFLIGHT = (typeof window !== "undefined" && window.__AV_PREFLIGHT__) ? window.__AV_PREFLIGHT__ : {};

/* ============================================================================
   WEATHER — reading reports, the atmosphere, clouds, hazards, fronts, and
   weather services. Grounded in the PHAK and AIM. For study; always get an
   official weather briefing and current products before any flight.
   ========================================================================== */
var WEATHER = (typeof window !== "undefined" && window.__AV_WEATHER__) ? window.__AV_WEATHER__ : [];
function weatherGroups() {
  var seen = {}, out = [];
  for (var i = 0; i < WEATHER.length; i++) { var g = WEATHER[i].group; if (!seen[g]) { seen[g] = true; out.push(g); } }
  return out;
}

/* ============================================================================
   NAVIGATION — charts, the compass, pilotage and dead reckoning, radio and
   satellite navigation, and planning. Grounded in the PHAK, Instrument Flying
   Handbook, AIM, and Chart User's Guide. For study; fly current charts.
   ========================================================================== */
var NAV = (typeof window !== "undefined" && window.__AV_NAV__) ? window.__AV_NAV__ : [];
function navGroups() {
  var seen = {}, out = [];
  for (var i = 0; i < NAV.length; i++) { var g = NAV[i].group; if (!seen[g]) { seen[g] = true; out.push(g); } }
  return out;
}

/* ============================================================================
   UI PRIMITIVES + SIGNATURE ELEMENTS
   ========================================================================== */
var ThemeContext = React.createContext(THEMES.dark);
function useT() {
  return React.useContext(ThemeContext);
}

/* --- pathway / nav glyphs (inline SVG, no external assets) --------------- */
function Glyph(props) {
  var name = props.name;
  var s = props.size || 22;
  var c = props.color || "currentColor";
  var sw = props.stroke || 1.8;
  var common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "wing") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M2 13l9-2 3-7 1 0 1 7 6 2-6 1-1 5-1 0-3-5-9-1z" }));
  }
  if (name === "rotor") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 12, cy: 12, r: 2 }),
      React.createElement("path", { d: "M12 10V3M12 14v7M10 12H3M14 12h7" }),
      React.createElement("circle", { cx: 12, cy: 3, r: 1.4 }),
      React.createElement("circle", { cx: 12, cy: 21, r: 1.4 }),
      React.createElement("circle", { cx: 3, cy: 12, r: 1.4 }),
      React.createElement("circle", { cx: 21, cy: 12, r: 1.4 }));
  }
  if (name === "heli") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 6h18M12 6v3" }),
      React.createElement("path", { d: "M6 12c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3-6-1.3-6-3z" }),
      React.createElement("path", { d: "M12 15v3h6M16 18v2" }));
  }
  if (name === "learn") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 7l9-4 9 4-9 4-9-4z" }),
      React.createElement("path", { d: "M21 7v6M7 9v5c0 1.5 2.5 3 5 3s5-1.5 5-3V9" }));
  }
  if (name === "practice") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M9 11l3 3 6-7" }),
      React.createElement("rect", { x: 3, y: 4, width: 18, height: 16, rx: 2 }));
  }
  if (name === "log") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M5 4h11l3 3v13H5z" }),
      React.createElement("path", { d: "M9 9h6M9 13h6M9 17h4" }));
  }
  if (name === "library") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M4 5h5v14H4zM10 5h4v14h-4zM16 6l4 1-2 13-4-1z" }));
  }
  if (name === "safety") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" }),
      React.createElement("path", { d: "M9 12l2 2 4-4" }));
  }
  if (name === "more") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 5, cy: 12, r: 1.6 }),
      React.createElement("circle", { cx: 12, cy: 12, r: 1.6 }),
      React.createElement("circle", { cx: 19, cy: 12, r: 1.6 }));
  }
  if (name === "menu") {
    return React.createElement("svg", common,
      React.createElement("line", { x1: 3.5, y1: 7, x2: 20.5, y2: 7 }),
      React.createElement("line", { x1: 3.5, y1: 12, x2: 20.5, y2: 12 }),
      React.createElement("line", { x1: 3.5, y1: 17, x2: 20.5, y2: 17 }));
  }
  if (name === "arcade") {
    return React.createElement("svg", common,
      React.createElement("rect", { x: 2.5, y: 7.5, width: 19, height: 9, rx: 4.5 }),
      React.createElement("line", { x1: 7, y1: 10.3, x2: 7, y2: 13.7 }),
      React.createElement("line", { x1: 5.3, y1: 12, x2: 8.7, y2: 12 }),
      React.createElement("circle", { cx: 16.2, cy: 10.8, r: 1.05, fill: c, stroke: "none" }),
      React.createElement("circle", { cx: 18.4, cy: 13.2, r: 1.05, fill: c, stroke: "none" }));
  }
  if (name === "flame") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M12 3c1 3-2 4-2 7a2 2 0 104 0c0-1 1-1 1 0 2 2 1 8-3 9-4 1-7-2-7-6 0-4 4-6 7-10z" }));
  }
  if (name === "bolt") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M13 3L5 13h5l-1 8 8-11h-5z" }));
  }
  if (name === "lock") {
    return React.createElement("svg", common,
      React.createElement("rect", { x: 5, y: 11, width: 14, height: 9, rx: 2 }),
      React.createElement("path", { d: "M8 11V8a4 4 0 018 0v3" }));
  }
  if (name === "check") {
    return React.createElement("svg", common, React.createElement("path", { d: "M5 12l4 4 10-11" }));
  }
  if (name === "checklist") {
    return React.createElement("svg", common,
      React.createElement("rect", { x: 5, y: 5, width: 14, height: 15.5, rx: 2 }),
      React.createElement("path", { d: "M10 3.6h4a1 1 0 011 1V6H9V4.6a1 1 0 011-1z" }),
      React.createElement("path", { d: "M8.6 11l1.3 1.3 2.5-3" }),
      React.createElement("path", { d: "M8.6 15.6l1.3 1.3 2.5-3" }));
  }
  if (name === "ext") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M14 5h5v5M19 5l-8 8M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" }));
  }
  if (name === "x") {
    return React.createElement("svg", common, React.createElement("path", { d: "M6 6l12 12M18 6L6 18" }));
  }
  if (name === "back") {
    return React.createElement("svg", common, React.createElement("path", { d: "M15 5l-7 7 7 7" }));
  }
  if (name === "search") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 11, cy: 11, r: 7 }),
      React.createElement("path", { d: "M21 21l-4.3-4.3" }));
  }
  if (name === "glider") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M2 12l10-1.6 10 1.6-10 1.6z" }),
      React.createElement("path", { d: "M12 10.4V7M12 13.6v2.2M10.5 16h3" }));
  }
  if (name === "balloon") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M12 3c3.3 0 6 2.7 6 6 0 4-4 7-6 8-2-1-6-4-6-8 0-3.3 2.7-6 6-6z" }),
      React.createElement("path", { d: "M10 17h4M10.6 17l.6 3h1.6l.6-3" }));
  }
  if (name === "gyro") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 8h18" }),
      React.createElement("path", { d: "M12 8v4" }),
      React.createElement("circle", { cx: 12, cy: 15, r: 3 }),
      React.createElement("path", { d: "M15 15h4" }));
  }
  if (name === "poweredlift") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M4 14h16" }),
      React.createElement("path", { d: "M8 14V8M8 8l-2 2M8 8l2 2" }),
      React.createElement("path", { d: "M16 14V8M16 8l-2 2M16 8l2 2" }));
  }
  if (name === "weightshift") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 8h18l-9 4z" }),
      React.createElement("path", { d: "M12 12v3" }),
      React.createElement("circle", { cx: 9, cy: 17, r: 1.5 }),
      React.createElement("circle", { cx: 15, cy: 17, r: 1.5 }));
  }
  if (name === "poweredchute") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 8c3-3 15-3 18 0" }),
      React.createElement("path", { d: "M5 8l5 7M19 8l-5 7" }),
      React.createElement("path", { d: "M10 15h4" }),
      React.createElement("circle", { cx: 12, cy: 17, r: 1.4 }));
  }
  if (name === "clock") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 12, cy: 12, r: 9 }),
      React.createElement("path", { d: "M12 7v5l3.5 2" }));
  }
  if (name === "runway") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M9 4h6v16H9z" }),
      React.createElement("path", { d: "M12 6.5v2.5M12 11v2.5M12 15.5v2" }));
  }
  if (name === "tower") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M8 21h8" }),
      React.createElement("path", { d: "M10 21V10.5M14 21V10.5" }),
      React.createElement("path", { d: "M9 10.5h6l-1.4-3h-3.2z" }),
      React.createElement("path", { d: "M12 7.5V4" }));
  }
  if (name === "radio") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 12, cy: 12, r: 1.3 }),
      React.createElement("path", { d: "M9.2 9.2a4 4 0 000 5.6M14.8 9.2a4 4 0 010 5.6" }),
      React.createElement("path", { d: "M7 7a7 7 0 000 10M17 7a7 7 0 010 10" }));
  }
  if (name === "light") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 12, cy: 12, r: 3.2 }),
      React.createElement("path", { d: "M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6" }));
  }
  if (name === "wind") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 9h11.5a2.2 2.2 0 10-2.2-3.2" }),
      React.createElement("path", { d: "M3 13h14.5a2.2 2.2 0 11-2.2 3.2" }),
      React.createElement("path", { d: "M3 17h8" }));
  }
  if (name === "airspace") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M4 8h16M6 12.5h12M8 17h8" }));
  }
  if (name === "sign") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M6 4.5h12v6H6z" }),
      React.createElement("path", { d: "M12 10.5v9" }),
      React.createElement("path", { d: "M8.5 6.6h7M8.5 8.6h4.5" }));
  }
  if (name === "pattern") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M6 8h12v8H6z" }),
      React.createElement("path", { d: "M13.4 8l1.6-1.7 1.6 1.7" }));
  }
  if (name === "pin") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M12 21s6.5-6 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15 12 21 12 21z" }),
      React.createElement("circle", { cx: 12, cy: 10.5, r: 2.4 }));
  }
  if (name === "cloud") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M7 18h9.5a3.8 3.8 0 00.3-7.6 5.6 5.6 0 00-10.7 1.2A3.6 3.6 0 007 18z" }));
  }
  if (name === "bolt") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M13 2.5l-7 11h5l-1 8 8-12h-6z" }));
  }
  if (name === "compass") {
    return React.createElement("svg", common,
      React.createElement("circle", { cx: 12, cy: 12, r: 9 }),
      React.createElement("path", { d: "M12 7.5l2.4 5.1-2.4 4-2.4-4z" }),
      React.createElement("circle", { cx: 12, cy: 12, r: 0.6 }));
  }
  if (name === "wings-badge") {
    return React.createElement("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: c },
      React.createElement("path", { d: "M12 8a2 2 0 100 4 2 2 0 000-4zM10 10L2 12l8 1 1 2 1-2 8-1-8-2-1-2z" }));
  }
  if (name === "hangar") {
    return React.createElement("svg", common,
      React.createElement("path", { d: "M3 20.5V12.4C3 7.8 21 7.8 21 12.4V20.5" }),
      React.createElement("path", { d: "M2.5 20.5h19" }),
      React.createElement("path", { d: "M8.5 20.5V14.6C8.5 11.7 15.5 11.7 15.5 14.6V20.5" }));
  }
  return null;
}

/* --- SIGNATURE: Attitude Indicator. Fill = progress (more sky = more done) - */
function AttitudeIndicator(props) {
  var t = useT();
  var size = props.size || 84;
  var p = clamp(props.pct || 0, 0, 100);
  var r = size / 2 - 3;
  var cx = size / 2;
  var cy = size / 2;
  var horizonY = cy - r + (r * 2) * (1 - p / 100);
  var clipId = "att" + (props.idn || "0");
  return React.createElement("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size },
    React.createElement("defs", null,
      React.createElement("clipPath", { id: clipId },
        React.createElement("circle", { cx: cx, cy: cy, r: r }))),
    React.createElement("g", { clipPath: "url(#" + clipId + ")" },
      React.createElement("rect", { x: 0, y: 0, width: size, height: horizonY, fill: t.sky }),
      React.createElement("rect", { x: 0, y: horizonY, width: size, height: size - horizonY, fill: t.ground }),
      React.createElement("line", { x1: 0, y1: horizonY, x2: size, y2: horizonY, stroke: "#FFFFFF", strokeWidth: 1.5, opacity: 0.85 }),
      React.createElement("line", { x1: cx, y1: horizonY - 6, x2: cx, y2: horizonY + 6, stroke: "#FFFFFF", strokeWidth: 1, opacity: 0.5 })),
    React.createElement("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: t.line, strokeWidth: 3 }),
    React.createElement("path", { d: "M" + (cx - 12) + " " + cy + " l6 0 l3 4 l3 -4 l6 0", fill: "none", stroke: t.amber, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }),
    React.createElement("circle", { cx: cx, cy: cy, r: 1.6, fill: t.amber }));
}

/* --- Circular readiness gauge (checkride readiness) --------------------- */
function Gauge(props) {
  var t = useT();
  var size = props.size || 120;
  var v = clamp(props.value || 0, 0, 100);
  var stroke = 9;
  var r = (size - stroke) / 2;
  var cx = size / 2;
  var circ = 2 * Math.PI * r;
  var off = circ * (1 - v / 100);
  var col = v >= 80 ? t.green : v >= 40 ? t.amber : t.magenta;
  return React.createElement("div", { style: { position: "relative", width: size, height: size } },
    React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" } },
      React.createElement("circle", { cx: cx, cy: cx, r: r, fill: "none", stroke: t.line, strokeWidth: stroke }),
      React.createElement("circle", { cx: cx, cy: cx, r: r, fill: "none", stroke: col, strokeWidth: stroke, strokeLinecap: "round", strokeDasharray: circ, strokeDashoffset: off, style: { transition: "stroke-dashoffset .6s ease" } })),
    React.createElement("div", { style: { position: "absolute", top: 0, left: 0, width: size, height: size, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } },
      React.createElement("div", { style: { fontFamily: MONO, fontSize: size * 0.26, fontWeight: 700, color: t.text, lineHeight: 1 } }, Math.round(v)),
      React.createElement("div", { style: { fontSize: 10, color: t.textDim, letterSpacing: 0.5 } }, props.unit || "% ready")));
}

/* --- linear progress bar ------------------------------------------------ */
function Bar(props) {
  var t = useT();
  var col = props.color || t.sky;
  return React.createElement("div", { style: { height: props.h || 8, background: t.line, borderRadius: 99, overflow: "hidden", width: "100%" } },
    React.createElement("div", { style: { height: "100%", width: clamp(props.pct || 0, 0, 100) + "%", background: col, borderRadius: 99, transition: "width .5s ease" } }));
}

/* --- small building blocks ---------------------------------------------- */
function Chip(props) {
  var t = useT();
  return React.createElement("span", { style: sx({ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, padding: "3px 9px", borderRadius: 99, border: "1px solid " + t.line, color: props.color || t.textDim, background: props.bg || "transparent", fontFamily: props.mono ? MONO : SANS }, props.style) }, props.children);
}

function Btn(props) {
  var t = useT();
  var kind = props.kind || "primary";
  var base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: SANS, fontSize: props.small ? 13 : 15, fontWeight: 700, letterSpacing: 0.2, padding: props.small ? "8px 14px" : "13px 18px", borderRadius: 12, cursor: props.disabled ? "not-allowed" : "pointer", border: "1px solid transparent", width: props.full ? "100%" : "auto", opacity: props.disabled ? 0.45 : 1, transition: "transform .08s ease, background .15s ease", userSelect: "none" };
  var styleByKind = {
    primary: { background: t.sky, color: "#fff" },
    go: { background: t.green, color: "#fff" },
    ghost: { background: "transparent", color: t.text, border: "1px solid " + t.line },
    soft: { background: t.panelHi, color: t.text, border: "1px solid " + t.line },
    danger: { background: "transparent", color: t.red, border: "1px solid " + t.red }
  };
  function onClick(e) {
    if (props.disabled) return;
    if (props.onClick) props.onClick(e);
  }
  return React.createElement("button", { onClick: onClick, disabled: props.disabled, style: sx(base, styleByKind[kind], props.style) }, props.children);
}

function Card(props) {
  var t = useT();
  return React.createElement("div", { onClick: props.onClick, style: sx({ background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: props.pad || 16, cursor: props.onClick ? "pointer" : "default", boxShadow: props.raised ? t.shadow : "none" }, props.style) }, props.children);
}

function SectionLabel(props) {
  var t = useT();
  return React.createElement("div", { style: sx({ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: t.textFaint, marginBottom: 8 }, props.style) }, props.children);
}

function BrandLogo(props) {
  var t = useT();
  var src = props.mark ? LOGO_MARK : LOGO_FULL;
  if (!src) { return props.mark ? React.createElement(Glyph, { name: "wings-badge", size: props.w || 40, color: t.sky }) : null; }
  var border = (t.name === "light") ? ("1px solid " + t.line) : "none";
  return React.createElement("div", { style: { background: "#FFFFFF", borderRadius: props.radius != null ? props.radius : 14, padding: props.pad != null ? props.pad : 12, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: props.shadow != null ? props.shadow : "0 4px 14px rgba(8,20,40,0.18)", border: border } },
    React.createElement("img", { src: src, alt: "AvHype Aviation", style: { display: "block", width: props.w || 160, height: "auto" } }));
}

function ComplianceBanner(props) {
  var t = useT();
  return React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", background: t.name === "dark" ? "rgba(242,183,5,0.07)" : "rgba(201,138,0,0.10)", border: "1px solid " + (t.name === "dark" ? "rgba(242,183,5,0.25)" : "rgba(201,138,0,0.3)"), borderRadius: 12, padding: "10px 12px", margin: props.margin || "0 0 14px 0" } },
    React.createElement("div", { style: { color: t.amber, flexShrink: 0, marginTop: 1 } }, React.createElement(Glyph, { name: "safety", size: 16, color: t.amber })),
    React.createElement("div", { style: { fontSize: 11.5, lineHeight: 1.5, color: t.textDim } }, props.text || COMPLIANCE_TEXT));
}

function AgreementGate(props) {
  var t = useT();
  return React.createElement("div", { style: { minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 18px", fontFamily: SANS } },
    React.createElement("div", { style: { maxWidth: 460, width: "100%", background: t.bg2, border: "1px solid " + t.line, borderRadius: 20, padding: "26px 22px", boxShadow: t.shadow } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 } },
        React.createElement(BrandLogo, { mark: true, w: 54, pad: 7, radius: 11 }),
        React.createElement("div", null,
          React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: t.text, lineHeight: 1.05 } }, BRAND),
          React.createElement("div", { style: { fontSize: 12.5, color: t.magenta, fontWeight: 700 } }, TAGLINE))),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 11 } },
        React.createElement(Glyph, { name: "safety", size: 18, color: t.amber }),
        React.createElement("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, "Before you start")),
      React.createElement("p", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.textDim, margin: "0 0 18px" } }, COMPLIANCE_TEXT),
      React.createElement(Btn, { kind: "go", full: true, onClick: props.onAgree }, "I understand and agree"),
      React.createElement("div", { style: { fontSize: 11, color: t.textFaint, textAlign: "center", marginTop: 12, lineHeight: 1.5 } }, "Not affiliated with the FAA. You will see this each time you open " + BRAND + ".")));
}

function SourceLink(props) {
  var t = useT();
  function open() {
    try { window.open(props.url, "_blank", "noopener"); } catch (e) {}
  }
  return React.createElement("button", { onClick: open, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: t.sky, fontFamily: SANS, fontSize: props.small ? 12 : 13, fontWeight: 600, cursor: "pointer", padding: 0, textAlign: "left" } },
    props.children,
    React.createElement(Glyph, { name: "ext", size: props.small ? 12 : 13, color: t.sky }));
}

function Modal(props) {
  var t = useT();
  if (!props.open) return null;
  function backdrop(e) {
    if (e.target === e.currentTarget && props.onClose) props.onClose();
  }
  return React.createElement("div", { onClick: backdrop, style: { position: "fixed", inset: 0, background: "rgba(4,8,12,0.66)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 0 } },
    React.createElement("div", { style: { background: t.bg2, borderTop: "1px solid " + t.line, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto", boxShadow: t.shadow } },
      React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: "10px 0 2px" } },
        React.createElement("div", { style: { width: 38, height: 4, borderRadius: 99, background: t.line } })),
      React.createElement("div", { style: { padding: "8px 18px 22px" } },
        (props.title ? React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
          React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: t.text } }, props.title),
          React.createElement("button", { onClick: props.onClose, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textDim } }, React.createElement(Glyph, { name: "x", size: 20, color: t.textDim }))) : null),
        props.children)));
}

/* helper: pathway meta lookup */
function pathMeta(id) {
  for (var i = 0; i < PATHWAYS.length; i++) if (PATHWAYS[i].id === id) return PATHWAYS[i];
  if (id === "foundation") return { id: "foundation", label: "Foundation", glyph: "learn", tint: "sky" };
  return PATHWAYS[0];
}
function tintColor(t, tint) {
  if (tint === "magenta") return t.magenta;
  if (tint === "amber") return t.amber;
  if (tint === "green") return t.green;
  if (tint === "red") return t.red;
  return t.sky;
}

/* ============================================================================
   PART 5 — ONBOARDING, LEARN (skill map), LESSON VIEW, QUIZ ENGINE
   Rendered with a compact h() alias for React.createElement.
   ========================================================================== */

var h = React.createElement;

/* resolve a lesson's FAA source id to its source record */
function faaSourceById(id) {
  for (var i = 0; i < FAA_SOURCES.length; i++) if (FAA_SOURCES[i].id === id) return FAA_SOURCES[i];
  return { id: id, code: "FAA", title: "FAA reference", url: EXTERNAL_LINKS.faaHandbooksIndex };
}

/* progress record for a lesson with safe defaults */
function progFor(state, id) {
  var p = state && state.lessons ? state.lessons[id] : null;
  if (!p) return { done: false, best: 0, attempts: 0, mastery: 0, last: null };
  return p;
}

function masteryLabel(m) {
  if (m >= 90) return "Mastered";
  if (m >= 80) return "Proficient";
  if (m >= 50) return "Developing";
  if (m > 0) return "Needs work";
  return "Not started";
}

function unitDoneCount(state, unit) {
  var n = 0;
  unit.lessons.forEach(function (id) { if (progFor(state, id).done) n += 1; });
  return n;
}
function unitAvgMastery(state, unit) {
  var sum = 0, n = 0;
  unit.lessons.forEach(function (id) {
    var p = progFor(state, id);
    if (p.done) { sum += p.mastery; n += 1; }
  });
  return n === 0 ? 0 : Math.round(sum / n);
}
/* a lesson is unlocked if it is first in its unit or the previous one is done */
function lessonUnlocked(state, unit, idx) {
  if (idx <= 0) return true;
  return progFor(state, unit.lessons[idx - 1]).done;
}

/* units relevant to the user's chosen pathways, foundation first */
function unitsForState(state) {
  var paths = (state && state.profile && state.profile.pathways) ? state.profile.pathways : [];
  var out = [];
  UNITS.forEach(function (u) { if (u.pathway === "foundation") out.push(u); });
  paths.forEach(function (p) {
    UNITS.forEach(function (u) { if (u.pathway === p) out.push(u); });
  });
  return out;
}

/* Next lesson in the learner's sequence (across units), or null at the end. */
function nextLessonId(state, lessonId) {
  var units = unitsForState(state);
  var seq = [];
  units.forEach(function (u) { u.lessons.forEach(function (id) { seq.push(id); }); });
  var i = seq.indexOf(lessonId);
  if (i < 0 || i + 1 >= seq.length) { return null; }
  return seq[i + 1];
}

/* --------------------------------------------------------------- onboarding */
/* ===================== "find your path" guided recommender ===================== */
var PATH_FINDER_Q = [
  { id: "q-fun", label: "Fly for fun, freedom, and personal adventure", w: { airplane: 3, weightshift: 1, gyroplane: 1 } },
  { id: "q-career", label: "Build a career and get paid to fly", w: { airplane: 3, helicopter: 2 } },
  { id: "q-travel", label: "Travel cross-country to visit new places", w: { airplane: 3 } },
  { id: "q-passengers", label: "Take friends and family flying with me", w: { airplane: 2, helicopter: 1, balloon: 1 } },
  { id: "q-drone-work", label: "Do photo, video, mapping, or inspection work with drones", w: { drone: 4 } },
  { id: "q-drone-hobby", label: "Fly camera drones as a hobby", w: { drone: 3 } },
  { id: "q-heli", label: "Hover, land almost anywhere, and fly helicopters", w: { helicopter: 4 } },
  { id: "q-utility", label: "Rescue, news, tours, or other utility flying", w: { helicopter: 3, airplane: 1 } },
  { id: "q-nomedical", label: "Fly without needing an FAA medical certificate", w: { glider: 2, balloon: 2, weightshift: 1, poweredchute: 1, gyroplane: 1 } },
  { id: "q-soar", label: "Quiet, engine-free soaring on rising air", w: { glider: 4 } },
  { id: "q-balloon", label: "Drift peacefully in a hot-air balloon", w: { balloon: 4 } },
  { id: "q-simple", label: "Get airborne as simply and affordably as possible", w: { poweredchute: 3, weightshift: 2, gyroplane: 1 } },
  { id: "q-openair", label: "Open-air, \u201Cmotorcycle of the sky\u201D flying", w: { weightshift: 3, gyroplane: 2, poweredchute: 1 } },
  { id: "q-gyro", label: "A rotorcraft that can't stall the way a helicopter can", w: { gyroplane: 4 } },
  { id: "q-evtol", label: "Fly cutting-edge electric air taxis (eVTOL)", w: { poweredlift: 4 } },
  { id: "q-tech", label: "Be on the front edge of new aviation technology", w: { poweredlift: 2, drone: 1 } }
];
function pathFinderRanked(sel) {
  var scores = {};
  PATHWAYS.forEach(function (p) { scores[p.id] = 0; });
  sel.forEach(function (qid) {
    for (var i = 0; i < PATH_FINDER_Q.length; i++) {
      if (PATH_FINDER_Q[i].id === qid) {
        var w = PATH_FINDER_Q[i].w;
        for (var k in w) if (Object.prototype.hasOwnProperty.call(w, k)) scores[k] = scores[k] + w[k];
      }
    }
  });
  var ranked = PATHWAYS.map(function (p) { return { id: p.id, score: scores[p.id] }; });
  ranked.sort(function (a, b) { return b.score - a.score; });
  return ranked;
}
function pathFinderReasons(sel, pid) {
  var out = [];
  sel.forEach(function (qid) {
    for (var i = 0; i < PATH_FINDER_Q.length; i++) {
      if (PATH_FINDER_Q[i].id === qid && PATH_FINDER_Q[i].w[pid]) out.push(PATH_FINDER_Q[i].label);
    }
  });
  return out;
}

function PathFinder(props) {
  var t = useT();
  var selState = useState([]);
  var sel = selState[0], setSel = selState[1];
  var showState = useState(false);
  var showRes = showState[0], setShowRes = showState[1];
  var rootRef = useRef(null);
  useEffect(function () { if (rootRef.current && rootRef.current.scrollIntoView) { try { rootRef.current.scrollIntoView({ block: "start" }); } catch (e) {} } }, [showRes]);
  function toggle(id) { var n = sel.slice(); var at = n.indexOf(id); if (at > -1) n.splice(at, 1); else n.push(id); setSel(n); }

  if (showRes) {
    var ranked = pathFinderRanked(sel);
    var top = ranked[0];
    if (!top || top.score === 0) top = { id: "airplane", score: 0 };
    var second = (ranked[1] && ranked[1].score > 0 && ranked[1].id !== top.id) ? ranked[1] : null;
    var reasons = pathFinderReasons(sel, top.id).slice(0, 3);

    function bigCard(id, isTop) {
      var meta = pathMeta(id);
      var tnt = tintColor(t, meta.tint);
      function pick() { if (props.onPick) props.onPick(id); }
      return h("div", { style: { padding: "16px", borderRadius: 16, marginBottom: 12, background: isTop ? (t.name === "dark" ? tnt + "14" : tnt + "10") : t.panel, border: "1px solid " + (isTop ? tnt + "66" : t.line) } },
        h("div", { style: { display: "flex", alignItems: "center", gap: 13, marginBottom: 10 } },
          h("div", { style: { width: 48, height: 48, borderRadius: 13, background: tnt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: meta.glyph, size: 28, color: "#fff" })),
          h("div", { style: { flex: 1 } },
            isTop ? h("div", { style: { fontFamily: MONO, fontSize: 10, fontWeight: 800, letterSpacing: 1, color: tnt } }, "BEST MATCH") : h("div", { style: { fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: t.textFaint } }, "ALSO A STRONG FIT"),
            h("div", { style: { fontSize: 17, fontWeight: 900, color: t.text } }, meta.label))),
        h("div", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.5, marginBottom: 12 } }, meta.blurb),
        h(Btn, { kind: isTop ? "go" : "soft", full: true, onClick: pick }, isTop ? ("Start with " + meta.label + " \u2192") : ("Choose " + meta.label + " instead")));
    }

    return h("div", { ref: rootRef },
      h("div", { style: { fontSize: 14, color: t.text, lineHeight: 1.55, marginBottom: 14 } }, "Based on what matters to you, here's where we'd start:"),
      bigCard(top.id, true),
      reasons.length > 0 ? h("div", { style: { marginBottom: 14 } },
        h("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: t.textFaint, textTransform: "uppercase", marginBottom: 7 } }, "Why this fits"),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 7 } }, reasons.map(function (r, i) {
          return h("div", { key: i, style: { fontSize: 12, color: t.textDim, background: t.panel, border: "1px solid " + t.line, borderRadius: 99, padding: "6px 11px" } }, r);
        }))) : null,
      second ? bigCard(second.id, false) : null,
      h("div", { style: { height: 2 } }),
      h(Btn, { kind: "ghost", full: true, onClick: function () { setShowRes(false); } }, "\u2190 Back to the questions"),
      h("div", { style: { fontSize: 12, color: t.textFaint, textAlign: "center", marginTop: 12, lineHeight: 1.5 } }, "Nothing here is final \u2014 you can change or add paths anytime."));
  }

  return h("div", { ref: rootRef },
    h("div", { style: { fontSize: 14, color: t.textDim, lineHeight: 1.55, marginBottom: 14 } }, "Tick everything that sounds like you. We'll point you to the training path that fits best."),
    PATH_FINDER_Q.map(function (q) {
      var on = sel.indexOf(q.id) > -1;
      function tap() { toggle(q.id); }
      return h("div", { key: q.id, onClick: tap, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 13px", marginBottom: 8, borderRadius: 12, cursor: "pointer", background: t.panel, border: "1.5px solid " + (on ? t.sky : t.line) } },
        h("div", { style: { width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: "2px solid " + (on ? t.sky : t.line), background: on ? t.sky : "transparent", display: "flex", alignItems: "center", justifyContent: "center" } }, on ? h(Glyph, { name: "check", size: 13, color: "#fff" }) : null),
        h("div", { style: { fontSize: 13.5, color: t.text, fontWeight: 600, lineHeight: 1.35 } }, q.label));
    }),
    h("div", { style: { height: 2 } }),
    h(Btn, { kind: "primary", full: true, disabled: sel.length === 0, onClick: function () { setShowRes(true); } }, sel.length === 0 ? "Pick at least one" : "See my recommendation \u2192"),
    props.onClose ? h("div", { style: { marginTop: 8 } }, h(Btn, { kind: "ghost", full: true, onClick: props.onClose }, "Cancel")) : null);
}

function PathFinderScreen(props) {
  var t = useT();
  return h("div", null,
    h(SubHeader, { title: "Find your path", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, lineHeight: 1.55, margin: "0 0 16px" } }, "Not sure which kind of flying is for you? Answer a few quick questions and we'll recommend the best training path to start with \u2014 and add it to your roadmap."),
    h(PathFinder, { onPick: function (id) { if (props.onApply) props.onApply(id); } }));
}

function TrainingGoalsScreen(props) {
  var t = useT();
  var state = props.state;
  var init = (state.profile && state.profile.goals) ? state.profile.goals.slice() : [];
  var selState = useState(init);
  var sel = selState[0], setSel = selState[1];
  var paths = (state.profile && state.profile.pathways) ? state.profile.pathways : [];
  function toggle(id) { var n = sel.slice(); var at = n.indexOf(id); if (at > -1) n.splice(at, 1); else n.push(id); setSel(n); }
  function save() { if (props.onSave) props.onSave(sel); }
  return h("div", null,
    h(SubHeader, { title: "Get more out of your training", onBack: props.onBack }),
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "14px 15px", borderRadius: 14, marginBottom: 16, background: t.name === "dark" ? "rgba(242,183,5,0.08)" : "rgba(201,138,0,0.08)", border: "1px solid " + t.amber } },
      h(Glyph, { name: "wings-badge", size: 26, color: t.amber }),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, "You've reached Flight Level 10"),
        h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4 } }, "Tell us where you're headed and we'll sharpen what we point you toward next."))),
    h("p", { style: { color: t.textDim, fontSize: 13.5, lineHeight: 1.55, margin: "0 0 16px" } }, "Pick the certificates, ratings, and skills you're aiming for. Nothing here is a commitment \u2014 update it anytime."),
    GOAL_GROUPS.map(function (grp) {
      var items = grp.items.filter(function (it) { return !it.path || paths.indexOf(it.path) > -1; });
      if (items.length === 0) return null;
      return h("div", { key: grp.group, style: { marginBottom: 16 } },
        h(SectionLabel, { style: { color: t.textDim } }, grp.group),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          items.map(function (it) {
            var on = sel.indexOf(it.id) > -1;
            function tap() { toggle(it.id); }
            return h("button", { key: it.id, onClick: tap, style: { fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: "9px 13px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text } }, it.label);
          })));
    }),
    h("div", { style: { height: 6 } }),
    h(Btn, { kind: "primary", full: true, onClick: save }, sel.length ? ("Save " + sel.length + " goal" + (sel.length === 1 ? "" : "s")) : "Save"));
}

function Onboarding(props) {
  var t = useT();
  var stepState = useState(0);
  var step = stepState[0], setStep = stepState[1];
  var ackState = useState(false);
  var ack = ackState[0], setAck = ackState[1];
  var nameState = useState((typeof window !== "undefined" && window.__fpaPrefill && window.__fpaPrefill.name) ? window.__fpaPrefill.name : "");
  var name = nameState[0], setName = nameState[1];
  var pathState = useState([]);
  var paths = pathState[0], setPaths = pathState[1];
  var goalState = useState([]);
  var goals = goalState[0], setGoals = goalState[1];
  var expState = useState("");
  var exp = expState[0], setExp = expState[1];
  var ageState = useState("");
  var ageBand = ageState[0], setAgeBand = ageState[1];
  var finderState = useState(false);
  var showFinder = finderState[0], setShowFinder = finderState[1];

  /* every onboarding step starts at the top of the page */
  useEffect(function () { try { window.scrollTo(0, 0); } catch (e) {} }, [step]);
  /* the path-finder is the default first thing on the pathway step — opens once, reopenable via the card */
  var autoFinderRef = useRef(false);
  useEffect(function () { if (step === 1 && !autoFinderRef.current) { autoFinderRef.current = true; setShowFinder(true); } }, [step]);

  function togglePath(id) {
    var next = paths.slice();
    var at = next.indexOf(id);
    if (at > -1) next.splice(at, 1); else next.push(id);
    setPaths(next);
  }
  function toggleGoal(id) {
    var next = goals.slice();
    var at = next.indexOf(id);
    if (at > -1) next.splice(at, 1); else next.push(id);
    setGoals(next);
  }
  function next() { setStep(step + 1); }
  function back() { setStep(step - 1); }
  function finish() {
    var primary = paths.length ? paths[0] : "airplane";
    props.onComplete({
      name: name.trim(),
      pathways: paths.length ? paths : ["airplane"],
      goals: goals,
      primaryPathway: primary,
      experience: exp || "zero",
      ageBand: ageBand || "30+",
      createdAt: todayStr()
    });
  }

  var wrap = { maxWidth: 560, margin: "0 auto", padding: "26px 18px 40px", minHeight: "100vh", display: "flex", flexDirection: "column" };

  /* progress dots */
  var dots = h("div", { style: { display: "flex", gap: 6, marginBottom: 22 } },
    [0, 1, 2, 3].map(function (i) {
      return h("div", { key: i, style: { flex: 1, height: 4, borderRadius: 99, background: i <= step ? t.sky : t.line } });
    }));

  /* STEP 0 — welcome + compliance acknowledgement */
  if (step === 0) {
    return h("div", { style: sx({ background: t.bg }, wrap) },
      dots,
      h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 } },
        h(BrandLogo, { mark: true, w: 60, pad: 8, radius: 12 }),
        h("div", null,
          h("div", { style: { fontSize: 24, fontWeight: 900, color: t.text, lineHeight: 1.05 } }, BRAND),
          h("div", { style: { fontSize: 13, color: t.magenta, fontWeight: 700, letterSpacing: 0.3 } }, TAGLINE))),
      h("p", { style: { color: t.textDim, fontSize: 15, lineHeight: 1.6, marginTop: 4 } },
        "Learn aviation from absolute zero — drones, airplanes, and helicopters — in short daily lessons mapped to real FAA standards. Build streaks, earn flight levels, and track your path to the cockpit."),
      h("div", { style: { height: 10 } }),
      h(ComplianceBanner, { text: COMPLIANCE_TEXT, margin: "0 0 16px 0" }),
      h("label", { style: { display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", padding: "12px 14px", border: "1px solid " + (ack ? t.green : t.line), borderRadius: 12, background: ack ? (t.name === "dark" ? "rgba(47,182,122,0.08)" : "rgba(30,142,95,0.08)") : "transparent" } },
        h("input", { type: "checkbox", checked: ack, onChange: function () { setAck(!ack); }, style: { marginTop: 3, width: 18, height: 18, accentColor: t.green } }),
        h("span", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.5 } }, "I understand this website supports my training but does not certify me, that all FAA requirements must be met through authorized people and processes, and I agree to the Terms of Use and Privacy notice.")),
      h("div", { style: { flex: 1 } }),
      h("div", { style: { marginTop: 18 } },
        h(Btn, { kind: "primary", full: true, disabled: !ack, onClick: next }, "Get started")));
  }

  /* STEP 1 — pathway toggles */
  if (step === 1) {
    return h("div", { style: sx({ background: t.bg }, wrap) },
      dots,
      h(SectionLabel, null, "Step 1 of 4"),
      h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text, marginBottom: 6 } }, "What do you want to fly?"),
      h("p", { style: { color: t.textDim, fontSize: 14, marginBottom: 18, lineHeight: 1.5 } }, "Pick one or more. You can change this anytime — most pilots start with one and add the rest."),
      h("div", { onClick: function () { setShowFinder(true); }, style: { display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", marginBottom: 16, borderRadius: 14, cursor: "pointer", background: t.name === "dark" ? "rgba(46,134,193,0.12)" : "rgba(46,134,193,0.07)", border: "1px dashed " + t.sky } },
        h("div", { style: { width: 38, height: 38, borderRadius: 10, background: t.sky, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "search", size: 20, color: "#fff" })),
        h("div", { style: { flex: 1 } },
          h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, "Not sure what to fly?"),
          h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4 } }, "Answer a few quick questions and we'll match you to a path.")),
        h(Glyph, { name: "more", size: 18, color: t.sky })),
      PATHWAYS.map(function (p) {
        var on = paths.indexOf(p.id) > -1;
        var tint = tintColor(t, p.tint);
        return h("div", { key: p.id, onClick: function () { togglePath(p.id); },
          style: { display: "flex", alignItems: "center", gap: 14, padding: "16px 16px", marginBottom: 12, borderRadius: 16, cursor: "pointer", background: t.panel, border: "2px solid " + (on ? tint : t.line) } },
          h("div", { style: { width: 46, height: 46, borderRadius: 12, background: on ? tint : t.panelHi, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
            h(Glyph, { name: p.glyph, size: 26, color: on ? "#fff" : t.textDim })),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, p.label),
            h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4 } }, p.blurb)),
          h("div", { style: { width: 24, height: 24, borderRadius: 99, border: "2px solid " + (on ? tint : t.line), background: on ? tint : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
            on ? h(Glyph, { name: "check", size: 14, color: "#fff" }) : null));
      }),
      h("div", { style: { flex: 1 } }),
      h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
        h(Btn, { kind: "ghost", onClick: back }, "Back"),
        h(Btn, { kind: "primary", full: true, disabled: paths.length === 0, onClick: next }, "Continue")),
      h(Modal, { open: showFinder, onClose: function () { setShowFinder(false); }, title: "Find your path" },
        h(PathFinder, { onClose: function () { setShowFinder(false); }, onPick: function (id) { setPaths([id]); setShowFinder(false); } })));
  }

  /* STEP 2 — experience + name */
  if (step === 2) {
    var EXPS = [
      { id: "zero", label: "Absolute beginner", note: "Never touched the controls. Start at Aviation 000." },
      { id: "some", label: "Some knowledge", note: "Studied a bit or flown a sim. Start at the foundation and move fast." },
      { id: "student", label: "Active student pilot", note: "Already training with an instructor. Use this to drill and track." },
      { id: "rated", label: "Certificated pilot", note: "Adding a rating or staying sharp." }
    ];
    return h("div", { style: sx({ background: t.bg }, wrap) },
      dots,
      h(SectionLabel, null, "Step 2 of 4"),
      h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text, marginBottom: 6 } }, "Where are you starting?"),
      h("p", { style: { color: t.textDim, fontSize: 14, marginBottom: 16, lineHeight: 1.5 } }, "Honest answers give you a better roadmap. Everyone benefits from the foundation."),
      EXPS.map(function (e) {
        var on = exp === e.id;
        return h("div", { key: e.id, onClick: function () { setExp(e.id); },
          style: { padding: "14px 15px", marginBottom: 10, borderRadius: 14, cursor: "pointer", background: t.panel, border: "2px solid " + (on ? t.sky : t.line) } },
          h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
            h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, e.label),
            h("div", { style: { width: 20, height: 20, borderRadius: 99, border: "2px solid " + (on ? t.sky : t.line), background: on ? t.sky : "transparent" } })),
          h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 3, lineHeight: 1.4 } }, e.note));
      }),
      h("div", { style: { marginTop: 8 } },
        h(SectionLabel, null, "Call sign (optional)"),
        h("input", { value: name, onChange: function (ev) { setName(ev.target.value); }, placeholder: "What should we call you?",
          style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 15, outline: "none" } })),
      h("div", { style: { flex: 1 } }),
      h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
        h(Btn, { kind: "ghost", onClick: back }, "Back"),
        h(Btn, { kind: "primary", full: true, disabled: !exp, onClick: next }, "Continue")));
  }

  /* STEP 4 — age band (scales reading level, tone & framing — not the facts) */
  var chosenBand = bandById(ageBand);
  var chosenTier = chosenBand ? chosenBand.tier : "adult";
  return h("div", { style: sx({ background: t.bg }, wrap) },
    dots,
    h(SectionLabel, null, "Step 3 of 4"),
    h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text, marginBottom: 6 } }, "How old are you?"),
    h("p", { style: { color: t.textDim, fontSize: 14, marginBottom: 16, lineHeight: 1.5 } }, "This tunes the reading level, tone, and framing of your lessons. The aviation facts and standards are identical for every age — only how we explain them changes."),
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 14 } },
      AGE_BANDS.map(function (b) {
        var on = ageBand === b.id;
        return h("button", { key: b.id, onClick: function () { setAgeBand(b.id); },
          style: { flex: "1 1 44%", minWidth: 132, fontFamily: SANS, cursor: "pointer", padding: "14px 10px", borderRadius: 14, border: "2px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 } },
          h("div", { style: { fontFamily: MONO, fontSize: 17, fontWeight: 800 } }, b.label),
          h("div", { style: { fontSize: 10.5, fontWeight: 600, opacity: 0.85 } }, b.note));
      })),
    chosenBand ? h("div", { style: { padding: "12px 14px", borderRadius: 12, background: t.panel, border: "1px solid " + t.lineSoft, marginBottom: 6 } },
      h("div", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.5 } }, chosenBand.desc),
      eligibilityNote(chosenTier) ? h("div", { style: { fontSize: 12, color: t.amber, lineHeight: 1.5, marginTop: 6 } }, eligibilityNote(chosenTier)) : null) : null,
    h("div", { style: { flex: 1 } }),
    h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
      h(Btn, { kind: "ghost", onClick: back }, "Back"),
      h(Btn, { kind: "go", full: true, disabled: !ageBand, onClick: finish }, copyFor("startCta", chosenTier))));
}

/* ---------------------------------------------------------- skill map node */
function Waypoint(props) {
  var t = useT();
  var p = props.prog;
  var tint = props.tint;
  var locked = props.locked;
  var node;
  if (locked) {
    node = h("div", { style: { width: 52, height: 52, borderRadius: 99, background: t.panelHi, border: "2px solid " + t.line, display: "flex", alignItems: "center", justifyContent: "center" } },
      h(Glyph, { name: "lock", size: 20, color: t.textFaint }));
  } else if (p.done) {
    node = h("div", { style: { width: 52, height: 52, borderRadius: 99, overflow: "hidden", border: "2px solid " + tint, display: "flex", alignItems: "center", justifyContent: "center", background: t.panel } },
      h(AttitudeIndicator, { size: 48, pct: p.mastery, idn: props.idn }));
  } else {
    node = h("div", { style: { width: 52, height: 52, borderRadius: 99, background: t.panel, border: "2.5px dashed " + tint, display: "flex", alignItems: "center", justifyContent: "center" } },
      h("div", { style: { fontFamily: MONO, fontWeight: 800, fontSize: 17, color: tint } }, props.num));
  }
  return node;
}

function SkillMap(props) {
  var t = useT();
  var state = props.state;
  var unit = props.unit;
  var tint = tintColor(t, pathMeta(unit.pathway).tint);
  return h("div", { style: { marginBottom: 26 } },
    /* unit header */
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } },
      h("div", null,
        h("div", { style: { fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: tint, fontWeight: 700 } }, unit.level.toUpperCase()),
        h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text } }, unit.title),
        h("div", { style: { fontSize: 12.5, color: t.textDim, maxWidth: 360, lineHeight: 1.4, marginTop: 2 } }, unit.subtitle)),
      h("div", { style: { textAlign: "center" } },
        h("div", { style: { fontFamily: MONO, fontSize: 18, fontWeight: 800, color: t.text } }, unitDoneCount(state, unit) + "/" + unit.lessons.length),
        h("div", { style: { fontSize: 10, color: t.textFaint, letterSpacing: 0.5 } }, "LESSONS"))),
    /* waypoints with dashed course line */
    unit.lessons.map(function (id, idx) {
      var L = LESSONS[id];
      var p = progFor(state, id);
      var locked = !lessonUnlocked(state, unit, idx);
      var last = idx === unit.lessons.length - 1;
      var src = faaSourceById(L.faa);
      function open() { if (!locked) props.onOpenLesson(id); }
      return h("div", { key: id, style: { display: "flex", gap: 14, alignItems: "stretch" } },
        /* gutter: node + connector */
        h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", width: 52, flexShrink: 0 } },
          h(Waypoint, { prog: p, tint: tint, locked: locked, num: idx + 1, idn: "wp-" + id }),
          last ? null : h("div", { style: { flex: 1, width: 0, borderLeft: "2.5px dashed " + (p.done ? tint : t.line), margin: "2px 0", minHeight: 18 } })),
        /* lesson card */
        h("div", { onClick: open, style: { flex: 1, marginBottom: 14, opacity: locked ? 0.6 : 1, cursor: locked ? "default" : "pointer", background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "12px 14px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 } },
            h("div", { style: { flex: 1 } },
              h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, lineHeight: 1.25 } }, L.title),
              h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 } },
                h(Chip, { mono: true, color: tint }, src.code),
                h(Chip, { mono: true }, L.time + " min"),
                p.done ? h(Chip, { color: p.mastery >= 80 ? t.green : t.amber }, masteryLabel(p.mastery) + " " + p.mastery + "%") : null)),
            locked ? h(Glyph, { name: "lock", size: 16, color: t.textFaint })
              : p.done ? h("div", { style: { color: t.green } }, h(Glyph, { name: "check", size: 18, color: t.green }))
                : h("div", { style: { fontFamily: SANS, fontSize: 12, fontWeight: 700, color: tint } }, "Start"))));
    }));
}

/* ----------------------------------------------------------- Learn screen */
/* Certificate / rating tracks used to filter the Learn roadmap. Ordered. */
var LESSON_CERTS = [
  { id: "foundation", label: "Foundations" },
  { id: "sport", label: "Sport & Recreational" },
  { id: "ppl", label: "Private Pilot (PPL)" },
  { id: "instrument", label: "Instrument Rating" },
  { id: "commercial", label: "Commercial Pilot" },
  { id: "class", label: "Multi-Engine & Seaplane" },
  { id: "atp", label: "Airline Transport (ATP)" },
  { id: "cfi", label: "Flight Instructor" },
  { id: "remote", label: "Remote Pilot — Part 107" },
  { id: "glider", label: "Glider & Soaring" },
  { id: "balloon", label: "Balloon" },
  { id: "gyro", label: "Gyroplane" },
  { id: "poweredlift", label: "Powered-Lift & eVTOL" },
  { id: "weightshift", label: "Weight-Shift (Trike)" },
  { id: "poweredchute", label: "Powered Parachute" }
];
function certLabel(id) {
  for (var i = 0; i < LESSON_CERTS.length; i++) { if (LESSON_CERTS[i].id === id) return LESSON_CERTS[i].label; }
  return id;
}

/* Themed dropdown. props: value, options [{id,label}], onChange, tint. */
function Dropdown(props) {
  var t = useT();
  var oS = useState(false); var open = oS[0], setOpen = oS[1];
  var tint = props.tint || t.sky;
  var cur = null;
  for (var i = 0; i < props.options.length; i++) { if (props.options[i].id === props.value) { cur = props.options[i]; break; } }
  function pick(id) { setOpen(false); if (props.onChange) props.onChange(id); }
  return h("div", { style: { position: "relative" } },
    h("button", { onClick: function () { setOpen(!open); },
      style: { width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, cursor: "pointer", background: t.panel, border: "1.5px solid " + (open ? tint : t.line), fontFamily: SANS, textAlign: "left" } },
      h(Glyph, { name: "learn", size: 18, color: tint }),
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase", color: t.textFaint } }, "Certificate path"),
        h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, cur ? cur.label : "My roadmap")),
      h("div", { style: { transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform .15s ease", flexShrink: 0 } }, h(Glyph, { name: "more", size: 18, color: t.textDim }))),
    open ? h("div", null,
      h("div", { onClick: function () { setOpen(false); }, style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 } }),
      h("div", { style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 51, background: t.panel, border: "1px solid " + t.line, borderRadius: 12, overflow: "hidden", maxHeight: 340, overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.28)" } },
        props.options.map(function (o) {
          var on = o.id === props.value;
          function tap() { pick(o.id); }
          return h("button", { key: o.id, onClick: tap, style: { display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", padding: "11px 14px", background: on ? (tint + "1A") : "transparent", border: "none", borderBottom: "1px solid " + t.lineSoft, cursor: "pointer", fontFamily: SANS, fontSize: 14, fontWeight: on ? 800 : 600, color: on ? tint : t.text } }, o.label);
        }))) : null);
}

function LearnScreen(props) {
  var t = useT();
  var state = props.state;
  var cfS = useState("all"); var certFilter = cfS[0], setCertFilter = cfS[1];
  var roadmap = unitsForState(state);
  /* options come from the FULL curriculum so any certificate path can be jumped to, not just the roadmap */
  var certCounts = {};
  UNITS.forEach(function (uu) { var c = uu.cert || "foundation"; certCounts[c] = (certCounts[c] || 0) + 1; });
  var dropOpts = [{ id: "all", label: "My roadmap" }];
  LESSON_CERTS.forEach(function (c) { if (certCounts[c.id]) dropOpts.push({ id: c.id, label: c.label }); });
  /* guard: if the active filter is somehow unavailable, fall back to the roadmap */
  var activeCert = certFilter;
  if (activeCert !== "all" && !certCounts[activeCert]) activeCert = "all";
  /* default shows the personalized roadmap; picking a certificate shows that entire track */
  var shownUnits = activeCert === "all" ? roadmap : UNITS.filter(function (uu) { return (uu.cert || "foundation") === activeCert; });
  /* note when the chosen track reaches beyond what the learner already had queued */
  var inRoadmap = {};
  roadmap.forEach(function (uu) { inRoadmap[uu.id] = true; });
  var exploring = activeCert !== "all" && shownUnits.some(function (uu) { return !inRoadmap[uu.id]; });
  /* find the next actionable lesson across the shown (filtered) units */
  /* the Continue card always reflects the learner's real roadmap progress, regardless of the path filter */
  var nextLesson = null;
  for (var u = 0; u < roadmap.length && !nextLesson; u++) {
    var un = roadmap[u];
    for (var i = 0; i < un.lessons.length; i++) {
      var id = un.lessons[i];
      if (!progFor(state, id).done && lessonUnlocked(state, un, i)) { nextLesson = { id: id, unit: un }; break; }
    }
  }
  return h("div", null,
    /* pinned learning pathway chosen from Library \u2192 Career paths */
    (function () {
      var apId = state.activePathway;
      if (!apId) return null;
      var ap = null; for (var pi = 0; pi < CAREER_PATHS.length; pi++) { if (CAREER_PATHS[pi].id === apId) ap = CAREER_PATHS[pi]; }
      if (!ap) return null;
      var ptint = tintColor(t, pathMeta(ap.path).tint);
      return h("div", { style: { borderRadius: 18, padding: "16px 16px", marginBottom: 20, background: "linear-gradient(135deg," + ptint + "22, transparent)", border: "1px solid " + ptint } },
        h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } },
          h("div", { style: { fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, fontWeight: 800, color: ptint } }, "YOUR LEARNING PATHWAY"),
          props.onUnpinPathway ? h("button", { onClick: function () { props.onUnpinPathway(); }, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textFaint, padding: 2, display: "inline-flex", alignItems: "center" } }, h(Glyph, { name: "x", size: 16, color: t.textFaint })) : null),
        h("div", { style: { display: "flex", alignItems: "center", gap: 11, marginBottom: 12 } },
          h("div", { style: { width: 42, height: 42, borderRadius: 11, background: ptint + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: pathMeta(ap.path).glyph, size: 23, color: ptint })),
          h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text, lineHeight: 1.15 } }, ap.name)),
        h("div", { style: { marginBottom: 12 } }, ap.steps.map(function (stp, i) {
          return h("div", { key: i, style: { display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 7 } },
            h("div", { style: { width: 20, height: 20, borderRadius: 99, flexShrink: 0, background: ptint, color: "#fff", fontFamily: MONO, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" } }, i + 1),
            h("div", { style: { fontSize: 13, color: t.text, lineHeight: 1.4, paddingTop: 1 } }, stp));
        })),
        props.onOpenCareer ? h(Btn, { kind: "soft", small: true, onClick: function () { props.onOpenCareer(); } }, "View pathway details") : null);
    })(),
    /* quick-access roadmap filter by certificate / rating track */
    /* quick-access: jump to any certificate / rating path across the whole curriculum */
    h("div", { style: { marginBottom: 18 } },
      h(SectionLabel, { style: { marginBottom: 8 } }, "Jump to a certificate path"),
      h(Dropdown, { value: activeCert, options: dropOpts, onChange: function (id) { setCertFilter(id); }, tint: t.sky }),
      activeCert !== "all"
        ? h("div", { style: { fontSize: 11.5, color: t.textFaint, fontFamily: MONO, marginTop: 8, paddingLeft: 2, lineHeight: 1.5 } }, (certCounts[activeCert] || 0) + (certCounts[activeCert] === 1 ? " unit" : " units") + " in the " + certLabel(activeCert) + " track" + (exploring ? " · includes lessons beyond your selected pathways" : ""))
        : h("div", { style: { fontSize: 11.5, color: t.textFaint, fontFamily: MONO, marginTop: 8, paddingLeft: 2 } }, "Showing your personalized roadmap")),
    /* continue card */
    nextLesson ? (function () {
      var L = LESSONS[nextLesson.id];
      var tint = tintColor(t, pathMeta(nextLesson.unit.pathway).tint);
      return h("div", { onClick: function () { props.onOpenLesson(nextLesson.id); },
        style: { background: "linear-gradient(135deg," + tint + "22,transparent)", border: "1px solid " + tint, borderRadius: 18, padding: "16px 16px", marginBottom: 20, cursor: "pointer" } },
        h(SectionLabel, { style: { color: tint } }, "Continue your training"),
        h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text, lineHeight: 1.2, marginBottom: 8 } }, L.title),
        h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
          h("div", { style: { fontSize: 12.5, color: t.textDim } }, nextLesson.unit.level + " • " + L.time + " min"),
          h(Btn, { kind: "go", small: true, onClick: function () { props.onOpenLesson(nextLesson.id); } }, "Resume")));
    })() : h(Card, { style: { marginBottom: 20, textAlign: "center" } },
      h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text } }, "All caught up"),
      h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 4 } }, "Head to Practice to keep your knowledge sharp.")),
    (function () {
      if (!props.onOpenGoals) return null;
      var li10 = levelInfo(state.xp);
      var goalsSet = state.profile && state.profile.goals && state.profile.goals.length > 0;
      var dismissed = state.settings && state.settings.goalsPromptDismissed;
      if (li10.level < 10 || goalsSet || dismissed) return null;
      return h("div", { style: { borderRadius: 18, padding: "16px 16px", marginBottom: 20, background: "linear-gradient(135deg," + t.amber + "22,transparent)", border: "1px solid " + t.amber } },
        h(SectionLabel, { style: { color: t.amber } }, "New at Flight Level 10"),
        h("div", { style: { fontSize: 17, fontWeight: 900, color: t.text, lineHeight: 1.2, marginBottom: 6 } }, "Get more out of your training"),
        h("div", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.5, marginBottom: 12 } }, "You've built real momentum. Tell us which certificates and ratings you're chasing and we'll tailor what we point you toward next."),
        h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
          h(Btn, { kind: "go", small: true, onClick: function () { props.onOpenGoals(); } }, "Set my goals"),
          h("button", { onClick: function () { if (props.onDismissGoalsPrompt) props.onDismissGoalsPrompt(); }, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textDim, fontFamily: SANS, fontSize: 13, fontWeight: 600 } }, "Maybe later")));
    })(),
    /* study preflight — before you dig in */
    props.onOpenPreflight ? h("div", { onClick: function () { props.onOpenPreflight(); }, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, marginBottom: 12, cursor: "pointer", background: t.name === "dark" ? "rgba(46,134,193,0.07)" : "rgba(46,134,193,0.07)", border: "1px solid " + (t.name === "dark" ? "rgba(46,134,193,0.28)" : "rgba(46,134,193,0.28)") } },
      h(Glyph, { name: "checklist", size: 22, color: t.sky }),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text } }, "Run your study preflight"),
        h("div", { style: { fontSize: 12, color: t.textDim } }, "Get set before you dig in — and see why it matters")),
      h(Glyph, { name: "more", size: 18, color: t.textDim })) : null,
    /* safety quick access */
    h("div", { onClick: props.onGoSafety, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, marginBottom: 22, cursor: "pointer", background: t.name === "dark" ? "rgba(242,183,5,0.06)" : "rgba(201,138,0,0.08)", border: "1px solid " + (t.name === "dark" ? "rgba(242,183,5,0.22)" : "rgba(201,138,0,0.28)") } },
      h(Glyph, { name: "safety", size: 22, color: t.amber }),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text } }, "Preflight a real decision"),
        h("div", { style: { fontSize: 12, color: t.textDim } }, "IMSAFE, PAVE, 5P & personal minimums")),
      h(Glyph, { name: "more", size: 18, color: t.textDim })),
    /* free, local reference finder — official answers + sources, no AI */
    props.onOpenReference ? h("div", { onClick: function () { props.onOpenReference(""); }, style: { display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", borderRadius: 14, marginBottom: 22, cursor: "pointer", background: t.panel, border: "1px solid " + t.line } },
      h("div", { style: { width: 38, height: 38, borderRadius: 10, background: t.sky + "1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "search", size: 20, color: t.sky })),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, "Look it up"),
        h("div", { style: { fontSize: 12, color: t.textDim } }, "Search any topic for the answer and its FAA source")),
      h(Glyph, { name: "more", size: 18, color: t.textDim })) : null,
    /* featured: aviation arcade */
    props.onOpenArcade ? (function () {
      var arcTickets = state.arcade && state.arcade.tickets ? state.arcade.tickets : 0;
      return h("div", { onClick: props.onOpenArcade, style: { borderRadius: 16, padding: "15px 16px", marginBottom: 22, cursor: "pointer", background: "linear-gradient(135deg," + t.magenta + "1c, transparent)", border: "1px solid " + t.magenta } },
        h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
          h("div", { style: { width: 46, height: 46, borderRadius: 12, background: t.magenta + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "wing", size: 24, color: t.magenta })),
          h("div", { style: { flex: 1, minWidth: 0 } },
            h("div", { style: { fontFamily: MONO, fontSize: 9, letterSpacing: 1.5, fontWeight: 800, color: t.magenta } }, "ARCADE \u00b7 STUDY BREAK"),
            h("div", { style: { fontSize: 16.5, fontWeight: 900, color: t.text, marginTop: 2 } }, "Aviation Arcade"),
            h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4, marginTop: 1 } }, "13 quick games \u2014 play, learn, and earn XP" + (arcTickets > 0 ? ("  \u00b7  " + arcTickets + " tickets") : ""))),
          h(Glyph, { name: "more", size: 18, color: t.textDim })));
    })() : null,
    /* skill maps */
    shownUnits.length ? shownUnits.map(function (un) {
      return h(SkillMap, { key: un.id, state: state, unit: un, onOpenLesson: props.onOpenLesson });
    }) : h(Card, { style: { textAlign: "center" } },
      h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text } }, "No lessons in this track yet"),
      h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 4 } }, "Pick another certificate from the filter above.")));
}

/* --------------------------------------------------------- Lesson detail */
function Block(props) {
  var t = useT();
  return h("div", { style: { marginBottom: 18 } },
    h(SectionLabel, { style: { color: props.color || t.textFaint } }, props.label),
    props.children);
}

function LessonView(props) {
  var t = useT();
  var L = LESSONS[props.lessonId];
  if (!L) return null;
  var tier = tierFor(props.state);
  var p = progFor(props.state, props.lessonId);
  var src = faaSourceById(L.faa);
  var tint = tintColor(t, pathMeta(L.pathway).tint);
  return h("div", null,
    h("button", { onClick: props.onBack, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: t.textDim, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "2px 0 14px" } },
      h(Glyph, { name: "back", size: 18, color: t.textDim }), "Back to roadmap"),
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 } },
      h(Chip, { mono: true, color: tint }, pathMeta(L.pathway).label),
      h(Chip, { mono: true }, L.cert),
      h(Chip, { mono: true }, L.time + " min"),
      p.done ? h(Chip, { color: p.mastery >= 80 ? t.green : t.amber }, "Best " + p.best + "%") : null),
    h("h1", { style: { fontSize: 24, fontWeight: 900, color: t.text, lineHeight: 1.15, margin: "0 0 6px" } }, L.title),
    h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" } },
      h(SourceLink, { url: src.url, small: true }, src.code + " — " + src.title),
      h("span", { style: { color: t.textFaint, fontSize: 12 } }, "•"),
      h("span", { style: { fontFamily: MONO, fontSize: 11.5, color: t.textDim } }, "ACS: " + L.acs)),

    h(Block, { label: "Plain-English explanation" },
      explainFor(L, tier).map(function (para, i) {
        return h("p", { key: i, style: { fontSize: 15, lineHeight: 1.65, color: t.text, margin: "0 0 12px" } }, para);
      })),

    ((L.why || L.mistake) ? h("div", { style: { display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" } },
      (L.why ? h("div", { style: { flex: "1 1 240px", background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "12px 14px" } },
        h(SectionLabel, { style: { color: t.sky } }, "Why it matters"),
        h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.5 } }, L.why)) : null),
      (L.mistake ? h("div", { style: { flex: "1 1 240px", background: t.name === "dark" ? "rgba(229,86,75,0.06)" : "rgba(192,57,43,0.06)", border: "1px solid " + (t.name === "dark" ? "rgba(229,86,75,0.25)" : "rgba(192,57,43,0.22)"), borderRadius: 14, padding: "12px 14px" } },
        h(SectionLabel, { style: { color: t.red } }, "Common mistake"),
        h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.5 } }, L.mistake)) : null)) : null),

    ((L.terms && L.terms.length) ? h(Block, { label: "Key terms" },
      h("div", { style: { border: "1px solid " + t.line, borderRadius: 14, overflow: "hidden" } },
        L.terms.map(function (pair, i) {
          return h("div", { key: i, style: { display: "flex", gap: 10, padding: "10px 14px", borderTop: i === 0 ? "none" : "1px solid " + t.lineSoft, background: i % 2 ? "transparent" : (t.name === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)") } },
            h("div", { style: { fontWeight: 800, fontSize: 13.5, color: t.text, minWidth: 96, flexShrink: 0 } }, pair[0]),
            h("div", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.45 } }, pair[1]));
        }))) : null),

    (hookFor(L, tier) ? h("div", { style: { display: "flex", alignItems: "center", gap: 10, background: t.panelHi, border: "1px solid " + t.line, borderRadius: 14, padding: "12px 14px", marginBottom: 18 } },
      h(Glyph, { name: "bolt", size: 20, color: t.amber }),
      h("div", null,
        h("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: t.textFaint, textTransform: "uppercase" } }, "Memory hook"),
        h("div", { style: { fontSize: 14.5, fontWeight: 700, color: t.text, fontStyle: "italic" } }, "\u201C" + hookFor(L, tier) + "\u201D"))) : null),

    (L.scenario ? h(Block, { label: "Real-world scenario" },
      h("p", { style: { fontSize: 14, lineHeight: 1.6, color: t.text, margin: 0 } }, L.scenario)) : null),

    (L.practical ? h(Block, { label: "Practical application" },
      h("p", { style: { fontSize: 14, lineHeight: 1.6, color: t.textDim, margin: 0 } }, L.practical)) : null),

    (L.instructor ? h(Block, { label: "Instructor note" },
      h("p", { style: { fontSize: 14, lineHeight: 1.6, color: t.textDim, margin: 0, fontStyle: "italic" } }, "\u201C" + L.instructor + "\u201D")) : null),

    (L.safety ? h("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", background: t.name === "dark" ? "rgba(242,183,5,0.07)" : "rgba(201,138,0,0.10)", border: "1px solid " + (t.name === "dark" ? "rgba(242,183,5,0.28)" : "rgba(201,138,0,0.3)"), borderRadius: 12, padding: "12px 14px", marginBottom: 18 } },
      h(Glyph, { name: "safety", size: 18, color: t.amber }),
      h("div", null,
        h("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: t.amber, textTransform: "uppercase", marginBottom: 2 } }, "Safety"),
        h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.5 } }, L.safety))) : null),

    (L.oral ? h(Block, { label: "Oral exam practice", color: t.magenta },
      h("p", { style: { fontSize: 14, lineHeight: 1.55, color: t.text, margin: 0, fontWeight: 600 } }, L.oral)) : null),

    h("div", { style: { height: 8 } }),
    h(Btn, { kind: "go", full: true, onClick: function () { props.onStartQuiz(props.lessonId); } },
      h(Glyph, { name: "bolt", size: 18, color: "#fff" }), "Take the quiz (" + L.quiz.length + " questions)"));
}

/* ------------------------------------------------------------- quiz engine */
/* Pool item shape: { lessonId, q }. Works for one lesson or many (Practice). */
function StarGlyph(props) {
  var c = props.color || "#888";
  var s = props.size || 24;
  return h("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: props.filled ? c : "none", stroke: c, strokeWidth: props.filled ? 0 : 1.7, strokeLinejoin: "round", "aria-hidden": "true" },
    h("path", { d: "M12 2.4l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.7 6.2 20.85l1.1-6.45-4.7-4.6 6.5-.95z" }));
}
function StarRating(props) {
  var t = useT();
  var v = props.value || 0;
  var color = props.color || t.amber;
  return h("div", { style: { display: "flex", gap: 7 } },
    [1, 2, 3, 4, 5].map(function (n) {
      var on = n <= v;
      function pick() { if (props.onChange) props.onChange(n === v ? 0 : n); }
      return h("button", { key: n, onClick: pick, "aria-label": n + " of 5", style: { background: "transparent", border: "none", cursor: "pointer", padding: 1, lineHeight: 0 } },
        h(StarGlyph, { filled: on, size: props.size || 28, color: on ? color : t.line }));
    }));
}

function QuizEngine(props) {
  var t = useT();
  var pool = props.pool;
  var idxState = useState(0);
  var idx = idxState[0], setIdx = idxState[1];
  var pickState = useState(null);   /* selected choice index / bool / text */
  var pick = pickState[0], setPick = pickState[1];
  var revealState = useState(false);
  var reveal = revealState[0], setReveal = revealState[1];
  var doneState = useState(false);
  var done = doneState[0], setDone = doneState[1];
  /* post-lesson debrief survey */
  var confState = useState(0); var conf = confState[0], setConf = confState[1];
  var clarState = useState(0); var clar = clarState[0], setClar = clarState[1];
  var revState = useState(null); var rev = revState[0], setRev = revState[1];
  var noteState = useState(""); var note = noteState[0], setNote = noteState[1];
  /* tally per lesson */
  var tallyRef = useRef({});
  var correctRef = useRef(0);

  var total = pool.length;
  var item = pool[idx];
  var q = item ? item.q : null;

  function recordResult(isCorrect) {
    var lid = item.lessonId;
    var byL = tallyRef.current;
    if (!byL[lid]) byL[lid] = { correct: 0, total: 0 };
    byL[lid].total += 1;
    if (isCorrect) { byL[lid].correct += 1; correctRef.current += 1; }
  }

  function evaluate() {
    if (q.type === "fill") {
      var ok = normAnswer(pick) === normAnswer(q.answer);
      if (!ok && q.alts) {
        for (var i = 0; i < q.alts.length; i++) if (normAnswer(pick) === normAnswer(q.alts[i])) ok = true;
      }
      return ok;
    }
    if (q.type === "tf") return pick === q.answer;
    return pick === q.answer; /* mc */
  }

  function submit() {
    if (reveal) return;
    if (q.type === "fill") { if (!pick || ("" + pick).trim() === "") return; }
    else if (pick === null) return;
    var ok = evaluate();
    recordResult(ok);
    setReveal(true);
  }
  function nextQ() {
    if (idx + 1 >= total) { setDone(true); return; }
    setIdx(idx + 1); setPick(null); setReveal(false);
  }

  if (done) {
    var byLesson = tallyRef.current;
    var correct = correctRef.current;
    var scorePct = total ? Math.round((correct / total) * 100) : 0;
    var col = scorePct >= 80 ? t.green : scorePct >= 50 ? t.amber : t.magenta;
    var isLessonQuiz = typeof props.onRoadmap === "function";
    var survey = { confidence: conf, clarity: clar, review: rev === true, comment: note };
    function yesNoBtn(val, label) {
      var on = rev === val;
      var yc = val ? t.amber : t.green;
      function tap() { setRev(on ? null : val); }
      return h("button", { onClick: tap, style: { flex: 1, padding: "10px 0", borderRadius: 11, cursor: "pointer", border: "2px solid " + (on ? yc : t.line), background: on ? yc + "1A" : t.panel, color: on ? yc : t.textDim, fontFamily: SANS, fontSize: 13.5, fontWeight: 800 } }, label);
    }
    var surveyUI = isLessonQuiz ? h("div", { style: { textAlign: "left", background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: "14px 14px 6px", marginBottom: 16 } },
      h("div", { style: { fontSize: 10.5, fontFamily: MONO, letterSpacing: 1, color: t.textFaint, fontWeight: 700, marginBottom: 2 } }, "DEBRIEF"),
      h("div", { style: { fontSize: 15.5, fontWeight: 900, color: t.text, marginBottom: 12 } }, "Log it in your training record"),
      h("div", { style: { marginBottom: 13 } },
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 7 } }, "How confident do you feel about this material?"),
        h(StarRating, { value: conf, onChange: setConf, color: t.amber })),
      h("div", { style: { marginBottom: 13 } },
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 7 } }, "How clear was the lesson?"),
        h(StarRating, { value: clar, onChange: setClar, color: t.sky })),
      h("div", { style: { marginBottom: 13 } },
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 7 } }, "Flag this lesson to review later?"),
        h("div", { style: { display: "flex", gap: 8 } }, yesNoBtn(true, "Yes, review it"), yesNoBtn(false, "No, I'm good"))),
      h("div", { style: { marginBottom: 10 } },
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, marginBottom: 7 } }, "Notes (optional)"),
        h("textarea", { value: note, onChange: function (e) { setNote(e.target.value); }, placeholder: "Anything you want to remember\u2026", rows: 2, style: { width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 11, border: "1px solid " + t.line, background: t.bg, color: t.text, fontFamily: SANS, fontSize: 13.5, outline: "none", resize: "vertical" } }))) : null;
    var finishButtons;
    if (!isLessonQuiz) {
      finishButtons = h(Btn, { kind: "go", full: true, onClick: function () { props.onFinish(byLesson, correct, total); } }, "Continue");
    } else if (props.nextLessonId) {
      finishButtons = h("div", null,
        h("div", { style: { fontSize: 11, color: t.textFaint, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 } }, "Up next"),
        h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 14, lineHeight: 1.3 } }, props.nextTitle),
        h(Btn, { kind: "go", full: true, onClick: function () { props.onNextLesson(byLesson, correct, total, survey); } }, "Next lesson \u2192"),
        h("div", { style: { height: 10 } }),
        h(Btn, { kind: "ghost", full: true, onClick: function () { props.onRoadmap(byLesson, correct, total, survey); } }, "Save & back to roadmap"));
    } else {
      finishButtons = h("div", null,
        h("div", { style: { fontSize: 13.5, color: t.textDim, marginBottom: 14, lineHeight: 1.5 } }, "That's the last lesson in this path \u2014 nicely done."),
        h(Btn, { kind: "go", full: true, onClick: function () { props.onRoadmap(byLesson, correct, total, survey); } }, "Save & back to roadmap"));
    }
    return h("div", { style: { textAlign: "center", padding: "10px 4px 4px" } },
      h("div", { style: { display: "flex", justifyContent: "center", marginBottom: 14 } },
        h(Gauge, { value: scorePct, unit: "% correct", size: 132 })),
      h("div", { style: { fontSize: 22, fontWeight: 900, color: t.text } }, scorePct >= 80 ? "Cleared!" : scorePct >= 50 ? "Good progress" : "Keep at it"),
      h("div", { style: { fontSize: 14, color: t.textDim, marginTop: 4, marginBottom: 4 } }, correct + " of " + total + " correct"),
      h("div", { style: { fontFamily: MONO, fontSize: 13, color: col, fontWeight: 700, marginBottom: 18 } }, "+" + (correct * 10 + (scorePct >= 80 ? 15 : 0)) + " XP"),
      surveyUI,
      finishButtons);
  }

  if (!q) return null;
  var tint = tintColor(t, pathMeta(LESSONS[item.lessonId].pathway).tint);
  var isCorrect = reveal ? evaluate() : false;

  /* answer renderers */
  var answerUI;
  if (q.type === "mc") {
    answerUI = h("div", null, q.choices.map(function (c, ci) {
      var chosen = pick === ci;
      var showRight = reveal && ci === q.answer;
      var showWrong = reveal && chosen && ci !== q.answer;
      var bdr = showRight ? t.green : showWrong ? t.red : chosen ? tint : t.line;
      var bg = showRight ? (t.name === "dark" ? "rgba(47,182,122,0.12)" : "rgba(30,142,95,0.10)")
        : showWrong ? (t.name === "dark" ? "rgba(229,86,75,0.12)" : "rgba(192,57,43,0.10)")
          : chosen ? (t.name === "dark" ? "rgba(46,134,193,0.12)" : "rgba(46,134,193,0.08)") : t.panel;
      function choose() { if (!reveal) setPick(ci); }
      return h("button", { key: ci, onClick: choose, disabled: reveal,
        style: { display: "flex", width: "100%", textAlign: "left", alignItems: "center", gap: 11, padding: "13px 14px", marginBottom: 10, borderRadius: 13, cursor: reveal ? "default" : "pointer", border: "2px solid " + bdr, background: bg, fontFamily: SANS } },
        h("div", { style: { width: 22, height: 22, borderRadius: 99, flexShrink: 0, border: "2px solid " + bdr, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: (showRight || (chosen && !reveal) || showWrong) ? bdr : "transparent" } },
          showRight ? h(Glyph, { name: "check", size: 12, color: "#fff" }) : showWrong ? h(Glyph, { name: "x", size: 12, color: "#fff" }) : h("span", { style: { fontSize: 11, fontWeight: 800, color: chosen ? "#fff" : t.textDim } }, String.fromCharCode(65 + ci))),
        h("div", { style: { fontSize: 14.5, color: t.text, fontWeight: 600, lineHeight: 1.35 } }, c));
    }));
  } else if (q.type === "tf") {
    answerUI = h("div", { style: { display: "flex", gap: 10 } }, [true, false].map(function (val) {
      var chosen = pick === val;
      var showRight = reveal && val === q.answer;
      var showWrong = reveal && chosen && val !== q.answer;
      var bdr = showRight ? t.green : showWrong ? t.red : chosen ? tint : t.line;
      function choose() { if (!reveal) setPick(val); }
      return h("button", { key: val ? "T" : "F", onClick: choose, disabled: reveal,
        style: { flex: 1, padding: "16px 0", borderRadius: 13, cursor: reveal ? "default" : "pointer", border: "2px solid " + bdr, background: chosen && !reveal ? (t.name === "dark" ? "rgba(46,134,193,0.12)" : "rgba(46,134,193,0.08)") : showRight ? (t.name === "dark" ? "rgba(47,182,122,0.12)" : "rgba(30,142,95,0.10)") : t.panel, color: t.text, fontFamily: SANS, fontSize: 16, fontWeight: 800 } }, val ? "True" : "False");
    }));
  } else {
    /* fill */
    answerUI = h("div", null,
      h("input", { value: pick === null ? "" : pick, disabled: reveal, onChange: function (ev) { setPick(ev.target.value); },
        placeholder: "Type your answer", style: { width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 13, border: "2px solid " + (reveal ? (isCorrect ? t.green : t.red) : t.line), background: t.panel, color: t.text, fontFamily: SANS, fontSize: 15, outline: "none" } }),
      reveal && !isCorrect ? h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 8 } }, "Accepted answer: ", h("span", { style: { fontWeight: 800, color: t.green } }, q.answer)) : null);
  }

  return h("div", null,
    /* progress */
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 } },
      h("button", { onClick: props.onBack, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textDim, padding: 0 } }, h(Glyph, { name: "x", size: 22, color: t.textDim })),
      h("div", { style: { flex: 1 } }, h(Bar, { pct: ((idx) / total) * 100, color: tint, h: 8 })),
      h("div", { style: { fontFamily: MONO, fontSize: 13, fontWeight: 700, color: t.textDim } }, (idx + 1) + "/" + total)),
    h("div", { style: { display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" } },
      h(Chip, { mono: true, color: tint }, q.type === "mc" ? "Multiple choice" : q.type === "tf" ? "True / false" : "Fill in"),
      props.title ? h(Chip, { mono: true }, props.title) : null),
    h("div", { style: { fontSize: 18.5, fontWeight: 800, color: t.text, lineHeight: 1.3, marginBottom: 18 } }, q.q),
    answerUI,
    reveal ? h("div", { style: { marginTop: 6, marginBottom: 4, padding: "12px 14px", borderRadius: 12, background: isCorrect ? (t.name === "dark" ? "rgba(47,182,122,0.10)" : "rgba(30,142,95,0.08)") : (t.name === "dark" ? "rgba(242,183,5,0.08)" : "rgba(201,138,0,0.08)"), border: "1px solid " + (isCorrect ? t.green : t.amber) } },
      h("div", { style: { fontSize: 13, fontWeight: 800, color: isCorrect ? t.green : t.amber, marginBottom: 3 } }, isCorrect ? "Correct" : "Not quite"),
      h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.5 } }, q.why)) : null,
    h("div", { style: { height: 14 } }),
    reveal
      ? h(Btn, { kind: "go", full: true, onClick: nextQ }, idx + 1 >= total ? "See results" : "Next question")
      : h(Btn, { kind: "primary", full: true, disabled: (q.type === "fill" ? (!pick || ("" + pick).trim() === "") : pick === null), onClick: submit }, "Check answer"));
}

/* ============================================================================
   PART 6 — PRACTICE HUB, FLASHCARDS, LOGBOOK, RESOURCE LIBRARY
   ========================================================================== */

/* gather all quiz items the user has access to (done or unlocked) */
function accessiblePool(state) {
  var units = unitsForState(state);
  var pool = [];
  units.forEach(function (un) {
    un.lessons.forEach(function (id, idx) {
      if (progFor(state, id).done || lessonUnlocked(state, un, idx)) {
        var L = LESSONS[id];
        L.quiz.forEach(function (q) { pool.push({ lessonId: id, q: q }); });
      }
    });
  });
  return pool;
}
function donePool(state) {
  var pool = [];
  unitsForState(state).forEach(function (un) {
    un.lessons.forEach(function (id) {
      if (progFor(state, id).done) {
        LESSONS[id].quiz.forEach(function (q) { pool.push({ lessonId: id, q: q }); });
      }
    });
  });
  return pool;
}
function weakLessonIds(state) {
  var ids = [];
  unitsForState(state).forEach(function (un) {
    un.lessons.forEach(function (id) {
      var p = progFor(state, id);
      var w = state && state.weak ? state.weak[id] : 0;
      if (p.done && (p.mastery < 80 || (w && w > 0))) ids.push(id);
    });
  });
  return ids;
}
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* ============================================================================
   MOCK KNOWLEDGE TEST — a timed, scored practice exam built from the question
   bank, modeled on the FAA airman knowledge test (70% to pass). Per-certificate
   or full-mixed. No answers revealed until you submit — like the real thing.
   ========================================================================== */
function examQuestionsFor(certId) {
  var pool = []; var seen = {};
  for (var i = 0; i < UNITS.length; i++) {
    var un = UNITS[i];
    if (certId !== "all" && (un.cert || "foundation") !== certId) continue;
    for (var j = 0; j < un.lessons.length; j++) {
      var lid = un.lessons[j];
      if (seen[lid]) continue; seen[lid] = true;
      var L = LESSONS[lid];
      if (!L || !L.quiz) continue;
      for (var k = 0; k < L.quiz.length; k++) { pool.push({ lessonId: lid, qi: k, q: L.quiz[k], unit: un.title }); }
    }
  }
  return pool;
}
function examEvaluate(q, pick) {
  if (pick === null || pick === undefined) return false;
  if (q.type === "fill") {
    if (("" + pick).trim() === "") return false;
    var ok = normAnswer(pick) === normAnswer(q.answer);
    if (!ok && q.alts) { for (var i = 0; i < q.alts.length; i++) { if (normAnswer(pick) === normAnswer(q.alts[i])) ok = true; } }
    return ok;
  }
  return pick === q.answer;
}
function fmtClock(secs) {
  var s = secs < 0 ? 0 : secs;
  var m = Math.floor(s / 60); var r = s % 60;
  return m + ":" + (r < 10 ? "0" : "") + r;
}
function examBestOverall(state) {
  var best = null;
  if (state.exams) { for (var k in state.exams) { if (Object.prototype.hasOwnProperty.call(state.exams, k)) { var b = state.exams[k].best || 0; if (best === null || b > best) best = b; } } }
  return best;
}
function examCertLabel(certId) {
  if (certId === "all") return "Full mixed (all tracks)";
  for (var i = 0; i < LESSON_CERTS.length; i++) { if (LESSON_CERTS[i].id === certId) return LESSON_CERTS[i].label; }
  return certId;
}
function examPickText(q, pick) {
  if (!q) return "\u2014";
  if (q.type === "tf") return pick === true ? "True" : (pick === false ? "False" : "\u2014");
  if (q.type === "fill") return (pick === null || pick === undefined || ("" + pick).trim() === "") ? "\u2014" : ("" + pick);
  if (pick === null || pick === undefined) return "\u2014";
  return q.choices[pick];
}
function examAnswerText(q) {
  if (!q) return "\u2014";
  if (q.type === "tf") return q.answer ? "True" : "False";
  if (q.type === "fill") return q.answer;
  return q.choices[q.answer];
}
function examReconstructRow(row) {
  var L = LESSONS[row.lessonId];
  var q = (L && L.quiz && L.quiz[row.qi] !== undefined) ? L.quiz[row.qi] : null;
  if (!q) return { q: null, prompt: "(question unavailable)", your: "\u2014", correct: "\u2014", ok: !!row.ok, why: "", unit: row.unit ? row.unit : "" };
  return { q: q, prompt: q.q, your: examPickText(q, row.pick), correct: examAnswerText(q), ok: !!row.ok, why: q.why ? q.why : "", unit: row.unit ? row.unit : "" };
}
function htmlEsc(s) { var x = "" + s; x = x.split("&").join("&amp;"); x = x.split("<").join("&lt;"); x = x.split(">").join("&gt;"); x = x.split("\"").join("&quot;"); return x; }
function buildExamReportHTML(attempt) {
  var rows = attempt.rows || [];
  var itemsHtml = "";
  for (var i = 0; i < rows.length; i++) {
    var d = examReconstructRow(rows[i]);
    var okColor = d.ok ? "#1c7a4a" : "#b23b3b";
    var okLabel = d.ok ? "CORRECT" : "INCORRECT";
    itemsHtml += '<div class="q ' + (d.ok ? "ok" : "no") + '">'
      + '<div class="qh"><span class="qn">Q' + (i + 1) + '</span><span class="unit">' + htmlEsc(d.unit) + '</span><span class="tag" style="color:' + okColor + ';border-color:' + okColor + '">' + okLabel + '</span></div>'
      + '<div class="qt">' + htmlEsc(d.prompt) + '</div>'
      + (d.ok ? "" : '<div class="your">Your answer: ' + htmlEsc(d.your) + '</div>')
      + '<div class="ans">Correct answer: ' + htmlEsc(d.correct) + '</div>'
      + (d.why ? '<div class="why">' + htmlEsc(d.why) + '</div>' : "")
      + '</div>';
  }
  var passLabel = attempt.pass ? "PASS" : "BELOW PASSING";
  var passColor = attempt.pass ? "#1c7a4a" : "#b23b3b";
  var css = 'body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f1c28;background:#eef2f6;margin:0;padding:24px;}'
    + '.sheet{max-width:760px;margin:0 auto;background:#fff;border:1px solid #d7e0e7;border-radius:12px;padding:28px 26px;}'
    + '.hd{display:flex;align-items:center;gap:12px;border-bottom:2px solid #163a57;padding-bottom:14px;margin-bottom:16px;}'
    + '.badge{width:42px;height:42px;border-radius:10px;background:#163a57;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;}'
    + '.brand{font-size:18px;font-weight:800;color:#163a57;}.sub{font-size:12.5px;color:#5a6b7a;}'
    + '.score{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:18px;}'
    + '.pct{font-size:40px;font-weight:800;}.pill{display:inline-block;padding:4px 12px;border-radius:99px;border:1px solid;font-weight:800;font-size:12px;}'
    + '.meta{font-size:12.5px;color:#5a6b7a;}'
    + '.q{border:1px solid #d7e0e7;border-left:4px solid #d7e0e7;border-radius:8px;padding:12px 14px;margin-bottom:10px;}'
    + '.q.no{border-left-color:#b23b3b;}.q.ok{border-left-color:#1c7a4a;}'
    + '.qh{display:flex;gap:8px;align-items:center;margin-bottom:6px;font-size:11px;color:#8595a3;}'
    + '.qn{font-weight:800;color:#163a57;}.unit{flex:1;text-transform:uppercase;letter-spacing:.4px;}'
    + '.tag{font-size:9.5px;font-weight:800;border:1px solid;border-radius:99px;padding:2px 8px;}'
    + '.qt{font-size:14px;font-weight:700;margin-bottom:7px;line-height:1.4;}'
    + '.your{font-size:12.5px;color:#b23b3b;margin-bottom:3px;}.ans{font-size:12.5px;color:#0f1c28;margin-bottom:4px;}'
    + '.why{font-size:12px;color:#5a6b7a;font-style:italic;line-height:1.5;}'
    + '.foot{margin-top:18px;padding-top:12px;border-top:1px solid #d7e0e7;font-size:10px;color:#8595a3;line-height:1.5;}'
    + '@media print{body{background:#fff;padding:0;}.sheet{border:none;border-radius:0;max-width:none;}}';
  var doc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'
    + htmlEsc(BRAND) + ' \u2014 Mock Test Report</title><style>' + css + '</style></head><body><div class="sheet">'
    + '<div class="hd"><div class="badge">Av</div><div><div class="brand">' + htmlEsc(BRAND) + '</div><div class="sub">Mock Knowledge Test \u2014 Results Report</div></div></div>'
    + '<div class="score"><div class="pct" style="color:' + passColor + '">' + attempt.pct + '%</div>'
    + '<div class="pill" style="color:' + passColor + ';border-color:' + passColor + '">' + passLabel + '</div>'
    + '<div class="meta">' + attempt.correct + ' of ' + attempt.total + ' correct &middot; ' + htmlEsc(attempt.certLabel) + ' &middot; ' + htmlEsc(attempt.date) + ' &middot; passing standard 70%</div></div>'
    + itemsHtml
    + '<div class="foot">Generated by ' + htmlEsc(BRAND) + ', an independent flight-study application. Practice only \u2014 not the FAA knowledge test, not affiliated with the FAA, and not a record of any official exam. Questions are original study items.</div>'
    + '</div></body></html>';
  return doc;
}
function downloadHtmlReport(attempt) {
  try {
    var html = buildExamReportHTML(attempt);
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "AvHype-MockTest-" + (attempt.certId ? attempt.certId : "mixed") + "-" + (attempt.date ? attempt.date : "report") + ".html";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    window.setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) { return; } }, 1500);
    return true;
  } catch (e) { return false; }
}

function ExamScreen(props) {
  var t = useT();
  var state = props.state;
  var phaseS = useState("setup"); var phase = phaseS[0], setPhase = phaseS[1];
  var certS = useState("all"); var cert = certS[0], setCert = certS[1];
  var lenS = useState(20); var lenWanted = lenS[0], setLenWanted = lenS[1];
  var poolS = useState([]); var pool = poolS[0], setPool = poolS[1];
  var idxS = useState(0); var idx = idxS[0], setIdx = idxS[1];
  var ansS = useState({}); var answers = ansS[0], setAnswers = ansS[1];
  var flagS = useState({}); var flags = flagS[0], setFlags = flagS[1];
  var leftS = useState(0); var left = leftS[0], setLeft = leftS[1];
  var navOpenS = useState(false); var navOpen = navOpenS[0], setNavOpen = navOpenS[1];
  var resultRef = useRef(null);
  var recordedRef = useRef(false);
  var loggedS = useState(false); var logged = loggedS[0], setLogged = loggedS[1];

  var certOpts = [{ id: "all", label: "Full mixed (all tracks)" }];
  LESSON_CERTS.forEach(function (c) { if (examQuestionsFor(c.id).length >= 8) certOpts.push({ id: c.id, label: c.label }); });
  var availCount = examQuestionsFor(cert).length;
  var lenChoices = [10, 20, 40, 60].filter(function (n) { return n <= availCount; });
  if (lenChoices.length === 0) lenChoices = [availCount];
  if (lenChoices.indexOf(availCount) === -1 && availCount < 60) lenChoices.push(availCount);

  function startExam() {
    var all = shuffle(examQuestionsFor(cert));
    var n = Math.min(lenWanted, all.length); if (n < 1) n = all.length;
    setPool(all.slice(0, n)); setIdx(0); setAnswers({}); setFlags({}); setNavOpen(false);
    setLeft(n * 75);
    recordedRef.current = false; resultRef.current = null;
    setLogged(false);
    setPhase("run");
  }
  function pickAnswer(v) { var na = {}; for (var k in answers) na[k] = answers[k]; na[idx] = v; setAnswers(na); }
  function toggleFlag() { var nf = {}; for (var k in flags) nf[k] = flags[k]; nf[idx] = !nf[idx]; setFlags(nf); }
  function goTo(i) { setIdx(i); setNavOpen(false); }
  function prev() { if (idx > 0) setIdx(idx - 1); }
  function next() { if (idx < pool.length - 1) setIdx(idx + 1); }

  function submitExam() {
    var correct = 0; var rows = [];
    for (var i = 0; i < pool.length; i++) {
      var it = pool[i]; var pk = answers[i]; var isC = examEvaluate(it.q, pk);
      if (isC) correct += 1;
      rows.push({ q: it.q, pick: pk, ok: isC, unit: it.unit, lessonId: it.lessonId, qi: it.qi });
    }
    var total = pool.length;
    var pct = total ? Math.round((correct / total) * 100) : 0;
    var used = (total * 75) - left; if (used < 0) used = 0;
    var ts = Date.now();
    resultRef.current = { correct: correct, total: total, pct: pct, used: used, rows: rows, ts: ts, attemptId: "att_" + ts };
    setPhase("result");
  }

  /* countdown */
  useEffect(function () {
    if (phase !== "run") return undefined;
    var id = window.setInterval(function () { setLeft(function (s) { return s <= 1 ? 0 : s - 1; }); }, 1000);
    return function () { window.clearInterval(id); };
  }, [phase]);
  useEffect(function () { if (phase === "run" && left === 0 && pool.length) submitExam(); }, [left, phase]);
  /* record once when results land */
  useEffect(function () {
    if (phase === "result" && resultRef.current && !recordedRef.current) {
      recordedRef.current = true;
      if (props.onRecord) props.onRecord(cert, resultRef.current.correct, resultRef.current.total, resultRef.current.pct);
    }
  }, [phase]);

  /* ----- SETUP ----- */
  if (phase === "setup") {
    var certBest = state.exams && state.exams[cert] ? state.exams[cert] : null;
    return h("div", null,
      h(SubHeader, { title: "Mock Knowledge Test", onBack: props.onBack }),
      h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 16px", lineHeight: 1.55 } },
        "A timed, scored practice exam drawn from the full question bank. The FAA airman knowledge test requires ", h("b", { style: { color: t.text } }, "70% to pass"), " \u2014 this mirrors that. Answers stay hidden until you submit, so it feels like the real test."),
      h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: "16px 16px", marginBottom: 16 } },
        h(SectionLabel, { style: { marginBottom: 9 } }, "Choose a track"),
        h(Dropdown, { value: cert, options: certOpts, onChange: function (id) { setCert(id); }, tint: t.sky }),
        h("div", { style: { fontFamily: MONO, fontSize: 11.5, color: t.textFaint, marginTop: 8 } }, availCount + " questions available" + (certBest ? (" \u00b7 your best: " + certBest.best + "%") : "")),
        h(SectionLabel, { style: { margin: "18px 0 9px" } }, "How many questions"),
        h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
          lenChoices.map(function (n) {
            var on = lenWanted === n || (lenChoices.indexOf(lenWanted) === -1 && n === lenChoices[lenChoices.length - 1]);
            function pickLen() { setLenWanted(n); }
            return h("button", { key: n, onClick: pickLen, style: { padding: "10px 16px", borderRadius: 11, cursor: "pointer", border: "2px solid " + (on ? t.sky : t.line), background: on ? t.sky + "1A" : t.panel, color: on ? t.sky : t.textDim, fontFamily: MONO, fontSize: 14, fontWeight: 800 } }, n);
          })),
        h("div", { style: { fontFamily: MONO, fontSize: 11, color: t.textFaint, marginTop: 10 } }, "Time budget: 75 seconds per question (" + fmtClock(Math.min(lenWanted, availCount) * 75) + " total)")),
      h(Btn, { kind: "go", full: true, onClick: startExam }, "Start exam"),
      (props.examLog && props.examLog.length && props.onOpenLog) ? h("button", { onClick: props.onOpenLog, style: { width: "100%", marginTop: 12, background: "transparent", border: "1px solid " + t.line, borderRadius: 12, cursor: "pointer", color: t.text, fontFamily: SANS, fontSize: 13.5, fontWeight: 700, padding: "11px 0" } }, "View past results (" + props.examLog.length + ")") : null,
      h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 14, lineHeight: 1.55 } }, "Practice only. This is not the FAA knowledge test and a passing score here does not authorize you to take or pass any official exam. Questions are original study items, not retired FAA test questions."));
  }

  /* ----- RESULT ----- */
  if (phase === "result") {
    var R = resultRef.current || { correct: 0, total: 0, pct: 0, used: 0, rows: [] };
    var passed = R.pct >= 70;
    var col = passed ? t.green : t.magenta;
    var xpEarned = R.correct * 5 + (passed ? 25 : 0);
    function letterFor(q, v) {
      if (q.type === "tf") return v === true ? "True" : (v === false ? "False" : "\u2014");
      if (q.type === "fill") return (v === null || v === undefined || ("" + v).trim() === "") ? "\u2014" : ("" + v);
      if (v === null || v === undefined) return "\u2014";
      return q.choices[v];
    }
    function correctText(q) {
      if (q.type === "tf") return q.answer ? "True" : "False";
      if (q.type === "fill") return q.answer;
      return q.choices[q.answer];
    }
    function buildAttempt() {
      var rows = [];
      for (var bi = 0; bi < R.rows.length; bi++) { var br = R.rows[bi]; rows.push({ lessonId: br.lessonId, qi: br.qi, pick: br.pick, ok: br.ok, unit: br.unit }); }
      return { id: R.attemptId, ts: R.ts, date: todayStr(), certId: cert, certLabel: examCertLabel(cert), correct: R.correct, total: R.total, pct: R.pct, pass: passed, used: R.used, rows: rows };
    }
    var missedPool = [];
    for (var mi = 0; mi < R.rows.length; mi++) { if (!R.rows[mi].ok) missedPool.push({ lessonId: R.rows[mi].lessonId, q: R.rows[mi].q }); }
    return h("div", null,
      h(SubHeader, { title: "Exam results", onBack: props.onBack }),
      h("div", { style: { background: "linear-gradient(135deg," + col + "22,transparent)", border: "1px solid " + col, borderRadius: 18, padding: "20px 18px", marginBottom: 16, textAlign: "center" } },
        h("div", { style: { fontFamily: MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 800, color: col } }, passed ? "PASS" : "BELOW PASSING"),
        h("div", { style: { fontSize: 46, fontWeight: 900, color: t.text, lineHeight: 1.05, marginTop: 4 } }, R.pct + "%"),
        h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 4 } }, R.correct + " of " + R.total + " correct \u00b7 " + fmtClock(R.used) + " used"),
        h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 8 } }, "Passing standard: 70%"),
        h("div", { style: { display: "inline-block", marginTop: 12, padding: "5px 12px", borderRadius: 99, background: t.amber + "1A", border: "1px solid " + t.amber, fontFamily: MONO, fontSize: 12.5, fontWeight: 800, color: t.amber } }, "+" + xpEarned + " XP")),
      h("div", { style: { display: "flex", gap: 10, marginBottom: 12 } },
        h("div", { style: { flex: 1 } }, h(Btn, { kind: "go", onClick: function () { setPhase("setup"); }, full: true }, "New exam")),
        h("div", { style: { flex: 1 } }, h(Btn, { kind: "ghost", onClick: startExam, full: true }, "Retake"))),
      h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "13px 13px", marginBottom: 18 } },
        h(SectionLabel, { style: { marginBottom: 9 } }, "Save & study"),
        h("div", { style: { display: "flex", gap: 10, marginBottom: missedPool.length ? 10 : 0 } },
          h("div", { style: { flex: 1 } }, h(Btn, { kind: logged ? "soft" : "primary", full: true, disabled: logged, onClick: function () { if (!logged && props.onLogExam) { props.onLogExam(buildAttempt()); setLogged(true); } } }, logged ? "Logged \u2713" : "Log this result")),
          h("div", { style: { flex: 1 } }, h(Btn, { kind: "ghost", full: true, onClick: function () { downloadHtmlReport(buildAttempt()); } }, "Download report"))),
        missedPool.length ? h(Btn, { kind: "soft", full: true, onClick: function () { if (props.onStudyMissed) props.onStudyMissed(missedPool, "Missed questions \u2014 review"); } }, "Study the " + missedPool.length + " you missed") : null,
        h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 10, lineHeight: 1.5 } }, logged ? "Saved to your Exam Log \u2014 open it any time from the menu to review or restudy." : "Log it to revisit and restudy later from your Exam Log, or download a right-vs-wrong report (open it to print or save as PDF)."),
        props.onOpenLog ? h("button", { onClick: props.onOpenLog, style: { marginTop: 8, background: "transparent", border: "none", cursor: "pointer", color: t.sky, fontFamily: SANS, fontSize: 13, fontWeight: 700, padding: 0 } }, "View Exam Log \u203a") : null),
      h(SectionLabel, { style: { marginBottom: 10 } }, "Review every question"),
      R.rows.map(function (row, i) {
        return h("div", { key: i, style: { background: t.panel, border: "1px solid " + (row.ok ? t.line : t.magenta + "66"), borderRadius: 14, padding: "12px 13px", marginBottom: 10 } },
          h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
            h("div", { style: { width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: (row.ok ? t.green : t.magenta) + "22", display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: row.ok ? "check" : "x", size: 13, color: row.ok ? t.green : t.magenta })),
            h("div", { style: { fontFamily: MONO, fontSize: 10.5, color: t.textFaint, fontWeight: 700 } }, "Q" + (i + 1) + " \u00b7 " + row.unit)),
          h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, lineHeight: 1.4, marginBottom: 7 } }, row.q.q),
          row.ok ? null : h("div", { style: { fontSize: 12.5, color: t.magenta, marginBottom: 3 } }, "Your answer: " + letterFor(row.q, row.pick)),
          h("div", { style: { fontSize: 12.5, color: row.ok ? t.green : t.text, marginBottom: 5 } }, (row.ok ? "Correct: " : "Correct answer: ") + correctText(row.q)),
          row.q.why ? h("div", { style: { fontSize: 12, color: t.textDim, lineHeight: 1.5, fontStyle: "italic" } }, row.q.why) : null);
      }));
  }

  /* ----- RUN ----- */
  var item = pool[idx]; var q = item ? item.q : null;
  if (!q) return h("div", null, h(SubHeader, { title: "Mock Knowledge Test", onBack: props.onBack }));
  var pick = answers[idx];
  var answeredCount = 0; for (var ak in answers) { if (answers[ak] !== null && answers[ak] !== undefined && ("" + answers[ak]).trim() !== "") answeredCount += 1; }
  var flaggedCount = 0; for (var fk in flags) { if (flags[fk]) flaggedCount += 1; }
  var unanswered = pool.length - answeredCount;
  var low = left <= 60;

  function optBtn(label, val, key) {
    var on = pick === val;
    function tap() { pickAnswer(val); }
    return h("button", { key: key, onClick: tap, style: { display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", padding: "12px 14px", marginBottom: 9, borderRadius: 12, cursor: "pointer", border: "2px solid " + (on ? t.sky : t.line), background: on ? t.sky + "14" : t.panel, color: t.text, fontFamily: SANS, fontSize: 14, fontWeight: on ? 700 : 500, lineHeight: 1.35 } }, label);
  }
  var answerUI;
  if (q.type === "mc") answerUI = h("div", null, q.choices.map(function (c, i) { return optBtn(c, i, i); }));
  else if (q.type === "tf") answerUI = h("div", null, optBtn("True", true, "tt"), optBtn("False", false, "ff"));
  else answerUI = h("input", { value: pick === undefined ? "" : pick, onChange: function (e) { pickAnswer(e.target.value); }, placeholder: "Type your answer\u2026", style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "2px solid " + t.line, background: t.bg, color: t.text, fontFamily: SANS, fontSize: 15, outline: "none" } });

  return h("div", null,
    /* exam header: timer + progress */
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } },
      h("button", { onClick: props.onBack, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textDim, padding: 0, display: "flex", alignItems: "center" } }, h(Glyph, { name: "x", size: 22, color: t.textDim })),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 12, fontWeight: 800, color: t.text } }, "Question " + (idx + 1) + " of " + pool.length),
        h("div", { style: { marginTop: 4 } }, h(Bar, { pct: Math.round(((idx + 1) / pool.length) * 100), color: t.sky, h: 5 }))),
      h("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 99, background: low ? t.magenta + "1A" : t.panel, border: "1px solid " + (low ? t.magenta : t.line) } },
        h(Glyph, { name: "clock", size: 15, color: low ? t.magenta : t.textDim }),
        h("div", { style: { fontFamily: MONO, fontSize: 14, fontWeight: 800, color: low ? t.magenta : t.text } }, fmtClock(left)))),
    /* question card */
    h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: "16px 16px", marginBottom: 14 } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
        h("div", { style: { fontFamily: MONO, fontSize: 10, letterSpacing: 0.6, color: t.textFaint, fontWeight: 700, textTransform: "uppercase" } }, item.unit),
        h("button", { onClick: toggleFlag, style: { display: "inline-flex", alignItems: "center", gap: 5, background: flags[idx] ? t.amber + "1A" : "transparent", border: "1px solid " + (flags[idx] ? t.amber : t.line), borderRadius: 99, padding: "4px 10px", cursor: "pointer", color: flags[idx] ? t.amber : t.textDim, fontFamily: SANS, fontSize: 11.5, fontWeight: 700 } }, h(Glyph, { name: "pin", size: 13, color: flags[idx] ? t.amber : t.textDim }), flags[idx] ? "Flagged" : "Flag")),
      h("div", { style: { fontSize: 16.5, fontWeight: 800, color: t.text, lineHeight: 1.4, marginBottom: 14 } }, q.q),
      answerUI),
    /* nav row */
    h("div", { style: { display: "flex", gap: 10, marginBottom: 12 } },
      h("button", { onClick: prev, disabled: idx === 0, style: { flex: 1, padding: "12px 0", borderRadius: 12, cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.4 : 1, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14, fontWeight: 700 } }, "Previous"),
      idx === pool.length - 1
        ? h("button", { onClick: function () { setNavOpen(true); }, style: { flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer", border: "none", background: t.green, color: "#04210f", fontFamily: SANS, fontSize: 14, fontWeight: 800 } }, "Review & submit")
        : h("button", { onClick: next, style: { flex: 1, padding: "12px 0", borderRadius: 12, cursor: "pointer", border: "none", background: t.sky, color: "#04121f", fontFamily: SANS, fontSize: 14, fontWeight: 800 } }, "Next")),
    h("button", { onClick: function () { setNavOpen(true); }, style: { width: "100%", padding: "10px 0", borderRadius: 12, cursor: "pointer", border: "1px dashed " + t.line, background: "transparent", color: t.textDim, fontFamily: SANS, fontSize: 13, fontWeight: 700 } }, "Jump to question \u00b7 " + answeredCount + "/" + pool.length + " answered" + (flaggedCount ? (" \u00b7 " + flaggedCount + " flagged") : "")),
    /* navigator / submit sheet */
    navOpen ? h(Modal, { open: true, onClose: function () { setNavOpen(false); }, title: "Your answer sheet" },
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 16 } },
        pool.map(function (it2, i) {
          var done2 = answers[i] !== null && answers[i] !== undefined && ("" + answers[i]).trim() !== "";
          var fl = flags[i];
          function jump() { goTo(i); }
          return h("button", { key: i, onClick: jump, style: { aspectRatio: "1", borderRadius: 9, cursor: "pointer", border: "2px solid " + (fl ? t.amber : (done2 ? t.sky : t.line)), background: done2 ? t.sky + "1A" : t.panel, color: done2 ? t.sky : t.textDim, fontFamily: MONO, fontSize: 13, fontWeight: 800 } }, i + 1);
        })),
      unanswered > 0 ? h("div", { style: { fontSize: 12.5, color: t.amber, marginBottom: 12, fontWeight: 600 } }, unanswered + " question" + (unanswered > 1 ? "s" : "") + " still unanswered \u2014 unanswered questions are scored as incorrect.") : null,
      h(Btn, { kind: "go", full: true, onClick: submitExam }, "Submit exam for scoring")) : null);
}

function ExamLogScreen(props) {
  var t = useT();
  var log = (props.state && props.state.examLog) ? props.state.examLog : [];
  var openS = useState(null); var openId = openS[0], setOpenId = openS[1];
  function fmtDate(s) { var p = ("" + s).split("-"); if (p.length === 3) return p[1] + "/" + p[2] + "/" + p[0]; return s; }

  if (openId) {
    var att = null;
    for (var ai = 0; ai < log.length; ai++) { if (log[ai].id === openId) att = log[ai]; }
    if (!att) return h("div", null, h(SubHeader, { title: "Exam review", onBack: function () { setOpenId(null); } }), h(Card, { style: { textAlign: "center" } }, h("div", { style: { fontSize: 14, color: t.textDim } }, "This attempt is no longer available.")));
    var col = att.pass ? t.green : t.magenta;
    var missed = [];
    for (var mm = 0; mm < att.rows.length; mm++) { var L = LESSONS[att.rows[mm].lessonId]; var qq = (L && L.quiz && L.quiz[att.rows[mm].qi] !== undefined) ? L.quiz[att.rows[mm].qi] : null; if (!att.rows[mm].ok && qq) missed.push({ lessonId: att.rows[mm].lessonId, q: qq }); }
    return h("div", null,
      h(SubHeader, { title: "Exam review", onBack: function () { setOpenId(null); } }),
      h("div", { style: { background: "linear-gradient(135deg," + col + "22,transparent)", border: "1px solid " + col, borderRadius: 18, padding: "18px 16px", marginBottom: 14, textAlign: "center" } },
        h("div", { style: { fontFamily: MONO, fontSize: 11, letterSpacing: 1.5, fontWeight: 800, color: col } }, att.pass ? "PASS" : "BELOW PASSING"),
        h("div", { style: { fontSize: 42, fontWeight: 900, color: t.text, lineHeight: 1.05, marginTop: 4 } }, att.pct + "%"),
        h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 4 } }, att.correct + " of " + att.total + " correct"),
        h("div", { style: { fontSize: 12, color: t.textFaint, marginTop: 4 } }, att.certLabel + " \u00b7 " + fmtDate(att.date))),
      h("div", { style: { display: "flex", gap: 10, marginBottom: 10 } },
        missed.length ? h("div", { style: { flex: 1 } }, h(Btn, { kind: "go", full: true, onClick: function () { if (props.onStudyMissed) props.onStudyMissed(missed, "Missed questions \u2014 review"); } }, "Study the " + missed.length + " missed")) : null,
        h("div", { style: { flex: 1 } }, h(Btn, { kind: "ghost", full: true, onClick: function () { downloadHtmlReport(att); } }, "Download report"))),
      h("div", { style: { marginBottom: 18 } }, h(Btn, { kind: "danger", small: true, onClick: function () { if (props.onDelete) props.onDelete(att.id); setOpenId(null); } }, "Delete this attempt")),
      h(SectionLabel, { style: { marginBottom: 10 } }, "Every question"),
      att.rows.map(function (row, i) {
        var d = examReconstructRow(row);
        return h("div", { key: i, style: { background: t.panel, border: "1px solid " + (d.ok ? t.line : t.magenta + "66"), borderRadius: 14, padding: "12px 13px", marginBottom: 10 } },
          h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
            h("div", { style: { width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: (d.ok ? t.green : t.magenta) + "22", display: "flex", alignItems: "center", justifyContent: "center" } }, h(Glyph, { name: d.ok ? "check" : "x", size: 13, color: d.ok ? t.green : t.magenta })),
            h("div", { style: { fontFamily: MONO, fontSize: 10.5, color: t.textFaint, fontWeight: 700 } }, "Q" + (i + 1) + (d.unit ? (" \u00b7 " + d.unit) : ""))),
          h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, lineHeight: 1.4, marginBottom: 7 } }, d.prompt),
          d.ok ? null : h("div", { style: { fontSize: 12.5, color: t.magenta, marginBottom: 3 } }, "Your answer: " + d.your),
          h("div", { style: { fontSize: 12.5, color: d.ok ? t.green : t.text, marginBottom: 5 } }, (d.ok ? "Correct: " : "Correct answer: ") + d.correct),
          d.why ? h("div", { style: { fontSize: 12, color: t.textDim, lineHeight: 1.5, fontStyle: "italic" } }, d.why) : null);
      }));
  }

  return h("div", null,
    h(SubHeader, { title: "Exam Log", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 16px", lineHeight: 1.55 } }, "Every Mock Knowledge Test you log is saved here \u2014 reopen one to review what you missed, restudy those questions, or download a report."),
    log.length === 0
      ? h(Card, { style: { textAlign: "center", padding: "26px 18px" } },
          h("div", { style: { width: 48, height: 48, borderRadius: 13, background: t.sky + "1A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" } }, h(Glyph, { name: "checklist", size: 26, color: t.sky })),
          h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text } }, "No logged results yet"),
          h("div", { style: { fontSize: 13, color: t.textDim, marginTop: 5, lineHeight: 1.5 } }, "Finish a Mock Knowledge Test and tap \u201CLog this result\u201D to save it here for studying."))
      : log.map(function (a) {
          function open() { setOpenId(a.id); }
          var col = a.pass ? t.green : t.magenta;
          return h("div", { key: a.id, onClick: open, style: { display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", marginBottom: 10, background: t.panel, border: "1px solid " + t.line, borderRadius: 16, cursor: "pointer" } },
            h("div", { style: { width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: col + "1A", border: "1px solid " + col, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } },
              h("div", { style: { fontFamily: MONO, fontSize: 15, fontWeight: 900, color: col, lineHeight: 1 } }, a.pct + "%")),
            h("div", { style: { flex: 1, minWidth: 0 } },
              h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, lineHeight: 1.25 } }, a.certLabel),
              h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 2 } }, a.correct + "/" + a.total + " correct \u00b7 " + fmtDate(a.date) + " \u00b7 " + (a.pass ? "Pass" : "Below passing"))),
            h(Glyph, { name: "more", size: 18, color: t.textDim }));
        }));
}

function PracticeScreen(props) {
  var t = useT();
  var state = props.state;
  var done = donePool(state);
  var weakIds = weakLessonIds(state);
  var doneCount = 0, mSum = 0, mN = 0;
  unitsForState(state).forEach(function (un) {
    un.lessons.forEach(function (id) {
      var p = progFor(state, id);
      if (p.done) { doneCount += 1; mSum += p.mastery; mN += 1; }
    });
  });
  var avgM = mN ? Math.round(mSum / mN) : 0;

  function startWeak() {
    var pool = [];
    weakIds.forEach(function (id) { LESSONS[id].quiz.forEach(function (q) { pool.push({ lessonId: id, q: q }); }); });
    props.onStartPool(shuffle(pool).slice(0, 12), "Weak-area review");
  }
  function startRandom() {
    var src = done.length ? done : accessiblePool(state);
    props.onStartPool(shuffle(src).slice(0, 10), "Mixed review");
  }
  function startFlash() {
    var cards = [];
    unitsForState(state).forEach(function (un) {
      un.lessons.forEach(function (id) {
        if (progFor(state, id).done) {
          var L = LESSONS[id];
          if (L && L.terms) { L.terms.forEach(function (pair) { cards.push({ term: pair[0], def: pair[1], lesson: L.title }); }); }
        }
      });
    });
    props.onFlashcards(shuffle(cards));
  }

  var tiles = [
    { id: "weak", title: "Weak-area review", desc: weakIds.length ? (weakIds.length + " lesson" + (weakIds.length > 1 ? "s" : "") + " below proficient") : "Nothing weak yet — keep learning", glyph: "bolt", color: t.magenta, disabled: weakIds.length === 0, go: startWeak },
    { id: "mixed", title: "Mixed review quiz", desc: done.length ? "Random questions from finished lessons" : "Finish a lesson to unlock", glyph: "practice", color: t.sky, disabled: done.length === 0, go: startRandom },
    { id: "flash", title: "Term review", desc: "Flip through key terms from lessons you've finished", glyph: "learn", color: t.green, disabled: done.length === 0, go: startFlash },
    { id: "deck", title: "Certificate flashcards", desc: "Key facts for any track - PPL, Instrument, ATP, and more", glyph: "wings-badge", color: t.magenta, disabled: false, go: props.onOpenDeck }
  ];

  return h("div", null,
    h("h1", { style: { fontSize: 24, fontWeight: 900, color: t.text, margin: "0 0 4px" } }, "Practice"),
    h("p", { style: { color: t.textDim, fontSize: 14, margin: "0 0 18px" } }, "Spaced repetition turns lessons into long-term memory. A little every day beats cramming."),
    props.onOpenExam ? (function () {
      var eb = examBestOverall(state);
      return h("div", { onClick: props.onOpenExam, style: { background: "linear-gradient(135deg," + t.sky + "26," + t.magenta + "12)", border: "1px solid " + t.sky, borderRadius: 18, padding: "16px 16px", marginBottom: 16, cursor: "pointer" } },
        h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
          h("div", { style: { width: 46, height: 46, borderRadius: 12, background: t.sky + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "wings-badge", size: 24, color: t.sky })),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontSize: 17, fontWeight: 900, color: t.text } }, "Mock Knowledge Test"),
            h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4 } }, "Timed exam, scored to the FAA's 70% pass standard" + (eb !== null ? (" \u00b7 best " + eb + "%") : ""))),
          h(Glyph, { name: "more", size: 18, color: t.textDim })));
    })() : null,
    /* stat strip */
    h("div", { style: { display: "flex", gap: 10, marginBottom: 20 } },
      [{ k: "Lessons done", v: doneCount }, { k: "Avg mastery", v: avgM + "%" }, { k: "To review", v: weakIds.length }].map(function (s) {
        return h("div", { key: s.k, style: { flex: 1, background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "12px 10px", textAlign: "center" } },
          h("div", { style: { fontFamily: MONO, fontSize: 20, fontWeight: 800, color: t.text } }, s.v),
          h("div", { style: { fontSize: 10.5, color: t.textFaint, letterSpacing: 0.4, marginTop: 2 } }, s.k));
      })),
    tiles.map(function (tile) {
      return h("div", { key: tile.id, onClick: function () { if (!tile.disabled) tile.go(); },
        style: { display: "flex", alignItems: "center", gap: 14, padding: "16px 16px", marginBottom: 12, borderRadius: 16, cursor: tile.disabled ? "default" : "pointer", opacity: tile.disabled ? 0.55 : 1, background: t.panel, border: "1px solid " + t.line } },
        h("div", { style: { width: 46, height: 46, borderRadius: 12, background: tile.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
          h(Glyph, { name: tile.glyph, size: 24, color: tile.color })),
        h("div", { style: { flex: 1 } },
          h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, tile.title),
          h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4 } }, tile.desc)),
        tile.disabled ? h(Glyph, { name: "lock", size: 16, color: t.textFaint }) : h(Glyph, { name: "more", size: 18, color: t.textDim }));
    }));
}

/* ----------------------------------------------------------- flashcards */
function FlashcardView(props) {
  var t = useT();
  var cards = props.cards;
  var idxState = useState(0);
  var idx = idxState[0], setIdx = idxState[1];
  var flipState = useState(false);
  var flip = flipState[0], setFlip = flipState[1];
  if (!cards || cards.length === 0) return null;
  var c = cards[idx];
  function go(n) {
    var ni = idx + n;
    if (ni < 0) ni = 0;
    if (ni > cards.length - 1) ni = cards.length - 1;
    setIdx(ni); setFlip(false);
  }
  return h("div", null,
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 } },
      h("button", { onClick: props.onBack, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textDim, padding: 0 } }, h(Glyph, { name: "x", size: 22, color: t.textDim })),
      h("div", { style: { flex: 1 } }, h(Bar, { pct: ((idx + 1) / cards.length) * 100, color: t.green, h: 8 })),
      h("div", { style: { fontFamily: MONO, fontSize: 13, fontWeight: 700, color: t.textDim } }, (idx + 1) + "/" + cards.length)),
    h("div", { onClick: function () { setFlip(!flip); },
      style: { minHeight: 260, borderRadius: 20, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "28px 22px", background: flip ? t.panelHi : t.panel, border: "1.5px solid " + (flip ? t.green : t.line), transition: "background .2s ease" } },
      h(SectionLabel, { style: { color: flip ? t.green : t.sky } }, flip ? "Definition" : "Term"),
      h("div", { style: { fontSize: flip ? 17 : 26, fontWeight: flip ? 600 : 900, color: t.text, lineHeight: 1.4, marginTop: 6 } }, flip ? c.def : c.term),
      h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 16 } }, flip ? c.lesson : "Tap to flip")),
    h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
      h(Btn, { kind: "ghost", onClick: function () { go(-1); }, disabled: idx === 0 }, "Previous"),
      h(Btn, { kind: "primary", full: true, onClick: function () { if (idx === cards.length - 1) props.onBack(); else go(1); } }, idx === cards.length - 1 ? "Finish" : "Next card")));
}

/* ------------------------------------------------------------- logbook */
var LOG_CATS = [
  { id: "airplane", label: "Airplane" },
  { id: "helicopter", label: "Helicopter" },
  { id: "drone", label: "Drone" },
  { id: "sim", label: "Simulator" },
  { id: "ground", label: "Ground" }
];
var LOG_ROLES = ["Dual", "Solo", "PIC", "Sim", "Ground"];

function csvCell(v) {
  var s = "" + (v === null || v === undefined ? "" : v);
  s = s.split('"').join('""');
  return '"' + s + '"';
}

/* ===================== training milestones (endorsement-style) ===================== */
var MILESTONES = (typeof window !== "undefined" && window.__AV_MILESTONES__) ? window.__AV_MILESTONES__ : [];

function unitById(id) { for (var i = 0; i < UNITS.length; i++) if (UNITS[i].id === id) return UNITS[i]; return null; }
function milestoneStatus(state, m) {
  var done = 0, total = 0, lastDate = "";
  for (var u = 0; u < m.units.length; u++) {
    var un = unitById(m.units[u]);
    if (!un) continue;
    for (var l = 0; l < un.lessons.length; l++) {
      total += 1;
      var p = progFor(state, un.lessons[l]);
      if (p.done) { done += 1; var dd = p.doneAt ? p.doneAt : (p.last ? p.last : ""); if (dd > lastDate) lastDate = dd; }
    }
  }
  var earned = total > 0 && done === total;
  return { earned: earned, done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0, date: lastDate };
}
function milestonesForState(state) {
  var paths = (state.profile && state.profile.pathways) ? state.profile.pathways : [];
  var out = [];
  MILESTONES.forEach(function (m) {
    if (m.pathway === "foundation") { out.push(m); return; }
    for (var i = 0; i < paths.length; i++) if (paths[i] === m.pathway) { out.push(m); return; }
  });
  return out;
}
function earnedMilestoneCount(state) {
  var n = 0;
  milestonesForState(state).forEach(function (m) { if (milestoneStatus(state, m).earned) n += 1; });
  return n;
}
function citeText(m, name) { return m.cite.split("%NAME%").join(name && name.trim() !== "" ? name : "This student"); }

function MilestonesView(props) {
  var t = useT();
  var state = props.state;
  var name = (state.profile && state.profile.name) ? state.profile.name : "";
  var list = milestonesForState(state);
  var earnedN = 0;
  list.forEach(function (m) { if (milestoneStatus(state, m).earned) earnedN += 1; });
  function fmtDate(s) { if (!s) return ""; var p = ("" + s).split("-"); if (p.length === 3) return p[1] + "/" + p[2] + "/" + p[0].slice(2); return s; }

  return h("div", null,
    h(SubHeader, { title: "Milestones", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, lineHeight: 1.55, margin: "0 0 14px" } }, "Endorsement-style checkpoints you earn by finishing each unit of study. They mark how far you have come \u2014 they are study milestones, not FAA endorsements."),
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 16, background: t.panel, border: "1px solid " + t.line, borderRadius: 14 } },
      h("div", { style: { fontFamily: MONO, fontSize: 26, fontWeight: 800, color: t.amber } }, earnedN + "/" + list.length),
      h("div", { style: { fontSize: 13, color: t.textDim } }, (earnedN === list.length && list.length > 0) ? "Every milestone earned \u2014 remarkable." : "milestones earned in your pathways")),
    list.map(function (m) {
      var st = milestoneStatus(state, m);
      var tint = tintColor(t, pathMeta(m.pathway).tint);
      var earned = st.earned;
      return h("div", { key: m.id, style: { position: "relative", marginBottom: 12, padding: "15px 15px 14px", borderRadius: 16, overflow: "hidden",
          background: earned ? (t.name === "dark" ? tint + "14" : tint + "10") : t.panel,
          border: "1px solid " + (earned ? tint + "66" : t.line) } },
        m.capstone ? h("div", { style: { position: "absolute", top: 11, right: 13, fontFamily: MONO, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, color: earned ? tint : t.textFaint } }, "CAPSTONE") : null,
        h("div", { style: { display: "flex", alignItems: "flex-start", gap: 13 } },
          h("div", { style: { width: 46, height: 46, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: earned ? tint + "22" : "transparent", border: "2px " + (earned ? "solid" : "dashed") + " " + (earned ? tint : t.line) } },
            h(Glyph, { name: earned ? "wings-badge" : "sign", size: 22, color: earned ? tint : t.textFaint })),
          h("div", { style: { flex: 1, minWidth: 0 } },
            h("div", { style: { fontSize: 15.5, fontWeight: 900, color: t.text, lineHeight: 1.2 } }, m.title),
            h("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: earned ? tint : t.textFaint, marginTop: 3, textTransform: "uppercase" } }, earned ? ("Earned " + fmtDate(st.date)) : (st.done + " of " + st.total + " lessons")))),
        earned
          ? h("div", { style: { marginTop: 12, paddingTop: 12, borderTop: "1px solid " + (tint + "33") } },
              h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.55, fontStyle: "italic" } }, "\u201C" + citeText(m, name) + "\u201D"),
              h("div", { style: { fontSize: 10.5, color: t.textFaint, marginTop: 8, lineHeight: 1.4 } }, "Study milestone issued by " + BRAND + ". Not an FAA endorsement; does not authorize any flight activity."))
          : h("div", { style: { marginTop: 12 } },
              h(Bar, { pct: st.pct, color: tint, h: 7 }),
              h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 7 } }, "Complete this unit to unlock the endorsement.")));
    }),
    h(ComplianceBanner, { text: "Milestones recognize study progress only. They are not FAA endorsements, do not certify any skill, and do not authorize solo flight or the operation of any aircraft.", margin: "8px 0 0 0" }));
}

function TranscriptView(props) {
  var t = useT();
  var state = props.state;
  useEffect(function () {
    try {
      if (!document.getElementById("fpa-print-style")) {
        var st = document.createElement("style");
        st.id = "fpa-print-style";
        st.textContent = "@media print{@page{margin:14mm;}html,body{background:#fff !important;}body *{visibility:hidden !important;}#transcript-print,#transcript-print *{visibility:visible !important;}#transcript-print{position:absolute !important;left:0;top:0;width:100% !important;box-shadow:none !important;border:none !important;margin:0 !important;}.fpa-no-print{display:none !important;}}";
        document.head.appendChild(st);
      }
    } catch (e) {}
  }, []);

  var name = (state.profile && state.profile.name) ? state.profile.name : "Future Pilot in Command";
  var created = (state.profile && state.profile.createdAt) ? state.profile.createdAt : "";
  var units = unitsForState(state);
  var doneN = 0, totalN = 0, scoreSum = 0, scoreCnt = 0, confSum = 0, confCnt = 0, minsSum = 0;
  var unitRows = [];
  units.forEach(function (un) {
    var ud = 0, um = 0, umCnt = 0;
    un.lessons.forEach(function (id) {
      totalN += 1;
      var p = progFor(state, id);
      if (p.done) { doneN += 1; ud += 1; scoreSum += p.best; scoreCnt += 1; var L = LESSONS[id]; if (L) minsSum += L.time; var sv = (state.surveys && state.surveys[id]) ? state.surveys[id] : null; if (sv && sv.confidence) { confSum += sv.confidence; confCnt += 1; } }
      var pm = progFor(state, id);
      if (pm.mastery) { um += pm.mastery; umCnt += 1; }
    });
    unitRows.push({ title: un.title, pathway: un.pathway, done: ud, total: un.lessons.length, mastery: umCnt ? Math.round(um / umCnt) : 0 });
  });
  var avgScore = scoreCnt ? Math.round(scoreSum / scoreCnt) : 0;
  var avgConf = confCnt ? (Math.round((confSum / confCnt) * 10) / 10) : 0;
  var hrs = Math.floor(minsSum / 60), rmins = minsSum % 60;
  var lvl = levelInfo(state.xp).level;
  var rk = rankForLevel(lvl);
  var pctDone = totalN ? Math.round((doneN / totalN) * 100) : 0;
  var milesList = milestonesForState(state);
  var earnedMiles = [];
  milesList.forEach(function (m) { var s = milestoneStatus(state, m); if (s.earned) earnedMiles.push({ title: m.title, date: s.date }); });

  var ledger = [];
  units.forEach(function (un) { un.lessons.forEach(function (id) { var p = progFor(state, id); if (p.done) { var L = LESSONS[id]; var sv = (state.surveys && state.surveys[id]) ? state.surveys[id] : null; ledger.push({ date: p.doneAt ? p.doneAt : (p.last ? p.last : ""), title: L ? L.title : id, pathway: L ? L.pathway : "foundation", cert: L ? L.cert : "", score: p.best, conf: (sv && sv.confidence) ? sv.confidence : 0 }); } }); });
  ledger.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });

  function fmtDate(s) { if (!s) return "\u2014"; var p = ("" + s).split("-"); if (p.length === 3) return p[1] + "/" + p[2] + "/" + p[0]; return s; }
  function fmtToday() { var d = new Date(); var mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; return mo[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); }
  function printNow() { try { window.print(); } catch (e) {} }

  var ink = "#0f1c28", sub = "#5a6b7a", line = "#d7e0e7", navy = "#163a57", sheet = "#ffffff", faint = "#8595a3";
  function statBox(label, value) {
    return h("div", { style: { flex: "1 1 80px", border: "1px solid " + line, borderRadius: 8, padding: "9px 8px", textAlign: "center" } },
      h("div", { style: { fontFamily: MONO, fontSize: 16, fontWeight: 800, color: navy } }, value),
      h("div", { style: { fontSize: 9, color: sub, letterSpacing: 0.3, marginTop: 2, textTransform: "uppercase" } }, label));
  }

  return h("div", null,
    h(SubHeader, { title: "Training Transcript", onBack: props.onBack }),
    h("div", { className: "fpa-no-print", style: { marginBottom: 12 } },
      h(Btn, { kind: "primary", full: true, onClick: printNow }, h(Glyph, { name: "checklist", size: 16, color: "#fff" }), "Print / Save as PDF")),
    h("p", { className: "fpa-no-print", style: { fontSize: 12, color: t.textDim, margin: "0 0 14px", lineHeight: 1.5 } }, "This opens your device's print dialog \u2014 choose \u201CSave as PDF\u201D to keep a copy. The sheet below is exactly what prints."),
    h("div", { id: "transcript-print", style: { background: sheet, color: ink, borderRadius: 14, border: "1px solid " + line, padding: "26px 22px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12, borderBottom: "2px solid " + navy, paddingBottom: 14, marginBottom: 14 } },
        h("div", { style: { width: 42, height: 42, borderRadius: 10, background: navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "wings-badge", size: 24, color: "#fff" })),
        h("div", { style: { flex: 1 } },
          h("div", { style: { fontSize: 18, fontWeight: 900, color: navy, letterSpacing: 0.3 } }, BRAND),
          h("div", { style: { fontSize: 12.5, color: sub, fontWeight: 600 } }, "Training Transcript \u00b7 Unofficial Record of Study"))),
      h("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 16 } },
        h("div", null,
          h("div", { style: { fontSize: 9, color: sub, letterSpacing: 0.5, textTransform: "uppercase" } }, "Student \u00b7 Future Pilot in Command"),
          h("div", { style: { fontSize: 16, fontWeight: 800, color: ink } }, name)),
        h("div", { style: { textAlign: "right" } },
          h("div", { style: { fontSize: 11, color: sub } }, "Issued " + fmtToday()),
          created ? h("div", { style: { fontSize: 11, color: sub } }, "Member since " + fmtDate(created)) : null)),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 } },
        statBox("Lessons", doneN + " / " + totalN),
        statBox("Syllabus", pctDone + "%"),
        statBox("Ground time", (hrs > 0 ? (hrs + "h " + rmins + "m") : (rmins + "m"))),
        statBox("Avg score", avgScore + "%"),
        statBox("Avg conf.", avgConf ? (avgConf + "/5") : "\u2014"),
        statBox("Flight lvl", "" + lvl),
        statBox("Milestones", "" + earnedMiles.length)),
      h("div", { style: { fontSize: 12, color: ink, marginBottom: 18, padding: "10px 12px", background: "#f4f7f9", borderRadius: 8, lineHeight: 1.5 } },
        "Current standing: Flight Level " + lvl + " \u00b7 hangar aircraft \u201C" + (rk ? rk.name : "") + ".\u201D " + (pctDone >= 100 ? "All enrolled coursework complete." : (pctDone + "% of enrolled coursework complete."))),
      h("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 1, color: navy, textTransform: "uppercase", marginBottom: 8 } }, "Coursework by unit"),
      h("div", { style: { border: "1px solid " + line, borderRadius: 8, overflow: "hidden", marginBottom: 18 } },
        h("div", { style: { display: "flex", gap: 8, padding: "7px 12px", background: "#eef3f6", borderBottom: "1px solid " + line } },
          h("div", { style: { flex: 1, fontSize: 9, fontWeight: 700, color: sub, letterSpacing: 0.5 } }, "UNIT"),
          h("div", { style: { width: 50, textAlign: "center", fontSize: 9, fontWeight: 700, color: sub } }, "DONE"),
          h("div", { style: { width: 58, textAlign: "right", fontSize: 9, fontWeight: 700, color: sub } }, "MASTERY")),
        unitRows.map(function (r, i) {
          var complete = r.done === r.total && r.total > 0;
          return h("div", { key: i, style: { display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", borderTop: i === 0 ? "none" : "1px solid " + line } },
            h("div", { style: { flex: 1, minWidth: 0 } },
              h("div", { style: { fontSize: 12.5, fontWeight: 700, color: ink, lineHeight: 1.25 } }, r.title),
              h("div", { style: { fontSize: 10, color: complete ? "#1c7a4a" : faint, fontWeight: 600 } }, complete ? "Complete" : (r.done > 0 ? "In progress" : "Not started"))),
            h("div", { style: { width: 50, textAlign: "center", fontFamily: MONO, fontSize: 12, color: ink } }, r.done + "/" + r.total),
            h("div", { style: { width: 58, textAlign: "right", fontFamily: MONO, fontSize: 12, fontWeight: 700, color: navy } }, r.mastery + "%"));
        })),
      earnedMiles.length > 0 ? h("div", { style: { marginBottom: 18 } },
        h("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 1, color: navy, textTransform: "uppercase", marginBottom: 8 } }, "Milestones earned"),
        earnedMiles.map(function (m, i) {
          return h("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: i < earnedMiles.length - 1 ? "1px solid " + line : "none" } },
            h("div", { style: { fontSize: 12.5, color: ink, fontWeight: 600 } }, m.title),
            h("div", { style: { fontFamily: MONO, fontSize: 11, color: sub } }, fmtDate(m.date)));
        })) : null,
      h("div", { style: { fontSize: 11, fontWeight: 800, letterSpacing: 1, color: navy, textTransform: "uppercase", marginBottom: 8 } }, "Training log"),
      ledger.length === 0
        ? h("div", { style: { fontSize: 12, color: sub, fontStyle: "italic", marginBottom: 8 } }, "No lessons completed yet.")
        : h("div", { style: { border: "1px solid " + line, borderRadius: 8, overflow: "hidden" } },
            h("div", { style: { display: "flex", gap: 8, padding: "7px 12px", background: "#eef3f6", borderBottom: "1px solid " + line } },
              h("div", { style: { width: 64, fontSize: 9, fontWeight: 700, color: sub } }, "DATE"),
              h("div", { style: { flex: 1, fontSize: 9, fontWeight: 700, color: sub } }, "LESSON"),
              h("div", { style: { width: 40, textAlign: "right", fontSize: 9, fontWeight: 700, color: sub } }, "SCORE")),
            ledger.map(function (e, i) {
              return h("div", { key: i, style: { display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 12px", borderTop: i === 0 ? "none" : "1px solid " + line } },
                h("div", { style: { width: 64, flexShrink: 0, fontFamily: MONO, fontSize: 10, color: sub } }, fmtDate(e.date)),
                h("div", { style: { flex: 1, minWidth: 0 } },
                  h("div", { style: { fontSize: 12, fontWeight: 600, color: ink, lineHeight: 1.25 } }, e.title),
                  h("div", { style: { fontSize: 10, color: faint } }, pathMeta(e.pathway).label + (e.cert ? " \u00b7 " + e.cert : "") + (e.conf ? " \u00b7 confidence " + e.conf + "/5" : ""))),
                h("div", { style: { width: 40, textAlign: "right", fontFamily: MONO, fontSize: 12, fontWeight: 700, color: e.score >= 80 ? "#1c7a4a" : e.score >= 50 ? "#b8860b" : "#b23b3b" } }, e.score + "%"));
            })),
      h("div", { style: { marginTop: 18, paddingTop: 12, borderTop: "1px solid " + line, fontSize: 10, color: faint, lineHeight: 1.5 } },
        "Generated by " + BRAND + ", an independent flight-study application. This transcript is an unofficial record of self-directed study activity. It is not issued by or affiliated with the Federal Aviation Administration, does not constitute flight training or a certified logbook, does not count toward aeronautical experience or any airman certificate or rating, and does not authorize the operation of any aircraft.")));
}

function TrainingLogView(props) {
  var t = useT();
  var state = props.state;
  var prof = state.profile || {};
  var fpName = prof.name ? prof.name : "fPIC";

  function fmtDate(s) {
    if (!s) return "\u2014";
    var p = ("" + s).split("-");
    if (p.length === 3) return p[1] + "/" + p[2] + "/" + p[0].slice(2);
    return s;
  }

  var units = unitsForState(state);
  var items = [];
  var totalMins = 0, scoreSum = 0, scoreN = 0, confSum = 0, confN = 0, totalLessons = 0;
  units.forEach(function (un) {
    un.lessons.forEach(function (id) {
      totalLessons += 1;
      var p = progFor(state, id);
      if (p.done) {
        var L = LESSONS[id];
        var sv = (state.surveys && state.surveys[id]) ? state.surveys[id] : null;
        var conf = (sv && sv.confidence) ? sv.confidence : 0;
        items.push({ id: id, date: p.doneAt ? p.doneAt : (p.last ? p.last : ""), title: L.title, pathway: L.pathway, cert: L.cert, mins: L.time, score: p.best, conf: conf, note: (sv && sv.comment) ? sv.comment : "", review: (sv && sv.review) ? true : false });
        totalMins += L.time; scoreSum += p.best; scoreN += 1;
        if (conf) { confSum += conf; confN += 1; }
      }
    });
  });
  items.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  var doneN = items.length;
  var avgScore = scoreN ? Math.round(scoreSum / scoreN) : 0;
  var avgConf = confN ? (Math.round((confSum / confN) * 10) / 10) : 0;
  var hrs = Math.floor(totalMins / 60);
  var rmins = totalMins % 60;
  var pctDone = totalLessons ? Math.round((doneN / totalLessons) * 100) : 0;
  var totalM = milestonesForState(state).length;
  var earnedM = earnedMilestoneCount(state);

  var suggestions = [];
  for (var u = 0; u < units.length && suggestions.length < 3; u++) {
    var un2 = units[u];
    for (var i2 = 0; i2 < un2.lessons.length && suggestions.length < 3; i2++) {
      var lid = un2.lessons[i2];
      if (!progFor(state, lid).done) {
        var LL = LESSONS[lid];
        suggestions.push({ id: lid, title: LL.title, pathway: LL.pathway, cert: LL.cert, mins: LL.time });
      }
    }
  }

  function exportCsv() {
    try {
      var header = ["Date", "Lesson", "Pathway", "Certificate", "Minutes", "Best score", "Confidence", "Flagged", "Notes"];
      var lines = [header.map(csvCell).join(",")];
      items.forEach(function (e) {
        lines.push([e.date, e.title, pathMeta(e.pathway).label, e.cert, e.mins, e.score + "%", e.conf ? (e.conf + "/5") : "", e.review ? "yes" : "", e.note].map(csvCell).join(","));
      });
      var blob = new Blob([lines.join("\n")], { type: "text/csv" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "freeflightdb-training-log.csv";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    } catch (e) {}
  }

  return h("div", null,
    h("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 2 } },
      h("div", null,
        h("h1", { style: { fontSize: 23, fontWeight: 900, color: t.text, margin: "0 0 3px" } }, "fPIC Logbook"),
        h("div", { style: { fontSize: 12, color: t.textDim, lineHeight: 1.45, maxWidth: 330 } }, "Future Pilot in Command \u2014 " + fpName + "'s training record.")),
      h("div", { style: { textAlign: "right", flexShrink: 0 } },
        h("div", { style: { fontFamily: MONO, fontSize: 24, fontWeight: 800, color: t.sky } }, doneN),
        h("div", { style: { fontSize: 10, color: t.textFaint, letterSpacing: 0.5 } }, "LESSONS LOGGED"))),
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, marginBottom: 18 } },
      h(StatTile, { value: (hrs > 0 ? (hrs + "h " + rmins + "m") : (rmins + "m")), label: "GROUND TIME", color: t.sky }),
      h(StatTile, { value: avgScore + "%", label: "AVG SCORE", color: t.green }),
      h(StatTile, { value: (avgConf ? (avgConf + "/5") : "\u2014"), label: "AVG CONFIDENCE", color: t.amber }),
      h(StatTile, { value: pctDone + "%", label: "SYLLABUS", color: t.magenta })),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 18 } },
      h(Btn, { kind: "soft", full: true, small: true, onClick: function () { if (props.onOpenSub) props.onOpenSub("milestones"); } }, "Milestones \u00b7 " + earnedM + "/" + totalM),
      h(Btn, { kind: "soft", full: true, small: true, onClick: function () { if (props.onOpenSub) props.onOpenSub("transcript"); } }, "Transcript")),
    h(SectionLabel, null, "Next suggested training"),
    suggestions.length > 0
      ? h("div", { style: { marginBottom: 18 } }, suggestions.map(function (s, i) {
          var tint = tintColor(t, pathMeta(s.pathway).tint);
          function go() { props.onOpenLesson(s.id); }
          return h("div", { key: s.id, onClick: go, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 8, background: t.panel, border: "1px solid " + (i === 0 ? tint + "66" : t.line), borderRadius: 14, cursor: "pointer" } },
            h("div", { style: { width: 30, height: 30, borderRadius: 8, background: tint + "1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 13, fontWeight: 800, color: tint } }, i === 0 ? "\u2192" : ("" + (i + 1))),
            h("div", { style: { flex: 1, minWidth: 0 } },
              h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text, lineHeight: 1.2 } }, s.title),
              h("div", { style: { fontSize: 11.5, color: t.textDim, marginTop: 2 } }, pathMeta(s.pathway).label + " \u00b7 " + s.cert + " \u00b7 " + s.mins + " min")),
            i === 0 ? h("div", { style: { fontFamily: MONO, fontSize: 10, fontWeight: 800, color: tint, letterSpacing: 0.5, flexShrink: 0 } }, "START") : h(Glyph, { name: "more", size: 16, color: t.textFaint }));
        }))
      : h("div", { style: { marginBottom: 18, padding: 14, background: t.panel, border: "1px solid " + t.line, borderRadius: 14, fontSize: 13.5, color: t.textDim, lineHeight: 1.5 } }, "Every lesson in your pathways is complete. Outstanding, " + fpName + " \u2014 sharpen weak areas in Practice, or add a pathway in your profile to keep flying."),
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 } },
      h(SectionLabel, { style: { marginBottom: 0 } }, "Training record"),
      h("button", { onClick: exportCsv, disabled: items.length === 0, style: { background: "transparent", border: "1px solid " + t.line, borderRadius: 9, padding: "5px 10px", cursor: items.length === 0 ? "default" : "pointer", color: items.length === 0 ? t.textFaint : t.text, fontFamily: SANS, fontSize: 12, fontWeight: 700, opacity: items.length === 0 ? 0.5 : 1 } }, "Export CSV")),
    items.length === 0
      ? h("div", { style: { padding: "22px 16px", background: t.panel, border: "1px dashed " + t.line, borderRadius: 14, textAlign: "center" } },
          h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 4 } }, "Your logbook is empty"),
          h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.5 } }, "Finish a lesson and it is entered here as your first line item \u2014 just like a real pilot's logbook."))
      : h("div", { style: { border: "1px solid " + t.line, borderRadius: 14, overflow: "hidden" } },
          h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: t.panelHi, borderBottom: "1px solid " + t.line } },
            h("div", { style: { width: 50, fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: t.textFaint, letterSpacing: 0.5 } }, "DATE"),
            h("div", { style: { flex: 1, fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: t.textFaint, letterSpacing: 0.5 } }, "TRAINING EVENT"),
            h("div", { style: { width: 40, textAlign: "right", fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: t.textFaint, letterSpacing: 0.5 } }, "SCORE")),
          items.map(function (e, i) {
            var tint = tintColor(t, pathMeta(e.pathway).tint);
            var sc = e.score >= 80 ? t.green : e.score >= 50 ? t.amber : t.magenta;
            return h("div", { key: e.id + i, style: { display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 12px", borderTop: i === 0 ? "none" : "1px solid " + t.lineSoft, background: i % 2 ? "transparent" : (t.name === "dark" ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.012)") } },
              h("div", { style: { width: 50, flexShrink: 0, fontFamily: MONO, fontSize: 11, color: t.textDim, paddingTop: 1 } }, fmtDate(e.date)),
              h("div", { style: { flex: 1, minWidth: 0 } },
                h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, lineHeight: 1.25 } }, e.title),
                h("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 3 } },
                  h("span", { style: { fontFamily: MONO, fontSize: 10, fontWeight: 700, color: tint } }, pathMeta(e.pathway).label),
                  h("span", { style: { fontSize: 10.5, color: t.textFaint } }, e.cert),
                  h("span", { style: { fontSize: 10.5, color: t.textFaint } }, "\u00b7 " + e.mins + "m"),
                  e.conf ? h("span", { style: { display: "inline-flex", alignItems: "center", gap: 2 } }, h(StarGlyph, { filled: true, size: 11, color: t.amber }), h("span", { style: { fontFamily: MONO, fontSize: 10.5, color: t.amber, fontWeight: 700 } }, "" + e.conf)) : null,
                  e.review ? h("span", { style: { fontFamily: MONO, fontSize: 9, fontWeight: 800, color: t.magenta, border: "1px solid " + t.magenta, borderRadius: 5, padding: "0 4px" } }, "REVIEW") : null),
                e.note ? h("div", { style: { fontSize: 12, color: t.textDim, fontStyle: "italic", marginTop: 4, lineHeight: 1.4 } }, "\u201C" + e.note + "\u201D") : null),
              h("div", { style: { width: 40, flexShrink: 0, textAlign: "right", fontFamily: MONO, fontSize: 13, fontWeight: 800, color: sc, paddingTop: 1 } }, e.score + "%"));
          })),
    h(ComplianceBanner, { text: "This training record reflects study activity on the website. It is not a certified logbook and does not count toward FAA aeronautical experience or flight time.", margin: "16px 0 0 0" }));
}

function LogbookTab(props) {
  var t = useT();
  var viewState = useState("training");
  var view = viewState[0], setView = viewState[1];
  function seg(id, label) {
    var on = view === id;
    function pick() { setView(id); }
    return h("button", { onClick: pick, style: { flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer", border: "none", background: on ? t.sky : "transparent", color: on ? "#fff" : t.textDim, fontFamily: SANS, fontSize: 13.5, fontWeight: 800 } }, label);
  }
  return h("div", null,
    h("div", { style: { display: "flex", gap: 4, padding: 4, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, marginBottom: 18 } },
      seg("training", "Training log"), seg("flight", "Flight hours")),
    view === "training"
      ? h(TrainingLogView, { state: props.state, onOpenLesson: props.onOpenLesson, onOpenSub: props.onOpenSub })
      : h(LogScreen, { state: props.state, onAdd: props.onAdd, onDelete: props.onDelete }));
}

function LogScreen(props) {
  var t = useT();
  var state = props.state;
  var log = (state && state.log) ? state.log : [];
  var dateState = useState(todayStr());
  var date = dateState[0], setDate = dateState[1];
  var acState = useState("");
  var ac = acState[0], setAc = acState[1];
  var frState = useState("");
  var fr = frState[0], setFr = frState[1];
  var toState = useState("");
  var to = toState[0], setTo = toState[1];
  var durState = useState("");
  var dur = durState[0], setDur = durState[1];
  var catState = useState("airplane");
  var cat = catState[0], setCat = catState[1];
  var roleState = useState("Dual");
  var role = roleState[0], setRole = roleState[1];
  var noteState = useState("");
  var note = noteState[0], setNote = noteState[1];
  var openState = useState(false);
  var open = openState[0], setOpen = openState[1];

  var totals = {};
  LOG_CATS.forEach(function (c) { totals[c.id] = 0; });
  var grand = 0;
  log.forEach(function (e) {
    var d = parseFloat(e.dur);
    if (isNaN(d)) d = 0;
    if (totals[e.cat] === undefined) totals[e.cat] = 0;
    totals[e.cat] += d; grand += d;
  });

  function add() {
    var d = parseFloat(dur);
    if (isNaN(d) || d <= 0) return;
    var entry = { id: uid(), date: date, aircraft: ac.trim(), from: fr.trim(), to: to.trim(), dur: d, cat: cat, role: role, note: note.trim() };
    props.onAdd(entry);
    setAc(""); setFr(""); setTo(""); setDur(""); setNote(""); setOpen(false);
  }
  function exportCsv() {
    try {
      var header = ["Date", "Category", "Aircraft", "From", "To", "Role", "Hours", "Notes"];
      var lines = [header.map(csvCell).join(",")];
      log.forEach(function (e) {
        lines.push([e.date, e.cat, e.aircraft, e.from, e.to, e.role, e.dur, e.note].map(csvCell).join(","));
      });
      var blob = new Blob([lines.join("\n")], { type: "text/csv" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "freeflightdb-logbook.csv";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    } catch (e) {}
  }

  var sorted = log.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  var inputStyle = { width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 11, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none" };

  return h("div", null,
    h("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 } },
      h("div", null,
        h("h1", { style: { fontSize: 24, fontWeight: 900, color: t.text, margin: "0 0 4px" } }, "Flight hours"),
        h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 16px", maxWidth: 320 } }, "Log the hours you fly in real aircraft \u2014 dual, solo, and cross-country.")),
      h("div", { style: { textAlign: "right", flexShrink: 0 } },
        h("div", { style: { fontFamily: MONO, fontSize: 26, fontWeight: 800, color: t.sky } }, grand.toFixed(1)),
        h("div", { style: { fontSize: 10.5, color: t.textFaint, letterSpacing: 0.5 } }, "TOTAL HOURS"))),
    /* per category totals */
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 } },
      LOG_CATS.map(function (c) {
        return h("div", { key: c.id, style: { flex: "1 1 86px", background: t.panel, border: "1px solid " + t.line, borderRadius: 12, padding: "9px 8px", textAlign: "center" } },
          h("div", { style: { fontFamily: MONO, fontSize: 15, fontWeight: 800, color: t.text } }, (totals[c.id] || 0).toFixed(1)),
          h("div", { style: { fontSize: 10, color: t.textFaint } }, c.label));
      })),
    h("div", { style: { display: "flex", gap: 10, marginBottom: 18 } },
      h(Btn, { kind: "primary", full: true, onClick: function () { setOpen(!open); } }, open ? "Close" : "Add flight"),
      h(Btn, { kind: "soft", onClick: exportCsv, disabled: log.length === 0 }, "Export CSV")),
    /* add form */
    open ? h("div", { style: { background: t.panelHi, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 18 } },
      h("div", { style: { display: "flex", gap: 10, marginBottom: 10 } },
        h("div", { style: { flex: 1 } }, h(SectionLabel, null, "Date"), h("input", { type: "date", value: date, onChange: function (e) { setDate(e.target.value); }, style: inputStyle })),
        h("div", { style: { flex: 1 } }, h(SectionLabel, null, "Hours"), h("input", { type: "number", step: "0.1", value: dur, onChange: function (e) { setDur(e.target.value); }, placeholder: "1.2", style: inputStyle }))),
      h("div", { style: { marginBottom: 10 } }, h(SectionLabel, null, "Category"),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, LOG_CATS.map(function (c) {
          var on = cat === c.id;
          return h("button", { key: c.id, onClick: function () { setCat(c.id); }, style: { fontFamily: SANS, fontSize: 12.5, fontWeight: 600, padding: "7px 11px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text } }, c.label);
        }))),
      h("div", { style: { marginBottom: 10 } }, h(SectionLabel, null, "Role"),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, LOG_ROLES.map(function (rl) {
          var on = role === rl;
          return h("button", { key: rl, onClick: function () { setRole(rl); }, style: { fontFamily: SANS, fontSize: 12.5, fontWeight: 600, padding: "7px 11px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.magenta : t.line), background: on ? t.magenta : t.panel, color: on ? "#fff" : t.text } }, rl);
        }))),
      h("input", { value: ac, onChange: function (e) { setAc(e.target.value); }, placeholder: "Aircraft / sim / drone (e.g. C172, R22)", style: sx(inputStyle, { marginBottom: 10 }) }),
      h("div", { style: { display: "flex", gap: 10, marginBottom: 10 } },
        h("input", { value: fr, onChange: function (e) { setFr(e.target.value); }, placeholder: "From", style: inputStyle }),
        h("input", { value: to, onChange: function (e) { setTo(e.target.value); }, placeholder: "To", style: inputStyle })),
      h("textarea", { value: note, onChange: function (e) { setNote(e.target.value); }, placeholder: "Notes / maneuvers practiced", rows: 2, style: sx(inputStyle, { marginBottom: 12, resize: "vertical", fontFamily: SANS }) }),
      h(Btn, { kind: "go", full: true, disabled: (function () { var d = parseFloat(dur); return isNaN(d) || d <= 0; })(), onClick: add }, "Save entry")) : null,
    /* compliance */
    h("div", { style: { fontSize: 11.5, color: t.textFaint, lineHeight: 1.5, marginBottom: 14 } },
      "This logbook is a personal study aid. Official pilot logging must meet 14 CFR 61.51 and your instructor's guidance. ",
      h(SourceLink, { url: EXTERNAL_LINKS.cfr61, small: true }, "Part 61")),
    /* entries */
    sorted.length === 0 ? h(Card, { style: { textAlign: "center", color: t.textDim } }, "No entries yet. Log your first flight or ground session above.")
      : sorted.map(function (e) {
        var cm = null;
        for (var i = 0; i < LOG_CATS.length; i++) if (LOG_CATS[i].id === e.cat) cm = LOG_CATS[i];
        function del() { props.onDelete(e.id); }
        return h("div", { key: e.id, style: { display: "flex", gap: 12, padding: "12px 14px", marginBottom: 10, background: t.panel, border: "1px solid " + t.line, borderRadius: 14 } },
          h("div", { style: { textAlign: "center", flexShrink: 0, minWidth: 52 } },
            h("div", { style: { fontFamily: MONO, fontSize: 18, fontWeight: 800, color: t.sky } }, e.dur.toFixed(1)),
            h("div", { style: { fontSize: 10, color: t.textFaint } }, "hrs")),
          h("div", { style: { flex: 1 } },
            h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text } }, (e.aircraft || (cm ? cm.label : "Flight")) + (e.from || e.to ? "  ·  " + (e.from || "?") + " \u2192 " + (e.to || "?") : "")),
            h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 2 } }, e.date + "  •  " + (cm ? cm.label : e.cat) + "  •  " + e.role),
            e.note ? h("div", { style: { fontSize: 12.5, color: t.textDim, marginTop: 4, lineHeight: 1.4 } }, e.note) : null),
          h("button", { onClick: del, style: { background: "transparent", border: "none", cursor: "pointer", color: t.textFaint, padding: 0, alignSelf: "flex-start" } }, h(Glyph, { name: "x", size: 16, color: t.textFaint })));
      }));
}

/* ------------------------------------------------------- resource library */
/* ============================ glossary of terms ============================
   Every acronym is introduced by what it stands for. Definitions are concise,
   plain-English, and aligned with FAA usage (AIM, ACS, FAA handbooks).
   ========================================================================== */
var GLOSSARY_CATS = ["Weather", "Airspace", "Navigation", "Regulations & certificates", "Operations & procedures", "Aerodynamics & performance", "Aircraft & systems", "Instruments & avionics", "Communication & ATC", "Human factors", "Lingo & Slang"];

var GLOSSARY = (typeof window !== "undefined" && window.__AV_GLOSSARY__) ? window.__AV_GLOSSARY__ : [];

var PRONUNCIATION = (typeof window !== "undefined" && window.__AV_PRONUNCIATION__) ? window.__AV_PRONUNCIATION__ : [];

function glossaryCatTint(t, cat) {
  if (cat === "Weather") return t.sky;
  if (cat === "Airspace") return t.magenta;
  if (cat === "Navigation") return t.green;
  if (cat === "Regulations & certificates") return t.amber;
  if (cat === "Operations & procedures") return t.sky;
  if (cat === "Aerodynamics & performance") return t.magenta;
  if (cat === "Aircraft & systems") return t.green;
  if (cat === "Instruments & avionics") return t.amber;
  if (cat === "Communication & ATC") return t.sky;
  return t.magenta;
}

function GlossaryScreen(props) {
  var t = useT();
  var qState = useState("");
  var q = qState[0], setQ = qState[1];
  var catState = useState("All");
  var cat = catState[0], setCat = catState[1];
  var needle = normAnswer(q);

  var rows = GLOSSARY.filter(function (e) {
    if (cat !== "All" && e.cat !== cat) return false;
    if (needle === "") return true;
    return normAnswer(e.term + " " + (e.full ? e.full : "") + " " + e.def).indexOf(needle) > -1;
  });
  rows = rows.slice().sort(function (a, b) {
    var an = normAnswer(a.term), bn = normAnswer(b.term);
    return an < bn ? -1 : an > bn ? 1 : 0;
  });

  /* group by first letter */
  var groups = [];
  var byLetter = {};
  rows.forEach(function (e) {
    var L = e.term.charAt(0).toUpperCase();
    if (L < "A" || L > "Z") L = "#";
    if (!byLetter[L]) { byLetter[L] = []; groups.push(L); }
    byLetter[L].push(e);
  });

  var chip = function (label) {
    var on = cat === label;
    function pick() { setCat(label); }
    return h("button", { key: label, onClick: pick, style: { padding: "6px 11px", borderRadius: 999, cursor: "pointer", border: "1px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.textDim, fontFamily: SANS, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" } }, label);
  };

  return h("div", null,
    h(SubHeader, { title: "Glossary of terms", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13, lineHeight: 1.55, margin: "0 0 12px" } }, "Plain-English definitions for the acronyms and terms used across the program. Every acronym is shown with what it stands for. " + GLOSSARY.length + " entries."),
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: "Search the glossary\u2026",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none", marginBottom: 12 } }),
    h("div", { style: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 8, WebkitOverflowScrolling: "touch" } },
      [chip("All")].concat(GLOSSARY_CATS.map(function (c) { return chip(c); }))),
    rows.length === 0
      ? h("div", { style: { padding: "26px 16px", textAlign: "center", color: t.textFaint, fontSize: 13.5 } }, "No terms match \u201C" + q + "\u201D.")
      : groups.map(function (L) {
          return h("div", { key: L, style: { marginBottom: 10 } },
            h("div", { style: { fontFamily: MONO, fontSize: 12, fontWeight: 800, color: t.textFaint, letterSpacing: 1, padding: "6px 2px", position: "sticky", top: 0, background: t.bg, zIndex: 1 } }, L),
            byLetter[L].map(function (e, i) {
              var tint = glossaryCatTint(t, e.cat);
              return h("div", { key: e.term + i, style: { padding: "12px 14px", marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, borderLeft: "3px solid " + tint } },
                h("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 8, marginBottom: e.full ? 2 : 5 } },
                  h("div", { style: { fontSize: 15.5, fontWeight: 900, color: t.text } }, e.term),
                  h("div", { style: { fontFamily: MONO, fontSize: 10, fontWeight: 700, color: tint, letterSpacing: 0.4, textTransform: "uppercase" } }, e.cat)),
                e.full ? h("div", { style: { fontSize: 12.5, fontWeight: 700, color: tint, marginBottom: 5, fontStyle: "italic" } }, e.full) : null,
                h("div", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.5 } }, e.def));
            }));
        }),
    h(ComplianceBanner, { text: "Definitions are educational summaries aligned with FAA usage. Always consult current FAA publications and your instructor for authoritative guidance.", margin: "14px 0 0 0" }));
}

function pronCatTint(t, cat) {
  if (cat === "Airframe & structure") return t.sky;
  if (cat === "Systems & instruments") return t.green;
  if (cat === "Weather & airport") return t.amber;
  if (cat === "Speeds, nav & medical") return t.magenta;
  if (cat === "Aircraft & engine makers") return t.green;
  return t.sky;
}

function PronunciationScreen(props) {
  var t = useT();
  var qState = useState("");
  var q = qState[0], setQ = qState[1];
  var catState = useState("All");
  var cat = catState[0], setCat = catState[1];
  var needle = normAnswer(q);

  /* category order taken from the data itself */
  var cats = [];
  PRONUNCIATION.forEach(function (e) { if (cats.indexOf(e.cat) < 0) cats.push(e.cat); });

  var rows = PRONUNCIATION.filter(function (e) {
    if (cat !== "All" && e.cat !== cat) return false;
    if (needle === "") return true;
    return normAnswer(e.term + " " + e.say + " " + (e.tip ? e.tip : "")).indexOf(needle) > -1;
  });

  /* group rows by category, preserving data order */
  var groups = [];
  var byCat = {};
  rows.forEach(function (e) {
    if (!byCat[e.cat]) { byCat[e.cat] = []; groups.push(e.cat); }
    byCat[e.cat].push(e);
  });
  groups = cats.filter(function (c) { return byCat[c]; });

  var chip = function (label) {
    var on = cat === label;
    function pick() { setCat(label); }
    return h("button", { key: label, onClick: pick, style: { padding: "6px 11px", borderRadius: 999, cursor: "pointer", border: "1px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.textDim, fontFamily: SANS, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" } }, label);
  };

  return h("div", null,
    h(SubHeader, { title: "Pronunciation guide", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13, lineHeight: 1.55, margin: "0 0 6px" } }, "Aviation borrows a lot of French words and acronyms that look nothing like they sound. Read each respelling out loud and stress the CAPITALIZED syllable."),
    h("div", { style: { display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 12, background: t.panelHi, border: "1px dashed " + t.line, marginBottom: 12 } },
      h("div", { style: { fontSize: 15, fontWeight: 900, color: t.text } }, "Pitot"),
      h("div", { style: { fontFamily: MONO, fontSize: 14, fontWeight: 800, color: t.sky } }, "\u2192 PEE-toe"),
      h("div", { style: { fontSize: 12, color: t.textDim } }, "not \u201Cpee-SHOW\u201D")),
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: "Search a term\u2026",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none", marginBottom: 12 } }),
    h("div", { style: { display: "flex", gap: 7, overflowX: "auto", paddingBottom: 6, marginBottom: 8, WebkitOverflowScrolling: "touch" } },
      [chip("All")].concat(cats.map(function (c) { return chip(c); }))),
    rows.length === 0
      ? h("div", { style: { padding: "26px 16px", textAlign: "center", color: t.textFaint, fontSize: 13.5 } }, "No terms match \u201C" + q + "\u201D.")
      : groups.map(function (c) {
          var tint = pronCatTint(t, c);
          return h("div", { key: c, style: { marginBottom: 12 } },
            h("div", { style: { fontFamily: MONO, fontSize: 11, fontWeight: 800, color: tint, letterSpacing: 1, textTransform: "uppercase", padding: "6px 2px" } }, c),
            byCat[c].map(function (e, i) {
              return h("div", { key: e.term + i, style: { padding: "12px 14px", marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, borderLeft: "3px solid " + tint } },
                h("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: e.tip ? 6 : 0 } },
                  h("div", { style: { fontSize: 15.5, fontWeight: 900, color: t.text } }, e.term),
                  h("div", { style: { fontFamily: MONO, fontSize: 14.5, fontWeight: 800, color: tint, background: tint + "18", border: "1px solid " + tint + "55", borderRadius: 8, padding: "3px 9px", letterSpacing: 0.3 } }, e.say)),
                e.tip ? h("div", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.5 } }, e.tip) : null);
            }));
        }),
    h(ComplianceBanner, { text: "Respellings are an approximate guide to common usage; regional and individual pronunciations vary.", margin: "14px 0 0 0" }));
}

function ResourceLibrary(props) {
  var t = useT();
  var qState = useState("");
  var q = qState[0], setQ = qState[1];
  var needle = normAnswer(q);

  function matchHost(s) { return needle === "" || normAnswer(s.title + " " + s.code).indexOf(needle) > -1; }
  function matchLink(s) { return needle === "" || normAnswer(s.title).indexOf(needle) > -1; }
  function matchBook(s) { return needle === "" || normAnswer(s.title).indexOf(needle) > -1; }

  var hosts = FAA_SOURCES.filter(matchHost);
  var links = LINK_ONLY.filter(matchLink);
  var books = PAID_BOOKS.filter(matchBook);

  function Tier(title, sub, color) {
    return h("div", { style: { display: "flex", alignItems: "baseline", gap: 8, margin: "22px 0 12px" } },
      h("div", { style: { width: 8, height: 8, borderRadius: 99, background: color } }),
      h("div", null,
        h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, title),
        h("div", { style: { fontSize: 12, color: t.textDim } }, sub)));
  }

  return h("div", null,
    h(SubHeader, { title: "AvHype Resources", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 14px" } }, "Official, free FAA material is hosted and linked directly. Commercial study products are optional recommendations — never required to use this website."),
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: "Search resources…",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none" } }),

    Tier("FAA handbooks & guides", "Public-domain U.S. government publications", t.sky),
    hosts.length === 0 ? h("div", { style: { fontSize: 13, color: t.textFaint } }, "No matches.") :
      hosts.map(function (s) {
        return h("div", { key: s.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 13 } },
          h("div", { style: { fontFamily: MONO, fontSize: 11, fontWeight: 700, color: t.sky, minWidth: 92, flexShrink: 0 } }, s.code),
          h("div", { style: { flex: 1 } }, h(SourceLink, { url: s.url }, s.title)));
      }),

    Tier("Regulations & official tools", "eCFR, weather, testing, registration, NOTAMs", t.magenta),
    links.map(function (s) {
      return h("div", { key: s.id, style: { padding: "11px 14px", marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 13 } },
        h(SourceLink, { url: s.url }, s.title));
    }),

    Tier("Recommended study materials", "Optional, commercial, not hosted here", t.amber),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, lineHeight: 1.5, marginBottom: 10 } }, "These are well-known third-party products many pilots find useful. " + BRAND + " does not host, sell, or include their content."),
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
      books.map(function (b) {
        return h("div", { key: b.id, style: { fontSize: 12.5, color: t.text, padding: "9px 12px", borderRadius: 10, background: t.panel, border: "1px dashed " + t.line } }, b.title);
      })),
    h("div", { style: { height: 8 } }));
}

/* ============================================================================
   AIRPORT SIGNS & MARKINGS — accurate SVG recreations (no photos, works offline)
   FAA-standard colors: red = mandatory/hold, yellow w/ black = direction/info,
   black w/ yellow = "you are here" location, black w/ white = distance remaining.
   ========================================================================== */
function signColors(kind) {
  if (kind === "mandatory" || kind === "noentry") return { bg: "#B0221E", fg: "#FFFFFF", border: "#FFFFFF" };
  if (kind === "location") return { bg: "#161616", fg: "#F2C200", border: "#F2C200" };
  if (kind === "distance") return { bg: "#161616", fg: "#FFFFFF", border: "#FFFFFF" };
  return { bg: "#F2C200", fg: "#161616", border: "#161616" };
}
function arrowPath(dir, cx, cy, s) {
  if (dir === "left") return "M " + (cx - s) + " " + cy + " L " + (cx + s) + " " + (cy - s) + " L " + (cx + s) + " " + (cy + s) + " Z";
  if (dir === "right") return "M " + (cx + s) + " " + cy + " L " + (cx - s) + " " + (cy - s) + " L " + (cx - s) + " " + (cy + s) + " Z";
  if (dir === "up") return "M " + cx + " " + (cy - s) + " L " + (cx - s) + " " + (cy + s) + " L " + (cx + s) + " " + (cy + s) + " Z";
  if (dir === "down") return "M " + cx + " " + (cy + s) + " L " + (cx - s) + " " + (cy - s) + " L " + (cx + s) + " " + (cy - s) + " Z";
  if (dir === "upleft") return "M " + (cx - s) + " " + (cy - s) + " L " + (cx + s) + " " + (cy - s) + " L " + (cx - s) + " " + (cy + s) + " Z";
  if (dir === "upright") return "M " + (cx + s) + " " + (cy - s) + " L " + (cx + s) + " " + (cy + s) + " L " + (cx - s) + " " + (cy - s) + " Z";
  if (dir === "downleft") return "M " + (cx - s) + " " + (cy + s) + " L " + (cx - s) + " " + (cy - s) + " L " + (cx + s) + " " + (cy + s) + " Z";
  if (dir === "downright") return "M " + (cx + s) + " " + (cy + s) + " L " + (cx + s) + " " + (cy - s) + " L " + (cx - s) + " " + (cy + s) + " Z";
  return "";
}
function SignGraphic(props) {
  var kind = props.kind, label = props.text || "", arrow = props.arrow || null;
  var col = signColors(kind);
  var H = 74, fs = 38, charW = fs * 0.64;
  if (kind === "noentry") {
    return h("svg", { viewBox: "0 0 110 74", width: 110, height: 74, style: { maxWidth: "100%", height: "auto", display: "block" }, role: "img", "aria-label": "No entry sign" },
      h("rect", { x: 3, y: 3, width: 104, height: 68, rx: 11, fill: col.bg, stroke: col.border, strokeWidth: 3.5 }),
      h("circle", { cx: 55, cy: 37, r: 20, fill: "none", stroke: "#FFFFFF", strokeWidth: 5 }),
      h("rect", { x: 41, y: 33, width: 28, height: 8, rx: 2, fill: "#FFFFFF" }));
  }
  var textW = label.length * charW;
  var pad = 24, arrowW = arrow ? 54 : 0;
  var W = Math.round(textW + pad * 2 + arrowW);
  if (W < 74) W = 74;
  var arrowFirst = arrow && (arrow.indexOf("left") > -1 || arrow === "up" || arrow === "down");
  var ax, tx;
  if (arrow) {
    if (arrowFirst) { ax = pad + 27; tx = pad + arrowW + textW / 2; }
    else { tx = pad + textW / 2; ax = pad + textW + 27; }
  } else { tx = W / 2; }
  var kids = [h("rect", { key: "r", x: 3, y: 3, width: W - 6, height: H - 6, rx: 12, fill: col.bg, stroke: col.border, strokeWidth: 3.5 })];
  if (arrow) kids.push(h("path", { key: "a", d: arrowPath(arrow, ax, H / 2, 18), fill: col.fg }));
  kids.push(h("text", { key: "t", x: tx, y: H / 2, fill: col.fg, fontSize: fs, fontWeight: 800, fontFamily: "ui-monospace, Menlo, Consolas, monospace", textAnchor: "middle", dominantBaseline: "central" }, label));
  return h("svg", { viewBox: "0 0 " + W + " " + H, width: W, height: H, style: { maxWidth: "100%", height: "auto", display: "block" }, role: "img", "aria-label": label + " sign" }, kids);
}
function MarkingGraphic(props) {
  var type = props.type;
  if (type === "hold") {
    var lines = [];
    var ys = [20, 30, 44, 58]; /* two solid (top), two dashed (bottom) */
    for (var i = 0; i < ys.length; i++) {
      if (i < 2) lines.push(h("line", { key: "s" + i, x1: 14, y1: ys[i], x2: 286, y2: ys[i], stroke: "#F2C200", strokeWidth: 4 }));
      else lines.push(h("line", { key: "d" + i, x1: 14, y1: ys[i], x2: 286, y2: ys[i], stroke: "#F2C200", strokeWidth: 4, strokeDasharray: "14 12" }));
    }
    return h("svg", { viewBox: "0 0 300 92", width: "100%", style: { display: "block", borderRadius: 10 }, role: "img", "aria-label": "Runway holding position marking" },
      h("rect", { x: 0, y: 0, width: 300, height: 92, fill: "#2C2C2C" }), lines,
      h("text", { x: 150, y: 80, fill: "#9DB2C2", fontSize: 11, textAnchor: "middle", fontFamily: "ui-monospace, monospace" }, "solid side = hold side"));
  }
  if (type === "centerline") {
    return h("svg", { viewBox: "0 0 300 92", width: "100%", style: { display: "block", borderRadius: 10 }, role: "img", "aria-label": "Taxiway centerline and edge marking" },
      h("rect", { x: 0, y: 0, width: 300, height: 92, fill: "#2C2C2C" }),
      h("line", { x1: 12, y1: 46, x2: 288, y2: 46, stroke: "#F2C200", strokeWidth: 5 }),
      h("line", { x1: 12, y1: 16, x2: 288, y2: 16, stroke: "#F2C200", strokeWidth: 3 }),
      h("line", { x1: 12, y1: 22, x2: 288, y2: 22, stroke: "#F2C200", strokeWidth: 3 }),
      h("line", { x1: 12, y1: 70, x2: 288, y2: 70, stroke: "#F2C200", strokeWidth: 3 }),
      h("line", { x1: 12, y1: 76, x2: 288, y2: 76, stroke: "#F2C200", strokeWidth: 3 }),
      h("text", { x: 150, y: 52, fill: "#161616", fontSize: 10, textAnchor: "middle", fontFamily: "ui-monospace, monospace", fontWeight: 700 }, "CENTERLINE"));
  }
  /* displaced threshold */
  return h("svg", { viewBox: "0 0 300 92", width: "100%", style: { display: "block", borderRadius: 10 }, role: "img", "aria-label": "Displaced threshold marking" },
    h("rect", { x: 0, y: 0, width: 300, height: 92, fill: "#2C2C2C" }),
    h("path", { d: "M 30 46 L 96 46 L 88 38 M 96 46 L 88 54", fill: "none", stroke: "#FFFFFF", strokeWidth: 4 }),
    h("path", { d: "M 110 46 L 176 46 L 168 38 M 176 46 L 168 54", fill: "none", stroke: "#FFFFFF", strokeWidth: 4 }),
    h("rect", { x: 200, y: 14, width: 9, height: 64, fill: "#FFFFFF" }),
    h("text", { x: 250, y: 50, fill: "#9DB2C2", fontSize: 11, textAnchor: "middle", fontFamily: "ui-monospace, monospace" }, "threshold"));
}

var AIRPORT_SIGNS = (typeof window !== "undefined" && window.__AV_AIRPORT_SIGNS__) ? window.__AV_AIRPORT_SIGNS__ : [];

var AIRPORT_MARKINGS = (typeof window !== "undefined" && window.__AV_AIRPORT_MARKINGS__) ? window.__AV_AIRPORT_MARKINGS__ : [];

function SignsScreen(props) {
  var t = useT();
  function legendRow(swatch, sw2, txt) {
    return h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } },
      h("div", { style: { display: "flex", gap: 4, flexShrink: 0 } },
        h("div", { style: { width: 18, height: 18, borderRadius: 4, background: swatch } }),
        sw2 ? h("div", { style: { width: 18, height: 18, borderRadius: 4, background: sw2 } }) : null),
      h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4 } }, txt));
  }
  function signCard(s) {
    return h("div", { key: s.id, style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 12 } },
      h("div", { style: { background: t.name === "dark" ? "#0c1620" : "#e8edf2", borderRadius: 12, padding: "16px 12px", display: "flex", justifyContent: "center", marginBottom: 12 } },
        h(SignGraphic, { kind: s.kind, text: s.text, arrow: s.arrow })),
      h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 6 } }, s.name),
      h("div", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.55, marginBottom: 8 } }, s.means),
      h("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", background: t.panelHi, borderRadius: 10, padding: "9px 11px" } },
        h(Glyph, { name: "check", size: 15, color: t.green }),
        h("div", { style: { fontSize: 12.5, color: t.text, lineHeight: 1.5, fontWeight: 600 } }, s.action)));
  }
  function markCard(m) {
    return h("div", { key: m.id, style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 12 } },
      h("div", { style: { marginBottom: 12 } }, h(MarkingGraphic, { type: m.type })),
      h("div", { style: { fontSize: 15, fontWeight: 800, color: t.text, marginBottom: 6 } }, m.name),
      h("div", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.55, marginBottom: 8 } }, m.means),
      h("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", background: t.panelHi, borderRadius: 10, padding: "9px 11px" } },
        h(Glyph, { name: "check", size: 15, color: t.green }),
        h("div", { style: { fontSize: 12.5, color: t.text, lineHeight: 1.5, fontWeight: 600 } }, m.action)));
  }
  function section(label) { return h(SectionLabel, { style: { margin: "20px 0 10px" } }, label); }
  function byKind(k) { return AIRPORT_SIGNS.filter(function (s) { return s.kind === k; }); }
  var directionish = AIRPORT_SIGNS.filter(function (s) { return s.kind === "direction" || s.kind === "destination"; });

  return h("div", null,
    h(SubHeader, { title: "Airport signs & markings", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.5 } }, "Every sign on an airport surface follows a strict color code. Learn the colors first and you can read any sign at a glance \u2014 then tap through the examples below."),
    h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 6 } },
      h(SectionLabel, { style: { marginBottom: 10 } }, "The color code"),
      legendRow("#B0221E", null, "Red with white legend \u2014 mandatory. A runway or critical area is ahead; hold short until cleared."),
      legendRow("#F2C200", null, "Yellow with black legend \u2014 direction, destination, or information. Tells you where things are."),
      legendRow("#161616", null, "Black with yellow legend \u2014 location. Tells you the taxiway you are on right now."),
      legendRow("#161616", null, "Black with white number \u2014 runway distance remaining, in thousands of feet.")),
    section("Mandatory instruction signs"),
    byKind("mandatory").map(signCard),
    byKind("noentry").map(signCard),
    section("Location signs"),
    byKind("location").map(signCard),
    section("Direction & destination signs"),
    directionish.map(signCard),
    section("Runway distance-remaining signs"),
    byKind("distance").map(signCard),
    section("Pavement markings"),
    AIRPORT_MARKINGS.map(markCard),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 16, lineHeight: 1.5 } }, "Illustrations are simplified for study and follow FAA standard colors and layouts. Always defer to the Aeronautical Information Manual, the Airport Diagram, and current NOTAMs for the airport you are operating at."));
}

/* ============================================================================
   CERTIFICATE FLASHCARDS — a curated, cert-tagged deck, filterable by track.
   Facts are kept to stable, well-established knowledge. cert ids match LESSON_CERTS.
   ========================================================================== */
var FLASHCARDS = (typeof window !== "undefined" && window.__AV_FLASHCARDS__) ? window.__AV_FLASHCARDS__ : [];

function FlashcardsScreen(props) {
  var t = useT();
  var certS = useState("all"); var cert = certS[0], setCert = certS[1];
  var orderS = useState(null); var order = orderS[0], setOrder = orderS[1];
  var idxS = useState(0); var idx = idxS[0], setIdx = idxS[1];
  var flipS = useState(false); var flip = flipS[0], setFlip = flipS[1];

  var base = cert === "all" ? FLASHCARDS : FLASHCARDS.filter(function (cc) { return cc.cert === cert; });
  var deck = order || base;

  var counts = {};
  FLASHCARDS.forEach(function (cc) { counts[cc.cert] = (counts[cc.cert] || 0) + 1; });
  var opts = [{ id: "all", label: "All certificates" }];
  LESSON_CERTS.forEach(function (lc) { if (counts[lc.id]) opts.push({ id: lc.id, label: lc.label }); });

  function pickCert(id) { setCert(id); setOrder(null); setIdx(0); setFlip(false); }
  function reshuffle() { setOrder(shuffle(base)); setIdx(0); setFlip(false); }
  function go(n) { var ni = idx + n; if (ni < 0) ni = 0; if (ni > deck.length - 1) ni = deck.length - 1; setIdx(ni); setFlip(false); }

  var c = deck.length ? (deck[idx] || deck[0]) : null;

  return h("div", null,
    h(SubHeader, { title: "Flashcards", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.5 } }, "Quick-fire review of the facts that matter. Filter to a certificate track, then tap a card to reveal the answer."),
    h(Dropdown, { value: cert, options: opts, onChange: pickCert, tint: t.magenta }),
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "14px 0 14px" } },
      h("div", { style: { flex: 1 } }, h(Bar, { pct: deck.length ? ((idx + 1) / deck.length) * 100 : 0, color: t.magenta, h: 8 })),
      h("div", { style: { fontFamily: MONO, fontSize: 13, fontWeight: 700, color: t.textDim } }, deck.length ? ((idx + 1) + "/" + deck.length) : "0/0"),
      h("button", { onClick: reshuffle, style: { display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid " + t.line, borderRadius: 99, padding: "6px 12px", cursor: "pointer", fontFamily: SANS, fontSize: 12, fontWeight: 700, color: t.text } }, "Shuffle")),
    c ? h("div", { onClick: function () { setFlip(!flip); },
      style: { minHeight: 250, borderRadius: 20, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "26px 22px", background: flip ? t.panelHi : t.panel, border: "1.5px solid " + (flip ? t.magenta : t.line), transition: "background .2s ease" } },
      h("div", { style: { marginBottom: 12 } }, h(Chip, { color: flip ? t.magenta : t.sky }, certLabel(c.cert))),
      h(SectionLabel, { style: { color: flip ? t.magenta : t.sky } }, flip ? "Answer" : "Prompt"),
      h("div", { style: { fontSize: flip ? 16.5 : 21, fontWeight: flip ? 600 : 800, color: t.text, lineHeight: 1.45, marginTop: 6 } }, flip ? c.back : c.front),
      h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 16 } }, flip ? "Tap to flip back" : "Tap to reveal")) :
      h("div", { style: { textAlign: "center", color: t.textFaint, fontSize: 13.5, padding: "30px 0" } }, "No cards in this track yet."),
    c ? h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
      h(Btn, { kind: "ghost", onClick: function () { go(-1); }, disabled: idx === 0 }, "Previous"),
      h(Btn, { kind: "primary", full: true, onClick: function () { if (idx >= deck.length - 1) { setIdx(0); setFlip(false); } else go(1); } }, idx >= deck.length - 1 ? "Start over" : "Next card")) : null,
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 16, lineHeight: 1.5 } }, "Study aid only - rules and figures are summarized and can change. Confirm specifics against current FAA regulations and the FAR/AIM before relying on them."));
}

var PIX = "ui-monospace, 'Courier New', Menlo, monospace";
var ARC_BG = "#070b12";
var ARC_INK = "#EAF2F0";
var ARC_DIM = "#8aa0b4";
var ARC_COIN = "#FFD24A";
var ARC_CARD = "#0d141f";
var ARC_LINE = "#22303f";

/* ---- 8-bit sound (Web Audio, no asset files); safely no-ops where unsupported (e.g. jsdom) ---- */
function sfxMuted() { try { return window.localStorage.getItem("avhype_sfx") === "off"; } catch (e) { return false; } }
function sfxSetMuted(m) { try { window.localStorage.setItem("avhype_sfx", m ? "off" : "on"); } catch (e) { return; } }
var __sfxCtx = null;
function __sfxActx() { if (__sfxCtx) return __sfxCtx; try { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; __sfxCtx = new C(); } catch (e) { __sfxCtx = null; } return __sfxCtx; }
function __sfxTone(ac, freq, start, dur, type, vol) {
  try {
    var o = ac.createOscillator(); var g = ac.createGain();
    o.type = type || "square";
    var t0 = ac.currentTime + start;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.16, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  } catch (e) { return; }
}
function sfxPlay(name) {
  if (sfxMuted()) return;
  var ac = __sfxActx(); if (!ac) return;
  if (ac.state === "suspended") { try { ac.resume(); } catch (e) { } }
  if (name === "correct") { __sfxTone(ac, 660, 0, 0.09, "square", 0.15); __sfxTone(ac, 880, 0.07, 0.12, "square", 0.15); }
  else if (name === "streak") { __sfxTone(ac, 660, 0, 0.07, "square", 0.15); __sfxTone(ac, 880, 0.06, 0.07, "square", 0.15); __sfxTone(ac, 1320, 0.12, 0.16, "square", 0.16); }
  else if (name === "wrong") { __sfxTone(ac, 196, 0, 0.16, "sawtooth", 0.13); __sfxTone(ac, 130, 0.09, 0.2, "sawtooth", 0.12); }
  else if (name === "start") { __sfxTone(ac, 523, 0, 0.08, "square", 0.14); __sfxTone(ac, 784, 0.07, 0.13, "square", 0.14); }
  else if (name === "over") { __sfxTone(ac, 440, 0, 0.12, "square", 0.14); __sfxTone(ac, 330, 0.1, 0.14, "square", 0.13); __sfxTone(ac, 220, 0.22, 0.22, "square", 0.13); }
  else if (name === "coin") { __sfxTone(ac, 988, 0, 0.07, "square", 0.16); __sfxTone(ac, 1319, 0.06, 0.18, "square", 0.16); }
  else if (name === "land") { __sfxTone(ac, 523, 0, 0.1, "triangle", 0.16); __sfxTone(ac, 784, 0.09, 0.14, "triangle", 0.16); __sfxTone(ac, 1047, 0.2, 0.18, "triangle", 0.15); }
}
function SfxButton(props) {
  var onS = useState(function () { return !sfxMuted(); }); var on = onS[0], setOn = onS[1];
  function toggle() { var n = !on; setOn(n); sfxSetMuted(!n); if (n) sfxPlay("start"); }
  var col = on ? (props.accent || ARC_INK) : ARC_DIM;
  return h("button", { onClick: toggle, title: on ? "Sound on" : "Sound off", "aria-label": on ? "Mute sound" : "Unmute sound", style: { background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center", lineHeight: 0 } },
    h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": "true" },
      h("path", { d: "M3 9 H7 L12 5 V19 L7 15 H3 Z", fill: col }),
      on ? h("path", { d: "M15 9 Q17.4 12 15 15", stroke: col, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" }) : null,
      on ? h("path", { d: "M17.6 7 Q21 12 17.6 17", stroke: col, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" }) : null,
      on ? null : h("line", { x1: 15.5, y1: 9, x2: 20.5, y2: 15, stroke: col, strokeWidth: 1.8, strokeLinecap: "round" }),
      on ? null : h("line", { x1: 20.5, y1: 9, x2: 15.5, y2: 15, stroke: col, strokeWidth: 1.8, strokeLinecap: "round" })));
}

/* ============================================================================
   AVIATION ARCADE — thirteen 8-bit games. Facts are short and readable (sans),
   game chrome is pixel-mono. Tickets earned from play boost study XP (daily cap
   passed via props.arcade.cap). Pure DOM/SVG, strict-parser safe.
   ========================================================================== */
var ARCADE_FACTS = [
  { tag: "RUNWAYS", text: "Runway 27 points about 270\u00b0 \u2014 just drop the heading's last zero." },
  { tag: "FORCES", text: "Four forces fly a plane: lift, weight, thrust, and drag." },
  { tag: "SIGNS", text: "A red sign means mandatory \u2014 a runway is ahead, so hold short." },
  { tag: "TURNS", text: "A standard-rate turn is 3\u00b0 per second \u2014 a full circle in two minutes." },
  { tag: "CLIMB", text: "VX gives the best angle to clear obstacles; VY gives the best rate." },
  { tag: "RADIO", text: "No control tower? Self-announce on CTAF and see-and-avoid." },
  { tag: "SAFETY", text: "Never cross a runway without a clearance \u2014 even an empty one." },
  { tag: "STANDARD DAY", text: "Standard sea level: 29.92 inHg and 15\u00b0C." },
  { tag: "RULES", text: "A private pilot can share flight costs, but can't fly for hire." },
  { tag: "DRONES", text: "Part 107 limits: 400 ft AGL, 100 mph, and 3 SM visibility." },
  { tag: "LIGHT GUN", text: "Steady green light = cleared. Takeoff on the ground, land in the air." },
  { tag: "PERFORMANCE", text: "Hot, high, and humid raises density altitude and cuts performance." },
  { tag: "PATTERN", text: "A standard traffic pattern uses left turns, usually at 1,000 ft AGL." },
  { tag: "MULTI-ENGINE", text: "VMC (the red line) is the slowest you can control a twin on one engine." },
  { tag: "SOARING", text: "Gliders climb by circling in thermals \u2014 rising columns of warm air." },
  { tag: "GO / NO-GO", text: "IMSAFE: Illness, Medication, Stress, Alcohol, Fatigue, Emotion." },
  { tag: "METAR", text: "09012G18KT means wind from 090\u00b0 at 12 knots, gusting to 18." },
  { tag: "WEATHER", text: "METAR visibility is in statute miles; 10SM is a clear day." },
  { tag: "CLOUDS", text: "A ceiling is the lowest broken or overcast layer \u2014 not few or scattered." },
  { tag: "CATEGORY", text: "VFR needs a ceiling above 3,000 ft AND visibility over 5 miles." },
  { tag: "SQUAWK", text: "Transponder codes: 7700 emergency, 7600 lost radio, 7500 hijack." },
  { tag: "FUEL", text: "Day VFR needs a 30-minute reserve; night VFR needs 45 minutes." }
];
function randFact() { return ARCADE_FACTS[Math.floor(Math.random() * ARCADE_FACTS.length)]; }

function arcadeBest(id) {
  try { var r = window.localStorage.getItem("avhype_arcade_v1"); var d = r ? JSON.parse(r) : {}; return d[id] || 0; } catch (e) { return 0; }
}
function arcadeSetBest(id, score) {
  try {
    var r = window.localStorage.getItem("avhype_arcade_v1"); var d = r ? JSON.parse(r) : {};
    if (!d[id] || score > d[id]) { d[id] = score; window.localStorage.setItem("avhype_arcade_v1", JSON.stringify(d)); }
    return d[id] || 0;
  } catch (e) { return score; }
}
function mergeStyle(a, b) { return Object.assign({}, a, b || {}); }

function useRaf(cb, active) {
  var cbRef = useRef(cb); cbRef.current = cb;
  useEffect(function () {
    if (!active) return undefined;
    var id = 0; var last = 0; var dead = false;
    function step(ts) {
      if (dead) return;
      if (!last) last = ts;
      var dt = (ts - last) / 1000; last = ts;
      if (dt > 0.05) dt = 0.05;
      cbRef.current(dt);
      id = window.requestAnimationFrame(step);
    }
    id = window.requestAnimationFrame(step);
    return function () { dead = true; if (id) window.cancelAnimationFrame(id); };
  }, [active]);
}

/* Awards tickets once when a game ends. tickets = floor(score/div), min 1 if scored. */
function useArcadeEarn(active, finalScore, div, onEarn, xpLeft) {
  var doneRef = useRef(false);
  var infoS = useState({ t: 0, xp: 0 }); var info = infoS[0], setInfo = infoS[1];
  useEffect(function () {
    if (active && !doneRef.current) {
      doneRef.current = true;
      var tk = Math.floor(finalScore / div);
      if (finalScore > 0 && tk < 1) tk = 1;
      if (tk < 0) tk = 0;
      var left = xpLeft ? xpLeft : 0;
      var xp = tk < left ? tk : left;
      setInfo({ t: tk, xp: xp });
      if (onEarn && tk > 0) onEarn(tk);
    }
    if (!active) doneRef.current = false;
  }, [active]);
  return info;
}

function PixPlane(props) {
  var c = props.color || "#EAF2F0"; var s = props.size || 28;
  var st = mergeStyle({ display: "block", imageRendering: "pixelated" }, props.style);
  return h("svg", { width: s, height: s, viewBox: "0 0 16 16", style: st, "aria-hidden": "true" },
    h("rect", { x: 1, y: 7, width: 12, height: 2, fill: c }),
    h("rect", { x: 12, y: 6, width: 2, height: 3, fill: c }),
    h("rect", { x: 4, y: 4, width: 3, height: 3, fill: c }),
    h("rect", { x: 4, y: 9, width: 3, height: 3, fill: c }),
    h("rect", { x: 1, y: 5, width: 2, height: 2, fill: c }));
}
function PixCoin(props) {
  var s = props.size || 16;
  return h("svg", { width: s, height: s, viewBox: "0 0 16 16", style: { display: "block" }, "aria-hidden": "true" },
    h("rect", { x: 4, y: 2, width: 8, height: 12, fill: ARC_COIN }),
    h("rect", { x: 2, y: 4, width: 12, height: 8, fill: ARC_COIN }),
    h("rect", { x: 6, y: 5, width: 4, height: 6, fill: "#9a6b00" }));
}

function arcBtn(label, onClick, accent, extra) {
  return h("button", { onClick: onClick, style: mergeStyle({ background: "#10151f", color: accent, border: "2px solid " + accent, borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontFamily: PIX, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }, extra) }, label);
}

/* short, readable fact card (sans body so facts stay digestible) */
function FactCard(props) {
  var f = props.fact; if (!f) return null;
  var ac = props.accent || "#5fd0d8";
  return h("div", { style: { background: "#0b1320", border: "1px solid " + ARC_LINE, borderLeft: "3px solid " + ac, borderRadius: 9, padding: "10px 12px", textAlign: "left", maxWidth: 320, margin: props.center ? "0 auto" : "0", boxSizing: "border-box" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 5 } },
      h(Glyph, { name: "bolt", size: 11, color: ac }),
      h("div", { style: { fontFamily: PIX, fontSize: 8.5, letterSpacing: 1.5, fontWeight: 800, color: ac } }, "DID YOU KNOW \u00b7 " + f.tag)),
    h("div", { style: { fontFamily: SANS, fontSize: 12.5, lineHeight: 1.5, color: "#c7d4e0" } }, f.text));
}

/* facts auto-advance on a comfortable ~5s cadence so each one is easy to read */
function RotatingFact(props) {
  var startS = useState(function () { return props.fact || randFact(); });
  var cur = startS[0], setCur = startS[1];
  useEffect(function () {
    var id = window.setInterval(function () {
      setCur(function (prev) {
        var n = randFact(); var g = 0;
        while (n.text === prev.text && g < 6) { n = randFact(); g += 1; }
        return n;
      });
    }, props.ms || 5000);
    return function () { window.clearInterval(id); };
  }, []);
  return h(FactCard, { fact: cur, accent: props.accent, center: props.center });
}

function ArcadeFrame(props) {
  var accent = props.accent || "#3CE07A";
  var lives = props.lives;
  var lifeIcons = [];
  if (lives != null) { for (var i = 0; i < 3; i++) lifeIcons.push(h("div", { key: i, style: { opacity: i < lives ? 1 : 0.22 } }, h(PixPlane, { color: i < lives ? accent : "#33414f", size: 14 }))); }
  return h("div", { style: { fontFamily: PIX } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } },
      h("button", { onClick: props.onExit, style: { display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", color: ARC_DIM, cursor: "pointer", fontFamily: PIX, fontSize: 11, fontWeight: 800, letterSpacing: 1, padding: 0 } }, h(Glyph, { name: "back", size: 16, color: ARC_DIM }), "ARCADE"),
      h("div", { style: { flex: 1, textAlign: "center", fontWeight: 800, fontSize: 13, letterSpacing: 1.5, color: ARC_INK, textTransform: "uppercase" } }, props.title),
      h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 44, justifyContent: "flex-end" } }, h(SfxButton, { accent: accent }), lives != null ? h("div", { style: { display: "flex", gap: 4 } }, lifeIcons) : null)),
    (props.score != null || props.hud) ? h("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" } },
      h("div", { style: { minWidth: 60 } },
        h("div", { style: { fontSize: 8.5, color: ARC_DIM, letterSpacing: 1.5 } }, "SCORE"),
        h("div", { style: { fontSize: 23, fontWeight: 800, color: accent, lineHeight: 1 } }, props.score != null ? props.score : "\u2014")),
      props.hud ? h("div", { style: { flex: 1, display: "flex", justifyContent: "center" } }, props.hud) : null,
      h("div", { style: { textAlign: "right", minWidth: 60 } },
        h("div", { style: { fontSize: 8.5, color: ARC_DIM, letterSpacing: 1.5 } }, "BEST"),
        h("div", { style: { fontSize: 15, fontWeight: 800, color: ARC_INK, lineHeight: 1 } }, props.best != null ? props.best : 0))) : null,
    h("div", { style: { position: "relative", background: ARC_BG, border: "3px solid " + accent, borderRadius: 7, boxShadow: "0 0 22px " + accent + "30", overflow: "hidden" } },
      props.children,
      h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 3px)" } }),
      h("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 55px rgba(0,0,0,0.55)" } })));
}

function hudBox(label, value, color) {
  return h("div", { style: { textAlign: "center" } },
    h("div", { style: { fontSize: 8.5, color: ARC_DIM, letterSpacing: 1.5 } }, label),
    h("div", { style: { fontSize: 16, fontWeight: 800, color: color, lineHeight: 1 } }, value));
}

function ArcadeStart(props) {
  return h("div", { style: { padding: "22px 18px 24px", textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } },
    props.glyph ? h("div", { style: { width: 54, height: 54, borderRadius: 14, background: props.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 } }, h(Glyph, { name: props.glyph, size: 30, color: props.accent })) : null,
    h("div", { style: { fontFamily: PIX, fontWeight: 800, fontSize: 19, color: props.accent, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" } }, props.title),
    h("div", { style: { fontFamily: SANS, fontSize: 13, color: "#aebccb", lineHeight: 1.55, maxWidth: 300, marginBottom: 14 } }, props.how),
    props.control ? h("div", { style: { display: "inline-flex", alignItems: "center", gap: 7, background: "#10202e", border: "1px solid " + props.accent, borderRadius: 99, padding: "6px 14px", marginBottom: 16, fontFamily: PIX, fontSize: 10.5, letterSpacing: 1, color: props.accent, fontWeight: 800 } }, h(Glyph, { name: "bolt", size: 13, color: props.accent }), props.control) : null,
    h("button", { onClick: function () { sfxPlay("start"); props.onStart(); }, style: { background: props.accent, color: "#06121d", border: "none", borderRadius: 11, padding: "13px 36px", cursor: "pointer", fontFamily: PIX, fontWeight: 800, fontSize: 16, letterSpacing: 3, marginBottom: 16, boxShadow: "0 4px 0 rgba(0,0,0,0.4)" } }, "PLAY"),
    props.best ? h("div", { style: { fontFamily: PIX, fontSize: 10, color: ARC_DIM, letterSpacing: 1, marginBottom: 14 } }, "YOUR BEST \u00b7 " + props.best) : null,
    props.fact ? h(RotatingFact, { fact: props.fact, accent: props.accent, center: true }) : null);
}

function ArcadeOver(props) {
  useEffect(function () { sfxPlay(props.win ? "land" : "over"); if (props.coins > 0) window.setTimeout(function () { sfxPlay("coin"); }, 260); }, []);
  return h("div", { style: { position: "absolute", inset: 0, background: "rgba(6,10,16,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 18, textAlign: "center", zIndex: 5 } },
    h("div", { style: { fontFamily: PIX, fontWeight: 800, fontSize: 18, color: props.win ? props.accent : "#FF7A78", letterSpacing: 2, marginBottom: 9 } }, props.title || "GAME OVER"),
    props.isBest ? h("div", { style: { fontFamily: PIX, fontSize: 10.5, fontWeight: 800, letterSpacing: 2, color: ARC_COIN, background: "rgba(255,210,74,0.12)", border: "1px solid " + ARC_COIN, borderRadius: 99, padding: "4px 12px", marginBottom: 10 } }, "\u2605 NEW BEST!") : null,
    h("div", { style: { fontFamily: PIX, fontSize: 36, fontWeight: 800, color: ARC_INK, lineHeight: 1, marginBottom: 3 } }, "" + props.score),
    h("div", { style: { fontFamily: PIX, fontSize: 9.5, color: ARC_DIM, letterSpacing: 1.5, marginBottom: 13 } }, props.isBest ? "NEW HIGH SCORE" : ("SCORE  \u00b7  BEST " + props.best)),
    props.coins != null ? h("div", { style: { display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,210,74,0.1)", border: "1px solid " + ARC_COIN, borderRadius: 10, padding: "8px 14px", marginBottom: 14 } },
      h(PixCoin, { size: 16 }),
      h("div", { style: { fontFamily: PIX, fontSize: 12.5, color: ARC_COIN, letterSpacing: 0.5, fontWeight: 800 } }, "+" + props.coins + " TICKETS" + (props.xpGain ? ("   +" + props.xpGain + " XP") : (props.coins > 0 ? "   (XP maxed today)" : "")))) : null,
    props.fact ? h("div", { style: { marginBottom: 16 } }, h(RotatingFact, { fact: props.fact, accent: props.accent, center: true })) : null,
    h("div", { style: { display: "flex", gap: 10 } },
      h("button", { onClick: props.onReplay, style: { background: props.accent, color: "#06121d", border: "none", borderRadius: 9, padding: "11px 24px", cursor: "pointer", fontFamily: PIX, fontWeight: 800, fontSize: 13, letterSpacing: 1 } }, "PLAY AGAIN"),
      h("button", { onClick: props.onExit, style: { background: "transparent", color: ARC_DIM, border: "1px solid " + ARC_LINE, borderRadius: 9, padding: "11px 20px", cursor: "pointer", fontFamily: PIX, fontWeight: 800, fontSize: 13, letterSpacing: 1 } }, "EXIT")));
}

/* a transient floating callout inside the play area */
function PopText(props) {
  if (!props.text) return null;
  return h("div", { style: { position: "absolute", left: 0, right: 0, top: props.top != null ? props.top : 70, textAlign: "center", fontFamily: PIX, fontSize: 15, fontWeight: 800, letterSpacing: 1, color: props.color || ARC_COIN, textShadow: "0 2px 6px rgba(0,0,0,0.6)", pointerEvents: "none", zIndex: 4 } }, props.text);
}

/* ---------------------------------------------------------------- Game 1: Final Approach */
function GameApproach(props) {
  var H = 300, PS = 26;
  var stRef = useRef({ y: H * 0.82, vy: -34, g: 64, lift: 150, ceil: H - PS, landings: 0 });
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var msgS = useState(""); var msg = msgS[0], setMsg = msgS[1];
  var bestS = useState(function () { return arcadeBest("approach"); }); var best = bestS[0], setBest = bestS[1];
  var holdRef = useRef(false); var prevBestRef = useRef(0);
  var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", score, 6, props.onEarn, props.xpLeft);

  function reset(g) { var land = stRef.current ? stRef.current.landings : 0; stRef.current = { y: H * 0.82, vy: -(g * 0.5), g: g, lift: 150, ceil: H - PS, landings: land }; }
  function start() { prevBestRef.current = best; stRef.current = { y: H * 0.82, vy: -34, g: 64, lift: 150, ceil: H - PS, landings: 0 }; setScore(0); setLives(3); setMsg("HOLD to add power"); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) setPhase("over"); }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest("approach", score)); }, [phase]);

  useRaf(function (dt) {
    var st = stRef.current;
    st.vy = st.vy - st.g * dt + (holdRef.current ? st.lift * dt : 0);
    if (st.vy > 130) st.vy = 130; if (st.vy < -170) st.vy = -170;
    st.y = st.y + st.vy * dt;
    if (st.y > st.ceil) { st.y = st.ceil; if (st.vy > 0) st.vy = 0; }
    if (st.y <= 0) {
      var sink = st.vy < 0 ? -st.vy : 0;
      var ng = st.g + 5; if (ng > 124) ng = 124;
      if (sink < 16) { st.landings += 1; setMsg("GREASER!  +50"); setScore(function (s) { return s + 50; }); sfxPlay("land"); reset(ng); }
      else if (sink < 42) { st.landings += 1; setMsg("Good landing  +20"); setScore(function (s) { return s + 20; }); reset(ng); }
      else { setMsg("HARD LANDING \u2014 go around!"); setLives(function (L) { return L - 1; }); reset(st.g); }
    }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  function down() { holdRef.current = true; }
  function up() { holdRef.current = false; }
  var st = stRef.current;
  var sink = st.vy < 0 ? Math.round(-st.vy) : 0;
  var hud = phase === "play" ? hudBox("LEVEL", st.landings + 1, "#3CE07A") : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Final Approach", accent: props.accent, glyph: props.glyph, control: "HOLD = throttle", best: best, fact: props.fact, how: "Hold to add power and slow your descent. Touch down gently in the runway zone \u2014 a soft sink rate is a greaser. Slam it and you lose a life. Each landing flies a little faster.", onStart: start }) :
    h("div", { style: { position: "relative", height: H } },
      h("div", { style: { position: "absolute", left: 8, top: 6, fontFamily: PIX, fontSize: 11, color: sink < 16 ? "#3CE07A" : (sink < 42 ? "#FFC247" : "#FF7A78"), letterSpacing: 1 } }, "ALT " + Math.round(st.y) + "   SINK " + sink),
      msg ? h("div", { style: { position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: PIX, fontSize: 12, color: ARC_INK, letterSpacing: 1 } }, msg) : null,
      h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: 22, background: "#1f3a26", borderTop: "3px solid #3CE07A" } }),
      h("div", { style: { position: "absolute", left: "8%", right: "8%", bottom: 22, height: 4, background: "repeating-linear-gradient(90deg,#EAF2F0 0 14px, transparent 14px 26px)" } }),
      h("div", { style: { position: "absolute", left: "26%", top: (H - PS - st.y) } }, h(PixPlane, { color: props.accent, size: PS })),
      h("div", { onPointerDown: down, onPointerUp: up, onPointerLeave: up, onPointerCancel: up, style: { position: "absolute", left: 0, right: 0, bottom: 0, top: 0, touchAction: "none" } }),
      h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: PIX, fontSize: 11, color: ARC_DIM, letterSpacing: 1, pointerEvents: "none" } }, "HOLD ANYWHERE = THROTTLE"));
  return h(ArcadeFrame, { title: "Final Approach", accent: props.accent, score: phase === "ready" ? null : score, best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Game 2: Sign Sweep */
function GameSigns(props) {
  function makeQ() {
    var pool = AIRPORT_SIGNS;
    var s = pool[Math.floor(Math.random() * pool.length)];
    var opts = [s.name]; var guard = 0;
    while (opts.length < 3 && guard < 60) { guard++; var o = pool[Math.floor(Math.random() * pool.length)]; if (opts.indexOf(o.name) === -1) opts.push(o.name); }
    return { sign: s, opts: shuffle(opts), ans: s.name };
  }
  var qS = useState(makeQ); var q = qS[0], setQ = qS[1];
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var comboS = useState(0); var combo = comboS[0], setCombo = comboS[1];
  var popS = useState(""); var pop = popS[0], setPop = popS[1];
  var bestS = useState(function () { return arcadeBest("signs"); }); var best = bestS[0], setBest = bestS[1];
  var flashS = useState(""); var flash = flashS[0], setFlash = flashS[1];
  var comboRef = useRef(0); var prevBestRef = useRef(0);
  var tlRef = useRef(6); var maxRef = useRef(6); var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", score, 0.6, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; comboRef.current = 0; setCombo(0); setPop(""); setScore(0); setLives(3); maxRef.current = 6; tlRef.current = 6; setFlash(""); setQ(makeQ()); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) setPhase("over"); }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest("signs", score)); }, [phase]);
  function nextQ(ok) { if (ok) { maxRef.current = Math.max(2.8, maxRef.current - 0.2); } tlRef.current = maxRef.current; setQ(makeQ()); }
  function loseCombo() { comboRef.current = 0; setCombo(0); }
  function answer(opt) {
    if (phase !== "play") return;
    if (opt === q.ans) {
      comboRef.current += 1; setCombo(comboRef.current);
      var add = 1; var streak = comboRef.current % 5 === 0;
      if (streak) { add += 5; setPop("x" + comboRef.current + " STREAK  +5"); window.setTimeout(function () { setPop(""); }, 750); }
      setFlash("ok"); setScore(function (s) { return s + add; }); nextQ(true);
    } else { loseCombo(); setFlash("no"); setLives(function (L) { return L - 1; }); nextQ(false); }
    window.setTimeout(function () { setFlash(""); }, 160);
  }
  useRaf(function (dt) {
    tlRef.current -= dt;
    if (tlRef.current <= 0) { loseCombo(); setLives(function (L) { return L - 1; }); tlRef.current = maxRef.current; setQ(makeQ()); }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  var pct = Math.max(0, Math.min(1, tlRef.current / maxRef.current));
  var hud = (phase === "play" && combo > 1) ? hudBox("COMBO", "x" + combo, ARC_COIN) : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Sign Sweep", accent: props.accent, glyph: props.glyph, control: "TAP the meaning", best: best, fact: props.fact, how: "A taxiway or runway sign flashes up \u2014 tap its correct meaning before the timer runs out. Build a combo for bonus points. Three misses ends the run.", onStart: start }) :
    h("div", { style: { position: "relative", padding: "16px 14px 18px", minHeight: 290 } },
      h("div", { style: { height: 6, background: "#1a2533", borderRadius: 3, marginBottom: 14 } }, h("div", { style: { height: 6, borderRadius: 3, width: (pct * 100) + "%", background: pct < 0.34 ? "#FF7A78" : props.accent } })),
      h("div", { style: { display: "flex", justifyContent: "center", background: flash === "ok" ? "#143322" : (flash === "no" ? "#3a1414" : "#0c1320"), border: "2px solid #1f2c3b", borderRadius: 8, padding: "16px 10px", marginBottom: 14 } }, h(SignGraphic, { kind: q.sign.kind, text: q.sign.text, arrow: q.sign.arrow })),
      h("div", { style: { textAlign: "center", fontFamily: PIX, fontSize: 11, color: ARC_DIM, letterSpacing: 1, marginBottom: 12 } }, "WHAT DOES THIS SIGN MEAN?"),
      q.opts.map(function (o, i) { function tap() { var ok = (o === q.ans); sfxPlay(ok ? (((comboRef.current + 1) % 5 === 0) ? "streak" : "correct") : "wrong"); answer(o); } return h("button", { key: i, onClick: tap, style: { display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", background: "#10151f", color: ARC_INK, border: "2px solid #2a3a4d", borderRadius: 8, padding: "11px 12px", marginBottom: 8, cursor: "pointer", fontFamily: SANS, fontSize: 13, lineHeight: 1.3 } }, o); }),
      h(PopText, { text: pop, color: ARC_COIN, top: 60 }));
  return h(ArcadeFrame, { title: "Sign Sweep", accent: props.accent, score: phase === "ready" ? null : score, best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Game 3: Taxi Runner */
function GameTaxi(props) {
  var H = 300, LANES = 3;
  var stRef = useRef({ lane: 1, obs: [], spawn: 0, speed: 150, dist: 0 });
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var popS = useState(""); var pop = popS[0], setPop = popS[1];
  var bestS = useState(function () { return arcadeBest("taxi"); }); var best = bestS[0], setBest = bestS[1];
  var prevBestRef = useRef(0); var popTimerRef = useRef(0);
  var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", score, 3, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; stRef.current = { lane: 1, obs: [], spawn: 0, speed: 150, dist: 0 }; setScore(0); setLives(3); setPop(""); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) setPhase("over"); }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest("taxi", score)); }, [phase]);
  function flashPop(txt) { setPop(txt); popTimerRef.current += 1; var mine = popTimerRef.current; window.setTimeout(function () { if (popTimerRef.current === mine) setPop(""); }, 500); }
  function move(d) { if (phase !== "play") return; var st = stRef.current; var nl = st.lane + d; if (nl < 0) nl = 0; if (nl > LANES - 1) nl = LANES - 1; st.lane = nl; }

  useRaf(function (dt) {
    var st = stRef.current;
    st.dist += st.speed * dt;
    st.speed += dt * 7;
    st.spawn -= dt;
    if (st.spawn <= 0) { st.spawn = 0.85 + Math.random() * 0.5; var bad = Math.random() < 0.7; st.obs.push({ lane: Math.floor(Math.random() * LANES), y: -24, bad: bad, hit: false }); }
    var planeY = H - 50;
    for (var i = 0; i < st.obs.length; i++) {
      var ob = st.obs[i]; ob.y += st.speed * dt;
      if (!ob.hit && ob.y > planeY - 18 && ob.y < planeY + 18 && ob.lane === st.lane) {
        ob.hit = true;
        if (ob.bad) { setLives(function (L) { return L - 1; }); flashPop("BUMP!"); }
        else { setScore(function (s) { return s + 5; }); flashPop("+5"); }
      }
    }
    st.obs = st.obs.filter(function (o) { return o.y < H + 30; });
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  var st = stRef.current;
  function laneX(l) { return (l + 0.5) * (100 / LANES); }
  var level = 1 + Math.floor(st.dist / 650);
  var hud = phase === "play" ? hudBox("LEVEL", level, "#34d3e0") : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Taxi Runner", accent: props.accent, glyph: props.glyph, control: "TAP L / R", best: best, fact: props.fact, how: "Taxi the ramp! Switch lanes to dodge the red hazards and scoop the green clearance chips for points. It speeds up the longer you survive. Three bumps and you're done.", onStart: start }) :
    h("div", { style: { position: "relative", height: H } },
      h("div", { style: { position: "absolute", left: "33.3%", top: 0, bottom: 0, width: 2, background: "#1b2735" } }),
      h("div", { style: { position: "absolute", left: "66.6%", top: 0, bottom: 0, width: 2, background: "#1b2735" } }),
      st.obs.map(function (o, i) { return h("div", { key: i, style: { position: "absolute", left: "calc(" + laneX(o.lane) + "% - 11px)", top: o.y, width: 22, height: 22, borderRadius: 4, background: o.bad ? "#FF5A57" : "#3CE07A", border: "2px solid " + (o.bad ? "#7a1d1c" : "#1f6b3f") } }); }),
      h("div", { style: { position: "absolute", left: "calc(" + laneX(st.lane) + "% - 14px)", top: H - 64 } }, h(PixPlane, { color: props.accent, size: 28 })),
      h(PopText, { text: pop, color: pop === "BUMP!" ? "#FF7A78" : "#3CE07A", top: H - 110 }),
      h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 8, display: "flex", gap: 10, padding: "0 12px" } },
        arcBtn("\u25C0 LEFT", function () { move(-1); }, props.accent, { flex: 1, fontSize: 13, padding: "13px 0" }),
        arcBtn("RIGHT \u25B6", function () { move(1); }, props.accent, { flex: 1, fontSize: 13, padding: "13px 0" })));
  return h(ArcadeFrame, { title: "Taxi Runner", accent: props.accent, score: phase === "ready" ? null : score, best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { title: "HOLD SHORT!", score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Game 4: Pattern Pilot */
var PATTERN_LEGS = ["UPWIND", "CROSSWIND", "DOWNWIND", "BASE", "FINAL"];
function GamePattern(props) {
  var stRef = useRef({ leg: 0, pos: 0, speed: 0.62, target: 0.78, win: 0.12, rounds: 0 });
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var bestS = useState(function () { return arcadeBest("pattern"); }); var best = bestS[0], setBest = bestS[1];
  var flashS = useState(""); var flash = flashS[0], setFlash = flashS[1];
  var prevBestRef = useRef(0);
  var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", score, 12, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; stRef.current = { leg: 0, pos: 0, speed: 0.62, target: 0.78, win: 0.12, rounds: 0 }; setScore(0); setLives(3); setFlash(""); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) setPhase("over"); }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest("pattern", score)); }, [phase]);
  function advance() {
    var st = stRef.current;
    st.leg += 1; st.pos = 0;
    if (st.leg >= PATTERN_LEGS.length) { st.leg = 0; st.rounds += 1; st.speed = Math.min(1.4, st.speed + 0.12); setScore(function (s) { return s + 100; }); setFlash("land"); }
    else { setScore(function (s) { return s + 15; }); setFlash("ok"); }
    window.setTimeout(function () { setFlash(""); }, 220);
  }
  function turn() {
    if (phase !== "play") return;
    var st = stRef.current;
    if (st.pos >= st.target - st.win && st.pos <= st.target + st.win) { advance(); }
    else { setFlash("miss"); setLives(function (L) { return L - 1; }); st.pos = 0; window.setTimeout(function () { setFlash(""); }, 220); }
  }
  useRaf(function (dt) {
    var st = stRef.current; st.pos += st.speed * dt;
    if (st.pos > 1) { setFlash("miss"); setLives(function (L) { return L - 1; }); st.pos = 0; }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  var st = stRef.current;
  var legColor = ["#FF5DA2", "#FFC247", "#3CE07A", "#34d3e0", "#EAF2F0"];
  function segStyle(idx) { return { flex: 1, height: 10, borderRadius: 3, background: idx === st.leg ? legColor[idx] : "#1f2c3b" }; }
  var bp = Math.max(0, Math.min(1, st.pos));
  var inWin = st.pos >= st.target - st.win && st.pos <= st.target + st.win;
  var hud = phase === "play" ? hudBox("ROUND", st.rounds + 1, "#FF5DA2") : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Pattern Pilot", accent: props.accent, glyph: props.glyph, control: "TAP on green", best: best, fact: props.fact, how: "Fly the traffic pattern! Tap TURN when the marker hits the green band to roll into the next leg \u2014 upwind, crosswind, downwind, base, final. Land to score big. Miss and you go around.", onStart: start }) :
    h("div", { style: { padding: "18px 16px", minHeight: 290, display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", gap: 4, marginBottom: 18 } }, PATTERN_LEGS.map(function (lg, i) { return h("div", { key: i, style: segStyle(i) }); })),
      h("div", { style: { textAlign: "center", fontFamily: PIX, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: legColor[st.leg], marginBottom: 6 } }, PATTERN_LEGS[st.leg]),
      h("div", { style: { textAlign: "center", fontFamily: PIX, fontSize: 11, color: flash === "land" ? props.accent : (flash === "miss" ? "#FF7A78" : ARC_DIM), letterSpacing: 1, marginBottom: 20, minHeight: 16 } },
        flash === "land" ? "CLEARED TO LAND!  +100" : (flash === "miss" ? "WENT AROUND!" : (flash === "ok" ? "ROLLING OUT  +15" : "TURN ON THE GREEN"))),
      h("div", { style: { position: "relative", height: 26, background: "#101a26", borderRadius: 5, border: "2px solid #243648", marginBottom: 22 } },
        h("div", { style: { position: "absolute", top: 0, bottom: 0, left: ((st.target - st.win) * 100) + "%", width: (st.win * 2 * 100) + "%", background: "#1f5b39" } }),
        h("div", { style: { position: "absolute", top: -3, bottom: -3, left: "calc(" + (bp * 100) + "% - 3px)", width: 6, borderRadius: 2, background: inWin ? props.accent : "#EAF2F0" } })),
      h("div", { style: { display: "flex", justifyContent: "center" } }, arcBtn("TURN", turn, props.accent, { fontSize: 16, padding: "14px 44px" })));
  return h(ArcadeFrame, { title: "Pattern Pilot", accent: props.accent, score: phase === "ready" ? null : score, best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Game 5: Altitude Hold */
function GameAltitude(props) {
  var H = 300, DUR = 45;
  var stRef = useRef({ alt: 0.5, band: 0.5, holdT: 9, time: DUR, score: 0 });
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var bestS = useState(function () { return arcadeBest("altitude"); }); var best = bestS[0], setBest = bestS[1];
  var finalS = useState(0); var finalScore = finalS[0], setFinalScore = finalS[1];
  var holdRef = useRef(false); var prevBestRef = useRef(0); var tickS = useState(0); var setTick = tickS[1];
  var BW = 0.13;
  var earn = useArcadeEarn(phase === "over", Math.round(stRef.current.score), 90, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; stRef.current = { alt: 0.5, band: 0.45, holdT: 9, time: DUR, score: 0 }; setFinalScore(0); setPhase("play"); }
  useEffect(function () { if (phase === "over") { setFinalScore(Math.round(stRef.current.score)); setBest(arcadeSetBest("altitude", Math.round(stRef.current.score))); } }, [phase]);
  useRaf(function (dt) {
    var st = stRef.current;
    var rate = 0.42;
    st.alt = st.alt + (holdRef.current ? rate : -rate) * dt;
    if (st.alt > 1) st.alt = 1; if (st.alt < 0) st.alt = 0;
    var inband = st.alt >= st.band - BW / 2 && st.alt <= st.band + BW / 2;
    if (inband) st.score += dt * 100;
    st.holdT -= dt;
    if (st.holdT <= 0) { st.holdT = 8; st.band = 0.18 + Math.random() * 0.64; }
    st.time -= dt;
    if (st.time <= 0) { st.time = 0; setPhase("over"); }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  function down() { holdRef.current = true; }
  function up() { holdRef.current = false; }
  var st = stRef.current;
  var inband = st.alt >= st.band - BW / 2 && st.alt <= st.band + BW / 2;
  function yTop(frac) { return (1 - frac) * (H - 20); }
  var hud = phase === "play" ? hudBox("TIME", Math.ceil(st.time) + "s", st.time < 10 ? "#FF7A78" : "#7CC4FF") : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Altitude Hold", accent: props.accent, glyph: props.glyph, control: "HOLD = climb", best: best, fact: props.fact, how: "Hold your assigned altitude! Hold to climb, release to descend, and keep the needle inside the green band to score. ATC keeps reassigning you \u2014 chase the band before time runs out.", onStart: start }) :
    h("div", { style: { position: "relative", height: H } },
      h("div", { style: { position: "absolute", right: 8, top: 6, fontFamily: PIX, fontSize: 11, color: inband ? props.accent : "#FFC247", letterSpacing: 1 } }, inband ? "ON ALTITUDE" : "CHASE THE BAND"),
      h("div", { style: { position: "absolute", left: 40, right: 40, top: yTop(st.band + BW / 2), height: (BW) * (H - 20), background: inband ? "rgba(60,224,122,0.22)" : "rgba(60,224,122,0.10)", border: "2px solid " + props.accent, borderRadius: 4 } }),
      h("div", { style: { position: "absolute", left: 40, right: 40, top: yTop(st.alt) - 2, height: 4, background: inband ? props.accent : "#FFC247" } }),
      h("div", { style: { position: "absolute", left: "50%", top: yTop(st.alt) - 13, marginLeft: -14 } }, h(PixPlane, { color: inband ? props.accent : "#FFC247", size: 28 })),
      h("div", { onPointerDown: down, onPointerUp: up, onPointerLeave: up, onPointerCancel: up, style: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, touchAction: "none" } }),
      h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: PIX, fontSize: 11, color: ARC_DIM, letterSpacing: 1, pointerEvents: "none" } }, "HOLD = CLIMB"));
  return h(ArcadeFrame, { title: "Altitude Hold", accent: props.accent, score: phase === "ready" ? null : (phase === "play" ? Math.round(st.score) : finalScore), best: best, hud: hud, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { title: "TIME!", win: true, score: finalScore, best: best, isBest: finalScore > prevBestRef.current && finalScore > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Game 6: Mayday Match */
var MATCH_PAIRS = [
  ["VFR", "Visual Flight Rules"],
  ["PIC", "Pilot in Command"],
  ["ATIS", "Recorded airport info"],
  ["METAR", "Routine weather report"],
  ["AGL", "Above Ground Level"],
  ["CTAF", "Common Traffic Freq"]
];
function buildDeck() {
  var cards = [];
  for (var i = 0; i < MATCH_PAIRS.length; i++) {
    cards.push({ pair: i, label: MATCH_PAIRS[i][0] });
    cards.push({ pair: i, label: MATCH_PAIRS[i][1] });
  }
  cards = shuffle(cards);
  for (var k = 0; k < cards.length; k++) { cards[k].id = k; cards[k].done = false; }
  return cards;
}
function GameMatch(props) {
  var deckS = useState(buildDeck); var deck = deckS[0], setDeck = deckS[1];
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var openS = useState([]); var open = openS[0], setOpen = openS[1];
  var movesS = useState(0); var moves = movesS[0], setMoves = movesS[1];
  var lockS = useState(false); var lock = lockS[0], setLock = lockS[1];
  var bestS = useState(function () { return arcadeBest("match"); }); var best = bestS[0], setBest = bestS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var prevBestRef = useRef(0);
  var earn = useArcadeEarn(phase === "won", score, 40, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; setDeck(buildDeck()); setOpen([]); setMoves(0); setLock(false); setScore(0); setPhase("play"); }
  function flip(idx) {
    if (phase !== "play" || lock) return;
    if (open.indexOf(idx) > -1) return;
    if (deck[idx].done) return;
    var no = open.concat([idx]);
    setOpen(no);
    if (no.length === 2) {
      setMoves(function (m) { return m + 1; });
      setLock(true);
      var a = deck[no[0]], b = deck[no[1]];
      if (a.pair === b.pair) { sfxPlay("correct");
        window.setTimeout(function () {
          setDeck(function (d) { var nd = d.slice(); nd[no[0]] = mergeStyle(nd[no[0]], { done: true }); nd[no[1]] = mergeStyle(nd[no[1]], { done: true }); return nd; });
          setOpen([]); setLock(false);
        }, 360);
      } else {
        sfxPlay("wrong"); window.setTimeout(function () { setOpen([]); setLock(false); }, 700);
      }
    }
  }
  useEffect(function () {
    if (phase !== "play") return;
    var allDone = true; for (var i = 0; i < deck.length; i++) { if (!deck[i].done) { allDone = false; break; } }
    if (allDone && deck.length) {
      var sc = Math.max(100, 1200 - moves * 50);
      setScore(sc); setBest(arcadeSetBest("match", sc)); sfxPlay("land"); setPhase("won");
    }
  }, [deck, phase]);

  var accent = props.accent;
  function tile(c, idx) {
    var faceUp = c.done || open.indexOf(idx) > -1;
    function tap() { flip(idx); }
    var isAcr = MATCH_PAIRS[c.pair][0] === c.label;
    return h("button", { key: idx, onClick: tap, style: { height: 64, borderRadius: 8, background: faceUp ? (c.done ? "#143322" : "#10202e") : "#10151f", border: "2px solid " + (c.done ? accent : (faceUp ? "#34d3e0" : "#2a3a4d")), cursor: "pointer", fontFamily: isAcr ? PIX : SANS, fontSize: isAcr ? 13 : 10, fontWeight: isAcr ? 800 : 600, letterSpacing: isAcr ? 0.5 : 0, color: faceUp ? ARC_INK : "#3a4c5e", padding: 4, lineHeight: 1.2, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" } },
      faceUp ? c.label : "?");
  }
  var hud = phase === "play" ? hudBox("MOVES", moves, "#C9A6FF") : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Mayday Match", accent: accent, glyph: props.glyph, control: "TAP to flip", best: best, fact: props.fact, how: "Flip tiles two at a time to pair each aviation acronym with its meaning. Clear the board in as few moves as you can for a higher score \u2014 memory training that teaches the lingo.", onStart: start }) :
    h("div", { style: { padding: "16px 14px 18px", minHeight: 290 } },
      h("div", { style: { textAlign: "center", fontFamily: PIX, fontSize: 10.5, color: ARC_DIM, letterSpacing: 1, marginBottom: 14 } }, "MATCH THE ACRONYM TO ITS MEANING"),
      h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } }, deck.map(function (c, i) { return tile(c, i); })));
  return h(ArcadeFrame, { title: "Mayday Match", accent: accent, score: phase === "won" ? score : (phase === "ready" ? null : 0), best: best, hud: hud, onExit: props.onExit },
    screen,
    phase === "won" ? h(ArcadeOver, { title: "BOARD CLEAR!", win: true, score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Game 7: METAR Blitz */
var METAR_STATIONS = ["KCLT", "KATL", "KORD", "KDEN", "KSEA", "KJFK", "KLAX", "KBOS", "KMIA", "KPHX", "KDFW", "KSFO", "KIAH", "KMCO"];
var VIS_OPTS = [
  { v: 10, code: "10SM", read: "10 statute miles" },
  { v: 7, code: "7SM", read: "7 statute miles" },
  { v: 5, code: "5SM", read: "5 statute miles" },
  { v: 4, code: "4SM", read: "4 statute miles" },
  { v: 3, code: "3SM", read: "3 statute miles" },
  { v: 2, code: "2SM", read: "2 statute miles" },
  { v: 1, code: "1SM", read: "1 statute mile" },
  { v: 0.5, code: "1/2SM", read: "1/2 statute mile" }
];
function pad2(n) { var s = String(Math.abs(n)); return s.length < 2 ? ("0" + s) : s; }
function pad3(n) { var s = String(n); while (s.length < 3) s = "0" + s; return s; }
function windCardinal(d) { var dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]; return dirs[Math.floor(((d + 22.5) % 360) / 45) % 8]; }
function flightCat(ceiling, vis) { var c = ceiling === null ? 99999 : ceiling; if (c < 500 || vis < 1) return "LIFR"; if (c < 1000 || vis < 3) return "IFR"; if (c <= 3000 || vis <= 5) return "MVFR"; return "VFR"; }
function genMetar() {
  var st = METAR_STATIONS[Math.floor(Math.random() * METAR_STATIONS.length)];
  var day = pad2(1 + Math.floor(Math.random() * 28));
  var hh = pad2(Math.floor(Math.random() * 24)); var mm = ["00", "20", "53"][Math.floor(Math.random() * 3)];
  var calm = Math.random() < 0.07;
  var dir = Math.floor(Math.random() * 36) * 10;
  var spd = calm ? 0 : (3 + Math.floor(Math.random() * 22));
  var gust = (!calm && spd >= 12 && Math.random() < 0.45) ? (spd + 3 + Math.floor(Math.random() * 8)) : 0;
  var windCode = calm ? "00000KT" : (pad3(dir) + pad2(spd) + (gust ? ("G" + pad2(gust)) : "") + "KT");
  var vo = VIS_OPTS[Math.floor(Math.random() * VIS_OPTS.length)];
  var ceiling = null; var cloudCode = "";
  var clear = Math.random() < 0.22;
  if (clear) { cloudCode = "SKC"; }
  else {
    var covers = ["FEW", "SCT", "BKN", "OVC"];
    var n = 1 + Math.floor(Math.random() * 2);
    var hHund = 2 + Math.floor(Math.random() * 9);
    for (var i = 0; i < n; i++) {
      var cover = covers[Math.floor(Math.random() * covers.length)];
      if ((cover === "BKN" || cover === "OVC") && ceiling === null) ceiling = hHund * 100;
      cloudCode += (cloudCode ? " " : "") + cover + pad3(hHund);
      hHund = hHund + (5 + Math.floor(Math.random() * 45)); if (hHund > 250) hHund = 250;
    }
  }
  var tempC = -6 + Math.floor(Math.random() * 44);
  var dewC = tempC - (1 + Math.floor(Math.random() * 7));
  var tempCode = (tempC < 0 ? ("M" + pad2(tempC)) : pad2(tempC)) + "/" + (dewC < 0 ? ("M" + pad2(dewC)) : pad2(dewC));
  var althgH = 2980 + Math.floor(Math.random() * 46);
  var althg = althgH / 100;
  var altCode = "A" + althgH;
  var code = st + " " + day + hh + mm + "Z " + windCode + " " + vo.code + " " + cloudCode + " " + tempCode + " " + altCode;
  return { code: code, calm: calm, wind: { dir: dir, spd: spd, gust: gust }, visSM: vo.v, visRead: vo.read, ceiling: ceiling, tempC: tempC, dewC: dewC, althg: althg, category: flightCat(ceiling, vo.v) };
}
function metarMakeQ() {
  var m = genMetar();
  var types = ["vis", "temp", "alt", "cat", "ceiling"];
  if (!m.calm) { types.push("wind-dir"); types.push("wind-spd"); }
  var ty = types[Math.floor(Math.random() * types.length)];
  var prompt = "", answer = "", opts = [];
  function uniq(x) { if (opts.indexOf(x) === -1) opts.push(x); }
  if (ty === "wind-dir") {
    prompt = "Which way is the wind blowing FROM?";
    answer = windCardinal(m.wind.dir) + " (" + pad3(m.wind.dir) + " deg)"; opts = [answer];
    var g0 = 0; while (opts.length < 3 && g0 < 50) { g0++; var dd = Math.floor(Math.random() * 36) * 10; if (windCardinal(dd) !== windCardinal(m.wind.dir)) uniq(windCardinal(dd) + " (" + pad3(dd) + " deg)"); }
  } else if (ty === "wind-spd") {
    prompt = "What is the wind speed?";
    answer = m.wind.spd + " knots"; opts = [answer];
    var g1 = 0; while (opts.length < 3 && g1 < 50) { g1++; var off = (2 + Math.floor(Math.random() * 9)) * (Math.random() < 0.5 ? -1 : 1); var v = m.wind.spd + off; if (v >= 0) uniq(v + " knots"); }
  } else if (ty === "vis") {
    prompt = "What is the visibility?";
    answer = m.visRead; opts = [answer];
    var g2 = 0; while (opts.length < 3 && g2 < 50) { g2++; uniq(VIS_OPTS[Math.floor(Math.random() * VIS_OPTS.length)].read); }
  } else if (ty === "ceiling") {
    prompt = "What is the ceiling?";
    answer = m.ceiling ? (m.ceiling + " ft") : "No ceiling (clear or few/scattered only)"; opts = [answer];
    if (m.ceiling) { var g3 = 0; while (opts.length < 3 && g3 < 50) { g3++; uniq(((2 + Math.floor(Math.random() * 120)) * 100) + " ft"); } uniq("No ceiling"); opts = opts.slice(0, 3); if (opts.indexOf(answer) === -1) opts[0] = answer; }
    else { uniq("No ceiling"); var g4 = 0; while (opts.length < 3 && g4 < 50) { g4++; uniq(((3 + Math.floor(Math.random() * 120)) * 100) + " ft"); } }
  } else if (ty === "temp") {
    prompt = "What is the temperature?";
    answer = m.tempC + " C"; opts = [answer];
    var g5 = 0; while (opts.length < 3 && g5 < 50) { g5++; var o2 = (2 + Math.floor(Math.random() * 6)) * (Math.random() < 0.5 ? -1 : 1); uniq((m.tempC + o2) + " C"); }
  } else if (ty === "alt") {
    prompt = "What is the altimeter setting?";
    answer = m.althg.toFixed(2) + " inHg"; opts = [answer];
    var g6 = 0; while (opts.length < 3 && g6 < 50) { g6++; var d = (5 + Math.floor(Math.random() * 16)) / 100 * (Math.random() < 0.5 ? -1 : 1); uniq((m.althg + d).toFixed(2) + " inHg"); }
  } else {
    prompt = "What is the flight category?";
    answer = m.category; opts = ["VFR", "MVFR", "IFR", "LIFR"];
  }
  if (ty !== "cat") opts = shuffle(opts);
  return { m: m, prompt: prompt, opts: opts, ans: answer };
}
function GameMetar(props) {
  var qS = useState(metarMakeQ); var q = qS[0], setQ = qS[1];
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var comboS = useState(0); var combo = comboS[0], setCombo = comboS[1];
  var popS = useState(""); var pop = popS[0], setPop = popS[1];
  var bestS = useState(function () { return arcadeBest("metar"); }); var best = bestS[0], setBest = bestS[1];
  var flashS = useState(""); var flash = flashS[0], setFlash = flashS[1];
  var comboRef = useRef(0); var prevBestRef = useRef(0);
  var tlRef = useRef(9); var maxRef = useRef(9); var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", score, 0.6, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; comboRef.current = 0; setCombo(0); setPop(""); setScore(0); setLives(3); maxRef.current = 9; tlRef.current = 9; setFlash(""); setQ(metarMakeQ()); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) setPhase("over"); }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest("metar", score)); }, [phase]);
  function nextQ(ok) { if (ok) { maxRef.current = Math.max(3.6, maxRef.current - 0.25); } tlRef.current = maxRef.current; setQ(metarMakeQ()); }
  function loseCombo() { comboRef.current = 0; setCombo(0); }
  function answer(opt) {
    if (phase !== "play") return;
    if (opt === q.ans) {
      comboRef.current += 1; setCombo(comboRef.current);
      var add = 1; var streak = comboRef.current % 5 === 0;
      if (streak) { add += 5; setPop("x" + comboRef.current + " STREAK  +5"); window.setTimeout(function () { setPop(""); }, 750); }
      setFlash("ok"); setScore(function (s) { return s + add; }); nextQ(true);
    } else { loseCombo(); setFlash("no"); setLives(function (L) { return L - 1; }); nextQ(false); }
    window.setTimeout(function () { setFlash(""); }, 170);
  }
  useRaf(function (dt) {
    tlRef.current -= dt;
    if (tlRef.current <= 0) { loseCombo(); setLives(function (L) { return L - 1; }); tlRef.current = maxRef.current; setQ(metarMakeQ()); }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  var pct = Math.max(0, Math.min(1, tlRef.current / maxRef.current));
  var hud = (phase === "play" && combo > 1) ? hudBox("COMBO", "x" + combo, ARC_COIN) : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "METAR Blitz", accent: props.accent, glyph: props.glyph, control: "TAP the answer", best: best, fact: props.fact, how: "A coded weather report flashes on the scope \u2014 read it fast and tap the right answer for wind, visibility, ceiling, temp, altimeter, or flight category. Combos pay bonus points.", onStart: start }) :
    h("div", { style: { position: "relative", padding: "16px 14px 18px", minHeight: 290 } },
      h("div", { style: { height: 6, background: "#1a2533", borderRadius: 3, marginBottom: 12 } }, h("div", { style: { height: 6, borderRadius: 3, width: (pct * 100) + "%", background: pct < 0.34 ? "#FF7A78" : props.accent } })),
      h("div", { style: { fontFamily: PIX, fontSize: 9, color: ARC_DIM, letterSpacing: 1, marginBottom: 5 } }, "DECODE THIS REPORT"),
      h("div", { style: { background: flash === "ok" ? "#0e2a1c" : (flash === "no" ? "#2e1212" : "#04140e"), border: "2px solid " + props.accent, borderRadius: 6, color: "#9CF2C9", fontFamily: PIX, fontSize: 12.5, lineHeight: 1.6, letterSpacing: 0.5, padding: "12px 12px", marginBottom: 14, wordBreak: "break-word", boxShadow: "inset 0 0 14px rgba(60,224,122,0.18)" } }, q.m.code),
      h("div", { style: { textAlign: "center", fontFamily: PIX, fontSize: 12, color: ARC_INK, letterSpacing: 0.5, marginBottom: 12 } }, q.prompt),
      q.opts.map(function (o, i) { function tap() { var ok = (o === q.ans); sfxPlay(ok ? (((comboRef.current + 1) % 5 === 0) ? "streak" : "correct") : "wrong"); answer(o); } return h("button", { key: i, onClick: tap, style: { display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", background: "#10151f", color: ARC_INK, border: "2px solid #2a3a4d", borderRadius: 8, padding: "11px 12px", marginBottom: 8, cursor: "pointer", fontFamily: SANS, fontSize: 13, lineHeight: 1.3 } }, o); }),
      h(PopText, { text: pop, color: ARC_COIN, top: 64 }));
  return h(ArcadeFrame, { title: "METAR Blitz", accent: props.accent, score: phase === "ready" ? null : score, best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

/* ---------------------------------------------------------------- Arcade hub */
/* ============================================================================
   ARCADE EXPANSION — ticket tiers, a shared knowledge-quiz engine, and six new
   aviation-education minigames (phonetic alphabet, airspace, instruments, light
   signals, clouds, crosswind landing). Strict-parser safe; pure DOM/SVG.
   ========================================================================== */
var ARCADE_TIERS = [
  { min: 0, name: "Ramp Rookie", color: "#8aa0b4" },
  { min: 50, name: "Cadet", color: "#5BE0C4" },
  { min: 150, name: "Aviator", color: "#7CC4FF" },
  { min: 400, name: "Captain", color: "#FFC247" },
  { min: 800, name: "Ace", color: "#FF5DA2" },
  { min: 1500, name: "Top Gun", color: "#C9A6FF" }
];
function arcadeTierInfo(tickets) {
  var cur = ARCADE_TIERS[0]; var nxt = null;
  for (var i = 0; i < ARCADE_TIERS.length; i++) {
    if (tickets >= ARCADE_TIERS[i].min) { cur = ARCADE_TIERS[i]; nxt = (i + 1 < ARCADE_TIERS.length) ? ARCADE_TIERS[i + 1] : null; }
  }
  return { cur: cur, nxt: nxt };
}

/* ---- shared knowledge-quiz engine: timer bar + combo + lives + custom stage ---- */
function ArcadeQuiz(props) {
  var qS = useState(props.makeQ); var q = qS[0], setQ = qS[1];
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var scoreS = useState(0); var score = scoreS[0], setScore = scoreS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var comboS = useState(0); var combo = comboS[0], setCombo = comboS[1];
  var popS = useState(""); var pop = popS[0], setPop = popS[1];
  var bestS = useState(function () { return arcadeBest(props.id); }); var best = bestS[0], setBest = bestS[1];
  var flashS = useState(""); var flash = flashS[0], setFlash = flashS[1];
  var comboRef = useRef(0); var prevBestRef = useRef(0);
  var maxT = props.startTime || 7; var minT = props.minTime || 3.2;
  var tlRef = useRef(maxT); var maxRef = useRef(maxT);
  var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", score, props.div || 0.6, props.onEarn, props.xpLeft);

  function start() { prevBestRef.current = best; comboRef.current = 0; setCombo(0); setPop(""); setScore(0); setLives(3); maxRef.current = maxT; tlRef.current = maxT; setFlash(""); setQ(props.makeQ()); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) setPhase("over"); }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest(props.id, score)); }, [phase]);
  function nextQ(ok) { if (ok) { maxRef.current = Math.max(minT, maxRef.current - 0.2); } tlRef.current = maxRef.current; setQ(props.makeQ()); }
  function loseCombo() { comboRef.current = 0; setCombo(0); }
  function answer(opt) {
    if (phase !== "play") return;
    if (opt === q.ans) {
      comboRef.current += 1; setCombo(comboRef.current);
      var add = 1; var streak = comboRef.current % 5 === 0;
      if (streak) { add += 5; setPop("x" + comboRef.current + " STREAK  +5"); window.setTimeout(function () { setPop(""); }, 750); }
      setFlash("ok"); setScore(function (s) { return s + add; }); nextQ(true);
    } else { loseCombo(); setFlash("no"); setLives(function (L) { return L - 1; }); nextQ(false); }
    window.setTimeout(function () { setFlash(""); }, 160);
  }
  useRaf(function (dt) {
    tlRef.current -= dt;
    if (tlRef.current <= 0) { loseCombo(); setLives(function (L) { return L - 1; }); tlRef.current = maxRef.current; setQ(props.makeQ()); }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  var pct = Math.max(0, Math.min(1, tlRef.current / maxRef.current));
  var hud = (phase === "play" && combo > 1) ? hudBox("COMBO", "x" + combo, ARC_COIN) : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: props.title, accent: props.accent, glyph: props.glyph, control: props.control, best: best, fact: props.fact, how: props.how, onStart: start }) :
    h("div", { style: { position: "relative", padding: "16px 14px 18px", minHeight: 290 } },
      h("div", { style: { height: 6, background: "#1a2533", borderRadius: 3, marginBottom: 14 } }, h("div", { style: { height: 6, borderRadius: 3, width: (pct * 100) + "%", background: pct < 0.34 ? "#FF7A78" : props.accent } })),
      props.stage ? props.stage(q, flash, props.accent) : null,
      h("div", { style: { textAlign: "center", fontFamily: PIX, fontSize: 11.5, color: ARC_INK, letterSpacing: 0.5, margin: "13px 0 12px" } }, q.prompt),
      q.opts.map(function (o, i) { function tap() { var ok = (o === q.ans); sfxPlay(ok ? (((comboRef.current + 1) % 5 === 0) ? "streak" : "correct") : "wrong"); answer(o); } return h("button", { key: i, onClick: tap, style: { display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", background: "#10151f", color: ARC_INK, border: "2px solid #2a3a4d", borderRadius: 8, padding: "11px 12px", marginBottom: 8, cursor: "pointer", fontFamily: SANS, fontSize: 13, lineHeight: 1.3 } }, o); }),
      h(PopText, { text: pop, color: ARC_COIN, top: 60 }));
  return h(ArcadeFrame, { title: props.title, accent: props.accent, score: phase === "ready" ? null : score, best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { score: score, best: best, isBest: score > prevBestRef.current && score > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

function quizOptButtonsFill(opts, pool) { var g = 0; while (opts.length < 4 && g < 80) { g++; var o = pool[Math.floor(Math.random() * pool.length)]; if (opts.indexOf(o) === -1) opts.push(o); } return opts; }

/* ---------------------------------------------------------------- Game 8: Phonetic Flash */
var NATO = [["A", "Alfa"], ["B", "Bravo"], ["C", "Charlie"], ["D", "Delta"], ["E", "Echo"], ["F", "Foxtrot"], ["G", "Golf"], ["H", "Hotel"], ["I", "India"], ["J", "Juliett"], ["K", "Kilo"], ["L", "Lima"], ["M", "Mike"], ["N", "November"], ["O", "Oscar"], ["P", "Papa"], ["Q", "Quebec"], ["R", "Romeo"], ["S", "Sierra"], ["T", "Tango"], ["U", "Uniform"], ["V", "Victor"], ["W", "Whiskey"], ["X", "X-ray"], ["Y", "Yankee"], ["Z", "Zulu"]];
var NATO_NUM = [["0", "Zero"], ["1", "One"], ["3", "Tree"], ["5", "Fife"], ["9", "Niner"]];
var NATO_WORDS = NATO.map(function (p) { return p[1]; });
var NATO_LETTERS = NATO.map(function (p) { return p[0]; });
function GamePhonetic(props) {
  function makeQ() {
    if (Math.random() < 0.26) {
      var n = NATO_NUM[Math.floor(Math.random() * NATO_NUM.length)];
      var po = NATO_NUM.map(function (p) { return p[1]; }).concat(NATO_WORDS);
      return { given: n[0], kind: "char", prompt: "How do pilots say this number?", opts: shuffle(quizOptButtonsFill([n[1]], po)), ans: n[1] };
    }
    var L = NATO[Math.floor(Math.random() * NATO.length)];
    if (Math.random() < 0.4) return { given: L[1], kind: "word", prompt: "Which letter is this?", opts: shuffle(quizOptButtonsFill([L[0]], NATO_LETTERS)), ans: L[0] };
    return { given: L[0], kind: "char", prompt: "Say it on the radio:", opts: shuffle(quizOptButtonsFill([L[1]], NATO_WORDS)), ans: L[1] };
  }
  function stage(q, flash, accent) {
    return h("div", { style: { display: "flex", justifyContent: "center" } },
      h("div", { style: { minWidth: 130, textAlign: "center", background: flash === "ok" ? "#0e2a1c" : (flash === "no" ? "#2e1212" : "#0a1622"), border: "2px solid " + accent, borderRadius: 10, padding: "16px 20px", boxShadow: "inset 0 0 14px " + accent + "22" } },
        h("div", { style: { fontFamily: PIX, fontSize: 9, color: ARC_DIM, letterSpacing: 1.5, marginBottom: 7 } }, q.kind === "word" ? "PHONETIC WORD" : "ON THE STRIP"),
        h("div", { style: { fontFamily: PIX, fontSize: q.kind === "word" ? 26 : 48, fontWeight: 800, color: ARC_INK, lineHeight: 1 } }, q.given)));
  }
  return h(ArcadeQuiz, { id: "phonetic", title: "Phonetic Flash", accent: props.accent, glyph: props.glyph, fact: props.fact, onEarn: props.onEarn, xpLeft: props.xpLeft, onExit: props.onExit, div: 0.6, startTime: 6, minTime: 3, control: "TAP the match", how: "Talk like a pilot. A letter or number flashes on the radio panel \u2014 tap its correct phonetic word (or the letter it stands for) before the clock runs out. Chain answers for combo bonuses.", makeQ: makeQ, stage: stage });
}

/* ---------------------------------------------------------------- Game 9: Airspace Ace */
var AIRSPACE_Q = [
  { s: "18,000 ft MSL up to FL600, anywhere over the U.S.", a: "Class A" },
  { s: "Surface up to 10,000 ft around the nation's busiest airports.", a: "Class B" },
  { s: "Surface to ~4,000 ft AGL at a busy airport with radar approach.", a: "Class C" },
  { s: "Surface to ~2,500 ft AGL around an airport with an operating tower.", a: "Class D" },
  { s: "Controlled airspace beginning at 1,200 ft AGL away from busy fields.", a: "Class E" },
  { s: "Uncontrolled airspace, usually near the surface in rural areas.", a: "Class G" },
  { s: "A dashed blue circle, tower but no radar approach, about 4 NM wide.", a: "Class D" },
  { s: "Magenta solid rings, surface up, tower plus radar, a mid-size city.", a: "Class C" },
  { s: "Solid blue rings stacked like an upside-down wedding cake at a hub.", a: "Class B" },
  { s: "All aircraft on IFR clearances with ATC; no VFR allowed.", a: "Class A" },
  { s: "Faded magenta ring: controlled airspace from 700 ft AGL upward.", a: "Class E" },
  { s: "No tower, low altitude, see-and-avoid is the only rule.", a: "Class G" },
  { s: "Two-way radio contact required before entering; Mode C veil.", a: "Class B" },
  { s: "Surface area with a tower; you need clearance to enter the pattern.", a: "Class D" }
];
var AIRSPACE_ALL = ["Class A", "Class B", "Class C", "Class D", "Class E", "Class G"];
function GameAirspace(props) {
  function makeQ() {
    var it = AIRSPACE_Q[Math.floor(Math.random() * AIRSPACE_Q.length)];
    return { scenario: it.s, prompt: "Which airspace class?", opts: shuffle(quizOptButtonsFill([it.a], AIRSPACE_ALL)), ans: it.a };
  }
  function stage(q, flash, accent) {
    return h("div", { style: { background: flash === "ok" ? "#0e2a1c" : (flash === "no" ? "#2e1212" : "#0a1622"), border: "2px solid " + accent, borderRadius: 10, padding: "14px 14px", display: "flex", gap: 12, alignItems: "center" } },
      h("div", { style: { width: 42, height: 42, borderRadius: 10, background: accent + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "airspace", size: 23, color: accent })),
      h("div", { style: { fontFamily: SANS, fontSize: 13.5, color: ARC_INK, lineHeight: 1.45 } }, q.scenario));
  }
  return h(ArcadeQuiz, { id: "airspace", title: "Airspace Ace", accent: props.accent, glyph: props.glyph, fact: props.fact, onEarn: props.onEarn, xpLeft: props.xpLeft, onExit: props.onExit, div: 0.5, startTime: 8, minTime: 4, control: "TAP the class", how: "Know your airspace. Read each description \u2014 altitudes, chart colors, or entry rules \u2014 and tap the matching class (A, B, C, D, E, or G). Speed and streaks earn bonus points.", makeQ: makeQ, stage: stage });
}

/* ---------------------------------------------------------------- Game 10: Gauge Reader */
function polarX(cx, r, ang) { return cx + r * Math.sin(ang * Math.PI / 180); }
function polarY(cy, r, ang) { return cy - r * Math.cos(ang * Math.PI / 180); }
function gaugeSVG(kind, val, size, accent) {
  var cx = 50, cy = 50; var els = [];
  els.push(h("circle", { key: "bg", cx: cx, cy: cy, r: 47, fill: "#0a1320", stroke: "#2a3a4d", strokeWidth: 2 }));
  if (kind === "alt") {
    for (var i = 0; i < 10; i++) {
      var a = i * 36;
      els.push(h("line", { key: "t" + i, x1: polarX(cx, 44, a), y1: polarY(cy, 44, a), x2: polarX(cx, 39, a), y2: polarY(cy, 39, a), stroke: "#5e7488", strokeWidth: 1.5 }));
      els.push(h("text", { key: "n" + i, x: polarX(cx, 31, a), y: polarY(cy, 31, a) + 4, fill: "#c7d4e0", fontSize: 11, fontFamily: PIX, fontWeight: 800, textAnchor: "middle" }, "" + i));
    }
    var a1k = (val % 10000) / 10000 * 360;
    var a100 = (val % 1000) / 1000 * 360;
    els.push(h("line", { key: "h1k", x1: cx, y1: cy, x2: polarX(cx, 20, a1k), y2: polarY(cy, 20, a1k), stroke: "#EAF2F0", strokeWidth: 5, strokeLinecap: "round" }));
    els.push(h("line", { key: "h100", x1: cx, y1: cy, x2: polarX(cx, 38, a100), y2: polarY(cy, 38, a100), stroke: accent, strokeWidth: 2.5, strokeLinecap: "round" }));
  } else {
    var marks = [0, 40, 80, 120, 160, 200];
    for (var m = 0; m < marks.length; m++) {
      var ang = -135 + (marks[m] / 200) * 270;
      els.push(h("line", { key: "at" + m, x1: polarX(cx, 44, ang), y1: polarY(cy, 44, ang), x2: polarX(cx, 38, ang), y2: polarY(cy, 38, ang), stroke: "#5e7488", strokeWidth: 1.5 }));
      els.push(h("text", { key: "an" + m, x: polarX(cx, 30, ang), y: polarY(cy, 30, ang) + 4, fill: "#c7d4e0", fontSize: 9.5, fontFamily: PIX, fontWeight: 800, textAnchor: "middle" }, "" + marks[m]));
    }
    var av = -135 + (Math.max(0, Math.min(200, val)) / 200) * 270;
    els.push(h("line", { key: "asn", x1: cx, y1: cy, x2: polarX(cx, 38, av), y2: polarY(cy, 38, av), stroke: accent, strokeWidth: 3, strokeLinecap: "round" }));
  }
  els.push(h("circle", { key: "hub", cx: cx, cy: cy, r: 4, fill: "#EAF2F0" }));
  return h("svg", { width: size, height: size, viewBox: "0 0 100 100", style: { display: "block" } }, els);
}
function GameGauge(props) {
  function makeQ() {
    if (Math.random() < 0.5) {
      var alt = (2 + Math.floor(Math.random() * 97)) * 100; /* 200..9900 */
      var opts = ["" + alt.toLocaleString() + " ft"];
      var g = 0; while (opts.length < 4 && g < 80) { g++; var d = alt + (Math.floor(Math.random() * 7) - 3) * (Math.random() < 0.5 ? 100 : 1000); if (d >= 100 && d < 10000 && opts.indexOf(d.toLocaleString() + " ft") === -1) opts.push(d.toLocaleString() + " ft"); }
      return { kind: "alt", val: alt, prompt: "Read the altimeter:", opts: shuffle(opts), ans: alt.toLocaleString() + " ft" };
    }
    var spd = (8 + Math.floor(Math.random() * 30)) * 5; /* 40..190 */
    var so = ["" + spd + " kt"]; var g2 = 0;
    while (so.length < 4 && g2 < 80) { g2++; var sd = spd + (Math.floor(Math.random() * 9) - 4) * 5; if (sd >= 30 && sd <= 200 && so.indexOf(sd + " kt") === -1) so.push(sd + " kt"); }
    return { kind: "asi", val: spd, prompt: "Read the airspeed:", opts: shuffle(so), ans: spd + " kt" };
  }
  function stage(q, flash, accent) {
    return h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
      h("div", { style: { fontFamily: PIX, fontSize: 9, color: ARC_DIM, letterSpacing: 1.5, marginBottom: 8 } }, q.kind === "alt" ? "ALTIMETER (FT)" : "AIRSPEED (KT)"),
      h("div", { style: { padding: 6, borderRadius: 14, background: flash === "ok" ? "#0e2a1c" : (flash === "no" ? "#2e1212" : "transparent") } }, gaugeSVG(q.kind, q.val, 150, accent)));
  }
  return h(ArcadeQuiz, { id: "gauge", title: "Gauge Reader", accent: props.accent, glyph: props.glyph, fact: props.fact, onEarn: props.onEarn, xpLeft: props.xpLeft, onExit: props.onExit, div: 0.45, startTime: 9, minTime: 4.5, control: "TAP the reading", how: "Scan the panel. A flight instrument appears \u2014 read the altimeter's two hands (hundreds and thousands) or the airspeed needle, then tap the correct value. A real skill every pilot drills.", makeQ: makeQ, stage: stage });
}

/* ---------------------------------------------------------------- Game 11: Tower Signals */
var LIGHT_SIGNALS = [
  { color: "green", mode: "steady", ground: "Cleared for takeoff", air: "Cleared to land" },
  { color: "green", mode: "flash", ground: "Cleared to taxi", air: "Return for landing" },
  { color: "red", mode: "steady", ground: "Stop", air: "Give way and keep circling" },
  { color: "red", mode: "flash", ground: "Taxi clear of the runway in use", air: "Airport unsafe \u2014 do not land" },
  { color: "white", mode: "flash", ground: "Return to your starting point on the airport", air: null }
];
var SIGNAL_MEANINGS = ["Cleared for takeoff", "Cleared to land", "Cleared to taxi", "Return for landing", "Stop", "Give way and keep circling", "Taxi clear of the runway in use", "Airport unsafe \u2014 do not land", "Return to your starting point on the airport"];
function GameSignals(props) {
  function makeQ() {
    var sig = LIGHT_SIGNALS[Math.floor(Math.random() * LIGHT_SIGNALS.length)];
    var ctx = "air";
    if (sig.air === null) ctx = "ground"; else ctx = Math.random() < 0.5 ? "ground" : "air";
    var ans = ctx === "air" ? sig.air : sig.ground;
    return { sig: sig, context: ctx, prompt: "What does this light mean?", opts: shuffle(quizOptButtonsFill([ans], SIGNAL_MEANINGS)), ans: ans };
  }
  function stage(q, flash, accent) {
    var on = q.sig.mode === "steady" ? true : (Math.floor(Date.now() / 430) % 2 === 0);
    var col = q.sig.color === "green" ? "#3CE07A" : (q.sig.color === "red" ? "#FF5A57" : "#EAF2F0");
    return h("div", { style: { textAlign: "center", background: flash === "ok" ? "#0e2a1c" : (flash === "no" ? "#2e1212" : "#0a1622"), border: "2px solid #2a3a4d", borderRadius: 10, padding: "14px 10px 12px" } },
      h("div", { style: { display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12 } },
        h(Glyph, { name: q.context === "air" ? "wing" : "runway", size: 14, color: accent }),
        h("div", { style: { fontFamily: PIX, fontSize: 10.5, letterSpacing: 1.5, color: accent, fontWeight: 800 } }, q.context === "air" ? "IN FLIGHT" : "ON THE GROUND")),
      h("div", { style: { width: 66, height: 66, borderRadius: 99, margin: "0 auto", background: on ? col : "#0c1016", border: "3px solid " + (on ? col : "#2a3a4d"), boxShadow: on ? ("0 0 26px " + col) : "none" } }),
      h("div", { style: { fontFamily: PIX, fontSize: 9.5, color: ARC_DIM, letterSpacing: 1.5, marginTop: 10 } }, (q.sig.mode === "steady" ? "STEADY " : "FLASHING ") + q.sig.color.toUpperCase()));
  }
  return h(ArcadeQuiz, { id: "signals", title: "Tower Signals", accent: props.accent, glyph: props.glyph, fact: props.fact, onEarn: props.onEarn, xpLeft: props.xpLeft, onExit: props.onExit, div: 0.55, startTime: 8, minTime: 4, control: "TAP the meaning", how: "Radio out? Read the tower's light gun. A steady or flashing colored beam means different things on the ground vs in the air \u2014 tap the correct meaning before time runs out.", makeQ: makeQ, stage: stage });
}

/* ---------------------------------------------------------------- Game 12: Cloud Spotter */
var CLOUDS = [
  { key: "cumulus", name: "Cumulus", mean: "Fair weather, but can build up" },
  { key: "stratus", name: "Stratus", mean: "Low gray layer: overcast, drizzle" },
  { key: "cirrus", name: "Cirrus", mean: "High wispy ice: change may be coming" },
  { key: "cumulonimbus", name: "Cumulonimbus", mean: "Thunderstorm \u2014 avoid it!" },
  { key: "stratocumulus", name: "Stratocumulus", mean: "Lumpy low layer, usually dry" }
];
var CLOUD_NAMES = CLOUDS.map(function (c) { return c.name; });
var CLOUD_MEANS = CLOUDS.map(function (c) { return c.mean; });
function cloudSVG(key) {
  var w = "#EAF2F0", g = "#AEB9C6";
  function rk(x, y, ww, hh, f) { return h("rect", { key: x + "_" + y + "_" + ww, x: x, y: y, width: ww, height: hh, rx: 2, fill: f || w }); }
  var els = [];
  if (key === "cumulus") { els = [rk(34, 30, 52, 22), rk(40, 20, 18, 14), rk(56, 16, 20, 16), rk(72, 24, 14, 12), rk(28, 38, 70, 10)]; }
  else if (key === "stratus") { els = [rk(14, 34, 92, 12, g), rk(20, 48, 80, 8, g)]; }
  else if (key === "cirrus") { els = [h("rect", { key: "c1", x: 22, y: 22, width: 40, height: 4, rx: 2, fill: w, transform: "rotate(-18 42 24)" }), h("rect", { key: "c2", x: 44, y: 32, width: 34, height: 4, rx: 2, fill: w, transform: "rotate(-22 61 34)" }), h("rect", { key: "c3", x: 30, y: 42, width: 30, height: 3, rx: 2, fill: w, transform: "rotate(-15 45 43)" }), h("rect", { key: "c4", x: 58, y: 46, width: 24, height: 3, rx: 2, fill: w, transform: "rotate(-20 70 47)" })]; }
  else if (key === "cumulonimbus") { els = [rk(18, 10, 76, 12, g), rk(30, 22, 46, 14), rk(34, 34, 40, 14), rk(38, 46, 32, 14), rk(42, 58, 22, 12)]; }
  else { els = [rk(16, 36, 18, 14, g), rk(36, 34, 20, 16, g), rk(58, 36, 18, 14, g), rk(76, 38, 14, 12, g), rk(14, 50, 80, 6, g)]; }
  return h("svg", { width: 150, height: 78, viewBox: "0 0 110 72", style: { display: "block", margin: "0 auto" } }, els);
}
function GameCloud(props) {
  function makeQ() {
    var c = CLOUDS[Math.floor(Math.random() * CLOUDS.length)];
    if (Math.random() < 0.5) return { cloud: c, showName: false, prompt: "What cloud is this?", opts: shuffle(quizOptButtonsFill([c.name], CLOUD_NAMES)), ans: c.name };
    return { cloud: c, showName: true, prompt: "What does it tell you?", opts: shuffle(quizOptButtonsFill([c.mean], CLOUD_MEANS)), ans: c.mean };
  }
  function stage(q, flash, accent) {
    return h("div", { style: { background: flash === "ok" ? "#0e2a1c" : (flash === "no" ? "#2e1212" : "linear-gradient(180deg,#0d2236,#0a1622)"), border: "2px solid #2a3a4d", borderRadius: 10, padding: "16px 10px 12px" } },
      cloudSVG(q.cloud.key),
      q.showName ? h("div", { style: { textAlign: "center", fontFamily: PIX, fontSize: 12, fontWeight: 800, color: accent, letterSpacing: 1, marginTop: 8 } }, q.cloud.name) : null);
  }
  return h(ArcadeQuiz, { id: "cloud", title: "Cloud Spotter", accent: props.accent, glyph: props.glyph, fact: props.fact, onEarn: props.onEarn, xpLeft: props.xpLeft, onExit: props.onExit, div: 0.55, startTime: 8, minTime: 4, control: "TAP the answer", how: "Read the sky. Identify the cloud type from its shape \u2014 or tap what it means for your flight. Towering cumulonimbus means thunderstorms; wispy cirrus rides high and dry.", makeQ: makeQ, stage: stage });
}

/* ---------------------------------------------------------------- Game 13: Crosswind Lander */
function GameCrosswind(props) {
  var H = 300;
  var stRef = useRef({ pos: 0, wind: 0.18, windAbs: 0.18, gust: 0, prog: 0, level: 0, score: 0 });
  var phaseS = useState("ready"); var phase = phaseS[0], setPhase = phaseS[1];
  var livesS = useState(3); var lives = livesS[0], setLives = livesS[1];
  var msgS = useState(""); var msg = msgS[0], setMsg = msgS[1];
  var bestS = useState(function () { return arcadeBest("crosswind"); }); var best = bestS[0], setBest = bestS[1];
  var finalS = useState(0); var finalScore = finalS[0], setFinalScore = finalS[1];
  var inputRef = useRef(0); var prevBestRef = useRef(0);
  var tickS = useState(0); var setTick = tickS[1];
  var earn = useArcadeEarn(phase === "over", finalScore, 8, props.onEarn, props.xpLeft);

  function newApproach(lvl) { var w = 0.16 + lvl * 0.045; if (w > 0.6) w = 0.6; var st = stRef.current; st.windAbs = w; st.wind = (Math.random() < 0.5 ? -1 : 1) * w; st.gust = 0; st.prog = 0; st.pos = 0; }
  function start() { prevBestRef.current = best; stRef.current = { pos: 0, wind: 0.18, windAbs: 0.18, gust: 0, prog: 0, level: 0, score: 0 }; newApproach(0); setFinalScore(0); setLives(3); setMsg("Hold the centerline"); setPhase("play"); }
  useEffect(function () { if (phase === "play" && lives <= 0) { setFinalScore(Math.round(stRef.current.score)); setPhase("over"); } }, [lives, phase]);
  useEffect(function () { if (phase === "over") setBest(arcadeSetBest("crosswind", Math.round(stRef.current.score))); }, [phase]);

  useRaf(function (dt) {
    var st = stRef.current;
    st.gust = st.gust + (Math.random() - 0.5) * dt * 0.6; if (st.gust > 0.14) st.gust = 0.14; if (st.gust < -0.14) st.gust = -0.14;
    var drift = st.wind + st.gust;
    st.pos = st.pos + drift * dt - inputRef.current * 0.95 * dt;
    if (Math.abs(st.pos) < 0.22) st.score = st.score + dt * 22;
    if (st.pos > 1.08 || st.pos < -1.08) { st.pos = st.pos > 0 ? 1.08 : -1.08; setLives(function (L) { return L - 1; }); setMsg("DRIFTED OFF!"); sfxPlay("wrong"); st.prog = 0; newApproach(st.level); }
    st.prog = st.prog + dt / 8.5;
    if (st.prog >= 1) {
      var a = Math.abs(st.pos);
      if (a < 0.32) { st.score = st.score + 60; setMsg("GREASER!  +60"); sfxPlay("land"); }
      else if (a < 0.66) { st.score = st.score + 25; setMsg("On the mains  +25"); sfxPlay("land"); }
      else { setLives(function (L) { return L - 1; }); setMsg("OFF CENTERLINE!"); sfxPlay("wrong"); }
      st.level = st.level + 1; newApproach(st.level);
    }
    setTick(function (n) { return (n + 1) % 1000000; });
  }, phase === "play");

  function press(dir) { inputRef.current = dir; }
  function release() { inputRef.current = 0; }
  var st = stRef.current;
  var planeLeftPct = 50 + st.pos * 30;
  var windDir = st.wind < 0 ? "\u25C0" : "\u25B6";
  var hud = phase === "play" ? hudBox("LEVEL", st.level + 1, "#6FE0A0") : null;
  var screen = phase === "ready" ?
    h(ArcadeStart, { title: "Crosswind Lander", accent: props.accent, glyph: props.glyph, control: "HOLD L / R", best: best, fact: props.fact, how: "Land in a crosswind. The wind keeps pushing you off the runway centerline \u2014 hold LEFT or RIGHT to crab back and stay lined up as you descend. Touch down on center for big points; each landing brings stronger wind.", onStart: start }) :
    h("div", { style: { position: "relative", height: H, overflow: "hidden" } },
      /* descent progress */
      h("div", { style: { position: "absolute", left: 8, right: 8, top: 6, height: 4, background: "#1a2533", borderRadius: 3, zIndex: 3 } }, h("div", { style: { height: 4, borderRadius: 3, width: (Math.min(1, st.prog) * 100) + "%", background: props.accent } })),
      /* wind readout */
      h("div", { style: { position: "absolute", left: 8, top: 16, fontFamily: PIX, fontSize: 11, color: "#FFC247", letterSpacing: 1, zIndex: 3 } }, "XWIND " + windDir + " " + Math.round(st.windAbs * 28) + " KT"),
      /* runway perspective */
      h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, top: 30, overflow: "hidden" } },
        h("div", { style: { position: "absolute", left: "50%", bottom: 0, width: 0, height: 0, marginLeft: -120, borderLeft: "120px solid transparent", borderRight: "120px solid transparent", borderBottom: (H - 30) + "px solid #16202c" } }),
        h("div", { style: { position: "absolute", left: "50%", bottom: 0, width: 2, marginLeft: -1, height: H - 30, background: "repeating-linear-gradient(0deg,#EAF2F0 0 14px, transparent 14px 30px)", opacity: 0.7 } })),
      /* plane */
      h("div", { style: { position: "absolute", left: planeLeftPct + "%", bottom: 36, transform: "translateX(-50%)", zIndex: 4 } }, h(PixPlane, { color: Math.abs(st.pos) < 0.32 ? props.accent : "#FFC247", size: 30, style: { transform: "rotate(" + (st.pos * -16) + "deg)" } })),
      msg ? h("div", { style: { position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: PIX, fontSize: 12, color: ARC_INK, letterSpacing: 1, zIndex: 4 } }, msg) : null,
      /* hold zones */
      h("div", { onPointerDown: function () { press(-1); }, onPointerUp: release, onPointerLeave: release, onPointerCancel: release, style: { position: "absolute", left: 0, bottom: 0, top: 30, width: "50%", zIndex: 5, touchAction: "none" } }),
      h("div", { onPointerDown: function () { press(1); }, onPointerUp: release, onPointerLeave: release, onPointerCancel: release, style: { position: "absolute", right: 0, bottom: 0, top: 30, width: "50%", zIndex: 5, touchAction: "none" } }),
      h("div", { style: { position: "absolute", left: 0, right: 0, bottom: 8, display: "flex", justifyContent: "space-between", padding: "0 14px", pointerEvents: "none", zIndex: 6 } },
        h("div", { style: { fontFamily: PIX, fontSize: 11, color: ARC_DIM, letterSpacing: 1 } }, "\u25C0 HOLD LEFT"),
        h("div", { style: { fontFamily: PIX, fontSize: 11, color: ARC_DIM, letterSpacing: 1 } }, "HOLD RIGHT \u25B6")));
  return h(ArcadeFrame, { title: "Crosswind Lander", accent: props.accent, score: phase === "ready" ? null : Math.round(phase === "over" ? finalScore : st.score), best: best, hud: hud, lives: phase === "ready" ? null : lives, onExit: props.onExit },
    screen,
    phase === "over" ? h(ArcadeOver, { title: "OUT OF TRIES", score: finalScore, best: best, isBest: finalScore > prevBestRef.current && finalScore > 0, coins: earn.t, xpGain: earn.xp, fact: randFact(), accent: props.accent, onReplay: start, onExit: props.onExit }) : null);
}

var ARCADE_GAMES = [
  { id: "approach", name: "Final Approach", tag: "Grease the landing", comp: GameApproach, accent: "#3CE07A", glyph: "wing", cat: "REFLEX", diff: 2 },
  { id: "taxi", name: "Taxi Runner", tag: "Dodge the ramp", comp: GameTaxi, accent: "#34d3e0", glyph: "runway", cat: "REFLEX", diff: 2 },
  { id: "pattern", name: "Pattern Pilot", tag: "Fly the pattern", comp: GamePattern, accent: "#FF5DA2", glyph: "pattern", cat: "REFLEX", diff: 2 },
  { id: "altitude", name: "Altitude Hold", tag: "Hold your altitude", comp: GameAltitude, accent: "#7CC4FF", glyph: "compass", cat: "REFLEX", diff: 3 },
  { id: "crosswind", name: "Crosswind Lander", tag: "Hold the centerline", comp: GameCrosswind, accent: "#6FE0A0", glyph: "wind", cat: "REFLEX", diff: 3 },
  { id: "signs", name: "Sign Sweep", tag: "Read signs fast", comp: GameSigns, accent: "#FFC247", glyph: "sign", cat: "KNOWLEDGE", diff: 1 },
  { id: "phonetic", name: "Phonetic Flash", tag: "Spell it on the radio", comp: GamePhonetic, accent: "#5BE0C4", glyph: "radio", cat: "KNOWLEDGE", diff: 1 },
  { id: "match", name: "Mayday Match", tag: "Match the lingo", comp: GameMatch, accent: "#C9A6FF", glyph: "library", cat: "KNOWLEDGE", diff: 1 },
  { id: "signals", name: "Tower Signals", tag: "Read the light gun", comp: GameSignals, accent: "#FFB454", glyph: "light", cat: "KNOWLEDGE", diff: 2 },
  { id: "cloud", name: "Cloud Spotter", tag: "Identify the clouds", comp: GameCloud, accent: "#9FC0FF", glyph: "cloud", cat: "KNOWLEDGE", diff: 2 },
  { id: "airspace", name: "Airspace Ace", tag: "Name the airspace", comp: GameAirspace, accent: "#8FA4FF", glyph: "airspace", cat: "KNOWLEDGE", diff: 2 },
  { id: "gauge", name: "Gauge Reader", tag: "Read the instruments", comp: GameGauge, accent: "#FF8FA3", glyph: "clock", cat: "KNOWLEDGE", diff: 3 },
  { id: "metar", name: "METAR Blitz", tag: "Decode the weather", comp: GameMetar, accent: "#FFA24C", glyph: "bolt", cat: "KNOWLEDGE", diff: 3 }
];
function ArcadeScreen(props) {
  var t = useT();
  var arc = props.arcade || {};
  var viewS = useState("hub"); var view = viewS[0], setView = viewS[1];
  var factS = useState(randFact); var fact = factS[0], setFact = factS[1];
  function exit() { setFact(randFact()); setView("hub"); }

  var coins = arc.coins ? arc.coins : 0;
  var cap = arc.cap ? arc.cap : 120;
  var xpLeft = arc.xpLeft == null ? cap : arc.xpLeft;
  var xpUsed = cap - xpLeft; if (xpUsed < 0) xpUsed = 0;
  var ti = arcadeTierInfo(coins);
  var tierProg = ti.nxt ? Math.max(0, Math.min(1, (coins - ti.cur.min) / (ti.nxt.min - ti.cur.min))) : 1;
  var nextTxt = ti.nxt ? ((ti.nxt.min - coins) + " more to " + ti.nxt.name) : "Top rank reached!";

  /* ----- TICKETS & XP rewards detail ----- */
  if (view === "rewards") {
    function infoCard(num, title, body, color) {
      return h("div", { style: { background: ARC_CARD, border: "1px solid " + ARC_LINE, borderLeft: "3px solid " + color, borderRadius: 12, padding: "14px 14px", marginBottom: 12 } },
        h("div", { style: { fontFamily: PIX, fontSize: 10, letterSpacing: 1.5, fontWeight: 800, color: color, marginBottom: 6 } }, num + " \u00b7 " + title),
        h("div", { style: { fontFamily: SANS, fontSize: 13, color: "#c7d4e0", lineHeight: 1.55 } }, body));
    }
    return h("div", null,
      h(SubHeader, { title: "Tickets & XP", onBack: function () { setView("hub"); } }),
      h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 16px", lineHeight: 1.55 } }, "Every game pays out when it ends. Here is exactly how the rewards work \u2014 and what they are for."),
      infoCard("1", "EARN TICKETS", "Finish any game to bank tickets. The higher your score the more you earn, and tougher games pay more per point. Tickets never expire and there is no cap on how many you can collect.", t.amber),
      h("div", { style: { background: ARC_CARD, border: "1px solid " + ARC_LINE, borderLeft: "3px solid #5fd0d8", borderRadius: 12, padding: "14px 14px", marginBottom: 12 } },
        h("div", { style: { fontFamily: PIX, fontSize: 10, letterSpacing: 1.5, fontWeight: 800, color: "#5fd0d8", marginBottom: 6 } }, "2 \u00b7 TURN TICKETS INTO XP"),
        h("div", { style: { fontFamily: SANS, fontSize: 13, color: "#c7d4e0", lineHeight: 1.55, marginBottom: 12 } }, "Each ticket automatically adds +1 XP toward your Flight Level. So real studying always stays in front, the arcade can boost you up to " + cap + " XP per day."),
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 } },
          h("div", { style: { fontFamily: PIX, fontSize: 10, color: ARC_DIM, letterSpacing: 1 } }, "TODAY'S ARCADE XP"),
          h("div", { style: { fontFamily: PIX, fontSize: 13, fontWeight: 800, color: "#5fd0d8" } }, xpUsed + " / " + cap)),
        h(Bar, { pct: cap > 0 ? (xpUsed / cap) * 100 : 0, color: "#5fd0d8", h: 7 }),
        h("div", { style: { fontFamily: SANS, fontSize: 11.5, color: ARC_DIM, marginTop: 7 } }, (xpLeft > 0 ? (xpLeft + " XP still available today. ") : "Daily arcade XP is maxed. ") + "The cap resets every day at midnight \u2014 your tickets stay.")),
      h("div", { style: { background: ARC_CARD, border: "1px solid " + ARC_LINE, borderLeft: "3px solid " + ti.cur.color, borderRadius: 12, padding: "14px 14px", marginBottom: 12 } },
        h("div", { style: { fontFamily: PIX, fontSize: 10, letterSpacing: 1.5, fontWeight: 800, color: ti.cur.color, marginBottom: 8 } }, "3 \u00b7 CLIMB THE ARCADE RANKS"),
        h("div", { style: { fontFamily: SANS, fontSize: 13, color: "#c7d4e0", lineHeight: 1.55, marginBottom: 12 } }, "Your lifetime tickets earn arcade ranks \u2014 a badge of how much you have played."),
        ARCADE_TIERS.map(function (tier, i) {
          var reached = coins >= tier.min;
          var isCur = tier.name === ti.cur.name;
          return h("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 9px", borderRadius: 8, marginBottom: 5, background: isCur ? tier.color + "1A" : "transparent", border: "1px solid " + (isCur ? tier.color : "transparent") } },
            h("div", { style: { width: 11, height: 11, borderRadius: 99, background: reached ? tier.color : "#2a3a4d", flexShrink: 0 } }),
            h("div", { style: { flex: 1, fontFamily: PIX, fontSize: 12, fontWeight: 800, color: reached ? ARC_INK : ARC_DIM } }, tier.name),
            h("div", { style: { fontFamily: PIX, fontSize: 10.5, color: reached ? tier.color : ARC_DIM } }, tier.min === 0 ? "start" : (tier.min + "+")),
            isCur ? h("div", { style: { fontFamily: PIX, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, color: tier.color } }, "YOU") : null);
        }),
        h("div", { style: { marginTop: 8 } }, h(Bar, { pct: tierProg * 100, color: ti.cur.color, h: 7 })),
        h("div", { style: { fontFamily: SANS, fontSize: 11.5, color: ARC_DIM, marginTop: 7 } }, ti.nxt ? ("You have " + coins + " lifetime tickets \u2014 " + nextTxt + ".") : ("You have " + coins + " lifetime tickets. Top rank reached \u2014 nice flying!"))),
      infoCard("4", "WHAT XP IS FOR", "XP raises your Flight Level. Each new level promotes your pilot rank and can unlock a new aircraft in your Hangar \u2014 so every arcade win feeds your real training progress.", t.sky),
      h("div", { style: { fontFamily: SANS, fontSize: 11.5, color: t.textFaint, marginTop: 4, lineHeight: 1.5 } }, "The arcade is a study break, just for fun. The daily XP cap keeps real studying in the lead. Play on the ground, never in the cockpit."));
  }

  if (view !== "hub") {
    var g = null;
    for (var i = 0; i < ARCADE_GAMES.length; i++) { if (ARCADE_GAMES[i].id === view) g = ARCADE_GAMES[i]; }
    if (g) return h("div", null, h(g.comp, { onExit: exit, accent: g.accent, fact: fact, glyph: g.glyph, onEarn: arc.onEarn, xpLeft: arc.xpLeft }));
  }

  function gameCard(g) {
    var bestv = arcadeBest(g.id);
    function open() { setFact(randFact()); setView(g.id); }
    var dots = []; for (var i = 0; i < 3; i++) dots.push(h("div", { key: i, style: { width: 5, height: 5, borderRadius: 99, background: i < g.diff ? g.accent : "#2a3a4d" } }));
    return h("button", { key: g.id, onClick: open, style: { display: "block", width: "100%", textAlign: "left", background: ARC_CARD, border: "1px solid " + ARC_LINE, borderLeft: "3px solid " + g.accent, borderRadius: 12, padding: "13px 14px", marginBottom: 10, cursor: "pointer" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { width: 44, height: 44, borderRadius: 11, background: g.accent + "1f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: g.glyph, size: 24, color: g.accent })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontFamily: PIX, fontWeight: 800, fontSize: 13.5, letterSpacing: 0.5, color: ARC_INK } }, g.name),
          h("div", { style: { fontFamily: SANS, fontSize: 12, color: ARC_DIM, marginTop: 2 } }, g.tag),
          h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 7 } },
            h("div", { style: { display: "flex", gap: 3 } }, dots),
            h("div", { style: { fontFamily: PIX, fontSize: 9, color: ARC_DIM, letterSpacing: 0.5 } }, g.diff === 1 ? "EASY" : (g.diff === 2 ? "MEDIUM" : "HARD")))),
        h("div", { style: { textAlign: "right", flexShrink: 0 } },
          h("div", { style: { fontFamily: PIX, fontSize: 8, color: ARC_DIM, letterSpacing: 1 } }, "BEST"),
          h("div", { style: { fontFamily: PIX, fontSize: 17, fontWeight: 800, color: g.accent, lineHeight: 1.1 } }, bestv),
          h("div", { style: { fontFamily: PIX, fontSize: 9, color: g.accent, marginTop: 5, letterSpacing: 1, fontWeight: 800 } }, "PLAY \u25B6"))));
  }
  function arcSection(label, count) { return h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "6px 2px 10px" } }, h("div", { style: { fontFamily: PIX, fontSize: 10, letterSpacing: 2, color: ARC_DIM, fontWeight: 800 } }, label), h("div", { style: { fontFamily: PIX, fontSize: 9, color: ARC_DIM, letterSpacing: 1 } }, count + " GAMES")); }
  var reflex = ARCADE_GAMES.filter(function (g) { return g.cat === "REFLEX"; });
  var knowledge = ARCADE_GAMES.filter(function (g) { return g.cat === "KNOWLEDGE"; });

  return h("div", null,
    h(SubHeader, { title: "Aviation Arcade", onBack: props.onBack }),
    h("div", { style: { background: "linear-gradient(135deg,#0c1726,#0a0f18)", border: "1px solid " + ARC_LINE, borderRadius: 14, padding: "18px 16px", marginBottom: 12 } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 6 } },
        h("div", { style: { display: "flex", gap: 3 } },
          h("div", { style: { width: 9, height: 9, borderRadius: 2, background: "#3CE07A" } }),
          h("div", { style: { width: 9, height: 9, borderRadius: 2, background: "#FFC247" } }),
          h("div", { style: { width: 9, height: 9, borderRadius: 2, background: "#FF5DA2" } })),
        h("div", { style: { fontFamily: PIX, fontSize: 19, fontWeight: 800, letterSpacing: 2, color: ARC_INK } }, "AVIATION ARCADE"), h("div", { style: { flex: 1 } }), h(SfxButton, { accent: "#5fd0d8" })),
      h("div", { style: { fontFamily: SANS, fontSize: 13, color: "#9fb1c2", lineHeight: 1.55 } }, "Thirteen 8-bit games packed with real aviation knowledge. Beat your high scores and bank tickets between study sessions.")),
    h("div", { style: { display: "flex", gap: 10, marginBottom: 10 } },
      h("div", { style: { flex: 1, background: "#15110a", border: "1px solid " + ARC_COIN, borderRadius: 11, padding: "11px 12px", display: "flex", alignItems: "center", gap: 9 } },
        h(PixCoin, { size: 22 }),
        h("div", null,
          h("div", { style: { fontFamily: PIX, fontSize: 9, color: "#caa84a", letterSpacing: 1 } }, "TICKETS"),
          h("div", { style: { fontFamily: PIX, fontSize: 18, fontWeight: 800, color: ARC_COIN } }, coins))),
      h("div", { style: { flex: 1, background: "#0c1622", border: "1px solid #2a4d4f", borderRadius: 11, padding: "11px 12px" } },
        h("div", { style: { fontFamily: PIX, fontSize: 9, color: "#7fb0b4", letterSpacing: 1 } }, "ARCADE XP TODAY"),
        h("div", { style: { fontFamily: PIX, fontSize: 18, fontWeight: 800, color: "#5fd0d8", marginTop: 1 } }, xpUsed + " / " + cap),
        h("div", { style: { fontFamily: PIX, fontSize: 8.5, color: ARC_DIM, marginTop: 2, letterSpacing: 0.5 } }, xpLeft > 0 ? (xpLeft + " more today") : "maxed \u2014 resets daily"))),
    h("div", { style: { background: ARC_CARD, border: "1px solid " + ARC_LINE, borderRadius: 11, padding: "11px 12px", marginBottom: 10 } },
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 } },
        h("div", { style: { display: "inline-flex", alignItems: "center", gap: 7 } }, h("div", { style: { width: 10, height: 10, borderRadius: 99, background: ti.cur.color } }), h("div", { style: { fontFamily: PIX, fontSize: 11, fontWeight: 800, letterSpacing: 1, color: ARC_INK } }, "RANK: " + ti.cur.name.toUpperCase())),
        h("div", { style: { fontFamily: PIX, fontSize: 9.5, color: ARC_DIM, letterSpacing: 0.5 } }, nextTxt)),
      h(Bar, { pct: tierProg * 100, color: ti.cur.color, h: 6 })),
    h("button", { onClick: function () { setView("rewards"); }, style: { display: "flex", width: "100%", alignItems: "center", gap: 9, background: ARC_CARD, border: "1px solid " + ARC_LINE, borderRadius: 10, padding: "11px 12px", marginBottom: 18, cursor: "pointer", textAlign: "left" } },
      h(Glyph, { name: "bolt", size: 16, color: ARC_COIN }),
      h("div", { style: { flex: 1, fontFamily: SANS, fontSize: 11.5, color: "#9fb1c2", lineHeight: 1.4 } }, "Games pay tickets, and tickets boost your study XP. ", h("span", { style: { color: ARC_COIN, fontWeight: 700 } }, "See how it all works \u203a")),
      h(Glyph, { name: "more", size: 16, color: ARC_DIM })),
    arcSection("\u25C9 REFLEX GAMES", reflex.length),
    reflex.map(gameCard),
    arcSection("\u25C9 KNOWLEDGE GAMES", knowledge.length),
    knowledge.map(gameCard),
    h("div", { style: { fontFamily: SANS, fontSize: 11.5, color: t.textFaint, marginTop: 10, lineHeight: 1.5 } }, "Just for fun \u2014 a study break. Tickets are uncapped, but the daily arcade-XP limit keeps real studying in the lead. Play on the ground, never in the cockpit."));
}

function LibraryScreen(props) {
  var t = useT();
  var viewState = useState("hub");
  var view = viewState[0], setView = viewState[1];
  function back() { setView("hub"); }

  if (view === "glossary") return h(GlossaryScreen, { onBack: back });
  if (view === "resources") return h(ResourceLibrary, { onBack: back });
  if (view === "arcade") return h(ArcadeScreen, { onBack: back, arcade: props.arcade });
  if (view === "weather") return h(WeatherScreen, { onBack: back });
  if (view === "navigation") return h(NavScreen, { onBack: back });
  if (view === "airportops") return h(AirportOpsScreen, { onBack: back });
  if (view === "signs") return h(SignsScreen, { onBack: back });
  if (view === "flashcards") return h(FlashcardsScreen, { state: props.state, onBack: back });
  if (view === "airports") return h(AirportDirectoryScreen, { onBack: back });
  if (view === "aircraft") return h(AircraftScreen, { onBack: back });
  if (view === "history") return h(HistoryScreen, { onBack: back });
  if (view === "credentials") return h(CredentialsView, { onBack: back });
  if (view === "career") return h(CareerView, { state: props.state, onBack: back, onChoose: props.onChoosePathway, onBegin: props.onBeginPathway });

  function card(id, title, desc, glyph, color) {
    function open() { setView(id); }
    return h("div", { key: id, onClick: open, style: { display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", marginBottom: 10, background: t.panel, border: "1px solid " + t.line, borderRadius: 16, cursor: "pointer" } },
      h("div", { style: { width: 44, height: 44, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: glyph, size: 22, color: color })),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, title),
        h("div", { style: { fontSize: 12.5, color: t.textDim } }, desc)),
      h(Glyph, { name: "more", size: 18, color: t.textDim }));
  }

  return h("div", null,
    h("h1", { style: { fontSize: 24, fontWeight: 900, color: t.text, margin: "0 0 4px" } }, "Library"),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 18px" } }, "Your reference desk: a searchable glossary, the FAA source library, and every study reference in one place."),
    h(SectionLabel, { style: { marginBottom: 10 } }, "Reference"),
    card("glossary", "Glossary of terms", GLOSSARY.length + " aviation terms & acronyms, each in plain English", "library", t.sky),
    card("resources", "AvHype Resources", "Official, free FAA publications, regulations, and tools", "checklist", t.green),
    card("arcade", "Aviation Arcade", "Thirteen 8-bit games \u2014 earn tickets that boost your XP", "wing", t.magenta),
    h(SectionLabel, { style: { margin: "18px 0 10px" } }, "Study references"),
    card("weather", "Weather", "METAR/TAF, clouds, hazards, and fronts", "cloud", t.sky),
    card("navigation", "Navigation", "Charts, compass, VOR, GPS, and planning", "compass", t.magenta),
    card("airportops", "Airport operations", "Markings, lighting, patterns, comms, and airspace", "tower", t.green),
    card("signs", "Airport signs & markings", "Decode every taxiway & runway sign in full color", "sign", t.amber),
    card("flashcards", "Flashcards", "Quick-fire facts, filterable by certificate", "learn", t.magenta),
    card("airports", "Airport directory", "Quick facts on hubs and iconic airports", "pin", t.amber),
    card("aircraft", "Aircraft", "Notable, historical, and popular aircraft", "wing", t.sky),
    card("history", "Aviation history", "A timeline from balloons to eVTOL", "clock", t.magenta),
    card("credentials", "Certificates & ratings", "Searchable reference of every credential", "library", t.green),
    card("career", "Career paths", "Roadmaps to the flight deck \u2014 pin one to your home screen", "wing", t.amber));
}

/* ============================================================================
   PART 7 — SAFETY CENTER, MORE HUB + SUB-VIEWS, APP ROOT, MOUNT
   ========================================================================== */

function cloneState(s) { return JSON.parse(JSON.stringify(s)); }

/* generic interactive checklist; vals is { id: bool } meaning "addressed/clear" */
function Checklist(props) {
  var t = useT();
  var items = props.items;
  var vals = props.vals;
  var accent = props.accent;
  var addressed = 0;
  items.forEach(function (it) { if (vals[it.id]) addressed += 1; });
  var allClear = addressed === items.length;
  return h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 16 } },
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 } },
      h("div", null,
        h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, props.title),
        h("div", { style: { fontSize: 12, color: t.textDim } }, props.subtitle)),
      h("div", { style: { fontFamily: MONO, fontSize: 13, fontWeight: 800, color: allClear ? t.green : accent } }, addressed + "/" + items.length)),
    items.map(function (it) {
      var on = !!vals[it.id];
      function toggle() { props.onToggle(it.id); }
      return h("label", { key: it.id, onClick: toggle, style: { display: "flex", gap: 11, alignItems: "flex-start", padding: "9px 4px", cursor: "pointer", borderTop: "1px solid " + t.lineSoft } },
        h("div", { style: { width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1, border: "2px solid " + (on ? t.green : t.line), background: on ? t.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center" } },
          on ? h(Glyph, { name: "check", size: 13, color: "#fff" }) : null),
        h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.4 } }, it.label));
    }),
    h("div", { style: { marginTop: 10, padding: "9px 12px", borderRadius: 10, background: allClear ? (t.name === "dark" ? "rgba(47,182,122,0.10)" : "rgba(30,142,95,0.08)") : (t.name === "dark" ? "rgba(242,183,5,0.08)" : "rgba(201,138,0,0.08)"), border: "1px solid " + (allClear ? t.green : t.amber), fontSize: 12.5, fontWeight: 700, color: allClear ? t.green : t.amber } },
      allClear ? "All items addressed — proceed with normal judgment." : "Resolve flagged items and reassess before flight."));
}

function SafetyScreen(props) {
  var t = useT();
  var state = props.state;
  var imsafeS = useState({});
  var imsafe = imsafeS[0], setImsafe = imsafeS[1];
  var paveS = useState({});
  var pave = paveS[0], setPave = paveS[1];
  var fivepS = useState({});
  var fivep = fivepS[0], setFivep = fivepS[1];

  var pm = (state && state.personalMins) ? state.personalMins : {};
  function pmField(k) { return pm[k] === undefined || pm[k] === null ? "" : pm[k]; }
  function setPm(k, v) {
    var next = {};
    for (var key in pm) if (Object.prototype.hasOwnProperty.call(pm, key)) next[key] = pm[key];
    next[k] = v === "" ? "" : parseFloat(v);
    props.onSavePersonalMins(next);
  }

  /* weather go/no-go local inputs */
  var wxS = useState({ ceil: "", vis: "", wind: "", gust: "", xw: "" });
  var wx = wxS[0], setWx = wxS[1];
  function setWxField(k, v) {
    var n = {}; for (var key in wx) if (Object.prototype.hasOwnProperty.call(wx, key)) n[key] = wx[key];
    n[k] = v; setWx(n);
  }

  function toggle(setter, obj, id) {
    var n = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) n[k] = obj[k];
    n[id] = !n[id]; setter(n);
  }

  /* evaluate weather vs personal minimums */
  var flags = [];
  function numOr(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }
  var ceil = numOr(wx.ceil), vis = numOr(wx.vis), wind = numOr(wx.wind), gust = numOr(wx.gust), xw = numOr(wx.xw);
  var minCeil = numOr(pm.minCeil), minVis = numOr(pm.minVis), maxWind = numOr(pm.maxWind), maxGust = numOr(pm.maxGust), maxXw = numOr(pm.maxXwind);
  if (ceil !== null && minCeil !== null && ceil < minCeil) flags.push("Ceiling " + ceil + " ft below your " + minCeil + " ft minimum");
  if (vis !== null && minVis !== null && vis < minVis) flags.push("Visibility " + vis + " sm below your " + minVis + " sm minimum");
  if (wind !== null && maxWind !== null && wind > maxWind) flags.push("Wind " + wind + " kt above your " + maxWind + " kt limit");
  if (gust !== null && maxGust !== null && gust > maxGust) flags.push("Gusts " + gust + " kt above your " + maxGust + " kt limit");
  if (xw !== null && maxXw !== null && xw > maxXw) flags.push("Crosswind " + xw + " kt above your " + maxXw + " kt limit");
  var anyInput = ceil !== null || vis !== null || wind !== null || gust !== null || xw !== null;
  var anyMins = minCeil !== null || minVis !== null || maxWind !== null || maxGust !== null || maxXw !== null;
  var verdict, vColor;
  if (!anyInput) { verdict = "Enter conditions to compare"; vColor = t.textFaint; }
  else if (flags.length === 0) { verdict = "GO — within your minimums"; vColor = t.green; }
  else if (flags.length === 1) { verdict = "RECONSIDER — one limit exceeded"; vColor = t.amber; }
  else { verdict = "NO-GO — multiple limits exceeded"; vColor = t.red; }

  var pmInputs = [
    { k: "minCeil", label: "Min ceiling (ft)", ph: "3000" },
    { k: "minVis", label: "Min visibility (sm)", ph: "5" },
    { k: "maxWind", label: "Max wind (kt)", ph: "20" },
    { k: "maxGust", label: "Max gust (kt)", ph: "25" },
    { k: "maxXwind", label: "Max crosswind (kt)", ph: "12" }
  ];
  var inputStyle = { width: "100%", boxSizing: "border-box", padding: "10px 11px", borderRadius: 10, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: MONO, fontSize: 14, outline: "none" };
  var wxInputs = [
    { k: "ceil", label: "Ceiling (ft)" }, { k: "vis", label: "Visibility (sm)" },
    { k: "wind", label: "Wind (kt)" }, { k: "gust", label: "Gust (kt)" }, { k: "xw", label: "Crosswind (kt)" }
  ];

  return h("div", null,
    h("h1", { style: { fontSize: 24, fontWeight: 900, color: t.text, margin: "0 0 4px" } }, "Safety Center"),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.5 } }, "Aeronautical decision-making tools. Use them before every flight — the smartest pilots cancel more often than they'd like to admit."),
    h("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", background: t.name === "dark" ? "rgba(242,183,5,0.07)" : "rgba(201,138,0,0.10)", border: "1px solid " + (t.name === "dark" ? "rgba(242,183,5,0.25)" : "rgba(201,138,0,0.3)"), borderRadius: 12, padding: "10px 12px", marginBottom: 18 } },
      h(Glyph, { name: "safety", size: 16, color: t.amber }),
      h("div", { style: { fontSize: 12, lineHeight: 1.5, color: t.textDim } }, "These checklists support your judgment; they do not make the decision. The pilot in command is the final authority for the safety of a flight (14 CFR 91.3).")),

    h(SectionLabel, { style: { color: t.sky } }, "Personal — IMSAFE"),
    h(Checklist, { title: "Am I fit to fly?", subtitle: "Check each item you can honestly clear", items: IMSAFE_ITEMS, vals: imsafe, accent: t.amber, onToggle: function (id) { toggle(setImsafe, imsafe, id); } }),

    h(SectionLabel, { style: { color: t.magenta } }, "Risk — PAVE"),
    h(Checklist, { title: "Is the whole flight acceptable?", subtitle: "Pilot · Aircraft · enVironment · External", items: PAVE_ITEMS, vals: pave, accent: t.amber, onToggle: function (id) { toggle(setPave, pave, id); } }),

    h(SectionLabel, { style: { color: t.green } }, "In-flight — 5P"),
    h(Checklist, { title: "Recheck at each decision point", subtitle: "Plan · Plane · Pilot · Passengers · Programming", items: FIVEP_ITEMS, vals: fivep, accent: t.amber, onToggle: function (id) { toggle(setFivep, fivep, id); } }),

    /* personal minimums */
    h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 16 } },
      h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, "Personal minimums"),
      h("div", { style: { fontSize: 12, color: t.textDim, marginBottom: 12 } }, "Set limits when you're calm and on the ground. They're saved on this device."),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 } },
        pmInputs.map(function (f) {
          return h("div", { key: f.k, style: { flex: "1 1 140px" } },
            h("div", { style: { fontSize: 11, color: t.textFaint, marginBottom: 4, fontWeight: 600 } }, f.label),
            h("input", { type: "number", value: pmField(f.k), placeholder: f.ph, onChange: function (e) { setPm(f.k, e.target.value); }, style: inputStyle }));
        }))),

    /* weather go/no-go */
    h("div", { style: { background: t.panelHi, border: "1px solid " + t.line, borderRadius: 16, padding: 14, marginBottom: 16 } },
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 } },
        h("div", { style: { fontSize: 16, fontWeight: 900, color: t.text } }, "Weather go / no-go"),
        h(SourceLink, { url: EXTERNAL_LINKS.awc, small: true }, "Live wx")),
      h("div", { style: { fontSize: 12, color: t.textDim, marginBottom: 12 } }, anyMins ? "Compared against your personal minimums above." : "Set personal minimums above to get a comparison."),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 } },
        wxInputs.map(function (f) {
          return h("div", { key: f.k, style: { flex: "1 1 140px" } },
            h("div", { style: { fontSize: 11, color: t.textFaint, marginBottom: 4, fontWeight: 600 } }, f.label),
            h("input", { type: "number", value: wx[f.k], placeholder: "—", onChange: function (e) { setWxField(f.k, e.target.value); }, style: inputStyle }));
        })),
      h("div", { style: { padding: "12px 14px", borderRadius: 12, background: vColor === t.textFaint ? t.panel : (vColor + "1A"), border: "1.5px solid " + (vColor === t.textFaint ? t.line : vColor), textAlign: "center" } },
        h("div", { style: { fontFamily: MONO, fontSize: 16, fontWeight: 800, color: vColor, letterSpacing: 0.5 } }, verdict),
        flags.length ? h("div", { style: { marginTop: 8, textAlign: "left" } }, flags.map(function (f, i) {
          return h("div", { key: i, style: { fontSize: 12.5, color: t.text, lineHeight: 1.5 } }, "• " + f);
        })) : null)),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, lineHeight: 1.5 } }, "A \u201CGO\u201D here only means conditions meet the limits you typed. It is not a weather briefing, not a clearance, and not a substitute for current official sources and your own judgment."));
}

/* ----------------------------------------------------------- endorsements */
var ENDO_STATES = [
  { id: "", label: "Not started", color: "faint" },
  { id: "progress", label: "In progress", color: "amber" },
  { id: "signed", label: "Signed off", color: "green" }
];
function EndorsementsView(props) {
  var t = useT();
  var state = props.state;
  var endo = (state && state.endorsements) ? state.endorsements : {};
  function statusOf(id) { var e = endo[id]; return e && e.status ? e.status : ""; }
  function cycle(id) {
    var cur = statusOf(id);
    var i = 0;
    for (var k = 0; k < ENDO_STATES.length; k++) if (ENDO_STATES[k].id === cur) i = k;
    var nx = ENDO_STATES[(i + 1) % ENDO_STATES.length].id;
    props.onSet(id, nx);
  }
  function colFor(c) { return c === "green" ? t.green : c === "amber" ? t.amber : t.textFaint; }
  return h("div", null,
    h(SubHeader, { title: "Endorsements tracker", onBack: props.onBack }),
    h("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", background: t.name === "dark" ? "rgba(242,183,5,0.07)" : "rgba(201,138,0,0.10)", border: "1px solid " + (t.name === "dark" ? "rgba(242,183,5,0.25)" : "rgba(201,138,0,0.3)"), borderRadius: 12, padding: "10px 12px", marginBottom: 16 } },
      h(Glyph, { name: "safety", size: 16, color: t.amber }),
      h("div", { style: { fontSize: 12, lineHeight: 1.5, color: t.textDim } }, "This is a personal checklist only. An actual endorsement is a dated logbook entry made by an authorized flight or ground instructor — tapping here changes nothing in your real logbook.")),
    ENDORSEMENTS.map(function (e) {
      var st = statusOf(e.id);
      var meta = ENDO_STATES[0];
      for (var k = 0; k < ENDO_STATES.length; k++) if (ENDO_STATES[k].id === st) meta = ENDO_STATES[k];
      var col = colFor(meta.color);
      function tap() { cycle(e.id); }
      return h("div", { key: e.id, onClick: tap, style: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, cursor: "pointer" } },
        h("div", { style: { width: 12, height: 12, borderRadius: 99, marginTop: 4, flexShrink: 0, background: st ? col : "transparent", border: "2px solid " + col } }),
        h("div", { style: { flex: 1 } },
          h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, e.name),
          h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.4, marginTop: 2 } }, e.note)),
        h("div", { style: { fontFamily: MONO, fontSize: 11, fontWeight: 700, color: col, flexShrink: 0, textAlign: "right", minWidth: 74 } }, meta.label.toUpperCase()));
    }),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 8 } }, "Tap any item to cycle Not started \u2192 In progress \u2192 Signed off."));
}

/* ---------------------------------------------------- certificates/ratings */
function SubHeader(props) {
  var t = useT();
  return h("div", { style: { marginBottom: 14 } },
    props.onBack ? h("button", { onClick: props.onBack, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: t.textDim, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "2px 0 12px" } },
      h(Glyph, { name: "back", size: 18, color: t.textDim }), "Back") : null,
    h("h1", { style: { fontSize: 23, fontWeight: 900, color: t.text, margin: 0 } }, props.title));
}

function CredentialsView(props) {
  var t = useT();
  var qS = useState("");
  var q = qS[0], setQ = qS[1];
  var fS = useState("all");
  var filter = fS[0], setFilter = fS[1];
  var openS = useState("");
  var openId = openS[0], setOpenId = openS[1];
  var needle = normAnswer(q);

  var rows = [];
  CERTIFICATES.forEach(function (c) { rows.push({ id: "c-" + c.id, name: c.name, kind: c.kind, path: c.path, summary: c.summary, eligibility: c.eligibility, source: c.source }); });
  RATINGS.forEach(function (r) { rows.push({ id: "r-" + r.id, name: r.name, kind: r.kind, path: r.path, summary: r.summary, eligibility: "", source: r.source }); });
  INSTRUCTOR_RATINGS.forEach(function (r) { rows.push({ id: "i-" + r.id, name: r.name, kind: r.kind, path: "airplane", summary: r.summary, eligibility: "", source: "cfr61" }); });

  var shown = rows.filter(function (r) {
    var passF = filter === "all" || r.path === filter;
    var passN = needle === "" || normAnswer(r.name + " " + r.kind).indexOf(needle) > -1;
    return passF && passN;
  });
  function srcUrl(id) { for (var i = 0; i < LINK_ONLY.length; i++) if (LINK_ONLY[i].id === id) return LINK_ONLY[i].url; return EXTERNAL_LINKS.cfr61; }
  var chips = [{ id: "all", label: "All" }, { id: "airplane", label: "Airplane" }, { id: "helicopter", label: "Helicopter" }, { id: "drone", label: "Drone" }];

  return h("div", null,
    h(SubHeader, { title: "Certificates & ratings", onBack: props.onBack }),
    h(ComplianceBanner, { text: "Reference only \u2014 certificates and ratings are issued through authorized FAA processes, certificated instructors, and designated examiners.", margin: "0 0 12px 0" }),
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: "Search certificates and ratings…",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none", marginBottom: 12 } }),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } },
      chips.map(function (c) {
        var on = filter === c.id;
        return h("button", { key: c.id, onClick: function () { setFilter(c.id); }, style: { fontFamily: SANS, fontSize: 12.5, fontWeight: 600, padding: "7px 13px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text } }, c.label);
      })),
    shown.length === 0 ? h("div", { style: { color: t.textFaint, fontSize: 13 } }, "No matches.") :
      shown.map(function (r) {
        var isOpen = openId === r.id;
        function tap() { setOpenId(isOpen ? "" : r.id); }
        return h("div", { key: r.id, style: { marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, overflow: "hidden" } },
          h("div", { onClick: tap, style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer" } },
            h("div", { style: { flex: 1 } },
              h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, r.name),
              h("div", { style: { fontFamily: MONO, fontSize: 11, color: t.textFaint, marginTop: 1 } }, r.kind)),
            h("div", { style: { transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s ease", color: t.textDim } }, h(Glyph, { name: "more", size: 16, color: t.textDim }))),
          isOpen ? h("div", { style: { padding: "0 14px 14px" } },
            h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.55, marginBottom: r.eligibility ? 8 : 10 } }, r.summary),
            r.eligibility ? h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.5, marginBottom: 10 } }, h("span", { style: { fontWeight: 800, color: t.text } }, "Typical eligibility: "), r.eligibility) : null,
            h(SourceLink, { url: srcUrl(r.source), small: true }, "Official reference")) : null);
      }));
}

/* --------------------------------------------------------------- careers */
function CareerView(props) {
  var t = useT();
  var state = props.state;
  var allS = useState(false);
  var showAll = allS[0], setShowAll = allS[1];
  var selS = useState(null); var sel = selS[0], setSel = selS[1];
  var activeId = (state && state.activePathway) ? state.activePathway : null;
  var paths = (state && state.profile && state.profile.pathways) ? state.profile.pathways : [];
  var list = CAREER_PATHS.filter(function (c) { return showAll || paths.length === 0 || paths.indexOf(c.path) > -1; });
  return h("div", null,
    h(SubHeader, { title: "Career paths", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 8px", lineHeight: 1.5 } }, "Illustrative roadmaps, not guarantees. Every step still runs through real FAA certificates, hours, medicals, and checkrides."),
    h("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 12 } },
      h(Btn, { kind: "soft", small: true, onClick: function () { setShowAll(!showAll); } }, showAll ? "Show my pathways" : "Show all paths")),
    list.map(function (c) {
      var tint = tintColor(t, pathMeta(c.path).tint);
      return h("div", { key: c.id, onClick: function () { setSel(c); }, style: { marginBottom: 14, background: t.panel, border: "1px solid " + (c.id === activeId ? tint : t.line), borderRadius: 16, padding: 16, cursor: "pointer" } },
        h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } },
          h("div", { style: { width: 38, height: 38, borderRadius: 10, background: tint + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: pathMeta(c.path).glyph, size: 20, color: tint })),
          h("div", { style: { flex: 1, minWidth: 0, fontSize: 16.5, fontWeight: 900, color: t.text } }, c.name),
          (c.id === activeId
            ? h("div", { style: { display: "inline-flex", alignItems: "center", gap: 5, background: tint + "1F", border: "1px solid " + tint, borderRadius: 99, padding: "4px 9px", flexShrink: 0 } }, h(Glyph, { name: "check", size: 12, color: tint }), h("span", { style: { fontFamily: MONO, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, color: tint } }, "ON HOME"))
            : h("div", { style: { display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 } }, h("span", { style: { fontFamily: MONO, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, color: tint } }, "BEGIN"), h(Glyph, { name: "more", size: 16, color: t.textDim })))),
        c.steps.map(function (s, i) {
          return h("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 } },
            h("div", { style: { width: 22, height: 22, borderRadius: 99, flexShrink: 0, background: tint, color: "#fff", fontFamily: MONO, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" } }, i + 1),
            h("div", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.45, paddingTop: 1 } }, s));
        }),
        h("div", { style: { marginTop: 8, padding: "9px 12px", borderRadius: 10, background: t.panelHi, fontSize: 12, color: t.textDim, lineHeight: 1.5 } },
          h("span", { style: { fontWeight: 800, color: t.amber } }, "Requirements vary. "), c.note));
    }),
    sel ? (function () {
      var selActive = sel.id === activeId;
      var stint = tintColor(t, pathMeta(sel.path).tint);
      return h(Modal, { open: true, onClose: function () { setSel(null); }, title: selActive ? "Already on your home screen" : "Begin this learning pathway?" },
        h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } },
          h("div", { style: { width: 40, height: 40, borderRadius: 11, background: stint + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: pathMeta(sel.path).glyph, size: 22, color: stint })),
          h("div", { style: { fontSize: 17, fontWeight: 900, color: t.text, lineHeight: 1.2 } }, sel.name)),
        h("p", { style: { fontSize: 14, color: t.textDim, lineHeight: 1.55, margin: "0 0 18px" } }, selActive ? ("The Learning Pathway for " + sel.name + " is already pinned to the top of your home screen.") : ("Would you like to begin the Learning Pathway for " + sel.name + "? We will pin its card to the top of your home screen so it is always one tap away.")),
        selActive
          ? h("div", { style: { display: "flex", gap: 10 } }, h("div", { style: { flex: 1 } }, h(Btn, { kind: "danger", full: true, onClick: function () { if (props.onChoose) props.onChoose(null); setSel(null); } }, "Remove from home")), h("div", { style: { flex: 1 } }, h(Btn, { kind: "ghost", full: true, onClick: function () { setSel(null); } }, "Keep it")))
          : h("div", { style: { display: "flex", gap: 10 } }, h("div", { style: { flex: 1 } }, h(Btn, { kind: "go", full: true, onClick: function () { if (props.onBegin) { props.onBegin(sel.id); } else if (props.onChoose) { props.onChoose(sel.id); } setSel(null); } }, "Begin pathway")), h("div", { style: { flex: 1 } }, h(Btn, { kind: "ghost", full: true, onClick: function () { setSel(null); } }, "Not now"))));
    })() : null,
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 4, lineHeight: 1.5 } }, "Hiring minimums and operational requirements differ by employer, insurer, aircraft, and regulation, and they change over time."));
}

/* --------------------------------------------------------- profile/settings */
function StatTile(props) {
  var t = useT();
  return h("div", { style: { flex: "1 1 90px", background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "12px 10px", textAlign: "center" } },
    h("div", { style: { fontFamily: MONO, fontSize: 20, fontWeight: 800, color: props.color || t.text } }, props.value),
    h("div", { style: { fontSize: 10.5, color: t.textFaint, letterSpacing: 0.4, marginTop: 2 } }, props.label));
}

function HangarPanel(props) {
  var t = useT();
  var state = props.state;
  var li = levelInfo(state.xp);
  var curIdx = rankIndexForLevel(li.level);
  var cur = RANKS[curIdx];
  var nxt = nextRank(li.level);
  var curC = tintColor(t, cur.tint);
  var earnedCount = curIdx + 1;
  return h("div", { style: { marginBottom: 18 } },
    props.noHeading ? null : h(SectionLabel, null, "Your hangar"),
    /* featured current aircraft */
    h("div", { style: { display: "flex", alignItems: "center", gap: 14, background: t.panel, border: "1px solid " + curC + "66", borderRadius: 16, padding: 16, marginBottom: 12 } },
      h("div", { style: { width: 78, height: 60, borderRadius: 12, background: curC + "1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
        h(AircraftArt, { id: cur.id, size: 62, color: curC })),
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { fontSize: 10.5, fontFamily: MONO, letterSpacing: 1, color: t.textFaint, fontWeight: 700 } }, "CURRENT AIRCRAFT"),
        h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text, lineHeight: 1.15 } }, cur.name),
        h("div", { style: { fontSize: 12.5, color: t.textDim } }, cur.tag),
        nxt
          ? h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 5, fontFamily: MONO } }, "Next: " + nxt.name + " \u2014 Level " + nxt.level)
          : h("div", { style: { fontSize: 11.5, color: curC, marginTop: 5, fontWeight: 800 } }, "Top of the hangar \u2014 fully collected!"))),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginBottom: 10, fontFamily: MONO } }, earnedCount + " of " + RANKS.length + " aircraft collected"),
    /* full grid */
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
      RANKS.map(function (r, i) {
        var earned = li.level >= r.level;
        var rc = tintColor(t, r.tint);
        var isCur = i === curIdx;
        return h("div", { key: r.id, style: { flex: "1 1 28%", minWidth: 96, boxSizing: "border-box", background: isCur ? rc + "14" : t.panel, border: "1px solid " + (isCur ? rc : t.line), borderRadius: 13, padding: "11px 7px 9px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: earned ? 1 : 0.5 } },
          h("div", { style: { height: 32, display: "flex", alignItems: "center", justifyContent: "center" } },
            h(AircraftArt, { id: r.id, size: 46, color: earned ? rc : t.textFaint })),
          h("div", { style: { fontSize: 11.5, fontWeight: 800, color: earned ? t.text : t.textDim, textAlign: "center", lineHeight: 1.15 } }, r.name),
          h("div", { style: { fontSize: 9, fontFamily: MONO, color: earned ? t.textFaint : t.textDim, letterSpacing: 0.4, textAlign: "center" } }, earned ? ("LEVEL " + r.level) : ("UNLOCK \u00b7 LVL " + r.level)));
      })));
}

function HangarView(props) {
  var t = useT();
  return h("div", null,
    h(SubHeader, { title: "The Hangar", onBack: props.onBack }),
    h("p", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.55, margin: "0 0 16px" } },
      "Every Flight Level earns a new aircraft for your hangar. Keep studying to collect the whole fleet \u2014 from your first paper airplane all the way to Mach 2."),
    h(HangarPanel, { state: props.state, noHeading: true }),
    h(ComplianceBanner, { text: "Aircraft badges mark study progress only. They are not certificates, ratings, or any form of FAA authorization." }));
}

function ProfileView(props) {
  var t = useT();
  var state = props.state;
  var prof = state.profile;
  var nameS = useState(prof.name || "");
  var name = nameS[0], setName = nameS[1];
  var aboutS = useState(false);
  var about = aboutS[0], setAbout = aboutS[1];

  var li = levelInfo(state.xp);
  var doneCount = 0, mSum = 0, mN = 0, logHrs = 0;
  unitsForState(state).forEach(function (un) { un.lessons.forEach(function (id) { var p = progFor(state, id); if (p.done) { doneCount += 1; mSum += p.mastery; mN += 1; } }); });
  var avgM = mN ? Math.round(mSum / mN) : 0;
  (state.log || []).forEach(function (e) { var d = parseFloat(e.dur); if (!isNaN(d)) logHrs += d; });

  function saveName() { props.onPatch({ profileName: name.trim() }); }
  function toggleTheme() { props.onPatch({ theme: t.name === "dark" ? "light" : "dark" }); }
  function togglePathway(id) {
    var cur = prof.pathways.slice();
    var at = cur.indexOf(id);
    if (at > -1) { if (cur.length > 1) cur.splice(at, 1); } else cur.push(id);
    var primary = prof.primaryPathway;
    if (cur.indexOf(primary) < 0) primary = cur[0];
    props.onPatch({ pathways: cur, primaryPathway: primary });
  }
  function setPrimary(id) { props.onPatch({ primaryPathway: id }); }
  function chooseAge(id) { props.onPatch({ ageBand: id }); }
  function reset() {
    try { if (window.confirm("Reset all progress, XP, streak, logbook, and settings? This cannot be undone.")) props.onReset(); }
    catch (e) { props.onReset(); }
  }
  var inputStyle = { width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 11, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none" };

  return h("div", null,
    h(SubHeader, { title: "Profile & settings", onBack: props.onBack }),
    /* level summary */
    h("div", { style: { display: "flex", alignItems: "center", gap: 14, background: t.panel, border: "1px solid " + t.line, borderRadius: 18, padding: 16, marginBottom: 16 } },
      h(AttitudeIndicator, { size: 64, pct: li.pct, idn: "profile" }),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontFamily: MONO, fontSize: 12, color: t.magenta, fontWeight: 700, letterSpacing: 1 } }, "FLIGHT LEVEL " + li.level),
        h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text } }, prof.name ? prof.name : "Aviator"),
        h("div", { style: { marginTop: 6 } }, h(Bar, { pct: li.pct, color: t.magenta })),
        h("div", { style: { fontSize: 11, color: t.textFaint, marginTop: 4, fontFamily: MONO } }, li.into + " / " + li.need + " XP to next level"))),
    /* stats */
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 } },
      h(StatTile, { value: state.xp, label: "TOTAL XP", color: t.sky }),
      h(StatTile, { value: state.streak, label: "DAY STREAK", color: t.amber }),
      h(StatTile, { value: state.longestStreak, label: "LONGEST", color: t.amber }),
      h(StatTile, { value: doneCount, label: "LESSONS", color: t.green }),
      h(StatTile, { value: avgM + "%", label: "MASTERY", color: t.green }),
      h(StatTile, { value: logHrs.toFixed(1), label: "LOG HRS", color: t.sky })),
    /* the hangar */
    h(HangarPanel, { state: state }),
    /* call sign */
    h(SectionLabel, null, "Call sign"),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 18 } },
      h("input", { value: name, onChange: function (e) { setName(e.target.value); }, placeholder: "Your name", style: inputStyle }),
      h(Btn, { kind: "soft", onClick: saveName }, "Save")),
    /* appearance */
    h(SectionLabel, null, "Appearance"),
    h("div", { onClick: toggleTheme, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", marginBottom: 18, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, cursor: "pointer" } },
      h("div", null,
        h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, t.name === "dark" ? "Avionics (dark)" : "Sectional (light)"),
        h("div", { style: { fontSize: 12, color: t.textDim } }, "Tap to switch theme")),
      h("div", { style: { width: 46, height: 26, borderRadius: 99, background: t.name === "dark" ? t.sky : t.line, position: "relative", transition: "background .2s" } },
        h("div", { style: { position: "absolute", top: 3, left: t.name === "dark" ? 23 : 3, width: 20, height: 20, borderRadius: 99, background: "#fff", transition: "left .2s" } }))),
    /* age & reading level */
    h(SectionLabel, null, "Age & reading level"),
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 6 } },
      AGE_BANDS.map(function (b) {
        var on = prof.ageBand === b.id;
        return h("button", { key: b.id, onClick: function () { chooseAge(b.id); },
          style: { fontFamily: MONO, fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text } }, b.label);
      })),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginBottom: 20 } }, "Scales the reading level, tone, and framing of lessons. The aviation facts and standards never change."),
    /* pathways */
    h(SectionLabel, null, "My pathways"),
    h("div", { style: { marginBottom: 8, display: "flex", flexDirection: "column", gap: 8 } },
      PATHWAYS.map(function (p) {
        var on = prof.pathways.indexOf(p.id) > -1;
        var isPrimary = prof.primaryPathway === p.id;
        var tint = tintColor(t, p.tint);
        return h("div", { key: p.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.panel, border: "1.5px solid " + (on ? tint : t.line), borderRadius: 13 } },
          h("div", { onClick: function () { togglePathway(p.id); }, style: { display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer" } },
            h(Glyph, { name: p.glyph, size: 22, color: on ? tint : t.textFaint }),
            h("div", { style: { fontSize: 14.5, fontWeight: 800, color: on ? t.text : t.textDim } }, p.label)),
          on ? (isPrimary
            ? h("div", { style: { fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: tint, letterSpacing: 0.5 } }, "PRIMARY")
            : h("button", { onClick: function () { setPrimary(p.id); }, style: { fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: t.textDim, background: "transparent", border: "1px solid " + t.line, borderRadius: 99, padding: "4px 10px", cursor: "pointer" } }, "Make primary")) : null,
          h("div", { onClick: function () { togglePathway(p.id); }, style: { width: 22, height: 22, borderRadius: 6, cursor: "pointer", border: "2px solid " + (on ? tint : t.line), background: on ? tint : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, on ? h(Glyph, { name: "check", size: 12, color: "#fff" }) : null));
      })),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginBottom: 20 } }, "Your primary pathway leads your roadmap on the Learn screen."),
    /* about + reset */
    h(SectionLabel, null, "About"),
    h("div", { onClick: function () { if (props.onOpenLegal) props.onOpenLegal(); }, style: { padding: "13px 14px", marginBottom: 10, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h("span", { style: { fontSize: 14.5, fontWeight: 700, color: t.text } }, "Terms, privacy & legal"),
      h(Glyph, { name: "more", size: 16, color: t.textDim })),
    h("div", { onClick: function () { setAbout(true); }, style: { padding: "13px 14px", marginBottom: 10, background: t.panel, border: "1px solid " + t.line, borderRadius: 13, cursor: "pointer", fontSize: 14.5, fontWeight: 700, color: t.text } }, "Disclaimer & compliance"),
    h(Btn, { kind: "danger", full: true, onClick: reset }, "Reset all data"),
    h("div", { style: { height: 10 } }),

    h(Modal, { open: about, onClose: function () { setAbout(false); }, title: "Disclaimer & compliance" },
      h("p", { style: { fontSize: 13.5, color: t.text, lineHeight: 1.6 } }, COMPLIANCE_TEXT),
      h("p", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.6 } }, BRAND + " hosts only public-domain U.S. government material and links to official sources. It is independent and not affiliated with, endorsed by, or representing the FAA, NTSB, TSA, or any commercial training provider mentioned. Quiz questions are original and are not drawn from any official FAA test bank."),
      h("p", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.6 } }, "Always verify regulations, procedures, and weather with current official sources, and train with an authorized, certificated instructor."),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 } },
        h(SourceLink, { url: EXTERNAL_LINKS.faaHandbooksIndex, small: true }, "FAA handbooks"),
        h(SourceLink, { url: EXTERNAL_LINKS.cfr61, small: true }, "14 CFR"),
        h(SourceLink, { url: EXTERNAL_LINKS.medical, small: true }, "Medical"))));
}

/* ===================== REFERENCE FINDER (free, local, no AI) ===============
   A deterministic search over the app's own authored, FAA-sourced content.
   It surfaces the official answer and the exact reference for any topic. There
   is no generation here — results are authored lesson content plus source
   links, so it cannot deviate or hallucinate. Fully client-side and free. */
function refSnippet(lesson) {
  if (lesson.explain && lesson.explain.length) return lesson.explain[0];
  return lesson.why ? lesson.why : "";
}
function searchLessons(query) {
  var q = String(query).toLowerCase().trim();
  if (!q) return [];
  var words = q.split(" ");
  var results = [];
  for (var id in LESSONS) {
    if (!Object.prototype.hasOwnProperty.call(LESSONS, id)) continue;
    var L = LESSONS[id];
    var title = (L.title ? L.title : "").toLowerCase();
    var termText = "";
    if (L.terms) for (var ti = 0; ti < L.terms.length; ti++) termText += " " + L.terms[ti][0] + " " + L.terms[ti][1];
    termText = termText.toLowerCase();
    var src = faaSourceById(L.faa);
    var body = title + " " + (L.why ? L.why : "") + " " + (L.oral ? L.oral : "") + " " + (L.acs ? L.acs : "") + " " + (L.cert ? L.cert : "");
    if (L.explain) for (var e = 0; e < L.explain.length; e++) body += " " + L.explain[e];
    body += " " + termText + " " + (src ? src.code + " " + src.title : "");
    body = body.toLowerCase();
    var score = 0;
    for (var w = 0; w < words.length; w++) {
      var word = words[w];
      if (!word) continue;
      if (title.indexOf(word) > -1) score += 5;
      if (termText.indexOf(word) > -1) score += 3;
      if (body.indexOf(word) > -1) score += 1;
    }
    if (score > 0) results.push({ id: id, score: score, lesson: L });
  }
  results.sort(function (a, b) { return b.score - a.score; });
  return results.slice(0, 12);
}

function ReferenceScreen(props) {
  var t = useT();
  var qState = useState(props.initialQuery ? props.initialQuery : "");
  var q = qState[0], setQ = qState[1];
  var inputRef = useRef(null);
  useEffect(function () { try { if (inputRef.current && inputRef.current.focus) inputRef.current.focus(); } catch (e) {} }, []);

  var results = searchLessons(q);
  var suggestions = ["Angle of attack", "Airspace classes", "Part 107 airspace", "Four forces", "Tail rotor", "Hovering", "Weight and balance", "METAR"];

  var sourceLinks = h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 } },
    [faaSourceById("phak"), faaSourceById("afh"), faaSourceById("hfh"), faaSourceById("aim"), faaSourceById("acs")].map(function (s, i) {
      if (!s) return null;
      return h(SourceLink, { key: i, url: s.url, small: true }, s.code);
    }));

  return h("div", null,
    h("button", { onClick: props.onBack, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: t.textDim, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "2px 0 14px" } },
      h(Glyph, { name: "back", size: 18, color: t.textDim }), "Back"),
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 6 } },
      h("div", { style: { width: 44, height: 44, borderRadius: 12, background: t.sky + "1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } },
        h(Glyph, { name: "search", size: 22, color: t.sky })),
      h("div", null,
        h("div", { style: { fontSize: 19, fontWeight: 900, color: t.text } }, "Look it up"),
        h("div", { style: { fontSize: 12, color: t.textDim } }, "Official answers, straight from the FAA references"))),
    h("div", { style: { fontSize: 12, color: t.textFaint, lineHeight: 1.5, marginBottom: 14 } }, "Every result is authored from FAA sources and links to the original. No AI and no guessing — just the reference and the answer."),
    /* search field */
    h("div", { style: { display: "flex", alignItems: "center", gap: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 12, padding: "4px 12px", marginBottom: 16 } },
      h(Glyph, { name: "search", size: 18, color: t.textFaint }),
      h("input", { ref: inputRef, value: q, onChange: function (ev) { setQ(ev.target.value); }, placeholder: "Search a topic, term, or question",
        style: { flex: 1, boxSizing: "border-box", padding: "9px 4px", border: "none", background: "transparent", color: t.text, fontFamily: SANS, fontSize: 15, outline: "none" } }),
      q ? h("button", { onClick: function () { setQ(""); }, style: { background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex" } }, h(Glyph, { name: "x", size: 16, color: t.textFaint })) : null),

    /* empty state: suggestions + official sources */
    q.trim() === "" ? h("div", null,
      h(SectionLabel, null, "Popular topics"),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 } },
        suggestions.map(function (sg, i) {
          return h("button", { key: i, onClick: function () { setQ(sg); }, style: { fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: t.text, background: t.panel, border: "1px solid " + t.line, borderRadius: 99, padding: "8px 12px", cursor: "pointer" } }, sg);
        })),
      h(SectionLabel, null, "Official FAA sources"),
      h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.5, marginBottom: 8 } }, "The handbooks and standards every answer is drawn from:"),
      sourceLinks) : null,

    /* results */
    q.trim() !== "" && results.length === 0 ? h("div", { style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "16px 14px" } },
      h("div", { style: { fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 4 } }, "No topic matches that yet"),
      h("div", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.5, marginBottom: 10 } }, "Try different words, or go straight to the official FAA sources:"),
      sourceLinks) : null,

    q.trim() !== "" && results.length > 0 ? h("div", null,
      h("div", { style: { fontSize: 12, color: t.textFaint, marginBottom: 10 } }, results.length + (results.length === 1 ? " match" : " matches")),
      results.map(function (r) {
        var L = r.lesson;
        var src = faaSourceById(L.faa);
        var tint = tintColor(t, pathMeta(L.pathway).tint);
        return h("div", { key: r.id, style: { background: t.panel, border: "1px solid " + t.line, borderRadius: 14, padding: "14px 15px", marginBottom: 12 } },
          h("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 } },
            h(Chip, { mono: true, color: tint }, pathMeta(L.pathway).label),
            src ? h(Chip, { mono: true }, src.code) : null),
          h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text, lineHeight: 1.25, marginBottom: 6 } }, L.title),
          h("p", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.55, margin: "0 0 10px" } }, refSnippet(L)),
          h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 } },
            src ? h(SourceLink, { url: src.url, small: true }, "Open " + src.code) : h("span", null),
            h(Btn, { kind: "soft", small: true, onClick: function () { props.onOpenLesson(r.id); } }, "Open lesson")),
          h("div", { style: { fontFamily: MONO, fontSize: 11, color: t.textFaint, marginTop: 8 } }, "ACS: " + L.acs));
      })) : null);
}

/* --------------------------------------------------------------- more hub */
/* ---------------------------------------------------- aircraft & history */
function catTint(t, cat) {
  if (cat === "airplane") return t.sky;
  if (cat === "rotorcraft") return t.amber;
  if (cat === "balloon") return t.red;
  if (cat === "glider") return t.green;
  if (cat === "poweredlift") return t.magenta;
  return t.sky;
}
function catGlyph(cat) {
  if (cat === "rotorcraft") return "heli";
  if (cat === "balloon") return "balloon";
  if (cat === "glider") return "glider";
  if (cat === "poweredlift") return "poweredlift";
  return "wing";
}
function AircraftScreen(props) {
  var t = useT();
  var qS = useState(""); var q = qS[0], setQ = qS[1];
  var fS = useState("all"); var filter = fS[0], setFilter = fS[1];
  var oS = useState(""); var openId = oS[0], setOpenId = oS[1];
  var needle = normAnswer(q);

  var chips = [{ id: "all", label: "All" }];
  aircraftCats().forEach(function (c) { chips.push({ id: c, label: AIRCRAFT_CAT_LABEL[c] || c }); });

  var shown = AIRCRAFT.filter(function (a) {
    var passF = filter === "all" || a.cat === filter;
    var passN = needle === "" || normAnswer(a.name + " " + a.maker + " " + a.role + " " + a.era + " " + a.blurb).indexOf(needle) > -1;
    return passF && passN;
  });
  var makers = [];
  var byMaker = {};
  shown.forEach(function (a) { if (!byMaker[a.maker]) { byMaker[a.maker] = []; makers.push(a.maker); } byMaker[a.maker].push(a); });
  function alpha(x, y) { var xa = ("" + x).toLowerCase(), ya = ("" + y).toLowerCase(); return xa < ya ? -1 : (xa > ya ? 1 : 0); }
  makers.sort(alpha);
  makers.forEach(function (m) { byMaker[m].sort(function (a, b) { return alpha(a.name, b.name); }); });
  function aircard(a) {
    var open = openId === a.id;
    var tint = catTint(t, a.cat);
    function toggle() { setOpenId(open ? "" : a.id); }
    return h("div", { key: a.id, style: { marginBottom: 12, background: t.panel, border: "1px solid " + (open ? tint : t.line), borderRadius: 16, overflow: "hidden" } },
      h("div", { onClick: toggle, style: { display: "flex", alignItems: "center", gap: 12, padding: 14, cursor: "pointer" } },
        h("div", { style: { width: 42, height: 42, borderRadius: 11, background: tint + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: catGlyph(a.cat), size: 22, color: tint })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 15.5, fontWeight: 800, color: t.text } }, a.name),
          h("div", { style: { fontSize: 12, color: t.textDim } }, a.role + " \u00b7 " + a.year)),
        h("div", { style: { fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: tint, flexShrink: 0, textAlign: "right" } }, AIRCRAFT_CAT_LABEL[a.cat] || a.cat)),
      open ? h("div", { style: { padding: "0 14px 16px" } },
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, margin: "0 0 6px" } }, a.blurb),
        h("p", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.6, margin: "0 0 12px" } }, a.body),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          a.specs.map(function (s, i) {
            return h("div", { key: i, style: { flex: "1 1 130px", background: t.panelHi, borderRadius: 10, padding: "8px 10px" } },
              h("div", { style: { fontSize: 9.5, letterSpacing: 0.5, textTransform: "uppercase", color: t.textFaint } }, s[0]),
              h("div", { style: { fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: t.text, marginTop: 2 } }, s[1]));
          })),
        h("div", { style: { marginTop: 10 } }, h(Chip, { color: t.textDim }, a.era))) : null);
  }

  return h("div", null,
    h(SubHeader, { title: "Aircraft", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 12px", lineHeight: 1.5 } }, "Notable, historical, and popular aircraft, organized alphabetically by manufacturer. Filter by category or search by name, maker, or role \u2014 tap any aircraft for details."),
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: "Search aircraft, maker, or role…",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none", marginBottom: 12 } }),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } },
      chips.map(function (c) {
        var on = filter === c.id;
        return h("button", { key: c.id, onClick: function () { setFilter(c.id); }, style: { fontFamily: SANS, fontSize: 12.5, fontWeight: 600, padding: "7px 13px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text } }, c.label);
      })),
    h("div", { style: { fontFamily: MONO, fontSize: 11.5, color: t.textFaint, marginBottom: 10 } }, shown.length + " aircraft \u00b7 " + makers.length + (makers.length === 1 ? " manufacturer" : " manufacturers")),
    makers.length ? makers.map(function (m) {
      return h("div", { key: m, style: { marginBottom: 18 } },
        h(SectionLabel, { style: { marginBottom: 10 } }, m),
        byMaker[m].map(aircard));
    }) : h("div", { style: { textAlign: "center", color: t.textFaint, fontSize: 13.5, padding: "24px 0" } }, "No aircraft match your search."),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 6, lineHeight: 1.5 } }, "A growing reference. Dates and figures are simplified historical highlights — verify exact specifications with authoritative sources."));
}

function shortEra(s) {
  var idx = s.indexOf(" (");
  return idx > -1 ? s.slice(0, idx) : s;
}
function HistoryScreen(props) {
  var t = useT();
  var eS = useState("all"); var era = eS[0], setEra = eS[1];
  var chips = [{ id: "all", label: "All eras" }];
  HISTORY.forEach(function (g) { chips.push({ id: g.era, label: shortEra(g.era) }); });
  var groups = HISTORY.filter(function (g) { return era === "all" || g.era === era; });

  return h("div", null,
    h(SubHeader, { title: "Aviation history", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 12px", lineHeight: 1.5 } }, "A timeline of milestones, from the first balloons to electric flight."),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" } },
      chips.map(function (c) {
        var on = era === c.id;
        return h("button", { key: c.id, onClick: function () { setEra(c.id); }, style: { fontFamily: SANS, fontSize: 12.5, fontWeight: 600, padding: "7px 13px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.magenta : t.line), background: on ? t.magenta : t.panel, color: on ? "#fff" : t.text } }, c.label);
      })),
    groups.map(function (g) {
      return h("div", { key: g.era, style: { marginBottom: 22 } },
        h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } },
          h(Glyph, { name: "clock", size: 18, color: t.magenta }),
          h("h2", { style: { fontSize: 15, fontWeight: 900, color: t.text, margin: 0, letterSpacing: 0.2 } }, g.era)),
        h("div", { style: { position: "relative", paddingLeft: 18, borderLeft: "2px solid " + t.line } },
          g.items.map(function (it, i) {
            return h("div", { key: i, style: { position: "relative", marginBottom: 16 } },
              h("div", { style: { position: "absolute", left: -24, top: 3, width: 10, height: 10, borderRadius: 99, background: t.magenta, border: "2px solid " + t.bg } }),
              h("div", { style: { fontFamily: MONO, fontSize: 12, fontWeight: 800, color: t.magenta, marginBottom: 2 } }, it.year),
              h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text, marginBottom: 3 } }, it.title),
              h("p", { style: { fontSize: 13, color: t.textDim, lineHeight: 1.55, margin: 0 } }, it.text));
          })));
    }),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 4, lineHeight: 1.5 } }, "Highlights, not a complete record — a timeline that will keep growing."));
}

/* ------------------------------------------ generic topic reference screen */
function TopicRefScreen(props) {
  var t = useT();
  var accent = props.accent || t.sky;
  var qS = useState(""); var q = qS[0], setQ = qS[1];
  var fS = useState("all"); var filter = fS[0], setFilter = fS[1];
  var oS = useState(""); var openId = oS[0], setOpenId = oS[1];
  var needle = normAnswer(q);
  var groups = props.groups;
  var chips = [{ id: "all", label: "All" }];
  groups.forEach(function (g) { chips.push({ id: g, label: g }); });
  function match(o) {
    var passF = filter === "all" || o.group === filter;
    var passN = needle === "" || normAnswer(o.summary + " " + o.group + " " + o.body.join(" ")).indexOf(needle) > -1;
    return passF && passN;
  }
  var shown = props.items.filter(match);
  return h("div", null,
    h(SubHeader, { title: props.title, onBack: props.onBack }),
    props.compliance ? h(ComplianceBanner, { text: props.compliance }) : null,
    props.intro ? h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 12px", lineHeight: 1.5 } }, props.intro) : null,
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: props.placeholder || "Search…",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none", marginBottom: 12 } }),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } },
      chips.map(function (c) {
        var on = filter === c.id;
        return h("button", { key: c.id, onClick: function () { setFilter(c.id); }, style: { fontFamily: SANS, fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? accent : t.line), background: on ? accent : t.panel, color: on ? "#fff" : t.text } }, c.label);
      })),
    groups.map(function (g) {
      var items = shown.filter(function (o) { return o.group === g; });
      if (items.length === 0) return null;
      return h("div", { key: g, style: { marginBottom: 18 } },
        h(SectionLabel, { style: { marginBottom: 10 } }, g),
        items.map(function (o) {
          var open = openId === o.id;
          var src = faaSourceById(o.source);
          function toggle() { setOpenId(open ? "" : o.id); }
          return h("div", { key: o.id, style: { marginBottom: 10, background: t.panel, border: "1px solid " + (open ? accent : t.line), borderRadius: 14, overflow: "hidden" } },
            h("div", { onClick: toggle, style: { display: "flex", alignItems: "center", gap: 12, padding: 13, cursor: "pointer" } },
              h("div", { style: { width: 38, height: 38, borderRadius: 10, background: accent + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: o.glyph || "library", size: 19, color: accent })),
              h("div", { style: { flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 800, color: t.text, lineHeight: 1.3 } }, o.summary),
              h("div", { style: { transform: open ? "rotate(90deg)" : "none", transition: "transform .15s ease", flexShrink: 0 } }, h(Glyph, { name: "more", size: 18, color: t.textFaint }))),
            open ? h("div", { style: { padding: "0 13px 14px" } },
              o.body.map(function (para, i) { return h("p", { key: i, style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.6, margin: i === 0 ? "2px 0 10px" : "0 0 12px" } }, para); }),
              o.key && o.key.length ? h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 } },
                o.key.map(function (kv, i) {
                  return h("div", { key: i, style: { flex: "1 1 140px", background: t.panelHi, borderRadius: 10, padding: "8px 10px" } },
                    h("div", { style: { fontSize: 9.5, letterSpacing: 0.5, textTransform: "uppercase", color: t.textFaint } }, kv[0]),
                    h("div", { style: { fontFamily: MONO, fontSize: 12, fontWeight: 700, color: t.text, marginTop: 2 } }, kv[1]));
                })) : null,
              h(SourceLink, { url: src.url, small: true }, src.code + " — " + src.title)) : null);
        }));
    }),
    shown.length === 0 ? h("div", { style: { textAlign: "center", color: t.textFaint, fontSize: 13.5, padding: "24px 0" } }, "No topics match your search.") : null,
    props.footer ? h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 6, lineHeight: 1.5 } }, props.footer) : null);
}

/* ---------------------------------------------------- airport operations */
function AirportOpsScreen(props) {
  var t = useT();
  return h(TopicRefScreen, {
    title: "Airport operations", accent: t.green,
    compliance: "A study guide to the airport environment. Always operate by the current AIM, sectional charts, the Chart Supplement, and ATC instructions.",
    placeholder: "Search markings, lights, airspace, comms…",
    items: AIRPORT_OPS, groups: airportOpsGroups(),
    footer: "A growing reference. Markings, lighting, and procedures are summarized for study — the current AIM and charts are authoritative.",
    onBack: props.onBack
  });
}

/* ---------------------------------------------------------------- weather */
function WeatherScreen(props) {
  var t = useT();
  return h(TopicRefScreen, {
    title: "Weather", accent: t.sky,
    intro: "Reading reports, the atmosphere, clouds, hazards, fronts, and getting a briefing. Tap any topic for details.",
    compliance: "A study guide. Always obtain an official weather briefing and review current products before any flight.",
    placeholder: "Search METAR, clouds, icing, fronts…",
    items: WEATHER, groups: weatherGroups(),
    footer: "A growing reference, summarized for study. A proper preflight briefing and official weather products are authoritative.",
    onBack: props.onBack
  });
}

/* ------------------------------------------------------------- navigation */
function NavScreen(props) {
  var t = useT();
  return h(TopicRefScreen, {
    title: "Navigation", accent: t.magenta,
    intro: "Charts, the compass, pilotage and dead reckoning, radio and satellite navigation, and planning. Tap any topic for details.",
    compliance: "A study guide. Always navigate with current charts and approved procedures.",
    placeholder: "Search VOR, GPS, charts, headings…",
    items: NAV, groups: navGroups(),
    footer: "A growing reference, summarized for study. Current charts and the regulations are authoritative.",
    onBack: props.onBack
  });
}

/* ---------------------------------------------------- airport directory */
function AirportDirectoryScreen(props) {
  var t = useT();
  var qS = useState(""); var q = qS[0], setQ = qS[1];
  var fS = useState("all"); var filter = fS[0], setFilter = fS[1];
  var oS = useState(""); var openId = oS[0], setOpenId = oS[1];
  var needle = normAnswer(q);
  var CAP = 120;
  var chips = [
    { id: "all", label: "All" },
    { id: "L", label: "Major" },
    { id: "M", label: "Regional" },
    { id: "S", label: "GA & local" },
    { id: "featured", label: "Featured" }
  ];
  function featMatch(a) {
    if (needle === "") return true;
    return normAnswer(a.name + " " + a.code + " " + a.city + " " + a.tag + " " + a.blurb).indexOf(needle) > -1;
  }
  function featuredCard(a) {
    var open = openId === a.id;
    var tint = airportGroupTint(t, a.group);
    function toggle() { setOpenId(open ? "" : a.id); }
    return h("div", { key: a.id, style: { marginBottom: 10, background: t.panel, border: "1px solid " + (open ? tint : t.line), borderRadius: 14, overflow: "hidden" } },
      h("div", { onClick: toggle, style: { display: "flex", alignItems: "center", gap: 12, padding: 13, cursor: "pointer" } },
        h("div", { style: { width: 40, height: 40, borderRadius: 11, background: tint + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "pin", size: 20, color: tint })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, a.name),
          h("div", { style: { fontFamily: MONO, fontSize: 11.5, color: t.textDim } }, a.code + "  \u00b7  " + a.city)),
        h("div", { style: { transform: open ? "rotate(90deg)" : "none", transition: "transform .15s ease", flexShrink: 0 } }, h(Glyph, { name: "more", size: 18, color: t.textFaint }))),
      open ? h("div", { style: { padding: "0 13px 14px" } },
        a.tag ? h("div", { style: { marginBottom: 8 } }, h(Chip, { color: tint }, a.tag)) : null,
        h("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.text, margin: "0 0 6px" } }, a.blurb),
        h("p", { style: { fontSize: 13.5, color: t.textDim, lineHeight: 1.6, margin: "0 0 12px" } }, a.body),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          a.facts.map(function (kv, i) {
            return h("div", { key: i, style: { flex: "1 1 140px", background: t.panelHi, borderRadius: 10, padding: "8px 10px" } },
              h("div", { style: { fontSize: 9.5, letterSpacing: 0.5, textTransform: "uppercase", color: t.textFaint } }, kv[0]),
              h("div", { style: { fontFamily: MONO, fontSize: 12, fontWeight: 700, color: t.text, marginTop: 2 } }, kv[1]));
          }))) : null);
  }
  function dbCard(a) {
    var key = "db:" + (a[0] || a[2]) + ":" + a[3];
    var open = openId === key;
    var tint = airportTypeTint(t, a[6]);
    function toggle() { setOpenId(open ? "" : key); }
    var codes = [];
    if (a[0]) codes.push(a[0]);
    if (a[1] && a[1] !== a[0]) codes.push(a[1]);
    var codeStr = codes.length ? codes.join(" / ") : "\u2014";
    var loc = a[3] ? (a[3] + ", " + a[4]) : a[4];
    if (a[5] !== "US") loc = loc + " \u00b7 " + a[5];
    var sub = (codeStr !== "\u2014" ? codeStr + "  \u00b7  " : "") + (a[3] ? a[3] + ", " + a[4] : a[4]);
    var facts = [["Identifier", codeStr], ["Location", loc], ["Type", airportTypeLabel(a[6])]];
    if (a[7] !== "" && a[7] !== null && a[7] !== undefined) facts.push(["Elevation", a[7] + " ft"]);
    return h("div", { key: key, style: { marginBottom: 10, background: t.panel, border: "1px solid " + (open ? tint : t.line), borderRadius: 14, overflow: "hidden" } },
      h("div", { onClick: toggle, style: { display: "flex", alignItems: "center", gap: 12, padding: 13, cursor: "pointer" } },
        h("div", { style: { width: 40, height: 40, borderRadius: 11, background: tint + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: "pin", size: 20, color: tint })),
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text } }, a[2]),
          h("div", { style: { fontFamily: MONO, fontSize: 11.5, color: t.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, sub)),
        h("div", { style: { transform: open ? "rotate(90deg)" : "none", transition: "transform .15s ease", flexShrink: 0 } }, h(Glyph, { name: "more", size: 18, color: t.textFaint }))),
      open ? h("div", { style: { padding: "0 13px 14px" } },
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
          facts.map(function (kv, i) {
            return h("div", { key: i, style: { flex: "1 1 140px", background: t.panelHi, borderRadius: 10, padding: "8px 10px" } },
              h("div", { style: { fontSize: 9.5, letterSpacing: 0.5, textTransform: "uppercase", color: t.textFaint } }, kv[0]),
              h("div", { style: { fontFamily: MONO, fontSize: 12, fontWeight: 700, color: t.text, marginTop: 2 } }, kv[1]));
          }))) : null);
  }
  function hintCard(text) {
    return h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, marginBottom: 14, background: "rgba(46,134,193,0.07)", border: "1px solid rgba(46,134,193,0.28)" } },
      h(Glyph, { name: "search", size: 18, color: t.sky }),
      h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.45 } }, text));
  }
  function featuredBlocks() {
    var groups = airportGroups();
    var any = false;
    var out = groups.map(function (g) {
      var items = AIRPORTS.filter(function (a) { return a.group === g && featMatch(a); });
      if (!items.length) return null;
      any = true;
      return h("div", { key: g, style: { marginBottom: 18 } }, h(SectionLabel, { style: { marginBottom: 10 } }, g), items.map(featuredCard));
    });
    return { nodes: out, any: any };
  }
  var dbReady = airportsPacked() !== "";
  function dbNote() {
    if (AIRPORTS_DB_STATUS === "error") {
      return h("div", { style: { padding: "14px 16px", borderRadius: 12, marginBottom: 14, background: t.panel, border: "1px solid " + t.line } },
        h("div", { style: { fontSize: 13, fontWeight: 800, color: t.text, marginBottom: 4 } }, "Full directory loads on your published site"),
        h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.5 } }, "The 20,000-airport directory loads from avhype-airports.js, kept in the same folder as this page once deployed. The featured airports below are always available."));
    }
    return h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "13px 15px", borderRadius: 12, marginBottom: 14, background: "rgba(46,134,193,0.07)", border: "1px solid rgba(46,134,193,0.28)" } },
      h("div", { style: { width: 15, height: 15, borderRadius: "50%", border: "2px solid " + t.sky + "55", borderTopColor: t.sky, flexShrink: 0, animation: "fpa-spin .8s linear infinite" } }),
      h("div", { style: { fontSize: 12.5, color: t.textDim, lineHeight: 1.45 } }, "Loading the full airport directory in the background. Search will light up in a moment."));
  }
  var content = (function () {
    if (filter === "featured") {
      var fb = featuredBlocks();
      return h("div", null, fb.nodes, fb.any ? null : h("div", { style: { textAlign: "center", color: t.textFaint, fontSize: 13.5, padding: "24px 0" } }, "No featured airports match your search."));
    }
    if (!dbReady) {
      if (filter === "all" && needle.length < 2) {
        return h("div", null, dbNote(), h(SectionLabel, { style: { marginBottom: 10 } }, "Featured airports"), featuredBlocks().nodes);
      }
      var ff = (filter === "all") ? AIRPORTS.filter(featMatch) : [];
      return h("div", null,
        ff.length ? h("div", { style: { marginBottom: 18 } }, h(SectionLabel, { style: { marginBottom: 10 } }, "Featured"), ff.map(featuredCard)) : null,
        dbNote());
    }
    var dbType = filter === "all" ? "all" : filter;
    if (needle.length < 2) {
      if (filter === "all") {
        var fb2 = featuredBlocks();
        return h("div", null,
          hintCard("Type a name, city, or code to search every airport \u2014 about 20,000 across the US and worldwide."),
          h(SectionLabel, { style: { marginBottom: 10 } }, "Featured airports"),
          fb2.nodes);
      }
      var browse = browseAirportsDB(dbType, CAP);
      return h("div", null,
        hintCard("Showing the first " + browse.length + " " + airportTypeLabel(dbType).toLowerCase() + " airports \u2014 search by name, city, or code to find a specific one."),
        browse.map(dbCard));
    }
    var feat = (filter === "all") ? AIRPORTS.filter(featMatch) : [];
    var db = searchAirportsDB(needle, dbType, CAP);
    if (!feat.length && !db.length) return h("div", { style: { textAlign: "center", color: t.textFaint, fontSize: 13.5, padding: "24px 0" } }, "No airports match your search.");
    return h("div", null,
      feat.length ? h("div", { style: { marginBottom: 18 } }, h(SectionLabel, { style: { marginBottom: 10 } }, "Featured"), feat.map(featuredCard)) : null,
      db.length ? h("div", null, h(SectionLabel, { style: { marginBottom: 10 } }, "Directory \u2014 " + db.length + (db.length >= CAP ? "+ matches" : (db.length === 1 ? " match" : " matches"))), db.map(dbCard)) : null);
  })();
  return h("div", null,
    h(SubHeader, { title: "Airport directory", onBack: props.onBack }),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 12px", lineHeight: 1.5 } }, "Search every public-use airport in the United States, plus major and regional airports worldwide \u2014 about 20,000 in all. Featured airports add curated detail; tap any result for its facts."),
    h("input", { value: q, onChange: function (e) { setQ(e.target.value); }, placeholder: "Search airport, code, or city\u2026",
      style: { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 12, border: "1px solid " + t.line, background: t.panel, color: t.text, fontFamily: SANS, fontSize: 14.5, outline: "none", marginBottom: 12 } }),
    h("div", { style: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" } },
      chips.map(function (c) {
        var on = filter === c.id;
        function pick() { setFilter(c.id); setOpenId(""); }
        return h("button", { key: c.id, onClick: pick, style: { fontFamily: SANS, fontSize: 12, fontWeight: 600, padding: "7px 12px", borderRadius: 99, cursor: "pointer", border: "1.5px solid " + (on ? t.sky : t.line), background: on ? t.sky : t.panel, color: on ? "#fff" : t.text } }, c.label);
      })),
    content,
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginTop: 14, lineHeight: 1.5 } }, "Coverage from the public-domain OurAirports dataset: all US public-use airports plus large and regional airports worldwide. Closed fields, most heliports and seaplane bases, and small private strips outside the US are not listed. Identifiers and elevations are approximate \u2014 always consult current charts and the Chart Supplement."));
}
/* ----------------------------------------------------- preflight checklist */
function PreflightScreen(props) {
  var t = useT();
  var state = props.state;
  var tier = tierFor(state);
  var ckState = useState({}); var checked = ckState[0], setChecked = ckState[1];
  var trState = useState(props.initialTrack === "study" ? "study" : "fly"); var track = trState[0], setTrack = trState[1];

  var studyData = PREFLIGHT.study.byTier[tier] ? PREFLIGHT.study.byTier[tier] : PREFLIGHT.study.byTier.adult;
  var data = track === "fly" ? PREFLIGHT.fly : studyData;
  var accent = track === "fly" ? t.sky : t.green;

  var pf = state && state.preflight ? state.preflight : { streak: 0, longest: 0, last: null, total: 0 };
  var loggedToday = pf.last === todayStr();

  function streakHeadline() {
    var n = pf.streak;
    if (tier === "junior") {
      if (loggedToday) return "Mission prepped! " + n + (n === 1 ? " day" : " days") + " in a row!";
      if (n > 0) return "You're on a " + n + "-day streak — keep it going!";
      return "Run your preflight to start a streak!";
    }
    if (tier === "teen") {
      if (loggedToday) return "Preflight logged today · " + n + "-day streak";
      if (n > 0) return n + "-day prep streak — don't break the chain";
      return "Log a preflight to start your streak";
    }
    if (loggedToday) return "Logged today · " + n + "-day streak";
    if (n > 0) return "Preflight streak: " + n + (n === 1 ? " day" : " days");
    return "No active streak — log a preflight to begin";
  }

  function keyFor(pi, ii) { return track + ":" + pi + ":" + ii; }
  function isChecked(pi, ii) { return checked[keyFor(pi, ii)] === true; }
  function toggle(pi, ii) {
    var k = keyFor(pi, ii);
    var next = {};
    for (var kk in checked) { if (checked[kk]) next[kk] = true; }
    if (next[k]) { delete next[k]; } else { next[k] = true; }
    setChecked(next);
  }
  function resetTrack() {
    var next = {};
    for (var kk in checked) { if (checked[kk] && kk.indexOf(track + ":") !== 0) next[kk] = true; }
    setChecked(next);
  }

  var total = 0, done = 0;
  for (var pi = 0; pi < data.phases.length; pi++) {
    var ph = data.phases[pi];
    for (var ii = 0; ii < ph.items.length; ii++) {
      total = total + 1;
      if (isChecked(pi, ii)) done = done + 1;
    }
  }
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;
  var allChecked = total > 0 && done === total;
  var toggleOpts = [["fly", "Before you fly"], ["study", "Before you study"]];

  return h("div", null,
    h(SubHeader, { title: "Preflight checklist", onBack: props.onBack }),

    /* anchor — why this matters */
    h("div", { style: { background: t.name === "dark" ? "rgba(242,183,5,0.06)" : "rgba(201,138,0,0.07)", border: "1px solid " + (t.name === "dark" ? "rgba(242,183,5,0.25)" : "rgba(201,138,0,0.3)"), borderRadius: 16, padding: "15px 16px", marginBottom: 18 } },
      h(SectionLabel, { style: { color: t.amber, marginBottom: 8 } }, "Why this matters"),
      h("p", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.text, margin: "0 0 9px" } }, "On October 30, 1935, the Army's most advanced bomber — the prototype of the B-17 — crashed seconds after takeoff at Wright Field, killing its veteran test pilot. Nothing was wrong with the airplane. The crew had simply forgotten to release the control locks."),
      h("p", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.text, margin: "0 0 9px" } }, "Critics said the new bomber was too complex to fly. The real fix was a single sheet of paper — the pilot's checklist. The airplane was not too complex; it was too important to leave to memory."),
      h("p", { style: { fontSize: 13.5, lineHeight: 1.6, color: t.textDim, margin: 0 } }, "That is why a checklist is run before every flight, from a student's first lesson to a captain's ten-thousandth. Bring the same habit here: a short, deliberate preflight turns scattered effort into real progress.")),

    /* segmented toggle */
    h("div", { style: { display: "flex", gap: 8, marginBottom: 16 } },
      toggleOpts.map(function (opt) {
        var on = track === opt[0];
        var c = opt[0] === "fly" ? t.sky : t.green;
        return h("button", { key: opt[0], onClick: function () { setTrack(opt[0]); }, style: { flex: 1, fontFamily: SANS, fontSize: 13.5, fontWeight: 800, padding: "11px 10px", borderRadius: 12, cursor: "pointer", border: "1.5px solid " + (on ? c : t.line), background: on ? c : t.panel, color: on ? "#fff" : t.text } }, opt[1]);
      })),

    /* study streak — persistent, once per day */
    track === "study" ? h("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 13, marginBottom: 14, background: pf.streak > 0 ? (t.name === "dark" ? "rgba(242,183,5,0.1)" : "rgba(201,138,0,0.1)") : t.panel, border: "1px solid " + (pf.streak > 0 ? t.amber : t.line) } },
      h(Glyph, { name: "flame", size: 20, color: pf.streak > 0 ? t.amber : t.textFaint }),
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { fontSize: 13.5, fontWeight: 800, color: t.text } }, streakHeadline()),
        h("div", { style: { fontSize: 11.5, color: t.textDim, marginTop: 1 } }, "Longest " + pf.longest + (pf.longest === 1 ? " day" : " days") + " · " + pf.total + " logged")),
      loggedToday ? h(Glyph, { name: "check", size: 18, color: t.green }) : null) : null,
    /* tagline + progress */
    h("p", { style: { fontSize: 13, color: t.textDim, margin: "0 0 10px", lineHeight: 1.5 } }, data.tagline),
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 } },
      h("div", { style: { fontFamily: MONO, fontSize: 12, fontWeight: 700, color: accent } }, done + " of " + total + " complete"),
      h("button", { onClick: resetTrack, style: { fontFamily: SANS, fontSize: 12, fontWeight: 600, color: t.textDim, background: "transparent", border: "none", cursor: "pointer", padding: 0 } }, "Reset")),
    h("div", { style: { height: 6, borderRadius: 99, background: t.line, overflow: "hidden", marginBottom: 18 } },
      h("div", { style: { height: "100%", width: pct + "%", background: accent, borderRadius: 99, transition: "width .2s ease" } })),

    /* phases */
    data.phases.map(function (phase, pIdx) {
      return h("div", { key: pIdx, style: { marginBottom: 16 } },
        h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8, gap: 10 } },
          h(SectionLabel, { style: { color: accent, margin: 0 } }, phase.phase),
          phase.note ? h("span", { style: { fontSize: 11, color: t.textFaint, fontStyle: "italic", textAlign: "right" } }, phase.note) : null),
        h("div", { style: { border: "1px solid " + t.line, borderRadius: 14, overflow: "hidden" } },
          phase.items.map(function (text, iIdx) {
            var ck = isChecked(pIdx, iIdx);
            return h("div", { key: iIdx, onClick: function () { toggle(pIdx, iIdx); }, style: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 13px", cursor: "pointer", borderTop: iIdx === 0 ? "none" : "1px solid " + t.lineSoft, background: ck ? (t.name === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)") : "transparent" } },
              h("div", { style: { width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1, border: "2px solid " + (ck ? accent : t.textFaint), background: ck ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" } }, ck ? h(Glyph, { name: "check", size: 14, color: "#fff" }) : null),
              h("div", { style: { fontSize: 13.5, lineHeight: 1.5, color: ck ? t.textDim : t.text, textDecoration: ck ? "line-through" : "none" } }, text));
          })));
    }),

    /* log + launch (study track) */
    track === "study" ? h("div", { style: { marginTop: 4, marginBottom: 16 } },
      allChecked || loggedToday ? null : h("div", { style: { fontSize: 12, color: t.textFaint, marginBottom: 8, textAlign: "center" } }, "Check off each item as you run it."),
      h("button", { onClick: function () { if (!loggedToday) { props.onLogPreflight(); } if (props.onStartStudying) { props.onStartStudying(); } }, style: { width: "100%", boxSizing: "border-box", padding: "14px 14px", borderRadius: 13, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 15, fontWeight: 800, color: "#fff", background: t.green } }, loggedToday ? "Start studying" : "Log preflight and start studying")) : null,
    /* compliance / closing note */
    h(ComplianceBanner, { text: track === "fly" ? "A study illustration of a typical preflight flow — not a substitute for your aircraft's approved checklist. Always fly the manufacturer's checklist and your instructor's guidance." : "A study habit, not a rule. Adapt it to whatever genuinely helps you focus and learn." }));
}

function LegalDocView(props) {
  var t = useT();
  return h("div", null, props.blocks.map(function (b, i) {
    return h("div", { key: i, style: { marginBottom: 16 } },
      h("div", { style: { fontSize: 14.5, fontWeight: 800, color: t.text, marginBottom: 6 } }, b.h),
      b.p.map(function (para, j) {
        return h("p", { key: j, style: { fontSize: 13, color: t.textDim, lineHeight: 1.62, margin: "0 0 8px" } }, para);
      }));
  }));
}

function LegalScreen(props) {
  var t = useT();
  var tabState = useState(props.initialTab ? props.initialTab : "terms");
  var tab = tabState[0], setTab = tabState[1];
  function seg(id, label) {
    var on = tab === id;
    function pick() { setTab(id); }
    return h("button", { key: id, onClick: pick, style: { flex: 1, padding: "8px 4px", borderRadius: 9, cursor: "pointer", border: "none", background: on ? t.sky : "transparent", color: on ? "#fff" : t.textDim, fontFamily: SANS, fontSize: 12.5, fontWeight: 800 } }, label);
  }
  var doc = tab === "copyright" ? COPYRIGHT_DOC : tab === "trademark" ? TRADEMARK_DOC : tab === "privacy" ? PRIVACY_DOC : TERMS_DOC;
  var docTitle = tab === "copyright" ? "Copyright Notice" : tab === "trademark" ? "Trademark Notice" : tab === "privacy" ? "Privacy & Data" : "Terms of Use";

  return h("div", null,
    h(SubHeader, { title: "Terms & Legal", onBack: props.onBack }),
    h("div", { style: { fontSize: 11.5, color: t.textFaint, marginBottom: 12, lineHeight: 1.5 } }, "Effective " + LEGAL_EFFECTIVE + " \u00b7 " + LEGAL_COPYRIGHT),
    h("div", { style: { display: "flex", gap: 4, padding: 4, background: t.panel, border: "1px solid " + t.line, borderRadius: 12, marginBottom: 16 } },
      seg("terms", "Terms"), seg("copyright", "Copyright"), seg("trademark", "Trademark"), seg("privacy", "Privacy")),
    h("div", { style: { fontSize: 18, fontWeight: 900, color: t.text, marginBottom: 12 } }, docTitle),
    h(LegalDocView, { blocks: doc }),
    h(ComplianceBanner, { text: BRAND + " is an independent study tool and is not affiliated with, endorsed by, or authorized by the FAA. Airman certification is completed only through authorized FAA processes, certificated instructors, and designated examiners.", margin: "8px 0 0 0" }));
}

function MoreScreen(props) {
  var t = useT();
  var goalsUnlocked = props.state ? (levelInfo(props.state.xp).level >= 10) : false;
  var progressItems = [
    { id: "hangar", title: "The Hangar", desc: "Collect a notable aircraft for every Flight Level", glyph: "hangar", color: t.sky },
    { id: "milestones", title: "Milestones", desc: "Endorsement-style checkpoints you earn as you finish units", glyph: "wings-badge", color: t.amber },
    { id: "transcript", title: "Training transcript", desc: "A printable PDF summary of your whole record", glyph: "checklist", color: t.magenta },
    { id: "endorsements", title: "Endorsements tracker", desc: "Track progress toward instructor sign-offs", glyph: "check", color: t.green }
  ];
  if (goalsUnlocked) progressItems.unshift({ id: "goals", title: "Get more out of your training", desc: "Set the certificates & ratings you're aiming for", glyph: "wings-badge", color: t.amber });
  var sections = [
    { label: "Before you begin", items: [
      { id: "pathfinder", title: "Find your path", desc: "Not sure what to fly? Get matched to a training path", glyph: "compass", color: t.sky },
      { id: "preflight", title: "Preflight checklist", desc: "Your preflight ritual — for flying and for studying", glyph: "checklist", color: t.amber }
    ] },
    { label: "Reference", items: [
      { id: "__library", lib: true, title: "Open the Library", desc: "Glossary, weather, navigation, airports, aircraft, history & more", glyph: "library", color: t.sky }
    ] },
    { label: "Your progress", items: progressItems },
    { label: "Settings", items: [
      { id: "profile", title: "Profile & settings", desc: "Theme, age, pathways, and reset", glyph: "more", color: t.amber },
      { id: "legal", title: "Terms, privacy & legal", desc: "Terms of use, copyright, trademark, and privacy", glyph: "sign", color: t.sky }
    ] }
  ];
  function row(it) {
    return h("div", { key: it.id, onClick: function () { if (it.lib && props.onGoLibrary) { props.onGoLibrary(); } else { props.onOpen(it.id); } }, style: { display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", marginBottom: 10, background: t.panel, border: "1px solid " + t.line, borderRadius: 16, cursor: "pointer" } },
      h("div", { style: { width: 44, height: 44, borderRadius: 12, background: it.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: it.glyph, size: 22, color: it.color })),
      h("div", { style: { flex: 1 } },
        h("div", { style: { fontSize: 16, fontWeight: 800, color: t.text } }, it.title),
        h("div", { style: { fontSize: 12.5, color: t.textDim } }, it.desc)),
      h(Glyph, { name: "more", size: 18, color: t.textDim }));
  }
  return h("div", null,
    h("h1", { style: { fontSize: 24, fontWeight: 900, color: t.text, margin: "0 0 4px" } }, "More"),
    h("p", { style: { color: t.textDim, fontSize: 13.5, margin: "0 0 18px" } }, "References, tracking, and settings."),
    sections.map(function (sec) {
      return h("div", { key: sec.label, style: { marginBottom: 18 } },
        h(SectionLabel, { style: { marginBottom: 10 } }, sec.label),
        sec.items.map(row));
    }),
    h("div", { style: { textAlign: "center", marginTop: 18, marginBottom: 6 } }, h(BrandLogo, { w: 150, pad: 12, radius: 14 })),
    h("div", { style: { textAlign: "center", marginTop: 8, fontSize: 11.5, color: t.textFaint, lineHeight: 1.6 } },
      BRAND + " \u2014 an independent study & preparation tool.", h("br", null), "Not affiliated with the FAA. Not a substitute for certificated instruction.",
      h("div", { onClick: function () { props.onOpen("legal"); }, style: { marginTop: 10, color: t.sky, fontWeight: 700, cursor: "pointer" } }, "Terms \u00b7 Copyright \u00b7 Trademark \u00b7 Privacy"),
      h("div", { style: { marginTop: 6, color: t.textFaint } }, LEGAL_COPYRIGHT)));
}

/* ================================ APP ROOT ================================ */
var APP_FEATURES = [
  { id: "aircraft", name: "Aircraft", glyph: "wing", kind: "sub", key: "aircraft" },
  { id: "airports", name: "Airport Directory", glyph: "pin", kind: "sub", key: "airports" },
  { id: "airportops", name: "Airport Operations", glyph: "tower", kind: "sub", key: "airportops" },
  { id: "signs", name: "Airport Signs & Markings", glyph: "sign", kind: "sub", key: "signs" },
  { id: "arcade", name: "Aviation Arcade", glyph: "arcade", kind: "tab", key: "arcade" },
  { id: "history", name: "Aviation History", glyph: "clock", kind: "sub", key: "history" },
  { id: "resources", name: "AvHype Resources", glyph: "checklist", kind: "sub", key: "resources" },
  { id: "career", name: "Career Paths", glyph: "wing", kind: "sub", key: "career" },
  { id: "credentials", name: "Certificates & Ratings", glyph: "library", kind: "sub", key: "credentials" },
  { id: "endorsements", name: "Endorsements Tracker", glyph: "check", kind: "sub", key: "endorsements" },
  { id: "examlog", name: "Exam Log", glyph: "checklist", kind: "sub", key: "examlog" },
  { id: "pathfinder", name: "Find Your Path", glyph: "compass", kind: "sub", key: "pathfinder" },
  { id: "flashcards", name: "Flashcards", glyph: "learn", kind: "sub", key: "flashcards" },
  { id: "glossary", name: "Glossary of Terms", glyph: "library", kind: "sub", key: "glossary" },
  { id: "pronounce", name: "Pronunciation Guide", glyph: "radio", kind: "sub", key: "pronounce" },
  { id: "hangar", name: "Hangar", glyph: "hangar", kind: "sub", key: "hangar" },
  { id: "learn", name: "Learn (Home)", glyph: "learn", kind: "tab", key: "learn" },
  { id: "library", name: "Library", glyph: "library", kind: "tab", key: "library" },
  { id: "log", name: "Logbook", glyph: "log", kind: "tab", key: "log" },
  { id: "milestones", name: "Milestones", glyph: "wings-badge", kind: "sub", key: "milestones" },
  { id: "exam", name: "Mock Knowledge Test", glyph: "checklist", kind: "exam", key: "exam" },
  { id: "navigation", name: "Navigation", glyph: "compass", kind: "sub", key: "navigation" },
  { id: "practice", name: "Practice", glyph: "practice", kind: "tab", key: "practice" },
  { id: "preflight", name: "Preflight Checklist", glyph: "checklist", kind: "sub", key: "preflight" },
  { id: "profile", name: "Profile & Settings", glyph: "more", kind: "sub", key: "profile" },
  { id: "safety", name: "Safety Center", glyph: "safety", kind: "tab", key: "safety" },
  { id: "legal", name: "Terms, Privacy & Legal", glyph: "sign", kind: "sub", key: "legal" },
  { id: "goals", name: "Training Goals", glyph: "wings-badge", kind: "sub", key: "goals" },
  { id: "transcript", name: "Training Transcript", glyph: "checklist", kind: "sub", key: "transcript" },
  { id: "weather", name: "Weather", glyph: "cloud", kind: "sub", key: "weather" }
];
function featuresSorted() { var a = APP_FEATURES.slice(); a.sort(function (x, y) { return x.name < y.name ? -1 : (x.name > y.name ? 1 : 0); }); return a; }

function StarIcon(props) {
  var s = props.size || 20;
  return h("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: props.filled ? props.color : "none", stroke: props.color, strokeWidth: 1.6, strokeLinejoin: "round", "aria-hidden": "true" },
    h("path", { d: "M12 2.6l2.9 5.9 6.5.6-4.9 4.3 1.5 6.4L12 17.1 6.5 19.8l1.5-6.4L3.1 9.1l6.5-.6z" }));
}

function FeatureMenu(props) {
  var t = useT();
  if (!props.open) return null;
  var favs = props.favorites || [];
  function isFav(id) { return favs.indexOf(id) > -1; }
  var sorted = featuresSorted();
  var favList = sorted.filter(function (f) { return isFav(f.id); });
  function rowFor(f, keyp) {
    function go() { props.onGo(f); }
    function tog(e) { if (e && e.stopPropagation) e.stopPropagation(); props.onToggleFav(f.id); }
    var on = isFav(f.id);
    return h("div", { key: keyp + f.id, style: { display: "flex", alignItems: "center", gap: 6, padding: "11px 12px", marginBottom: 8, background: t.panel, border: "1px solid " + t.line, borderRadius: 14 } },
      h("button", { onClick: go, style: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 } },
        h("div", { style: { width: 38, height: 38, borderRadius: 10, background: t.panelHi, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, h(Glyph, { name: f.glyph, size: 20, color: t.sky })),
        h("div", { style: { fontSize: 15, fontWeight: 700, color: t.text, lineHeight: 1.25 } }, f.name)),
      h("button", { onClick: tog, "aria-label": on ? ("Unstar " + f.name) : ("Star " + f.name), style: { background: "transparent", border: "none", cursor: "pointer", padding: 7, flexShrink: 0, display: "inline-flex", alignItems: "center" } },
        h(StarIcon, { filled: on, color: on ? t.amber : t.textFaint, size: 21 })));
  }
  return h("div", { style: { position: "fixed", inset: 0, zIndex: 1000, background: t.bg, display: "flex", flexDirection: "column" } },
    h("div", { style: { background: t.bg2, borderBottom: "1px solid " + t.line } },
      h("div", { style: { maxWidth: 560, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 } },
        h("div", { style: { flex: 1, minWidth: 0 } },
          h("div", { style: { fontSize: 19, fontWeight: 900, color: t.text } }, "All features"),
          h("div", { style: { fontSize: 12, color: t.textDim, marginTop: 1 } }, "Tap to open \u00b7 star your favorites")),
        h("button", { onClick: props.onClose, "aria-label": "Close menu", style: { background: "transparent", border: "1px solid " + t.line, borderRadius: 10, cursor: "pointer", padding: "7px 9px", color: t.textDim, display: "inline-flex", alignItems: "center", flexShrink: 0 } }, h(Glyph, { name: "x", size: 18, color: t.textDim })))),
    h("div", { style: { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } },
      h("div", { style: { maxWidth: 560, margin: "0 auto", padding: "16px 18px 40px" } },
        favList.length
          ? h("div", { style: { marginBottom: 18 } }, h(SectionLabel, { style: { marginBottom: 10 } }, "\u2605 Favorites"), favList.map(function (f) { return rowFor(f, "fav-"); }))
          : h("div", { style: { marginBottom: 18, padding: "12px 14px", borderRadius: 12, background: t.panel, border: "1px dashed " + t.line, fontSize: 12.5, color: t.textDim, lineHeight: 1.5 } }, "Tap the star on any feature to pin it to the top for quick access."),
        h(SectionLabel, { style: { marginBottom: 10 } }, "All features (A\u2013Z)"),
        sorted.map(function (f) { return rowFor(f, "all-"); }))));
}


var ARCADE_XP_CAP = 120;
function arcadeXpToday(st) { if (!st.arcade) return 0; if (st.arcade.xpDay !== todayStr()) return 0; return st.arcade.xpToday || 0; }
function arcadeXpLeft(st) { var u = ARCADE_XP_CAP - arcadeXpToday(st); return u < 0 ? 0 : u; }
function arcadeCoins(st) { return (st.arcade && st.arcade.tickets) ? st.arcade.tickets : 0; }
function defaultState() {
  return {
    onboarded: false,
    profile: { name: "", pathways: [], goals: [], primaryPathway: "airplane", experience: "zero", ageBand: "", createdAt: todayStr() },
    xp: 0, streak: 0, longestStreak: 0, lastActive: null,
    preflight: { streak: 0, longest: 0, last: null, total: 0 },
    lessons: {}, weak: {}, log: [], endorsements: {}, personalMins: {}, surveys: {}, arcade: { tickets: 0, xpDay: todayStr(), xpToday: 0 }, exams: {}, examLog: [], activePathway: null, settings: { theme: "dark", goalsPromptDismissed: false, favorites: [] }
  };
}
function mergeState(loaded) {
  var d = defaultState();
  if (!loaded) return d;
  var s = {};
  for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) s[k] = d[k];
  for (var j in loaded) if (Object.prototype.hasOwnProperty.call(loaded, j)) s[j] = loaded[j];
  s.profile = {};
  for (var p in d.profile) if (Object.prototype.hasOwnProperty.call(d.profile, p)) s.profile[p] = d.profile[p];
  if (loaded.profile) for (var q in loaded.profile) if (Object.prototype.hasOwnProperty.call(loaded.profile, q)) s.profile[q] = loaded.profile[q];
  s.settings = { theme: "dark", goalsPromptDismissed: false, favorites: [] };
  if (loaded.settings && loaded.settings.theme) s.settings.theme = loaded.settings.theme;
  if (loaded.settings && loaded.settings.goalsPromptDismissed) s.settings.goalsPromptDismissed = true;
  if (loaded.settings && loaded.settings.favorites && loaded.settings.favorites.length) s.settings.favorites = loaded.settings.favorites.slice();
  if (!s.lessons) s.lessons = {};
  if (!s.weak) s.weak = {};
  if (!s.log) s.log = [];
  if (!s.endorsements) s.endorsements = {};
  if (!s.personalMins) s.personalMins = {};
  if (!s.surveys) s.surveys = {};
  if (!s.arcade) s.arcade = d.arcade;
  if (!s.exams) s.exams = {};
  if (!s.examLog) s.examLog = [];
  if (s.activePathway === undefined) s.activePathway = null;
  return s;
}

function TabBar(props) {
  var t = useT();
  var tabs = [
    { id: "learn", label: "Learn", glyph: "learn" },
    { id: "practice", label: "Practice", glyph: "practice" },
    { id: "log", label: "Logbook", glyph: "log" },
    { id: "library", label: "Library", glyph: "library" },
    { id: "arcade", label: "Arcade", glyph: "arcade" }
  ];
  return h("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 900, background: t.bg2, borderTop: "1px solid " + t.line } },
    h("div", { style: { maxWidth: 560, margin: "0 auto", display: "flex", padding: "8px 6px", paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))" } },
      tabs.map(function (tab) {
        var on = props.active === tab.id;
        function go() { props.onNav(tab.id); }
        return h("button", { key: tab.id, onClick: go, style: { flex: 1, background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0" } },
          h(Glyph, { name: tab.glyph, size: 23, color: on ? t.sky : t.textFaint }),
          h("div", { style: { fontSize: 10.5, fontWeight: on ? 800 : 600, color: on ? t.sky : t.textFaint, letterSpacing: 0.2 } }, tab.label));
      })));
}

function TopBar(props) {
  var t = useT();
  var li = levelInfo(props.xp);
  return h("div", { style: { position: "sticky", top: 0, zIndex: 800, background: t.bg + "F2", backdropFilter: "blur(8px)", borderBottom: "1px solid " + t.lineSoft } },
    h("div", { style: { maxWidth: 560, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 } },
      h(BrandLogo, { mark: true, w: 40, pad: 4, radius: 7, shadow: "none" }),
      h("div", { style: { flex: 1, minWidth: 0 } },
        h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
          h("div", { style: { fontSize: 12, fontWeight: 900, color: t.text, letterSpacing: 0.2 } }, "FLIGHT LEVEL " + li.level),
          h("div", { style: { flex: 1, maxWidth: 130 } }, h(Bar, { pct: li.pct, color: t.magenta, h: 6 }))),
        h("div", { style: { fontFamily: MONO, fontSize: 10.5, color: t.textFaint, marginTop: 2 } }, props.xp + " XP")),
      h("div", { style: { display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 99, background: props.streak > 0 ? (t.name === "dark" ? "rgba(242,183,5,0.12)" : "rgba(201,138,0,0.12)") : t.panel, border: "1px solid " + (props.streak > 0 ? t.amber : t.line) } },
        h(Glyph, { name: "flame", size: 16, color: props.streak > 0 ? t.amber : t.textFaint }),
        h("div", { style: { fontFamily: MONO, fontSize: 14, fontWeight: 800, color: props.streak > 0 ? t.amber : t.textFaint } }, props.streak)),
      h("button", { onClick: props.onMenu, "aria-label": "Open menu", style: { background: "transparent", border: "1px solid " + t.line, borderRadius: 11, cursor: "pointer", padding: "7px 9px", display: "inline-flex", alignItems: "center", flexShrink: 0 } }, h(Glyph, { name: "menu", size: 21, color: t.text }))));
}

function App() {
  var initState = useState(function () { return mergeState(loadState()); });
  var state = initState[0], setState = initState[1];
  var navState = useState({ screen: "learn", lesson: null, pool: null, cards: null, title: "", sub: null });
  var nav = navState[0], setNav = navState[1];
  var apState = useState(0); var setApTick = apState[1];
  var agreedS = useState(false); var agreed = agreedS[0], setAgreed = agreedS[1];
  var menuS = useState(false); var menuOpen = menuS[0], setMenuOpen = menuS[1];

  /* load the large airport directory in the background after the app is interactive */
  useEffect(function () {
    loadAirportsData();
    function bump() { setApTick(function (n) { return n + 1; }); }
    onAirportsChange(bump);
  }, []);

  /* persist */
  useEffect(function () { saveState(state); }, [state]);
  /* reconcile lapsed streak once on mount */
  useEffect(function () {
    setState(function (prev) {
      if (!prev.lastActive) return prev;
      var diff = dayDiff(prev.lastActive, todayStr());
      if (diff !== null && diff > 1 && prev.streak !== 0) {
        var ns = cloneState(prev); ns.streak = 0; return ns;
      }
      return prev;
    });
  }, []);
  /* reconcile lapsed preflight streak (keeps longest + total) */
  useEffect(function () {
    setState(function (prev) {
      if (!prev.preflight || !prev.preflight.last) return prev;
      var diff = dayDiff(prev.preflight.last, todayStr());
      if (diff !== null && diff > 1 && prev.preflight.streak !== 0) {
        var ns = cloneState(prev);
        ns.preflight = { streak: 0, longest: ns.preflight.longest, last: ns.preflight.last, total: ns.preflight.total };
        return ns;
      }
      return prev;
    });
  }, []);
  /* scroll to top on screen change */
  useEffect(function () { try { window.scrollTo(0, 0); } catch (e) {} }, [nav.screen, nav.lesson, nav.sub, nav.cards, nav.pool]);

  var theme = THEMES[state.settings && state.settings.theme === "light" ? "light" : "dark"];

  function completeOnboarding(profile) {
    setState(function (prev) {
      var ns = cloneState(prev);
      ns.profile = profile;
      ns.onboarded = true;
      return ns;
    });
    setNav({ screen: "learn", lesson: null, pool: null, cards: null, title: "", sub: null });
    setAgreed(true);
  }

  function applyQuiz(byLesson, markDone) {
    setState(function (prev) {
      var ns = cloneState(prev);
      var today = todayStr();
      var totalCorrect = 0, totalQ = 0;
      for (var lid in byLesson) {
        if (!Object.prototype.hasOwnProperty.call(byLesson, lid)) continue;
        var c = byLesson[lid].correct, tt = byLesson[lid].total;
        totalCorrect += c; totalQ += tt;
        var score = tt ? Math.round((c / tt) * 100) : 0;
        var rec = ns.lessons[lid] ? ns.lessons[lid] : { done: false, best: 0, attempts: 0, mastery: 0, last: null };
        rec.attempts = rec.attempts + 1;
        rec.last = today;
        rec.best = Math.max(rec.best, score);
        rec.mastery = score;
        if (markDone) { rec.done = true; if (!rec.doneAt) rec.doneAt = today; }
        ns.lessons[lid] = rec;
        if (score < 80) ns.weak[lid] = (ns.weak[lid] ? ns.weak[lid] : 0) + 1;
        else if (ns.weak[lid]) ns.weak[lid] = Math.max(0, ns.weak[lid] - 1);
      }
      var overall = totalQ ? Math.round((totalCorrect / totalQ) * 100) : 0;
      ns.xp = ns.xp + totalCorrect * 10 + (overall >= 80 ? 15 : 0);
      if (ns.lastActive !== today) {
        var diff = ns.lastActive ? dayDiff(ns.lastActive, today) : null;
        if (diff === 1) ns.streak = ns.streak + 1; else ns.streak = 1;
        ns.lastActive = today;
        if (ns.streak > ns.longestStreak) ns.longestStreak = ns.streak;
      }
      return ns;
    });
  }

  function earnArcade(tickets) {
    if (!tickets || tickets <= 0) return;
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.arcade) ns.arcade = { tickets: 0, xpDay: todayStr(), xpToday: 0 };
      var today = todayStr();
      if (ns.arcade.xpDay !== today) { ns.arcade.xpDay = today; ns.arcade.xpToday = 0; }
      ns.arcade.tickets = (ns.arcade.tickets ? ns.arcade.tickets : 0) + tickets;
      var left = ARCADE_XP_CAP - (ns.arcade.xpToday ? ns.arcade.xpToday : 0);
      if (left < 0) left = 0;
      var gain = tickets < left ? tickets : left;
      if (gain > 0) { ns.xp = ns.xp + gain; ns.arcade.xpToday = (ns.arcade.xpToday ? ns.arcade.xpToday : 0) + gain; }
      return ns;
    });
  }

  function recordExam(certId, correct, total, pct) {
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.exams) ns.exams = {};
      var rec = ns.exams[certId] ? ns.exams[certId] : { best: 0, last: 0, attempts: 0 };
      rec.attempts = rec.attempts + 1;
      rec.last = pct;
      if (pct > rec.best) rec.best = pct;
      ns.exams[certId] = rec;
      ns.xp = ns.xp + correct * 5 + (pct >= 70 ? 25 : 0);
      var today = todayStr();
      if (ns.lastActive !== today) {
        var diff = ns.lastActive ? dayDiff(ns.lastActive, today) : null;
        if (diff === 1) ns.streak = ns.streak + 1; else ns.streak = 1;
        ns.lastActive = today;
        if (ns.streak > ns.longestStreak) ns.longestStreak = ns.streak;
      }
      return ns;
    });
  }

  function logExam(attempt) {
    if (!attempt) return;
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.examLog) ns.examLog = [];
      var exists = false;
      for (var i = 0; i < ns.examLog.length; i++) { if (ns.examLog[i].id === attempt.id) exists = true; }
      if (!exists) ns.examLog.unshift(attempt);
      if (ns.examLog.length > 30) ns.examLog = ns.examLog.slice(0, 30);
      return ns;
    });
  }
  function deleteExamLog(id) {
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.examLog) { ns.examLog = []; return ns; }
      var keep = [];
      for (var i = 0; i < ns.examLog.length; i++) { if (ns.examLog[i].id !== id) keep.push(ns.examLog[i]); }
      ns.examLog = keep;
      return ns;
    });
  }

  function chooseActivePathway(id) {
    setState(function (prev) { var ns = cloneState(prev); ns.activePathway = id; return ns; });
  }
  function beginPathway(id) { chooseActivePathway(id); goTab("learn"); }

  function patchProfile(patch) {
    setState(function (prev) {
      var ns = cloneState(prev);
      if (patch.profileName !== undefined) ns.profile.name = patch.profileName;
      if (patch.pathways !== undefined) ns.profile.pathways = patch.pathways;
      if (patch.primaryPathway !== undefined) ns.profile.primaryPathway = patch.primaryPathway;
      if (patch.ageBand !== undefined) ns.profile.ageBand = patch.ageBand;
      if (patch.theme !== undefined) ns.settings.theme = patch.theme;
      return ns;
    });
  }
  function applyFoundPath(id) {
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.profile.pathways) ns.profile.pathways = [];
      if (ns.profile.pathways.indexOf(id) === -1) ns.profile.pathways.push(id);
      ns.profile.primaryPathway = id;
      return ns;
    });
    goTab("learn");
  }
  function saveGoals(goalsArr) {
    setState(function (prev) { var ns = cloneState(prev); ns.profile.goals = goalsArr; return ns; });
    goTab("learn");
  }
  function dismissGoalsPrompt() {
    setState(function (prev) { var ns = cloneState(prev); if (!ns.settings) ns.settings = {}; ns.settings.goalsPromptDismissed = true; return ns; });
  }
  function setEndorsement(id, status) {
    setState(function (prev) { var ns = cloneState(prev); ns.endorsements[id] = { status: status }; return ns; });
  }
  function savePersonalMins(pm) {
    setState(function (prev) { var ns = cloneState(prev); ns.personalMins = pm; return ns; });
  }
  function saveSurvey(lessonId, survey) {
    if (!lessonId || !survey) return;
    var any = (survey.confidence || survey.clarity || survey.review || (survey.comment && survey.comment.trim() !== ""));
    if (!any) return;
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.surveys) ns.surveys = {};
      ns.surveys[lessonId] = {
        confidence: survey.confidence || 0,
        clarity: survey.clarity || 0,
        review: survey.review ? true : false,
        comment: survey.comment ? survey.comment : "",
        at: todayStr()
      };
      if (survey.review) { ns.weak[lessonId] = (ns.weak[lessonId] ? ns.weak[lessonId] : 0) + 1; }
      return ns;
    });
  }
  function logPreflight() {
    setState(function (prev) {
      var ns = cloneState(prev);
      var today = todayStr();
      var p = ns.preflight ? ns.preflight : { streak: 0, longest: 0, last: null, total: 0 };
      if (p.last === today) return ns;
      var diff = p.last ? dayDiff(p.last, today) : null;
      var newStreak = diff === 1 ? p.streak + 1 : 1;
      var newLongest = newStreak > p.longest ? newStreak : p.longest;
      ns.preflight = { streak: newStreak, longest: newLongest, last: today, total: p.total + 1 };
      return ns;
    });
  }
  function addLog(entry) {
    setState(function (prev) { var ns = cloneState(prev); ns.log = ns.log.concat([entry]); return ns; });
  }
  function deleteLog(id) {
    setState(function (prev) { var ns = cloneState(prev); ns.log = ns.log.filter(function (e) { return e.id !== id; }); return ns; });
  }
  function resetAll() {
    var fresh = defaultState();
    setState(fresh);
    setNav({ screen: "learn", lesson: null, pool: null, cards: null, title: "", sub: null });
  }

  /* navigation helpers */
  function goTab(id) { setNav({ screen: id, lesson: null, pool: null, cards: null, title: "", sub: null }); }
  function goExam() { setNav({ screen: "exam", lesson: null, pool: null, cards: null, title: "", sub: null }); }
  function openLesson(id) { setNav({ screen: "lesson", lesson: id, pool: null, cards: null, title: "", sub: null }); }
  function startLessonQuiz(id) {
    var pool = [];
    LESSONS[id].quiz.forEach(function (q) { pool.push({ lessonId: id, q: q }); });
    setNav({ screen: "quiz", lesson: id, pool: pool, cards: null, title: "", sub: null });
  }
  function startPool(pool, title) {
    if (!pool || pool.length === 0) return;
    setNav({ screen: "quiz", lesson: null, pool: pool, cards: null, title: title, sub: null });
  }
  function startFlashcards(cards) {
    if (!cards || cards.length === 0) return;
    setNav({ screen: "flashcards", lesson: null, pool: null, cards: cards, title: "", sub: null });
  }
  function openSub(name) { setNav({ screen: "more", lesson: null, pool: null, cards: null, title: "", sub: name }); }
  function closeSub() { setNav({ screen: "learn", lesson: null, pool: null, cards: null, title: "", sub: null }); }
  function goFeature(f) {
    setMenuOpen(false);
    if (f.kind === "exam") { goExam(); }
    else if (f.kind === "sub") { openSub(f.key); }
    else { goTab(f.key); }
  }
  function toggleFavorite(id) {
    setState(function (prev) {
      var ns = cloneState(prev);
      if (!ns.settings) ns.settings = { theme: "dark", goalsPromptDismissed: false, favorites: [] };
      if (!ns.settings.favorites) ns.settings.favorites = [];
      var idx = ns.settings.favorites.indexOf(id);
      if (idx > -1) ns.settings.favorites.splice(idx, 1); else ns.settings.favorites.push(id);
      return ns;
    });
  }
  function openReference(query) { setNav({ screen: "reference", lesson: null, q: query ? query : "", pool: null, cards: null, title: "", sub: null }); }

  function onQuizFinish(byLesson) {
    var markDone = nav.lesson ? true : false;
    applyQuiz(byLesson, markDone);
    if (nav.lesson) setNav({ screen: "lesson", lesson: nav.lesson, pool: null, cards: null, title: "", sub: null });
    else setNav({ screen: "practice", lesson: null, pool: null, cards: null, title: "", sub: null });
  }
  function onQuizNextLesson(byLesson, correct, total, survey) {
    if (survey && nav.lesson) saveSurvey(nav.lesson, survey);
    applyQuiz(byLesson, true);
    var nid = nextLessonId(state, nav.lesson);
    if (nid) { openLesson(nid); } else { goTab("learn"); }
  }
  function onQuizRoadmap(byLesson, correct, total, survey) {
    if (survey && nav.lesson) saveSurvey(nav.lesson, survey);
    applyQuiz(byLesson, nav.lesson ? true : false);
    goTab("learn");
  }

  /* ---- render ---- */
  var body;
  var focused = nav.screen === "lesson" || nav.screen === "quiz" || nav.screen === "flashcards" || nav.screen === "reference" || nav.screen === "exam";
  var inSub = nav.screen === "more" && nav.sub;

  if (!state.onboarded) {
    return h(ThemeContext.Provider, { value: theme },
      h("div", { style: { background: theme.bg, minHeight: "100vh" } }, h(Onboarding, { onComplete: completeOnboarding })));
  }

  if (!agreed) {
    return h(ThemeContext.Provider, { value: theme }, h(AgreementGate, { onAgree: function () { setAgreed(true); } }));
  }

  if (nav.screen === "lesson") body = h(LessonView, { lessonId: nav.lesson, state: state, onBack: function () { goTab("learn"); }, onStartQuiz: startLessonQuiz });
  else if (nav.screen === "quiz") {
    var quizProps = { pool: nav.pool, title: nav.title, state: state, onFinish: onQuizFinish, onBack: function () { if (nav.lesson) setNav({ screen: "lesson", lesson: nav.lesson, pool: null, cards: null, title: "", sub: null }); else goTab("practice"); } };
    if (nav.lesson) {
      var qNid = nextLessonId(state, nav.lesson);
      quizProps.onNextLesson = onQuizNextLesson;
      quizProps.onRoadmap = onQuizRoadmap;
      quizProps.nextLessonId = qNid;
      quizProps.nextTitle = (qNid && LESSONS[qNid]) ? LESSONS[qNid].title : "";
    }
    body = h(QuizEngine, quizProps);
  }
  else if (nav.screen === "flashcards") body = h(FlashcardView, { cards: nav.cards, onBack: function () { goTab("practice"); } });
  else if (nav.screen === "reference") body = h(ReferenceScreen, { state: state, initialQuery: nav.q, onOpenLesson: openLesson, onBack: function () { goTab("learn"); } });
  else if (nav.screen === "practice") body = h(PracticeScreen, { state: state, onStartPool: startPool, onFlashcards: startFlashcards, onOpenDeck: function () { openSub("flashcards"); }, onOpenExam: goExam });
  else if (nav.screen === "exam") body = h(ExamScreen, { state: state, onRecord: recordExam, onLogExam: logExam, onStudyMissed: startPool, onOpenLog: function () { openSub("examlog"); }, examLog: state.examLog, onBack: function () { goTab("practice"); } });
  else if (nav.screen === "log") body = h(LogbookTab, { state: state, onAdd: addLog, onDelete: deleteLog, onOpenLesson: openLesson, onOpenSub: openSub });
  else if (nav.screen === "library") body = h(LibraryScreen, { state: state, arcade: { onEarn: earnArcade, coins: arcadeCoins(state), xpLeft: arcadeXpLeft(state), cap: ARCADE_XP_CAP }, onChoosePathway: chooseActivePathway, onBeginPathway: beginPathway });
  else if (nav.screen === "arcade") body = h(ArcadeScreen, { arcade: { onEarn: earnArcade, coins: arcadeCoins(state), xpLeft: arcadeXpLeft(state), cap: ARCADE_XP_CAP } });
  else if (nav.screen === "more") {
    if (nav.sub === "endorsements") body = h(EndorsementsView, { state: state, onSet: setEndorsement, onBack: closeSub });
    else if (nav.sub === "glossary") body = h(GlossaryScreen, { onBack: closeSub });
    else if (nav.sub === "pronounce") body = h(PronunciationScreen, { onBack: closeSub });
    else if (nav.sub === "signs") body = h(SignsScreen, { onBack: closeSub });
    else if (nav.sub === "resources") body = h(ResourceLibrary, { onBack: closeSub });
    else if (nav.sub === "legal") body = h(LegalScreen, { onBack: closeSub });
    else if (nav.sub === "milestones") body = h(MilestonesView, { state: state, onBack: closeSub });
    else if (nav.sub === "transcript") body = h(TranscriptView, { state: state, onBack: closeSub });
    else if (nav.sub === "examlog") body = h(ExamLogScreen, { state: state, onBack: closeSub, onStudyMissed: startPool, onDelete: deleteExamLog });
    else if (nav.sub === "credentials") body = h(CredentialsView, { onBack: closeSub });
    else if (nav.sub === "career") body = h(CareerView, { state: state, onBack: closeSub, onChoose: chooseActivePathway, onBegin: beginPathway });
    else if (nav.sub === "airportops") body = h(AirportOpsScreen, { onBack: closeSub });
    else if (nav.sub === "weather") body = h(WeatherScreen, { onBack: closeSub });
    else if (nav.sub === "navigation") body = h(NavScreen, { onBack: closeSub });
    else if (nav.sub === "airports") body = h(AirportDirectoryScreen, { onBack: closeSub });
    else if (nav.sub === "preflight") body = h(PreflightScreen, { state: state, initialTrack: "fly", onLogPreflight: logPreflight, onStartStudying: function () { goTab("learn"); }, onBack: closeSub });
    else if (nav.sub === "preflight-study") body = h(PreflightScreen, { state: state, initialTrack: "study", onLogPreflight: logPreflight, onStartStudying: function () { goTab("learn"); }, onBack: closeSub });
    else if (nav.sub === "pathfinder") body = h(PathFinderScreen, { onApply: applyFoundPath, onBack: closeSub });
    else if (nav.sub === "goals") body = h(TrainingGoalsScreen, { state: state, onSave: saveGoals, onBack: closeSub });
    else if (nav.sub === "aircraft") body = h(AircraftScreen, { onBack: closeSub });
    else if (nav.sub === "flashcards") body = h(FlashcardsScreen, { state: state, onBack: closeSub });
    else if (nav.sub === "arcade") body = h(ArcadeScreen, { onBack: closeSub, arcade: { onEarn: earnArcade, coins: arcadeCoins(state), xpLeft: arcadeXpLeft(state), cap: ARCADE_XP_CAP } });
    else if (nav.sub === "history") body = h(HistoryScreen, { onBack: closeSub });
    else if (nav.sub === "hangar") body = h(HangarView, { state: state, onBack: closeSub });
    else if (nav.sub === "profile") body = h(ProfileView, { state: state, onPatch: patchProfile, onReset: resetAll, onBack: closeSub, onOpenLegal: function () { openSub("legal"); } });
    else body = h(MoreScreen, { onOpen: openSub, state: state, onGoLibrary: function () { goTab("library"); } });
  } else {
    body = h(LearnScreen, { state: state, onOpenLesson: openLesson, onGoSafety: function () { goTab("safety"); }, onOpenReference: openReference, onOpenPreflight: function () { openSub("preflight-study"); }, onOpenGoals: function () { openSub("goals"); }, onDismissGoalsPrompt: dismissGoalsPrompt, onOpenArcade: function () { goTab("arcade"); }, onOpenCareer: function () { openSub("career"); }, onUnpinPathway: function () { chooseActivePathway(null); } });
  }

  /* safety is reachable from Learn but not a bottom tab; route it here */
  if (nav.screen === "safety") body = h(SafetyScreen, { state: state, onSavePersonalMins: savePersonalMins });

  var showTop = !focused && !inSub;
  var showTabs = !focused && !inSub;
  var activeTab = nav.screen;
  if (nav.screen === "safety") activeTab = "learn";

  return h(ThemeContext.Provider, { value: theme },
    h("div", { style: { background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: SANS } },
      showTop ? h(TopBar, { xp: state.xp, streak: state.streak, onMenu: function () { setMenuOpen(true); } }) : null,
      /* back affordance for safety (since it's not a tab) */
      nav.screen === "safety" ? h("div", { style: { maxWidth: 560, margin: "0 auto", padding: "12px 18px 0" } },
        h("button", { onClick: function () { goTab("learn"); }, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: theme.textDim, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0 } },
          h(Glyph, { name: "back", size: 18, color: theme.textDim }), "Back to Learn")) : null,
      h("div", { style: { maxWidth: 560, margin: "0 auto", padding: focused ? "18px 18px 40px" : "18px 18px " + (showTabs ? "96px" : "40px") } }, body),
      showTabs ? h(TabBar, { active: activeTab, onNav: goTab }) : null,
      h(FeatureMenu, { open: menuOpen, onClose: function () { setMenuOpen(false); }, favorites: (state.settings && state.settings.favorites) ? state.settings.favorites : [], onToggleFav: toggleFavorite, onGo: goFeature })));
}

/* ================================ MOUNT ================================ */
(function () {
  if (typeof window !== "undefined" && window.__fpaMountStarted) { return; }
  if (typeof window !== "undefined") { window.__fpaMountStarted = true; }
  var mount = document.getElementById("root");
  if (!mount) { mount = document.createElement("div"); mount.id = "root"; document.body.appendChild(mount); }
  /* Resolve ReactDOM defensively: a bare reference to an undeclared global
     throws a ReferenceError, so probe with typeof and fall back to window. */
  var RD = null;
  if (typeof ReactDOM !== "undefined") { RD = ReactDOM; }
  else if (typeof window !== "undefined" && window.ReactDOM) { RD = window.ReactDOM; }
  /* Some React 18 bundles expose the client API on React itself. */
  var RootApi = (RD && RD.createRoot) ? RD.createRoot : ((typeof React !== "undefined" && React.createRoot) ? React.createRoot : null);
  var LegacyRender = (RD && RD.render) ? RD.render : null;
  function clearBootError() {
    var e = document.getElementById("fpa-booterror");
    if (e && e.parentNode) { e.parentNode.removeChild(e); }
  }
  function showBootError() {
    /* Do not show if the app already rendered into #root. */
    var r = document.getElementById("root");
    if (r && r.children && r.children.length > 0) { return; }
    if (document.getElementById("fpa-booterror")) { return; }
    var d = document.createElement("div");
    d.id = "fpa-booterror";
    d.setAttribute("style", "font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:48px auto;padding:20px 22px;border:1px solid #d9d2c4;border-radius:14px;line-height:1.55;color:#333;background:#fff");
    d.innerHTML = '<div style="font-weight:800;font-size:16px;margin-bottom:6px">Can\u2019t start: ReactDOM was not found</div>'
      + 'This build expects <b>React</b> and <b>ReactDOM</b> to be available as globals before it runs. If you are hosting it yourself, load the React and ReactDOM UMD scripts ahead of this file, then reload.';
    document.body.appendChild(d);
  }
  function doRender() {
    if (RootApi) { clearBootError(); RootApi(mount).render(h(App, null)); }
    else if (LegacyRender) { clearBootError(); LegacyRender(h(App, null), mount); }
    else { showBootError(); }
  }
  var W = (typeof window !== "undefined") ? window : null;
  /* If a boot splash is staging the launch, hand it a boot function and tell
     it we are compiled and ready; it renders us when the user taps through.
     Otherwise (a plain harness), render immediately as before. */
  if (W && W.__fpaDeferBoot) {
    W.__fpaBoot = function () { if (W.__fpaBooted) { return; } W.__fpaBooted = true; doRender(); };
    if (typeof W.__fpaReady === "function") { W.__fpaReady(); }
    setTimeout(function () {
      if (!W.__fpaBooted) {
        W.__fpaBoot();
        var bs = document.getElementById("fpa-bootsplash");
        if (bs && bs.parentNode) { bs.parentNode.removeChild(bs); }
      }
    }, 45000);
  } else {
    doRender();
  }
})();
