# -*- coding: utf-8 -*-
import json, base64, os
import gen_entries, astro_concepts, astro_content, astro_art

SRC = "/home/claude/astro/src"
OUT_DIR = "/mnt/user-data/outputs"
os.makedirs(OUT_DIR, exist_ok=True)
BRAND = "AstroHype Space & Astronomy Education"
BRAND_SHORT = "AstroHype"
BADGE = "ASTROHYPE \u00b7 SPACE & ASTRONOMY"
OUT = os.path.join(OUT_DIR, "AstroHype Space & Astronomy Education.html")

# ---------------- assemble data ----------------
def build_data():
    elessons, queries, meta, entries = gen_entries.build()
    clessons, cplan = astro_concepts.build()
    lessons = {}
    lessons.update(elessons)
    lessons.update(clessons)
    units_extra = gen_entries.build_units()  # entry units (concept units are in-file UNIT_PLAN)
    DW = {
        "__SEA_LESSONS__": lessons,
        "__SEA_UNITS_EXTRA__": units_extra,
        "__SEA_QUERIES__": queries,
        "__SEA_GLOSSARY__": astro_content.GLOSSARY,
        "__SEA_PRON__": astro_content.PRON,
        "__SEA_TAXONOMY__": astro_content.TAXONOMY,
        "__SEA_CONCEPTS__": astro_content.CONCEPTS,
        "__SEA_CAREERS__": astro_content.CAREERS,
        "__SEA_HISTORY__": astro_content.HISTORY,
        "__SEA_MILESTONES__": astro_content.MILESTONES,
        "__SEA_MARVELS__": astro_content.MARVELS,
        "SEA_ART": astro_art.build_art(),
        "__SEA_SHELLS__": astro_content.SHELLS,
        "__SEA_PHOTOS__": {},
        "__SEA_PHOTO_CREDITS__": [],
        "__SEA_SPECIES_META__": meta,
    }
    return DW

DW = build_data()
lesson_count = len(DW["__SEA_LESSONS__"])
assert lesson_count == 501, "lesson count %d != 501" % lesson_count
# unit coverage sanity
all_ids = set(DW["__SEA_LESSONS__"].keys())
unit_ids = set()
for u in DW["__SEA_UNITS_EXTRA__"]:
    for i in u["ids"]: unit_ids.add(i)
# concept ids covered by in-file UNIT_PLAN (not in units_extra) -> just ensure entries covered
entry_ids = set(DW["__SEA_SPECIES_META__"].keys())
assert entry_ids.issubset(unit_ids), "some entries not in units"
print("data OK: lessons=%d entries=%d concepts=%d artkeys=%d glossary=%d" % (
    lesson_count, len(entry_ids), lesson_count-len(entry_ids), len(DW["SEA_ART"]), len(DW["__SEA_GLOSSARY__"])))

# ---------------- read engine + react ----------------
react = open(os.path.join(SRC, "react.wrapped.js"), encoding="utf-8").read()
react_dom = open(os.path.join(SRC, "react-dom.wrapped.js"), encoding="utf-8").read()
app = open(os.path.join(SRC, "AstroHype.jsx"), encoding="utf-8").read()

def neutralize(s):
    return s.replace("</script>", "<\\/script>")

react = neutralize(react); react_dom = neutralize(react_dom); app = neutralize(app)

logo_b64 = base64.b64encode(open(os.path.join(SRC, "astrohype_logo.png"), "rb").read()).decode("ascii")
LOGO_URI = "data:image/png;base64," + logo_b64

