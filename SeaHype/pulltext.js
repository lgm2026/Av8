const fs = require("fs"), vm = require("vm");
const win = {}; const ctx = { window: win, console }; vm.createContext(ctx);
["seahype-lessons.js","seahype-lessons-extra.js","seahype-lessons-extra2.js","seahype-lessons-extra3.js","seahype-lessons-extra4.js","seahype-curriculum.js"].forEach(f => { try { vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); } catch (e) {} });
const L = win.__SEA_LESSONS__ || {};
const want = process.argv.slice(2);
for (const id of want) {
  const o = L[id]; if (!o) { console.log("== " + id + " NOT FOUND =="); continue; }
  console.log("\n===== " + id + " | track=" + o.track + " | title: " + o.title + " =====");
  (o.explain || []).forEach((p, i) => console.log("[E" + i + "] " + p));
  if (o.why) console.log("[WHY] " + o.why);
  if (o.hook) console.log("[HOOK] " + o.hook);
  if (o.misconception) console.log("[MISC] " + o.misconception);
}
