#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# TerraHype procedural SVG scenes -> window.SEA_ART (land / nature themed).
import json

W, H = 320, 200
def svg(defs, body):
    return ('<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" '
            'xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display:block">'
            + '<defs>' + defs + '</defs>' + body + '</svg>')
def lin(i, c0, c1, x2="0", y2="1"):
    return ('<linearGradient id="' + i + '" x1="0" y1="0" x2="' + x2 + '" y2="' + y2 + '">'
            '<stop offset="0" stop-color="' + c0 + '"/><stop offset="1" stop-color="' + c1 + '"/></linearGradient>')
def rad(i, c0, c1, cx="50%", cy="50%", r="50%"):
    return ('<radialGradient id="' + i + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">'
            '<stop offset="0" stop-color="' + c0 + '"/><stop offset="1" stop-color="' + c1 + '"/></radialGradient>')
def sky(i, warm=False):
    return lin(i, "#FBE7C6" if warm else "#CFE9F4", "#F4B27A" if warm else "#A6D4E8")
def sun(i, cx, cy, r):
    return ('<circle cx="' + str(cx) + '" cy="' + str(cy) + '" r="' + str(r) + '" fill="url(#' + i + ')"/>')
def tree(x, by, s, k):
    # simple broadleaf tree: brown trunk + 3 green blobs
    tr = '<rect x="' + str(x-3*s) + '" y="' + str(by-26*s) + '" width="' + str(6*s) + '" height="' + str(28*s) + '" rx="2" fill="#6B4A2B"/>'
    g = ('<circle cx="' + str(x) + '" cy="' + str(by-38*s) + '" r="' + str(16*s) + '" fill="' + k + '"/>'
         '<circle cx="' + str(x-12*s) + '" cy="' + str(by-30*s) + '" r="' + str(12*s) + '" fill="' + k + '"/>'
         '<circle cx="' + str(x+12*s) + '" cy="' + str(by-30*s) + '" r="' + str(12*s) + '" fill="' + k + '"/>')
    return tr + g
def conifer(x, by, s, k):
    tr = '<rect x="' + str(x-2*s) + '" y="' + str(by-8*s) + '" width="' + str(4*s) + '" height="' + str(10*s) + '" fill="#6B4A2B"/>'
    t = ''
    for i, (w, yy) in enumerate([(18, 0), (15, 12), (11, 22)]):
        t += ('<path d="M' + str(x-w*s) + ' ' + str(by-(8+yy)*s) + ' L' + str(x) + ' ' + str(by-(34+yy)*s)
              + ' L' + str(x+w*s) + ' ' + str(by-(8+yy)*s) + ' Z" fill="' + k + '"/>')
    return tr + t

SCENES = {}

# ---------- forest (layered) ----------
SCENES["forest"] = svg(
 sky("forest_sky") + lin("forest_far", "#3E7D4E", "#2C5E3A") + lin("forest_near", "#2C6E3A", "#17421F")
 + lin("forest_path", "#C9A86B", "#A07E4A"),
 '<rect width="320" height="200" fill="url(#forest_sky)"/>'
 + '<path d="M0 120 Q80 96 160 116 T320 110 V200 H0 Z" fill="url(#forest_far)"/>'
 + conifer(40, 124, 1.5, "#3A7A4A") + conifer(80, 130, 1.2, "#347044") + conifer(280, 126, 1.5, "#3A7A4A") + conifer(245, 132, 1.1, "#347044")
 + '<path d="M0 150 Q90 128 180 150 T320 146 V200 H0 Z" fill="url(#forest_near)"/>'
 + '<path d="M150 200 Q160 168 150 150 Q172 168 196 200 Z" fill="url(#forest_path)" opacity="0.85"/>'
 + tree(120, 176, 1.2, "#2E8B40") + tree(210, 178, 1.3, "#287A38"))

# ---------- oak (single broad tree on grass) ----------
SCENES["oak"] = svg(
 sky("oak_sky") + lin("oak_grass", "#6FB85A", "#3E8B40") + rad("oak_crown", "#5FB85E", "#2E7A38", "50%", "40%", "60%"),
 '<rect width="320" height="200" fill="url(#oak_sky)"/>' + sun("oak_sky", 0, 0, 0)
 + '<path d="M0 150 Q160 132 320 150 V200 H0 Z" fill="url(#oak_grass)"/>'
 + '<rect x="150" y="96" width="20" height="70" rx="4" fill="#6B4A2B"/>'
 + '<path d="M160 120 L138 100 M160 120 L182 100 M160 110 L150 92 M160 110 L172 92" stroke="#6B4A2B" stroke-width="6" fill="none"/>'
 + '<ellipse cx="160" cy="86" rx="62" ry="46" fill="url(#oak_crown)"/>'
 + '<circle cx="120" cy="92" r="22" fill="#3E8B45"/><circle cx="200" cy="92" r="22" fill="#3E8B45"/>')

# ---------- meadow ----------
def flower(x, y, c):
    return ('<g transform="translate(' + str(x) + ',' + str(y) + ')">'
            '<rect x="-1" y="0" width="2" height="10" fill="#3E8B40"/>'
            '<circle cx="0" cy="-2" r="3.4" fill="' + c + '"/><circle cx="0" cy="-2" r="1.4" fill="#FFE08A"/></g>')
SCENES["meadow"] = svg(
 sky("meadow_sky") + lin("meadow_g1", "#8FD06A", "#5BA94A") + lin("meadow_g2", "#6FBF52", "#3E8B40"),
 '<rect width="320" height="200" fill="url(#meadow_sky)"/>' + sun("meadow_sun", 0, 0, 0)
 + rad("meadow_sun", "#FFF6D8", "#FFE08A", "80%", "26%", "20%") + '<circle cx="256" cy="52" r="26" fill="url(#meadow_sun)"/>'
 + '<path d="M0 128 Q160 108 320 128 V200 H0 Z" fill="url(#meadow_g1)"/>'
 + '<path d="M0 156 Q160 140 320 156 V200 H0 Z" fill="url(#meadow_g2)"/>'
 + flower(50,150,"#E2607A")+flower(96,160,"#7C6FE0")+flower(150,150,"#FFB347")+flower(210,162,"#E2607A")+flower(264,152,"#7C6FE0")+flower(30,170,"#FFB347")+flower(180,172,"#E86FA0"))

