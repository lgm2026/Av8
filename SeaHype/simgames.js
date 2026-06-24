const fs = require("fs");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync("/mnt/user-data/outputs/index.html", "utf8");

const errs = [];
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://x.test/",
  virtualConsole: new (require("jsdom").VirtualConsole)().on(
    "jsdomError",
    (e) => errs.push(e.message),
  ),
  beforeParse(win) {
    win.scrollTo = () => {};
    win.HTMLCanvasElement.prototype.getContext = () => null;
    win.fetch = () => Promise.reject(new Error("no net"));
  },
});

setTimeout(() => {
  const win = dom.window;
  const SPECS = win.ARCADE_SPECS;
  if (!SPECS) {
    console.log("FAIL: ARCADE_SPECS not exposed on window");
    process.exit(1);
  }
  console.log("specs found:", SPECS.length);

  function finiteWalk(o, path, bad) {
    if (o == null) return;
    if (typeof o === "number") {
      if (!isFinite(o)) bad.push(path);
      return;
    }
    if (typeof o !== "object") return;
    if (Array.isArray(o)) {
      for (let i = 0; i < o.length; i++)
        finiteWalk(o[i], path + "[" + i + "]", bad);
      return;
    }
    for (const k in o) {
      if (Object.prototype.hasOwnProperty.call(o, k))
        finiteWalk(o[k], path + "." + k, bad);
    }
  }

  function makeApi(spec) {
    const W = spec.W || 160,
      H = spec.H || 240;
    const st = {
      score: 0,
      lives: spec.lives || 1,
      dead: false,
      best: 0,
      died: false,
    };
    const input = {
      l: false,
      r: false,
      u: false,
      d: false,
      fire: false,
      px: -1,
      py: -1,
      pdown: false,
    };
    const api = {
      W,
      H,
      input,
      dt: 1,
      frame: 0,
      px() {},
      clear() {},
      text() {},
      circle() {},
      rnd: Math.random,
      rndInt: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
      pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
      addScore(n) {
        st.score += n;
      },
      setScore(n) {
        st.score = n;
      },
      getScore() {
        return st.score;
      },
      loseLife() {
        st.lives -= 1;
        if (st.lives <= 0) api.die();
      },
      lives() {
        return st.lives;
      },
      best() {
        return Math.max(st.best, st.score);
      },
      shake() {},
      die() {
        if (!st.dead) {
          st.dead = true;
          st.died = true;
        }
      },
    };
    return { api, st, input };
  }

  const dirs = ["left", "right", "up", "down", "fire", "tap"];
  let pass = 0,
    fail = 0;
  for (const spec of SPECS) {
    process.stdout.write("  testing " + spec.id + " ... ");
    try {
      const { api, st, input } = makeApi(spec);
      let gs = spec.setup(api);
      if (gs == null) throw new Error("setup returned null");
      const W = spec.W || 160,
        H = spec.H || 240;
      let restarts = 0;
      for (let f = 0; f < 1100; f++) {
        api.frame = f;
        // randomize held input + input mode (exercises both pointer and keys branches)
        input.mode = Math.random() < 0.5 ? "pointer" : "keys";
        input.l = Math.random() < 0.35;
        input.r = Math.random() < 0.35;
        input.u = Math.random() < 0.3;
        input.d = Math.random() < 0.3;
        input.fire = Math.random() < 0.4;
        input.pdown = Math.random() < 0.5;
        input.px = Math.floor(Math.random() * W);
        input.py = Math.floor(Math.random() * H);
        if (!st.dead) {
          spec.update(api, gs);
          spec.draw(api, gs);
        }
        // discrete press
        if (f % 11 === 0 && !st.dead && spec.press) {
          input.px = Math.floor(Math.random() * W);
          input.py = Math.floor(Math.random() * H);
          spec.press(api, gs, dirs[Math.floor(Math.random() * dirs.length)]);
        }
        if (st.dead) {
          // simulate retry
          restarts++;
          if (restarts > 6) break;
          st.dead = false;
          st.lives = spec.lives || 1;
          st.score = 0;
          gs = spec.setup(api);
        }
      }
      // assertions
      const bad = [];
      finiteWalk(gs, "gs", bad);
      if (!isFinite(st.score)) throw new Error("score not finite");
      if (bad.length)
        throw new Error("NaN/Inf in state: " + bad.slice(0, 4).join(", "));
      console.log(
        "OK  (sc=" +
          st.score +
          " died=" +
          st.died +
          " restarts=" +
          restarts +
          ")",
      );
      pass++;
    } catch (e) {
      console.log("FAIL: " + e.message);
      fail++;
    }
  }
  console.log(
    "\nRESULT: " +
      pass +
      " passed, " +
      fail +
      " failed, jsdom errors=" +
      errs.length,
  );
  if (errs.length)
    errs
      .slice(0, 5)
      .forEach((e) => console.log("  jsdomErr:", e.split("\n")[0]));
  process.exit(0);
}, 700);
