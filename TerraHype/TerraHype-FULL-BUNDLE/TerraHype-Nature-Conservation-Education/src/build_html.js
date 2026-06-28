var fs = require("fs");
var SCR = "scr" + "ipt";
var BRAND = "TerraHype Nature Conservation Education";
var BADGE = "TERRAHYPE · NATURE CONSERVATION";
var BASE = "/home/claude/terra/";
var OUT = "/mnt/user-data/outputs/TerraHype Nature Conservation Education.html";

var reactUMD = fs.readFileSync(BASE + "node_modules/react/umd/react.production.min.js", "utf8");
var reactDomUMD = fs.readFileSync(BASE + "node_modules/react-dom/umd/react-dom.production.min.js", "utf8");
var app = fs.readFileSync(BASE + "TerraHype.jsx", "utf8");

function neutralize(s) { return s.split("</scr" + "ipt>").join("<\\/scr" + "ipt>"); }
reactUMD = neutralize(reactUMD); reactDomUMD = neutralize(reactDomUMD); app = neutralize(app);

function forceGlobal(umd) {
  return '(function (module, exports, define) {\n'
    + 'module = void 0; exports = void 0; define = void 0;\n'
    + umd + '\n'
    + '}).call(typeof window !== "undefined" ? window : this);';
}
var reactWrapped = forceGlobal(reactUMD);
var reactDomWrapped = forceGlobal(reactDomUMD);

/* Official TerraHype logo (circular coin, transparent exterior), embedded as a
   data URI. The React app reads the same data URI from window.__SEA_LOGO__. */
var LOGO_URI = "data:image/png;base64," + fs.readFileSync(BASE + "logo_coin.png").toString("base64");
var LOGO_IMG = '<img class="sea-logo-img" src="' + LOGO_URI + '" alt="' + BRAND + '" width="118" height="118" />';

/* Favicon as a compact SVG data URI (forest hill + pine). */
var FAV_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="15" fill="#16291D"/><path d="M6 46 Q32 36 58 46 V60 H6 Z" fill="#2E7A3C"/><path d="M32 14 L22 34 H42 Z" fill="#57B65E"/><path d="M32 22 L24 40 H40 Z" fill="#3E9A48"/><rect x="30" y="40" width="4" height="8" fill="#6B4A2B"/></svg>';
var FAV_URI = "data:image/svg+xml," + encodeURIComponent(FAV_SVG);