# ---------- wildflower (close-up) ----------
SCENES["wildflower"] = svg(
 lin("wf_bg", "#BFE3C9", "#7FBF8A") + lin("wf_stem", "#3E8B40", "#2E7A38"),
 '<rect width="320" height="200" fill="url(#wf_bg)"/>'
 + '<rect x="60" y="96" width="5" height="100" fill="url(#wf_stem)"/><rect x="158" y="70" width="6" height="130" fill="url(#wf_stem)"/><rect x="250" y="104" width="5" height="96" fill="url(#wf_stem)"/>'
 + '<path d="M62 140 q-26 -8 -34 -26 q22 0 36 16 Z" fill="#3E8B45"/><path d="M161 150 q28 -8 36 -28 q-24 0 -38 18 Z" fill="#3E8B45"/>'
 + '<g transform="translate(62,96)">' + ''.join('<ellipse cx="' + str(int(11*__import__("math").cos(a))) + '" cy="' + str(int(11*__import__("math").sin(a))) + '" rx="6" ry="3.4" fill="#E2607A" transform="rotate(' + str(int(a*57.3)) + ')"/>' for a in [0,1.05,2.09,3.14,4.19,5.24]) + '<circle r="5" fill="#FFD24A"/></g>'
 + '<g transform="translate(161,70)">' + ''.join('<ellipse cx="' + str(int(13*__import__("math").cos(a))) + '" cy="' + str(int(13*__import__("math").sin(a))) + '" rx="7" ry="4" fill="#7C6FE0" transform="rotate(' + str(int(a*57.3)) + ')"/>' for a in [0,1.05,2.09,3.14,4.19,5.24]) + '<circle r="6" fill="#FFD24A"/></g>'
 + '<g transform="translate(252,104)">' + ''.join('<ellipse cx="' + str(int(10*__import__("math").cos(a))) + '" cy="' + str(int(10*__import__("math").sin(a))) + '" rx="6" ry="3.2" fill="#FFB347" transform="rotate(' + str(int(a*57.3)) + ')"/>' for a in [0,1.05,2.09,3.14,4.19,5.24]) + '<circle r="4.5" fill="#C75A2A"/></g>')

# ---------- fern / mossy understory ----------
def frond(x, by, s, rot):
    leaf = ''
    for i in range(7):
        yy = -i*7*s
        ln = (13 - i*1.4)*s
        leaf += ('<path d="M0 ' + str(yy) + ' q ' + str(ln) + ' -3 ' + str(ln+2) + ' -8" stroke="#3E8B45" stroke-width="2.2" fill="none"/>'
                 '<path d="M0 ' + str(yy) + ' q ' + str(-ln) + ' -3 ' + str(-ln-2) + ' -8" stroke="#3E8B45" stroke-width="2.2" fill="none"/>')
    return ('<g transform="translate(' + str(x) + ',' + str(by) + ') rotate(' + str(rot) + ')">'
            '<path d="M0 0 L0 ' + str(int(-52*s)) + '" stroke="#2E7A38" stroke-width="3" fill="none"/>' + leaf + '</g>')
SCENES["fern"] = svg(
 lin("fern_bg", "#284E30", "#16331E") + rad("fern_glow", "#3E6E44", "#1C3A22", "40%", "20%", "70%"),
 '<rect width="320" height="200" fill="url(#fern_bg)"/><rect width="320" height="200" fill="url(#fern_glow)" opacity="0.7"/>'
 + '<ellipse cx="160" cy="196" rx="180" ry="30" fill="#1C3A22"/>'
 + frond(70, 196, 1.5, -12) + frond(120, 200, 1.8, -2) + frond(180, 198, 1.7, 6) + frond(240, 196, 1.5, 14) + frond(290, 200, 1.3, 20)
 + '<circle cx="40" cy="180" r="10" fill="#3E8B45" opacity="0.5"/><circle cx="300" cy="176" r="8" fill="#3E8B45" opacity="0.5"/>')

# ---------- mushroom ----------
def mush(x, by, s, cap):
    return ('<g transform="translate(' + str(x) + ',' + str(by) + ')">'
            '<path d="M' + str(-5*s) + ' 0 q0 ' + str(-14*s) + ' ' + str(5*s) + ' ' + str(-14*s) + ' q' + str(5*s) + ' 0 ' + str(5*s) + ' ' + str(14*s) + ' Z" fill="#F3E6CE"/>'
            '<path d="M' + str(-15*s) + ' 0 q' + str(15*s) + ' ' + str(-20*s) + ' ' + str(30*s) + ' 0 Z" fill="' + cap + '"/>'
            '<circle cx="' + str(-5*s) + '" cy="' + str(-7*s) + '" r="1.6" fill="#FFF4E0"/><circle cx="' + str(6*s) + '" cy="' + str(-9*s) + '" r="1.8" fill="#FFF4E0"/></g>')
SCENES["mushroom"] = svg(
 lin("mush_bg", "#3A5E3C", "#22421F") + lin("mush_floor", "#5A4A30", "#3A2E1C"),
 '<rect width="320" height="200" fill="url(#mush_bg)"/>'
 + '<path d="M0 140 Q160 122 320 140 V200 H0 Z" fill="url(#mush_floor)"/>'
 + '<path d="M20 150 q30 -6 60 0 M210 156 q40 -6 80 0" stroke="#6E5A38" stroke-width="3" fill="none" opacity="0.6"/>'
 + mush(110, 168, 2.0, "#C0392B") + mush(150, 176, 1.4, "#D35400") + mush(200, 170, 1.7, "#B83227")
 + '<ellipse cx="70" cy="184" rx="26" ry="6" fill="#2E7A38" opacity="0.5"/><ellipse cx="260" cy="182" rx="30" ry="6" fill="#2E7A38" opacity="0.5"/>')

# ---------- grassland / prairie ----------
def blade(x, by, h, c):
    return '<path d="M' + str(x) + ' ' + str(by) + ' q -3 ' + str(-h/2) + ' 0 ' + str(-h) + '" stroke="' + c + '" stroke-width="2.4" fill="none"/>'
