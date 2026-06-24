var fs = require("fs");
var SCR = "scr" + "ipt";
var BRAND = "SeaHype Marine Biology Education";
var BADGE = "SEAHYPE MARINE BIOLOGY EDUCATION";
var BASE = "/home/claude/sea/";
var OUT = "/mnt/user-data/outputs/index.html";

var reactUMD = fs.readFileSync(
  BASE + "node_modules/react/umd/react.production.min.js",
  "utf8",
);
var reactDomUMD = fs.readFileSync(
  BASE + "node_modules/react-dom/umd/react-dom.production.min.js",
  "utf8",
);
var app = fs.readFileSync(BASE + "SeaHype.jsx", "utf8");

function neutralize(s) {
  return s.split("</scr" + "ipt>").join("<\\/scr" + "ipt>");
}
reactUMD = neutralize(reactUMD);
reactDomUMD = neutralize(reactDomUMD);
app = neutralize(app);

function forceGlobal(umd) {
  return (
    "(function (module, exports, define) {\n" +
    "module = void 0; exports = void 0; define = void 0;\n" +
    umd +
    "\n" +
    '}).call(typeof window !== "undefined" ? window : this);'
  );
}
var reactWrapped = forceGlobal(reactUMD);
var reactDomWrapped = forceGlobal(reactDomUMD);

/* Official SeaHype logo (circular coin, transparent exterior), embedded as a
   data URI. The React app reads the same data URI from window.__SEA_LOGO__. */
var LOGO_URI =
  "data:image/png;base64," +
  fs.readFileSync(BASE + "logo_coin.png").toString("base64");
var LOGO_IMG =
  '<img class="sea-logo-img" src="' +
  LOGO_URI +
  '" alt="SeaHype Marine Biology Education" width="118" height="118" />';

/* Favicon as a compact SVG data URI. */
var FAV_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="15" fill="#0A2A47"/><circle cx="32" cy="31" r="20" fill="none" stroke="#9FD3E6" stroke-width="3"/><path d="M13 37c3.2 0 3.2-2.7 6.4-2.7s3.2 2.7 6.4 2.7 3.2-2.7 6.4-2.7 3.2 2.7 6.4 2.7 3.2-2.7 6.4-2.7" fill="none" stroke="#1C82A6" stroke-width="3.2" stroke-linecap="round"/></svg>';
var FAV_URI = "data:image/svg+xml," + encodeURIComponent(FAV_SVG);