var head = [
'<!DOCTYPE html>',
'<html lang="en">',
'<head>',
'  <meta charset="utf-8" />',
'  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
'  <meta name="theme-color" content="#16291D" />',
'  <meta name="description" content="TerraHype Nature Conservation Education — free, offline, bite-sized lessons in nature and conservation with sourced facts." />',
'  <meta name="author" content="openNatureDB" />',
'  <meta name="robots" content="index, follow" />',
'  <meta name="apple-mobile-web-app-capable" content="yes" />',
'  <meta name="mobile-web-app-capable" content="yes" />',
'  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
'  <meta name="apple-mobile-web-app-title" content="TerraHype" />',
'  <meta property="og:type" content="website" />',
'  <meta property="og:title" content="TerraHype Nature Conservation Education" />',
'  <meta property="og:description" content="A free, fun-but-formal way to learn nature conservation: 200+ sourced lessons, XP, an arcade, and a full reference library." />',
'  <meta property="og:site_name" content="TerraHype" />',
'  <meta name="twitter:card" content="summary" />',
'  <meta name="twitter:title" content="TerraHype Nature Conservation Education" />',
'  <meta name="twitter:description" content="200+ sourced nature-conservation lessons, XP, an arcade, and a full reference library — free and offline." />',
'  <title>' + BRAND + '</title>',
'  <link rel="icon" href="' + FAV_URI + '" />',
'  <style>',
'    *{box-sizing:border-box}',
'    html,body{margin:0;padding:0;background:#08120C;-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
'    #sea-bootsplash{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:22px;overflow:hidden;opacity:1;transition:opacity .5s ease;',
'      background:radial-gradient(125% 95% at 50% -10%,#1F5A36 0%,#15462A 42%,#0C2A19 72%,#08120C 100%)}',
'    #sea-bootsplash.leaving{opacity:0;pointer-events:none}',
'    .sea-rays{position:absolute;inset:0;background:linear-gradient(180deg,rgba(160,230,150,.12),transparent 55%);pointer-events:none}',
'    .sea-bubbles{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
'    .sea-bubbles i{position:absolute;bottom:-30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,240,180,.7),rgba(150,210,120,.15));box-shadow:0 0 6px rgba(255,230,150,.5);animation:sea-rise linear infinite}',
'    .sea-bubbles i:nth-child(1){left:12%;width:7px;height:7px;animation-duration:9s}',
'    .sea-bubbles i:nth-child(2){left:26%;width:4px;height:4px;animation-duration:7s;animation-delay:1.5s}',
'    .sea-bubbles i:nth-child(3){left:44%;width:9px;height:9px;animation-duration:11s;animation-delay:.8s}',
'    .sea-bubbles i:nth-child(4){left:61%;width:5px;height:5px;animation-duration:8s;animation-delay:2.2s}',
'    .sea-bubbles i:nth-child(5){left:75%;width:3px;height:3px;animation-duration:6.5s;animation-delay:.4s}',
'    .sea-bubbles i:nth-child(6){left:88%;width:8px;height:8px;animation-duration:10s;animation-delay:1.1s}',
'    @keyframes sea-rise{0%{transform:translateY(0) translateX(0);opacity:0}10%{opacity:.85}90%{opacity:.7}100%{transform:translateY(-104vh) translateX(18px);opacity:0}}',
'    .sea-card{position:relative;width:100%;max-width:440px;background:rgba(12,34,22,.74);border:1px solid #1F5034;border-radius:22px;',
'      padding:24px 22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-align:center;color:#EAF4EA}',
'    .sea-logo{display:flex;align-items:center;justify-content:center;margin:2px 0 14px;animation:sea-bob 3.4s ease-in-out infinite}',
'    .sea-logo-img{width:118px;height:118px;display:block;filter:drop-shadow(0 6px 16px rgba(0,0,0,.35))}',
'    @keyframes sea-bob{0%{transform:translateY(0)}50%{transform:translateY(-7px)}100%{transform:translateY(0)}}',
'    .sea-badge{font-size:10.5px;letter-spacing:2px;font-weight:800;color:#6FCF6F;margin-bottom:8px}',
'    .sea-h1{font-size:21px;line-height:1.2;font-weight:900;margin:0 0 7px}',
'    .sea-sub{font-size:13.5px;line-height:1.55;color:#A6C6AC;margin:0 0 16px}',
'    .sea-namewrap{text-align:left;margin:0 0 14px}',
'    .sea-label{display:block;font-size:12.5px;font-weight:700;color:#C6E0C6;margin:0 0 7px}',
'    .sea-input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #234A30;background:#0B1B12;color:#EAF4EA;font-size:15px;outline:none;font-family:inherit}',
'    .sea-input:focus{border-color:#2E8B40;box-shadow:0 0 0 3px rgba(46,139,64,.22)}',
'    .sea-input::placeholder{color:#5E7E64}',
'    .sea-tip{min-height:36px;font-size:12.5px;font-style:italic;line-height:1.5;color:#86A68C;margin:0 0 16px;transition:opacity .28s ease}',
'    .sea-btn{width:100%;border:none;border-radius:13px;padding:14px 16px;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;background:#33583F;color:#A6C6AC;transition:background .25s ease,transform .1s ease}',
'    .sea-btn[disabled]{cursor:default}',
'    .sea-btn.ready{background:#2E8B40;color:#0B1F12;animation:sea-pulse 1.8s ease-in-out infinite}',
'    .sea-btn.ready:active{transform:scale(.985)}',
'    @keyframes sea-pulse{0%{box-shadow:0 0 0 0 rgba(46,139,64,.4)}70%{box-shadow:0 0 0 12px rgba(46,139,64,0)}100%{box-shadow:0 0 0 0 rgba(46,139,64,0)}}',
'    .sea-spinner{width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(166,198,172,.35);border-top-color:#A6C6AC;animation:sea-spin .8s linear infinite}',
'    @keyframes sea-spin{to{transform:rotate(360deg)}}',
'    .sea-progress{margin-top:14px;height:5px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}',
'    .sea-progress-bar{height:100%;width:38%;border-radius:99px;background:linear-gradient(90deg,transparent,#57B65E,transparent);animation:sea-shim 1.25s ease-in-out infinite}',
'    @keyframes sea-shim{0%{transform:translateX(-180%)}100%{transform:translateX(420%)}}',
'    .sea-foot{margin-top:12px;font-size:11px;color:#5E7E64}',
'    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;scroll-behavior:auto !important}}',
'    :focus-visible{outline:3px solid #5BC8F0;outline-offset:2px;border-radius:8px}',
'    [role="button"]:focus-visible,button:focus-visible{outline:3px solid #5BC8F0;outline-offset:2px}',
'  </style>',
'  <' + SCR + '>window.__SEA_LOGO__ = ' + JSON.stringify(LOGO_URI) + ';</' + SCR + '>',
'</head>',
'<body>',
'  <div id="root"></div>',
'  <div id="sea-bootsplash">',
'    <div class="sea-rays"></div>',
'    <div class="sea-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
'    <div class="sea-card">',
'      <div class="sea-logo"><img class="sea-logo-img" id="sea-splash-logo" alt="' + BRAND + '" width="118" height="118" /></div>',
'      <div class="sea-badge">' + BADGE + '</div>',
'      <h1 class="sea-h1" id="sea-h1">Preparing the trail</h1>',
'      <p class="sea-sub" id="sea-sub">Setting up your nature lessons. This takes just a moment.</p>',
'      <div class="sea-namewrap" id="sea-namewrap">',
'        <label class="sea-label" for="sea-name">Before we set out, what should we call you?</label>',
'        <input class="sea-input" id="sea-name" type="text" autocomplete="given-name" placeholder="Your name (optional)" />',
'      </div>',
'      <div class="sea-tip" id="sea-tip"></div>',
'      <button class="sea-btn" id="sea-board" disabled>',
'        <span class="sea-spinner" id="sea-spinner"></span><span id="sea-btnlabel">Preparing TerraHype…</span>',
'      </button>',
'      <div class="sea-progress"><div class="sea-progress-bar"></div></div>',
'      <div class="sea-foot">Free · no account needed · works offline · your progress stays on this device</div>',
'    </div>',
'  </div>'
].join("\n");