SCENES["grassland"] = svg(
 sky("grass_sky") + lin("grass_field", "#D8C46A", "#B89A3E"),
 '<rect width="320" height="200" fill="url(#grass_sky)"/>'
 + rad("grass_sun", "#FFF6D8", "#FFD98A", "76%", "30%", "18%") + '<circle cx="246" cy="56" r="24" fill="url(#grass_sun)"/>'
 + '<path d="M0 138 Q160 126 320 138 V200 H0 Z" fill="url(#grass_field)"/>'
 + ''.join(blade(x, 200, 40 + (x % 5)*4, "#C9AE4A" if x % 2 else "#B8983E") for x in range(8, 320, 13))
 + ''.join(blade(x, 168, 26 + (x % 4)*3, "#D8C46A") for x in range(18, 320, 17)))

# ---------- wetland ----------
SCENES["wetland"] = svg(
 sky("wet_sky") + lin("wet_water", "#7FB8C8", "#3E7E94") + lin("wet_bank", "#5BA94A", "#3E7A3A"),
 '<rect width="320" height="200" fill="url(#wet_sky)"/>'
 + '<path d="M0 110 Q160 96 320 110 V200 H0 Z" fill="url(#wet_water)"/>'
 + '<path d="M0 118 q40 -8 80 0 t80 0 t80 0 t80 0" stroke="#A9D6E8" stroke-width="2" fill="none" opacity="0.6"/>'
 + '<path d="M0 150 q40 -8 80 0 t80 0 t80 0 t80 0" stroke="#7FB8C8" stroke-width="2" fill="none" opacity="0.5"/>'
 + '<path d="M0 134 Q60 122 120 134 V200 H0 Z" fill="url(#wet_bank)"/>'
 # cattails
 + ''.join('<g transform="translate(' + str(x) + ',128)"><rect x="-1.5" y="0" width="3" height="72" fill="#3E7A3A"/><rect x="-3.5" y="-16" width="7" height="20" rx="3.5" fill="#6B4A2B"/><path d="M0 -16 L0 -30" stroke="#3E7A3A" stroke-width="2"/></g>' for x in [26, 40, 54])
 + '<path d="M250 200 q-6 -70 -2 -86 M268 200 q4 -66 0 -84 M286 200 q-4 -60 2 -78" stroke="#3E8B45" stroke-width="3" fill="none"/>')

# ---------- desert ----------
def saguaro(x, by, s):
    return ('<g transform="translate(' + str(x) + ',' + str(by) + ')">'
            '<rect x="' + str(-5*s) + '" y="' + str(-54*s) + '" width="' + str(10*s) + '" height="' + str(56*s) + '" rx="5" fill="#3E7A3A"/>'
            '<path d="M' + str(-5*s) + ' ' + str(-30*s) + ' h' + str(-12*s) + ' v' + str(-16*s) + '" stroke="#3E7A3A" stroke-width="' + str(7*s) + '" fill="none" stroke-linecap="round"/>'
            '<path d="M' + str(5*s) + ' ' + str(-38*s) + ' h' + str(12*s) + ' v' + str(-14*s) + '" stroke="#3E7A3A" stroke-width="' + str(7*s) + '" fill="none" stroke-linecap="round"/></g>')
SCENES["desert"] = svg(
 sky("des_sky", warm=True) + lin("des_sand", "#E9C58A", "#C99A5A") + lin("des_far", "#D8A878", "#B98858"),
 '<rect width="320" height="200" fill="url(#des_sky)"/>'
 + rad("des_sun", "#FFF1C8", "#FFC987", "70%", "32%", "22%") + '<circle cx="232" cy="62" r="30" fill="url(#des_sun)"/>'
 + '<path d="M0 132 L120 104 L220 130 L320 110 V200 H0 Z" fill="url(#des_far)" opacity="0.7"/>'
 + '<path d="M0 150 Q160 134 320 150 V200 H0 Z" fill="url(#des_sand)"/>'
 + saguaro(120, 176, 1.6) + saguaro(170, 182, 1.0)
 + '<ellipse cx="250" cy="178" rx="22" ry="6" fill="#B98858"/><path d="M236 178 q14 -10 28 0" stroke="#9A7A48" stroke-width="3" fill="none"/>')

# ---------- mountain ----------
SCENES["mountain"] = svg(
 sky("mtn_sky") + lin("mtn_far", "#8FA9C0", "#6E89A6") + lin("mtn_near", "#5E7E66", "#3E5E44"),
 '<rect width="320" height="200" fill="url(#mtn_sky)"/>'
 + '<path d="M-10 150 L70 60 L150 150 Z" fill="url(#mtn_far)"/><path d="M120 150 L210 44 L320 150 Z" fill="url(#mtn_far)"/>'
 + '<path d="M70 60 L52 84 L70 80 L82 96 L90 82 Z" fill="#FFFFFF" opacity="0.92"/>'
 + '<path d="M210 44 L190 76 L208 70 L222 90 L232 70 Z" fill="#FFFFFF" opacity="0.95"/>'
 + '<path d="M0 150 Q160 128 320 150 V200 H0 Z" fill="url(#mtn_near)"/>'
 + conifer(40, 176, 1.3, "#2E6E3C") + conifer(80, 182, 1.0, "#286636") + conifer(250, 178, 1.2, "#2E6E3C") + conifer(290, 184, 1.0, "#286636"))

# ---------- river / stream ----------
SCENES["river"] = svg(
 sky("riv_sky") + lin("riv_bank", "#5BA94A", "#3E7A3A") + lin("riv_water", "#8FCDE0", "#4E93B0"),
 '<rect width="320" height="200" fill="url(#riv_sky)"/>'
 + '<path d="M0 120 Q160 104 320 120 V200 H0 Z" fill="url(#riv_bank)"/>'
 + '<path d="M120 200 C140 150 110 140 150 120 C176 104 150 96 168 84 L210 84 C190 100 214 110 196 128 C176 150 210 156 196 200 Z" fill="url(#riv_water)"/>'
 + '<path d="M150 180 q12 -6 0 -16 M168 150 q12 -6 0 -16 M178 120 q10 -6 0 -14" stroke="#CFEAF4" stroke-width="2" fill="none" opacity="0.7"/>'
 + conifer(60, 150, 1.3, "#2E7A3C") + tree(255, 150, 1.1, "#3E8B45")
 + '<ellipse cx="110" cy="172" rx="12" ry="5" fill="#9A8A6A"/><ellipse cx="232" cy="166" rx="10" ry="4" fill="#9A8A6A"/>')

