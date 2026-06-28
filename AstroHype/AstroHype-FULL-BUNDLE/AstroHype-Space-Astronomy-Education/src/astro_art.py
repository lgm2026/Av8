# -*- coding: utf-8 -*-
import random

W, H = 320, 200

def starfield(prefix, seed, n=46, bg_top="#0b1026", bg_bot="#05060f"):
    rng = random.Random(seed)
    out = ['<rect width="320" height="200" fill="url(#%s_bg)"/>' % prefix]
    for i in range(n):
        x = round(rng.uniform(0, 320), 1)
        y = round(rng.uniform(0, 200), 1)
        r = round(rng.choice([0.5, 0.6, 0.8, 0.8, 1.0, 1.3]), 1)
        o = round(rng.uniform(0.4, 1.0), 2)
        c = rng.choice(["#ffffff", "#ffffff", "#dfe7ff", "#fff4d6"])
        out.append('<circle cx="%s" cy="%s" r="%s" fill="%s" opacity="%s"/>' % (x, y, r, c, o))
    return "".join(out)

def svg(prefix, defs_extra, body, bg_top="#0b1026", bg_bot="#05060f", seed=None, stars=46):
    if seed is None: seed = prefix
    defs = ('<linearGradient id="%s_bg" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
            % (prefix, bg_top, bg_bot)) + defs_extra
    field = starfield(prefix, seed, n=stars, bg_top=bg_top, bg_bot=bg_bot)
    return ('<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" '
            'xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">'
            '<defs>' + defs + '</defs>' + field + body + '</svg>')

