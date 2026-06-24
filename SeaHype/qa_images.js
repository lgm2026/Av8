var fs = require("fs");
var { JSDOM } = require("jsdom");
var html = fs.readFileSync("/mnt/user-data/outputs/index.html", "utf8");
var seed = {
  onboarded: true,
  xp: 120,
  streak: { days: 3 },
  lessons: { "sea-intro": { done: true, best: 90 } },
  profile: { name: "Dustin" },
  theme: "dark",
};
var dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  beforeParse(win) {
    try {
      win.localStorage.setItem("seahype_marinebio_v1", JSON.stringify(seed));
    } catch (e) {}
    Object.defineProperty(win, "innerWidth", {
      value: 420,
      configurable: true,
    });
    win.scrollTo = function () {};
    var c = win.HTMLCanvasElement.prototype;
    c.getContext = function () {
      return null;
    };
  },
});
var win = dom.window,
  doc = win.document;
function txtBtn(label) {
  return Array.from(doc.querySelectorAll("button")).find(function (b) {
    return b.textContent.trim() === label;
  });
}
setTimeout(function () {
  if (win.__seaBoot) win.__seaBoot();
  setTimeout(function () {
    var art = win.SEA_ART ? Object.keys(win.SEA_ART).length : 0;
    var shells = win.__SEA_SHELLS__ ? win.__SEA_SHELLS__.length : 0;
    console.log("SEA_ART keys:", art, "| shells data:", shells);
    var homeImgs = doc.querySelectorAll('[role="img"]');
    var withSvg = Array.from(homeImgs).filter(function (d) {
      return d.querySelector("svg");
    }).length;
    console.log(
      "HOME role=img:",
      homeImgs.length,
      "| containing <svg>:",
      withSvg,
    );
    // go to Library
    var lib = txtBtn("Library");
    if (lib) {
      lib.click();
    }
    setTimeout(function () {
      var shTab = txtBtn("Shells");
      if (shTab) {
        shTab.click();
      }
      setTimeout(function () {
        var imgsAll = doc.querySelectorAll('[role="img"]');
        console.log("SHELLS tab (All) role=img thumbnails:", imgsAll.length);
        // region filter buttons present?
        var allReg = txtBtn("All regions"),
          pac = txtBtn("Pacific"),
          atl = txtBtn("Atlantic");
        console.log(
          "region buttons present? All:",
          !!allReg,
          "Atlantic:",
          !!atl,
          "Pacific:",
          !!pac,
        );
        if (pac) {
          pac.click();
        }
        setTimeout(function () {
          var imgsPac = doc.querySelectorAll('[role="img"]');
          console.log(
            "SHELLS tab (Pacific) thumbnails:",
            imgsPac.length,
            "(expect ~4)",
          );
          var bodyText = doc.getElementById("root").textContent;
          console.log(
            "Pacific view mentions a known Pacific shell (mussel/limpet/sand dollar)?",
            /mussel|limpet|sand dollar/i.test(bodyText),
          );
          console.log("QA DONE");
        }, 120);
      }, 120);
    }, 120);
  }, 260);
}, 260);
var errs = 0;
win.addEventListener("error", function (e) {
  if (!/getContext|scrollTo|Not implemented/.test(String(e.message))) {
    errs++;
    console.log("PAGE ERROR:", e.message);
  }
});
setTimeout(function () {
  console.log("uncaught errors (filtered):", errs);
}, 1200);