# ---------- mineral / crystal specimen ----------
SCENES["mineral"] = svg(
 rad("min_bg", "#3A4A5E", "#1C2733", "50%", "40%", "70%") + lin("min_a", "#9FD8E8", "#5E9AB8") + lin("min_b", "#C9A8E0", "#8E6EB8") + lin("min_c", "#E8D8A8", "#B8A05E"),
 '<rect width="320" height="200" fill="url(#min_bg)"/>'
 + '<ellipse cx="160" cy="178" rx="120" ry="22" fill="#0E1722" opacity="0.6"/>'
 + '<polygon points="160,40 140,120 180,120" fill="url(#min_a)"/><polygon points="160,40 180,120 196,116 176,52" fill="#7FB8D0"/>'
 + '<polygon points="120,96 104,168 144,168" fill="url(#min_b)"/><polygon points="120,96 144,168 158,164 134,100" fill="#A886C8"/>'
 + '<polygon points="206,100 192,168 230,168" fill="url(#min_c)"/><polygon points="206,100 230,168 242,162 220,104" fill="#CBB06E"/>'
 + '<polygon points="160,40 152,72 168,72" fill="#FFFFFF" opacity="0.55"/>')

# ---------- fossil (ammonite in stone) ----------
def spiral(cx, cy, turns, r0, dr):
    import math
    pts = []
    a = 0.0
    r = r0
    while a < turns * 6.283:
        pts.append((cx + r*math.cos(a), cy + r*math.sin(a)))
        a += 0.3
        r += dr*0.3
    d = 'M' + ' L'.join(str(round(x,1)) + ' ' + str(round(y,1)) for x, y in pts)
    return d
SCENES["fossil"] = svg(
 rad("fos_bg", "#A89A82", "#6E6253", "50%", "45%", "70%") + lin("fos_stone", "#8E8270", "#5E5446"),
 '<rect width="320" height="200" fill="url(#fos_stone)"/>'
 + '<ellipse cx="160" cy="100" rx="150" ry="92" fill="url(#fos_bg)"/>'
 + '<path d="' + spiral(160, 100, 3.2, 4, 11) + '" stroke="#3E3528" stroke-width="6" fill="none" stroke-linecap="round"/>'
 + '<path d="' + spiral(160, 100, 3.2, 4, 11) + '" stroke="#5E5240" stroke-width="2.4" fill="none"/>'
 # ribs
 + ''.join('<path d="M160 100 L' + str(round(160+ (60)*__import__("math").cos(a),1)) + ' ' + str(round(100+(60)*__import__("math").sin(a),1)) + '" stroke="#4E4434" stroke-width="1.4" opacity="0.5"/>' for a in [i*0.5 for i in range(13)])
 + '<circle cx="120" cy="60" r="2" fill="#4E4434"/><circle cx="210" cy="150" r="2.4" fill="#4E4434"/>')

# ---------- soil (cross-section) ----------
SCENES["soil"] = svg(
 sky("soil_sky") + lin("soil_grass", "#5BA94A", "#3E8B40") + lin("soil_top", "#4A3320", "#382514")
 + lin("soil_sub", "#7A5230", "#5A3A20") + lin("soil_rock", "#8A8276", "#5E574C"),
 '<rect width="320" height="40" fill="url(#soil_sky)"/>'
 + '<rect y="36" width="320" height="14" fill="url(#soil_grass)"/>'
 + ''.join('<path d="M' + str(x) + ' 36 q -2 -8 0 -12" stroke="#4E9A44" stroke-width="2" fill="none"/>' for x in range(10, 320, 16))
 + '<rect y="50" width="320" height="46" fill="url(#soil_top)"/>'
 + '<rect y="96" width="320" height="54" fill="url(#soil_sub)"/>'
 + '<rect y="150" width="320" height="50" fill="url(#soil_rock)"/>'
 # roots
 + '<path d="M120 50 q4 26 -8 44 q14 -10 18 8 M130 50 q-2 30 10 50" stroke="#E8D8B0" stroke-width="2.2" fill="none" opacity="0.8"/>'
 # worms/pebbles
 + '<path d="M40 74 q8 -6 16 0 q-8 6 -16 0" fill="#C98A6A"/><circle cx="220" cy="120" r="6" fill="#9A8E7A"/><circle cx="250" cy="170" r="8" fill="#B0A89A"/><circle cx="70" cy="172" r="6" fill="#B0A89A"/>')

# ---------- deer ----------
SCENES["deer"] = svg(
 sky("deer_sky", warm=True) + lin("deer_grass", "#7FB85A", "#4E8B40"),
 '<rect width="320" height="200" fill="url(#deer_sky)"/>'
 + rad("deer_sun", "#FFF1C8", "#FFCE8A", "24%", "30%", "20%") + '<circle cx="70" cy="58" r="22" fill="url(#deer_sun)"/>'
 + '<path d="M0 150 Q160 134 320 150 V200 H0 Z" fill="url(#deer_grass)"/>'
 + conifer(285, 150, 1.4, "#3E7A3C")
 # stylized deer silhouette
 + '<g fill="#5A3A22" transform="translate(150,96)">'
 + '<ellipse cx="0" cy="30" rx="34" ry="18"/>'  # body
 + '<rect x="-26" y="40" width="6" height="30"/><rect x="-12" y="42" width="6" height="30"/><rect x="14" y="42" width="6" height="30"/><rect x="26" y="40" width="6" height="30"/>'  # legs
 + '<path d="M30 24 q14 -6 18 -22 q4 14 -6 26 Z"/>'  # neck
 + '<ellipse cx="46" cy="-2" rx="9" ry="6"/>'  # head
 + '<path d="M44 -8 l-4 -16 l4 6 l3 -10 M50 -8 l4 -16 l-2 8 l4 -6" stroke="#5A3A22" stroke-width="2.4" fill="none"/>'  # antlers
 + '<ellipse cx="-30" cy="22" rx="4" ry="8" fill="#E8D8B8"/>'  # tail
 + '</g>')