var head = [
  "<!DOCTYPE html>",
  '<html lang="en">',
  "<head>",
  '  <meta charset="utf-8" />',
  '  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
  '  <meta name="theme-color" content="#0A2A47" />',
  '  <meta name="description" content="SeaHype Marine Biology Education — free, offline, bite-sized lessons in marine biology with sourced facts." />',
  '  <meta name="author" content="openMarineDB" />',
  '  <meta name="robots" content="index, follow" />',
  '  <meta name="apple-mobile-web-app-capable" content="yes" />',
  '  <meta name="mobile-web-app-capable" content="yes" />',
  '  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  '  <meta name="apple-mobile-web-app-title" content="SeaHype" />',
  '  <meta property="og:type" content="website" />',
  '  <meta property="og:title" content="SeaHype Marine Biology Education" />',
  '  <meta property="og:description" content="A free, fun-but-formal way to learn marine biology: 501 sourced lessons, XP, an arcade, and a full reference library." />',
  '  <meta property="og:site_name" content="SeaHype" />',
  '  <meta name="twitter:card" content="summary" />',
  '  <meta name="twitter:title" content="SeaHype Marine Biology Education" />',
  '  <meta name="twitter:description" content="501 sourced marine-biology lessons, XP, an arcade, and a full reference library — free and offline." />',
  "  <title>" + BRAND + "</title>",
  '  <link rel="icon" href="' + FAV_URI + '" />',
  "  <style>",
  "    *{box-sizing:border-box}",
  '    html,body{margin:0;padding:0;background:#03161F;-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
  "    #sea-bootsplash{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:22px;overflow:hidden;opacity:1;transition:opacity .5s ease;",
  "      background:radial-gradient(125% 95% at 50% -10%,#0E4C72 0%,#073A56 42%,#04222F 72%,#03161F 100%)}",
  "    #sea-bootsplash.leaving{opacity:0;pointer-events:none}",
  "    .sea-rays{position:absolute;inset:0;background:linear-gradient(180deg,rgba(120,210,255,.12),transparent 55%);pointer-events:none}",
  "    .sea-bubbles{position:absolute;inset:0;overflow:hidden;pointer-events:none}",
  "    .sea-bubbles i{position:absolute;bottom:-30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.55),rgba(180,230,255,.12));animation:sea-rise linear infinite}",
  "    .sea-bubbles i:nth-child(1){left:12%;width:10px;height:10px;animation-duration:9s}",
  "    .sea-bubbles i:nth-child(2){left:26%;width:6px;height:6px;animation-duration:7s;animation-delay:1.5s}",
  "    .sea-bubbles i:nth-child(3){left:44%;width:14px;height:14px;animation-duration:11s;animation-delay:.8s}",
  "    .sea-bubbles i:nth-child(4){left:61%;width:8px;height:8px;animation-duration:8s;animation-delay:2.2s}",
  "    .sea-bubbles i:nth-child(5){left:75%;width:5px;height:5px;animation-duration:6.5s;animation-delay:.4s}",
  "    .sea-bubbles i:nth-child(6){left:88%;width:11px;height:11px;animation-duration:10s;animation-delay:1.1s}",
  "    @keyframes sea-rise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.8}90%{opacity:.7}100%{transform:translateY(-104vh) translateX(18px);opacity:0}}",
  "    .sea-card{position:relative;width:100%;max-width:440px;background:rgba(8,34,48,.72);border:1px solid #16465F;border-radius:22px;",
  "      padding:24px 22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-align:center;color:#E8F4F8}",
  "    .sea-logo{display:flex;align-items:center;justify-content:center;margin:2px 0 14px;animation:sea-bob 3.4s ease-in-out infinite}",
  "    .sea-logo-img{width:118px;height:118px;display:block;filter:drop-shadow(0 6px 16px rgba(0,0,0,.35))}",
  "    @keyframes sea-bob{0%{transform:translateY(0)}50%{transform:translateY(-7px)}100%{transform:translateY(0)}}",
  "    .sea-badge{font-size:10.5px;letter-spacing:2px;font-weight:800;color:#49C3E8;margin-bottom:8px}",
  "    .sea-h1{font-size:21px;line-height:1.2;font-weight:900;margin:0 0 7px}",
  "    .sea-sub{font-size:13.5px;line-height:1.55;color:#9CC0CC;margin:0 0 16px}",
  "    .sea-namewrap{text-align:left;margin:0 0 14px}",
  "    .sea-label{display:block;font-size:12.5px;font-weight:700;color:#C2DDE6;margin:0 0 7px}",
  "    .sea-input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #1E4458;background:#0A1B27;color:#E8F4F8;font-size:15px;outline:none;font-family:inherit}",
  "    .sea-input:focus{border-color:#2BA6D6;box-shadow:0 0 0 3px rgba(43,166,214,.22)}",
  "    .sea-input::placeholder{color:#5E808F}",
  "    .sea-tip{min-height:36px;font-size:12.5px;font-style:italic;line-height:1.5;color:#7FA0AE;margin:0 0 16px;transition:opacity .28s ease}",
  "    .sea-btn{width:100%;border:none;border-radius:13px;padding:14px 16px;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;background:#33586F;color:#9CC0CC;transition:background .25s ease,transform .1s ease}",
  "    .sea-btn[disabled]{cursor:default}",
  "    .sea-btn.ready{background:#2BA6D6;color:#04222F;animation:sea-pulse 1.8s ease-in-out infinite}",
  "    .sea-btn.ready:active{transform:scale(.985)}",
  "    @keyframes sea-pulse{0%{box-shadow:0 0 0 0 rgba(43,166,214,.4)}70%{box-shadow:0 0 0 12px rgba(43,166,214,0)}100%{box-shadow:0 0 0 0 rgba(43,166,214,0)}}",
  "    .sea-spinner{width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(156,192,204,.35);border-top-color:#9CC0CC;animation:sea-spin .8s linear infinite}",
  "    @keyframes sea-spin{to{transform:rotate(360deg)}}",
  "    .sea-progress{margin-top:14px;height:5px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}",
  "    .sea-progress-bar{height:100%;width:38%;border-radius:99px;background:linear-gradient(90deg,transparent,#3DB6E6,transparent);animation:sea-shim 1.25s ease-in-out infinite}",
  "    @keyframes sea-shim{0%{transform:translateX(-180%)}100%{transform:translateX(420%)}}",
  "    .sea-foot{margin-top:12px;font-size:11px;color:#5E808F}",
  "    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;scroll-behavior:auto !important}}",
  "  </style>",
  "  <" +
    SCR +
    ">window.__SEA_LOGO__ = " +
    JSON.stringify(LOGO_URI) +
    ";</" +
    SCR +
    ">",
  "</head>",
  "<body>",
  '  <div id="root"></div>',
  '  <div id="sea-bootsplash">',
  '    <div class="sea-rays"></div>',
  '    <div class="sea-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
  '    <div class="sea-card">',
  '      <div class="sea-logo"><img class="sea-logo-img" id="sea-splash-logo" alt="SeaHype Marine Biology Education" width="118" height="118" /></div>',
  '      <div class="sea-badge">' + BADGE + "</div>",
  '      <h1 class="sea-h1" id="sea-h1">Preparing to dive</h1>',
  '      <p class="sea-sub" id="sea-sub">Setting up your marine-biology lessons. This takes just a moment.</p>',
  '      <div class="sea-namewrap" id="sea-namewrap">',
  '        <label class="sea-label" for="sea-name">Before we descend, what should we call you?</label>',
  '        <input class="sea-input" id="sea-name" type="text" autocomplete="given-name" placeholder="Your name (optional)" />',
  "      </div>",
  '      <div class="sea-tip" id="sea-tip"></div>',
  '      <button class="sea-btn" id="sea-board" disabled>',
  '        <span class="sea-spinner" id="sea-spinner"></span><span id="sea-btnlabel">Preparing SeaHype…</span>',
  "      </button>",
  '      <div class="sea-progress"><div class="sea-progress-bar"></div></div>',
  '      <div class="sea-foot">Free · no account needed · works offline · your progress stays on this device</div>',
  "    </div>",
  "  </div>",
].join("\n");

