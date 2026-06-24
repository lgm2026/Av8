import json, math

PAL = dict(navy="#0A2A47", deep="#06243B", teal="#0E6C8E", teal2="#1C82A6",
           cyan="#7CC9E0", cyan2="#A9E1EF", sand="#E6C786", sand2="#D2A85E",
           coral="#FF7A66", coral2="#F2A65A", green="#1E9E7E", green2="#36C58E",
           rock="#274B5E", amber="#FFC83D", white="#FFFFFF", pink="#F58FB0",
           purple="#7E6CC4", shell="#F3E6CE", shelld="#D8B88A")

def lid(k,n): return k+"_"+n
def lg(k,n,stops,x1=0,y1=0,x2=0,y2=1):
    s="".join('<stop offset="%s" stop-color="%s"/>'%(o,c) for o,c in stops)
    return '<linearGradient id="%s" x1="%s" y1="%s" x2="%s" y2="%s">%s</linearGradient>'%(lid(k,n),x1,y1,x2,y2,s)
def rg(k,n,stops,cx="50%",cy="40%",r="60%"):
    s="".join('<stop offset="%s" stop-color="%s"/>'%(o,c) for o,c in stops)
    return '<radialGradient id="%s" cx="%s" cy="%s" r="%s">%s</radialGradient>'%(lid(k,n),cx,cy,r,s)
def U(k,n): return "url(#%s)"%lid(k,n)

def rays(k, n=4, top=0, color="#FFFFFF", op=0.10, w=320):
    out=""
    for i in range(n):
        x=20+i*(w-40)/max(1,n-1)
        out+='<polygon points="%d,%d %d,%d %d,%d %d,%d" fill="%s" opacity="%s"/>'%(
            x,top, x+10,top, x-26,200, x-52,200, color, op)
    return out

def bubbles(pts, color="#A9E1EF", op=0.5):
    return "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" opacity="%s"/>'%(x,y,r,color,op) for x,y,r in pts)

def fish(cx,cy,s,fill,flip=False,eye=True):
    d=-1 if flip else 1
    g='<g transform="translate(%s,%s) scale(%s,%s)">'%(cx,cy,s*d,s)
    g+='<path d="M0 0 C 7 -6, 22 -6, 30 0 C 22 6, 7 6, 0 0 Z" fill="%s"/>'%fill
    g+='<path d="M0 0 L -8 -6 L -8 6 Z" fill="%s"/>'%fill
    if eye: g+='<circle cx="24" cy="-1.4" r="1.4" fill="#08243A"/>'
    g+='</g>'
    return g