var splashJs = [
'  <' + SCR + '>',
'  (function () {',
'    var W = window;',
'    W.__seaDeferBoot = true;',
'    W.__seaPrefill = { name: "" };',
'    var el = function (id) { return document.getElementById(id); };',
'    var btn = el("sea-board"), btnLabel = el("sea-btnlabel"), spinner = el("sea-spinner");',
'    var splashLogo = el("sea-splash-logo"); if (splashLogo && W.__SEA_LOGO__) { splashLogo.src = W.__SEA_LOGO__; }',
'    var nameWrap = el("sea-namewrap"), nameInput = el("sea-name"), h1 = el("sea-h1"), sub = el("sea-sub"), tipEl = el("sea-tip");',
'    var returning = false, knownName = "";',
'    try {',
'      var raw = W.localStorage ? W.localStorage.getItem("terrahype_nature_v1") : null;',
'      if (raw) { var st = JSON.parse(raw); if (st && st.onboarded) { returning = true; if (st.profile && st.profile.name) { knownName = st.profile.name; } } }',
'    } catch (e) {}',
'    if (returning) {',
'      if (nameWrap) { nameWrap.style.display = "none"; }',
'      if (h1) { h1.textContent = knownName ? ("Welcome back, " + knownName) : "Welcome back"; }',
'      if (sub) { sub.textContent = "Getting your field journal ready. This takes just a moment."; }',
'    }',
'    if (nameInput) { nameInput.addEventListener("input", function () { W.__seaPrefill.name = nameInput.value; }); }',
'    var tips = [',
'      "Forests cover about a third of Earth\'s land and shelter most of its land species.",',
'      "A single mature oak can support hundreds of kinds of insects, birds and other life.",',
'      "It can take hundreds of years for nature to build just one inch of topsoil.",',
'      "Beavers are ecosystem engineers — their dams create whole wetlands.",',
'      "The peregrine falcon is the fastest animal on Earth, diving over 320 km/h.",',
'      "Monarch butterflies migrate thousands of kilometers to the same Mexican forests.",',
'      "Wetlands soak up floods and filter pollution like a natural sponge.",',
'      "Some bristlecone pines have lived for more than 4,800 years."',
'    ];',
'    var ti = 0;',
'    if (tipEl) { tipEl.textContent = tips[0]; ti = 1; }',
'    var tipTimer = setInterval(function () {',
'      if (!tipEl) { return; }',
'      tipEl.style.opacity = "0";',
'      setTimeout(function () { tipEl.textContent = tips[ti % tips.length]; tipEl.style.opacity = "1"; ti = ti + 1; }, 300);',
'    }, 5000);',
'    var ready = false, minElapsed = false, armed = false;',
'    function arm() {',
'      if (armed) { return; }',
'      armed = true;',
'      if (btn) { btn.disabled = false; btn.className = "sea-btn ready"; }',
'      if (spinner) { spinner.style.display = "none"; }',
'      if (btnLabel) { btnLabel.textContent = returning ? "Enter TerraHype" : "Start exploring"; }',
'    }',
'    function maybeArm() { if (ready && minElapsed) { arm(); } }',
'    W.__seaReady = function () { ready = true; maybeArm(); };',
'    setTimeout(function () { minElapsed = true; maybeArm(); }, 400);',
'    setTimeout(function () { ready = true; minElapsed = true; arm(); }, 8000);',
'    function board() {',
'      if (btn && btn.disabled) { return; }',
'      if (nameInput) { W.__seaPrefill.name = nameInput.value; }',
'      clearInterval(tipTimer);',
'      if (typeof W.__seaBoot === "function") { W.__seaBoot(); }',
'      var bs = el("sea-bootsplash");',
'      if (bs) { bs.className = bs.className + " leaving"; setTimeout(function () { if (bs.parentNode) { bs.parentNode.removeChild(bs); } }, 540); }',
'    }',
'    if (btn) { btn.addEventListener("click", board); }',
'  })();',
'  </' + SCR + '>'
].join("\n");

