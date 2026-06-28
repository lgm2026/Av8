# -*- coding: utf-8 -*-
import random
import data_constellations, data_stars, data_solarsystem, data_deepsky, data_missions, data_supplement

def all_entries():
    e = (data_constellations.build() + data_stars.build() + data_solarsystem.build()
         + data_deepsky.build() + data_missions.build() + data_supplement.build())
    return e

# ---- normalise mission & telescope "hab" into a quizzable destination realm ----
def mission_realm(group):
    g = group.lower()
    if "moon" in g: return "the Moon"
    if "mars" in g: return "Mars"
    if "titan" in g or "saturn" in g: return "the Saturn system"
    if "jupiter" in g: return "the Jupiter system"
    if "mercury" in g: return "Mercury"
    if "venus" in g: return "Venus"
    if "comet" in g: return "a comet"
    if "asteroid" in g or "trojan" in g: return "an asteroid"
    if "solar" in g or "sun" in g: return "near the Sun"
    if "interstellar" in g: return "interstellar space"
    if "planet-hunting" in g or "astrometry" in g: return "Earth orbit"
    if "station" in g or "satellite" in g or "reusable" in g or "crewed spacecraft" in g: return "Earth orbit"
    if "defence" in g or "defense" in g: return "an asteroid"
    return "the inner Solar System"

def telescope_realm(group):
    g = group.lower()
    if "space telescope" in g: return "orbit, above Earth's atmosphere"
    return "an observatory on Earth"

# domains and their location distractor pools
DOMAIN_POOLS = {
 "sky": ["the northern sky","the southern sky","the zodiac","the constellation Orion",
         "the constellation Sagittarius","the constellation Cygnus","the constellation Taurus",
         "the Milky Way's band","near the Southern Cross"],
 "galactic": ["our Milky Way galaxy","deep space beyond the Milky Way","the distant universe",
              "the center of our Solar System","a nearby galaxy","the halo of the Milky Way"],
 "solar": ["the inner Solar System","the outer Solar System","the asteroid belt","the Kuiper Belt",
           "Earth's night sky","beyond the Solar System","orbit around a giant planet"],
 "moon": ["orbit around Jupiter","orbit around Saturn","orbit around Earth","orbit around Mars",
          "orbit around Neptune","orbit around Uranus","orbit around Pluto"],
 "mission": ["the Moon","Mars","Earth orbit","the outer Solar System","an asteroid","near the Sun",
             "the Saturn system","interstellar space","the Jupiter system","Venus"],
 "telescope": ["orbit, above Earth's atmosphere","an observatory on Earth","a mountaintop in Chile",
               "the radio sky","a desert array","the south pole"],
}

def domain_of(e):
    c = e["cat"]
    if c in ("constellation","nebula","star cluster"): return "sky"
    if c in ("star","galaxy","black hole","quasar","pulsar","supernova remnant","exoplanet","exoplanet system"): return "galactic"
    if c == "moon": return "moon"
    if c == "spacecraft": return "mission"
    if c == "telescope": return "telescope"
    return "solar"  # planet, dwarf planet, asteroid, comet, meteor shower, sun

# display category pool for the "classified as a kind of" question
CAT_DISPLAY = ["constellation","star","planet","dwarf planet","asteroid","comet","moon","galaxy",
               "nebula","star cluster","spacecraft","telescope","black hole","pulsar","quasar",
               "exoplanet","meteor shower","supernova remnant"]

def cat_label(c):
    return c  # already friendly

def pick_distractors(answer, pool, rng, n=3):
    opts = [x for x in pool if x != answer]
    rng.shuffle(opts)
    chosen = opts[:n]
    # guard: ensure n distinct
    i = 0
    extra = [x for x in pool if x != answer and x not in chosen]
    while len(chosen) < n and extra:
        chosen.append(extra.pop()); 
    return chosen

def make_choices(answer, distractors, rng):
    arr = distractors + [answer]
    rng.shuffle(arr)
    return arr, arr.index(answer)

