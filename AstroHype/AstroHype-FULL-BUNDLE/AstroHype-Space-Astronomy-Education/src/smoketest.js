const fs = require("fs");
const { JSDOM } = require("jsdom");

const file = "/mnt/user-data/outputs/AstroHype Space & Astronomy Education.html";
const html = fs.readFileSync(file, "utf8");

const errors = [];
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
    window.cancelAnimationFrame = (id) => clearTimeout(id);
    window.matchMedia = window.matchMedia || function () {
      return { matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} };
    };
    window.scrollTo = function () {};
    const ls = {};
    Object.defineProperty(window, "localStorage", { value: {
      getItem: (k) => (k in ls ? ls[k] : null),
      setItem: (k, v) => { ls[k] = String(v); },
      removeItem: (k) => { delete ls[k]; },
      clear: () => { for (const k in ls) delete ls[k]; }
    }});
  }
});

const w = dom.window;
w.addEventListener("error", (e) => errors.push("window error: " + (e.error ? (e.error.stack || e.error.message) : e.message)));

function report(tag) {
  const lessons = w.__SEA_LESSONS__ ? Object.keys(w.__SEA_LESSONS__).length : 0;
  const meta = w.__SEA_SPECIES_META__ ? Object.keys(w.__SEA_SPECIES_META__).length : 0;
  const art = w.SEA_ART ? Object.keys(w.SEA_ART).length : 0;
  const root = w.document.getElementById("root");
  const rootLen = root ? root.innerHTML.length : -1;
  console.log(`[${tag}] lessons=${lessons} meta=${meta} art=${art} reactLoaded=${!!w.React} reactDOMLoaded=${!!w.ReactDOM} rootHTML=${rootLen}`);
  return { lessons, rootLen };
}

setTimeout(() => {
  report("after-load");
  // trigger boot (splash normally waits for button click)
  try {
    if (typeof w.__seaBoot === "function") { w.__seaBoot(); }
    else { console.log("no __seaBoot found"); }
  } catch (e) { errors.push("boot threw: " + (e.stack || e.message)); }

  setTimeout(() => {
    const r = report("after-boot");
    // Inspect a slice of rendered text
    const root = w.document.getElementById("root");
    const txt = root ? (root.textContent || "").replace(/\s+/g, " ").trim().slice(0, 220) : "";
    console.log("ROOT TEXT SAMPLE:", JSON.stringify(txt));
    console.log("ERROR COUNT:", errors.length);
    errors.slice(0, 8).forEach((e, i) => console.log("ERR" + i + ":", String(e).slice(0, 300)));
    const ok = r.lessons === 501 && r.rootLen > 200 && errors.length === 0;
    console.log(ok ? "SMOKE TEST PASSED" : "SMOKE TEST: see above");
    process.exit(ok ? 0 : 1);
  }, 900);
}, 700);