var reactBlock = '  <' + SCR + '>\n' + reactWrapped + '\n  </' + SCR + '>';
var reactDomBlock = '  <' + SCR + '>\n' + reactDomWrapped + '\n  </' + SCR + '>';

function runInto(win, file) { (new Function("window", fs.readFileSync(BASE + file, "utf8")))(win); }
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
var dataInline = '  <' + SCR + ' type="application/json" id="sea-data">' + jsonBlob + '</' + SCR + '>\n'
  + '  <' + SCR + '>(function(){var D=JSON.parse(document.getElementById("sea-data").textContent);for(var k in D){window[k]=D[k];}})();</' + SCR + '>';
var appBlock = '  <' + SCR + '>\n' + app + '\n  </' + SCR + '>';
var footer = '</body>\n</html>\n';

var html = head + "\n" + splashJs + "\n" + reactBlock + "\n" + reactDomBlock + "\n" + dataInline + "\n" + appBlock + "\n" + footer;
fs.writeFileSync(OUT, html);

var lessonCount = Object.keys(DW.__SEA_LESSONS__ || {}).length;
console.log("wrote HTML bytes:", html.length, "| data globals:", Object.keys(DW).length, "| lessons:", lessonCount, "| title:", html.indexOf("<title>" + BRAND) > -1, "| badge:", html.indexOf(BADGE) > -1);
