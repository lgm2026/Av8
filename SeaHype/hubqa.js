const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const html = fs.readFileSync("/mnt/user-data/outputs/index.html", "utf8");

function run(theme, cb) {
  const errs = [];
  const seed = JSON.stringify({
    onboarded: true,
    profile: { name: "Tester", level: "explorer" },
    settings: { theme: theme },
    arcade: {
      tickets: 5,
      xpToday: 0,
      day: "",
      scores: { pong: 42, snake: 13 },
    },
  });
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "https://x.test/",
    virtualConsole: new VirtualConsole().on("jsdomError", (e) =>
      errs.push(e.message),
    ),
    beforeParse(win) {
      win.scrollTo = () => {};
      win.HTMLCanvasElement.prototype.getContext = () => null;
      win.fetch = () => Promise.reject(new Error("no net"));
      win.localStorage.setItem("seahype_marinebio_v1", seed);
      Object.defineProperty(win, "innerWidth", {
        value: 412,
        configurable: true,
      });
      Object.defineProperty(win, "innerHeight", {
        value: 880,
        configurable: true,
      });
    },
  });
  setTimeout(() => {
    const win = dom.window,
      doc = win.document;
    function allDivsButtons() {
      return Array.from(doc.querySelectorAll("div,button"));
    }
    function clickText(txt, maxLen) {
      const els = allDivsButtons().filter((e) => {
        const t = (e.textContent || "").trim();
        return t === txt || (t.indexOf(txt) >= 0 && t.length < (maxLen || 60));
      });
      if (els.length) {
        els[0].dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
        return true;
      }
      return false;
    }
    // enter app
    const enter = allDivsButtons().filter((e) =>
      /Enter SeaHype|Dive in/.test(e.textContent || ""),
    );
    if (enter.length)
      enter[0].dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
    setTimeout(() => {
      // go to Arcade tab (nav button)
      const navBtns = Array.from(doc.querySelectorAll("button")).filter(
        (b) => (b.textContent || "").trim() === "Arcade",
      );
      if (navBtns.length)
        navBtns[navBtns.length - 1].dispatchEvent(
          new win.MouseEvent("click", { bubbles: true }),
        );
      setTimeout(() => {
        const bodyTxt = doc.body.textContent || "";
        // count cabinets by tag labels present (each cabinet shows title + desc). Count title strings.
        const titles = [
          "Tide Pong",
          "Reef Breaker",
          "Jelly Drift",
          "Plastic Patrol",
          "Sea Snake",
          "Tide Memory",
          "Jelly Invaders",
          "Turtle Crossing",
          "Crab Catch",
          "Kelp Climber",
          "Octo Dodge",
          "Seahorse Sprint",
          "Anchor Drift",
          "Pearl Diver",
          "Current Runner",
          "Bubble Pop",
          "Tide Tetris",
          "Reef Match",
          "Sonar Says",
          "Bubble 2048",
          "Pearl Sweeper",
          "Current Lights",
          "Reef Rapid",
          "Topic Sorter",
        ];
        const shown = titles.filter((t) => bodyTxt.indexOf(t) >= 0);
        const hasBestBadge = /BEST\s*42|42/.test(bodyTxt);
        // click an engine cabinet (Tide Pong)
        clickText("Tide Pong", 80);
        setTimeout(() => {
          const t2 = doc.body.textContent || "";
          const mountedGame =
            /play normally in your browser|Tap \/ Space to start/.test(t2);
          cb({
            theme,
            errs,
            cabinetsShown: shown.length,
            sampleMissing: titles.filter((t) => shown.indexOf(t) < 0),
            hasBestBadge,
            mountedGame,
          });
        }, 260);
      }, 320);
    }, 360);
  }, 650);
}

run("dark", (r1) => {
  console.log(
    "[DARK ] cabinets=" +
      r1.cabinetsShown +
      "/24  bestBadge=" +
      r1.hasBestBadge +
      "  gameMounts=" +
      r1.mountedGame +
      "  errors=" +
      r1.errs.length,
  );
  if (r1.sampleMissing.length)
    console.log("        missing:", r1.sampleMissing.join(", "));
  if (r1.errs.length)
    r1.errs
      .slice(0, 4)
      .forEach((e) => console.log("        err:", e.split("\n")[0]));
  run("light", (r2) => {
    console.log(
      "[LIGHT] cabinets=" +
        r2.cabinetsShown +
        "/24  bestBadge=" +
        r2.hasBestBadge +
        "  gameMounts=" +
        r2.mountedGame +
        "  errors=" +
        r2.errs.length,
    );
    if (r2.errs.length)
      r2.errs
        .slice(0, 4)
        .forEach((e) => console.log("        err:", e.split("\n")[0]));
    console.log(
      "\nHUB QA:",
      r1.cabinetsShown === 24 &&
        r2.cabinetsShown === 24 &&
        r1.errs.length === 0 &&
        r2.errs.length === 0 &&
        r1.mountedGame &&
        r2.mountedGame
        ? "PASS"
        : "CHECK",
    );
    process.exit(0);
  });
});