# space favicon (dark badge + ringed planet + stars)
FAV_SVG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
 '<rect x="2" y="2" width="60" height="60" rx="15" fill="#0f1636"/>'
 '<circle cx="14" cy="16" r="1.4" fill="#fff"/><circle cx="50" cy="14" r="1.2" fill="#dfe7ff"/>'
 '<circle cx="52" cy="46" r="1.2" fill="#fff"/><circle cx="16" cy="48" r="1.2" fill="#fff4d6"/>'
 '<g transform="translate(32 33) rotate(-20)">'
 '<ellipse rx="24" ry="8" fill="none" stroke="#6e8bff" stroke-width="2.4"/>'
 '<circle r="11" fill="#ff9b43"/>'
 '<ellipse cx="-3" cy="-3" rx="4" ry="2.4" fill="#ffd66b" opacity="0.6"/></g></svg>')
import urllib.parse
FAV_URI = "data:image/svg+xml," + urllib.parse.quote(FAV_SVG)

SCR = "scr" + "ipt"
SPLASH_BG = "#080b1c"
PAGE_BG = "#070a18"

head = "\n".join([
'<!DOCTYPE html>',
'<html lang="en">',
'<head>',
'  <meta charset="utf-8" />',
'  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
'  <meta name="theme-color" content="#080B1A" />',
'  <meta name="description" content="' + BRAND + ' \u2014 free, offline, bite-sized lessons in space and astronomy with sourced facts." />',
'  <meta name="author" content="openSpaceDB" />',
'  <meta name="robots" content="index, follow" />',
'  <meta name="apple-mobile-web-app-capable" content="yes" />',
'  <meta name="mobile-web-app-capable" content="yes" />',
'  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
'  <meta name="apple-mobile-web-app-title" content="' + BRAND_SHORT + '" />',
'  <meta property="og:type" content="website" />',
'  <meta property="og:title" content="' + BRAND + '" />',
'  <meta property="og:description" content="A free, fun-but-formal way to learn astronomy: 500+ sourced lessons, XP, an arcade, and a full reference library." />',
'  <meta property="og:site_name" content="' + BRAND_SHORT + '" />',
'  <meta name="twitter:card" content="summary" />',
'  <meta name="twitter:title" content="' + BRAND + '" />',
'  <meta name="twitter:description" content="500+ sourced astronomy lessons, XP, an arcade, and a full reference library \u2014 free and offline." />',
'  <title>' + BRAND + '</title>',
'  <link rel="icon" href="' + FAV_URI + '" />',
'  <style>',
'    *{box-sizing:border-box}',
'    html,body{margin:0;padding:0;background:' + PAGE_BG + ';-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
'    #sea-bootsplash{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:22px;overflow:hidden;opacity:1;transition:opacity .5s ease;',
'      background:radial-gradient(125% 95% at 50% -10%,#1b2450 0%,#131a3e 42%,#0c1230 72%,#080b1c 100%)}',
'    #sea-bootsplash.leaving{opacity:0;pointer-events:none}',
'    .sea-rays{position:absolute;inset:0;background:radial-gradient(60% 40% at 50% -5%,rgba(120,150,255,.18),transparent 70%);pointer-events:none}',
'    .sea-bubbles{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
'    .sea-bubbles i{position:absolute;border-radius:50%;background:#fff;box-shadow:0 0 6px rgba(200,215,255,.8);animation:sea-twinkle ease-in-out infinite}',
'    .sea-bubbles i:nth-child(1){left:12%;top:22%;width:2.5px;height:2.5px;animation-duration:3.2s}',
'    .sea-bubbles i:nth-child(2){left:26%;top:64%;width:2px;height:2px;animation-duration:2.6s;animation-delay:1.1s}',
'    .sea-bubbles i:nth-child(3){left:44%;top:14%;width:3px;height:3px;animation-duration:4s;animation-delay:.6s}',
'    .sea-bubbles i:nth-child(4){left:61%;top:72%;width:2px;height:2px;animation-duration:3.4s;animation-delay:1.8s}',
'    .sea-bubbles i:nth-child(5){left:78%;top:28%;width:2.5px;height:2.5px;animation-duration:2.9s;animation-delay:.3s}',
'    .sea-bubbles i:nth-child(6){left:88%;top:58%;width:2px;height:2px;animation-duration:3.7s;animation-delay:1.3s}',
'    @keyframes sea-twinkle{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}',
'    .sea-card{position:relative;width:100%;max-width:440px;background:rgba(16,22,51,.78);border:1px solid #2a3566;border-radius:22px;',
'      padding:24px 22px 20px;box-shadow:0 24px 60px rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);text-align:center;color:#EAEFFF}',
'    .sea-logo{display:flex;align-items:center;justify-content:center;margin:2px 0 14px;animation:sea-bob 3.4s ease-in-out infinite}',
'    .sea-logo-img{width:118px;height:118px;display:block;filter:drop-shadow(0 6px 16px rgba(0,0,0,.45))}',
'    @keyframes sea-bob{0%{transform:translateY(0)}50%{transform:translateY(-7px)}100%{transform:translateY(0)}}',
'    .sea-badge{font-size:10.5px;letter-spacing:2px;font-weight:800;color:#9db2ff;margin-bottom:8px}',
'    .sea-h1{font-size:21px;line-height:1.2;font-weight:900;margin:0 0 7px}',
'    .sea-sub{font-size:13.5px;line-height:1.55;color:#A9B6D9;margin:0 0 16px}',
'    .sea-namewrap{text-align:left;margin:0 0 14px}',
'    .sea-label{display:block;font-size:12.5px;font-weight:700;color:#c3cdf0;margin:0 0 7px}',
'    .sea-input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #2a3566;background:#0b1230;color:#EAEFFF;font-size:15px;outline:none;font-family:inherit}',
'    .sea-input:focus{border-color:#6e8bff;box-shadow:0 0 0 3px rgba(110,139,255,.22)}',
'    .sea-input::placeholder{color:#5c6691}',
'    .sea-tip{min-height:36px;font-size:12.5px;font-style:italic;line-height:1.5;color:#8b97c4;margin:0 0 16px;transition:opacity .28s ease}',
'    .sea-btn{width:100%;border:none;border-radius:13px;padding:14px 16px;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;background:#2a3566;color:#A9B6D9;transition:background .25s ease,transform .1s ease}',
'    .sea-btn[disabled]{cursor:default}',
'    .sea-btn.ready{background:#6e8bff;color:#081026;animation:sea-pulse 1.8s ease-in-out infinite}',
'    .sea-btn.ready:active{transform:scale(.985)}',
'    @keyframes sea-pulse{0%{box-shadow:0 0 0 0 rgba(110,139,255,.45)}70%{box-shadow:0 0 0 12px rgba(110,139,255,0)}100%{box-shadow:0 0 0 0 rgba(110,139,255,0)}}',
'    .sea-spinner{width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(169,182,217,.35);border-top-color:#A9B6D9;animation:sea-spin .8s linear infinite}',
'    @keyframes sea-spin{to{transform:rotate(360deg)}}',
'    .sea-progress{margin-top:14px;height:5px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}',
'    .sea-progress-bar{height:100%;width:38%;border-radius:99px;background:linear-gradient(90deg,transparent,#9db2ff,transparent);animation:sea-shim 1.25s ease-in-out infinite}',
'    @keyframes sea-shim{0%{transform:translateX(-180%)}100%{transform:translateX(420%)}}',
'    .sea-foot{margin-top:12px;font-size:11px;color:#5c6691}',
'    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;scroll-behavior:auto !important}}',
'    :focus-visible{outline:3px solid #6e8bff;outline-offset:2px;border-radius:8px}',
'    [role="button"]:focus-visible,button:focus-visible{outline:3px solid #6e8bff;outline-offset:2px}',
'  </style>',
'  <' + SCR + '>window.__SEA_LOGO__ = ' + json.dumps(LOGO_URI) + ';</' + SCR + '>',
'</head>',
'<body>',
'  <div id="root"></div>',
'  <div id="sea-bootsplash">',
'    <div class="sea-rays"></div>',
'    <div class="sea-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
'    <div class="sea-card">',
'      <div class="sea-logo"><img class="sea-logo-img" id="sea-splash-logo" alt="' + BRAND + '" width="118" height="118" /></div>',
'      <div class="sea-badge">' + BADGE + '</div>',
'      <h1 class="sea-h1" id="sea-h1">Preparing for launch</h1>',
'      <p class="sea-sub" id="sea-sub">Setting up your astronomy lessons. This takes just a moment.</p>',
'      <div class="sea-namewrap" id="sea-namewrap">',
'        <label class="sea-label" for="sea-name">Before we lift off, what should we call you?</label>',
'        <input class="sea-input" id="sea-name" type="text" autocomplete="given-name" placeholder="Your name (optional)" />',
'      </div>',
'      <div class="sea-tip" id="sea-tip"></div>',
'      <button class="sea-btn" id="sea-board" disabled>',
'        <span class="sea-spinner" id="sea-spinner"></span><span id="sea-btnlabel">Preparing ' + BRAND_SHORT + '\u2026</span>',
'      </button>',
'      <div class="sea-progress"><div class="sea-progress-bar"></div></div>',
'      <div class="sea-foot">Free \u00b7 no account needed \u00b7 works offline \u00b7 your progress stays on this device</div>',
'    </div>',
'  </div>',
])

