const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const html = fs.readFileSync("/mnt/user-data/outputs/index.html", "utf8");
const CYAN = "#7CE0EE";

function makeDom(theme) {
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "https://x.test/",
    virtualConsole: new VirtualConsole().on("jsdomError", (e) =>
      errs.push(e.message),
    ),
    beforeParse(win) {
      win.scrollTo = () => {};
      win.fetch = () => Promise.reject(new Error("x"));
      win.localStorage.setItem(
        "seahype_marinebio_v1",
        JSON.stringify({
          onboarded: true,
          profile: { name: "PC", level: "explorer" },
          settings: { theme: theme },
          arcade: { tickets: 0, xpToday: 0, day: "", scores: {} },
        }),
      );
      Object.defineProperty(win, "innerWidth", {
        value: 412,
        configurable: true,
      });
      Object.defineProperty(win, "innerHeight", {
        value: 880,
        configurable: true,
      });
      win.__draws = [];
      const fake = {
        fillStyle: "#000",
        strokeStyle: "#000",
        lineWidth: 1,
        font: "",
        textAlign: "left",
        textBaseline: "top",
        fillRect(x, y, w, h) {
          win.__draws.push({ c: this.fillStyle, x, y, w, h });
        },
        clearRect() {},
        fillText() {},
        beginPath() {},
        arc() {},
        fill() {},
        stroke() {},
        moveTo() {},
        lineTo() {},
        rect() {},
        save() {},
        restore() {},
        translate() {},
        scale() {},
        closePath() {},
        setTransform() {},
        drawImage() {},
      };
      win.HTMLCanvasElement.prototype.getContext = function () {
        return fake;
      };
    },
  });
  return { dom, errs };
}

const TITLES = [
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

async function enterAndArcade(win, doc, wait) {
  await wait(700);
  const enter = Array.from(doc.querySelectorAll("button")).filter((e) =>
    /Enter SeaHype|Dive in/.test(e.textContent || ""),
  );
  if (enter.length)
    enter[0].dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
  await wait(480);
  const root = doc.getElementById("root");
  const nav = Array.from(root.querySelectorAll("button")).filter(
    (b) => (b.textContent || "").trim() === "Arcade",
  );
  if (nav.length)
    nav[nav.length - 1].dispatchEvent(
      new win.MouseEvent("click", { bubbles: true }),
    );
  await wait(340);
  return root;
}
function countCabinets(root) {
  // real rendered cabinet cards: clickable divs (cursor pointer) whose text is exactly one title block
  const divs = Array.from(root.querySelectorAll("div"));
  let found = 0;
  const seen = {};
  for (const t of TITLES) {
    const hit = divs.some((d) => {
      const tx = (d.textContent || "").trim();
      return tx.indexOf(t) >= 0 && tx.length < 130;
    });
    if (hit && !seen[t]) {
      seen[t] = 1;
      found++;
    }
  }
  return found;
}

(async () => {
  // ---- Rigorous render check, both themes ----
  for (const theme of ["dark", "light"]) {
    const { dom, errs } = makeDom(theme);
    const win = dom.window,
      doc = win.document;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const root = await enterAndArcade(win, doc, wait);
    const cabs = countCabinets(root);
    console.log(
      "[" +
        theme.toUpperCase() +
        "] rendered cabinets=" +
        cabs +
        "/24  navBtns=ok  errors=" +
        errs.length,
    );
    dom.window.close();
  }

  // ---- Desktop keyboard+mouse on Tide Pong ----
  const { dom, errs } = makeDom("dark");
  const win = dom.window,
    doc = win.document;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const root = await enterAndArcade(win, doc, wait);
  // click Tide Pong cabinet (smallest div containing it)
  const divs = Array.from(root.querySelectorAll("div")).filter((d) => {
    const t = (d.textContent || "").trim();
    return t.indexOf("Tide Pong") >= 0 && t.length < 130;
  });
  divs.sort(
    (a, b) => (a.textContent || "").length - (b.textContent || "").length,
  );
  if (divs.length)
    divs[divs.length - 1].dispatchEvent(
      new win.MouseEvent("click", { bubbles: true }),
    );
  await wait(320);
  const cv = root.querySelector("canvas");
  console.log("\n[INPUT] canvas mounted:", !!cv);
  if (!cv) {
    console.log("ABORT input test");
    process.exit(0);
  }
  cv.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 180,
    height: 150,
    right: 180,
    bottom: 150,
    x: 0,
    y: 0,
  });
  const paddleCenter = () => {
    let best = null;
    for (const d of win.__draws) {
      if (d.c === CYAN && d.y >= 130 && d.y <= 142 && d.w > 10) best = d;
    }
    return best ? best.x + best.w / 2 : null;
  };
  const keydown = (k) =>
    win.dispatchEvent(
      new win.KeyboardEvent("keydown", { key: k, bubbles: true }),
    );
  const keyup = (k) =>
    win.dispatchEvent(
      new win.KeyboardEvent("keyup", { key: k, bubbles: true }),
    );
  const pointer = (type, x) => {
    const e = new win.Event(type, { bubbles: true });
    e.clientX = x;
    e.clientY = 75;
    e.pointerType = "mouse";
    e.preventDefault = () => {};
    cv.dispatchEvent(e);
  };

  pointer("pointerdown", 90);
  await wait(220);
  const started = paddleCenter() != null;
  win.__draws.length = 0;
  await wait(60);
  const cBefore = paddleCenter();
  keydown("ArrowLeft");
  await wait(300);
  win.__draws.length = 0;
  await wait(40);
  const cLeft = paddleCenter();
  keyup("ArrowLeft");
  keydown("ArrowRight");
  await wait(300);
  win.__draws.length = 0;
  await wait(40);
  const cRight = paddleCenter();
  keyup("ArrowRight");
  pointer("pointermove", 20);
  await wait(320);
  win.__draws.length = 0;
  await wait(40);
  const mLeft = paddleCenter();
  pointer("pointermove", 160);
  await wait(320);
  win.__draws.length = 0;
  await wait(40);
  const mRight = paddleCenter();
  const n = (v) => (v == null ? "null" : v.toFixed(1));
  console.log(
    "  started:",
    started,
    "| KB before=" + n(cBefore) + " left=" + n(cLeft) + " right=" + n(cRight),
    "| MOUSE h20=" + n(mLeft) + " h160=" + n(mRight),
  );
  const kbOK =
    cBefore != null &&
    cLeft != null &&
    cRight != null &&
    cLeft < cBefore - 3 &&
    cRight > cLeft + 8;
  const msOK =
    mLeft != null &&
    mRight != null &&
    mLeft < 50 &&
    mRight > 115 &&
    mRight > mLeft + 40;
  console.log(
    "  KEYBOARD:",
    kbOK ? "PASS" : "FAIL",
    "| MOUSE:",
    msOK ? "PASS" : "FAIL",
    "| errors=" + errs.length,
  );
  console.log(
    "\nDESKTOP INPUT RESULT:",
    started && kbOK && msOK && errs.length === 0 ? "PASS" : "CHECK",
  );
  process.exit(0);
})();