def build():
    entries = all_entries()
    lessons = {}
    queries = {}
    meta = {}
    for e in entries:
        eid = e["id"]
        rng = random.Random("astro::"+eid)
        # normalise habitat for missions/telescopes
        hab = e["hab"]
        if e["cat"] == "spacecraft":
            hab = mission_realm(e["group"])
        elif e["cat"] == "telescope":
            hab = telescope_realm(e["group"])
        dom = domain_of(e)

        # ---- explain text ----
        sci = e["sci"]
        # "Astronomers catalog it as ..." style second sentence, varies a touch
        if e["cat"] == "spacecraft":
            id_sentence = "It is remembered in the records of space exploration as " + name_for_record(e) + "."
            explain0 = e["name"] + " is a " + e["group"] + ", best known for exploring " + hab + ". " + e["flavor"]
        elif e["cat"] == "telescope":
            explain0 = e["name"] + " is a " + e["group"] + ", working from " + hab + ". " + e["flavor"]
        elif e["cat"] == "constellation":
            explain0 = e["name"] + " is a " + e["group"] + " in " + hab + ". " + e["flavor"]
        elif e["cat"] == "moon":
            explain0 = e["name"] + " is a " + e["group"] + ", in " + hab + ". Astronomers know it as " + sci.split(" (")[0] + ". " + e["flavor"]
        else:
            explain0 = e["name"] + " is a " + e["group"] + ", found in " + hab + ". Astronomers know it as " + sci.split(" (")[0] + ". " + e["flavor"]
        explain1 = e["trait"]

        # ---- quiz ----
        # q1: where
        loc_pool = DOMAIN_POOLS[dom]
        loc_d = pick_distractors(hab, loc_pool, rng, 3)
        loc_choices, loc_ans = make_choices(hab, loc_d, rng)
        q1 = {"type":"mc","q":"Where would you find " + e["name"] + "?","choices":loc_choices,"answer":loc_ans,
              "why":e["name"] + " is found in " + hab + "."}
        # q2: category
        cat_d = pick_distractors(e["cat"], CAT_DISPLAY, rng, 3)
        cat_choices, cat_ans = make_choices(cat_label(e["cat"]), [cat_label(x) for x in cat_d], rng)
        q2 = {"type":"mc","q":e["name"] + " is classified as a kind of:","choices":cat_choices,"answer":cat_ans,
              "why":e["name"] + " is a " + e["cat"] + "."}
        # q3: trait true/false
        q3 = {"type":"tf","q":e["trait"],"answer":True,"why":"True - that's a real feature of " + e["name"] + "."}

        terms = []
        if e.get("termA"): terms.append(e["termA"])
        if e.get("termB"): terms.append(e["termB"])

        lessons[eid] = {
            "title": e["name"],
            "track": e["track"],
            "level": "Core",
            "src": src_for(e),
            "time": 3,
            "explain": [explain0, explain1],
            "terms": terms,
            "art": e["art"],
            "sources": sources_for(e),
            "quiz": [q1, q2, q3],
        }
        queries[eid] = e["sci"]
        meta[eid] = {
            "name": e["name"], "cat": e["cat"], "group": e["group"],
            "hab": hab, "habKey": e["habKey"], "art": e["art"], "trait": e["trait"],
        }
    return lessons, queries, meta, entries

def name_for_record(e):
    return e["name"]

# ---- source attribution per category ----
def src_for(e):
    c = e["cat"]
    if c == "constellation": return "iau"
    if c in ("star","galaxy","nebula","star cluster","black hole","quasar","pulsar","supernova remnant"): return "esahubble"
    if c in ("exoplanet","exoplanet system"): return "nasaexo"
    if c == "spacecraft": return "nasa"
    if c == "telescope": return "nasa"
    if c == "meteor shower": return "amsmeteors"
    return "nasaplanets"  # planets, moons, dwarf planets, asteroids, comets