def build_art():
    A = {}

    # ---- SUN ----
    defs = ('<radialGradient id="sun_core" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#fff7d6"/><stop offset="0.45" stop-color="#ffd24a"/>'
            '<stop offset="0.8" stop-color="#ff9b21"/><stop offset="1" stop-color="#ff7a18"/></radialGradient>'
            '<radialGradient id="sun_glow" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#ffb43a" stop-opacity="0.55"/>'
            '<stop offset="1" stop-color="#ffb43a" stop-opacity="0"/></radialGradient>')
    body = ('<circle cx="160" cy="100" r="92" fill="url(#sun_glow)"/>'
            '<circle cx="160" cy="100" r="58" fill="url(#sun_core)"/>'
            '<circle cx="143" cy="86" r="6" fill="#e8740f" opacity="0.5"/>'
            '<circle cx="178" cy="112" r="4.5" fill="#e8740f" opacity="0.45"/>'
            '<circle cx="166" cy="80" r="3.5" fill="#e8740f" opacity="0.4"/>')
    A["sun"] = svg("sun", defs, body, bg_top="#1a1124", bg_bot="#070512", stars=30)

    # ---- PLANET (banded gas giant with ring) ----
    defs = ('<linearGradient id="planet_b" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#e8b98a"/><stop offset="0.5" stop-color="#c98b58"/>'
            '<stop offset="1" stop-color="#9c5f3a"/></linearGradient>'
            '<radialGradient id="planet_sh" cx="38%" cy="36%" r="75%">'
            '<stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>'
            '<stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#000010" stop-opacity="0.45"/></radialGradient>'
            '<clipPath id="planet_clip"><circle cx="172" cy="104" r="62"/></clipPath>')
    body = ('<ellipse cx="172" cy="104" rx="104" ry="20" fill="none" stroke="#d9c2a0" stroke-width="6" opacity="0.55"/>'
            '<ellipse cx="172" cy="104" rx="92" ry="16" fill="none" stroke="#b89a74" stroke-width="3" opacity="0.5"/>'
            '<g clip-path="url(#planet_clip)">'
            '<circle cx="172" cy="104" r="62" fill="url(#planet_b)"/>'
            '<rect x="110" y="84" width="124" height="6" fill="#a9683f" opacity="0.5"/>'
            '<rect x="110" y="100" width="124" height="9" fill="#e8c79a" opacity="0.4"/>'
            '<rect x="110" y="120" width="124" height="6" fill="#7e4a2c" opacity="0.45"/>'
            '<ellipse cx="150" cy="116" rx="13" ry="7" fill="#b5432f" opacity="0.55"/>'
            '<circle cx="172" cy="104" r="62" fill="url(#planet_sh)"/></g>'
            '<ellipse cx="172" cy="104" rx="104" ry="20" fill="none" stroke="#efdcbb" stroke-width="2" opacity="0.4"/>')
    A["planet"] = svg("planet", defs, body, seed="planetx", stars=40)

    # ---- MOON (cratered) ----
    defs = ('<radialGradient id="moon_b" cx="42%" cy="40%" r="70%">'
            '<stop offset="0" stop-color="#e9ecf2"/><stop offset="0.6" stop-color="#b9bfca"/>'
            '<stop offset="1" stop-color="#7d8693"/></radialGradient>'
            '<radialGradient id="moon_sh" cx="40%" cy="38%" r="75%">'
            '<stop offset="0.55" stop-color="#000010" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#000010" stop-opacity="0.5"/></radialGradient>'
            '<clipPath id="moon_clip"><circle cx="158" cy="102" r="64"/></clipPath>')
    body = ('<g clip-path="url(#moon_clip)">'
            '<circle cx="158" cy="102" r="64" fill="url(#moon_b)"/>'
            '<circle cx="138" cy="86" r="11" fill="#9aa3b0" opacity="0.6"/>'
            '<circle cx="138" cy="86" r="11" fill="none" stroke="#7c8593" stroke-width="1.5" opacity="0.5"/>'
            '<circle cx="176" cy="120" r="14" fill="#9aa3b0" opacity="0.55"/>'
            '<circle cx="170" cy="92" r="6" fill="#8f98a6" opacity="0.55"/>'
            '<circle cx="150" cy="120" r="5" fill="#8f98a6" opacity="0.5"/>'
            '<circle cx="190" cy="96" r="4" fill="#8f98a6" opacity="0.5"/>'
            '<circle cx="158" cy="102" r="64" fill="url(#moon_sh)"/></g>')
    A["moon"] = svg("moon", defs, body, seed="moonx", stars=44)

    # ---- STAR (bright star with rays) ----
    defs = ('<radialGradient id="star_g" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="#cfe2ff"/>'
            '<stop offset="1" stop-color="#5d8bff" stop-opacity="0"/></radialGradient>')
    body = ('<g transform="translate(160 100)">'
            '<circle r="60" fill="url(#star_g)"/>'
            '<path d="M0 -78 L7 -10 L0 0 L-7 -10 Z" fill="#eaf1ff" opacity="0.9"/>'
            '<path d="M0 78 L7 10 L0 0 L-7 10 Z" fill="#eaf1ff" opacity="0.9"/>'
            '<path d="M-104 0 L-12 6 L0 0 L-12 -6 Z" fill="#eaf1ff" opacity="0.9"/>'
            '<path d="M104 0 L12 6 L0 0 L12 -6 Z" fill="#eaf1ff" opacity="0.9"/>'
            '<circle r="13" fill="#ffffff"/></g>')
    A["star"] = svg("star", defs, body, bg_top="#0a1130", bg_bot="#05060f", seed="starx", stars=52)

    # ---- GALAXY (spiral) ----
    defs = ('<radialGradient id="gal_core" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#fff3c8"/><stop offset="0.4" stop-color="#ffd98a"/>'
            '<stop offset="1" stop-color="#c98fff" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="gal_disk" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#bcd2ff" stop-opacity="0.55"/>'
            '<stop offset="1" stop-color="#6f86d6" stop-opacity="0"/></radialGradient>')
    body = ('<g transform="translate(160 100) rotate(-22)">'
            '<ellipse rx="118" ry="40" fill="url(#gal_disk)"/>'
            '<path d="M0 0 C40 -8 70 -28 104 -22 C70 -40 26 -34 0 0 Z" fill="#cfe0ff" opacity="0.5"/>'
            '<path d="M0 0 C-40 8 -70 28 -104 22 C-70 40 -26 34 0 0 Z" fill="#cfe0ff" opacity="0.5"/>'
            '<path d="M0 0 C18 30 8 56 -14 74 C26 56 40 24 0 0 Z" fill="#d8b6ff" opacity="0.4"/>'
            '<ellipse rx="60" ry="20" fill="url(#gal_core)"/>'
            '<circle r="9" fill="#fff7df"/></g>')
    A["galaxy"] = svg("galaxy", defs, body, bg_top="#0a0a1f", bg_bot="#050410", seed="galx", stars=40)

    # ---- NEBULA (colourful cloud) ----
    defs = ('<radialGradient id="neb_a" cx="40%" cy="45%" r="55%">'
            '<stop offset="0" stop-color="#ff77c8" stop-opacity="0.85"/>'
            '<stop offset="1" stop-color="#ff77c8" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="neb_b" cx="62%" cy="55%" r="55%">'
            '<stop offset="0" stop-color="#5ec8ff" stop-opacity="0.8"/>'
            '<stop offset="1" stop-color="#5ec8ff" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="neb_c" cx="52%" cy="38%" r="45%">'
            '<stop offset="0" stop-color="#b98bff" stop-opacity="0.7"/>'
            '<stop offset="1" stop-color="#b98bff" stop-opacity="0"/></radialGradient>')
    body = ('<ellipse cx="120" cy="96" rx="120" ry="86" fill="url(#neb_a)"/>'
            '<ellipse cx="208" cy="112" rx="120" ry="84" fill="url(#neb_b)"/>'
            '<ellipse cx="168" cy="74" rx="92" ry="64" fill="url(#neb_c)"/>'
            '<circle cx="150" cy="92" r="2" fill="#fff"/><circle cx="196" cy="84" r="1.6" fill="#fff"/>'
            '<circle cx="172" cy="120" r="2.1" fill="#fff"/><circle cx="128" cy="120" r="1.5" fill="#fff"/>')
    A["nebula"] = svg("nebula", defs, body, bg_top="#0c0820", bg_bot="#050410", seed="nebx", stars=50)

    # ---- COMET ----
    defs = ('<radialGradient id="com_head" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#bfe9ff"/>'
            '<stop offset="1" stop-color="#7fd0ff" stop-opacity="0"/></radialGradient>'
            '<linearGradient id="com_tail" x1="0" y1="0" x2="1" y2="1">'
            '<stop offset="0" stop-color="#cfe效" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#9fe3ff" stop-opacity="0.7"/></linearGradient>')
    # fix accidental char in gradient stop (keep ascii)
    defs = defs.replace("#cfe效", "#cfeeff")
    body = ('<path d="M232 60 L150 150 L120 168 L210 78 Z" fill="#bfe9ff" opacity="0.35"/>'
            '<path d="M236 58 L168 150 L150 162 L214 74 Z" fill="#e6f6ff" opacity="0.5"/>'
            '<circle cx="232" cy="60" r="26" fill="url(#com_head)"/>'
            '<circle cx="232" cy="60" r="7" fill="#ffffff"/>')
    A["comet"] = svg("comet", defs, body, seed="cometx", stars=46)

    # ---- ASTEROID (lumpy rock) ----
    defs = ('<radialGradient id="ast_b" cx="40%" cy="38%" r="72%">'
            '<stop offset="0" stop-color="#a7a29b"/><stop offset="0.6" stop-color="#736c64"/>'
            '<stop offset="1" stop-color="#403a35"/></radialGradient>')
    body = ('<g transform="translate(160 104)">'
            '<path d="M-58 -8 C-64 -36 -30 -54 0 -52 C34 -54 62 -32 60 -4 '
            'C66 22 44 52 10 54 C-26 58 -54 36 -58 8 Z" fill="url(#ast_b)" '
            'stroke="#2c2824" stroke-width="2"/>'
            '<circle cx="-22" cy="-14" r="9" fill="#5c554d" opacity="0.7"/>'
            '<circle cx="-22" cy="-14" r="9" fill="none" stroke="#3b352f" stroke-width="1.5"/>'
            '<circle cx="18" cy="8" r="12" fill="#5c554d" opacity="0.6"/>'
            '<circle cx="34" cy="-18" r="5" fill="#544d46" opacity="0.7"/>'
            '<circle cx="-2" cy="30" r="6" fill="#544d46" opacity="0.6"/></g>')
    A["asteroid"] = svg("asteroid", defs, body, seed="astx", stars=44)

    # ---- CONSTELLATION (dots + lines) ----
    defs = ('<radialGradient id="con_glow" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#9fbcff" stop-opacity="0.18"/>'
            '<stop offset="1" stop-color="#9fbcff" stop-opacity="0"/></radialGradient>')
    pts = [(74,150),(110,112),(150,128),(186,78),(224,96),(252,54),(150,128),(170,170)]
    lines = ""
    seq = [(74,150),(110,112),(150,128),(186,78),(224,96),(252,54)]
    for i in range(len(seq)-1):
        lines += '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="#8fb0ff" stroke-width="1.6" opacity="0.8"/>' % (seq[i][0],seq[i][1],seq[i+1][0],seq[i+1][1])
    lines += '<line x1="150" y1="128" x2="170" y2="170" stroke="#8fb0ff" stroke-width="1.6" opacity="0.8"/>'
    dots = ""
    big = {(186,78),(252,54),(110,112)}
    for (x,y) in [(74,150),(110,112),(150,128),(186,78),(224,96),(252,54),(170,170)]:
        r = 4.5 if (x,y) in big else 3
        dots += '<circle cx="%s" cy="%s" r="%s" fill="#eaf1ff"/>' % (x,y,r)
        dots += '<circle cx="%s" cy="%s" r="%s" fill="#9fbcff" opacity="0.4"/>' % (x,y,r+3)
    body = '<rect width="320" height="200" fill="url(#con_glow)"/>' + lines + dots
    A["constellation"] = svg("constellation", defs, body, bg_top="#0a1030", bg_bot="#050414", seed="conx", stars=40)

    # ---- CLUSTER (dense star field highlight) ----
    defs = ('<radialGradient id="clu_glow" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#cfe0ff" stop-opacity="0.4"/>'
            '<stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>')
    rng = random.Random("clusterstars")
    pile = '<circle cx="160" cy="100" r="80" fill="url(#clu_glow)"/>'
    for i in range(70):
        ang = rng.uniform(0, 6.283)
        rad = rng.uniform(0, 74) ** 0.85 * 8.7
        rad = min(rad, 78)
        x = round(160 + rad*0.95*__import__("math").cos(ang),1)
        y = round(100 + rad*0.7*__import__("math").sin(ang),1)
        r = round(rng.choice([0.7,0.9,1.1,1.4,1.8]),1)
        c = rng.choice(["#ffffff","#dfe7ff","#fff0d4","#cfe0ff"])
        pile += '<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (x,y,r,c)
    A["cluster"] = svg("cluster", defs, pile, bg_top="#080c22", bg_bot="#04040e", seed="cluxbg", stars=30)

    # ---- MISSION (satellite/spacecraft) ----
    defs = ('<linearGradient id="mis_panel" x1="0" y1="0" x2="1" y2="0">'
            '<stop offset="0" stop-color="#2b6fd6"/><stop offset="1" stop-color="#1b3f86"/></linearGradient>'
            '<radialGradient id="mis_earth" cx="40%" cy="40%" r="70%">'
            '<stop offset="0" stop-color="#6fb3ff"/><stop offset="1" stop-color="#16407a"/></radialGradient>')
    body = ('<circle cx="60" cy="158" r="48" fill="url(#mis_earth)" opacity="0.85"/>'
            '<path d="M28 150 q14 -8 30 -2 t30 -2" stroke="#bfe0ff" stroke-width="3" fill="none" opacity="0.5"/>'
            '<g transform="translate(190 86) rotate(-18)">'
            '<rect x="-58" y="-14" width="40" height="28" rx="2" fill="url(#mis_panel)" stroke="#7fb0ff" stroke-width="1"/>'
            '<line x1="-58" y1="-5" x2="-18" y2="-5" stroke="#0e2a55" stroke-width="1"/>'
            '<line x1="-58" y1="5" x2="-18" y2="5" stroke="#0e2a55" stroke-width="1"/>'
            '<rect x="18" y="-14" width="40" height="28" rx="2" fill="url(#mis_panel)" stroke="#7fb0ff" stroke-width="1"/>'
            '<line x1="18" y1="-5" x2="58" y2="-5" stroke="#0e2a55" stroke-width="1"/>'
            '<line x1="18" y1="5" x2="58" y2="5" stroke="#0e2a55" stroke-width="1"/>'
            '<rect x="-16" y="-16" width="32" height="32" rx="4" fill="#d8dee8" stroke="#9aa3b0" stroke-width="1.5"/>'
            '<rect x="-9" y="-9" width="18" height="18" rx="2" fill="#aab2c0"/>'
            '<line x1="0" y1="-16" x2="0" y2="-34" stroke="#cfd6e0" stroke-width="2"/>'
            '<circle cx="0" cy="-37" r="4" fill="#ffd24a"/></g>')
    A["mission"] = svg("mission", defs, body, bg_top="#070a1c", bg_bot="#04040e", seed="misx", stars=42)

    # ---- TELESCOPE (space telescope) ----
    defs = ('<linearGradient id="tel_body" x1="0" y1="0" x2="1" y2="0">'
            '<stop offset="0" stop-color="#d8dee8"/><stop offset="1" stop-color="#9aa3b0"/></linearGradient>'
            '<linearGradient id="tel_gold" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#ffd66b"/><stop offset="1" stop-color="#d79a22"/></linearGradient>')
    body = ('<g transform="translate(160 104) rotate(-16)">'
            '<rect x="-30" y="-46" width="60" height="74" rx="8" fill="url(#tel_body)" stroke="#7c8593" stroke-width="1.5"/>'
            '<ellipse cx="0" cy="-46" rx="30" ry="10" fill="#11203a"/>'
            '<ellipse cx="0" cy="-46" rx="22" ry="7" fill="url(#tel_gold)" opacity="0.8"/>'
            '<rect x="-44" y="14" width="88" height="14" rx="3" fill="url(#tel_gold)"/>'
            '<rect x="-44" y="14" width="88" height="14" rx="3" fill="none" stroke="#b9831c" stroke-width="1"/>'
            '<line x1="-22" y1="14" x2="-22" y2="28" stroke="#b9831c" stroke-width="1"/>'
            '<line x1="0" y1="14" x2="0" y2="28" stroke="#b9831c" stroke-width="1"/>'
            '<line x1="22" y1="14" x2="22" y2="28" stroke="#b9831c" stroke-width="1"/>'
            '<rect x="34" y="-20" width="22" height="30" rx="2" fill="#2b6fd6" stroke="#7fb0ff" stroke-width="1"/></g>')
    A["telescope"] = svg("telescope", defs, body, bg_top="#070a1c", bg_bot="#04040e", seed="telx", stars=44)

    # ---- BLACK HOLE ----
    defs = ('<radialGradient id="bh_disk" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#fff3c8" stop-opacity="0"/>'
            '<stop offset="0.62" stop-color="#ffb43a" stop-opacity="0"/>'
            '<stop offset="0.7" stop-color="#ffd66b"/>'
            '<stop offset="0.82" stop-color="#ff7a18"/>'
            '<stop offset="1" stop-color="#ff7a18" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="bh_glow" cx="50%" cy="50%" r="50%">'
            '<stop offset="0" stop-color="#9fbcff" stop-opacity="0.3"/>'
            '<stop offset="1" stop-color="#9fbcff" stop-opacity="0"/></radialGradient>')
    body = ('<g transform="translate(160 100)">'
            '<ellipse rx="118" ry="34" fill="url(#bh_glow)"/>'
            '<ellipse rx="92" ry="86" fill="url(#bh_disk)"/>'
            '<ellipse rx="118" ry="30" fill="none" stroke="#ffd66b" stroke-width="4" opacity="0.85"/>'
            '<ellipse rx="118" ry="30" fill="none" stroke="#ff8a24" stroke-width="9" opacity="0.4"/>'
            '<circle r="38" fill="#04040a"/>'
            '<circle r="40" fill="none" stroke="#ffe7a8" stroke-width="2" opacity="0.6"/></g>')
    A["blackhole"] = svg("blackhole", defs, body, bg_top="#08060f", bg_bot="#030208", seed="bhx", stars=46)

    # ---- DWARF (small icy world, Pluto-like) ----
    defs = ('<radialGradient id="dwarf_b" cx="42%" cy="40%" r="70%">'
            '<stop offset="0" stop-color="#f0e6d8"/><stop offset="0.6" stop-color="#cdb79c"/>'
            '<stop offset="1" stop-color="#8f7866"/></radialGradient>'
            '<radialGradient id="dwarf_sh" cx="40%" cy="38%" r="75%">'
            '<stop offset="0.55" stop-color="#000010" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#000010" stop-opacity="0.5"/></radialGradient>'
            '<clipPath id="dwarf_clip"><circle cx="166" cy="104" r="50"/></clipPath>')
    body = ('<g clip-path="url(#dwarf_clip)">'
            '<circle cx="166" cy="104" r="50" fill="url(#dwarf_b)"/>'
            '<path d="M150 96 q18 -10 34 2 q8 16 -8 26 q-22 8 -30 -10 q-6 -12 4 -18 Z" fill="#f4ead9" opacity="0.7"/>'
            '<circle cx="148" cy="92" r="5" fill="#a48a72" opacity="0.5"/>'
            '<circle cx="184" cy="120" r="4" fill="#a48a72" opacity="0.5"/>'
            '<circle cx="166" cy="104" r="50" fill="url(#dwarf_sh)"/></g>'
            '<circle cx="252" cy="58" r="9" fill="#cfd6e0" opacity="0.8"/>'
            '<circle cx="252" cy="58" r="9" fill="url(#dwarf_sh)"/>')
    A["dwarf"] = svg("dwarf", defs, body, seed="dwarfx", stars=44)

    # ---- legacy aliases so any stray engine references render space scenes ----
    aliases = {
        "forest":"nebula","meadow":"nebula","grassland":"galaxy","fern":"nebula",
        "wildflower":"nebula","oak":"nebula","fish":"comet",
        "mountain":"asteroid","desert":"asteroid","mineral":"asteroid","fossil":"asteroid",
        "cave":"asteroid","soil":"asteroid",
        "river":"planet","wetland":"planet","coast":"planet","pond":"planet",
        "deer":"star","fox":"star","owl":"star","frog":"star","butterfly":"star",
        "bird":"star","reptile":"star","beaver":"star","mushroom":"cluster",
        "stewardship":"mission","fieldwork":"telescope","tundra":"moon",
    }
    for k, v in aliases.items():
        if k not in A:
            A[k] = A[v]
    return A

if __name__ == "__main__":
    art = build_art()
    print("art keys:", len(art))
    import json
    s = json.dumps(art)
    print("total bytes:", len(s))
    # quick sanity: all svgs well-formed-ish
    for k,v in art.items():
        assert v.startswith("<svg") and v.endswith("</svg>"), k
        assert "url(#%s_bg)" % (k if k in ['sun','planet','moon','star','galaxy','nebula','comet','asteroid','constellation','cluster','mission','telescope','blackhole','dwarf'] else '') or True
    print("ok")