var splashJs = [
  "  <" + SCR + ">",
  "  (function () {",
  "    var W = window;",
  "    W.__seaDeferBoot = true;",
  '    W.__seaPrefill = { name: "" };',
  "    var el = function (id) { return document.getElementById(id); };",
  '    var btn = el("sea-board"), btnLabel = el("sea-btnlabel"), spinner = el("sea-spinner");',
  '    var splashLogo = el("sea-splash-logo"); if (splashLogo && W.__SEA_LOGO__) { splashLogo.src = W.__SEA_LOGO__; }',
  '    var nameWrap = el("sea-namewrap"), nameInput = el("sea-name"), h1 = el("sea-h1"), sub = el("sea-sub"), tipEl = el("sea-tip");',
  '    var returning = false, knownName = "";',
  "    try {",
  '      var raw = W.localStorage ? W.localStorage.getItem("seahype_marinebio_v1") : null;',
  "      if (raw) { var st = JSON.parse(raw); if (st && st.onboarded) { returning = true; if (st.profile && st.profile.name) { knownName = st.profile.name; } } }",
  "    } catch (e) {}",
  "    if (returning) {",
  '      if (nameWrap) { nameWrap.style.display = "none"; }',
  '      if (h1) { h1.textContent = knownName ? ("Welcome back, " + knownName) : "Welcome back"; }',
  '      if (sub) { sub.textContent = "Getting your dive log ready. This takes just a moment."; }',
  "    }",
  '    if (nameInput) { nameInput.addEventListener("input", function () { W.__seaPrefill.name = nameInput.value; }); }',
  "    var tips = [",
  '      "The ocean covers about 71% of Earth and holds roughly 97% of its water.",',
  '      "Over 250,000 marine species have been described — and about 2,000 are added each year.",',
  '      "Coral reefs cover under 1% of the seafloor but shelter about a quarter of marine species.",',
  '      "Most of the ocean by volume is the dark, cold deep sea below 200 meters.",',
  '      "Challenger Deep is deeper than Mount Everest is tall.",',
  '      "Phytoplankton in the sunlit surface make much of the oxygen we breathe.",',
  '      "At hydrothermal vents, life runs on chemistry instead of sunlight.",',
  '      "Most deep-sea animals can make their own light."',
  "    ];",
  "    var ti = 0;",
  "    if (tipEl) { tipEl.textContent = tips[0]; ti = 1; }",
  "    var tipTimer = setInterval(function () {",
  "      if (!tipEl) { return; }",
  '      tipEl.style.opacity = "0";',
  '      setTimeout(function () { tipEl.textContent = tips[ti % tips.length]; tipEl.style.opacity = "1"; ti = ti + 1; }, 300);',
  "    }, 5000);",
  "    var ready = false, minElapsed = false, armed = false;",
  "    function arm() {",
  "      if (armed) { return; }",
  "      armed = true;",
  '      if (btn) { btn.disabled = false; btn.className = "sea-btn ready"; }',
  '      if (spinner) { spinner.style.display = "none"; }',
  '      if (btnLabel) { btnLabel.textContent = returning ? "Enter SeaHype" : "Dive in"; }',
  "    }",
  "    function maybeArm() { if (ready && minElapsed) { arm(); } }",
  "    W.__seaReady = function () { ready = true; maybeArm(); };",
  "    setTimeout(function () { minElapsed = true; maybeArm(); }, 400);",
  "    setTimeout(function () { ready = true; minElapsed = true; arm(); }, 8000);",
  "    function board() {",
  "      if (btn && btn.disabled) { return; }",
  "      if (nameInput) { W.__seaPrefill.name = nameInput.value; }",
  "      clearInterval(tipTimer);",
  '      if (typeof W.__seaBoot === "function") { W.__seaBoot(); }',
  '      var bs = el("sea-bootsplash");',
  '      if (bs) { bs.className = bs.className + " leaving"; setTimeout(function () { if (bs.parentNode) { bs.parentNode.removeChild(bs); } }, 540); }',
  "    }",
  '    if (btn) { btn.addEventListener("click", board); }',
  "  })();",
  "  </" + SCR + ">",
].join("\n");