# ---------- fox ----------
SCENES["fox"] = svg(
 lin("fox_bg", "#DCE9E0", "#A9CDB0") + lin("fox_snow", "#FFFFFF", "#E4EEF0"),
 '<rect width="320" height="200" fill="url(#fox_bg)"/>'
 + '<path d="M0 150 Q160 138 320 150 V200 H0 Z" fill="url(#fox_snow)"/>'
 + '<g transform="translate(150,100)">'
 + '<ellipse cx="0" cy="34" rx="40" ry="16" fill="#D9682A"/>'  # body
 + '<rect x="-28" y="44" width="6" height="26" fill="#5A3320"/><rect x="-14" y="46" width="6" height="24" fill="#5A3320"/><rect x="16" y="46" width="6" height="24" fill="#5A3320"/><rect x="28" y="44" width="6" height="26" fill="#5A3320"/>'
 + '<path d="M-38 30 q-30 0 -46 18 q26 -2 46 -4 Z" fill="#E47A38"/><path d="M-70 46 q14 2 26 -2 q-8 8 -20 8 Z" fill="#FFFFFF"/>'  # tail
 + '<ellipse cx="36" cy="14" rx="16" ry="13" fill="#E47A38"/>'  # head
 + '<path d="M26 4 l-4 -14 l10 6 Z M46 4 l4 -14 l-10 6 Z" fill="#E47A38"/><path d="M28 2 l-2 -8 l5 3 Z M44 2 l2 -8 l-5 3 Z" fill="#5A3320"/>'  # ears
 + '<path d="M44 18 l14 4 l-14 4 Z" fill="#FFFFFF"/><circle cx="52" cy="22" r="2" fill="#2A1A10"/>'  # snout+nose
 + '<circle cx="32" cy="12" r="1.8" fill="#2A1A10"/>'
 + '</g>')

# ---------- owl ----------
SCENES["owl"] = svg(
 lin("owl_sky", "#2A3A52", "#16243A") + rad("owl_moon", "#FBF3D0", "#E6D8A0", "78%", "26%", "16%"),
 '<rect width="320" height="200" fill="url(#owl_sky)"/>'
 + '<circle cx="250" cy="52" r="22" fill="url(#owl_moon)"/>'
 + '<rect x="0" y="150" width="320" height="12" fill="#4A3320"/><path d="M110 150 q14 -40 50 -44 q-10 20 6 44 Z" fill="#3A2614"/>'  # branch
 + '<g transform="translate(160,108)">'
 + '<ellipse cx="0" cy="6" rx="34" ry="42" fill="#7A5A3A"/>'  # body
 + '<ellipse cx="0" cy="8" rx="22" ry="30" fill="#A98A66"/>'  # belly
 + '<path d="M-34 -16 q-6 -16 6 -20 M34 -16 q6 -16 -6 -20" stroke="#7A5A3A" stroke-width="10" fill="none"/>'  # ear tufts
 + '<circle cx="-13" cy="-12" r="13" fill="#F2E8D0"/><circle cx="13" cy="-12" r="13" fill="#F2E8D0"/>'
 + '<circle cx="-13" cy="-12" r="7" fill="#3A2614"/><circle cx="13" cy="-12" r="7" fill="#3A2614"/>'
 + '<circle cx="-11" cy="-14" r="2" fill="#FFF"/><circle cx="15" cy="-14" r="2" fill="#FFF"/>'
 + '<path d="M0 -6 l-5 8 l10 0 Z" fill="#E0A030"/>'  # beak
 + '<path d="M-30 40 l8 12 M30 40 l-8 12" stroke="#E0A030" stroke-width="4"/>'
 + '</g>')

# ---------- frog ----------
SCENES["frog"] = svg(
 lin("frog_bg", "#BFE3C9", "#6FBF7A") + lin("frog_pond", "#7FB8C8", "#3E7E94"),
 '<rect width="320" height="200" fill="url(#frog_bg)"/>'
 + '<path d="M0 150 Q160 138 320 150 V200 H0 Z" fill="url(#frog_pond)"/>'
 + '<ellipse cx="240" cy="170" rx="46" ry="12" fill="#3E8B45"/>'  # lily pad
 + '<g transform="translate(140,118)">'
 + '<ellipse cx="0" cy="20" rx="44" ry="26" fill="#4E9A44"/>'  # body
 + '<ellipse cx="-30" cy="-2" rx="14" ry="12" fill="#4E9A44"/><ellipse cx="30" cy="-2" rx="14" ry="12" fill="#4E9A44"/>'  # eye bumps
 + '<circle cx="-30" cy="-4" r="7" fill="#F2E8C0"/><circle cx="30" cy="-4" r="7" fill="#F2E8C0"/>'
 + '<circle cx="-30" cy="-3" r="3.4" fill="#1A2A14"/><circle cx="30" cy="-3" r="3.4" fill="#1A2A14"/>'
 + '<path d="M-20 32 q20 12 40 0" stroke="#2E6E2C" stroke-width="3" fill="none"/>'  # mouth
 + '<ellipse cx="-44" cy="40" rx="16" ry="7" fill="#3E8B3A"/><ellipse cx="44" cy="40" rx="16" ry="7" fill="#3E8B3A"/>'  # legs
 + '<circle cx="-8" cy="18" r="3" fill="#3E8B3A"/><circle cx="10" cy="26" r="3" fill="#3E8B3A"/>'  # spots
 + '</g>')

# ---------- butterfly on flower ----------
SCENES["butterfly"] = svg(
 sky("bfly_sky") + lin("bfly_grass", "#8FD06A", "#5BA94A") + lin("bfly_wing", "#F2A33A", "#D9682A"),
 '<rect width="320" height="200" fill="url(#bfly_sky)"/>'
 + '<path d="M0 150 Q160 134 320 150 V200 H0 Z" fill="url(#bfly_grass)"/>'
 + '<rect x="60" y="120" width="4" height="76" fill="#3E8B40"/>' + flower(62, 120, "#E2607A").replace('cx="0" cy="-2" r="3.4"','cx="0" cy="-2" r="7"').replace('r="1.4"','r="3"')
 + '<g transform="translate(180,90)">'
 + '<path d="M0 0 C -36 -34 -44 -6 -14 6 C -34 14 -20 36 0 14 Z" fill="url(#bfly_wing)"/>'
 + '<path d="M0 0 C 36 -34 44 -6 14 6 C 34 14 20 36 0 14 Z" fill="url(#bfly_wing)"/>'
 + '<path d="M0 0 C -36 -34 -44 -6 -14 6" fill="none" stroke="#3A2614" stroke-width="2"/><path d="M0 0 C 36 -34 44 -6 14 6" fill="none" stroke="#3A2614" stroke-width="2"/>'
 + '<circle cx="-24" cy="-14" r="3" fill="#3A2614"/><circle cx="24" cy="-14" r="3" fill="#3A2614"/>'
 + '<rect x="-2" y="-14" width="4" height="30" rx="2" fill="#2A1A10"/>'
 + '<path d="M0 -14 q-6 -10 -12 -12 M0 -14 q6 -10 12 -12" stroke="#2A1A10" stroke-width="1.6" fill="none"/>'
 + '</g>')

