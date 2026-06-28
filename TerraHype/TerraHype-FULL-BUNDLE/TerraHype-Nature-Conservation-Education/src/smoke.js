// Headless smoke test: load the built HTML in jsdom, verify data integrity,
// boot the app, and confirm it mounts real content.
var fs = require("fs");
var path = require("path");
var JSDOM = require("jsdom").JSDOM;

var OUT = "/mnt/user-data/outputs/TerraHype Nature Conservation Education.html";
var html = fs.readFileSync(OUT, "utf8");

var fails = [];
function ok(cond, msg) { if (!cond) fails.push(msg); }

var dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://localhost/"
});
var win = dom.window;

// give inline scripts a tick
setTimeout(function () {
  try {
    var L = win.__SEA_LESSONS__ || {};
    var ids = Object.keys(L);
    ok(ids.length >= 40, "expected >=40 lessons, got " + ids.length);

    var qTotal = 0, qIssues = 0, lessonsNoQuiz = 0, srcIssues = 0;
    var SRC = {
      usgs:1,usfs:1,nps:1,usfws:1,nrcs:1,epa:1,usda:1,cornell:1,audubon:1,
      nwf:1,iucn:1,si:1,eol:1,natgeo:1,nasa:1,noaa:1
    };
    ids.forEach(function (id) {
      var l = L[id];
      if (!l.title) qIssues++;
      if (l.src && !SRC[l.src]) srcIssues++;
      // every lesson should have at least one external source link with a url
      if (!l.sources || !l.sources.length) srcIssues++;
      else {
        l.sources.forEach(function (s) { if (!s.url || s.url.indexOf("http") !== 0) srcIssues++; });
      }
      var qz = l.quiz || [];
      if (!qz.length) { lessonsNoQuiz++; }
      qz.forEach(function (q) {
        qTotal++;
        if (q.type === "mc") {
          if (!q.choices || !q.choices.length) qIssues++;
          else if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.choices.length) qIssues++;
        } else if (q.type === "tf") {
          if (typeof q.answer !== "boolean") qIssues++;
        } else if (q.type === "fill") {
          if (typeof q.answer !== "string" || !q.answer.length) qIssues++;
        } else {
          qIssues++;
        }
        if (!q.q || !q.why) qIssues++;
      });
    });
    ok(lessonsNoQuiz === 0, lessonsNoQuiz + " lesson(s) have no quiz");
    ok(qIssues === 0, qIssues + " quiz integrity issue(s)");
    ok(srcIssues === 0, srcIssues + " source/citation issue(s)");

    // content datasets present
    ok((win.__SEA_GLOSSARY__ || []).length >= 30, "glossary too small");
    ok((win.__SEA_PRON__ || []).length >= 10, "pronunciation too small");
    ok((win.__SEA_TAXONOMY__ || []).length >= 8, "taxonomy too small");
    ok((win.__SEA_CONCEPTS__ || []).length >= 5, "concepts too small");
    ok((win.__SEA_CAREERS__ || []).length >= 5, "careers too small");
    ok((win.__SEA_HISTORY__ || []).length >= 5, "history too small");
    ok((win.__SEA_MILESTONES__ || []).length >= 5, "milestones too small");

    // boot the app (boot is deferred behind the splash)
    ok(typeof win.__seaBoot === "function", "window.__seaBoot was not defined by the app");
    if (typeof win.__seaBoot === "function") win.__seaBoot();

    setTimeout(function () {
      var root = win.document.getElementById("root");
      ok(!!root, "no #root element");
      var hasKids = root && root.children && root.children.length > 0;
      ok(hasKids, "#root has no children after boot");
      var txt = root ? (root.textContent || "") : "";
      ok(txt.indexOf("trail") > -1 || txt.indexOf("Welcome") > -1 || txt.indexOf("TerraHype") > -1 || txt.length > 80, "mounted content looks empty");
      var noBootErr = !win.document.getElementById("sea-booterror");
      ok(noBootErr, "boot error panel was shown");

      console.log("lessons:", ids.length, "| quiz questions:", qTotal, "| quiz issues:", qIssues, "| source issues:", srcIssues, "| #root children:", root ? root.children.length : 0, "| mounted chars:", txt.length);
      if (fails.length) {
        console.log("SMOKE FAIL:");
        fails.forEach(function (f) { console.log("  - " + f); });
        process.exit(1);
      } else {
        console.log("SMOKE PASS OK");
        process.exit(0);
      }
    }, 400);
  } catch (e) {
    console.log("SMOKE EXCEPTION:", e && e.stack ? e.stack : e);
    process.exit(1);
  }
}, 400);