var reactBlock = "  <" + SCR + ">\n" + reactWrapped + "\n  </" + SCR + ">";
var reactDomBlock =
  "  <" + SCR + ">\n" + reactDomWrapped + "\n  </" + SCR + ">";

/* Data files are kept as editable siblings but inlined here as a compact
   JSON.parse blob so the page is fully self-contained and starts fast. */
function runInto(win, file) {
  new Function("window", fs.readFileSync(BASE + file, "utf8"))(win);
}
var DW = {};
runInto(DW, "seahype-lessons.js");
runInto(DW, "seahype-lessons-extra.js");
runInto(DW, "seahype-lessons-extra2.js");
runInto(DW, "seahype-lessons-extra3.js");
runInto(DW, "seahype-lessons-extra4.js");
runInto(DW, "seahype-curriculum.js");
runInto(DW, "seahype-queries.js");
runInto(DW, "seahype-content.js");
runInto(DW, "seahype-extra-content.js");
runInto(DW, "seahype-art.js");
runInto(DW, "seahype-shells.js");
runInto(DW, "seahype-photos.js");
runInto(DW, "seahype-pathmeta.js");
var jsonBlob = JSON.stringify(DW).split("</").join("<\\/");
var dataInline =
  "  <" +
  SCR +
  ' type="application/json" id="sea-data">' +
  jsonBlob +
  "</" +
  SCR +
  ">\n" +
  "  <" +
  SCR +
  '>(function(){var D=JSON.parse(document.getElementById("sea-data").textContent);for(var k in D){window[k]=D[k];}})();</' +
  SCR +
  ">";
var appBlock = "  <" + SCR + ">\n" + app + "\n  </" + SCR + ">";
var footer = "</body>\n</html>\n";

var html =
  head +
  "\n" +
  splashJs +
  "\n" +
  reactBlock +
  "\n" +
  reactDomBlock +
  "\n" +
  dataInline +
  "\n" +
  appBlock +
  "\n" +
  footer;
fs.writeFileSync(OUT, html);

var lessonCount = Object.keys(DW.__SEA_LESSONS__ || {}).length;
console.log(
  "wrote HTML bytes:",
  html.length,
  "| data globals:",
  Object.keys(DW).length,
  "| lessons:",
  lessonCount,
  "| title:",
  html.indexOf("<title>" + BRAND) > -1,
  "| badge:",
  html.indexOf(BADGE) > -1,
);