# ---------- beaver / pond + dam ----------
SCENES["beaver"] = svg(
 sky("bvr_sky") + lin("bvr_water", "#7FB8C8", "#4E93B0") + lin("bvr_bank", "#5BA94A", "#3E7A3A"),
 '<rect width="320" height="200" fill="url(#bvr_sky)"/>'
 + '<path d="M0 116 Q160 102 320 116 V200 H0 Z" fill="url(#bvr_water)"/>'
 + '<path d="M0 130 Q60 120 120 130 V200 H0 Z" fill="url(#bvr_bank)"/>'
 + conifer(40, 130, 1.2, "#2E7A3C")
 # dam of logs
 + '<g>' + ''.join('<rect x="' + str(160 + (i % 3)*4) + '" y="' + str(118 + i*6) + '" width="120" height="7" rx="3" fill="#6B4A2B" transform="rotate(' + str(-6 + (i % 2)*8) + ' 220 ' + str(120 + i*6) + ')"/>' for i in range(6)) + '</g>'
 # beaver
 + '<g transform="translate(110,124)">'
 + '<ellipse cx="0" cy="6" rx="26" ry="14" fill="#6B4A2B"/>'
 + '<ellipse cx="22" cy="-2" rx="12" ry="10" fill="#7A5530"/>'  # head
 + '<circle cx="26" cy="-4" r="2" fill="#1A1008"/><circle cx="30" cy="-1" r="2.4" fill="#3A2614"/>'  # eye+nose
 + '<rect x="28" y="2" width="4" height="5" fill="#E8E0C0"/>'  # tooth
 + '<ellipse cx="-26" cy="10" rx="14" ry="6" fill="#3A2614" transform="rotate(20 -26 10)"/>'  # flat tail
 + '</g>')

# ---------- fieldwork (binoculars + journal) ----------
SCENES["fieldwork"] = svg(
 lin("fw_bg", "#3A5E48", "#22402C") + lin("fw_pad", "#E9E0C8", "#CBBE9C"),
 '<rect width="320" height="200" fill="url(#fw_bg)"/>'
 + '<ellipse cx="160" cy="186" rx="150" ry="22" fill="#1C3322" opacity="0.6"/>'
 # binoculars
 + '<g transform="translate(120,96)">'
 + '<rect x="-34" y="-14" width="26" height="40" rx="8" fill="#2A2A2E"/><rect x="8" y="-14" width="26" height="40" rx="8" fill="#2A2A2E"/>'
 + '<rect x="-8" y="-6" width="16" height="14" fill="#3A3A40"/>'
 + '<circle cx="-21" cy="22" r="11" fill="#4A6A8A"/><circle cx="21" cy="22" r="11" fill="#4A6A8A"/>'
 + '<circle cx="-21" cy="22" r="5" fill="#9FD8E8" opacity="0.8"/><circle cx="21" cy="22" r="5" fill="#9FD8E8" opacity="0.8"/>'
 + '<rect x="-34" y="-20" width="26" height="8" rx="4" fill="#1A1A1E"/><rect x="8" y="-20" width="26" height="8" rx="4" fill="#1A1A1E"/>'
 + '</g>'
 # journal
 + '<g transform="translate(214,130)">'
 + '<rect x="-30" y="-30" width="70" height="56" rx="4" fill="url(#fw_pad)" transform="rotate(8 0 0)"/>'
 + '<rect x="-30" y="-30" width="10" height="56" rx="4" fill="#9A4A36" transform="rotate(8 0 0)"/>'
 + '<g transform="rotate(8 0 0)" stroke="#8A7E5C" stroke-width="2"><path d="M-14 -16 h44"/><path d="M-14 -6 h44"/><path d="M-14 4 h36"/><path d="M-14 14 h40"/></g>'
 + '<path d="M-6 -22 q10 6 20 0" stroke="#3E8B45" stroke-width="3" fill="none" transform="rotate(8 0 0)"/>'
 + '</g>')

# ---------- stewardship (hands cradling a seedling) ----------
SCENES["stewardship"] = svg(
 sky("stw_sky") + lin("stw_soil", "#5A3A20", "#3A2614") + lin("stw_hand", "#E0A878", "#C9885A"),
 '<rect width="320" height="200" fill="url(#stw_sky)"/>'
 + rad("stw_glow", "#FFF6D8", "#FFE08A", "50%", "24%", "26%") + '<circle cx="160" cy="48" r="30" fill="url(#stw_glow)" opacity="0.7"/>'
 # cupped hands
 + '<path d="M70 150 Q90 120 120 132 L160 144 L200 132 Q230 120 250 150 Q200 186 160 184 Q120 186 70 150 Z" fill="url(#stw_hand)"/>'
 + '<path d="M120 132 q8 -8 18 -4 M182 128 q10 -6 18 0" stroke="#B07A50" stroke-width="3" fill="none"/>'
 # soil mound + seedling
 + '<ellipse cx="160" cy="150" rx="40" ry="14" fill="url(#stw_soil)"/>'
 + '<rect x="158" y="96" width="5" height="54" fill="#3E8B40"/>'
 + '<path d="M160 120 q-22 -6 -30 -24 q22 0 32 16 Z" fill="#4E9A44"/><path d="M160 110 q22 -6 30 -24 q-22 0 -32 16 Z" fill="#5BA94A"/>'
 + '<path d="M160 100 q-12 -6 -16 -18 q14 2 18 12 Z" fill="#6FBF52"/>')