def coral(x,baseY,h,color,k):
    return ('<path d="M%d %d q -10 -%d 0 -%d q 8 6 8 16 q 6 -8 12 -2 q -2 10 -12 12 q -2 %d 0 %d Z" '
            'fill="%s"/>'%(x,baseY,h,h,h//3,h//3,color))

def seabed(k, color, y=176):
    return '<path d="M0 %d Q 80 %d 160 %d T 320 %d L 320 200 L 0 200 Z" fill="%s"/>'%(y,y-10,y,y-6,color)

def wrap(k,body,defs="",w=320,h=200,vb=None):
    vb=vb or "0 0 %d %d"%(w,h)
    return ('<svg viewBox="%s" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" '
            'width="100%%" height="100%%" style="display:block"><defs>%s</defs>%s</svg>'%(vb,defs,body))

ART={}

# ---------- HERO / HABITAT SCENES (320x200) ----------
def hero_water(k, stops):
    return lg(k,"w",stops)

# ocean surface (home hero) - bright & inviting
k="ocean"
defs=lg(k,"sky",[("0","#BFE6F2"),("1","#7FC4DE")]) + lg(k,"sea",[("0","#1C82A6"),("1","#0A2A47")]) + rg(k,"sun",[("0","#FFF6D8"),("1","#FFE08A")],cx="78%",cy="30%",r="22%")
body=('<rect width="320" height="200" fill="%s"/>'%U(k,"sky")
 +'<circle cx="250" cy="60" r="34" fill="%s"/>'%U(k,"sun")
 +'<path d="M40 44 q 8 -8 16 0 M56 40 q 8 -8 16 0" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.7"/>'
 +'<path d="M0 96 Q 80 78 160 96 T 320 96 L 320 200 L 0 200 Z" fill="%s"/>'%U(k,"sea")
 +'<path d="M0 110 q 40 -12 80 0 t 80 0 t 80 0 t 80 0" stroke="#A9E1EF" stroke-width="3" fill="none" opacity="0.6"/>'
 +'<path d="M0 130 q 40 -12 80 0 t 80 0 t 80 0 t 80 0" stroke="#7CC9E0" stroke-width="3" fill="none" opacity="0.5"/>'
 +fish(120,162,1.0,"#0E2230") + fish(180,176,0.8,"#0E2230",flip=True)
 +'<path d="M70 26 l3 6 6 .8 -4.5 4 1 6 -5.5-3 -5.5 3 1-6 -4.5-4 6-.8z" fill="#FFFFFF" opacity="0.85"/>')
ART[k]=wrap(k,body,defs)

# seawater / ocean basics (light rays, salt, current)
k="seawater"
defs=lg(k,"w",[("0","#2A9BC0"),("1","#072A45")])
body=('<rect width="320" height="200" fill="%s"/>'%U(k,"w") + rays(k,5,0,op=0.10)
 +'<path d="M-10 120 q 60 -30 120 0 t 120 0 t 120 0" stroke="#A9E1EF" stroke-width="2.5" fill="none" opacity="0.5"/>'
 +'<path d="M-10 150 q 60 -28 120 0 t 120 0 t 120 0" stroke="#7CC9E0" stroke-width="2.5" fill="none" opacity="0.4"/>'
 +bubbles([(60,150,3),(66,135,2),(250,120,3),(256,104,2),(150,90,2.5),(156,76,1.8)])
 +'<g opacity="0.85">'+''.join('<circle cx="%d" cy="%d" r="1.6" fill="#DFF4FB"/>'%(40+i*30,170-(i%3)*6) for i in range(9))+'</g>')
ART[k]=wrap(k,body,defs)

# coral reef
k="reef"
defs=lg(k,"w",[("0","#1E8FB6"),("1","#072A45")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w") + rays(k,4,0,op=0.08)
body+=seabed(k,"#234E63",180)
cols=[("#FF7A66",40,168,34),("#F2A65A",70,170,26),("#36C58E",250,168,30),("#7E6CC4",284,172,24),("#F58FB0",150,176,22)]
for c,x,y,hh in cols: body+=coral(x,y,hh,c,k)
body+='<g opacity="0.95">'+fish(120,120,0.7,"#FFC83D")+fish(140,132,0.6,"#FF7A66",flip=True)+fish(186,118,0.6,"#A9E1EF")+'</g>'
body+=bubbles([(210,90,2.5),(216,76,1.8)])
ART[k]=wrap(k,body,defs)

# clownfish + anemone
k="clownfish"
defs=lg(k,"w",[("0","#1C82A6"),("1","#06243B")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,3,0,op=0.08)+seabed(k,"#244B5E",182)
# anemone
body+='<g transform="translate(150,150)">'
for i in range(16):
    a=math.pi*(i/15.0)-math.pi/2
    x=math.cos(a)*46; y=-abs(math.sin(a))*40-6
    body+='<path d="M0 0 Q %0.1f %0.1f %0.1f %0.1f" stroke="#F58FB0" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.95"/>'%(x*0.5,y*0.7,x,y)
body+='<ellipse cx="0" cy="2" rx="40" ry="16" fill="#C76FA0"/></g>'
# two clownfish
def clown(cx,cy,s,flip=False):
    d=-1 if flip else 1
    g='<g transform="translate(%s,%s) scale(%s,%s)">'%(cx,cy,s*d,s)
    g+='<path d="M0 0 C 8 -7, 26 -7, 34 0 C 26 7, 8 7, 0 0 Z" fill="#FF7A2E"/>'
    g+='<path d="M0 0 L -9 -7 L -9 7 Z" fill="#FF7A2E"/>'
    g+='<rect x="9" y="-6.6" width="4.5" height="13.2" rx="2" fill="#FFFFFF"/>'
    g+='<rect x="20" y="-6" width="4" height="12" rx="2" fill="#FFFFFF"/>'
    g+='<path d="M-9 -7 L-9 7" stroke="#0E2230" stroke-width="0"/>'
    g+='<circle cx="28" cy="-1.5" r="1.6" fill="#0E2230"/></g>'
    return g
body+=clown(108,140,1.0)+clown(196,158,0.8,flip=True)
ART[k]=wrap(k,body,defs)

# shark
k="shark"
defs=lg(k,"w",[("0","#2A86A8"),("0.6","#0E4B68"),("1","#05203A")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,4,0,op=0.07)
body+=('<g transform="translate(60,96)" fill="#23425A">'
 '<path d="M0 14 C 40 -8, 150 -14, 210 6 C 196 10, 196 18, 210 22 C 150 40, 40 36, 0 14 Z"/>'
 '<path d="M86 -2 L110 -34 L120 -2 Z"/>'
 '<path d="M150 8 L176 -8 L168 12 Z"/>'
 '<path d="M70 22 L82 44 L96 22 Z"/>'
 '<circle cx="190" cy="8" r="2.6" fill="#0B1C2C"/>'
 '<path d="M196 14 q 8 1 14 0" stroke="#0B1C2C" stroke-width="1.4" fill="none"/></g>')
body+='<g opacity="0.9">'+fish(40,150,0.5,"#A9E1EF")+fish(60,158,0.5,"#A9E1EF")+fish(52,166,0.5,"#A9E1EF")+'</g>'
ART[k]=wrap(k,body,defs)

# sea turtle
k="turtle"
defs=lg(k,"w",[("0","#1E8FB6"),("1","#06283F")]) + rg(k,"sh",[("0","#3FB58A"),("1","#1C6E54")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,4,0,op=0.08)
body+='<g transform="translate(140,96) rotate(-8)">'
body+='<ellipse cx="40" cy="22" rx="20" ry="12" fill="#2C8466"/>' # rear flipper
body+='<path d="M-6 8 q -34 -18 -40 6 q 30 8 40 2 Z" fill="#2C8466"/>'
body+='<path d="M70 0 q 20 -2 30 10 q -16 8 -30 2 Z" fill="#2C8466"/>' # front flipper
body+='<ellipse cx="40" cy="14" rx="46" ry="30" fill="%s"/>'%U(k,"sh")
# shell scutes
for (sx,sy) in [(40,2),(22,12),(58,12),(30,26),(50,26),(40,16)]:
    body+='<path d="M%d %d l 9 7 -9 7 -9 -7 z" fill="#247257" opacity="0.7"/>'%(sx,sy)
body+='<ellipse cx="40" cy="14" rx="46" ry="30" fill="none" stroke="#1C5C45" stroke-width="2"/>'
body+='<ellipse cx="96" cy="2" rx="11" ry="9" fill="#2C8466"/>' # head
body+='<circle cx="101" cy="0" r="1.6" fill="#0B1C2C"/></g>'
ART[k]=wrap(k,body,defs)

# jellyfish
k="jelly"
defs=lg(k,"w",[("0","#143A66"),("1","#040E1F")]) + rg(k,"bell",[("0","#CDA9F0"),("1","#7E6CC4")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")
def jelly(cx,cy,s):
    g='<g transform="translate(%s,%s) scale(%s)" opacity="0.92">'%(cx,cy,s)
    g+='<path d="M-26 6 Q -26 -26 0 -26 Q 26 -26 26 6 Q 14 0 8 6 Q 0 0 -8 6 Q -14 0 -26 6 Z" fill="%s"/>'%U(k,"bell")
    for off in (-16,-8,0,8,16):
        g+='<path d="M%d 6 q %0.1f 22 %d 44" stroke="#B9A6E8" stroke-width="2.5" fill="none" opacity="0.8"/>'%(off, off*0.2, int(off*0.4))
    g+='</g>'
    return g
body+=jelly(80,80,1.0)+jelly(210,120,0.8)+jelly(150,150,0.6)
body+=bubbles([(40,160,2),(280,150,2),(120,40,1.6)],color="#CDA9F0",op=0.5)
ART[k]=wrap(k,body,defs)

# kelp forest
k="kelp"
defs=lg(k,"w",[("0","#1C8A86"),("1","#063A3A")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,5,0,color="#CFF3D8",op=0.10)
import random
random.seed(3)
for x in (30,70,120,170,210,260,300):
    sway=8
    p='<path d="M%d 200 '%x
    for yy in range(180,20,-26):
        p+='Q %d %d %d %d '%(x+sway, yy-13, x, yy)
        sway=-sway
    p+='" stroke="#2C9E78" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.9"/>'
    body+=p
    for yy in range(60,180,26):
        body+='<ellipse cx="%d" cy="%d" rx="9" ry="4" fill="#36C58E" opacity="0.8"/>'%(x+10, yy)
body+=fish(150,120,0.7,"#FFC83D")
ART[k]=wrap(k,body,defs)

# octopus
k="octopus"
defs=lg(k,"w",[("0","#1C7FA6"),("1","#06243B")]) + rg(k,"o",[("0","#FF9E8A"),("1","#D85E5E")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+seabed(k,"#274B5E",180)
body+='<g transform="translate(160,120)">'
for i,a in enumerate(range(-70,71,28)):
    rad=math.radians(a)
    ex=math.sin(rad)*70; ey=40+abs(math.cos(rad))*8
    body+='<path d="M0 6 Q %0.1f %0.1f %0.1f %0.1f" stroke="%s" stroke-width="9" fill="none" stroke-linecap="round"/>'%(ex*0.4, 30, ex, ey, "#E87A6E")
body+='<ellipse cx="0" cy="-6" rx="34" ry="30" fill="%s"/>'%U(k,"o")
body+='<circle cx="-12" cy="-10" r="6" fill="#FFFFFF"/><circle cx="12" cy="-10" r="6" fill="#FFFFFF"/>'
body+='<circle cx="-12" cy="-9" r="2.6" fill="#0B1C2C"/><circle cx="12" cy="-9" r="2.6" fill="#0B1C2C"/></g>'
ART[k]=wrap(k,body,defs)

# whale
k="whale"
defs=lg(k,"w",[("0","#2A86A8"),("1","#052038")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,4,0,op=0.07)
body+=('<g transform="translate(40,70)" fill="#26506B">'
 '<path d="M0 30 C 60 -2, 180 -6, 236 26 C 250 14, 268 12, 280 4 C 272 22, 274 34, 286 44 C 270 40, 252 42, 240 50 C 180 70, 60 64, 0 30 Z"/>'
 '<path d="M40 50 q 40 26 110 14 q -50 18 -110 -4 Z" fill="#3C6A86"/>'
 '<path d="M60 46 L40 70 L78 56 Z"/>'
 '<circle cx="210" cy="26" r="3" fill="#0B1C2C"/></g>')
body+='<g fill="#9FD3E6" opacity="0.5"><circle cx="246" cy="50" r="3"/><circle cx="256" cy="40" r="2.2"/><circle cx="262" cy="30" r="1.6"/></g>'
# small calf
body+='<g transform="translate(150,150) scale(0.5)" fill="#3C6A86"><path d="M0 30 C 60 -2, 180 -6, 236 26 C 250 14, 268 12, 280 4 C 272 22, 274 34, 286 44 C 270 40, 252 42, 240 50 C 180 70, 60 64, 0 30 Z"/></g>'
ART[k]=wrap(k,body,defs)

# deep sea anglerfish
k="deepsea"
defs=lg(k,"w",[("0","#0A2540"),("0.6","#04111F"),("1","#01060D")]) + rg(k,"lure",[("0","#FFF6C0"),("1","#FFD23F")],cx="50%",cy="50%",r="50%")
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")
body+='<g opacity="0.7" fill="#7FE0D0">'+''.join('<circle cx="%d" cy="%d" r="%s"/>'%(20+i*43%300, 30+(i*57)%150, 1.2+ (i%3)*0.6) for i in range(14))+'</g>'
body+='<g transform="translate(120,120)">'
body+='<path d="M0 0 C 30 -34, 110 -30, 120 0 C 110 30, 30 34, 0 0 Z" fill="#16202B"/>'
body+='<path d="M30 12 q 20 10 60 6 l -6 -8 6 -8 q -40 -4 -60 6 Z" fill="#0C141C"/>' # jaw with teeth gap
for tx in range(30,92,10):
    body+='<path d="M%d 8 l3 8 3 -8 Z" fill="#DCEBF2"/>'%tx
body+='<path d="M16 -10 q -10 -40 18 -46" stroke="#9FB6C4" stroke-width="2.5" fill="none"/>'
body+='<circle cx="34" cy="-56" r="9" fill="%s"/>'%U(k,"lure")
body+='<circle cx="22" cy="-6" r="4" fill="#FFFFFF"/><circle cx="22" cy="-6" r="1.8" fill="#0B1C2C"/></g>'
ART[k]=wrap(k,body,defs)

# plankton / microscope view
k="plankton"
defs=rg(k,"w",[("0","#1F8FA8"),("1","#0A3A52")],cx="50%",cy="50%",r="75%")
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")
# diatoms & copepod
body+='<g opacity="0.95">'
body+='<circle cx="80" cy="80" r="26" fill="none" stroke="#CFF3FB" stroke-width="3"/>'+ "".join('<line x1="80" y1="80" x2="%0.1f" y2="%0.1f" stroke="#CFF3FB" stroke-width="1.4" opacity="0.7"/>'%(80+26*math.cos(t),80+26*math.sin(t)) for t in [i*math.pi/6 for i in range(12)])
body+='<rect x="180" y="60" width="60" height="26" rx="13" fill="none" stroke="#A9E1EF" stroke-width="3"/>'+"".join('<line x1="%d" y1="60" x2="%d" y2="86" stroke="#A9E1EF" stroke-width="1.2" opacity="0.7"/>'%(190+i*10,190+i*10) for i in range(5))
# triangle diatom
body+='<polygon points="150,150 180,150 165,124" fill="none" stroke="#CFF3FB" stroke-width="3"/>'
# copepod
body+='<g transform="translate(240,150)"><ellipse cx="0" cy="0" rx="16" ry="10" fill="#9FE0CF" opacity="0.9"/><path d="M14 0 q 16 -2 26 -10 M14 0 q 16 2 26 10" stroke="#9FE0CF" stroke-width="2" fill="none"/><circle cx="-6" cy="-2" r="2" fill="#0B2C3A"/></g>'
body+='</g>'
ART[k]=wrap(k,body,defs)

# mangrove
k="mangrove"
defs=lg(k,"sky",[("0","#CFEAF2"),("1","#8FD0E0")])+lg(k,"sea",[("0","#2A93B6"),("1","#0C3A52")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"sky")
body+='<rect y="120" width="320" height="80" fill="%s"/>'%U(k,"sea")
# foliage
body+='<ellipse cx="120" cy="70" rx="120" ry="42" fill="#2C9E78"/>'
body+='<ellipse cx="240" cy="84" rx="90" ry="34" fill="#36C58E" opacity="0.9"/>'
# trunks + prop roots
for tx in (90,150,210):
    body+='<rect x="%d" y="84" width="8" height="44" fill="#5A3B2A"/>'%tx
    for dx in (-18,-8,8,18):
        body+='<path d="M%d 120 Q %d 110 %d 100" stroke="#6B452F" stroke-width="5" fill="none"/>'%(tx+4+dx, tx+4+dx*0.4, tx+4)
body+='<path d="M0 132 q 40 -8 80 0 t 80 0 t 80 0 t 80 0" stroke="#7CC9E0" stroke-width="2.5" fill="none" opacity="0.6"/>'
body+=fish(120,170,0.6,"#FFC83D")+fish(220,178,0.5,"#A9E1EF",flip=True)
ART[k]=wrap(k,body,defs)

# tidepool
k="tidepool"
defs=lg(k,"w",[("0","#7FC9DE"),("1","#2A7FA0")]) + lg(k,"rock",[("0","#3A5A6C"),("1","#22414F")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"rock")
body+='<ellipse cx="160" cy="120" rx="130" ry="64" fill="%s"/>'%U(k,"w")
body+='<ellipse cx="160" cy="116" rx="130" ry="60" fill="none" stroke="#9FE6F2" stroke-width="2" opacity="0.6"/>'
# sea star
body+='<g transform="translate(96,120)">'+ "".join('<path d="M0 0 L %0.1f %0.1f"/>'%(0,0) for _ in [0])
star=""
for i in range(5):
    a=-math.pi/2+i*2*math.pi/5
    a2=a+math.pi/5
    star+='%0.1f,%0.1f %0.1f,%0.1f '%(20*math.cos(a),20*math.sin(a), 8*math.cos(a2),8*math.sin(a2))
body+='<polygon points="%s" fill="#FF7A66"/>'%star
body+='<circle cx="0" cy="0" r="4" fill="#F2A65A"/></g>'
# anemone + snail
body+='<g transform="translate(210,134)">'+"".join('<line x1="0" y1="0" x2="%0.1f" y2="%0.1f" stroke="#36C58E" stroke-width="3"/>'%(14*math.cos(t),-abs(14*math.sin(t))) for t in [i*math.pi/8 for i in range(9)])+'<ellipse cx="0" cy="2" rx="12" ry="6" fill="#2C9E78"/></g>'
body+='<g transform="translate(150,150)"><path d="M0 0 a 10 10 0 1 0 0.1 0 z" fill="#E6C786"/><path d="M0 0 a 6 6 0 1 0 0.1 0 z" fill="#D2A85E"/></g>'
ART[k]=wrap(k,body,defs)

# seahorse
k="seahorse"
defs=lg(k,"w",[("0","#1C82A6"),("1","#06283F")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,3,0,op=0.08)
# seagrass
for x in (40,60,80,250,270,290):
    body+='<path d="M%d 200 q 6 -50 0 -90" stroke="#36C58E" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>'%x
body+='<g transform="translate(150,60)" fill="#FFC83D">'
body+='<path d="M0 0 q 18 4 16 26 q -2 18 -16 24 q -16 6 -16 24 q 0 18 14 24 q 10 4 8 14 q -10 -2 -16 -8 q -14 -12 -10 -34 q 2 -16 14 -22 q -12 -8 -10 -26 q 2 -16 10 -22 q -8 -8 -2 -18 q 6 -6 18 -6 Z"/>'
body+='<circle cx="6" cy="-2" r="2" fill="#0B1C2C"/>'
body+='<path d="M-2 -8 q 8 -8 16 -4" stroke="#F2A65A" stroke-width="3" fill="none"/>'
body+='</g>'
ART[k]=wrap(k,body,defs)

# manta ray
k="ray"
defs=lg(k,"w",[("0","#1E8FB6"),("0.7","#0C4A66"),("1","#05203A")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")+rays(k,4,0,op=0.07)
body+='<g transform="translate(160,96)" fill="#234E63">'
body+='<path d="M0 -10 C -70 -34, -120 8, -150 -2 C -120 18, -70 22, 0 30 C 70 22, 120 18, 150 -2 C 120 8, 70 -34, 0 -10 Z"/>'
body+='<path d="M-20 -16 q -16 -10 -26 -2 M20 -16 q 16 -10 26 -2" stroke="#16323F" stroke-width="6" fill="none" stroke-linecap="round"/>' # cephalic fins
body+='<path d="M0 28 q -4 40 -2 60" stroke="#234E63" stroke-width="4" fill="none"/>'
body+='</g>'
body+='<g opacity="0.85">'+fish(60,150,0.5,"#A9E1EF")+fish(76,158,0.5,"#A9E1EF")+'</g>'
ART[k]=wrap(k,body,defs)

# research / methods
k="research"
defs=lg(k,"sky",[("0","#CDEAF3"),("1","#8FCBDD")])+lg(k,"sea",[("0","#2A8FB2"),("1","#0A2A47")])
body='<rect width="320" height="200" fill="%s"/>'%U(k,"sky")
body+='<circle cx="60" cy="50" r="22" fill="#FFE9A8"/>'
body+='<path d="M0 118 Q 80 104 160 118 T 320 118 L 320 200 L 0 200 Z" fill="%s"/>'%U(k,"sea")
# boat
body+='<g transform="translate(150,96)">'
body+='<path d="M-60 22 L60 22 L46 44 L-46 44 Z" fill="#E7EEF2"/>'
body+='<rect x="-30" y="2" width="44" height="22" fill="#C9D6DD"/>'
body+='<rect x="-24" y="6" width="10" height="10" fill="#3FA7C9"/>'
body+='<rect x="-2" y="-14" width="6" height="18" fill="#9FB0B8"/>'
body+='<rect x="20" y="8" width="6" height="16" fill="#FF7A66"/>'
body+='</g>'
body+='<path d="M0 140 q 40 -10 80 0 t 80 0 t 80 0 t 80 0" stroke="#7CC9E0" stroke-width="2.5" fill="none" opacity="0.6"/>'
body+=fish(120,176,0.6,"#0E2230")
ART[k]=wrap(k,body,defs)

# conservation
k="conservation"
defs=lg(k,"w",[("0","#2A93B6"),("1","#0A2A47")]) + rg(k,"sun",[("0","#FFF3CE"),("1","#FFDD87")],cx="50%",cy="30%",r="30%")
body='<rect width="320" height="200" fill="%s"/>'%U(k,"w")
body+='<circle cx="160" cy="60" r="40" fill="%s" opacity="0.9"/>'%U(k,"sun")
body+='<path d="M160 150 c -26 -18 -46 -32 -46 -54 a 24 24 0 0 1 46 -10 a 24 24 0 0 1 46 10 c 0 22 -20 36 -46 54 Z" fill="#FF7A66" opacity="0.92"/>'
body+='<path d="M150 96 q 10 8 20 0" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.6"/>'
body+='<path d="M0 168 q 40 -12 80 0 t 80 0 t 80 0 t 80 0" stroke="#A9E1EF" stroke-width="3" fill="none" opacity="0.6"/>'
body+='<path d="M0 186 q 40 -12 80 0 t 80 0 t 80 0 t 80 0" stroke="#7CC9E0" stroke-width="3" fill="none" opacity="0.5"/>'
ART[k]=wrap(k,body,defs)

print("heroes:", sum(1 for k in ART))

# ---------- SHELLS (square 0 0 120 120) ----------
def shell_bg(k):
    return rg(k,"bg",[("0","#F3FAFC"),("1","#DCEFF4")],cx="50%",cy="45%",r="62%")
def spiral_path(cx,cy,turns,a0,growth,start_r,steps=120):
    pts=[]
    for i in range(steps+1):
        t=i/steps*turns*2*math.pi
        r=start_r*math.exp(growth*t)
        x=cx+math.cos(t+a0)*r
        y=cy+math.sin(t+a0)*r
        pts.append((x,y))
    return pts
def poly(points, fill, stroke=None, sw=2, op=1, extra=""):
    p="M"+" L".join("%0.1f %0.1f"%(x,y) for x,y in points)
    s='<path d="%s Z" fill="%s" opacity="%s"'%(p,fill,op)
    if stroke: s+=' stroke="%s" stroke-width="%s"'%(stroke,sw)
    s+=' %s/>'%extra
    return s

def gastropod(k, body_fill, line, aperture=True, ribs=8, tall=False):
    defs=shell_bg(k)+rg(k,"b",[("0",body_fill),("1",line)],cx="42%",cy="40%",r="60%")
    cx,cy=(56,66) if not tall else (58,58)
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    # outer body whorl
    growth=0.30 if not tall else 0.22
    turns=2.6 if not tall else 3.4
    outer=spiral_path(cx,cy,turns,0,growth,3.0)
    # build a teardrop body by drawing a thick spiral via two offset spirals
    inner=spiral_path(cx,cy,turns,0,growth,3.0)
    # main shape: large rounded body
    if not tall:
        g+='<path d="M%d %d Q 104 30 86 70 Q 74 102 40 100 Q 8 96 14 60 Q 20 30 56 30 Z" fill="%s" stroke="%s" stroke-width="2.5"/>'%(56,30,U(k,"b"),line)
        # spire (top spiral)
        sp=spiral_path(70,44,2.4,-1.6,0.26,2.2)
        g+='<path d="M%s" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round"/>'%(" L".join("%0.1f %0.1f"%(x,y) for x,y in sp), line)
        # aperture
        if aperture:
            g+='<path d="M44 96 Q 30 80 40 60 Q 50 74 50 92 Z" fill="#F7ECD6" stroke="%s" stroke-width="1.5"/>'%line
        # ribs
        for i in range(ribs):
            t=i/(ribs-1)
            g+='<path d="M%0.1f %0.1f Q %0.1f %0.1f %0.1f %0.1f" stroke="%s" stroke-width="1.3" fill="none" opacity="0.5"/>'%(
                26+t*54, 34+t*8, 50+t*30, 64, 40+t*50, 96, line)
    else:
        # tall auger/whelk: long tapering spiral
        sp=spiral_path(60,40,4.2,-1.6,0.20,2.0)
        g+='<path d="M58 14 Q 92 40 78 84 Q 70 108 54 106 Q 30 104 36 72 Q 42 40 58 18 Z" fill="%s" stroke="%s" stroke-width="2.5"/>'%(U(k,"b"),line)
        for i in range(10):
            yy=20+i*9
            g+='<path d="M%0.1f %0.1f Q 60 %0.1f %0.1f %0.1f" stroke="%s" stroke-width="1.3" fill="none" opacity="0.55"/>'%(
                44-i*0.6, yy, yy+4, 76-i*1.0, yy+2, line)
    return wrap(k, g, defs, vb="0 0 120 120")

def bivalve_fan(k, fill, line, ribs=12, heart=False):
    defs=shell_bg(k)+rg(k,"b",[("0",fill),("1",line)],cx="50%",cy="20%",r="80%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    # fan shape
    g+='<path d="M60 96 L18 50 Q 60 18 102 50 Z" fill="%s" stroke="%s" stroke-width="2.5"/>'%(U(k,"b"),line)
    # hinge ears
    g+='<path d="M18 50 q -8 -2 -10 6 q 10 2 14 -2 Z" fill="%s"/>'%fill
    g+='<path d="M102 50 q 8 -2 10 6 q -10 2 -14 -2 Z" fill="%s"/>'%fill
    # ribs (fanning)
    for i in range(ribs+1):
        t=i/ribs
        x=18+t*84
        g+='<path d="M60 96 L %0.1f %0.1f" stroke="%s" stroke-width="1.3" opacity="0.55"/>'%(x, 50-(0 if (t<0.05 or t>0.95) else 6*math.sin(t*math.pi)) , line)
    g+='<circle cx="60" cy="92" r="3" fill="%s"/>'%line
    return wrap(k,g,defs,vb="0 0 120 120")

def nautilus(k):
    defs=shell_bg(k)+rg(k,"b",[("0","#F6EAD2"),("1","#C98A4E")],cx="60%",cy="55%",r="60%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<path d="M60 18 A 42 42 0 1 1 26 78 A 30 30 0 1 0 60 50 Z" fill="%s" stroke="#9A5E2A" stroke-width="2.5"/>'%U(k,"b")
    # chambers
    for i in range(10):
        a=math.radians(20+i*30)
        g+='<path d="M60 60 L %0.1f %0.1f" stroke="#B5762F" stroke-width="1.4" opacity="0.7"/>'%(60+44*math.cos(a),60+44*math.sin(a))
    return wrap(k,g,defs,vb="0 0 120 120")

def sanddollar(k):
    defs=shell_bg(k)+rg(k,"b",[("0","#EFE7D4"),("1","#CDBE9C")],cx="50%",cy="45%",r="60%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<circle cx="60" cy="60" r="40" fill="%s" stroke="#B6A684" stroke-width="2"/>'%U(k,"b")
    for i in range(5):
        a=-math.pi/2+i*2*math.pi/5
        x=60+math.cos(a)*16; y=60+math.sin(a)*16
        g+='<ellipse cx="%0.1f" cy="%0.1f" rx="5" ry="14" fill="#C7B690" transform="rotate(%0.1f %0.1f %0.1f)"/>'%(x,y,math.degrees(a)+90,x,y)
    g+='<circle cx="60" cy="60" r="4" fill="#B6A684"/>'
    return wrap(k,g,defs,vb="0 0 120 120")

def mussel(k, fill="#3A4A8C", line="#22306A"):
    defs=shell_bg(k)+rg(k,"b",[("0",fill),("1",line)],cx="40%",cy="30%",r="80%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<path d="M34 92 Q 30 40 64 24 Q 96 40 86 74 Q 76 98 50 98 Z" fill="%s" stroke="%s" stroke-width="2.5"/>'%(U(k,"b"),line)
    g+='<path d="M40 86 Q 44 50 64 34" stroke="#6E7CC0" stroke-width="2" fill="none" opacity="0.6"/>'
    return wrap(k,g,defs,vb="0 0 120 120")

def razor(k):
    defs=shell_bg(k)+lg(k,"b",[("0","#E8DBBF"),("1","#B79A66")],0,0,1,1)
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<path d="M28 96 L84 30 Q 96 24 92 36 L40 100 Q 26 106 28 96 Z" fill="%s" stroke="#8E7340" stroke-width="2"/>'%U(k,"b")
    g+='<path d="M34 92 L86 32" stroke="#8E7340" stroke-width="1.2" opacity="0.5"/>'
    return wrap(k,g,defs,vb="0 0 120 120")

def limpet(k):
    defs=shell_bg(k)+rg(k,"b",[("0","#E9D9B6"),("1","#A98A56")],cx="50%",cy="20%",r="80%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<path d="M22 84 Q 60 24 98 84 Z" fill="%s" stroke="#8E7340" stroke-width="2"/>'%U(k,"b")
    for i in range(9):
        t=i/8; x=22+t*76
        g+='<path d="M60 30 L %0.1f 84" stroke="#8E7340" stroke-width="1.1" opacity="0.5"/>'%x
    return wrap(k,g,defs,vb="0 0 120 120")

def cowrie(k):
    defs=shell_bg(k)+rg(k,"b",[("0","#F2D9C0"),("1","#B98A66")],cx="40%",cy="35%",r="70%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<ellipse cx="60" cy="60" rx="30" ry="40" fill="%s" stroke="#9A6A48" stroke-width="2"/>'%U(k,"b")
    g+='<path d="M60 22 Q 64 60 60 98" stroke="#9A6A48" stroke-width="2.5" fill="none"/>'
    for yy in range(30,92,8):
        g+='<path d="M58 %d l4 0" stroke="#9A6A48" stroke-width="1.4"/>'%yy
    g+='<ellipse cx="60" cy="60" rx="30" ry="40" fill="#FFFFFF" opacity="0.12"/>'
    return wrap(k,g,defs,vb="0 0 120 120")

def murex(k):
    defs=shell_bg(k)+rg(k,"b",[("0","#F7EFE0"),("1","#C9A06A")],cx="45%",cy="40%",r="60%")
    g='<rect width="120" height="120" fill="%s"/>'%U(k,"bg")
    g+='<path d="M60 26 Q 92 44 80 78 Q 70 102 48 100 Q 22 96 30 64 Q 36 36 60 30 Z" fill="%s" stroke="#9A6A2E" stroke-width="2.5"/>'%U(k,"b")
    # spines
    for a in range(0,360,36):
        rad=math.radians(a)
        x=56+math.cos(rad)*30; y=64+math.sin(rad)*30
        x2=56+math.cos(rad)*42; y2=64+math.sin(rad)*42
        g+='<path d="M%0.1f %0.1f L %0.1f %0.1f" stroke="#9A6A2E" stroke-width="3" stroke-linecap="round"/>'%(x,y,x2,y2)
    g+='<path d="M48 96 Q 36 82 44 66 Q 52 78 52 94 Z" fill="#F7ECD6" stroke="#9A6A2E" stroke-width="1.2"/>'
    return wrap(k,g,defs,vb="0 0 120 120")

# build shells
ART["whelk"]=gastropod("whelk","#F4E7CB","#B98E54",ribs=9)
ART["conch"]=gastropod("conch","#FBE6D2","#E08A6A",ribs=8)
ART["moonsnail"]=gastropod("moonsnail","#E9E2D2","#9C8E72",ribs=6)
ART["olive"]=gastropod("olive","#EDE3C9","#8C7A52",ribs=4,tall=True)
ART["auger"]=gastropod("auger","#EAD9BB","#9A7A46",tall=True)
ART["periwinkle"]=gastropod("periwinkle","#D9C7A8","#7C6A48",ribs=5)
ART["tulip"]=gastropod("tulip","#F6E2CE","#C77A52",ribs=7,tall=True)
ART["turban"]=gastropod("turban","#E7EBD6","#7E8A5A",ribs=6)
ART["scallop"]=bivalve_fan("scallop","#F3C9A6","#D98A5E",ribs=14)
ART["cockle"]=bivalve_fan("cockle","#F0D9BE","#C79A66",ribs=16,heart=True)
ART["oyster"]=bivalve_fan("oyster","#DAD3C2","#9A8E72",ribs=8)
ART["jingle"]=bivalve_fan("jingle","#E9D9B0","#C2A24E",ribs=6)
ART["nautilus"]=nautilus("nautilus")
ART["sanddollar"]=sanddollar("sanddollar")
ART["mussel"]=mussel("mussel")
ART["razor"]=razor("razor")
ART["limpet"]=limpet("limpet")
ART["cowrie"]=cowrie("cowrie")
ART["murex"]=murex("murex")

print("total art keys:", len(ART))

# write JS data file
with open("/home/claude/sea/seahype-art.js","w",encoding="utf-8") as f:
    f.write("window.SEA_ART = "+json.dumps(ART)+";\n")

# contact sheet for QA
keys=list(ART.keys())
cols=6
cw=160; ch=100
import math as M
rows=M.ceil(len(keys)/cols)
sheet='<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d">'%(cols*cw, rows*ch+0)
sheet+='<rect width="100%%" height="100%%" fill="#0A2A47"/>'
for i,key in enumerate(keys):
    r=i//cols; c=i%cols
    x=c*cw; y=r*ch
    inner=ART[key].replace('width="100%" height="100%"','width="%d" height="%d"'%(cw-12,ch-22)).replace('<svg ','<svg x="%d" y="%d" '%(x+6,y+4),1)
    sheet+=inner
    sheet+='<text x="%d" y="%d" fill="#CFE8F2" font-family="monospace" font-size="10">%s</text>'%(x+8,y+ch-4,key)
sheet+='</svg>'
open("/tmp/contact.svg","w").write(sheet)
import cairosvg
cairosvg.svg2png(bytestring=sheet.encode(),write_to="/tmp/contact.png",output_width=cols*cw,output_height=rows*ch)
print("contact sheet written; rows",rows)