splashJs = "\n".join([
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
'      var raw = W.localStorage ? W.localStorage.getItem("astrohype_space_v1") : null;',
'      if (raw) { var st = JSON.parse(raw); if (st && st.onboarded) { returning = true; if (st.profile && st.profile.name) { knownName = st.profile.name; } } }',
'    } catch (e) {}',
'    if (returning) {',
'      if (nameWrap) { nameWrap.style.display = "none"; }',
'      if (h1) { h1.textContent = knownName ? ("Welcome back, " + knownName) : "Welcome back"; }',
'      if (sub) { sub.textContent = "Getting your star log ready. This takes just a moment."; }',
'    }',
'    if (nameInput) { nameInput.addEventListener("input", function () { W.__seaPrefill.name = nameInput.value; }); }',
'    var tips = [',
'      "On a clear, dark night you can see thousands of stars with just your eyes.",',
'      "Light from the Sun takes about eight minutes to reach Earth.",',
'      "There are more stars in the universe than grains of sand on every beach on Earth.",',
'      "Jupiter is so big that all the other planets could fit inside it.",',
'      "A day on Venus lasts longer than its whole year.",',
'      "The footprints on the Moon could last for millions of years.",',
'      "Neutron stars are so dense a teaspoon would weigh about a billion tonnes.",',
'      "Saturn is so light it would float in a big enough ocean of water."',
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
'      if (btnLabel) { btnLabel.textContent = returning ? "Enter ' + BRAND_SHORT + '" : "Start exploring"; }',
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
'  </' + SCR + '>',
])

reactBlock = '  <' + SCR + '>\n' + react + '\n  </' + SCR + '>'
reactDomBlock = '  <' + SCR + '>\n' + react_dom + '\n  </' + SCR + '>'

jsonBlob = json.dumps(DW, ensure_ascii=False).replace("</", "<\\/")
dataInline = ('  <' + SCR + ' type="application/json" id="sea-data">' + jsonBlob + '</' + SCR + '>\n'
  + '  <' + SCR + '>(function(){var D=JSON.parse(document.getElementById("sea-data").textContent);for(var k in D){window[k]=D[k];}})();</' + SCR + '>')
appBlock = '  <' + SCR + '>\n' + app + '\n  </' + SCR + '>'
footer = '</body>\n</html>\n'

html = head + "\n" + splashJs + "\n" + reactBlock + "\n" + reactDomBlock + "\n" + dataInline + "\n" + appBlock + "\n" + footer
open(OUT, "w", encoding="utf-8").write(html)
print("WROTE", OUT)
print("html bytes:", len(html), "| title present:", ("<title>"+BRAND) in html, "| badge:", BADGE in html)
print("D.L. Burich present:", ("Burich" in html or "Dustin" in html))