# ---------- bird (perched songbird) ----------
SCENES["bird"] = svg(
 sky("bird_sky") + lin("bird_leaf", "#3E8B45", "#2E7A38") + lin("bird_body", "#E2607A", "#C23E5A"),
 '<rect width="320" height="200" fill="url(#bird_sky)"/>'
 + rad("bird_sun", "#FFF6D8", "#FFE08A", "82%", "24%", "18%") + '<circle cx="262" cy="50" r="22" fill="url(#bird_sun)"/>'
 + '<path d="M0 150 Q160 138 320 150 V200 H0 Z" fill="#6FB85A" opacity="0.5"/>'
 # branch + leaves
 + '<path d="M40 120 q60 14 150 6 q60 -6 100 -28" stroke="#6B4A2B" stroke-width="7" fill="none"/>'
 + '<path d="M120 120 q-10 -16 6 -24 M150 122 q-8 -18 8 -24 M200 112 q-6 -18 10 -22" stroke="#3E8B45" stroke-width="3" fill="none"/>'
 + '<g transform="translate(160,98)">'
 + '<ellipse cx="0" cy="6" rx="26" ry="18" fill="url(#bird_body)"/>'        # body
 + '<circle cx="20" cy="-10" r="13" fill="#E2607A"/>'                        # head
 + '<path d="M20 -22 l6 -12 l-2 12 Z" fill="#C23E5A"/>'                       # crest
 + '<path d="M30 -10 l14 4 l-14 4 Z" fill="#F2B000"/>'                        # beak
 + '<circle cx="24" cy="-12" r="2.2" fill="#1A1008"/>'
 + '<path d="M-20 4 q-22 6 -34 22 q22 -2 36 -8 Z" fill="#C23E5A"/>'           # tail
 + '<path d="M-6 2 q-16 8 -22 22 q16 -4 26 -10 Z" fill="#B8344E"/>'           # wing
 + '<path d="M6 24 l0 8 M14 24 l0 8" stroke="#7A4A2A" stroke-width="2.4"/>'   # legs
 + '</g>')

# ---------- reptile (snake on warm rock) ----------
SCENES["reptile"] = svg(
 sky("rep_sky", warm=True) + lin("rep_ground", "#D8B477", "#B8924E") + lin("rep_rock", "#9A9088", "#6E665A")
 + lin("rep_snake", "#6FA84A", "#3E7A38"),
 '<rect width="320" height="200" fill="url(#rep_sky)"/>'
 + '<path d="M0 138 Q160 124 320 138 V200 H0 Z" fill="url(#rep_ground)"/>'
 + '<ellipse cx="232" cy="150" rx="70" ry="26" fill="url(#rep_rock)"/>'
 + '<ellipse cx="80" cy="170" rx="50" ry="18" fill="url(#rep_rock)" opacity="0.7"/>'
 # coiled snake
 + '<path d="M70 168 q40 -30 84 -16 q44 14 30 -22 q-12 -30 -52 -18 q-44 14 -18 36" fill="none" stroke="url(#rep_snake)" stroke-width="13" stroke-linecap="round"/>'
 + '<path d="M70 168 q40 -30 84 -16 q44 14 30 -22 q-12 -30 -52 -18" fill="none" stroke="#2E6E2C" stroke-width="4" stroke-dasharray="3 9" opacity="0.6"/>'
 + '<circle cx="118" cy="128" r="8" fill="#6FA84A"/>'                          # head
 + '<circle cx="121" cy="126" r="1.6" fill="#1A1008"/><path d="M124 128 l8 -2 l-8 -1 Z" fill="#C23E5A"/>'  # eye+tongue
 + '<circle cx="40" cy="60" r="18" fill="url(#rep_sun_x)"/>' .replace("rep_sun_x","rep_sun")
 + rad("rep_sun", "#FFF1C8", "#FFC987", "50%", "50%", "60%"))

# ---------- fish (in clear water) ----------
SCENES["fish"] = svg(
 lin("fish_water", "#8FCDE0", "#2E6E8E") + lin("fish_body", "#E8A24A", "#C26A2A") + lin("fish_bed", "#5A8A5E", "#3E6A44"),
 '<rect width="320" height="200" fill="url(#fish_water)"/>'
 + '<path d="M0 60 q40 -10 80 0 t80 0 t80 0 t80 0" stroke="#CFEAF4" stroke-width="2" fill="none" opacity="0.5"/>'
 + '<path d="M0 168 Q160 150 320 168 V200 H0 Z" fill="url(#fish_bed)"/>'
 # water plants
 + '<path d="M40 200 q-8 -50 4 -78 M54 200 q8 -46 -2 -74 M280 200 q10 -54 -2 -80 M266 200 q-8 -48 4 -72" stroke="#3E8B45" stroke-width="4" fill="none"/>'
 # fish
 + '<g transform="translate(160,104)">'
 + '<ellipse cx="0" cy="0" rx="46" ry="24" fill="url(#fish_body)"/>'
 + '<path d="M40 0 l30 -20 l-6 20 l6 20 Z" fill="#D98A3A"/>'                    # tail
 + '<path d="M-6 -22 l16 -14 l8 16 Z" fill="#E8A24A"/>'                          # dorsal fin
 + '<path d="M-6 18 q12 14 26 4 Z" fill="#D98A3A"/>'                             # pelvic fin
 + '<circle cx="-30" cy="-4" r="5" fill="#FFFFFF"/><circle cx="-31" cy="-4" r="2.4" fill="#1A1008"/>'
 + '<path d="M-16 -14 q-4 14 0 28 M-2 -18 q-5 18 0 36" stroke="#C26A2A" stroke-width="2" fill="none" opacity="0.6"/>'
 + '<circle cx="84" cy="-44" r="3" fill="#CFEAF4" opacity="0.8"/><circle cx="92" cy="-30" r="2" fill="#CFEAF4" opacity="0.7"/>'
 + '</g>')

