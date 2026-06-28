#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# TerraHype circular coin logo -> logo_coin.png (transparent exterior).
from PIL import Image, ImageDraw
import math

SZ = 512
img = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
cx = cy = SZ / 2

def circle(c, r, fill=None, outline=None, width=1):
    d.ellipse([c[0]-r, c[1]-r, c[0]+r, c[1]+r], fill=fill, outline=outline, width=width)

# outer coin
circle((cx, cy), 250, fill=(18, 44, 28, 255))          # deep forest green
circle((cx, cy), 250, outline=(46, 110, 60, 255), width=10)
circle((cx, cy), 232, outline=(111, 207, 111, 255), width=6)  # bright green ring
circle((cx, cy), 214, outline=(212, 178, 92, 255), width=3)   # thin gold accent

# inner scene disc with a simple vertical sky gradient
inner_r = 200
# gradient sky (top lighter)
for i in range(int(cy - inner_r), int(cy + inner_r)):
    t = (i - (cy - inner_r)) / (2 * inner_r)
    # sky from soft green-blue to pale
    r = int(190 + 20 * (1 - t)); g = int(220 + 18 * (1 - t)); b = int(210 + 10 * (1 - t))
    half = math.sqrt(max(0.0, inner_r**2 - (i - cy)**2))
    d.line([(cx - half, i), (cx + half, i)], fill=(min(r,255), min(g,255), min(b,255), 255))

# clip helper: draw scene then mask to inner circle
scene = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
sd = ImageDraw.Draw(scene)

# distant mountain
sd.polygon([(cx-150, cy+70), (cx-40, cy-90), (cx+70, cy+70)], fill=(78, 132, 96, 255))
sd.polygon([(cx-40, cy-90), (cx-66, cy-44), (cx-44, cy-52), (cx-26, cy-30), (cx-12, cy-52)], fill=(245, 248, 248, 255))  # snow cap
sd.polygon([(cx+10, cy+70), (cx+110, cy-50), (cx+200, cy+70)], fill=(94, 150, 110, 255))

# ground
sd.ellipse([cx-210, cy+50, cx+210, cy+230], fill=(46, 110, 60, 255))

# pines (front)
def pine(x, base, s, col):
    sd.rectangle([x-3*s, base-6*s, x+3*s, base+6*s], fill=(107, 74, 43, 255))
    for k, (w, yy) in enumerate([(26, 0), (21, 18), (15, 34)]):
        sd.polygon([(x-w*s, base-(6+yy)*s), (x, base-(48+yy)*s), (x+w*s, base-(6+yy)*s)], fill=col)

pine(cx-58, cy+96, 1.5, (46, 122, 60, 255))
pine(cx+66, cy+104, 1.7, (62, 154, 72, 255))
pine(cx+6, cy+120, 2.1, (87, 182, 94, 255))

# sun
sd.ellipse([cx+96, cy-150, cx+150, cy-96], fill=(255, 224, 138, 255))

# mask scene to inner circle
mask = Image.new("L", (SZ, SZ), 0)
md = ImageDraw.Draw(mask)
md.ellipse([cx-inner_r, cy-inner_r, cx+inner_r, cy+inner_r], fill=255)
img.paste(scene, (0, 0), Image.composite(scene.split()[3], Image.new("L", (SZ, SZ), 0), mask))

# subtle inner rim
d.ellipse([cx-inner_r, cy-inner_r, cx+inner_r, cy+inner_r], outline=(18, 44, 28, 180), width=4)

img.save("/home/claude/terra/logo_coin.png")
print("logo written:", img.size)