def sources_for(e):
    from gen_sources import SRC
    a = src_for(e)
    # second source for variety
    second = {
      "iau":"esahubble","esahubble":"nasa","nasaexo":"nasa","nasa":"esahubble",
      "amsmeteors":"nasaplanets","nasaplanets":"jpl",
    }.get(a,"nasa")
    out=[]
    for k in (a, second):
        if k in SRC:
            out.append({"label":SRC[k]["label"],"url":SRC[k]["url"]})
    return out

# ---- group entries into units of ~7 for the roadmap ----
def build_units():
    entries = all_entries()
    # title plans per category sequence
    plan = []
    def chunk(lst, size): 
        return [lst[i:i+size] for i in range(0,len(lst),size)]

    def add_group(items, base_title, subtitle, track, level="Core"):
        ck = chunk(items, 7)
        for idx, c in enumerate(ck):
            roman = idx+1
            plan.append({
                "id": "u-"+items[0]["id"][:6]+"-"+str(roman),
                "title": base_title + (" " + roman_num(roman) if len(ck)>1 else ""),
                "subtitle": subtitle,
                "track": track, "level": level,
                "ids": [x["id"] for x in c]
            })

    by = {}
    # split entries by a finer grouping for nice unit titles
    cons = [e for e in entries if e["cat"]=="constellation"]
    # split constellations: zodiac, northern, southern
    zod = [e for e in cons if e["habKey"]=="zodiac"]
    north = [e for e in cons if e["habKey"]=="northsky"]
    south = [e for e in cons if e["habKey"]=="southsky"]
    add_group(zod, "Constellations of the Zodiac", "The star patterns the Sun travels through", "fauna")
    add_group(north, "Northern Constellations", "Star patterns of the northern sky", "fauna")
    add_group(south, "Southern Constellations", "Star patterns of the southern sky", "fauna")

    stars = [e for e in entries if e["cat"]=="star"]
    add_group(stars, "Bright Stars", "Famous stars and how to find them", "fauna")

    planets = [e for e in entries if e["cat"] in ("planet","dwarf planet")]
    add_group(planets, "Planets & Dwarf Planets", "The worlds that orbit our Sun", "flora")
    moons = [e for e in entries if e["cat"]=="moon"]
    add_group(moons, "Moons & Worlds", "Natural satellites across the Solar System", "flora")
    smalls = [e for e in entries if e["cat"] in ("asteroid","comet","meteor shower")]
    add_group(smalls, "Asteroids, Comets & Showers", "The small, icy and rocky wanderers", "flora")

    gal = [e for e in entries if e["cat"]=="galaxy"]
    add_group(gal, "Galaxies", "Island universes beyond our own", "geology")
    neb = [e for e in entries if e["cat"]=="nebula"]
    add_group(neb, "Nebulae", "The glowing clouds where stars live and die", "geology")
    clu = [e for e in entries if e["cat"]=="star cluster"]
    add_group(clu, "Star Clusters", "Families of stars born together", "geology")

    crew = [e for e in entries if e["cat"]=="spacecraft"]
    add_group(crew, "Missions & Spacecraft", "Robots and crews that explore space", "conservation")
    tel = [e for e in entries if e["cat"]=="telescope"]
    add_group(tel, "Telescopes & Observatories", "The great eyes on the universe", "conservation")

    exo = [e for e in entries if e["cat"] in ("black hole","pulsar","quasar","supernova remnant","exoplanet","exoplanet system")]
    add_group(exo, "Exotic Objects & Exoplanets", "Black holes, pulsars and other worlds", "habitats")
    return plan

ROMAN = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"]
def roman_num(n): return ROMAN[n] if n < len(ROMAN) else str(n)

if __name__ == "__main__":
    lessons, queries, meta, entries = build()
    print("entry lessons:", len(lessons))
    units = build_units()
    print("units:", len(units))
    covered = sum(len(u["ids"]) for u in units)
    print("ids covered by units:", covered)
    # sample
    import json
    k = "jupiter"
    print(json.dumps(lessons[k], ensure_ascii=False, indent=1)[:1400])