# ---------- pond ----------
SCENES["pond"] = svg(
 sky("pond_sky") + lin("pond_water", "#7FC0CE", "#3E7E8E") + lin("pond_bank", "#6FB85A", "#3E8B40"),
 '<rect width="320" height="200" fill="url(#pond_sky)"/>'
 + '<path d="M0 150 Q160 132 320 150 V200 H0 Z" fill="url(#pond_bank)"/>'
 + '<ellipse cx="160" cy="172" rx="150" ry="34" fill="url(#pond_water)"/>'
 + '<ellipse cx="110" cy="168" rx="34" ry="9" fill="#3E8B45"/><ellipse cx="210" cy="178" rx="28" ry="7" fill="#3E8B45"/>'  # lily pads
 + '<circle cx="118" cy="166" r="3.4" fill="#E2607A"/>'  # lily flower
 + '<path d="M40 150 q-4 -22 2 -34 M52 150 q4 -18 -2 -30 M276 150 q6 -24 -2 -36 M264 150 q-4 -18 4 -30" stroke="#3E8B45" stroke-width="3" fill="none"/>'  # reeds
 + '<path d="M150 176 q12 -4 0 -10 M196 184 q10 -4 0 -9" stroke="#CFEAF4" stroke-width="1.6" fill="none" opacity="0.7"/>'
 + rad("pond_sun", "#FFF6D8", "#FFE08A", "78%", "26%", "16%") + '<circle cx="252" cy="50" r="22" fill="url(#pond_sun)"/>')

# ---------- cave ----------
SCENES["cave"] = svg(
 rad("cave_bg", "#3A4452", "#0E1622", "50%", "42%", "75%") + lin("cave_rock", "#3E4654", "#1A2230") + lin("cave_floor", "#2A323E", "#141A24"),
 '<rect width="320" height="200" fill="url(#cave_bg)"/>'
 # stalactites (top)
 + ''.join('<path d="M' + str(x) + ' 0 l' + str(8) + ' ' + str(26 + (x % 5)*6) + ' l8 ' + str(-(26 + (x % 5)*6)) + ' Z" fill="url(#cave_rock)"/>' for x in range(10, 320, 34))
 # stalagmites (bottom)
 + ''.join('<path d="M' + str(x) + ' 200 l10 ' + str(-(20 + (x % 4)*7)) + ' l10 ' + str(20 + (x % 4)*7) + ' Z" fill="url(#cave_floor)"/>' for x in range(26, 320, 40))
 + '<ellipse cx="160" cy="196" rx="170" ry="18" fill="#0E1622"/>'
 # crystal glints
 + '<polygon points="150,150 142,168 158,168" fill="#7FB8D0"/><polygon points="150,150 158,168 166,164 156,154" fill="#5E9AB8"/>'
 + '<circle cx="60" cy="120" r="2" fill="#9FD8E8" opacity="0.8"/><circle cx="250" cy="130" r="2.4" fill="#9FD8E8" opacity="0.7"/><circle cx="200" cy="96" r="1.6" fill="#CFEAF4"/>')

# ---------- coast ----------
SCENES["coast"] = svg(
 sky("coast_sky") + lin("coast_sea", "#6FB8C8", "#2E6E8E") + lin("coast_sand", "#E9D6A8", "#CBB477") + lin("coast_dune", "#7FB85A", "#4E8B40"),
 '<rect width="320" height="200" fill="url(#coast_sky)"/>'
 + rad("coast_sun", "#FFF1C8", "#FFC987", "24%", "28%", "18%") + '<circle cx="64" cy="54" r="22" fill="url(#coast_sun)"/>'
 + '<path d="M0 104 Q160 92 320 104 V150 H0 Z" fill="url(#coast_sea)"/>'
 + '<path d="M0 118 q40 -8 80 0 t80 0 t80 0 t80 0" stroke="#CFEAF4" stroke-width="2" fill="none" opacity="0.6"/>'
 + '<path d="M0 138 Q90 150 200 142 Q280 136 320 146 V200 H0 Z" fill="url(#coast_sand)"/>'
 + '<path d="M0 150 Q70 132 150 146 V200 H0 Z" fill="url(#coast_dune)"/>'
 + '<path d="M40 150 q-3 -20 2 -30 M52 150 q3 -16 -2 -26 M30 150 q-2 -14 2 -22" stroke="#4E9A44" stroke-width="2.4" fill="none"/>'  # dune grass
 + '<path d="M150 138 q40 6 80 0" stroke="#B7A06A" stroke-width="2" fill="none" opacity="0.6"/>'  # tide line
 + '<ellipse cx="250" cy="164" rx="10" ry="4" fill="#E4D2A0"/>')  # shell on beach

# ---------- tundra ----------
SCENES["tundra"] = svg(
 sky("tun_sky") + lin("tun_ground", "#A9B89A", "#7E9070") + lin("tun_far", "#BFCBD6", "#9FB0C0"),
 '<rect width="320" height="200" fill="url(#tun_sky)"/>'
 + '<path d="M-10 110 L60 70 L130 110 Z" fill="url(#tun_far)"/><path d="M110 110 L200 64 L300 110 Z" fill="url(#tun_far)"/>'
 + '<path d="M60 70 L46 90 L60 86 L70 100 Z" fill="#FFFFFF" opacity="0.9"/><path d="M200 64 L184 90 L200 84 L214 102 Z" fill="#FFFFFF" opacity="0.92"/>'  # snow caps
 + '<path d="M0 120 Q160 106 320 120 V200 H0 Z" fill="url(#tun_ground)"/>'
 # low cushion plants + rocks
 + '<ellipse cx="60" cy="150" rx="20" ry="8" fill="#6E8A5E"/><ellipse cx="150" cy="166" rx="26" ry="9" fill="#6E8A5E"/><ellipse cx="250" cy="152" rx="22" ry="8" fill="#6E8A5E"/>'
 + '<circle cx="56" cy="148" r="2.4" fill="#E2607A"/><circle cx="64" cy="150" r="2" fill="#FFD24A"/><circle cx="248" cy="150" r="2.2" fill="#E2607A"/>'
 + '<circle cx="110" cy="176" r="6" fill="#9A958A"/><circle cx="200" cy="182" r="8" fill="#A8A398"/><circle cx="290" cy="174" r="5" fill="#9A958A"/>')

# fallback alias used by artFor()
if "forest" not in SCENES:
    SCENES["forest"] = list(SCENES.values())[0]

with open("/home/claude/terra/seahype-art.js", "w", encoding="utf-8") as f:
    f.write("/* TerraHype procedural SVG scenes. */\n")
    f.write("window.SEA_ART = " + json.dumps(SCENES, ensure_ascii=False) + ";\n")
print("art scenes:", len(SCENES), "->", ", ".join(sorted(SCENES.keys())))
