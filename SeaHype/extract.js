const fs = require("fs");
const vm = require("vm");
const win = {};
const ctx = { window: win, console: console };
vm.createContext(ctx);
const files = ["seahype-lessons.js","seahype-lessons-extra.js","seahype-lessons-extra2.js","seahype-lessons-extra3.js","seahype-lessons-extra4.js","seahype-curriculum.js","seahype-queries.js","seahype-content.js","seahype-extra-content.js","seahype-pathmeta.js"];
for (const f of files) { try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); } catch (e) { console.log("ERR in " + f + ": " + e.message); } }
// report which globals exist and sizes
const keys = Object.keys(win).filter(k => k.indexOf("__SEA") === 0);
console.log("globals:");
for (const k of keys) {
  const v = win[k];
  let sz = Array.isArray(v) ? v.length : (v && typeof v === "object" ? Object.keys(v).length : typeof v);
  console.log("  " + k + " = " + (Array.isArray(v) ? "array[" + sz + "]" : (typeof v === "object" ? "obj{" + sz + "}" : sz)));
}
const L = win.__SEA_LESSONS__ || {};
const ids = Object.keys(L);
console.log("\n__SEA_LESSONS__ count:", ids.length);
if (ids.length) {
  const sample = L[ids[0]];
  console.log("sample lesson fields:", Object.keys(sample).join(", "));
  // reference coverage
  let withSources = 0, withSrc = 0, withNeither = 0; const noRef = [];
  for (const id of ids) { const o = L[id]; const hasS = Array.isArray(o.sources) && o.sources.length > 0; const hasK = !!o.src; if (hasS) withSources++; if (hasK) withSrc++; if (!hasS && !hasK) { withNeither++; if (noRef.length < 12) noRef.push(id); } }
  console.log("with sources[]:", withSources, "| with src key:", withSrc, "| with NEITHER:", withNeither);
  if (noRef.length) console.log("  no-reference sample:", noRef.join(", "));
}
// also check the curriculum/units extra structure for species lessons
if (win.__SEA_UNITS_EXTRA__) { const u = win.__SEA_UNITS_EXTRA__; console.log("\n__SEA_UNITS_EXTRA__:", Array.isArray(u) ? "array[" + u.length + "]" : Object.keys(u).length); }
if (win.__SEA_SPECIES_META__) { const m = win.__SEA_SPECIES_META__; const mk = Object.keys(m); console.log("__SEA_SPECIES_META__ count:", mk.length, "| sample fields:", Object.keys(m[mk[0]]).join(",")); }

// ---- verify source URLs + dump text for readability ----
var badUrls = [], allText = [], dump = [];
for (var i = 0; i < ids.length; i++) {
  var id = ids[i], o = L[id];
  var ss = o.sources || [];
  for (var j = 0; j < ss.length; j++) { var u = ss[j].url || ""; if (!/^https?:\/\/.+\..+/.test(u)) badUrls.push(id + ":" + JSON.stringify(u)); }
  var ex = (o.explain || []).join(" ");
  dump.push({ id: id, track: o.track, level: o.level, text: ex });
}
console.log("\nsources with invalid/placeholder URL:", badUrls.length);
if (badUrls.length) console.log("  " + badUrls.slice(0, 10).join("  "));
// unique domains used
var domains = {};
for (var a = 0; a < ids.length; a++) { var sarr = L[ids[a]].sources || []; for (var b = 0; b < sarr.length; b++) { var m = (sarr[b].url || "").match(/^https?:\/\/([^\/]+)/); if (m) { var d = m[1].replace(/^www\./, ""); domains[d] = (domains[d] || 0) + 1; } } }
var dom2 = Object.keys(domains).map(function (d) { return [d, domains[d]]; }).sort(function (x, y) { return y[1] - x[1]; });
console.log("top source domains:", dom2.slice(0, 12).map(function (p) { return p[0] + "(" + p[1] + ")"; }).join(", "));
fs.writeFileSync("/tmp/lesson_text.json", JSON.stringify(dump));
console.log("\nwrote /tmp/lesson_text.json with", dump.length, "lessons");
